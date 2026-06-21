/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  CheckSquare, 
  Plus, 
  Search, 
  Columns, 
  ChevronRight, 
  AlertCircle,
  FileText,
  Calendar,
  X,
  CreditCard,
  UserPlus
} from 'lucide-react';
import { Citizen, Announcement, CommunityEvent, LetterRequest, Transaction } from '../types';
import { RTRW_CONTEXT } from '../utils/constants';

interface DashboardViewProps {
  citizens: Citizen[];
  transactions: Transaction[];
  announcements: Announcement[];
  events: CommunityEvent[];
  letters: LetterRequest[];
  onAddCitizen: (newWarga: Omit<Citizen, 'id'>) => void;
  onViewChange: (view: any) => void;
  onDeleteCitizen: (id: string) => void;
}

export default function DashboardView({
  citizens,
  transactions,
  announcements,
  events,
  letters,
  onAddCitizen,
  onViewChange,
  onDeleteCitizen
}: DashboardViewProps) {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // For columns visibility
  const [colVisibility, setColVisibility] = useState({
    name: true,
    block: true,
    no: true,
    rt: true,
    gender: true,
    relasi: true,
    pekerjaan: true
  });
  const [showColMenu, setShowColMenu] = useState(false);

  // Modal form states for "Tambah Warga"
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    block: 'sd 1',
    houseNumber: '',
    rtNumber: '4',
    gender: 'L' as 'L' | 'P',
    relationship: 'Kepala Keluarga' as any,
    occupation: '',
    phone: '',
    isResident: true,
    nik: '',
    birthDate: ''
  });

  // Calculate dynamic financial metrics
  const totalBalance = transactions.reduce((sum, t) => {
    return t.type === 'pemasukan' ? sum + t.amount : sum - t.amount;
  }, 0);

  const thisMonthIncome = transactions
    .filter(t => t.type === 'pemasukan' && t.date.includes('2026-06'))
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpenses = transactions
    .filter(t => t.type === 'pengeluaran' && t.date.includes('2026-06'))
    .reduce((sum, t) => sum + t.amount, 0);

  // Total Kepala Keluarga (relationship === 'Kepala Keluarga')
  const totalKK = citizens.filter(c => c.relationship === 'Kepala Keluarga').length;

  // Layanan permohonan pending count
  const pendingLettersCount = letters.filter(l => l.status === 'Menunggu').length;

  // Filtered citizens
  const filteredCitizens = citizens.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.houseNumber.includes(searchTerm)
  );

  // Selected all handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredCitizens.map(f => f.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isResident' ? value === 'true' : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    onAddCitizen(formData);
    // Reset form
    setFormData({
      name: '',
      block: 'sd 1',
      houseNumber: '',
      rtNumber: '4',
      gender: 'L',
      relationship: 'Kepala Keluarga',
      occupation: '',
      phone: '',
      isResident: true,
      nik: '',
      birthDate: ''
    });
    setShowAddModal(false);
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Yakin ingin menghapus ${selectedIds.length} warga terpilih?`)) {
      selectedIds.forEach(id => onDeleteCitizen(id));
      setSelectedIds([]);
    }
  };

  const formatCurrency = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  return (
    <div className="flex-1 p-6 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Users className="w-5 h-5" />
            </span>
            Sistem RT Digital Warga RT {RTRW_CONTEXT.RT_PRIMARY}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            {RTRW_CONTEXT.welcomeMessage}
          </p>
        </div>
        
        {/* Quick info on current date */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-xs text-xs font-medium text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
          <span>Sistem Aktif: Juni 2026</span>
        </div>
      </div>

      {/* Metric Cards Grid - EXACTLY like mock image values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Warga */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-display block">Total Warga</span>
              <p className="font-display text-2xl font-bold text-slate-800 mt-1">{citizens.length}</p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 flex items-center font-medium">
            {totalKK} Kepala Keluarga
          </p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500"></div>
        </div>

        {/* Saldo Kas */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-display block">Saldo Kas</span>
              <p className="font-display text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Wallet className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">Saldo kas RT tersedia</p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-500"></div>
        </div>

        {/* Pemasukan */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-display block">Pemasukan</span>
              <p className="font-display text-2xl font-bold text-slate-800 mt-1">{formatCurrency(thisMonthIncome)}</p>
            </div>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-[11px] text-teal-600 font-medium mt-3 flex items-center">
            Pemasukan bulan ini
          </p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-teal-500"></div>
        </div>

        {/* Pengeluaran */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-display block">Pengeluaran</span>
              <p className="font-display text-2xl font-bold text-slate-800 mt-1">{formatCurrency(thisMonthExpenses)}</p>
            </div>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <TrendingDown className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-[11px] text-rose-500 font-medium mt-3 flex items-center">
            Pengeluaran bulan ini
          </p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-rose-500"></div>
        </div>

        {/* Iuran Bulan Ini */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-display block">Iuran Bulan Ini</span>
              <p className="font-display text-2xl font-bold text-slate-800 mt-1">2/5 KK</p>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <CheckSquare className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            <span className="text-amber-600 font-semibold">1</span> pending • <span className="text-rose-500 font-semibold">2</span> belum bayar
          </p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-500"></div>
        </div>
      </div>

      {/* Row Widget Grid (Layanan Warga, Pengumuman Terbaru, Kegiatan Mendatang) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layanan Warga Widget */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                Layanan Perizinan Surat
              </h3>
              <button
                type="button"
                onClick={() => onViewChange('perizinan')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors flex items-center"
              >
                Lihat semua
              </button>
            </div>
            <div className="py-2">
              <span className="font-display text-4xl font-extrabold text-indigo-600 block leading-none">
                {pendingLettersCount}
              </span>
              <p className="text-slate-500 text-xs mt-2">Permohonan surat pengantar menunggu persetujuan Ketua RT</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onViewChange('perizinan')}
            className="w-full text-center mt-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Buka Loket Surat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pengumuman Terbaru Widget */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Pengumuman Terbaru
              </h3>
              <button
                type="button"
                onClick={() => onViewChange('pengumuman')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors flex items-center"
              >
                Lihat semua
              </button>
            </div>
            
            <div className="py-1">
              {announcements.length > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 font-bold uppercase rounded-md px-1.5 py-0.5 tracking-wider">
                      {announcements[0].category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{announcements[0].date}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 line-clamp-1 mt-1.5">
                    {announcements[0].title}
                  </h4>
                  <p className="text-slate-500 text-xs line-clamp-2 mt-1">
                    {announcements[0].content}
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 text-xs">Belum ada pengumuman warga.</p>
              )}
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onViewChange('pengumuman')}
            className="w-full text-center mt-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Kirim Pengumuman Baru</span>
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Kegiatan Mendatang Widget */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Kegiatan Mendatang
              </h3>
              <button
                type="button"
                onClick={() => onViewChange('kegiatan')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Lihat semua
              </button>
            </div>
            
            <div className="py-1">
              {events.filter(e => e.status === 'Akan Datang').length > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-55 text-emerald-800 border border-emerald-200 font-bold uppercase rounded-md px-1.5 py-0.5 tracking-wider">
                      {events[0].category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans font-medium">{events[0].date} • {events[0].time}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 line-clamp-1 mt-1.5">
                    {events[0].name}
                  </h4>
                  <p className="text-slate-500 text-xs line-clamp-1 mt-1">
                    📍 {events[0].location}
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 text-xs">Belum ada kegiatan.</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onViewChange('kegiatan')}
            className="w-full text-center mt-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-2 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Daftar Agenda Kegiatan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Citizens Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {/* Table Toolbar controls precisely like mockup */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          {/* Left search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 self-stretch md:self-auto w-full md:w-auto">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 mr-auto md:mr-0"
              >
                Hapus Terpilih ({selectedIds.length})
              </button>
            )}

            {/* Tambah Warga Trigger */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Warga</span>
            </button>

            {/* Columns manager dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowColMenu(!showColMenu)}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Columns className="w-4 h-4" />
                <span>Columns</span>
              </button>
              
              {showColMenu && (
                <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg py-2 w-48 z-20">
                  <div className="px-3 py-1 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tampilan Kolom</span>
                  </div>
                  {Object.keys(colVisibility).map((key) => {
                    const typedKey = key as keyof typeof colVisibility;
                    return (
                      <label key={key} className="flex items-center px-4 py-1.5 hover:bg-slate-50 text-xs text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={colVisibility[typedKey]}
                          onChange={(e) => setColVisibility(prev => ({ ...prev, [typedKey]: e.target.checked }))}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mr-2.5"
                        />
                        <span className="capitalize">{key === 'relasi' ? 'Hub. Keluarga' : key}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table itself */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50/75 border-b border-slate-100 select-none">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={filteredCitizens.length > 0 && selectedIds.length === filteredCitizens.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                {colVisibility.name && <th className="p-4 font-display">Nama</th>}
                {colVisibility.block && <th className="p-4 font-display">Blok</th>}
                {colVisibility.no && <th className="p-4 font-display">No</th>}
                {colVisibility.rt && <th className="p-4 font-display">RT</th>}
                {colVisibility.gender && <th className="p-4 font-display">Gender</th>}
                {colVisibility.relasi && <th className="p-4 font-display">Relasi</th>}
                {colVisibility.pekerjaan && <th className="p-4 font-display">Pekerjaan</th>}
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredCitizens.length > 0 ? (
                filteredCitizens.map((citizen) => {
                  const isChecked = selectedIds.includes(citizen.id);
                  return (
                    <tr 
                      key={citizen.id} 
                      className={`hover:bg-slate-50/60 transition-colors ${isChecked ? 'bg-emerald-50/15' : ''}`}
                    >
                      <td className="p-4 w-12 text-center select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(citizen.id, e.target.checked)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      {colVisibility.name && (
                        <td className="p-4">
                          <div className="font-semibold text-slate-800 flex items-center">
                            {citizen.name}
                            {citizen.name.includes('Pak RT') && (
                              <span className="ml-1.5 bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold">Ketua RT</span>
                            )}
                          </div>
                          {citizen.phone && <div className="text-[10px] text-slate-400 mt-0.5">{citizen.phone}</div>}
                        </td>
                      )}
                      {colVisibility.block && (
                        <td className="p-4">
                          <span className="font-mono text-xs">{citizen.block}</span>
                        </td>
                      )}
                      {colVisibility.no && (
                        <td className="p-4 font-mono text-xs">{citizen.houseNumber}</td>
                      )}
                      {colVisibility.rt && (
                        <td className="p-4 font-mono text-xs">{citizen.rtNumber}</td>
                      )}
                      {colVisibility.gender && (
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            citizen.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {citizen.gender}
                          </span>
                        </td>
                      )}
                      {colVisibility.relasi && (
                        <td className="p-4 text-xs font-medium text-slate-600">{citizen.relationship}</td>
                      )}
                      {colVisibility.pekerjaan && (
                        <td className="p-4 text-xs text-slate-600">{citizen.occupation || '-'}</td>
                      )}
                      <td className="p-4 w-10 text-right">
                        <button 
                          type="button"
                          onClick={() => onViewChange('warga')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 text-xs font-medium">
                    Tidak ada data warga ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-sans">
          <span>
            {selectedIds.length} of {filteredCitizens.length} row(s) selected.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-5 w-20 text-center select-none opacity-50 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              disabled
              className="border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-5 w-20 text-center select-none opacity-50 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Tambah Warga Modal Window Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                Tambah Anggota Warga Baru
              </h3>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Lengkap*</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Contoh: Hasnawati Sakka"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                  />
                </div>

                {/* Block */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Blok Rumah*</label>
                  <input
                    type="text"
                    name="block"
                    required
                    placeholder="Contoh: sd 1 / sb-2"
                    value={formData.block}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                  />
                </div>

                {/* House No */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Nomor Rumah*</label>
                  <input
                    type="text"
                    name="houseNumber"
                    required
                    placeholder="Contoh: 18 / 23"
                    value={formData.houseNumber}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                  />
                </div>

                {/* NIK */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">NIK (16 Digit)</label>
                  <input
                    type="text"
                    name="nik"
                    placeholder="Maks 16 karakter"
                    maxLength={16}
                    value={formData.nik}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                  />
                </div>

                {/* Birth Date */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Gender*</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                {/* Relationship */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Hubungan Keluarga*</label>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                  >
                    <option value="Kepala Keluarga">Kepala Keluarga</option>
                    <option value="Istri">Istri</option>
                    <option value="Anak">Anak</option>
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Asisten Rumah Tangga">Asisten Rumah Tangga</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">No HP Aktif</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Contoh: 0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                  />
                </div>

                {/* Occupation */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    name="occupation"
                    placeholder="Contoh: Karyawan Swasta"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                  />
                </div>

                {/* Resident Type */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Status Keberadaan di Rumah</label>
                  <select
                    name="isResident"
                    value={formData.isResident ? "true" : "false"}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                  >
                    <option value="true">Tinggal Menetap (Warga Tetap)</option>
                    <option value="false">Tinggal Sementara (Kos/Kontrak/Musiman)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors shadow-sm"
                >
                  Simpan Data Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
