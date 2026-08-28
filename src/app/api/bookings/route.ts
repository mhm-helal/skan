import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import {
  sendBookingConfirmationEmail,
  sendPaymentReceiptEmail,
} from "@/lib/email";

function getUser(req: Request) {
  const token = req.headers
    .get("cookie")
    ?.split("token=")[1]
    ?.split(";")[0];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      name: string;
      email: string;
    };
  } catch {
    return null;
  }
}

// Create booking + send payment receipt + send confirmation
export async function POST(req: Request) {
  try {
    const user = getUser(req);
    if (!user) {
      return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً" }, { status: 401 });
    }

    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ error: "معرّف الشقة مطلوب" }, { status: 400 });
    }

    // Check if already booked
    const existing = db
      .prepare(
        "SELECT id FROM bookings WHERE user_id = ? AND property_id = ? AND status != 'cancelled'"
      )
      .get(user.id, propertyId);
    if (existing) {
      return NextResponse.json(
        { error: "لديك حجز فعال على هذه الشقة بالفعل" },
        { status: 400 }
      );
    }

    // Get property info from DB
    const { getPropertyById } = await import("@/lib/properties");
    const property = getPropertyById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "الشقة مش موجودة" }, { status: 404 });
    }

    // Create booking with brokerage paid
    const result = db
      .prepare(
        `INSERT INTO bookings (user_id, property_id, property_title, property_price, owner_name, status, brokerage_paid)
         VALUES (?, ?, ?, ?, ?, 'confirmed', 1)`
      )
      .run(
        user.id,
        property.id,
        property.title,
        property.price,
        "المالك"
      );

    const bookingId = result.lastInsertRowid as number;

    // Send payment receipt email
    sendPaymentReceiptEmail(user.email, user.name, {
      propertyTitle: property.title,
      amount: 1000,
      bookingId,
    }).catch(console.error);

    // Send booking confirmation email with full details
    sendBookingConfirmationEmail(user.email, user.name, {
      propertyTitle: property.title,
      propertyPrice: property.price,
      ownerName: "المالك",
      bookingId,
      city: property.city,
      address: property.address,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      bookingId,
      message: "تم الحجز بنجاح! هتوصلك رسائل على الإيميل بالتفاصيل",
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

// Get user's bookings
export async function GET(req: Request) {
  try {
    const user = getUser(req);
    if (!user) {
      return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً" }, { status: 401 });
    }

    const bookings = db
      .prepare(
        "SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC"
      )
      .all(user.id);

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Bookings error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
