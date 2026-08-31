import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { getDB } from "@/lib/db";

export async function GET(req: Request) {
  const admin = await getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const db = await getDB();
  const result = await db.execute({
    sql: `SELECT b.*, u.name as user_name, u.email as user_email FROM bookings b JOIN users u ON b.user_id = u.id ORDER BY b.created_at DESC`,
    args: [],
  });

  return NextResponse.json({ bookings: result.rows });
}
