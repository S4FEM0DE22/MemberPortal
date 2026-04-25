import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, BadgeCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Left Side: Hero/Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-primary relative overflow-hidden items-center justify-center p-8">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgJO6mFsSoDFe73T-wTqUV3QLYMtj0USKMyYkCziI5re5apoLqdEGxFQs53cv7j7suRINZARU8u2Lgn-TgS6zY712rwKPssIGehEEHDLG_T00Yee9YDyh5JvLIdQI9rXO1FWVLtKSKEEA2jIFKv4epMq8tci_cBszkJAtOqCuhUlCzudlgXEcCG7xjlH562VSNl17gKqSuIvAlNaQ9Qgug1wlyO-lRLzeUn2dzoGJyvUnQfOm_QKZClHFie_6fmT7MVEGj_ewUZJ2d"
            alt="Corporate office"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-container/40"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-lg text-on-primary"
        >
          <div className="mb-8 flex items-center gap-2">
            <BadgeCheck className="w-12 h-12 fill-white text-primary" />
            <h1 className="font-heading text-4xl font-extrabold tracking-tight">MemberPortal</h1>
          </div>
          <h2 className="font-heading text-3xl font-semibold mb-4 text-white">ยกระดับเครือข่ายมืออาชีพของคุณ</h2>
          <p className="text-lg opacity-90 leading-relaxed mb-8">
            เข้าถึงแหล่งข้อมูลพิเศษ จัดการสิทธิประโยชน์การเป็นสมาชิก และเชื่อมต่อกับผู้นำในอุตสาหกรรมในสภาพแวดล้อมที่เป็นระบบและมีประสิทธิภาพ
          </p>
          <div className="flex gap-8">
            <div className="flex flex-col gap-1">
              <span className="font-heading text-2xl font-bold">10k+</span>
              <span className="text-xs uppercase tracking-wider opacity-80">สมาชิกที่ใช้งานอยู่</span>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="flex flex-col gap-1">
              <span className="font-heading text-2xl font-bold">500+</span>
              <span className="text-xs uppercase tracking-wider opacity-80">กิจกรรมรายวัน</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-12 bg-mesh">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[440px]"
        >
          {/* Mobile Branding */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <BadgeCheck className="w-8 h-8 fill-white text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-primary">MemberPortal</h1>
          </div>

          <div className="bg-surface-container border border-outline-variant p-8 md:p-10 rounded-2xl shadow-sm">
            <header className="mb-8">
              <h2 className="font-heading text-2xl font-bold mb-1 text-on-surface">ยินดีต้อนรับกลับมา</h2>
              <p className="text-sm text-on-surface-variant">กรุณากรอกรายละเอียดเพื่อเข้าสู่ระบบ</p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="email">อีเมล</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-outline"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-on-surface-variant" htmlFor="password">รหัสผ่าน</label>
                  <Link to="#" className="text-xs font-semibold text-primary hover:underline">ลืมรหัสผ่าน?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-outline"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="h-5 w-5 cursor-pointer rounded border border-outline-variant accent-primary focus:ring-primary bg-surface"
                  id="remember"
                  name="remember"
                  type="checkbox"
                />
                <label className="text-sm text-on-surface-variant cursor-pointer group-hover:text-on-surface transition-colors" htmlFor="remember">
                  จดจำฉันไว้ 30 วัน
                </label>
              </div>

              <button 
                className="group relative flex items-center justify-center w-full bg-primary text-on-primary py-3.5 rounded-xl font-semibold hover:bg-primary-container active:scale-[0.98] transition-all shadow-md shadow-primary/10"
                type="submit"
              >
                <span>เข้าสู่ระบบ</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col items-center gap-6">
              <p className="text-sm text-on-surface-variant">
                ยังไม่มีบัญชีใช่ไหม? <Link to="/register" className="text-primary font-bold hover:underline">สมัครสมาชิกฟรี</Link>
              </p>

              <div className="flex items-center gap-4 w-full">
                <div className="h-px flex-1 bg-outline-variant/30"></div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">หรือดำเนินการต่อด้วย</span>
                <div className="h-px flex-1 bg-outline-variant/30"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-on-surface/5 transition-colors text-on-surface">
                  <img alt="Google" className="w-5 h-5" src="https://www.google.com/favicon.ico" />
                  <span>Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-on-surface/5 transition-colors text-on-surface">
                  <img alt="Microsoft" className="w-5 h-5" src="https://www.microsoft.com/favicon.ico" />
                  <span>Microsoft</span>
                </button>
              </div>
            </div>
          </div>

          <footer className="mt-8 flex justify-center gap-6 text-xs text-outline">
            <Link to="#" className="hover:text-on-surface transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <Link to="#" className="hover:text-on-surface transition-colors">เงื่อนไขการให้บริการ</Link>
            <Link to="#" className="hover:text-on-surface transition-colors">ติดต่อฝ่ายสนับสนุน</Link>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
