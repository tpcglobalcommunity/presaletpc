import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, Coins, Mail, Hash, Calendar, Clock } from 'lucide-react';
import { formatNumberID, formatRupiah } from '@/lib/number';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function InvoiceSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const invoice = location.state?.invoice;

  if (!invoice) {
    return <Navigate to="/id/buytpc" replace />;
  }

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'IDR') return formatRupiah(amount);
    return `${formatNumberID(amount)} ${currency}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 py-8">
      {/* Success Icon */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/20 mb-6">
          <CheckCircle className="h-14 w-14 text-success" />
        </div>
        <h1 className="text-title mb-2">Invoice Berhasil Dibuat!</h1>
        <p className="text-muted-foreground">
          Silakan login untuk konfirmasi pembayaran
        </p>
      </div>

      {/* Invoice Summary */}
      <div className="glass-card mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Invoice No</span>
          <span className="font-mono font-bold text-primary">{invoice.invoice_no}</span>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{invoice.email}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Referral: {invoice.referral_code}</span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(new Date(invoice.created_at), 'd MMMM yyyy, HH:mm', { locale: id })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-sm text-warning">
              Berlaku hingga {format(new Date(invoice.expires_at), 'd MMM yyyy, HH:mm', { locale: id })}
            </span>
          </div>
        </div>

        <div className="border-t border-border mt-4 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Nominal</span>
            <span className="font-medium">
              {formatCurrency(invoice.amount_input, invoice.base_currency)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Nilai USD</span>
            <span className="font-medium">${Number(invoice.amount_usd).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-dashed border-border">
            <span className="font-semibold">TPC yang Didapat</span>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              <span className="text-xl font-bold text-primary">
                {formatNumberID(Number(invoice.tpc_amount))} TPC
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Login Button - ONLY action */}
      <button
        onClick={handleLogin}
        className="btn-gold w-full text-lg py-5"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        LOGIN GOOGLE UNTUK KONFIRMASI PEMBAYARAN
      </button>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Login diperlukan untuk melanjutkan proses pembayaran
      </p>
    </div>
  );
}
