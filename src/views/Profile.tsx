import React, { useState, useRef } from 'react';
import { Camera, CheckCircle2, Copy, CreditCard, ChevronRight, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, BellRing, Info, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const [isNewsletter, setIsNewsletter] = useState(true);
  const [isPush, setIsPush] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuC9oFhmFaa1uZBlTYMdM_doiRJ-D_1BT1K8HBEtU1uP3Rsffzr2uJ3_XzEBQfuCDX8aem149cLYHiUgcfVtFm9LfULHbm7qnZUjBdpo_bWxIhEZuuEjsBJllfYoWLtG-n-N7NpFZlDo9l-K16wrFggc6ip4xZ0C9Qpa76Gntr9Wb7d_nuB_RwoPfJFy3qniXF9_XXB-7oz6uu7VzZTesvjtdpzkTDdO66mOOZwrT_gvr8PPcowHjH2nQILam5V77pO20QZexzsUtxag");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-8 bg-surface-container p-8 rounded-2xl shadow-sm border border-outline-variant/30 transition-colors duration-300"
      >
        <div className="relative group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-surface shadow-md bg-on-surface/5">
            <img 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
              src={avatarUrl} 
            />
          </div>
          <button 
            onClick={triggerFileInput}
            className="absolute bottom-1 right-1 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-container transition-colors focus:ring-4 focus:ring-primary/20"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left space-y-3">
          <h1 className="text-3xl text-on-surface">Alex Thompson</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="bg-on-surface/10 text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">สมาชิกแพลตตินัม</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              บัญชีที่ยืนยันแล้ว
            </span>
          </div>
        </div>
      </motion.section>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Personal Details Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-8 bg-surface-container p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-8 transition-colors duration-300"
        >
          <h2 className="text-2xl text-on-surface">ข้อมูลส่วนตัว</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant block ml-1">ชื่อ-นามสกุล</label>
                <input className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface" type="text" defaultValue="Alex Thompson" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant block ml-1">เบอร์โทรศัพท์</label>
                <input className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface" type="tel" defaultValue="+1 (555) 0123-4567" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface-variant block ml-1">อีเมล</label>
              <div className="relative">
                <input className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface pr-12" type="email" defaultValue="alex.thompson@membership.io" />
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5 fill-emerald-500/10" />
              </div>
              <p className="text-xs text-emerald-500 font-bold ml-1">อีเมลได้รับการยืนยันและใช้งานอยู่</p>
            </div>
            <div className="pt-6 border-t border-outline-variant/10 flex flex-wrap gap-4 justify-end">
              <button className="px-8 py-2.5 rounded-full text-sm font-bold text-on-surface-variant border border-outline-variant/30 hover:bg-on-surface/5 active:scale-95 transition-all" type="button">
                ยกเลิก
              </button>
              <button className="px-8 py-2.5 rounded-full text-sm font-bold bg-primary text-on-primary hover:bg-primary-container shadow-md shadow-primary/20 active:scale-95 transition-all" type="submit">
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </form>
        </motion.div>

        {/* Read-only Member Data Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-4 space-y-6"
        >
          {/* Account Details */}
          <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6 transition-colors duration-300">
            <h3 className="text-xl text-on-surface">รายละเอียดบัญชี</h3>
            <div className="space-y-4">
              <div className="p-4 bg-on-surface/5 rounded-xl border border-outline-variant/10">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">รหัสผู้ใช้</label>
                <div className="flex items-center justify-between">
                  <code className="font-mono font-bold text-on-surface text-sm">#MEM-8842-XJ</code>
                  <button className="text-primary hover:scale-110 transition-transform">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-on-surface/5 rounded-xl border border-outline-variant/10">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">เป็นสมาชิกตั้งแต่</label>
                <p className="font-semibold text-on-surface text-sm">14 ตุลาคม 2021</p>
              </div>
              <div className="p-4 bg-on-surface/5 rounded-xl border border-outline-variant/10">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">สถานะบัญชี</label>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <p className="font-semibold text-on-surface text-sm">ใช้งานอยู่</p>
                </div>
              </div>
            </div>
          </div>

          {/* Renewal Alert */}
          <div className="bg-primary/10 border border-primary/20 p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
            <CreditCard className="text-primary w-10 h-10" />
            <p className="text-sm text-on-surface">สมาชิกของคุณจะต่ออายุในอีก <strong className="text-primary">14 วัน</strong></p>
            <button className="w-full py-2.5 bg-surface border border-outline-variant/30 text-primary text-sm font-bold rounded-xl hover:bg-primary/5 transition-colors">
              จัดการแผน
            </button>
          </div>
        </motion.div>
      </div>

      {/* Secondary Settings Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Security Settings Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-container p-8 rounded-2xl border border-outline-variant/30 shadow-sm transition-colors duration-300"
        >
          <h3 className="text-xl text-on-surface mb-6">ความปลอดภัย</h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-4 hover:bg-on-surface/5 rounded-xl transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <Lock className="text-on-surface-variant w-5 h-5" />
                <span className="text-on-surface font-semibold">เปลี่ยนรหัสผ่าน</span>
              </div>
              <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
            </li>
            <li className="flex items-center justify-between p-4 hover:bg-on-surface/5 rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <ShieldCheck className="text-on-surface-variant w-5 h-5" />
                <span className="text-on-surface font-semibold">การยืนยันตัวตนสองชั้น</span>
              </div>
              <span className="text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded uppercase border border-emerald-500/20">เปิดใช้งานแล้ว</span>
            </li>
          </ul>
        </motion.div>

        {/* Communication Preferences Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-container p-8 rounded-2xl border border-outline-variant/30 shadow-sm transition-colors duration-300"
        >
          <h3 className="text-xl text-on-surface mb-6">การสื่อสาร</h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-4 hover:bg-on-surface/5 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <Mail className="text-on-surface-variant w-5 h-5" />
                <span className="text-on-surface font-semibold">การสมัครรับจดหมายข่าว</span>
              </div>
              <button 
                type="button"
                onClick={() => setIsNewsletter(!isNewsletter)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isNewsletter ? 'bg-primary' : 'bg-outline-variant/30'}`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out ${isNewsletter ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </li>
            <li className="flex items-center justify-between p-4 hover:bg-on-surface/5 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <BellRing className="text-on-surface-variant w-5 h-5" />
                <span className="text-on-surface font-semibold">การแจ้งเตือนแบบพุช</span>
              </div>
              <button 
                type="button"
                onClick={() => setIsPush(!isPush)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isPush ? 'bg-primary' : 'bg-outline-variant/30'}`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out ${isPush ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </li>
          </ul>
        </motion.div>
      </section>
    </div>
  );
}

function BadgeCheck({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12a4.49 4.49 0 0 1 1.549-3.397 4.491 4.491 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
  );
}
