"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Check, Loader2, ArrowRight } from "lucide-react";

export default function AdminSetupPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSetup = async () => {
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-80 w-80 animate-blob rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute right-0 top-20 h-96 w-96 animate-blob rounded-full bg-orange-400/30 blur-3xl animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-black/10 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-orange-400">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black">تفعيل المسؤول الرئيسي</h1>
          <p className="mt-2 text-sm text-black/50 dark:text-white/50">
            خطوة واحدة فقط — أدخل بريدك الإلكتروني لتفعيل صلاحية المسؤول الرئيسي
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <Check size={32} className="text-green-500" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-green-600 dark:text-green-400">
              تم التفعيل! 🎉
            </h2>
            <p className="mb-6 text-sm text-black/50 dark:text-white/50">
              الآن أنت المسؤول الرئيسي. يمكنك إضافة مسؤولين آخرين وتعديل العقارات من لوحة التحكم الخاصة بك.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-orange-400 px-6 py-3 font-bold text-white shadow-lg transition hover:shadow-fuchsia-500/40"
            >
              <ArrowRight size={18} />
              افتح لوحة التحكم
            </Link>
          </motion.div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="email"
                placeholder="البريد الإلكتروني الذي سجلت به"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white/50 py-3 px-4 text-sm outline-none transition focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSetup}
                disabled={loading || !email}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-orange-400 py-3 font-bold text-white shadow-lg transition disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <ShieldCheck size={20} />
                )}
                {loading ? "جاري التفعيل..." : "تفعيل المسؤول الرئيسي"}
              </motion.button>
            </div>

            <p className="mt-4 text-center text-xs text-black/40 dark:text-white/40">
              هذه الخطوة تتم مرة واحدة فقط. إذا لم تكن مسجلاً،{" "}
              <Link href="/register" className="text-fuchsia-500 hover:underline">
                سجّل الأول
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
