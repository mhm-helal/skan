import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, TrendingUp, Shield } from 'lucide-react';

export default function OwnersCTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-8 md:p-12 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-purple-600/20 to-pink-600/20" />
          <div className="absolute inset-0 border border-purple-500/20 rounded-3xl" />

          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
              أنت{' '}
              <span className="bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
                مالك عقار؟
              </span>
            </h2>
            <p className="text-purple-300/50 max-w-lg mx-auto mb-8">
              انشر عقارك على Skan وصل إلى آلاف الطلاب الباحثين عن سكن. بدون عمولات إضافية.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {[
                { icon: Home, text: 'نشر مجاني' },
                { icon: TrendingUp, text: 'وصول مباشر للطلاب' },
                { icon: Shield, text: 'معاملات آمنة' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-2 text-purple-300/60">
                    <Icon size={18} />
                    <span className="text-sm">{item.text}</span>
                  </div>
                );
              })}
            </div>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-l from-purple-500 to-pink-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              ابدأ الآن مجاناً
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
