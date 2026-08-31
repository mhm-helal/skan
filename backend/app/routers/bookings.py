from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Booking, Property, User, Admin
from app.schemas import BookingCreate, BookingResponse
from app.auth import get_current_user, require_role
from app.tasks.email import send_booking_confirmation_sync

router = APIRouter(prefix="/api/bookings", tags=["الحجوزات"])


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prop = db.query(Property).filter(Property.id == data.property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="العقار غير موجود")
    if not prop.is_available:
        raise HTTPException(status_code=400, detail="العقار غير متاح حالياً")

    existing = (
        db.query(Booking)
        .filter(
            Booking.user_id == current_user.id,
            Booking.property_id == data.property_id,
            Booking.status.in_(["pending", "confirmed"]),
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="لديك حجز مسبق على هذا العقار")

    booking = Booking(
        user_id=current_user.id,
        property_id=prop.id,
        property_title=prop.title,
        property_price=prop.price,
        owner_name=prop.owner_name,
        status="pending",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    try:
        send_booking_confirmation_sync(
            current_user.email,
            current_user.name,
            {
                "property_title": prop.title,
                "property_price": prop.price,
                "owner_name": prop.owner_name or "غير محدد",
                "booking_id": booking.id,
            },
        )
    except Exception:
        pass

    return booking


@router.get("", response_model=List[BookingResponse])
def my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )


@router.get("/admin", response_model=List[BookingResponse])
def admin_list_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main", "admin")),
):
    return db.query(Booking).order_by(Booking.created_at.desc()).all()
