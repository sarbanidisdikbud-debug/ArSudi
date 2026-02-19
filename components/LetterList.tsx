
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, 
  Send, 
  Search, 
  Trash2, 
  ExternalLink, 
  Calendar,
  FileSpreadsheet,
  FilterX
} from 'lucide-react';
import { Letter } from '../types';
import { CATEGORIES } from '../constants';

interface Props {
  letters: Letter[];
  onDelete?: (id: string) => void;
}

export default function LetterList({ letters, onDelete }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'MASUK' | 'KELUAR'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredLetters = useMemo(() => {
    return letters.filter(letter => {
      const matchesSearch = 
        letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.receiver.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'ALL' || letter.type === typeFilter;
      const matchesCategory = categoryFilter === 'Semua' || letter.category === categoryFilter;
      
      const matchesDate = (() => {
        if (!startDate && !endDate) return true;
        const lDate = letter.date; // YYYY-MM-DD
        if (startDate && lDate < startDate) return false;
        if (endDate && lDate > endDate) return false;
        return true;
      })();

      return matchesSearch && matchesType && matchesCategory && matchesDate;
    });
  }, [letters, searchTerm, typeFilter, categoryFilter, startDate, endDate]);

  const handleDownloadCSV = () => {
    if (filteredLetters.length === 0) return;

    const headers = [
      'Nomor Surat',
      'Judul/Perihal',
      'Tipe',
      'Pengirim',
      'Penerima',
      'Kategori',
      'Kategori Surat',
      'Tanggal',
      'Ringkasan AI'
    ];

    const rows = filteredLetters.map(letter => [
      `"${letter.number}"`,
      `"${letter.title}"`,
      letter.type,
      `"${letter.sender}"`,
      `"${letter.receiver}"`,
      `"${letter.category}"`,
      `"${letter.educationLevel || 'Umum'}"`,
      letter.date,
      `"${letter.aiSummary || '-'}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_Arsip_Surat_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setCategoryFilter('Semua');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Filter Toolbar */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari perihal, nomor, pengirim..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-800 shadow-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 shadow-inner">
              {(['ALL', 'MASUK', 'KELUAR'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    typeFilter === type 
                      ? 'bg-white text-indigo-700 shadow-md' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {type === 'ALL' ? 'Semua' : type}
                </button>
              ))}
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-6 py-3 bg-white border border-slate-300 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none cursor-pointer shadow-sm min-w-[180px]"
            >
              <option value="Semua">KATEGORI: SEMUA</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Filters Area */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Calendar size={18} />
              </div>
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.15em]">Periode Tanggal</span>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative group">
                <input 
                  type="date" 
                  value={startDate}
                  onClick={(e) => (e.target as any).showPicker?.()}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-5 pr-10 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all min-w-[180px] cursor-pointer shadow-sm appearance-none"
                />
                <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 pointer-events-none transition-colors" />
              </div>

              <span className="text-slate-400 font-black">-</span>

              <div className="relative group">
                <input 
                  type="date" 
                  value={endDate}
                  onClick={(e) => (e.target as any).showPicker?.()}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-5 pr-10 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all min-w-[180px] cursor-pointer shadow-sm appearance-none"
                />
                <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 pointer-events-none transition-colors" />
              </div>

              {(startDate || endDate || searchTerm || categoryFilter !== 'Semua' || typeFilter !== 'ALL') && (
                <button 
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-5 py-3 text-rose-600 hover:bg-rose-50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-100/50 hover:border-rose-200"
                >
                  <FilterX size={16} /> Reset
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleDownloadCSV}
            disabled={filteredLetters.length === 0}
            className="flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-slate-200 hover:shadow-emerald-200 w-full lg:w-auto justify-center group"
          >
            <FileSpreadsheet size={18} className="group-hover:rotate-12 transition-transform" />
            Export Database (.CSV)
          </button>
        </div>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Dokumen & Nomor</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Instansi Pihak</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Klasifikasi</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Tanggal</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLetters.length > 0 ? (
                filteredLetters.map(letter => (
                  <tr key={letter.id} className="group hover:bg-indigo-50/40 transition-all">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-6">
                        <div className={`shrink-0 p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${
                          letter.type === 'MASUK' 
                            ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {letter.type === 'MASUK' ? <Inbox size={22} /> : <Send size={22} />}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{letter.title}</p>
                          <p className="text-[11px] font-bold text-slate-400 mt-2 font-mono bg-slate-100 inline-block px-2.5 py-1 rounded-lg border border-slate-200/50">{letter.number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700">{letter.type === 'MASUK' ? letter.sender : letter.receiver}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1.5 flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${letter.type === 'MASUK' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
                          {letter.type === 'MASUK' ? 'Origin (Pengirim)' : 'Destination (Penerima)'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center w-fit px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-800 border-2 border-indigo-200 shadow-sm">
                          {letter.category}
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 italic">
                          {letter.educationLevel || 'Umum'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-3 text-sm font-black text-slate-700">
                        <div className="p-2 bg-slate-100 rounded-xl text-slate-400">
                          <Calendar size={16} />
                        </div>
                        {new Date(letter.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-7 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <Link 
                          to={`/letter/${letter.id}`} 
                          className="p-3.5 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm border border-slate-200"
                          title="Preview & Details"
                        >
                          <ExternalLink size={20} />
                        </Link>
                        {onDelete && (
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(letter.id); }}
                            className="p-3.5 bg-white text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm border border-slate-200"
                            title="Delete Permanently"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-indigo-100 blur-[80px] rounded-full opacity-50" />
                        <div className="relative p-12 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
                          <Search size={64} className="text-slate-200" />
                        </div>
                      </div>
                      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm">Tidak ada dokumen yang sesuai</p>
                      <button 
                        onClick={resetFilters}
                        className="mt-6 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                      >
                        Reset Pencarian
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-10 py-5 bg-slate-900 rounded-[2rem] text-white/50 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
        <span>Menampilkan {filteredLetters.length} Entri Arsip</span>
        <span className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" /> 
          Database Sinkron & Aman
        </span>
      </div>
    </div>
  );
}
