# Skan - منصة إيجار سكن الطلاب

## نظرة عامة

**Skan** هي منصة رقمية لإدارة وتأجير سكن الطلاب في الجامعات. توفر المنصة تجربة سلسة للطلاب الباحثين عن سكن ولأصحاب العقارات الذين ي觊رون وحداتهم.

## حزمة التقنيات (Tech Stack)

| المكون | التقنية |
|--------|---------|
| Backend | FastAPI (Python 3.12) |
| Frontend | React + Vite |
| قاعدة البيانات | MySQL 8.0 |
| الكاش | Redis 7 |
| المهام الخلفية | Celery + Celery Beat |
| الت瓿 | Docker + Docker Compose |
| الخادم | Nginx |
| المصادقة | JWT + Firebase |

## الهيكلة

```
skan/
├── backend/               # FastAPI Python app
│   ├── app/
│   │   ├── main.py        # Entry point
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routes/        # API routes
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── tasks/         # Celery tasks
│   │   └── utils/         # Helpers
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/              # React SPA
│   ├── src/
│   ├── public/
│   ├── nginx.conf
│   └── Dockerfile
├── nginx/                 # Nginx configs
│   └── dev.conf
├── docker-compose.yml     # Full stack
├── docker-compose.dev.yml # Dev services only
├── Makefile
├── .env
├── .env.example
└── README.md
```

## التشغيل المحلي (Development)

### الطريقة الأولى: MySQL + Redis عبر Docker

```bash
# تشغيل MySQL و Redis فقط
make dev-services

# تثبيت الاعتماديات
make install-backend
make install-frontend

# تشغيل الخادم الخلفي
make dev-backend

# تشغيل الواجهة الأمامية (في terminal منفصل)
make dev-frontend
```

### الطريقة الثانية: تشغيل كل شيء محلياً

```bash
# تثبيت MySQL و Redis يدوياً
# ثم ضبط .env و تشغيل:
uvicorn app.main:app --reload --port 8000
cd frontend && npm run dev
```

## التشغيل بالدوكر (Docker)

```bash
# بناء وتشغيل كل شيء
make build
make start

# أو بدون Makefile
docker compose up -d --build

# عرض السجلات
make logs

# إيقاف كل شيء
make stop

# تنظف كل شيء (يتضمن الحذف)
make clean
```

## المتغيرات البيئية (Environment Variables)

| المتغير | الوصف | القيمة الافتراضية |
|---------|-------|-------------------|
| `MYSQL_ROOT_PASSWORD` | كلمة مرور root لقاعدة البيانات | `root123` |
| `MYSQL_DATABASE` | اسم قاعدة البيانات | `skan` |
| `MYSQL_USER` | مستخدم قاعدة البيانات | `skan` |
| `MYSQL_PASSWORD` | كلمة مرور مستخدم قاعدة البيانات | `skan123` |
| `JWT_SECRET` | سر التوقيع JWT | `skan-super-secret-change-in-production` |
| `DATABASE_URL` | اتصال قاعدة البيانات | `mysql+pymysql://skan:skan123@mysql:3306/skan` |
| `REDIS_URL` | اتصال Redis | `redis://redis:6379/0` |
| `EMAIL_USER` | البريد الإلكتروني (اختياري) | - |
| `EMAIL_PASS` | كلمة مرور البريد الإلكتروني (اختياري) | - |
| `FIREBASE_CREDENTIALS` | مسار ملف Firebase | `/app/firebase.json` |

## واجهة برمجة التطبيقات (API Endpoints)

### المصادقة (Auth)
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/refresh` - تجديد التوكن
- `GET /api/auth/me` - بيانات المستخدم الحالي

### العقارات (Properties)
- `GET /api/properties` - قائمة العقارات
- `GET /api/properties/{id}` - تفاصيل عقار
- `POST /api/properties` - إضافة عقار جديد
- `PUT /api/properties/{id}` - تعديل عقار
- `DELETE /api/properties/{id}` - حذف عقار
- `GET /api/properties/search` - البحث عن عقارات

### الحجوزات (Bookings)
- `GET /api/bookings` - قائمة الحجوزات
- `POST /api/bookings` - إنشاء حجز
- `PUT /api/bookings/{id}` - تعديل حجز
- `DELETE /api/bookings/{id}` - إلغاء حجز

### الدفع (Payments)
- `GET /api/payments` - سجل المدفوعات
- `POST /api/payments` - إنشاء دفعة
- `GET /api/payments/{id}` - تفاصيل دفعة

### التقييمات (Reviews)
- `GET /api/reviews` - التقييمات
- `POST /api/reviews` - إضافة تقييم
- `PUT /api/reviews/{id}` - تعديل تقييم
- `DELETE /api/reviews/{id}` - حذف تقييم

### الرسائل (Messages)
- `GET /api/messages` - الرسائل
- `POST /api/messages` - إرسال رسالة
- `GET /api/conversations` - المحادثات

### الإشعارات (Notifications)
- `GET /api/notifications` - الإشعارات
- `PUT /api/notifications/{id}` - تعليم كمقروء
- `DELETE /api/notifications/{id}` - حذف إشعار

### المستخدمين (Users)
- `GET /api/users/me` - الملف الشخصي
- `PUT /api/users/me` - تعديل الملف الشخصي
- `GET /api/users/me/favorites` - المفضلة
- `POST /api/users/me/favorites/{property_id}` - إضافة للمفضلة
- `DELETE /api/users/me/favorites/{property_id}` - حذف من المفضلة

## المعمارية (Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                       Nginx                              │
│                  (Frontend + Proxy)                      │
│                    Port: 80                              │
└─────────────────┬───────────────────┬───────────────────┘
                  │                   │
         ┌────────▼──────┐   ┌───────▼────────┐
         │   React SPA   │   │  FastAPI API    │
         │   (Vite)      │   │  Port: 8000     │
         └───────────────┘   └───────┬─────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
            ┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
            │   MySQL 8.0  │ │   Redis 7   │ │   Celery    │
            │  Port: 3306  │ │ Port: 6379  │ │   Worker    │
            └──────────────┘ └─────────────┘ └──────┬──────┘
                                                    │
                                            ┌───────▼──────┐
                                            │  Celery Beat │
                                            │  (Scheduler) │
                                            └──────────────┘
```

### تدفق البيانات

1. **المستخدم** → يتفاعل مع واجهة React
2. **React** → يرسل طلبات إلى FastAPI عبر `/api/`
3. **FastAPI** → يعالج الطلبات ويخزن البيانات في MySQL
4. **Redis** → يخزن الكاش ويعمل كـ broker لـ Celery
5. **Celery Worker** → ينفي المهام الخلفية (إرسال إيميل، معالجة المدفوعات)
6. **Celery Beat** → يجدول المهام الدورية (تنظيف البيانات، التقارير)

## المراحل المتقدمة

### للإنتاج

1. تغيير جميع كلمات المرور والأسرار في `.env`
2. تكوين Firebase Authentication
3. تفعيل HTTPS عبر Let's Encrypt
4. إعداد SSL certificates
5. تكوين backups لقاعدة البيانات

```bash
# للإنتاج
make prod
```

## الصلاحيات

- **مدير النظام**: إدارة المستخدمين والعقارات
- **مالك العقار**: إضافة وتعديل العقارات
- **الباحث عن سكن**: البحث والحجز والتقييم

## الترخيص

جميع الحقوق محفوظة لمنصة Skan 2026.
