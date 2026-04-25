import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, doc, setDoc, query, orderBy, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

type Theme = 'light' | 'dark';
type Language = 'th' | 'en';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Member {
  id?: string;
  name: string;
  role: string;
  status: string;
  email: string;
  joinDate: string;
  avatar: string;
  category: string;
  phone?: string;
}

interface AppContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  members: Member[];
  addMember: (member: Member) => Promise<void>;
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  bulkAddMembers: (members: Member[]) => Promise<void>;
  exportMembers: () => Promise<void>;
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const INITIAL_MEMBERS: Member[] = [
  { name: 'Sarah Jenkins', role: 'Premium Gold', status: 'Active', email: 'sarah.j@example.com', joinDate: '2022-10-12', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', category: 'Committee Members' },
  { name: 'David Miller', role: 'Professional', status: 'Pending', email: 'd.miller@company.com', joinDate: '2023-01-05', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', category: 'Volunteers' },
  { name: 'Emily Watson', role: 'Platinum', status: 'Active', email: 'emily.w@membership.io', joinDate: '2021-09-20', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', category: 'Event Attendees' },
  { name: 'Alex Thompson', role: 'Platinum', status: 'Active', email: 'alex.t@member.net', joinDate: '2021-10-14', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9oFhmFaa1uZBlTYMdM_doiRJ-D_1BT1K8HBEtU1uP3Rsffzr2uJ3_XzEBQfuCDX8aem149cLYHiUgcfVtFm9LfULHbm7qnZUjBdpo_bWxIhEZuuEjsBJllfYoWLtG-n-N7NpFZlDo9l-K16wrFggc6ip4xZ0C9Qpa76Gntr9Wb7d_nuB_RwoPfJFy3qniXF9_XXB-7oz6uu7VzZTesvjtdpzkTDdO66mOOZwrT_gvr8PPcowHjH2nQILam5V77pO20QZexzsUtxag', category: 'Committee Members' },
];

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
    user_id: 'รหัสผู้ใช้',
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
    platinum_tier: 'ระดับแพลทินัม',
    silver_tier: 'ระดับเงิน',
    standard_tier: 'มาตรฐาน',
    online_members: 'สมาชิกที่ออนไลน์',
    member_list: 'รายชื่อสมาชิก',
    manage_members: 'จัดการและตรวจสอบสมาชิกทั้งหมดในระบบ',
    import_csv: 'นำเข้า CSV',
    invite_member: 'เชิญสมาชิก',
    import_success: 'นำเข้าข้อมูลสมาชิกสำเร็จแล้ว',
    filters: 'ตัวกรอง',
    status: 'สถานะ',
    category: 'หมวดหมู่',
    all: 'ทั้งหมด',
    online: 'ออนไลน์',
    pending: 'รอดำเนินการ',
    clear_filters: 'ล้างตัวกรองทั้งหมด',
    member: 'สมาชิก',
    join_date: 'วันที่เข้าร่วม',
    actions: 'การจัดการ',
    no_results: 'ไม่พบข้อมูลสมาชิกที่ค้นหา',
    invite_new: 'เชิญสมาชิกใหม่',
    invite_desc: 'ส่งคำเชิญเข้าร่วมระบบผ่านอีเมล',
    full_name: 'ชื่อ-นามสกุล',
    email: 'อีเมล',
    cancel: 'ยกเลิก',
    send_invite: 'ส่งคำเชิญ',
    import_members: 'นำเข้าไฟล์สมาชิก',
    import_desc: 'อัปโหลดไฟล์ CSV เพื่อเพิ่มสมาชิกหลายคนพร้อมกัน',
    click_upload: 'คลิกเพื่ออัปโหลด หรือลากไฟล์มาที่นี่',
    csv_format: 'รองรับรูปแบบ .csv (ชื่อ, อีเมล, ระดับ, สถานะ)',
    edit_info: 'แก้ไขข้อมูล',
    suspend_member: 'ระงับสมาชิก',
    member_id: 'รหัสสมาชิก',
    search_placeholder: 'ค้นหาชื่อ, อีเมล หรือระดับสมาชิก...',
    name_placeholder: 'ป้อนชื่อสมาชิก',
    error_csv_only: 'กรุณาอัปโหลดไฟล์ CSV เท่านั้น',
    error_csv_empty: 'ไม่พบข้อมูลในไฟล์ CSV',
    error_csv_read: 'เกิดข้อผิดพลาดในการอ่านไฟล์',
    saved_success: 'บันทึกข้อมูลเรียบร้อยแล้ว',
    your_profile: 'โปรไฟล์ของคุณ',
    profile_desc: 'จัดการข้อมูลส่วนตัวและความปลอดภัยพื้นฐาน',
    verified_account: 'บัญชีที่ยืนยันแล้ว',
    personal_info: 'ข้อมูลส่วนตัว',
    phone_number: 'เบอร์โทรศัพท์',
    email_verified_msg: 'อีเมลได้รับการยืนยันและใช้งานอยู่',
    saving: 'กำลังบันทึก...',
    save_changes: 'บันทึกการเปลี่ยนแปลง',
    change_password: 'เปลี่ยนรหัสผ่าน',
    two_factor_auth: 'การยืนยันตัวตนสองชั้น',
    enabled: 'เปิดใช้งาน',
    disabled: 'ปิดใช้งาน',
    communication: 'การสื่อสาร',
    newsletter_subscription: 'สมัครรับจดหมายข่าว',
    newsletter_desc: 'รับข่าวสารและโปรโมชั่นผ่านอีเมล',
    push_notifications: 'การแจ้งเตือนแบบพุช',
    push_desc: 'การแจ้งเตือนแบบเรียลไทม์บนเบราว์เซอร์',
    pwd_update_success: 'อัปเดตรหัสผ่านสำเร็จแล้ว',
    settings_desc: 'จัดการการตั้งค่าบัญชีและความปลอดภัยของคุณ',
    processing: 'กำลังดำเนินการ...',
    are_you_sure: 'คุณแน่ใจหรือไม่?',
    delete_confirm_desc: 'การดำเนินการนี้ไม่สามารถย้อนกลับได้ ซึ่งจะลบบัญชีของคุณอย่างถาวรและนำข้อมูลของคุณออกจากเซิร์ฟเวอร์ของเรา',
    yes_delete: 'ใช่ ลบบัญชี',
    email_notif: 'การแจ้งเตือนทางอีเมล',
    email_notif_desc: 'สรุปและอัปเดตรายสัปดาห์',
    push_notif_desc: 'รับการแจ้งเตือนบนอุปกรณ์ของคุณ',
    renew_in: 'สมาชิกของคุณจะต่ออายุในอีก {days} วัน',
    activities: 'กิจกรรมล่าสุด',
    activities_desc: 'ประวัติการดำเนินการทั้งหมดในระบบ',
    search_activities: 'ค้นหากิจกรรม...',
    activity_details: 'รายละเอียดกิจกรรม',
    event_time: 'เวลาที่เกิด',
    ref_number: 'เลขที่อ้างอิง',
    check_more: 'ตรวจสอบเพิ่มเติม',
    summary_movement: 'สรุปความเคลื่อนไหว',
    this_week: 'สัปดาห์นี้',
    success_trans: 'ธุรกรรมสำเร็จ',
    quick_filter: 'ตัวกรองด่วน',
    payment: 'การชำระเงิน',
    system: 'ระบบ',
    notification: 'การแจ้งเตือน',
    welcome_back: 'ยินดีต้อนรับกลับมา',
    login_desc: 'กรุณากรอกรายละเอียดเพื่อเข้าสู่ระบบ',
    password: 'รหัสผ่าน',
    forgot_password: 'ลืมรหัสผ่าน?',
    remember_me: 'จดจำฉันไว้ 30 วัน',
    login_button: 'เข้าสู่ระบบ',
    no_account: 'ยังไม่มีบัญชีใช่ไหม?',
    register_free: 'สมัครสมาชิกฟรี',
    or_continue: 'หรือดำเนินการต่อด้วย',
    privacy_policy: 'นโยบายความเป็นส่วนตัว',
    terms_service: 'เงื่อนไขการให้บริการ',
    contact_support: 'ติดต่อฝ่ายสนับสนุน',
    elevate_network: 'ยกระดับเครือข่ายมืออาชีพของคุณ',
    elevate_desc: 'เข้าถึงแหล่งข้อมูลพิเศษ จัดการสิทธิประโยชน์การเป็นสมาชิก และเชื่อมต่อกับผู้นำในอุตสาหกรรมในสภาพแวดล้อมที่เป็นระบบและมีประสิทธิภาพ',
    active_members: 'สมาชิกที่ใช้งานอยู่',
    daily_activities: 'กิจกรรมรายวัน',
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
    user_id: 'User ID',
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
    platinum_tier: 'Platinum Tier',
    silver_tier: 'Silver Tier',
    standard_tier: 'Standard Tier',
    online_members: 'Online Members',
    member_list: 'Member List',
    manage_members: 'Manage and monitor all members in the system',
    import_csv: 'Import CSV',
    invite_member: 'Invite Member',
    import_success: 'Member import successful',
    filters: 'Filters',
    status: 'Status',
    category: 'Category',
    all: 'All',
    online: 'Online',
    pending: 'Pending',
    clear_filters: 'Clear all filters',
    member: 'Member',
    join_date: 'Join Date',
    actions: 'Actions',
    no_results: 'No members found',
    invite_new: 'Invite New Member',
    invite_desc: 'Send system invitation via email',
    full_name: 'Full Name',
    email: 'Email',
    cancel: 'Cancel',
    send_invite: 'Send Invitation',
    import_members: 'Import Members',
    import_desc: 'Upload CSV to add multiple members at once',
    click_upload: 'Click to upload or drag files here',
    csv_format: 'Supports .csv format (Name, Email, Tier, Status)',
    edit_info: 'Edit Info',
    suspend_member: 'Suspend Member',
    member_id: 'Member ID',
    search_placeholder: 'Search name, email or tier...',
    name_placeholder: 'Enter member name',
    error_csv_only: 'Please upload CSV files only',
    error_csv_empty: 'No data found in CSV file',
    error_csv_read: 'Error reading file',
    saved_success: 'Profile saved successfully',
    your_profile: 'Your Profile',
    profile_desc: 'Manage your personal information and security settings',
    verified_account: 'Verified Account',
    personal_info: 'Personal Information',
    phone_number: 'Phone Number',
    email_verified_msg: 'Email is verified and active',
    saving: 'Saving...',
    save_changes: 'Save Changes',
    change_password: 'Change Password',
    two_factor_auth: 'Two-Factor Authentication',
    enabled: 'Enabled',
    disabled: 'Disabled',
    communication: 'Communication',
    newsletter_subscription: 'Newsletter Subscription',
    newsletter_desc: 'Receive news and promotions via email',
    push_notifications: 'Push Notifications',
    push_desc: 'Real-time notifications on your browser',
    pwd_update_success: 'Password updated successfully',
    settings_desc: 'Manage your account settings and security',
    processing: 'Processing...',
    are_you_sure: 'Are you sure?',
    delete_confirm_desc: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    yes_delete: 'Yes, Delete Account',
    email_notif: 'Email Notifications',
    email_notif_desc: 'Weekly summaries and updates',
    push_notif_desc: 'Receive notifications on your device',
    renew_in: 'Your membership will renew in {days} days',
    activities: 'Recent Activities',
    activities_desc: 'History of all actions in the system',
    search_activities: 'Search activities...',
    activity_details: 'Activity Details',
    event_time: 'Event Time',
    ref_number: 'Reference Number',
    check_more: 'Check More',
    summary_movement: 'Movement Summary',
    this_week: 'This Week',
    success_trans: 'Successful Transactions',
    quick_filter: 'Quick Filters',
    payment: 'Payment',
    system: 'System',
    notification: 'Notification',
    welcome_back: 'Welcome Back',
    login_desc: 'Please enter your details to sign in',
    password: 'Password',
    forgot_password: 'Forgot Password?',
    remember_me: 'Remember me for 30 days',
    login_button: 'Sign In',
    no_account: "Don't have an account?",
    register_free: 'Sign up for free',
    or_continue: 'Or continue with',
    privacy_policy: 'Privacy Policy',
    terms_service: 'Terms of Service',
    contact_support: 'Contact Support',
    elevate_network: 'Elevate your professional network',
    elevate_desc: 'Access exclusive resources, manage membership benefits, and connect with industry leaders in a structured and efficient environment.',
    active_members: 'Active Members',
    daily_activities: 'Daily Activities',
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'th');
  const [members, setMembers] = useState<Member[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setMembers([]);
      return;
    }

    const q = query(collection(db, 'members'), orderBy('joinDate', 'desc'));
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const memberList: Member[] = [];
      snapshot.forEach((doc) => {
        memberList.push({ id: doc.id, ...doc.data() } as Member);
      });
      setMembers(memberList);
    }, (error) => {
      console.error("Firestore Error (Members List): ", error);
    });

    return () => unsubscribeSnapshot();
  }, [user]);

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

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
    
    // Also create a member record in Firestore to track status
    await addDoc(collection(db, 'members'), {
      name,
      email,
      role: 'Standard',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const addMember = async (member: Member) => {
    try {
      await addDoc(collection(db, 'members'), member);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'members');
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      await setDoc(doc(db, 'members', id), updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `members/${id}`);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'members', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `members/${id}`);
    }
  };

  const bulkAddMembers = async (newMembers: Member[]) => {
    try {
      const { writeBatch } = await import('firebase/firestore');
      const batch = writeBatch(db);
      newMembers.forEach(m => {
        const newDocRef = doc(collection(db, 'members'));
        batch.set(newDocRef, m);
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'members (bulk)');
    }
  };

  const exportMembers = async () => {
    if (members.length === 0) return;
    const Papa = await import('papaparse');
    const csv = Papa.default.unparse(members);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `members_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <AppContext.Provider value={{ 
      theme, 
      language, 
      toggleTheme, 
      setLanguage, 
      t, 
      members, 
      addMember, 
      updateMember,
      deleteMember,
      bulkAddMembers,
      exportMembers,
      user,
      loading,
      signIn,
      signInWithEmail,
      signUpWithEmail,
      logout
    }}>
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
