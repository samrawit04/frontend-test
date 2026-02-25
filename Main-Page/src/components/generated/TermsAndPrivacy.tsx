import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, Scale, Eye, Lock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
interface TermsAndPrivacyProps {
  onBack: () => void;
}
export const TermsAndPrivacy = ({
  onBack
}: TermsAndPrivacyProps) => {
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-3">
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Terms of Service & Privacy Policy
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Last updated: January 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Important Notice */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-600 rounded-lg p-6">
          <div className="flex gap-4">
            <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Zero Tolerance Policy
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                PayUpp maintains a strict zero-tolerance policy for illegal activities. We actively monitor, investigate, and take swift action against any violations of our terms.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Prohibited Activities */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Prohibited Activities & Conduct
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              PayUpp does not support, permit, or tolerate any of the following activities. Engaging in any prohibited conduct will result in immediate account suspension, permanent ban, and may lead to legal action:
            </p>

            <div className="space-y-3 ml-4">
              <div className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <div>
                  <strong className="text-gray-900">Money Laundering:</strong> Any attempt to disguise the origins of illegally obtained money or to move funds through our platform to conceal their source.
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <div>
                  <strong className="text-gray-900">Terrorism Financing:</strong> Providing financial support, directly or indirectly, to terrorist organizations, activities, or individuals engaged in terrorism.
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <div>
                  <strong className="text-gray-900">Sex Trafficking:</strong> Any involvement in the recruitment, harboring, transportation, provision, or obtaining of persons for the purpose of sexual exploitation.
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <div>
                  <strong className="text-gray-900">Fraud:</strong> Deceptive practices, misrepresentation, identity theft, or any form of fraudulent activity designed to deceive other users, agents, or the platform.
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <div>
                  <strong className="text-gray-900">Criminal Financing:</strong> Funding or facilitating any illegal activities including but not limited to drug trafficking, human trafficking, arms dealing, or organized crime.
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <div>
                  <strong className="text-gray-900">Sanctions Violations:</strong> Conducting transactions with sanctioned individuals, entities, or countries in violation of international sanctions laws.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enforcement & Legal Action */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Scale size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Enforcement & Legal Consequences
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              Upon discovery or suspicion of prohibited activities, PayUpp reserves the right to take the following actions without prior notice:
            </p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Immediate Actions:</h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Immediate suspension or permanent ban of user/agent accounts</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Freezing of pending transactions</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Retention of funds pending investigation</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Reporting to relevant law enforcement agencies</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Legal Actions:</h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Filing criminal complaints with local and international law enforcement</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Pursuing civil litigation for damages and recovery</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Cooperation with regulatory authorities and financial crime units</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Asset seizure in coordination with legal authorities</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Public Disclosure:</h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Circulation of photographs, names, and identifying details of violators to protect other users</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Sharing of information with other financial platforms and fraud prevention networks</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Publication of violation details to warn the community (in compliance with privacy laws)</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Blacklisting across PayUpp's partner networks and affiliated platforms</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-red-900 font-semibold mb-2">
                ⚠️ Criminal Prosecution
              </p>
              <p className="text-red-800 text-sm leading-relaxed">
                Violators may face criminal prosecution resulting in imprisonment, heavy fines, asset forfeiture, and a permanent criminal record. We will actively pursue all available legal remedies to the fullest extent of the law.
              </p>
            </div>
          </div>
        </section>

        {/* Loss of Funds Disclaimer */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Loss of Funds & Liability
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              While PayUpp implements robust security measures and verification processes, users acknowledge and agree to the following:
            </p>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">User Responsibility:</h3>
                <p className="text-sm">
                  Users are solely responsible for verifying agent credentials, transaction details, and ensuring they follow best practices for secure money transfers. PayUpp provides tools and information but cannot guarantee the actions of individual agents or users.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Transfer Risks:</h3>
                <p className="text-sm">
                  International money transfers carry inherent risks including but not limited to: exchange rate fluctuations, technical errors, network delays, agent non-performance, and force majeure events. Users accept these risks when using the platform.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Limited Liability:</h3>
                <p className="text-sm">
                  PayUpp's liability for any loss of funds, whether through technical failure, agent misconduct, or other causes, is limited to the platform service fee charged for that specific transaction. PayUpp is not liable for consequential, indirect, or punitive damages.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Dispute Resolution:</h3>
                <p className="text-sm">
                  In the event of a dispute or loss, users must report the issue within 48 hours. PayUpp will investigate and work with financial institutions to resolve disputes, but successful recovery of funds cannot be guaranteed. Users agree to cooperate fully in any investigation.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-yellow-900 font-semibold mb-2">
                💡 Recommendation
              </p>
              <p className="text-yellow-800 text-sm leading-relaxed">
                Start with small amounts when using a new agent. Always verify receipt of funds before releasing payment. Keep all transaction records and communications on the platform. Report any suspicious activity immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Lock size={20} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Privacy & Data Protection
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <h3 className="font-semibold text-gray-900">Information We Collect:</h3>
            <ul className="space-y-2 ml-4 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>Personal identification information (name, email, phone number, address)</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Government-issued identification documents for KYC verification</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Financial information and transaction history</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Device information, IP addresses, and usage data</span>
              </li>
            </ul>

            <h3 className="font-semibold text-gray-900 mt-6">How We Use Your Information:</h3>
            <ul className="space-y-2 ml-4 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>Verify identity and prevent fraud</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Process and facilitate money transfers</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Comply with legal and regulatory requirements</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Improve platform security and user experience</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Investigate suspicious activities and enforce our terms</span>
              </li>
            </ul>

            <h3 className="font-semibold text-gray-900 mt-6">Data Sharing & Disclosure:</h3>
            <p className="text-sm">
              We may share your information with:
            </p>
            <ul className="space-y-2 ml-4 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>Verified agents necessary to complete your transaction</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Law enforcement agencies and regulatory authorities when legally required</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Financial institutions and payment processors</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Fraud prevention networks and security services</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>In cases of policy violations, with relevant parties to protect the community</span>
              </li>
            </ul>

            <h3 className="font-semibold text-gray-900 mt-6">Your Rights:</h3>
            <ul className="space-y-2 ml-4 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>Access and review your personal data</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Request correction of inaccurate information</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Request deletion of data (subject to legal retention requirements)</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Opt-out of marketing communications</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Lodge complaints with data protection authorities</span>
              </li>
            </ul>
          </div>
        </section>

        {/* User Obligations */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              User Obligations & Compliance
            </h2>
          </div>

          <div className="space-y-4 text-gray-700 text-sm">
            <p className="leading-relaxed">
              By using PayUpp, you agree to:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2">
                <span>•</span>
                <span>Provide accurate and truthful information at all times</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Comply with all applicable laws in your jurisdiction</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Use the platform only for legitimate, legal purposes</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Report suspicious activities or policy violations</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Maintain the confidentiality of your account credentials</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Complete all transactions through the platform (no off-platform dealings)</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Cooperate with security investigations and provide requested documentation</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Accept responsibility for your transactions and due diligence</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Modifications */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Eye size={20} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Modifications to Terms
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-sm">
            <p className="leading-relaxed">
              PayUpp reserves the right to modify these Terms of Service and Privacy Policy at any time. Changes will be effective immediately upon posting. Continued use of the platform after changes constitutes acceptance of the modified terms.
            </p>
            <p className="leading-relaxed">
              We will notify users of material changes via email or platform notification. It is your responsibility to review these terms regularly.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Questions or Concerns?</h2>
          <p className="text-blue-100 text-sm mb-4">
            If you have questions about our Terms of Service or Privacy Policy, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Contact Support
            </button>
            <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors">
              Report Violation
            </button>
          </div>
        </section>

        {/* Acceptance */}
        <div className="bg-gray-100 border-l-4 border-blue-600 rounded-lg p-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            <strong className="text-gray-900">By using PayUpp,</strong> you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and Privacy Policy. If you do not agree with any part of these terms, you must not use our platform.
          </p>
        </div>
      </div>
    </div>;
};