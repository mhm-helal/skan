import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { getDB } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { title, address, city, price, image, rooms, bathrooms, area, tags, owner_name, owner_phone, description, available } = body;

  const db = await getDB();
  await db.execute({
    sql: `UPDATE properties SET title = COALESCE(?, title), address = COALESCE(?, address), city = COALESCE(?, city), price = COALESCE(?, price), image = COALESCE(?, image), rooms = COALESCE(?, rooms), bathrooms = COALESCE(?, bathrooms), area = COALESCE(?, area), tags = COALESCE(?, tags), owner_name = COALESCE(?, owner_name), owner_phone = COALESCE(?, owner_phone), description = COALESCE(?, description), available = COALESCE(?, available) WHERE id = ?`,
    args: [title ?? null, address ?? null, city ?? null, price ?? null, image ?? null, rooms ?? null, bathrooms ?? null, area ?? null, tags ? JSON.stringify(tags) : null, owner_name ?? null, owner_phone ?? null, description ?? null, available ?? null, Number(id)],
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { id } = await params;
  const db = await getDB();
  await db.execute({ sql: "DELETE FROM properties WHERE id = ?", args: [Number(id)] });

  return NextResponse.json({ success: true });
}
