import React, { useState } from 'react';
import { Sliders, Shield, AlertTriangle, Info, Calendar, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const { theme, toggleTheme, language, setLanguage, t, user, logout } = useApp();
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPwdSuccess, setShowPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isGoogleUser = user?.providerData.some(p => p.providerId === 'google.com');

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setIsUpdatingPassword(true);
    
    try {
      const { updatePassword } = await import('firebase/auth');
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const newPassword = formData.get('new_password') as string;
      const confirmPassword = formData.get('confirm_new_password') as string;
      
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (user) {
        await updatePassword(user, newPassword);
        setShowPwdSuccess(true);
        setTimeout(() => setShowPwdSuccess(false), 3000);
        (e.target as HTMLFormElement).reset();
      }
    } catch (error: any) {
      setPwdError(error.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (user) {
        await user.delete();
        await logout();
        navigate('/login');
      }
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error(t('error_recent_login'));
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <AnimatePresence>
        {showPwdSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {t('pwd_update_success')}
          </motion.div>
        )}
      </AnimatePresence>

      <header>
        <h1 className="text-4xl md:text-5xl text-on-surface font-heading font-extrabold tracking-tight underline decoration-primary/20 decoration-8 underline-offset-8 lowercase first-letter:uppercase">{t('settings')}</h1>
        <p className="text-on-surface-variant font-medium mt-6 max-w-md">{t('settings_desc')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Preferences Section */}
        <section className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container border border-outline-variant/30 rounded-[3rem] p-8 md:p-12 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl text-on-surface font-heading font-black uppercase tracking-tight">{t('appearance')}</h3>
                <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">{t('ui_personalization')}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between pb-6 border-b border-outline-variant/30">
                <div>
                  <p className="text-sm font-bold text-on-surface">{t('dark_mode')}</p>
                  <p className="text-xs text-on-surface-variant">{t('dark_mode_desc')}</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`relative w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-outline-variant/30'}`}
                >
                  <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              {/* Language Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-outline-variant/30 gap-4">
                <div>
                  <p className="text-sm font-bold text-on-surface">{t('language_label')}</p>
                  <p className="text-xs text-on-surface-variant">{t('language_desc')}</p>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="px-4 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-primary w-full sm:w-48 outline-none transition-all"
                >
                  <option value="en">English (US)</option>
                  <option value="th">ไทย</option>
                </select>
              </div>

              {/* Toggles Group */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-on-surface">{t('push_notifications')}</p>
                    <p className="text-xs text-on-surface-variant">{t('push_notif_desc')}</p>
                  </div>
                  <button 
                    onClick={() => setPushNotif(!pushNotif)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${pushNotif ? 'bg-primary' : 'bg-outline-variant/30'}`}
                  >
                    <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${pushNotif ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-on-surface">{t('email_notif')}</p>
                    <p className="text-xs text-on-surface-variant">{t('email_notif_desc')}</p>
                  </div>
                  <button 
                    onClick={() => setEmailNotif(!emailNotif)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${emailNotif ? 'bg-primary' : 'bg-outline-variant/30'}`}
                  >
                    <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${emailNotif ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container border border-outline-variant/30 rounded-[3rem] p-8 md:p-12 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl text-on-surface font-heading font-black uppercase tracking-tight">{t('security')}</h3>
                <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">{t('protection_access')}</p>
              </div>
            </div>
            
            {isGoogleUser ? (
              <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-4">
                <Info className="text-blue-500 w-6 h-6 shrink-0" />
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {t('google_user_pwd_msg')}
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                {pwdError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
                    {pwdError}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block ml-1">{t('current_password')}</label>
                  <input 
                    name="current_password"
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    placeholder="••••••••" 
                    type="password" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block ml-1">{t('new_password')}</label>
                    <input 
                      name="new_password"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                      placeholder={t('new_password')} 
                      type="password" 
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block ml-1">{t('confirm_new_password')}</label>
                    <input 
                      name="confirm_new_password"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                      placeholder={t('confirm_new_password')} 
                      type="password" 
                      required 
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button 
                    className="bg-primary hover:bg-primary-container text-white font-bold px-8 py-3 rounded-xl active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-70 flex items-center gap-2 uppercase tracking-wider" 
                    type="submit"
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword && (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <Sliders className="w-4 h-4" />
                      </motion.div>
                    )}
                    {isUpdatingPassword ? t('processing') : t('update_password')}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </section>

        {/* Danger Zone Aside */}
        <section className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 sticky top-24"
          >
            <h3 className="text-xl text-red-600 dark:text-red-400 mb-4 flex items-center gap-3 font-heading">
              <AlertTriangle className="w-6 h-6" />
              {t('danger_zone')}
            </h3>
            <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
              {t('delete_account_desc')}
            </p>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-3 px-6 border-2 border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:hover:text-black transition-all active:scale-95 outline-none focus:ring-2 focus:ring-red-500 uppercase tracking-widest text-xs"
            >
              {t('delete_account')}
            </button>

            {/* Account Meta Stats */}
            <div className="mt-12 pt-8 border-t border-outline-variant/10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center shadow-sm">
                  <Info className="text-on-surface-variant w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('member_tier')}</p>
                  <p className="text-sm font-bold text-on-surface">{t((currentMember?.role || 'Standard').toLowerCase()) || currentMember?.role || t('standard_tier')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center shadow-sm">
                  <Calendar className="text-on-surface-variant w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('member_since')}</p>
                  <p className="text-sm font-bold text-on-surface">{t('member_since_date')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface-container border border-outline-variant/30 rounded-[2rem] max-w-md w-full shadow-2xl p-8 z-10"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <AlertTriangle className="text-red-500 w-8 h-8" />
              </div>
              <h2 className="text-2xl text-on-surface mb-4 font_heading">{t('are_you_sure')}</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                {t('delete_confirm_desc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-on-surface/5 text-on-surface hover:bg-on-surface/10 transition-colors active:scale-95"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 active:scale-95"
                >
                  {t('yes_delete')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
