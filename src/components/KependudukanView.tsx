/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Eye, 
  Trash2, 
  ShieldAlert, 
  Home, 
  Calendar, 
  Phone,
  BookOpen,
  Filter,
  Briefcase,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Citizen } from '../types';

interface KependudukanProps {
  citizens: Citizen[];
  onDeleteCitizen: (id: string) => void;
  onAddCitizen: (newWarga: Omit<Citizen, 'id'>) => void;
}

export default function KependudukanView({
  citizens,
  onDeleteCitizen,
  onAddCitizen
}: KependudukanProps) {
  const [activeTab, setActiveTab] = useState<'warga' | 'kk'>('warga');
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  
  // Filtering states
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [blockFilter, setBlockFilter] = useState<string>('All');
  const [relationFilter, setRelationFilter] = useState<string>('All');
  const [searchWord, setSearchWord] = useState('');

  // Get unique blocks
  const uniqueBlocks = ['All', ...Array.from(new Set(citizens.map(c => c.block)))];

  // Filter citizens
  const filtered = citizens.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchWord.toLowerCase()) || 
                          c.occupation.toLowerCase().includes(searchWord.toLowerCase());
    const matchesGender = genderFilter === 'All' || c.gender === genderFilter;
    const matchesBlock = blockFilter === 'All' || c.block === blockFilter;
    const matchesRelation = relationFilter === 'All' || c.relationship === relationFilter;
    return matchesSearch && matchesGender && matchesBlock && matchesRelation;
  });

  // Group by household (Block + House Number) for KK tab
  const householdsMap: Record<string, { head: Citizen | null; members: Citizen[]; block: string; houseNo: string }> = {};
  
  citizens.forEach(c => {
    const key = `${c.block}-${c.houseNumber}`;
    if (!householdsMap[key]) {
      householdsMap[key] = {
        head: null,
        members: [],
        block: c.block,
        houseNo: c.houseNumber
      };
    }
    
    householdsMap[key].members.push(c);
    if (c.relationship === 'Kepala Keluarga') {
      householdsMap[key].head = c;
    }
  });

  // If no head is declared, fallback to first member
  const households = Object.values(householdsMap).map(h => {
    const headWarga = h.head || h.members[0];
    return {
      id: `${h.block}-${h.houseNo}`,
      headName: headWarga ? headWarga.name : 'Belum ditentukan',
      block: h.block,
      houseNumber: h.houseNo,
      membersCount: h.members.length,
      members: h.members,
      phone: headWarga ? headWarga.phone : '-',
      occupation: headWarga ? headWarga.occupation : '-'
    };
  });

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header and navigation tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Users className="w-5 h-5" />
            </span>
            Kependudukan RT 04
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Kelola data registrasi diri warga mandiri, struktur keluarga, dan status kependudukan.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="bg-slate-100 p-0.5 rounded-lg flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab('warga')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'warga'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Anggota Warga ({citizens.length})</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('kk')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'kk'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Kepala Keluarga ({households.length} KK)</span>
          </button>
        </div>
      </div>

      {activeTab === 'warga' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Filters column (1/4 width) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-display">
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                Filter Pencarian
              </span>
              <button
                type="button"
                onClick={() => {
                  setGenderFilter('All');
                  setBlockFilter('All');
                  setRelationFilter('All');
                  setSearchWord('');
                }}
                className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 uppercase"
              >
                Reset
              </button>
            </div>

            {/* Keyword */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Cari Nama / Kerja</label>
              <input
                type="text"
                placeholder="Ketik kata kunci..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
              />
            </div>

            {/* Block Filter */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Pilih Blok</label>
              <select
                value={blockFilter}
                onChange={(e) => setBlockFilter(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:bg-white"
              >
                {uniqueBlocks.map(b => (
                  <option key={b} value={b}>{b === 'All' ? 'Semua Blok' : `Blok ${b}`}</option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:bg-white"
              >
                <option value="All">Semua Gender</option>
                <option value="L">L — Laki-Laki</option>
                <option value="P">P — Perempuan</option>
              </select>
            </div>

            {/* Relasi Hubungan */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Hubungan Keluarga</label>
              <select
                value={relationFilter}
                onChange={(e) => setRelationFilter(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:bg-white"
              >
                <option value="All">Semua Hubungan</option>
                <option value="Kepala Keluarga">Kepala Keluarga</option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Asisten Rumah Tangga">Asisten R.T.</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Table list column (3/4 width) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-500">
                  Menampilkan <span className="font-bold text-slate-850">{filtered.length}</span> dari {citizens.length} warga RT 04
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase select-none">
                    <tr>
                      <th className="p-4">Nama Lengkap</th>
                      <th className="p-4">Alamat Rumah</th>
                      <th className="p-4">Gender</th>
                      <th className="p-4">Hub. Keluarga</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filtered.length > 0 ? (
                      filtered.map(w => (
                        <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <span className="font-semibold text-slate-850 block">{w.name}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">{w.birthDate || 'Tgl lahir tidak diisi'}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs text-slate-700 font-mono">Blok {w.block} No. {w.houseNumber}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              w.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {w.gender}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{w.relationship}</span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedCitizen(w)}
                                title="Lihat Profil Lengkap"
                                className="p-1 text-slate-450 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Yakin ingin menghapus ${w.name} dari sistem?`)) {
                                    onDeleteCitizen(w.id);
                                  }
                                }}
                                title="Hapus Warga"
                                className="p-1 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 text-xs font-medium">
                          Tidak ada warga yang sesuai dengan kriteria filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Heads of Household Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {households.map(hh => (
            <div key={hh.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700 rounded-full px-2.5 py-1 font-mono">
                    KK: {hh.block} / {hh.houseNumber}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Kepala Keluarga</span>
                  <h4 className="font-display font-semibold text-slate-900 text-base">{hh.headName}</h4>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Pekerjaan</span>
                    <span className="text-slate-700 font-semibold truncate block mt-0.5">{hh.occupation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Jumlah Anggota</span>
                    <span className="text-emerald-700 font-bold block mt-0.5">{hh.membersCount} Jiwa</span>
                  </div>
                </div>

                {/* Sublist mapping */}
                <div className="mt-4 bg-slate-50 rounded-lg p-3 space-y-1.5">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider mb-1">Anggota Serumah:</span>
                  {hh.members.map(m => (
                    <div key={m.id} className="flex justify-between items-center text-[11px] text-slate-600">
                      <span className="font-semibold truncate max-w-[130px]">{m.name}</span>
                      <span className="text-slate-400 font-display italic">{m.relationship}</span>
                    </div>
                  ))}
                </div>
              </div>

              {hh.phone && hh.phone !== '-' && (
                <a
                  href={`tel:${hh.phone}`}
                  className="w-full mt-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hubungi KK ({hh.phone})</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Profile Detail Drawer/Modal */}
      {selectedCitizen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header banner */}
            <div className="h-24 bg-gradient-to-r from-emerald-600 to-teal-500 relative p-5 flex items-end">
              <button
                type="button"
                onClick={() => setSelectedCitizen(null)}
                className="absolute top-4 right-4 text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <XIcon className="w-4.5 h-4.5" />
              </button>
              <div className="flex items-center space-x-3 translate-y-6">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-slate-800 font-display font-bold text-2xl">
                  {selectedCitizen.name[0]}
                </div>
              </div>
            </div>

            {/* Profile fields */}
            <div className="pt-10 px-6 pb-6 space-y-5">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">
                  {selectedCitizen.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono block mt-1">ID: {selectedCitizen.id} • RT 04 / RW 12</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs text-slate-700 space-y-3 pt-2">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-semibold">Nomor NIK</span>
                  <span className="font-mono font-bold text-slate-850">{selectedCitizen.nik || '-'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-semibold">Alamat Rumah</span>
                  <span className="font-semibold text-slate-800">Blok {selectedCitizen.block} No. {selectedCitizen.houseNumber}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-semibold">Jenis Kelamin</span>
                  <span className="font-semibold">{selectedCitizen.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-semibold">Hubungan Keluarga</span>
                  <span className="font-semibold text-emerald-700">{selectedCitizen.relationship}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-semibold">Pekerjaan</span>
                  <span className="font-semibold">{selectedCitizen.occupation || '-'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-semibold">No HP Terdaftar</span>
                  <span className="font-mono font-semibold">{selectedCitizen.phone || '-'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-semibold">Status Mukim</span>
                  <span className={`font-semibold ${selectedCitizen.isResident ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedCitizen.isResident ? 'Warga Tetap (Menetap)' : 'Warga Sementara / Kontrak'}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCitizen(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2 rounded-lg text-xs transition"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple internal icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
