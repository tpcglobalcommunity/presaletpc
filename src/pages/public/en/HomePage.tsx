import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, BookOpen, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">
          Welcome to TPC Global
        </h1>
        <p className="text-gray-400 text-lg">
          Education-focused blockchain ecosystem for secure learning and growth
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-full">
          <Shield className="h-4 w-4 text-yellow-400" />
          <span className="text-sm text-gray-300">Education-only</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-full">
          <Shield className="h-4 w-4 text-yellow-400" />
          <span className="text-sm text-gray-300">No financial advice</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-full">
          <Shield className="h-4 w-4 text-yellow-400" />
          <span className="text-sm text-gray-300">No profit guarantee</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Get Started</h2>
        
        <button
          onClick={() => navigate('/en/presale')}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Explore Presale</div>
              <div className="text-sm text-white/80">Learn about our token offering</div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-white" />
        </button>

        <button
          onClick={() => navigate('/en/market')}
          className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-700 rounded-lg">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">View Market</div>
              <div className="text-sm text-gray-400">Explore verified products</div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={() => navigate('/en/academy')}
          className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-700 rounded-lg">
              <BookOpen className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">TPC Academy</div>
              <div className="text-sm text-gray-400">Start learning blockchain</div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={() => navigate('/en/login')}
          className="w-full p-4 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all"
        >
          <div className="font-semibold text-white">Login to Account</div>
          <div className="text-sm text-gray-400">Access your member dashboard</div>
        </button>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Why TPC Global?</h2>
        
        <div className="space-y-3">
          <div className="p-4 bg-gray-800 rounded-xl">
            <h3 className="font-semibold text-white mb-2">🎓 Education First</h3>
            <p className="text-gray-400 text-sm">
              Focus on learning and understanding blockchain technology through comprehensive courses.
            </p>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-xl">
            <h3 className="font-semibold text-white mb-2">🛡️ Secure & Verified</h3>
            <p className="text-gray-400 text-sm">
              All products and services undergo thorough verification processes for your safety.
            </p>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-xl">
            <h3 className="font-semibold text-white mb-2">🌍 Community Driven</h3>
            <p className="text-gray-400 text-sm">
              Join a global community of learners and blockchain enthusiasts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
