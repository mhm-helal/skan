import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Shield, Sun, Moon, Globe } from 'lucide-react';
import SkanLogo from './SkanLogo';
import { useAuth } from '../store';
import { useTheme } from '../theme';
import { useI18n } from '../i18n';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useI18n();
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
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-purple-500/10"
      style={{ background: 'var(--nav-bg)' }}
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

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all text-sm"
            title={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            <Globe size={15} className="text-purple-400" />
            <span className="text-xs font-bold text-purple-300">{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-purple-400" />
            )}
          </motion.button>

          <div className="w-px h-6 bg-purple-500/10 mx-1 hidden sm:block" />

          {user ? (
            <>
              {user.is_admin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors text-sm font-medium"
                >
                  <Shield size={16} />
                  <span className="hidden sm:inline">{t('nav.admin')}</span>
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
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-purple-300/80 hover:text-purple-300 transition-colors text-sm font-medium"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity text-sm font-medium"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
