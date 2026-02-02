import { useNavigate } from 'react-router-dom';
import { Share2, Copy, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ReferralPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const referralCode = profile?.member_code || 'LOADING';
  const referralLink = `${window.location.origin}/id/buytpc?ref=${referralCode}`;

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: 'Berhasil disalin!' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mobile-container pt-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-3"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm">Kembali</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary/20">
          <Share2 className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-title">Referral Saya</h1>
      </div>

      {/* Referral Code */}
      <div className="glass-card mb-4">
        <div className="text-sm text-muted-foreground mb-2">Kode Referral Anda</div>
        <div className="flex items-center justify-between">
          <div className="font-mono text-2xl font-bold text-primary">{referralCode}</div>
          <button
            onClick={() => handleCopy(referralCode)}
            className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
          >
            {copied ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5 text-primary" />}
          </button>
        </div>
      </div>

      {/* Referral Link */}
      <div className="glass-card mb-6">
        <div className="text-sm text-muted-foreground mb-2">Link Referral</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 text-sm font-mono truncate text-muted-foreground">
            {referralLink}
          </div>
          <button
            onClick={() => handleCopy(referralLink)}
            className="p-2 rounded-lg bg-card hover:bg-muted transition-colors shrink-0"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats placeholder */}
      <div className="glass-card text-center py-8">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="font-semibold mb-2">Statistik Referral</h3>
        <p className="text-sm text-muted-foreground">
          Fitur statistik referral akan segera hadir
        </p>
      </div>
    </div>
  );
}
