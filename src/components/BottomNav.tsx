import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, User, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { t, isAdmin } = useApp();
  const location = useLocation();

  const items = [
    { name: t('dashboard'), path: '/', icon: LayoutDashboard },
    ...(isAdmin ? [{ name: t('members'), path: '/members', icon: Users }] : []),
    { name: t('profile'), path: '/profile', icon: User },
    { name: t('settings'), path: '/settings', icon: SettingsIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center glass backdrop-blur-xl pb-safe pt-3 px-3 border-t border-outline/50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative flex flex-col items-center justify-center transition-all duration-300 px-5 py-2 rounded-2xl group ${
              isActive ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            {isActive && (
              <motion.div 
                layoutId="bottomNavTab"
                className="absolute inset-0 bg-primary/5 rounded-2xl"
                transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
              />
            )}
            <Icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5px]' : 'opacity-60'}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.1em] mt-1.5 relative z-10 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
