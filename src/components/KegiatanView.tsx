/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Clock, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { CommunityEvent } from '../types';

interface KegiatanProps {
  events: CommunityEvent[];
  onAddEvent: (newEvent: Omit<CommunityEvent, 'id'>) => void;
  onUpdateEventStatus: (id: string, status: 'Akan Datang' | 'Selesai' | 'Batal') => void;
}

export default function KegiatanView({
  events,
  onAddEvent,
  onUpdateEventStatus
}: KegiatanProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    location: '',
    category: 'Gotong Royong' as 'Gotong Royong' | 'Posyandu' | 'Rapat RT' | 'Keagamaan' | 'Sosialisasi' | 'Lainnya'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location) return;

    onAddEvent({
      ...form,
      status: 'Akan Datang'
    });

    setForm({
      name: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '08:00',
      location: '',
      category: 'Gotong Royong'
    });
    setShowAddForm(false);
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full select-none font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Calendar className="w-5 h-5" />
            </span>
            Agenda Kegiatan Warga RT 04
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Pantau dan ikuti gotong royong warga, arisan, rapat pleno RT, posyandu berkala balita & pemeriksaan lansia.
          </p>
        </div>

        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kegiatan</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white border border-slate-220 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-display font-semibold text-slate-805 text-sm">Tambahkan Agenda Kegiatan Warga Baru</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 font-bold uppercase"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Event Name */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Agenda Kegiatan*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kerja Bakti Massal Pembasmian Sarang Nyamuk"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Deskripsi Kegiatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Melakukan genangan selokan, memangkas rumput pos dan fogging DBD"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal Pelaksanaan*</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white animate-none"
                />
              </div>

              {/* Time */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Jam Kumpul / Pelaksanaan*</label>
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Lokasi Kumpul / Tempat*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pendopo/Lapangan Balai RT 04"
                  value={form.location}
                  onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Kategori Kegiatan*</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm"
                >
                  <option value="Gotong Royong">🛠️ Gotong Royong (Kerja Bakti)</option>
                  <option value="Posyandu">👶 Posyandu Balita & Lansia</option>
                  <option value="Rapat RT">🗣️ Rapat Warga & Pleno RT</option>
                  <option value="Keagamaan">🕌 Pengajian / Kegiatan Keagamaan</option>
                  <option value="Sosialisasi">📢 Sosialisasi Kelurahan</option>
                  <option value="Lainnya">🧩 Lainnya</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-white border text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 border-slate-220"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-emerald-650 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-lg text-xs"
              >
                Simpan Agenda
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of community events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(ev => {
          return (
            <div
              key={ev.id}
              className={`bg-white border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
                ev.status === 'Selesai' ? 'border-zinc-200 bg-zinc-50/50' : 
                ev.status === 'Batal' ? 'border-red-200' : 'border-slate-200'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md border ${
                    ev.category === 'Gotong Royong' ? 'bg-orange-50 text-orange-755 border-orange-200' :
                    ev.category === 'Posyandu' ? 'bg-pink-50 text-pink-755 border-pink-200' :
                    ev.category === 'Rapat RT' ? 'bg-teal-50 text-teal-755 border-teal-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {ev.category}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ev.status === 'Akan Datang' ? 'bg-emerald-100 text-emerald-800' :
                    ev.status === 'Selesai' ? 'bg-zinc-200 text-zinc-650' :
                    'bg-red-100 text-red-850'
                  }`}>
                    {ev.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-slate-900 text-base leading-snug truncate">
                    {ev.name}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                    {ev.description || 'Tidak ada uraian agenda kegiatan.'}
                  </p>
                </div>

                <div className="py-2 px-3.5 bg-slate-50/80 rounded-xl space-y-2 border border-slate-100 text-xs">
                  <div className="flex items-center text-slate-600 gap-2 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.date} @ {ev.time} WIB</span>
                  </div>
                  <div className="flex items-center text-slate-650 gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">Tempat: {ev.location}</span>
                  </div>
                </div>
              </div>

              {/* Event manager controllers */}
              {ev.status === 'Akan Datang' && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateEventStatus(ev.id, 'Selesai')}
                    className="flex-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-805 text-slate-700 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Selesaikan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateEventStatus(ev.id, 'Batal')}
                    className="border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-650 text-xs font-semibold px-2.5 py-2 rounded-lg transition-colors flex items-center justify-center"
                    title="Batalkan Kegiatan"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {ev.status === 'Selesai' && (
                <div className="mt-5 text-[11px] text-zinc-400 italic text-center">
                  ✅ Kegiatan telah sukses diselesaikan. Terimakasih warga.
                </div>
              )}
              {ev.status === 'Batal' && (
                <div className="mt-5 text-[11px] text-red-400 italic text-center">
                  ⚠️ Kegiatan dibatalkan atau dijadwal ulang oleh pengurus.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
