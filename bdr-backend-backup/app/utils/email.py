# app/utils/email.py
import logging
from email.message import EmailMessage
import aiosmtplib
from app.core.config import settings

logger = logging.getLogger(__name__)

async def send_contact_email(to_user: str, user_name: str, subject: str, user_message: str):
    # Auto-reply to user
    user_msg = EmailMessage()
    user_msg["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"
    user_msg["To"] = to_user
    user_msg["Subject"] = "We Received Your Message – Beyond Degrees Rwanda"
    user_msg.set_content(f"""
Hi {user_name},

I'm Francis from Beyond Degrees Rwanda.

Thank you for reaching out! We have received your message and will get back to you within 24 hours.

Your message:
"{user_message}"

Best regards,  
Francis Mutabazi  
Founder, Beyond Degrees Rwanda  
francisschooten@gmail.com | +250 787 789 315
""")

    # Notification to Francis
    francis_msg = EmailMessage()
    francis_msg["From"] = f"BDR Contact Form <{settings.EMAIL_FROM}>"
    francis_msg["To"] = "francisschooten@gmail.com"
    francis_msg["Subject"] = f"New Contact: {subject} – {user_name}"
    francis_msg.set_content(f"""
NEW CONTACT FORM SUBMISSION

Name: {user_name}
Email: {to_user}
Subject: {subject}
Message:
{user_message}

Reply directly to: {to_user}
""")

    try:
        await aiosmtplib.send(
            user_msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            start_tls=True,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD
        )
        await aiosmtplib.send(francis_msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            start_tls=True,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD)
        logger.info(f"Contact emails sent to {to_user} and Francis")
    except Exception as e:
        logger.error(f"Failed to send email: {e}")

# ← THIS LINE FIXES EVERYTHING
send_email = send_contact_email