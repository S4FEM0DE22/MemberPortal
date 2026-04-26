export const ALL_ROLES = [
  'Standard', 
  'Silver', 
  'Gold', 
  'Professional', 
  'Premium', 
  'Platinum', 
  'Premium Gold', 
  'Diamond', 
  'VIP', 
  'Founder', 
  'Elite', 
  'Legend'
];

export const TIER_COLORS: Record<string, string> = {
  'Standard': 'bg-slate-500',
  'Silver': 'bg-zinc-400',
  'Gold': 'bg-amber-500',
  'Professional': 'bg-emerald-500',
  'Premium': 'bg-indigo-500',
  'Platinum': 'bg-cyan-500',
  'Premium Gold': 'bg-amber-400',
  'Diamond': 'bg-blue-600',
  'VIP': 'bg-purple-600',
  'Founder': 'bg-rose-500',
  'Elite': 'bg-orange-500',
  'Legend': 'bg-red-600',
};

export const TIER_BENEFITS: Record<string, string[]> = {
  'Standard': ['Basic Support', 'Newsletter Access', 'Community Forum'],
  'Silver': ['5% Discount', 'Priority Support', 'Silver Badge', 'Ad-free Experience'],
  'Gold': ['10% Discount', 'Exclusive Events', 'Dedicated Manager', 'Early Access'],
  'Professional': ['B2B Tools', 'Priority Integration', 'API Access', 'Dedicated Slack'],
  'Premium': ['15% Discount', 'Unlimited Downloads', 'Premium Assets', 'Custom Profile'],
  'Platinum': ['20% Discount', 'VIP Lounge Access', 'Free Shipping', 'Concierge Support'],
  'Premium Gold': ['22% Discount', 'Double Rewards Points', 'Birthday Gift', 'Private Sales'],
  'Diamond': ['25% Discount', 'Personalized Gifts', 'Lifetime Warranty', 'Diamond Events'],
  'VIP': ['Unlimited Access', '24/7 Concierge', 'Private Events', 'White-glove Service'],
  'Founder': ['Special Recognition', 'Governance Voting', 'Lifetime Membership', 'Exclusive Gear'],
  'Elite': ['30% Discount', 'Elite Networking', 'Personal Assistant', 'Global Office Access'],
  'Legend': ['Custom Benefits', 'Honorary Board Seat', 'Legendary Status', 'Pure Gold Card'],
};
