# app/api/v1/transactions.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from uuid import uuid4
from ...dependencies import get_db, get_current_backer
from ...core.config import settings
from ...models.user import User
from ...schemas.transaction import (
    TransactionCreate, TransactionOut, PaymentInitiateResponse, TransactionListOut
)
from ...crud.transaction import create_transaction, update_transaction_status
from ...crud.project import get_project_by_id
from ...utils.momo import initiate_momo_payment
from ...utils.stripe import create_stripe_session

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/", response_model=PaymentInitiateResponse)
async def initiate_payment(
    transaction_in: TransactionCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_backer)
):
    project = get_project_by_id(db, transaction_in.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    external_id = str(uuid4())

    # Create DB record first
    db_transaction = create_transaction(
        db=db,
        transaction_in=transaction_in,
        backer_id=current_user.id,
        external_id=external_id
    )

    jobs = (transaction_in.amount // settings.JOB_CREATION_RATE)

    try:
        if transaction_in.payment_method == "momo":
            result = await initiate_momo_payment(
                amount=transaction_in.amount,
                phone=transaction_in.phone,
                project_id=project.id,
                external_id=external_id
            )
            return PaymentInitiateResponse(
                transaction_id=db_transaction.id,
                momo_request_id=external_id,
                message=result["message"],
                jobs_to_create=jobs
            )

        elif transaction_in.payment_method == "card":
            result = await create_stripe_session(
                project_id=project.id,
                amount_rwf=transaction_in.amount,
                project_title=project.title,
                backer_email=current_user.email
            )
            # Update transaction with Stripe session
            db_transaction.stripe_session_id = result["session_id"]
            db.commit()

            return PaymentInitiateResponse(
                transaction_id=db_transaction.id,
                stripe_checkout_url=result["url"],
                message="Redirecting to secure payment...",
                jobs_to_create=jobs
            )

        elif transaction_in.payment_method == "bank":
            return PaymentInitiateResponse(
                transaction_id=db_transaction.id,
                message="Bank transfer instructions sent to your email",
                jobs_to_create=jobs
            )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))