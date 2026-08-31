import SkanLogo from './SkanLogo';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-purple-500/10 py-12 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <SkanLogo size={28} />
              <span className="text-lg font-bold bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Skan
              </span>
            </div>
            <p className="text-sm text-purple-300/40 leading-relaxed">
              منصة سكن الطلاب الأولى. نربط بين الطلاب والمالكين مباشرة لتجربة سكن سلسة وموثوقة.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white/80 mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-purple-300/40">
              <li><a href="/" className="hover:text-purple-300 transition-colors">الرئيسية</a></li>
              <li><a href="/#how" className="hover:text-purple-300 transition-colors">كيف يعمل</a></li>
              <li><a href="/register" className="hover:text-purple-300 transition-colors">حساب جديد</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white/80 mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm text-purple-300/40">
              <li><a href="#" className="hover:text-purple-300 transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">تواصل معنا</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white/80 mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-sm text-purple-300/40">
              <li>skan.egypt@gmail.com</li>
              <li dir="ltr">010 910 20130</li>
              <li>مصر</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-purple-500/10 text-center text-sm text-purple-300/30">
          <p>© {new Date().getFullYear()} Skan — جميع الحقوق محفوظة — محمد عبدالحميد ابوهلال</p>
        </div>
      </div>
    </footer>
  );
}
