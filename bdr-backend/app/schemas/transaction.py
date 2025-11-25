"""
BDR – Beyond Degrees Rwanda
Transaction Pydantic Schemas
Pydantic models for:
- Initiating MoMo payment
- Webhook from MoMo
- API responses (detail, list)
- Job impact calculation
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
import re


# ─────────────────────────────────────────────────────────────────────────────
# Transaction Create (Backer Input)
# ─────────────────────────────────────────────────────────────────────────────
class TransactionCreate(BaseModel):
    project_id: int = Field(..., gt=0, example=1)
    amount: Decimal = Field(..., gt=0, description="Must be multiple of 10,000 RWF")
    momo_phone: str = Field(..., example="+250788123456")

    @validator("amount")
    def amount_multiple_of_10000(cls, v):
        if v % Decimal("10000") != 0:
            raise ValueError("Amount must be a multiple of RWF 10,000 (1 job)")
        return v

    @validator("momo_phone")
    def validate_phone(cls, v):
        pattern = r"^\+250[0-9]{9}$|^0[0-9]{9}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid Rwandan phone number. Use +250... or 07...")
        return v


# ─────────────────────────────────────────────────────────────────────────────
# MoMo Webhook Payload
# ─────────────────────────────────────────────────────────────────────────────
class TransactionWebhook(BaseModel):
    financialTransactionId: str = Field(..., alias="financialTransactionId")
    externalId: str = Field(..., alias="externalId")  # Our transaction ID
    amount: str
    currency: str = "RWF"
    payer: dict
    status: str  # "SUCCESSFUL" or "FAILED"
    reason: Optional[str] = None

    class Config:
        populate_by_name = True


# ─────────────────────────────────────────────────────────────────────────────
# Transaction Output (API Response)
# ─────────────────────────────────────────────────────────────────────────────
class TransactionOut(BaseModel):
    id: int
    amount: Decimal
    jobs_created: int
    status: str
    created_at: datetime
    momo_ref: Optional[str]
    project_id: int
    backer_id: int

    # STRING FORWARD REFS
    project: "ProjectListOut"
    backer: "UserOut"

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────────────────────────────────────
# Transaction List (Dashboard)
# ─────────────────────────────────────────────────────────────────────────────
class TransactionListOut(BaseModel):
    id: int
    amount: Decimal
    jobs_created: int
    status: str
    project_title: str
    initiated_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────────────────────────────────────
# Payment Initiation Response
# ─────────────────────────────────────────────────────────────────────────────
class PaymentInitiateResponse(BaseModel):
    transaction_id: int
    momo_request_id: str
    message: str = "Payment request sent to MoMo. Check your phone."
    jobs_to_create: int


# ─────────────────────────────────────────────────────────────────────────────
# Payment Status Response
# ─────────────────────────────────────────────────────────────────────────────
class PaymentStatusResponse(BaseModel):
    status: str
    jobs_created: int
    message: str