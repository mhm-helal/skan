"use client";

import { motion } from "framer-motion";
import { Home, Building2, ShieldCheck, Phone, User, LogIn } from "lucide-react";
import { useUser } from "@/lib/useUser";
import Link from "next/link";

const navItems = [
  { icon: Home, label: "الرئيسية", href: "/#hero" },
  { icon: Building2, label: "الشقق", href: "/#properties" },
  { icon: ShieldCheck, label: "كيف يعمل", href: "/#how" },
  { icon: Phone, label: "تواصل", href: "/#contact" },
];

export default function DockNav() {
  const { user } = useUser();

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#1a1033]/80 px-3 py-2 shadow-2xl backdrop-blur-xl">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group relative flex flex-col items-center gap-1 rounded-full px-4 py-2 transition hover:bg-white/10"
          >
            <item.icon size={20} className="text-white/60 transition group-hover:text-fuchsia-400" />
            <span className="text-[10px] font-bold text-white/40 transition group-hover:text-fuchsia-400">
              {item.label}
            </span>
          </a>
        ))}

        <div className="mx-1 h-6 w-px bg-white/10" />

        {user ? (
          <Link
            href="/admin"
            className="group flex flex-col items-center gap-1 rounded-full px-4 py-2 transition hover:bg-white/10"
          >
            <User size={20} className="text-white/60 transition group-hover:text-fuchsia-400" />
            <span className="text-[10px] font-bold text-white/40 transition group-hover:text-fuchsia-400">
              حسابي
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="group flex flex-col items-center gap-1 rounded-full px-4 py-2 transition hover:bg-white/10"
          >
            <LogIn size={20} className="text-white/60 transition group-hover:text-fuchsia-400" />
            <span className="text-[10px] font-bold text-white/40 transition group-hover:text-fuchsia-400">
             دخول
            </span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
