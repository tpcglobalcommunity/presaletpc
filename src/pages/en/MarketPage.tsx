import React from 'react';
import { 
  Shield, 
  BookOpen, 
  Target, 
  Users, 
  Settings, 
  Lightbulb, 
  Globe, 
  Zap, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Coins,
  TrendingUp,
  BarChart3,
  Package,
  GraduationCap,
  Code,
  Megaphone,
  Handshake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { publicPath } from '@/lib/publicPath';
import { publicPath } from '@/lib/publicPath';

interface ProductItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: 'Available' | 'Coming Soon';
  cta: string;
  path?: string;
}

interface EcosystemMetric {
  label: string;
  value: string;
  icon: any;
  color: string;
}

export default function MarketPage() {
  const navigate = useNavigate();

  const products: ProductItem[] = [
    {
      id: 'ebook',
      title: 'Ebook & Educational Materials',
      description: 'Structured learning materials from basic to advanced',
      icon: BookOpen,
      status: 'Available',
      cta: 'Learn More',
      path: publicPath('en', 'education')
    },
    {
      id: 'training',
      title: 'Trader Training',
      description: 'Focus on skills, mindset, and consistent trading processes',
      icon: GraduationCap,
      status: 'Coming Soon',
      cta: 'View Program',
      path: publicPath('en', 'training')
    },
    {
      id: 'tools',
      title: 'Tools & Supporting Software',
      description: 'Analysis and utility tools for better trading',
      icon: Code,
      status: 'Coming Soon',
      cta: 'Details'
    },
    {
      id: 'adverting',
      title: 'Digital Advertising Services',
      description: 'TikTok / YouTube / Instagram Ads for business',
      icon: Megaphone,
      status: 'Available',
      cta: 'Service Info'
    },
    {
      id: 'website',
      title: 'Professional Website Services',
      description: 'Professional business & educational websites',
      icon: Globe,
      status: 'Available',
      cta: 'View Details'
    },
    {
      id: 'partnership',
      title: 'Business Partnerships',
      description: 'Real sector & conventional vendors',
      icon: Handshake,
      status: 'Coming Soon',
      cta: 'Learn More'
    }
  ];

  const ecosystemMetrics: EcosystemMetric[] = [
    { label: 'Educational Materials', value: '24+', icon: BookOpen, color: 'blue' },
    { label: 'Training Programs', value: '3', icon: GraduationCap, color: 'purple' },
    { label: 'Community Events', value: '12', icon: Users, color: 'emerald' },
    { label: 'DAO Lite Proposals', value: '5', icon: Target, color: 'amber' }
  ];

  const handleProductClick = (product: ProductItem) => {
    if (product.path) {
      navigate(product.path);
    }
  };

  return (
    <div className="mobile-container pt-6 pb-28">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-[#F0B90B]/20 text-[#F0B90B] text-xs font-medium rounded-full">
            Ecosystem Overview
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Market TPC
        </h1>
        
        <p className="text-[#C9D1D9] text-base leading-relaxed mb-6">
          Professional products, services, and educational resources for the TPC community.
        </p>
        
        {/* Trust Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <Target className="h-3 w-3 text-blue-400" />
            <span className="text-xs text-white">Utility-based</span>
          </div>
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <BookOpen className="h-3 w-3 text-emerald-400" />
            <span className="text-xs text-white">Education-first</span>
          </div>
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <Shield className="h-3 w-3 text-[#F0B90B]" />
            <span className="text-xs text-white">Transparent</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {products.map((product, index) => (
          <div key={product.id} className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6 hover:border-[#F0B90B]/25 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="min-w-0">
                <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
                <p className="text-[#C9D1D9] text-sm leading-relaxed">{product.description}</p>
              </div>
              <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                product.status === 'Available' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/25' 
                  : 'bg-gray-500/20 text-gray-300 border-gray-500/25'
              }`}>
                {product.status}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleProductClick(product)}
                disabled={product.status !== 'Available'}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  product.status === 'Available'
                    ? 'bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
              >
                {product.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ecosystem Metrics */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-6">Ecosystem Metrics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ecosystemMetrics.map((metric, index) => (
            <div key={index} className="bg-[#1A1F2E] border border-[#2D3748] rounded-xl p-4 text-center">
              <div className={`w-12 h-12 rounded-full bg-${metric.color}/20 flex items-center justify-center mb-3 mx-auto`}>
                {React.createElement(metric.icon, { className: `h-6 w-6 text-${metric.color}` })}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-[#C9D1D9]">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Reminder */}
      <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-[#F0B90B] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-semibold mb-2">Trust Reminder</h3>
            <p className="text-[#C9D1D9] text-sm leading-relaxed">
              Market TPC does not display token prices or speculative data. Our focus is on education, utility, and community development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
