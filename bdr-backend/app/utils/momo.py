# app/utils/momo.py
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Safe import — never crashes
try:
    from app.core.config import settings
except Exception:
    settings = None


async def initiate_momo_payment(
    amount: int,
    phone: str,
    project_id: int,
    external_id: str = None,
    payer_message: str = "BDR: Create 1 job for Rwanda",
    payee_note: str = "Thank you for backing youth jobs"
) -> Dict[str, Any]:
    """
    SAFE DEV MODE — Always returns success
    When you're ready for real MoMo, just add your keys and remove the fake return
    """
    logger.info(f"[DEV MODE] MoMo payment: {amount} RWF from {phone} → Project {project_id}")

    # This is your current working behavior — 100% safe
    return {
        "success": True,
        "reference_id": f"momo_dev_{external_id or project_id}_{amount}",
        "financialTransactionId": f"dev_momo_{project_id}",
        "status": "SUCCESS",
        "message": "Payment successful (development mode)"
    }


def verify_webhook_signature(payload: bytes, signature: str, api_key: str = None) -> bool:
    """Fake verification — always True in dev"""
    logger.info("MoMo webhook received (dev mode — signature accepted)")
    return True