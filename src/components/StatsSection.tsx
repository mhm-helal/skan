"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Users, MapPin, Star, TrendingUp, Shield } from "lucide-react";

const stats = [
  { icon: Building2, value: "+500", label: "شقة متاحة", color: "from-fuchsia-500 to-purple-500" },
  { icon: Users, value: "+10,000", label: "طالب مسجل", color: "from-purple-500 to-pink-500" },
  { icon: MapPin, value: "+20", label: "مدينة مصرية", color: "from-pink-500 to-rose-500" },
  { icon: Star, value: "4.9", label: "تقييم الطلاب", color: "from-amber-400 to-orange-500" },
  { icon: TrendingUp, value: "+85%", label: "نسبة الرضا", color: "from-green-400 to-emerald-500" },
  { icon: Shield, value: "100%", label: "شقق موثقة", color: "from-sky-400 to-blue-500" },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-24">
      {/* Background rays */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-fuchsia-600/5 blur-[200px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5">
        {/* Section title */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-black text-white sm:text-5xl">
            أرقامنا بتتكلم
          </h2>
          <p className="mt-3 text-white/40">ن néন statistics وreal-time data</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition hover:border-fuchsia-500/20 hover:bg-white/[0.04]"
            >
              {/* Glow on hover */}
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-fuchsia-500/0 blur-3xl transition group-hover:bg-fuchsia-500/10" />

              <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${stat.color} p-3`}>
                <stat.icon size={24} className="text-white" />
              </div>

              <p className="mb-1 text-4xl font-black text-white">{stat.value}</p>
              <p className="text-sm text-white/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
