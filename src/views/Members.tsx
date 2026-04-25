import React, { useState, useRef } from 'react';
import { Search, UserPlus, Filter, MoreVertical, Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';

interface Member {
  name: string;
  role: string;
  status: string;
  email: string;
  joinDate: string;
  avatar: string;
}

const INITIAL_MEMBERS: Member[] = [
  { name: 'Sarah Jenkins', role: 'Premium Gold', status: 'Active', email: 'sarah.j@example.com', joinDate: '2022-10-12', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { name: 'David Miller', role: 'Professional', status: 'Pending', email: 'd.miller@company.com', joinDate: '2023-01-05', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { name: 'Emily Watson', role: 'Platinum', status: 'Active', email: 'emily.w@membership.io', joinDate: '2021-09-20', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { name: 'Alex Thompson', role: 'Platinum', status: 'Active', email: 'alex.t@member.net', joinDate: '2021-10-14', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9oFhmFaa1uZBlTYMdM_doiRJ-D_1BT1K8HBEtU1uP3Rsffzr2uJ3_XzEBQfuCDX8aem149cLYHiUgcfVtFm9LfULHbm7qnZUjBdpo_bWxIhEZuuEjsBJllfYoWLtG-n-N7NpFZlDo9l-K16wrFggc6ip4xZ0C9Qpa76Gntr9Wb7d_nuB_RwoPfJFy3qniXF9_XXB-7oz6uu7VzZTesvjtdpzkTDdO66mOOZwrT_gvr8PPcowHjH2nQILam5V77pO20QZexzsUtxag' },
];

export default function Members() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setImportError('กรุณาอัปโหลดไฟล์ CSV เท่านั้น');
      return;
    }

    setImportError(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const newMembers = results.data.map((row: any) => ({
          name: row.name || row.Name || 'ไม่ระบุชื่อ',
          role: row.role || row.Role || 'Standard',
          status: row.status || row.Status || 'Active',
          email: row.email || row.Email || '',
          joinDate: new Date().toISOString().split('T')[0],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || 'U')}&background=random`
        }));

        if (newMembers.length === 0) {
          setImportError('ไม่พบข้อมูลในไฟล์ CSV');
          return;
        }

        setMembers(prev => [...newMembers, ...prev]);
        setIsImporting(false);
      },
      error: (error) => {
        setImportError(`เกิดข้อผิดพลาดในการอ่านไฟล์: ${error.message}`);
      }
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-on-surface">รายชื่อสมาชิก</h1>
          <p className="text-on-surface-variant mt-1">จัดการและตรวจสอบสมาชิกทั้งหมดในระบบ</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsImporting(true)}
            className="px-6 py-2.5 border border-outline-variant rounded-xl bg-surface-container text-on-surface font-bold flex items-center justify-center gap-2 hover:bg-on-surface/5 transition-all shadow-sm"
          >
            <Upload className="w-5 h-5" />
            นำเข้า CSV
          </button>
          <button className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20">
            <UserPlus className="w-5 h-5" />
            เชิญสมาชิก
          </button>
        </div>
      </header>

      {/* Import Modal */}
      <AnimatePresence>
        {isImporting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-container rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative border border-outline-variant/30"
            >
              <button 
                onClick={() => { setIsImporting(false); setImportError(null); }}
                className="absolute right-6 top-6 p-2 hover:bg-on-surface/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-outline" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
                <h2 className="text-2xl text-on-surface font-heading">นำเข้าไฟล์สมาชิก</h2>
                <p className="text-on-surface-variant mt-2">อัปโหลดไฟล์ CSV เพื่อเพิ่มสมาชิกหลายคนพร้อมกัน</p>
              </div>

              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-primary bg-primary/10' 
                    : 'border-outline-variant hover:border-primary/50 hover:bg-on-surface/5'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".csv"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
                <Upload className={`w-10 h-10 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-on-surface-variant'}`} />
                <p className="font-bold text-on-surface">คลิกเพื่ออัปโหลด หรือลากไฟล์มาที่นี่</p>
                <p className="text-xs text-on-surface-variant mt-2">รองรับไฟล์รูปแบบ .csv เท่านั้น</p>
              </div>

              {importError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{importError}</p>
                </motion.div>
              )}

              <div className="mt-8 pt-6 border-t border-outline-variant/10 flex gap-4">
                <button 
                  onClick={() => { setIsImporting(false); setImportError(null); }}
                  className="flex-1 py-3 bg-on-surface/5 text-on-surface font-bold rounded-xl hover:bg-on-surface/10 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ, อีเมล หรือรหัสสมาชิก..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
          />
        </div>
        <button className="px-6 py-3 border border-outline-variant rounded-xl bg-surface-container text-on-surface font-semibold flex items-center justify-center gap-2 hover:bg-on-surface/5 transition-colors shadow-sm">
          <Filter className="w-5 h-5" />
          ตัวกรอง
        </button>
      </div>

      {/* Table Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container border border-outline-variant/30 rounded-[2rem] shadow-sm overflow-x-auto"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-on-surface/5 border-b border-outline-variant/10">
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">สมาชิก</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">ระดับ</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">สถานะ</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">วันที่เข้าร่วม</th>
              <th className="px-6 py-4 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {members.map((member, idx) => (
              <tr key={`${member.email}-${idx}`} className="hover:bg-on-surface/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} className="w-10 h-10 rounded-full object-cover border border-outline-variant/10" />
                    <div>
                      <p className="text-sm font-bold text-on-surface">{member.name}</p>
                      <p className="text-xs text-on-surface-variant font-medium">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-on-surface">{member.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    member.status.toLowerCase() === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {member.status.toLowerCase() === 'active' ? 'ออนไลน์' : 'รอดำเนินการ'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{member.joinDate}</td>
                <td className="px-6 py-4 text-center">
                  <button className="p-2 hover:bg-on-surface/10 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-on-surface-variant" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

