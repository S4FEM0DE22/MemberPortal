import { Users, TrendingUp, UserPlus, CreditCard, BadgeCheck, FileEdit, ArrowRight, MessageSquarePlus } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { t } = useApp();
  
  const stats = [
    { label: t('total_members'), value: '2,548', change: '+12%', icon: Users, color: 'primary' },
    { label: t('active_subscriptions'), value: '1,892', change: '+5.2%', icon: TrendingUp, color: 'orange' },
  ];

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
          <h1 className="text-3xl text-on-surface">{t('welcome')}, Alex</h1>
          <p className="text-on-surface-variant mt-1">{t('today_happening')}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            {t('new_member')}
          </button>
        </motion.div>
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
              transition={{ delay: idx * 0.1 }}
              className="md:col-span-2 bg-surface-container p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-500'}`}>
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
            </motion.div>
          );
        })}

        {/* Pending Requests Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 bg-primary text-on-primary p-6 rounded-[2rem] shadow-lg shadow-primary/20 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 bg-on-primary/20 text-on-primary rounded-xl flex items-center justify-center">
              <UserPlus className="w-7 h-7" />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-on-primary/80 text-xs font-semibold mb-1">{t('pending_approval')}</p>
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold">42</h3>
              <span className="px-2 py-0.5 bg-on-primary text-primary text-[10px] font-bold rounded-full uppercase">{t('must_action')}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-surface-container rounded-[2rem] border border-outline-variant/30 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
            <h3 className="text-lg text-on-surface">{t('recent_activity')}</h3>
            <button className="text-primary text-xs font-bold hover:underline">{t('view_all')}</button>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {activities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="px-6 py-5 flex items-center gap-4 hover:bg-on-surface/5 transition-colors">
                  <div className={`h-10 w-10 rounded-full ${act.iconBg} flex items-center justify-center`}>
                    <Icon className={`${act.iconColor} w-5 h-5`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{act.title}</p>
                    <p className="text-xs text-on-surface-variant font-medium">{act.sub}</p>
                  </div>
                  <div className="text-right">
                    {act.amount && <p className="text-sm font-bold text-on-surface">{act.amount}</p>}
                    {act.status && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded uppercase">{act.status}</span>}
                    <p className="text-[10px] text-on-surface-variant mt-0.5 font-medium">{act.time}</p>
                  </div>
                </div>
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
            className="bg-surface-container p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm"
          >
            <h3 className="text-lg text-on-surface mb-6">{t('member_tier')}</h3>
            <div className="space-y-5">
              {[
                { name: t('gold_tier'), value: 45, color: 'bg-primary' },
                { name: t('silver_tier'), value: 32, color: 'bg-orange-500' },
                { name: t('standard_tier'), value: 23, color: 'bg-outline-variant/50' },
              ].map((tier) => (
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
            className="bg-primary/5 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors border border-primary/10"
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
