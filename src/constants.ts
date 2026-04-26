export const ALL_ROLES = [
  'Standard', 
  'Silver', 
  'Gold', 
  'Platinum', 
  'Diamond', 
  'Founder', 
  'Legend'
];

export const TIER_COLORS: Record<string, string> = {
  'Standard': 'bg-slate-500',
  'Silver': 'bg-zinc-400',
  'Gold': 'bg-amber-500',
  'Platinum': 'bg-cyan-500',
  'Diamond': 'bg-blue-600',
  'Founder': 'bg-rose-500',
  'Legend': 'bg-red-600',
};

export const TIER_BENEFITS: Record<string, string[]> = {
  'Standard': ['Basic Support', 'Newsletter Access', 'Community Forum'],
  'Silver': ['5% Discount', 'Priority Support', 'Silver Badge', 'Ad-free Experience'],
  'Gold': ['10% Discount', 'Exclusive Events', 'Dedicated Manager', 'Early Access'],
  'Platinum': ['20% Discount', 'VIP Lounge Access', 'Free Shipping', 'Concierge Support'],
  'Diamond': ['25% Discount', 'Personalized Gifts', 'Lifetime Warranty', 'Diamond Events'],
  'Founder': ['Special Recognition', 'Governance Voting', 'Lifetime Membership', 'Exclusive Gear'],
  'Legend': ['Custom Benefits', 'Honorary Board Seat', 'Legendary Status', 'Pure Gold Card'],
};
