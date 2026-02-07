import { AlertTriangle, Shield, TrendingDown, Info } from 'lucide-react';

export default function RiskDisclosurePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Risk Disclosure</h1>
        <p className="text-gray-400">
          Important information about risks associated with blockchain activities
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <Shield className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">Educational purpose</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <AlertTriangle className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">Risk awareness</span>
        </div>
      </div>

      {/* Important Warning */}
      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h2 className="text-lg font-semibold text-red-400">Important Warning</h2>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          Blockchain and cryptocurrency activities involve significant risks that could result 
          in substantial financial losses. Never invest more than you can afford to lose. 
          This information is for educational purposes only and should not be considered 
          financial advice.
        </p>
      </div>

      {/* Risk Categories */}
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-yellow-400" />
            Market Risks
          </h2>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Price Volatility</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Cryptocurrency prices can be extremely volatile and may change rapidly in response 
                to market events, regulatory changes, or technological developments.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Liquidity Risk</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Some cryptocurrencies may have low trading volumes, making it difficult to buy 
                or sell without significantly affecting the price.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Market Manipulation</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Cryptocurrency markets may be subject to manipulation, including pump-and-dump 
                schemes and wash trading.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-400" />
            Technical Risks
          </h2>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Smart Contract Vulnerabilities</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Smart contracts may contain bugs or vulnerabilities that could be exploited, 
                resulting in loss of funds.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Security Breaches</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Exchanges, wallets, and other platforms may be subject to hacking, phishing, 
                or other security breaches.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Network Congestion</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                High network activity can result in slow transactions, high fees, or failed 
                transactions.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Regulatory Risks
          </h2>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Regulatory Uncertainty</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Cryptocurrency regulations vary by jurisdiction and may change rapidly, potentially 
                affecting the legality and value of digital assets.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Tax Implications</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Cryptocurrency transactions may have tax consequences that vary by jurisdiction. 
                Consult with tax professionals for guidance.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Info className="h-5 w-5 text-yellow-400" />
            Operational Risks
          </h2>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Loss of Access</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Losing access to your wallet (private keys, passwords, or recovery phrases) 
                may result in permanent loss of funds.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">User Error</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Sending funds to incorrect addresses, making transaction errors, or other 
                user mistakes may result in irreversible losses.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Risk Mitigation */}
      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <h2 className="text-lg font-semibold text-blue-400 mb-3">Risk Mitigation Strategies</h2>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>• Start with small amounts you can afford to lose</li>
          <li>• Use hardware wallets for significant holdings</li>
          <li>• Enable two-factor authentication on all accounts</li>
          <li>• Keep software and security measures updated</li>
          <li>• Diversify your investments</li>
          <li>• Only use reputable exchanges and platforms</li>
          <li>• Research thoroughly before investing</li>
          <li>• Consider consulting with financial professionals</li>
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
        <h3 className="font-semibold text-red-400 mb-2">Disclaimer</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          TPC Global provides educational content only and does not provide financial advice, 
          investment recommendations, or guarantee any outcomes. All blockchain and cryptocurrency 
          activities involve substantial risk. You are solely responsible for your investment 
          decisions and should conduct your own research and consult with qualified professionals 
          before making any financial decisions.
        </p>
      </div>
    </div>
  );
}
