import React, { useMemo } from 'react';
import { Users, TrendingUp, UserPlus, CreditCard, BadgeCheck, FileEdit, ArrowRight, MessageSquarePlus, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { t, members, user, isAdmin, currentMember, exportMembers, purchaseItem, activities: realActivities } = useApp();
  
  const totalMembersCount = members.length;
  const onlineMembersCount = members.filter(m => m.status === 'Active').length;
  const pendingMembersCount = members.filter(m => m.status === 'Pending').length;

  const displayName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  const tierStats = useMemo(() => {
    if (members.length === 0) return [];
    
    const roleCounts = members.reduce((acc: Record<string, number>, m) => {
      acc[m.role] = (acc[m.role] || 0) + 1;
      return acc;
    }, {});

    const distribution = Object.entries(roleCounts)
      .map(([role, count]: [string, number]) => {
        const percentage = (count / members.length) * 100;
        
        let color = 'bg-slate-400';
        if (role === 'Premium Gold') color = 'bg-amber-400';
        else if (role === 'Platinum') color = 'bg-cyan-500';
        else if (role === 'Professional') color = 'bg-emerald-500';
        else if (role === 'VIP') color = 'bg-purple-600';
        else if (role === 'Diamond') color = 'bg-blue-600';
        else if (role === 'Founder') color = 'bg-rose-500';
        else if (role === 'Standard') color = 'bg-slate-500';
        else if (role === 'Gold') color = 'bg-amber-500';
        else if (role === 'Silver') color = 'bg-zinc-400';

        return { name: role, value: Math.round(percentage), color };
      })
      .sort((a, b) => b.value - a.value);

    return distribution.slice(0, 6);
  }, [members]);

  const currentTierBenefits = useMemo(() => {
    const role = currentMember?.role || 'Standard';
    const benefits: Record<string, string[]> = {
      'Standard': ['Basic Support', 'Newsletter Access'],
      'Silver': ['5% Discount', 'Priority Support', 'Silver Badge'],
      'Gold': ['10% Discount', 'Exclusive Events', 'Dedicated Manager'],
      'Platinum': ['15% Discount', 'VIP Lounge Access', 'Free Shipping'],
      'Diamond': ['20% Discount', 'Personalized Gifts', 'Lifetime Warranty'],
      'Founder': ['25% Discount', 'All-Access Pass', 'Special Recognition'],
      'VIP': ['Unlimited Access', 'Concierge Service', 'Private Events'],
      'Professional': ['B2B Tools', 'Priority Integration', 'API Access'],
    };
    return benefits[role] || benefits['Standard'];
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
      <section className="relative overflow-hidden p-8 md:p-14 rounded-[4rem] glass border border-outline/50 group transition-all duration-500 shadow-xl shadow-primary/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-[80px]" />
        
        <div className="relative z-10 flex flex-col lg:row-span-1 lg:flex-row lg:items-center justify-between gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4 drop-shadow-sm">{isAdmin ? 'ADMIN CONSOLE' : t('welcome_back')}</p>
            <h1 className="text-5xl md:text-7xl text-on-surface font-heading font-extrabold tracking-tight mb-6 leading-tight">
              {t('welcome')}, <span className="text-primary bg-clip-text decoration-primary/30 underline underline-offset-8">{displayName}</span>
            </h1>
            <div className="flex flex-wrap gap-3">
              {isAdmin && (
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-rose-500/10 rounded-full border border-rose-500/20 backdrop-blur-sm">
                  <BadgeCheck className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Admin Authorization</span>
                </div>
              )}
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
                <BadgeCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{currentMember?.role} Tier Account</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-surface-container p-10 rounded-[3.5rem] border border-outline shadow-2xl shadow-primary/10 flex flex-col gap-6 lg:min-w-[400px] card-hover"
          >
            <div className="flex justify-between items-center">
              <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-60 leading-none">{t('net_contribution')}</p>
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-on-surface-variant/40 mb-1">THB</div>
              <h3 className="text-5xl font-black text-on-surface font-mono tracking-tighter tabular-nums">฿{currentSpending.toLocaleString()}</h3>
            </div>
            {nextTier && (
              <div className="space-y-4 pt-4 border-t border-outline-variant/30">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-on-surface uppercase tracking-widest leading-none">next: {nextTier.role}</p>
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
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 mb-3">Tier Privileges</p>
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
             <h2 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em] opacity-50 whitespace-nowrap">Operational Intelligence</h2>
             <div className="h-[1px] flex-1 bg-outline/40"></div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-6 gap-8">
            {[
              { label: t('active_database'), value: totalMembersCount.toLocaleString(), change: '+12%', icon: Users, color: 'primary' },
              { label: t('online_infrastructure'), value: onlineMembersCount.toLocaleString(), change: '+5.2%', icon: TrendingUp, color: 'emerald', filter: 'Active' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="md:col-span-2"
                >
                  <Link 
                    to="/members"
                    state={{ filter: stat.filter }}
                    className="relative block h-full bg-surface-container p-10 rounded-[3rem] border border-outline card-hover overflow-hidden"
                  >
                    <div className="relative z-10 flex justify-between items-start mb-12">
                      <div className={`h-16 w-16 rounded-[1.25rem] shadow-lg flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${stat.color === 'primary' ? 'bg-primary/10 text-primary shadow-primary/10' : 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10'}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className="text-emerald-500 text-[10px] font-black flex items-center bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/10 uppercase tracking-widest">{stat.change}</span>
                    </div>
                    <div className="relative z-10">
                      <p className="text-on-surface-variant text-[11px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">{stat.label}</p>
                      <h3 className="text-5xl text-on-surface font-heading font-black tabular-nums tracking-tighter">{stat.value}</h3>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2"
            >
              <Link 
                to="/members"
                state={{ filter: 'Pending' }}
                className="relative block h-full bg-on-surface text-surface p-10 rounded-[3rem] shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-on-surface/20 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-surface/5 rounded-full -mr-24 -mt-24 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex justify-between items-start mb-12">
                  <div className="h-16 w-16 bg-surface/10 backdrop-blur-md text-surface rounded-[1.25rem] flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <span className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-[0.15em] shadow-lg shadow-primary/20">{t('action_required')}</span>
                </div>
                <div className="relative z-10">
                  <p className="text-surface/50 text-[11px] font-black uppercase tracking-[0.2em] mb-2">{t('pending_approval')}</p>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-4xl lg:text-5xl font-black font-heading tabular-nums tracking-tighter">{pendingMembersCount}</h3>
                    <span className="text-surface/40 text-xs font-bold uppercase tracking-widest">{t('members')}</span>
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
                    <p className="text-on-surface-variant font-bold italic opacity-40">No telemetry data recorded in current session.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-surface-container p-10 rounded-[3rem] border border-outline shadow-sm flex flex-col">
              <h3 className="text-lg text-on-surface font-heading font-black uppercase tracking-[0.1em] mb-10">{t('member_tier_distribution')}</h3>
              <div className="space-y-8 flex-1">
                {tierStats.map((tier) => (
                  <div key={tier.name} className="group-stats">
                    <div className="flex justify-between items-end text-xs mb-4">
                      <span className="text-on-surface font-bold text-sm tracking-tight">{tier.name}</span>
                      <span className="text-on-surface font-black font-mono tracking-widest opacity-40">{tier.value}%</span>
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
                  Data updated dynamically based on real-time membership transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Common Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link to="/profile" className="p-10 bg-surface-container rounded-[3rem] border border-outline card-hover group flex flex-col gap-8">
          <div className="h-16 w-16 rounded-[1.25rem] bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-2xl font-black font-heading tracking-tight text-on-surface uppercase">{t('curated_shop')}</h4>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed opacity-70 font-medium">{t('shop_desc')}</p>
          </div>
          <div className="mt-auto pt-6 flex items-center gap-3 text-primary text-[11px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
            <span>{t('buy_item')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link to="/profile" className="p-10 bg-surface-container rounded-[3rem] border border-outline card-hover group flex flex-col gap-8 transition-all">
          <div className="h-16 w-16 rounded-[1.25rem] bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/5">
            <FileEdit className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-2xl font-black font-heading tracking-tight text-on-surface uppercase">{t('profile')}</h4>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed opacity-70 font-medium">{t('profile_desc')}</p>
          </div>
          <div className="mt-auto pt-6 flex items-center gap-3 text-emerald-500 text-[11px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
            <span>{t('manage_now')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {!isAdmin && (
          <div className="p-10 bg-on-surface/[0.03] rounded-[3rem] border border-outline border-dashed flex flex-col justify-center gap-6 text-center group card-hover">
            <div className="w-16 h-16 bg-on-surface/5 rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
               <MessageSquarePlus className="w-6 h-6 text-on-surface-variant opacity-40" />
            </div>
            <div>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 mb-2">Concierge Services</p>
              <h4 className="text-xl font-black font-heading tracking-tight uppercase leading-tight">VIP Priority Support</h4>
            </div>
            <button className="px-8 py-4 bg-on-surface text-surface rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-on-surface/10">
              {t('contact_support')}
            </button>
          </div>
        )}
      </div>

      {!isAdmin && (
        <section className="bg-surface-container border border-outline rounded-[4rem] overflow-hidden shadow-sm">
          <div className="px-12 py-10 border-b border-outline flex items-center justify-between bg-on-surface/[0.01]">
             <h3 className="text-2xl font-black font-heading uppercase tracking-tight text-on-surface leading-none">{t('recent_activity')}</h3>
             <Link to="/activities" className="text-primary text-[11px] font-black uppercase tracking-[0.2em] hover:underline underline-offset-4">{t('view_all')}</Link>
          </div>
          <div className="divide-y divide-outline/60">
             {dashboardActivities.length > 0 ? (
               dashboardActivities.map((act, idx) => {
                 const Icon = act.icon;
                 return (
                   <div key={idx} className="px-12 py-10 flex items-center gap-8 transition-colors hover:bg-on-surface/[0.01] group">
                     <div className={`h-16 w-16 rounded-[1.25rem] ${act.iconBg} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform`}>
                       <Icon className={`${act.iconColor} w-8 h-8`} />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-xl font-bold text-on-surface truncate tracking-tight">{act.title}</p>
                       <p className="text-xs text-on-surface-variant font-bold uppercase tracking-[0.15em] opacity-40 mt-1">{act.sub}</p>
                     </div>
                     <div className="text-right shrink-0">
                       <p className="text-xl font-black text-on-surface truncate font-mono tracking-tighter tabular-nums">
                         {act.amount || act.status || act.time}
                       </p>
                     </div>
                   </div>
                 );
               })
             ) : (
               <div className="p-20 text-center">
                  <div className="h-24 w-24 bg-on-surface/5 rounded-full flex items-center justify-center mx-auto mb-8 opacity-20">
                     <CreditCard className="w-12 h-12" />
                  </div>
                  <p className="text-on-surface-variant text-lg font-bold italic opacity-40">Your transaction history will be indexed here once initialized.</p>
               </div>
             )}
          </div>
        </section>
      )}
    </div>
  );
}
