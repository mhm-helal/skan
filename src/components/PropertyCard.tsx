"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import type { Property } from "@/lib/properties";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5 }}
      className="group overflow-hidden rounded-3xl border border-black/5 bg-white/70 shadow-xl backdrop-blur-md transition duration-500 hover:border-fuchsia-300/70 hover:shadow-2xl hover:shadow-fuchsia-500/25 dark:border-white/10 dark:bg-white/5"
    >
      <div className="relative h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.15] group-hover:rotate-[1.5deg]"
          loading="lazy"
        />
        {/* soft reveal gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        {/* light sweep */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
        <div className="absolute right-3 top-3 flex flex-wrap gap-2">
          {property.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full bg-fuchsia-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="absolute bottom-3 left-3 rounded-2xl bg-white/90 px-3 py-1.5 text-lg font-black text-fuchsia-600 shadow backdrop-blur dark:bg-black/70 dark:text-fuchsia-300">
          {property.price.toLocaleString()} ج.م
          <span className="text-xs font-medium text-black/60 dark:text-white/60">
            {" "}
            /شهر
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="hover-glow text-xl font-bold text-foreground dark:text-white">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-black/60 dark:text-white/60">
          <MapPin size={14} /> {property.city} - {property.address}
        </p>

        <div className="mt-4 flex items-center gap-4 border-t border-black/10 pt-4 text-sm text-black/70 dark:border-white/10 dark:text-white/70">
          <span className="flex items-center gap-1.5">
            <BedDouble size={16} className="text-fuchsia-500" />
            {property.rooms} غرف
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={16} className="text-orange-400" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize size={16} className="text-sky-500" />
            {property.area} م²
          </span>
        </div>

        <Link
          href={`/properties/${property.id}`}
          className="mt-5 block w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-orange-400 py-3 text-center font-bold text-white shadow-lg transition hover:shadow-fuchsia-500/40"
        >
          شاهد الشقة
        </Link>
      </div>
    </motion.article>
  );
}
