/**
 * ID Public Copy - Partial (allowed to be incomplete)
 * Missing keys will be auto-filled from EN via safe fallback
 */

import { PublicCopy } from './schema';

export const publicId: Partial<PublicCopy> = {
  // Navigation
  nav: {
    presale: "Prapenjualan"
  },

  // Buy TPC
  buytpc: {
    rateFixedTitle: "Kurs internal (fixed)",
    rateFixedValue: "1 USDC = Rp17.000",
    lockTitle: "Pembelian TPC hanya lewat Member Area",
    lockDesc: "Untuk keamanan dan transparansi, kita melakukan pembelian TPC melalui Member Area. Setelah login, kita bisa buat invoice, upload bukti, dan pantau status transaksi.",
    lockCtaLogin: "Masuk / Daftar untuk Membeli",
    lockCtaMember: "Buka Member Area"
  },

  // Home Page
  home: {
    trustQuote: '"TPC tidak menjanjikan keuntungan apa pun."',
    trustDesc: 'Kami berkomitmen pada transparansi penuh. Semua transaksi dapat diverifikasi dan wallet addresses kami bersifat publik.',
    viewTransparency: 'Lihat Transparansi',
    antiScamNotice: 'Anti-Scam Notice',
    communityEducation: 'Komunitas & Edukasi',
    telegramCommunity: 'Komunitas Telegram',
    telegramDesc: 'Bergabung dengan komunitas trader'
  },

  // Tutorial Pages
  tutorial: {
    phantomWallet: {
      title: "Tutorial Phantom Wallet",
      subtitle: "Pelajari cara setup dan gunakan Phantom wallet",
      overview: "Panduan lengkap Phantom wallet untuk transaksi TPC",
      features: {
        secure: "Aman & Non-kustodian",
        easy: "Mudah Digunakan",
        browser: "Ekstensi Browser"
      },
      steps: {
        step1: "Install Phantom Wallet",
        step2: "Buat atau Import Wallet",
        step3: "Dapatkan SOL untuk Biaya Gas",
        step4: "Tambah TPC ke Wallet"
      },
      security: {
        title: "Praktik Keamanan Terbaik",
        neverShare: "Jangan pernah bagikan private key atau seed phrase",
        officialOnly: "Hanya gunakan phantom.app resmi",
        research: "Selalu verifikasi URL dan periksa ulang transaksi"
      },
      cta: {
        buy: "Beli TPC Sekarang",
        antiScam: "Info Anti-Scam"
      },
      disclaimer: {
        text: "Tutorial ini hanya untuk tujuan edukasi, bukan saran finansial. Investasi cryptocurrency memiliki risiko tinggi. Lakukan riset mandiri sebelum berinvestasi."
      }
    }
  },

  // Anti-Scam
  antiScam: {
    title: "Perlindungan Anti-Scam",
    subtitle: "Pelajari cara melindungi diri dari scam",
    description: "TPC tidak akan pernah meminta hal-hal tertentu. Pelajari mengidentifikasi komunikasi yang sah.",
    warning: "Selalu verifikasi melalui channel resmi sebelum mengambil tindakan apa pun.",
    tips: {
      title: "Tips Keamanan",
      verify: "Verifikasi identitas koordinator melalui website resmi",
      official: "Hanya percaya koordinator yang tertera di halaman terverifikasi",
      research: "Lakukan riset mandiri sebelum berinvestasi"
    },
    cta: {
      back: "Kembali ke Keamanan",
      report: "Laporkan Aktivitas Mencurigakan"
    }
  },

  // Chapters
  chapters: {
    meta: {
      title: "Koordinator Resmi TPC (Verified)",
      description: "Daftar koordinator TPC yang telah diverifikasi secara resmi"
    },
    hero: {
      title: "Koordinator Resmi TPC (Verified)",
      subtitle: "Cek di sini sebelum percaya"
    },
    badges: {
      educationOnly: "Education-only, no profit/ROI",
      antiScam: "Anti-Scam",
      transparent: "Transparent"
    },
    sections: {
      orgStructure: {
        title: "Struktur Organisasi",
        items: {
          chapterLead: "Chapter Lead",
          koordinator: "Koordinator", 
          moderator: "Moderator"
        }
      },
      roles: {
        title: "Peran Koordinator",
        items: {
          chapterLead: "Chapter Lead - Memimpin chapter regional",
          koordinator: "Koordinator - Koordinator wilayah",
          moderator: "Moderator - Moderator komunitas"
        }
      },
      rules: {
        title: "Aturan Verifikasi",
        items: {
          noPrivateTransfer: "TPC tidak pernah meminta transfer ke wallet pribadi",
          noSeedPhrase: "TPC tidak pernah meminta seed phrase/OTP/private key",
          officialOnly: "Koordinator resmi hanya yang tertera di halaman ini",
          noUnknown: "Jika nama tidak ada di sini → anggap tidak resmi"
        }
      },
      inactive: {
        title: "Koordinator Nonaktif",
        description: "Daftar koordinator nonaktif"
      },
      chapterLead: {
        title: "Chapter Lead",
        description: "Memimpin chapter regional",
        antiScam: "Anti-Scam",
        transparency: "Transparent"
      }
    },
    cta: {
      primary: "Lihat Transparansi Wallet",
      secondary: "Baca Anti-Scam Notice"
    },
    status: {
      active: "Aktif",
      inactive: "Nonaktif",
      unknown: "Unknown"
    },
    roles: {
      chapterLead: "Chapter Lead",
      koordinator: "Koordinator",
      moderator: "Moderator",
      unknown: "Unknown"
    },
    filters: {
      allCountries: "Semua Negara",
      allRoles: "Semua Peran", 
      allStatus: "Semua Status",
      searchPlaceholder: "Cari nama/username/kota/negara...",
      sortBy: "Urutkan",
      sortOptions: {
        newest: "Terbaru Diverifikasi",
        name: "Nama A-Z",
        region: "Wilayah A-Z"
      }
    },
    actions: {
      back: "Kembali",
      report: "Laporkan",
      copyUsername: "Salin username",
      copied: "Tersalin",
      joinLocalGroup: "Grup Lokal",
      viewSocials: "Lihat Social Media",
      revokeReason: "Alasan Nonaktif"
    },
    footer: {
      title: "Tetap Aman dan Terinformasi",
      description: "Selalu verifikasi identitas koordinator sebelum percaya. TPC adalah platform edukasi, bukan investasi.",
      joinTelegram: "Gabung Telegram Resmi"
    }
  },

  // Market
  market: {
    title: "Pasar TPC",
    subtitle: "Sumber daya dan tools edukasi",
    description: "Akses konten edukasi premium dan tools trading",
    products: {
      ebook: {
        title: "Ebook & Materi Edukasi",
        description: "Materi pembelajaran terstruktur dari dasar hingga lanjutan",
        status: "Tersedia",
        cta: "Pelajari Lebih"
      },
      training: {
        title: "Pelatihan Trader",
        description: "Fokus pada skill, mindset, dan proses yang konsisten",
        status: "Coming Soon",
        cta: "Lihat Program"
      },
      tools: {
        title: "Tools & Software Pendukung",
        description: "Analisis dan utility tools untuk trading yang lebih baik",
        status: "Coming Soon",
        cta: "Detail"
      },
      advertising: {
        title: "Jasa Periklanan Digital",
        description: "Iklan TikTok / YouTube / Instagram untuk bisnis",
        status: "Tersedia",
        cta: "Info Layanan"
      },
      website: {
        title: "Jasa Pembuatan Website",
        description: "Website bisnis & edukasi profesional",
        status: "Tersedia",
        cta: "Lihat Detail"
      },
      partnership: {
        title: "Kerja Sama Bisnis",
        description: "Kolaborasi dengan vendor sektor riil & konvensional",
        status: "Coming Soon",
        cta: "Pelajari"
      }
    },
    cta: {
      explore: "Jelajahi Produk",
      getStarted: "Mulai"
    }
  },

  // Common UI (minimal set - will be merged with EN)
  ui: {
    loading: "Memuat...",
    error: "Error",
    retry: "Coba Lagi",
    back: "Kembali",
    next: "Lanjut",
    previous: "Sebelumnya",
    save: "Simpan",
    cancel: "Batal",
    confirm: "Konfirmasi",
    close: "Tutup",
    search: "Cari",
    filter: "Filter",
    sort: "Urutkan",
    select: "Pilih",
    copy: "Salin",
    share: "Bagikan",
    download: "Unduh",
    upload: "Unggah",
    view: "Lihat",
    edit: "Edit",
    delete: "Hapus",
    report: "Laporkan",
    help: "Bantuan",
    contact: "Kontak",
    about: "Tentang",
    settings: "Pengaturan",
    profile: "Profil",
    logout: "Keluar"
  }
};
