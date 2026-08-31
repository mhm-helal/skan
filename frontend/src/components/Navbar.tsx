import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Shield } from 'lucide-react';
import SkanLogo from './SkanLogo';
import { useAuth } from '../store';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0514]/70 border-b border-purple-500/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
            <SkanLogo size={32} />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Skan
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.is_admin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors text-sm font-medium"
                >
                  <Shield size={16} />
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </Link>
              )}
              <span className="hidden sm:block text-sm text-purple-300/60">{user.name}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 text-pink-300 hover:bg-pink-500/20 transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">خروج</span>
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-purple-300/80 hover:text-purple-300 transition-colors text-sm font-medium"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity text-sm font-medium"
              >
                حساب جديد
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
