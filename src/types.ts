/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Citizen {
  id: string;
  name: string;
  block: string;
  houseNumber: string;
  rtNumber: string;
  gender: 'L' | 'P';
  relationship: 'Kepala Keluarga' | 'Istri' | 'Anak' | 'Lainnya' | 'Orang Tua' | 'Asisten Rumah Tangga';
  occupation: string;
  phone: string;
  isResident: boolean; // Menetap vs Musiman
  birthDate?: string;
  nik?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'pemasukan' | 'pengeluaran';
  amount: number;
  description: string;
  source: 'Kas RT' | 'Iuran Bulanan' | 'Donasi Warga' | 'Sponsor' | 'Lainnya' | 'Operasional Ronda' | 'Sosial/Duka';
  category: string;
  recordedBy: string;
}

export interface IuranStatus {
  id: string; // block-no-month
  block: string;
  houseNumber: string;
  month: string; // Format: YYYY-MM (e.g. 2026-06)
  amountPaid: number;
  paidDate?: string;
  paymentMethod?: 'Cash' | 'Transfer Bank' | 'E-wallet';
  status: 'Lunas' | 'Belum Bayar' | 'Menunggu Verifikasi';
  recordedBy?: string;
  receiptImage?: string;
  uploadedFileName?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'umum' | 'darurat' | 'kegiatan' | 'pembangunan';
  author: string;
  isPinned?: boolean;
}

export interface CommunityEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'Gotong Royong' | 'Posyandu' | 'Rapat RT' | 'Keagamaan' | 'Sosialisasi' | 'Lainnya';
  status: 'Akan Datang' | 'Selesai' | 'Batal';
}

export interface LetterRequest {
  id: string;
  letterNumber?: string;
  applicantId: string;
  applicantName: string;
  applicantGender?: 'L' | 'P';
  applicantAddress: string;
  letterType: 'Surat Pengantar Domisili' | 'Surat Pengantar Pembuatan KK' | 'Surat Pengantar KTP' | 'Surat Keterangan Kurang Mampu' | 'Surat Pengantar Nikah' | 'Surat Keterangan Kematian';
  purpose: string;
  submittedDate: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  approvedDate?: string;
  rejectedReason?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  status: 'Aktif' | 'Selesai';
  endDate: string;
  votedUserIds: string[]; // List of user names/IDs who voted
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  category: string;
  isLocal: boolean; // Local RT vs Public service
}

export interface InventoryItem {
  id: string;
  name: string;
  totalQuantity: number;
  goodQuantity: number;
  damagedQuantity: number;
  location: string;
  borrowedQuantity: number;
  notes?: string;
}

export interface BorrowRequest {
  id: string;
  citizenName: string;
  itemName: string;
  quantity: number;
  borrowDate: string;
  returnDate: string;
  status: 'Menunggu' | 'Disetujui' | 'Selesai' | 'Ditolak';
  notes?: string;
}

export interface RondaSchedule {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  officers: string[]; // List of Citizen Names
  coordinates?: string; // Patrol coordinates or area focus
}

export interface SecurityIncident {
  id: string;
  date: string;
  time: string;
  reporterName: string;
  type: 'Pencurian' | 'Orang Mencurigakan' | 'Kebakaran' | 'Ketertiban Umum' | 'Lainnya';
  description: string;
  status: 'Investigasi' | 'Selesai' | 'Darurat';
}

export interface FeedbackSuggestion {
  id: string;
  senderName: string;
  senderContact: string;
  content: string;
  date: string;
  status: 'Belum Dibaca' | 'Ditinjau' | 'Selesai';
  reply?: string;
}

export interface RTManager {
  id: string;
  name: string;
  role: string;
  phone: string;
  imageUrl?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Superadmin' | 'Pengurus RT' | 'Warga' | 'Security';
  isActive: boolean;
  lastLogin?: string;
}
