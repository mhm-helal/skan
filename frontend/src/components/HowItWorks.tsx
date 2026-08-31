import { motion } from 'framer-motion';
import { Search, CreditCard, FileText } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'ابحث عن السكن',
    description: 'تصفح مئات العقارات المتاحة واختر ما يناسب احتياجاتك وميزانيتك.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: CreditCard,
    title: 'ادفع العمولة',
    description: 'ادفع عمولة الوساطة بأمان عبر المنصة. المبلغ ثابت وواضح.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: FileText,
    title: 'احصل على العقد',
    description: 'استلم عقد الإيجار مباشرة من المالك وابدأ سكنك بكل راحة.',
    color: 'from-indigo-500 to-blue-500',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
            كيف{' '}
            <span className="bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
              يعمل؟
            </span>
          </h2>
          <p className="text-purple-300/50 max-w-lg mx-auto">
            ثلاث خطوات بسيطة للحصول على سكنك المثالي
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -8 }}
                className="relative p-8 rounded-3xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all group"
              >
                <div className="absolute top-4 left-4 text-6xl font-black text-purple-500/5">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white/90 mb-3">{step.title}</h3>
                <p className="text-purple-300/50 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
