import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
from app.config import settings

# ── HTML Templates ────────────────────────────────────

WELCOME_TEMPLATE = Template("""
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0514;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0514;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#110a24;border-radius:16px;overflow:hidden;border:1px solid rgba(168,85,247,0.2);">
  <tr>
    <td style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);padding:40px 30px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:32px;letter-spacing:2px;">🏠 Skan</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">منصة سكن الطلاب الأولى</p>
    </td>
  </tr>
  <tr>
    <td style="padding:40px 30px;">
      <h2 style="color:#e2e8f0;margin:0 0 16px;font-size:24px;">مرحباً {{ name }}! 👋</h2>
      <p style="color:#94a3b8;line-height:1.8;font-size:16px;margin:0 0 12px;">
        يسعدنا انضمامك إلى منصة <strong style="color:#a855f7;">Skan</strong> للعقارات السكنية.
      </p>
      <p style="color:#94a3b8;line-height:1.8;font-size:16px;margin:0 0 24px;">
        يمكنك الآن تصفح العقارات المتاحة وحجز ما يناسبك بسهولة. مع مجسمات ثلاثية الأبعاد وتفاصيل كاملة لكل عقار.
      </p>
      <a href="#" style="display:inline-block;background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:bold;font-size:16px;">
        ابدأ التصفح الآن
      </a>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 30px;border-top:1px solid rgba(168,85,247,0.1);text-align:center;">
      <p style="color:#475569;font-size:13px;margin:0;">© 2026 Skan — All rights reserved. Mohamed Abdelhamid Abouhelal.</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>
""")

BOOKING_TEMPLATE = Template("""
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0514;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0514;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#110a24;border-radius:16px;overflow:hidden;border:1px solid rgba(34,197,94,0.2);">
  <tr>
    <td style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:40px 30px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:28px;">✅ تأكيد الحجز</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:40px 30px;">
      <h2 style="color:#e2e8f0;margin:0 0 16px;font-size:22px;">مرحباً {{ name }}!</h2>
      <p style="color:#94a3b8;line-height:1.8;font-size:16px;margin:0 0 20px;">
        تم استلام طلب الحجز الخاص بك بنجاح. إليك التفاصيل:
      </p>
      <div style="background:rgba(168,85,247,0.05);border:1px solid rgba(168,85,247,0.15);border-radius:12px;padding:20px;margin:0 0 20px;">
        <p style="color:#c084fc;margin:8px 0;font-size:15px;">رقم الحجز: <strong>#{{ booking_id }}</strong></p>
        <p style="color:#c084fc;margin:8px 0;font-size:15px;">العقار: <strong>{{ property_title }}</strong></p>
        <p style="color:#c084fc;margin:8px 0;font-size:15px;">السعر: <strong>{{ property_price }} ج.م / شهرياً</strong></p>
        <p style="color:#c084fc;margin:8px 0;font-size:15px;">المالك: <strong>{{ owner_name }}</strong></p>
      </div>
      <p style="color:#94a3b8;line-height:1.8;font-size:16px;margin:0;">
        سيتم التواصل معك قريباً لتأكيد الحجز وتسيل الدفع.
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 30px;border-top:1px solid rgba(168,85,247,0.1);text-align:center;">
      <p style="color:#475569;font-size:13px;margin:0;">© 2026 Skan — All rights reserved. Mohamed Abdelhamid Abouhelal.</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>
""")

PAYMENT_TEMPLATE = Template("""
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0514;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0514;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#110a24;border-radius:16px;overflow:hidden;border:1px solid rgba(168,85,247,0.2);">
  <tr>
    <td style="background:linear-gradient(135deg,#7c3aed,#a855f7);padding:40px 30px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:28px;">💰 إيصال الدفع</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:40px 30px;">
      <h2 style="color:#e2e8f0;margin:0 0 16px;font-size:22px;">مرحباً {{ name }}!</h2>
      <p style="color:#94a3b8;line-height:1.8;font-size:16px;margin:0 0 20px;">
        تم استلام الدفع بنجاح. إليك تفاصيل الإيصال:
      </p>
      <div style="background:rgba(168,85,247,0.05);border:1px solid rgba(168,85,247,0.15);border-radius:12px;padding:20px;margin:0 0 20px;">
        <p style="color:#c084fc;margin:8px 0;font-size:15px;">رقم الإيصال: <strong>#{{ receipt_id }}</strong></p>
        <p style="color:#c084fc;margin:8px 0;font-size:15px;">المبلغ: <strong>{{ amount }} ج.م</strong></p>
        <p style="color:#c084fc;margin:8px 0;font-size:15px;">العقار: <strong>{{ property_title }}</strong></p>
        <p style="color:#c084fc;margin:8px 0;font-size:15px;">التاريخ: <strong>{{ date }}</strong></p>
      </div>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 30px;border-top:1px solid rgba(168,85,247,0.1);text-align:center;">
      <p style="color:#475569;font-size:13px;margin:0;">© 2026 Skan — All rights reserved. Mohamed Abdelhamid Abouhelal.</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>
""")


# ── Send Functions (direct, no Celery) ────────────────

def _send_email_sync(to_email: str, subject: str, html_body: str):
    if not settings.EMAIL_USER or not settings.EMAIL_PASS:
        print(f"[EMAIL] Skipping — no credentials. Would send to {to_email}: {subject}")
        return False

    msg = MIMEMultipart("alternative")
    msg["From"] = f"Skan <{settings.EMAIL_USER}>"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.EMAIL_USER, settings.EMAIL_PASS)
        server.sendmail(settings.EMAIL_USER, to_email, msg.as_string())
    print(f"[EMAIL] Sent to {to_email}: {subject}")
    return True


def send_welcome_email_sync(email: str, name: str):
    html = WELCOME_TEMPLATE.render(name=name)
    return _send_email_sync(email, "مرحباً بك في منصة Skan 🏠", html)


def send_booking_confirmation_sync(email: str, name: str, booking_data: dict):
    html = BOOKING_TEMPLATE.render(
        name=name,
        booking_id=booking_data.get("booking_id", ""),
        property_title=booking_data.get("property_title", ""),
        property_price=booking_data.get("property_price", 0),
        owner_name=booking_data.get("owner_name", "غير محدد"),
    )
    return _send_email_sync(email, "تأكيد الحجز — Skan", html)


def send_payment_receipt_sync(email: str, name: str, receipt_data: dict):
    html = PAYMENT_TEMPLATE.render(
        name=name,
        receipt_id=receipt_data.get("receipt_id", ""),
        amount=receipt_data.get("amount", 0),
        property_title=receipt_data.get("property_title", ""),
        date=receipt_data.get("date", ""),
    )
    return _send_email_sync(email, "إيصال الدفع — Skan", html)
