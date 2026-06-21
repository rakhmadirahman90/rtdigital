/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Megaphone, Plus, Calendar, Trash2, Pin, Globe, AlertTriangle, ShieldAlert, FileText, Check } from 'lucide-react';
import { Announcement } from '../types';
import { RTRW_CONTEXT } from '../utils/constants';

interface PengumumanProps {
  announcements: Announcement[];
  onAddAnnouncement: (newAnn: Omit<Announcement, 'id'>) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export default function PengumumanView({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement
}: PengumumanProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'umum' as 'umum' | 'darurat' | 'kegiatan' | 'pembangunan',
    author: RTRW_CONTEXT.KETUA_RT_01,
    isPinned: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    onAddAnnouncement({
      title: form.title,
      content: form.content,
      category: form.category,
      date: new Date().toISOString().split('T')[0],
      author: form.author,
      isPinned: form.isPinned
    });

    setForm({
      title: '',
      content: '',
      category: 'umum',
      author: RTRW_CONTEXT.KETUA_RT_01,
      isPinned: false
    });
    setShowAddForm(false);
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full select-none font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Megaphone className="w-5 h-5" />
            </span>
            Papan Pengumuman Digital RT {RTRW_CONTEXT.RT_PRIMARY}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Siarkan maklumat penting, edaran kelurahan, jadwal iuran, serta peringatan darurat dwi-arah kepada seluruh warga.
          </p>
        </div>

        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tulis Pengumuman</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white border border-slate-220 rounded-xl p-5 shadow-xs transition-all">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-display font-bold text-sm text-slate-800">Tulis Informasi / Maklumat Warga</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 uppercase font-bold"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Judul Pengumuman*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Penyemprotan Fogging Demam Berdarah"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Kategori Kepentingan*</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm bg-white"
                >
                  <option value="umum">Umum (Info Standard)</option>
                  <option value="darurat">Darurat (Penting / Warning)</option>
                  <option value="kegiatan">Kegiatan (Kerja bakti / Rapat)</option>
                  <option value="pembangunan">Pembangunan (Kerja Sipil)</option>
                </select>
              </div>

              {/* Author */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Penulis Maklumat*</label>
                <input
                  type="text"
                  required
                  placeholder={`Contoh: ${RTRW_CONTEXT.KETUA_RT_01}`}
                  value={form.author}
                  onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white"
                />
              </div>

              {/* IsPinned */}
              <div className="sm:col-span-2 flex items-center space-x-2.5 pt-1">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={form.isPinned}
                  onChange={(e) => setForm(prev => ({ ...prev, isPinned: e.target.checked }))}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="isPinned" className="text-xs text-slate-600 cursor-pointer select-none font-semibold">
                  Pin pengumuman ini di papan teratas (Prioritas)
                </label>
              </div>
            </div>

            {/* Content body */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Isi Berita Lengkap*</label>
              <textarea
                required
                rows={4}
                placeholder="Tuliskan detail agenda acara, jam kumpul, perlengkapan yang perlu dibawa warga atau info penertiban jalan..."
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-white hover:bg-slate-50 border border-slate-225 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-emerald-650 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-lg text-xs"
              >
                Siarkan Sekarang
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements Feed Grid boards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map(ann => {
          return (
            <div
              key={ann.id}
              className={`bg-white border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between ${
                ann.category === 'darurat' ? 'border-red-200 shadow-sm shadow-red-50' : 
                ann.isPinned ? 'border-emerald-200' : 'border-slate-200'
              }`}
            >
              {ann.isPinned && (
                <span className="absolute -top-2.5 left-5 bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center font-display shadow-sm">
                  <Pin className="w-3 h-3 mr-1 fill-white" />
                  PINNED INFO
                </span>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 mt-2">
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                    ann.category === 'darurat' ? 'bg-red-50 text-red-700 font-bold border border-red-200' :
                    ann.category === 'kegiatan' ? 'bg-green-50 text-green-700 font-bold border border-green-200' :
                    ann.category === 'pembangunan' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {ann.category}
                  </span>
                  
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-300" />
                    {ann.date}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-bold text-slate-900 text-base leading-snug line-clamp-2">
                    {ann.title}
                  </h3>
                  
                  {ann.category === 'darurat' && (
                    <div className="bg-red-50 border border-red-200 text-red-800 text-[11px] p-2 rounded-lg flex items-start gap-1.5 font-medium">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5 animate-bounce" />
                      <span>PERHATIAN KHUSUS: Diharapkan seluruh warga RT {RTRW_CONTEXT.RT_PRIMARY} membaca maklumat darurat ini demi keselamatan lingkungan.</span>
                    </div>
                  )}

                  <p className="text-slate-600 text-xs sm:text-xs leading-relaxed font-sans line-clamp-6">
                    {ann.content}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 select-none">
                <span className="font-semibold block text-slate-500">Penulis: <span className="text-slate-700 font-bold">{ann.author}</span></span>
                
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Yakin ingin menghapus maklumat "${ann.title}"?`)) {
                      onDeleteAnnouncement(ann.id);
                    }
                  }}
                  className="text-slate-400 hover:text-rose-650 p-1 rounded-md hover:bg-rose-50 hover:border-transparent transition-colors border border-slate-200"
                  title="Hapus Maklumat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
