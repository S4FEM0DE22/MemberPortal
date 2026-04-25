import React, { useMemo } from 'react';
import { Users, TrendingUp, UserPlus, CreditCard, BadgeCheck, FileEdit, ArrowRight, MessageSquarePlus, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { t, members, user, exportMembers } = useApp();
  
  const totalMembersCount = members.length;
  const onlineMembersCount = members.filter(m => m.status === 'Active').length;
  const pendingMembersCount = members.filter(m => m.status === 'Pending').length;

  const displayName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  const stats = [
    { 
      label: t('total_members'), 
      value: totalMembersCount.toLocaleString(), 
      change: '+12%', 
      icon: Users, 
      color: 'primary'
    },
    { 
      label: t('online_members'), 
      value: onlineMembersCount.toLocaleString(), 
      change: '+5.2%', 
      icon: TrendingUp, 
      color: 'emerald',
      filter: 'Active'
    },
  ];

  const tierStats = useMemo(() => {
    if (members.length === 0) return [];
    
    // Get unique roles from current members or a predefined list
    const roleCounts = members.reduce((acc: Record<string, number>, m) => {
      acc[m.role] = (acc[m.role] || 0) + 1;
      return acc;
    }, {});

    const distribution = Object.entries(roleCounts)
      .map(([role, count]: [string, number]) => {
        const percentage = (count / members.length) * 100;
        
        // Dynamic colors based on role name hashes or fixed palette
        let color = 'bg-outline-variant/30';
        if (role === 'Premium Gold') color = 'bg-primary';
        else if (role === 'Platinum') color = 'bg-orange-500';
        else if (role === 'Professional') color = 'bg-emerald-500';
        else if (role === 'VIP') color = 'bg-purple-500';
        else if (role === 'Diamond') color = 'bg-blue-400';
        else if (role === 'Founder') color = 'bg-rose-500';

        return { name: role, value: Math.round(percentage), color };
      })
      .sort((a, b) => b.value - a.value);

    return distribution.slice(0, 5); // Show top 5 tiers
  }, [members]);

  const activities = [
    { title: `${t('renewal_payment')}: Sarah Jenkins`, sub: t('annual_gold'), amount: '฿8,500', time: `2 ${t('hours_ago')}`, icon: CreditCard, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
    { title: t('approved_request'), sub: `David Miller • ${t('professional_tier')}`, status: t('certified'), time: `5 ${t('hours_ago')}`, icon: BadgeCheck, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
    { title: t('profile_updated'), sub: `Emily Watson • ${t('profile_desc_short')}`, time: t('yesterday'), icon: FileEdit, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500' },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <section className="relative overflow-hidden p-8 md:p-12 rounded-[2.5rem] bg-on-surface/5 border border-outline-variant/30 group transition-all duration-500 hover:bg-on-surface/[0.07] mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-mesh-accent rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="h-1 w-8 bg-primary rounded-full" />
              <p className="text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">{t('dashboard')}</p>
            </motion.div>
            <h1 className="text-3xl md:text-5xl text-on-surface font-heading font-extrabold tracking-tight mb-2">
              {t('welcome')}, <span className="text-primary">{displayName}</span>
            </h1>
            <p className="text-on-surface-variant font-medium max-w-md">{t('today_happening')}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/members"
              state={{ openInvite: true }}
              className="bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95 group/btn"
            >
              <div className="bg-white/20 p-1.5 rounded-lg group-hover/btn:rotate-12 transition-transform">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm uppercase tracking-wide">{t('new_member')}</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.4 }}
              className="md:col-span-2 group"
            >
              <Link 
                to="/members"
                state={{ filter: stat.filter }}
                className="relative block h-full bg-surface-container p-8 rounded-[2.5rem] border border-outline-variant/30 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative z-10 flex justify-between items-start mb-10">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${stat.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.6 }}
                    className="text-emerald-500 text-[10px] font-black flex items-center bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest"
                  >
                    {stat.change}
                  </motion.span>
                </div>
                
                <div className="relative z-10">
                  <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.15em] mb-1 opacity-70">{stat.label}</p>
                  <h3 className="text-4xl text-on-surface font-heading font-black tabular-nums">{stat.value}</h3>
                  
                  <div className="mt-6 flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t('view_all')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}

        {/* Pending Requests Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="md:col-span-2 group"
        >
          <Link 
            to="/members"
            state={{ filter: 'Pending' }}
            className="relative block h-full bg-primary text-on-primary p-8 rounded-[2.5rem] shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -mr-24 -mt-24 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative z-10 flex justify-between items-start mb-10">
              <div className="h-14 w-14 bg-white/20 backdrop-blur-md text-on-primary rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <UserPlus className="w-8 h-8" />
              </div>
              <span className="px-3 py-1.5 bg-white text-primary text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-black/10">
                {t('action_required')}
              </span>
            </div>
            
            <div className="relative z-10">
              <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{t('pending_approval')}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black font-heading tabular-nums">{pendingMembersCount}</h3>
                <span className="text-white/60 text-xs font-bold">{t('members').toLowerCase()}</span>
              </div>
              
              <div className="mt-6 flex items-center gap-1 text-white text-[10px] font-black uppercase tracking-widest">
                <span>{t('manage_now')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 bg-surface-container border border-outline-variant/30 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col"
        >
          <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between bg-on-surface/[0.02]">
            <div>
              <h3 className="text-xl text-on-surface font-heading font-black uppercase tracking-tight">{t('recent_activity')}</h3>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1 opacity-60">{t('realtime_feed')}</p>
            </div>
            <Link 
              to="/activities" 
              className="flex items-center gap-2 group/all"
            >
              <span className="text-primary text-[10px] font-black uppercase tracking-widest group-hover/all:mr-1 transition-all">
                {t('view_all')}
              </span>
              <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover/all:bg-primary group-hover/all:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
          
          <div className="divide-y divide-outline-variant/10">
            {activities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.8 }}
                >
                  <Link 
                    to="/activities"
                    className="px-8 py-6 flex items-center gap-5 hover:bg-on-surface/[0.03] transition-all group border-l-4 border-transparent hover:border-primary"
                  >
                    <div className={`h-12 w-12 rounded-[1.25rem] ${act.iconBg} flex items-center justify-center transition-all duration-500 group-hover:rounded-xl group-hover:scale-110 shadow-sm`}>
                      <Icon className={`${act.iconColor} w-6 h-6`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors leading-tight mb-0.5">{act.title}</p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wide opacity-60">{act.sub}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {act.amount && <p className="text-sm font-black text-on-surface font-heading mb-1">{act.amount}</p>}
                      {act.status && (
                        <div className="flex justify-end">
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-lg border border-emerald-500/20 uppercase tracking-widest">
                            {act.status}
                          </span>
                        </div>
                      )}
                      <p className={`text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1 opacity-50 ${act.status ? 'mt-1.5' : ''}`}>
                        {act.time}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-auto p-4 bg-on-surface/[0.01] text-center">
             <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] opacity-40">{t('end_of_updates')}</p>
          </div>
        </motion.div>

        {/* Right Column Bento Items */}
        <div className="flex flex-col gap-8">
          {/* Tier Distrubution */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-surface-container p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-sm group hover:border-primary/30 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl text-on-surface font-heading font-black uppercase tracking-tight">{t('member_tier')}</h3>
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            
            <div className="space-y-6">
              {tierStats.map((tier, idx) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 1 }}
                >
                  <Link 
                    to="/members" 
                    state={{ filter: tier.name }}
                    className="block group/tier cursor-pointer"
                  >
                    <div className="flex justify-between items-end text-xs mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${tier.color} shadow-sm group-hover/tier:scale-125 transition-transform`} />
                        <span className="text-on-surface font-bold group-hover/tier:text-primary transition-all text-sm">{tier.name}</span>
                      </div>
                      <span className="text-on-surface-variant font-black tabular-nums tracking-widest">{tier.value}%</span>
                    </div>
                    <div className="w-full bg-on-surface/5 h-2 rounded-full overflow-hidden p-[2px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${tier.value}%` }}
                        transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: idx * 0.1 + 1.2 }}
                        className={`${tier.color} h-full rounded-full group-hover/tier:brightness-110 transition-all`} 
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Action: Export */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            onClick={exportMembers}
            className="relative bg-on-surface/5 p-8 rounded-[2.5rem] border border-outline-variant/30 flex items-center justify-between group cursor-pointer hover:bg-primary hover:border-primary transition-all duration-500 overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-700" />
            
            <div className="relative z-10">
              <p className="text-on-surface font-black text-xl font-heading uppercase tracking-tight group-hover:text-on-primary transition-colors">{t('export_report')}</p>
              <div className="flex items-center gap-2 mt-1">
                <FileSpreadsheet className="w-4 h-4 text-primary group-hover:text-on-primary/80 transition-colors" />
                <p className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest group-hover:text-on-primary/70 transition-colors">{t('download_csv')}</p>
              </div>
            </div>
            
            <div className="relative z-10 h-12 w-12 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 group-hover:bg-on-primary group-hover:text-primary transition-all duration-500 flex items-center justify-center shadow-lg group-hover:shadow-black/20">
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Community Status Footer Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mt-12 bg-emerald-500 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
             <TrendingUp className="w-10 h-10" />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-black font-heading uppercase tracking-tight">{t('community_growing')}</h4>
            <p className="text-white/80 font-bold text-sm max-w-md mt-1">{t('growth_msg')}</p>
          </div>
        </div>
        
        <Link 
          to="/members"
          className="relative z-10 bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          {t('see_full_analytics')}
        </Link>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button 
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.5, type: 'spring', damping: 10 }}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 h-14 w-14 sm:h-16 sm:w-16 rounded-3xl bg-primary text-on-primary shadow-2xl shadow-primary/40 flex items-center justify-center active:scale-90 transition-transform hover:rotate-6 hover:scale-110 z-50 group"
      >
        <div className="relative">
          <MessageSquarePlus className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 border-2 border-primary rounded-full group-hover:animate-ping" />
        </div>
      </motion.button>
    </div>
  );
}
