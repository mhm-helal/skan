import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import db from "@/lib/db";

// GET - List all properties for admin
export async function GET(req: Request) {
  const admin = getAdminUser(req);
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const properties = db.prepare("SELECT * FROM properties ORDER BY id DESC").all();
  return NextResponse.json({ properties });
}

// POST - Add new property
export async function POST(req: Request) {
  const admin = getAdminUser(req);
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json();
  const { title, address, city, price, image, rooms, bathrooms, area, tags, owner_name, owner_phone, description } = body;

  if (!title || !address || !city || !price || !image) {
    return NextResponse.json({ error: "البيانات ناقصة" }, { status: 400 });
  }

  const result = db.prepare(`
    INSERT INTO properties (title, address, city, price, image, rooms, bathrooms, area, tags, owner_name, owner_phone, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    address,
    city,
    Number(price),
    image,
    Number(rooms) || 1,
    Number(bathrooms) || 1,
    Number(area) || 50,
    JSON.stringify(tags || []),
    owner_name || "",
    owner_phone || "",
    description || ""
  );

  return NextResponse.json({ success: true, id: result.lastInsertRowid });
}
