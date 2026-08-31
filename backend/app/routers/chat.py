from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.database import get_db
from app.models import ChatMessage, User, Admin
from app.auth import get_current_user, require_role
from app.schemas import ChatMessageCreate, ChatMessageResponse, ChatConversation

router = APIRouter(prefix="/api/chat", tags=["الدردشة"])


@router.get("/messages")
def get_my_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at.asc()).all()
    return messages


@router.post("/send")
def send_message(
    data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msg = ChatMessage(
        user_id=current_user.id,
        sender_name=current_user.name,
        message=data.message,
        is_admin=False,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.get("/admin/all")
def get_all_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main", "admin")),
):
    subq = db.query(
        ChatMessage.user_id,
        func.max(ChatMessage.created_at).label("last_at"),
    ).group_by(ChatMessage.user_id).subquery()

    conversations = []
    rows = db.query(subq).order_by(subq.c.last_at.desc()).all()
    for row in rows:
        user = db.query(User).filter(User.id == row.user_id).first()
        if not user:
            continue
        last_msg = db.query(ChatMessage).filter(
            ChatMessage.user_id == row.user_id
        ).order_by(ChatMessage.created_at.desc()).first()
        unread = db.query(ChatMessage).filter(
            ChatMessage.user_id == row.user_id,
            ChatMessage.is_admin == False,
            ChatMessage.is_read == False,
        ).count()
        conversations.append(ChatConversation(
            user_id=user.id,
            user_name=user.name,
            last_message=last_msg.message if last_msg else "",
            last_message_at=last_msg.created_at if last_msg else None,
            unread_count=unread,
        ))
    return conversations


@router.get("/admin/messages/{user_id}")
def get_user_messages(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main", "admin")),
):
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == user_id
    ).order_by(ChatMessage.created_at.asc()).all()

    db.query(ChatMessage).filter(
        ChatMessage.user_id == user_id,
        ChatMessage.is_admin == False,
        ChatMessage.is_read == False,
    ).update({"is_read": True})
    db.commit()

    return messages


@router.post("/admin/send/{user_id}")
def admin_send_message(
    user_id: int,
    data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main", "admin")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")

    msg = ChatMessage(
        user_id=user_id,
        sender_name=current_user.name,
        message=data.message,
        is_admin=True,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.post("/admin/read/{user_id}")
def mark_as_read(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("main", "admin")),
):
    db.query(ChatMessage).filter(
        ChatMessage.user_id == user_id,
        ChatMessage.is_admin == False,
        ChatMessage.is_read == False,
    ).update({"is_read": True})
    db.commit()
    return {"message": "تم"}
