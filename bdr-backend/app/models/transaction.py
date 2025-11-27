"""
BDR – Transaction Model
Tracks MoMo payments, job impact, status
"""

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Enum,
    DECIMAL,
)
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
from datetime import datetime
from app.database import Base
import enum


class TransactionStatus(enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    refunded = "refunded"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    amount = Column(DECIMAL(10, 0), nullable=False)  # RWF
    jobs_created = Column(Integer, default=0)

    status = Column(Enum(TransactionStatus), default=TransactionStatus.pending)

    momo_ref = Column(String, unique=True, nullable=True)
    external_id = Column(String, unique=True, index=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    backer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))

    # Relationships
    backer = relationship("User", back_populates="transactions")
    project = relationship("Project", back_populates="transactions")

    @validates("amount")
    def validate_amount(self, key, value):
        if int(value) < 10000:
            raise ValueError("Minimum backing is RWF 10,000")
        return value

    def __repr__(self):
        return f"<Transaction {self.id} {self.status.value}>"
