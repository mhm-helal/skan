import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Building2, HelpCircle, Phone, User } from 'lucide-react';
import { useAuth } from '../store';

const navItems = [
  { to: '/', icon: Home, label: 'الرئيسية' },
  { to: '/', icon: Building2, label: 'العقارات' },
  { to: '/#how', icon: HelpCircle, label: 'كيف يعمل' },
  { to: '/#contact', icon: Phone, label: 'تواصل معنا' },
];

export default function DockNav() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-[#0a0514]/80 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-colors group"
            >
              {isActive && (
                <motion.div
                  layoutId="dockIndicator"
                  className="absolute inset-0 rounded-xl bg-purple-500/15"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={`relative z-10 transition-colors ${
                  isActive ? 'text-purple-400' : 'text-purple-300/50 group-hover:text-purple-300'
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-purple-300' : 'text-purple-300/40 group-hover:text-purple-300/70'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        <div className="w-px h-8 bg-purple-500/20 mx-1" />
        <Link
          to={user ? '/admin' : '/login'}
          className="relative flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-colors group"
        >
          <User
            size={20}
            className="text-purple-300/50 group-hover:text-purple-300 transition-colors"
          />
          <span className="text-[10px] font-medium text-purple-300/40 group-hover:text-purple-300/70 transition-colors">
            {user ? 'حسابي' : 'دخول'}
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
