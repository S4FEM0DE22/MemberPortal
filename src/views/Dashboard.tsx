import React, { useMemo } from 'react';
import { Users, TrendingUp, UserPlus, CreditCard, BadgeCheck, FileEdit, ArrowRight, MessageSquarePlus } from 'lucide-react';
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
    { title: `${t('renewal_payment')}: Sarah Jenkins`, sub: t('annual_gold'), amount: '$249.00', time: `2 ${t('hours_ago')}`, icon: CreditCard, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
    { title: t('approved_request'), sub: `David Miller • ${t('professional_tier')}`, status: t('certified'), time: `5 ${t('hours_ago')}`, icon: BadgeCheck, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
    { title: t('profile_updated'), sub: `Emily Watson • ${t('cert_updated')}`, time: t('yesterday'), icon: FileEdit, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-primary text-sm font-bold mb-1">{t('dashboard')}</p>
          <h1 className="text-3xl text-on-surface">{t('welcome')}, {displayName}</h1>
          <p className="text-on-surface-variant mt-1">{t('today_happening')}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Link 
            to="/members"
            state={{ openInvite: true }}
            className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {t('new_member')}
          </Link>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const targetPath = stat.color === 'primary' ? '/members' : '/activities';
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="md:col-span-2 shadow-sm"
            >
              <Link 
                to="/members"
                state={{ filter: stat.filter }}
                className="block h-full bg-surface-container p-6 rounded-[2rem] hover:bg-on-surface/5 transition-all active:scale-95 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-emerald-500 text-xs font-bold flex items-center bg-emerald-500/10 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="mt-6">
                  <p className="text-on-surface-variant text-xs font-semibold mb-1">{stat.label}</p>
                  <h3 className="text-2xl text-on-surface">{stat.value}</h3>
                </div>
              </Link>
            </motion.div>
          );
        })}

        {/* Pending Requests Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 shadow-lg shadow-primary/20"
        >
          <Link 
            to="/members"
            state={{ filter: 'Pending' }}
            className="block h-full bg-primary text-on-primary p-6 rounded-[2rem] hover:opacity-90 transition-all active:scale-95 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 bg-on-primary/20 text-on-primary rounded-xl flex items-center justify-center">
                <UserPlus className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-on-primary/80 text-xs font-semibold mb-1">{t('pending_approval')}</p>
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold">{pendingMembersCount}</h3>
                <span className="px-2 py-0.5 bg-on-primary text-primary text-[10px] font-bold rounded-full uppercase">{t('must_action')}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-surface-container rounded-[2rem] shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
            <h3 className="text-lg text-on-surface font-heading uppercase tracking-tight">{t('recent_activity')}</h3>
            <Link 
              to="/activities" 
              className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline bg-primary/5 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              {t('view_all')}
            </Link>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {activities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <Link 
                  key={idx} 
                  to="/activities"
                  className="px-6 py-5 flex items-center gap-4 hover:bg-on-surface/5 transition-colors group cursor-pointer"
                >
                  <div className={`h-10 w-10 rounded-full ${act.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className={`${act.iconColor} w-5 h-5`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{act.title}</p>
                    <p className="text-xs text-on-surface-variant font-medium">{act.sub}</p>
                  </div>
                  <div className="text-right">
                    {act.amount && <p className="text-sm font-bold text-on-surface">{act.amount}</p>}
                    {act.status && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded uppercase">{act.status}</span>}
                    <p className="text-[10px] text-on-surface-variant mt-0.5 font-medium">{act.time}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Community Health/Quick Links */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface-container p-6 rounded-[2rem] shadow-sm"
          >
            <h3 className="text-lg text-on-surface mb-6">{t('member_tier')}</h3>
            <div className="space-y-5">
              {tierStats.map((tier) => (
                <div key={tier.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-on-surface font-semibold">{tier.name}</span>
                    <span className="text-on-surface-variant font-bold">{tier.value}%</span>
                  </div>
                  <div className="w-full bg-on-surface/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`${tier.color} h-full rounded-full transition-all duration-1000`} 
                      style={{ width: `${tier.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={exportMembers}
            className="bg-primary/5 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors"
          >
            <div>
              <p className="text-on-surface font-bold text-lg">{t('export_report')}</p>
              <p className="text-on-surface-variant text-xs">{t('download_csv')}</p>
            </div>
            <ArrowRight className="text-primary group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 md:bottom-8 md:right-8 h-14 w-14 rounded-2xl bg-primary text-on-primary shadow-lg flex items-center justify-center active:scale-95 transition-transform hover:shadow-primary/40">
        <MessageSquarePlus className="w-7 h-7" />
      </button>
    </div>
  );
}
