import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  ExternalLink,
  Wallet,
  BarChart3,
  Users,
  Settings,
  Key,
  Database,
  Crown,
  Diamond,
  Activity,
  RefreshCw,
  Flame,
  Gift,
  Building,
  Lock,
  Search,
  Filter
} from 'lucide-react';
import TokenMintInfoCard from '@/components/trust/TokenMintInfoCard';

interface WalletData {
  id: string;
  name: string;
  address: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  badge: string;
  badgeColor: string;
  description: string;
  functions: string[];
  stats: { total: string; status: string };
}

export default function TransparansiPage() {
  const navigate = useNavigate();
  const [copiedAddress, setCopiedAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Scheduled' | 'Locked'>('all');

  const wallets: WalletData[] = [
    {
      id: 'total-supply',
      name: 'Total Supply Wallet',
      address: 'F1T2geWZc4HuRjMtz9MTbsmGWbNJBLRYc7G4KGCsnfEX',
      icon: Database,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
      badge: 'CORE',
      badgeColor: 'bg-blue-500',
      description: 'Menyimpan total supply awal sebesar 1.000.000.000 TPC',
      functions: [
        'Berfungsi sebagai sumber distribusi token',
        'Bukan wallet operasional',
        'Tidak digunakan untuk transaksi publik'
      ],
      stats: { total: '1B TPC', status: 'Locked' }
    },
    {
      id: 'stage-1',
      name: 'Stage 1 Supply Wallet',
      address: 'At5nA9pw2ukSoAQj5vxqBmNbfk6UYF89UBsXtoFrf8t7',
      icon: Crown,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/20',
      badge: 'PRESALE',
      badgeColor: 'bg-emerald-500',
      description: 'Menyimpan alokasi token Presale Tahap 1',
      functions: [
        'Distribusi sesuai ketentuan presale',
        'Seluruh transaksi dapat diverifikasi publik'
      ],
      stats: { total: '100M TPC', status: 'Active' }
    },
    {
      id: 'stage-2',
      name: 'Stage 2 Supply Wallet',
      address: 'FzUNpf4vVbTSzxcywAUba87FdZHvEBQZFNyKVMrchyAh',
      icon: Diamond,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20',
      badge: 'PRESALE',
      badgeColor: 'bg-purple-500',
      description: 'Menyimpan alokasi token Presale Tahap 2',
      functions: [
        'Digunakan setelah Tahap 1 selesai',
        'Distribusi dilakukan secara bertahap dan transparan'
      ],
      stats: { total: '100M TPC', status: 'Active' }
    },
    {
      id: 'liquidity',
      name: 'Wallet Likuiditas',
      address: 'CbaYJrd23Ak9dEDjVTExyjrgjn1MVSN1h3Ga7cRCnrxm',
      icon: Activity,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-400/20',
      badge: 'LIQUIDITY',
      badgeColor: 'bg-cyan-500',
      description: 'Menyediakan likuiditas saat listing',
      functions: [
        'Digunakan hanya untuk kebutuhan likuiditas',
        'Bukan wallet penampung keuntungan'
      ],
      stats: { total: '200M TPC', status: 'Active' }
    },
    {
      id: 'buyback',
      name: 'Wallet Buyback',
      address: 'ALaCDQv5etXkrFqB91r7gNw5CpDe58nUyhWR8C5vKg7a',
      icon: RefreshCw,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      badge: 'BUYBACK',
      badgeColor: 'bg-green-500',
      description: 'Digunakan khusus untuk program buyback token',
      functions: [
        'Aktivitas buyback dapat diverifikasi publik',
        'Dilakukan sesuai kebijakan ekosistem'
      ],
      stats: { total: '50M TPC', status: 'Scheduled' }
    },
    {
      id: 'burning',
      name: 'Wallet Burning',
      address: 'H75PvmbP55LYbK3hGyrnxus2kZCjfZ4TmCGvyWcKPfL',
      icon: Flame,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
      badge: 'BURN',
      badgeColor: 'bg-red-500',
      description: 'Menerima token yang dimusnahkan (burn)',
      functions: [
        'Token di wallet ini tidak dapat digunakan kembali',
        'Bukti burn bersifat publik dan permanen'
      ],
      stats: { total: '0 TPC', status: 'Active' }
    },
    {
      id: 'reward',
      name: 'Wallet Reward',
      address: '4iHsGQBRFas1EBpMss1GVtG3C6MhLNBUxm7bMnbPaAQF',
      icon: Gift,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20',
      badge: 'REWARD',
      badgeColor: 'bg-amber-500',
      description: 'Digunakan untuk reward komunitas',
      functions: [
        'Distribusi berbasis aktivitas & kontribusi',
        'Bukan pembagian keuntungan investasi'
      ],
      stats: { total: '150M TPC', status: 'Active' }
    },
    {
      id: 'treasury',
      name: 'Wallet Treasury',
      address: '5AeayrU2pdy6yNBeiUpTXkfMxw3VpDQGUHC6kXrBt5vw',
      icon: Building,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10',
      borderColor: 'border-indigo-400/20',
      badge: 'TREASURY',
      badgeColor: 'bg-indigo-500',
      description: 'Digunakan untuk operasional dan pengembangan ekosistem',
      functions: [
        'Biaya sistem, komunitas, dan maintenance',
        'Bukan pembagian keuntungan ke individu'
      ],
      stats: { total: '400M TPC', status: 'Active' }
    }
  ];

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Scheduled': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Locked': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const buildExplorerUrl = (address: string) => {
    return `https://explorer.solana.com/address/${address}?cluster=mainnet-beta`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(label);
      setTimeout(() => setCopiedAddress(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Filter wallets
  const filteredWallets = useMemo(() => {
    return wallets.filter(wallet => {
      const matchesSearch = searchQuery === '' || 
        wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || wallet.stats.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const activeCount = wallets.filter(w => w.stats.status === 'Active').length;
    const scheduledCount = wallets.filter(w => w.stats.status === 'Scheduled').length;
    const lockedCount = wallets.filter(w => w.stats.status === 'Locked').length;
    
    return {
      totalWallets: wallets.length,
      totalSupply: '1,000,000,000 TPC',
      activeCount,
      scheduledCount,
      lockedCount
    };
  }, []);

  return (
    <div className="mobile-container pt-6 pb-28">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-[#F0B90B]/20 text-[#F0B90B] text-xs font-medium rounded-full">
            Trust & Transparency
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Transparansi TPC
        </h1>
        
        <p className="text-[#848E9C] text-base leading-relaxed mb-6">
          Daftar wallet resmi TPC yang dapat diverifikasi publik. Gunakan halaman ini untuk menghindari penipuan yang mengatasnamakan TPC.
        </p>
        
        {/* Trust Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <Wallet className="h-3 w-3 text-blue-400" />
            <span className="text-xs text-white">Wallet resmi terbuka</span>
          </div>
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <Shield className="h-3 w-3 text-emerald-400" />
            <span className="text-xs text-white">Verifikasi on-chain</span>
          </div>
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <Lock className="h-3 w-3 text-red-400" />
            <span className="text-xs text-white">Tanpa janji profit</span>
          </div>
        </div>
        
        {/* Trust Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#12161C] border border-[#2B3139] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#F0B90B] mb-1">{summaryStats.totalWallets}</div>
            <div className="text-xs text-[#848E9C]">Wallet Resmi</div>
          </div>
          <div className="bg-[#12161C] border border-[#2B3139] rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-[#F0B90B] mb-1">1B TPC</div>
            <div className="text-xs text-[#848E9C]">Total Supply</div>
          </div>
          <div className="bg-[#12161C] border border-[#2B3139] rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-emerald-400 mb-1">{summaryStats.activeCount}</div>
            <div className="text-xs text-[#848E9C]">Active</div>
          </div>
        </div>
      </div>

      {/* Principles Section */}
      <section className="mb-8">
        <div className="bg-[#12161C] border border-[#2B3139] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#F0B90B]" />
            Prinsip Transparansi
          </h2>
          
          <p className="text-[#848E9C] text-sm mb-4">
            Transparansi kami diwujudkan melalui struktur wallet yang jelas dan dapat diverifikasi publik.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Tidak ada wallet tersembunyi',
              'Tidak ada distribusi token di luar struktur resmi',
              'Tidak ada janji keuntungan',
              'Tidak ada pengelolaan dana pengguna'
            ].map((principle, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-white text-sm">{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="mb-6">
        <div className="bg-[#12161C] border border-[#2B3139] rounded-xl p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#848E9C]" />
            <input
              type="text"
              placeholder="Cari wallet (nama / badge / alamat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1E2329] border border-[#2B3139] rounded-lg text-white placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B] transition-colors"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: 'all', label: 'Semua' },
              { value: 'Active', label: 'Active' },
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'Locked', label: 'Locked' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  statusFilter === filter.value
                    ? 'bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black'
                    : 'bg-[#1E2329] border border-[#2B3139] text-[#848E9C] hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Wallet List */}
      <section className="mb-12">
        <div className="space-y-4">
          {filteredWallets.map((wallet) => (
            <div key={wallet.id} className="bg-[#12161C] border border-[#2B3139] rounded-2xl p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${wallet.bgColor} flex items-center justify-center`}>
                    <wallet.icon className={`h-6 w-6 ${wallet.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{wallet.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${wallet.badgeColor}`}>
                        {wallet.badge}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(wallet.stats.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block mr-1"></span>
                        {wallet.stats.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#F0B90B] font-semibold">{wallet.stats.total}</div>
                  <div className="text-xs text-[#848E9C]">Total</div>
                </div>
              </div>

              {/* Address Block */}
              <div className="bg-[#1E2329] border border-[#2B3139] rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <code className="text-xs text-white font-mono break-all flex-1 mr-2">
                    {wallet.address}
                  </code>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyToClipboard(wallet.address, wallet.id)}
                      className="p-2 text-[#848E9C] hover:text-white transition-colors"
                      aria-label="Salin alamat wallet"
                    >
                      {copiedAddress === wallet.id ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <a
                      href={buildExplorerUrl(wallet.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[#848E9C] hover:text-white transition-colors"
                      aria-label="Verifikasi di Solana Explorer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                {copiedAddress === wallet.id && (
                  <div className="text-xs text-emerald-400 mt-2">Tersalin!</div>
                )}
              </div>

              {/* Functions */}
              <div>
                <h4 className="text-white font-medium mb-2">Fungsi:</h4>
                <ul className="space-y-1">
                  {wallet.functions.map((func, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">{func}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official On-Chain Data */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-[#F0B90B]" />
          <h2 className="text-white text-xl font-semibold">Official On-Chain Data</h2>
        </div>
        <TokenMintInfoCard />
      </section>

      {/* Disclaimer & Public Notes */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/10 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">Disclaimer & Catatan Penting</h3>
              <ul className="text-[#848E9C] text-sm space-y-2">
                <li>• TPC adalah platform edukasi komunitas.</li>
                <li>• Bukan layanan investasi dan tidak menghimpun dana publik.</li>
                <li>• Tidak ada jaminan hasil atau profit.</li>
                <li>• Gunakan halaman ini untuk verifikasi alamat resmi.</li>
                <li>• TPC tidak pernah meminta dana melalui chat pribadi.</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/id/anti-scam')}
              className="flex-1 bg-[#12161C] border border-[#2B3139] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1E2329] transition-all"
            >
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              Anti-Scam Guide
            </button>
            <button 
              onClick={() => navigate('/id/faq')}
              className="flex-1 bg-[#12161C] border border-[#2B3139] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1E2329] transition-all"
            >
              <Shield className="h-4 w-4 inline mr-2" />
              FAQ
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
