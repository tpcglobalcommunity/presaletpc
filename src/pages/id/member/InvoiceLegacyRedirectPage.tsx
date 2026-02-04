import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function InvoiceLegacyRedirectPage() {
  const { invoiceNo } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!invoiceNo) {
      navigate('/id/member/invoices', { replace: true });
      return;
    }

    const inv = decodeURIComponent(invoiceNo).trim();

    // ✅ If not logged in, force login + save return path
    if (!user) {
      try {
        localStorage.setItem('tpc_return_to', `/id/member/invoices-no/${encodeURIComponent(inv)}`);
      } catch {}
      navigate('/id/login', { replace: true });
      return;
    }

    let cancelled = false;

    const run = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('id')
        .eq('invoice_no', inv)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error('Legacy redirect lookup error:', error);

        toast({
          title: 'Gagal membuka invoice',
          description: 'Pastikan invoice milik akun yang sedang login.',
          variant: 'destructive',
        });
        navigate('/id/member/invoices', { replace: true });
        return;
      }

      if (!data?.id) {
        toast({ title: 'Invoice tidak ditemukan', variant: 'destructive' });
        navigate('/id/member/invoices', { replace: true });
        return;
      }

      // ✅ redirect to hard-lock UUID route
      navigate(`/id/member/invoices/${data.id}`, { replace: true });
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [invoiceNo, user, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
