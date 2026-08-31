import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../store';

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [method, setMethod] = useState('bank_transfer');
  const [refNumber, setRefNumber] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/api/payments/info').then(r => setPaymentInfo(r.data)).catch(() => {});
  }, [user, navigate]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!bookingId) { setError('رقم الحجز غير موجود'); return; }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('booking_id', bookingId);
      fd.append('method', method);
      fd.append('reference_number', refNumber);
      if (screenshot) fd.append('screenshot', screenshot);
      await api.post('/api/payments/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0514] flex items-center justify-center px-4">
        <div className="bg-[#110a24] rounded-2xl border border-green-500/20 p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-400 mb-3">تم إرسال طلب الدفع!</h2>
          <p className="text-gray-400 mb-6">هنتواصل معاك خلال 24 ساعة لتأكيد الدفع وعرض بيانات التواصل مع المالك.</p>
          <button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition">العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0514] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-2">💳 الدفع</h1>
        <p className="text-gray-400 text-center mb-8">عمولة التوكيل — 1,000 ج.م فقط</p>

        {/* Steps */}
        <div className="flex justify-center gap-2 mb-8">
          {['تحويل بنكي', 'رفع الإيصال', 'تأكيد'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-500'}`}>{i + 1}</div>
              <span className={`text-sm ${i === 0 ? 'text-purple-400' : 'text-gray-500'}`}>{s}</span>
              {i < 2 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Bank Info */}
        {paymentInfo && (
          <div className="bg-[#110a24] rounded-2xl border border-purple-500/10 p-6 mb-6">
            <h3 className="text-white font-bold text-lg mb-4">🏦 بيانات الحساب البنكي</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['البنك', paymentInfo.bank.bank_name],
                ['اسم الحساب', paymentInfo.bank.account_name],
                ['رقم الحساب', paymentInfo.bank.account_number],
                ['IBAN', paymentInfo.bank.iban],
              ].map(([label, val]) => (
                <div key={label as string} className="bg-white/5 rounded-xl p-3">
                  <div className="text-gray-500 text-xs mb-1">{label}</div>
                  <div className="text-white font-mono text-sm">{val}</div>
                </div>
              ))}
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center mt-6">
              <img src={`data:image/png;base64,${paymentInfo.qr_code}`} alt="QR Code" className="w-48 h-48 rounded-xl bg-white p-2" />
              <p className="text-gray-500 text-xs mt-2">امسح الكود بالموبايل للتحويل السريع</p>
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-purple-500/5 border border-purple-500/10 rounded-xl p-4">
              <h4 className="text-purple-400 font-bold mb-2">📦 خطوات الدفع</h4>
              {paymentInfo.instructions.map((inst: string, i: number) => (
                <p key={i} className="text-gray-400 text-sm">{inst}</p>
              ))}
            </div>
          </div>
        )}

        {/* Payment Form */}
        <div className="bg-[#110a24] rounded-2xl border border-purple-500/10 p-6">
          <h3 className="text-white font-bold text-lg mb-4">📤 ارفع إثبات الدفع</h3>

          {/* Method */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block">طريقة الدفع</label>
            <div className="flex gap-2">
              {[
                { val: 'bank_transfer', label: 'تحويل بنكي' },
                { val: 'instapay', label: 'InstaPay' },
                { val: 'fawry', label: 'فوري' },
              ].map(m => (
                <button key={m.val} onClick={() => setMethod(m.val)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${method === m.val ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reference */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block">رقم المرجع / رقم التحويل</label>
            <input type="text" value={refNumber} onChange={e => setRefNumber(e.target.value)}
              placeholder="اختياري — رقم العملية من البنك"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition" />
          </div>

          {/* Screenshot */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-2 block">سكرين شوت الإيصال</label>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-purple-500/50 transition">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full object-contain rounded-xl" />
              ) : (
                <div className="text-center">
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-gray-400 text-sm">اضغط لاختيار صورة</p>
                  <p className="text-gray-600 text-xs">PNG, JPG — حد أقصى 5MB</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50">
            {loading ? '⏳ جاري الإرسال...' : 'إرسال طلب الدفع'}
          </button>
        </div>
      </div>
    </div>
  );
}
