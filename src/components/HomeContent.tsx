"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Sparkles, CalendarCheck, ShieldCheck, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import dynamic from "next/dynamic";
import type { Property } from "@/lib/properties";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

const steps = [
  {
    icon: Search,
    title: "ابحث عن سكنك",
    desc: "تصفح الشقق بالصور والمجسمات ثلاثية الأبعاد الحقيقية.",
    color: "from-fuchsia-500 to-pink-400",
  },
  {
    icon: Sparkles,
    title: "ادفع رسوم الوساطة",
    desc: "ادفع رسوم الوساطة لمرة واحدة واحصل على رقم المالك.",
    color: "from-orange-400 to-amber-300",
  },
  {
    icon: CalendarCheck,
    title: "احجز وتعاقد",
    desc: "تقابل المالك، تعاين، وتوافق على العقد مباشرة.",
    color: "from-sky-400 to-cyan-300",
  },
];

export default function HomeContent({ properties }: { properties: Property[] }) {
  const howRef = useRef<HTMLDivElement>(null);
  const howInView = useInView(howRef, { once: true, margin: "-100px" });

  const ownersRef = useRef<HTMLDivElement>(null);
  const ownersInView = useInView(ownersRef, { once: true, margin: "-100px" });

  return (
    <>
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Stats */}
      <StatsSection />

      {/* 3D Room Preview */}
      <section className="relative bg-background py-24">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/8 blur-[150px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-fuchsia-400">
              جولة ثلاثية الأبعاد
            </span>
            <h2 className="mt-2 text-4xl font-black text-white">تفرج على الشقة من جوا</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/40">
              حرّك بالماوس حول الشقة وتفرج على كل التفاصيل
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Scene3D />
          </motion.div>
        </div>
      </section>

      {/* Properties */}
      <section id="properties" className="relative bg-background py-24">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/5 blur-[150px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-fuchsia-400">
              دليل الشقق
            </span>
            <h2 className="mt-2 text-4xl font-black text-white">أحدث الشقق المتاحة</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/40">
              شقق مختارة بعناية بجوار الجامعات. سعر واضح، صور حقيقية، وكل التفاصيل.
            </p>
          </motion.div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" ref={howRef} className="relative overflow-hidden bg-background py-24">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full bg-fuchsia-600/5 blur-[150px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={howInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-fuchsia-400">
              كيف يعمل؟
            </span>
            <h2 className="mt-2 text-4xl font-black text-white">3 خطوات بسيطة</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={howInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition hover:border-fuchsia-500/20 hover:bg-white/[0.04]"
              >
                <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${step.color} p-3`}>
                  <step.icon size={24} className="text-white" />
                </div>
                <div className="mb-2 text-xs font-bold text-fuchsia-400/60">الخطوة {i + 1}</div>
                <h3 className="mb-2 text-xl font-bold text-white">{step.title}</h3>
                <p className="text-sm leading-7 text-white/40">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Owners CTA */}
      <section id="contact" ref={ownersRef} className="relative overflow-hidden bg-background py-24">
        <div className="absolute inset-0">
          <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-orange-600/5 blur-[150px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ownersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-600/20 via-purple-600/10 to-pink-600/20 p-12 text-center backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center justify-center gap-2 text-2xl font-black text-white">
              <ShieldCheck size={28} className="text-fuchsia-400" />
              أنت مالك وتريد تأجير شقتك؟
            </div>
            <p className="mx-auto mb-8 max-w-lg text-white/50">
              عرض شقتك لدينا. سنقوم بتصويرها والتعامل مع العرض ووصلك بالطلاب.
              سجّلها الآن وابدأ في الحصول على إيجارك.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.a
                href="/register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-white px-8 py-4 font-bold text-fuchsia-600 shadow-xl transition hover:scale-105"
              >
                سجّل شقتك الآن
              </motion.a>
              <a
                href="#"
                className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 font-bold text-white/70 transition hover:border-fuchsia-400/50 hover:text-white"
              >
                <CheckCircle2 size={18} />
                تواصل معنا
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-background py-10 text-center text-sm text-white/30">
        <p>Skan © 2026 — جميع الحقوق محفوظة.</p>
      </footer>
    </>
  );
}
