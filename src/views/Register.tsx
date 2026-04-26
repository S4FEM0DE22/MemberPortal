import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, BadgeCheck, ArrowRight, Eye, EyeOff, ShieldCheck, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function Register() {
  const { t, signUpWithEmail, signIn, theme, toggleTheme, language, setLanguage } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
      navigate('/');
    } catch (err: any) {
      console.error("Google Sign-In Error: ", err);
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setIsLoading(true);
    setError('');
    try {
      await signUpWithEmail(email, password, fullName);
      navigate('/');
    } catch (err: any) {
      console.error("Register Error: ", err);
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-center px-6 md:px-12 pointer-events-none">
        <div className="w-full max-w-7xl flex items-center justify-between pointer-events-auto">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <BadgeCheck className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-xl font-black text-on-surface uppercase tracking-tighter hidden sm:block">
              Member<span className="text-primary italic">Portal</span>
              <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block ml-1"></span>
            </span>
          </Link>

          <div className="flex items-center gap-2 bg-surface/60 backdrop-blur-xl border border-on-surface/10 p-1.5 rounded-2xl shadow-2xl shadow-black/10">
            <button
              onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
              className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-on-surface/10 transition-all text-on-surface font-black text-xs group"
              title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
            >
              <span className="group-hover:scale-110 transition-transform">{language.toUpperCase()}</span>
            </button>

            <div className="w-px h-6 bg-on-surface/10 mx-1"></div>

            <button
              onClick={toggleTheme}
              className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-on-surface/10 transition-all text-on-surface group"
              title={theme === 'light' ? t('dark_mode') : t('light_mode')}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              ) : (
                <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Left Side: Hero/Branding (Shared with Login) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-primary relative overflow-hidden items-center justify-center p-8">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069"
            alt="Collaboration space"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-container/40"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-lg text-on-primary"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="h-14 w-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center p-2.5 border border-white/20">
              <BadgeCheck className="w-full h-full text-white" />
            </div>
            <h1 className="font-heading text-4xl font-black tracking-tighter uppercase text-white">Member<span className="opacity-50">Portal</span></h1>
          </div>
          <h2 className="font-heading text-3xl font-bold mb-4 text-white">{t('start_journey')}</h2>
          <p className="text-lg font-medium opacity-100 leading-relaxed mb-8 text-white/90">
            {t('register_desc_hero')}
          </p>
          <ul className="space-y-4">
            {[
              t('feat_dashboard'),
              t('feat_mgmt'),
              t('feat_perks'),
              t('feat_realtime')
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white tracking-tight">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-12 bg-mesh overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[480px] my-auto"
        >
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-primary/30 border border-primary-container/20">
              <BadgeCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-heading text-3xl font-black text-on-surface uppercase tracking-tighter">Member<span className="text-primary">Portal</span></h1>
          </div>

          <div className="bg-surface-container border border-outline-variant p-8 md:p-10 rounded-2xl shadow-sm">
            <header className="mb-8">
              <h2 className="font-heading text-2xl font-bold mb-1 text-on-surface">{t('register_new')}</h2>
              <p className="text-sm text-on-surface font-medium opacity-80">{t('create_account_desc')}</p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-on-surface" htmlFor="fullName">{t('full_name')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 w-5 h-5 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-on-surface/30"
                    id="fullName"
                    placeholder={t('name_placeholder')}
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-on-surface" htmlFor="email">{t('email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 w-5 h-5 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-on-surface/30"
                    id="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-on-surface" htmlFor="password">{t('password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 w-5 h-5 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-outline bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-on-surface/30"
                    id="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/40 hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[10px] text-on-surface/60 mt-1 font-medium">{t('pwd_hint')}</p>
              </div>

              <div className="flex items-start gap-3 cursor-pointer group mt-2">
                <input
                  className="h-5 w-5 mt-0.5 cursor-pointer rounded border border-outline-variant accent-primary focus:ring-primary bg-surface"
                  id="agree"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  type="checkbox"
                  required
                />
                <label className="text-[13px] text-on-surface-variant cursor-pointer leading-snug" htmlFor="agree">
                  {t('agree_text')} <Link to="#" className="text-primary font-semibold hover:underline">{t('terms_service')}</Link> {t('and')} <Link to="#" className="text-primary font-semibold hover:underline">{t('privacy_policy')}</Link>
                </label>
              </div>

              <button 
                className="group relative flex items-center justify-center w-full bg-primary text-on-primary py-3.5 rounded-xl font-semibold hover:bg-primary-container active:scale-[0.98] transition-all shadow-md shadow-primary/10 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={!agreed || isLoading}
              >
                <span>{isLoading ? t('processing') : t('sign_up')}</span>
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 w-full">
                <div className="h-px bg-outline/40 flex-1"></div>
                <span className="text-[10px] font-black text-on-surface/50 uppercase tracking-widest">{t('or_continue')}</span>
                <div className="h-px bg-outline/40 flex-1"></div>
              </div>

              <div className="flex flex-col gap-4 w-full">
                <button 
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center gap-3 px-4 py-3 border border-outline rounded-xl text-sm font-bold hover:bg-on-surface/5 transition-all text-on-surface hover:shadow-sm active:scale-[0.99]"
                >
                  <img alt="Google" className="w-5 h-5" src="https://www.google.com/favicon.ico" />
                  <span>Google</span>
                </button>
              </div>

              <p className="text-sm text-on-surface font-medium">
                {t('already_have_account')} <Link to="/login" className="text-primary font-black hover:underline">{t('login_here')}</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
