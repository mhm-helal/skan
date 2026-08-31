import random
import string
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import PhoneVerification, User
from app.auth import get_current_user

router = APIRouter(prefix="/api/phone", tags=["التحقق من الهاتف"])

CODE_LENGTH = 6
CODE_EXPIRY_MINUTES = 5
MAX_ATTEMPTS = 5


class SendCodeRequest(BaseModel):
    phone: str
    purpose: str = "register"


class VerifyCodeRequest(BaseModel):
    phone: str
    code: str
    purpose: str = "register"


def _generate_code() -> str:
    return ''.join(random.choices(string.digits, k=CODE_LENGTH))


def _send_sms(phone: str, code: str) -> bool:
    """Send SMS via provider. Falls back to console log for testing."""
    from app.config import settings

    # ── Twilio ──
    if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
        try:
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            client.messages.create(
                body=f"كود التحقق من Skan: {code}\nصالح لمدة {CODE_EXPIRY_MINUTES} دقائق",
                from_=settings.TWILIO_FROM_NUMBER,
                to=phone,
            )
            print(f"[SMS] Sent to {phone}: {code}")
            return True
        except Exception as e:
            print(f"[SMS ERROR] {e}")

    # ── Fallback: console log ──
    print(f"\n{'='*50}")
    print(f"[SMS CODE] Phone: {phone} | Code: {code}")
    print(f"{'='*50}\n")
    return True


@router.post("/send-code")
def send_code(data: SendCodeRequest, db: Session = Depends(get_db)):
    if not data.phone or len(data.phone) < 10:
        raise HTTPException(status_code=400, detail="رقم الهاتف غير صحيح")

    # Check rate limit — last 60 seconds
    recent = db.query(PhoneVerification).filter(
        PhoneVerification.phone == data.phone,
        PhoneVerification.purpose == data.purpose,
        PhoneVerification.created_at >= datetime.utcnow() - timedelta(seconds=60),
    ).first()
    if recent:
        raise HTTPException(status_code=429, detail="انتظر دقيقة قبل طلب كود جديد")

    # Invalidate old codes
    db.query(PhoneVerification).filter(
        PhoneVerification.phone == data.phone,
        PhoneVerification.purpose == data.purpose,
        PhoneVerification.is_used == False,
    ).update({"is_used": True})

    code = _generate_code()
    verification = PhoneVerification(
        phone=data.phone,
        code=code,
        purpose=data.purpose,
        expires_at=datetime.utcnow() + timedelta(minutes=CODE_EXPIRY_MINUTES),
    )
    db.add(verification)
    db.commit()

    _send_sms(data.phone, code)

    return {"message": "تم إرسال كود التحقق", "expires_in": CODE_EXPIRY_MINUTES * 60}


@router.post("/verify")
def verify_code(data: VerifyCodeRequest, db: Session = Depends(get_db)):
    if not data.phone or not data.code:
        raise HTTPException(status_code=400, detail="رقم الهاتف والكود مطلوبين")

    verification = db.query(PhoneVerification).filter(
        PhoneVerification.phone == data.phone,
        PhoneVerification.purpose == data.purpose,
        PhoneVerification.is_used == False,
    ).order_by(PhoneVerification.created_at.desc()).first()

    if not verification:
        raise HTTPException(status_code=400, detail="لم يتم إرسال كود بعد")

    if verification.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="انتهت صلاحية الكود")

    if verification.attempts >= MAX_ATTEMPTS:
        verification.is_used = True
        db.commit()
        raise HTTPException(status_code=400, detail="تجاوزت عدد المحاولات المسموح بها")

    verification.attempts += 1

    if verification.code != data.code:
        db.commit()
        raise HTTPException(status_code=400, detail=f"كود غير صحيح ({verification.attempts}/{MAX_ATTEMPTS})")

    verification.is_used = True
    db.commit()

    # If purpose is register, mark phone as verified
    if data.purpose == "register":
        user = db.query(User).filter(User.phone == data.phone).first()
        if user:
            user.phone_verified = True
            db.commit()

    return {"message": "تم التحقق بنجاح", "verified": True}
