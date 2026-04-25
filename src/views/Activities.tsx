import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  BadgeCheck, 
  FileEdit, 
  Search, 
  Filter, 
  ChevronLeft, 
  ArrowRight,
  Calendar,
  UserPlus,
  X,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Activities() {
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const activities = [
    { id: 1, title: `${t('renewal_payment')}: Sarah Jenkins`, sub: t('annual_gold'), amount: '฿8,500', time: `2 ${t('hours_ago')}`, icon: CreditCard, iconBg: 'bg-primary/10', iconColor: 'text-primary', description: 'Annual gold membership renewal payment processed successfully via Stripe.', reference: 'TRX-9921-X' },
    { id: 2, title: t('approved_request'), sub: `David Miller • ${t('professional_tier')}`, status: t('certified'), time: `5 ${t('hours_ago')}`, icon: BadgeCheck, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500', description: 'Member tier upgrade request approved by automatic review system.', reference: 'REQ-4482-B' },
    { id: 3, title: t('profile_updated'), sub: `Emily Watson • ${t('profile_desc_short')}`, time: t('yesterday'), icon: FileEdit, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500', description: 'Member updated their profile information including address and contact details.', reference: 'LOG-1102-Z' },
    { id: 4, title: t('new_member_registered'), sub: `John Doe joined ${t('standard_tier')}`, time: t('yesterday'), icon: UserPlus, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500', description: 'New member registered to the system via the main landing page.', reference: 'MEM-3301-A' },
    { id: 5, title: t('subscription_cancelled'), sub: 'Michael Chen • Monthly Plan', time: t('days_ago').replace('{days}', '2'), icon: FileEdit, iconBg: 'bg-red-500/10', iconColor: 'text-red-500', description: 'Member requested to cancel their monthly subscription plan.', reference: 'CAN-5591-C' },
    { id: 6, title: t('payment_failed'), sub: `Amy Liu • ${t('gold_tier')}`, amount: '฿650', time: t('days_ago').replace('{days}', '3'), icon: CreditCard, iconBg: 'bg-red-500/10', iconColor: 'text-red-500', description: 'Payment failed due to expired credit card information.', reference: 'ERR-7721-F' },
    { id: 7, title: t('system_maintenance'), sub: 'Server clusters optimized', time: t('days_ago').replace('{days}', '4'), icon: BadgeCheck, iconBg: 'bg-on-surface/5', iconColor: 'text-on-surface-variant', description: 'Weekly database performance optimization and system maintenance.', reference: 'SYS-001-K' },
    { id: 8, title: t('new_admin_added'), sub: 'Sophia Brown granted dashboard access', time: t('days_ago').replace('{days}', '5'), icon: UserPlus, iconBg: 'bg-purple-500/10', iconColor: 'text-purple-500', description: 'New admin access granted to the system dashboard.', reference: 'ADM-8821-S' },
  ];

  const filteredActivities = activities.filter(act => 
    act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    act.sub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivity(null)}
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface-container rounded-[2rem] w-full max-w-md p-10 shadow-2xl border border-outline-variant/30"
            >
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute right-6 top-6 p-2 hover:bg-on-surface/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-outline" />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className={`h-20 w-20 rounded-[2rem] ${selectedActivity.iconBg} flex items-center justify-center shadow-lg transform rotate-3`}>
                  <selectedActivity.icon className={`${selectedActivity.iconColor} w-10 h-10`} />
                </div>
                
                <div>
                  <h2 className="text-2xl text-on-surface font-heading">{selectedActivity.title}</h2>
                  <p className="text-on-surface-variant font-medium mt-1">{selectedActivity.sub}</p>
                </div>

                <div className="w-full bg-on-surface/5 rounded-2xl p-6 text-left space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{t('activity_details')}</p>
                      <p className="text-sm text-on-surface leading-relaxed">{selectedActivity.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{t('event_time')}</p>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {selectedActivity.time}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{t('ref_number')}</p>
                      <code className="text-xs font-mono font-black text-primary">{selectedActivity.reference}</code>
                    </div>
                  </div>
                </div>

                <div className="w-full flex gap-4">
                  <button className="flex-1 py-3 bg-primary text-on-primary rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2">
                    {t('check_more')}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="p-2 hover:bg-on-surface/10 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-on-surface" />
          </Link>
          <div>
            <h1 className="text-4xl text-on-surface font-heading uppercase tracking-tight">{t('activities')}</h1>
            <p className="text-on-surface-variant mt-1">{t('activities_desc')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_activities')} 
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-2.5 border border-outline-variant rounded-xl bg-surface-container text-on-surface hover:bg-on-surface/5 transition-colors shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <motion.div 
                  key={act.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedActivity(act)}
                  className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 flex items-center gap-6 hover:bg-on-surface/5 transition-all group cursor-pointer"
                >
                  <div className={`h-14 w-14 rounded-2xl ${act.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className={`${act.iconColor} w-7 h-7`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-lg font-bold text-on-surface truncate">{act.title}</p>
                      {act.status && (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded uppercase tracking-widest border border-emerald-500/20">
                          {act.status}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant font-medium">{act.sub}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    {act.amount && <p className="text-lg font-black text-on-surface">{act.amount}</p>}
                    <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-black uppercase tracking-widest bg-on-surface/5 px-2 py-1 rounded-md">
                      <Calendar className="w-3 h-3" />
                      {act.time}
                    </div>
                  </div>
                  <div className="pl-4 border-l border-outline-variant/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredActivities.length === 0 && (
            <div className="py-20 text-center space-y-4 opacity-50">
              <Search className="w-16 h-16 mx-auto" />
              <p className="text-xl font-heading">{t('no_results')}</p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 space-y-6">
            <h3 className="text-xl text-on-surface font-heading uppercase tracking-tight">{t('summary_movement')}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">{t('this_week')}</span>
                <span className="text-primary font-black">+42</span>
              </div>
              <div className="w-full bg-on-surface/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full w-3/4" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">{t('success_trans')}</span>
                <span className="text-emerald-500 font-black">98%</span>
              </div>
              <div className="w-full bg-on-surface/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[98%]" />
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 rounded-[2rem] p-8">
            <h3 className="text-xl text-on-surface font-heading uppercase tracking-tight mb-4">{t('quick_filter')}</h3>
            <div className="flex flex-wrap gap-2">
              {[t('payment'), t('new_member'), t('system'), t('security'), t('notification')].map(tag => (
                <button key={tag} className="px-4 py-2 rounded-xl border border-outline-variant text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
