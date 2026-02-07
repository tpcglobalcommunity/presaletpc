import { FileText, Shield, Users, Globe } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Terms & Conditions</h1>
        <p className="text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <Shield className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">Legal agreement</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
          <Shield className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-gray-300">Education-only</span>
        </div>
      </div>

      {/* Terms Content */}
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-yellow-400" />
            1. Acceptance of Terms
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            By accessing and using TPC Global services, you acknowledge that you have read, 
            understood, and agree to be bound by these Terms & Conditions. If you do not 
            agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-yellow-400" />
            2. Educational Purpose
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            TPC Global is an educational platform focused on blockchain learning and development. 
            All content, courses, and materials are provided for educational purposes only and 
            should not be considered financial advice, investment recommendations, or profit 
            guarantees.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-yellow-400" />
            3. User Responsibilities
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-300 leading-relaxed">
              As a user of TPC Global, you agree to:
            </p>
            <ul className="text-sm text-gray-400 space-y-1 ml-4">
              <li>• Use the platform for educational purposes only</li>
              <li>• Not engage in fraudulent or illegal activities</li>
              <li>• Respect other users and community guidelines</li>
              <li>• Protect your account credentials and personal information</li>
              <li>• Report suspicious activities to our security team</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-400" />
            4. Risk Disclosure
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Blockchain and cryptocurrency activities involve significant risks including but not 
            limited to market volatility, technical risks, and regulatory changes. TPC Global 
            does not guarantee any returns or outcomes. Always conduct your own research and 
            consult with qualified professionals before making any decisions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-yellow-400" />
            5. Intellectual Property
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            All content, materials, and intellectual property on TPC Global are owned by 
            TPC Global or its licensors. Users may not reproduce, distribute, or create 
            derivative works without explicit permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-yellow-400" />
            6. Privacy and Data
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Your privacy is important to us. Please review our Privacy Policy to understand 
            how we collect, use, and protect your personal information. By using our services, 
            you consent to the collection and use of information as described in our Privacy Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-400" />
            7. Limitation of Liability
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            TPC Global shall not be liable for any direct, indirect, incidental, or consequential 
            damages arising from your use of our services. Use of our platform is at your own 
            risk and discretion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-yellow-400" />
            8. Changes to Terms
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            TPC Global reserves the right to modify these terms at any time. Changes will be 
            effective immediately upon posting. Your continued use of our services constitutes 
            acceptance of any modified terms.
          </p>
        </section>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-white mb-2">Contact Us</h3>
        <p className="text-sm text-gray-300">
          If you have questions about these Terms & Conditions, please contact us at:{' '}
          <span className="text-yellow-400">legal@tpcglobal.io</span>
        </p>
      </div>
    </div>
  );
}
