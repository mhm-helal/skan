import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Maximize } from 'lucide-react';
import type { Property } from '../types';

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/properties/${property.id}`} className="block">
        <div className="relative rounded-2xl overflow-hidden border border-purple-500/10 bg-purple-500/5 hover:border-purple-500/30 transition-all duration-300">
          <div className="relative h-48 overflow-hidden">
            <img
              src={property.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0514] via-transparent to-transparent" />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-purple-500/80 backdrop-blur-sm text-white text-xs font-bold">
              {property.city}
            </div>
            {property.is_available === 0 && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-500/80 backdrop-blur-sm text-white text-xs font-bold">
                غير متاح
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-bold text-white/90 mb-2 group-hover:text-purple-300 transition-colors">
              {property.title}
            </h3>
            <p className="text-sm text-purple-300/40 mb-3 line-clamp-1">{property.address}</p>

            <div className="flex items-center gap-4 text-sm text-purple-300/50 mb-3">
              <span className="flex items-center gap-1">
                <BedDouble size={14} />
                {property.rooms} غرف
              </span>
              <span className="flex items-center gap-1">
                <Bath size={14} />
                {property.bathrooms} حمام
              </span>
              <span className="flex items-center gap-1">
                <Maximize size={14} />
                {property.area} م²
              </span>
            </div>

            {property.tags && property.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {property.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300/60 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-purple-500/10">
              <span className="text-xl font-black bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {property.price.toLocaleString('ar-EG')} ج.م
              </span>
              <span className="text-xs text-purple-300/40">شهرياً</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
