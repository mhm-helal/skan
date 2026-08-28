import { NextResponse } from "next/server";
import { getAdminUser, isMainAdmin } from "@/lib/admin";
import db from "@/lib/db";

// GET - List all admins
export async function GET(req: Request) {
  const admin = getAdminUser(req);
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const admins = db.prepare(`
    SELECT a.id, a.user_id, a.role, a.created_at, u.name, u.email
    FROM admins a
    JOIN users u ON a.user_id = u.id
    ORDER BY a.role DESC, a.created_at ASC
  `).all();

  return NextResponse.json({ admins });
}

// POST - Add new admin
export async function POST(req: Request) {
  const admin = getAdminUser(req);
  if (!admin || !isMainAdmin(admin.id)) {
    return NextResponse.json({ error: "فقط المسؤول الرئيسي يمكنه إضافة مسؤولين جدد" }, { status: 403 });
  }

  const { email, role } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "الإيميل مطلوب" }, { status: 400 });
  }

  const user = db.prepare("SELECT id, name FROM users WHERE email = ?").get(email) as
    | { id: number; name: string }
    | undefined;

  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود — يجب تسجيله في الموقع أولاً" }, { status: 404 });
  }

  const existing = db.prepare("SELECT id FROM admins WHERE user_id = ?").get(user.id);
  if (existing) {
    return NextResponse.json({ error: "المستخدم مسؤول بالفعل" }, { status: 400 });
  }

  db.prepare("INSERT INTO admins (user_id, role, granted_by) VALUES (?, ?, ?)").run(
    user.id,
    role || "admin",
    admin.id
  );

  return NextResponse.json({ success: true, name: user.name });
}

// DELETE - Remove admin
export async function DELETE(req: Request) {
  const admin = getAdminUser(req);
  if (!admin || !isMainAdmin(admin.id)) {
    return NextResponse.json({ error: "فقط المسؤول الرئيسي يمكنه إزالة المسؤولين" }, { status: 403 });
  }

  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "معرّف المستخدم مطلوب" }, { status: 400 });
  }

  // Can't remove yourself
  if (userId === admin.id) {
    return NextResponse.json({ error: "لا يمكنك إزالة صلاحياتك بنفسك" }, { status: 400 });
  }

  db.prepare("DELETE FROM admins WHERE user_id = ?").run(userId);

  return NextResponse.json({ success: true });
}
