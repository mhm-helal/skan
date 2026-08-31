from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.config import settings
from app.models import User, Property, Admin
from app.auth import pwd_context

# ── Seed Data ─────────────────────────────────────────

SEED_PROPERTIES = [
    {
        "title": "شقة سكنية حديثة",
        "address": "التجمع الخامس، القاهرة الجديدة",
        "city": "القاهرة الجديدة",
        "price": 8200,
        "image_url": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "rooms": 3,
        "bathrooms": 2,
        "area": 120,
        "tags": ["حديثة", "مفروشة", "أمن 24 ساعة"],
        "owner_name": "أحمد محمد",
        "owner_phone": "01012345678",
        "description": "شقة سكنية حديثة بإطلالة رائعة على المدينة. تحتوي على 3 غرف نوم ومطبخ مجهز بالكامل وصالة معيشة واسعة. proximity to universities and metro.",
    },
    {
        "title": "أستوديو راقٍ",
        "address": "شارع النزهة، مدينة الشروق",
        "city": "مدينة الشروق",
        "price": 5000,
        "image_url": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        "rooms": 1,
        "bathrooms": 1,
        "area": 55,
        "tags": ["أستوديو", "ϖسيط", "قريب من المترو"],
        "owner_name": "فاطمة علي",
        "owner_phone": "01098765432",
        "description": "أستوديو أنيق مثالي للطلاب والأفراد. يحتوي على كل ما تحتاجه لحياة مريحة. قريب من وسائل النقل العام.",
    },
    {
        "title": "شقة بغرفتين وشرفة",
        "address": "المنصورة الجديدة، مدينة بدر",
        "city": "مدينة بدر",
        "price": 6500,
        "image_url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        "rooms": 2,
        "bathrooms": 1,
        "area": 85,
        "tags": ["شرفة", "مطبخ مجهز", "حديقة"],
        "owner_name": "محمد حسن",
        "owner_phone": "01155544433",
        "description": "شقة واسعة بشرفة تطل على الحديقة. مثالية للعائلات الصغيرة. تحتوي على مطبخ مجهز وغرفتين نوم مbright.",
    },
    {
        "title": "شقة فاخرة بالكامل",
        "address": "Compound Fifth Settlement, القاهرة الجديدة",
        "city": "القاهرة الجديدة",
        "price": 12000,
        "image_url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        "rooms": 4,
        "bathrooms": 3,
        "area": 200,
        "tags": ["فاخرة", "جاكوزي", "حديقة خاصة", "security"],
        "owner_name": "خالد عبدالله",
        "owner_phone": "01288877766",
        "description": "شقة فاخرة في كومباوند راقي. تحتوي على 4 غرف نوم و3 حمامات وجاكوزي وحديقة خاصة. جميع الخدمات متوفرة.",
    },
    {
        "title": "غرفة مشتركة للطلاب",
        "address": "شارع جامعة الدول العربية، الشروق",
        "city": "الشروق",
        "price": 2200,
        "image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
        "rooms": 1,
        "bathrooms": 1,
        "area": 25,
        "tags": ["مشتركة", "للطلاب", "配备"],
        "owner_name": "سارة إبراهيم",
        "owner_phone": "01033322211",
        "description": "غرفة مشتركة مثالية للطلاب. تحتوي على سرير وديسكتوب وخزانة ملابس. مشاركة الحمام والمطبخ مع طلاب آخرين.",
    },
    {
        "title": "شقة عائلية واسعة",
        "address": "مدينتي، Fifth Settlement",
        "city": "مدينتي",
        "price": 9800,
        "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        "rooms": 3,
        "bathrooms": 2,
        "area": 150,
        "tags": ["عائلية", "واسعة", "حديقة", "موقف سيارات"],
        "owner_name": "عمر السيد",
        "owner_phone": "01199988877",
        "description": "شقة عائلية واسعة في كومباوند مدينتي. تحتوي على 3 غرف نوم وصالة كبيرة ومطبخ مجهز وحديقة. مناسبة للعائلات.",
    },
]


def seed_database():
    db = SessionLocal()
    try:
        existing = db.query(Property).count()
        if existing == 0:
            for prop_data in SEED_PROPERTIES:
                prop = Property(**prop_data)
                db.add(prop)
            db.commit()

        existing_admin = db.query(Admin).filter(Admin.role == "main").first()
        if not existing_admin:
            user = User(
                name="المدير الرئيسي",
                email="admin@skan.com",
                password_hash=pwd_context.hash("admin123"),
                is_active=True,
            )
            db.add(user)
            db.flush()
            admin = Admin(user_id=user.id, role="main", granted_by=user.id)
            db.add(admin)
            db.commit()
    finally:
        db.close()


# ── App Lifecycle ─────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield


# ── FastAPI App ───────────────────────────────────────

app = FastAPI(
    title="Skan API",
    description="منصة سكن للعقارات السكنية للطلاب",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────

from app.routers import auth, properties, bookings, admin, payments

app.include_router(auth.router)
app.include_router(properties.router)
app.include_router(bookings.router)
app.include_router(admin.router)
app.include_router(payments.router)

# ── Static Files (uploads) ─────────────────────────────
from fastapi.staticfiles import StaticFiles
import os

uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
if os.path.exists(uploads_dir):
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/", tags=["الصحة"])
def health_check():
    return {"status": "healthy", "app": settings.APP_NAME}
