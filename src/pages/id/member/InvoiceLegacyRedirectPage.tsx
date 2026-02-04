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
    if (!invoiceNo || !user) return;

    const run = async () => {
      // Lookup UUID by invoice_no (RLS should ensure only owner can see)
      const { data, error } = await supabase
        .from('invoices')
        .select('id')
        .eq('invoice_no', invoiceNo)
        .maybeSingle();

      if (error || !data?.id) {
        toast({ title: 'Invoice tidak ditemukan', variant: 'destructive' });
        navigate('/id/member/invoices', { replace: true });
        return;
      }

      // ✅ redirect to hard-lock UUID route
      navigate(`/id/member/invoices/${data.id}`, { replace: true });
    };

    run();
  }, [invoiceNo, user, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
