import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  Search,
  Clock,
  Users,
  Star,
  TrendingUp,
  Award,
  Target,
  ChevronRight,
  Play,
  FileText,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  students: number;
  rating: number;
  category: string;
  progress?: number;
  instructor: string;
  topics: string[];
  isFree?: boolean;
}

interface Resource {
  id: string;
  title: string;
  type: "video" | "article" | "guide";
  category: string;
  readTime: string;
  isNew?: boolean;
}

const translations = {
  en: {
    pageTitle: "Education - TPC Global",
    metaDescription: "Learn cryptocurrency trading with TPC Global's comprehensive educational resources. From beginner guides to advanced trading strategies.",
    heroTitle: "Master Crypto Trading",
    heroSubtitle: "Comprehensive education from beginner to expert level",
    searchPlaceholder: "Search courses and resources...",
    categories: {
      all: "All Categories",
      beginner: "Beginner",
      intermediate: "Intermediate", 
      advanced: "Advanced",
      trading: "Trading",
      technical: "Technical Analysis",
      fundamental: "Fundamental Analysis"
    },
    courses: {
      title: "Featured Courses",
      viewAll: "View All Courses",
      startLearning: "Start Learning",
      continue: "Continue",
      free: "Free",
      premium: "Premium",
      level: "Level",
      duration: "Duration",
      students: "Students",
      rating: "Rating"
    },
    resources: {
      title: "Learning Resources",
      viewAll: "View All Resources",
      readMore: "Read More",
      watchNow: "Watch Now",
      new: "New",
      minutes: "min read"
    },
    stats: {
      courses: "Total Courses",
      students: "Active Students",
      resources: "Resources",
      completion: "Avg. Completion"
    }
  },
  id: {
    pageTitle: "Edukasi - TPC Global",
    metaDescription: "Pelajari trading cryptocurrency dengan sumber daya edukasi komprehensif TPC Global. Dari panduan pemula hingga strategi trading tingkat lanjut.",
    heroTitle: "Kuasai Trading Crypto",
    heroSubtitle: "Edukasi komprehensif dari pemula hingga ahli",
    searchPlaceholder: "Cari kursus dan sumber daya...",
    categories: {
      all: "Semua Kategori",
      beginner: "Pemula",
      intermediate: "Menengah",
      advanced: "Lanjutan",
      trading: "Trading",
      technical: "Analisis Teknikal",
      fundamental: "Analisis Fundamental"
    },
    courses: {
      title: "Kursus Unggulan",
      viewAll: "Lihat Semua Kursus",
      startLearning: "Mulai Belajar",
      continue: "Lanjutkan",
      free: "Gratis",
      premium: "Premium",
      level: "Level",
      duration: "Durasi",
      students: "Siswa",
      rating: "Rating"
    },
    resources: {
      title: "Sumber Daya Pembelajaran",
      viewAll: "Lihat Semua Sumber Daya",
      readMore: "Baca Selengkapnya",
      watchNow: "Tonton Sekarang",
      new: "Baru",
      minutes: "menit baca"
    },
    stats: {
      courses: "Total Kursus",
      students: "Siswa Aktif",
      resources: "Sumber Daya",
      completion: "Rata-rata Penyelesaian"
    }
  }
};

export default function EducationPage() {
  const navigate = useNavigate();
  const { lang = 'en' } = useParams();
  const t = translations[lang as keyof typeof translations];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample data - replace with actual data from API
  const courses: Course[] = [
    {
      id: "1",
      title: lang === 'en' ? "Introduction to Cryptocurrency" : "Pengantar Cryptocurrency",
      description: lang === 'en' 
        ? "Learn the fundamentals of blockchain technology and digital assets."
        : "Pelajari dasar-dasar teknologi blockchain dan aset digital.",
      duration: "2 hours",
      level: lang === 'en' ? "Beginner" : "Pemula",
      students: 15420,
      rating: 4.8,
      category: "beginner",
      instructor: "TPC Team",
      topics: ["Blockchain", "Bitcoin", "Ethereum"],
      isFree: true
    },
    {
      id: "2", 
      title: lang === 'en' ? "Technical Analysis Basics" : "Dasar Analisis Teknikal",
      description: lang === 'en'
        ? "Master chart patterns and technical indicators for trading success."
        : "Kuasai pola grafik dan indikator teknikal untuk sukses trading.",
      duration: "4 hours",
      level: lang === 'en' ? "Intermediate" : "Menengah",
      students: 8930,
      rating: 4.9,
      category: "technical",
      instructor: "TPC Team",
      topics: ["Chart Patterns", "Indicators", "Support/Resistance"],
      progress: 65
    }
  ];

  const resources: Resource[] = [
    {
      id: "1",
      title: lang === 'en' ? "Getting Started with Crypto" : "Memulai dengan Crypto",
      type: "guide",
      category: "beginner",
      readTime: "15",
      isNew: true
    },
    {
      id: "2",
      title: lang === 'en' ? "Risk Management Strategies" : "Strategi Manajemen Risiko",
      type: "article", 
      category: "trading",
      readTime: "8"
    }
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#F0B90B]/10 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t.heroTitle}
            </h1>
            <p className="text-xl text-[#C9D1D9] mb-8 max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#848E9C] h-5 w-5" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-[#1A1F2E] border-[#2D3748] text-white placeholder-[#848E9C] h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: t.stats.courses, value: "50+" },
            { label: t.stats.students, value: "25K+" },
            { label: t.stats.resources, value: "100+" },
            { label: t.stats.completion, value: "85%" }
          ].map((stat, index) => (
            <Card key={index} className="bg-[#1A1F2E] border-[#2D3748]">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-[#F0B90B] mb-2">{stat.value}</div>
                <div className="text-sm text-[#848E9C]">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {Object.entries(t.categories).map(([key, value]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              onClick={() => setSelectedCategory(key)}
              className={selectedCategory === key ? "bg-[#F0B90B] text-black" : "border-[#2D3748] text-[#C9D1D9] hover:bg-[#2D3748]"}
            >
              {value}
            </Button>
          ))}
        </div>
      </div>

      {/* Courses Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">{t.courses.title}</h2>
          <Button 
            variant="outline" 
            className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black"
          >
            {t.courses.viewAll}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="bg-[#1A1F2E] border-[#2D3748] hover:border-[#F0B90B]/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                  <Badge variant={course.isFree ? "secondary" : "default"} className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">
                    {course.isFree ? t.courses.free : t.courses.premium}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#C9D1D9] text-sm">{course.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-[#848E9C]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {course.rating}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-[#2D3748] text-[#848E9C]">
                    {course.level}
                  </Badge>
                  {course.progress && (
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-[#848E9C] mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-[#2D3748] rounded-full h-2">
                        <div 
                          className="bg-[#F0B90B] h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90"
                  onClick={() => navigate(`/${lang}/education/course/${course.id}`)}
                >
                  {course.progress ? t.courses.continue : t.courses.startLearning}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">{t.resources.title}</h2>
          <Button 
            variant="outline" 
            className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black"
          >
            {t.resources.viewAll}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="bg-[#1A1F2E] border-[#2D3748] hover:border-[#F0B90B]/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#F0B90B]/10 rounded-lg">
                    {resource.type === 'video' ? (
                      <Play className="h-6 w-6 text-[#F0B90B]" />
                    ) : (
                      <FileText className="h-6 w-6 text-[#F0B90B]" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">{resource.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-[#848E9C]">
                      <span>{resource.readTime} {t.resources.minutes}</span>
                      {resource.isNew && (
                        <Badge className="bg-[#F0B90B] text-black text-xs">
                          {t.resources.new}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-4 bg-[#2D3748]" />

                <Button 
                  variant="ghost" 
                  className="w-full text-[#F0B90B] hover:bg-[#F0B90B]/10 justify-start"
                  onClick={() => navigate(`/${lang}/education/resource/${resource.id}`)}
                >
                  {resource.type === 'video' ? t.resources.watchNow : t.resources.readMore}
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
