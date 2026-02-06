import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Star,
  BookOpen,
  Target,
  Zap,
  Award,
  ChevronRight,
  Play,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const translations = {
  en: {
    pageTitle: "TPC Global - Professional Trading Community",
    metaDescription: "Join TPC Global, the premier professional trading community. Learn from experts, access exclusive resources, and elevate your trading skills.",
    heroTitle: "Professional Trading Community",
    heroSubtitle: "Master the markets with expert guidance and cutting-edge tools",
    getStarted: "Get Started",
    learnMore: "Learn More",
    features: {
      title: "Why Choose TPC Global?",
      education: {
        title: "Expert Education",
        description: "Comprehensive trading courses from basics to advanced strategies"
      },
      community: {
        title: "Active Community", 
        description: "Connect with 25,000+ traders worldwide"
      },
      tools: {
        title: "Professional Tools",
        description: "Access premium trading indicators and analytics"
      },
      support: {
        title: "24/7 Support",
        description: "Get help whenever you need it from our expert team"
      }
    },
    stats: {
      members: "Community Members",
      courses: "Expert Courses",
      countries: "Countries",
      satisfaction: "Satisfaction Rate"
    },
    cta: {
      title: "Ready to Elevate Your Trading?",
      description: "Join thousands of successful traders who have transformed their skills with TPC Global",
      primaryButton: "Start Your Journey",
      secondaryButton: "Explore Features"
    }
  },
  id: {
    pageTitle: "TPC Global - Komunitas Trading Profesional",
    metaDescription: "Bergabung dengan TPC Global, komunitas trading profesional terkemuka. Pelajari dari ahli, akses sumber daya eksklusif, dan tingkatkan keterampilan trading Anda.",
    heroTitle: "Komunitas Trading Profesional",
    heroSubtitle: "Kuasai pasar dengan panduan ahli dan tools canggih",
    getStarted: "Mulai Sekarang",
    learnMore: "Pelajari Lebih Lanjut",
    features: {
      title: "Mengapa Memilih TPC Global?",
      education: {
        title: "Edukasi Ahli",
        description: "Kursus trading komprehensif dari dasar hingga strategi lanjutan"
      },
      community: {
        title: "Komunitas Aktif",
        description: "Terhubung dengan 25,000+ trader di seluruh dunia"
      },
      tools: {
        title: "Tools Profesional",
        description: "Akses indikator dan analitik trading premium"
      },
      support: {
        title: "Dukungan 24/7",
        description: "Dapatkan bantuan kapan saja Anda butuhkan dari tim ahli kami"
      }
    },
    stats: {
      members: "Anggota Komunitas",
      courses: "Kursus Ahli", 
      countries: "Negara",
      satisfaction: "Tingkat Kepuasan"
    },
    cta: {
      title: "Siap Meningkatkan Trading Anda?",
      description: "Bergabung dengan ribuan trader sukses yang telah mengubah keterampilan mereka dengan TPC Global",
      primaryButton: "Mulai Perjalanan Anda",
      secondaryButton: "Jelajahi Fitur"
    }
  }
};

export default function HomePage() {
  const navigate = useNavigate();
  const { lang = 'en' } = useParams();
  const t = translations[lang as keyof typeof translations];

  const stats = [
    { label: t.stats.members, value: "25,000+", icon: Users },
    { label: t.stats.courses, value: "50+", icon: BookOpen },
    { label: t.stats.countries, value: "120+", icon: Target },
    { label: t.stats.satisfaction, value: "98%", icon: Star }
  ];

  const features = [
    {
      icon: BookOpen,
      title: t.features.education.title,
      description: t.features.education.description,
      color: "text-blue-500"
    },
    {
      icon: Users,
      title: t.features.community.title,
      description: t.features.community.description,
      color: "text-green-500"
    },
    {
      icon: BarChart3,
      title: t.features.tools.title,
      description: t.features.tools.description,
      color: "text-purple-500"
    },
    {
      icon: Shield,
      title: t.features.support.title,
      description: t.features.support.description,
      color: "text-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/5 via-transparent to-transparent" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <Badge className="mb-6 bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">
              {lang === 'en' ? 'Now Global' : 'Sekarang Global'}
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t.heroTitle}
            </h1>
            
            <p className="text-xl md:text-2xl text-[#C9D1D9] mb-8 max-w-3xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90 text-lg px-8 py-4"
                onClick={() => navigate(`/${lang}/login`)}
              >
                {t.getStarted}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#2D3748] text-[#C9D1D9] hover:bg-[#2D3748] hover:text-white text-lg px-8 py-4"
                onClick={() => navigate(`/${lang}/education`)}
              >
                {t.learnMore}
                <Play className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-[#1A1F2E] border-[#2D3748] text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#F0B90B]/10 rounded-2xl">
                    <stat.icon className="h-6 w-6 text-[#F0B90B]" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-[#848E9C]">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#1A1F2E] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">{t.features.title}</h2>
            <p className="text-xl text-[#C9D1D9] max-w-2xl mx-auto">
              {lang === 'en' 
                ? "Everything you need to succeed in the markets"
                : "Semua yang Anda butuhkan untuk sukses di pasar"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-[#0B0E11] border-[#2D3748] hover:border-[#F0B90B]/50 transition-colors h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${feature.color} bg-opacity-10`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#C9D1D9] leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#F0B90B]/10 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-[#F0B90B]/20 rounded-2xl border border-[#F0B90B]/30">
                <Zap className="h-12 w-12 text-[#F0B90B]" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">
              {t.cta.title}
            </h2>
            
            <p className="text-xl text-[#C9D1D9] mb-8 max-w-2xl mx-auto">
              {t.cta.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90 text-lg px-8 py-4"
                onClick={() => navigate(`/${lang}/login`)}
              >
                {t.cta.primaryButton}
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black text-lg px-8 py-4"
                onClick={() => navigate(`/${lang}/education`)}
              >
                {t.cta.secondaryButton}
                <Award className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-[#1A1F2E] border-[#2D3748] hover:border-[#F0B90B]/50 transition-colors">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-[#F0B90B] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {lang === 'en' ? 'Start Learning' : 'Mulai Belajar'}
              </h3>
              <p className="text-[#848E9C] mb-4">
                {lang === 'en' 
                  ? 'Access our comprehensive trading education'
                  : 'Akses edukasi trading komprehensif kami'
                }
              </p>
              <Button 
                variant="outline" 
                className="w-full border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black"
                onClick={() => navigate(`/${lang}/education`)}
              >
                {lang === 'en' ? 'Browse Courses' : 'Jelajahi Kursus'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1F2E] border-[#2D3748] hover:border-[#F0B90B]/50 transition-colors">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-[#F0B90B] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {lang === 'en' ? 'Join Community' : 'Bergabung Komunitas'}
              </h3>
              <p className="text-[#848E9C] mb-4">
                {lang === 'en'
                  ? 'Connect with traders worldwide'
                  : 'Terhubung dengan trader di seluruh dunia'
                }
              </p>
              <Button 
                variant="outline" 
                className="w-full border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black"
                onClick={() => navigate(`/${lang}/dao`)}
              >
                {lang === 'en' ? 'Enter DAO' : 'Masuk DAO'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1F2E] border-[#2D3748] hover:border-[#F0B90B]/50 transition-colors">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-[#F0B90B] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {lang === 'en' ? 'Get Started' : 'Mulai Sekarang'}
              </h3>
              <p className="text-[#848E9C] mb-4">
                {lang === 'en'
                  ? 'Create your account and start trading'
                  : 'Buat akun Anda dan mulai trading'
                }
              </p>
              <Button 
                className="w-full bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90"
                onClick={() => navigate(`/${lang}/login`)}
              >
                {lang === 'en' ? 'Sign Up Now' : 'Daftar Sekarang'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
