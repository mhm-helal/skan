import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, SiteSettings
from app.auth import require_role

router = APIRouter(prefix="/api/uploads", tags=["الرفع"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(require_role("main", "admin")),
):
    allowed = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="نوع الملف غير مدعوم. الرجاء رفع صورة (JPEG, PNG, WebP, GIF)")

    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="حجم الملف يتجاوز 10MB")

    with open(filepath, "wb") as f:
        f.write(content)

    return {"url": f"/uploads/{filename}", "filename": filename}


@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    current_user: User = Depends(require_role("main", "admin")),
):
    allowed = {"video/mp4", "video/webm", "video/quicktime"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="نوع الملف غير مدعوم. الرجاء رفع فيديو (MP4, WebM, MOV)")

    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "mp4"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    content = await file.read()
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="حجم الملف يتجاوز 50MB")

    with open(filepath, "wb") as f:
        f.write(content)

    return {"url": f"/uploads/{filename}", "filename": filename}


@router.get("/settings")
def get_settings(db: Session = Depends(get_db)):
    defaults = {
        "properties_count": "2500",
        "students_count": "10000",
        "cities_count": "15",
        "rating": "4.8",
        "satisfaction": "100",
        "response_time": "24",
    }
    rows = db.query(SiteSettings).all()
    settings = {r.key: r.value for r in rows}
    return {k: settings.get(k, v) for k, v in defaults.items()}


@router.put("/settings")
def update_settings(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main")),
):
    for key, value in data.items():
        row = db.query(SiteSettings).filter(SiteSettings.key == key).first()
        if row:
            row.value = str(value)
        else:
            row = SiteSettings(key=key, value=str(value))
            db.add(row)
    db.commit()
    return {"message": "تم تحديث الإعدادات بنجاح"}
