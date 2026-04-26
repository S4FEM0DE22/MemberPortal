import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Search, UserPlus, Filter, MoreVertical, Upload, FileSpreadsheet, X, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ArrowUpDown, BadgeCheck, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useApp, Member } from '../context/AppContext';
import { ALL_ROLES, TIER_BENEFITS, TIER_COLORS } from '../constants';

type SortKey = 'name' | 'role' | 'status' | 'joinDate' | 'category';
type SortDirection = 'asc' | 'desc' | null;

const CATEGORIES = ['volunteers', 'committee_members', 'event_attendees', 'other', 'donors', 'general'];

export default function Members() {
  const { t, members, addMember, updateMember, deleteMember, bulkAddMembers, exportMembers, bulkDeleteMembers, bulkUpdateMemberStatus } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState<Member | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'name', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { filter?: string };
    if (state?.filter) {
      if (state.filter === 'Active' || state.filter === 'Pending' || state.filter === 'Suspended') {
        setStatusFilter(state.filter);
      } else if (ALL_ROLES.includes(state.filter)) {
        setRoleFilter(state.filter);
      } else {
        setSearchQuery(state.filter);
      }
    }

    const hasActionableState = state && Object.keys(state).length > 0;
    if (hasActionableState) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !editForm.id) return;
    await updateMember(editForm.id, editForm);
    setIsEditing(false);
    setSelectedMember(editForm);
    toast.success(t('profile_updated') || 'อัปเดตโปรไฟล์แล้ว');
  };

  const handleSuspend = async (member: Member) => {
    if (!member.id) return;
    const newStatus = member.status === 'Suspended' ? 'Active' : 'Suspended';
    await updateMember(member.id, { status: newStatus });
    setSelectedMember({ ...member, status: newStatus });
  };

  const handleApprove = async (member: Member) => {
    if (!member.id) return;
    await updateMember(member.id, { status: 'Active' });
    setSelectedMember({ ...member, status: 'Active' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('are_you_sure'))) return;
    await deleteMember(id);
    setSelectedMember(null);
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(t('are_you_sure'))) return;
    await bulkDeleteMembers(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedIds.length === 0) return;
    setIsUpdatingStatus(true);
    try {
      await bulkUpdateMemberStatus(selectedIds, status);
      setSelectedIds([]);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMembers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMembers.map(m => m.id!).filter(Boolean));
    }
  };

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    if (members.length === 0) return;
    const csv = Papa.unparse(members);
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

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const filteredMembers = useMemo(() => {
    let result = members.filter(m => {
      const q = searchQuery.toLowerCase();
      // If searchQuery is "all", we don't want to filter by it as a string
      const matchesSearch = q === '' || q === 'all' || 
                           m.name?.toLowerCase().includes(q) || 
                           m.email?.toLowerCase().includes(q) || 
                           m.role?.toLowerCase().includes(q) ||
      (m.address?.toLowerCase().includes(q) || false);
      
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      
      let matchesRole = roleFilter === 'All';
      if (roleFilter === 'Admin') {
        matchesRole = m.isAdmin === true;
      } else if (roleFilter !== 'All') {
        matchesRole = m.role === roleFilter;
      }

      const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesRole && matchesCategory;
    });

    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const valA = (a[sortConfig.key] || '').toLowerCase();
        const valB = (b[sortConfig.key] || '').toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [members, searchQuery, statusFilter, roleFilter, categoryFilter, sortConfig]);

  const rolesSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    let adminCount = 0;
    members.forEach(m => {
      counts[m.role] = (counts[m.role] || 0) + 1;
      if (m.isAdmin) adminCount++;
    });
    
    // Ensure all defined roles show up even if 0, plus any others that exist
    const allKnownRoles = Array.from(new Set([
      ...ALL_ROLES.filter(r => r !== 'Admin'), 
      ...Object.keys(counts).filter(k => k !== 'Admin')
    ])).sort();
    
    return [
      { role: 'Total', count: members.length, isTotal: true },
      { role: 'Admin', count: adminCount, isAdminSection: true },
      ...allKnownRoles.map(role => ({
        role,
        count: counts[role] || 0,
        isTotal: false
      }))
    ];
  }, [members, t]);

  const roles = useMemo(() => rolesSummary.map(r => r.isTotal ? 'All' : r.role), [rolesSummary]);

  const generateRandomMembers = async () => {
    const firstNames = ['Somchai', 'Somsak', 'Wichai', 'Anong', 'Kanya', 'Arthit', 'Boondee', 'Chaiya', 'Duangchai', 'Ekkachai', 'Fah', 'Gunn', 'Hansa', 'Itthipol', 'Jirayu'];
    const lastNames = ['Sae-Lee', 'Rakthai', 'Vichit', 'Suksombut', 'Thongdee', 'Jaidee', 'Wattana', 'Pongsak', 'Manee', 'Sarttra', 'Boonmee', 'Srisuwan'];
    const possibleRoles = ALL_ROLES.filter(r => r !== 'Admin');
    const categories = ['volunteers', 'committee_members', 'event_attendees', 'donors', 'general'];

    const newRandomMembers: Member[] = Array.from({ length: 10 }).map(() => {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${fn} ${ln}`;
      const spending = Math.floor(Math.random() * 200000);
      
      // Determine role based on spending to keep it consistent with auto-upgrade logic
      let role = 'Standard';
      if (spending >= 150000) role = 'Legend';
      else if (spending >= 75000) role = 'Founder';
      else if (spending >= 35000) role = 'Diamond';
      else if (spending >= 15000) role = 'Platinum';
      else if (spending >= 5000) role = 'Gold';
      else if (spending >= 1000) role = 'Silver';

      return {
        name,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(Math.random() * 9999)}@example.com`,
        role,
        spending,
        category: categories[Math.floor(Math.random() * categories.length)],
        status: Math.random() > 0.1 ? 'Active' : 'Pending',
        joinDate: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString().split('T')[0], // Within last year
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&bold=true`
      };
    });

    try {
      await bulkAddMembers(newRandomMembers);
      toast.success(t('import_success') || 'เพิ่มสมาชิกสำเร็จ');
    } catch (e: any) {
      toast.error(`Failed to add random members: ${e.message}`);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setImportError(t('error_csv_only'));
      return;
    }

    setImportError(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const newMembers = results.data.map((row: any) => ({
          name: row.name || row.Name || t('unspecified_name'),
          role: row.role || row.Role || 'Standard',
          status: row.status || row.Status || 'Active',
          category: row.category || row.Category || 'Other',
          email: row.email || row.Email || '',
          joinDate: new Date().toISOString().split('T')[0],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || row.Name || 'U')}&background=random`
        }));

        if (newMembers.length === 0) {
          setImportError(t('error_csv_empty'));
          return;
        }

        await bulkAddMembers(newMembers);
        setIsImporting(false);
        toast.success(t('import_success') || 'นำเข้าสำเร็จ');
      },
      error: (error) => {
        setImportError(`${t('error_csv_read')}: ${error.message}`);
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
    <div className="space-y-8 pb-20">
      {/* Bulk actions float bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex flex-col md:flex-row items-center gap-4 bg-surface-container border border-outline px-6 py-4 rounded-3xl shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-black text-on-surface uppercase tracking-widest whitespace-nowrap">
                {selectedIds.length} {t('members')}
              </span>
              <div className="h-6 w-px bg-outline/30 mx-2 hidden md:block" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button 
                disabled={isUpdatingStatus}
                onClick={() => handleBulkStatusUpdate('Active')}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                {t('active')}
              </button>
              <button 
                disabled={isUpdatingStatus}
                onClick={() => handleBulkStatusUpdate('Pending')}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 active:scale-95"
              >
                {t('pending')}
              </button>
              <button 
                disabled={isUpdatingStatus}
                onClick={() => handleBulkStatusUpdate('Suspended')}
                className="bg-slate-500 hover:bg-slate-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-500/20 active:scale-95"
              >
                {t('suspend_member')}
              </button>
              
              <div className="h-6 w-px bg-outline/30 mx-2" />
              
              <button 
                disabled={isUpdatingStatus}
                onClick={handleBulkDelete}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                {t('delete_member')}
              </button>
              
              <div className="h-6 w-px bg-outline/30 mx-2" />

              <button 
                disabled={isUpdatingStatus}
                onClick={() => setSelectedIds([])}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-12">
            <div className="space-y-1 sm:space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-primary rounded-full" />
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{t('administration')}</p>
              </div>
              <h1 className="text-4xl md:text-5xl text-on-surface font-heading font-extrabold tracking-tight underline decoration-primary/20 decoration-8 underline-offset-8 lowercase first-letter:uppercase">{t('member_list')}</h1>
              <p className="text-on-surface-variant font-medium mt-6 max-w-md">{t('manage_members')}</p>
            </div>
            <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2 sm:gap-3">
          <button 
            onClick={generateRandomMembers}
            className="px-4 py-2.5 sm:px-6 sm:py-3 border border-outline rounded-xl sm:rounded-2xl bg-surface-container text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-on-surface flex items-center justify-center gap-2 sm:gap-3 hover:bg-on-surface/5 transition-all shadow-sm active:scale-95 group"
          >
            <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            <span>{t('generate_random')}</span>
          </button>
          <button 
            onClick={() => setIsImporting(true)}
            className="px-4 py-2.5 sm:px-6 sm:py-3 border border-outline rounded-xl sm:rounded-2xl bg-surface-container text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-on-surface flex items-center justify-center gap-2 sm:gap-3 hover:bg-on-surface/5 transition-all shadow-sm active:scale-95 group"
          >
            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            {t('import_csv')}
          </button>
          <button 
            onClick={exportMembers}
            className="px-4 py-2.5 sm:px-6 sm:py-3 border border-outline rounded-xl sm:rounded-2xl bg-surface-container text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-on-surface flex items-center justify-center gap-2 sm:gap-3 hover:bg-on-surface/5 transition-all shadow-sm active:scale-95 group col-span-2 grow sm:grow-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            <span>{t('export_report')}</span>
          </button>
        </div>
      </header>

      {/* Roles Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-8">
        {rolesSummary.map((item) => {
          const isSelected = item.isTotal ? roleFilter === 'All' : roleFilter === item.role;
          return (
            <motion.button
              whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.96 }}
              key={item.role}
              onClick={() => setRoleFilter(item.isTotal ? 'All' : (item.role === roleFilter ? 'All' : item.role))}
              className={`p-6 rounded-[2rem] border text-left transition-all w-full h-full group ${
                item.isTotal ? 'col-span-2 sm:col-span-1' : ''
              } ${
                isSelected 
                  ? 'bg-primary border-primary shadow-2xl shadow-primary/20' 
                  : 'bg-surface-container border-outline hover:border-primary/40 shadow-sm'
              }`}
            >
              <div className="flex flex-col justify-between h-full space-y-4">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                  isSelected ? 'text-on-primary/70' : 'text-on-surface-variant opacity-40 group-hover:opacity-100 transition-opacity'
                }`}>
                  {item.isTotal ? t('total_members') : (t(item.role.toLowerCase()) || item.role)}
                </p>
                <p className={`text-3xl font-black font-mono tracking-tighter tabular-nums ${
                  isSelected ? 'text-on-primary' : 'text-on-surface'
                }`}>
                  {item.count.toLocaleString()}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface-container rounded-[2rem] w-full max-w-lg p-6 sm:p-10 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute right-6 top-6 p-2 hover:bg-on-surface/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-outline" />
              </button>

                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <img src={selectedMember.avatar} className="w-32 h-32 rounded-full border-4 border-surface shadow-xl" alt={selectedMember.name} />
                    <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-surface shadow-sm ${
                      selectedMember.status?.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-outline-variant'
                    }`} />
                  </div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl text-on-surface font-heading">{selectedMember.name}</h2>
                    <div className={`w-3 h-3 rounded-full ${selectedMember.status?.toLowerCase() === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-outline-variant'}`} />
                  </div>
                  <p className="text-on-surface-variant font-medium mt-1">{selectedMember.email}</p>
                
                <div className="flex gap-2 mt-4">
                  {selectedMember.isAdmin && (
                    <span className="px-4 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-500/20 shadow-sm">
                      {t('admin')}
                    </span>
                  )}
                  <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    {t(selectedMember.role.toLowerCase()) || selectedMember.role}
                  </span>
                  <span className="px-4 py-1 bg-on-surface/5 text-on-surface rounded-full text-[10px] font-black uppercase tracking-widest border border-outline-variant/30">
                    {t(selectedMember.category)}
                  </span>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    selectedMember.status?.toLowerCase() === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                  }`}>
                    {selectedMember.status?.toLowerCase() === 'active' ? t('online') : t('pending')}
                  </span>
                </div>

                <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-outline-variant/10">
                  <div className="bg-on-surface/5 p-4 rounded-2xl text-left">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{t('join_date')}</p>
                    <p className="text-sm font-bold text-on-surface">{selectedMember.joinDate}</p>
                  </div>
                  <div className="bg-on-surface/5 p-4 rounded-2xl text-left">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{t('phone_number')}</p>
                    <p className="text-sm font-bold text-on-surface">{selectedMember.phone || '-'}</p>
                  </div>
                  <div className="bg-on-surface/5 p-4 rounded-2xl text-left col-span-2">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{t('address')}</p>
                    <p className="text-sm font-bold text-on-surface break-words">{selectedMember.address || '-'}</p>
                  </div>
                  <div className="bg-on-surface/5 p-4 rounded-2xl text-left col-span-2">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{t('member_id')}</p>
                    <p className="text-sm font-bold text-on-surface">MEM-{selectedMember.id?.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="w-full mt-6 space-y-4">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 text-left px-1">Tier Benefits</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TIER_BENEFITS[selectedMember.role]?.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 bg-on-surface/5 rounded-xl border border-outline-variant/30">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-on-surface-variant">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full mt-8 flex flex-col gap-3">
                  <div className="flex gap-4">
                    {selectedMember.status === 'Pending' && (
                      <button 
                        onClick={() => handleApprove(selectedMember)}
                        className="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        {t('approve_member')}
                      </button>
                    )}
                    <button 
                      onClick={() => { setEditForm(selectedMember); setIsEditing(true); }}
                      className="flex-1 py-3 border border-outline-variant rounded-xl text-sm font-bold text-on-surface hover:bg-on-surface/5 transition-all"
                    >
                      {t('edit_info')}
                    </button>
                    <button 
                      onClick={() => handleSuspend(selectedMember)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                        selectedMember.status === 'Suspended' 
                          ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                          : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
                      }`}
                    >
                      {selectedMember.status === 'Suspended' ? t('unsuspend') : t('suspend_member')}
                    </button>
                  </div>
                  <button 
                    onClick={() => handleDelete(selectedMember.id!)}
                    className="w-full py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    {t('delete_member')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && editForm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface-container rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute right-6 top-6 p-2 hover:bg-on-surface/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-outline" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl text-on-surface font-heading">{t('edit_info')}</h2>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('full_name')}</label>
                  <input 
                    required
                    value={editForm.name}
                    onChange={e => setEditForm(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('email')}</label>
                  <input 
                    required
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('phone_number')}</label>
                  <input 
                    value={editForm.phone || ''}
                    onChange={e => setEditForm(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface outline-none transition-all" 
                    placeholder="+66 81 234 5678"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('address')}</label>
                  <input 
                    value={editForm.address || ''}
                    onChange={e => setEditForm(prev => prev ? ({ ...prev, address: e.target.value }) : null)}
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface outline-none transition-all" 
                    placeholder="123 Sukhumvit, Bangkok"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('member_tier')}</label>
                    <select 
                      value={editForm.role}
                      onChange={e => setEditForm(prev => prev ? ({ ...prev, role: e.target.value }) : null)}
                      className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface outline-none transition-all"
                    >
                      {ALL_ROLES.map(role => (
                        <option key={role} value={role}>{t(role.toLowerCase()) || role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('category')}</label>
                    <select 
                      value={editForm.category}
                      onChange={e => setEditForm(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                      className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface outline-none transition-all"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{t(cat) || cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-on-surface/5 rounded-xl border border-outline-variant hover:border-primary/50 transition-all">
                    <input 
                      type="checkbox"
                      checked={editForm.isAdmin}
                      onChange={e => setEditForm(prev => prev ? ({ ...prev, isAdmin: e.target.checked }) : null)}
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-bold text-on-surface uppercase tracking-widest">{t('grant_admin')}</span>
                  </label>
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 bg-on-surface/5 text-on-surface font-bold rounded-xl hover:bg-on-surface/10 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container transition-colors shadow-lg shadow-primary/20"
                  >
                    {t('save_changes')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {isImporting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsImporting(false); setImportError(null); }}
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface-container rounded-[2rem] w-full max-w-lg p-8 shadow-2xl border border-outline-variant/30"
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
                <h2 className="text-2xl text-on-surface font-heading">{t('import_members')}</h2>
                <p className="text-on-surface-variant mt-2">{t('import_desc')}</p>
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
                <p className="font-bold text-on-surface">{t('click_upload')}</p>
                <p className="text-xs text-on-surface-variant mt-2 font-medium">{t('csv_format')}</p>
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
                  className="flex-1 py-3 bg-on-surface/5 text-on-surface font-bold rounded-xl hover:bg-on-surface/10 transition-colors active:scale-95"
                >
                  {t('cancel')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4 sm:w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')} 
              className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 rounded-xl border border-outline-variant bg-surface-container text-xs sm:text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <X className="w-3.5 h-3.5 sm:w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 border rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
              showFilters ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container text-on-surface border-outline-variant hover:bg-on-surface/5'
            }`}
          >
            <Filter className="w-4 h-4 sm:w-5 h-5" />
            <span>{t('filters')}</span>
            {(statusFilter !== 'All' || roleFilter !== 'All' || categoryFilter !== 'All') && (
              <span className="ml-1 w-2 h-2 bg-on-primary rounded-full" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-surface-container border border-outline-variant/30 rounded-2xl flex flex-wrap gap-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">{t('status')}</p>
                  <div className="flex gap-2">
                    {['All', 'Active', 'Pending'].map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          statusFilter === status 
                            ? 'bg-primary text-on-primary' 
                            : 'bg-on-surface/5 text-on-surface hover:bg-on-surface/10'
                        }`}
                      >
                        {status === 'All' ? t('all') : status === 'Active' ? t('online') : t('pending')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">{t('member_tier')}</p>
                  <div className="flex flex-wrap gap-2">
                    {roles.map(role => (
                      <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          roleFilter === role 
                            ? 'bg-primary text-on-primary' 
                            : 'bg-on-surface/5 text-on-surface hover:bg-on-surface/10'
                        }`}
                      >
                        {role === 'All' ? t('all') : role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">{t('category')}</p>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...CATEGORIES].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          categoryFilter === cat 
                            ? 'bg-primary text-on-primary' 
                            : 'bg-on-surface/5 text-on-surface hover:bg-on-surface/10'
                        }`}
                      >
                        {cat === 'All' ? t('all') : cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ml-auto self-end">
                  <button 
                    onClick={() => { setStatusFilter('All'); setRoleFilter('All'); setCategoryFilter('All'); }}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    {t('clear_filters')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-container border border-outline rounded-[2rem] sm:rounded-[3rem] shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1000px] lg:min-w-0">
            <thead>
              <tr className="bg-on-surface/[0.01] border-b border-outline/50">
                <th className="px-8 py-6 w-12">
                   <div className="flex items-center justify-center">
                     <button 
                       onClick={toggleSelectAll}
                       className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                         selectedIds.length === filteredMembers.length && filteredMembers.length > 0
                           ? 'bg-primary border-primary' 
                           : 'border-outline hover:border-primary'
                       }`}
                     >
                       {selectedIds.length === filteredMembers.length && filteredMembers.length > 0 && (
                         <motion.div 
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           className="w-2.5 h-2.5 bg-white rounded-[2px]"
                         />
                       )}
                     </button>
                   </div>
                </th>
                {[
                  { key: 'name', label: t('member') },
                  { key: 'role', label: t('member_tier') },
                  { key: 'category', label: t('category') },
                  { key: 'status', label: t('status') },
                  { key: 'joinDate', label: t('join_date') }
                ].map(({ key, label }) => (
                  <th 
                    key={key}
                    onClick={() => handleSort(key as SortKey)}
                    className="px-8 py-6 cursor-pointer hover:bg-on-surface/[0.03] transition-colors group relative"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-all">
                      {label}
                      <ArrowUpDown className={`w-3.5 h-3.5 transition-all ${sortConfig.key === key ? 'opacity-100 text-primary scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
                    </div>
                  </th>
                ))}
                <th className="px-8 py-6 text-center text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 + 0.3 }}
                    key={member.id || idx}
                    onClick={() => setSelectedMember(member)}
                    className={`hover:bg-on-surface/[0.02] transition-colors group cursor-pointer relative ${
                      selectedIds.includes(member.id!) ? 'bg-primary/[0.03]' : ''
                    }`}
                  >
                    <td className="px-8 py-6 w-12">
                       <div className="flex items-center justify-center">
                         <button 
                           onClick={(e) => member.id && toggleSelect(e, member.id)}
                           className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                             selectedIds.includes(member.id!)
                               ? 'bg-primary border-primary' 
                               : 'border-outline group-hover:border-primary'
                           }`}
                         >
                           {selectedIds.includes(member.id!) && (
                             <motion.div 
                               initial={{ scale: 0 }}
                               animate={{ scale: 1 }}
                               className="w-2.5 h-2.5 bg-white rounded-[2px]"
                             />
                           )}
                         </button>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="relative group/av">
                          <img 
                            src={member.avatar} 
                            className="w-12 h-12 rounded-2xl object-cover border border-outline shadow-md group-hover/av:shadow-xl transition-all duration-500 group-hover:scale-105" 
                            alt={member.name} 
                          />
                          {member.status === 'Active' && (
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-surface shadow-sm shadow-emerald-500/50" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-on-surface group-hover:text-primary transition-colors leading-tight tracking-tight">{member.name}</p>
                            {member.isAdmin && (
                              <BadgeCheck className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                            )}
                          </div>
                          <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.1em] opacity-40 truncate max-w-[150px]">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/[0.03] text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/10">
                        {member.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 border border-outline px-3 py-1 bg-on-surface/[0.02] rounded-xl hover:opacity-80 transition-opacity">
                        {t(member.category?.toLowerCase()) || member.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border ${
                        member.status?.toLowerCase() === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          member.status?.toLowerCase() === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-current'
                        }`} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{member.status?.toLowerCase() === 'active' ? t('online') : t('pending')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[11px] font-mono font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 tabular-nums">{member.joinDate}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button className="p-3 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all border border-outline shadow-sm active:scale-95 group/btn">
                        <MoreVertical className="w-4 h-4 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="h-24 w-24 rounded-[2rem] bg-on-surface/[0.02] border border-outline flex items-center justify-center rotate-12">
                        <Search className="w-10 h-10 text-on-surface-variant/20 -rotate-12" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-on-surface font-black text-2xl font-heading uppercase tracking-[0.1em]">{t('query_null')}</p>
                        <p className="text-on-surface-variant text-xs font-black uppercase tracking-[0.2em] opacity-40">Zero Member Correlation Analysis Failure.</p>
                      </div>
                      <button 
                        onClick={() => { setSearchQuery(''); setStatusFilter('All'); setRoleFilter('All'); setCategoryFilter('All'); }}
                        className="px-8 py-3.5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95"
                      >
                         {t('clear_all_filters')}
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

