import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, MapPin, Loader2, Clock, User, CreditCard, Building2, Smartphone, Wallet, AlertCircle, PartyPopper, Check, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface TransferOffer {
  id: string;
  fromCountry: string;
  toCountry: string;
  fromFlag: string;
  toFlag: string;
  fromCurrency: string;
  toCurrency: string;
  agentName: string;
  rating: number;
  reviewCount: number;
  amount: string;
  exchangeRate: number;
  fee: string;
  deliveryTime: string;
  verified: boolean;
}
interface SendMoneyFlowProps {
  offer: TransferOffer;
  sendAmount?: string;
  onComplete?: () => void;
  onBack?: () => void;
}
type Step = 1 | 2 | 3 | 4 | 5; // 5 is the congratulations screen

// Payment methods based on destination country (receiving country)
const getPaymentMethodsForCountry = (country: string): string[] => {
  const countryPaymentMethods: Record<string, string[]> = {
    'United States': ['Bank Account', 'CashApp', 'Venmo', 'Zelle'],
    'USA': ['Bank Account', 'CashApp', 'Venmo', 'Zelle'],
    'Canada': ['Bank Account', 'Interac', 'E-Transfer'],
    'United Kingdom': ['Bank Account', 'PayPal', 'Cash Pickup'],
    'UK': ['Bank Account', 'PayPal', 'Cash Pickup'],
    'Nigeria': ['Bank Account', 'Mobile Money', 'Cash Pickup'],
    'Kenya': ['M-Pesa', 'Bank Account', 'Cash Pickup'],
    'Ghana': ['Mobile Money (MTN)', 'Bank Account', 'Cash Pickup'],
    'Uganda': ['Mobile Money', 'Bank Account', 'Cash Pickup'],
    'Tanzania': ['M-Pesa', 'Bank Account', 'Cash Pickup'],
    'Rwanda': ['Mobile Money', 'Bank Account', 'Cash Pickup'],
    'South Africa': ['Bank Account', 'Cash Pickup', 'Mobile Money'],
    'India': ['Bank Account', 'UPI', 'Paytm', 'Cash Pickup'],
    'Philippines': ['Bank Account', 'GCash', 'PayMaya', 'Cash Pickup'],
    'Pakistan': ['Bank Account', 'EasyPaisa', 'JazzCash', 'Cash Pickup'],
    'Bangladesh': ['Bank Account', 'bKash', 'Nagad', 'Cash Pickup'],
    'Mexico': ['Bank Account', 'OXXO', 'Cash Pickup'],
    'Brazil': ['Bank Account', 'Pix', 'Cash Pickup'],
    'Default': ['Bank Account', 'Mobile Money', 'Cash Pickup']
  };
  return countryPaymentMethods[country] || countryPaymentMethods['Default'];
};

// Payment methods for sending country (where money is coming from)
const getSenderPaymentMethodsForCountry = (country: string): string[] => {
  const countryPaymentMethods: Record<string, string[]> = {
    'United States': ['Bank Transfer', 'CashApp', 'Venmo', 'Zelle'],
    'USA': ['Bank Transfer', 'CashApp', 'Venmo', 'Zelle'],
    'Canada': ['Bank Transfer', 'Interac', 'E-Transfer'],
    'United Kingdom': ['Bank Transfer', 'PayPal'],
    'UK': ['Bank Transfer', 'PayPal'],
    'Nigeria': ['Bank Transfer', 'Mobile Money'],
    'Kenya': ['M-Pesa', 'Bank Transfer'],
    'Ghana': ['Mobile Money (MTN)', 'Bank Transfer'],
    'Default': ['Bank Transfer', 'Mobile Money']
  };
  return countryPaymentMethods[country] || countryPaymentMethods['Default'];
};
export const SendMoneyFlow: React.FC<SendMoneyFlowProps> = ({
  offer,
  onComplete,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Step 1: Recipient Details
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientCity, setRecipientCity] = useState('');
  const [recipientPostalCode, setRecipientPostalCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [recipientAccountDetails, setRecipientAccountDetails] = useState('');

  // Step 2: Send Money to Agent (Sender's payment details)
  const [senderPaymentProof, setSenderPaymentProof] = useState<File | null>(null);

  // Step 3: Agent Sends
  const [agentHasSent, setAgentHasSent] = useState(false);
  const [agentPaymentProof, setAgentPaymentProof] = useState<File | null>(null);

  // Step 4: Confirm Receipt
  const [receiptConfirmed, setReceiptConfirmed] = useState(false);
  const recipientAmount = (parseFloat(offer.amount.replace(/,/g, '')) * offer.exchangeRate).toFixed(2);
  const recipientPaymentMethods = getPaymentMethodsForCountry(offer.toCountry);
  const senderPaymentMethods = getSenderPaymentMethodsForCountry(offer.fromCountry);

  // Mock agent payment details (in real app, this would come from agent's profile)
  const agentPaymentDetails = {
    method: senderPaymentMethods[0],
    accountName: offer.agentName,
    accountNumber: '1234567890',
    bankName: 'Example Bank',
    additionalInfo: senderPaymentMethods.includes('CashApp') ? 'CashTag: $' + offer.agentName.replace(' ', '').toLowerCase() : senderPaymentMethods.includes('Venmo') ? '@' + offer.agentName.replace(' ', '').toLowerCase() : senderPaymentMethods.includes('Zelle') ? 'zelle@' + offer.agentName.replace(' ', '').toLowerCase() + '.com' : senderPaymentMethods.includes('Interac') ? 'interac@' + offer.agentName.replace(' ', '').toLowerCase() + '.com' : 'Account details provided'
  };
  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1 as Step);
    }
  };
  const handleStep2Send = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    handleNextStep();
  };
  const handleAgentSend = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setAgentHasSent(true);
    setIsProcessing(false);
    setTimeout(() => handleNextStep(), 1000);
  };
  const handleConfirmReceipt = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setReceiptConfirmed(true);
    setIsProcessing(false);
    setTimeout(() => handleNextStep(), 1000);
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };
  const steps = [{
    number: 1,
    title: 'Recipient Details',
    status: currentStep > 1 ? 'complete' : currentStep === 1 ? 'active' : 'pending'
  }, {
    number: 2,
    title: 'Send to Agent',
    status: currentStep > 2 ? 'complete' : currentStep === 2 ? 'active' : 'pending'
  }, {
    number: 3,
    title: 'Agent Sends',
    status: currentStep > 3 ? 'complete' : currentStep === 3 ? 'active' : 'pending'
  }, {
    number: 4,
    title: 'Confirm Receipt',
    status: currentStep > 4 ? 'complete' : currentStep === 4 ? 'active' : 'pending'
  }] as any[];

  // Validation functions
  const isStep1Valid = () => {
    return recipientName.trim() !== '' && recipientPhone.trim() !== '' && recipientAddress.trim() !== '' && recipientCity.trim() !== '' && recipientPostalCode.trim() !== '' && selectedPaymentMethod !== '' && recipientAccountDetails.trim() !== '';
  };
  const isStep2Valid = () => {
    return senderPaymentProof !== null;
  };
  const isStep3Valid = () => {
    return agentPaymentProof !== null;
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-3">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header - Compact */}
        <div className="mb-3">
          <button onClick={onBack} className="text-blue-600 hover:text-blue-700 font-medium mb-2 flex items-center gap-2 text-sm">
            ← Back to offers
          </button>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{offer.fromFlag}</span>
                  <span className="text-xs text-gray-600">{offer.fromCountry}</span>
                </div>
                <ArrowRight className="text-gray-400" size={16} />
                <div className="flex items-center gap-2">
                  <span className="text-xl">{offer.toFlag}</span>
                  <span className="text-xs text-gray-600">{offer.toCountry}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">You send</div>
                <div className="text-lg font-bold text-gray-900">
                  {offer.amount} {offer.fromCurrency}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <div className="text-xs text-gray-600">Agent</div>
                <div className="font-semibold text-gray-900 text-sm">{offer.agentName}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">Recipient gets</div>
                <div className="text-base font-bold text-blue-600">
                  {recipientAmount} {offer.toCurrency}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps - Compact */}
        {currentStep < 5 && <div className="mb-3">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all shadow ${step.status === 'complete' ? 'bg-green-500 text-white' : step.status === 'active' ? 'bg-blue-600 text-white scale-110' : 'bg-gray-200 text-gray-600'}`}>
                      {step.status === 'complete' ? <Check size={16} /> : step.number}
                    </div>
                    <div className="text-xs mt-1 text-center max-w-[70px] font-medium text-gray-700">
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 rounded transition-all ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </React.Fragment>)}
            </div>
          </div>}

        {/* Step Content - Compact */}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} transition={{
          duration: 0.3
        }}>
            {/* STEP 1: RECIPIENT DETAILS */}
            {currentStep === 1 && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="text-blue-600" size={20} />
                  Recipient Details
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1 text-xs">Sending to {offer.toCountry}</h3>
                      <p className="text-xs text-blue-700">
                        Enter recipient details to receive {recipientAmount} {offer.toCurrency}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Full Name *</label>
                    <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Enter recipient's full name" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Phone *</label>
                    <input type="tel" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} placeholder="Enter phone number" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                    <input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} placeholder="Enter email address" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                    <input type="text" value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} placeholder="Enter street address" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input type="text" value={recipientCity} onChange={e => setRecipientCity(e.target.value)} placeholder="Enter city" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                      <input type="text" value={recipientPostalCode} onChange={e => setRecipientPostalCode(e.target.value)} placeholder="Enter postal code" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method for {offer.toCountry} *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {recipientPaymentMethods.map(method => <button key={method} onClick={() => setSelectedPaymentMethod(method)} className={`p-2.5 rounded-lg border-2 transition-all text-sm font-medium ${selectedPaymentMethod === method ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
                          {method}
                        </button>)}
                    </div>
                  </div>

                  {selectedPaymentMethod && <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {selectedPaymentMethod === 'Bank Account' ? 'Bank Account Number' : selectedPaymentMethod.includes('Mobile Money') || selectedPaymentMethod.includes('M-Pesa') ? 'Mobile Money Number' : selectedPaymentMethod.includes('CashApp') ? 'CashTag ($username)' : selectedPaymentMethod.includes('Venmo') ? 'Venmo Username (@username)' : selectedPaymentMethod.includes('Zelle') ? 'Zelle Email or Phone' : selectedPaymentMethod.includes('Interac') ? 'Interac Email' : selectedPaymentMethod.includes('UPI') ? 'UPI ID' : selectedPaymentMethod.includes('GCash') ? 'GCash Number' : selectedPaymentMethod.includes('Pix') ? 'Pix Key' : 'Account Details'} *
                    </label>
                    <input type="text" value={recipientAccountDetails} onChange={e => setRecipientAccountDetails(e.target.value)} placeholder={selectedPaymentMethod === 'Bank Account' ? 'Enter account number' : selectedPaymentMethod.includes('CashApp') ? '$username' : selectedPaymentMethod.includes('Venmo') ? '@username' : 'Enter details'} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>}
                </div>

                <button onClick={handleNextStep} disabled={!isStep1Valid()} className="w-full bg-blue-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  Continue
                  <ArrowRight size={16} />
                </button>
              </div>}

            {/* STEP 2: SEND MONEY TO AGENT */}
            {currentStep === 2 && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="text-blue-600" size={20} />
                  Send Money - Agent Details
                </h2>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1 text-xs">Send to Agent in {offer.fromCountry}</h3>
                      <p className="text-xs text-amber-700">
                        Send {offer.amount} {offer.fromCurrency} to the agent's payment details below
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                    <Building2 size={18} className="text-blue-600" />
                    Agent Payment Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center bg-white rounded p-2">
                      <span className="text-gray-600">Agent Name</span>
                      <span className="font-semibold text-gray-900">{agentPaymentDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white rounded p-2">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-semibold text-gray-900">{agentPaymentDetails.method}</span>
                    </div>
                    {agentPaymentDetails.method === 'Bank Transfer' ? <>
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span className="text-gray-600">Bank Name</span>
                          <span className="font-semibold text-gray-900">{agentPaymentDetails.bankName}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span className="text-gray-600">Account Number</span>
                          <span className="font-semibold text-gray-900 font-mono">{agentPaymentDetails.accountNumber}</span>
                        </div>
                      </> : <div className="flex justify-between items-center bg-white rounded p-2">
                        <span className="text-gray-600">Payment ID</span>
                        <span className="font-semibold text-gray-900">{agentPaymentDetails.additionalInfo}</span>
                      </div>}
                    <div className="flex justify-between items-center bg-white rounded p-2 border-2 border-blue-600">
                      <span className="text-gray-600">Amount to Send</span>
                      <span className="font-bold text-blue-600 text-base">{offer.amount} {offer.fromCurrency}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Proof of Payment *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                    <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(e, setSenderPaymentProof)} className="hidden" id="sender-payment-proof" />
                    <label htmlFor="sender-payment-proof" className="cursor-pointer">
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      {senderPaymentProof ? <div className="text-sm">
                          <p className="font-semibold text-green-600">✓ File uploaded</p>
                          <p className="text-gray-600 text-xs">{senderPaymentProof.name}</p>
                        </div> : <div className="text-sm">
                          <p className="font-semibold text-gray-700">Click to upload payment proof</p>
                          <p className="text-gray-500 text-xs">PNG, JPG, or PDF (max 5MB)</p>
                        </div>}
                    </label>
                  </div>
                </div>

                <button onClick={handleStep2Send} disabled={!isStep2Valid() || isProcessing} className="w-full bg-blue-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isProcessing ? <>
                      <Loader2 className="animate-spin" size={16} />
                      Processing...
                    </> : <>
                      Confirm Payment Sent
                      <ArrowRight size={16} />
                    </>}
                </button>
              </div>}

            {/* STEP 3: AGENT SENDS */}
            {currentStep === 3 && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />
                  Agent Processing Transfer
                </h2>

                {!agentHasSent ? <>
                    <div className="text-center py-6">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Loader2 className="text-blue-600 animate-spin" size={28} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Transfer in Progress</h3>
                      <p className="text-gray-600 mb-3 text-sm">
                        {offer.agentName} is sending {recipientAmount} {offer.toCurrency} to {recipientName}
                      </p>
                      <div className="max-w-sm mx-auto bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-gray-600">Estimated delivery</span>
                          <span className="font-semibold text-gray-900">{offer.deliveryTime}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-gray-600">Payment method</span>
                          <span className="font-semibold text-gray-900">{selectedPaymentMethod}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Status</span>
                          <span className="font-semibold text-blue-600">Processing</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Agent: Upload Proof of Payment to Recipient *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                          <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(e, setAgentPaymentProof)} className="hidden" id="agent-payment-proof" />
                          <label htmlFor="agent-payment-proof" className="cursor-pointer">
                            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                            {agentPaymentProof ? <div className="text-sm">
                                <p className="font-semibold text-green-600">✓ File uploaded</p>
                                <p className="text-gray-600 text-xs">{agentPaymentProof.name}</p>
                              </div> : <div className="text-sm">
                                <p className="font-semibold text-gray-700">Click to upload payment proof</p>
                                <p className="text-gray-500 text-xs">PNG, JPG, or PDF (max 5MB)</p>
                              </div>}
                          </label>
                        </div>
                      </div>
                    </div>

                    <button onClick={handleAgentSend} disabled={isProcessing || !isStep3Valid()} className="w-full bg-blue-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isProcessing ? <>
                          <Loader2 className="animate-spin" size={16} />
                          Sending...
                        </> : 'Confirm Transfer Sent'}
                    </button>
                  </> : <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Transfer Sent!</h3>
                    <p className="text-gray-600 text-sm">
                      Agent has sent {recipientAmount} {offer.toCurrency} to {recipientName}.
                    </p>
                  </div>}
              </div>}

            {/* STEP 4: CONFIRM RECEIPT */}
            {currentStep === 4 && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" size={20} />
                  Confirm Receipt
                </h2>

                {!receiptConfirmed ? <>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <h3 className="font-semibold text-amber-900 mb-1 text-xs">Important</h3>
                          <p className="text-xs text-amber-700">
                            Only confirm after recipient verified they received the full amount.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">Transfer Summary</h3>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Recipient</span>
                          <span className="font-semibold text-gray-900">{recipientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount received</span>
                          <span className="font-semibold text-gray-900">
                            {recipientAmount} {offer.toCurrency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment method</span>
                          <span className="font-semibold text-gray-900">{selectedPaymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account</span>
                          <span className="font-semibold text-gray-900">{recipientAccountDetails}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Agent</span>
                          <span className="font-semibold text-gray-900">{offer.agentName}</span>
                        </div>
                      </div>
                    </div>

                    <button onClick={handleConfirmReceipt} disabled={isProcessing} className="w-full bg-green-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isProcessing ? <>
                          <Loader2 className="animate-spin" size={16} />
                          Confirming...
                        </> : <>
                          <CheckCircle2 size={16} />
                          Confirm Money Received
                        </>}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-2">
                      By confirming, you acknowledge recipient received the full amount
                    </p>
                  </> : <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Receipt Confirmed!</h3>
                    <p className="text-gray-600 text-sm">Processing completion...</p>
                  </div>}
              </div>}

            {/* STEP 5: CONGRATULATIONS */}
            {currentStep === 5 && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="text-center py-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <PartyPopper className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Congratulations!</h3>
                  <p className="text-lg text-gray-700 mb-1">Transfer Completed Successfully</p>
                  <p className="text-gray-600 mb-6 text-sm">
                    {recipientName} has received {recipientAmount} {offer.toCurrency}
                  </p>
                  <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="text-sm text-green-800">
                      Transaction ID: TXN-{Date.now().toString().slice(-8)}
                    </div>
                  </div>
                  <button onClick={onComplete} className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    Return to Home
                  </button>
                </div>
              </div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>;
};