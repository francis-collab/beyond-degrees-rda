# app/utils/stripe.py
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Safe import — if stripe not installed, no crash
try:
    import stripe
    from app.core.config import settings
    stripe_available = True
except Exception:
    stripe_available = False
    settings = None


async def create_stripe_session(
    project_id: int,
    amount_rwf: int,
    project_title: str,
    backer_email: str = None
) -> Dict[str, Any]:
    """
    SAFE DEV MODE — Always returns fake success URL
    When you're ready, install `pip install stripe` and add real keys
    """
    logger.info(f"[DEV MODE] Stripe checkout: {amount_rwf} RWF → {project_title}")

    # Always return fake success — your frontend expects this
    return {
        "success": True,
        "url": f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')}/payment-success?project={project_id}&amount={amount_rwf}",
        "session_id": f"stripe_dev_{project_id}",
        "message": "Redirecting to success (dev mode)"
    }


def verify_stripe_webhook(payload: bytes, signature: str) -> bool:
    """Always accept in dev mode"""
    logger.info("Stripe webhook received (dev mode — accepted)")
    return True