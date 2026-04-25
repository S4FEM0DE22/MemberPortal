import { useState } from 'react';
import { Sliders, Shield, AlertTriangle, Info, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { theme, toggleTheme, language, setLanguage, t } = useApp();
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header>
        <h1 className="text-4xl text-on-surface">{t('settings')}</h1>
        <p className="text-on-surface-variant mt-2">จัดการการตั้งค่าบัญชีและความปลอดภัยของคุณ</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Preferences Section View */}
        <section className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container border border-outline-variant rounded-2xl p-8 shadow-sm"
          >
            <h3 className="text-xl text-on-surface mb-8 flex items-center gap-3">
              <Sliders className="text-primary w-6 h-6" />
              {t('appearance')}
            </h3>
            
            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between pb-6 border-b border-outline-variant/30">
                <div>
                  <p className="text-sm font-bold text-on-surface">{t('dark_mode')}</p>
                  <p className="text-xs text-on-surface-variant">{t('dark_mode_desc')}</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`relative w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-outline-variant/30'}`}
                >
                  <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              {/* Language Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-outline-variant/30 gap-4">
                <div>
                  <p className="text-sm font-bold text-on-surface">{t('language_label')}</p>
                  <p className="text-xs text-on-surface-variant">{t('language_desc')}</p>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="px-4 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-primary w-full sm:w-48 outline-none"
                >
                  <option value="en">English (US)</option>
                  <option value="th">ไทย</option>
                </select>
              </div>

              {/* Toggles Group */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-on-surface">การแจ้งเตือนแบบพุช</p>
                    <p className="text-xs text-on-surface-variant">รับการแจ้งเตือนบนอุปกรณ์ของคุณ</p>
                  </div>
                  <button 
                    onClick={() => setPushNotif(!pushNotif)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${pushNotif ? 'bg-primary' : 'bg-outline-variant/30'}`}
                  >
                    <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${pushNotif ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-on-surface">การแจ้งเตือนทางอีเมล</p>
                    <p className="text-xs text-on-surface-variant">สรุปและอัปเดตรายสัปดาห์</p>
                  </div>
                  <button 
                    onClick={() => setEmailNotif(!emailNotif)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${emailNotif ? 'bg-primary' : 'bg-outline-variant/30'}`}
                  >
                    <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${emailNotif ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Update Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container border border-outline-variant rounded-2xl p-8 shadow-sm"
          >
            <h3 className="text-xl text-on-surface mb-8 flex items-center gap-3">
              <Shield className="text-primary w-6 h-6" />
              ความปลอดภัย
            </h3>
            <form className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-outline uppercase tracking-widest block ml-1">รหัสผ่านปัจจุบัน</label>
                <input className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="••••••••" type="password" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest block ml-1">รหัสผ่านใหม่</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="รหัสผ่านใหม่" type="password" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest block ml-1">ยืนยันรหัสผ่านใหม่</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="ยืนยันรหัสผ่าน" type="password" />
                </div>
              </div>
              <div className="pt-4">
                <button className="bg-primary hover:bg-primary-container text-white font-bold px-8 py-3 rounded-xl active:scale-95 transition-all shadow-sm shadow-primary/20" type="submit">
                  อัปเดตรหัสผ่าน
                </button>
              </div>
            </form>
          </motion.div>
        </section>

        {/* Danger Zone Aside Panel */}
        <section className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 sticky top-24"
          >
            <h3 className="text-xl text-red-600 dark:text-red-400 mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              โซนอันตราย
            </h3>
            <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
              เมื่อคุณลบบัญชีแล้ว จะไม่สามารถย้อนกลับได้ โปรดแน่ใจก่อนดำเนินการ
            </p>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-3 px-6 border-2 border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:hover:text-black transition-all active:scale-95"
            >
              ลบบัญชี
            </button>

            {/* Account Meta Stats */}
            <div className="mt-12 pt-8 border-t border-outline-variant/10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center shadow-sm">
                  <Info className="text-on-surface-variant w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">ระดับสมาชิก</p>
                  <p className="text-sm font-bold text-on-surface">Premium Gold</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center shadow-sm">
                  <Calendar className="text-on-surface-variant w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">เป็นสมาชิกตั้งแต่</p>
                  <p className="text-sm font-bold text-on-surface">ตุลาคม 2022</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container border border-outline-variant/30 rounded-[2rem] max-w-md w-full shadow-2xl p-8"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl text-on-surface mb-4">คุณแน่ใจหรือไม่?</h2>
            <p className="text-on-surface-variant mb-8">
              การดำเนินการนี้ไม่สามารถย้อนกลับได้ ซึ่งจะลบบัญชีของคุณอย่างถาวรและนำข้อมูลของคุณออกจากเซิร์ฟเวอร์ของเรา
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl font-bold bg-on-surface/5 text-on-surface hover:bg-on-surface/10 transition-colors"
              >
                ยกเลิก
              </button>
              <button className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">
                ใช่ ลบบัญชี
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
