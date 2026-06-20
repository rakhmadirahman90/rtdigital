/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileSpreadsheet, Printer, Users, Wallet, TrendingUp, TrendingDown, Target, Building, Shield } from 'lucide-react';
import { Citizen, Transaction, IuranStatus } from '../types';

interface LaporanProps {
  citizens: Citizen[];
  transactions: Transaction[];
  iurans: IuranStatus[];
}

export default function LaporanView({ citizens, transactions, iurans }: LaporanProps) {
  // Calculations
  const maleCount = citizens.filter(c => c.gender === 'L').length;
  const femaleCount = citizens.filter(c => c.gender === 'P').length;
  const totalWarga = citizens.length;
  const malePercent = totalWarga > 0 ? Math.round((maleCount / totalWarga) * 100) : 0;
  const femalePercent = totalWarga > 0 ? Math.round((femaleCount / totalWarga) * 100) : 0;

  // Occupations compile
  const occupationsMap: Record<string, number> = {};
  citizens.forEach(c => {
    const job = c.occupation || 'Belum diisi';
    occupationsMap[job] = (occupationsMap[job] || 0) + 1;
  });
  const occupations = Object.entries(occupationsMap).map(([name, count]) => ({ name, count }));

  // Cash Ledger compiles
  const totalBalance = transactions.reduce((sum, t) => t.type === 'pemasukan' ? sum + t.amount : sum - t.amount, 0);
  const totalIn = transactions.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.amount, 0);

  // Billing compiles
  const activeMonthIurans = iurans.filter(i => i.month === '2026-06');
  const paidCount = activeMonthIurans.filter(i => i.status === 'Lunas').length;
  const totalBillCount = activeMonthIurans.length;
  const iuranPercent = totalBillCount > 0 ? Math.round((paidCount / totalBillCount) * 100) : 0;

  const formatCurrency = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full select-none font-sans print:bg-white print:p-0">
      {/* Header (hidden on printer) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5 print:hidden">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            Hasil Laporan & Konsolidasi Data RT
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Unduh rekapitulasi audit kependudukan warga RT 04, bagan gender dan status kas lunas iuran bulanan warga.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Laporan Bulanan</span>
        </button>
      </div>

      {/* PRINT-ONLY OFFICIAL HEADER */}
      <div className="hidden print:block text-center border-b-4 border-double border-slate-900 pb-4 mb-8">
        <h2 className="text-xl font-bold font-serif uppercase">Laporan Bulanan Komite Rukun Tetangga 04 / RW 12</h2>
        <p className="text-xs text-slate-600 mt-1 font-mono">Kelurahan Jagakarsa, Jakarta Selatan, DKI Jakarta | PERIODE JUNI 2026</p>
      </div>

      {/* Main Stats Digest layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card A: Census statistics */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 print:border-slate-400">
          <h3 className="font-display font-semibold text-slate-805 text-sm flex items-center gap-2 border-b border-slate-150 pb-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Statistik Demografi Sensus
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-550 font-medium">Total Sampel Warga</span>
              <span className="font-bold text-slate-900 font-mono text-sm">{totalWarga} Jiwa</span>
            </div>

            {/* Gender graphic representation bars */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center font-medium">
                <span className="text-blue-600">Laki-Laki ({maleCount} org)</span>
                <span className="text-rose-500">Perempuan ({femaleCount} org)</span>
              </div>
              <div className="h-3.5 bg-rose-150 rounded-full overflow-hidden flex">
                <div style={{ width: `${malePercent}%` }} className="bg-blue-500 h-full"></div>
                <div style={{ width: `${femalePercent}%` }} className="bg-rose-455 h-full"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{malePercent}% Laki-Laki</span>
                <span>{femalePercent}% Perempuan</span>
              </div>
            </div>

            {/* Occupations compile */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sebaran Profesi Pekerjaan</span>
              <div className="space-y-2 text-xs">
                {occupations.map(occ => {
                  const percent = Math.round((occ.count / totalWarga) * 100);
                  return (
                    <div key={occ.name} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-650 font-medium">
                        <span>{occ.name}</span>
                        <span>{occ.count} Jiwa ({percent}%)</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-slate-700 h-full"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Card B: Cash Flow Balance Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 print:border-slate-400">
          <h3 className="font-display font-semibold text-slate-805 text-sm flex items-center gap-2 border-b border-slate-150 pb-2">
            <Wallet className="w-4 h-4 text-emerald-600" />
            Laporan Arus Buku Kas RT
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-1.5 border-b border-dashed border-slate-100 items-center">
              <span className="flex items-center gap-1.5 text-slate-500">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Dana Masuk (Debit)
              </span>
              <span className="font-bold text-teal-600 font-mono">{formatCurrency(totalIn)}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-dashed border-slate-100 items-center">
              <span className="flex items-center gap-1.5 text-slate-500">
                <TrendingDown className="w-4 h-4 text-rose-500" />
                Dinas Keluar (Kredit)
              </span>
              <span className="font-bold text-rose-600 font-mono">{formatCurrency(totalOut)}</span>
            </div>

            <div className="flex justify-between py-3 items-center bg-slate-50 rounded-lg px-3.5 border border-slate-150">
              <span className="font-bold text-slate-800">Saldo Kas Bersih</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{formatCurrency(totalBalance)}</span>
            </div>

            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              *Arus dana masuk bersumber dari iuran wajib bulanan KK RT, sumbangan sukarela pemakaman, serta sponsor kegiatan agustusan.
            </p>
          </div>
        </div>

        {/* Card C: Iuran Dues collection rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 print:border-slate-400">
          <h3 className="font-display font-semibold text-slate-850 text-sm flex items-center gap-2 border-b border-slate-150 pb-2">
            <Target className="w-4 h-4 text-emerald-600" />
            Efisiensi Penarikan Iuran
          </h3>

          <div className="space-y-5 text-center flex flex-col items-center">
            {/* Beautiful visual circle gauge using CSS/SVGs directly */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Animated progress circle ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeWidth="3.5"
                  strokeDasharray={`${iuranPercent}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display font-extrabold text-slate-900 text-lg font-mono leading-none">{iuranPercent}%</span>
                <span className="text-[8px] text-slate-400 uppercase font-bold mt-1 tracking-wider">Lunas</span>
              </div>
            </div>

            <div className="space-y-1 w-full text-xs text-slate-700">
              <div className="flex justify-between items-center py-1">
                <span>KK Lunas Bulan Ini (Juni 2026):</span>
                <span className="font-bold text-slate-900 font-mono">{paidCount} dari {totalBillCount} KK</span>
              </div>
              <div className="flex justify-between items-center py-1 text-rose-650 font-medium">
                <span>Belum Setor / Menunggak:</span>
                <span className="font-bold font-mono">{totalBillCount - paidCount} KK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature block on printer */}
      <div className="hidden print:flex justify-between text-xs mt-16 px-10 border-t border-slate-200 pt-8 font-serif">
        <div className="text-center space-y-14">
          <span>Mengetahui, <br /> Ketua RW 12</span>
          <div className="font-bold underline">( ........................ )</div>
        </div>
        <div className="text-center space-y-14">
          <span>Jakarta, 20 Juni 2026 <br /> Ketua RT 04 / RW 12</span>
          <div className="font-bold underline">PAK RT FAUZAN</div>
        </div>
      </div>
    </div>
  );
}
