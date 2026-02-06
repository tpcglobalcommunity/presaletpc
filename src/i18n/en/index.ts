import { addResource } from "i18next";

// Add English translations
addResource("en", "translation", {
  nav: {
    presale: "Presale"
  },
  buytpc: {
    rateFixedTitle: "Internal rate (fixed)",
    rateFixedValue: "1 USDC = Rp17,000",
    lockTitle: "TPC Purchases in Member Area",
    lockDesc: "For security and transparency, purchases are processed in Member Area. After login, you can create an invoice, upload proof, and track status.",
    lockCtaLogin: "Sign in / Register to Buy",
    lockCtaMember: "Open Member Area"
  }
});

export default {};
