
import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Building2, 
  Monitor, 
  Save, 
  Download, 
  Trash2, 
  ShieldCheck,
  Database,
  Info,
  ExternalLink,
  Github,
  Rocket,
  HelpCircle,
  Key
} from 'lucide-react';
import { User } from '../types';

interface Props {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onUpdateAppTitle: (title: string) => void;
  appTitle: string;
}

export default function Settings({ currentUser, onUpdateUser, onUpdateAppTitle, appTitle }: Props) {
  const [activeTab, setActiveTab] = useState<'profil' | 'organisasi' | 'sistem' | 'bantuan'>('profil');
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [username, setUsername] = useState(currentUser.username);
  const [tempAppTitle, setTempAppTitle] = useState(appTitle);
  const [storageUsage, setStorageUsage] = useState<string>('0 KB');

  useEffect(() => {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length + key.length) * 2;
      }
    }
    setStorageUsage((total / 1024).toFixed(2) + ' KB');
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...currentUser, fullName, username });
    alert('Profil berhasil diperbarui!');
  };

  const handleUpdateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAppTitle(tempAppTitle);
    alert('Pengaturan organisasi diperbarui!');
  };

  const handleExportData = () => {
    const data = {
      letters: localStorage.getItem('letters_data') || '[]',
      users: localStorage.getItem('app_users') || '[]',
      config: { appTitle, exportDate: new Date().toISOString() }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_arsip_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pengaturan Sistem</h2>
        <p className="text-slate-500 font-medium">Kustomisasi akun dan parameter aplikasi arsip digital</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-6 space-y-2">
          <TabButton 
            active={activeTab === 'profil'} 
            onClick={() => setActiveTab('profil')} 
            icon={<UserIcon size={18} />} 
            label="Profil Saya" 
          />
          {currentUser.role === 'ADMIN' && (
            <TabButton 
              active={activeTab === 'organisasi'} 
              onClick={() => setActiveTab('organisasi')} 
              icon={<Building2 size={18} />} 
              label="Kustomisasi Instansi" 
            />
          )}
          <TabButton 
            active={activeTab === 'sistem'} 
            onClick={() => setActiveTab('sistem')} 
            icon={<Monitor size={18} />} 
            label="Sistem & Keamanan" 
          />
          <TabButton 
            active={activeTab === 'bantuan'} 
            onClick={() => setActiveTab('bantuan')} 
            icon={<HelpCircle size={18} />} 
            label="Bantuan & Deployment" 
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12">
          {activeTab === 'profil' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-indigo-100 text-indigo-600 rounded-3xl">
                  <UserIcon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Informasi Pribadi</h3>
                  <p className="text-sm text-slate-500">Kelola identitas publik Anda dalam aplikasi</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    <Save size={18} /> Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'organisasi' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
               <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-emerald-100 text-emerald-600 rounded-3xl">
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Profil Instansi</h3>
                  <p className="text-sm text-slate-500">Sesuaikan identitas lembaga pada sistem arsip</p>
                </div>
              </div>

              <form onSubmit={handleUpdateOrg} className="max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Aplikasi / Header</label>
                  <input 
                    type="text" 
                    value={tempAppTitle}
                    onChange={(e) => setTempAppTitle(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                  />
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
                   <Info className="text-indigo-400 shrink-0" size={20} />
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">
                     Perubahan di sini bersifat global. Semua pengguna yang masuk akan melihat identitas organisasi yang baru.
                   </p>
                </div>
                <div className="pt-4">
                  <button type="submit" className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                    <Save size={18} /> Perbarui Instansi
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'sistem' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
               <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-slate-100 text-slate-600 rounded-3xl">
                  <Database size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Status & Pemeliharaan</h3>
                  <p className="text-sm text-slate-500">Monitor kesehatan database dan lakukan backup</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Penyimpanan Lokal</p>
                  <h4 className="text-3xl font-black text-indigo-600">{storageUsage}</h4>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Keamanan Sesi</p>
                  <div className="flex items-center gap-2 text-emerald-600 font-black">
                    <ShieldCheck size={20} />
                    <span>Terproteksi</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <button 
                  onClick={handleExportData}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95 group"
                >
                  <Download size={18} /> Ekspor Seluruh Arsip (.JSON)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bantuan' && (
            <div className="space-y-10 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-amber-100 text-amber-600 rounded-3xl">
                  <Rocket size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Panduan Deployment</h3>
                  <p className="text-sm text-slate-500">Cara mendeploy aplikasi ini ke cloud (Vercel/GitHub)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                  <div className="flex items-center gap-4 text-indigo-600 font-black">
                    <Rocket size={24} />
                    <span className="uppercase tracking-widest text-sm">Deploy ke Vercel</span>
                  </div>
                  <ol className="space-y-4 list-decimal list-inside text-sm text-slate-600 font-medium leading-relaxed">
                    <li>Unggah kode Anda ke repositori <b>GitHub</b>.</li>
                    <li>Hubungkan repositori ke akun <b>Vercel</b> Anda.</li>
                    <li>Pada <b>Environment Variables</b>, tambahkan key <code>API_KEY</code> dengan nilai kunci API Gemini Anda.</li>
                    <li>Klik <b>Deploy</b>. Vercel akan menangani sisa prosesnya secara otomatis.</li>
                  </ol>
                  <a href="https://vercel.com" target="_blank" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all">
                    Buka Vercel Dashboard <ExternalLink size={14} />
                  </a>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                  <div className="flex items-center gap-4 text-slate-800 font-black">
                    <Github size={24} />
                    <span className="uppercase tracking-widest text-sm">CI/CD dengan GitHub Actions</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Aplikasi ini sudah dilengkapi file <code>.github/workflows/ci-cd.yml</code>. 
                    Setiap kali Anda melakukan <b>push</b> ke branch <code>main</code>, GitHub akan otomatis menjalankan validasi file untuk memastikan aplikasi dalam kondisi stabil.
                  </p>
                </div>

                <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 space-y-4">
                   <div className="flex items-center gap-3 text-amber-700 font-black">
                     <Key size={20} />
                     <span className="uppercase tracking-widest text-xs">Penting: API Key Gemini</span>
                   </div>
                   <p className="text-xs text-amber-800 leading-relaxed font-bold">
                     Tanpa <code>API_KEY</code>, fitur AI seperti ringkasan otomatis dan ekstraksi metadata tidak akan berfungsi. Pastikan environment variable dikonfigurasi dengan benar di platform hosting Anda.
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${
        active 
          ? 'bg-white text-indigo-600 shadow-xl shadow-slate-200/50' 
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
      }`}
    >
      <div className={`shrink-0 ${active ? 'text-indigo-600' : 'text-slate-300'}`}>
        {icon}
      </div>
      <span className="tracking-tight">{label}</span>
    </button>
  );
}
