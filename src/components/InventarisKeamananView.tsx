/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Package, 
  ShieldAlert, 
  MessageSquare, 
  Plus, 
  UserCheck, 
  Check, 
  X, 
  AlertTriangle, 
  ThumbsUp, 
  CornerDownRight, 
  Clock, 
  Send,
  Trash2,
  Lock
} from 'lucide-react';
import { InventoryItem, BorrowRequest, RondaSchedule, SecurityIncident, FeedbackSuggestion, Citizen } from '../types';
import { RTRW_CONTEXT } from '../utils/constants';

interface InventarisKeamananProps {
  inventory: InventoryItem[];
  borrows: BorrowRequest[];
  ronda: RondaSchedule[];
  incidents: SecurityIncident[];
  suggestions: FeedbackSuggestion[];
  citizens: Citizen[];
  onAddBorrow: (newB: Omit<BorrowRequest, 'id'>) => void;
  onUpdateBorrowStatus: (id: string, status: 'Disetujui' | 'Selesai' | 'Ditolak') => void;
  onAddIncident: (newInc: Omit<SecurityIncident, 'id' | 'date' | 'time'>) => void;
  onUpdateIncidentStatus: (id: string, status: 'Investigasi' | 'Selesai' | 'Darurat') => void;
  onReplySuggestion: (id: string, replyText: string) => void;
}

export default function InventarisKeamananView({
  inventory,
  borrows,
  ronda,
  incidents,
  suggestions,
  citizens,
  onAddBorrow,
  onUpdateBorrowStatus,
  onAddIncident,
  onUpdateIncidentStatus,
  onReplySuggestion
}: InventarisKeamananProps) {
  const [activeTab, setActiveTab] = useState<'inventaris' | 'keamanan' | 'saran'>('inventaris');

  // Modal control states
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // Form states and selected items
  const [borrowForm, setForm] = useState({
    citizenName: 'Putri Putri Putri',
    itemName: 'Kursi Plastik Napolly Hijau',
    quantity: '10',
    borrowDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    notes: ''
  });

  const [incidentForm, setIncidentForm] = useState({
    reporterName: 'Andi Hermawan',
    type: 'Orang Mencurigakan' as any,
    description: ''
  });

  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
  const [suggestionReplyText, setSuggestionReplyText] = useState('');

  const handleBorrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowForm.quantity) return;

    onAddBorrow({
      citizenName: borrowForm.citizenName,
      itemName: borrowForm.itemName,
      quantity: parseInt(borrowForm.quantity),
      borrowDate: borrowForm.borrowDate,
      returnDate: borrowForm.returnDate,
      status: 'Menunggu',
      notes: borrowForm.notes
    });

    setForm({
      citizenName: 'Putri Putri Putri',
      itemName: 'Kursi Plastik Napolly Hijau',
      quantity: '10',
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      notes: ''
    });
    setShowBorrowModal(false);
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentForm.description) return;

    onAddIncident({
      reporterName: incidentForm.reporterName,
      type: incidentForm.type,
      description: incidentForm.description,
      status: 'Investigasi'
    });

    setIncidentForm({
      reporterName: 'Andi Hermawan',
      type: 'Orang Mencurigakan',
      description: ''
    });
    setShowIncidentModal(false);
  };

  const handleSuggestionReply = (id: string) => {
    if (!suggestionReplyText.trim()) return;
    onReplySuggestion(id, suggestionReplyText);
    setSuggestionReplyText('');
    setActiveSuggestionId(null);
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full select-none font-sans">
      {/* View general Header tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Package className="w-5 h-5" />
            </span>
            Sarana Prasarana & Ketertiban Lingkungan
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Pantau ketersediaan inventaris RT yang dipinjam warga, tinjau jadwal ronda siskamling, dan tampung masukan aspirasi warga.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="bg-slate-100 p-0.5 rounded-lg flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('inventaris')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'inventaris'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventaris Barang</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('keamanan')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'keamanan'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Pos Ronda Siskamling</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saran')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'saran'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Kotak Saran & Masukan ({suggestions.filter(s => s.status === 'Belum Dibaca').length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'inventaris' ? (
        /* TAB 1: INVENTARIS BARANG & MEMINJAM */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Inventory asset inventory cards (Left, 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {inventory.map(item => {
                return (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl">
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-105 text-slate-700 px-2 py-0.5 rounded font-mono">
                        Lokasi: {item.location}
                      </span>
                    </div>

                    <h4 className="font-display font-semibold text-slate-900 text-sm">{item.name}</h4>
                    <p className="text-slate-500 text-[11px] mt-1 line-clamp-1">{item.notes}</p>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-[11px] font-sans text-center">
                      <div className="bg-slate-50 rounded p-2">
                        <span className="text-slate-400 block font-medium">Bagus</span>
                        <span className="font-bold text-slate-900 text-xs mt-0.5">{item.goodQuantity}</span>
                      </div>
                      <div className="bg-red-50 rounded p-2">
                        <span className="text-slate-405 block font-medium">Rusak</span>
                        <span className="font-bold text-red-700 text-xs mt-0.5">{item.damagedQuantity}</span>
                      </div>
                      <div className="bg-indigo-50 rounded p-2">
                        <span className="text-slate-405 block font-medium">Dipinjam</span>
                        <span className="font-bold text-indigo-700 text-xs mt-0.5">{item.borrowedQuantity} / {item.totalQuantity}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resident borrowings history listing */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Permohonan Pinjam Inventaris</span>
                <button
                  type="button"
                  onClick={() => setShowBorrowModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-colors"
                >
                  Pinjamkan Barang
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs text-slate-700 font-sans">
                {borrows.length > 0 ? (
                  borrows.map(b => (
                    <div key={b.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <p className="font-bold text-slate-900">{b.itemName} (x{b.quantity} unit)</p>
                        <p className="text-slate-500 text-[11px]">Warga: <span className="font-semibold text-slate-705">{b.citizenName}</span></p>
                        <p className="text-[10px] text-slate-400 font-mono">Batas pinjam: {b.borrowDate} s/d {b.returnDate}</p>
                        {b.notes && <p className="text-[10px] text-slate-450 italic">Keperluan: "{b.notes}"</p>}
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 self-end sm:self-auto">
                        {b.status === 'Menunggu' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onUpdateBorrowStatus(b.id, 'Disetujui')}
                              className="bg-emerald-600 hover:bg-emerald-555 text-white font-bold px-2.5 py-1 rounded-md text-[11px] flex items-center gap-0.5"
                            >
                              <Check className="w-3 h-3" /> Setujui
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateBorrowStatus(b.id, 'Ditolak')}
                              className="border hover:bg-rose-50 border-slate-200 hover:border-rose-200 text-rose-600 font-bold px-2 py-1 rounded-md text-[11px]"
                            >
                              Tolak
                            </button>
                          </>
                        )}

                        {b.status === 'Disetujui' && (
                          <button
                            type="button"
                            onClick={() => onUpdateBorrowStatus(b.id, 'Selesai')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-md text-[11px] flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3 text-slate-500" />
                            <span>Konfirmasi Kembali (Selesai)</span>
                          </button>
                        )}

                        {b.status === 'Selesai' && (
                          <span className="bg-slate-50 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">Returned</span>
                        )}
                        {b.status === 'Ditolak' && (
                          <span className="bg-rose-50 text-rose-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-rose-200">Ditolak</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400">Tidak ada log peminjaman barang saat ini.</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="font-display font-semibold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Saling Pinjam Pinjam
            </h3>
            <p className="text-xs text-slate-550 leading-relaxed pt-2">
              Barang inventaris adalah milik bersama warga RT {RTRW_CONTEXT.RT_PRIMARY}. Peminjaman gratis khusus untuk kedukaan/arisan/hajatan. Warga dilarang menyewakan kembali aset-aset ini atau merusak barang tanpa ganti-rugi.
            </p>
          </div>
        </div>
      ) : activeTab === 'keamanan' ? (
        /* TAB 2: KEAMANAN POS RONDA Malam */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-none">
          {/* Ronda schedules daily lists (Left, 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4 select-none">
                <h3 className="font-display font-bold text-slate-900 text-sm">Pembagian Jadwal Ronda Malam RT {RTRW_CONTEXT.RT_PRIMARY}</h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded-full px-2.5 py-1">Shift 22:00 - 04:00 WIB</span>
              </div>

              {/* Roster list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-xs">
                {ronda.map(sched => {
                  return (
                    <div key={sched.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 hover:bg-white transition-all space-y-2">
                      <div className="flex items-center justify-between border-b pb-1.5 border-slate-100">
                        <span className="font-display font-bold text-slate-800 text-xs sm:text-sm">Hari {sched.day}</span>
                        <span className="text-[9px] text-slate-400 font-mono">Total: {sched.officers.length} org</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {sched.officers.map((off, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">
                            🧑‍✈️ {off}
                          </span>
                        ))}
                      </div>

                      {sched.coordinates && (
                        <p className="text-[9px] text-slate-400 italic mt-1 font-mono">📍 Patroli: {sched.coordinates}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Incidents register */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-105 bg-slate-50 flex justify-between items-center">
                <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-wider">Log Investigasi & Kejadian Pos Jaga</h3>
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(true)}
                  className="bg-slate-905 hover:bg-slate-800 text-white font-bold text-[10px] px-2.5 py-1.5 rounded"
                >
                  Laporkan Masalah
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs text-slate-700 font-sans">
                {incidents.length > 0 ? (
                  incidents.map(inc => (
                    <div key={inc.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-750 flex items-center gap-0.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                            {inc.type}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded ${
                            inc.status === 'Darurat' ? 'bg-red-200 text-red-900 font-extrabold animate-pulse' :
                            inc.status === 'Selesai' ? 'bg-zinc-100 text-zinc-500' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {inc.status}
                          </span>
                        </div>
                        <p className="text-slate-700 font-semibold leading-relaxed mt-1">{inc.description}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Pelapor: {inc.reporterName} • Waktu: {inc.date} {inc.time}</p>
                      </div>

                      {inc.status !== 'Selesai' && (
                        <button
                          type="button"
                          onClick={() => onUpdateIncidentStatus(inc.id, 'Selesai')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded shrink-0 self-end sm:self-auto"
                        >
                          Selesaikan Investigasi
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400">Tidak ada kejadian luar biasa atau gangguan keamanan dicatat.</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="font-display font-semibold text-slate-80s text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              Siskamling Siaga
            </h3>
            <p className="text-xs text-slate-550 leading-relaxed pt-2">
              Satu keluarga wajib mengirimkan minimal 1 perwakilan anggota dewasa untuk jadwal ronda piket malam secara berkala. Apabila berhalangan hadir, KK wajib melapor ke Seksi Keamanan atau mengajukan uang denda pengganti jaga sebesar <span className="font-semibold text-rose-700">Rp 50.000 / ronda</span> untuk kas kas.
            </p>
          </div>
        </div>
      ) : (
        /* TAB 3: SARAN COMPLAINTS INBOX MAIL */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start font-sans">
          {/* Messages Feed Inbox lists (Left, 2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {suggestions.map(s => {
              const isOpen = activeSuggestionId === s.id;
              return (
                <div 
                  key={s.id}
                  className={`bg-white border rounded-xl p-5 shadow-xs space-y-4 transition ${
                    s.status === 'Belum Dibaca' ? 'border-amber-250 bg-amber-50/5' : 'border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">{s.date}</span>
                      <h4 className="font-semibold text-slate-900 text-sm mt-0.5">Pengirim: {s.senderName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono shrink-0">Hubungi: {s.senderContact}</p>
                    </div>

                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      s.status === 'Belum Dibaca' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                      s.status === 'Ditinjau' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {s.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50/60 p-3 rounded-lg border border-slate-100 leading-relaxed">
                    "{s.content}"
                  </p>

                  {s.reply ? (
                    <div className="ml-6 pl-4 border-l-2 border-emerald-500 space-y-1 text-slate-600 text-xs">
                      <div className="flex items-center gap-1 font-bold text-emerald-800 text-[10px] uppercase font-display select-none">
                        <CornerDownRight className="w-3.5 h-3.5 mt-0.5" />
                        Tanggapan Pengurus RT {RTRW_CONTEXT.RT_PRIMARY}
                      </div>
                      <p className="italic text-slate-700 bg-slate-50 p-2 rounded">"{s.reply}"</p>
                    </div>
                  ) : (
                    <div className="pt-2 flex justify-between items-center select-none">
                      <span className="text-[10px] text-slate-400">Belum ditanggapi RT.</span>
                      {!isOpen ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSuggestionId(s.id);
                            setSuggestionReplyText('');
                          }}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 flex items-center gap-0.5"
                        >
                          Tanggapi Saran <CornerDownRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveSuggestionId(null)}
                          className="text-xs text-slate-400"
                        >
                          Tutup Balasan
                        </button>
                      )}
                    </div>
                  )}

                  {isOpen && (
                    <div className="space-y-2 pt-3 border-t border-slate-100 animate-in slide-in-from-top-2 duration-100">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Ketik Tanggapan Anda</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ketik balasan pengurus..."
                          value={suggestionReplyText}
                          onChange={(e) => setSuggestionReplyText(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSuggestionReply(s.id)}
                          className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3 py-1.5 text-xs font-bold shrink-0 flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Kirim
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="font-display font-semibold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Saran Sehat
            </h3>
            <p className="text-xs text-slate-550 leading-relaxed pt-2">
              Gunakan bahasa sopan, jelas, tujuannya perbaikan kerukunan RT bersama. Kritik yang membangun, keluhan sengketa tetangga, atau usulan kebersihan sangat diapresiasi secara terbuka.
            </p>
          </div>
        </div>
      )}

      {/* MODAL: CREATE BORROWING REQUEST */}
      {showBorrowModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-150 shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-slate-900 text-sm">Formulir Log Pinjam Inventaris</h3>
              <button type="button" onClick={() => setShowBorrowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleBorrowSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Peminjam (Kepala Keluarga)*</label>
                <select
                  value={borrowForm.citizenName}
                  onChange={(e) => setForm(prev => ({ ...prev, citizenName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm bg-white"
                >
                  {citizens.map(c => (
                    <option key={c.id} value={c.name}>{c.name} (Blok {c.block} No {c.houseNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Pilih Barang*</label>
                <select
                  value={borrowForm.itemName}
                  onChange={(e) => setForm(prev => ({ ...prev, itemName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm bg-white"
                >
                  {inventory.map(item => (
                    <option key={item.id} value={item.name}>{item.name} ({item.goodQuantity} unit tersedia)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Unit Dipinjam*</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={borrowForm.quantity}
                    onChange={(e) => setForm(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Batas Kembali*</label>
                  <input
                    type="date"
                    required
                    value={borrowForm.returnDate}
                    onChange={(e) => setForm(prev => ({ ...prev, returnDate: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Keterangan / Keperluan Peminjaman*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hajatan khitanan anak"
                  value={borrowForm.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowBorrowModal(false)} className="bg-white border text-xs px-4 py-2 rounded-lg font-semibold text-slate-750">Batal</button>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-555 text-white text-xs px-4 py-2 rounded-lg font-bold">Pinjamkan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPORT SECURITY INCIDENT */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-150 shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                Laporkan Masalah Keamanan Pos Jaga
              </h3>
              <button type="button" onClick={() => setShowIncidentModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleIncidentSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Jenis Laporan / Kejadian*</label>
                <select
                  value={incidentForm.type}
                  onChange={(e) => setIncidentForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm bg-white"
                >
                  <option value="Orang Mencurigakan">Orang Mencuringakan</option>
                  <option value="Pencurian">Percobaan Pencurian</option>
                  <option value="Kebakaran">Konsleting/Kebakaran</option>
                  <option value="Ketertiban Umum">Ketertiban Umum (Keributan/Bising)</option>
                  <option value="Lainnya">Lainnya (Pohon tumbang/Banjir)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Pelapor / Saksi Pertama*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Security Andi"
                  value={incidentForm.reporterName}
                  onChange={(e) => setIncidentForm(prev => ({ ...prev, reporterName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Keterangan / Kronologi Singkat*</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tulis kronologi waktu, lokasi spesifik, dan tindakan tanggap darurat sementara yang sudah dilakukan..."
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowIncidentModal(false)} className="bg-white border text-xs px-4 py-2 rounded-lg font-semibold text-slate-750">Batal</button>
                <button type="submit" className="bg-red-650 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg font-bold">Kirim Laporan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
