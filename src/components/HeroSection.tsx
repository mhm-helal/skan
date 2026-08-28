"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MapPin, Star, Users, Building2 } from "lucide-react";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-fuchsia-600/15 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/8 blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div style={{ y: y1, opacity, scale }} className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 pt-24">
        {/* Badge */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-2 backdrop-blur-md"
        >
          <Star size={14} className="text-fuchsia-400" />
          <span className="text-xs font-bold text-fuchsia-300">منصة سكن الطلاب الأولى في مصر</span>
        </motion.div>

        {/* Main heading - marquee style */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative mb-6 text-center"
        >
          <h1 className="text-6xl font-black leading-tight text-white sm:text-8xl md:text-9xl">
            <span className="block bg-gradient-to-r from-fuchsia-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Skan
            </span>
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mx-auto mt-2 h-1 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500"
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-8 max-w-2xl text-center text-lg text-white/50 sm:text-xl"
        >
          ابحث عن سكنك بسهولة — شقق موثقة، صور حقيقية، مجسمات ثلاثية الأبعاد،
          <br className="hidden sm:block" />
          وكل التفاصيل قبل ما تحجز
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mb-16 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#properties"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-8 py-4 font-bold text-white shadow-lg shadow-fuchsia-500/25 transition hover:shadow-fuchsia-500/40"
          >
            <span className="relative z-10">تصفح الشقق</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-fuchsia-500 opacity-0 transition group-hover:opacity-100" />
          </a>
          <a
            href="#how"
            className="rounded-full border border-white/20 px-8 py-4 font-bold text-white/70 transition hover:border-fuchsia-400/50 hover:text-white"
          >
            كيف يعمل؟
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex items-center gap-8 text-center"
        >
          {[
            { icon: Building2, value: "+500", label: "شقة متاحة" },
            { icon: Users, value: "+10K", label: "طالب مسجل" },
            { icon: MapPin, value: "+20", label: "مدينة" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <stat.icon size={18} className="text-fuchsia-400/60" />
              <span className="text-2xl font-black text-white">{stat.value}</span>
              <span className="text-xs text-white/40">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/30">اسحب للأسفل</span>
          <ArrowDown size={16} className="text-fuchsia-400/50" />
        </motion.div>
      </motion.div>

      {/* Decorative floating elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-fuchsia-500/20"
          initial={{
            x: 100 + i * 200,
            y: 200 + i * 100,
          }}
          animate={{
            y: [null, 100 + i * 50, 200 + i * 100],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </section>
  );
}
