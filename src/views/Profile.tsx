import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, Copy, CreditCard, ChevronRight, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, BellRing, Info, Calendar, Save, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { updateProfile } from 'firebase/auth';

import { toast } from 'react-hot-toast';

export default function Profile() {
  const { t, user, updateProfileData, currentMember } = useApp();
  
  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    phone: currentMember?.phone || user?.phoneNumber || "",
    address: currentMember?.address || "",
    email: user?.email || ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.displayName || "",
        phone: currentMember?.phone || user.phoneNumber || "",
        address: currentMember?.address || "",
        email: user.email || ""
      });
      setAvatarUrl(user.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuC9oFhmFaa1uZBlTYMdM_doiRJ-D_1BT1K8HBEtU1uP3Rsffzr2uJ3_XzEBQfuCDX8aem149cLYHiUgcfVtFm9LfULHbm7qnZUjBdpo_bWxIhEZuuEjsBJllfYoWLtG-n-N7NpFZlDo9l-K16wrFggc6ip4xZ0C9Qpa76Gntr9Wb7d_nuB_RwoPfJFy3qniXF9_XXB-7oz6uu7VzZTesvjtdpzkTDdO66mOOZwrT_gvr8PPcowHjH2nQILam5V77pO20QZexzsUtxag");
    }
  }, [user, currentMember]);

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
      await updateProfileData({
        fullName: formData.fullName,
        photoURL: avatarUrl,
        phone: formData.phone,
        address: formData.address
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
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <AnimatePresence>
        {showSavedMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-[100] bg-emerald-500 text-white px-8 py-4 rounded-full shadow-2xl shadow-emerald-500/30 font-black text-xs uppercase tracking-widest flex items-center gap-3"
          >
            <div className="bg-white/20 p-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            {t('saved_success')}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{t('account')}</p>
          </div>
          <h1 className="text-4xl md:text-5xl text-on-surface font-heading font-extrabold tracking-tight underline decoration-primary/20 decoration-8 underline-offset-8">
            {t('your_profile')}
          </h1>
          <p className="text-on-surface-variant font-medium mt-4 max-w-md">{t('profile_desc')}</p>
        </motion.div>
      </header>

      {/* Profile Header Hero */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-surface-container p-8 md:p-12 rounded-[3rem] border border-outline-variant/30 shadow-sm group"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-mesh-accent rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[3rem] overflow-hidden border-[6px] border-surface shadow-2xl bg-on-surface/5 group/avatar transition-transform duration-700 hover:scale-105">
              <img 
                alt="User Avatar" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" 
                src={avatarUrl} 
              />
            </div>
            <button 
              onClick={triggerFileInput}
              className="absolute -bottom-2 -right-2 bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 hover:bg-primary-container transition-all hover:scale-110 active:scale-95 group/cam"
            >
              <Camera className="w-6 h-6 group-hover/cam:rotate-12 transition-transform" />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-4xl md:text-5xl text-on-surface font-heading font-black tracking-tight mb-2">
                {formData.fullName || t('user_name_default')}
              </h2>
              <p className="text-on-surface-variant font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 opacity-40" />
                {formData.email}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {currentMember?.isAdmin && (
                <div className="px-4 py-2 bg-rose-500/10 rounded-xl flex items-center gap-2 border border-rose-500/20 hover:bg-rose-500/20 transition-colors">
                  <BadgeCheck className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                    {t('administrator')}
                  </span>
                </div>
              )}
              <div className="px-4 py-2 bg-on-surface/[0.05] rounded-xl flex items-center gap-2 border border-outline-variant/20 hover:bg-on-surface/[0.08] transition-colors">
                 <div className="w-2 h-2 rounded-full bg-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                   {t((currentMember?.role || 'Standard').toLowerCase()) || currentMember?.role || t('standard_tier')}
                 </span>
              </div>
              <div className="px-4 py-2 bg-primary/10 rounded-xl flex items-center gap-2 border border-primary/20 hover:bg-primary/20 transition-colors">
                 <BadgeCheck className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {t('verified_account')}
                 </span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 space-y-8"
        >
          {/* Form Card */}
          <div className="bg-surface-container p-8 md:p-12 rounded-[3.5rem] border border-outline-variant/30 shadow-sm space-y-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Save className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl text-on-surface font-heading font-black uppercase tracking-tight">{t('personal_info')}</h2>
                <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">{t('general_settings')}</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant block ml-1 uppercase tracking-[0.2em]">{t('full_name')}</label>
                  <input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full h-14 px-5 rounded-2xl border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary text-sm font-bold bg-surface-container text-on-surface transition-all outline-none" 
                    type="text" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant block ml-1 uppercase tracking-[0.2em]">{t('phone_number')}</label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full h-14 px-5 rounded-2xl border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary text-sm font-bold bg-surface-container text-on-surface transition-all outline-none" 
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant block ml-1 uppercase tracking-[0.2em]">{t('address')}</label>
                <input 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full h-14 px-5 rounded-2xl border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary text-sm font-bold bg-surface-container text-on-surface transition-all outline-none" 
                  type="text" 
                  placeholder="123 Sukhumvit, Bangkok"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant block ml-1 uppercase tracking-[0.2em]">{t('email')}</label>
                <div className="relative group">
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-14 px-5 rounded-2xl border border-outline-variant/40 group-focus-within:border-primary focus:ring-1 focus:ring-primary text-sm font-bold bg-surface-container text-on-surface pr-14 transition-all outline-none" 
                    type="email" 
                    readOnly
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-500/10 p-1.5 rounded-full">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 ml-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider italic">{t('email_verified_msg')}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-outline-variant/10 flex flex-wrap gap-4 justify-end">
                <button 
                  className="px-10 py-4 rounded-2xl text-xs font-black bg-primary text-on-primary hover:bg-primary-container shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-70 uppercase tracking-widest" 
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Save className="w-4 h-4" />
                    </motion.div>
                  ) : <Save className="w-4 h-4 group-hover:rotate-6 transition-transform" />}
                  {isSaving ? t('saving') : t('save_changes')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Sidebar Info Cards */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 space-y-8"
        >
          <div className="bg-surface-container p-8 rounded-[3rem] border border-outline-variant/30 shadow-sm space-y-8 transition-colors duration-300">
            <h3 className="text-xl text-on-surface font-heading font-black uppercase tracking-tight">{t('member_details')}</h3>
            <div className="space-y-6">
              <div className="p-6 bg-on-surface/[0.03] rounded-[2rem] border border-outline-variant/10 group">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-2 opacity-60">{t('user_id')}</label>
                <div className="flex items-center justify-between gap-2">
                  <code className="font-mono font-bold text-on-surface text-sm break-all">{memberId}</code>
                  <button 
                    onClick={handleCopyId}
                    className={`p-2.5 rounded-xl transition-all shadow-sm shrink-0 ${isCopied ? 'bg-emerald-500 text-white' : 'bg-surface hover:bg-on-surface/5 text-on-surface-variant'}`}
                  >
                    {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="p-6 bg-on-surface/[0.03] rounded-[2rem] border border-outline-variant/10">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-2 opacity-60">{t('member_since')}</label>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary opacity-50" />
                  <p className="font-black text-on-surface text-lg font-heading">{currentMember?.joinDate || t('member_since_date')}</p>
                </div>
              </div>
              <div className="p-6 bg-on-surface/[0.03] rounded-[2rem] border border-outline-variant/10">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-2 opacity-60">{t('total_spent')}</label>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary opacity-50" />
                  <p className="font-black text-on-surface text-lg font-heading tracking-tight">฿{(currentMember?.spending || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="p-6 bg-on-surface/[0.03] rounded-[2rem] border border-outline-variant/10">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-2 opacity-60">{t('account_status')}</label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] animate-pulse"></div>
                    <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
                  </div>
                  <p className="font-black text-on-surface text-lg font-heading uppercase tracking-widest">{t('active')}</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-primary p-8 rounded-[3rem] shadow-2xl shadow-primary/40 text-on-primary flex flex-col justify-between min-h-[250px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -mr-24 -mt-24 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-2xl opacity-30" />
            
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-inner">
                <CreditCard className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black font-heading tracking-tight mb-2">{t('member_subscription')}</h4>
              <p className="text-sm text-on-primary/70 leading-relaxed font-bold uppercase tracking-wide">{t('renew_in').replace('{days}', '14')}</p>
            </div>
            
            <button 
              onClick={() => toast.error(t('feature_coming_soon'))}
              className="relative z-10 w-full py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all mt-6"
            >
              {t('manage_plan')}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Settings Grid Refined */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: t('security'),
            items: [
              { icon: Lock, label: t('change_password'), action: '/settings', color: 'primary' },
              { icon: ShieldCheck, label: t('two_factor_auth'), action: () => setIsTwoFactor(!isTwoFactor), status: isTwoFactor, color: 'emerald' }
            ]
          },
          {
            title: t('communication'),
            items: [
              { icon: Mail, label: t('newsletter_subscription'), desc: t('newsletter_desc'), action: () => setIsNewsletter(!isNewsletter), status: isNewsletter, type: 'switch' },
              { icon: BellRing, label: t('push_notifications'), desc: t('push_desc'), action: () => setIsPush(!isPush), status: isPush, type: 'switch' }
            ]
          }
        ].map((section, sidx) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + sidx * 0.1 }}
            className="bg-surface-container p-8 rounded-[3rem] border border-outline-variant/30 shadow-sm"
          >
            <h3 className="text-xl text-on-surface mb-8 font-heading font-black uppercase tracking-tight">{section.title}</h3>
            <ul className="space-y-3">
              {section.items.map((item, iidx) => (
                <div key={item.label}>
                  {item.type === 'switch' ? (
                    <div className="flex items-center justify-between p-5 hover:bg-on-surface/[0.03] rounded-3xl transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-on-surface/[0.05] flex items-center justify-center group-hover:bg-primary/10 transition-all">
                          <item.icon className="text-on-surface-variant w-5 h-5 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <p className="text-on-surface font-black text-sm uppercase tracking-wider">{item.label}</p>
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1 opacity-50">{item.desc}</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={item.action as any}
                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${item.status ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-on-surface/10'}`}
                      >
                        <span 
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${item.status ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                      </button>
                    </div>
                  ) : (
                    <Link 
                      to={typeof item.action === 'string' ? item.action : '#'}
                      onClick={typeof item.action === 'function' ? item.action as any : undefined}
                      className="flex items-center justify-between p-5 hover:bg-on-surface/[0.03] rounded-3xl transition-all group group/row"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl bg-on-surface/[0.05] flex items-center justify-center transition-all ${item.color === 'emerald' ? 'group-hover/row:bg-emerald-500/10' : 'group-hover/row:bg-primary/10'}`}>
                          <item.icon className={`text-on-surface-variant w-5 h-5 transition-colors ${item.color === 'emerald' ? 'group-hover/row:text-emerald-500' : 'group-hover/row:text-primary'}`} />
                        </div>
                        <span className="text-on-surface font-black text-sm uppercase tracking-wider">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.status !== undefined && (
                          <span className={`text-[9px] font-black p-2 rounded-xl uppercase tracking-widest border transition-all ${item.status ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/10' : 'text-on-surface-variant bg-on-surface/5 border-outline-variant/30 opacity-40'}`}>
                            {item.status ? t('enabled') : t('disabled')}
                          </span>
                        )}
                        <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
