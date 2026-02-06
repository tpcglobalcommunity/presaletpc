import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Wallet,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface Metric {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface Transaction {
  id: string;
  type: string;
  amount: string;
  status: 'completed' | 'pending';
  timestamp: string;
  hash: string;
}

const translations = {
  en: {
    pageTitle: "Transparency - TPC Global",
    metaDescription: "View TPC Global's transparent operations including real-time metrics, financial data, and transaction records.",
    heroTitle: "Complete Transparency",
    heroSubtitle: "Real-time access to our operations, finances, and community metrics",
    metrics: {
      title: "Live Metrics",
      totalSupply: "Total Supply",
      circulatingSupply: "Circulating Supply", 
      marketCap: "Market Cap",
      holders: "Total Holders",
      transactions24h: "24h Transactions",
      totalTransactions: "Total Transactions",
      lastUpdated: "Last Updated"
    },
    financials: {
      title: "Financial Transparency",
      treasuryBalance: "Treasury Balance",
      developmentFund: "Development Fund",
      marketingFund: "Marketing Fund",
      communityRewards: "Community Rewards",
      viewDetails: "View Detailed Report"
    },
    recentTransactions: {
      title: "Recent Transactions",
      type: "Type",
      amount: "Amount",
      status: "Status",
      timestamp: "Time",
      hash: "Transaction Hash",
      viewAll: "View All Transactions",
      completed: "Completed",
      pending: "Pending"
    },
    audit: {
      title: "Audit & Security",
      smartContractAudit: "Smart Contract Audit",
      securityReport: "Security Report",
      bugBounty: "Bug Bounty Program",
      viewAudit: "View Audit Report"
    }
  },
  id: {
    pageTitle: "Transparansi - TPC Global",
    metaDescription: "Lihat operasi transparan TPC Global termasuk metrik real-time, data keuangan, dan catatan transaksi.",
    heroTitle: "Transparansi Penuh",
    heroSubtitle: "Akses real-time ke operasi, keuangan, dan metrik komunitas kami",
    metrics: {
      title: "Metrik Langsung",
      totalSupply: "Total Suplai",
      circulatingSupply: "Suplai Beredar",
      marketCap: "Kapitalisasi Pasar",
      holders: "Total Pemegang",
      transactions24h: "Transaksi 24j",
      totalTransactions: "Total Transaksi",
      lastUpdated: "Terakhir Diperbarui"
    },
    financials: {
      title: "Transparansi Keuangan",
      treasuryBalance: "Saldo Treasury",
      developmentFund: "Dana Pengembangan",
      marketingFund: "Dana Pemasaran",
      communityRewards: "Hadiah Komunitas",
      viewDetails: "Lihat Laporan Detail"
    },
    recentTransactions: {
      title: "Transaksi Terbaru",
      type: "Tipe",
      amount: "Jumlah",
      status: "Status",
      timestamp: "Waktu",
      hash: "Hash Transaksi",
      viewAll: "Lihat Semua Transaksi",
      completed: "Selesai",
      pending: "Menunggu"
    },
    audit: {
      title: "Audit & Keamanan",
      smartContractAudit: "Audit Smart Contract",
      securityReport: "Laporan Keamanan",
      bugBounty: "Program Bug Bounty",
      viewAudit: "Lihat Laporan Audit"
    }
  }
};

export default function TransparencyPage() {
  const navigate = useNavigate();
  const { lang = 'en' } = useParams();
  const t = translations[lang as keyof typeof translations];

  // Sample data - replace with actual data from API
  const metrics: Metric[] = [
    {
      label: t.metrics.totalSupply,
      value: "300,000,000 TPC",
      trend: 'neutral'
    },
    {
      label: t.metrics.circulatingSupply,
      value: "150,000,000 TPC",
      change: "+2.3%",
      trend: 'up'
    },
    {
      label: t.metrics.marketCap,
      value: "$15,000,000",
      change: "+5.7%",
      trend: 'up'
    },
    {
      label: t.metrics.holders,
      value: "25,432",
      change: "+12%",
      trend: 'up'
    }
  ];

  const financials = [
    {
      label: t.financials.treasuryBalance,
      value: "$2,500,000",
      percentage: 100
    },
    {
      label: t.financials.developmentFund,
      value: "$750,000", 
      percentage: 30
    },
    {
      label: t.financials.marketingFund,
      value: "$500,000",
      percentage: 20
    },
    {
      label: t.financials.communityRewards,
      value: "$250,000",
      percentage: 10
    }
  ];

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "Token Transfer",
      amount: "1,000 TPC",
      status: "completed",
      timestamp: "2 minutes ago",
      hash: "0x1234...5678"
    },
    {
      id: "2", 
      type: "Staking Reward",
      amount: "50 TPC",
      status: "completed",
      timestamp: "15 minutes ago",
      hash: "0xabcd...efgh"
    },
    {
      id: "3",
      type: "Token Purchase",
      amount: "5,000 TPC", 
      status: "pending",
      timestamp: "1 hour ago",
      hash: "0x9876...5432"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#F0B90B]/10 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-[#F0B90B]/20 rounded-2xl border border-[#F0B90B]/30">
                <Shield className="h-12 w-12 text-[#F0B90B]" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t.heroTitle}
            </h1>
            <p className="text-xl text-[#C9D1D9] mb-8 max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">{t.metrics.title}</h2>
          <div className="text-sm text-[#848E9C]">
            {t.metrics.lastUpdated}: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-[#1A1F2E] border-[#2D3748]">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-[#848E9C] mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                  {metric.trend && (
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      <TrendingUp className="h-4 w-4" />
                      {metric.change}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Financial Transparency */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">{t.financials.title}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-[#1A1F2E] border-[#2D3748]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#F0B90B]" />
                Treasury Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {financials.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#C9D1D9]">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#1A1F2E] border-[#2D3748]">
            <CardHeader>
              <CardTitle className="text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-[#2D3748] rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-[#F0B90B]" />
                  <div>
                    <p className="text-sm text-[#848E9C]">24h Volume</p>
                    <p className="text-lg font-bold text-white">$1,250,000</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-[#2D3748] rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-[#F0B90B]" />
                  <div>
                    <p className="text-sm text-[#848E9C]">Active Users</p>
                    <p className="text-lg font-bold text-white">8,432</p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90"
                onClick={() => window.open('/reports/financial', '_blank')}
              >
                {t.financials.viewDetails}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">{t.recentTransactions.title}</h2>
          <Button 
            variant="outline" 
            className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black"
          >
            {t.recentTransactions.viewAll}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <Card className="bg-[#1A1F2E] border-[#2D3748]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2D3748]">
                    <th className="text-left p-4 text-[#848E9C] font-medium">{t.recentTransactions.type}</th>
                    <th className="text-left p-4 text-[#848E9C] font-medium">{t.recentTransactions.amount}</th>
                    <th className="text-left p-4 text-[#848E9C] font-medium">{t.recentTransactions.status}</th>
                    <th className="text-left p-4 text-[#848E9C] font-medium">{t.recentTransactions.timestamp}</th>
                    <th className="text-left p-4 text-[#848E9C] font-medium">{t.recentTransactions.hash}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-[#2D3748] hover:bg-[#2D3748]/50">
                      <td className="p-4 text-white">{tx.type}</td>
                      <td className="p-4 text-white font-mono">{tx.amount}</td>
                      <td className="p-4">
                        <Badge 
                          variant={tx.status === 'completed' ? 'default' : 'secondary'}
                          className={tx.status === 'completed' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'}
                        >
                          {tx.status === 'completed' ? t.recentTransactions.completed : t.recentTransactions.pending}
                        </Badge>
                      </td>
                      <td className="p-4 text-[#848E9C]">{tx.timestamp}</td>
                      <td className="p-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-[#F0B90B] hover:bg-[#F0B90B]/10 font-mono text-xs"
                          onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                        >
                          {tx.hash}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit & Security */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">{t.audit.title}</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-[#1A1F2E] border-[#2D3748] hover:border-[#F0B90B]/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-[#F0B90B]/10 rounded-2xl mb-4 mx-auto w-fit">
                <CheckCircle className="h-8 w-8 text-[#F0B90B]" />
              </div>
              <h3 className="text-white font-semibold mb-2">{t.audit.smartContractAudit}</h3>
              <p className="text-[#848E9C] text-sm mb-4">
                {lang === 'en' 
                  ? "Audited by leading security firms"
                  : "Diaudit oleh perusahaan keamanan terkemuka"}
              </p>
              <Button 
                variant="outline" 
                className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black"
                onClick={() => window.open('/audit/smart-contract', '_blank')}
              >
                {t.audit.viewAudit}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1F2E] border-[#2D3748] hover:border-[#F0B90B]/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-[#F0B90B]/10 rounded-2xl mb-4 mx-auto w-fit">
                <Shield className="h-8 w-8 text-[#F0B90B]" />
              </div>
              <h3 className="text-white font-semibold mb-2">{t.audit.securityReport}</h3>
              <p className="text-[#848E9C] text-sm mb-4">
                {lang === 'en'
                  ? "Regular security assessments and updates"
                  : "Penilaian keamanan dan pembaruan reguler"}
              </p>
              <Button 
                variant="outline" 
                className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black"
                onClick={() => window.open('/security/report', '_blank')}
              >
                {t.audit.viewAudit}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1F2E] border-[#2D3748] hover:border-[#F0B90B]/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-[#F0B90B]/10 rounded-2xl mb-4 mx-auto w-fit">
                <AlertCircle className="h-8 w-8 text-[#F0B90B]" />
              </div>
              <h3 className="text-white font-semibold mb-2">{t.audit.bugBounty}</h3>
              <p className="text-[#848E9C] text-sm mb-4">
                {lang === 'en'
                  ? "Report vulnerabilities and earn rewards"
                  : "Laporkan kerentanan dan dapatkan hadiah"}
              </p>
              <Button 
                variant="outline" 
                className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black"
                onClick={() => window.open('/bug-bounty', '_blank')}
              >
                {t.audit.viewAudit}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
