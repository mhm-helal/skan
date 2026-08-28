import { NextResponse } from "next/server";
import db from "@/lib/db";

// POST - Make a user admin by email (only if no main admin exists yet)
export async function POST(req: Request) {
  const { email } = await req.json();

  // Check if main admin already exists
  const mainAdmin = db.prepare("SELECT id FROM admins WHERE role = 'main'").get();
  if (mainAdmin) {
    return NextResponse.json(
      { error: "المسؤول الرئيسي موجود بالفعل" },
      { status: 400 }
    );
  }

  const user = db.prepare("SELECT id, name FROM users WHERE email = ?").get(email) as
    | { id: number; name: string }
    | undefined;

  if (!user) {
    return NextResponse.json({ error: "المستخدم مش موجود" }, { status: 404 });
  }

  db.prepare("INSERT INTO admins (user_id, role, granted_by) VALUES (?, ?, ?)").run(
    user.id,
    "main",
    user.id
  );

  return NextResponse.json({ success: true, name: user.name });
}
