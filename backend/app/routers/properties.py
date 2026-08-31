from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models import Property, User
from app.schemas import PropertyCreate, PropertyUpdate, PropertyResponse
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/api/properties", tags=["العقارات"])


@router.get("", response_model=List[PropertyResponse])
def list_properties(
    city: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    rooms: Optional[int] = None,
    available: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Property)
    if city:
        q = q.filter(Property.city == city)
    if min_price is not None:
        q = q.filter(Property.price >= min_price)
    if max_price is not None:
        q = q.filter(Property.price <= max_price)
    if rooms is not None:
        q = q.filter(Property.rooms == rooms)
    if available is not None:
        q = q.filter(Property.is_available == available)
    if search:
        q = q.filter(Property.title.contains(search) | Property.address.contains(search))
    return q.order_by(Property.created_at.desc()).all()


@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: int, db: Session = Depends(get_db)):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="العقار غير موجود")
    return prop


@router.post("/admin", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
def create_property(
    data: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main", "admin")),
):
    prop = Property(**data.model_dump())
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return prop


@router.put("/admin/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: int,
    data: PropertyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main", "admin")),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="العقار غير موجود")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(prop, field, value)

    db.commit()
    db.refresh(prop)
    return prop


@router.delete("/admin/{property_id}")
def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main", "admin")),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="العقار غير موجود")

    db.delete(prop)
    db.commit()
    return {"message": "تم حذف العقار بنجاح"}
