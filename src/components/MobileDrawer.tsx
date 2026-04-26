import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Users, User, Settings as SettingsIcon, LogOut, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const location = useLocation();
  const { theme, toggleTheme, t, logout, isAdmin } = useApp();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  const navItems = [
    { name: t('home'), path: '/', icon: LayoutDashboard },
    ...(isAdmin ? [
      { name: t('members'), path: '/members', icon: Users },
      { name: t('activities'), path: '/activities', icon: Users }
    ] : []),
    { name: t('profile'), path: '/profile', icon: User },
    { name: t('settings'), path: '/settings', icon: SettingsIcon },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-on-surface/40 backdrop-blur-sm lg:hidden"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[70] w-80 bg-surface shadow-2xl lg:hidden flex flex-col transition-colors duration-300"
          >
            <div className="p-8 border-b border-outline/50 flex items-center justify-between">
              <span className="text-2xl font-black tracking-tighter text-primary font-heading uppercase">
                Member<span className="text-on-surface">Portal</span>
              </span>
              <button 
                onClick={onClose}
                className="p-2.5 hover:bg-on-surface/5 rounded-xl transition-all text-on-surface border border-outline/50"
              >
                <X className="w-5 h-5 opacity-60" />
              </button>
            </div>

            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-4 mb-4 opacity-40">Main Navigation</p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-on-surface-variant hover:bg-on-surface/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5px]' : 'opacity-50'}`} />
                    <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-6 space-y-4 border-t border-outline/50 bg-on-surface/[0.01]">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-on-surface-variant hover:bg-on-surface/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {theme === 'light' ? <Moon className="w-5 h-5 opacity-50 group-hover:opacity-100" /> : <Sun className="w-5 h-5 opacity-50 group-hover:opacity-100" />}
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] opacity-60 group-hover:opacity-100">{t('dark_mode')}</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-all shadow-inner ${theme === 'dark' ? 'bg-primary' : 'bg-outline'}`}>
                  <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : ''} shadow-sm`} />
                </div>
              </button>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all font-semibold w-full text-left group"
              >
                <LogOut className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] opacity-60 group-hover:opacity-100">{t('logout')}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
