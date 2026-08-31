import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function POST(req: Request) {
  const { email } = await req.json();

  const db = await getDB();
  const mainAdmin = await db.execute({ sql: "SELECT id FROM admins WHERE role = 'main'", args: [] });
  if (mainAdmin.rows.length > 0) {
    return NextResponse.json({ error: "المسؤول الرئيسي موجود بالفعل" }, { status: 400 });
  }

  const userResult = await db.execute({ sql: "SELECT id, name FROM users WHERE email = ?", args: [email] });
  const user = userResult.rows[0] as unknown as { id: number; name: string } | undefined;
  if (!user) return NextResponse.json({ error: "المستخدم مش موجود" }, { status: 404 });

  await db.execute({ sql: "INSERT INTO admins (user_id, role, granted_by) VALUES (?, ?, ?)", args: [user.id, "main", user.id] });

  return NextResponse.json({ success: true, name: user.name });
}
