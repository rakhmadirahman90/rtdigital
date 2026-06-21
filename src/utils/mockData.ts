/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Citizen,
  Transaction,
  IuranStatus,
  Announcement,
  CommunityEvent,
  LetterRequest,
  Poll,
  EmergencyContact,
  InventoryItem,
  BorrowRequest,
  RondaSchedule,
  FeedbackSuggestion,
  RTManager,
  UserAccount
} from '../types';

export const INITIAL_CITIZENS: Citizen[] = [
  {
    id: 'c1',
    name: 'Fatimah Hasan',
    block: 'sd 1',
    houseNumber: '18',
    rtNumber: '01',
    gender: 'P',
    relationship: 'Istri',
    occupation: 'Bendahara RT 01',
    phone: '0812-3456-7801',
    isResident: true,
    nik: '3174092102870001',
    birthDate: '1987-02-21'
  },
  {
    id: 'c2',
    name: 'Hasnawati Sakka',
    block: 'sd 1',
    houseNumber: '18',
    rtNumber: '01',
    gender: 'P',
    relationship: 'Kepala Keluarga',
    occupation: 'Ketua RT 01',
    phone: '0812-4422-9901',
    isResident: true,
    nik: '3174091508860002',
    birthDate: '1986-08-15'
  },
  {
    id: 'c3',
    name: 'Putri Putri Putri',
    block: 'sb-2',
    houseNumber: '23',
    rtNumber: '01',
    gender: 'P',
    relationship: 'Kepala Keluarga',
    occupation: 'IRT',
    phone: '0812-3456-7803',
    isResident: true,
    nik: '3174094101900003',
    birthDate: '1990-01-11'
  },
  {
    id: 'c4',
    name: 'Andi Hermawan',
    block: 'sd 1',
    houseNumber: '12',
    rtNumber: '01',
    gender: 'L',
    relationship: 'Kepala Keluarga',
    occupation: 'Pegawai Swasta',
    phone: '0813-8822-1104',
    isResident: true,
    nik: '3174091212850004',
    birthDate: '1985-12-12'
  },
  {
    id: 'c5',
    name: 'Beni Cahyadi',
    block: 'sb-2',
    houseNumber: '10',
    rtNumber: '01',
    gender: 'L',
    relationship: 'Kepala Keluarga',
    occupation: 'Wirausaha',
    phone: '0811-9988-7705',
    isResident: true,
    nik: '3174090504820005',
    birthDate: '1982-04-05'
  },
  {
    id: 'c6',
    name: 'Citra Dewi',
    block: 'sa-3',
    houseNumber: '05',
    rtNumber: '01',
    gender: 'P',
    relationship: 'Istri',
    occupation: 'Sekretaris RT 01',
    phone: '0856-7766-5506',
    isResident: true,
    nik: '3174095509890006',
    birthDate: '1989-09-15'
  },
  {
    id: 'c7',
    name: 'Ilham',
    block: 'sa-3',
    houseNumber: '11',
    rtNumber: '02',
    gender: 'L',
    relationship: 'Kepala Keluarga',
    occupation: 'Ketua RT 02',
    phone: '0813-5533-8802',
    isResident: true,
    nik: '3174091112810007',
    birthDate: '1981-12-11'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    date: '2026-06-01',
    type: 'pemasukan',
    amount: 1500000,
    description: 'Saldo Kas RT Awal Bulan Juni',
    source: 'Kas RT',
    category: 'Saldo Awal',
    recordedBy: 'Fatimah Hasan'
  },
  {
    id: 't2',
    date: '2026-06-05',
    type: 'pemasukan',
    amount: 250000,
    description: 'Iuran Bulanan KK Blok sd 1 No 18 (Hasnawati Sakka)',
    source: 'Iuran Bulanan',
    category: 'Iuran Warga',
    recordedBy: 'Fatimah Hasan'
  },
  {
    id: 't3',
    date: '2026-06-08',
    type: 'pemasukan',
    amount: 250000,
    description: 'Iuran Bulanan KK Blok sd 1 No 12 (Andi Hermawan)',
    source: 'Iuran Bulanan',
    category: 'Iuran Warga',
    recordedBy: 'Fatimah Hasan'
  },
  {
    id: 't4',
    date: '2026-06-10',
    type: 'pemasukan',
    amount: 500000,
    description: 'Donasi Pembangunan Gapura Blok sd 1',
    source: 'Donasi Warga',
    category: 'Sumbangan',
    recordedBy: 'Hasnawati Sakka'
  },
  {
    id: 't5',
    date: '2026-06-12',
    type: 'pengeluaran',
    amount: 350000,
    description: 'Pembelian Sapu lidi & Tempat Sampah Pos Ronda',
    source: 'Operasional Ronda',
    category: 'Kebersihan',
    recordedBy: 'Andi Hermawan'
  },
  {
    id: 't6',
    date: '2026-06-15',
    type: 'pengeluaran',
    amount: 450000,
    description: 'Bantuan Sosial warga sakit (Ibu Sumi)',
    source: 'Sosial/Duka',
    category: 'Sosial',
    recordedBy: 'Fatimah Hasan'
  }
];

export const INITIAL_IURAN: IuranStatus[] = [
  // June 2026
  {
    id: 'i-sd1-18-2026-06',
    block: 'sd 1',
    houseNumber: '18',
    month: '2026-06',
    amountPaid: 250000,
    paidDate: '2026-06-05',
    paymentMethod: 'Transfer Bank',
    status: 'Lunas',
    recordedBy: 'Fatimah Hasan'
  },
  {
    id: 'i-sd1-12-2026-06',
    block: 'sd 1',
    houseNumber: '12',
    month: '2026-06',
    amountPaid: 250000,
    paidDate: '2026-06-08',
    paymentMethod: 'Transfer Bank',
    status: 'Lunas',
    recordedBy: 'Fatimah Hasan'
  },
  {
    id: 'i-sb2-23-2026-06',
    block: 'sb-2',
    houseNumber: '23',
    month: '2026-06',
    amountPaid: 0,
    status: 'Belum Bayar'
  },
  {
    id: 'i-sb2-10-2026-06',
    block: 'sb-2',
    houseNumber: '10',
    month: '2026-06',
    amountPaid: 0,
    status: 'Menunggu Verifikasi',
    recordedBy: 'Beni Cahyadi'
  },
  {
    id: 'i-sa3-05-2026-06',
    block: 'sa-3',
    houseNumber: '05',
    month: '2026-06',
    amountPaid: 0,
    status: 'Belum Bayar'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Gotong Royong Kebersihan Lingkungan & Fogging Nyamuk Lapadde',
    content: 'Dihimbau kepada seluruh warga RT 01 dan RT 02 Kelurahan Lapadde untuk dapat berpartisipasi dalam kegiatan kerja bakti massal yang akan dilaksanakan pada hari Minggu ini. Agenda utama adalah pembersihan saluran air (selokan) untuk mencegah genangan air, pemangkasan rumput liar, serta pelaksanaan fogging DBD. Mohon membawa peralatan kerja bakti masing-masing dari rumah.',
    date: '2026-06-18',
    category: 'kegiatan',
    author: 'Hasnawati Sakka (Ketua RT 01)',
    isPinned: true
  },
  {
    id: 'a2',
    title: 'Pemasangan Tombol Alarm & Sirine Darurat Baru di Pos Security',
    content: 'Telah dipasang tombol alarm darurat (panic button) di tiga titik strategis RT 01 serta alarm utama di Pos Security sd 1. Apabila terjadi hal mencurigakan atau darurat kesehatan pada malam hari, warga dapat menekan atau menghubungi grup pengurus RT untuk dapat segera direspon oleh petugas jaga ronda malam.',
    date: '2026-06-15',
    category: 'darurat',
    author: 'Andi Hermawan (Seksi Keamanan)'
  },
  {
    id: 'a3',
    title: 'Himbauan Pengisian Form Pajak Bumi & Bangunan (PBB) 2026',
    content: 'Pengumuman bagi seluruh pemilik rumah di area RT 01 Lapadde, diharapkan segera melampirkan fotokopi bukti lunas PBB tahun berjalan atau menunjukkan tanda terima digital ke Bendahara RT (Fatimah Hasan) untuk keperluan sinkronisasi kelurahan Lapadde paling lambat akhir bulan ini.',
    date: '2026-06-10',
    category: 'umum',
    author: 'Fatimah Hasan'
  }
];

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'e1',
    name: 'Kerja Bakti Kebersihan Lingkungan Lapadde',
    description: 'Pembersihan got, fogging DBD, dan perbaikan tiang bendera bersama seluruh warga.',
    date: '2026-06-21',
    time: '07:30',
    location: 'Area Fasos/Fasum Lapangan RW 07',
    category: 'Gotong Royong',
    status: 'Akan Datang'
  },
  {
    id: 'e2',
    name: 'Rapat Koordinasi Pengurus RT & Warga bulanan',
    description: 'Membahas anggaran perayaan HUT RI Tingkat RW 07 Lapadde dan evaluasi siskamling.',
    date: '2026-06-25',
    time: '19:30',
    location: 'Pendopo Al-Ikhlas Blok sd 1 No 18',
    category: 'Rapat RT',
    status: 'Akan Datang'
  },
  {
    id: 'e3',
    name: 'Posyandu Mawar Jingga Lapadde',
    description: 'Pemeriksaan tinggi berat badan, pemberian vitamin A, dan konsultasi gizi secara gratis.',
    date: '2026-06-28',
    time: '08:00',
    location: 'Posyandu Sekretariat Lapadde',
    category: 'Posyandu',
    status: 'Akan Datang'
  }
];

export const INITIAL_LETTERS: LetterRequest[] = [
  {
    id: 'l1',
    letterNumber: '045/SP/RT01-RW07/VI/2026',
    applicantId: 'c4',
    applicantName: 'Andi Hermawan',
    applicantGender: 'L',
    applicantAddress: 'Blok sd 1 No. 12, RT 01',
    letterType: 'Surat Pengantar Domisili',
    purpose: 'Keperluan Pembuatan Paspor Baru',
    submittedDate: '2026-06-17',
    status: 'Disetujui',
    approvedDate: '2026-06-18'
  },
  {
    id: 'l2',
    applicantId: 'c3',
    applicantName: 'Putri Putri Putri',
    applicantGender: 'P',
    applicantAddress: 'Blok sb-2 No. 23, RT 01',
    letterType: 'Surat Keterangan Kurang Mampu',
    purpose: 'Pengajuan Beasiswa Sekolah Anak',
    submittedDate: '2026-06-19',
    status: 'Menunggu'
  }
];

export const INITIAL_POLLS: Poll[] = [
  {
    id: 'p1',
    question: 'Pemilihan Warna Cat Balai Warga & Pos Kebersihan Lapadde',
    description: 'Mari berpartisipasi memilih warna cat baru balai warga RT 01 RW 07 Kelurahan Lapadde yang akan dicat menyambut Agustusan.',
    options: [
      { id: 'po1', text: 'Hijau Toska Kombinasi Putih', votes: 14 },
      { id: 'po2', text: 'Abu-Abu Minimalis Modern', votes: 19 },
      { id: 'po3', text: 'Biru Langit Sejuk', votes: 8 }
    ],
    totalVotes: 41,
    status: 'Aktif',
    endDate: '2026-06-30',
    votedUserIds: ['c1', 'c2', 'c4', 'c5']
  }
];

export const INITIAL_CONTACTS: EmergencyContact[] = [
  {
    id: 'ec1',
    name: 'Pos Jaga Security Utama RT 01',
    number: '0878-1111-2222',
    category: 'Keamanan',
    isLocal: true
  },
  {
    id: 'ec2',
    name: 'Hasnawati Sakka (Ketua RT 01)',
    number: '0812-4422-9901',
    category: 'Ketua RT',
    isLocal: true
  },
  {
    id: 'ec3',
    name: 'Polsek Ujung / Polsek Terdekat',
    number: '(0401) 7863110',
    category: 'Keamanan',
    isLocal: false
  },
  {
    id: 'ec4',
    name: 'Ilham (Ketua RT 02)',
    number: '0813-5533-8802',
    category: 'Ketua RT',
    isLocal: true
  },
  {
    id: 'ec5',
    name: 'Herman Nusu (Ketua RW 07)',
    number: '0811-6644-7707',
    category: 'Ketua RW',
    isLocal: true
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'i1',
    name: 'Tenda Lipat Gazebo 3m x 3m',
    totalQuantity: 3,
    goodQuantity: 3,
    damagedQuantity: 0,
    location: 'Gudang Balai RT',
    borrowedQuantity: 0,
    notes: 'Dipakai untuk hajatan atau kematian.'
  },
  {
    id: 'i2',
    name: 'Kursi Plastik Napolly Hijau',
    totalQuantity: 100,
    goodQuantity: 96,
    damagedQuantity: 4,
    location: 'Gudang Balai RT',
    borrowedQuantity: 20,
    notes: 'Sering dipinjam warga untuk arisan & kedukaan'
  },
  {
    id: 'i3',
    name: 'Portable Sound System + Call Mick Wireless',
    totalQuantity: 1,
    goodQuantity: 1,
    damagedQuantity: 0,
    location: 'Rumah Pak RT sd 1/18',
    borrowedQuantity: 0,
    notes: 'Baterai harap dicas setelah pemakaian.'
  }
];

export const INITIAL_BORROWS: BorrowRequest[] = [
  {
    id: 'b1',
    citizenName: 'Beni Cahyadi',
    itemName: 'Kursi Plastik Napolly Hijau',
    quantity: 20,
    borrowDate: '2026-06-19',
    returnDate: '2026-06-21',
    status: 'Disetujui',
    notes: 'Arisan keluarga bulanan'
  }
];

export const INITIAL_RONDA: RondaSchedule[] = [
  {
    id: 'r1',
    day: 'Senin',
    officers: ['Andi Hermawan', 'Maman Suherman', 'Kurnia', 'Subur'],
    coordinates: 'Sekitar Gang sd 1 - sb-2'
  },
  {
    id: 'r2',
    day: 'Selasa',
    officers: ['Hasnawati Sakka', 'Dudi', 'Fajar hera', 'Cahyono'],
    coordinates: 'Fasum Lapangan & Balai RT 01'
  },
  {
    id: 'r3',
    day: 'Rabu',
    officers: ['Beni Cahyadi', 'Gunawan', 'Lana', 'Prabowo'],
    coordinates: 'Tembus pagar pembatas & Pos Utama'
  },
  {
    id: 'r4',
    day: 'Kamis',
    officers: ['Bambang', 'Wawan', 'Ondos', 'Rudianto'],
    coordinates: 'Blok sa-3 & Pintu keluar motor'
  },
  {
    id: 'r5',
    day: 'Jumat',
    officers: ['Doni', 'Eko', 'Sutrisno', 'Bagas'],
    coordinates: 'Pos Ronda Utama RT 01'
  },
  {
    id: 'r6',
    day: 'Sabtu',
    officers: ['Agus Junaedi', 'Yanto', 'Edi', 'Tegar', 'Nanang'],
    coordinates: 'Full patroli menyeluruh (Malam Akhir pekan)'
  },
  {
    id: 'r7',
    day: 'Minggu',
    officers: ['Syarif', 'Ferdinand', 'Herman', 'Yogi'],
    coordinates: 'Sekitar Pos Ronda & Gang buntu'
  }
];

export const INITIAL_SUGGESTIONS: FeedbackSuggestion[] = [
  {
    id: 's1',
    senderName: 'Putri Putri Putri',
    senderContact: '0812-3456-7803',
    content: 'Mohon agar dipasang cermin cembung tikungan di pertigaan gang sb-2, karena sering terjadi senggolan motor akibat tidak terlihat dari tikungan tajam tersebut.',
    date: '2026-06-19',
    status: 'Belum Dibaca'
  }
];

export const INITIAL_MANAGERS: RTManager[] = [
  {
    id: 'm1',
    name: 'Hasnawati Sakka',
    role: 'Ketua RT 01',
    phone: '0812-4422-9901',
    imageUrl: ''
  },
  {
    id: 'm2',
    name: 'Ilham',
    role: 'Ketua RT 02',
    phone: '0813-5533-8802',
    imageUrl: ''
  },
  {
    id: 'm3',
    name: 'Herman Nusu',
    role: 'Ketua RW 07',
    phone: '0811-6644-7707',
    imageUrl: ''
  },
  {
    id: 'm4',
    name: 'Fatimah Hasan',
    role: 'Bendahara RT 01',
    phone: '0812-3456-7801',
    imageUrl: ''
  },
  {
    id: 'm5',
    name: 'Andi Hermawan',
    role: 'Seksi Keamanan & Ronda',
    phone: '0813-8822-1104',
    imageUrl: ''
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'u1',
    name: 'Hasnawati Sakka',
    email: 'hasnawati.rt01@rukunin.id',
    role: 'Superadmin',
    isActive: true,
    lastLogin: '2026-06-21 08:24'
  },
  {
    id: 'u2',
    name: 'Fatimah Hasan',
    email: 'fatimah.bendahara@rukunin.id',
    role: 'Pengurus RT',
    isActive: true,
    lastLogin: '2026-06-21 08:10'
  },
  {
    id: 'u3',
    name: 'Putri Putri Putri',
    email: 'putri@rukunin.id',
    role: 'Warga',
    isActive: true,
    lastLogin: '2026-06-20 20:02'
  },
  {
    id: 'u4',
    name: 'Andi Hermawan',
    email: 'andi.security@rukunin.id',
    role: 'Security',
    isActive: true,
    lastLogin: '2026-06-21 08:00'
  }
];
