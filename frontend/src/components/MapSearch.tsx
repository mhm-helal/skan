import { useState, useEffect } from 'react';
import { MapPin, BedDouble, Maximize, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import type { Property } from '../types';

const FALLBACK_PROPERTIES: Property[] = [
  { id: 1, title: 'شقة سكنية حديثة', address: 'التجمع الخامس', city: 'القاهرة الجديدة', price: 8200, image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', rooms: 3, bathrooms: 2, area: 120, tags: [], owner_name: '', owner_phone: '', description: '', is_available: true },
  { id: 2, title: 'أستوديو راقٍ', address: 'شارع النزهة', city: 'مدينة الشروق', price: 5000, image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', rooms: 1, bathrooms: 1, area: 55, tags: [], owner_name: '', owner_phone: '', description: '', is_available: true },
  { id: 3, title: 'شقة بغرفتين وشرفة', address: 'المنصورة الجديدة', city: 'مدينة بدر', price: 6500, image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', rooms: 2, bathrooms: 1, area: 85, tags: [], owner_name: '', owner_phone: '', description: '', is_available: true },
  { id: 4, title: 'شقة فاخرة', address: 'Fifth Settlement', city: 'القاهرة الجديدة', price: 12000, image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', rooms: 4, bathrooms: 3, area: 200, tags: [], owner_name: '', owner_phone: '', description: '', is_available: true },
  { id: 5, title: 'غرفة مشتركة', address: 'شارع جامعة الدول', city: 'الشروق', price: 2200, image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400', rooms: 1, bathrooms: 1, area: 25, tags: [], owner_name: '', owner_phone: '', description: '', is_available: true },
  { id: 6, title: 'شقة عائلية واسعة', address: 'مدينتي', city: 'مدينتي', price: 9800, image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', rooms: 3, bathrooms: 2, area: 150, tags: [], owner_name: '', owner_phone: '', description: '', is_available: true },
];

const PIN_POSITIONS = [
  { x: 25, y: 30 }, { x: 60, y: 20 }, { x: 40, y: 55 },
  { x: 75, y: 45 }, { x: 15, y: 65 }, { x: 55, y: 75 },
];

export default function MapSearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/api/properties').then((res) => {
      setProperties(Array.isArray(res.data) ? res.data.slice(0, 6) : FALLBACK_PROPERTIES);
    }).catch(() => setProperties(FALLBACK_PROPERTIES));
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
            ابحث على{' '}
            <span className="bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
              الخريطة
            </span>
          </h2>
          <p className="text-purple-300/50">استكشف العقارات بالموقع على الخريطة</p>
        </div>

        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => setView('map')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === 'map' ? 'bg-purple-500/20 text-purple-300' : 'text-purple-300/40 hover:text-purple-300/60'}`}
          >
            <MapPin size={14} className="inline ml-1" /> خريطة
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === 'list' ? 'bg-purple-500/20 text-purple-300' : 'text-purple-300/40 hover:text-purple-300/60'}`}
          >
            قائمة
          </button>
        </div>

        {view === 'map' ? (
          <div className="relative rounded-3xl overflow-hidden border border-purple-500/10" style={{ height: '500px' }}>
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(135deg, #0a0514 0%, #1a0a2e 50%, #0d0720 100%)',
              backgroundImage: `
                linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }} />

            {properties.map((property, i) => {
              const pos = PIN_POSITIONS[i % PIN_POSITIONS.length];
              return (
                <div
                  key={property.id}
                  className="absolute z-10"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                  onMouseEnter={() => setHoveredId(property.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="relative cursor-pointer"
                  >
                    <div className="w-3 h-3 rounded-full bg-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-purple-500/30 animate-ping" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-lg bg-[#0a0514] border border-purple-500/20 text-xs text-purple-300 font-bold">
                      {property.price.toLocaleString('ar-EG')} ج.م
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {hoveredId === property.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-8 left-1/2 -translate-x-1/2 w-56 p-3 rounded-2xl bg-[#0f0a24] border border-purple-500/20 shadow-xl z-20"
                      >
                        <img
                          src={property.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}
                          alt={property.title}
                          className="w-full h-28 object-cover rounded-xl mb-2"
                        />
                        <h4 className="font-bold text-white/90 text-sm truncate">{property.title}</h4>
                        <p className="text-xs text-purple-300/40 truncate">{property.address}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-purple-300">{property.price.toLocaleString('ar-EG')} ج.م</span>
                          <span className="flex items-center gap-1 text-xs text-purple-300/40">
                            <BedDouble size={10} /> {property.rooms}
                          </span>
                        </div>
                        <Link
                          to={`/properties/${property.id}`}
                          className="block mt-2 text-center py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-colors"
                        >
                          عرض التفاصيل
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-[#0a0514]/80 backdrop-blur border border-purple-500/10 text-xs text-purple-300/50">
              {properties.length} عقار متاح
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="flex gap-3 p-3 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all group"
              >
                <img
                  src={property.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}
                  alt={property.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white/90 text-sm truncate group-hover:text-purple-300 transition-colors">{property.title}</h4>
                  <p className="text-xs text-purple-300/40 truncate">{property.address}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-bold text-purple-300">{property.price.toLocaleString('ar-EG')} ج.م</span>
                    <span className="flex items-center gap-1 text-xs text-purple-300/40">
                      <BedDouble size={10} /> {property.rooms} غرف
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
