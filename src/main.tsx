import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "@/contexts/AuthContext";
import "./index.css";

// Import runtime diagnostics (side effect)
import "@/lib/runtimeDiagnostics";

// Import AppErrorBoundary
import AppErrorBoundary from "@/components/system/AppErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <AuthProvider>
      <BrowserRouter>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  </HelmetProvider>
);
