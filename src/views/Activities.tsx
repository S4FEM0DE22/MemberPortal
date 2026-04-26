import React, { useState, useMemo } from 'react';
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
  const { t, activities: realActivities } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const processedActivities = useMemo(() => {
    return realActivities.map(act => {
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

  const filteredActivities = processedActivities.filter(act => 
    act.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    act.sub?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
              className="relative bg-surface-container rounded-[2rem] w-full max-w-md p-6 sm:p-10 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto"
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

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-4 overflow-hidden">
        <div className="flex items-start gap-4">
          <Link 
            to="/" 
            className="p-3 hover:bg-on-surface/5 rounded-2xl transition-all border border-outline/50 mt-1"
          >
            <ChevronLeft className="w-6 h-6 text-on-surface" />
          </Link>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{t('system_logs')}</p>
            </div>
            <h1 className="text-4xl md:text-5xl text-on-surface font-heading font-extrabold tracking-tight underline decoration-primary/20 decoration-8 underline-offset-8 lowercase first-letter:uppercase">{t('activities')}</h1>
            <p className="text-on-surface-variant font-medium mt-6 max-w-md">{t('activities_desc')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4 sm:w-5 sm:h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_activities')} 
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs sm:text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-2 sm:p-2.5 border border-outline-variant rounded-xl bg-surface-container text-on-surface hover:bg-on-surface/5 transition-colors shadow-sm">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          {/* Technical Data Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 border-b border-outline/50 mb-4 items-center">
            <div className="col-span-1 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{t('class')}</div>
            <div className="col-span-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 pl-4 text-left">{t('activity_id')}</div>
            <div className="col-span-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-right">{t('value_status')}</div>
            <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-right pr-4">{t('timestamp')}</div>
          </div>

          <div className="space-y-[1px] bg-outline/20 border border-outline/50 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <motion.div 
                    key={act.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => setSelectedActivity(act)}
                    className="flex flex-col sm:grid sm:grid-cols-12 gap-4 px-6 sm:px-8 py-6 bg-surface-container hover:bg-on-surface/[0.03] transition-all group cursor-pointer items-start sm:items-center relative border-b border-outline/30 last:border-0"
                  >
                    <div className="sm:col-span-1 flex shrink-0">
                      <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl ${act.iconBg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner`}>
                        <Icon className={`${act.iconColor} w-5 h-5 sm:w-6 sm:h-6`} />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6 flex flex-col justify-center min-w-0 sm:pl-4 w-full">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-on-surface truncate tracking-tight">{act.title}</h3>
                        {act.status && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] sm:text-[9px] font-black rounded uppercase tracking-widest border border-emerald-500/20 leading-none">
                            {act.status}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-mono tracking-tight opacity-50 uppercase truncate">{act.reference}</p>
                    </div>

                    <div className="sm:col-span-3 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 w-full sm:w-auto">
                      {act.amount ? (
                        <p className="text-base sm:text-lg font-black text-on-surface font-mono tracking-tighter tabular-nums leading-none">{act.amount}</p>
                      ) : (
                        <div className="px-2.5 py-1 bg-on-surface/5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">{t('system_log')}</div>
                      )}
                      <p className="sm:hidden text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">{act.sub}</p>
                    </div>

                    <div className="sm:col-span-2 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 sm:pr-4 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-outline/20">
                      <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-on-surface-variant font-black uppercase tracking-widest leading-none">
                        {act.time}
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors hidden sm:block"></div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {filteredActivities.length === 0 && (
            <div className="py-24 text-center space-y-6 bg-surface-container rounded-3xl border border-outline/50 shadow-sm">
              <div className="w-20 h-20 bg-on-surface/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                <Search className="w-10 h-10" />
              </div>
              <div>
                <p className="text-xl font-heading font-black uppercase tracking-[0.1em] text-on-surface opacity-40">{t('query_null')}</p>
                <p className="text-sm text-on-surface-variant mt-2 opacity-50">{t('no_activity_logs')}</p>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <div className="bg-primary/[0.02] border border-primary/20 rounded-[3rem] p-10 space-y-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
            <h3 className="text-lg text-on-surface font-heading font-black uppercase tracking-[0.1em] relative z-10">{t('metrics_overview')}</h3>
            <div className="space-y-6 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-on-surface-variant font-black uppercase tracking-[0.2em] text-[10px] opacity-60">{t('weekly_throughput')}</span>
                  <span className="text-primary font-mono font-black text-sm">+42.8%</span>
                </div>
                <div className="w-full bg-on-surface/[0.06] h-2 rounded-full overflow-hidden p-[1px]">
                  <motion.div initial={{ width: 0 }} animate={{ width: '74%' }} className="bg-primary h-full rounded-full" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-on-surface-variant font-black uppercase tracking-[0.2em] text-[10px] opacity-60">{t('latency_success')}</span>
                  <span className="text-emerald-500 font-mono font-black text-sm">99.2%</span>
                </div>
                <div className="w-full bg-on-surface/[0.06] h-2 rounded-full overflow-hidden p-[1px]">
                  <motion.div initial={{ width: 0 }} animate={{ width: '99.2%' }} className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-outline rounded-[3rem] p-10 shadow-sm">
            <h3 className="text-lg text-on-surface font-heading font-black uppercase tracking-[0.1em] mb-6">{t('quick_index')}</h3>
            <div className="flex flex-wrap gap-3">
              {[t('payment'), t('new_member'), t('system'), t('security'), t('notification')].map(tag => (
                <button key={tag} className="px-5 py-3 rounded-2xl border border-outline text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 shadow-sm">
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
