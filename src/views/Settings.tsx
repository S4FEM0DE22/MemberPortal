import React, { useState } from 'react';
import { Sliders, Shield, AlertTriangle, Info, Calendar, CheckCircle2, Lock, Smartphone, Key, Globe, Bell, Trash2, ChevronRight, Moon, Sun, Languages, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const { theme, toggleTheme, language, setLanguage, t, user, logout, currentMember } = useApp();
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPwdSuccess, setShowPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [show2FAModal, setShow2FAModal] = useState(false);
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
    <div className="max-w-5xl mx-auto space-y-12 pb-20 text-left">
      <AnimatePresence>
        {showPwdSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[100] bg-emerald-500 text-white px-8 py-4 rounded-full shadow-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            {t('pwd_update_success')}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="text-left">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 w-8 bg-primary rounded-full" />
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{t('system')}</p>
        </div>
        <h1 className="text-4xl md:text-5xl text-on-surface font-heading font-black tracking-tight uppercase leading-none">{t('settings')}</h1>
        <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest opacity-40 mt-6 max-w-md">{t('settings_desc')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-10 text-left">
          {/* Preferences Card */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container border border-outline-variant/30 rounded-[3.5rem] p-8 md:p-14 shadow-sm text-left"
          >
            <div className="flex items-center gap-6 mb-12 text-left">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <Sliders className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl text-on-surface font-heading font-black uppercase tracking-tight">{t('appearance')}</h3>
                <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">{t('ui_personalization')}</p>
              </div>
            </div>
            
            <div className="space-y-10 text-left">
              {/* Dark Mode */}
              <div className="flex items-center justify-between p-6 bg-on-surface/[0.03] rounded-[2.5rem] border border-outline-variant/10 text-left">
                <div className="flex items-center gap-5 text-left">
                  <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-on-surface/5 text-on-surface-variant'}`}>
                    {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-on-surface uppercase tracking-wider">{t('dark_mode')}</p>
                    <p className="text-[10px] text-on-surface-variant font-bold opacity-50 uppercase tracking-widest mt-1">{t('dark_mode_desc')}</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`relative w-14 h-8 rounded-full transition-all duration-500 p-1 flex items-center ${theme === 'dark' ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-outline-variant/30'}`}
                >
                  <motion.div 
                    layout
                    className={`h-6 w-6 rounded-full bg-white shadow-md ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} 
                  />
                </button>
              </div>

              {/* Language */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-on-surface/[0.03] rounded-[2.5rem] border border-outline-variant/10 gap-6 text-left">
                <div className="flex items-center gap-5 text-left">
                  <div className="p-4 rounded-2xl bg-on-surface/5 text-on-surface-variant">
                    <Languages className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-on-surface uppercase tracking-wider">{t('language_label')}</p>
                    <p className="text-[10px] text-on-surface-variant font-bold opacity-50 uppercase tracking-widest mt-1">{t('language_desc')}</p>
                  </div>
                </div>
                <div className="relative group min-w-[160px]">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="appearance-none w-full px-6 py-4 rounded-2xl border border-outline-variant bg-surface text-on-surface text-xs font-black uppercase tracking-widest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm pr-12"
                  >
                    <option value="en">English (US)</option>
                    <option value="th">ไทย (TH)</option>
                  </select>
                  <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline rotate-90" />
                </div>
              </div>

              {/* Notifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="p-6 bg-on-surface/[0.03] rounded-[2.5rem] border border-outline-variant/10 flex items-center justify-between group h-full">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center border border-outline/20">
                           <Bell className={`w-5 h-5 ${pushNotif ? 'text-primary' : 'text-on-surface-variant opacity-40'}`} />
                        </div>
                        <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">{t('push')}</span>
                     </div>
                     <button onClick={() => setPushNotif(!pushNotif)} className={`w-10 h-6 rounded-full relative transition-colors ${pushNotif ? 'bg-primary' : 'bg-outline-variant/30'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${pushNotif ? 'translate-x-4' : ''}`} />
                     </button>
                  </div>
                  <div className="p-6 bg-on-surface/[0.03] rounded-[2.5rem] border border-outline-variant/10 flex items-center justify-between group h-full">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center border border-outline/20">
                           <Info className={`w-5 h-5 ${emailNotif ? 'text-primary' : 'text-on-surface-variant opacity-40'}`} />
                        </div>
                        <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">{t('email')}</span>
                     </div>
                     <button onClick={() => setEmailNotif(!emailNotif)} className={`w-10 h-6 rounded-full relative transition-colors ${emailNotif ? 'bg-primary' : 'bg-outline-variant/30'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${emailNotif ? 'translate-x-4' : ''}`} />
                     </button>
                  </div>
              </div>
            </div>
          </motion.section>

          {/* Security Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container border border-outline-variant/30 rounded-[3.5rem] p-8 md:p-14 shadow-sm text-left"
          >
            <div className="flex items-center gap-6 mb-12 text-left">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl text-on-surface font-heading font-black uppercase tracking-tight">{t('security')}</h3>
                <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">{t('protection_access')}</p>
              </div>
            </div>
            
            <div className="space-y-10 text-left">
               {/* 2FA Card (Pre-UI) */}
               <div className="p-8 bg-emerald-500/[0.03] border border-emerald-500/20 rounded-[3rem] relative overflow-hidden group text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 text-left">
                     <div className="flex items-center gap-6 text-left">
                        <div className="p-5 rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0">
                           <Smartphone className="w-8 h-8" />
                        </div>
                        <div className="text-left">
                           <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg font-black text-on-surface font-heading uppercase tracking-tight">{t('two_factor_auth')}</h4>
                              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded uppercase tracking-widest shadow-sm shadow-emerald-500/40">Recommended</span>
                           </div>
                           <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60 leading-relaxed max-w-sm">{t('two_factor_desc') || "Add an extra layer of security to your account by requiring a verification code."}</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => setShow2FAModal(true)}
                       className="px-8 py-4 bg-primary text-on-primary rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                     >
                       {t('setup_2fa') || "Setup Now"}
                     </button>
                  </div>
               </div>

               {isGoogleUser ? (
                 <div className="p-8 bg-on-surface/[0.03] border border-outline-variant/20 rounded-[2.5rem] flex items-start gap-6 text-left">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                      <Globe className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-on-surface-variant leading-relaxed opacity-60">
                      {t('google_user_pwd_msg')}
                    </p>
                 </div>
               ) : (
                 <form onSubmit={handlePasswordUpdate} className="space-y-8 text-left">
                    {pwdError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                        {pwdError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block ml-2 opacity-60">{t('new_password')}</label>
                         <input 
                           name="new_password"
                           className="w-full h-16 px-6 rounded-2xl border border-outline-variant bg-surface text-sm font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                           placeholder="••••••••" 
                           type="password" 
                           required 
                         />
                       </div>
                       <div className="space-y-3 text-left">
                         <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block ml-2 opacity-60">{t('confirm_new_password')}</label>
                         <input 
                           name="confirm_new_password"
                           className="w-full h-16 px-6 rounded-2xl border border-outline-variant bg-surface text-sm font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                           placeholder="••••••••" 
                           type="password" 
                           required 
                         />
                       </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button 
                        className="px-10 py-5 bg-on-surface text-surface rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-on-surface/20 active:scale-95 transition-all disabled:opacity-70 flex items-center gap-3" 
                        type="submit"
                        disabled={isUpdatingPassword}
                      >
                        {isUpdatingPassword ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <Shield className="w-5 h-5" />
                          </motion.div>
                        ) : <Shield className="w-5 h-5" />}
                        {isUpdatingPassword ? t('processing') : t('update_password')}
                      </button>
                    </div>
                 </form>
               )}
            </div>
          </motion.section>
        </div>

        {/* Danger Zone Aside */}
        <aside className="lg:col-span-4 space-y-10 text-left">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-rose-500/5 border border-rose-500/20 rounded-[3rem] p-10 sticky top-24 space-y-10 text-left"
          >
            <div className="flex items-center gap-4 text-rose-500 text-left">
               <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                  <Trash2 className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-heading font-black uppercase tracking-tight leading-none">{t('danger_zone')}</h3>
            </div>
            
            <div>
               <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4 opacity-70 text-left">{t('warning') || "CAUTION"}</p>
               <p className="text-xs text-on-surface-variant font-bold leading-relaxed opacity-60 mb-8 text-left">
                 {t('delete_account_desc')}
               </p>
               <button 
                 onClick={() => setShowDeleteModal(true)}
                 className="w-full py-5 px-6 border-2 border-rose-500 text-rose-500 font-black rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-95 outline-none focus:ring-4 focus:ring-rose-500/20 uppercase tracking-[0.2em] text-[10px]"
               >
                 {t('delete_account')}
               </button>
            </div>

            {/* Account Meta Stats */}
            <div className="pt-10 border-t border-outline-variant/10 space-y-6 text-left">
              <div className="flex items-center gap-5 text-left">
                <div className="w-12 h-12 rounded-2xl bg-on-surface/[0.05] flex items-center justify-center">
                  <CreditCard className="text-on-surface-variant w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">{t('member_tier')}</p>
                  <p className="text-sm font-black text-on-surface uppercase tracking-tight">{t((currentMember?.role || 'Standard').toLowerCase()) || currentMember?.role || t('standard_tier')}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-left">
                <div className="w-12 h-12 rounded-2xl bg-on-surface/[0.05] flex items-center justify-center">
                  <Calendar className="text-on-surface-variant w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">{t('member_since')}</p>
                  <p className="text-sm font-black text-on-surface uppercase tracking-tight">{currentMember?.joinDate || t('member_since_date')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </aside>
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
              className="relative bg-surface-container border border-outline-variant/30 rounded-[3rem] max-w-sm w-full shadow-2xl p-10 z-10 text-center"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center mb-8 mx-auto shadow-inner">
                <AlertTriangle className="text-rose-500 w-10 h-10" />
              </div>
              <h2 className="text-2xl text-on-surface mb-4 font_heading font-black uppercase tracking-tight leading-none">{t('are_you_sure')}</h2>
              <p className="text-xs text-on-surface-variant font-bold leading-relaxed opacity-60 mb-10 pb-4 border-b border-outline/10 uppercase tracking-widest">
                {t('delete_confirm_desc')}
              </p>
              <div className="flex flex-col gap-4">
                 <button 
                  onClick={handleDeleteAccount}
                  className="w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-2xl shadow-rose-500/40 active:scale-95"
                >
                  {t('yes_delete')}
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-on-surface/5 text-on-surface hover:bg-on-surface/10 transition-all"
                >
                  {t('cancel')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2FA Setup Modal Placeholder */}
      <AnimatePresence>
         {show2FAModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShow2FAModal(false)} className="absolute inset-0 bg-on-surface/60 backdrop-blur-md" />
               <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-surface-container border border-outline/30 rounded-[3.5rem] max-w-md w-full shadow-2xl p-10 z-10 text-center">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center mb-10 mx-auto shadow-inner">
                     <Shield className="text-emerald-500 w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-black font-heading uppercase tracking-tight text-on-surface mb-4">Enhance Security</h2>
                  <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 leading-relaxed max-w-xs mx-auto mb-10">
                     We are preparing a secure Two-Factor Authentication (2FA) experience using biometric and authenticator apps. Stay tuned!
                  </p>
                  <div className="space-y-4">
                     <div className="p-6 bg-on-surface/5 rounded-3xl border border-outline/10 text-left flex items-center gap-5 group">
                        <div className="p-3 bg-surface rounded-xl text-primary border border-outline/20">
                           <Key className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-on-surface uppercase tracking-widest">Hardware Keys</p>
                           <p className="text-[9px] text-on-surface-variant font-bold uppercase opacity-40">Coming Soon</p>
                        </div>
                     </div>
                     <button onClick={() => setShow2FAModal(false)} className="w-full py-5 bg-on-surface text-surface rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-on-surface/20 active:scale-95 transition-all">
                        {t('confirm')}
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
