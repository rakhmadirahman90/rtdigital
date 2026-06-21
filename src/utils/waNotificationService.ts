import { IuranStatus } from '../types';
import { RTRW_CONTEXT } from './constants';

export interface WaNotificationResult {
  success: boolean;
  messageId: string;
  formattedText: string;
  recipientName: string;
  recipientPhone: string;
  timestamp: string;
}

/**
 * Normalizes and formats Month identifier (YYYY-MM) to human Indonesian text.
 */
export function getMonthNameIndonesian(monthStr: string): string {
  if (!monthStr || !monthStr.includes('-')) return monthStr;
  const [year, month] = monthStr.split('-');
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const idx = parseInt(month, 10) - 1;
  return idx >= 0 && idx < 12 ? `${monthNames[idx]} ${year}` : monthStr;
}

/**
 * Formats a highly descriptive and beautifully structured WhatsApp message targeting the Treasurer.
 */
export function formatIuranVerificationWaMessage(iuran: IuranStatus, citizenName: string): string {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(iuran.amountPaid || 250000);

  const monthLabel = getMonthNameIndonesian(iuran.month);
  const transactionId = `#IUR-${iuran.id.toUpperCase()}-${new Date().getFullYear()}`;
  const uploadDateTime = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) + ` pukul ` + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return `*🟢 NOTIFIKASI OTOMATIS RUKUNIN*
*KAS RT MASUK - PERLU VERIFIKASI*

Halo Ibu *${RTRW_CONTEXT.BENDAHARA_RT_01}* (Bendahara RT ${RTRW_CONTEXT.RT_PRIMARY}),
Sistem kami mendeteksi setoran baru yang memerlukan tinjauan & persetujuan pembayaran Anda:

👤 *Nama Warga*: ${citizenName}
🏠 *Hunian/Alamat*: Blok ${iuran.block}/${iuran.houseNumber}
📅 *Periode Iuran*: ${monthLabel}
💵 *Nominal Disetor*: ${formattedAmount}
💳 *Metode Setor*: ${iuran.paymentMethod || 'Transfer Bank'}
📄 *Lampiran Bukti*: ${iuran.uploadedFileName || 'Struk_Kwitansi.png'}

Status setoran terpantau saat ini: *[Menunggu Verifikasi]*. Mohon periksa saldo rekening kas atau mutasi perbankan RT yang bersangkutan. 

Setelah dana valid, silakan masuk ke *Admin Panel -> Keuangan RT* untuk melakukan konfirmasi setor & rilis kuitansi pelunasan digital warga.

_ID Transaksi_: \`${transactionId}\`
_Waktu Rekam_: ${uploadDateTime} WIB`;
}

/**
 * Triggers a simulated automated API notification payload representing the integration with local WhatsApp network operators.
 */
export async function triggerTreasurerWaNotification(iuran: IuranStatus, citizenName: string): Promise<WaNotificationResult> {
  const formattedText = formatIuranVerificationWaMessage(iuran, citizenName);
  
  // Real-world server execution context would do:
  // await fetch('https://api.fonnte.com/send', { method: 'POST', body: ... })
  console.log("=== WA GATEWAY API EMULATOR DISPATCHING INCOMING WEBHOOK ===");
  console.log(`Sending to: ${RTRW_CONTEXT.BENDAHARA_RT_01} (0812-3456-7801)`);
  console.log("Message Content:\n", formattedText);
  console.log("=============================================================");

  // Simulating network response latency back of 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    messageId: `msg_${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
    formattedText,
    recipientName: RTRW_CONTEXT.BENDAHARA_RT_01,
    recipientPhone: "0812-3456-7801",
    timestamp: new Date().toISOString()
  };
}
