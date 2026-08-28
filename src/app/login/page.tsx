"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/");
      router.refresh();
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

      <div className="absolute left-5 right-5 top-5 flex justify-end">
        <DarkModeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-black/10 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-black">
            <span className="bg-gradient-to-r from-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
              Skan
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold">تسجيل الدخول</h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            ادخل على حسابك وكمّل حجز شقتك
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30"
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-black/10 bg-white/50 py-3 pr-10 pl-4 text-sm outline-none transition focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30"
            />
            <input
              type={showPass ? "text" : "password"}
              placeholder="كلمة المرور"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-black/10 bg-white/50 py-3 pr-10 pl-10 text-sm outline-none transition focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-orange-400 py-3 font-bold text-white shadow-lg transition disabled:opacity-50"
          >
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-black/50 dark:text-white/50">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="font-bold text-fuchsia-500 hover:underline">
            سجّل الآن
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
