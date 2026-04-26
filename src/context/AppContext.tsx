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
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  setDoc, 
  query, 
  orderBy, 
  getDocFromServer, 
  where,
  serverTimestamp,
  limit,
  deleteDoc,
  getDocs,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
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
  role: string; // Now exclusively for Tiers: Standard, Silver, Gold, etc.
  isAdmin?: boolean; // Separate flag for admin rights
  status: string;
  email: string;
  joinDate: string;
  avatar: string;
  category: string;
  phone?: string;
  address?: string;
  spending?: number;
}

export interface Activity {
  id?: string;
  title: string;
  sub: string;
  amount?: string;
  status?: string;
  time: string;
  timestamp: any;
  type: 'payment' | 'member' | 'system' | 'security' | 'notification' | 'profile';
  description: string;
  reference: string;
  userId?: string;
}

interface AppContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  members: Member[];
  activities: Activity[];
  addMember: (member: Member) => Promise<void>;
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  updateProfileData: (updates: { fullName?: string, photoURL?: string, phone?: string, address?: string }) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  bulkAddMembers: (members: Member[]) => Promise<void>;
  exportMembers: () => Promise<void>;
  purchaseItem: (amount: number) => Promise<void>;
  upgradeTier: (newRole: string, cost: number) => Promise<void>;
  logActivity: (activity: Omit<Activity, 'id' | 'timestamp' | 'time'>) => Promise<void>;
  user: User | null;
  isAdmin: boolean;
  currentMember: Member | null;
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
    dashboard: 'แดชบอร์ด',
    welcome: 'ยินดีต้อนรับ',
    today_happening: 'วันนี้เกิดอะไรขึ้นบ้าง',
    new_member: 'สมาชิกใหม่',
    total_members: 'สมาชิกทั้งหมด',
    active_subscriptions: 'การสมัครสมาชิกที่ใช้งานอยู่',
    pending_approval: 'รอการอนุมัติ',
    must_action: 'ต้องจัดการ',
    recent_activity: 'กิจกรรมล่าสุด',
    view_all: 'ดูทั้งหมด',
    member_tier: 'ระดับสมาชิก',
    export_report: 'ส่งออกรายงาน',
    download_csv: 'ดาวน์โหลด CSV',
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
    member_details: 'รายละเอียดสมาชิก',
    user_id: 'รหัสผู้ใช้',
    member_since: 'เป็นสมาชิกตั้งแต่',
    account_status: 'สถานะบัญชี',
    active: 'ใช้งานอยู่',
    renew_in: 'สมาชิกของคุณจะต่ออายุในอีก {days} วัน',
    manage_plan: 'จัดการแผนการเป็นสมาชิก',
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
    diamond_tier: 'ระดับไดมอนด์',
    founder_tier: 'ระดับผู้ก่อตั้ง',
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
    clear_filters: 'ล้างตัวกรอง',
    clear_all_filters: 'ล้างตัวกรองทั้งหมด',
    member: 'สมาชิก',
    join_date: 'วันที่เข้าร่วม',
    actions: 'การจัดการ',
    no_results: 'ไม่พบผลลัพธ์',
    invite_new: 'เชิญสมาชิกใหม่',
    invite_desc: 'ส่งคำเชิญเข้าร่วมระบบผ่านอีเมล',
    full_name: 'ชื่อ-นามสกุล',
    address: 'ที่อยู่',
    email: 'อีเมล',
    cancel: 'ยกเลิก',
    send_invite: 'ส่งคำเชิญ',
    import_members: 'นำเข้าไฟล์สมาชิก',
    import_desc: 'อัปโหลดไฟล์ CSV เพื่อเพิ่มสมาชิกหลายคนพร้อมกัน',
    click_upload: 'คลิกเพื่ออัปโหลด หรือลากไฟล์มาที่นี่',
    csv_format: 'รองรับรูปแบบ .csv (ชื่อ, อีเมล, ระดับ, สถานะ)',
    edit_info: 'แก้ไขข้อมูล',
    suspend_member: 'ระงับสมาชิก',
    approve_member: 'อนุมัติสมาชิก',
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
    newsletter_subscription: 'สมัครรับข่าวสาร',
    newsletter_desc: 'รับอัปเดตรายสัปดาห์และข่าวเด่น',
    push_notifications: 'การแจ้งเตือนแบบพุช',
    push_desc: 'รับการแจ้งเตือนทันทีบนอุปกรณ์ของคุณ',
    email_notif: 'การแจ้งเตือนทางอีเมล',
    email_notif_desc: 'สรุปและอัปเดตรายสัปดาห์',
    activities: 'กิจกรรมล่าสุด',
    activities_desc: 'ประวัติการดำเนินการทั้งหมดในระบบ',
    search_activities: 'ค้นหากิจกรรม...',
    activity_details: 'รายละเอียดกิจกรรม',
    event_time: 'เวลาเกิดเหตุการณ์',
    ref_number: 'หมายเลขเลขอ้างอิง',
    check_more: 'ตรวจสอบเพิ่มเติม',
    summary_movement: 'สรุปการเคลื่อนไหว',
    this_week: 'สัปดาห์นี้',
    success_trans: 'รายการที่สำเร็จ',
    quick_filter: 'ตัวกรองด่วน',
    payment: 'การชำระเงิน',
    system: 'ระบบ',
    notification: 'การแจ้งเตือน',
    welcome_back: 'ยินดีต้อนรับกลับมา',
    login_desc: 'กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ',
    password: 'รหัสผ่าน',
    forgot_password: 'ลืมรหัสผ่าน?',
    remember_me: 'จดจำฉันเป็นเวลา 30 วัน',
    login_button: 'เข้าสู่ระบบ',
    delete_member: 'ลบสมาชิก',
    unsuspend: 'ยกเลิกการระงับ',
    generate_random: 'สุ่มเพิ่มสมาชิก',
    google_user_pwd_msg: 'คุณเข้าสู่ระบบด้วย Google คุณสามารถจัดการรหัสผ่านได้ผ่านการตั้งค่าบัญชี Google ของคุณ',
    error_recent_login: 'กรุณาออกจากระบบแล้วเข้าใหม่เพื่อดำเนินการลบชื่อผู้ใช้นี้',
    profile_desc_short: 'ข้อมูลส่วนตัว',
    account: 'บัญชี',
    community_growing: 'ชุมชนที่กำลังเติบโต',
    growth_msg: 'ดูว่ากิจกรรมของสมาชิกและการลงทะเบียนใหม่ส่งผลต่อชุมชนของเราอย่างไร',
    see_full_analytics: 'ดูบทวิเคราะห์ทั้งหมด',
    action_required: 'ต้องจัดการ',
    manage_now: 'จัดการตอนนี้',
    account_verified: 'ยืนยันตัวตนสำเร็จ',
    metrics_overview: 'ภาพรวมการติดตามเมทริกซ์',
    quick_index: 'ดัชนีเข้าถึงด่วน',
    query_null: 'ไม่พบข้อมูลการค้นหา',
    net_contribution: 'ยอดรวมการสนับสนุน',
    member_tier_distribution: 'สัดส่วนระดับสมาชิก',
    operational_intelligence: 'ข้อมูลเชิงลึกการดำเนินงาน',
    no_account: "ยังไม่มีบัญชีใช่หรือไม่?",
    register_free: 'สมัครสมาชิกฟรี',
    start_journey: 'เริ่มต้นการเดินทางของคุณ',
    register_desc_hero: 'ลงชื่อเข้าใช้เพื่อเข้าถึงฟีเจอร์พรีเมียม สร้างเครือข่าย และเติบโตไปกับชุมชนมืออาชีพของเรา',
    feat_dashboard: 'เข้าถึงแดชบอร์ดส่วนตัว',
    feat_mgmt: 'ระบบจัดการสมาชิกอัจฉริยะ',
    feat_perks: 'สิทธิประโยชน์และของรางวัลพิเศษ',
    feat_realtime: 'การแจ้งเตือนแบบเรียลไทม์',
    register_new: 'ลงทะเบียนบัญชีใหม่',
    create_account_desc: 'สร้างบัญชีของคุณเพื่อเริ่มต้น',
    or_signup_with: 'หรือสมัครสมาชิกด้วย',
    already_have_account: 'มีบัญชีอยู่แล้วใช่ไหม?',
    login_here: 'เข้าสู่ระบบที่นี่',
    pwd_hint: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
    agree_text: 'ฉันยอมรับใน',
    and: 'และ',
    sign_up: 'สร้างบัญชี',
    or_continue: 'หรือดำเนินการต่อด้วย',
    privacy_policy: 'นโยบายความเป็นส่วนตัว',
    terms_service: 'เงื่อนไขการให้บริการ',
    contact_support: 'ติดต่อฝ่ายสนับสนุน',
    elevate_network: 'ยกระดับเครือข่ายมืออาชีพของคุณ',
    elevate_desc: 'เข้าถึงทรัพยากรพิเศษ จัดการสิทธิประโยชน์การเป็นสมาชิก และเชื่อมต่อกับผู้นำในอุตสาหกรรมในสภาพแวดล้อมที่เป็นโครงสร้างและมีประสิทธิภาพ',
    active_members: 'สมาชิกที่ใช้งานอยู่',
    daily_activities: 'กิจกรรมรายวัน',
    spending: 'ยอดการใช้จ่าย',
    shop: 'ร้านค้า',
    buy_item: 'ซื้อสินค้า',
    upgrade: 'อัปเกรดระดับ',
    upgrade_to: 'อัปเกรดเป็น {role}',
    purchase_success: 'ซื้อสินค้าสำเร็จ!',
    upgrade_success: 'อัปเกรดระดับสำเร็จ!',
    auto_upgrade_hint: 'ใช้จ่ายครบ {amount} เพื่ออัปเกรดเป็น {role}',
    total_spent: 'ยอดรวมการใช้จ่าย',
    shop_desc: 'สะสมยอดจากการซื้อสินค้าเพื่อเพิ่มระดับสมาชิก หรืออัปเกรดระดับได้ทันที',
    realtime_feed: 'ฟีดระบบเรียลไทม์',
    end_of_updates: 'สิ้นสุดการอัปเดตล่าสุด',
    days_ago: '{days} วันที่แล้ว',
    new_member_registered: 'สมาชิกใหม่ลงทะเบียนแล้ว',
    subscription_cancelled: 'ยกเลิกการสมัครสมาชิกแล้ว',
    payment_failed: 'การชำระเงินล้มเหลว',
    system_maintenance: 'การบำรุงรักษาระบบ',
    new_admin_added: 'เพิ่มผู้ดูแลระบบใหม่',
    unspecified_name: 'ไม่ระบุชื่อ',
    volunteers: 'อาสาสมัคร',
    committee_members: 'คณะกรรมการ',
    event_attendees: 'ผู้เข้าร่วมกิจกรรม',
    other: 'อื่นๆ',
    staff: 'พนักงาน',
    donors: 'ผู้บริจาค',
    general: 'ทั่วไป',
    are_you_sure: 'คุณแน่ใจหรือไม่?',
    settings_desc: 'จัดการการตั้งค่าแอปพลิเคชันและความปลอดภัย',
    processing: 'กำลังดำเนินการ...',
    delete_confirm_desc: 'คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีของคุณ? การดำเนินการนี้ไม่สามารถย้อนกลับได้และข้อมูลทั้งหมดของคุณจะถูกลบอย่างถาวร',
    yes_delete: 'ใช่, ลบบัญชี',
    pwd_update_success: 'อัปเดตรหัสผ่านสำเร็จแล้ว',
    push_notif_desc: 'รับการแจ้งเตือนทันทีบนอุปกรณ์ของคุณ',
    general_settings: 'การตั้งค่าทั่วไป',
    member_subscription: 'การสมัครสมาชิก',
    admin_console: 'แผงควบคุมผู้ดูแลระบบ',
    admin_auth: 'สิทธิ์ผู้ดูแลระบบ',
    tier_account: 'บัญชีระดับ {tier}',
    next: 'ถัดไป',
    tier_privileges: 'สิทธิพิเศษระดับสมาชิก',
    operational_intel: 'ข้อมูลเชิงลึกการดำเนินงาน',
    active_database: 'ฐานข้อมูลผู้ใช้',
    online_infra: 'โครงสร้างพื้นฐานออนไลน์',
    no_telemetry: 'ไม่มีข้อมูลบันทึกในเซสชันปัจจุบัน',
    data_updated_realtime: 'ข้อมูลอัปเดตแบบเรียลไทม์ตามการทำรายการของสมาชิก',
    curated_shop: 'ร้านค้าพิเศษ',
    tier_benefits: 'สิทธิประโยชน์แต่ละระดับ',
    explore_perks: 'สำรวจสิทธิพิเศษในทุกระดับสมาชิก',
    view_all_tiers: 'ดูระดับสมาชิกทั้งหมด',
    concierge_services: 'บริการเลขาส่วนตัว',
    vip_support: 'ฝ่ายสนับสนุนลำดับความสำคัญ VIP',
    benefit_list_desc: 'รายการสิทธิประโยชน์และสิทธิพิเศษทั้งหมด',
    current_tier: 'ระดับปัจจุบัน',
    included_benefits: 'สิทธิประโยชน์ที่ได้รับ',
    history_indexed: 'ประวัติการทำรายการของคุณจะถูกรวบรวมที่นี่เมื่อเริ่มต้นใช้งาน',
    grant_admin: 'มอบสิทธิ์ผู้ดูแลระบบ',
    class: 'ประเภท',
    activity_id: 'กิจกรรม / การระบุตัวตน',
    value_status: 'มูลค่า / สถานะ',
    timestamp: 'เวลาที่บันทึก',
    system_log: 'บันทึกระบบ',
    no_activity_logs: 'ไม่พบประวัติกิจกรรมที่ตรงกับตัวกรองปัจจุบัน',
    weekly_throughput: 'ปริมาณงานรายสัปดาห์',
    latency_success: 'ความสำเร็จของการเข้าถึง',
    membership_tiers: 'ระดับสมาชิก',
    system_logs: 'บันทึกระบบ',
    administration: 'การบริหารจัดการ',
    administrator: 'ผู้ดูแลระบบ',
    pro_consultation: 'ขอคำปรึกษาจากผู้เชี่ยวชาญ',
    premium_pack: 'ชุดทรัพยากรระดับพรีเมียม',
    vip_ticket: 'ตั๋ว VIP งานอีเวนต์',
    feature_coming_soon: 'กำลังพัฒนาฟีเจอร์นี้...',
    user_name_default: 'ชื่อผู้ใช้',
    ui_personalization: 'หน้าตาโปรแกรมและการตั้งค่าส่วนตัว',
    protection_access: 'การป้องกันและการเข้าถึง',
    silver: 'ซิลเวอร์',
    gold: 'โกลด์',
    platinum: 'แพลทินัม',
    diamond: 'ไดมอนด์',
    founder: 'ผู้ก่อตั้ง',
    member_since_date: '14 ตุลาคม 2021',
  },
  en: {
    dashboard: 'Dashboard',
    welcome: 'Welcome',
    today_happening: 'What is happening today',
    new_member: 'New Member',
    total_members: 'Total Members',
    active_subscriptions: 'Active Subscriptions',
    pending_approval: 'Pending Approval',
    must_action: 'Action Required',
    recent_activity: 'Recent Activity',
    view_all: 'View All',
    member_tier: 'Member Tier',
    export_report: 'Export Report',
    download_csv: 'Download CSV',
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
    member_details: 'Member Details',
    user_id: 'User ID',
    member_since: 'Member since',
    account_status: 'Account Status',
    active: 'Active',
    renew_in: 'Your membership will renew in {days} days',
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
    diamond_tier: 'Diamond Tier',
    founder_tier: 'Founder Tier',
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
    clear_filters: 'Clear Filters',
    clear_all_filters: 'Clear all filters',
    member: 'Member',
    join_date: 'Join Date',
    actions: 'Actions',
    no_results: 'No results found',
    invite_new: 'Invite New Member',
    invite_desc: 'Send system invitation via email',
    full_name: 'Full Name',
    address: 'Address',
    email: 'Email',
    cancel: 'Cancel',
    send_invite: 'Send Invitation',
    import_members: 'Import Members',
    import_desc: 'Upload CSV to add multiple members at once',
    click_upload: 'Click to upload or drag files here',
    csv_format: 'Supports .csv format (Name, Email, Tier, Status)',
    edit_info: 'Edit Info',
    suspend_member: 'Suspend Member',
    approve_member: 'Approve Member',
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
    newsletter_desc: 'Receive weekly updates and highlights',
    push_notifications: 'Push Notifications',
    push_desc: 'Get instant alerts on your device',
    email_notif: 'Email Notifications',
    email_notif_desc: 'Weekly summaries and updates',
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
    delete_member: 'Delete Member',
    unsuspend: 'Unsuspend',
    generate_random: 'Randomly Add Members',
    google_user_pwd_msg: 'You are signed in with Google. You can manage your password through your Google Account settings.',
    error_recent_login: 'Please sign out and sign in again to delete your account.',
    profile_desc_short: 'Personal Info',
    account: 'Account',
    community_growing: 'Community is Growing',
    growth_msg: 'See how member activity and new registrations are impacting our community.',
    see_full_analytics: 'See Full Analytics',
    action_required: 'Action Required',
    manage_now: 'Manage Now',
    account_verified: 'Account Verified',
    metrics_overview: 'Metrics Tracking Overview',
    quick_index: 'Log Quick Index',
    query_null: 'LOG_QUERY_NULL',
    net_contribution: 'Net Contribution',
    member_tier_distribution: 'Member Tier Distribution',
    operational_intelligence: 'Operational Intelligence',
    no_account: "Don't have an account?",
    register_free: 'Sign up for free',
    start_journey: 'Start Your Journey',
    register_desc_hero: 'Sign up to access premium features, build connections, and grow with our professional community.',
    feat_dashboard: 'Access Personal Dashboard',
    feat_mgmt: 'Smart Member Management',
    feat_perks: 'Exclusive Benefits & Perks',
    feat_realtime: 'Real-time Notifications',
    register_new: 'Register New Account',
    create_account_desc: 'Create your account to get started',
    or_signup_with: 'Or Sign Up With',
    already_have_account: 'Already have an account?',
    login_here: 'Login Here',
    pwd_hint: 'Password must be at least 8 characters long',
    agree_text: 'I agree to the',
    and: 'and',
    sign_up: 'Create Account',
    or_continue: 'Or continue with',
    privacy_policy: 'Privacy Policy',
    terms_service: 'Terms of Service',
    contact_support: 'Contact Support',
    elevate_network: 'Elevate your professional network',
    elevate_desc: 'Access exclusive resources, manage membership benefits, and connect with industry leaders in a structured and efficient environment.',
    active_members: 'Active Members',
    daily_activities: 'Daily Activities',
    spending: 'Spending',
    shop: 'Shop',
    buy_item: 'Buy Item',
    upgrade: 'Upgrade Tier',
    upgrade_to: 'Upgrade to {role}',
    purchase_success: 'Purchase Successful!',
    upgrade_success: 'Tier Upgraded Successfully!',
    auto_upgrade_hint: 'Spend {amount} more to upgrade to {role}',
    total_spent: 'Total Spent',
    shop_desc: 'Accumulate spending from purchases to increase your tier, or upgrade directly.',
    realtime_feed: 'Real-time system feed',
    end_of_updates: 'End of recent updates',
    days_ago: '{days} days ago',
    new_member_registered: 'New Member Registered',
    subscription_cancelled: 'Subscription Cancelled',
    payment_failed: 'Payment Failed',
    system_maintenance: 'System Maintenance',
    new_admin_added: 'New Admin Added',
    unspecified_name: 'Unspecified Name',
    volunteers: 'Volunteers',
    committee_members: 'Committee Members',
    event_attendees: 'Event Attendees',
    other: 'Other',
    staff: 'Staff',
    donors: 'Donors',
    general: 'General',
    are_you_sure: 'Are you sure?',
    settings_desc: 'Manage application settings and security',
    processing: 'Processing...',
    delete_confirm_desc: 'Are you sure you want to delete your account? This action is irreversible and all your data will be permanently removed.',
    yes_delete: 'Yes, delete account',
    pwd_update_success: 'Password updated successfully',
    push_notif_desc: 'Get instant alerts on your device',
    general_settings: 'General Settings',
    member_subscription: 'Member Subscription',
    admin_console: 'Admin Console',
    admin_auth: 'Admin Authorization',
    tier_account: '{tier} Tier Account',
    next: 'next',
    tier_privileges: 'Tier Privileges',
    operational_intel: 'Operational Intelligence',
    active_database: 'Active Database',
    online_infra: 'Online Infrastructure',
    no_telemetry: 'No telemetry data recorded in current session.',
    data_updated_realtime: 'Data updated dynamically based on real-time membership transactions.',
    curated_shop: 'Curated Shop',
    tier_benefits: 'Tier Benefits',
    explore_perks: 'Explore exclusive perks across all levels',
    view_all_tiers: 'View All Tiers',
    concierge_services: 'Concierge Services',
    vip_support: 'VIP Priority Support',
    benefit_list_desc: 'Complete list of benefits and exclusive privileges',
    current_tier: 'Current Tier',
    included_benefits: 'Included Benefits',
    history_indexed: 'Your transaction history will be indexed here once initialized.',
    grant_admin: 'Grant Admin Permissions',
    class: 'Class',
    activity_id: 'Activity / Identification',
    value_status: 'Value / Status',
    timestamp: 'Timestamp',
    system_log: 'SYSTEM_LOG',
    no_activity_logs: 'No activity logs matching current filter parameters.',
    weekly_throughput: 'Weekly Throughput',
    latency_success: 'Latency Success',
    membership_tiers: 'Membership Tiers',
    system_logs: 'System Logs',
    administration: 'Administration',
    administrator: 'Administrator',
    pro_consultation: 'Professional Consultation',
    premium_pack: 'Premium Resource Pack',
    vip_ticket: 'Event VIP Ticket',
    feature_coming_soon: 'Feature coming soon...',
    user_name_default: 'User Name',
    ui_personalization: 'UI & Personalization',
    protection_access: 'Protection & Access',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
    diamond: 'Diamond',
    founder: 'Founder',
    member_since_date: 'October 14, 2021',
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'th');
  const [members, setMembers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = currentMember?.isAdmin === true || user?.email === 'noppanun47@gmail.com';

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
        setCurrentMember(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user || !user.email) return;

    // Listener for CURRENT user's member document
    const q = query(collection(db, 'members'), where('email', '==', user.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setCurrentMember({ id: doc.id, ...doc.data() } as Member);
      } else {
        setCurrentMember(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error (Current Member): ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user || !isAdmin) {
      setMembers([]);
      return;
    }

    // Only admins can subscribe to the full members list
    const q = query(collection(db, 'members'), orderBy('joinDate', 'desc'));
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const memberList: Member[] = [];
      snapshot.forEach((doc) => {
        memberList.push({ id: doc.id, ...doc.data() } as Member);
      });
      setMembers(memberList);
    }, (error) => {
      console.error("Firestore Error (Admin Members List): ", error);
    });

    return () => unsubscribeSnapshot();
  }, [user, isAdmin]);

  useEffect(() => {
    if (!user) {
      setActivities([]);
      return;
    }

    // Admins see all, users see their own
    let q = query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(50));
    if (!isAdmin) {
      q = query(collection(db, 'activities'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(20));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activityList: Activity[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Convert timestamp to relative time string
        const ts = data.timestamp?.toDate ? data.timestamp.toDate() : new Date();
        const diffMs = new Date().getTime() - ts.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHrs / 24);
        
        let timeStr = 'Just now';
        if (diffDays > 0) timeStr = `${diffDays} days ago`;
        else if (diffHrs > 0) timeStr = `${diffHrs} hours ago`;

        activityList.push({ id: doc.id, ...data, time: timeStr } as Activity);
      });
      setActivities(activityList);
    }, (error) => {
      console.error("Firestore Error (Activities): ", error);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

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

  const logActivity = async (activity: Omit<Activity, 'id' | 'timestamp' | 'time'>) => {
    try {
      await addDoc(collection(db, 'activities'), {
        ...activity,
        timestamp: serverTimestamp(),
        userId: activity.userId || user?.uid || null
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if member already exists in Firestore for this user
    if (user.email) {
      const q = query(collection(db, 'members'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        const isPrimaryAdmin = user.email === 'noppanun47@gmail.com';
        // First time Google login, create member record with user UID as document ID
        await setDoc(doc(db, 'members', user.uid), {
          name: user.displayName || 'Google User',
          email: user.email,
          role: 'Standard',
          isAdmin: isPrimaryAdmin,
          status: isPrimaryAdmin ? 'Active' : 'Pending',
          joinDate: new Date().toISOString().split('T')[0],
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'GU')}&background=random`,
          category: 'Other',
          spending: 0,
          userId: user.uid
        });
        
        await logActivity({
          title: t('new_member_registered'),
          sub: `${user.displayName || 'Google User'} joined Standard Tier`,
          type: 'member',
          description: `New member registered via Google sign-in. Status: ${isPrimaryAdmin ? 'Active' : 'Pending'}`,
          reference: `MEM-${user.uid.substring(0, 8).toUpperCase()}`,
          userId: user.uid
        });
      } else {
        // Member exists. Check if ID matches UID. If not, "claim" it.
        const existingDoc = querySnapshot.docs[0];
        if (existingDoc.id !== user.uid) {
          const data = existingDoc.data();
          await setDoc(doc(db, 'members', user.uid), {
            ...data,
            userId: user.uid // Ensure UID is stored
          });
          await deleteDoc(doc(db, 'members', existingDoc.id));
          
          await logActivity({
            title: t('account_verified'),
            sub: `Account linked to UID`,
            type: 'system',
            description: `Manual member record linked to authenticated user UID.`,
            reference: `LNK-${user.uid.substring(0, 8).toUpperCase()}`,
            userId: user.uid
          });
        } else if (!existingDoc.data().userId) {
          // Just ensure userId field is present
          await setDoc(doc(db, 'members', user.uid), { userId: user.uid }, { merge: true });
        }
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    // Check if member already exists first
    const q = query(collection(db, 'members'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Member with this email already exists in the system.');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
    
    const isPrimaryAdmin = email === 'noppanun47@gmail.com';
    // Create member record with user UID as document ID
    await setDoc(doc(db, 'members', userCredential.user.uid), {
      name,
      email,
      role: 'Standard',
      isAdmin: isPrimaryAdmin,
      status: isPrimaryAdmin ? 'Active' : 'Pending',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      category: 'Other',
      spending: 0
    });

    await logActivity({
      title: t('new_member_registered'),
      sub: `${name} joined Standard Tier`,
      type: 'member',
      description: `New member registered with email/password. Status: ${isPrimaryAdmin ? 'Active' : 'Pending'}`,
      reference: `MEM-${userCredential.user.uid.substring(0, 8).toUpperCase()}`,
      userId: userCredential.user.uid
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const addMember = async (member: Member) => {
    try {
      // For manually added members by admin, we still use addDoc (random ID)
      // but ensure spending and isAdmin (default false) are present
      const docRef = await addDoc(collection(db, 'members'), {
        ...member,
        spending: member.spending || 0,
        isAdmin: member.isAdmin || false
      });

      await logActivity({
        title: t('invite_new'),
        sub: `${member.name} added by Admin`,
        type: 'member',
        description: `New member manually added to ${member.role} Tier.`,
        reference: `MEM-${docRef.id.substring(0, 8).toUpperCase()}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'members');
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      await setDoc(doc(db, 'members', id), updates, { merge: true });
      
      const changedFields = Object.keys(updates).join(', ');
      let activityTitle = t('profile_updated');
      let activitySub = `Member ${id.substring(0, 8)} updated`;

      if (updates.status === 'Active' && !updates.name) {
        activityTitle = t('approved_request');
        activitySub = `Member ${id.substring(0, 8)} approved`;
      } else if (updates.status === 'Suspended') {
        activityTitle = t('suspend_member');
        activitySub = `Member ${id.substring(0, 8)} suspended`;
      }

      await logActivity({
        title: activityTitle,
        sub: activitySub,
        type: 'member',
        description: `Admin updated member: ${changedFields}`,
        reference: `UPD-${id.substring(0, 8).toUpperCase()}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `members/${id}`);
    }
  };

  const updateProfileData = async (updates: { fullName?: string, photoURL?: string, phone?: string, address?: string }) => {
    if (!user || !user.email) return;

    try {
      // 1. Update Firebase Auth Profile
      const authUpdates: { displayName?: string, photoURL?: string } = {};
      if (updates.fullName) authUpdates.displayName = updates.fullName;
      if (updates.photoURL) authUpdates.photoURL = updates.photoURL;
      
      if (Object.keys(authUpdates).length > 0) {
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(user, authUpdates);
      }

      // 2. Update Firestore Member Record (if exists)
      const q = query(collection(db, 'members'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const memberId = querySnapshot.docs[0].id;
        const firestoreUpdates: any = {};
        if (updates.fullName) firestoreUpdates.name = updates.fullName;
        if (updates.photoURL) firestoreUpdates.avatar = updates.photoURL;
        if (updates.phone) firestoreUpdates.phone = updates.phone;
        if (updates.address) firestoreUpdates.address = updates.address;
        
        await updateDoc(doc(db, 'members', memberId), firestoreUpdates);

        await logActivity({
          title: t('profile_updated'),
          sub: `${updates.fullName || user.displayName || user.email} updated profile`,
          type: 'profile',
          description: `User updated personal profile details: ${Object.keys(updates).join(', ')}`,
          reference: `PRF-${memberId.substring(0, 8).toUpperCase()}`,
          userId: user.uid
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'profile_sync');
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'members', id));

      await logActivity({
        title: t('delete_member'),
        sub: `Member ${id.substring(0, 8)} removed`,
        type: 'member',
        description: 'Admin deleted a member record from the system.',
        reference: `DEL-${id.substring(0, 8).toUpperCase()}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `members/${id}`);
    }
  };

  const bulkAddMembers = async (newMembers: Member[]) => {
    try {
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

  const TIER_HIERARCHY = ['Standard', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Founder'];

  const purchaseItem = async (amount: number) => {
    if (!user || !user.email) return;
    
    try {
      const q = query(collection(db, 'members'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const memberDoc = querySnapshot.docs[0];
        const memberData = memberDoc.data() as Member;
        const currentSpending = memberData.spending || 0;
        const newSpending = currentSpending + amount;
        
        let newRole = memberData.role;
        
        // Auto-upgrade logic based on spending (Don't change isAdmin here)
        if (newSpending >= 50000) newRole = 'Founder';
        else if (newSpending >= 20000) newRole = 'Diamond';
        else if (newSpending >= 10000) newRole = 'Platinum';
        else if (newSpending >= 5000) newRole = 'Gold';
        else if (newSpending >= 1000) newRole = 'Silver';

        // Update preserving isAdmin status
        await updateDoc(doc(db, 'members', memberDoc.id), {
          spending: newSpending,
          role: newRole,
          // Re-affirm admin status if it's the owner email
          isAdmin: memberData.isAdmin || user.email === 'noppanun47@gmail.com'
        });

        await logActivity({
          title: t('payment'),
          sub: `Purchase: ฿${amount.toLocaleString()}`,
          amount: `฿${amount.toLocaleString()}`,
          type: 'payment',
          description: `Successful item purchase. Current Tier: ${newRole}`,
          reference: `PUR-${Math.random().toString(36).substring(7).toUpperCase()}`,
          userId: user.uid
        });

        if (newRole !== memberData.role) {
          await logActivity({
            title: t('upgrade'),
            sub: `Upgraded to ${newRole}`,
            type: 'member',
            description: `Member auto-upgraded due to spending reaching ฿${newSpending.toLocaleString()}`,
            reference: `UPG-${memberDoc.id.substring(0, 8).toUpperCase()}`,
            userId: user.uid
          });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'purchase_item');
    }
  };

  const upgradeTier = async (newRole: string, cost: number) => {
    if (!user || !user.email) return;

    try {
      const q = query(collection(db, 'members'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const memberDoc = querySnapshot.docs[0];
        const memberData = memberDoc.data() as Member;
        const currentSpending = memberData.spending || 0;
        
        await updateDoc(doc(db, 'members', memberDoc.id), {
          spending: currentSpending + cost,
          role: newRole,
          // Force admin back if they were an admin
          isAdmin: memberData.isAdmin || user.email === 'noppanun47@gmail.com'
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'upgrade_tier');
    }
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
      activities,
      addMember, 
      updateMember,
      updateProfileData,
      deleteMember,
      bulkAddMembers,
      exportMembers,
      user,
      isAdmin,
      currentMember,
      loading,
      signIn,
      signInWithEmail,
      signUpWithEmail,
      logout,
      purchaseItem,
      upgradeTier,
      logActivity
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
