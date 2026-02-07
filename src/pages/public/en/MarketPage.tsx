import { Shield, CheckCircle, Eye } from 'lucide-react';

export default function MarketPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">TPC Market</h1>
        <p className="text-gray-400">
          Verified products and services in our ecosystem
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <Shield className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">Education-only</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <Shield className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">No financial advice</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <Shield className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">No profit guarantee</span>
        </div>
      </div>

      {/* Market Categories */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Market Categories</h2>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Eye className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Educational Content</h3>
                <p className="text-sm text-gray-400">Verified learning materials</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Blockchain courses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Trading tutorials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Security guides</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Shield className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Tools & Utilities</h3>
                <p className="text-sm text-gray-400">Verified blockchain tools</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Wallet security tools</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Portfolio trackers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Analytics platforms</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Shield className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Community Services</h3>
                <p className="text-sm text-gray-400">Peer-to-peer services</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Mentorship programs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Study groups</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Project collaboration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Process */}
      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <h3 className="font-semibold text-blue-400 mb-2">Verification Process</h3>
        <p className="text-sm text-gray-300 mb-3">
          All products and services in TPC Market undergo thorough verification:
        </p>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Team background verification</li>
          <li>• Technical security audit</li>
          <li>• Educational value assessment</li>
          <li>• Community feedback review</li>
          <li>• Ongoing compliance monitoring</li>
        </ul>
      </div>

      {/* Important Notice */}
      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
        <h3 className="font-semibold text-red-400 mb-2">Important Notice</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Market is for educational purposes only</li>
          <li>• Not financial advice or investment recommendations</li>
          <li>• Always do your own research</li>
          <li>• Report suspicious activities immediately</li>
        </ul>
      </div>
    </div>
  );
}
