import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onToggleMenu: () => void;
}

export default function Navbar({ onToggleMenu }: NavbarProps) {
  const location = useLocation();
  const { theme, toggleTheme, t, logout } = useApp();

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
    { name: t('members'), path: '/members' },
    { name: t('profile'), path: '/profile' },
    { name: t('settings'), path: '/settings' },
  ];

  return (
    <header className="sticky top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-16 bg-surface-container border-b border-outline-variant/30 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleMenu}
          className="p-2 rounded-full hover:bg-on-surface/5 transition-colors md:hidden text-on-surface"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>
        <Link to="/" className="text-xl font-extrabold tracking-tight text-primary font-heading">
          MemberPortal
        </Link>
        <nav className="hidden md:flex items-center gap-6 ml-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-heading text-sm tracking-tight transition-colors px-2 py-1 rounded ${
                location.pathname === item.path
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant font-medium hover:bg-on-surface/5'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-on-surface/10 transition-colors text-on-surface-variant"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-on-surface-variant hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100/20"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold hidden sm:inline">{t('logout')}</span>
        </button>
        <Link 
          to="/profile"
          className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-outline-variant hover:ring-2 hover:ring-primary/20 transition-all"
        >
          <img
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPCXFgBSOB1dUKP-OYq4g4YgVR_bVSQEQ2ZfHFOykoiDLf5lnU4mYPJreuSW071xOIiFR7dglJLHDYu5wgAg2G-HhWSzcBKdsyx0AnMefbwdWN8wrNKd5MB4QiB1_Yus1wWRWNCJikFySmm2xGAdwwnPbbdPdotrol4T2MJZYGmFB6OFC8lDVPvPOqCs2sjyU2Pb20HvtDIl794TTOwSz72-vpjn6q45EZqEN5WcLZMEZENJ4pbaSUs0m_B7yGuD1cV6JTS3sQYYmL"
            alt="User profile"
          />
        </Link>
      </div>
    </header>
  );
}
