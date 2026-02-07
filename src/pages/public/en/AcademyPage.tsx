import { BookOpen, Users, Award, Clock } from 'lucide-react';

export default function AcademyPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">TPC Academy</h1>
        <p className="text-gray-400">
          Comprehensive blockchain education for all levels
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <BookOpen className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">Education-only</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <BookOpen className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">No financial advice</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <BookOpen className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">No profit guarantee</span>
        </div>
      </div>

      {/* Learning Tracks */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Learning Tracks</h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Beginner Track</h3>
                <p className="text-sm text-gray-400">Start your blockchain journey</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-300">
                <strong>Duration:</strong> 4-6 weeks
              </div>
              <div className="text-sm text-gray-300">
                <strong>Topics:</strong>
              </div>
              <ul className="text-xs text-gray-400 space-y-1 ml-4">
                <li>• Blockchain fundamentals</li>
                <li>• Cryptocurrency basics</li>
                <li>• Wallet security</li>
                <li>• Risk management</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Award className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Intermediate Track</h3>
                <p className="text-sm text-gray-400">Deepen your knowledge</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-300">
                <strong>Duration:</strong> 8-10 weeks
              </div>
              <div className="text-sm text-gray-300">
                <strong>Topics:</strong>
              </div>
              <ul className="text-xs text-gray-400 space-y-1 ml-4">
                <li>• Smart contracts</li>
                <li>• DeFi protocols</li>
                <li>• Technical analysis</li>
                <li>• Advanced security</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Advanced Track</h3>
                <p className="text-sm text-gray-400">Master blockchain development</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-300">
                <strong>Duration:</strong> 12-16 weeks
              </div>
              <div className="text-sm text-gray-300">
                <strong>Topics:</strong>
              </div>
              <ul className="text-xs text-gray-400 space-y-1 ml-4">
                <li>• DApp development</li>
                <li>• Protocol design</li>
                <li>• Governance systems</li>
                <li>• Research methodologies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Features */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Learning Features</h2>
        
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div>
                <h3 className="font-semibold text-white">Self-Paced Learning</h3>
                <p className="text-sm text-gray-400">Learn at your own schedule</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-yellow-400" />
              <div>
                <h3 className="font-semibold text-white">Community Support</h3>
                <p className="text-sm text-gray-400">Get help from peers and mentors</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-yellow-400" />
              <div>
                <h3 className="font-semibold text-white">Certification</h3>
                <p className="text-sm text-gray-400">Earn verified certificates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
        <h3 className="font-semibold text-red-400 mb-2">Educational Purpose</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• All courses are for educational purposes only</li>
          <li>• Not financial advice or investment recommendations</li>
          <li>• Focus on learning and skill development</li>
          <li>• Always practice with caution in real applications</li>
        </ul>
      </div>
    </div>
  );
}
