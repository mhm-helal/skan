"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const dotX = useSpring(x, { stiffness: 1800, damping: 100, mass: 0.1 });
  const dotY = useSpring(y, { stiffness: 1800, damping: 100, mass: 0.1 });

  const ringX = useSpring(x, { stiffness: 300, damping: 22, mass: 0.3 });
  const ringY = useSpring(y, { stiffness: 300, damping: 22, mass: 0.3 });

  useEffect(() => {
    if (isTouch) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as Element | null;
      setHovering(
        !!t?.closest(
          "a, button, [data-cursor='hover'], input, select, textarea, [role='button']"
        )
      );
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y, isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* الحلقة OUTER */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovering ? 36 : 24,
          height: hovering ? 36 : 24,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            border: `1.5px solid ${
              hovering
                ? "rgba(236,72,153,0.8)"
                : "rgba(168,85,247,0.4)"
            }`,
            transition: "border-color 0.2s",
          }}
        />
      </motion.div>

      {/* النقطة.CENTER */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          animate={{
            width: hovering ? 6 : 4,
            height: hovering ? 6 : 4,
          }}
          transition={{ duration: 0.15 }}
          className="rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-400"
          style={{
            boxShadow: hovering
              ? "0 0 10px rgba(236,72,153,0.7), 0 0 20px rgba(168,85,247,0.3)"
              : "0 0 6px rgba(168,85,247,0.5)",
          }}
        />
      </motion.div>
    </>
  );
}
