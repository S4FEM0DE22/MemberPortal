import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onToggleMenu: () => void;
}

export default function Navbar({ onToggleMenu }: NavbarProps) {
  const location = useLocation();
  const { theme, toggleTheme, t, logout, isAdmin, currentMember, user } = useApp();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  const navItems = [
    { name: t('home'), path: '/' },
    ...(isAdmin ? [
      { name: t('members'), path: '/members' },
    ] : []),
    { name: t('activities'), path: '/activities' },
    { name: t('profile'), path: '/profile' },
    { name: t('settings'), path: '/settings' },
  ];

  return (
    <header className="sticky top-0 left-0 w-full z-50 glass shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
        <button 
          onClick={onToggleMenu}
          className="p-2.5 rounded-xl hover:bg-on-surface/5 transition-colors md:hidden text-on-surface border border-outline/50"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>
        <Link to="/" className="text-2xl font-black tracking-tighter text-primary font-heading uppercase group">
          Member<span className="text-on-surface group-hover:text-primary transition-colors">Portal</span>
          <div className="h-1 w-1 bg-primary rounded-full inline-block ml-0.5"></div>
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-heading text-[11px] font-black uppercase tracking-[0.2em] transition-all px-4 py-2 rounded-xl ${
                location.pathname === item.path
                  ? 'text-primary bg-primary/5'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-on-surface/5 transition-colors text-on-surface-variant border border-outline/50"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2.5 text-on-surface-variant hover:text-rose-500 transition-all px-4 py-2 rounded-xl group"
        >
          <LogOut className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t('logout')}</span>
        </button>
        <Link 
          to="/profile"
          className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden border border-outline hover:shadow-lg hover:shadow-primary/10 transition-all p-0.5"
        >
          <img
            className="h-full w-full object-cover rounded-[0.5rem]"
            src={currentMember?.avatar || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentMember?.name || user?.displayName || 'User')}&background=random`}
            alt="User profile"
            referrerPolicy="no-referrer"
          />
        </Link>
      </div>
      </div>
    </header>
  );
}
