import { useRef, useState, useEffect, useMemo, lazy, Suspense } from 'react';

const Scene3DHeavy = lazy(() => import('./Scene3DHeavy'));

function LightScene() {
  const circles = useMemo(() =>
    [...Array(20)].map((_, i) => ({
      width: Math.random() * 60 + 20,
      height: Math.random() * 60 + 20,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    })),
  []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
            استكشف{' '}
            <span className="bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
              السكن ثلاثي الأبعاد
            </span>
          </h2>
          <p className="text-purple-300/50">تجربة تفاعلية لاستكشاف غرفة السكن</p>
        </div>
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/10 bg-[#0a0514] h-[300px] md:h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 overflow-hidden">
            {circles.map((c, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-purple-500/10"
                style={{
                  width: `${c.width}px`,
                  height: `${c.height}px`,
                  left: `${c.left}%`,
                  top: `${c.top}%`,
                  animation: `float ${c.duration}s ease-in-out infinite`,
                  animationDelay: `${c.delay}s`,
                }}
              />
            ))}
          </div>
          <div className="relative z-10 text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center animate-float">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <defs>
                  <linearGradient id="houseGrad" x1="0" y1="0" x2="64" y2="64">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <path d="M6 28L32 8L58 28V54C58 55.1 57.1 56 56 56H8C6.9 56 6 55.1 6 54V28Z" fill="url(#houseGrad)" opacity="0.6" />
                <rect x="24" y="36" width="16" height="20" rx="2" fill="#1e1b4b" />
                <circle cx="37" cy="46" r="1.5" fill="#fbbf24" />
                <rect x="12" y="32" width="8" height="8" rx="1" fill="#fbbf24" opacity="0.4" />
                <rect x="44" y="32" width="8" height="8" rx="1" fill="#fbbf24" opacity="0.4" />
              </svg>
            </div>
            <p className="text-purple-300/40 text-sm">تجربة ثلاثية الأبعاد</p>
            <button
              id="scene3d-load-btn"
              className="mt-3 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300/60 text-xs hover:text-purple-300 hover:border-purple-500/40 transition-all"
              onClick={() => {
                const el = document.getElementById('scene3d-container');
                if (el) el.setAttribute('data-load', 'true');
              }}
            >
              اضغط لتحميل المجسم
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Scene3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);

    const handler = () => setLoad(true);
    document.getElementById('scene3d-load-btn')?.addEventListener('click', handler);
    return () => {
      observer.disconnect();
      document.getElementById('scene3d-load-btn')?.removeEventListener('click', handler);
    };
  }, []);

  return (
    <div ref={ref} id="scene3d-container" data-load={load ? 'true' : undefined}>
      {load ? (
        <Suspense fallback={<LightScene />}>
          <Scene3DHeavy />
        </Suspense>
      ) : (
        <LightScene />
      )}
    </div>
  );
}
