import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Search, UserPlus, Filter, MoreVertical, Upload, FileSpreadsheet, X, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp, Member } from '../context/AppContext';

type SortKey = 'name' | 'role' | 'status' | 'joinDate' | 'category';
type SortDirection = 'asc' | 'desc' | null;

const CATEGORIES = ['Volunteers', 'Committee Members', 'Event Attendees', 'Other'];
const ALL_ROLES = ['Standard', 'Silver', 'Gold', 'Professional', 'Premium', 'Platinum', 'Premium Gold', 'Diamond', 'VIP', 'Founder', 'Admin'];

export default function Members() {
  const { t, members, addMember, updateMember, deleteMember, bulkAddMembers, exportMembers } = useApp();
  const [isImporting, setIsImporting] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
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
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Standard', category: 'Volunteers' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { filter?: string, openInvite?: boolean };
    if (state?.filter) {
      if (state.filter === 'Active' || state.filter === 'Pending' || state.filter === 'Suspended') {
        setStatusFilter(state.filter);
      } else if (ALL_ROLES.includes(state.filter)) {
        setRoleFilter(state.filter);
      } else {
        setSearchQuery(state.filter);
      }
    }
    if (state?.openInvite) {
      setIsInviting(true);
    }

    const hasActionableState = state && Object.keys(state).length > 0;
    if (hasActionableState) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: Member = {
      ...inviteForm,
      status: 'Pending',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(inviteForm.name)}&background=random`
    };
    await addMember(newMember);
    setIsInviting(false);
    setInviteForm({ name: '', email: '', role: 'Standard', category: 'Volunteers' });
    setShowImportSuccess(true);
    setTimeout(() => setShowImportSuccess(false), 3000);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !editForm.id) return;
    await updateMember(editForm.id, editForm);
    setIsEditing(false);
    setSelectedMember(editForm);
    setShowImportSuccess(true);
    setTimeout(() => setShowImportSuccess(false), 3000);
  };

  const handleSuspend = async (member: Member) => {
    if (!member.id) return;
    const newStatus = member.status === 'Suspended' ? 'Active' : 'Suspended';
    await updateMember(member.id, { status: newStatus });
    setSelectedMember({ ...member, status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('are_you_sure'))) return;
    await deleteMember(id);
    setSelectedMember(null);
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
                           m.name.toLowerCase().includes(q) || 
                           m.email.toLowerCase().includes(q) || 
                           m.role.toLowerCase().includes(q);
      
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      const matchesRole = roleFilter === 'All' || m.role === roleFilter;
      const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesRole && matchesCategory;
    });

    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key].toLowerCase();
        const valB = b[sortConfig.key].toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [members, searchQuery, statusFilter, roleFilter, sortConfig]);

  const rolesSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach(m => {
      counts[m.role] = (counts[m.role] || 0) + 1;
    });
    
    // Ensure all defined roles show up even if 0, plus any others that exist
    const allKnownRoles = Array.from(new Set([...ALL_ROLES, ...Object.keys(counts)])).sort();
    
    return [
      { role: 'Total', count: members.length, isTotal: true },
      ...allKnownRoles.map(role => ({
        role,
        count: counts[role] || 0,
        isTotal: false
      }))
    ];
  }, [members, t]);

  const roles = useMemo(() => rolesSummary.map(r => r.isTotal ? 'All' : r.role), [rolesSummary]);

  const generateRandomMembers = async () => {
    const firstNames = ['Somchai', 'Somsak', 'Wichai', 'Anong', 'Kanya', 'John', 'Jane', 'Michael', 'Sarah', 'Preecha'];
    const lastNames = ['Sae-Lee', 'Smith', 'Doe', 'Vichit', 'Rakthai', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    const possibleRoles = ALL_ROLES;
    const categories = ['Volunteers', 'Staff', 'Donors', 'General'];

    const newRandomMembers: Member[] = Array.from({ length: 10 }).map(() => {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${fn} ${ln}`;
      return {
        name,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`,
        role: possibleRoles[Math.floor(Math.random() * possibleRoles.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        status: Math.random() > 0.2 ? 'Active' : 'Pending',
        joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };
    });

    try {
      await bulkAddMembers(newRandomMembers);
      setShowImportSuccess(true);
      setTimeout(() => setShowImportSuccess(false), 3000);
    } catch (e: any) {
      setImportError(`Failed to add random members: ${e.message}`);
      setIsImporting(true); // Show the import modal to display the error
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
          name: row.name || row.Name || 'ไม่ระบุชื่อ',
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
        setShowImportSuccess(true);
        setTimeout(() => setShowImportSuccess(false), 3000);
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
      <AnimatePresence>
        {showImportSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {t('import_success')}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-on-surface font-heading">{t('member_list')}</h1>
          <p className="text-on-surface-variant mt-1">{t('manage_members')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={generateRandomMembers}
            className="px-6 py-2.5 border border-outline-variant rounded-xl bg-surface-container text-on-surface font-bold flex items-center justify-center gap-2 hover:bg-on-surface/5 transition-all shadow-sm active:scale-95"
          >
            <UserPlus className="w-5 h-5" />
            <span>{t('generate_random')}</span>
          </button>
          <button 
            onClick={() => { setIsImporting(true); setIsInviting(false); }}
            className="px-6 py-2.5 border border-outline-variant rounded-xl bg-surface-container text-on-surface font-bold flex items-center justify-center gap-2 hover:bg-on-surface/5 transition-all shadow-sm active:scale-95"
          >
            <Upload className="w-5 h-5" />
            {t('import_csv')}
          </button>
          <button 
            onClick={exportMembers}
            className="px-6 py-2.5 border border-outline-variant rounded-xl bg-surface-container text-on-surface font-bold flex items-center justify-center gap-2 hover:bg-on-surface/5 transition-all shadow-sm active:scale-95"
          >
            <FileSpreadsheet className="w-5 h-5" />
            <span>{t('export_report')}</span>
          </button>
          <button 
            onClick={() => { setIsInviting(true); setIsImporting(false); }}
            className="bg-primary hover:bg-primary-container text-on-primary px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20 active:scale-95"
          >
            <UserPlus className="w-5 h-5" />
            {t('invite_member')}
          </button>
        </div>
      </header>

      {/* Roles Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {rolesSummary.map((item) => {
          const isSelected = item.isTotal ? roleFilter === 'All' : roleFilter === item.role;
          return (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              key={item.role}
              onClick={() => setRoleFilter(item.isTotal ? 'All' : (item.role === roleFilter ? 'All' : item.role))}
              className={`p-4 rounded-2xl border text-left transition-all w-full h-full ${
                isSelected 
                  ? 'bg-primary border-primary shadow-lg shadow-primary/20' 
                  : 'bg-surface-container border-outline-variant/30 hover:border-primary/50'
              }`}
            >
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'
              }`}>
                {item.isTotal ? t('total_members') : item.role}
              </p>
              <p className={`text-xl font-bold ${
                isSelected ? 'text-on-primary' : 'text-on-surface'
              }`}>
                {item.count.toLocaleString()}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviting(false)}
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface-container rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-outline-variant/30"
            >
              <button 
                onClick={() => setIsInviting(false)}
                className="absolute right-6 top-6 p-2 hover:bg-on-surface/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-outline" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8" />
                </div>
                <h2 className="text-2xl text-on-surface font-heading">{t('invite_new')}</h2>
                <p className="text-on-surface-variant mt-2">{t('invite_desc')}</p>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('full_name')}</label>
                  <input 
                    required
                    value={inviteForm.name}
                    onChange={e => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface outline-none transition-all" 
                    placeholder={t('name_placeholder')}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('email')}</label>
                  <input 
                    required
                    type="email"
                    value={inviteForm.email}
                    onChange={e => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface outline-none transition-all" 
                    placeholder="member@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('member_tier')}</label>
                  <select 
                    value={inviteForm.role}
                    onChange={e => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface outline-none transition-all appearance-none"
                  >
                    {ALL_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('category')}</label>
                  <select 
                    value={inviteForm.category}
                    onChange={e => setInviteForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface outline-none transition-all appearance-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsInviting(false)}
                    className="flex-1 py-3 bg-on-surface/5 text-on-surface font-bold rounded-xl hover:bg-on-surface/10 transition-colors active:scale-95"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container transition-colors active:scale-95 shadow-lg shadow-primary/20"
                  >
                    {t('send_invite')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              className="relative bg-surface-container rounded-[2rem] w-full max-w-lg p-10 shadow-2xl border border-outline-variant/30"
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
                      selectedMember.status.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-outline-variant'
                    }`} />
                  </div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl text-on-surface font-heading">{selectedMember.name}</h2>
                    <div className={`w-3 h-3 rounded-full ${selectedMember.status.toLowerCase() === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-outline-variant'}`} />
                  </div>
                  <p className="text-on-surface-variant font-medium mt-1">{selectedMember.email}</p>
                
                <div className="flex gap-2 mt-4">
                  <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    {selectedMember.role}
                  </span>
                  <span className="px-4 py-1 bg-on-surface/5 text-on-surface rounded-full text-[10px] font-black uppercase tracking-widest border border-outline-variant/30">
                    {selectedMember.category}
                  </span>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    selectedMember.status.toLowerCase() === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                  }`}>
                    {selectedMember.status.toLowerCase() === 'active' ? t('online') : t('pending')}
                  </span>
                </div>

                <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-outline-variant/10">
                  <div className="bg-on-surface/5 p-4 rounded-2xl text-left">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{t('join_date')}</p>
                    <p className="text-sm font-bold text-on-surface">{selectedMember.joinDate}</p>
                  </div>
                  <div className="bg-on-surface/5 p-4 rounded-2xl text-left">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{t('member_id')}</p>
                    <p className="text-sm font-bold text-on-surface">MB-{(Math.random() * 10000).toFixed(0)}</p>
                  </div>
                </div>

                <div className="w-full mt-6 flex flex-col gap-3">
                  <div className="flex gap-4">
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
              className="relative bg-surface-container rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-outline-variant/30"
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant block ml-1 uppercase tracking-widest">{t('member_tier')}</label>
                    <select 
                      value={editForm.role}
                      onChange={e => setEditForm(prev => prev ? ({ ...prev, role: e.target.value }) : null)}
                      className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface text-on-surface outline-none transition-all"
                    >
                      {ALL_ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
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
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')} 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 border rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
              showFilters ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container text-on-surface border-outline-variant hover:bg-on-surface/5'
            }`}
          >
            <Filter className="w-5 h-5" />
            {t('filters')}
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
        className="bg-surface-container border border-outline-variant/30 rounded-[2rem] shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-on-surface/5 border-b border-outline-variant/10">
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
                    className="px-6 py-4 cursor-pointer hover:bg-on-surface/5 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      {label}
                      <div className="flex flex-col opacity-50 group-hover:opacity-100">
                        {sortConfig.key === key ? (
                          sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr 
                    key={member.id} 
                    onClick={() => setSelectedMember(member)}
                    className="hover:bg-on-surface/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={member.avatar} className="w-10 h-10 rounded-full object-cover border border-outline-variant/10 shadow-sm" alt={member.name} />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-surface shadow-sm ${
                            member.status.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-outline-variant'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{member.name}</p>
                            <div className={`w-2 h-2 rounded-full ${member.status.toLowerCase() === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-outline-variant'}`} title={member.status.toLowerCase() === 'active' ? 'Online' : 'Offline'} />
                          </div>
                          <p className="text-xs text-on-surface-variant font-medium">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-on-surface">{member.role}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-on-surface-variant">
                        {member.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        member.status.toLowerCase() === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {member.status.toLowerCase() === 'active' ? t('online') : t('pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{member.joinDate}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 hover:bg-on-surface/10 rounded-lg transition-colors active:scale-90">
                        <MoreVertical className="w-5 h-5 text-on-surface-variant" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <Search className="w-10 h-10" />
                      <p className="text-on-surface font-semibold">{t('no_results')}</p>
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

