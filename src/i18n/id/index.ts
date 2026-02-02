import { addResource } from "i18next";
import legal from "./legal";

// Add Indonesian translations
addResource("id", "translation", {
  ...legal
});

export default {};
