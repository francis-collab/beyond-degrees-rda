# app/api/v1/admin.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from ...dependencies import get_db, get_current_user
from ...models.user import User, UserRole
from ...models.transaction import Transaction
from ...models.contact_message import ContactMessage
from ...crud import project as crud_project
from ...crud import transaction as crud_transaction
from ...crud import user as crud_user

# THIS IS THE KEY: prefix includes /api/v1/admin
router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])

async def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    total_donated = db.query(func.coalesce(func.sum(Transaction.amount), 0)).scalar() or 0
    total_jobs = int(total_donated // 10000)

    total_messages = 0
    unread_messages = 0
    try:
        total_messages = db.query(ContactMessage).count()
        if hasattr(ContactMessage, 'is_read'):
            unread_messages = db.query(ContactMessage).filter(ContactMessage.is_read == False).count()
        else:
            unread_messages = total_messages  # honest default
    except Exception as e:
        print("ContactMessage stats error:", e)

    return {
        "total_donated_rwf": int(total_donated),
        "total_jobs_created": total_jobs,
        "total_backers": db.query(User).filter(User.role == UserRole.BACKER).count(),
        "total_entrepreneurs": db.query(User).filter(User.role == UserRole.ENTREPRENEUR).count(),
        "total_messages": total_messages,
        "unread_messages": unread_messages,
    }

@router.get("/projects")
def get_projects(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return crud_project.get_projects(db)

@router.get("/transactions")
def get_transactions(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return crud_transaction.get_all_transactions(db)

@router.get("/users")
def get_users(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return crud_user.get_all_users(db)

@router.get("/messages")
def get_messages(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    result = []
    for m in messages:
        msg_data = {
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "message": m.message,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        }
        msg_data["is_read"] = getattr(m, "is_read", False)
        result.append(msg_data)
    return result

# NEW: Mark as read
@router.patch("/messages/{message_id}/read")
def mark_as_read(message_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    if hasattr(msg, 'is_read'):
        msg.is_read = True
        db.commit()
    return {"success": True}