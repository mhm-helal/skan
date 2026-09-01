import pyotp
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import (
    UserRegister, UserLogin, TokenResponse, UserResponse,
    TwoFactorEnable, TwoFactorVerify, TwoFactorDisable,
)
from app.auth import (
    create_access_token, get_current_user, oauth2_scheme,
)
from app.tasks.email import send_welcome_email_sync

router = APIRouter(prefix="/api/auth", tags=["المصادقة"])


class GoogleLoginRequest(BaseModel):
    credential: str


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="البريد الإلكتروني مستخدم بالفعل")

    from app.auth import pwd_context

    user = User(
        name=data.name,
        email=data.email,
        password_hash=pwd_context.hash(data.password),
        phone=data.phone,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        send_welcome_email_sync(user.email, user.name)
    except Exception:
        pass

    return user


@router.post("/google", response_model=TokenResponse)
def google_login(data: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests

        idinfo = id_token.verify_oauth2_token(
            data.credential, google_requests.Request(),
            "1057671369023-pvkr0kvrf9kqt67s7g5h5pnqb2q2s8s0.apps.googleusercontent.com"
        )
        google_id = idinfo["sub"]
        email = idinfo.get("email", "")
        name = idinfo.get("name", "")
        picture = idinfo.get("picture", "")
    except Exception:
        raise HTTPException(status_code=400, detail="رمز Google غير صالح")

    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.google_id = google_id
            db.commit()
        else:
            user = User(
                name=name,
                email=email,
                google_id=google_id,
                password_hash=None,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    token = create_access_token(data={"user_id": user.id})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    from app.auth import pwd_context

    user = None
    if data.email:
        user = db.query(User).filter(User.email == data.email).first()
    elif data.phone:
        user = db.query(User).filter(User.phone == data.phone).first()

    if not user or not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="بيانات الدخول غير صحيحة")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="الحساب معطل")

    token = create_access_token(data={"user_id": user.id})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/logout")
def logout():
    return {"message": "تم تسجيل الخروج بنجاح"}


@router.get("/me")
def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from app.models import Admin
    admin = db.query(Admin).filter(Admin.user_id == current_user.id).first()
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "is_active": current_user.is_active,
        "is_admin": admin is not None,
        "two_factor_enabled": current_user.two_factor_enabled,
        "created_at": current_user.created_at,
    }


# ── 2FA ───────────────────────────────────────────────

@router.post("/2fa/enable")
def enable_2fa(
    data: TwoFactorEnable,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.two_factor_enabled:
        raise HTTPException(status_code=400, detail="المصادقة الثنائية مفعلة بالفعل")

    totp = pyotp.TOTP(data.secret)
    if not totp.verify(data.code):
        raise HTTPException(status_code=400, detail="الرمز غير صحيح")

    current_user.two_factor_secret = data.secret
    current_user.two_factor_enabled = True
    db.commit()
    return {"message": "تم تفعيل المصادقة الثنائية بنجاح"}


@router.post("/2fa/verify")
def verify_2fa(
    data: TwoFactorVerify,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not current_user.two_factor_enabled:
        raise HTTPException(status_code=400, detail="المصادقة الثنائية غير مفعلة")

    totp = pyotp.TOTP(current_user.two_factor_secret)
    if not totp.verify(data.code):
        raise HTTPException(status_code=400, detail="الرمز غير صحيح")

    return {"message": "تم التحقق بنجاح"}


@router.post("/2fa/disable")
def disable_2fa(
    data: TwoFactorDisable,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not current_user.two_factor_enabled:
        raise HTTPException(status_code=400, detail="المصادقة الثنائية غير مفعلة")

    totp = pyotp.TOTP(current_user.two_factor_secret)
    if not totp.verify(data.code):
        raise HTTPException(status_code=400, detail="الرمز غير صحيح")

    current_user.two_factor_secret = None
    current_user.two_factor_enabled = False
    db.commit()
    return {"message": "تم تعطيل المصادقة الثنائية بنجاح"}
