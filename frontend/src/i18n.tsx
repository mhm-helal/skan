import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Lang = 'ar' | 'en';

const translations: Record<string, Record<Lang, string>> = {
  'nav.login': { ar: 'تسجيل الدخول', en: 'Login' },
  'nav.register': { ar: 'حساب جديد', en: 'Sign Up' },
  'nav.admin': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'nav.logout': { ar: 'خروج', en: 'Logout' },
  'hero.title1': { ar: 'ابحث عن', en: 'Find Your' },
  'hero.title2': { ar: 'سكنك المثالي', en: 'Perfect Home' },
  'hero.subtitle': { ar: 'منصة Skan تربطك بالعقارات المتاحة للطلاب في مصر. بحث سهل، دفع آمن، تواصل مباشر.', en: 'Skan connects students with available properties in Egypt. Easy search, secure payment, direct contact.' },
  'hero.cta': { ar: 'ابدأ البحث', en: 'Start Searching' },
  'hero.cta2': { ar: 'أنت مالك؟', en: 'Are you a Landlord?' },
  'stats.title': { ar: 'أرقام تتحدث عن', en: 'Numbers That Speak' },
  'stats.title2': { ar: 'نجاحنا', en: 'Our Success' },
  'stats.subtitle': { ar: 'نفخر بخدمة آلاف الطلاب في العثور على سكنهم المناسب', en: 'Proud to serve thousands of students finding their ideal housing' },
  'stats.properties': { ar: 'عقار متاح', en: 'Properties' },
  'stats.students': { ar: 'طالب مسجل', en: 'Students' },
  'stats.cities': { ar: 'مدينة', en: 'Cities' },
  'stats.rating': { ar: 'متوسط التقييم', en: 'Avg Rating' },
  'stats.safe': { ar: 'معاملات آمنة', en: 'Safe Deals' },
  'stats.fast': { ar: 'سرعة الاستجابة', en: 'Fast Response' },
  'search.placeholder': { ar: 'ابحث عن شقة، غرفة، أستوديو...', en: 'Search for apartment, room, studio...' },
  'search.city': { ar: 'المدينة', en: 'City' },
  'search.price': { ar: 'السعر', en: 'Price' },
  'search.rooms': { ar: 'الغرف', en: 'Rooms' },
  'search.btn': { ar: 'بحث', en: 'Search' },
  'search.advanced': { ar: 'بحث متقدم', en: 'Advanced' },
  'latest.title': { ar: 'أحدث', en: 'Latest' },
  'latest.title2': { ar: 'العقارات', en: 'Properties' },
  'latest.subtitle': { ar: 'اكتشف أفضل العقارات المتاحة حالياً', en: 'Discover the best properties available now' },
  'how.title': { ar: 'كيف', en: 'How It' },
  'how.title2': { ar: 'يعمل؟', en: 'Works?' },
  'how.subtitle': { ar: 'أربع خطوات بسيطة للحصول على سكنك المثالي', en: 'Four simple steps to your ideal home' },
  'how.step1': { ar: 'ابحث عن سكنك', en: 'Search Housing' },
  'how.step1d': { ar: 'تصفح مئات العقارات المتاحة بالصور والتفاصيل والتقييمات.', en: 'Browse hundreds of properties with photos, details, and reviews.' },
  'how.step2': { ar: 'اختار عقارك', en: 'Choose Property' },
  'how.step2d': { ar: 'قارن بين الخيارات واطمن على جودة العقار من خلال التفاصيل الكاملة.', en: 'Compare options and verify property quality through full details.' },
  'how.step3': { ar: 'ادفع بأمان', en: 'Pay Securely' },
  'how.step3d': { ar: 'ادفع عمولة التوكيل 1,000 ج.م فقط عبر تحويل بنكي أو instapay أو فوري.', en: 'Pay the 1,000 EGP brokerage fee via bank transfer, instapay, or fawry.' },
  'how.step4': { ar: 'تواصل مع المالك', en: 'Contact Landlord' },
  'how.step4d': { ar: 'بعد تأكيد الدفع، تحصل على بيانات المالك وتتواصل معاه مباشرة.', en: 'After payment confirmation, get landlord details and contact directly.' },
  'map.title': { ar: 'ابحث على', en: 'Search on' },
  'map.title2': { ar: 'الخريطة', en: 'The Map' },
  'map.subtitle': { ar: 'استكشف العقارات بالموقع على الخريطة', en: 'Explore properties by location on the map' },
  'testimonials.title': { ar: 'ماذا يقول', en: 'What Students' },
  'testimonials.title2': { ar: 'الطلاب؟', en: 'Say?' },
  'faq.title': { ar: 'الأسئلة', en: 'Frequently' },
  'faq.title2': { ar: 'الشائعة', en: 'Asked Questions' },
  'owners.title': { ar: 'أنت', en: 'Are You a' },
  'owners.title2': { ar: 'مالك عقار؟', en: 'Landlord?' },
  'owners.subtitle': { ar: 'انشر عقارك على Skan وصل إلى آلاف الطلاب الباحثين عن سكن.', en: 'List your property on Skan and reach thousands of students looking for housing.' },
  'owners.cta': { ar: 'ابدأ الآن مجاناً', en: 'Start Free Now' },
  'footer.rights': { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
  'footer.platform': { ar: 'منصة سكن', en: 'Skan Platform' },
  'footer.student': { ar: 'سكن طلابي', en: 'Student Housing' },
  'detail.book': { ar: 'احجز الآن', en: 'Book Now' },
  'detail.login': { ar: 'سجل دخولك للحجز', en: 'Login to Book' },
  'detail.monthly': { ar: 'شهرياً', en: '/month' },
  'detail.rooms': { ar: 'غرف', en: 'rooms' },
  'detail.bathrooms': { ar: 'حمام', en: 'baths' },
  'detail.area': { ar: 'م²', en: 'sqm' },
  'detail.description': { ar: 'وصف العقار', en: 'Description' },
  'detail.gallery': { ar: 'الصور', en: 'Gallery' },
  'detail.3d': { ar: 'ثلاثي الأبعاد', en: '3D View' },
  'detail.features': { ar: 'المميزات', en: 'Features' },
  'detail.details': { ar: 'التفاصيل', en: 'Details' },
  'detail.bid': { ar: 'قدم عرض', en: 'Make Offer' },
  'detail.share': { ar: 'شارك مع ولي الأمر', en: 'Share with Parent' },
  'admin.properties': { ar: 'العقارات', en: 'Properties' },
  'admin.admins': { ar: 'المسؤولون', en: 'Admins' },
  'admin.bookings': { ar: 'الحجوزات', en: 'Bookings' },
  'admin.payments': { ar: 'المدفوعات', en: 'Payments' },
  'admin.chat': { ar: 'الدردشة', en: 'Chat' },
  'admin.settings': { ar: 'الإعدادات', en: 'Settings' },
  'admin.stats': { ar: 'الإحصائيات', en: 'Statistics' },
};

interface I18nContextType {
  lang: Lang;
  t: (key: string) => string;
  toggleLang: () => void;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('skan_lang') as Lang) || 'ar');

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('skan_lang', next);
      document.documentElement.dir = next === 'en' ? 'ltr' : 'rtl';
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] || translations[key]?.['ar'] || key;
  }, [lang]);

  const dir = lang === 'en' ? 'ltr' : 'rtl';

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
