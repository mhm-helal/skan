"use client";

import { motion } from "framer-motion";

export default function SkanLogo({ size = 60, animate = false }: { size?: number; animate?: boolean }) {
  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? { whileHover: { scale: 1.1, rotate: -5 }, transition: { type: "spring", stiffness: 300 } }
    : {};

  return (
    // @ts-expect-error motion div props
    <Wrapper {...wrapperProps} className="inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* House body */}
        <rect x="20" y="45" width="60" height="40" rx="6" fill="url(#houseGrad)" />

        {/* Roof */}
        <path d="M15 48 L50 18 L85 48" stroke="url(#roofGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Door */}
        <rect x="40" y="60" width="20" height="25" rx="3" fill="#1a1033" />
        <circle cx="55" cy="73" r="2" fill="#c084fc" />

        {/* Windows - eyes */}
        <rect x="27" y="52" width="12" height="10" rx="2" fill="#1a1033" />
        <rect x="61" y="52" width="12" height="10" rx="2" fill="#1a1033" />

        {/* Window glow */}
        <rect x="28" y="53" width="10" height="8" rx="1.5" fill="#c084fc" opacity="0.8" />
        <rect x="62" y="53" width="10" height="8" rx="1.5" fill="#f472b6" opacity="0.8" />

        {/* Eye pupils */}
        <circle cx="33" cy="57" r="2" fill="white" />
        <circle cx="67" cy="57" r="2" fill="white" />

        {/* Chimney */}
        <rect x="65" y="25" width="8" height="18" rx="2" fill="#6d28d9" />

        {/* Heart above door */}
        <path d="M47 42 C47 39, 43 37, 43 40 C43 43, 47 46, 50 48 C53 46, 57 43, 57 40 C57 37, 53 39, 53 42 L50 46 Z" fill="#f472b6" opacity="0.9" />

        <defs>
          <linearGradient id="houseGrad" x1="20" y1="45" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7c3aed" />
            <stop offset="1" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id="roofGrad" x1="15" y1="18" x2="85" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c084fc" />
            <stop offset="1" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>
    </Wrapper>
  );
}
