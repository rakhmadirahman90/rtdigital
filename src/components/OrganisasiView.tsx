/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, UserCheck, Shield, Users, Mail, Phone, ExternalLink, Calendar, CheckCircle, Plus } from 'lucide-react';
import { RTManager, UserAccount } from '../types';

interface OrganisasiProps {
  managers: RTManager[];
  users: UserAccount[];
}

export default function OrganisasiView({ managers, users }: OrganisasiProps) {
  const [activeTab, setActiveTab] = useState<'pengurus' | 'pengguna'>('pengurus');

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full select-none font-sans">
      {/* Header and tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Award className="w-5 h-5" />
            </span>
            Struktur Organisasi & Tata Kelola Pengguna
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Lihat susunan pengurus RT 04 masa bakti 2024 - 2027 serta kelola pengaturan kewenangan akun pengendali web.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="bg-slate-100 p-0.5 rounded-lg flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('pengurus')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'pengurus'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Susunan Pengurus</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('pengguna')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'pengguna'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Kewenangan Akses</span>
          </button>
        </div>
      </div>

      {activeTab === 'pengurus' ? (
        /* TAB 1: SUSUNAN PENGURUS RT */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-550 to-teal-500 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg shadow-emerald-600/10 mb-2">
            <div className="relative z-10 max-w-xl space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 text-white rounded-full px-3 py-1">Dewan Eksekutif RT 04</span>
              <h2 className="font-display font-bold text-lg sm:text-2xl">Masa Bakti Kerja 2024 - 2027</h2>
              <p className="text-xs text-emerald-100 leading-relaxed font-light">
                Seluruh pengurus dipilih secara musyawarah mufakat demi menjalankan program kerukunan warga, ketertiban ronda malam, transparansi kas bulanan, dan pelestarian lingkungan asri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managers.map(m => {
              return (
                <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex items-center space-x-4">
                  {/* Photo mock */}
                  <div className="w-16 h-16 rounded-full bg-emerald-150 text-emerald-700 font-display font-bold text-xl flex items-center justify-center shrink-0 border-2 border-white shadow shadow-slate-100">
                    {m.name[0]}
                  </div>

                  <div className="overflow-hidden space-y-1">
                    <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full inline-block select-none">
                      {m.role}
                    </span>
                    <h4 className="font-display font-semibold text-slate-900 text-sm truncate">{m.name}</h4>
                    
                    <a
                      href={`tel:${m.phone}`}
                      className="text-xs text-slate-450 hover:text-emerald-600 flex items-center gap-1 mt-1 font-mono font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-300" />
                      {m.phone}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TAB 2: USER PRIVILEGES LIST */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center select-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Akun Berwenang Mengelola Sistem</span>
            <button
              type="button"
              onClick={() => alert('Warga dapat mendaftar mandiri via scan QR Code RT dan diverifikasi admin.')}
              className="bg-slate-900 text-white font-bold text-[10px] px-2.5 py-1.5 rounded"
            >
              Undang Pengguna
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase select-none border-b border-slate-100">
                <tr>
                  <th className="p-4">Nama User</th>
                  <th className="p-4">Alamat Email</th>
                  <th className="p-4">Level Akses</th>
                  <th className="p-4">Status Pengguna</th>
                  <th className="p-4">Aktivitas Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {users.map(u => {
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-slate-850 block">{u.name}</span>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-500">
                        {u.email}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'Superadmin' ? 'bg-indigo-50 text-indigo-750 font-extrabold border border-indigo-200' :
                          u.role === 'Pengurus RT' ? 'bg-emerald-50 text-emerald-755 font-bold border border-emerald-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-750 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center w-16 gap-0.5 border border-emerald-200 select-none">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Aktif
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-450 font-medium">
                        {u.lastLogin || 'Belum berkunjung'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
