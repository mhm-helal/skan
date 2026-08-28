"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, User, LogOut, ShieldCheck } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import SkanLogo from "./SkanLogo";
import { useUser } from "@/lib/useUser";

const links = [
  { label: "الرئيسية", href: "/" },
  { label: "الشقق", href: "/#properties" },
  { label: "كيف يعمل", href: "/#how" },
  { label: "المالكين", href: "/#owners" },
];

export default function Navbar() {
  const { user, logout } = useUser();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-3xl border border-white/15 bg-[#1a1033]/80 px-5 py-3 shadow-2xl backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <SkanLogo size={44} />
          </motion.div>
          <span className="hover-glow text-2xl font-black tracking-tight text-white drop-shadow-lg">
            Skan
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1.5 backdrop-blur-md md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <DarkModeToggle />

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white sm:flex">
                <User size={16} />
                {user.name}
              </div>
              <Link
                href="/admin"
                className="hidden items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-sm font-bold text-fuchsia-400 transition hover:bg-fuchsia-500/20 sm:flex"
              >
                <ShieldCheck size={16} />
                <span className="hidden lg:inline">لوحة التحكم</span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 transition hover:bg-red-500/20"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">خروج</span>
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">دخول</span>
              </Link>
              <Link
                href="/register"
                className="hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:shadow-fuchsia-500/40 sm:block"
              >
                <span className="text-white">ابدأ الآن</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
