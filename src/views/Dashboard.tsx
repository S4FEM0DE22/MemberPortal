import React, { useMemo, useState } from 'react';
import { Users, TrendingUp, UserPlus, CreditCard, BadgeCheck, FileEdit, ArrowRight, MessageSquarePlus, FileSpreadsheet, ChevronRight, CheckCircle2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { TIER_COLORS, TIER_BENEFITS, ALL_ROLES } from '../constants';

export default function Dashboard() {
  const { t, members, user, isAdmin, currentMember, exportMembers, purchaseItem, activities: realActivities } = useApp();
  
  const totalMembersCount = members.length;
  const onlineMembersCount = members.filter(m => m.status === 'Active').length;
  const pendingMembersCount = members.filter(m => m.status === 'Pending').length;

  const displayName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  const [showAllTiers, setShowAllTiers] = useState(false);

  const tierStats = useMemo(() => {
    if (members.length === 0) return [];
    
    const roleCounts = members.reduce((acc: Record<string, number>, m) => {
      acc[m.role] = (acc[m.role] || 0) + 1;
      return acc;
    }, {});

    const distribution = Object.entries(roleCounts)
      .map(([role, count]: [string, number]) => {
        const percentage = (count / members.length) * 100;
        const color = TIER_COLORS[role] || 'bg-slate-400';

        return { name: role, value: Math.round(percentage), color };
      })
      .sort((a, b) => b.value - a.value);

    return distribution.slice(0, 6);
  }, [members]);

  const currentTierBenefits = useMemo(() => {
    const role = currentMember?.role || 'Standard';
    return TIER_BENEFITS[role] || TIER_BENEFITS['Standard'];
  }, [currentMember]);

  const dashboardActivities = useMemo(() => {
    return realActivities.slice(0, 3).map(act => {
      let icon = FileEdit;
      let iconBg = 'bg-primary/10';
      let iconColor = 'text-primary';

      if (act.type === 'payment') {
        icon = CreditCard;
        iconBg = 'bg-primary/10';
        iconColor = 'text-primary';
      } else if (act.type === 'member') {
        icon = BadgeCheck;
        iconBg = 'bg-emerald-500/10';
        iconColor = 'text-emerald-500';
      } else if (act.type === 'profile') {
        icon = FileEdit;
        iconBg = 'bg-orange-500/10';
        iconColor = 'text-orange-500';
      } else if (act.type === 'system') {
        icon = BadgeCheck;
        iconBg = 'bg-on-surface/5';
        iconColor = 'text-on-surface-variant';
      }

      return { ...act, icon, iconBg, iconColor };
    });
  }, [realActivities]);

  const nextTiers = [
    { role: 'Silver', min: 1000 },
    { role: 'Gold', min: 5000 },
    { role: 'Platinum', min: 10000 },
    { role: 'Diamond', min: 20000 },
    { role: 'Founder', min: 50000 },
  ];
  
  const currentSpending = currentMember?.spending || 0;
  const nextTier = nextTiers.find(t => t.min > currentSpending);
  const progress = nextTier ? Math.min((currentSpending / nextTier.min) * 100, 100) : 100;

  return (
    <div className="space-y-12 pb-16">
      {/* Personal Tier Hero (Visible to Everyone) */}
      <section className="relative overflow-hidden p-6 sm:p-8 md:p-14 rounded-[2.5rem] sm:rounded-[4rem] glass border border-outline/50 group transition-all duration-500 shadow-xl shadow-primary/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-[80px]" />
        
        <div className="relative z-10 flex flex-col lg:row-span-1 lg:flex-row lg:items-center justify-between gap-8 md:gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
            <p className="text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-3 sm:mb-4 drop-shadow-sm">{isAdmin ? t('admin_console') : t('welcome_back')}</p>
            <h1 className="text-3xl sm:text-5xl md:text-7xl text-on-surface font-heading font-extrabold tracking-tight mb-5 sm:mb-6 leading-[1.1] break-words">
              {t('welcome')}, <span className="text-primary bg-clip-text decoration-primary/30 underline underline-offset-4 sm:underline-offset-8 break-keep">{displayName}</span>
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {isAdmin && (
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-rose-500/10 rounded-full border border-rose-500/20 backdrop-blur-sm">
                  <BadgeCheck className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{t('admin_auth')}</span>
                </div>
              )}
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
                <BadgeCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{t('tier_account').replace('{tier}', currentMember?.role || 'Standard')}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-surface-container p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border border-outline shadow-2xl shadow-primary/10 flex flex-col gap-6 lg:min-w-[400px] card-hover"
          >
            <div className="flex justify-between items-center">
              <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-60 leading-none">{t('net_contribution')}</p>
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <TrendingUp className="w-4 h-4 sm:w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-[11px] sm:text-sm font-bold text-on-surface-variant/40 mb-1">THB</div>
              <h3 className="text-4xl sm:text-5xl font-black text-on-surface font-mono tracking-tighter tabular-nums">฿{currentSpending.toLocaleString()}</h3>
            </div>
            {nextTier && (
              <div className="space-y-4 pt-4 border-t border-outline-variant/30">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-on-surface uppercase tracking-widest leading-none">{t('next')}: {nextTier.role}</p>
                  <p className="text-base font-black text-primary font-mono leading-none">{Math.round(progress)}%</p>
                </div>
                <div className="h-3 bg-on-surface/5 rounded-full overflow-hidden p-0.5 border border-outline-variant/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed italic opacity-70">
                  {t('auto_upgrade_hint').replace('{amount}', `฿${(nextTier.min - currentSpending).toLocaleString()}`).replace('{role}', nextTier.role)}
                </p>
              </div>
            )}
            
            <div className="mt-2 pt-4 border-t border-outline-variant/30">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 mb-3">{t('tier_privileges')}</p>
              <div className="flex flex-wrap gap-2">
                {currentTierBenefits.map((benefit, i) => (
                  <span key={i} className="text-[9px] font-bold px-2.5 py-1 bg-primary/5 text-primary rounded-lg border border-primary/10">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Admin Specific Content */}
      {isAdmin && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-6">
             <div className="h-[1px] flex-1 bg-outline/40"></div>
             <h2 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em] opacity-50 whitespace-nowrap">{t('operational_intel')}</h2>
             <div className="h-[1px] flex-1 bg-outline/40"></div>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 sm:gap-8">
            {[
              { label: t('active_database'), value: totalMembersCount.toLocaleString(), change: '+12%', icon: Users, color: 'primary' },
              { label: t('online_infra'), value: onlineMembersCount.toLocaleString(), change: '+5.2%', icon: TrendingUp, color: 'emerald', filter: 'Active' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="sm:col-span-1 md:col-span-2"
                >
                  <Link 
                    to="/members"
                    state={{ filter: stat.filter }}
                    className="relative block h-full bg-surface-container p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-outline card-hover overflow-hidden"
                  >
                    <div className="relative z-10 flex justify-between items-start mb-10 sm:mb-12">
                      <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-[1rem] sm:rounded-[1.25rem] shadow-lg flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${stat.color === 'primary' ? 'bg-primary/10 text-primary shadow-primary/10' : 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10'}`}>
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <span className="text-emerald-500 text-[9px] sm:text-[10px] font-black flex items-center bg-emerald-500/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-emerald-500/10 uppercase tracking-widest leading-none">{stat.change}</span>
                    </div>
                    <div className="relative z-10">
                      <p className="text-on-surface-variant text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] mb-1 sm:mb-2 opacity-50">{stat.label}</p>
                      <h3 className="text-3xl sm:text-5xl text-on-surface font-heading font-black tabular-nums tracking-tighter">{stat.value}</h3>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sm:col-span-1 md:col-span-2"
            >
              <Link 
                to="/members"
                state={{ filter: 'Pending' }}
                className="relative block h-full bg-on-surface text-surface p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-on-surface/20 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-surface/5 rounded-full -mr-24 -mt-24 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex justify-between items-start mb-10 sm:mb-12">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 bg-surface/10 backdrop-blur-md text-surface rounded-[1rem] sm:rounded-[1.25rem] flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <UserPlus className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-white text-[9px] sm:text-[10px] font-black rounded-full uppercase tracking-[0.15em] shadow-lg shadow-primary/20 leading-none">{t('action_required')}</span>
                </div>
                <div className="relative z-10">
                  <p className="text-surface/50 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] mb-1 sm:mb-2">{t('pending_approval')}</p>
                  <div className="flex items-baseline gap-2 sm:gap-3">
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tabular-nums tracking-tighter">{pendingMembersCount}</h3>
                    <span className="text-surface/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest">{t('members')}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-surface-container border border-outline rounded-[3rem] shadow-sm overflow-hidden flex flex-col">
              <div className="px-10 py-8 border-b border-outline flex items-center justify-between bg-on-surface/[0.01]">
                <h3 className="text-lg text-on-surface font-heading font-black uppercase tracking-[0.1em]">{t('recent_activity')}</h3>
                <Link to="/activities" className="text-primary text-[11px] font-black uppercase tracking-[0.2em] hover:underline underline-offset-4">{t('view_all')}</Link>
              </div>
              <div className="divide-y divide-outline/60">
                {dashboardActivities.length > 0 ? (
                  dashboardActivities.map((act, idx) => {
                    const Icon = act.icon;
                    return (
                      <div key={idx} className="px-10 py-7 flex items-center gap-6 transition-colors hover:bg-on-surface/[0.02]">
                        <div className={`h-14 w-14 rounded-2xl ${act.iconBg} flex items-center justify-center shadow-sm`}>
                          <Icon className={`${act.iconColor} w-7 h-7`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-on-surface truncate tracking-tight">{act.title}</p>
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.15em] opacity-50 mt-0.5">{act.sub}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {act.amount ? (
                            <span className="text-lg font-black text-on-surface font-mono tracking-tighter leading-none">{act.amount}</span>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest bg-on-surface/5 px-3 py-1.5 rounded-lg opacity-60 leading-none">{act.status}</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-8 py-20 text-center">
                    <div className="w-16 h-16 bg-on-surface/5 rounded-full flex items-center justify-center mx-auto mb-6 opacity-30">
                       <CreditCard className="w-8 h-8" />
                    </div>
                    <p className="text-on-surface-variant font-bold italic opacity-40">{t('no_telemetry')}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-surface-container p-10 rounded-[3rem] border border-outline shadow-sm flex flex-col">
              <h3 className="text-lg text-on-surface font-heading font-black uppercase tracking-[0.1em] mb-10">{t('member_tier_distribution')}</h3>
              <div className="space-y-8 flex-1">
                {tierStats.map((tier) => (
                  <div key={tier.name} className="group-stats">
                    <div className="flex justify-between items-end gap-4 text-xs mb-4">
                      <span className="text-on-surface font-bold text-sm tracking-tight truncate">{tier.name}</span>
                      <span className="text-on-surface font-black font-mono tracking-widest opacity-40 shrink-0">{tier.value}%</span>
                    </div>
                    <div className="w-full bg-on-surface/[0.06] h-3 rounded-full overflow-hidden p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${tier.value}%` }}
                        className={`${tier.color} h-full rounded-full shadow-lg shadow-current/10`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-outline/50">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em] leading-relaxed opacity-40">
                  {t('data_updated_realtime')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <Link to="/profile" className="p-8 sm:p-10 bg-surface-container rounded-[2rem] sm:rounded-[3rem] border border-outline card-hover group flex flex-col gap-6 sm:gap-8">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-[1rem] sm:rounded-[1.25rem] bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
            <CreditCard className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h4 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-on-surface uppercase">{t('curated_shop')}</h4>
            <p className="text-sm text-on-surface-variant mt-1 sm:mt-2 leading-relaxed opacity-70 font-medium">{t('shop_desc')}</p>
          </div>
          <div className="mt-auto pt-4 sm:pt-6 flex items-center gap-3 text-primary text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
            <span>{t('buy_item')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link to="/profile" className="p-8 sm:p-10 bg-surface-container rounded-[2rem] sm:rounded-[3rem] border border-outline card-hover group flex flex-col gap-6 sm:gap-8 transition-all">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-[1rem] sm:rounded-[1.25rem] bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/5">
            <FileEdit className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h4 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-on-surface uppercase">{t('profile')}</h4>
            <p className="text-sm text-on-surface-variant mt-1 sm:mt-2 leading-relaxed opacity-70 font-medium">{t('profile_desc')}</p>
          </div>
          <div className="mt-auto pt-4 sm:pt-6 flex items-center gap-3 text-emerald-500 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
            <span>{t('manage_now')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <button 
          onClick={() => setShowAllTiers(true)}
          className="p-8 sm:p-10 bg-surface-container rounded-[2rem] sm:rounded-[3rem] border border-outline card-hover group flex flex-col gap-6 sm:gap-8 text-left"
        >
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-[1rem] sm:rounded-[1.25rem] bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/5">
            <Star className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h4 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-on-surface uppercase">{t('tier_benefits')}</h4>
            <p className="text-sm text-on-surface-variant mt-1 sm:mt-2 leading-relaxed opacity-70 font-medium">{t('explore_perks')}</p>
          </div>
          <div className="mt-auto pt-4 sm:pt-6 flex items-center gap-3 text-amber-500 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
            <span>{t('view_all_tiers')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {!isAdmin && (
          <div className="p-8 sm:p-10 bg-on-surface/[0.03] rounded-[2rem] sm:rounded-[3rem] border border-outline border-dashed flex flex-col justify-center gap-6 text-center group card-hover">
            <div className="w-16 h-16 bg-on-surface/5 rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
               <MessageSquarePlus className="w-6 h-6 text-on-surface-variant opacity-40" />
            </div>
            <div>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 mb-2">{t('concierge_services')}</p>
              <h4 className="text-lg sm:text-xl font-black font-heading tracking-tight uppercase leading-tight">{t('vip_support')}</h4>
            </div>
            <button className="px-6 py-3 sm:px-8 sm:py-4 bg-on-surface text-surface rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-on-surface/10">
              {t('contact_support')}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAllTiers && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllTiers(false)}
              className="absolute inset-0 bg-on-surface/80 backdrop-blur-xl"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-6xl bg-surface-container rounded-[3rem] shadow-2xl border border-outline overflow-hidden"
            >
              <div className="p-8 sm:p-12 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 sm:mb-12">
                  <div>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl text-on-surface font-black font-heading tracking-tight uppercase leading-[0.9]">{t('membership_tiers')}</h2>
                    <p className="text-xs sm:text-base text-on-surface-variant mt-2 font-medium opacity-60">{t('benefit_list_desc')}</p>
                  </div>
                  <button 
                    onClick={() => setShowAllTiers(false)}
                    className="h-12 w-12 sm:h-16 sm:w-16 bg-on-surface text-surface rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shrink-0"
                  >
                    <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 rotate-180" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {ALL_ROLES.map((role) => (
                    <div 
                      key={role}
                      className={`p-8 sm:p-10 rounded-[2.5rem] border flex flex-col gap-8 transition-all hover:bg-on-surface/[0.02] ${
                        currentMember?.role === role ? 'bg-primary/5 border-primary shadow-2xl shadow-primary/5 scale-105' : 'bg-surface border-outline/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          {currentMember?.role === role && (
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2 block animate-pulse">{t('current_tier')}</span>
                          )}
                          <h4 className="text-2xl sm:text-3xl font-black font-heading tracking-tighter text-on-surface uppercase">{role}</h4>
                        </div>
                        <div className={`h-12 w-12 rounded-2xl ${TIER_COLORS[role] || 'bg-slate-400'} flex items-center justify-center shadow-lg`}>
                          <Star className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40">{t('included_benefits')}</p>
                        <div className="space-y-3">
                          {TIER_BENEFITS[role]?.map((benefit, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-sm font-bold text-on-surface-variant">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!isAdmin && (
        <section className="bg-surface-container border border-outline rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-sm">
          <div className="px-8 py-6 sm:px-12 sm:py-10 border-b border-outline flex items-center justify-between bg-on-surface/[0.01]">
             <h3 className="text-xl sm:text-2xl font-black font-heading uppercase tracking-tight text-on-surface leading-none">{t('recent_activity')}</h3>
             <Link to="/activities" className="text-primary text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] hover:underline underline-offset-4">{t('view_all')}</Link>
          </div>
          <div className="divide-y divide-outline/60">
             {dashboardActivities.length > 0 ? (
               dashboardActivities.map((act, idx) => {
                 const Icon = act.icon;
                 return (
                   <div key={idx} className="px-8 py-6 sm:px-12 sm:py-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 transition-colors hover:bg-on-surface/[0.01] group">
                     <div className="flex items-center gap-4 sm:gap-8 flex-1 min-w-0">
                       <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-[1rem] sm:rounded-[1.25rem] ${act.iconBg} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform shrink-0`}>
                         <Icon className={`${act.iconColor} w-6 h-6 sm:w-8 sm:h-8`} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-lg sm:text-xl font-bold text-on-surface truncate tracking-tight">{act.title}</p>
                         <p className="text-[10px] sm:text-xs text-on-surface-variant font-bold uppercase tracking-[0.15em] opacity-40 mt-0.5 sm:mt-1">{act.sub}</p>
                       </div>
                     </div>
                     <div className="text-left sm:text-right shrink-0 pl-16 sm:pl-0">
                       <p className="text-lg sm:text-xl font-black text-on-surface truncate font-mono tracking-tighter tabular-nums leading-none">
                         {act.amount || act.status || act.name || act.time}
                       </p>
                     </div>
                   </div>
                 );
               })
             ) : (
               <div className="p-16 sm:p-20 text-center">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 bg-on-surface/5 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 opacity-20">
                     <CreditCard className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <p className="text-on-surface-variant text-base sm:text-lg font-bold italic opacity-40">{t('history_indexed')}</p>
               </div>
             )}
          </div>
        </section>
      )}
    </div>
  );
}
