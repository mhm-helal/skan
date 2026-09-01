import { motion } from 'framer-motion';
import { Search, CreditCard, FileText, MessageCircle, Shield, Home } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'ابحث عن سكنك',
    description: 'تصفح مئات العقارات المتاحة بالصور والتفاصيل والتقييمات. استخدم البحث المتقدم للعثور على ما يناسبك.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: Home,
    number: '02',
    title: 'اختار عقارك',
    description: 'قارن بين الخيارات، شاهد تقييمات الطلاب السابقين، واطمن على جودة العقار من خلال التفاصيل الكاملة.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: CreditCard,
    number: '03',
    title: 'ادفع بأمان',
    description: 'ادفع عمولة التوكيل 1,000 ج.م فقط عبر تحويل بنكي أو instapay أو فوري. كل المعاملات آمنة ومحمية.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: MessageCircle,
    number: '04',
    title: 'تواصل مع المالك',
    description: ' بعد تأكيد الدفع، تحصل على بيانات المالك الكاملة وتتواصل معاه مباشرة لترتيب الزيارة والعقد.',
    color: 'from-green-500 to-emerald-500',
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Shield size={16} className="text-purple-400" />
            <span className="text-sm text-purple-300/70">آمن وموثوق</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
            كيف{' '}
            <span className="bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
              يعمل؟
            </span>
          </h2>
          <p className="text-purple-300/50 max-w-lg mx-auto">
            أربع خطوات بسيطة للحصول على سكنك المثالي
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="relative p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all group"
              >
                <div className="absolute top-3 left-3 text-5xl font-black text-purple-500/5">
                  {step.number}
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white/90 mb-2">{step.title}</h3>
                <p className="text-sm text-purple-300/50 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-purple-300/30 text-sm">
            المعاملات آمنة 100% · الدفع محمي · البيانات مشفّرة
          </p>
        </motion.div>
      </div>
    </section>
  );
}
