import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import api from '../api';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/api/admin/setup');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء الإعداد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="p-8 rounded-3xl bg-purple-500/5 border border-purple-500/10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Settings size={32} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white/90 mb-2">إعداد المسؤول الرئيسي</h1>
          <p className="text-purple-300/50 mb-6">
            هذا الإجراء سيقوم بإنشاء حساب المسؤول الرئيسي للنظام.
          </p>

          {success ? (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-green-300 font-medium">تم الإعداد بنجاح!</p>
              <p className="text-sm text-green-300/60 mt-1">جاري التحويل لصفحة تسجيل الدخول...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                  {error}
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSetup}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
              >
                {loading ? 'جاري الإعداد...' : 'إعداد المسؤول الرئيسي'}
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
