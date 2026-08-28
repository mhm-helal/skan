import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function wrap(body: string) {
  return `
  <!DOCTYPE html>
  <html dir="rtl" lang="ar">
  <head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#0e0720;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:#1a1033;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);">
      <div style="background:linear-gradient(135deg,#9333ea,#ec4899);padding:24px;text-align:center;">
        <h1 style="color:#fff;font-size:28px;margin:0;">🏠 Skan</h1>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">منصة سكن الطلاب</p>
      </div>
      <div style="padding:32px;color:#e2e8f0;">
        ${body}
      </div>
      <div style="padding:16px;text-align:center;color:rgba(255,255,255,0.3);font-size:12px;border-top:1px solid rgba(255,255,255,0.1);">
        Skan © 2026 — جميع الحقوق محفوظة
      </div>
    </div>
  </body></html>`;
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!process.env.EMAIL_USER) {
    console.log("[EMAIL SKIPPED] No EMAIL_USER configured");
    return;
  }
  await transporter.sendMail({
    from: `"Skan" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "مرحباً بك في Skan! 🎉",
    html: wrap(`
      <h2 style="color:#f0abfc;margin:0 0 12px;">مرحباً ${name}!</h2>
      <p style="line-height:1.8;color:#cbd5e1;">
        تم تسجيلك بنجاح في منصة <strong style="color:#f0abfc;">Skan</strong> — منصة سكن الطلاب الأولى.
      </p>
      <p style="line-height:1.8;color:#cbd5e1;">
        يمكنك الآن تصفح الشقق وعرض الصور والمجسمات ثلاثية الأبعاد وحجز سكنك بسهولة.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}" style="background:linear-gradient(135deg,#9333ea,#ec4899);color:#fff;padding:12px 32px;border-radius:12px;text-decoration:none;font-weight:bold;">ابدأ الآن</a>
      </div>
    `),
  });
}

export async function sendBookingConfirmationEmail(
  email: string,
  name: string,
  data: {
    propertyTitle: string;
    propertyPrice: number;
    ownerName: string;
    bookingId: number;
    city: string;
    address: string;
  }
) {
  if (!process.env.EMAIL_USER) {
    console.log("[EMAIL SKIPPED] No EMAIL_USER configured");
    return;
  }
  await transporter.sendMail({
    from: `"Skan" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `تم تأكيد حجزك — ${data.propertyTitle} ✅`,
    html: wrap(`
      <h2 style="color:#4ade80;margin:0 0 12px;">تم تأكيد الحجز! ✅</h2>
      <p style="line-height:1.8;color:#cbd5e1;">أهلاً ${name}،</p>
      <p style="line-height:1.8;color:#cbd5e1;">تم تأكيد حجزك بنجاح. التفاصيل:</p>
      <div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;margin:16px 0;border:1px solid rgba(255,255,255,0.1);">
        <table style="width:100%;color:#e2e8f0;font-size:15px;">
          <tr><td style="padding:6px 0;color:#94a3b8;">رقم الحجز</td><td style="text-align:left;font-weight:bold;">#${data.bookingId}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8;">الشقة</td><td style="text-align:left;font-weight:bold;color:#f0abfc;">${data.propertyTitle}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8;">المالك</td><td style="text-align:left;font-weight:bold;">${data.ownerName}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8;">المكان</td><td style="text-align:left;">${data.city} — ${data.address}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8;">الإيجار الشهري</td><td style="text-align:left;font-weight:bold;color:#fbbf24;">${data.propertyPrice.toLocaleString()} ج.م</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8;">رسوم السمسرة</td><td style="text-align:left;font-weight:bold;color:#4ade80;">1,000 ج.م (مدفوعة)</td></tr>
        </table>
      </div>
      <p style="line-height:1.8;color:#cbd5e1;">
        يمكنك التواصل مع المالك والاتفاق على العقد. إذا كنت بحاجة إلى أي مساعدة، يرجى التواصل معنا.
      </p>
    `),
  });
}

export async function sendPaymentReceiptEmail(
  email: string,
  name: string,
  data: {
    propertyTitle: string;
    amount: number;
    bookingId: number;
  }
) {
  if (!process.env.EMAIL_USER) {
    console.log("[EMAIL SKIPPED] No EMAIL_USER configured");
    return;
  }
  await transporter.sendMail({
    from: `"Skan" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `إيصال الدفع — ${data.propertyTitle} 💰`,
    html: wrap(`
      <h2 style="color:#fbbf24;margin:0 0 12px;">إيصال الدفع 💰</h2>
      <p style="line-height:1.8;color:#cbd5e1;">أهلاً ${name}،</p>
      <p style="line-height:1.8;color:#cbd5e1;">تم استلام الدفع بنجاح. التفاصيل:</p>
      <div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;margin:16px 0;border:1px solid rgba(255,255,255,0.1);">
        <table style="width:100%;color:#e2e8f0;font-size:15px;">
          <tr><td style="padding:6px 0;color:#94a3b8;">رقم الحجز</td><td style="text-align:left;font-weight:bold;">#${data.bookingId}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8;">الشقة</td><td style="text-align:left;font-weight:bold;color:#f0abfc;">${data.propertyTitle}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8;">المبلغ</td><td style="text-align:left;font-weight:bold;color:#4ade80;">${data.amount.toLocaleString()} ج.م</td></tr>
        </table>
      </div>
      <p style="line-height:1.8;color:#cbd5e1;">
        يمكنك الآن التواصل مع المالك من خلال صفحة العقار. بالنجاح! 🎉
      </p>
    `),
  });
}
