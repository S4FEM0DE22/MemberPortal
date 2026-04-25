import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, Copy, CreditCard, ChevronRight, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, BellRing, Info, Calendar, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { updateProfile } from 'firebase/auth';

export default function Profile() {
  const { t, user } = useApp();
  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    phone: user?.phoneNumber || "+1 (555) 0123-4567",
    email: user?.email || ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.displayName || "",
        phone: user.phoneNumber || "+1 (555) 0123-4567",
        email: user.email || ""
      });
      setAvatarUrl(user.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuC9oFhmFaa1uZBlTYMdM_doiRJ-D_1BT1K8HBEtU1uP3Rsffzr2uJ3_XzEBQfuCDX8aem149cLYHiUgcfVtFm9LfULHbm7qnZUjBdpo_bWxIhEZuuEjsBJllfYoWLtG-n-N7NpFZlDo9l-K16wrFggc6ip4xZ0C9Qpa76Gntr9Wb7d_nuB_RwoPfJFy3qniXF9_XXB-7oz6uu7VzZTesvjtdpzkTDdO66mOOZwrT_gvr8PPcowHjH2nQILam5V77pO20QZexzsUtxag");
    }
  }, [user]);

  const [isNewsletter, setIsNewsletter] = useState(true);
  const [isPush, setIsPush] = useState(false);
  const [isTwoFactor, setIsTwoFactor] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuC9oFhmFaa1uZBlTYMdM_doiRJ-D_1BT1K8HBEtU1uP3Rsffzr2uJ3_XzEBQfuCDX8aem149cLYHiUgcfVtFm9LfULHbm7qnZUjBdpo_bWxIhEZuuEjsBJllfYoWLtG-n-N7NpFZlDo9l-K16wrFggc6ip4xZ0C9Qpa76Gntr9Wb7d_nuB_RwoPfJFy3qniXF9_XXB-7oz6uu7VzZTesvjtdpzkTDdO66mOOZwrT_gvr8PPcowHjH2nQILam5V77pO20QZexzsUtxag");
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const memberId = user?.uid ? `#MEM-${user.uid.substring(0, 8).toUpperCase()}` : "#MEM-8842-XJ";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(memberId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProfile(user, {
        displayName: formData.fullName,
        photoURL: avatarUrl
      });
      setIsSaving(false);
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 3000);
    } catch (error) {
      console.error("Error updating profile: ", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <AnimatePresence>
        {showSavedMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {t('saved_success')}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-on-surface font-heading uppercase tracking-tight">{t('your_profile')}</h1>
          <p className="text-on-surface-variant mt-2">{t('profile_desc')}</p>
        </div>
      </header>

      {/* Profile Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-8 bg-surface-container p-8 rounded-2xl shadow-sm border border-outline-variant/30 transition-colors duration-300"
      >
        <div className="relative group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-surface shadow-md bg-on-surface/5 group-hover:scale-105 transition-transform duration-500">
            <img 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
              src={avatarUrl} 
            />
          </div>
          <button 
            onClick={triggerFileInput}
            className="absolute bottom-1 right-1 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-container transition-colors focus:ring-4 focus:ring-primary/20 hover:scale-110 active:scale-95 transition-all"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left space-y-3">
          <h1 className="text-3xl text-on-surface font-heading">{formData.fullName || "User Name"}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="bg-on-surface/10 text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{t('platinum_tier')}</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
              <BadgeCheck className="w-3.5 h-3.5" />
              {t('verified_account')}
            </span>
          </div>
        </div>
      </motion.section>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Personal Details Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-8 bg-surface-container p-8 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-8 transition-colors duration-300"
        >
          <h2 className="text-2xl text-on-surface font-heading">{t('personal_info')}</h2>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('full_name')}</label>
                <input 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface transition-all outline-none" 
                  type="text" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('phone_number')}</label>
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface transition-all outline-none" 
                  type="tel" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('email')}</label>
              <div className="relative">
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface pr-12 transition-all outline-none" 
                  type="email" 
                  required 
                />
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5 fill-emerald-500/10" />
              </div>
              <p className="text-[10px] text-emerald-500 font-bold ml-1 uppercase tracking-wider italic">{t('email_verified_msg')}</p>
            </div>
            <div className="pt-6 border-t border-outline-variant/10 flex flex-wrap gap-4 justify-end">
              <button 
                type="button"
                onClick={() => setFormData({fullName: "Alex Thompson", phone: "+1 (555) 0123-4567", email: "alex.thompson@membership.io"})}
                className="px-8 py-2.5 rounded-full text-sm font-bold text-on-surface-variant border border-outline-variant/30 hover:bg-on-surface/5 active:scale-95 transition-all uppercase tracking-wider"
              >
                {t('cancel')}
              </button>
              <button 
                className="px-8 py-2.5 rounded-full text-sm font-bold bg-primary text-on-primary hover:bg-primary-container shadow-md shadow-primary/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 uppercase tracking-wider" 
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Save className="w-4 h-4" />
                  </motion.div>
                ) : <Save className="w-4 h-4" />}
                {isSaving ? t('saving') : t('save_changes')}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Read-only Member Data Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-4 space-y-6"
        >
          {/* Account Details */}
          <div className="bg-surface-container p-8 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-6 transition-colors duration-300">
            <h3 className="text-xl text-on-surface font-heading uppercase tracking-tight">{t('member_details')}</h3>
            <div className="space-y-4">
              <div className="p-4 bg-on-surface/5 rounded-2xl border border-outline-variant/10">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">{t('user_id')}</label>
                <div className="flex items-center justify-between">
                  <code className="font-mono font-bold text-on-surface text-sm">{memberId}</code>
                  <button 
                    onClick={handleCopyId}
                    className={`p-2 rounded-lg transition-all ${isCopied ? 'bg-emerald-500/10 text-emerald-500' : 'hover:bg-on-surface/10 text-on-surface-variant'}`}
                  >
                    {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="p-4 bg-on-surface/5 rounded-2xl border border-outline-variant/10">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">{t('member_since')}</label>
                <p className="font-bold text-on-surface text-sm">14 ตุลาคม 2021</p>
              </div>
              <div className="p-4 bg-on-surface/5 rounded-2xl border border-outline-variant/10">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">{t('account_status')}</label>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <p className="font-bold text-on-surface text-sm">{t('active')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Renewal Alert */}
          <div className="bg-primary/10 border border-primary/20 p-8 rounded-[2rem] flex flex-col items-center text-center space-y-4 min-h-[200px] justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
            <CreditCard className="text-primary w-12 h-12 relative z-10" />
            <p className="text-sm text-on-surface leading-relaxed relative z-10">{t('renew_in').replace('{days}', '14')}</p>
            <button 
              onClick={() => alert('ฟีเจอร์จัดการแผนการเป็นสมาชิกกำลังจะมาเร็วๆ นี้')}
              className="w-full py-3 bg-surface border border-outline-variant/30 text-primary text-sm font-black rounded-2xl hover:bg-primary/5 transition-all active:scale-95 shadow-sm relative z-10 uppercase tracking-widest"
            >
              {t('manage_plan')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Secondary Settings Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Security Settings Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-container p-8 rounded-[2rem] border border-outline-variant/30 shadow-sm transition-colors duration-300"
        >
          <h3 className="text-xl text-on-surface mb-6 font-heading uppercase tracking-tight">{t('security')}</h3>
          <ul className="space-y-2">
            <Link 
              to="/settings"
              className="flex items-center justify-between p-4 hover:bg-on-surface/5 rounded-2xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-on-surface/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Lock className="text-on-surface-variant w-5 h-5 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-on-surface font-bold">{t('change_password')}</span>
              </div>
              <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
            </Link>
            <li 
              onClick={() => setIsTwoFactor(!isTwoFactor)}
              className="flex items-center justify-between p-4 hover:bg-on-surface/5 rounded-2xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-on-surface/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                  <ShieldCheck className="text-on-surface-variant w-5 h-5 group-hover:text-emerald-500 transition-colors" />
                </div>
                <span className="text-on-surface font-bold">{t('two_factor_auth')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border transition-all ${isTwoFactor ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'text-on-surface-variant bg-on-surface/5 border-outline-variant/30'}`}>
                  {isTwoFactor ? t('enabled') : t('disabled')}
                </span>
                <ChevronRight className="text-on-surface-variant w-4 h-4" />
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Communication Preferences Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-container p-8 rounded-[2rem] border border-outline-variant/30 shadow-sm transition-colors duration-300"
        >
          <h3 className="text-xl text-on-surface mb-6 font-heading uppercase tracking-tight">{t('communication')}</h3>
          <ul className="space-y-4">
            <li className="flex items-center justify-between p-4 hover:bg-on-surface/5 rounded-2xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-on-surface/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail className="text-on-surface-variant w-5 h-5 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-on-surface font-bold">{t('newsletter_subscription')}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{t('newsletter_desc')}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsNewsletter(!isNewsletter)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isNewsletter ? 'bg-primary' : 'bg-outline-variant/30'}`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out ${isNewsletter ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </li>
            <li className="flex items-center justify-between p-4 hover:bg-on-surface/5 rounded-2xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-on-surface/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <BellRing className="text-on-surface-variant w-5 h-5 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-on-surface font-bold">{t('push_notifications')}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{t('push_desc')}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsPush(!isPush)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isPush ? 'bg-primary' : 'bg-outline-variant/30'}`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out ${isPush ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </li>
          </ul>
        </motion.div>
      </section>
    </div>
  );
}

function BadgeCheck({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12a4.49 4.49 0 0 1 1.549-3.397 4.491 4.491 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
  );
}
