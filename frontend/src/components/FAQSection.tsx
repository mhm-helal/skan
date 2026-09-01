import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "كيف يعمل موقع Skan؟",
    answer:
      "Skan منصة إلكترونية تربط الطلاب بالبائعين. تتصفح العقارات، تختار اللي يناسبك، تدفع عمولة التوكيل، وتحصل على بيانات المالك للتواصل مباشرة.",
  },
  {
    question: "كم العمولة؟",
    answer:
      "العمولة ثابتة 1,000 ج.م فقط. هذا المبلغ يشمل ربطك بالمالك وفتح جميع بيانات التواصل.",
  },
  {
    question: "هل العقارات موثقة؟",
    answer:
      "نعم، جميع العقارات التي تظهر على المنصة تم مراجعتها والتحقق من ملكية المالك لها.",
  },
  {
    question: "هل أستطيع حجز أكثر من عقار؟",
    answer:
      "يمكنك التعبير عن اهتمامك بعدة عقارات، لكن يتم فتح بيانات مالك واحد فقط بعد الدفع.",
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer:
      "نقبل التحويل البنكي (CIB) و instapay وفوري. يمكنك رفع إيصال الدفع وموافقته من الإدارة.",
  },
  {
    question: "هل يمكنني إلغاء الحجز؟",
    answer:
      "يمكنك إلغاء الحجز قبل الموافقة على الدفع. بعد الدفع والموافقة، لا يمكن إلغاء العملية.",
  },
  {
    question: "كيف أتأكد من جودة العقار؟",
    answer:
      "ننصح بزيارة العقار شخصياً قبل الحجز. كما يمكنك الاطلاع على التقييمات والمراجعات من طلاب آخرين.",
  },
  {
    question: "هل الموقع آمن لبياناتي؟",
    answer:
      "نعم، نستخدم تشفير SSL لحماية جميع بياناتك. لا نشارك معلوماتك مع أي طرف ثالث.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-16" dir="rtl">
      <h2 className="text-3xl font-bold text-white text-center mb-10">
        الأسئلة الشائعة
      </h2>

      <div className="flex flex-col gap-4">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="bg-purple-500/5 border border-purple-500/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-5 text-right cursor-pointer"
              >
                <span className="text-white/90 font-medium text-lg">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 mr-3"
                >
                  <ChevronDown className="w-5 h-5 text-purple-300/50" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 text-purple-300/50 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
