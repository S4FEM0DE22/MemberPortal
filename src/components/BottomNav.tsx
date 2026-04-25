import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, User, Settings as SettingsIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { t } = useApp();
  const location = useLocation();

  const items = [
    { name: t('dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('members'), path: '/members', icon: Users },
    { name: t('profile'), path: '/profile', icon: User },
    { name: t('settings'), path: '/settings', icon: SettingsIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface-container/80 backdrop-blur-md pb-safe pt-2 px-2 border-t border-outline-variant/10 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center transition-all scale-95 active:scale-90 duration-150 px-4 py-1 rounded-xl ${
              isActive ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="font-heading text-[11px] font-semibold mt-1">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
