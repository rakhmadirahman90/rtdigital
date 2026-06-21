/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Droplet,
  Wind,
  Trash2,
  CloudRain,
  Volume2,
  ShieldAlert,
  Video,
  CheckCheck,
  Smartphone,
  UploadCloud,
  FileImage,
  X
} from 'lucide-react';
import { Citizen, Announcement, CommunityEvent, Poll, LetterRequest, FeedbackSuggestion, IuranStatus, UserAccount } from '../types';
import { RTRW_CONTEXT } from '../utils/constants';
import { formatIuranVerificationWaMessage, triggerTreasurerWaNotification } from '../utils/waNotificationService';
import ProfilSayaView from './ProfilSayaView';

interface LandingPageProps {
  onEnterApp: () => void;
  citizens: Citizen[];
  announcements: Announcement[];
  events: CommunityEvent[];
  polls: Poll[];
  onVotePoll: (pollId: string, optionId: string, voterName?: string) => void;
  suggestions: FeedbackSuggestion[];
  onSubmitSuggestion: (newSuggestion: Omit<FeedbackSuggestion, 'id' | 'date' | 'status'>) => void;
  iurans: IuranStatus[];
  onUpdateIuran: (updated: IuranStatus) => void;
  onCreateLetterRequest: (type: string, purpose: string, applicant: Citizen) => void;
  letters: LetterRequest[];
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  onLoginClick?: () => void;
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
  letters,
  currentUser,
  onLogout,
  onLoginClick
}: LandingPageProps) {
  // Navigation: Initialize tab dynamically based on login status: 'portal' if logged in, otherwise 'promo'
  const [activeTab, setActiveTab] = useState<'portal' | 'promo'>(() => {
    return currentUser ? 'portal' : 'promo';
  });

  // Keep active tab in sync with login/logout status
  useEffect(() => {
    if (currentUser) {
      setActiveTab('portal');
    } else {
      setActiveTab('promo');
    }
  }, [currentUser]);

  const fallbackCitizen: Citizen = {
    id: 'c-loading',
    name: 'Menghubungkan Database...',
    phone: '0812-xxxx-xxxx',
    block: '-',
    houseNumber: '-',
    rtNumber: '05',
    gender: 'L',
    relationship: 'Lainnya',
    occupation: '-',
    isResident: true
  };

  // Derive the active citizen directly from the logged-in user
  const loggedInCitizen = currentUser 
    ? citizens.find(c => c.name.toLowerCase() === currentUser.name.toLowerCase())
    : null;

  const simulatedCitizen: Citizen = loggedInCitizen || (currentUser ? {
    id: currentUser.id,
    name: currentUser.name,
    block: 'A',
    houseNumber: '00',
    rtNumber: RTRW_CONTEXT.RT_PRIMARY,
    gender: 'L',
    relationship: 'Kepala Keluarga',
    occupation: 'Warga',
    phone: '0812-xxxx-xxxx',
    isResident: true
  } : fallbackCitizen);

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

  // Interactive Environment Hub State Variables
  const [greenLevel, setGreenLevel] = useState<number>(85);
  const [trashFullness, setTrashFullness] = useState<number>(72);
  const [heavyRainSimulated, setHeavyRainSimulated] = useState<boolean>(false);
  const [pintuAirLevel, setPintuAirLevel] = useState<number>(18); // cm
  const [aqiLevel, setAqiLevel] = useState<number>(45); // AQI
  const [kentonganAlertCount, setKentonganAlertCount] = useState<number>(0);
  const [kentonganAlertMsg, setKentonganAlertMsg] = useState<string>('');
  const [selectedFacilityName, setSelectedFacilityName] = useState<string>('Balai Pertemuan');
  const [facilityBooked, setFacilityBooked] = useState<Record<string, boolean>>({
    'Balai Pertemuan': false,
    'Lapangan Bulutangkis': true,
    'Genset Portable RT': false,
    'Tenda Besi Acara': false,
  });
  const [facilityBorrower, setFacilityBorrower] = useState<Record<string, string>>({
    'Lapangan Bulutangkis': 'Bpk. Rahmat (Blok B-03)',
  });
  const [activeCctv, setActiveCctv] = useState<string>('Pos Keamanan Gerbang');

  useEffect(() => {
    if (heavyRainSimulated) {
      setPintuAirLevel(82); // Siaga banjir!
      setAqiLevel(12); // Hujan menyapu polusi ke level sangat bersih!
    } else {
      setPintuAirLevel(18); // Normal
      setAqiLevel(45); // Normal
    }
  }, [heavyRainSimulated]);

  // Integrated Kentongan Online WA Dispatch States and Simulation
  const [showKentonganDispatch, setShowKentonganDispatch] = useState<boolean>(false);
  const [activeDispatchStep, setActiveDispatchStep] = useState<number>(0);
  const [officerResponses, setOfficerResponses] = useState<Record<string, { status: 'sending' | 'sent' | 'read' | 'replied'; replyText?: string; replyTime?: string }>>({});

  // States for iuran payment proof upload and automated WA notification to Treasurer
  const [citizenPortalTab, setCitizenPortalTab] = useState<'layanan' | 'profil'>('layanan');
  const [uploadedReceiptFile, setUploadedReceiptFile] = useState<string | null>(null);
  const [uploadedReceiptName, setUploadedReceiptName] = useState<string>('');
  const [isDraggingReceipt, setIsDraggingReceipt] = useState<boolean>(false);
  const [showIuranWaNotif, setShowIuranWaNotif] = useState<boolean>(false);
  const [iuranWaStep, setIuranWaStep] = useState<number>(0);
  const [iuranWaReply, setIuranWaReply] = useState<boolean>(false);
  const [iuranWaPayload, setIuranWaPayload] = useState<{
    amount: number;
    method: string;
    fileName: string;
    citizenName: string;
    block: string;
    houseNumber: string;
    date: string;
    img: string | null;
    rawMessage?: string;
  } | null>(null);

  const targetOfficers = [
    {
      id: 'm1',
      name: 'Hasnawati Sakka',
      role: 'Ketua RT 01',
      phone: '0812-4422-9901',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=60',
      initialReply: 'Saya meluncur ke lokasi gerbang utama sekarang! Tolong CCTV dipantau terus.'
    },
    {
      id: 'm5',
      name: 'Andi Hermawan',
      role: 'Seksi Keamanan & Ronda',
      phone: '0813-8822-1104',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=60',
      initialReply: 'Pukulan kentongan termonitor! Saya kumpulkan personel ronda malam sedia senter.'
    },
    {
      id: 'm4',
      name: 'Fatimah Hasan',
      role: 'Bendahara RT 01',
      phone: '0812-3456-7801',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=60',
      initialReply: 'Ya Allah darurat apa? Saya amankan dokumen RT & pantau siskamling dari rumah.'
    },
    {
      id: 'm3',
      name: 'Herman Nusu',
      role: 'Ketua RW 07',
      phone: '0811-6644-7707',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=60',
      initialReply: 'Monitor RT 01, tim kordinasi RW siap mendukung koordinasi Polsek bila mendesak.'
    }
  ];

  const triggerKentonganDispatch = () => {
    setShowKentonganDispatch(true);
    setActiveDispatchStep(1);
    
    // Initialize
    const initial: Record<string, { status: 'sending' | 'sent' | 'read' | 'replied' }> = {};
    targetOfficers.forEach(o => {
      initial[o.id] = { status: 'sending' };
    });
    setOfficerResponses(initial);

    // Timeline actions:
    // 800ms -> Step 2
    setTimeout(() => {
      setActiveDispatchStep(2);
      setOfficerResponses(prev => {
        const next = { ...prev };
        next['m1'] = { status: 'sent' };
        next['m5'] = { status: 'sent' };
        return next;
      });
    }, 1000);

    // 2000ms -> Step 3
    setTimeout(() => {
      setActiveDispatchStep(3);
      setOfficerResponses(prev => {
        const next = { ...prev };
        targetOfficers.forEach(o => {
          next[o.id] = { status: 'sent' };
        });
        return next;
      });
    }, 2000);

    // 3000ms -> Fast responders read
    setTimeout(() => {
      setOfficerResponses(prev => {
        const next = { ...prev };
        next['m1'] = { status: 'read' };
        next['m5'] = { status: 'read' };
        return next;
      });
    }, 3000);

    // 4200ms -> All responders read
    setTimeout(() => {
      setOfficerResponses(prev => {
        const next = { ...prev };
        targetOfficers.forEach(o => {
          next[o.id] = { status: 'read' };
        });
        return next;
      });
    }, 4200);
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
      `Aspirasi rukun warga dari (${simulatedCitizen.name}) telah berhasil terkirim ke Pengurus RT. Terima kasih atas partisipasi Anda dalam menjaga kenyamanan lingkungan!`
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
      `Permohonan surat pengantar [${letterType}] atas nama ${simulatedCitizen.name} berhasil diajukan ke Pengurus RT. Silakan tunggu proses verifikasi dan penerbitan tanda tangan ketua RT!`
    );
  };

  // Handle pay monthly dues
  const handlePayIuran = (targetIuran: IuranStatus) => {
    const today = new Date().toISOString().split('T')[0];
    const imageToUse = uploadedReceiptFile || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600&auto=format&fit=crop&q=80';
    const fileNameToUse = uploadedReceiptName || 'Struk_Transfer_Digital.png';

    const updated: IuranStatus = {
      ...targetIuran,
      amountPaid: payIuranAmount,
      paidDate: today,
      paymentMethod: selectedIuranMethod,
      status: 'Menunggu Verifikasi',
      recordedBy: simulatedCitizen.name,
      receiptImage: uploadedReceiptFile || undefined,
      uploadedFileName: uploadedReceiptName || undefined
    };

    onUpdateIuran(updated);
    
    // Generate the real styled compiled WhatsApp notification body using our service utility
    const realWaMessage = formatIuranVerificationWaMessage(updated, simulatedCitizen.name);
    // Execute simulated automated outbound WhatsApp operator transmission
    triggerTreasurerWaNotification(updated, simulatedCitizen.name).then((res) => {
      console.log(`[WA Gateway API] Transmitted outbound alert with trace ID: ${res.messageId}`);
    });

    // Store iuran WA payload for rendering and simulation
    setIuranWaPayload({
      amount: payIuranAmount,
      method: selectedIuranMethod,
      fileName: fileNameToUse,
      citizenName: simulatedCitizen.name,
      block: simulatedCitizen.block,
      houseNumber: simulatedCitizen.houseNumber,
      date: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      img: imageToUse,
      rawMessage: realWaMessage
    });
    setIuranWaStep(1);
    setIuranWaReply(false);
    setShowIuranWaNotif(true);

    // Simulated staggered delivery sequence
    setTimeout(() => {
      setIuranWaStep(2);
    }, 800);

    setTimeout(() => {
      setIuranWaStep(3);
    }, 1800);

    setTimeout(() => {
      setIuranWaStep(4);
    }, 3200);

    triggerAlert(
      "Konfirmasi Pembayaran Dikirim!",
      `Bukti setoran iuran Rp ${payIuranAmount.toLocaleString('id-ID')} untuk hunian Blok ${targetIuran.block}/${targetIuran.houseNumber} telah dikirim ke Bendahara RT bersama lampiran file bukti transfer "${fileNameToUse}". Transaksi Anda sedang dalam verifikasi pelunasan!`
    );

    // Clear upload states
    setUploadedReceiptFile(null);
    setUploadedReceiptName('');
  };

  // Read uploaded receipt file for iuran
  const handleReceiptFileRead = (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      triggerAlert("Suhu Keamanan File!", "Ukuran berkas melebihi batas 5MB. Silakan pilih gambar struk yang lebih kecil.", "info");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedReceiptFile(reader.result as string);
      setUploadedReceiptName(file.name);
      triggerAlert("Bukti Transfer Terlampir!", `Berkas "${file.name}" berhasil dibaca secara lokal. Tekan "Setor Bukti Bayar" di bawah untuk memproses kiriman!`, "success");
    };
    reader.readAsDataURL(file);
  };

  // Vote poll
  const handleVote = (pollId: string, optionId: string) => {
    onVotePoll(pollId, optionId, simulatedCitizen.name);
    triggerAlert(
      "Suara Berhasil Terkirim!",
      `Hak suara Anda (${simulatedCitizen.name}) pada polling rembuk warga telah berhasil direkam secara digital!`
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
      
      {/* Success/Action Instruction Toast */}
      {simulationAlert && simulationAlert.show && (
        <div className="bg-emerald-600 text-white border-b border-emerald-700 shadow-xl px-5 py-4 transition-all">
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
                className="bg-emerald-850 hover:bg-emerald-900 border border-emerald-700/55 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Responsive Navigation Header */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* TOP ROW on mobile / LEFT side on desktop: Brand Logo & Title, and Mobile Action items */}
          <div className="w-full md:w-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
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
                <span className="text-[10px] text-zinc-500 tracking-wider hidden sm:block">SIP RT MODERN • KODE KEPENDUDUKAN 04</span>
              </div>
            </div>

            {/* Mobile login/logout/actions, visible ONLY on small viewports */}
            <div className="flex md:hidden items-center space-x-2">
              {currentUser && currentUser.role !== 'Warga' && (
                <button 
                  type="button"
                  onClick={onEnterApp}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer font-display"
                >
                  <span>Admin</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                </button>
              )}

              {!currentUser ? (
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer font-display shadow-md shadow-emerald-600/15"
                >
                  <span>Masuk</span>
                </button>
              ) : (
                onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer font-display"
                  >
                    <span>Keluar</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* MIDDLE ROW: Tabs (Full width on mobile to easily select, Auto width on desktop) */}
          <div className="w-full md:w-auto bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('portal')}
              className={`flex-1 md:flex-initial text-center px-4 py-1.5 rounded-lg text-xs font-bold font-display transition-all flex items-center justify-center gap-1 ${
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
              className={`flex-1 md:flex-initial text-center px-4 py-1.5 rounded-lg text-xs font-bold font-display transition-all flex items-center justify-center gap-1 ${
                activeTab === 'promo'
                  ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🌐 Landing Info</span>
            </button>
          </div>
          
          {/* DESKTOP RIGHTS: Visible ONLY on medium and larger viewports */}
          <div className="hidden md:flex items-center space-x-3.5">
            {currentUser && (
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider mt-0.5">{currentUser.role}</span>
              </div>
            )}

            {currentUser && currentUser.role !== 'Warga' && (
              <button 
                type="button"
                onClick={onEnterApp}
                className="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md gap-1.5 items-center cursor-pointer font-display"
              >
                <span>Kelola Admin RT</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}

            {!currentUser ? (
              <button
                type="button"
                onClick={onLoginClick}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer font-display shadow-md shadow-emerald-600/15"
              >
                <span>Masuk Akun RT</span>
              </button>
            ) : (
              onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-650 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer font-display"
                >
                  <span>Keluar</span>
                </button>
              )
            )}
          </div>
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

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3.5 max-w-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=300"
                    alt="RT Modern"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Digitalisasi Mandiri RT {RTRW_CONTEXT.RT_PRIMARY}</p>
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
                  <div className="flex justify-between items-center bg-slate-800 p-2.5 rounded-xl border border-slate-700 mb-4">
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
                    <div className="grid grid-cols-3 gap-2 bg-slate-800 p-3 rounded-xl border border-slate-800/80">
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

          {/* INTERACTIVE NEIGHBORHOOD ENVIRONMENT DASHBOARD */}
          <section className="py-16 px-4 md:px-6 bg-slate-900 border-t border-slate-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-at-t from-emerald-950/40 via-transparent to-transparent pointer-events-none"></div>
            <div className="max-w-6xl mx-auto relative z-10">
              
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3.5 py-1 text-xs text-emerald-400 font-bold mb-3 uppercase tracking-wider font-mono">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Kondisi Lingkungan Kita</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Pusat Informasi & Pemantauan RT Terpadu
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-2 leading-relaxed">
                  Interaksi langsung untuk memahami kondisi riil lingkungan hunian Anda. Klik tombol-tombol interaktif untuk menyiram tanaman komplek, simulasikan cuaca hujan ekstrim, atau bunyikan kentongan darurat!
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. ECO-SYSTEM MONITOR */}
                <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between hover:border-slate-700/60 transition-all text-left">
                  <div>
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                          <Wind className="w-4 h-4" />
                        </div>
                        <h4 className="font-display font-bold text-sm text-white">Eko-Hijau & Sanitasi</h4>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">Live</span>
                    </div>

                    <div className="space-y-5">
                      {/* AQI Indicator */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Index Kualitas Udara (AQI)</span>
                          <span className={`font-bold font-mono px-2 py-0.5 rounded text-[10px] ${
                            aqiLevel < 20 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {aqiLevel} ({aqiLevel < 20 ? 'Sangat Baik' : 'Baik'})
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              aqiLevel < 20 ? 'bg-emerald-500' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(10, aqiLevel * 1.5))}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Green Index */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Rasio Rerimbunan Komplek (Greenery)</span>
                          <span className="font-bold font-mono text-emerald-400">{greenLevel}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-500" 
                            style={{ width: `${greenLevel}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Trash Bin Fullness */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Kapasitas Bak Sampah Terpadu</span>
                          <span className={`font-bold font-mono ${
                            trashFullness > 80 ? 'text-rose-400' : 'text-slate-300'
                          }`}>{trashFullness}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              trashFullness > 80 ? 'bg-rose-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${trashFullness}%` }}
                          ></div>
                        </div>
                        {trashFullness > 80 && (
                          <span className="text-[9px] text-rose-400 block font-light">🚨 Kapasitas hampir penuh! Perlu laporan pengangkutan.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        setGreenLevel(98);
                        triggerAlert(
                          "Siram Tanaman Berhasil!",
                          "Terima kasih atas partisipasi hijau Anda! Anda menyiram tanaman hias & pepohonan di halaman Balai RW. Indikator Rerimbunan meningkat ke 98%.",
                          "success"
                        );
                      }}
                      className="bg-emerald-600 hover:bg-emerald-505 text-white font-bold py-2 px-2.5 rounded-xl text-[10px] transition font-display flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Droplet className="w-3.5 h-3.5" />
                      <span>Siram Tanaman 💧</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTrashFullness(12);
                        triggerAlert(
                          "Laporan Sampah Terkirim!",
                          "Laporan bak sampah penuh terkirim langsung ke Petugas Kebersihan RT. Kapasitas diturunkan menjadi 12% via simulasi penanganan cepat.",
                          "success"
                        );
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-2 px-2.5 rounded-xl text-[10px] transition font-display flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Kosongkan Sampah 🗑️</span>
                    </button>
                  </div>
                </div>

                {/* 2. MICRO-WEATHER & WATER FLOOD PREVENTER */}
                <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between hover:border-slate-700/60 transition-all text-left">
                  <div>
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                          <CloudRain className="w-4 h-4" />
                        </div>
                        <h4 className="font-display font-bold text-sm text-white">Saluran Air & Drainase</h4>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 select-none">Sensor air</span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-left">
                        <p className="text-[10px] text-zinc-400 font-mono">SIMULASI CUACA SEKITAR CLUSTER</p>
                        <h5 className="font-bold text-xs text-white mt-1 flex items-center gap-1.5 font-display">
                          {heavyRainSimulated ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-rose-505 animate-ping"></span>
                              <span className="text-rose-450 font-black">Hujan Lebat (Badai Mikro)</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span>Cerah Berawan (Kondusif)</span>
                            </>
                          )}
                        </h5>
                        <p className="text-[10px] text-slate-500 mt-1">Suhu rata-rata malam: {heavyRainSimulated ? '23°C' : '28°C'} | Kelembaban: {heavyRainSimulated ? '92%' : '65%'}</p>
                      </div>

                      {/* Water Sensor Gauge */}
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-slate-400">Sensor Genangan Selokan</span>
                          <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                            heavyRainSimulated ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {pintuAirLevel} cm ({heavyRainSimulated ? 'SIAGA BANJIR' : 'KERING/AMAN'})
                          </span>
                        </div>
                        
                        {/* Interactive Warning Banner */}
                        {heavyRainSimulated && (
                          <div className="bg-amber-500/10 border border-amber-500/25 p-2 rounded-xl text-[10px] text-amber-300 space-y-1">
                            <p className="font-bold">⚠️ Panduan Mitigasi RT:</p>
                            <p className="font-light leading-relaxed">Air selokan naik cepat. Mohon tidak parkir kendaraan di pinggir jalan dekat selokan luar, pastikan sampah teras depan tidak menyumbat jeruji besi.</p>
                          </div>
                        )}
                        
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                          <div 
                            className={`h-full transition-all duration-700 ${
                              heavyRainSimulated ? 'bg-rose-500' : 'bg-teal-500'
                            }`}
                            style={{ width: `${pintuAirLevel}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !heavyRainSimulated;
                        setHeavyRainSimulated(nextState);
                        if (nextState) {
                          triggerAlert(
                            "Simulasi Hujan Lebat Aktif!",
                            "Kondisi saluran mendeteksi naiknya ketinggian air menjadi 82% (Siaga). Indikator mading menyarankan gotong-royong pembersihan got.",
                            "info"
                          );
                        } else {
                          triggerAlert(
                            "Simulasi Hujan Dinonaktifkan",
                            "Cuaca kembali kondusif, sensor pendeteksi genangan air selokan surut ke level aman (18cm).",
                            "success"
                          );
                        }
                      }}
                      className={`w-full font-bold py-2.5 px-4 rounded-xl text-[11px] transition font-display flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                        heavyRainSimulated 
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/10'
                          : 'bg-slate-850 hover:bg-slate-800 hover:text-white text-slate-300 border border-slate-700'
                      }`}
                    >
                      <CloudRain className={`w-3.5 h-3.5 ${heavyRainSimulated ? 'animate-bounce' : ''}`} />
                      <span>{heavyRainSimulated ? 'Padamkan Cuaca Hujan' : 'Simulasikan Hujan Lebat ✨'}</span>
                    </button>
                  </div>
                </div>

                {/* 3. SHIELD & SECURITY (KENTONGAN ALARM & CCTV) */}
                <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between hover:border-slate-700/60 transition-all text-left">
                  <div>
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <h4 className="font-display font-bold text-sm text-white">Keamanan & Siskamling</h4>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 rounded uppercase font-mono font-bold select-none">Siaga</span>
                    </div>

                    <div className="space-y-4 text-left">
                      {/* CCTV Dropdown Preview */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Beralih Kamera CCTV Pos RT:</label>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {['Pos Keamanan Gerbang', 'Balai Pertemuan', 'Tikungan Gang SB-2'].map((cam) => (
                            <button
                              key={cam}
                              type="button"
                              onClick={() => setActiveCctv(cam)}
                              className={`shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                                activeCctv === cam 
                                  ? 'bg-rose-600 text-white font-display' 
                                  : 'bg-slate-900 hover:bg-slate-805 text-slate-400 border border-slate-800'
                              }`}
                            >
                              {activeCctv === cam ? '🎥 ' : ''}{cam.split(' ')[0]}
                            </button>
                          ))}
                        </div>

                        {/* CCTV Visual Simulation Card with curated images */}
                        <div className="relative h-28 rounded-2xl bg-zinc-900 overflow-hidden border border-slate-800 mt-2 flex items-center justify-center">
                          <img 
                            src={
                              activeCctv.includes('Gerbang') 
                                ? 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300' 
                                : activeCctv.includes('Balai') 
                                ? 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?w=300'
                                : 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=300'
                            } 
                            alt="CCTV stream" 
                            className="w-full h-full object-cover filter brightness-[0.4] saturate-[0.5]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-slate-950/80 p-2 flex justify-between items-center text-[8.5px] font-mono">
                            <span className="text-rose-450 animate-pulse flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              REC LIVE • {activeCctv}
                            </span>
                            <span className="text-slate-400">CCTV #04</span>
                          </div>
                          
                          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs p-1.5 rounded-lg text-[9px] font-mono text-zinc-300 border border-white/5">
                            Status: <span className="font-bold text-emerald-400">AKTIF & AMAN</span>
                          </div>
                        </div>
                      </div>

                      {/* Kentongan Interactive Alarm count */}
                      <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-2xl border border-slate-850">
                        <div className="relative">
                          {kentonganAlertCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center animate-ping"></span>
                          )}
                          <div className="p-2.5 bg-rose-100/5 text-rose-400 rounded-xl">
                            <Video className="w-4 h-4 text-rose-400" />
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-500 font-mono">ALARM KENTONGAN ONLINE</p>
                          <p className="text-xs text-slate-200 mt-0.5">
                            {kentonganAlertCount === 0 ? 'Belum ada alarm terdengar.' : `Kentongan dipukul ${kentonganAlertCount}x malam ini!`}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        const newCount = kentonganAlertCount + 1;
                        setKentonganAlertCount(newCount);
                        triggerKentonganDispatch();
                        triggerAlert(
                          "🚨 KENTONGAN DIGITAL AKTIF!",
                          `Kentongan darurat online berhasil disiarkan! Saksikan visualisasi pengiriman real-time WhatsApp Gateway ke nomor masing-masing pengurus RT & RW di bawah ini secara instan.`,
                          "info"
                        );
                      }}
                      className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded-xl text-[11px] transition font-display flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-900/10"
                    >
                      <Volume2 className="w-4 h-4 animate-bounce" />
                      <span>Pukul Kentongan Online (Alarm Lingkungan)</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* DISPATCH PROGRESS CARD */}
              {showKentonganDispatch && (
                <div className="mt-8 bg-slate-950 border border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5 text-left font-sans animate-fadeIn">
                  
                  {/* Top Header with live status and active pulse */}
                  <div className="bg-emerald-950/40 border-b border-slate-850 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <span className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </div>
                      <div>
                        <h4 className="font-display font-black text-sm text-emerald-400 tracking-wide uppercase font-mono">
                          🚨 WA-GATEWAY KONEKTIVITAS AKTIF
                        </h4>
                        <p className="text-xs text-slate-300 font-sans mt-0.5 font-bold">
                          Sistem Pengiriman Notifikasi & Tanggapan Darurat Kentongan RT/RW
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full select-none">
                      <span>Gateway IP: 192.168.1.101</span>
                      <span className="text-emerald-400">• Online</span>
                    </div>
                  </div>

                  {/* Body grid */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Pipeline / Progress list (Left side: 4 columns) */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-850">
                        <h5 className="font-display font-bold text-xs text-white uppercase tracking-wider mb-3">
                          Pipeline Pengiriman
                        </h5>
                        
                        <div className="space-y-4">
                          {/* Step 1 */}
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                              activeDispatchStep >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                            }`}>
                              1
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200">Komersialisasi & Tag Profil</p>
                              <p className="text-[10px] text-slate-400">Mengaitkan warga: <span className="text-emerald-400 font-bold">{simulatedCitizen.name}</span> dari Blok {simulatedCitizen.block}/{simulatedCitizen.houseNumber}.</p>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                              activeDispatchStep >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                            }`}>
                              2
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200">Koneksi WhatsApp Server</p>
                              <p className="text-[10px] text-slate-400">
                                {activeDispatchStep >= 2 ? '✓ Terkoneksi sukses ke server broadcast Rukunin.' : 'Menghubungkan ke secure gateway...'}
                              </p>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                              activeDispatchStep >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                            }`}>
                              3
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200">Pengiriman Multi-salur</p>
                              <p className="text-[10px] text-slate-400">
                                {activeDispatchStep >= 3 ? '✓ Siaran selesai dikirim ke seluruh ponsel pengurus.' : 'Menyiapkan broadcast ke nomor ponsel...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Manual override instructions */}
                      <div className="bg-emerald-950/10 border border-emerald-500/20 p-4.5 rounded-2xl">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold mb-1">INTERAKTIF</span>
                        <h6 className="font-bold text-xs text-white">Simulasi Saling-Hubung WA</h6>
                        <p className="text-[11px] text-slate-400 mt-1 pb-3 leading-relaxed">
                          Anda dapat melihat bagaimana masing-masing pengurus bereaksi secara instan. Klik tombol hijau <span className="text-emerald-400 font-bold">"Simulasikan Respon Balasan"</span> pada tiap kartu pengurus di samping untuk merespon panggilan darurat warga!
                        </p>
                        <div className="border-t border-emerald-900/40 pt-3 flex justify-between items-center">
                          <span className="text-[10px] text-slate-500">Total Tanggap Saji:</span>
                          <span className="text-xs font-black text-emerald-400 font-mono">
                            {targetOfficers.filter(o => officerResponses[o.id]?.status === 'replied').length} dari 4 Pengurus
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Phones list (Right side: 8 columns) */}
                    <div className="lg:col-span-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {targetOfficers.map((officer) => {
                          const state = officerResponses[officer.id] || { status: 'sending' };
                          const resStatus = state.status;

                          return (
                            <div key={officer.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition flex flex-col justify-between">
                              {/* Officer header info */}
                              <div>
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80 mb-3.5">
                                  <img 
                                    src={officer.avatar} 
                                    alt={officer.name} 
                                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-700"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="overflow-hidden">
                                    <h6 className="font-bold text-xs text-white truncate leading-tight">{officer.name}</h6>
                                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{officer.role}</p>
                                  </div>
                                </div>

                                {/* Phone number row */}
                                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mb-3">
                                  <span>WA: {officer.phone}</span>
                                  
                                  {/* Delivery status pills */}
                                  <div className="flex items-center gap-1.5 font-sans font-bold text-[9px] uppercase tracking-wide">
                                    {resStatus === 'sending' && (
                                      <span className="text-slate-500 flex items-center gap-1 animate-pulse">
                                        ⏳ Mengirim...
                                      </span>
                                    )}
                                    {resStatus === 'sent' && (
                                      <span className="text-slate-400 bg-slate-850 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <Check className="w-3 h-3 text-slate-400" /> Terkirim
                                      </span>
                                    )}
                                    {(resStatus === 'read' || resStatus === 'replied') && (
                                      <span className="text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <CheckCheck className="w-3.5 h-3.5 text-sky-450" /> Dibaca
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* WhatsApp Message Bubble representation (like real WA) */}
                                <div className="space-y-2 mt-2">
                                  <div className="bg-[#054735]/40 border border-emerald-950/50 p-3 rounded-2xl rounded-tl-none text-[11px] text-slate-100 max-w-[95%] relative leading-relaxed">
                                    <p className="font-mono font-black text-rose-300 text-[9.5px] uppercase mb-1 flex items-center gap-1">
                                      <span>🚨 ALARM GEGANA ONLINE - RT 01</span>
                                    </p>
                                    <p className="font-light"><span className="text-slate-400">Status:</span> Danger Alert!</p>
                                    <p className="mt-1">Warga membunyikan kentongan darurat:</p>
                                    <p className="font-bold text-slate-100 bg-black/30 px-2 py-1 rounded my-1 border border-white/5">
                                      👤 {simulatedCitizen.name} <br />
                                      📍 Blok {simulatedCitizen.block} No. {simulatedCitizen.houseNumber}
                                    </p>
                                    <p className="text-[10px] text-emerald-400 font-light mt-1">Harap segera meluncur/buka monitor CCTV!</p>
                                    
                                    {/* Whatsapp bubble footer */}
                                    <div className="mt-2 text-right flex items-center justify-end gap-1 text-[8.5px] text-emerald-400/80 font-mono select-none">
                                      <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                      {resStatus === 'sending' ? (
                                        <span className="text-slate-500">⏳</span>
                                      ) : resStatus === 'sent' ? (
                                        <Check className="w-3 h-3 text-slate-400" />
                                      ) : (
                                        <CheckCheck className="w-3 h-3 text-sky-400" />
                                      )}
                                    </div>
                                  </div>

                                  {/* Simulated Response Bubble */}
                                  {resStatus === 'replied' && (
                                    <div className="bg-[#1e293b] border border-slate-800 p-3 rounded-2xl rounded-tr-none text-[11px] text-slate-100 max-w-[95%] ml-auto relative leading-relaxed animate-slideUp">
                                      <p className="font-bold text-emerald-400 text-[9.5px] uppercase mb-0.5 font-display flex items-center gap-1">
                                        <span>💬 Balasan {officer.name.split(' ')[0]}</span>
                                      </p>
                                      <p className="italic text-slate-200">"{state.replyText || officer.initialReply}"</p>
                                      
                                      <div className="mt-2 text-right text-[8.5px] text-slate-500 font-mono select-none">
                                        <span>{state.replyTime || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • Dibaca warga</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Interactive response button */}
                              <div className="mt-4 pt-3.5 border-t border-slate-800/65">
                                {resStatus !== 'replied' ? (
                                  <button
                                    type="button"
                                    disabled={resStatus === 'sending'}
                                    onClick={() => {
                                      setOfficerResponses(prev => ({
                                        ...prev,
                                        [officer.id]: {
                                          status: 'replied',
                                          replyText: officer.initialReply,
                                          replyTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                        }
                                      }));
                                      triggerAlert(
                                        `💬 Tanggapan ${officer.name} Diterima!`,
                                        `Respon balik dari ${officer.name} (${officer.role}): "${officer.initialReply}" telah dikoordinasikan langsung ke grup darurat RT.`,
                                        "success"
                                      );
                                    }}
                                    className={`w-full text-[10px] font-bold py-1.5 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                                      resStatus === 'sending'
                                        ? 'bg-slate-800/40 text-slate-600 border border-slate-850 cursor-not-allowed'
                                        : 'bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/25'
                                    }`}
                                  >
                                    {resStatus === 'sending' ? (
                                      <span>Menunggu Kirim...</span>
                                    ) : (
                                      <>
                                        <Smartphone className="w-3.5 h-3.5" />
                                        <span>Simulasikan Balasan {officer.name.split(' ')[0]} 📱</span>
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <div className="text-center text-[10px] font-mono text-emerald-400 bg-emerald-500/5 py-1 rounded-xl border border-emerald-500/10">
                                    🟢 Sedang dikoordinasikan di lapangan!
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Actions footer */}
                  <div className="bg-slate-905 border-t border-slate-850 px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-[10px] text-slate-400 select-none">
                      💡 <strong>Edukasi Siskamling:</strong> Kentongan online terintegrasi langsung dengan API Gateway WhatsApp untuk memastikan pemantauan komprehensif saat terjadi krisis.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowKentonganDispatch(false)}
                      className="bg-slate-800 hover:bg-slate-755 text-slate-300 font-bold py-1.5 px-3.5 rounded-lg text-[10px] transition cursor-pointer"
                    >
                      Tutup Monitor Dispatch ×
                    </button>
                  </div>

                </div>
              )}

              {/* SECTION 4: DETAILED PUBLIC AMENITIES BOOKING MONITOR AND SIMULATOR */}
              <div className="mt-6 bg-slate-950/60 border border-slate-800 p-6 rounded-3xl text-left font-sans">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800 mb-6">
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-white flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-emerald-400" />
                      Jadwal Pemakaian & Peminjaman Inventaris Balai RT
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Warga bebas meminjam inventaris milik rukun warga secara gratis untuk keperluan acara resmi.</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">100% TRANSPARAN</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
                  {/* Public amenities list */}
                  {['Balai Pertemuan', 'Lapangan Bulutangkis', 'Genset Portable RT', 'Tenda Besi Acara'].map((facility) => {
                    const isBooked = facilityBooked[facility];
                    const borrower = facilityBorrower[facility];
                    const isSelected = selectedFacilityName === facility;

                    return (
                      <button
                        key={facility}
                        type="button"
                        onClick={() => setSelectedFacilityName(facility)}
                        className={`text-left p-4 rounded-2xl transition hover:shadow-lg border flex flex-col justify-between cursor-pointer ${
                          isSelected 
                            ? 'border-emerald-500 bg-emerald-505/5 ring-1 ring-emerald-500/20' 
                            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300'
                        }`}
                      >
                        <div>
                          <span className="text-[9px] uppercase font-mono tracking-widest text-slate-505 block mb-1">INVENTARIS</span>
                          <span className="font-bold text-xs text-white block truncate">{facility}</span>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded ${
                            isBooked ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {isBooked ? 'Sedang Dipakai' : 'Tersedia'}
                          </span>
                          {isBooked && (
                            <span className="text-[9px] text-slate-400 block font-light truncate max-w-[80px]" title={borrower}>
                              {borrower.split(' ').slice(0, 2).join(' ')}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Simulated booking action panel */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mt-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans">
                  <div>
                    <span className="text-[9px] bg-slate-800 text-zinc-450 rounded px-2 py-0.5 uppercase tracking-wider font-mono font-bold block w-fit mb-1">Pilihan Aktif</span>
                    <span className="font-bold text-slate-200 block text-xs font-display">Kondisi {selectedFacilityName}:</span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {facilityBooked[selectedFacilityName] 
                        ? `Alat ini sedang dipinjam oleh: ${facilityBorrower[selectedFacilityName]}. Silakan hubungi bagian logistik RT bila mendesak.` 
                        : 'Alat ini saat ini berstatus BEBAS PINJAM. Anda dapat mengklik tombol ajukan pinjam untuk mesimulasikan pendaftaran nama Anda.'}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 w-full md:w-auto justify-end font-sans">
                    {facilityBooked[selectedFacilityName] ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFacilityBooked(prev => ({ ...prev, [selectedFacilityName]: false }));
                          setFacilityBorrower(prev => {
                            const copy = { ...prev };
                            delete copy[selectedFacilityName];
                            return copy;
                          });
                          triggerAlert(
                            "Pengembalian Inventaris Dicatat!",
                            `Inventaris [${selectedFacilityName}] berhasil dikembalikan ke gudang Balai RT. Statusnya kini bebas pinjam oleh warga lainnya.`,
                            "success"
                          );
                        }}
                        className="bg-rose-50/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/15 py-2 px-4 rounded-xl text-[11px] transition font-bold font-display cursor-pointer"
                      >
                        Bebaskan / Kembalikan Alat ↩️
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setFacilityBooked(prev => ({ ...prev, [selectedFacilityName]: true }));
                          setFacilityBorrower(prev => ({ ...prev, [selectedFacilityName]: `${simulatedCitizen.name} (Acara Kompleks)` }));
                          triggerAlert(
                            "Booking Peminjaman Berhasil!",
                            `Pembookingan [${selectedFacilityName}] atas nama Anda (${simulatedCitizen.name}) berhasil diverifikasi sistem RT secara otomatis gratis. Alat sekarang bertanda 'Sedang Dipakai'.`,
                            "success"
                          );
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-xl text-[11px] transition font-bold font-display cursor-pointer font-sans"
                      >
                        Ajukan Pinjam Alat/Fasilitas 🤝
                      </button>
                    )}
                  </div>
                </div>

              </div>
              
            </div>
          </section>

          {/* Core Feature Grid */}
          <section id="fitur" className="py-16 px-4 md:px-6 bg-slate-50 border-t border-slate-100">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-xs font-bold mb-3">LAYANAN MANDIRI</div>
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
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setActiveTab('portal');
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="w-full text-left bg-white border border-slate-200 hover:border-emerald-500/40 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-semibold ${f.color}`}>
                            <Icon className="w-5 h-5 text-current" />
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-full">{f.tag}</span>
                        </div>
                        <h4 className="font-display text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                          {f.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          {f.desc}
                        </p>
                      </div>
                      <div className="w-full pt-3 border-t border-slate-100 flex items-center text-[11px] text-emerald-600 font-bold gap-1 mt-auto group-hover:text-emerald-700">
                        <span>Coba di Portal Warga</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
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

              <div className="relative group rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-white font-display flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Presensi Pos Ronda Aktif
                  </span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded">RT {RTRW_CONTEXT.RT_PRIMARY} / RW {RTRW_CONTEXT.RW}</span>
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

                <div className="pt-2 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-500/10 px-3 py-1.5 rounded-full tracking-wider">
                    SITUASI LINGKUNGAN: KONDUSIF & AMAN
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('portal');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-[10px] transition-all border border-slate-705 cursor-pointer flex items-center justify-center gap-1 font-display"
                  >
                    <span>Lapor / Kirim Aspirasi Ronda</span>
                    <ChevronRight className="w-3 h-3 text-emerald-400" />
                  </button>
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
          <section id="harga" className="py-12 px-4 md:px-6 bg-slate-50 border-t border-slate-200">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md relative overflow-hidden">
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
          {!currentUser ? (
            <div className="max-w-md mx-auto py-16 text-center">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-100">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">Akses Portal Warga Terkunci</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Silakan masuk/login dengan akun warga Anda untuk mengakses layanan mandiri seperti membayar iuran wajib, memohon surat pengantar, dan berpartisipasi dalam polling warga.
                </p>
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="w-full bg-emerald-600 hover:bg-emerald-505 text-white font-bold py-3 rounded-xl text-xs font-display transition shadow-md shadow-emerald-600/15 cursor-pointer"
                >
                  Masuk Akun Warga
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Section banner overview with happy volunteers photo */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-md flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800')] bg-cover bg-center opacity-10"></div>
                
                <div className="flex items-center space-x-4 relative z-10 text-left">
                  <div className="p-3 bg-white/10 rounded-2xl shrink-0">
                    <Building className="w-8 h-8 text-emerald-100" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-emerald-100 bg-white/10 px-2 py-0.5 rounded tracking-wider font-mono">DASHBOARD MANDIRI WARGA</span>
                    <h2 className="font-display font-black text-xl sm:text-2xl mt-1 text-white">Portal Layanan Mandiri Warga RT {RTRW_CONTEXT.RT_PRIMARY}</h2>
                    <p className="text-xs text-emerald-50 max-w-xl mt-1 leading-relaxed">
                      Layanan mandiri warga untuk memohon surat keterangan, setor pembayaran kas iuran bulanan, salurkan aspirasi lingkungan, dan ikut polling rukun warga secara transparan.
                    </p>
                  </div>
                </div>

                {currentUser && currentUser.role !== 'Warga' && (
                  <button
                    onClick={onEnterApp}
                    className="bg-slate-900 text-emerald-300 hover:bg-slate-800 border border-slate-800 text-xs font-bold px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer font-display relative z-10 shrink-0"
                  >
                    <span>Buka Menu Pengurus (Admin RT)</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </button>
                )}
              </div>

              <div className="max-w-5xl mx-auto space-y-6">
                
                {/* KEY INFORMATION PORTAL CONTAINER */}
                <div className="space-y-6 text-left">

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
                    <span className="bg-slate-100 text-slate-600 font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">
                      SI-WARGA DIGITAL RT {RTRW_CONTEXT.RT_PRIMARY}
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
                  <span className="text-[9px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 border border-emerald-200/50 rounded-full font-mono uppercase tracking-wider">
                    {simulatedCitizen.relationship}
                  </span>
                  <span className="text-[9px] font-bold bg-indigo-50 text-indigo-800 px-2.5 py-1 border border-indigo-200/50 rounded-full uppercase tracking-wider">
                    {simulatedCitizen.occupation}
                  </span>
                </div>
              </div>

              {/* PORTAL VIEW NAVIGATION BAR */}
              <div className="flex border-b border-slate-200 mt-2 mb-6 gap-6 text-xs sm:text-sm font-display font-medium">
                <button
                  type="button"
                  onClick={() => setCitizenPortalTab('layanan')}
                  className={`pb-3 relative transition-all cursor-pointer ${
                    citizenPortalTab === 'layanan' 
                      ? 'text-emerald-600 font-extrabold border-b-2 border-emerald-500' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Layanan Mandiri Warga
                </button>
                <button
                  type="button"
                  onClick={() => setCitizenPortalTab('profil')}
                  className={`pb-3 relative transition-all cursor-pointer ${
                    citizenPortalTab === 'profil' 
                      ? 'text-emerald-600 font-extrabold border-b-2 border-emerald-500' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Profil Saya &amp; Riwayat
                </button>
              </div>

              {citizenPortalTab === 'layanan' ? (
                <>
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
                            <div key={bill.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
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
                        <div key={bill.id} className="mt-2 pt-3 border-t border-slate-100 space-y-4">
                          {/* Payment Method Option Selector */}
                          <div className="space-y-1.5">
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
                          </div>

                          {/* DRAG AND DROP ZONE */}
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-slate-700 font-display flex justify-between items-center">
                              <span>Upload Bukti Pembayaran / Struk Transfer:</span>
                              <span className="text-[10px] text-emerald-600 font-normal">
                                {selectedIuranMethod === 'Cash' ? '(Opsional untuk Cash)' : '(Wajib)'}
                              </span>
                            </label>
                            
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDraggingReceipt(true);
                              }}
                              onDragLeave={() => setIsDraggingReceipt(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDraggingReceipt(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  handleReceiptFileRead(e.dataTransfer.files[0]);
                                }
                              }}
                              className={`border-2 border-dashed rounded-xl p-4 transition-all text-center relative ${
                                isDraggingReceipt
                                  ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                                  : uploadedReceiptFile
                                  ? 'border-emerald-500/40 bg-emerald-50/5 shadow-inner'
                                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                              }`}
                            >
                              <input
                                id="receipt-file-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleReceiptFileRead(e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                              />

                              {uploadedReceiptFile ? (
                                <div className="space-y-2.5">
                                  {/* Preview Card */}
                                  <div className="flex justify-center">
                                    <div className="relative group rounded-lg overflow-hidden border border-emerald-500/20 max-h-32 shadow-md">
                                      <img
                                        src={uploadedReceiptFile}
                                        alt="Pratinjau Bukti Transfer"
                                        className="h-24 w-auto object-contain"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150">
                                        <p className="text-[10px] text-white">Struk Terbaca</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-100 rounded-lg py-1.5 px-2.5 max-w-sm mx-auto">
                                    <div className="flex items-center space-x-2 truncate pr-2">
                                      <FileImage className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span className="text-slate-700 font-mono text-[10.5px] truncate font-bold">
                                        {uploadedReceiptName || 'Bukti_Transfer_Digital.png'}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setUploadedReceiptFile(null);
                                        setUploadedReceiptName('');
                                      }}
                                      className="p-1 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer transition shrink-0"
                                      title="Batalkan Lampiran"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <label
                                  htmlFor="receipt-file-input"
                                  className="cursor-pointer block space-y-1 py-2"
                                >
                                  <UploadCloud className="w-7 h-7 text-emerald-600 opacity-80 mx-auto animate-bounce" />
                                  <p className="text-xs font-semibold text-slate-700 font-display">
                                    Tarik & lepas berkas ke sini, atau <span className="text-emerald-600 hover:underline">Pilih File</span>
                                  </p>
                                  <p className="text-[9.5px] text-slate-400 font-mono">
                                    Format gambar JPG, PNG (Maksimal 5MB)
                                  </p>
                                </label>
                              )}
                            </div>
                          </div>

                          {/* Amount and Submit Button */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="number"
                              value={payIuranAmount}
                              onChange={(e) => setPayIuranAmount(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full sm:w-1/2 p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                              placeholder="Jumlah iuran Rp"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if ((selectedIuranMethod === 'Transfer Bank' || selectedIuranMethod === 'E-wallet') && !uploadedReceiptFile) {
                                  triggerAlert(
                                    "Bukti Gambar Diperlukan!",
                                    `Metode transfer ${selectedIuranMethod} mewajibkan upload foto atau screenshot struk bukti pembayaran terlebih dahulu sebagai dasar audit pembukuan Bendahara RT!`,
                                    "info"
                                  );
                                  return;
                                }
                                handlePayIuran(bill);
                              }}
                              className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-lg transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-display"
                            >
                              <CreditCard className="w-3.5 h-3.5 text-emerald-300 animate-pulse shrink-0" />
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

                {/* AUTOMATED WHATSAPP NOTIFICATION DISPATCH TO TREASURER SIMULATOR */}
                {showIuranWaNotif && iuranWaPayload && (
                  <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl overflow-hidden shadow-xl text-left p-5 text-slate-200 animate-fadeIn space-y-4">
                    <div className="flex flex-col md:flex-row gap-5">
                      {/* Telemetry pipeline metrics (left) */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="flex h-2.5 w-2.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="font-display font-black text-xs text-emerald-400 tracking-wider">
                              AUTOMATED WA GATEWAY LOGS
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            TRX-ID: #IUR-{new Date().getFullYear()}{Math.floor(1000 + Math.random() * 9000)}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Mewakili integrasi WhatsApp otomatis untuk mempercepat audit kuitansi oleh Bendahara RT (Ibu Fatimah Hasan - 0812-3456-7801).
                          </p>
                        </div>

                        {/* Pipeline status indicators */}
                        <div className="space-y-3 font-mono text-[11px]">
                          {/* Step 1 */}
                          <div className="flex items-start gap-2 text-slate-300">
                            <div className="mt-0.5 shrink-0">
                              {iuranWaStep >= 1 ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-405 text-emerald-400" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 bg-slate-950 animate-pulse" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-200">1. Template WA Payload Compiler</p>
                              <p className="text-[10px] text-slate-500 font-sans">
                                Mengompilasi format kiriman setoran Rp {iuranWaPayload.amount.toLocaleString('id-ID')} ({iuranWaPayload.method}).
                              </p>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="flex items-start gap-2 text-slate-300">
                            <div className="mt-0.5 shrink-0">
                              {iuranWaStep >= 2 ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : iuranWaStep === 1 ? (
                                <div className="w-3.5 h-3.5 rounded-full border border-emerald-500 bg-emerald-950 animate-spin" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 bg-slate-950" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-bold ${iuranWaStep >= 2 ? 'text-slate-205 text-slate-205' : 'text-slate-500'}`}>2. Uploading Audit Attachment</p>
                              <p className="text-[10px] text-slate-500 font-sans">
                                Mengunggah & mengenkripsi bukti {iuranWaPayload.fileName} ke server WhatsApp CDN.
                              </p>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="flex items-start gap-2 text-slate-300">
                            <div className="mt-0.5 shrink-0">
                              {iuranWaStep >= 3 ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : iuranWaStep === 2 ? (
                                <div className="w-3.5 h-3.5 rounded-full border border-emerald-500 bg-emerald-950 animate-spin" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 bg-slate-950" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-bold ${iuranWaStep >= 3 ? 'text-slate-200' : 'text-slate-500'}`}>3. Sync WA API Handshake</p>
                              <p className="text-[10px] text-slate-500 font-sans">
                                Melakukan otentikasi aman API Rukunin-WA ke Gerbang Operator Lokal.
                              </p>
                            </div>
                          </div>

                          {/* Step 4 */}
                          <div className="flex items-start gap-2 text-slate-300">
                            <div className="mt-0.5 shrink-0">
                              {iuranWaStep >= 4 ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                              ) : iuranWaStep === 3 ? (
                                <div className="w-3.5 h-3.5 rounded-full border border-emerald-500 bg-emerald-950 animate-spin" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 bg-slate-950" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-bold ${iuranWaStep >= 4 ? 'text-slate-205 text-slate-200' : 'text-slate-500'}`}>4. Message Dispatched</p>
                              <p className="text-[10px] text-slate-500 font-sans">
                                Berhasil mendarat di HP Ibu Fatimah Hasan. Status: Delivered (Sent ☑️☑️).
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive WhatsApp Device Preview Box (right) */}
                      <div className="w-full md:w-64 bg-[#0b141a] border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between shadow-inner">
                        {/* WA Top bar */}
                        <div className="bg-[#075e54] p-2.5 flex items-center justify-between text-white">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-slate-700 border border-emerald-500/20 overflow-hidden flex items-center justify-center shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=60"
                                alt="Fatimah Hasan"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <p className="text-[10.5px] font-bold leading-none font-display">Ibu Fatimah (Bendahara)</p>
                              <span className="text-[8px] text-emerald-100 font-sans">Online & Meninjau</span>
                            </div>
                          </div>
                          <span className="text-[8px] bg-emerald-950/40 text-emerald-300 py-0.5 px-1.5 rounded font-mono">RT 01</span>
                        </div>

                        {/* WA Chats content area */}
                        <div className="p-3 space-y-3 min-h-48 bg-[#0b141a] text-[10.5px] flex flex-col justify-end leading-normal select-none relative overflow-y-auto max-h-64 scrollbar-thin">
                          {/* Message from Gateway */}
                          {iuranWaStep >= 1 && (
                            <div className="bg-[#005c4b] text-slate-100 rounded-lg rounded-tl-none p-2.5 max-w-[95%] self-start text-left shadow-sm relative animate-fadeIn">
                              <p className="font-bold text-emerald-305 text-emerald-300 text-[9px] uppercase font-mono tracking-wider border-b border-white/10 pb-0.5 mb-1.5 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                                RUKUNIN WA GATEWAY OUTBOUND
                              </p>
                              
                              <div className="text-[10px] font-mono whitespace-pre-wrap leading-relaxed select-text font-medium text-emerald-50">
                                {iuranWaPayload.rawMessage || `Sedang mengompilasi setoran...`}
                              </div>

                              <span className="text-[8px] text-emerald-200 block text-right mt-1.5 font-mono">
                                {iuranWaPayload.date} {iuranWaStep >= 4 ? '☑️☑️' : '☑️'}
                              </span>
                            </div>
                          )}

                          {/* Response from Treasurer */}
                          {iuranWaReply && (
                            <div className="bg-[#202c33] text-slate-200 rounded-lg rounded-tr-none p-2.5 max-w-[90%] self-end text-left shadow-sm animate-fadeIn">
                              <p className="font-sans text-[10.5px]">
                                Siap, notifikasi kas masuk sudah saya terima! Bukti transfer warga senilai <span className="text-emerald-400 font-bold">Rp {iuranWaPayload.amount.toLocaleString('id-ID')}</span> segera saya periksa silang dengan rekening koran RT sebelum rilis kuitansi sah lunasnya.
                              </p>
                              <span className="text-[8px] text-slate-400 block text-right mt-1.5 font-mono">
                                {iuranWaPayload.date}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Interactive trigger at bottom */}
                        <div className="bg-slate-900 border-t border-slate-800 p-2 text-center">
                          {!iuranWaReply ? (
                            <button
                              type="button"
                              disabled={iuranWaStep < 4}
                              onClick={() => {
                                setIuranWaReply(true);
                                triggerAlert(
                                  "Konfirmasi Balasan Bendahara!",
                                  "Ibu Fatimah Hasan mengirim tanggapan WhatsApp otomatis mengonfirmasi setoran dan bersiap mengaudit mutas bank RT!",
                                  "success"
                                );
                              }}
                              className={`w-full py-2 px-3 rounded-xl text-[10.5px] font-bold tracking-tight transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                iuranWaStep < 4
                                  ? 'bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed'
                                  : 'bg-emerald-600/15 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 shadow-xs'
                              }`}
                            >
                              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Simulasikan Balasan Bendahara RT</span>
                            </button>
                          ) : (
                            <div className="text-[10px] text-emerald-400 bg-emerald-500/5 py-1.5 rounded-lg border border-emerald-500/10 font-mono font-bold animate-pulse">
                              🟢 Sedang dalam Peninjauan Unit Audit
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}


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
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                            <div key={req.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
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
                        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <p className="text-xs text-slate-400 italic">Sedang tidak ada mufakat/polling yang aktif.</p>
                        </div>
                      ) : (
                        polls.filter(p => p.status === 'Aktif').map((poll) => {
                          const hasCitizenVoted = poll.votedUserIds.includes(simulatedCitizen.id);

                          return (
                            <div key={poll.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left">
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
                          className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
              </>
              ) : (
                <ProfilSayaView 
                  citizen={simulatedCitizen} 
                  iurans={iurans} 
                  letters={letters} 
                  onTriggerAlert={triggerAlert} 
                />
              )}


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
                        <div key={ann.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
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
                          <span className="text-[10px] text-slate-500 font-medium mt-2 block">
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
                          <div key={evt.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden text-xs flex flex-col sm:flex-row shadow-xs">
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
                                  <span className="text-[9px] font-bold bg-white text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
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
          </>)}
        </section>
      )}

      {/* Shared Space Frame Footer */}
      <footer className="bg-slate-900 text-slate-350 py-12 px-6 border-t border-slate-800 text-xs font-display">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
                R
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-white text-base tracking-tight leading-none">Rukunin Digital</span>
                <span className="text-[9px] text-emerald-400 tracking-wider font-mono">PORTAL RT MANDIRI 04</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px] max-w-sm">
              Sistem Informasi Pelayanan RT Modern nomor wahid di Indonesia. Menyatukan administrasi warga, transparansi kas keuangan, gotong royong, dan siskamling darurat.
            </p>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Navigasi Utama</h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('promo');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white hover:underline transition-all cursor-pointer text-left focus:outline-none"
                >
                  🌐 Landing Info Utama
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('portal');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white hover:underline transition-all cursor-pointer text-left focus:outline-none"
                >
                  📱 Portal Simulasi Warga
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onEnterApp}
                  className="hover:text-white hover:underline transition-all cursor-pointer text-left focus:outline-none"
                >
                  👑 Dashboard Pengurus (Admin RT)
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Layanan Mandiri Warga</h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('portal');
                    setTimeout(() => {
                      const el = document.querySelector('[placeholder="Jumlah iuran Rp"]');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }}
                  className="hover:text-white hover:underline transition-all cursor-pointer text-left focus:outline-none"
                >
                  💵 Setor Pembayaran Iuran
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('portal');
                    setTimeout(() => {
                      const el = document.querySelector('[placeholder="Contoh: Mengurus pendaftaran pernikahan anak pertama di KUA atau pengurusan KTP hilang di kelurahan."]');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 105);
                  }}
                  className="hover:text-white hover:underline transition-all cursor-pointer text-left focus:outline-none"
                >
                  📝 Ajukan Surat Keterangan / Pengantar
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('portal');
                    setTimeout(() => {
                      const el = document.querySelector('[placeholder="Laporkan kondisi sampah tidak diangkut, usulan kegiatan, masukan, kritik lingkungan komplek dll..."]');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 110);
                  }}
                  className="hover:text-white hover:underline transition-all cursor-pointer text-left focus:outline-none"
                >
                  🔮 Salurkan Aspirasi & Saran Lingkungan
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 Rukunin Digital Inc. Kelola RT Terbuka, Transparan, Hebat, dan Mandiri.</p>
          <div className="flex space-x-4">
            <span>SIP RT MODERN • KODE KEPENDUDUKAN 04</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
