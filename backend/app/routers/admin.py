from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Property, Booking, Admin
from app.schemas import (
    AdminCreate, AdminResponse, DashboardStats, AdminSetup, UserResponse,
)
from app.auth import (
    create_access_token, get_current_user, require_role, pwd_context,
)
from app.config import settings

router = APIRouter(prefix="/api/admin", tags=["الإدارة"])


@router.post("/setup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def setup_main_admin(data: AdminSetup, db: Session = Depends(get_db)):
    existing_admin = db.query(Admin).filter(Admin.role == "main").first()
    if existing_admin:
        raise HTTPException(status_code=400, detail="المدير الرئيسي موجود بالفعل")

    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="البريد الإلكتروني مستخدم بالفعل")

    user = User(
        name=data.name,
        email=data.email,
        password_hash=pwd_context.hash(data.password),
        is_active=True,
    )
    db.add(user)
    db.flush()

    admin = Admin(user_id=user.id, role="main", granted_by=user.id)
    db.add(admin)
    db.commit()
    db.refresh(user)
    return user


@router.get("/dashboard", response_model=DashboardStats)
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main", "admin", "editor")),
):
    total_users = db.query(User).count()
    total_properties = db.query(Property).count()
    total_bookings = db.query(Booking).count()
    total_revenue = (
        db.query(Booking)
        .filter(Booking.status == "confirmed", Booking.brokerage_paid == True)
        .count()
        * settings.BROKERAGE_FEE
    )
    pending_bookings = db.query(Booking).filter(Booking.status == "pending").count()
    confirmed_bookings = db.query(Booking).filter(Booking.status == "confirmed").count()

    return DashboardStats(
        total_users=total_users,
        total_properties=total_properties,
        total_bookings=total_bookings,
        total_revenue=total_revenue,
        pending_bookings=pending_bookings,
        confirmed_bookings=confirmed_bookings,
    )


@router.get("/admins", response_model=List[AdminResponse])
def list_admins(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main")),
):
    admins = db.query(Admin).all()
    result = []
    for a in admins:
        user = db.query(User).filter(User.id == a.user_id).first()
        result.append(
            AdminResponse(
                id=a.id,
                user_id=a.user_id,
                role=a.role,
                granted_by=a.granted_by,
                created_at=a.created_at,
                user_name=user.name if user else None,
                user_email=user.email if user else None,
            )
        )
    return result


@router.post("/admins", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
def add_admin(
    data: AdminCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main")),
):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")

    existing = db.query(Admin).filter(Admin.user_id == data.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="هذا المستخدم مدير بالفعل")

    if data.role not in ("main", "admin", "editor"):
        raise HTTPException(status_code=400, detail="الدور غير صحيح")

    admin = Admin(
        user_id=data.user_id,
        role=data.role,
        granted_by=current_user.id,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)

    return AdminResponse(
        id=admin.id,
        user_id=admin.user_id,
        role=admin.role,
        granted_by=admin.granted_by,
        created_at=admin.created_at,
        user_name=user.name,
        user_email=user.email,
    )


@router.delete("/admins/{admin_id}")
def remove_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main")),
):
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="السجل غير موجود")

    if admin.role == "main":
        raise HTTPException(status_code=400, detail="لا يمكن حذف المدير الرئيسي")

    db.delete(admin)
    db.commit()
    return {"message": "تم حذف المدير بنجاح"}
