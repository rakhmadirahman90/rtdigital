/**
 * Rukunin RT/RW Context Constants
 * Centralized context that is shared across all UI components and views.
 */
export const RTRW_CONTEXT = {
  // Region & Administration Context
  RT_PRIMARY: "01",
  RT_SECONDARY: "02",
  RW: "07",
  KELURAHAN: "Lapadde",
  KECAMATAN: "Ujung",
  KOTA: "Parepare",
  PROVINSI: "Sulawesi Selatan",
  
  // Leadership & Officer Names
  KETUA_RW: "Herman Nusu",
  KETUA_RT_01: "Hasnawati Sakka",
  KETUA_RT_02: "Ilham",
  BENDAHARA_RT_01: "Fatimah Hasan",
  SEKSI_KEAMANAN: "Andi Hermawan",
  
  // Full formatted strings for easy access
  get rtRwLabel() {
    return `RT ${this.RT_PRIMARY} / RW ${this.RW}`;
  },
  
  get fullAddressLabel() {
    return `Kelurahan ${this.KELURAHAN}, Kecamatan ${this.KECAMATAN}, ${this.KOTA}`;
  },
  
  get systemFooter() {
    return `Rukunin Sistem Kelola RT Digital — ${this.KELURAHAN} RT ${this.RT_PRIMARY} / RW ${this.RW}`;
  },
  
  get welcomeMessage() {
    return `Selamat datang di pusat pengelolaan administrasi terpadu RT ${this.RT_PRIMARY} / RW ${this.RW}, Kelurahan ${this.KELURAHAN}, Kecamatan ${this.KECAMATAN}`;
  }
};
