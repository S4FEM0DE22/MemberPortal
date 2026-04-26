import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, BadgeCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { t, signIn, signInWithEmail } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmail(email, password);
      navigate('/');
    } catch (err: any) {
      console.error("Login Error: ", err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
      navigate('/');
    } catch (error) {
      console.error("Login Error: ", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Left Side: Hero/Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-primary relative overflow-hidden items-center justify-center p-8">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgJO6mFsSoDFe73T-wTqUV3QLYMtj0USKMyYkCziI5re5apoLqdEGxFQs53cv7j7suRINZARU8u2Lgn-TgS6zY712rwKPssIGehEEHDLG_T00Yee9YDyh5JvLIdQI9rXO1FWVLtKSKEEA2jIFKv4epMq8tci_cBszkJAtOqCuhUlCzudlgXEcCG7xjlH562VSNl17gKqSuIvAlNaQ9Qgug1wlyO-lRLzeUn2dzoGJyvUnQfOm_QKZClHFie_6fmT7MVEGj_ewUZJ2d"
            alt="Corporate office"
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
          <h2 className="font-heading text-3xl font-semibold mb-4 text-white">{t('elevate_network')}</h2>
          <p className="text-lg opacity-90 leading-relaxed mb-8">
            {t('elevate_desc')}
          </p>
          <div className="flex gap-8">
            <div className="flex flex-col gap-1">
              <span className="font-heading text-2xl font-bold">10k+</span>
              <span className="text-xs uppercase tracking-wider opacity-80">{t('active_members')}</span>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="flex flex-col gap-1">
              <span className="font-heading text-2xl font-bold">500+</span>
              <span className="text-xs uppercase tracking-wider opacity-80">{t('daily_activities')}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-12 bg-mesh">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[440px]"
        >
          {/* Mobile Branding */}
          <div className="md:hidden flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-primary/30 border border-primary-container/20">
              <BadgeCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-heading text-3xl font-black text-on-surface uppercase tracking-tighter">Member<span className="text-primary">Portal</span></h1>
          </div>

          <div className="bg-surface-container border border-outline-variant p-8 md:p-10 rounded-2xl shadow-sm">
            <header className="mb-8">
              <h2 className="font-heading text-2xl font-bold mb-1 text-on-surface">{t('welcome_back')}</h2>
              <p className="text-sm text-on-surface-variant">{t('login_desc')}</p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="email">{t('email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-outline"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-on-surface-variant" htmlFor="password">{t('password')}</label>
                  <Link to="#" className="text-xs font-semibold text-primary hover:underline">{t('forgot_password')}</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-outline"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="h-5 w-5 cursor-pointer rounded border border-outline-variant accent-primary focus:ring-primary bg-surface"
                  id="remember"
                  name="remember"
                  type="checkbox"
                />
                <label className="text-sm text-on-surface-variant cursor-pointer group-hover:text-on-surface transition-colors" htmlFor="remember">
                  {t('remember_me')}
                </label>
              </div>

              <button 
                className="group relative flex items-center justify-center w-full bg-primary text-on-primary py-3.5 rounded-xl font-semibold hover:bg-primary-container active:scale-[0.98] transition-all shadow-md shadow-primary/10 disabled:opacity-70"
                type="submit"
                disabled={isLoading}
              >
                <span>{isLoading ? t('processing') : t('login_button')}</span>
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col items-center gap-6">
              <p className="text-sm text-on-surface-variant">
                {t('no_account')} <Link to="/register" className="text-primary font-bold hover:underline">{t('register_free')}</Link>
              </p>

              <div className="flex items-center gap-4 w-full">
                <div className="h-px flex-1 bg-outline-variant/30"></div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{t('or_continue')}</span>
                <div className="h-px flex-1 bg-outline-variant/30"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-on-surface/5 transition-colors text-on-surface"
                >
                  <img alt="Google" className="w-5 h-5" src="https://www.google.com/favicon.ico" />
                  <span>Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-on-surface/5 transition-colors text-on-surface">
                  <img alt="Microsoft" className="w-5 h-5" src="https://www.microsoft.com/favicon.ico" />
                  <span>Microsoft</span>
                </button>
              </div>
            </div>
          </div>

          <footer className="mt-8 flex justify-center gap-6 text-xs text-outline">
            <Link to="#" className="hover:text-on-surface transition-colors">{t('privacy_policy')}</Link>
            <Link to="#" className="hover:text-on-surface transition-colors">{t('terms_service')}</Link>
            <Link to="#" className="hover:text-on-surface transition-colors">{t('contact_support')}</Link>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
