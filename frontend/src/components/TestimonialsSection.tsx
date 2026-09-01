import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'أحمد علي',
    university: 'جامعة القاهرة - السنة الرابعة',
    quote: 'لقيت شقتي في يوم واحد بس! الموقع سهل جداً والعمولة معقولة مقارنة بشركات الإيجار',
    rating: 5,
  },
  {
    name: 'سارة محمد',
    university: 'جامعة عين شمس - السنة الثالثة',
    quote: 'أفضل منصة سكن شفتها. كل حاجة واضحة ومفيش مفاجآت. التقييمات ساعدتني جداً',
    rating: 5,
  },
  {
    name: 'محمد حسن',
    university: 'الجامعة الأمريكية - السنة الثانية',
    quote: 'كنت قلقان أوي من موضوع السكن برا الجامعة بس Skan خلاني مطمن. كل العقارات موثقة',
    rating: 5,
  },
  {
    name: 'فاطمة أحمد',
    university: 'جامعة المنصورة - السنة الرابعة',
    quote: 'الدفع أونلاين سهل وآمن. حسيت إني مسيطر على الموضوع ومش محتاج حد يسندني',
    rating: 4,
  },
  {
    name: 'عمر سعيد',
    university: 'جامعة حلوان - السنة الثالثة',
    quote: 'بندور على شقة مع صحابي وكلنا لقينا اللي يناسبنا. فعلاً منصة متميزة',
    rating: 5,
  },
  {
    name: 'نورا إبراهيم',
    university: 'طب عين شمس - السنة الخامسة',
    quote: 'الأفضل في مصر بلا منازع. لو طالب وبتدور على سكن، Skan هو اختيارك الأول',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-purple-500/20'}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile || !scrollRef.current) return;

    const container = scrollRef.current;
    let animFrame: number;
    let scrollPos = 0;
    const speed = 0.5;

    const animate = () => {
      scrollPos += speed;
      if (scrollPos >= container.scrollWidth - container.clientWidth) {
        scrollPos = 0;
      }
      container.scrollLeft = scrollPos;
      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isMobile]);

  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
            قالوا{' '}
            <span className="bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
              عنا
            </span>
          </h2>
          <p className="text-purple-300/50 max-w-lg mx-auto">
            آراء طلاب استخدموا Skan للعثور على سكنهم المثالي
          </p>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative min-w-[300px] md:min-w-0 p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all group snap-start flex-shrink-0"
            >
              <div className="absolute top-4 left-4 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                <Quote size={40} />
              </div>

              <div className="relative z-10">
                <StarRating rating={t.rating} />

                <p className="text-white/90 mt-4 mb-6 leading-relaxed text-sm">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white/90 font-semibold text-sm">{t.name}</div>
                    <div className="text-purple-300/50 text-xs">{t.university}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
