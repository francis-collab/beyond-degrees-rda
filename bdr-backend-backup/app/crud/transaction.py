"""
BDR – Beyond Degrees Rwanda
CRUD Operations for Transaction

Handles:
- Payment initiation (pending)
- Webhook update (MoMo callback)
- Retrieval (by project, backer)
- Job impact calculation
- Project funding update

Aligned with:
- UML Class Diagram: CRUD → Transaction → Project
- SRS: MoMo Integration, Webhook, Job Impact
- Sequence: Back → MoMo → Webhook → Transaction → Project → Notification
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from ..models.transaction import Transaction, TransactionStatus
from ..models.project import Project, ProjectStatus
from ..models.user import User
from ..models.notification import Notification, NotificationType
from ..schemas.transaction import TransactionCreate
from ..utils.security import calculate_jobs_created
from ..utils.email import send_email
from ..utils.momo import initiate_momo_payment
import logging
import json

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Create Transaction (Payment Request)
# ─────────────────────────────────────────────────────────────────────────────
def create_transaction(
    db: Session,
    transaction_in: TransactionCreate,
    backer_id: int
) -> Transaction:
    """
    Create a pending transaction and initiate MoMo payment.
    Returns transaction with momo_request_id.
    """
    project = db.query(Project).filter(Project.id == transaction_in.project_id).first()
    if not project:
        raise ValueError("Project not found")
    if project.status != ProjectStatus.live:
        raise ValueError("Project is not accepting funds")

    # Calculate jobs
    jobs_to_create = calculate_jobs_created(int(transaction_in.amount))

    # Create transaction
    db_transaction = Transaction(
        amount=transaction_in.amount,
        momo_phone=transaction_in.momo_phone,
        status=TransactionStatus.pending,
        jobs_created=jobs_to_create,
        backer_id=backer_id,
        project_id=project.id
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    # Initiate MoMo payment
    try:
        momo_response = initiate_momo_payment(
            amount=int(transaction_in.amount),
            phone=transaction_in.momo_phone,
            external_id=str(db_transaction.id)
        )
        db_transaction.momo_ref = momo_response.get("financialTransactionId")
        db.commit()
    except Exception as e:
        db_transaction.status = TransactionStatus.failed
        db.commit()
        logger.error(f"MoMo initiation failed for tx {db_transaction.id}: {e}")
        raise ValueError("Payment initiation failed. Try again.")

    # Notify backer
    notif = Notification(
        user_id=backer_id,
        title="Payment Request Sent",
        message=f"Your RWF {transaction_in.amount:,} payment for **{project.title}** is processing. Check your phone.",
        type=NotificationType.payment_confirmed,
        data=json.dumps({"transaction_id": db_transaction.id, "project_id": project.id})
    )
    db.add(notif)
    db.commit()

    logger.info(f"Transaction created: {db_transaction.id} for project {project.id}")
    return db_transaction


# ─────────────────────────────────────────────────────────────────────────────
# Get Transaction by ID
# ─────────────────────────────────────────────────────────────────────────────
def get_transaction_by_id(db: Session, transaction_id: int) -> Optional[Transaction]:
    return db.query(Transaction).filter(Transaction.id == transaction_id).first()


# ─────────────────────────────────────────────────────────────────────────────
# Get Transactions by Project
# ─────────────────────────────────────────────────────────────────────────────
def get_transactions_by_project(
    db: Session,
    project_id: int,
    skip: int = 0,
    limit: int = 20
) -> List[Transaction]:
    return db.query(Transaction)\
        .filter(Transaction.project_id == project_id)\
        .offset(skip)\
        .limit(limit)\
        .all()


# ─────────────────────────────────────────────────────────────────────────────
# Get Transactions by Backer
# ─────────────────────────────────────────────────────────────────────────────
def get_transactions_by_backer(
    db: Session,
    backer_id: int,
    skip: int = 0,
    limit: int = 20
) -> List[Transaction]:
    return db.query(Transaction)\
        .filter(Transaction.backer_id == backer_id)\
        .order_by(Transaction.initiated_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()


# ─────────────────────────────────────────────────────────────────────────────
# Update Transaction from MoMo Webhook
# ─────────────────────────────────────────────────────────────────────────────
def update_transaction_status(
    db: Session,
    external_id: str,
    momo_ref: str,
    status: str,
    amount: Optional[Decimal] = None
) -> Optional[Transaction]:
    """
    Called by MoMo webhook.
    Updates transaction and project funding.
    """
    db_transaction = db.query(Transaction).filter(Transaction.id == int(external_id)).first()
    if not db_transaction:
        logger.warning(f"Transaction not found for external_id: {external_id}")
        return None

    if db_transaction.status != TransactionStatus.pending:
        logger.info(f"Transaction {db_transaction.id} already processed")
        return db_transaction

    project = db_transaction.project
    backer = db_transaction.backer

    if status.upper() == "SUCCESSFUL":
        db_transaction.status = TransactionStatus.completed
        db_transaction.momo_ref = momo_ref
        db_transaction.completed_at = datetime.utcnow()

        # Update project funding
        project.current_funding += db_transaction.amount
        jobs_from_this = project.update_funding(db_transaction.amount)

        # Milestone check
        milestone = None
        if project.progress_percentage >= 25 and project.progress_percentage < 50:
            milestone = 25
        elif project.progress_percentage >= 50 and project.progress_percentage < 75:
            milestone = 50
        elif project.progress_percentage >= 75 and project.progress_percentage < 100:
            milestone = 75
        elif project.progress_percentage >= 100:
            project.status = ProjectStatus.funded
            milestone = 100

        db.commit()
        db.refresh(db_transaction)
        db.refresh(project)

        # Notifications
        # 1. Backer
        notif_backer = Notification(
            user_id=backer.id,
            title="Payment Confirmed!",
            message=f"Your RWF {db_transaction.amount:,} backed **{project.title}** and created {jobs_from_this} job(s)!",
            type=NotificationType.payment_confirmed,
            data=json.dumps({"project_id": project.id, "jobs": jobs_from_this})
        )
        db.add(notif_backer)

        # 2. Entrepreneur
        notif_ent = Notification.create_funding_notification(
            project=project,
            amount=db_transaction.amount,
            jobs=jobs_from_this,
            backer_name=backer.full_name
        )
        notif_ent.user_id = project.entrepreneur_id
        db.add(notif_ent)

        # 3. Milestone
        if milestone:
            notif_milestone = Notification.create_milestone_notification(project, milestone)
            notif_milestone.user_id = project.entrepreneur_id
            db.add(notif_milestone)

        db.commit()

        # Emails
        try:
            send_email(
                to=backer.email,
                subject="Your BDR Payment is Confirmed!",
                template_name="payment_confirmed_backer.html",
                context={"backer": backer, "project": project, "jobs": jobs_from_this}
            )
            send_email(
                to=project.entrepreneur.email,
                subject=f"New Funding: {jobs_from_this} Job(s) Created!",
                template_name="funding_received.html",
                context={"project": project, "backer": backer, "jobs": jobs_from_this}
            )
        except Exception as e:
            logger.warning(f"Email failed: {e}")

        logger.info(f"Transaction {db_transaction.id} completed: {jobs_from_this} jobs")

    else:
        db_transaction.status = TransactionStatus.failed
        db.commit()
        logger.info(f"Transaction {db_transaction.id} failed")

        # Notify backer
        notif = Notification(
            user_id=backer.id,
            title="Payment Failed",
            message=f"Your payment for **{project.title}** failed. Try again.",
            type=NotificationType.payment_failed
        )
        db.add(notif)
        db.commit()

    return db_transaction