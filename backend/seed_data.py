"""
سكربت مستقل لتعبئة البيانات初始 البيانات وإنشاء المدير الرئيسي.

التشغيل:
    cd backend
    python seed_data.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import User, Property, Admin
from app.auth import pwd_context

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
        "description": "شقة سكنية حديثة بإطلالة رائعة على المدينة. تحتوي على 3 غرف نوم ومطبخ مجهز بالكامل وصالة معيشة واسعة.",
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
        "tags": ["أستوديو", "بسيط", "قريب من المترو"],
        "owner_name": "فاطمة علي",
        "owner_phone": "01098765432",
        "description": "أستوديو أنيق مثالي للطلاب والأفراد. يحتوي على كل ما تحتاجه لحياة مريحة.",
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
        "description": "شقة واسعة بشرفة تطل على الحديقة. مثالية للعائلات الصغيرة.",
    },
    {
        "title": "شقة فاخرة بالكامل",
        "address": "كومباوند القاهرة الجديدة",
        "city": "القاهرة الجديدة",
        "price": 12000,
        "image_url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        "rooms": 4,
        "bathrooms": 3,
        "area": 200,
        "tags": ["فاخرة", "جاكوزي", "حديقة خاصة"],
        "owner_name": "خالد عبدالله",
        "owner_phone": "01288877766",
        "description": "شقة فاخرة في كومباوند راقي. تحتوي على 4 غرف نوم و3 حمامات وجاكوزي وحديقة خاصة.",
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
        "tags": ["مشتركة", "للطلاب", "اقتصادية"],
        "owner_name": "سارة إبراهيم",
        "owner_phone": "01033322211",
        "description": "غرفة مشتركة مثالية للطلاب. تحتوي على سرير وديسكتوب وخزانة ملابس.",
    },
    {
        "title": "شقة عائلية واسعة",
        "address": "مدينتي، القاهرة الجديدة",
        "city": "مدينتي",
        "price": 9800,
        "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        "rooms": 3,
        "bathrooms": 2,
        "area": 150,
        "tags": ["عائلية", "واسعة", "حديقة"],
        "owner_name": "عمر السيد",
        "owner_phone": "01199988877",
        "description": "شقة عائلية واسعة في كومباوند مدينتي. تحتوي على 3 غرف نوم وصالة كبيرة ومطبخ مجهز.",
    },
]


def main():
    print("جاري إنشاء الجداول...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        prop_count = db.query(Property).count()
        if prop_count == 0:
            print("جاري تعبئة العقارات...")
            for prop_data in SEED_PROPERTIES:
                prop = Property(**prop_data)
                db.add(prop)
            db.commit()
            print(f"تم إضافة {len(SEED_PROPERTIES)} عقار بنجاح.")
        else:
            print(f"يوجد {prop_count} عقار بالفعل. تمتخطي التعبئة.")

        admin_exists = db.query(Admin).filter(Admin.role == "main").first()
        if not admin_exists:
            print("جاري إنشاء المدير الرئيسي...")
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
            print("تم إنشاء المدير الرئيسي بنجاح.")
            print("  البريد: admin@skan.com")
            print("  كلمة المرور: admin123")
        else:
            print("المدير الرئيسي موجود بالفعل.")

        print("\nاكتملت التعبئة بنجاح!")
    except Exception as e:
        db.rollback()
        print(f"خطأ: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
