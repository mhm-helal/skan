import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Phone } from 'lucide-react';
import { useAuth } from '../store';

declare global {
  interface Window {
    google?: any;
    googleSignIn?: (response: any) => void;
  }
}

export default function LoginPage() {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+20');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = '1057671369023-pvkr0kvrf9kqt67s7g5h5pnqb2q2s8s0.apps.googleusercontent.com';

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          googleBtnRef.current,
          { theme: 'outline', size: 'large', width: '100%', text: 'continue_with', locale: 'ar' }
        );
      }
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      setError('');
      await googleLogin(response.credential);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'فشل تسجيل الدخول بـ Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (loginType === 'email') {
        await login(email, password);
      } else {
        const fullPhone = `${phoneCode}${phone}`;
        await login(undefined, password, fullPhone);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="p-8 rounded-3xl bg-purple-500/5 border border-purple-500/10 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white/90 mb-2">تسجيل الدخول</h1>
            <p className="text-purple-300/50">أدخل بياناتك للوصول إلى حسابك</p>
          </div>

          <div className="flex gap-2 p-1 rounded-xl bg-purple-500/5 border border-purple-500/10 mb-6">
            <button
              type="button"
              onClick={() => setLoginType('email')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                loginType === 'email'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-purple-300/40 hover:text-purple-300/60'
              }`}
            >
              <Mail size={14} className="inline ml-1" />
              البريد الإلكتروني
            </button>
            <button
              type="button"
              onClick={() => setLoginType('phone')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                loginType === 'phone'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-purple-300/40 hover:text-purple-300/60'
              }`}
            >
              <Phone size={14} className="inline ml-1" />
              رقم الهاتف
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginType === 'email' ? (
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
            ) : (
              <div>
                <label className="block text-sm font-medium text-purple-300/60 mb-2">رقم الهاتف</label>
                <div className="flex gap-2">
                  <select
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    className="w-[120px] flex-shrink-0 px-3 py-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-white/90 focus:outline-none focus:border-purple-500/30 transition-colors text-sm"
                  >
                    <option value="+20" className="bg-[#0a0514]">🇪🇬 +20</option>
                    <option value="+966" className="bg-[#0a0514]">🇸🇦 +966</option>
                    <option value="+971" className="bg-[#0a0514]">🇦🇪 +971</option>
                    <option value="+965" className="bg-[#0a0514]">🇰🇼 +965</option>
                    <option value="+973" className="bg-[#0a0514]">🇧🇭 +973</option>
                    <option value="+974" className="bg-[#0a0514]">🇶🇦 +974</option>
                    <option value="+968" className="bg-[#0a0514]">🇴🇲 +968</option>
                    <option value="+962" className="bg-[#0a0514]">🇯🇴 +962</option>
                    <option value="+961" className="bg-[#0a0514]">🇱🇧 +961</option>
                    <option value="+964" className="bg-[#0a0514]">🇮🇶 +964</option>
                    <option value="+963" className="bg-[#0a0514]">🇸🇾 +963</option>
                    <option value="+970" className="bg-[#0a0514]">🇵🇸 +970</option>
                    <option value="+967" className="bg-[#0a0514]">🇾🇪 +967</option>
                    <option value="+249" className="bg-[#0a0514]">🇸🇩 +249</option>
                    <option value="+218" className="bg-[#0a0514]">🇱🇾 +218</option>
                    <option value="+216" className="bg-[#0a0514]">🇹🇳 +216</option>
                    <option value="+213" className="bg-[#0a0514]">🇩🇿 +213</option>
                    <option value="+212" className="bg-[#0a0514]">🇲🇦 +212</option>
                    <option value="+222" className="bg-[#0a0514]">🇲🇷 +222</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/30" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pr-10 pl-4 py-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-white/90 placeholder-purple-300/30 focus:outline-none focus:border-purple-500/30 transition-colors"
                      placeholder="••• ••• •••"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

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
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </motion.button>
          </form>

          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-500/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-purple-300/40">أو</span>
              </div>
            </div>

            <div ref={googleBtnRef} className="w-full flex justify-center"></div>

            <p className="text-center text-xs text-purple-300/30 mt-3">
              بالدخول أنت توافق على{' '}
              <Link to="/terms" className="text-purple-300/50 hover:text-purple-300">شروط الاستخدام</Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/register" className="inline-flex items-center gap-2 text-sm text-purple-300/50 hover:text-purple-300 transition-colors">
              ليس لديك حساب؟ سجل الآن
              <ArrowLeft size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}