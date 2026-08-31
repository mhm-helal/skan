import os
import uuid
import qrcode
import base64
from io import BytesIO
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Payment, Booking, User, Admin
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/api/payments", tags=["الدفع"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "screenshots")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ── Bank Info ──────────────────────────────────────────
BANK_INFO = {
    "bank_name": "CIB - Commercial International Bank",
    "account_name": "Mohamed Abdelhamid Abouhelal",
    "account_number": "1000 1234 5678 9012",
    "iban": "EG12 3456 7890 1234 5678 9012",
    "swift_code": "CIBEEGCX",
}


# ── QR Code ────────────────────────────────────────────
def generate_payment_qr(amount: int = 1000) -> str:
    """Generate QR code as base64 for bank transfer."""
    qr_data = (
        f"Beneficiary: {BANK_INFO['account_name']}\n"
        f"Bank: {BANK_INFO['bank_name']}\n"
        f"Account: {BANK_INFO['account_number']}\n"
        f"IBAN: {BANK_INFO['iban']}\n"
        f"Amount: {amount} EGP\n"
        f"Reference: Skan Brokerage Fee"
    )
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#7c3aed", back_color="white")
    buf = BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


# ── Get Payment Info ───────────────────────────────────
@router.get("/info")
def get_payment_info():
    return {
        "bank": BANK_INFO,
        "amount": 1000,
        "qr_code": generate_payment_qr(1000),
        "instructions": [
            "1. حدد المبلغ: 1,000 ج.م (عمولة التوكيل)",
            "2. حوّل المبلغ لأحد الحسابات التالية",
            "3. خذ سكرين شوت للإيصال",
            "4. ارفع السكرين شوت هنا",
            "5. هنتواصل معاك خلال 24 ساعة لتأكيد الدفع",
        ],
    }


# ── Create Payment ─────────────────────────────────────
@router.post("/", status_code=201)
def create_payment(
    booking_id: int = Form(...),
    method: str = Form("bank_transfer"),
    reference_number: str = Form(""),
    screenshot: UploadFile = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="الحجز غير موجود")
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="هذا الحجز ليس لك")
    if booking.brokerage_paid:
        raise HTTPException(status_code=400, detail="تم دفع العمولة بالفعل")

    screenshot_url = None
    if screenshot:
        ext = screenshot.filename.split(".")[-1] if "." in screenshot.filename else "png"
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(screenshot.file.read())
        screenshot_url = f"/uploads/screenshots/{filename}"

    payment = Payment(
        booking_id=booking_id,
        user_id=current_user.id,
        amount=1000,
        method=method,
        screenshot_url=screenshot_url,
        reference_number=reference_number or None,
        status="pending",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {
        "id": payment.id,
        "status": "pending",
        "message": "تم استلام طلب الدفع. هنتواصل معاك قريباً.",
    }


# ── My Payments ────────────────────────────────────────
@router.get("/my")
def my_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payments = db.query(Payment).filter(Payment.user_id == current_user.id).all()
    return [
        {
            "id": p.id,
            "booking_id": p.booking_id,
            "amount": p.amount,
            "method": p.method,
            "status": p.status,
            "screenshot_url": p.screenshot_url,
            "created_at": p.created_at,
        }
        for p in payments
    ]


# ── Admin: All Payments ────────────────────────────────
@router.get("/admin")
def admin_get_payments(
    current_user: User = Depends(require_role(["main", "admin"])),
    db: Session = Depends(get_db),
):
    payments = db.query(Payment).order_by(Payment.created_at.desc()).all()
    result = []
    for p in payments:
        user = db.query(User).filter(User.id == p.user_id).first()
        booking = db.query(Booking).filter(Booking.id == p.booking_id).first()
        result.append({
            "id": p.id,
            "amount": p.amount,
            "method": p.method,
            "status": p.status,
            "screenshot_url": p.screenshot_url,
            "reference_number": p.reference_number,
            "user_name": user.name if user else "غير معروف",
            "user_email": user.email if user else "",
            "property_title": booking.property_title if booking else "",
            "created_at": p.created_at,
        })
    return result


# ── Admin: Approve Payment ─────────────────────────────
@router.post("/admin/{payment_id}/approve")
def approve_payment(
    payment_id: int,
    current_user: User = Depends(require_role(["main", "admin"])),
    db: Session = Depends(get_db),
):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="الدفع غير موجود")
    if payment.status == "approved":
        raise HTTPException(status_code=400, detail="تم اعتماد الدفع بالفعل")

    payment.status = "approved"
    payment.reviewed_by = current_user.id
    payment.reviewed_at = datetime.utcnow()

    booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()
    if booking:
        booking.brokerage_paid = True

    db.commit()
    return {"message": "تم اعتماد الدفع بنجاح", "status": "approved"}


# ── Admin: Reject Payment ──────────────────────────────
@router.post("/admin/{payment_id}/reject")
def reject_payment(
    payment_id: int,
    current_user: User = Depends(require_role(["main", "admin"])),
    db: Session = Depends(get_db),
):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="الدفع غير موجود")

    payment.status = "rejected"
    payment.reviewed_by = current_user.id
    payment.reviewed_at = datetime.utcnow()
    db.commit()
    return {"message": "تم رفض الدفع", "status": "rejected"}
