import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Camera, CheckCircle2, Copy, CreditCard, ChevronRight, Mail, 
  Phone, Lock, Eye, EyeOff, ShieldCheck, BellRing, Info, 
  Calendar, Save, BadgeCheck, Wallet, TrendingUp, User, 
  MapPin, Percent, Key, Settings as SettingsIcon, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';

export default function Profile() {
  const { t, user, updateProfileData, currentMember, loading } = useApp();
  
  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    phone: currentMember?.phone || user?.phoneNumber || "",
    address: currentMember?.address || "",
    email: user?.email || ""
  });

  const [avatarUrl, setAvatarUrl] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuC9oFhmFaa1uZBlTYMdM_doiRJ-D_1BT1K8HBEtU1uP3Rsffzr2uJ3_XzEBQfuCDX8aem149cLYHiUgcfVtFm9LfULHbm7qnZUjBdpo_bWxIhEZuuEjsBJllfYoWLtG-n-N7NpFZlDo9l-K16wrFggc6ip4xZ0C9Qpa76Gntr9Wb7d_nuB_RwoPfJFy3qniXF9_XXB-7oz6uu7VzZTesvjtdpzkTDdO66mOOZwrT_gvr8PPcowHjH2nQILam5V77pO20QZexzsUtxag");
  const [isNewsletter, setIsNewsletter] = useState(true);
  const [isPush, setIsPush] = useState(false);
  const [isTwoFactor, setIsTwoFactor] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const memberId = user?.uid ? `#MEM-${user.uid.substring(0, 8).toUpperCase()}` : "#MEM-8842-XJ";

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

  const profileCompleteness = useMemo(() => {
    let score = 0;
    if (formData.fullName) score += 25;
    if (formData.phone) score += 25;
    if (formData.address) score += 25;
    if (user?.photoURL || avatarUrl !== "https://lh3.googleusercontent.com/aida-public/AB6AXuC9oFhmFaa1uZBlTYMdM_doiRJ-D_1BT1K8HBEtU1uP3Rsffzr2uJ3_XzEBQfuCDX8aem149cLYHiUgcfVtFm9LfULHbm7qnZUjBdpo_bWxIhEZuuEjsBJllfYoWLtG-n-N7NpFZlDo9l-K16wrFggc6ip4xZ0C9Qpa76Gntr9Wb7d_nuB_RwoPfJFy3qniXF9_XXB-7oz6uu7VzZTesvjtdpzkTDdO66mOOZwrT_gvr8PPcowHjH2nQILam5V77pO20QZexzsUtxag") score += 25;
    return score;
  }, [formData, user, avatarUrl]);

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
         <Skeleton variant="rounded" className="h-[400px] w-full rounded-[4rem]" />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton variant="rounded" className="h-[300px] w-full rounded-[3rem]" />
            <Skeleton variant="rounded" className="h-[300px] w-full rounded-[3rem]" />
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 text-left">
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

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{t('account')}</p>
          </div>
          <h1 className="text-4xl md:text-5xl text-on-surface font-heading font-black tracking-tight uppercase leading-none">
            {t('your_profile')}
          </h1>
          <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest opacity-40 mt-4 max-w-md">{t('profile_desc')}</p>
        </motion.div>
      </header>

      {/* Profile Header Hero */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-surface-container p-8 md:p-12 rounded-[3.5rem] border border-outline-variant/30 shadow-sm group text-left"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-[80px] opacity-50" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-left">
          <div className="relative group/avatar-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-[3.5rem] overflow-hidden border-[8px] border-surface shadow-2xl bg-on-surface/5 transition-transform duration-700 hover:scale-105 relative z-10">
              <img 
                alt="User Avatar" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                src={avatarUrl} 
              />
            </div>
            <button 
              onClick={triggerFileInput}
              className="absolute -bottom-2 -right-2 z-20 bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 hover:bg-primary-container transition-all hover:scale-110 active:scale-95 group/cam"
              aria-label="Change photo"
            >
              <Camera className="w-6 h-6 group-hover/cam:rotate-12 transition-transform" />
            </button>
            <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] blur-2xl group-hover/avatar-container:bg-primary/10 transition-colors" />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="text-left">
              <h2 className="text-4xl md:text-6xl text-on-surface font-heading font-black tracking-tight mb-2 uppercase leading-[0.9]">
                {formData.fullName || t('user_name_default')}
              </h2>
              <p className="text-on-surface-variant font-black text-[11px] uppercase tracking-widest flex items-center justify-center md:justify-start gap-3 opacity-60">
                <Mail className="w-4 h-4 text-primary" />
                {formData.email}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {currentMember?.isAdmin && (
                <div className="px-5 py-2.5 bg-rose-500/10 rounded-2xl flex items-center gap-3 border border-rose-500/20 shadow-sm">
                  <BadgeCheck className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                    {t('administrator')}
                  </span>
                </div>
              )}
              <div className="px-5 py-2.5 bg-on-surface/[0.05] rounded-2xl flex items-center gap-3 border border-outline-variant/20 shadow-sm transition-colors hover:bg-on-surface/[0.08]">
                 <div className="w-2 h-2 rounded-full bg-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                   {t((currentMember?.role || 'Standard').toLowerCase()) || currentMember?.role || t('standard_tier')}
                 </span>
              </div>
              <div className="px-5 py-2.5 bg-emerald-500/10 rounded-2xl flex items-center gap-3 border border-emerald-500/20 shadow-sm transition-colors hover:bg-emerald-500/20">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    {t('verified_account')}
                 </span>
              </div>
            </div>

            {/* Profile Completeness Bar */}
            <div className="space-y-3 pt-6 border-t border-outline-variant/20 max-w-sm mx-auto md:mx-0 text-left">
               <div className="flex justify-between items-center text-left">
                  <p className="text-[10px] font-black text-on-surface uppercase tracking-[0.2em]">{t('profile_completion')}</p>
                  <span className="text-sm font-black text-primary font-mono">{profileCompleteness}%</span>
               </div>
               <div className="h-3 bg-on-surface/5 rounded-full overflow-hidden p-0.5 border border-outline/30">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompleteness}%` }}
                    className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                  />
               </div>
               <p className="text-[9px] text-on-surface-variant font-bold italic opacity-40 text-left">
                 {profileCompleteness === 100 ? "Profile is fully optimized!" : "Complete your profile to unlock more benefits."}
               </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 space-y-10"
        >
          {/* Form Card */}
          <div className="bg-surface-container p-8 md:p-14 rounded-[4rem] border border-outline-variant/30 shadow-sm space-y-12">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <User className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl text-on-surface font-heading font-black uppercase tracking-tight">{t('personal_info')}</h2>
                <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">{t('general_settings')}</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-on-surface-variant block ml-1 uppercase tracking-[0.2em] opacity-60">{t('full_name')}</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full h-16 pl-14 pr-5 rounded-2xl border border-outline-variant bg-surface text-sm font-bold text-on-surface transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      type="text" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-on-surface-variant block ml-1 uppercase tracking-[0.2em] opacity-60">{t('phone_number')}</label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-16 pl-14 pr-5 rounded-2xl border border-outline-variant bg-surface text-sm font-bold text-on-surface transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-on-surface-variant block ml-1 uppercase tracking-[0.2em] opacity-60">{t('address')}</label>
                <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full h-16 pl-14 pr-5 rounded-2xl border border-outline-variant bg-surface text-sm font-bold text-on-surface transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      type="text" 
                      placeholder="123 Sukhumvit, Bangkok"
                    />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-on-surface-variant block ml-1 uppercase tracking-[0.2em] opacity-60">{t('email')}</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-outline opacity-40" />
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-16 pl-14 pr-16 rounded-2xl border border-outline-variant bg-on-surface/[0.02] text-sm font-bold text-on-surface opacity-60 cursor-not-allowed outline-none" 
                    type="email" 
                    readOnly
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-emerald-500/10 p-1.5 rounded-full">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-outline-variant/20 flex flex-wrap gap-4 justify-end">
                <button 
                  className="px-12 py-5 rounded-2xl text-[10px] font-black bg-primary text-on-primary hover:bg-primary-container shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center gap-4 disabled:opacity-70 uppercase tracking-[0.2em]" 
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Save className="w-4 h-4" />
                    </motion.div>
                  ) : <Save className="w-5 h-5" />}
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
          className="lg:col-span-4 space-y-10"
        >
          <div className="bg-surface-container p-10 rounded-[4rem] border border-outline-variant/30 shadow-sm space-y-10">
            <h3 className="text-xl text-on-surface font-heading font-black uppercase tracking-tight text-left">{t('member_details')}</h3>
            <div className="space-y-6">
              <div className="p-6 bg-on-surface/[0.03] rounded-[2.5rem] border border-outline-variant/10 group transition-all hover:bg-on-surface/[0.05] text-left">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-2 opacity-60 text-left">{t('user_id')}</label>
                <div className="flex items-center justify-between gap-3 text-left">
                  <code className="font-mono font-bold text-on-surface text-xs break-all opacity-80">{memberId}</code>
                  <button 
                    onClick={handleCopyId}
                    className={`p-3 rounded-xl transition-all shadow-sm shrink-0 ${isCopied ? 'bg-emerald-500 text-white' : 'bg-surface hover:bg-on-surface/5 text-on-surface-variant border border-outline/30'}`}
                  >
                    {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="p-6 bg-on-surface/[0.03] rounded-[2.5rem] border border-outline-variant/10 text-left">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-2 opacity-60 text-left">{t('member_since')}</label>
                <div className="flex items-center gap-4 text-left">
                   <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                     <Calendar className="w-5 h-5 text-primary" />
                   </div>
                   <p className="font-black text-on-surface text-xl font-heading tracking-tight">{currentMember?.joinDate || t('member_since_date')}</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-outline-variant/20 text-left">
                 <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 ml-1 text-left">{t('security_strength')}</p>
                 <div className="flex items-center gap-4 p-5 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 text-left">
                    <Key className="w-6 h-6 text-emerald-500 opacity-60" />
                    <div>
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest opacity-60">{t('high')}</p>
                       <p className="text-xs font-black text-on-surface uppercase tracking-tight">Active Protection</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <Link to="/settings" className="block p-10 bg-on-surface text-surface rounded-[4rem] group relative overflow-hidden shadow-2xl transition-all hover:-translate-y-2 text-left">
             <div className="absolute top-0 right-0 w-32 h-32 bg-surface/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-surface/10 transition-colors" />
             <div className="flex items-center gap-6 relative z-10 text-left">
                <div className="h-14 w-14 bg-surface/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                   <SettingsIcon className="w-7 h-7 text-surface" />
                </div>
                <div className="text-left">
                   <h4 className="text-xl font-black font-heading uppercase tracking-tight">{t('settings')}</h4>
                   <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mt-1">{t('protection_access')}</p>
                </div>
             </div>
             <div className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] opacity-60 group-hover:gap-5 group-hover:opacity-100 transition-all text-left">
                <span>{t('manage_now')}</span>
                <ArrowRight className="w-4 h-4" />
             </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
