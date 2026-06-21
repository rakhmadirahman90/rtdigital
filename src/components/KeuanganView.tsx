/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  X,
  CreditCard,
  Check,
  Receipt,
  Download,
  Eye,
  FileImage
} from 'lucide-react';
import { Transaction, IuranStatus, Citizen } from '../types';

interface KeuanganProps {
  transactions: Transaction[];
  iurans: IuranStatus[];
  citizens: Citizen[];
  onAddTransaction: (newTx: Omit<Transaction, 'id'>) => void;
  onUpdateIuran: (updatedIuran: IuranStatus) => void;
}

export default function KeuanganView({
  transactions,
  iurans,
  citizens,
  onAddTransaction,
  onUpdateIuran
}: KeuanganProps) {
  const [activeTab, setActiveTab] = useState<'kas' | 'iuran'>('kas');
  const [showTxModal, setShowTxModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<{ block: string; houseNo: string } | null>(null);
  const [previewReceiptImage, setPreviewReceiptImage] = useState<string | null>(null);
  const [previewReceiptName, setPreviewReceiptName] = useState<string>('');

  // Filter states
  const [txSearch, setTxSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<'all' | 'pemasukan' | 'pengeluaran'>('all');
  const [txSourceFilter, setTxSourceFilter] = useState<string>('All');

  // New Transaction Form State
  const [txForm, setTxForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'pemasukan' as 'pemasukan' | 'pengeluaran',
    amount: '',
    description: '',
    source: 'Kas RT' as any,
    category: 'Iuran Warga'
  });

  // New Payment Form State
  const [payForm, setPayForm] = useState({
    amount: '250000',
    month: '2026-06',
    paymentMethod: 'Cash' as 'Cash' | 'Transfer Bank' | 'E-wallet',
  });

  // Calculate stats
  const totalBalance = transactions.reduce((sum, t) => t.type === 'pemasukan' ? sum + t.amount : sum - t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.amount, 0);

  // Filtered transactions
  const filteredTx = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(txSearch.toLowerCase()) || 
                          t.category.toLowerCase().includes(txSearch.toLowerCase());
    const matchesType = txTypeFilter === 'all' || t.type === txTypeFilter;
    const matchesSource = txSourceFilter === 'All' || t.source === txSourceFilter;
    return matchesSearch && matchesType && matchesSource;
  });

  // Unique list of households from citizens list
  const householdsMap: Record<string, { block: string; houseNo: string; owner: string }> = {};
  citizens.forEach(c => {
    const key = `${c.block}-${c.houseNumber}`;
    if (!householdsMap[key]) {
      householdsMap[key] = {
        block: c.block,
        houseNo: c.houseNumber,
        owner: c.relationship === 'Kepala Keluarga' ? c.name : ''
      };
    } else if (c.relationship === 'Kepala Keluarga') {
      householdsMap[key].owner = c.name;
    }
  });

  // Complete household representation if owner is missing fallback
  const households = Object.values(householdsMap).map(h => {
    if (!h.owner) {
      const firstWarga = citizens.find(c => c.block === h.block && c.houseNumber === h.houseNo);
      h.owner = firstWarga ? firstWarga.name : 'Anggota Warga';
    }
    return h;
  });

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.amount || !txForm.description) return;

    onAddTransaction({
      date: txForm.date,
      type: txForm.type,
      amount: parseFloat(txForm.amount),
      description: txForm.description,
      source: txForm.source,
      category: txForm.category,
      recordedBy: 'Ibu RT' // Default recordedBy as treasurer
    });

    setTxForm({
      date: new Date().toISOString().split('T')[0],
      type: 'pemasukan',
      amount: '',
      description: '',
      source: 'Kas RT',
      category: 'Iuran Warga'
    });
    setShowTxModal(false);
  };

  // Recording an unpaid household's dues payment
  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHouse) return;

    const block = selectedHouse.block;
    const houseNo = selectedHouse.houseNo;
    const key = `i-${block.replace(' ', '')}-${houseNo}-${payForm.month}`;

    const newIuran: IuranStatus = {
      id: key,
      block,
      houseNumber: houseNo,
      month: payForm.month,
      amountPaid: parseFloat(payForm.amount),
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: payForm.paymentMethod,
      status: 'Lunas',
      recordedBy: 'Ibu RT'
    };

    onUpdateIuran(newIuran);

    // Cross reference into Kas ledger
    const ownerName = households.find(h => h.block === block && h.houseNo === houseNo)?.owner || 'Warga';
    onAddTransaction({
      date: new Date().toISOString().split('T')[0],
      type: 'pemasukan',
      amount: parseFloat(payForm.amount),
      description: `Pembayaran Iuran ${payForm.month} Blok ${block} No ${houseNo} (${ownerName})`,
      source: 'Iuran Bulanan',
      category: 'Iuran Warga',
      recordedBy: 'Ibu RT'
    });

    setShowPayModal(false);
    setSelectedHouse(null);
  };

  // Approve a verification request
  const handleApproveVerify = (iuranReq: IuranStatus) => {
    const updated: IuranStatus = {
      ...iuranReq,
      status: 'Lunas',
      paidDate: new Date().toISOString().split('T')[0],
      recordedBy: 'Ibu RT'
    };
    onUpdateIuran(updated);

    const ownerName = households.find(h => h.block === iuranReq.block && h.houseNo === iuranReq.houseNumber)?.owner || 'Warga';
    onAddTransaction({
      date: new Date().toISOString().split('T')[0],
      type: 'pemasukan',
      amount: 250000, // standard dues
      description: `Konfirmasi Iuran Digital ${iuranReq.month} Blok ${iuranReq.block} No ${iuranReq.houseNumber} (${ownerName})`,
      source: 'Iuran Bulanan',
      category: 'Iuran Warga',
      recordedBy: 'Ibu RT'
    });
  };

  const formatCurrency = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Page header controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Wallet className="w-5 h-5" />
            </span>
            Transparansi Buku Keuangan RT
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Buku besar keuangan Kas RT, audit pengeluaran warga, dan kontrol tagihan iuran bulanan 100% terbuka.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="bg-slate-100 p-0.5 rounded-lg flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('kas')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'kas'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Riwayat Buku Kas</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('iuran')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'iuran'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Kontrol Iuran Warga</span>
          </button>
        </div>
      </div>

      {/* Overview stats strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Saldo Kas Bersih Tersedia</span>
            <span className="font-display text-xl font-bold block text-slate-900 mt-0.5">{formatCurrency(totalBalance)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Dana Masuk</span>
            <span className="font-display text-xl font-bold block text-emerald-700 mt-0.5">{formatCurrency(totalIncome)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Dana Operasional Keluar</span>
            <span className="font-display text-xl font-bold block text-rose-700 mt-0.5">{formatCurrency(totalExpense)}</span>
          </div>
        </div>
      </div>

      {activeTab === 'kas' ? (
        /* TAB 1: KAS RT LEDGER */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          {/* Filters shelf */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Type ledger */}
              <select
                value={txTypeFilter}
                onChange={(e: any) => setTxTypeFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
              >
                <option value="all">Semua Tipe Kas</option>
                <option value="pemasukan">📈 Kas Pemasukan</option>
                <option value="pengeluaran">📉 Kas Pengeluaran</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowTxModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm w-full md:w-auto justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Buku Kas Baru</span>
            </button>
          </div>

          {/* Transactions List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase select-none border-b border-slate-100">
                <tr>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Deskripsi / Catatan</th>
                  <th className="p-4">Sumber / Program</th>
                  <th className="p-4">Jumlah Transaksi</th>
                  <th className="p-4">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredTx.length > 0 ? (
                  filteredTx.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                        {t.date}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 block text-xs">{t.description}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full inline-block mt-1 font-semibold">{t.category}</span>
                      </td>
                      <td className="p-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                        {t.source}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`font-mono font-bold text-xs ${
                          t.type === 'pemasukan' ? 'text-teal-700' : 'text-rose-700'
                        }`}>
                          {t.type === 'pemasukan' ? '+' : '-'} {formatCurrency(t.amount)}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500 font-medium">
                        {t.recordedBy}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                      Tidak ada data transaksi kas yang sesuai filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAB 2: IURAN WARGA BILLING TABLE */
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs text-amber-800 space-y-1">
              <p className="font-bold">Periode Penagihan Aktif: Juni 2026</p>
              <p>Besaran tarif Iuran Bulanan ditetapkan sebesar <span className="font-bold">Rp 250.000 / KK</span> sesuai mufakat pembangunan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {households.map(hh => {
              // Find matching iuran status
              const record = iurans.find(i => i.block === hh.block && i.houseNumber === hh.houseNo && i.month === '2026-06');
              
              return (
                <div 
                  key={`${hh.block}-${hh.houseNo}`}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-bold block font-mono">BILING KK</span>
                        <h4 className="font-display font-semibold text-slate-900 text-sm mt-0.5">{hh.block} No. {hh.houseNo}</h4>
                        <span className="text-xs text-slate-500 block truncate mt-1">SDR: {hh.owner}</span>
                      </div>
                      
                      {/* Status pill */}
                      {record && record.status === 'Lunas' ? (
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Lunas
                        </span>
                      ) : record && record.status === 'Menunggu Verifikasi' ? (
                        <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                          <Clock className="w-3 h-3" />
                          Verifikasi
                        </span>
                      ) : (
                        <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <X className="w-3 h-3" />
                          Tunggakan
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 text-xs border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Iuran Juni 2026</span>
                      <span className="font-semibold text-slate-800 font-mono">Rp 250.000</span>
                    </div>

                     {record && record.status === 'Lunas' && (
                      <div className="text-[11px] text-slate-500 font-medium space-y-1.5">
                        <div className="flex justify-between">
                          <span>Metode Setor:</span>
                          <span className="font-semibold text-slate-700">{record.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span>Diterima:</span>
                          <span>{record.paidDate} ({record.recordedBy})</span>
                        </div>
                        {record.receiptImage && (
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewReceiptImage(record.receiptImage || null);
                              setPreviewReceiptName(record.uploadedFileName || 'Bukti_Transfer_Lunas.png');
                            }}
                            className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 mt-1 cursor-pointer transition hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Bukti Transfer</span>
                          </button>
                        )}
                      </div>
                    )}
                    {record && record.status === 'Menunggu Verifikasi' && (
                      <div className="space-y-2 mt-1.5">
                        <div className="bg-amber-100/50 border border-amber-200 text-amber-900 p-2 text-[10px] rounded leading-normal">
                          💡 Warga telah menyetorkan iuran secara digital via <strong>{record.paymentMethod || 'Transfer'}.</strong> Mohon periksa lampiran sebelum approve.
                        </div>

                        {/* Interactive thumbnail or fallback mockup receipt */}
                        <div className="border border-slate-200/80 bg-slate-50 hover:bg-slate-100/60 rounded-xl p-2.5 flex items-center justify-between gap-3 transition">
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-9 h-9 rounded bg-white border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                              {record.receiptImage ? (
                                <img
                                  src={record.receiptImage}
                                  alt="Bukti Transfer"
                                  className="w-full h-full object-cover cursor-zoom-in"
                                  referrerPolicy="no-referrer"
                                  onClick={() => {
                                    setPreviewReceiptImage(record.receiptImage || null);
                                    setPreviewReceiptName(record.uploadedFileName || 'Struk_Pembayaran.png');
                                  }}
                                />
                              ) : (
                                <FileImage className="w-4.5 h-4.5 text-zinc-400" />
                              )}
                            </div>
                            <div className="truncate text-left text-[11px]">
                              <p className="font-bold text-slate-700 truncate font-mono text-[10.5px]">
                                {record.uploadedFileName || 'Bukti_Transfer.png'}
                              </p>
                              <span className="text-[9px] text-slate-400 block font-mono">Pratinjau klik Buka</span>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              // If there is no custom upload (e.g. mock pending dues), we can generate a very cute high-performance mock transfer slip as a fallback!
                              const path = record.receiptImage || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600&auto=format&fit=crop&q=80';
                              setPreviewReceiptImage(path);
                              setPreviewReceiptName(record.uploadedFileName || 'Bukti_Simulasi_Siskamling.png');
                            }}
                            className="text-xs font-bold text-amber-700 bg-amber-500/10 hover:bg-amber-600 hover:text-white px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Buka</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    {record && record.status === 'Lunas' ? (
                      <button
                        type="button"
                        onClick={() => alert(`Struk Pembayaran digital generated:\nKK: ${hh.block} #${hh.houseNo}\nNama: ${hh.owner}\nStatus: Lunas\nMetode: ${record.paymentMethod}`)}
                        className="w-full text-center border border-emerald-200 hover:bg-emerald-50 text-emerald-800 font-semibold py-2 rounded-lg text-xs transition flex items-center justify-center space-x-1.5"
                      >
                        <Receipt className="w-4 h-4 text-emerald-600" />
                        <span>Unduh Struk Kwitansi</span>
                      </button>
                    ) : record && record.status === 'Menunggu Verifikasi' ? (
                      <button
                        type="button"
                        onClick={() => handleApproveVerify(record)}
                        className="w-full text-center bg-amber-600 hover:bg-amber-505 text-white font-bold py-2 rounded-lg text-xs transition flex items-center justify-center space-x-1.5 shadow-sm shadow-amber-600/10"
                      >
                        <Check className="w-4 h-4" />
                        <span>Konfirmasi Setor & Approve</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHouse({ block: hh.block, houseNo: hh.houseNo });
                          setShowPayModal(true);
                        }}
                        className="w-full text-center bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 rounded-lg text-xs transition flex items-center justify-center space-x-1.5 shadow-md shadow-rose-600/10"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Bayar Tunai / Transfer</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: INPUT TRANSACTION (KAS RT) */}
      {showTxModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Catat Transaksi Buku Kas Baru
              </h3>
              <button 
                type="button"
                onClick={() => setShowTxModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleTxSubmit} className="p-5 space-y-4 font-sans">
              {/* Type toggle */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Tipe Transaksi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxForm(prev => ({ ...prev, type: 'pemasukan' }))}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      txForm.type === 'pemasukan'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    📈 Pemasukan (Debit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxForm(prev => ({ ...prev, type: 'pengeluaran' }))}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      txForm.type === 'pengeluaran'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    📉 Pengeluaran (Kredit)
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Jumlah Nominal (Rupiah)*</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 250000"
                  value={txForm.amount}
                  onChange={(e) => setTxForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal*</label>
                <input
                  type="date"
                  required
                  value={txForm.date}
                  onChange={(e) => setTxForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                />
              </div>

              {/* Source program */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Alokasi Dana / Sumber*</label>
                <select
                  value={txForm.source}
                  onChange={(e) => setTxForm(prev => ({ ...prev, source: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                >
                  <option value="Kas RT">Kas RT Operasional</option>
                  <option value="Iuran Bulanan">Iuran Bulanan KK</option>
                  <option value="Donasi Warga">Donasi Sukarela Warga</option>
                  <option value="Sponsor">Sponsorship Kegiatan</option>
                  <option value="Operasional Ronda">Alokasi Keamanan Ronda</option>
                  <option value="Sosial/Duka">Dana Urusan Sosial</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Kategori Kebutuhan</label>
                <input
                  type="text"
                  placeholder="Contoh: Kebersihan, Keamanan, Hari Keagamaan"
                  value={txForm.category}
                  onChange={(e) => setTxForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Keterangan / Deskripsi Transaksi*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembelian bola lampu pos keamanan utama"
                  value={txForm.description}
                  onChange={(e) => setTxForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-220 rounded-lg text-sm bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTxModal(false)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-lg text-xs transition shadow-sm"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PAY IURAN Tagihan */}
      {showPayModal && selectedHouse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-slate-800 text-base">
                Catat Setoran Iuran Warga
              </h3>
              <button 
                type="button"
                onClick={() => { setShowPayModal(false); setSelectedHouse(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 text-xs rounded-lg space-y-1">
                <span className="text-slate-500 uppercase font-bold text-[9px] font-mono">Rumah Tujuan Setoran</span>
                <p className="font-display font-bold text-slate-800 text-sm">Blok {selectedHouse.block} No. {selectedHouse.houseNo}</p>
                <p className="text-slate-500 font-semibold">Besaran Tagihan: Rp 250.000 (Per-KK)</p>
              </div>

              {/* Month selecting */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Periode Bulan Tagihan</label>
                <select
                  value={payForm.month}
                  onChange={(e) => setPayForm(prev => ({ ...prev, month: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none"
                >
                  <option value="2026-06">Juni 2026</option>
                  <option value="2026-07">Juli 2026</option>
                  <option value="2026-05">Mei 2026</option>
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Metode Setoran*</label>
                <select
                  value={payForm.paymentMethod}
                  onChange={(e) => setPayForm(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none"
                >
                  <option value="Cash">Cash (Manual Tunai)</option>
                  <option value="Transfer Bank">Transfer Bank Digital</option>
                  <option value="E-wallet">E-Wallet (Gopay/OVO/Dana)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowPayModal(false); setSelectedHouse(null); }}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-lg text-xs transition"
                >
                  Konfirmasi Lunas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT IMAGE PREVIEW LIGHTBOX MODAL */}
      {previewReceiptImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            {/* Modal header */}
            <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h4 className="font-display font-black text-xs text-emerald-400 tracking-wide uppercase font-mono">
                  🔎 AUDIT BUKTI TRANSFER DIGITAL
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[240px] sm:max-w-md font-sans">
                  File: {previewReceiptName || 'Struk_Kwitansi.png'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setPreviewReceiptImage(null); setPreviewReceiptName(''); }}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
                title="Tutup Detil"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal content body with the image */}
            <div className="p-6 flex flex-col items-center justify-center bg-slate-950/60 leading-relaxed text-center">
              <div className="bg-white p-2.5 rounded-2xl border border-slate-850 max-h-[64vh] w-full flex items-center justify-center overflow-auto shadow-inner">
                <img
                  src={previewReceiptImage}
                  alt="Bukti Setoran / Transfer"
                  className="max-h-[50vh] w-auto object-contain rounded-xl select-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-4 flex w-full items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800 text-left text-[11.5px] text-slate-400 font-sans">
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Koneksi Aman Gateway RT
                </span>
                <span className="text-[10px] text-slate-500 font-mono">AUDIT LEVEL 1 SAKTI</span>
              </div>
            </div>

            {/* Modal footer */}
            <div className="bg-emerald-950/5 border-t border-slate-800 px-6 py-3.5 flex justify-end">
              <button
                type="button"
                onClick={() => { setPreviewReceiptImage(null); setPreviewReceiptName(''); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-xl text-xs transition cursor-pointer"
              >
                Selesai Memeriksa ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
