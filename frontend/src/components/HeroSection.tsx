import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';

const stats = [
  { value: '٢,٥٠٠+', label: 'عقار متاح' },
  { value: '١٠,٠٠٠+', label: 'طالب مسجل' },
  { value: '١٥+', label: 'مدينة' },
  { value: '٩٨٪', label: 'نسبة الرضا' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            منصة سكن الطلاب الأولى في المنطقة
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            <span className="bg-gradient-to-l from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
              ابحث عن سكنك
            </span>
            <br />
            <span className="text-white/90">المثالي بسهولة</span>
          </h1>

          <p className="text-lg md:text-xl text-purple-200/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            منصة Skan تربط بين الطلاب والمالكين مباشرة. ابحث عن العقار المناسب، ادفع العمولة، واحصل على عقدك في دقائق.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-l from-purple-500 to-pink-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <Search size={20} />
              ابدأ البحث الآن
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how"
              className="px-8 py-4 rounded-2xl border border-purple-500/20 text-purple-300 hover:bg-purple-500/10 transition-colors font-medium"
            >
              كيف يعمل؟
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10"
              >
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-purple-300/50 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
