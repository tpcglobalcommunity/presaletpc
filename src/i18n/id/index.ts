import { addResource } from "i18next";
import legal from "./legal";

// Add Indonesian translations
addResource("id", "translation", {
  ...legal,
  nav: {
    presale: "Presale"
  },
  buytpc: {
    rateFixedTitle: "Kurs internal (fixed)",
    rateFixedValue: "1 USDC = Rp17.000",
    lockTitle: "Pembelian TPC hanya lewat Member Area",
    lockDesc: "Untuk keamanan dan transparansi, kita melakukan pembelian TPC melalui Member Area. Setelah login, kita bisa buat invoice, upload bukti, dan pantau status transaksi.",
    lockCtaLogin: "Masuk / Daftar untuk Membeli",
    lockCtaMember: "Buka Member Area"
  }
});

export default {};
