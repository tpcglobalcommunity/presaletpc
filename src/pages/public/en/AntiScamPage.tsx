import { Shield, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

export default function AntiScamPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Anti-Scam Protection</h1>
        <p className="text-gray-400">
          Stay safe with verified information and security guidelines
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

      {/* Official Channels */}
      <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
        <h2 className="text-lg font-semibold text-green-400 mb-3">Official Channels</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">Official Website: tpcglobal.io</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">Official Email: support@tpcglobal.io</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">Official Social Media: @TPCGlobal</span>
          </div>
        </div>
      </div>

      {/* Common Scams */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Common Scams to Avoid</h2>
        
        <div className="space-y-3">
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <h3 className="font-semibold text-red-400">Fake Investment Opportunities</h3>
            </div>
            <p className="text-sm text-gray-300">
              Be wary of promises guaranteed high returns or "too good to be true" opportunities.
            </p>
          </div>

          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <h3 className="font-semibold text-red-400">Phishing Websites</h3>
            </div>
            <p className="text-sm text-gray-300">
              Always verify you're on the official TPC Global website before entering any information.
            </p>
          </div>

          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <h3 className="font-semibold text-red-400">Impersonation Scams</h3>
            </div>
            <p className="text-sm text-gray-300">
              Scammers may pose as TPC team members. Never share private keys or passwords.
            </p>
          </div>

          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <h3 className="font-semibold text-red-400">Fake Giveaways</h3>
            </div>
            <p className="text-sm text-gray-300">
              Legitimate giveaways will never ask you to send funds first to receive rewards.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Safety Tips</h2>
        
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-2">🔐 Protect Your Wallet</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Never share your private keys</li>
              <li>• Use hardware wallets for large amounts</li>
              <li>• Enable two-factor authentication</li>
              <li>• Keep software updated</li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-2">🔍 Verify Information</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Double-check URLs and email addresses</li>
              <li>• Cross-reference information on official channels</li>
              <li>• Be skeptical of urgent requests</li>
              <li>• Research before investing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Report Scams */}
      <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
        <h2 className="text-lg font-semibold text-yellow-400 mb-3">Report Scams</h2>
        <p className="text-sm text-gray-300 mb-3">
          If you encounter a scam or suspicious activity:
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Email: security@tpcglobal.io</span>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Include screenshots and details</span>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
        <h3 className="font-semibold text-red-400 mb-2">Important Notice</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• TPC Global will never ask for your private keys</li>
          <li>• We will never guarantee investment returns</li>
          <li>• Always verify through official channels</li>
          <li>• If in doubt, contact official support first</li>
        </ul>
      </div>
    </div>
  );
}
