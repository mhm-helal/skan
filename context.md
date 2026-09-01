# Skan — Full Project Documentation

## What Is This Project?
**Skan** is a student housing rental platform for Egypt. Students browse apartments with 3D models, pay 1,000 EGP brokerage fee to reveal owner contact. Platform earns brokerage on each successful match.

---

## 1. Project Overview
- **What**: Student housing rental marketplace (brokerage model)
- **Stack**: React SPA (Vite 8 Rolldown) + FastAPI backend + SQLite
- **Users**: Students seeking housing, property owners, platform admins
- **Goal**: Students browse freely, pay 1,000 EGP brokerage to reveal owner phone

---

## 2. Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 (Rolldown) + TypeScript + Tailwind CSS v4 |
| 3D | Three.js (lazy-loaded) |
| Animation | Framer Motion |
| HTTP | Axios |
| Routing | React Router v7 |
| Backend | Python 3.13 + FastAPI + SQLAlchemy + SQLite |
| Auth | JWT + Role-based access + 2FA + Google OAuth |
| Email | Gmail SMTP (sync, no Celery) |
| Hosting | Vercel (frontend) + Cloudflare Tunnel (backend) |

---

## 3. File Structure
```
skan/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + CORS + routers
│   │   ├── config.py            # Settings (env vars)
│   │   ├── database.py          # SQLAlchemy engine
│   │   ├── models.py            # ORM models (User, Property, Booking, Admin, Payment, PhoneVerification, ChatMessage, SiteSettings)
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # JWT + RBAC
│   │   └── routers/
│   │       ├── auth.py          # Login/Register/Google
│   │       ├── properties.py    # Property CRUD
│   │       ├── bookings.py      # Booking CRUD
│   │       ├── admin.py         # Admin CRUD
│   │       ├── payments.py      # Payment processing
│   │       ├── phone.py         # Phone verification
│   │       ├── chat.py          # Chat system
│   │       └── uploads.py       # Image/video upload + SiteSettings
│   ├── requirements.txt
│   └── skan.db
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Root with ThemeProvider + I18nProvider + AuthProvider
│   │   ├── main.tsx             # Entry
│   │   ├── index.css            # Tailwind + dark/light theme + animations
│   │   ├── api.ts               # Axios instance (baseURL from VITE_API_URL)
│   │   ├── store.tsx            # Auth context
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── i18n.tsx             # Arabic/English translations (100+ keys)
│   │   ├── theme.tsx            # Dark/Light mode context
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── PropertyDetailPage.tsx
│   │   │   ├── AdminPage.tsx
│   │   │   ├── PaymentPage.tsx
│   │   │   ├── SetupPage.tsx
│   │   │   └── AdminChatPage.tsx
│   │   └── components/
│   │       ├── Navbar.tsx       # Language + Theme toggles
│   │       ├── Footer.tsx
│   │       ├── SkanLogo.tsx
│   │       ├── CustomCursor.tsx
│   │       ├── LoadingScreen.tsx
│   │       ├── DockNav.tsx
│   │       ├── HomeContent.tsx
│   │       ├── HeroSection.tsx
│   │       ├── LatestProperties.tsx
│   │       ├── PropertyCard.tsx
│   │       ├── StatsSection.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── TestimonialsSection.tsx
│   │       ├── FAQSection.tsx
│   │       ├── OwnersCTA.tsx
│   │       ├── Scene3D.tsx
│   │       ├── Scene3DHeavy.tsx
│   │       ├── PropertyViewer3D.tsx
│   │       ├── SearchFilters.tsx
│   │       ├── MapSearch.tsx
│   │       ├── BiddingSystem.tsx
│   │       ├── ShareWithParent.tsx
│   │       ├── ChatWidget.tsx
│   │       └── StarRating.tsx
│   ├── vite.config.ts
│   ├── vercel.json
│   └── api/
│       └── [...path].js         # Vercel serverless proxy
├── .gitignore
└── context.md
```

---

## 4. All Features

### Core Features
| Feature | Status | Notes |
|---------|--------|-------|
| JWT Authentication | ✅ | Email + Phone + Google OAuth |
| Role-Based Access Control | ✅ | main, admin, editor |
| Two-Factor Authentication | ✅ | TOTP (pyotp) |
| Property Management | ✅ | Full CRUD + images + 3D models |
| Image/Video Upload | ✅ | `/api/uploads/image`, `/api/uploads/video` |
| Gallery with Lightbox | ✅ | Responsive, arrows, dots, video support |
| Booking System | ✅ | Status tracking (pending/confirmed/cancelled) |
| Payment Processing | ✅ | CIB bank transfer + QR code |
| Live Chat | ✅ | User ↔ Admin, polling 10-15s |
| Email Notifications | ✅ | Welcome + Booking + Payment (sync Gmail SMTP) |
| Admin Dashboard | ✅ | 3-role system, stats, property/booking/payment/chat management |
| 3D Property Viewer | ✅ | Three.js lazy-loaded, DPR limited, mobile Bloom disabled |
| Custom Cursor | ✅ | Desktop only, memory leak fixed |
| Dark/Light Mode | ✅ | Theme context, localStorage, CSS variables |
| Language Switcher (AR/EN) | ✅ | i18n with 100+ translation keys |
| Advanced Search | ✅ | City, price, rooms, text search |
| Map Search | ✅ | CSS grid map with positioned pins + list toggle |
| Testimonials | ✅ | 6 student reviews with auto-scroll |
| FAQ | ✅ | 8 accordion items |
| Bidding System | ✅ | Students can offer prices |
| Share with Parent | ✅ | Copy, WhatsApp, SMS |
| How It Works | ✅ | 4-step flow |
| SiteSettings | ✅ | Admin-editable stats |
| Vercel Proxy | ✅ | Serverless function for API forwarding |
| WebSocket (standalone) | ✅ | Separate ws_server.py |

---

## 5. How to Run

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # Build for production
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Cloudflare Tunnel (expose backend)
```bash
cloudflared tunnel --url http://localhost:8000
```
Current tunnel URL saved to: `C:\Users\hp\AppData\Local\Temp\tunnel_url.txt`

---

## 6. Environment Variables

### Backend (.env in backend/)
```
SECRET_KEY=skan-dev-secret-key-2026
DATABASE_URL=sqlite:///./skan.db
EMAIL_USER=skan.egypt@gmail.com
EMAIL_PASS=iqza zlwz phom knsq
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ALLOWED_ORIGINS=http://localhost:5173,https://skan-xi.vercel.app
```

### Frontend (Vercel env vars)
```
VITE_API_URL=                          # Empty = use relative /api/
BACKEND_URL=https://<current-tunnel>.trycloudflare.com
```

---

## 7. Deployment

### Vercel (Frontend)
- **Project**: skan
- **URL**: https://skan-xi.vercel.app
- **Root Directory**: frontend
- **Build**: `vite build`
- **Output**: dist
- **Proxy**: `api/[...path].js` → BACKEND_URL
- **Env vars**: Must update `BACKEND_URL` on Vercel each time tunnel restarts

### Backend (Cloudflare Tunnel)
- Currently using Cloudflare tunnel (URL changes on restart)
- Backend runs locally on localhost:8000
- Render requires credit card (blocked)

---

## 8. Admin System
| Role | Capabilities |
|------|-------------|
| main | Manages other admins, full access |
| admin | Edit properties, bookings, payments |
| editor | Limited editing |

Default admin: `admin@skan.com` / `admin123`

---

## 9. Known Issues
- **Backend hosting**: Render requires credit card. Using Cloudflare tunnel (URL changes on restart).
- **Vercel env vars**: `BACKEND_URL` must be updated on Vercel each time tunnel restarts.
- **Vite 8/Rolldown**: `manualChunks` must be a FUNCTION, not object.
- **No Arabic in Python print**: Windows cp1252 errors.
- **bcrypt pinned to 4.0.1**: Newer versions fail.
- **Google OAuth Client ID**: Hardcoded in LoginPage.tsx + auth.py — needs replacement for production.

---

## 10. Git History
```
c317707 feat: language switcher (AR/EN) + dark/light mode toggle
f7d2faa feat: add UniBid-inspired features
2be1887 feat: gallery tab with lightbox on PropertyDetailPage
6763e6f feat: admin SiteSettings + dynamic StatsSection
b525466 feat: image/video upload system + gallery support
d655611 feat: performance optimization + mobile responsiveness
c4de1ef feat: comprehensive responsive fixes + performance optimization
6a138cd feat: add Vercel proxy for backend API
8a636b2 feat: Google login, welcome emails, full mobile fix
30df57d feat: add fullscreen mobile menu + fix 3D tab reload
431437d feat: build production, update context
d802e39 feat: complete rebuild — RBAC, 2FA, Chat, Payments
22f6522 initial commit
```

---

## 11. Design Rules
- **Colors**: Dark purple `#0a0514` theme, Tailwind purple/pink gradients
- **Font**: Cairo (Google Fonts)
- **Branding**: "Skan" in Franco (Latin), 🏠 SVG mascot logo
- **Copyright**: "محمد عبدالحميد ابوهلال"
- **Contact**: 010 910 20130 | skan.egypt@gmail.com | مصر
- **Currency**: EGP (ج.م)
- **Language**: Formal Arabic (الفصحى) — All UI text in Arabic
- **UI Style**: Mobile-first, glass morphism, neon glow, dark mode default
