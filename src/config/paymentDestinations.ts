type Destination = {
  title: string;
  subtitle?: string;
  lines: Array<{ label: string; value: string; copy?: boolean }>;
  note?: string;
};

export function getDestination(baseCurrency: string): Destination {
  const currency = baseCurrency.toUpperCase();

  if (currency === 'IDR') {
    return {
      title: 'Tujuan Pembayaran',
      subtitle: 'Transfer Bank',
      lines: [
        {
          label: 'Bank',
          value: import.meta.env.VITE_IDR_BANK_NAME || 'BCA',
        },
        {
          label: 'Nomor Rekening',
          value: import.meta.env.VITE_IDR_BANK_ACCOUNT_NO || '1234567890',
          copy: true,
        },
        {
          label: 'Nama Pemilik',
          value: import.meta.env.VITE_IDR_BANK_ACCOUNT_HOLDER || 'PT TPC Global Indonesia',
        },
      ],
      note: 'Transfer sesuai nominal. Gunakan invoice_no sebagai catatan bila bank mendukung.',
    };
  }

  // For SOL and USDC (and any other crypto)
  const solAddress = import.meta.env.VITE_TPC_PAYMENT_SOL_ADDRESS || '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
  
  if (currency === 'SOL') {
    return {
      title: 'Tujuan Pembayaran',
      subtitle: 'Wallet Solana',
      lines: [
        {
          label: 'Alamat Wallet',
          value: solAddress,
          copy: true,
        },
        {
          label: 'Network',
          value: 'Solana',
        },
        {
          label: 'Token',
          value: 'SOL',
        },
      ],
      note: 'Pastikan mengirim sesuai jumlah. Simpan Invoice No untuk referensi.',
    };
  }

  if (currency === 'USDC') {
    return {
      title: 'Tujuan Pembayaran',
      subtitle: 'Wallet Solana (USDC)',
      lines: [
        {
          label: 'Alamat Wallet',
          value: import.meta.env.VITE_TPC_PAYMENT_USDC_ADDRESS || solAddress,
          copy: true,
        },
        {
          label: 'Network',
          value: 'Solana',
        },
        {
          label: 'Token',
          value: 'USDC',
        },
      ],
      note: 'Pastikan mengirim sesuai jumlah. Simpan Invoice No untuk referensi.',
    };
  }

  // Default fallback for any other currency
  return {
    title: 'Tujuan Pembayaran',
    subtitle: 'Hubungi Admin',
    lines: [
      {
        label: 'Currency',
        value: currency,
      },
      {
        label: 'Instruksi',
        value: 'Hubungi admin untuk informasi pembayaran',
      },
    ],
    note: 'Silakan hubungi admin untuk metode pembayaran yang tersedia.',
  };
}
