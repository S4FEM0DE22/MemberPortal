import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, BadgeCheck, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Left Side: Hero/Branding (Shared with Login) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-primary relative overflow-hidden items-center justify-center p-8">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069"
            alt="Collaboration space"
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
          <h2 className="font-heading text-3xl font-semibold mb-4 text-white">เริ่มต้นการเดินทางของคุณ</h2>
          <p className="text-lg opacity-90 leading-relaxed mb-8">
            สมัครสมาชิกเพื่อเข้าถึงฟีเจอร์ระดับพรีเมียม สั่งสมคอนเนคชัน และเติบโตไปพร้อมกับชุมชนมืออาชีพของเรา
          </p>
          <ul className="space-y-4">
            {[
              "เข้าถึงแดชบอร์ดส่วนตัว",
              "ระบบจัดการสมาชิกอัจฉริยะ",
              "สิทธิพิเศษและส่วนลดกิจกรรม",
              "รับการแจ้งเตือนแบบเรียลไทม์"
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-12 bg-mesh overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[480px] my-auto"
        >
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <BadgeCheck className="w-8 h-8 fill-white text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-primary">MemberPortal</h1>
          </div>

          <div className="bg-surface-container border border-outline-variant p-8 md:p-10 rounded-2xl shadow-sm">
            <header className="mb-8">
              <h2 className="font-heading text-2xl font-bold mb-1 text-on-surface">สมัครสมาชิกใหม่</h2>
              <p className="text-sm text-on-surface-variant">สร้างบัญชีของคุณเพื่อเริ่มต้นใช้งาน</p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="fullName">ชื่อ-นามสกุล</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-outline"
                    id="fullName"
                    placeholder="กรอกชื่อ-นามสกุลของคุณ"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="email">อีเมล</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-outline"
                    id="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="password">รหัสผ่าน</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-outline"
                    id="password"
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
                <p className="text-[10px] text-on-surface-variant mt-1">รหัสผ่านต้องมีความยาวสัญลักษณ์ 8 ตัวขึ้นไป</p>
              </div>

              <div className="flex items-start gap-3 cursor-pointer group mt-2">
                <input
                  className="h-5 w-5 mt-0.5 cursor-pointer rounded border border-outline-variant accent-primary focus:ring-primary bg-surface"
                  id="agree"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  type="checkbox"
                  required
                />
                <label className="text-[13px] text-on-surface-variant cursor-pointer leading-snug" htmlFor="agree">
                  ฉันยอมรับ <Link to="#" className="text-primary font-semibold hover:underline">ข้อตกลงการใช้งาน</Link> และ <Link to="#" className="text-primary font-semibold hover:underline">นโยบายความเป็นส่วนตัว</Link>
                </label>
              </div>

              <button 
                className="group relative flex items-center justify-center w-full bg-primary text-on-primary py-3.5 rounded-xl font-semibold hover:bg-primary-container active:scale-[0.98] transition-all shadow-md shadow-primary/10 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={!agreed}
              >
                <span>สร้างบัญชี</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col items-center gap-6">
              <p className="text-sm text-on-surface-variant">
                มีบัญชีอยู่แล้วใช่ไหม? <Link to="/login" className="text-primary font-bold hover:underline">เข้าสู่ระบบที่นี่</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
