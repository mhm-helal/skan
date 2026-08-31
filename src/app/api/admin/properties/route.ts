import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { getDB } from "@/lib/db";

export async function GET(req: Request) {
  const admin = await getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const db = await getDB();
  const result = await db.execute("SELECT * FROM properties ORDER BY id DESC");
  return NextResponse.json({ properties: result.rows });
}

export async function POST(req: Request) {
  const admin = await getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const body = await req.json();
  const { title, address, city, price, image, rooms, bathrooms, area, tags, owner_name, owner_phone, description } = body;

  if (!title || !address || !city || !price || !image) {
    return NextResponse.json({ error: "البيانات ناقصة" }, { status: 400 });
  }

  const db = await getDB();
  const result = await db.execute({
    sql: `INSERT INTO properties (title, address, city, price, image, rooms, bathrooms, area, tags, owner_name, owner_phone, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [title, address, city, Number(price), image, Number(rooms) || 1, Number(bathrooms) || 1, Number(area) || 50, JSON.stringify(tags || []), owner_name || "", owner_phone || "", description || ""],
  });

  return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) });
}
