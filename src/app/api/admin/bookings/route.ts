import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import db from "@/lib/db";

// GET - List all bookings for admin
export async function GET(req: Request) {
  const admin = getAdminUser(req);
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const bookings = db.prepare(`
    SELECT b.*, u.name as user_name, u.email as user_email
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    ORDER BY b.created_at DESC
  `).all();

  return NextResponse.json({ bookings });
}
