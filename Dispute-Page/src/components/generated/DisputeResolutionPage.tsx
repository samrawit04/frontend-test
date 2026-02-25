import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Scale, PhoneCall, Gavel, Upload, CheckCircle2, Clock, FileText, MessageSquare, Send, X, Ban, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface DisputeResolutionPageProps {
  transactionId?: string;
  onBack?: () => void;
  onComplete?: () => void;
}
type DisputePhase = 1 | 2 | 3 | 4;
interface Message {
  id: string;
  sender: 'user' | 'mediator' | 'agent';
  text: string;
  timestamp: string;
}
export const DisputeResolutionPage: React.FC<DisputeResolutionPageProps> = ({
  transactionId = `TXN-${Date.now().toString().slice(-8)}`,
  onBack,
  onComplete
}) => {
  const [currentPhase, setCurrentPhase] = useState<DisputePhase>(1);
  const [userRole, setUserRole] = useState<'user' | 'agent' | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [customDescription, setCustomDescription] = useState('');
  const [userStatementUploaded, setUserStatementUploaded] = useState(false);
  const [agentStatementUploaded, setAgentStatementUploaded] = useState(false);
  const [bankEmailSent, setBankEmailSent] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [evidenceSubmitted, setEvidenceSubmitted] = useState(false);
  const evidenceSectionRef = React.useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    sender: 'mediator',
    text: 'Hello! I\'m your dispute mediator. I\'ll help resolve this issue fairly. Please upload your bank/mobile money statements as evidence.',
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }]);
  const [newMessage, setNewMessage] = useState('');
  const [showCallRequest, setShowCallRequest] = useState(false);
  const [callRequested, setCallRequested] = useState(false);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFiles([...uploadedFiles, e.target.files[0]]);
      setUserStatementUploaded(true);

      // Add confirmation message
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: 'mediator',
        text: `✓ File "${e.target.files[0].name}" received. Thank you for uploading your statement.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages([...messages, newMsg]);
    }
  };
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');

      // Auto-reply from mediator
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'mediator',
          text: 'Thank you for your message. I\'m reviewing the information provided by both parties.',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        setMessages(prev => [...prev, reply]);
      }, 1500);
    }
  };
  const handleRequestCall = () => {
    setCallRequested(true);
    setShowCallRequest(false);
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'mediator',
      text: '📞 Call intervention requested. Our team will contact you within 24 hours to schedule a mediation call.',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages([...messages, newMsg]);
  };
  const scrollToEvidence = () => {
    if (evidenceSectionRef.current) {
      const headerOffset = 100; // Account for sticky header + some padding
      const elementPosition = evidenceSectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  const handleEvidenceSubmit = () => {
    if (uploadedFiles.length > 0) {
      setEvidenceSubmitted(true);
    }
  };
  const phases = [{
    number: 1,
    title: 'Statement Submission',
    description: 'Both parties submit full bank/mobile money statements',
    status: currentPhase > 1 ? 'complete' : currentPhase === 1 ? 'active' : 'pending',
    icon: FileText
  }, {
    number: 2,
    title: 'Bank Follow-up',
    description: 'Contact banks/providers and CC PayUpp support: help@payupp.com',
    status: currentPhase > 2 ? 'complete' : currentPhase === 2 ? 'active' : 'pending',
    icon: AlertTriangle
  }, {
    number: 3,
    title: 'Mediator Intervention',
    description: 'PayUpp mediation call with both parties',
    status: currentPhase > 3 ? 'complete' : currentPhase === 3 ? 'active' : 'pending',
    icon: PhoneCall
  }, {
    number: 4,
    title: 'Legal Action',
    description: 'Police involvement as last resort',
    status: currentPhase === 4 ? 'active' : 'pending',
    icon: Gavel
  }] as any[];
  const canRequestCall = userStatementUploaded && bankEmailSent;
  return <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-2">
            {onBack && <button onClick={onBack} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
                ← Back
              </button>}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Scale className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Dispute Resolution</h1>
                <p className="text-xs text-gray-600">Transaction ID: {transactionId}</p>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
              Under Investigation
            </div>
          </div>

          {/* High-Severity Alert Banner */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-3">
            <ShieldAlert className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-red-900 text-sm mb-1">⚠️ Important Warning</h3>
              <p className="text-xs text-red-700 leading-relaxed">
                <strong>False dispute reports are taken seriously:</strong> Submitting fake alerts or fraudulent evidence will result in a <strong>permanent ban</strong> from PayUpp. Confirmed fraudsters' photos and information may be shared with the public, with local authorities and police.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Escalation Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="text-blue-600" size={20} />
                Resolution Process
              </h2>

              <div className="space-y-6">
                {phases.map((phase, index) => {
                const Icon = phase.icon;
                return <div key={phase.number} className="relative">
                      {/* Connector Line */}
                      {index < phases.length - 1 && <div className={`absolute left-5 top-12 w-0.5 h-16 transition-all ${phase.status === 'complete' ? 'bg-green-500' : 'bg-gray-200'}`} />}

                      <div className="flex gap-4">
                        {/* Icon Circle */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow ${phase.status === 'complete' ? 'bg-green-500 text-white' : phase.status === 'active' ? 'bg-blue-600 text-white scale-110' : 'bg-gray-200 text-gray-600'}`}>
                          {phase.status === 'complete' ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                              Phase {phase.number}: {phase.title}
                            </h3>
                            {phase.status === 'active' && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                Current
                              </span>}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{phase.description}</p>

                          {/* Phase-specific actions */}
                          {phase.number === 1 && phase.status === 'active' && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-start gap-2 mb-3">
                                <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                                <p className="text-xs text-blue-700">
                                  Upload your complete bank or mobile money statement from the account with the disputed transaction. Both parties must submit evidence.
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                                <div className="flex items-center gap-2">
                                  {userStatementUploaded ? <CheckCircle2 className="text-green-600" size={16} /> : <Clock className="text-gray-400" size={16} />}
                                  <span className={userStatementUploaded ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                                    Your statement
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {agentStatementUploaded ? <CheckCircle2 className="text-green-600" size={16} /> : <Clock className="text-gray-400" size={16} />}
                                  <span className={agentStatementUploaded ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                                    Agent statement
                                  </span>
                                </div>
                              </div>

                              {userStatementUploaded && agentStatementUploaded && <button onClick={() => setCurrentPhase(2)} className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                  Proceed to Phase 2
                                </button>}
                            </div>}

                          {phase.number === 2 && phase.status === 'active' && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <div className="flex items-start gap-2 mb-3">
                                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                                <p className="text-xs text-amber-700">
                                  Contact your bank/mobile money provider regarding the disputed transaction. CC support@payupp.com in your email for documentation.
                                </p>
                              </div>
                              
                              <label className="flex items-center gap-2 mb-3 cursor-pointer">
                                <input type="checkbox" checked={bankEmailSent} onChange={e => setBankEmailSent(e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                <span className="text-xs text-gray-700">
                                  I have contacted my bank/provider and CC'd PayUpp
                                </span>
                              </label>

                              {bankEmailSent && <button onClick={() => setCurrentPhase(3)} className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                  Proceed to Phase 3
                                </button>}
                            </div>}

                          {phase.number === 3 && phase.status === 'active' && <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-xs text-green-700 mb-3">
                                A PayUpp mediator will schedule a call with both parties to resolve the dispute fairly.
                              </p>
                              {!callRequested && <button onClick={() => setShowCallRequest(true)} disabled={!canRequestCall} className="w-full bg-green-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                  <PhoneCall size={16} />
                                  Request Mediation Call
                                </button>}
                              {callRequested && <div className="bg-green-100 border border-green-300 rounded p-2 text-center">
                                  <p className="text-xs text-green-800 font-semibold">
                                    ✓ Call requested - We'll contact you within 24 hours
                                  </p>
                                </div>}
                            </div>}

                          {phase.number === 4 && phase.status === 'active' && <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-xs text-red-700 mb-3">
                                If mediation fails, PayUpp will provide all evidence to local authorities for legal action.
                              </p>
                              <button onClick={() => setCurrentPhase(4)} className="w-full bg-red-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                                <Gavel size={16} />
                                Involve Authorities
                              </button>
                            </div>}
                        </div>
                      </div>
                    </div>;
              })}
              </div>
            </div>

            {/* Issue Selection Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-blue-600" size={20} />
                Select Your Issue
              </h2>

              {/* Role Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am reporting as a: *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => {
                  setUserRole('user');
                  setSelectedIssue('');
                }} className={`px-4 py-3 text-sm font-semibold rounded-lg border-2 transition-all ${userRole === 'user' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'}`}>
                    User
                  </button>
                  <button onClick={() => {
                  setUserRole('agent');
                  setSelectedIssue('');
                }} className={`px-4 py-3 text-sm font-semibold rounded-lg border-2 transition-all ${userRole === 'agent' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'}`}>
                    Agent
                  </button>
                </div>
              </div>

              {/* Issue Options - User */}
              {userRole === 'user' && <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What issue are you experiencing? *
                  </label>
                  <div className="space-y-2">
                    {['Payment made to agent but funds not sent', 'Payment went through but agent hasn\'t seen notification', 'Payment made but has an error', 'Payment made twice by mistake', 'I sent payment to the wrong agent account', 'Agent is delaying beyond stipulated time', 'Agent sent payment to wrong recipient', 'I uploaded wrong recipient details'].map(issue => <label key={issue} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${selectedIssue === issue ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                        <input type="radio" name="issue" value={issue} checked={selectedIssue === issue} onChange={e => setSelectedIssue(e.target.value)} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700 leading-relaxed">{issue}</span>
                      </label>)}
                  </div>
                </div>}

              {/* Issue Options - Agent */}
              {userRole === 'agent' && <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What issue are you experiencing? *
                  </label>
                  <div className="space-y-2">
                    {['Sender says they\'ve paid but no alert and no transaction info in statement', 'Sender sent wrong recipient information', 'I sent the money to the wrong recipient', 'Sender has reversed the payment made to me', 'Not able to send funds to recipient', 'Exchange rate terms has changed', 'My payout method is delaying', 'I have refunded money to sender', 'Sender didn\'t send the full amount'].map(issue => <label key={issue} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${selectedIssue === issue ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                        <input type="radio" name="issue" value={issue} checked={selectedIssue === issue} onChange={e => setSelectedIssue(e.target.value)} className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700 leading-relaxed">{issue}</span>
                      </label>)}
                  </div>
                </div>}

              {/* Custom Description */}
              {userRole && <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Description
                  </label>
                  <p className="text-xs text-gray-600 mb-2">
                    Provide any additional details about your issue that might help us resolve it faster.
                  </p>
                  <textarea value={customDescription} onChange={e => setCustomDescription(e.target.value)} placeholder="Describe your issue in detail..." rows={4} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {customDescription.length} characters
                    </span>
                    {selectedIssue && <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                        <CheckCircle2 size={14} />
                        Issue selected
                      </div>}
                  </div>
                </div>}

              {/* Warning if no role selected */}
              {!userRole && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <Info className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-amber-700">
                    Please select whether you are a User or Agent to view issue options.
                  </p>
                </div>}
            </div>

            {/* Evidence Upload Section */}
            <div ref={evidenceSectionRef} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="text-blue-600" size={20} />
                Evidence Submission
              </h2>

              {evidenceSubmitted ? <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Evidence Submitted Successfully!</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your evidence has been received and is being reviewed by our team.
                  </p>
                  <button onClick={() => setEvidenceSubmitted(false)} className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Submit Additional Evidence
                  </button>
                </motion.div> : <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction ID
                    </label>
                    <input type="text" value={transactionId} disabled className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-mono" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Bank/Mobile Money Statement *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" id="statement-upload" multiple />
                      <label htmlFor="statement-upload" className="cursor-pointer">
                        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                        {uploadedFiles.length > 0 ? <div className="text-sm">
                            <p className="font-semibold text-green-600 mb-2">
                              ✓ {uploadedFiles.length} file(s) uploaded
                            </p>
                            <div className="space-y-1">
                              {uploadedFiles.map((file, idx) => <p key={idx} className="text-gray-600 text-xs">
                                  {file.name}
                                </p>)}
                            </div>
                          </div> : <div className="text-sm">
                            <p className="font-semibold text-gray-700">Click to upload documents</p>
                            <p className="text-gray-500 text-xs">PNG, JPG, or PDF (max 10MB each)</p>
                          </div>}
                      </label>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Document Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Your statement</span>
                        {userStatementUploaded ? <span className="flex items-center gap-1 text-green-600 font-semibold">
                            <CheckCircle2 size={16} />
                            Submitted
                          </span> : <span className="flex items-center gap-1 text-gray-400">
                          <Clock size={16} />
                          Pending
                        </span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Agent's statement</span>
                        {agentStatementUploaded ? <span className="flex items-center gap-1 text-green-600 font-semibold">
                            <CheckCircle2 size={16} />
                            Submitted
                          </span> : <span className="flex items-center gap-1 text-amber-500">
                          <Clock size={16} />
                          Awaiting
                        </span>}
                      </div>
                    </div>
                  </div>

                  {/* Mock simulate agent upload for demo */}
                  {userStatementUploaded && !agentStatementUploaded && <button onClick={() => setAgentStatementUploaded(true)} className="w-full text-xs text-blue-600 hover:text-blue-700 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                      [Demo: Simulate Agent Upload]
                    </button>}

                  {/* Submit Button */}
                  <button onClick={handleEvidenceSubmit} disabled={uploadedFiles.length === 0} className="w-full bg-blue-600 text-white text-sm font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <Upload size={18} />
                    Submit Evidence
                  </button>
                </div>}
            </div>

            {/* Enforcement Warnings */}
            <div className="bg-white rounded-xl border border-red-200 shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                <Ban className="text-red-600" size={20} />
                Enforcement Policy
              </h2>

              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 text-sm mb-2">🚫 Permanent Ban Policy</h3>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Users who submit fake alerts, falsified statements, or fraudulent evidence will be <strong>permanently banned</strong> from PayUpp with no appeal process. All future accounts linked to the banned user will be automatically blocked.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-bold text-amber-900 text-sm mb-2">⚖️ Legal Consequences</h3>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Confirmed fraudsters' information (photo, name, phone, email, address, and bank details) will be shared with the public, local police authorities and publicly reported to warn other users in the community.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-blue-900 text-sm mb-2">🛡️ Fair Process Guarantee</h3>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    We investigate all disputes thoroughly and fairly. Legitimate complaints are taken seriously, and innocent users are fully protected throughout the process.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dispute Chat - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24 overflow-hidden flex flex-col" style={{
            maxHeight: 'calc(100vh - 120px)'
          }}>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <h2 className="font-bold flex items-center gap-2 mb-1">
                  <MessageSquare size={20} />
                  Dispute Chat
                </h2>
                <p className="text-xs text-blue-100">
                  Mediator available 24/7
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{
              minHeight: '300px',
              maxHeight: '500px'
            }}>
                {messages.map(msg => <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : msg.sender === 'mediator' ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-gray-100 text-gray-900'}`}>
                      {msg.sender !== 'user' && <p className="text-xs font-semibold mb-1 opacity-80">
                          {msg.sender === 'mediator' ? '🛡️ Mediator' : '👤 Agent'}
                        </p>}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'opacity-60'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>)}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type your message..." className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Request Modal */}
      <AnimatePresence>
        {showCallRequest && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCallRequest(false)}>
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <PhoneCall className="text-green-600" size={20} />
                  Request Mediation Call
                </h3>
                <button onClick={() => setShowCallRequest(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Our mediation team will contact you within <strong>24 hours</strong> to schedule a three-way call with you, the agent, and a PayUpp mediator.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-700">
                  <strong>What to expect:</strong> The mediator will review all evidence, hear both sides, and work toward a fair resolution. This call typically lasts 15-30 minutes.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCallRequest(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleRequestCall} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  Confirm Request
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export default DisputeResolutionPage;