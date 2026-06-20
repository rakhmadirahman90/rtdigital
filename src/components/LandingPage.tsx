/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Wallet, 
  FileText, 
  Megaphone, 
  Vote, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Plus,
  Lock,
  Hourglass,
  AlertCircle,
  Calendar,
  Building,
  Check,
  MapPin,
  CreditCard,
  Send,
  User,
  Info,
  BadgeAlert,
  ChevronRight,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Award,
  Heart,
  Smile,
  Compass,
  ArrowUpRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Citizen, Announcement, CommunityEvent, Poll, LetterRequest, FeedbackSuggestion, IuranStatus } from '../types';

interface LandingPageProps {
  onEnterApp: () => void;
  citizens: Citizen[];
  announcements: Announcement[];
  events: CommunityEvent[];
  polls: Poll[];
  onVotePoll: (pollId: string, optionId: string) => void;
  suggestions: FeedbackSuggestion[];
  onSubmitSuggestion: (newSuggestion: Omit<FeedbackSuggestion, 'id' | 'date' | 'status'>) => void;
  iurans: IuranStatus[];
  onUpdateIuran: (updated: IuranStatus) => void;
  onCreateLetterRequest: (type: string, purpose: string, applicant: Citizen) => void;
  letters: LetterRequest[];
}

export default function LandingPage({ 
  onEnterApp,
  citizens,
  announcements,
  events,
  polls,
  onVotePoll,
  suggestions,
  onSubmitSuggestion,
  iurans,
  onUpdateIuran,
  onCreateLetterRequest,
  letters
}: LandingPageProps) {
  // Navigation: Toggle between "marketing" content and "simulasi portal"
  const [activeTab, setActiveTab] = useState<'portal' | 'promo'>('portal');

  // simulated citizen state
  const [selectedCitizenId, setSelectedCitizenId] = useState<string>(() => {
    // defaults to Andi Hermawan (c4) or first citizen
    const activeOne = citizens.find(c => c.name.includes('Andi')) || citizens[0];
    return activeOne ? activeOne.id : '';
  });

  const simulatedCitizen = citizens.find(c => c.id === selectedCitizenId) || citizens[0];

  // Forms states
  const [letterType, setLetterType] = useState<string>('Surat Pengantar Domisili');
  const [letterPurpose, setLetterPurpose] = useState<string>('');
  const [suggestionContent, setSuggestionContent] = useState<string>('');
  const [selectedIuranMethod, setSelectedIuranMethod] = useState<'Transfer Bank' | 'Cash' | 'E-wallet'>('Transfer Bank');
  const [payIuranAmount, setPayIuranAmount] = useState<number>(250000);

  // Success toast/alert state to instruct user on what to do next
  const [simulationAlert, setSimulationAlert] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  const triggerAlert = (title: string, message: string, type: 'success' | 'info' = 'success') => {
    setSimulationAlert({ show: true, title, message, type });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit suggestion
  const handleSendSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionContent.trim()) return;

    onSubmitSuggestion({
      senderName: simulatedCitizen.name,
      senderContact: simulatedCitizen.phone || '0812-xxxx-xxxx',
      content: suggestionContent
    });

    setSuggestionContent('');
    triggerAlert(
      "Aspirasi Berhasil Dikirim!",
      `Aspirasi rukun warga dari (${simulatedCitizen.name}) telah terdaftar di database RT secara real-time. Silakan klik tombol 'Buka Menu Pengurus (Admin RT)' di atas, lalu masuk ke menu 'Aspirasi & Saran' untuk membalas, menandai dibaca, atau menindaklanjuti pesan warga ini!`
    );
  };

  // Submit letter request
  const handleSendLetterRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterPurpose.trim()) return;

    onCreateLetterRequest(
      letterType,
      letterPurpose,
      simulatedCitizen
    );

    setLetterPurpose('');
    triggerAlert(
      "Permohonan Surat Diajukan!",
      `Permohonan surat pengantar jenis [${letterType}] atas nama ${simulatedCitizen.name} berhasil diajukan. Silakan beralih ke 'Admin RT' -> menu 'Layanan Warga' (Persuratan) untuk menyetujui permohonan ini dan memberikan nomor surat serta tanda tangan digital ketua RT!`
    );
  };

  // Handle pay monthly dues
  const handlePayIuran = (targetIuran: IuranStatus) => {
    const updated: IuranStatus = {
      ...targetIuran,
      amountPaid: payIuranAmount,
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: selectedIuranMethod,
      status: 'Menunggu Verifikasi',
      recordedBy: simulatedCitizen.name
    };

    onUpdateIuran(updated);
    triggerAlert(
      "Konfirmasi Pembayaran Dikirim!",
      `Bukti setoran iuran Rp ${payIuranAmount.toLocaleString('id-ID')} atas hunian Blok ${targetIuran.block}/${targetIuran.houseNumber} telah dikirim. Sebagai admin, silakan buka 'Admin RT' -> menu 'Keuangan' -> sub-tab 'Verifikasi Pembayaran' untuk meninjau status setorannya dan melakukan pelunasan!`
    );
  };

  // Vote poll
  const handleVote = (pollId: string, optionId: string) => {
    onVotePoll(pollId, optionId);
    triggerAlert(
      "Suara Berhasil Terkirim!",
      `Partisipasi votasi ${simulatedCitizen.name} pada polling rembuk warga telah tercatat. Silakan cek grafik real-time perkembangan voting ini pada tab 'Rapat & Polling' di Admin Control Panel!`
    );
  };

  // Simulated avatars mapper based on citizen names to enrich the UI visual value
  const getAvatarUrl = (name: string, gender: 'L' | 'P') => {
    if (gender === 'L') {
      if (name.includes('Andi')) return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
      if (name.includes('Rahmat') || name.includes('Budi')) return 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=120&q=80';
      return 'https://images.unsplash.com/photo-1527983359383-4758693f760c?auto=format&fit=crop&w=120&q=80';
    } else {
      if (name.includes('Siti') || name.includes('Aminah')) return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80';
      return 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80';
    }
  };

  const citizenIurans = iurans.filter(
    i => i.block === simulatedCitizen?.block && i.houseNumber === simulatedCitizen?.houseNumber
  );

  const citizenLetters = letters.filter(
    l => l.applicantId === simulatedCitizen?.id
  );

  const features = [
    {
      icon: Users,
      title: 'Kependudukan Cerdas',
      desc: 'Simpan KK, detail profesi, golongan darah, mutasi hunian, dan analisis statistik warga secara terorganisir.',
      color: 'bg-emerald-100 text-emerald-700',
      tag: 'Kependudukan'
    },
    {
      icon: Wallet,
      title: 'Transparansi Finansial',
      desc: 'Sistem buku kas terbuka. Pemasukan donasi, pengeluaran arisan, belanja tong sampah, dan iuran bulanan terpantau transparan.',
      color: 'bg-blue-100 text-blue-700',
      tag: 'Keuangan'
    },
    {
      icon: FileText,
      title: 'Layanan Pengantar Surat',
      desc: 'Warga tak perlu ketuk pintu Ketua RT larut malam. Cukup isi kepengurusan online, surat digital berstempel RT terbit instan.',
      color: 'bg-indigo-100 text-indigo-700',
      tag: 'Persuratan'
    },
    {
      icon: Megaphone,
      title: 'Mading Pengumuman',
      desc: 'Arisan ibu-ibu, jadwal posyandu balita, pemilu daerah, hingga imbauan gotong royong terkirim cepat.',
      color: 'bg-amber-100 text-amber-700',
      tag: 'Komunikasi'
    },
    {
      icon: Vote,
      title: 'Polling Rapat Rukun',
      desc: 'Gelar jajak pendapat mufakat menentukan gerbang pos satpam baru atau sumbangan kematian secara demokratis.',
      color: 'bg-rose-100 text-rose-700',
      tag: 'Demokrasi'
    },
    {
      icon: ShieldCheck,
      title: 'Sistem Keamanan & Ronda',
      desc: 'Manajemen pos jaga, kalender jadwal ronda malam berkala, pelaporan laka/insiden darurat, dan inventaris keamanan.',
      color: 'bg-teal-100 text-teal-700',
      tag: 'Keamanan'
    }
  ];

  const steps = [
    {
      no: '01',
      title: 'Mendaftarkan Akun RT',
      desc: 'Ketua Pengurus menginisiasi koordinat RT (Provinsi, Kota, RT/RW) & mengundang warga mendaftarkan rumah tinggalnya.'
    },
    {
      no: '02',
      title: 'Koleksi Berkas & Inventaris',
      desc: 'Petugas RT mencatat inventaris rukun (tenda besi, genset, pacul) dan membagikan jadwal siskamling malam warga.'
    },
    {
      no: '03',
      title: 'Kelola Transaksi Terbuka',
      desc: 'Dapatkan QR-Code untuk ditaruh di Balai RT warga. Warga cukup scan untuk lapor pembayaran atau minta surat.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans selection:bg-emerald-500 selection:text-white pb-12">
      
      {/* Simulation Helper Banner: Sticky Instruction Guide */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-350 sticky top-0 z-40 text-xs shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-200">
              💡 <strong>Simulasi Interaktif Rukunin:</strong> Kirim data sebagai Warga di sini, lalu verifikasi permohonan tersebut di <strong>Admin Control Panel</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={onEnterApp}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded text-[11px] font-display transition-colors cursor-pointer"
          >
            Buka Menu Pengurus (Admin RT) &rarr;
          </button>
        </div>
      </div>

      {/* Success/Action Instruction Toast */}
      {simulationAlert && simulationAlert.show && (
        <div className="bg-emerald-650 text-white border-b border-emerald-700 shadow-xl px-5 py-4 transition-all">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-amber-300 mt-0.5 shrink-0 animate-pulse" />
              <div>
                <p className="font-bold text-sm tracking-wide text-white font-display">
                  {simulationAlert.title}
                </p>
                <p className="text-xs text-emerald-100 mt-1 font-sans leading-relaxed max-w-4xl">
                  {simulationAlert.message}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSimulationAlert(null)}
                className="bg-emerald-850 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition cursor-pointer"
              >
                Tetap di Sini
              </button>
              <button
                type="button"
                onClick={() => {
                  setSimulationAlert(null);
                  onEnterApp();
                }}
                className="bg-white text-emerald-950 hover:bg-slate-100 font-bold px-4 py-1.5 rounded-lg text-[11px] transition flex items-center gap-1 cursor-pointer shadow-md"
              >
                <span>Beralih ke Admin RT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Responsive Navigation Header */}
      <header className="bg-white border-b border-slate-150 px-4 md:px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-emerald-600/20 shrink-0">
              R
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl tracking-tight text-slate-900 leading-none">
                  Rukunin
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">RT Digital</span>
              </div>
              <span className="text-[10px] text-zinc-500 tracking-wider">SIP RT MODERN • KODE KEPENDUDUKAN 04</span>
            </div>
          </div>

          {/* Interactive Navigation Mode Tabs */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex items-center space-x-1 border border-slate-205">
            <button
              type="button"
              onClick={() => setActiveTab('portal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all flex items-center gap-1 ${
                activeTab === 'portal'
                  ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📱 Portal Warga</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('promo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all flex items-center gap-1 ${
                activeTab === 'promo'
                  ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🌐 Landing Info RT</span>
            </button>
          </div>
          
          <button 
            type="button"
            onClick={onEnterApp}
            className="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md gap-1.5 items-center cursor-pointer font-display"
          >
            <span>Kelola Admin RT</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </header>

      {/* TAB SUBVIEW 1: PROMO LANDING AREA */}
      {activeTab === 'promo' && (
        <>
          {/* Hero Section with Beautiful Landscape Photo */}
          <section className="relative pt-12 pb-20 px-6 overflow-hidden bg-white text-center pb-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 text-left space-y-6">
                <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200/60 rounded-full px-4 py-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest font-display">
                    Aplikasi SIP RT Digital #1 Indonesia
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                  Guyub Rukun Semakin <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    Efisien, Aman & Transparan
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  Rukunin menyatukan data kependudukan rukun tetangga, verifikasi kas keuangan terbuka, persuratan mandiri, agenda warga, hingga polling mufakat demokratis dalam satu layar interaktif.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-center gap-3.5 max-w-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=300"
                    alt="RT Modern"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Digitalisasi Mandiri RT 04</p>
                    <p className="text-[11px] text-slate-500">Konsep smart neighborhood perumahan bersih & aman lestari.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('portal')}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-620/15 hover:shadow-emerald-500/25 transition-all text-xs cursor-pointer font-display"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Coba Portal Warga Sekarang</span>
                  </button>
                  <button
                    type="button"
                    onClick={onEnterApp}
                    className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center transition-all text-xs cursor-pointer border border-slate-700 shadow-md font-display"
                  >
                    <span>Masuk Dashboard RT &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Graphical illustration and Mockup with cartoon styling */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-15"></div>
                <div className="relative bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
                  
                  {/* Top bar mockup */}
                  <div className="flex justify-between items-center bg-slate-850 p-2.5 rounded-xl border border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400">Rukunin OS v2.6.2</span>
                  </div>

                  {/* Main graphic */}
                  <div className="space-y-4 my-auto relative z-10">
                    <div className="text-center">
                      <div className="inline-block p-3 bg-emerald-500/10 rounded-full mb-3.5 text-emerald-400 border border-emerald-500/20">
                        <Building className="w-8 h-8" />
                      </div>
                      <h4 className="font-display font-extrabold text-white text-base">Dashboard Digital Ketua RT</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Visualisasi rukun bertangga untuk keamanan, persuratan, kas dan warga.</p>
                    </div>

                    {/* Fun Stats Row inside graphical model */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-850 p-3 rounded-xl border border-slate-800/80">
                      <div className="text-center">
                        <span className="text-[10px] text-zinc-400 block uppercase font-mono">WARGA</span>
                        <span className="text-sm font-bold text-emerald-400">5 Hektar</span>
                      </div>
                      <div className="text-center border-x border-slate-800">
                        <span className="text-[10px] text-zinc-400 block uppercase font-mono">STATUS</span>
                        <span className="text-sm font-bold text-amber-300">Aman</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-zinc-400 block uppercase font-mono">KAS</span>
                        <span className="text-sm font-bold text-white">99%</span>
                      </div>
                    </div>
                  </div>

                  {/* Curated Illustration Overlay */}
                  <div className="mt-4 overflow-hidden rounded-xl h-24 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800"
                      alt="Modern neighborhood landscape"
                      className="w-full h-full object-cover opacity-35 hover:opacity-50 transition-opacity duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* Core Feature Grid */}
          <section id="fitur" className="py-16 px-4 md:px-6 bg-slate-50 border-t border-slate-100">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block bg-teal-50 text-teal-850 px-3 py-1 rounded-full text-xs font-bold mb-3">LAYANAN MANDIRI</div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Mengapa Rukunin Sangat Disukai Warga?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                  Semua birokrasi, siskamling, dan pencatatan kas RT yang dulu memakan waktu kini tuntas secara praktis dan digital.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="bg-white hover:bg-white border border-slate-150 hover:border-slate-300 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-semibold ${f.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-full">{f.tag}</span>
                        </div>
                        <h4 className="font-display text-base font-bold text-slate-900 mb-2">
                          {f.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          {f.desc}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] text-emerald-650 font-bold gap-1 mt-auto">
                        <span>Coba di Portal Warga</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Siskamling Ronda Night Section with Ambient Photo */}
          <section className="bg-slate-900 text-white py-16 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=85&w=1200')] bg-cover bg-center opacity-10"></div>
            <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              
              <div className="space-y-4 text-left">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono uppercase tracking-widest">
                  keamanan siskamling malam
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Pos Siskamling Ronda Digital RT & Alarm Darurat
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  RT Digital kami mengawal siskamling komplek warga secara modern. Lengkap dengan kalender jadwal ronda mingguan warga, presensi masuk pos satpam, input insiden kehilangan/kejadian mencurigakan, dan kontak darurat damkar/polsek siap telepon.
                </p>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 max-w-md flex items-center gap-3">
                  <Flame className="w-6 h-6 text-amber-400 animate-pulse shrink-0" />
                  <span className="text-[11px] text-slate-200">
                    Sistem ronda malam didukung notifikasi alert ke ponsel warga bila terjadi masalah mendesak di dalam kluster.
                  </span>
                </div>
              </div>

              <div className="relative group rounded-2xl overflow-hidden border border-slate-850 shadow-2xl bg-slate-950 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-white font-display flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Presensi Pos Ronda Aktif
                  </span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded">RT 04 / RW 02</span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-400 text-[11px]">Sedang berjaga malam ini (Presensi Masuk):</p>
                  
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <span className="font-medium text-slate-200">Bpk. Budi Santoso</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Pukul 22:15 WIB</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <span className="font-medium text-slate-200">Bpk. Rahmat Hidayat</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Pukul 22:30 WIB</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-500/10 px-3 py-1 rounded-full tracking-wider">
                    SITUASI LINGKUNGAN: KONDUSIF & AMAN
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* Steps of RT activation */}
          <section id="cara-kerja" className="py-16 px-4 md:px-6 bg-white border-t border-slate-100">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Langkah Mudah Aktivasi Digitalisasi RT
                </h2>
                <p className="text-xs text-slate-500 max-w-xl mx-auto">
                  Rukunin dirancang agar sangat ramah usia. Tidak perlu download melaui playstore, bisa diakses dari browser HP apa saja.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {steps.map((st, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-xs relative overflow-hidden">
                    <span className="font-display text-5xl font-black text-slate-200 absolute top-2 right-4 leading-none select-none">
                      {st.no}
                    </span>
                    <div className="bg-emerald-600 text-white font-mono rounded px-2 text-[9px] font-bold inline-block mb-3 uppercase tracking-wider">
                      Langkah {st.no}
                    </div>
                    <h5 className="font-display text-sm font-bold text-slate-950 mb-2">
                      {st.title}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Integrated Pricing/Demo Box */}
          <section id="harga" className="py-12 px-4 md:px-6 bg-slate-50 border-t border-slate-150">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-250 shadow-md relative overflow-hidden">
                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest font-mono bg-emerald-150/10 px-2.5 py-1 rounded">
                  simulasi interaktif
                </span>
                <h3 className="font-display text-2xl font-extrabold text-slate-950 mt-3.5 mb-2">
                  Siap Mencoba Platform Ini Secara Lengkap?
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
                  Tekan tombol di bawah untuk masuk ke Portal Simulasi Warga, pilih profil bapak/ibu yang ingin dicoba, lalu isikan data rielnya!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('portal')}
                  className="bg-emerald-600 hover:bg-emerald-505 text-white font-bold px-6 py-3 rounded-xl text-xs font-display transition shadow-md shadow-emerald-600/15 cursor-pointer"
                >
                  Mulai Simulasi Warga &rarr;
                </button>
              </div>
            </div>
          </section>
        </>
      )}


      {/* TAB SUBVIEW 2: THE COMPREHENSIVE SIMULATED CITIZEN PORTAL */}
      {activeTab === 'portal' && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          
          {/* Section banner overview with happy volunteers photo */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-md flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800')] bg-cover bg-center opacity-10"></div>
            
            <div className="flex items-center space-x-4 relative z-10">
              <div className="p-3 bg-white/10 rounded-2xl shrink-0">
                <Building className="w-8 h-8 text-emerald-100" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-bold text-emerald-100 bg-white/10 px-2 py-0.5 rounded tracking-wider font-mono">DASHBOARD MANDIRI WARGA</span>
                  <span className="text-[9px] uppercase font-bold text-amber-200 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">SIMULATION MODE</span>
                </div>
                <h2 className="font-display font-black text-xl sm:text-2xl mt-1 text-white">Portal Layanan Mandiri Warga RT 04</h2>
                <p className="text-xs text-emerald-50 max-w-xl mt-1 leading-relaxed">
                  Gunakan portal ini untuk mensimulasikan peran sebagai warga RT setempat. Ajukan permohonan surat pengantar, bayar tagihan iuran, sumbang polling mufakat atau kirim aspirasi.
                </p>
              </div>
            </div>

            <button
              onClick={onEnterApp}
              className="bg-slate-950 text-emerald-250 hover:bg-slate-900 border border-slate-800 text-xs font-bold px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer font-display relative z-10 shrink-0"
            >
              <span>Buka Menu Pengurus (Admin RT)</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* LEFT BAR COLLAPSIBLE PANEL: SELECT THE ACTIVE CITIZEN PROFILE */}
            <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-205 shadow-xs">
              <div className="flex items-center space-x-1.5 mb-3.5 pb-2.5 border-b border-slate-100">
                <Users className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h3 className="font-display font-bold text-xs uppercase text-slate-800 tracking-wider">
                  List Profil Simulator
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Pilih salah satu warga RT 04 di bawah untuk berganti profil simulasi secara dinamis.
              </p>

              {/* Citizen choices list with individual image avatars */}
              <div className="space-y-2.5">
                {citizens.map((cit) => {
                  const isMatch = selectedCitizenId === cit.id;
                  const avatar = getAvatarUrl(cit.name, cit.gender as any);

                  return (
                    <button
                      key={cit.id}
                      type="button, submit"
                      onClick={() => {
                        setSelectedCitizenId(cit.id);
                        setLetterPurpose('');
                        setSuggestionContent('');
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all border flex items-center space-x-3 relative overflow-hidden cursor-pointer ${
                        isMatch
                          ? 'border-emerald-600 bg-emerald-500/5 ring-2 ring-emerald-500/10'
                          : 'border-slate-200 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      {isMatch && (
                        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl uppercase">
                          Aktif
                        </div>
                      )}
                      
                      {/* Avatar image frame */}
                      <img 
                        src={avatar} 
                        className="w-10 h-10 object-cover rounded-full border-2 border-slate-200 shrink-0" 
                        alt={cit.name}
                        referrerPolicy="no-referrer"
                      />

                      <div className="overflow-hidden">
                        <span className="font-bold text-xs text-slate-950 font-display block truncate">
                          {cit.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Blok {cit.block} No. {cit.houseNumber}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Visual cartoon decoration inside selector bar */}
              <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 bg-emerald-100 text-emerald-800 rounded">
                    <Award className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] font-bold text-slate-700">Warga Teladan Active</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Ubah pilihan warga di atas untuk melihat respon instan tagihan kas iuran rumah, permohonan surat khusus, dan hak suaranya.
                </p>
              </div>
            </div>

            {/* RIGHT MAIN PANEL DISPLAY CONTROLLER */}
            <div className="lg:col-span-3 space-y-6 text-left">

              {/* INDIVIDUAL RESIDENT PROFILE BANNER */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                
                <div className="flex items-center space-x-4">
                  <img 
                    src={getAvatarUrl(simulatedCitizen.name, simulatedCitizen.gender as any)} 
                    className="w-14 h-14 object-cover rounded-full border-4 border-slate-100 shadow shrink-0" 
                    alt={simulatedCitizen.name}
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="bg-slate-100 text-slate-650 font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">
                      SI-WARGA DIGITAL RT 04
                    </span>
                    <h3 className="font-display font-black text-slate-900 text-base sm:text-lg mt-1">
                      {simulatedCitizen.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      KK Hunian: <strong>Blok {simulatedCitizen.block} No. {simulatedCitizen.houseNumber}</strong> | Telepon/WA: {simulatedCitizen.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  <span className="text-[9px] font-bold bg-emerald-50 text-emerald-850 px-2.5 py-1 border border-emerald-200/50 rounded-full font-mono uppercase tracking-wider">
                    {simulatedCitizen.relationship}
                  </span>
                  <span className="text-[9px] font-bold bg-indigo-50 text-indigo-850 px-2.5 py-1 border border-indigo-200/50 rounded-full uppercase tracking-wider">
                    {simulatedCitizen.occupation}
                  </span>
                </div>
              </div>


              {/* ACTIONS ROW: A & B AND C & D SUBMODULES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SUBMODULE A: PEMBAYARAN IURAN RT WITH DETAILED PAY METHOD */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center space-x-2">
                        <Wallet className="w-4 h-4 text-emerald-600 animate-pulse" />
                        <h4 className="font-display font-bold text-sm text-slate-900">Pembayaran Iuran Kas RT</h4>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 font-mono">SINKRON KAS</span>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Sistem penarikan iuran terencana untuk membiayai ronda, kebersihan selokan, dan arisan warga.
                    </p>

                    <div className="space-y-3 mb-4">
                      {citizenIurans.length === 0 ? (
                        <div className="text-center py-5 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <AlertCircle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                          <p className="text-[11px] text-slate-500">Tidak ada info iuran wajib terdaftar untuk KK Blok ini.</p>
                        </div>
                      ) : (
                        citizenIurans.map((bill) => {
                          let badgeStyle = "bg-amber-100 text-amber-800";
                          let label = "Menunggu Verifikasi Ibu RT";
                          if (bill.status === 'Lunas') {
                            badgeStyle = "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20";
                            label = "LUNAS / SAH";
                          } else if (bill.status === 'Belum Bayar') {
                            badgeStyle = "bg-rose-100 text-rose-800 border border-rose-200";
                            label = "BELUM BAYAR (Rp 250k)";
                          }

                          return (
                            <div key={bill.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 block tracking-wider uppercase font-mono">Bulan Tagihan</span>
                                <p className="text-xs font-bold text-slate-800 font-display">Juni 2026 ({bill.month})</p>
                              </div>
                              <span className={`text-[9px] font-bold py-1 px-3 rounded-full ${badgeStyle}`}>
                                {label}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {citizenIurans.map((bill) => {
                    if (bill.status === 'Belum Bayar') {
                      return (
                        <div key={bill.id} className="mt-2 pt-3 border-t border-slate-100 space-y-3">
                          <label className="block text-[11px] font-bold text-slate-700 font-display">
                            Pilih Metode Transfer Pembayaran:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Transfer Bank', 'E-wallet', 'Cash'].map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setSelectedIuranMethod(m as any)}
                                className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                                  selectedIuranMethod === m
                                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200'
                                }`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={payIuranAmount}
                              onChange={(e) => setPayIuranAmount(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-1/2 p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-emerald-650"
                              placeholder="Jumlah iuran Rp"
                            />
                            <button
                              type="button"
                              onClick={() => handlePayIuran(bill)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-lg transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-display"
                            >
                              <CreditCard className="w-3.5 h-3.5 text-emerald-250 animate-pulse" />
                              <span>Setor Bukti Bayar</span>
                            </button>
                          </div>
                        </div>
                      );
                    }
                    if (bill.status === 'Menunggu Verifikasi') {
                      return (
                        <div key={bill.id} className="mt-2 text-center p-3.5 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2">
                          <Hourglass className="w-4 h-4 text-amber-500 inline shrink-0 animate-spin" />
                          <span className="text-[11px] text-amber-800 font-sans text-left leading-relaxed">
                            <strong>Menunggu Verifikasi Pengurus RT.</strong> Buka menu Bendahara RT di admin control panel untuk menyetujui kuitansi pelunasan.
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div key={bill.id} className="mt-2 text-center p-3 bg-emerald-500/10 text-emerald-800 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-2 text-xs font-bold font-display">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Keluarga Anda lunas pembayaran wajib iuran kas!</span>
                      </div>
                    );
                  })}
                </div>


                {/* SUBMODULE B: FORM PERMOHONAN SURAT RT */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-display font-bold text-sm text-slate-900 font-display">Ajukan Surat Pengantar RT</h4>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 font-mono">ADMIN PERSURATAN</span>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Sistem pelayanan berstempel resmi digital Ketua RT secara mandiri.
                    </p>

                    {/* Form to Request Letter */}
                    <form onSubmit={handleSendLetterRequest} className="space-y-3 text-left">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 font-display mb-1">
                          Pilih Jenis Surat Pengantar:
                        </label>
                        <select
                          value={letterType}
                          onChange={(e) => setLetterType(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800 focus:outline-none"
                        >
                          <option value="Surat Pengantar Domisili">Surat Pengantar Domisili</option>
                          <option value="Surat Pengantar Pembuatan KK">Surat Pengantar Pembuatan KK</option>
                          <option value="Surat Pengantar KTP">Surat Pengantar KTP</option>
                          <option value="Surat Keterangan Kurang Mampu">Surat Keterangan Kurang Mampu</option>
                          <option value="Surat Pengantar Nikah">Surat Pengantar Nikah</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 font-display mb-1">
                          Tujuan Pembuatan / Keperluan:
                        </label>
                        <textarea
                          rows={2}
                          value={letterPurpose}
                          onChange={(e) => setLetterPurpose(e.target.value)}
                          placeholder="Contoh: Mengurus pendaftaran pernikahan anak pertama di KUA atau pengurusan KTP hilang di kelurahan."
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer font-display"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>Ajukan Surat Resmi</span>
                      </button>
                    </form>
                  </div>

                  {/* Citizen's submitted letter lists */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-display">
                      Riwayat Permohonan Anda ({citizenLetters.length}):
                    </span>
                    {citizenLetters.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">Rumah tinggal Anda belum memiliki permohonan aktif.</p>
                    ) : (
                      <div className="space-y-2 max-h-[140px] overflow-y-auto">
                        {citizenLetters.map((req) => {
                          let labelStyle = "bg-amber-100 text-amber-800 text-[10px]";
                          if (req.status === 'Disetujui') labelStyle = "bg-emerald-100 text-emerald-800 text-[10px]";
                          if (req.status === 'Ditolak') labelStyle = "bg-rose-100 text-rose-800 text-[10px]";

                          return (
                            <div key={req.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800 font-display truncate max-w-[150px]">
                                  {req.letterType}
                                </span>
                                <span className={`font-bold px-2 py-0.5 rounded text-[9px] ${labelStyle}`}>
                                  {req.status}
                                </span>
                              </div>
                              <p className="text-slate-500 text-[10px] mt-1">Keperluan: {req.purpose}</p>
                              {req.status === 'Disetujui' && req.letterNumber && (
                                <p className="text-emerald-700 text-[9px] font-mono mt-1 font-bold bg-emerald-50 p-1 rounded inline-block">
                                  No Dokumen: {req.letterNumber}
                                </p>
                              )}
                              {req.status === 'Ditolak' && req.rejectedReason && (
                                <p className="text-rose-600 text-[10px] mt-1">
                                  Sebab: {req.rejectedReason}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              </div>


              {/* LAYOUT DETAILS GRIDS: C & D FOR VOTING AND ASPIRATION FEEDBACK */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* SUBMODULE C: POLLING DIGITAL DAN MUSYAWARAH */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center space-x-2">
                        <Vote className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-display font-bold text-sm text-slate-900">Demokrasi Polling RT</h4>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">rembuk warga</span>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Sumbangkan hak suara KK Anda untuk menentukan kebijakan rukun komplek secara mufakat.
                    </p>

                    {/* Active Polls feed */}
                    <div className="space-y-4">
                      {polls.filter(p => p.status === 'Aktif').length === 0 ? (
                        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-150">
                          <p className="text-xs text-slate-400 italic">Sedang tidak ada mufakat/polling yang aktif.</p>
                        </div>
                      ) : (
                        polls.filter(p => p.status === 'Aktif').map((poll) => {
                          const hasCitizenVoted = poll.votedUserIds.includes(simulatedCitizen.id);

                          return (
                            <div key={poll.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-xs text-left">
                              <h5 className="font-bold text-slate-900 font-display mb-1">{poll.question}</h5>
                              <p className="text-slate-500 text-[11px] mb-3 leading-relaxed">{poll.description}</p>

                              {/* Progress bar or Radio choice triggers */}
                              <div className="space-y-2 mt-4">
                                {poll.options.map((opt) => {
                                  const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                                  
                                  if (hasCitizenVoted) {
                                    return (
                                      <div key={opt.id} className="space-y-1">
                                        <div className="flex justify-between text-[11px] text-slate-700">
                                          <span className="font-medium">{opt.text}</span>
                                          <span className="font-bold text-emerald-700">{pct}% ({opt.votes} suara)</span>
                                        </div>
                                        <div className="w-full bg-slate-205 h-2 rounded-full overflow-hidden">
                                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => handleVote(poll.id, opt.id)}
                                      className="w-full text-left p-2.5 bg-white border border-slate-200 hover:border-emerald-650 hover:bg-emerald-50/10 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between"
                                    >
                                      <span className="text-slate-800 font-bold">{opt.text}</span>
                                      <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-4 pt-2.5 border-t border-slate-200 font-mono">
                                <span className="text-emerald-700 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                                  {hasCitizenVoted ? '✓ Suara Anda Sudah Disumbang' : 'Pilih opsi Anda'}
                                </span>
                                <span>Total: {poll.totalVotes} Pemilih</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>


                {/* SUBMODULE D: KOTAK SARAN & ASPIRASI */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-display font-bold text-sm text-slate-900">Sumbang Aspirasi</h4>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">SINKRONISASI DATALINK</span>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Lapor tiang listrik padam, jalanan berlubang, pembersihan got tersumbat langsung masuk ke Ketua RT.
                    </p>

                    <form onSubmit={handleSendSuggestion} className="space-y-3 text-left">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-650 mb-1 font-display">
                          Nama Pelapor (Sesuai Profil):
                        </label>
                        <input
                          type="text"
                          value={simulatedCitizen.name}
                          disabled
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 font-display mb-1">
                          Rincian Laporan Kenyamanan Lingkungan:
                        </label>
                        <textarea
                          rows={3}
                          value={suggestionContent}
                          onChange={(e) => setSuggestionContent(e.target.value)}
                          placeholder="Laporkan kondisi sampah tidak diangkut, usulan kegiatan, masukan, kritik lingkungan komplek dll..."
                          className="w-full p-2.5 border border-slate-250 rounded-xl text-xs bg-white text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition shadow-xs font-display"
                      >
                        <span>Kirim Aspirasi Rukun Warga</span>
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    </form>
                  </div>
                </div>

              </div>


              {/* LIVE FEEDS: MADING PENGUMUMAN DAN AGENDA RT TERKINI WITH PHOTOS */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100 justify-between">
                  <div className="flex items-center space-x-2">
                    <Megaphone className="w-5 h-5 text-emerald-600 animate-bounce" />
                    <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-widest">
                      Mading RT & Kalender Gotong Royong
                    </h3>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">LIVE DATA FEED</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  
                  {/* PENGUMUMAN RSS */}
                  <div className="space-y-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
                      📢 PENGUMUMAN WARTA RT ({announcements.length}):
                    </span>
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 text-xs">
                          <div className="flex items-center gap-2">
                            {ann.isPinned && (
                              <span className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                                PIN PENGURUS
                              </span>
                            )}
                            <span className="text-[10px] text-zinc-400 font-mono">{ann.date}</span>
                          </div>
                          <h5 className="font-extrabold text-slate-900 font-display mt-1.5">{ann.title}</h5>
                          <p className="text-slate-600 text-[11px] mt-2 leading-relaxed">
                            {ann.content}
                          </p>
                          <span className="text-[10px] text-slate-405 font-medium mt-2 block">
                            Diposting oleh: {ann.author}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EVENT KALENDER WITH ILLUSTRATION PICTURES */}
                  <div className="space-y-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
                      📅 KALENDER GOTONG ROYONG ({events.length}):
                    </span>
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {events.map((evt) => {
                        // Dynamic Unsplash image selection according to event name to satisfy user request beautifully
                        let eventImg = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&auto=format&fit=crop"; // generic meeting
                        if (evt.name.toLowerCase().includes('bakti') || evt.name.toLowerCase().includes('bersih')) {
                          eventImg = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&auto=format&fit=crop"; // gotong royong / volunteering
                        } else if (evt.name.toLowerCase().includes('posyandu') || evt.name.toLowerCase().includes('bayi')) {
                          eventImg = "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&auto=format&fit=crop"; // baby study / posyandu
                        } else if (evt.name.toLowerCase().includes('ronda') || evt.name.toLowerCase().includes('malam')) {
                          eventImg = "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&auto=format&fit=crop"; // watch tower / ronda night
                        }

                        return (
                          <div key={evt.id} className="bg-slate-50 rounded-2xl border border-slate-150 overflow-hidden text-xs flex flex-col sm:flex-row shadow-xs">
                            <img 
                              src={eventImg} 
                              alt={evt.name}
                              className="w-full sm:w-24 h-24 object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="p-3 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-center">
                                  <span className="font-mono text-emerald-800 font-bold text-[9.5px]">
                                    {evt.date} • {evt.time}
                                  </span>
                                  <span className="text-[9px] font-bold bg-white text-slate-500 border border-slate-150 px-1.5 py-0.5 rounded">
                                    {evt.status}
                                  </span>
                                </div>
                                <h6 className="font-bold text-slate-900 font-display mt-1">{evt.name}</h6>
                                <p className="text-slate-500 text-[10px] mt-1 italic line-clamp-2 leading-relaxed">
                                  "{evt.description}"
                                </p>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium block mt-1">
                                📍 Lokasi: {evt.location}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>


            </div>

          </div>

        </section>
      )}

      {/* Shared Space Frame Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-850 text-xs font-display">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
              R
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-white text-base tracking-tight leading-none">Rukunin Digital</span>
              <span className="text-[9px] text-emerald-400 tracking-wider font-mono">PORTAL RT MANDIRI 04</span>
            </div>
          </div>
          <p className="text-left md:text-right text-slate-500">
            © 2026 Rukunin Digital Inc. Kelola RT Terbuka, Transparan, Hebat, dan Mandiri. <br />
            Silakan akses web ini dari smartphone atau laptop secara responsive.
          </p>
        </div>
      </footer>

    </div>
  );
}
