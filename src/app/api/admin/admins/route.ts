import { NextResponse } from "next/server";
import { getAdminUser, isMainAdmin } from "@/lib/admin";
import { getDB } from "@/lib/db";

export async function GET(req: Request) {
  const admin = await getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const db = await getDB();
  const result = await db.execute({
    sql: `SELECT a.id, a.user_id, a.role, a.created_at, u.name, u.email FROM admins a JOIN users u ON a.user_id = u.id ORDER BY a.role DESC, a.created_at ASC`,
    args: [],
  });

  return NextResponse.json({ admins: result.rows });
}

export async function POST(req: Request) {
  const admin = await getAdminUser(req);
  if (!admin || !(await isMainAdmin(admin.id))) {
    return NextResponse.json({ error: "فقط المسؤول الرئيسي يمكنه إضافة مسؤولين جدد" }, { status: 403 });
  }

  const { email, role } = await req.json();
  if (!email) return NextResponse.json({ error: "الإيميل مطلوب" }, { status: 400 });

  const db = await getDB();
  const userResult = await db.execute({ sql: "SELECT id, name FROM users WHERE email = ?", args: [email] });
  const user = userResult.rows[0] as unknown as { id: number; name: string } | undefined;

  if (!user) return NextResponse.json({ error: "المستخدم غير موجود — يجب تسجيله في الموقع أولاً" }, { status: 404 });

  const existing = await db.execute({ sql: "SELECT id FROM admins WHERE user_id = ?", args: [user.id] });
  if (existing.rows.length > 0) return NextResponse.json({ error: "المستخدم مسؤول بالفعل" }, { status: 400 });

  await db.execute({ sql: "INSERT INTO admins (user_id, role, granted_by) VALUES (?, ?, ?)", args: [user.id, role || "admin", admin.id] });

  return NextResponse.json({ success: true, name: user.name });
}

export async function DELETE(req: Request) {
  const admin = await getAdminUser(req);
  if (!admin || !(await isMainAdmin(admin.id))) {
    return NextResponse.json({ error: "فقط المسؤول الرئيسي يمكنه إزالة المسؤولين" }, { status: 403 });
  }

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "معرّف المستخدم مطلوب" }, { status: 400 });
  if (userId === admin.id) return NextResponse.json({ error: "لا يمكنك إزالة صلاحياتك بنفسك" }, { status: 400 });

  const db = await getDB();
  await db.execute({ sql: "DELETE FROM admins WHERE user_id = ?", args: [userId] });

  return NextResponse.json({ success: true });
}
