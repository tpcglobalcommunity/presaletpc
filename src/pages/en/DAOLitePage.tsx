import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Vote,
  Trophy,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  votesFor: number;
  votesAgainst: number;
  deadline: string;
  category: string;
}

interface DAOStats {
  totalProposals: number;
  activeMembers: number;
  totalVotes: number;
  treasuryBalance: string;
}

const translations = {
  en: {
    pageTitle: "DAO Lite - TPC Global",
    metaDescription: "Participate in TPC Global's decentralized governance. Vote on proposals and shape the future of our community.",
    heroTitle: "Community Governance",
    heroSubtitle: "Shape the future of TPC Global through decentralized decision making",
    stats: {
      title: "DAO Overview",
      totalProposals: "Total Proposals",
      activeMembers: "Active Members",
      totalVotes: "Total Votes",
      treasuryBalance: "Treasury Balance",
      participate: "Participate Now"
    },
    proposals: {
      title: "Active Proposals",
      viewAll: "View All Proposals",
      vote: "Vote",
      details: "View Details",
      for: "For",
      against: "Against",
      deadline: "Deadline",
      status: {
        active: "Active",
        completed: "Completed", 
        pending: "Pending"
      }
    },
    howItWorks: {
      title: "How DAO Lite Works",
      step1: {
        title: "Connect Wallet",
        description: "Connect your wallet to participate in governance"
      },
      step2: {
        title: "Review Proposals",
        description: "Read and understand community proposals"
      },
      step3: {
        title: "Cast Your Vote",
        description: "Vote on proposals that affect our ecosystem"
      },
      step4: {
        title: "Track Results",
        description: "Monitor voting outcomes and implementation"
      }
    },
    benefits: {
      title: "Why Participate?",
      benefit1: {
        title: "Shape the Future",
        description: "Direct influence on project direction"
      },
      benefit2: {
        title: "Earn Rewards", 
        description: "Get rewarded for active participation"
      },
      benefit3: {
        title: "Transparent Process",
        description: "All decisions and votes are publicly visible"
      }
    }
  },
  id: {
    pageTitle: "DAO Lite - TPC Global",
    metaDescription: "Berpartisipasi dalam tata kelola terdesentralisasi TPC Global. Vote pada proposal dan bentuk masa depan komunitas kami.",
    heroTitle: "Tata Kelola Komunitas",
    heroSubtitle: "Bentuk masa depan TPC Global melalui pengambilan keputusan terdesentralisasi",
    stats: {
      title: "Ikhtisar DAO",
      totalProposals: "Total Proposal",
      activeMembers: "Anggota Aktif",
      totalVotes: "Total Suara",
      treasuryBalance: "Saldo Treasury",
      participate: "Berpartisipasi Sekarang"
    },
    proposals: {
      title: "Proposal Aktif",
      viewAll: "Lihat Semua Proposal",
      vote: "Vote",
      details: "Lihat Detail",
      for: "Mendukung",
      against: "Menolak",
      deadline: "Batas Waktu",
      status: {
        active: "Aktif",
        completed: "Selesai",
        pending: "Menunggu"
      }
    },
    howItWorks: {
      title: "Cara Kerja DAO Lite",
      step1: {
        title: "Hubungkan Wallet",
        description: "Hubungkan wallet Anda untuk berpartisipasi dalam tata kelola"
      },
      step2: {
        title: "Review Proposal",
        description: "Baca dan pahami proposal komunitas"
      },
      step3: {
        title: "Cast Your Vote",
        description: "Vote pada proposal yang mempengaruhi ekosistem kami"
      },
      step4: {
        title: "Track Hasil",
        description: "Pantau hasil voting dan implementasi"
      }
    },
    benefits: {
      title: "Mengapa Berpartisipasi?",
      benefit1: {
        title: "Bentuk Masa Depan",
        description: "Pengaruh langsung pada arah proyek"
      },
      benefit2: {
        title: "Dapatkan Hadiah",
        description: "Dapatkan hadiah untuk partisipasi aktif"
      },
      benefit3: {
        title: "Proses Transparan",
        description: "Semua keputusan dan suara terlihat publik"
      }
    }
  }
};

export default function DAOLitePage() {
  const navigate = useNavigate();
  const { lang = 'en' } = useParams();
  const t = translations[lang as keyof typeof translations];

  // Sample data - replace with actual data from API
  const stats: DAOStats = {
    totalProposals: 45,
    activeMembers: 1234,
    totalVotes: 5678,
    treasuryBalance: "$500,000"
  };

  const proposals: Proposal[] = [
    {
      id: "1",
      title: lang === 'en' 
        ? "Community Marketing Fund Allocation" 
        : "Alokasi Dana Pemasaran Komunitas",
      description: lang === 'en'
        ? "Proposal to allocate $100,000 from treasury for community-led marketing initiatives"
        : "Proposal untuk mengalokasikan $100,000 dari treasury untuk inisiatif pemasaran yang dipimpin komunitas",
      status: 'active',
      votesFor: 234,
      votesAgainst: 56,
      deadline: "2 days remaining",
      category: "Treasury"
    },
    {
      id: "2",
      title: lang === 'en'
        ? "New Feature Development Roadmap"
        : "Peta Jalan Pengembangan Fitur Baru",
      description: lang === 'en'
        ? "Vote on the priority order for Q2 2024 feature development"
        : "Vote pada urutan prioritas untuk pengembangan fitur Q2 2024",
      status: 'active',
      votesFor: 189,
      votesAgainst: 23,
      deadline: "5 days remaining",
      category: "Development"
    },
    {
      id: "3",
      title: lang === 'en'
        ? "Partnership Program Expansion"
        : "Ekspansi Program Kemitraan",
      description: lang === 'en'
        ? "Expand partnership program to include more educational institutions"
        : "Perluas program kemitraan untuk menyertakan lebih banyak institusi pendidikan",
      status: 'completed',
      votesFor: 456,
      votesAgainst: 12,
      deadline: "Completed",
      category: "Partnership"
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
                <Users className="h-12 w-12 text-[#F0B90B]" />
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

      {/* DAO Stats */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">{t.stats.title}</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-[#1A1F2E] border-[#2D3748]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#F0B90B] mb-2">{stats.totalProposals}</div>
              <div className="text-sm text-[#848E9C]">{t.stats.totalProposals}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1F2E] border-[#2D3748]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#F0B90B] mb-2">{stats.activeMembers.toLocaleString()}</div>
              <div className="text-sm text-[#848E9C]">{t.stats.activeMembers}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1F2E] border-[#2D3748]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#F0B90B] mb-2">{stats.totalVotes.toLocaleString()}</div>
              <div className="text-sm text-[#848E9C]">{t.stats.totalVotes}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1F2E] border-[#2D3748]">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#F0B90B] mb-2">{stats.treasuryBalance}</div>
              <div className="text-sm text-[#848E9C]">{t.stats.treasuryBalance}</div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            className="bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90"
            onClick={() => navigate(`/${lang}/dao/participate`)}
          >
            {t.stats.participate}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Active Proposals */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">{t.proposals.title}</h2>
          <Button 
            variant="outline" 
            className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black"
          >
            {t.proposals.viewAll}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="space-y-6">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="bg-[#1A1F2E] border-[#2D3748] hover:border-[#F0B90B]/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{proposal.title}</h3>
                      <Badge 
                        variant={proposal.status === 'active' ? 'default' : 'secondary'}
                        className={
                          proposal.status === 'active' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
                          proposal.status === 'completed' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' :
                          'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                        }
                      >
                        {t.proposals.status[proposal.status]}
                      </Badge>
                      <Badge variant="outline" className="border-[#2D3748] text-[#848E9C]">
                        {proposal.category}
                      </Badge>
                    </div>
                    <p className="text-[#C9D1D9] mb-4">{proposal.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#848E9C]">{t.proposals.for}</span>
                      <span className="text-green-500 font-semibold">{proposal.votesFor}</span>
                    </div>
                    <Progress value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#848E9C]">{t.proposals.against}</span>
                      <span className="text-red-500 font-semibold">{proposal.votesAgainst}</span>
                    </div>
                    <Progress value={(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100} className="h-2 bg-red-500/20">
                      <div className="bg-red-500 h-2 rounded-full" />
                    </Progress>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-[#848E9C]">
                    <Clock className="h-4 w-4" />
                    {t.proposals.deadline}: {proposal.deadline}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#2D3748] text-[#C9D1D9] hover:bg-[#2D3748]"
                      onClick={() => navigate(`/${lang}/dao/proposal/${proposal.id}`)}
                    >
                      {t.proposals.details}
                    </Button>
                    
                    {proposal.status === 'active' && (
                      <Button 
                        size="sm"
                        className="bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90"
                        onClick={() => navigate(`/${lang}/dao/vote/${proposal.id}`)}
                      >
                        <Vote className="h-4 w-4 mr-2" />
                        {t.proposals.vote}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.howItWorks.title}</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Target className="h-8 w-8" />,
              title: t.howItWorks.step1.title,
              description: t.howItWorks.step1.description
            },
            {
              icon: <MessageSquare className="h-8 w-8" />,
              title: t.howItWorks.step2.title,
              description: t.howItWorks.step2.description
            },
            {
              icon: <Vote className="h-8 w-8" />,
              title: t.howItWorks.step3.title,
              description: t.howItWorks.step3.description
            },
            {
              icon: <Trophy className="h-8 w-8" />,
              title: t.howItWorks.step4.title,
              description: t.howItWorks.step4.description
            }
          ].map((step, index) => (
            <Card key={index} className="bg-[#1A1F2E] border-[#2D3748] text-center">
              <CardContent className="p-6">
                <div className="p-3 bg-[#F0B90B]/10 rounded-2xl mb-4 mx-auto w-fit text-[#F0B90B]">
                  {step.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-[#848E9C] text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.benefits.title}</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <TrendingUp className="h-8 w-8" />,
              title: t.benefits.benefit1.title,
              description: t.benefits.benefit1.description
            },
            {
              icon: <Trophy className="h-8 w-8" />,
              title: t.benefits.benefit2.title,
              description: t.benefits.benefit2.description
            },
            {
              icon: <CheckCircle className="h-8 w-8" />,
              title: t.benefits.benefit3.title,
              description: t.benefits.benefit3.description
            }
          ].map((benefit, index) => (
            <Card key={index} className="bg-[#1A1F2E] border-[#2D3748]">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-[#F0B90B]/10 rounded-2xl mb-4 mx-auto w-fit text-[#F0B90B]">
                  {benefit.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-[#848E9C] text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
