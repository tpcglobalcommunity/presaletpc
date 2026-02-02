import { 
  GraduationCap, 
  Shield, 
  Users, 
  ArrowRight, 
  CheckCircle,
  XCircle,
  BookOpen,
  MessageCircle,
  FileText,
  Wallet,
  Upload,
  BadgeCheck,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { SEO } from '@/lib/seo';
import { preloadBuyTPC, preloadMarket } from '@/App';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Preload key routes on idle
  useEffect(() => {
    const preloadRoutes = () => {
      preloadBuyTPC();
      preloadMarket();
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadRoutes);
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(preloadRoutes, 2000);
    }
  }, []);

  return (
    <>
      <SEO 
        title="TPC Global - Platform Edukasi Kripto Terpercaya"
        description="TPC Global adalah platform edukasi kripto dengan transparansi penuh, wallet terverifikasi, dan perlindungan anti-scam. Bergabung dengan ekosistem TPC sekarang."
        path="/id/"
      />
      <div className="mobile-container pt-6 pb-28">
      {/* 1. HERO SECTION */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto mb-6">
          <img 
            src="/tpc-logo.png" 
            alt="TPC Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
          Trader Professional<br />
          <span className="text-primary">Community (TPC)</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-2">
          Platform edukasi trading terpercaya dengan sistem transparansi penuh
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> Education-first</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Community-driven</span>
        </div>
        <div className="flex gap-3 max-w-xs mx-auto">
          <button 
            onClick={() => navigate('/id/buytpc')} 
            onMouseEnter={preloadBuyTPC}
            onTouchStart={preloadBuyTPC}
            className="btn-gold flex-1 py-3 text-sm"
          >
            Beli TPC
          </button>
          <button 
            onClick={() => navigate('/id/edukasi')} 
            className="flex-1 py-3 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            Pelajari TPC
          </button>
        </div>
      </div>

      {/* 2. APA ITU TPC? */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">Apa itu TPC?</h2>
        <div className="glass-card p-5 mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            TPC adalah platform edukasi trading terpercaya yang telah membantu ribuan trader pemula memahami pasar dengan pendekatan transparansi dan pembelajaran bertahap. TPC token berfungsi sebagai utility dalam ekosistem komunitas, bukan sebagai instrumen investasi.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm"><XCircle className="h-4 w-4 text-red-500 shrink-0" /><span className="text-muted-foreground">No financial advice</span></div>
            <div className="flex items-center gap-2 text-sm"><XCircle className="h-4 w-4 text-red-500 shrink-0" /><span className="text-muted-foreground">No profit promise</span></div>
            <div className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-500 shrink-0" /><span className="text-muted-foreground">Education & community</span></div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed"><strong className="text-yellow-500">Penting:</strong> TPC tidak menjanjikan keuntungan apa pun. Partisipasi dalam ekosistem TPC mengandung risiko dan setiap keputusan sepenuhnya menjadi tanggung jawab masing-masing pengguna. Selalu lakukan riset mandiri (DYOR).</p>
          </div>
        </div>
      </div>

      {/* 3. KENAPA TPC BERBEDA? */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">Kenapa TPC Berbeda?</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3"><Shield className="h-5 w-5 text-blue-500" /></div>
            <h3 className="font-semibold text-sm text-white mb-1">Transparansi</h3>
            <p className="text-xs text-muted-foreground">Wallet publik & transaksi dapat diverifikasi</p>
          </div>
          <div className="glass-card p-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3"><BadgeCheck className="h-5 w-5 text-purple-500" /></div>
            <h3 className="font-semibold text-sm text-white mb-1">Verifikasi Manual</h3>
            <p className="text-xs text-muted-foreground">Anti-bot & anti-scam dengan review admin</p>
          </div>
          <div className="glass-card p-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-3"><Users className="h-5 w-5 text-green-500" /></div>
            <h3 className="font-semibold text-sm text-white mb-1">Reward Kolaborasi</h3>
            <p className="text-xs text-muted-foreground">Bonus untuk member yang berkolaborasi</p>
          </div>
          <div className="glass-card p-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-3"><BookOpen className="h-5 w-5 text-orange-500" /></div>
            <h3 className="font-semibold text-sm text-white mb-1">Kurikulum Terstruktur</h3>
            <p className="text-xs text-muted-foreground">Pembelajaran trading sistematis</p>
          </div>
        </div>
      </div>

      {/* 4. CARA KERJA */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">Cara Kerja</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">1</div>
            <div className="flex-1 glass-card p-4">
              <div className="flex items-center gap-2 mb-1"><Wallet className="h-4 w-4 text-primary" /><span className="font-semibold text-sm text-white">Beli TPC</span></div>
              <p className="text-xs text-muted-foreground">Login dengan email dan pilih jumlah TPC yang ingin dibeli</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">2</div>
            <div className="flex-1 glass-card p-4">
              <div className="flex items-center gap-2 mb-1"><Upload className="h-4 w-4 text-primary" /><span className="font-semibold text-sm text-white">Transfer & Upload</span></div>
              <p className="text-xs text-muted-foreground">Transfer sesuai nominal dan upload bukti pembayaran</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">3</div>
            <div className="flex-1 glass-card p-4">
              <div className="flex items-center gap-2 mb-1"><BadgeCheck className="h-4 w-4 text-primary" /><span className="font-semibold text-sm text-white">Verifikasi</span></div>
              <p className="text-xs text-muted-foreground">Tim profesional kami memverifikasi setiap transaksi secara manual untuk memastikan keamanan sebelum TPC dikirim ke wallet pengguna.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRUST & TRANSPARENCY */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">Transparansi & Kepercayaan</h2>
        <div className="glass-card p-5 border-l-4 border-l-green-500">
          <p className="text-sm text-white font-medium mb-2">"TPC tidak menjanjikan keuntungan apa pun."</p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">Kami berkomitmen pada transparansi penuh. Semua transaksi dapat diverifikasi dan wallet addresses kami bersifat publik.</p>
          <div className="space-y-2">
            <button onClick={() => navigate('/id/transparansi')} className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><span className="text-sm">Lihat Transparansi</span></div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button onClick={() => navigate('/id/anti-scam')} className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-warning" /><span className="text-sm">Anti-Scam Notice</span></div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. KOMUNITAS & EDUKASI */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">Komunitas & Edukasi</h2>
        <div className="space-y-3">
          <a 
            href="https://t.me/tpcglobalcommunity" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full glass-card p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><MessageCircle className="h-6 w-6 text-blue-500" /></div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-sm text-white">Komunitas Telegram</h3>
              <p className="text-xs text-muted-foreground">Bergabung dengan komunitas trader</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </a>
          <button onClick={() => navigate('/id/edukasi')} className="w-full glass-card p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center"><BookOpen className="h-6 w-6 text-purple-500" /></div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-sm text-white">Materi Edukasi</h3>
              <p className="text-xs text-muted-foreground">Pelajari dasar-dasar trading</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <button onClick={() => navigate('/id/faq')} className="w-full glass-card p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center"><FileText className="h-6 w-6 text-orange-500" /></div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-sm text-white">FAQ</h3>
              <p className="text-xs text-muted-foreground">Pertanyaan yang sering ditanyakan</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* 7. CTA AKHIR */}
      <div className="glass-card p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
        <h2 className="text-lg font-bold text-white mb-2">Siap Bergabung?</h2>
        <p className="text-sm text-muted-foreground mb-4">Bergabunglah dengan ribuan trader yang telah mempercayai TPC sebagai platform edukasi trading terpercaya.</p>
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/id/buytpc')} 
            onMouseEnter={preloadBuyTPC}
            onTouchStart={preloadBuyTPC}
            className="btn-gold w-full py-3"
          >
            Beli TPC<ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => navigate(user ? '/id/dashboard' : '/id/login')} className="w-full py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">{user ? 'Masuk ke Dashboard' : 'Masuk / Daftar'}</button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-10 pt-6 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">TPC (Trader Professional Community) adalah platform edukasi komunitas. Bukan penasihat keuangan dan tidak menjanjikan keuntungan apa pun. Setiap keputusan pengguna sepenuhnya menjadi tanggung jawab masing-masing.</p>
      </div>
      </div>
    </>
  );
}
