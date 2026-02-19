
import React, { useState } from 'react';
import { 
  UserPlus, 
  Trash2, 
  Shield, 
  User as UserIcon,
  Check,
  X,
  Users as UsersIcon,
  AlertCircle,
  Key,
  Eye,
  EyeOff,
  UserCheck,
  Search,
  MoreVertical
} from 'lucide-react';
import { User, UserRole } from '../types';

interface Props {
  users: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onUpdateUser: (user: User) => void;
}

export default function UserManagement({ users, onAddUser, onDeleteUser, onUpdateUser }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    role: 'USER' as UserRole
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: formData.username,
      fullName: formData.fullName,
      password: formData.password,
      role: formData.role
    };
    onAddUser(newUser);
    setIsAdding(false);
    setFormData({ username: '', fullName: '', password: '', role: 'USER' });
  };

  const handleDeleteClick = (id: string) => {
    if (deletingId === id) {
      onDeleteUser(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  const handleResetPassword = (u: User) => {
    if (!newPassword) return;
    onUpdateUser({ ...u, password: newPassword });
    setResettingId(null);
    setNewPassword('');
    setShowPass(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200">
                <UsersIcon size={24} />
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">Manajemen User</h2>
          </div>
          <p className="text-slate-500 font-bold text-sm tracking-wide ml-1">Total {users.length} personil terdaftar dalam sistem cloud</p>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`group flex items-center gap-3 px-8 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 ${
            isAdding 
              ? 'bg-rose-50 text-rose-600 border border-rose-100 shadow-rose-100' 
              : 'bg-slate-950 text-white hover:bg-indigo-600 shadow-slate-200 hover:shadow-indigo-200'
          }`}
        >
          {isAdding ? <X size={18} /> : <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />}
          {isAdding ? 'Tutup Panel' : 'Tambah User Baru'}
        </button>
      </div>

      {/* Add User Panel */}
      {isAdding && (
        <div className="bg-white p-12 rounded-[4rem] border border-indigo-100 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 text-indigo-600 -rotate-12 pointer-events-none">
             <UserPlus size={160} />
          </div>
          
          <div className="mb-10 flex items-center gap-4 border-b border-slate-50 pb-6">
             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <UserCheck size={24} />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Registrasi Akun</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Berikan hak akses digital kepada personil baru</p>
             </div>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nama Lengkap</label>
              <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 font-bold text-slate-900 placeholder:text-slate-300 transition-all"
                placeholder="cth: Ahmad Fauzi" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Username</label>
              <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 font-bold text-slate-900 placeholder:text-slate-300 transition-all"
                placeholder="fauzi123" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Password Awal</label>
              <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 font-bold text-slate-900 placeholder:text-slate-300 transition-all"
                placeholder="********" />
            </div>
            <div className="space-y-3 flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Role Akses</label>
              <div className="flex gap-3 mt-auto">
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-2xl outline-none font-black text-[10px] uppercase tracking-widest cursor-pointer appearance-none text-center" >
                  <option value="USER">STAFF (VIEW)</option>
                  <option value="ADMIN">ADMIN (FULL)</option>
                </select>
                <button type="submit" className="p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-90">
                  <Check size={24} />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Modern User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {users.map(u => (
          <div key={u.id} className="group bg-white p-8 rounded-[3rem] border border-slate-200 hover:border-indigo-200 transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.12)] flex flex-col relative overflow-hidden">
            {/* User Icon Background */}
            <div className="absolute -top-4 -right-4 p-8 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:rotate-12">
               <UserIcon size={120} />
            </div>

            <div className="flex items-start justify-between mb-8 relative z-10">
               <div className={`p-5 rounded-3xl shadow-sm ${u.role === 'ADMIN' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                  {u.role === 'ADMIN' ? <Shield size={28} /> : <UserIcon size={28} />}
               </div>
               <div className="flex items-center gap-2">
                 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                   u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                 }`}>
                   {u.role}
                 </span>
                 <button className="p-2 text-slate-300 hover:text-slate-950 transition-colors">
                    <MoreVertical size={16} />
                 </button>
               </div>
            </div>

            <div className="space-y-1 mb-8 relative z-10">
               <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{u.fullName}</h4>
               <p className="text-xs font-bold text-slate-400 font-mono tracking-tighter">@{u.username} • ID: {u.id}</p>
            </div>

            {/* Action Section */}
            <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
              {resettingId === u.id ? (
                <div className="w-full animate-in slide-in-from-left-4 duration-300 space-y-4">
                  <div className="relative">
                    <input 
                      autoFocus
                      type={showPass ? "text" : "password"}
                      placeholder="Ketik Password Baru"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full pl-6 pr-14 py-3 bg-white border-2 border-indigo-500 rounded-2xl text-sm font-black text-slate-950 outline-none shadow-lg shadow-indigo-50"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleResetPassword(u)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100">Simpan</button>
                    <button onClick={() => { setResettingId(null); setNewPassword(''); setShowPass(false); }} className="px-5 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase">Batal</button>
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setResettingId(u.id)}
                    className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                  >
                    <Key size={16} /> Reset Password
                  </button>

                  {u.username !== 'admin' && (
                    <button 
                      onClick={() => handleDeleteClick(u.id)}
                      className={`p-3.5 rounded-2xl transition-all ${
                        deletingId === u.id 
                          ? 'bg-rose-600 text-white scale-110 shadow-xl shadow-rose-200' 
                          : 'bg-slate-50 text-rose-600 hover:bg-rose-50'
                      }`}
                      title={deletingId === u.id ? "Klik lagi untuk hapus" : "Hapus User"}
                    >
                      {deletingId === u.id ? <AlertCircle size={20} /> : <Trash2 size={20} />}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-12 py-8 bg-slate-900 rounded-[3rem] text-white/50 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
         <div className="flex items-center gap-6">
            <span>Total: {users.length} Akun</span>
            <span className="hidden md:inline-block h-4 w-px bg-white/10"></span>
            <span className="hidden md:inline-block">Status: Cloud Sinkron</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
            Keamanan Data Aktif
         </div>
      </div>
    </div>
  );
}
