import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";
import { sendBookingConfirmationEmail, sendPaymentReceiptEmail } from "@/lib/email";

function getUser(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: number; name: string; email: string };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const user = getUser(req);
    if (!user) return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً" }, { status: 401 });

    const { propertyId } = await req.json();
    if (!propertyId) return NextResponse.json({ error: "معرّف الشقة مطلوب" }, { status: 400 });

    const db = await getDB();

    const existing = await db.execute({
      sql: "SELECT id FROM bookings WHERE user_id = ? AND property_id = ? AND status != 'cancelled'",
      args: [user.id, propertyId],
    });
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "لديك حجز فعال على هذه الشقة بالفعل" }, { status: 400 });
    }

    const { getPropertyById } = await import("@/lib/properties");
    const property = await getPropertyById(propertyId);
    if (!property) return NextResponse.json({ error: "الشقة مش موجودة" }, { status: 404 });

    const result = await db.execute({
      sql: `INSERT INTO bookings (user_id, property_id, property_title, property_price, owner_name, status, brokerage_paid) VALUES (?, ?, ?, ?, ?, 'confirmed', 1)`,
      args: [user.id, property.id, property.title, property.price, "المالك"],
    });

    const bookingId = Number(result.lastInsertRowid);

    sendPaymentReceiptEmail(user.email, user.name, { propertyTitle: property.title, amount: 1000, bookingId }).catch(console.error);
    sendBookingConfirmationEmail(user.email, user.name, { propertyTitle: property.title, propertyPrice: property.price, ownerName: "المالك", bookingId, city: property.city, address: property.address }).catch(console.error);

    return NextResponse.json({ success: true, bookingId, message: "تم الحجز بنجاح! هتوصلك رسائل على الإيميل بالتفاصيل" });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = getUser(req);
    if (!user) return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً" }, { status: 401 });

    const db = await getDB();
    const result = await db.execute({ sql: "SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC", args: [user.id] });

    return NextResponse.json({ bookings: result.rows });
  } catch (error) {
    console.error("Bookings error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
