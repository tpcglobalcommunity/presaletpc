import { addResource } from "i18next";
import legal from "./legal";

// Add Indonesian translations
addResource("id", "translation", {
  ...legal,
  buytpc: {
    rateFixedTitle: "Kurs internal (fixed)",
    rateFixedValue: "1 USDC = Rp17.000"
  }
});

export default {};
