import { useEffect, useState, lazy, Suspense } from 'react';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import HowItWorks from '../components/HowItWorks';
import SearchFilters from '../components/SearchFilters';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import OwnersCTA from '../components/OwnersCTA';
import api from '../api';
import type { Property } from '../types';

const PropertyCard = lazy(() => import('../components/PropertyCard'));
const MapSearch = lazy(() => import('../components/MapSearch'));

const FALLBACK_PROPERTIES: Property[] = [
  {
    id: 1, title: 'شقة سكنية حديثة', address: 'التجمع الخامس، القاهرة الجديدة', city: 'القاهرة الجديدة',
    price: 8200, image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    rooms: 3, bathrooms: 2, area: 120, tags: ['حديثة', 'مفروشة', 'أمن 24 ساعة'],
    owner_name: 'أحمد محمد', owner_phone: '01012345678',
    description: 'شقة سكنية حديثة بإطلالة رائعة على المدينة', is_available: true,
  },
  {
    id: 2, title: 'أستوديو راقٍ', address: 'شارع النزهة، مدينة الشروق', city: 'مدينة الشروق',
    price: 5000, image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    rooms: 1, bathrooms: 1, area: 55, tags: ['أستوديو', 'أنيق', 'قريب من المترو'],
    owner_name: 'فاطمة علي', owner_phone: '01098765432',
    description: 'أستوديو أنيق مثالي للطلاب والأفراد', is_available: true,
  },
  {
    id: 3, title: 'شقة بغرفتين وشرفة', address: 'المنصورة الجديدة، مدينة بدر', city: 'مدينة بدر',
    price: 6500, image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    rooms: 2, bathrooms: 1, area: 85, tags: ['شرفة', 'مطبخ مجهز', 'حديقة'],
    owner_name: 'محمد حسن', owner_phone: '01155544433',
    description: 'شقة واسعة بشرفة تطل على الحديقة', is_available: true,
  },
  {
    id: 4, title: 'شقة فاخرة بالكامل', address: 'Fifth Settlement، القاهرة الجديدة', city: 'القاهرة الجديدة',
    price: 12000, image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    rooms: 4, bathrooms: 3, area: 200, tags: ['فاخرة', 'جاكوزي', 'حديقة خاصة'],
    owner_name: 'خالد عبدالله', owner_phone: '01288877766',
    description: 'شقة فاخرة في كومباوند راقي', is_available: true,
  },
  {
    id: 5, title: 'غرفة مشتركة للطلاب', address: 'شارع جامعة الدول العربية، الشروق', city: 'الشروق',
    price: 2200, image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    rooms: 1, bathrooms: 1, area: 25, tags: ['مشتركة', 'للطلاب', 'مدربة'],
    owner_name: 'سارة إبراهيم', owner_phone: '01033322211',
    description: 'غرفة مشتركة مثالية للطلاب', is_available: true,
  },
  {
    id: 6, title: 'شقة عائلية واسعة', address: 'مدينتي، Fifth Settlement', city: 'مدينتي',
    price: 9800, image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    rooms: 3, bathrooms: 2, area: 150, tags: ['عائلية', 'واسعة', 'حديقة', 'موقف سيارات'],
    owner_name: 'عمر السيد', owner_phone: '01199988877',
    description: 'شقة عائلية واسعة في كومباوند مدينتي', is_available: true,
  },
];

export default function HomeContent() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    api.get('/api/properties').then((res) => {
      setProperties(Array.isArray(res.data) ? res.data.slice(0, 6) : []);
    }).catch(() => {
      setProperties(FALLBACK_PROPERTIES);
    });
  }, []);

  return (
    <>
      <HeroSection />

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <SearchFilters />
        </div>
      </section>

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
        <MapSearch />
      </Suspense>

      <HowItWorks />

      <TestimonialsSection />

      <FAQSection />

      <OwnersCTA />
    </>
  );
}
