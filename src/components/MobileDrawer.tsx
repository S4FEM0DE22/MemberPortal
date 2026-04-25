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
  const { theme, toggleTheme, t, logout } = useApp();

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
    { name: t('members'), path: '/members', icon: Users },
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
            className="fixed inset-y-0 left-0 z-[70] w-72 bg-surface shadow-2xl lg:hidden flex flex-col transition-colors duration-300"
          >
            <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
              <span className="text-xl font-extrabold tracking-tight text-primary font-heading">
                MemberPortal
              </span>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-on-surface/5 rounded-full transition-colors text-on-surface"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'text-on-surface-variant hover:bg-on-surface/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-heading">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 space-y-4 border-t border-outline-variant/30">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-on-surface-variant hover:bg-on-surface/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span className="font-heading">{t('dark_mode')}</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-outline-variant'}`}>
                  <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
                </div>
              </button>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-500/10 transition-all font-semibold w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-heading">{t('logout')}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
