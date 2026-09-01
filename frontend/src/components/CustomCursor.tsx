import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const houseRef = useRef<SVGSVGElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > 768 && !('ontouchstart' in window));
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const move = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    const interactiveSelector = 'a, button, input, textarea, select, [role="button"]';
    const onEnter = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest(interactiveSelector)) {
        setHovered(true);
      }
    };
    const onLeave = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest(interactiveSelector)) {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.addEventListener('mouseenter', onEnter, true);
    document.addEventListener('mouseleave', onLeave, true);

    let raf: number;
    const animate = () => {
      dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.35;
      dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.35;
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px) scale(${clicking ? 0.6 : 1})`;
      }
      if (ringRef.current) {
        const rs = hovered ? 28 : 22;
        ringRef.current.style.transform = `translate(${ringPos.current.x - rs}px, ${ringPos.current.y - rs}px) scale(${clicking ? 0.8 : 1})`;
        ringRef.current.style.width = `${rs * 2}px`;
        ringRef.current.style.height = `${rs * 2}px`;
      }
      if (houseRef.current) {
        const hs = clicking ? 42 : hovered ? 36 : 30;
        houseRef.current.style.transform = `translate(${mouse.current.x - hs / 2}px, ${mouse.current.y - hs / 2}px) scale(${clicking ? 0.8 : 1}) rotate(${hovered ? -10 : 0}deg)`;
        houseRef.current.style.width = `${hs}px`;
        houseRef.current.style.height = `${hs}px`;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.removeEventListener('mouseenter', onEnter, true);
      document.removeEventListener('mouseleave', onLeave, true);
      cancelAnimationFrame(raf);
    };
  }, [isDesktop, hovered, clicking]);

  if (!isDesktop) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0"
        style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'linear-gradient(135deg, #e879f9, #a855f7)',
          boxShadow: '0 0 8px rgba(168,85,247,0.6), 0 0 16px rgba(168,85,247,0.3)',
          willChange: 'transform', zIndex: 99999,
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0"
        style={{
          width: 44, height: 44, borderRadius: '50%',
          border: `2px solid rgba(168,85,247,${hovered ? 0.5 : 0.25})`,
          boxShadow: hovered ? '0 0 20px rgba(168,85,247,0.25)' : 'none',
          willChange: 'transform', zIndex: 99998,
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      />
      <svg
        ref={houseRef}
        className="pointer-events-none fixed top-0 left-0"
        style={{
          width: 30, height: 30, zIndex: 99999,
          willChange: 'transform',
          filter: 'drop-shadow(0 2px 6px rgba(168,85,247,0.5))',
        }}
        viewBox="0 0 64 64"
        fill="none"
      >
        <defs>
          <linearGradient id="hg1" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="hg2" x1="10" y1="0" x2="54" y2="24">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="hg3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <radialGradient id="hg4" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <filter id="hs">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#7c3aed" floodOpacity="0.4" />
          </filter>
        </defs>
        <path d="M6 28L32 6L58 28Z" fill="url(#hg2)" filter="url(#hs)" />
        <path d="M58 28L56 26L32 6Z" fill="#9333ea" opacity="0.5" />
        <path d="M6 28L32 6" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect x="14" y="28" width="36" height="26" rx="2" fill="url(#hg1)" filter="url(#hs)" />
        <rect x="25" y="38" width="14" height="16" rx="2" fill="#1e1b4b" />
        <circle cx="36" cy="46" r="1.5" fill="url(#hg3)">
          <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="36" cy="46" r="4" fill="url(#hg4)" opacity="0.4">
          <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
        <rect x="17" y="32" width="7" height="7" rx="1" fill="#1e1b4b" />
        <rect x="17.5" y="32.5" width="6" height="6" rx="0.5" fill="url(#hg3)" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.5;0.8" dur="4s" repeatCount="indefinite" />
        </rect>
        <line x1="20.5" y1="32.5" x2="20.5" y2="38.5" stroke="#1e1b4b" strokeWidth="1" />
        <line x1="17.5" y1="35.5" x2="23.5" y2="35.5" stroke="#1e1b4b" strokeWidth="1" />
        <rect x="40" y="32" width="7" height="7" rx="1" fill="#1e1b4b" />
        <rect x="40.5" y="32.5" width="6" height="6" rx="0.5" fill="url(#hg3)" opacity="0.8">
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3.5s" repeatCount="indefinite" />
        </rect>
        <line x1="43.5" y1="32.5" x2="43.5" y2="38.5" stroke="#1e1b4b" strokeWidth="1" />
        <line x1="40.5" y1="35.5" x2="46.5" y2="35.5" stroke="#1e1b4b" strokeWidth="1" />
        <circle cx="20.5" cy="35.5" r="6" fill="none" stroke="rgba(251,191,36,0.12)" strokeWidth="0.5" />
        <circle cx="43.5" cy="35.5" r="6" fill="none" stroke="rgba(251,191,36,0.12)" strokeWidth="0.5" />
        <rect x="44" y="10" width="6" height="16" rx="1" fill="#6d28d9" />
        <rect x="43" y="8" width="8" height="3" rx="1" fill="#7c3aed" />
        <circle cx="47" cy="6" r="2" fill="rgba(168,85,247,0.25)">
          <animate attributeName="cy" values="6;-2;-8" dur="3s" repeatCount="indefinite" />
          <animate attributeName="r" values="2;3;1" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.1;0" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="49" cy="4" r="1.5" fill="rgba(168,85,247,0.2)">
          <animate attributeName="cy" values="4;-4;-10" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;2.5;0.5" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.08;0" dur="4s" repeatCount="indefinite" />
        </circle>
        <rect x="12" y="54" width="40" height="3" rx="1" fill="#4c1d95" />
      </svg>
    </>
  );
}
