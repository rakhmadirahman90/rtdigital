/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Vote, 
  PhoneCall, 
  Check, 
  X, 
  Printer, 
  Building, 
  Plus, 
  Clock, 
  AlertTriangle,
  FileCheck,
  User,
  MapPin,
  Flame,
  Award
} from 'lucide-react';
import { LetterRequest, Poll, EmergencyContact } from '../types';
import { RTRW_CONTEXT } from '../utils/constants';

interface LayananProps {
  letters: LetterRequest[];
  polls: Poll[];
  contacts: EmergencyContact[];
  onApproveLetter: (id: string, letterNum: string) => void;
  onRejectLetter: (id: string, reason: string) => void;
  onVotePoll: (pollId: string, optionId: string) => void;
  onCreatePoll: (poll: Omit<Poll, 'id' | 'totalVotes' | 'votedUserIds'>) => void;
}

export default function LayananView({
  letters,
  polls,
  contacts,
  onApproveLetter,
  onRejectLetter,
  onVotePoll,
  onCreatePoll
}: LayananProps) {
  const [activeSubTab, setActiveSubTab] = useState<'perizinan' | 'polling' | 'darurat'>('perizinan');
  const [viewingDocument, setViewingDocument] = useState<LetterRequest | null>(null);
  
  // Create Poll State
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollForm, setPollForm] = useState({
    question: '',
    description: '',
    endDate: '2026-06-30',
    optionsText: ['', '', '']
  });

  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id: string) => {
    const lettersCount = letters.filter(l => l.status === 'Disetujui').length + 1;
    const dateCode = new Date().toISOString().split('T')[0].split('-'); // [2026, 06, 19]
    const year = dateCode[0];
    const monthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][parseInt(dateCode[1]) - 1];
    
    // Generate an official looking letter serial number
    const letterNum = `0${lettersCount}/${lettersCount}/RT04/RW12/${monthRoman}/${year}`;
    onApproveLetter(id, letterNum);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectId || !rejectReason) return;
    onRejectLetter(rejectId, rejectReason);
    setRejectId(null);
    setRejectReason('');
  };

  const handlePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ops = pollForm.optionsText.filter(o => o.trim() !== '').map((o, idx) => ({
      id: `po-${Date.now()}-${idx}`,
      text: o,
      votes: 0
    }));

    onCreatePoll({
      question: pollForm.question,
      description: pollForm.description,
      endDate: pollForm.endDate,
      status: 'Aktif',
      options: ops
    });

    setPollForm({
      question: '',
      description: '',
      endDate: '2026-06-30',
      optionsText: ['', '', '']
    });
    setShowPollModal(false);
  };

  const handleAddOptionField = () => {
    setPollForm(prev => ({
      ...prev,
      optionsText: [...prev.optionsText, '']
    }));
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Tab bar header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <FileText className="w-5 h-5" />
            </span>
            Kamar Layanan Warga Mandiri
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Proses persuratan pengantar RT secara kilat, jajak pendapat mufakat, dan hubungi jaringan darurat.
          </p>
        </div>

        {/* Layanan subtabs */}
        <div className="bg-slate-100 p-0.5 rounded-lg flex items-center">
          <button
            type="button"
            onClick={() => setActiveSubTab('perizinan')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'perizinan'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Layanan Perizinan ({letters.length})</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveSubTab('polling')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'polling'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Vote className="w-3.5 h-3.5" />
            <span>Polling Warga ({polls.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('darurat')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'darurat'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Kontak Darurat</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'perizinan' ? (
        /* LAYANAN PERIZINAN TAB */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Requests list (Left table, 2/3 width) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-display font-semibold text-xs text-slate-500 uppercase tracking-wider">Antrean Surat Pengantar</h3>
            </div>
            
            <div className="divide-y divide-slate-100 font-sans">
              {letters.length > 0 ? (
                letters.map(l => (
                  <div key={l.id} className="p-4 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 text-xs sm:text-sm">{l.letterType}</span>
                        {l.status === 'Disetujui' ? (
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 flex items-center">
                            <Check className="w-2.5 h-2.5 mr-0.5" /> Approved
                          </span>
                        ) : l.status === 'Ditolak' ? (
                          <span className="bg-rose-50 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-rose-200 flex items-center">
                            <X className="w-2.5 h-2.5 mr-0.5" /> Rejected
                          </span>
                        ) : (
                          <span className="bg-amber-55 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200 flex items-center animate-pulse">
                            <Clock className="w-2.5 h-2.5 mr-0.5" /> Menunggu RT
                          </span>
                        )}
                      </div>
                      
                      <div className="text-[11px] text-slate-500 space-y-0.5 font-sans">
                        <p>Pemohon: <span className="font-bold text-slate-700">{l.applicantName}</span> ({l.applicantAddress})</p>
                        <p>Keperluan: {l.purpose}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Tgl Pengajuan: {l.submittedDate}</p>
                        {l.letterNumber && <p className="text-[10px] text-emerald-700 font-bold font-mono">Seri: {l.letterNumber}</p>}
                        {l.rejectedReason && <p className="text-[10px] text-rose-600 italic">Alasan Ditolak: "{l.rejectedReason}"</p>}
                      </div>
                    </div>

                    {/* Verification operations */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 select-none">
                      {l.status === 'Menunggu' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(l.id)}
                            className="bg-emerald-650 hover:bg-emerald-600 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectId(l.id)}
                            className="bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-650 font-semibold text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            Tolak
                          </button>
                        </>
                      )}

                      {l.status === 'Disetujui' && (
                        <button
                          type="button"
                          onClick={() => setViewingDocument(l)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-500" /> Preview Surat
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">Belum ada antrean pengajuan surat perizinan.</div>
              )}
            </div>
          </div>

          {/* Letter Request document generator view (Right, 1/3 width or overlay preview) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Template Surat Instan
            </h3>
            <p className="text-xs text-slate-550 leading-relaxed">
              Sistem secara otomatis menyediakan KOP Resmi RT {RTRW_CONTEXT.RT_PRIMARY}, mengisi variabel kependudukan, melampirkan tanda tangan digital pengurus, sehingga RT tidak perlu lagi mengetik dokumen secara manual.
            </p>
            
            <div className="space-y-2 pt-2">
              <div className="bg-slate-50 rounded-lg p-3 text-xs flex justify-between items-center border border-slate-150">
                <span className="font-semibold text-slate-700">Surat Pengantar Domisili</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-750 font-bold px-1.5 py-0.5 rounded">PDF Terbuka</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-xs flex justify-between items-center border border-slate-150">
                <span className="font-semibold text-slate-700">Surat Pengantar Pembuatan KK</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-750 font-bold px-1.5 py-0.5 rounded">PDF Terbuka</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-xs flex justify-between items-center border border-slate-150">
                <span className="font-semibold text-slate-700">Surat Keterangan Kurang Mampu</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-750 font-bold px-1.5 py-0.5 rounded">PDF Terbuka</span>
              </div>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'polling' ? (
        /* POLLING WARGA TAB */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Active Polls List (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center select-none">
              <h3 className="font-display font-semibold text-slate-700 text-sm">Pemilihan Pendapat Aktif</h3>
              <button
                type="button"
                onClick={() => setShowPollModal(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Polling Baru</span>
              </button>
            </div>

            <div className="space-y-4">
              {polls.map(p => {
                return (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-display font-bold text-slate-900 text-base">{p.question}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{p.description}</p>
                    </div>

                    {/* Options list */}
                    <div className="space-y-3 font-sans">
                      {p.options.map(opt => {
                        const percent = p.totalVotes > 0 ? Math.round((opt.votes / p.totalVotes) * 100) : 0;
                        return (
                          <div key={opt.id} className="space-y-1 relative">
                            {/* Poll Vote button and option bar */}
                            <button
                              type="button"
                              onClick={() => onVotePoll(p.id, opt.id)}
                              disabled={p.status === 'Selesai'}
                              className="w-full text-left relative z-10 border border-slate-200 hover:border-emerald-300 rounded-xl p-3.5 text-xs text-slate-800 font-medium overflow-hidden transition-all bg-transparent disabled:cursor-not-allowed flex items-center justify-between"
                            >
                              <span className="truncate pr-4">{opt.text}</span>
                              <span className="font-bold text-slate-950 font-mono select-none">{opt.votes} Suara ({percent}%)</span>
                            </button>
                            
                            {/* Visual background fill represent percentage */}
                            <div 
                              style={{ width: `${percent}%` }}
                              className="absolute top-0 left-0 bottom-0 bg-emerald-50 text-emerald-50 md:block hidden opacity-60 rounded-xl max-w-full"
                            ></div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-100">
                      <span>Total Berpartisipasi: <span className="font-bold text-slate-700">{p.totalVotes} Suara Warga</span></span>
                      <span>Selesai: {p.endDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Sistem Mufakat Modern
            </h3>
            <p className="text-xs text-slate-550 leading-relaxed pt-2">
              Semua voting dienkripsi untuk privasi warga, keputusan akhir dapat didownload oleh pengurus dalam file bita PDF rapat sebagai bukti legal asasi persetujuan mayoritas RT {RTRW_CONTEXT.RT_PRIMARY}.
            </p>
          </div>
        </div>
      ) : (
        /* KONTAK DARURAT TAB */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map(c => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${
                    c.category === 'Keamanan' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                    c.category === 'Kesehatan' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {c.category}
                  </span>
                  
                  {c.isLocal ? (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-250 rounded-full px-2 py-0.5">Lokal RT {RTRW_CONTEXT.RT_PRIMARY}</span>
                  ) : (
                    <span className="text-[10px] bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">Layanan Umum</span>
                  )}
                </div>

                <div className="space-y-1.5 mt-2">
                  <h4 className="font-display font-bold text-slate-900 text-base">{c.name}</h4>
                  <p className="text-slate-450 font-mono text-lg font-bold">{c.number}</p>
                </div>
              </div>

              <a
                href={`tel:${c.number.replace(/[^0-9]/g, '')}`}
                className="w-full mt-6 bg-red-650 hover:bg-red-650/90 text-white font-bold py-2.5 rounded-lg text-xs transition flex items-center justify-center space-x-1.5 shadow-md shadow-red-650/10"
              >
                <PhoneCall className="w-4 h-4 text-red-50" />
                <span>Panggil Sekarang</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* REJECT LETTER DIALOG MODAL */}
      {rejectId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-display font-semibold text-slate-800 text-base">Tolak Pengajuan Surat</h3>
              <button type="button" onClick={() => setRejectId(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={rejectSubmit => { rejectSubmit.preventDefault(); if (rejectReason) { onRejectLetter(rejectId, rejectReason); setRejectId(null); setRejectReason(''); } }} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Ketik Alasan Penolakan*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lampirkan KTP terlebih dahulu"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setRejectId(null)} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg text-xs">Batal</button>
                <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow">Kirim Tolak</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE POLL MODAL */}
      {showPollModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-1.5">
                <Vote className="w-5 h-5 text-emerald-600" />
                Buat Polling / Voting Warga Baru
              </h3>
              <button type="button" onClick={() => setShowPollModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handlePollSubmit} className="p-5 space-y-4 font-sans select-none">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Pertanyaan Polling*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Apakah setuju iuran bulanan dinaikkan?"
                  value={pollForm.question}
                  onChange={(e) => setPollForm(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Keterangan / Detil Deskripsi</label>
                <input
                  type="text"
                  placeholder="Contoh: Mengingat porsi dana operasional ronda habis"
                  value={pollForm.description}
                  onChange={(e) => setPollForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm focus:outline-none"
                />
              </div>

              {/* Options fields */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 block">Pilihan Jawaban (Min 2)*</label>
                {pollForm.optionsText.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    required={idx < 2}
                    placeholder={`Pilihan ${idx + 1}`}
                    value={val}
                    onChange={(e) => {
                      const updated = [...pollForm.optionsText];
                      updated[idx] = e.target.value;
                      setPollForm(prev => ({ ...prev, optionsText: updated }));
                    }}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                ))}
                
                <button
                  type="button"
                  onClick={handleAddOptionField}
                  className="text-[11px] text-emerald-600 hover:text-emerald-500 font-bold block"
                >
                  + Tambah Pilihan
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal Selesai*</label>
                <input
                  type="date"
                  required
                  value={pollForm.endDate}
                  onChange={(e) => setPollForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowPollModal(false)} className="bg-white border text-xs px-3.5 py-2 rounded-lg font-semibold text-slate-700">Batal</button>
                <button type="submit" className="bg-emerald-650 hover:bg-emerald-600 text-white text-xs px-4 py-2 rounded-lg font-bold">Simpan Polling</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIMULATED PRINT LAUNCH DIALOG (Approved document Kop Surat) */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-2xl w-full max-w-3xl overflow-hidden my-8">
            <div className="p-4 border-b border-indigo-100 flex justify-between items-center bg-indigo-50/50">
              <span className="text-xs font-bold text-indigo-805 flex items-center gap-1.5 font-display select-none">
                <FileCheck className="w-4 h-4 text-indigo-700" />
                SIMULASI GENERATED SURAT PENGANTAR RT RESMI
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak Surat
                </button>
                <button 
                  type="button" 
                  onClick={() => setViewingDocument(null)} 
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document sheet body - PERFECT Kop Surat style */}
            <div className="p-8 sm:p-12 bg-white max-w-2xl mx-auto overflow-y-auto select-none print:shadow-none print:p-0">
              <div className="border-4 border-double border-slate-900 p-6 flex flex-col font-serif">
                {/* Official Kop Surat */}
                <div className="text-center font-bold relative border-b-2 border-slate-900 pb-3">
                  <h2 className="text-lg tracking-wide leading-tight font-display">KEPENGURUSAN RUKUN TETANGGA 04 / RUKUN WARGA 12</h2>
                  <h3 className="text-base font-display">KELURAHAN JAGAKARSA, KECAMATAN JAGAKARSA</h3>
                  <h4 className="text-xs text-slate-600 font-sans font-medium mt-1">Seketariat/Pendopo: Siliwangi sd 1 No. 18, Jakarta Selatan, DKI Jakarta 12620</h4>
                </div>

                {/* Document details */}
                <div className="text-center font-bold uppercase mt-6 tracking-wide">
                  <h3 className="underline">Surat Pengantar RT</h3>
                  <span className="text-xs font-mono lowercase block mt-0.5">Nomor: {viewingDocument.letterNumber}</span>
                </div>

                {/* Declaration opening */}
                <p className="text-xs leading-relaxed mt-6 text-slate-800 font-serif indent-8">
                  Yang bertanda tangan di bawah ini, Pengurus Rukun Tetangga (RT) {RTRW_CONTEXT.RT_PRIMARY} Rukun Warga (RW) {RTRW_CONTEXT.RW} Kelurahan {RTRW_CONTEXT.KELURAHAN}, Kecamatan {RTRW_CONTEXT.KECAMATAN} menerangkan dengan sesungguhnya bahwa yang bersangkutan di bawah ini:
                </p>

                {/* Substantive citizen rows */}
                <div className="my-5 space-y-2.5 text-xs text-slate-805 px-6 font-mono font-medium">
                  <div className="flex">
                    <span className="w-32 inline-block">Nama Lengkap</span>
                    <span className="mr-3">:</span>
                    <span className="font-bold underline text-slate-950 font-serif">{viewingDocument.applicantName}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 inline-block">Jenis Kelamin</span>
                    <span className="mr-3">:</span>
                    <span>{viewingDocument.applicantGender === 'L' ? 'Laki-Laki (L)' : 'Perempuan (P)'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 inline-block">Alamat Mukim</span>
                    <span className="mr-3">:</span>
                    <span>{viewingDocument.applicantAddress}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 inline-block">Keperluan Surat</span>
                    <span className="mr-3">:</span>
                    <span className="font-semibold text-slate-900 italic font-serif">"{viewingDocument.purpose}"</span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-800 font-serif">
                  Demikianlah Surat Pengantar ini kami terbitkan dengan sebenar-benarnya untuk digunakan sebagaimana mestinya sesuai ketentuan hukum yang berlaku.
                </p>

                {/* Sign-off seal */}
                <div className="mt-10 flex justify-between text-xs px-4">
                  <div className="text-center space-y-16">
                    <span>Mengetahui, <br /> Ketua RW {RTRW_CONTEXT.RW}</span>
                    <div className="font-bold underline decoration-dotted">( ........................ )</div>
                  </div>
                  <div className="text-center space-y-16 relative">
                    <span>{RTRW_CONTEXT.KOTA}, {viewingDocument.approvedDate} <br /> Ketua RT {RTRW_CONTEXT.RT_PRIMARY} / RW {RTRW_CONTEXT.RW}</span>
                    
                    {/* Simulated digital signature stamp */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center justify-center pointer-events-none rotate-3">
                      <div className="border border-emerald-500 bg-emerald-50/15 text-emerald-600 font-display font-extrabold text-[8px] uppercase tracking-widest leading-none border-dashed px-2 py-1 rounded w-28 text-center animate-pulse">
                        Approved Digital BY <br /> {RTRW_CONTEXT.KETUA_RT_01.split(' ')[0].toUpperCase()} {RTRW_CONTEXT.RT_PRIMARY}/{RTRW_CONTEXT.RW}
                      </div>
                    </div>

                    <div className="font-bold underline">{RTRW_CONTEXT.KETUA_RT_01.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingDocument(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded text-xs transition"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
