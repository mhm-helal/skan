"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Phone,
  Calendar,
  ShieldCheck,
  Share2,
  Heart,
  Star,
  CheckCircle2,
  Lock,
  LogIn,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useUser } from "@/lib/useUser";
import type { Property } from "@/lib/properties";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

const features = [
  "مكيف مركزي",
  "تكييف سبليت",
  "مطبخ مجهز",
  "أرضيات رخام",
  "نظام أمان 24 ساعة",
  "موقف سيارات",
  "بلكونة",
  "إنترنت فايبر",
];

export default function PropertyDetailClient({
  property,
}: {
  property: Property;
}) {
  const { user, loading: authLoading } = useUser();
  const [showContact, setShowContact] = useState(false);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "3d" | "features">(
    "details"
  );

  const handleBooking = async () => {
    if (!user) return;
    setBooking(true);
    setBookingError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: property.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooked(true);
      setShowContact(true);
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setBooking(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-5">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 text-sm text-black/50 dark:text-white/50"
          >
            <Link href="/" className="hover:text-fuchsia-500 transition">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href="/#properties" className="hover:text-fuchsia-500 transition">
              الشقق
            </Link>
            <span>/</span>
            <span className="text-foreground dark:text-white">{property.title}</span>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-[400px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {property.tags.map((t) => (
                    <span key={t} className="rounded-full bg-fuchsia-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition hover:bg-white/40">
                    <Heart size={20} />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition hover:bg-white/40">
                    <Share2 size={20} />
                  </button>
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-2 rounded-2xl bg-white/70 p-1.5 backdrop-blur-md dark:bg-white/5"
              >
                {(
                  [
                    { key: "details", label: "التفاصيل" },
                    { key: "3d", label: "جولة 3D" },
                    { key: "features", label: "المميزات" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
                      activeTab === tab.key
                        ? "bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white shadow-lg"
                        : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </motion.div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-black/5 bg-white/70 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
              >
                {activeTab === "details" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">تفاصيل الشقة</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 rounded-xl bg-fuchsia-500/10 p-3">
                        <BedDouble className="text-fuchsia-500" size={20} />
                        <div>
                          <p className="text-xs text-black/50 dark:text-white/50">الغرف</p>
                          <p className="font-bold">{property.rooms} غرف</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-orange-400/10 p-3">
                        <Bath className="text-orange-400" size={20} />
                        <div>
                          <p className="text-xs text-black/50 dark:text-white/50">الحمامات</p>
                          <p className="font-bold">{property.bathrooms} حمام</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-sky-500/10 p-3">
                        <Maximize className="text-sky-500" size={20} />
                        <div>
                          <p className="text-xs text-black/50 dark:text-white/50">المساحة</p>
                          <p className="font-bold">{property.area} م²</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-green-500/10 p-3">
                        <Star className="text-green-500" size={20} />
                        <div>
                          <p className="text-xs text-black/50 dark:text-white/50">التقييم</p>
                          <p className="font-bold">4.8 / 5</p>
                        </div>
                      </div>
                    </div>
                    <p className="leading-7 text-black/70 dark:text-white/70">
                      شقة سكنية حديثة ومجهزة بالكامل في {property.city}.
                      Located في {property.address}. مناسبة للطلاب والعوائل.
                      تتميز بالهدوء والأمان والقرب من الجامعة والمرافق الحيوية.
                    </p>
                  </div>
                )}
                {activeTab === "3d" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">جولة ثلاثية الأبعاد</h3>
                    <p className="text-sm text-black/60 dark:text-white/60">
                      حرّك بالماوس لتدور حول الشقة وتتفرج على التفاصيل
                    </p>
                    <Scene3D />
                  </div>
                )}
                {activeTab === "features" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">مميزات الشقة</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {features.map((f) => (
                        <div key={f} className="flex items-center gap-2 rounded-xl bg-green-500/10 p-3 text-sm">
                          <CheckCircle2 className="shrink-0 text-green-500" size={18} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-28 rounded-3xl border border-black/5 bg-white/70 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
              >
                {/* Price */}
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-fuchsia-600 dark:text-fuchsia-400">
                    {property.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-black/50 dark:text-white/50">ج.م /شهر</span>
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
                  <MapPin size={16} className="text-orange-400" />
                  {property.city} — {property.address}
                </div>

                <div className="mb-6 flex items-center gap-1 text-sm text-green-500">
                  <CheckCircle2 size={16} />
                  <span>متاح الآن</span>
                </div>

                {/* Auth / Booking Flow */}
                {authLoading ? (
                  <button disabled className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black/10 py-4 font-bold dark:bg-white/10">
                    <Loader2 size={20} className="animate-spin" />
                    جاري التحميل...
                  </button>
                ) : !user ? (
                  /* Not logged in */
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-orange-400 py-4 font-bold text-white shadow-xl transition hover:shadow-fuchsia-500/40"
                    >
                      <LogIn size={20} />
                      سجّل دخولك لإتمام الحجز
                    </Link>
                    <Link
                      href="/register"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-fuchsia-300 py-3 font-bold text-fuchsia-600 transition hover:bg-fuchsia-50 dark:border-fuchsia-700 dark:text-fuchsia-400"
                    >
                      إنشاء حساب جديد
                    </Link>
                  </div>
                ) : booked || showContact ? (
                  /* Booked - show contact */
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-green-300/50 bg-green-500/10 p-4 text-center">
                      <CheckCircle2 size={24} className="mx-auto mb-2 text-green-500" />
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        تم الحجز بنجاح!
                      </p>
                      <p className="text-xs text-black/60 dark:text-white/60">
                        هتوصلك رسائل على إيميلك بالتفاصيل
                      </p>
                    </div>
                    <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-500/10 p-4 text-center">
                      <Phone size={24} className="mx-auto mb-2 text-fuchsia-500" />
                      <p className="text-sm font-bold">رقم المالك</p>
                      <p className="mt-1 text-lg font-black text-fuchsia-600 dark:text-fuchsia-400">
                        01XXXXXXXXX
                      </p>
                      <p className="text-xs text-black/50 dark:text-white/50">
                        (أرقام حقيقية تظهر بعد الدفع)
                      </p>
                    </div>
                  </div>
                ) : !showContact ? (
                  /* Logged in - show booking button */
                  <div className="space-y-3">
                    {bookingError && (
                      <div className="rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-500">
                        {bookingError}
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleBooking}
                      disabled={booking}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-orange-400 py-4 font-bold text-white shadow-xl transition hover:shadow-fuchsia-500/40 disabled:opacity-50"
                    >
                      {booking ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <ShieldCheck size={20} />
                      )}
                      {booking
                        ? "جاري الحجز..."
                        : "ادفع السمسرة (1,000 ج.م) واحجز"}
                    </motion.button>
                    <p className="text-center text-xs text-black/40 dark:text-white/40">
                      رسوم السمسرة لمرة واحدة — هتوصلك رسالة تأكيد على الإيميل
                    </p>
                  </div>
                ) : null}

                {/* Extra buttons */}
                <div className="mt-4 flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 py-2.5 text-sm font-medium transition hover:border-fuchsia-400 dark:border-white/20">
                    <Calendar size={16} />
                    حجز معاينة
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 py-2.5 text-sm font-medium transition hover:border-fuchsia-400 dark:border-white/20">
                    <Share2 size={16} />
                    مشاركة
                  </button>
                </div>

                {/* Trust */}
                <div className="mt-6 space-y-3 border-t border-black/10 pt-4 dark:border-white/10">
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 size={16} />
                    <span>الشقة موثقة ومحقق منها</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <Lock size={16} />
                    <span>بيانات المالك سرية وآمنة</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 size={16} />
                    <span>رسائل تأكيد على الإيميل بعد كل خطوة</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-black/10 py-10 text-center text-sm text-black/50 dark:border-white/10 dark:text-white/50">
        <p>Skan © 2026 — جميع الحقوق محفوظة.</p>
      </footer>
    </>
  );
}
