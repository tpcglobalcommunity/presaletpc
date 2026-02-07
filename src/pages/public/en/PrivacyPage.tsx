import { Shield, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
        <p className="text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <Shield className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">Privacy protected</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <Lock className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">Data secure</span>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-yellow-400" />
            1. Information We Collect
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-300 leading-relaxed">
              We collect information to provide and improve our educational services:
            </p>
            <ul className="text-sm text-gray-400 space-y-1 ml-4">
              <li>• Account information (email, name)</li>
              <li>• Authentication data (Google OAuth)</li>
              <li>• Learning progress and course completion</li>
              <li>• Technical data (IP address, device info)</li>
              <li>• Usage patterns and preferences</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-yellow-400" />
            2. How We Use Your Information
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-300 leading-relaxed">
              Your information is used to:
            </p>
            <ul className="text-sm text-gray-400 space-y-1 ml-4">
              <li>• Provide access to educational content</li>
              <li>• Track learning progress</li>
              <li>• Improve our services and user experience</li>
              <li>• Send important updates and notifications</li>
              <li>• Ensure platform security and prevent fraud</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-yellow-400" />
            3. Data Protection
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            We implement industry-standard security measures including encryption, secure 
            authentication, and regular security audits to protect your personal information. 
            Access to your data is restricted to authorized personnel only.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-400" />
            4. Information Sharing
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            We do not sell, rent, or share your personal information with third parties for 
            marketing purposes. We may share information only when:
          </p>
          <ul className="text-sm text-gray-400 space-y-1 ml-4">
            <li>• Required by law or legal process</li>
            <li>• Necessary to protect our rights and safety</li>
            <li>• With your explicit consent</li>
            <li>• With trusted service providers (under strict confidentiality)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-yellow-400" />
            5. Your Rights
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            You have the right to:
          </p>
          <ul className="text-sm text-gray-400 space-y-1 ml-4">
            <li>• Access your personal information</li>
            <li>• Correct inaccurate data</li>
            <li>• Request deletion of your account</li>
            <li>• Opt-out of non-essential communications</li>
            <li>• Export your data</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-yellow-400" />
            6. Data Retention
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            We retain your information only as long as necessary to provide our services and 
            comply with legal obligations. You may request deletion of your account at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-400" />
            7. Cookies and Tracking
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            We use cookies and similar technologies to enhance your experience, analyze usage, 
            and maintain security. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-yellow-400" />
            8. International Data Transfers
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place to protect your data in accordance 
            with applicable privacy laws.
          </p>
        </section>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-white mb-2">Privacy Questions?</h3>
        <p className="text-sm text-gray-300">
          For privacy-related inquiries or to exercise your rights, contact us at:{' '}
          <span className="text-yellow-400">privacy@tpcglobal.io</span>
        </p>
      </div>
    </div>
  );
}
