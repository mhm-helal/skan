from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ── Auth ──────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str

    def model_post_init(self, __context):
        if not self.email and not self.phone:
            raise ValueError("يجب إدخال البريد الإلكتروني أو رقم الهاتف")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TwoFactorEnable(BaseModel):
    secret: str
    code: str

class TwoFactorVerify(BaseModel):
    code: str

class TwoFactorDisable(BaseModel):
    code: str


# ── User ──────────────────────────────────────────────

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    is_active: bool
    is_admin: bool = False
    two_factor_enabled: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Property ──────────────────────────────────────────

class PropertyCreate(BaseModel):
    title: str
    address: str
    city: str
    price: int
    image_url: Optional[str] = None
    rooms: int = 1
    bathrooms: int = 1
    area: Optional[float] = None
    tags: Optional[List[str]] = None
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None
    description: Optional[str] = None
    is_available: bool = True

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    price: Optional[int] = None
    image_url: Optional[str] = None
    rooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area: Optional[float] = None
    tags: Optional[List[str]] = None
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None
    description: Optional[str] = None
    is_available: Optional[bool] = None

class PropertyResponse(BaseModel):
    id: int
    title: str
    address: str
    city: str
    price: int
    image_url: Optional[str] = None
    rooms: int
    bathrooms: int
    area: Optional[float] = None
    tags: Optional[List[str]] = None
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None
    description: Optional[str] = None
    is_available: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Booking ───────────────────────────────────────────

class BookingCreate(BaseModel):
    property_id: int

class BookingResponse(BaseModel):
    id: int
    user_id: int
    property_id: int
    property_title: str
    property_price: int
    owner_name: Optional[str] = None
    status: str
    brokerage_paid: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Admin ─────────────────────────────────────────────

class AdminCreate(BaseModel):
    user_id: int
    role: str = "editor"

class AdminResponse(BaseModel):
    id: int
    user_id: int
    role: str
    granted_by: Optional[int] = None
    created_at: Optional[datetime] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None

    class Config:
        from_attributes = True

class AdminSetup(BaseModel):
    name: str
    email: EmailStr
    password: str


# ── Dashboard ─────────────────────────────────────────

class DashboardStats(BaseModel):
    total_users: int
    total_properties: int
    total_bookings: int
    total_revenue: int
    pending_bookings: int
    confirmed_bookings: int


# ── Chat ──────────────────────────────────────────────

class ChatMessageCreate(BaseModel):
    message: str

class ChatMessageResponse(BaseModel):
    id: int
    user_id: int
    sender_name: str
    message: str
    is_admin: bool
    is_read: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ChatConversation(BaseModel):
    user_id: int
    user_name: str
    last_message: str
    last_message_at: Optional[datetime] = None
    unread_count: int
