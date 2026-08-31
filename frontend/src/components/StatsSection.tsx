import { motion } from 'framer-motion';
import { Building2, Users, MapPin, Star, Shield, Clock } from 'lucide-react';

const stats = [
  { icon: Building2, value: '٢,٥٠٠+', label: 'عقار متاح', color: 'from-purple-500 to-violet-500' },
  { icon: Users, value: '١٠,٠٠٠+', label: 'طالب مسجل', color: 'from-pink-500 to-rose-500' },
  { icon: MapPin, value: '١٥+', label: 'مدينة', color: 'from-indigo-500 to-blue-500' },
  { icon: Star, value: '٤.٨', label: 'متوسط التقييم', color: 'from-amber-500 to-yellow-500' },
  { icon: Shield, value: '١٠٠٪', label: 'معاملات آمنة', color: 'from-green-500 to-emerald-500' },
  { icon: Clock, value: '٢٤ ساعة', label: 'سرعة الاستجابة', color: 'from-cyan-500 to-teal-500' },
];

export default function StatsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
            أرقام تتحدث عن{' '}
            <span className="bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
              نجاحنا
            </span>
          </h2>
          <p className="text-purple-300/50 max-w-lg mx-auto">
            نفخر بخدمة آلاف الطلاب في العثور على سكنهم المناسب
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10 group overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className="text-xl font-bold text-white/90 mb-1">{stat.value}</div>
                <div className="text-xs text-purple-300/50">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
