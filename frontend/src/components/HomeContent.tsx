import { useEffect, useState, lazy, Suspense } from 'react';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import HowItWorks from '../components/HowItWorks';
import OwnersCTA from '../components/OwnersCTA';
import api from '../api';
import type { Property } from '../types';

const PropertyCard = lazy(() => import('../components/PropertyCard'));
const Scene3D = lazy(() => import('../components/Scene3D'));

export default function HomeContent() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    api.get('/api/properties').then((res) => {
      setProperties(Array.isArray(res.data) ? res.data.slice(0, 6) : []);
    }).catch(() => {});
  }, []);

  return (
    <>
      <HeroSection />
      <StatsSection />

      {properties.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
                أحدث{' '}
                <span className="bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  العقارات
                </span>
              </h2>
              <p className="text-purple-300/50">اكتشف أفضل العقارات المتاحة حالياً</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Suspense fallback={<div className="h-64 bg-purple-500/5 rounded-2xl animate-pulse" />}>
                {properties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </Suspense>
            </div>
          </div>
        </section>
      )}

      <Suspense fallback={<div className="py-20 text-center text-purple-300/30">جاري التحميل...</div>}>
        <Scene3D />
      </Suspense>
      <HowItWorks />
      <OwnersCTA />
    </>
  );
}
