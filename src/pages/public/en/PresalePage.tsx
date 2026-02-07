import { useState, useEffect } from 'react';
import { Shield, Clock, Target, Info } from 'lucide-react';

export default function PresalePage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set countdown to 6 months from now
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">TPC Token Presale</h1>
        <p className="text-gray-400">
          Early participation opportunity for education-focused blockchain ecosystem
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

      {/* Countdown Timer */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">Presale Countdown</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="text-xl font-bold text-yellow-400">{timeLeft.days}</div>
            <div className="text-xs text-gray-400">Days</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="text-xl font-bold text-yellow-400">{timeLeft.hours}</div>
            <div className="text-xs text-gray-400">Hours</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="text-xl font-bold text-yellow-400">{timeLeft.minutes}</div>
            <div className="text-xs text-gray-400">Minutes</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="text-xl font-bold text-yellow-400">{timeLeft.seconds}</div>
            <div className="text-xs text-gray-400">Seconds</div>
          </div>
        </div>
      </div>

      {/* Presale Stages */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Presale Stages</h2>
        
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Stage 1</h3>
              <span className="text-yellow-400 font-bold">$0.001</span>
            </div>
            <div className="text-sm text-gray-400">
              Supply: 200,000,000 TPC tokens
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Stage 2</h3>
              <span className="text-yellow-400 font-bold">$0.002</span>
            </div>
            <div className="text-sm text-gray-400">
              Supply: 100,000,000 TPC tokens
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white">Total Presale Supply</h3>
            <span className="text-yellow-400 font-bold">300,000,000</span>
          </div>
          <div className="text-sm text-gray-400">
            TPC tokens available across all stages
          </div>
        </div>
      </div>

      {/* Target Information */}
      <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-yellow-400" />
          <span className="font-semibold text-white">Listing Target</span>
        </div>
        <div className="text-sm text-gray-300 mb-2">
          Target listing price: <span className="text-yellow-400 font-bold">$0.005</span>
        </div>
        <div className="flex items-start gap-2">
          <Info className="h-3 w-3 text-yellow-400 mt-0.5" />
          <p className="text-xs text-gray-400">
            This is a target goal, not a guarantee. Actual listing price may vary based on market conditions and regulatory approvals.
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
        <h3 className="font-semibold text-red-400 mb-2">Important Notice</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• This is an educational blockchain project</li>
          <li>• Not investment advice or financial recommendation</li>
          <li>• Token value may fluctuate significantly</li>
          <li>• Only participate what you can afford to lose</li>
          <li>• Please read all terms and risk disclosures</li>
        </ul>
      </div>
    </div>
  );
}
