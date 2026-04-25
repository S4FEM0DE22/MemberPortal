import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Language = 'th' | 'en';

interface AppContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  th: {
    dashboard: 'ภาพรวมแดชบอร์ด',
    welcome: 'ยินดีต้อนรับกลับมา',
    today_happening: 'นี่คือสิ่งที่เกิดขึ้นกับชุมชนของคุณในวันนี้',
    new_member: 'สมาชิกใหม่',
    total_members: 'สมาชิกทั้งหมด',
    active_subscriptions: 'การสมัครสมาชิกที่ใช้งานอยู่',
    pending_approval: 'รอการอนุมัติ',
    must_action: 'ต้องดำเนินการ',
    recent_activity: 'กิจกรรมล่าสุด',
    view_all: 'ดูทั้งหมด',
    member_tier: 'ระดับสมาชิก',
    export_report: 'ส่งออกรายงาน',
    download_csv: 'ดาวน์โหลดไฟล์ CSV รายเดือน',
    home: 'หน้าแรก',
    members: 'สมาชิก',
    profile: 'โปรไฟล์',
    settings: 'ตั้งค่า',
    logout: 'ออกจากระบบ',
    appearance: 'ความชอบ',
    dark_mode: 'โหมดมืด',
    dark_mode_desc: 'ปรับเปลี่ยนธีมของแอป',
    language_label: 'ภาษา',
    language_desc: 'เลือกภาษาที่คุณต้องการ',
    security: 'ความปลอดภัย',
    current_password: 'รหัสผ่านปัจจุบัน',
    new_password: 'รหัสผ่านใหม่',
    confirm_new_password: 'ยืนยันรหัสผ่านใหม่',
    update_password: 'อัปเดตรหัสผ่าน',
    danger_zone: 'โซนอันตราย',
    delete_account_desc: 'เมื่อคุณลบบัญชีแล้ว จะไม่สามารถย้อนกลับได้ โปรดแน่ใจก่อนดำเนินการ',
    delete_account: 'ลบบัญชี',
    member_details: 'รายละเอียดบัญชี',
    member_id: 'รหัสผู้ใช้',
    member_since: 'เป็นสมาชิกตั้งแต่',
    account_status: 'สถานะบัญชี',
    active: 'ใช้งานอยู่',
    renewal_alert: 'สมาชิกของคุณจะต่ออายุในอีก {days} วัน',
    manage_plan: 'จัดการแผน',
    renewal_payment: 'ชำระเงินต่ออายุ',
    annual_gold: 'สมาชิกทองรายปี',
    approved_request: 'คำขอใหม่ได้รับการอนุมัติ',
    professional_tier: 'ระดับมืออาชีพ',
    certified: 'ผ่านการรับรอง',
    profile_updated: 'อัปเดตโปรไฟล์แล้ว',
    cert_updated: 'อัปเดตใบรับรองแล้ว',
    hours_ago: 'ชม. ที่แล้ว',
    yesterday: 'เมื่อวานนี้',
    gold_tier: 'ระดับทอง',
    silver_tier: 'ระดับเงิน',
    standard_tier: 'มาตรฐาน',
  },
  en: {
    dashboard: 'Dashboard Overview',
    welcome: 'Welcome back',
    today_happening: "Here's what's happening in your community today.",
    new_member: 'New Member',
    total_members: 'Total Members',
    active_subscriptions: 'Active Subscriptions',
    pending_approval: 'Pending Approval',
    must_action: 'Must Action',
    recent_activity: 'Recent Activity',
    view_all: 'View All',
    member_tier: 'Member Tiers',
    export_report: 'Export Report',
    download_csv: 'Download monthly CSV file',
    home: 'Home',
    members: 'Members',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    appearance: 'Preferences',
    dark_mode: 'Dark Mode',
    dark_mode_desc: 'Change application theme',
    language_label: 'Language',
    language_desc: 'Choose your preferred language',
    security: 'Security',
    current_password: 'Current Password',
    new_password: 'New Password',
    confirm_new_password: 'Confirm New Password',
    update_password: 'Update Password',
    danger_zone: 'Danger Zone',
    delete_account_desc: 'Once you delete your account, it cannot be undone. Please be sure before proceeding.',
    delete_account: 'Delete Account',
    member_details: 'Account Details',
    member_id: 'User ID',
    member_since: 'Member since',
    account_status: 'Account Status',
    active: 'Active',
    renewal_alert: 'Your membership will renew in {days} days',
    manage_plan: 'Manage Plan',
    renewal_payment: 'Renewal Payment',
    annual_gold: 'Annual Gold Member',
    approved_request: 'New request approved',
    professional_tier: 'Professional Tier',
    certified: 'Certified',
    profile_updated: 'Profile updated',
    cert_updated: 'Certificate updated',
    hours_ago: 'hrs. ago',
    yesterday: 'Yesterday',
    gold_tier: 'Gold Tier',
    silver_tier: 'Silver Tier',
    standard_tier: 'Standard Tier',
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'th');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const setLanguage = (lang: Language) => setLanguageState(lang);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <AppContext.Provider value={{ theme, language, toggleTheme, setLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
