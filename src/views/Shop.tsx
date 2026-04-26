import React, { useState } from 'react';
import { CreditCard, ShoppingBag, ShieldCheck, BadgeCheck, Zap, Star, Diamond, Crown, Trophy, Sparkles, Gift, Clock, CheckCircle2, ShoppingCart, Wallet, Plus, X, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function Shop() {
  const { t, currentMember, purchaseItem, upgradeTier, topUp } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'upgrades'>('items');
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');

  const TOP_UP_OPTIONS = [500, 1000, 2000, 5000, 10000, 20000];

  const handleTopUp = async () => {
    const finalAmount = topUpAmount || parseInt(customAmount);
    if (!finalAmount || isNaN(finalAmount)) return;
    setIsProcessing(true);
    try {
      await topUp(finalAmount);
      setShowTopUp(false);
      setTopUpAmount(null);
      setCustomAmount('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchase = async (item: any) => {
    setIsProcessing(true);
    try {
      await purchaseItem(item.price);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = async (tier: any) => {
    setIsProcessing(true);
    try {
      await upgradeTier(tier.role, tier.cost);
    } finally {
      setIsProcessing(false);
    }
  };

  const SHOP_ITEMS = [
    { id: 'pro_consult', name: t('pro_consultation') || 'Pro Consultation', price: 1500, icon: BadgeCheck, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'One hour professional session with our experts.' },
    { id: 'prem_pack', name: t('premium_pack') || 'Assets Premium Pack', price: 500, icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: 'Exclusive digital assets and templates for your projects.' },
    { id: 'vip_ticket', name: t('vip_ticket') || 'VIP Event Access', price: 2500, icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Priority entry and VIP seating for all upcoming events.' },
    { id: 'merch_kit', name: 'Premium Merch Kit', price: 1200, icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Official branded apparel and accessories delivered to you.' },
    { id: 'priority_support', name: 'Priority Support', price: 3000, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', desc: 'Get your questions answered in less than 2 hours.' },
    { id: 'custom_badge', name: 'Custom Profile Badge', price: 2000, icon: Star, color: 'text-rose-500', bg: 'bg-rose-500/10', desc: 'A unique verified badge that appears on your public profile.' },
  ];

  const TIERS = [
    { role: 'Silver', cost: 1000, color: 'text-slate-400', bg: 'bg-slate-400/10', icon: ShieldCheck, perks: ['5% Discount', 'Priority Support', 'Silver Badge'] },
    { role: 'Gold', cost: 5000, color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Star, perks: ['10% Discount', 'Exclusive Events', 'Dedicated Manager'] },
    { role: 'Platinum', cost: 15000, color: 'text-indigo-400', bg: 'bg-indigo-400/10', icon: Diamond, perks: ['20% Discount', 'VIP Lounge Access', 'Concierge Support'] },
    { role: 'Diamond', cost: 35000, color: 'text-cyan-400', bg: 'bg-cyan-400/10', icon: Crown, perks: ['25% Discount', 'Personalized Gifts', 'Diamond Events'] },
    { role: 'Founder', cost: 75000, color: 'text-rose-500', bg: 'bg-rose-500/10', icon: Trophy, perks: ['Special Recognition', 'Governance Voting', 'Lifetime Membership'] },
    { role: 'Legend', cost: 150000, color: 'text-purple-600', bg: 'bg-purple-600/10', icon: Zap, perks: ['Honorary Board Seat', 'Legendary Status', 'Pure Gold Card'] },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{t('shop')}</p>
          </div>
          <h1 className="text-4xl md:text-5xl text-on-surface font-heading font-extrabold tracking-tight underline decoration-primary/20 decoration-8 underline-offset-8">
            {t('marketplace') || 'Marketplace'}
          </h1>
          <p className="text-on-surface-variant font-medium mt-4 max-w-md">
            {t('shop_desc') || 'Upgrade your experience with premium items and membership tiers.'}
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container border border-outline-variant/30 p-6 rounded-[2.5rem] flex items-center gap-6 shadow-sm group hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => setShowTopUp(true)}
          >
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 mb-1">{t('balance')}</p>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-black text-primary font-heading tracking-tight">฿{(currentMember?.balance || 0).toLocaleString()}</p>
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container border border-outline-variant/30 p-6 rounded-[2.5rem] flex items-center gap-6 shadow-sm"
          >
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 mb-1">{t('total_top_up')}</p>
              <p className="text-2xl font-black text-emerald-600 font-heading tracking-tight">฿{(currentMember?.totalTopUp || 0).toLocaleString()}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-surface-container border border-outline-variant/30 p-6 rounded-[2.5rem] flex items-center gap-6 shadow-sm"
          >
            <div className="h-12 w-12 rounded-2xl bg-on-surface/5 text-on-surface-variant flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 mb-1">{t('total_spent')}</p>
              <p className="text-2xl font-black text-on-surface-variant font-heading tracking-tight opacity-60">฿{(currentMember?.spending || 0).toLocaleString()}</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-4 bg-surface-container w-fit p-2 rounded-3xl border border-outline-variant/20 shadow-sm mx-auto md:mx-0">
        <button 
          onClick={() => setActiveTab('items')}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'items' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-on-surface-variant hover:bg-on-surface/5'}`}
        >
          {t('products') || 'Products'}
        </button>
        <button 
          onClick={() => setActiveTab('upgrades')}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'upgrades' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-on-surface-variant hover:bg-on-surface/5'}`}
        >
          {t('upgrades') || 'Upgrades'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'items' ? (
          <motion.div 
            key="items"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {SHOP_ITEMS.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-surface-container p-8 rounded-[3.5rem] border border-outline-variant/30 shadow-sm hover:border-primary/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-16 h-16 rounded-3xl ${item.bg} ${item.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-on-surface font-heading tracking-tight mb-2">{item.name}</h3>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-6 opacity-70">
                    {item.desc}
                  </p>
                </div>
                
                <div className="pt-6 border-t border-outline-variant/10 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-1">{t('price') || 'Price'}</p>
                    <p className="text-2xl font-black text-primary font-heading tracking-tight">฿{item.price.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => handlePurchase(item)}
                    disabled={isProcessing}
                    className="h-14 px-6 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-primary-container shadow-xl shadow-primary/10 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? t('processing') : t('buy_now') || 'Buy Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="upgrades"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {TIERS.map((tier, idx) => {
              const isCurrent = currentMember?.role === tier.role;
              return (
                <motion.div 
                  key={tier.role}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative p-10 rounded-[4rem] border transition-all overflow-hidden flex flex-col justify-between ${isCurrent ? 'bg-primary border-primary shadow-2xl shadow-primary/30' : 'bg-surface-container border-outline-variant/30 shadow-sm hover:border-primary/20'}`}
                >
                  {isCurrent && (
                    <div className="absolute top-6 right-6 bg-white/20 p-2 rounded-full scale-110 shadow-inner">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  )}

                  <div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${isCurrent ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                      <tier.icon className="w-7 h-7" />
                    </div>
                    
                    <h3 className={`text-3xl font-black font-heading tracking-tight mb-2 ${isCurrent ? 'text-white' : 'text-on-surface'}`}>
                      {t(tier.role.toLowerCase()) || tier.role}
                    </h3>
                    <p className={`text-xl font-bold mb-8 ${isCurrent ? 'text-white/80' : 'text-primary'}`}>
                      ฿{tier.cost.toLocaleString()}
                    </p>

                    <ul className="space-y-4 mb-10">
                      {tier.perks.map((perk, pidx) => (
                        <li key={pidx} className="flex items-center gap-3">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-white/60' : 'text-primary/60'}`} />
                          <span className={`text-[11px] font-black uppercase tracking-widest ${isCurrent ? 'text-white/90' : 'text-on-surface-variant'}`}>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => handleUpgrade(tier)}
                    disabled={isProcessing || isCurrent}
                    className={`h-16 w-full rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 ${
                      isCurrent 
                        ? 'bg-white/20 text-white cursor-default' 
                        : 'bg-primary text-on-primary hover:bg-primary-container shadow-xl shadow-primary/10'
                    }`}
                  >
                    {isCurrent ? t('active') : `${t('upgrade_to').replace('{role}', t(tier.role.toLowerCase()) || tier.role)}`}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bg-surface-container p-10 rounded-[3.5rem] border border-outline-variant/30 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="h-20 w-20 rounded-[2rem] bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner shrink-0 rotate-3">
            <Gift className="w-10 h-10" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black font-heading tracking-tight text-on-surface mb-2">{t('loyalty_program') || 'Loyalty Program'}</h3>
            <p className="text-on-surface-variant font-medium text-sm leading-relaxed max-w-2xl">
              {t('loyalty_desc') || "Earn credit for every purchase and upgrade. Reach high spending milestones to unlock hidden legendary tiers and exclusive founder-only rewards that can't be bought with money."}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-on-surface/[0.03] px-6 py-4 rounded-2xl border border-outline-variant/10">
            <Clock className="w-5 h-5 text-primary" />
            <p className="text-[10px] font-black text-on-surface uppercase tracking-widest">Resets in 12 days</p>
          </div>
        </div>
      </section>

      {/* Top Up Modal */}
      <AnimatePresence>
        {showTopUp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTopUp(false)}
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface-container rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border border-outline-variant/30"
            >
              <button 
                onClick={() => setShowTopUp(false)}
                className="absolute right-6 top-6 p-2 hover:bg-on-surface/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-outline" />
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-4 rotate-3">
                  <Wallet className="w-10 h-10" />
                </div>
                <h2 className="text-3xl text-on-surface font-heading font-black tracking-tight">{t('top_up')}</h2>
                <p className="text-on-surface-variant font-medium mt-2">{t('select_amount')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {TOP_UP_OPTIONS.map(amount => (
                  <button 
                    key={amount}
                    onClick={() => {
                      setTopUpAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`p-6 rounded-3xl border-2 transition-all font-black text-lg ${
                      topUpAmount === amount 
                        ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' 
                        : 'bg-surface border-outline-variant/30 text-on-surface hover:border-primary/50'
                    }`}
                  >
                    ฿{amount.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-4 mb-2 block opacity-60">
                  {t('custom_amount')}
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant font-black text-xl opacity-40">฿</span>
                  <input 
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setTopUpAmount(null);
                    }}
                    placeholder="Enter amount..."
                    className="w-full h-16 pl-12 pr-6 rounded-[1.5rem] bg-surface border-2 border-outline-variant/30 focus:border-primary outline-none transition-all font-black text-xl text-on-surface"
                  />
                </div>
              </div>

              <button 
                onClick={handleTopUp}
                disabled={(!topUpAmount && !customAmount) || isProcessing}
                className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:bg-primary-container active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isProcessing ? t('processing') : t('confirm') || 'Confirm'}
              </button>

              <p className="text-[10px] text-center text-on-surface-variant font-black uppercase tracking-widest mt-6 opacity-40">
                Secure SSL Encrypted Payment
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
