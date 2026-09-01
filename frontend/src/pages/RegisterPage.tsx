import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../store';

const ARAB_COUNTRY_CODES = [
  { code: '+20', country: 'مصر', flag: '🇪🇬' },
  { code: '+966', country: 'السعودية', flag: '🇸🇦' },
  { code: '+971', country: 'الإمارات', flag: '🇦🇪' },
  { code: '+965', country: 'الكويت', flag: '🇰🇼' },
  { code: '+973', country: 'البحرين', flag: '🇧🇭' },
  { code: '+974', country: 'قطر', flag: '🇶🇦' },
  { code: '+968', country: 'عمان', flag: '🇴🇲' },
  { code: '+962', country: 'الأردن', flag: '🇯🇴' },
  { code: '+961', country: 'لبنان', flag: '🇱🇧' },
  { code: '+964', country: 'العراق', flag: '🇮🇶' },
  { code: '+963', country: 'سوريا', flag: '🇸🇾' },
  { code: '+970', country: 'فلسطين', flag: '🇵🇸' },
  { code: '+967', country: 'اليمن', flag: '🇾🇪' },
  { code: '+249', country: 'السودان', flag: '🇸🇩' },
  { code: '+218', country: 'ليبيا', flag: '🇱🇾' },
  { code: '+216', country: 'تونس', flag: '🇹🇳' },
  { code: '+213', country: 'الجزائر', flag: '🇩🇿' },
  { code: '+212', country: 'المغرب', flag: '🇲🇦' },
  { code: '+222', country: 'موريتانيا', flag: '🇲🇷' },
  { code: '+252', country: 'الصومال', flag: '🇸🇴' },
  { code: '+253', country: 'جيبوتي', flag: '🇩🇯' },
  { code: '+269', country: 'جزر القمر', flag: '🇰🇲' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneCode, setPhoneCode] = useState('+20');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fullPhone = phone ? `${phoneCode}${phone}` : undefined;
      await register(name, email, password, fullPhone);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="p-6 md:p-8 rounded-3xl bg-purple-500/5 border border-purple-500/10 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white/90 mb-2">حساب جديد</h1>
            <p className="text-purple-300/50">انضم إلى آلاف الطلاب في Skan</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300/60 mb-2">الاسم الكامل</label>
              <div className="relative">
                <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/30" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-white/90 placeholder-purple-300/30 focus:outline-none focus:border-purple-500/30 transition-colors"
                  placeholder="محمد أحمد"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300/60 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-white/90 placeholder-purple-300/30 focus:outline-none focus:border-purple-500/30 transition-colors"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300/60 mb-2">رقم الهاتف (اختياري)</label>
              <div className="flex gap-2">
                <select
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className="w-[110px] md:w-[140px] flex-shrink-0 px-3 py-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-white/90 focus:outline-none focus:border-purple-500/30 transition-colors text-sm"
                >
                  {ARAB_COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#0a0514] text-white">
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Phone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/30" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-white/90 placeholder-purple-300/30 focus:outline-none focus:border-purple-500/30 transition-colors"
                    placeholder="••• ••• •••"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300/60 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-white/90 placeholder-purple-300/30 focus:outline-none focus:border-purple-500/30 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
            >
              {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-purple-300/50 hover:text-purple-300 transition-colors">
              لديك حساب بالفعل؟ سجل دخولك
              <ArrowLeft size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}