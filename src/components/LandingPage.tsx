/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  Wallet, 
  FileText, 
  Megaphone, 
  Vote, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  MessageSquare,
  BookOpen
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const features = [
    {
      icon: Users,
      title: 'Kependudukan',
      desc: 'Simpan data KK, anggota warga, mutasi warga tinggal, pekerjaan, dan stats warga secara rapi & aman.',
      color: 'bg-emerald-100 text-emerald-700'
    },
    {
      icon: Wallet,
      title: 'Transparansi Keuangan',
      desc: 'Buku kas RT yang terbuka untuk warga. Catat pemasukan, pengeluaran operasional, dan laporan rincian harian.',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icon: FileText,
      title: 'Layanan Surat & Perizinan',
      desc: 'Warga tinggal mengajukan permohonan surat pengantar (domisili, KTP, dll) secara online dan di-approve mandiri oleh RT.',
      color: 'bg-indigo-100 text-indigo-700'
    },
    {
      icon: Megaphone,
      title: 'Pengumuman Digital',
      desc: 'Kirim info arisan, posyandu, kerja bakti langsung masuk ke feed warga. Lengkap dengan pin darurat.',
      color: 'bg-amber-100 text-amber-700'
    },
    {
      icon: Vote,
      title: 'Polling Aspirasi Warga',
      desc: 'Ambil keputusan mufakat bersama warga dengan fitur sumbang suara / voting digital transparan.',
      color: 'bg-rose-100 text-rose-700'
    },
    {
      icon: ShieldCheck,
      title: 'Keamanan & Ronda',
      desc: 'Atur jadwal ronda malam mingguan warga, catat laporan kehadiran pos jaga, dan tombol darurat instan.',
      color: 'bg-teal-100 text-teal-700'
    }
  ];

  const steps = [
    {
      no: '01',
      title: 'Daftarkan Akun RT',
      desc: 'Ketua RT mengisi data dasar RT (Provinsi, Kota, Kecamatan, Nomor RT & RW) untuk mengaktifkan sistem.'
    },
    {
      no: '02',
      title: 'Input / Import Data Warga',
      desc: 'Unggah data per KK menggunakan formulir tambah warga yang cepat atau import file kependudukan.'
    },
    {
      no: '03',
      title: 'Tautkan QR & Mulai Kelola',
      desc: 'Unduh selebaran QR Code RT Anda, bagikan ke warga untuk mengajukan iuran, surat, dan voting dari HP mereka!'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 bg-white/85 backdrop-blur-md border-b border-slate-100 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-emerald-600/25">
              R
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900">
              Rukunin
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#fitur" className="hover:text-emerald-600 transition-colors">Fitur</a>
            <a href="#cara-kerja" className="hover:text-emerald-600 transition-colors">Cara Kerja</a>
            <a href="#harga" className="hover:text-emerald-600 transition-colors">Harga</a>
            <a href="#testimoni" className="hover:text-emerald-600 transition-colors">Testimoni</a>
          </nav>

          <button 
            type="button"
            onClick={onEnterApp}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            Masuk Web RT
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden bg-gradient-to-b from-white via-indigo-50/10 to-slate-50">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge Pill */}
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200/60 rounded-full px-4 py-1.5 mb-8 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest font-display">
              Sistem RT Digital #1
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
            Kelola RT Anda <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Lebih Mudah & Transparan
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Data warga, keuangan, iuran, pengumuman & kegiatan — semua dalam satu platform. Warga bisa akses langsung dari HP mereka.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              type="button"
              onClick={onEnterApp}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8 py-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/35 transition-all text-base"
            >
              <span>Coba Demo Sistem Gratis</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#fitur"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium px-8 py-4 rounded-xl flex items-center justify-center transition-all text-base"
            >
              Lihat Fitur
            </a>
          </div>

          {/* Quick Round Avatars from User Request */}
          <div className="flex items-center justify-center -space-x-2 mt-4">
            <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-500 text-white font-bold flex items-center justify-center text-xs shadow-md">
              RT
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-500 text-white font-bold flex items-center justify-center text-xs shadow-md">
              04
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white bg-amber-500 text-white font-bold flex items-center justify-center text-xs shadow-md">
              W
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-500 text-white font-bold flex items-center justify-center text-xs shadow-md">
              A
            </div>
          </div>
          <span className="text-xs text-slate-400 mt-2 block font-display">Simulasi Pengurus & Warga Aktif</span>
        </div>
      </section>

      {/* Mockup Dashboard Preview Container - Encourages action */}
      <section className="px-6 -mt-10 mb-20">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 p-2 sm:p-4 relative">
          <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-900 group cursor-pointer relative" onClick={onEnterApp}>
            {/* Overlay simulation */}
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-all flex items-center justify-center z-10">
              <span className="bg-emerald-600 group-hover:bg-emerald-500 text-white text-sm sm:text-base font-semibold px-6 py-3 rounded-xl shadow-lg ring-4 ring-emerald-600/30 transition-all flex items-center space-x-2">
                <span>Klik untuk Masuk & Kelola Halaman Admin RT</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="w-full h-48 sm:h-96 md:h-[480px] bg-slate-100 flex flex-col opacity-90 transition-all group-hover:scale-[1.006]">
              {/* Fake UI preview bar */}
              <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
                <span className="text-[10px] text-slate-400 font-mono ml-4 select-none">https://rukunin.id/rt-04-dashboard</span>
              </div>
              {/* Abstract drawing reminiscent of the panel */}
              <div className="flex-1 bg-slate-50 flex">
                <div className="w-48 bg-slate-900 p-4 shrink-0 hidden md:block">
                  <div className="w-3/4 h-6 bg-slate-800 rounded mb-6"></div>
                  <div className="space-y-3">
                    <div className="w-full h-8 bg-slate-800 rounded"></div>
                    <div className="w-11/12 h-8 bg-slate-800 rounded"></div>
                    <div className="w-10/12 h-8 bg-slate-800 rounded"></div>
                    <div className="w-9/12 h-8 bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="w-40 h-8 bg-slate-200 rounded"></div>
                    <div className="w-24 h-8 bg-emerald-100 rounded"></div>
                  </div>
                  {/* Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-sm h-20 space-y-2">
                      <div className="w-16 h-3 bg-slate-200 rounded"></div>
                      <div className="w-10 h-6 bg-slate-300 rounded"></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-sm h-20 space-y-2">
                      <div className="w-16 h-3 bg-slate-200 rounded"></div>
                      <div className="w-10 h-6 bg-slate-300 rounded"></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-sm h-20 space-y-2">
                      <div className="w-16 h-3 bg-slate-200 rounded"></div>
                      <div className="w-10 h-6 bg-slate-300 rounded"></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-sm h-20 space-y-2">
                      <div className="w-16 h-3 bg-slate-200 rounded"></div>
                      <div className="w-10 h-6 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                  {/* Table area */}
                  <div className="bg-white rounded-xl border border-slate-150 shadow-sm p-4 space-y-3">
                    <div className="w-28 h-4 bg-slate-200 rounded"></div>
                    <div className="w-full h-8 bg-slate-100 rounded"></div>
                    <div className="w-full h-8 bg-slate-50 rounded"></div>
                    <div className="w-full h-8 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="fitur" className="py-24 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Fitur Lengkap Sesuai Kebutuhan RT Indonesia
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Seluruh urusan administrasi, rukun bertetangga, keuangan, hingga ronda malam diakomodasi dalam satu sistem terintegrasi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200/80 p-6 rounded-2xl hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 font-semibold ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="cara-kerja" className="py-24 px-6 bg-slate-50 border-t border-slate-150">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Semudah 1, 2, 3 untuk Mulai
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Tidak membutuhkan keahlian IT tingkat tinggi. Memulai digitalisasi RT tidak pernah semudah ini.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((st, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden">
                <span className="font-display text-5xl font-extrabold text-slate-100 absolute -top-1 -right-1 leading-none select-none">
                  {st.no}
                </span>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 font-display font-medium rounded-lg flex items-center justify-center text-sm mb-6 relative z-10">
                  Tahap {st.no}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-3 relative z-10">
                  {st.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="harga" className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Biaya Sangat Terjangkau
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Investasi kecil demi transparansi penuh, rukun warga, serta administrasi yang tidak melelahkan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="border border-slate-200 rounded-3xl p-8 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 font-display">RT Mandiri</span>
                <h3 className="font-display text-2xl font-bold text-slate-900 mt-2 mb-4">Gratis Selamanya</h3>
                <p className="text-sm text-slate-600 mb-6">Cocok untuk RT ukuran kecil (di bawah 20 KK) yang rukun dan ingin transparansi kas dasar.</p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-start space-x-3 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Maksimal 25 data warga</span>
                  </div>
                  <div className="flex items-start space-x-3 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Laporan Kas RT digital</span>
                  </div>
                  <div className="flex items-start space-x-3 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Akses Layanan Pengumuman</span>
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={onEnterApp}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-all text-sm text-center"
              >
                Gunakan Gratis
              </button>
            </div>

            {/* Pro Tier */}
            <div className="border-2 border-emerald-500 rounded-3xl p-8 bg-white relative shadow-lg shadow-emerald-500/5 flex flex-col justify-between">
              <span className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                Sangat Direkomendasikan
              </span>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 font-display">RT Modern Pro</span>
                <h3 className="font-display text-2xl font-bold text-slate-900 mt-2 mb-0">Rp 50.000</h3>
                <span className="text-xs text-slate-400 font-display mb-4 block">per RT / bulan</span>
                <p className="text-sm text-slate-600 mb-6">Solusi lengkap RT dengan fitur persuratan otomatis bebas ribet, iuran QR-code dan polling modern.</p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-start space-x-3 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-900">Warga tak terbatas</span>
                  </div>
                  <div className="flex items-start space-x-3 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Buku Keuangan & Iuran Bulanan</span>
                  </div>
                  <div className="flex items-start space-x-3 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Sistem Pengajuan & Approval Surat</span>
                  </div>
                  <div className="flex items-start space-x-3 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Sistem Polling & Kontrol Keamanan Ronda</span>
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={onEnterApp}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-all text-sm text-center shadow-md shadow-emerald-600/10"
              >
                Mulai 1 Bulan Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 text-sm font-display">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Rukunin</span>
          </div>
          <p>© 2026 Rukunin Digital Inc. Hak Cipta Dilindungi Undang-Undang. RT Pintar, Transparan & Mandiri.</p>
        </div>
      </footer>
    </div>
  );
}
