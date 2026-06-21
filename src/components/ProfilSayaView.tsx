import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Award, 
  Shield, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Save, 
  Briefcase, 
  Heart, 
  Mail, 
  Calendar, 
  Fingerprint, 
  Activity, 
  Edit3, 
  Check, 
  BookOpen, 
  MapPin 
} from 'lucide-react';
import { Citizen, IuranStatus, LetterRequest } from '../types';
import { saveDocument } from '../firebase';
import { RTRW_CONTEXT } from '../utils/constants';

interface ProfilSayaViewProps {
  citizen: Citizen;
  iurans: IuranStatus[];
  letters: LetterRequest[];
  onTriggerAlert: (title: string, message: string, type?: 'success' | 'info') => void;
}

export default function ProfilSayaView({ 
  citizen, 
  iurans, 
  letters, 
  onTriggerAlert 
}: ProfilSayaViewProps) {
  
  // Local edit states
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>(citizen.phone);
  const [occupation, setOccupation] = useState<string>(citizen.occupation);
  const [birthDate, setBirthDate] = useState<string>(citizen.birthDate || '');
  const [nik, setNik] = useState<string>(citizen.nik || '');
  const [gender, setGender] = useState<'L' | 'P'>(citizen.gender);
  const [relationship, setRelationship] = useState<string>(citizen.relationship);
  const [notes, setNotes] = useState<string>(citizen.notes || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filter individual statistics
  const myIurans = iurans.filter(i => i.block === citizen.block && i.houseNumber === citizen.houseNumber);
  
  // Filter historical letters
  const myLetters = letters.filter(l => 
    l.applicantId === citizen.id || 
    l.applicantName.toLowerCase() === citizen.name.toLowerCase()
  );

  // Stats calculation
  const totalPaidIuran = myIurans.filter(i => i.status === 'Lunas').length;
  const pendingIuran = myIurans.filter(i => i.status === 'Menunggu Verifikasi').length;
  const unpaidIuran = myIurans.filter(i => i.status === 'Belum Bayar').length;

  const totalLetters = myLetters.length;
  const pendingLetters = myLetters.filter(l => l.status === 'Menunggu').length;
  const approvedLetters = myLetters.filter(l => l.status === 'Disetujui').length;
  const rejectedLetters = myLetters.filter(l => l.status === 'Ditolak').length;

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updated: Citizen = {
        ...citizen,
        phone,
        occupation,
        gender,
        birthDate: birthDate || undefined,
        nik: nik || undefined,
        relationship: relationship as any,
        notes: notes || undefined
      };

      await saveDocument('citizens', updated);
      setIsEditing(false);
      onTriggerAlert(
        "Profil Berhasil Diperbarui!",
        "Data kependudukan & info kontak Anda telah disimpan dengan aman di database Firestore RT 01.",
        "success"
      );
    } catch (err) {
      console.error("Failed to update profile:", err);
      onTriggerAlert(
        "Gagal Menyimpan Profil",
        "Terjadi kesalahan saat menyimpan perubahan profil Anda. Silakan coba lagi.",
        "info"
      );
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* PROFILE OVERVIEW HERO BAR CARD */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img 
                src={getAvatarUrl(citizen.name, citizen.gender)} 
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border-4 border-slate-800 shadow-xl shrink-0 bg-slate-950" 
                alt={citizen.name}
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-slate-900 shadow">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase font-mono">
                  Warga Terverifikasi RT {RTRW_CONTEXT.RT_PRIMARY}
                </span>
                <span className="text-[10px] bg-slate-800/80 text-indigo-300 font-bold px-2 py-0.5 rounded-full font-mono">
                  BLOK {citizen.block}/{citizen.houseNumber}
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{citizen.name}</h1>
              <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-slate-500" />
                  NIK: {citizen.nik || 'Belum diisi'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  {citizen.phone || 'Belum diisi'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 font-display cursor-pointer hover:scale-[1.02] ${
              isEditing 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-250 border border-slate-700' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Batalkan Edit' : 'Edit Info Kontak'}</span>
          </button>
        </div>

        {/* METRICS ROW INSIDE HERO */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/60 font-mono">
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/40">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Iuran Lunas</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold text-emerald-400">{totalPaidIuran}</span>
              <span className="text-xs text-slate-400">Periode</span>
            </div>
          </div>
          
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/40">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Iuran Menunggu</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-xl font-bold ${pendingIuran > 0 ? 'text-amber-400' : 'text-slate-400'}`}>{pendingIuran}</span>
              <span className="text-xs text-slate-500">Kuitansi</span>
            </div>
          </div>

          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/40">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Permohonan Surat</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold text-indigo-400">{totalLetters}</span>
              <span className="text-xs text-slate-400">Total</span>
            </div>
          </div>

          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/40">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Surat Pending</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-xl font-bold ${pendingLetters > 0 ? 'text-amber-400' : 'text-slate-400'}`}>{pendingLetters}</span>
              <span className="text-xs text-slate-500">Antrian</span>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1: EDIT / DATA KELUARGA INFO CARDS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-5">
              <User className="w-5 h-5 text-emerald-600" />
              <h3 className="font-display font-bold text-slate-900 text-sm">
                {isEditing ? 'Form Edit Info Kontak' : 'Detail Info Kependudukan'}
              </h3>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveContact} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nomor Telepon / WhatsApp
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs font-mono">
                      +62
                    </span>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="812xxxxxx"
                      required
                      className="w-full pl-11 pr-3 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Digunakan untuk simulasian WhatsApp Gateway bendahara.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Pekerjaan Saat Ini
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute top-3.5 left-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="e.g. Swasta / PNS / Mahasiswa"
                      required
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition bg-white"
                    >
                      <option value="L">Laki-Laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Hubungan KK
                    </label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition bg-white"
                    >
                      <option value="Kepala Keluarga">Kepala Keluarga</option>
                      <option value="Istri">Istri</option>
                      <option value="Anak">Anak</option>
                      <option value="Orang Tua">Orang Tua</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nomor Induk Kependudukan (NIK)
                  </label>
                  <div className="relative">
                    <Fingerprint className="absolute top-3.5 left-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      maxLength={16}
                      placeholder="16-digit NIK KTP Anda"
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Tanggal Lahir
                  </label>
                  <div className="relative">
                    <Calendar className="absolute top-3.5 left-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Catatan Domisili Warga
                  </label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan tambahan hunian atau status tinggal..."
                    rows={2}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs font-display flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-600/15"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Pembaruan'}</span>
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
                  <div className="flex justify-between py-1.5 border-b border-slate-200/50">
                    <span className="text-slate-400 font-mono">Hubungan Keluarga</span>
                    <span className="font-bold text-slate-800">{citizen.relationship}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/50">
                    <span className="text-slate-400 font-mono">Profesi Pekerjaan</span>
                    <span className="font-bold text-slate-800">{citizen.occupation}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/50">
                    <span className="text-slate-400 font-mono">Status Tinggal</span>
                    <span className="font-bold text-slate-800">
                      {citizen.isResident ? 'Menetap (Warga RT)' : 'Musiman / Kontrak'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/50">
                    <span className="text-slate-400 font-mono">Jenis Kelamin</span>
                    <span className="font-bold text-slate-800">
                      {citizen.gender === 'L' ? 'Laki-Laki (L)' : 'Perempuan (P)'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400 font-mono">Tanggal Lahir</span>
                    <span className="font-bold text-slate-800">
                      {citizen.birthDate ? new Date(citizen.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum diisi'}
                    </span>
                  </div>
                </div>

                <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl">
                  <span className="text-[10px] text-indigo-800 font-black block tracking-wider uppercase font-mono mb-1">
                    ALAMAT HUNIAN SAH
                  </span>
                  <p className="text-slate-700 leading-relaxed font-mono">
                    Blok {citizen.block} Nomor {citizen.houseNumber}, RT {RTRW_CONTEXT.RT_PRIMARY}, RW {RTRW_CONTEXT.RW}, Kelurahan {RTRW_CONTEXT.KELURAHAN}, Kecamatan {RTRW_CONTEXT.KECAMATAN}
                  </p>
                </div>

                {citizen.notes && (
                  <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl text-[11px] text-amber-900">
                    <span className="font-bold block mb-1">Catatan Domisili:</span>
                    <p className="leading-relaxed italic">"{citizen.notes}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2 & 3: HISTORICAL TRACKERS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TRACKER 1: PAYMENT HISTORY OF MONTHLY IURAN */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm">Riwayat Pembayaran Iuran Kas</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">TERHUBUNG DENGAN LEDGER KAS RT01</p>
                </div>
              </div>
              
              <div className="flex gap-1.5">
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 py-1 px-2.5 rounded-lg border border-emerald-100 font-mono">
                  {totalPaidIuran} Lunas
                </span>
                {unpaidIuran > 0 && (
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-800 py-1 px-2.5 rounded-lg border border-rose-100 font-mono">
                    {unpaidIuran} Tunggakan
                  </span>
                )}
              </div>
            </div>

            {myIurans.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Hunian Anda belum memiliki data tagihan iuran terdaftar.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myIurans.map((bill) => {
                  let statusBadge = "";
                  let statusText = "";
                  
                  if (bill.status === 'Lunas') {
                    statusBadge = "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20";
                    statusText = "Lunas & Sah";
                  } else if (bill.status === 'Menunggu Verifikasi') {
                    statusBadge = "bg-amber-100 text-amber-800 border border-amber-200";
                    statusText = "Menunggu Verifikasi Toko/Transfer";
                  } else {
                    statusBadge = "bg-rose-50 text-rose-800 border border-rose-100";
                    statusText = "Belum Lunas";
                  }

                  const formattedPay = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(bill.amountPaid || 250000);

                  return (
                    <div 
                      key={bill.id} 
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:bg-slate-100/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 tracking-wider">BUKT-ID</span>
                          <span className="text-[10px] font-bold text-slate-800 bg-slate-200/60 px-1.5 py-0.5 rounded">
                            #{bill.id.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-display font-medium text-slate-800 text-xs">
                          Iuran Bulan: <strong>{new Date(bill.month + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</strong>
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>Metode: {bill.paymentMethod || 'Belum bayar'}</span>
                          <span>•</span>
                          <span>Oleh: {bill.recordedBy || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                        <span className="text-slate-900 font-black text-xs sm:text-right block">
                          {formattedPay}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase block text-center ${statusBadge}`}>
                          {statusText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* TRACKER 2: HISTORICAL / PENDING STATUS OF LETTERS REQUESTS */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm">Status Permohonan Surat Pengantar</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">SINKRONISASI SEKRETARIS RT 01</p>
                </div>
              </div>

              <div className="flex gap-1">
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-800 py-1 px-2.5 rounded-lg border border-indigo-100 font-mono">
                  {approvedLetters} Disetujui
                </span>
                {pendingLetters > 0 && (
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-800 py-1 px-2.5 rounded-lg border border-amber-100 font-mono animate-pulse">
                    {pendingLetters} Diproses
                  </span>
                )}
              </div>
            </div>

            {myLetters.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <BookOpen className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Bapak/Ibu belum pernah mengajukan surat pengantar digital.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myLetters.map((req) => {
                  let badge = "bg-slate-100 text-slate-800";
                  let icon = <Clock className="w-4 h-4 text-amber-500" />;
                  let label = "Menunggu Antrian";

                  if (req.status === 'Disetujui') {
                    badge = "bg-emerald-50 text-emerald-800 border border-emerald-100";
                    icon = <CheckCircle className="w-4 h-4 text-emerald-500" />;
                    label = "Selesai (Diunduh)";
                  } else if (req.status === 'Ditolak') {
                    badge = "bg-rose-50 text-rose-800 border border-rose-100";
                    icon = <XCircle className="w-4 h-4 text-rose-500" />;
                    label = "Ditolak Pengurus";
                  }

                  return (
                    <div 
                      key={req.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-start text-xs font-mono"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-bold tracking-wider py-0.5 px-2 rounded-full uppercase flex items-center gap-1 ${badge}`}>
                            {icon}
                            <span>{label}</span>
                          </span>
                          
                          {req.letterNumber && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                              No: {req.letterNumber}
                            </span>
                          )}
                        </div>

                        <h4 className="font-display font-medium text-slate-800 font-sans text-xs">
                          {req.letterType}
                        </h4>

                        <div className="text-[11px] text-slate-500 space-y-1 bg-white/70 p-2.5 rounded-xl border border-slate-150">
                          <div><span className="text-slate-400">Keperluan:</span> {req.purpose}</div>
                          <div><span className="text-slate-400">Diajukan:</span> {req.submittedDate}</div>
                          {req.approvedDate && (
                            <div><span className="text-emerald-600 font-bold">Tanggal Disetujui:</span> {req.approvedDate}</div>
                          )}
                        </div>

                        {req.status === 'Ditolak' && req.rejectedReason && (
                          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-900 text-[10.5px]">
                            <strong>Alasan Penolakan:</strong> <span className="italic">"{req.rejectedReason}"</span>
                          </div>
                        )}
                      </div>

                      {req.status === 'Disetujui' && (
                        <div className="w-full md:w-auto shrink-0 md:self-center">
                          <span className="inline-block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer">
                            Cetak Kertas Surat
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
