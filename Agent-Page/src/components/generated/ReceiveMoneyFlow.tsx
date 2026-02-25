"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Loader2, Clock, User, CreditCard, Building2, AlertCircle, Check, Upload, Shield, Eye, Send, DollarSign, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface TransferRequest {
  id: string;
  fromCountry: string;
  toCountry: string;
  fromFlag: string;
  toFlag: string;
  fromCurrency: string;
  toCurrency: string;
  senderName: string;
  recipientPaymentMethod: string;
  recipientAccountDetails: string;
  sendAmount: string;
  receiveAmount: string;
  exchangeRate: number;
  fee: string;
  deliveryTime: string;
}
interface ReceiveMoneyFlowProps {
  transfer: TransferRequest;
  onComplete?: () => void;
  onBack?: () => void;
}
type FlowState = 'terms' | 'liveCheck' | 'step1' | 'step1-request' | 'step1-confirm' | 'step2' | 'step3' | 'step4' | 'step5' | 'complete';

// Payment methods for receiving from sender (agent's local country)
interface PaymentMethodOption {
  name: string;
  requiresRequest: boolean; // Whether this is a "request payment" type
}
const getAgentPaymentMethodsForCountry = (country: string): PaymentMethodOption[] => {
  const countryPaymentMethods: Record<string, PaymentMethodOption[]> = {
    'United States': [{
      name: 'Any (Sender can pay through any methods)',
      requiresRequest: false
    }, {
      name: 'Stanbic Bank USA',
      requiresRequest: false
    }, {
      name: 'CashApp',
      requiresRequest: true
    }, {
      name: 'Venmo',
      requiresRequest: true
    }, {
      name: 'Zelle',
      requiresRequest: true
    }],
    'USA': [{
      name: 'Any (Sender can pay through any methods)',
      requiresRequest: false
    }, {
      name: 'Stanbic Bank USA',
      requiresRequest: false
    }, {
      name: 'CashApp',
      requiresRequest: true
    }, {
      name: 'Venmo',
      requiresRequest: true
    }, {
      name: 'Zelle',
      requiresRequest: true
    }],
    'Canada': [{
      name: 'Any (Sender can pay through any methods)',
      requiresRequest: false
    }, {
      name: 'Royal Bank of Canada',
      requiresRequest: false
    }, {
      name: 'Interac',
      requiresRequest: false
    }, {
      name: 'TD Canada Trust',
      requiresRequest: false
    }],
    'United Kingdom': [{
      name: 'Any (Sender can pay through any methods)',
      requiresRequest: false
    }, {
      name: 'Barclays Bank',
      requiresRequest: false
    }, {
      name: 'HSBC UK',
      requiresRequest: false
    }, {
      name: 'PayPal',
      requiresRequest: true
    }],
    'UK': [{
      name: 'Any (Sender can pay through any methods)',
      requiresRequest: false
    }, {
      name: 'Barclays Bank',
      requiresRequest: false
    }, {
      name: 'HSBC UK',
      requiresRequest: false
    }, {
      name: 'PayPal',
      requiresRequest: true
    }],
    'Nigeria': [{
      name: 'Any (Sender can pay through any methods)',
      requiresRequest: false
    }, {
      name: 'GTBank Nigeria',
      requiresRequest: false
    }, {
      name: 'Access Bank',
      requiresRequest: false
    }, {
      name: 'MTN Mobile Money Nigeria',
      requiresRequest: false
    }],
    'Kenya': [{
      name: 'Any (Sender can pay through any methods)',
      requiresRequest: false
    }, {
      name: 'M-Pesa Kenya',
      requiresRequest: true
    }, {
      name: 'Equity Bank Kenya',
      requiresRequest: false
    }, {
      name: 'KCB Bank Kenya',
      requiresRequest: false
    }],
    'Ghana': [{
      name: 'Any (Sender can pay through any methods)',
      requiresRequest: false
    }, {
      name: 'MTN Mobile Money Ghana',
      requiresRequest: true
    }, {
      name: 'Vodafone Cash Ghana',
      requiresRequest: true
    }, {
      name: 'Ecobank Ghana',
      requiresRequest: false
    }],
    'Default': [{
      name: 'Any (Sender can pay through any methods)',
      requiresRequest: false
    }, {
      name: 'Stanbic Bank',
      requiresRequest: false
    }, {
      name: 'Equity Bank',
      requiresRequest: false
    }, {
      name: 'MTN Mobile Money',
      requiresRequest: false
    }]
  };
  return countryPaymentMethods[country] || countryPaymentMethods['Default'];
};

// Calculate fees based on transfer amount
const calculateFees = (amount: string) => {
  const numAmount = parseFloat(amount.replace(/,/g, ''));
  let myPayuppFeePercent = 0;
  let agentCommissionPercent = 0;

  // Commission structure:
  // Below $50: 0.9%
  // Above $1,000,000: 0.3%
  // Between $51 and $999,999: Linear scale from 0.899999% to 0.300001%

  if (numAmount <= 50) {
    agentCommissionPercent = 0.9;
  } else if (numAmount >= 1000000) {
    agentCommissionPercent = 0.3;
  } else {
    // Linear interpolation between $51 and $999,999
    // Formula: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
    const x1 = 51; // Min amount
    const x2 = 999999; // Max amount
    const y1 = 0.899999; // Commission at $51
    const y2 = 0.300001; // Commission at $999,999

    agentCommissionPercent = y1 + (numAmount - x1) * (y2 - y1) / (x2 - x1);
  }

  // Platform fee structure:
  // $50 or less: 0.5%
  // $1,000,000 or higher: 0.2%
  // Between $51 and $999,999: Linear scale from 0.5% to 0.2%
  if (numAmount <= 50) {
    myPayuppFeePercent = 0.5;
  } else if (numAmount >= 1000000) {
    myPayuppFeePercent = 0.2;
  } else {
    // Linear interpolation between $51 and $999,999
    // Formula: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
    const x1 = 51; // Min amount
    const x2 = 999999; // Max amount
    const y1 = 0.5; // Fee at $51
    const y2 = 0.2; // Fee at $999,999

    myPayuppFeePercent = y1 + (numAmount - x1) * (y2 - y1) / (x2 - x1);
  }
  const myPayuppFee = numAmount * myPayuppFeePercent / 100;
  const agentCommission = numAmount * agentCommissionPercent / 100;
  return {
    myPayuppFee: myPayuppFee.toFixed(2),
    myPayuppFeePercent,
    agentCommission: agentCommission.toFixed(2),
    agentCommissionPercent: parseFloat(agentCommissionPercent.toFixed(6)),
    // Round to 6 decimals for display
    totalAmount: numAmount
  };
};
export const ReceiveMoneyFlow: React.FC<ReceiveMoneyFlowProps> = ({
  transfer,
  onComplete,
  onBack
}) => {
  const [flowState, setFlowState] = useState<FlowState>('terms');
  const [isProcessing, setIsProcessing] = useState(false);

  // Live Check step
  const [liveCheckVerified, setLiveCheckVerified] = useState(false);

  // Step 1: Receive Funds from Sender - NEW: Payment method selection
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Any (Sender can pay through any methods)');
  const [isRequestPaymentType, setIsRequestPaymentType] = useState(false);
  const [senderPaymentId, setSenderPaymentId] = useState(''); // For request payment types
  const [hasRequestedPayment, setHasRequestedPayment] = useState(false);
  const [fundsReceived, setFundsReceived] = useState(false);
  const [receiveFundsTracker, setReceiveFundsTracker] = useState<'waiting' | 'sent' | 'confirm'>('waiting');
  const [showPaymentMethodSelection, setShowPaymentMethodSelection] = useState(true); // Track if still in selection phase

  // Step 2: Send to Recipient
  const [recipientPaymentProof, setRecipientPaymentProof] = useState<File | null>(null);
  const [sentToRecipient, setSentToRecipient] = useState(false);

  // Step 3: Recipient Confirms
  const [recipientConfirmed, setRecipientConfirmed] = useState(false);

  // Step 4: Pay Fees
  const [feePaymentMethod, setFeePaymentMethod] = useState<'card' | 'mobile-money' | null>(null);
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [feesPaid, setFeesPaid] = useState(false);
  const agentPaymentMethods = getAgentPaymentMethodsForCountry(transfer.fromCountry);
  const feeBreakdown = calculateFees(transfer.sendAmount);

  // Mock agent's payment details
  const agentPaymentDetails = {
    method: agentPaymentMethods[0].name,
    accountName: 'Your Agent Account',
    accountNumber: '9876543210',
    bankName: 'Agent Bank',
    additionalInfo: agentPaymentMethods[0].name.includes('CashApp') ? 'CashTag: $agentaccount' : agentPaymentMethods[0].name.includes('Venmo') ? '@agentaccount' : agentPaymentMethods[0].name.includes('Zelle') ? 'agent@example.com' : 'Account details'
  };

  // Mock recipient details (shown only after terms accepted)
  const recipientDetails = {
    name: 'John Doe',
    account: transfer.recipientAccountDetails
  };
  const handleContinueFromTerms = () => {
    setFlowState('liveCheck');
  };
  const handleLiveCheckComplete = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLiveCheckVerified(true);
    setIsProcessing(false);
    setTimeout(() => setFlowState('step1'), 1000);
  };
  const handlePaymentMethodSelect = (methodName: string) => {
    setSelectedPaymentMethod(methodName);
    const method = agentPaymentMethods.find(m => m.name === methodName);
    if (method) {
      setIsRequestPaymentType(method.requiresRequest);
    }
  };
  const handleContinueWithPaymentMethod = () => {
    setShowPaymentMethodSelection(false); // Hide the selection screen
    if (isRequestPaymentType) {
      // Go to request payment flow
      setFlowState('step1-request');
    } else {
      // Stay in step1 but show the traditional waiting flow
      setReceiveFundsTracker('waiting');
    }
  };
  const handleRequestPayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHasRequestedPayment(true);
    setIsProcessing(false);
    // Move to confirm step after request is sent
    setTimeout(() => setFlowState('step1-confirm'), 1000);
  };
  const handleConfirmReceipt = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFundsReceived(true);
    setIsProcessing(false);
    setTimeout(() => setFlowState('step2'), 1000);
  };
  const handleSendToRecipient = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSentToRecipient(true);
    setIsProcessing(false);
    setTimeout(() => setFlowState('step3'), 1000);
  };
  const handleRecipientConfirm = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRecipientConfirmed(true);
    setIsProcessing(false);
    setTimeout(() => setFlowState('step4'), 1000);
  };
  const handlePayFees = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setFeesPaid(true);
    setIsProcessing(false);
    setTimeout(() => setFlowState('complete'), 1000);
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };
  const getCurrentStep = (): number => {
    switch (flowState) {
      case 'terms':
        return 0;
      case 'liveCheck':
        return 1;
      case 'step1':
      case 'step1-request':
      case 'step1-confirm':
        return 2;
      case 'step2':
        return 3;
      case 'step3':
        return 4;
      case 'step4':
        return 5;
      case 'step5':
        return 6;
      case 'complete':
        return 7;
      default:
        return 0;
    }
  };
  const currentStepNumber = getCurrentStep();
  const steps = [{
    number: 1,
    title: 'Live Check',
    status: currentStepNumber > 1 ? 'complete' : currentStepNumber === 1 ? 'active' : 'pending'
  }, {
    number: 2,
    title: 'Receive Funds',
    status: currentStepNumber > 2 ? 'complete' : currentStepNumber === 2 ? 'active' : 'pending'
  }, {
    number: 3,
    title: 'Send to Recipient',
    status: currentStepNumber > 3 ? 'complete' : currentStepNumber === 3 ? 'active' : 'pending'
  }, {
    number: 4,
    title: 'Await Confirmation',
    status: currentStepNumber > 4 ? 'complete' : currentStepNumber === 4 ? 'active' : 'pending'
  }, {
    number: 5,
    title: 'Pay Fees',
    status: currentStepNumber > 5 ? 'complete' : currentStepNumber === 5 ? 'active' : 'pending'
  }] as any[];

  // Timer logic for non-request payment types (traditional flow)
  useEffect(() => {
    if (flowState === 'step1' && receiveFundsTracker === 'waiting') {
      // After 3 seconds, change to "Money has been sent"
      const timer1 = setTimeout(() => {
        setReceiveFundsTracker('sent');
      }, 3000);
      return () => clearTimeout(timer1);
    }
  }, [flowState, receiveFundsTracker]);
  useEffect(() => {
    if (flowState === 'step1' && receiveFundsTracker === 'sent') {
      // After another 3 seconds, change to "Confirm Funds Received"
      const timer2 = setTimeout(() => {
        setReceiveFundsTracker('confirm');
      }, 3000);
      return () => clearTimeout(timer2);
    }
  }, [flowState, receiveFundsTracker]);
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-3">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header - Compact */}
        <div className="mb-3">
          <button onClick={onBack} className="text-blue-600 hover:text-blue-700 font-medium mb-2 flex items-center gap-2 text-sm">
            ← Back to transfers
          </button>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{transfer.fromFlag}</span>
                  <span className="text-xs text-gray-600">{transfer.fromCountry}</span>
                </div>
                <ArrowRight className="text-gray-400" size={16} />
                <div className="flex items-center gap-2">
                  <span className="text-xl">{transfer.toFlag}</span>
                  <span className="text-xs text-gray-600">{transfer.toCountry}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">Sender pays</div>
                <div className="text-lg font-bold text-gray-900">
                  {transfer.sendAmount} {transfer.fromCurrency}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <div className="text-xs text-gray-600">Sender</div>
                <div className="font-semibold text-gray-900 text-sm">BlueFox</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">You send to recipient</div>
                <div className="text-base font-bold text-blue-600">
                  {transfer.receiveAmount} {transfer.toCurrency}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps - Compact */}
        {flowState !== 'terms' && flowState !== 'complete' && <div className="mb-3">
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
                  {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 rounded transition-all ${currentStepNumber > step.number ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </React.Fragment>)}
            </div>
          </div>}

        {/* Flow Content */}
        <AnimatePresence mode="wait">
          <motion.div key={flowState} initial={{
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
            {/* TERMS STATE */}
            {flowState === 'terms' && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="text-blue-600" size={20} />
                  Transfer Terms
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1 text-xs">Agent Instructions</h3>
                      <p className="text-xs text-blue-700">
                        Review the transfer details carefully before proceeding. You'll receive funds first, then send to the recipient.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                    <CreditCard size={18} className="text-purple-600" />
                    Transfer Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center bg-white rounded p-2">
                      <span className="text-gray-600">You will receive</span>
                      <span className="font-bold text-green-600 text-base">
                        {transfer.sendAmount} {transfer.fromCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white rounded p-2">
                      <span className="text-gray-600">Payment method</span>
                      <span className="font-semibold text-gray-900">{agentPaymentDetails.method}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex justify-between items-center bg-white rounded p-2 border-2 border-blue-600">
                      <span className="text-gray-600">You send to recipient</span>
                      <span className="font-bold text-blue-600 text-base">
                        {transfer.receiveAmount} {transfer.toCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white rounded p-2">
                      <span className="text-gray-600">Recipient abroad's payment channel</span>
                      <span className="font-semibold text-gray-900">{transfer.recipientPaymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <DollarSign size={18} className="text-green-600" />
                    Your Earnings
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Agent Commission ({feeBreakdown.agentCommissionPercent}%)</span>
                      <span className="font-bold text-green-600">${feeBreakdown.agentCommission}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Platform Fee ({feeBreakdown.myPayuppFeePercent}%)</span>
                      <span className="font-semibold text-gray-900">${feeBreakdown.myPayuppFee}</span>
                    </div>
                  </div>
                </div>

                <button onClick={handleContinueFromTerms} className="w-full bg-blue-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  Continue to Transfer
                  <ArrowRight size={16} />
                </button>
              </div>}

            {/* LIVE CHECK STATE */}
            {flowState === 'liveCheck' && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Smartphone className="text-blue-600" size={20} />
                  Quick Live Check
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1 text-xs">Security Verification Required</h3>
                      <p className="text-xs text-blue-700">
                        Please verify your identity with a live video check to ensure secure transfer
                      </p>
                    </div>
                  </div>
                </div>

                {!liveCheckVerified ? <>
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="text-blue-600" size={48} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for Live Check</h3>
                      <p className="text-gray-600 text-sm mb-6">
                        Click the button below to start the live verification process
                      </p>

                      <div className="max-w-md mx-auto text-left space-y-3 mb-8">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">Ensure good lighting</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">Allow camera access</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">Process takes ~3 seconds</span>
                        </div>
                      </div>
                    </div>

                    <button onClick={handleLiveCheckComplete} disabled={isProcessing} className="w-full bg-blue-600 text-white font-semibold py-3 text-base rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isProcessing ? <>
                          <Loader2 className="animate-spin" size={18} />
                          Verifying...
                        </> : <>
                          <Smartphone size={18} />
                          Start Live Check
                        </>}
                    </button>
                  </> : <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Verification Complete!</h3>
                    <p className="text-gray-600 text-sm">Proceeding to receive funds...</p>
                  </div>}
              </div>}

            {/* STEP 1: PAYMENT METHOD SELECTION (Initial screen after live check) */}
            {flowState === 'step1' && showPaymentMethodSelection && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="text-blue-600" size={20} />
                  Select Payment Method
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1 text-xs">Choose How to Receive</h3>
                      <p className="text-xs text-blue-700">
                        Select which payment method you want the sender to use to send you {transfer.sendAmount} {transfer.fromCurrency}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {agentPaymentMethods.map(method => <button key={method.name} onClick={() => handlePaymentMethodSelect(method.name)} className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedPaymentMethod === method.name ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {method.requiresRequest ? <Send className="text-purple-600" size={20} /> : <Building2 className="text-blue-600" size={20} />}
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{method.name}</div>
                            {method.requiresRequest && <div className="text-xs text-purple-600 mt-0.5">Request Payment Option</div>}
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === method.name ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                          {selectedPaymentMethod === method.name && <Check className="text-white" size={14} />}
                        </div>
                      </div>
                    </button>)}
                </div>

                {selectedPaymentMethod && <button onClick={handleContinueWithPaymentMethod} className="w-full bg-blue-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    Continue with {selectedPaymentMethod}
                    <ArrowRight size={16} />
                  </button>}
              </div>}

            {/* STEP 1-REQUEST: REQUEST FOR PAYMENT ID/NUMBER */}
            {flowState === 'step1-request' && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Send className="text-purple-600" size={20} />
                  Request Payment Information
                </h2>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-purple-600 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <h3 className="font-semibold text-purple-900 mb-1 text-xs">Request Payment Details</h3>
                      <p className="text-xs text-purple-700">
                        The sender will provide their {selectedPaymentMethod} number/ID so you can send them a payment request
                      </p>
                    </div>
                  </div>
                </div>

                {!hasRequestedPayment ? <>
                    <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <Smartphone className="text-blue-600" size={18} />
                        Payment Details Needed
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="font-semibold text-gray-900">{selectedPaymentMethod}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span className="text-gray-600">Amount to Request</span>
                          <span className="font-bold text-green-600 text-base">
                            {transfer.sendAmount} {transfer.fromCurrency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sender's {selectedPaymentMethod} Number/ID *
                      </label>
                      <input type="text" value={senderPaymentId} onChange={e => setSenderPaymentId(e.target.value)} placeholder={selectedPaymentMethod.includes('Mobile Money') || selectedPaymentMethod.includes('M-Pesa') ? 'e.g., +254712345678' : selectedPaymentMethod.includes('PayPal') ? 'e.g., sender@email.com' : selectedPaymentMethod.includes('Wise') ? 'e.g., sender@email.com or phone' : 'e.g., $username or phone'} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" />
                      <p className="text-xs text-gray-500 mt-1">
                        The sender will share this with you via chat
                      </p>
                    </div>

                    <button onClick={handleRequestPayment} disabled={!senderPaymentId || isProcessing} className="w-full bg-purple-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isProcessing ? <>
                          <Loader2 className="animate-spin" size={16} />
                          Sending Request...
                        </> : <>
                          <Send size={16} />
                          Send Payment Request
                        </>}
                    </button>
                  </> : <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Request Sent!</h3>
                    <p className="text-gray-600 text-sm">Proceeding to confirmation...</p>
                  </div>}
              </div>}

            {/* STEP 1-CONFIRM: CONFIRM FUNDS RECEIVED (For request payment types) */}
            {flowState === 'step1-confirm' && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" size={20} />
                  Confirm Funds Received
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1 text-xs">Payment Request Sent</h3>
                      <p className="text-xs text-green-700">
                        Waiting for the sender to approve the payment request for {transfer.sendAmount} {transfer.fromCurrency}
                      </p>
                    </div>
                  </div>
                </div>

                {!fundsReceived ? <>
                    <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <Smartphone className="text-purple-600" size={18} />
                        Request Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="font-semibold text-gray-900">{selectedPaymentMethod}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span className="text-gray-600">Sender's ID</span>
                          <span className="font-semibold text-gray-900">{senderPaymentId}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2 border-2 border-purple-600">
                          <span className="text-gray-600">Amount Requested</span>
                          <span className="font-bold text-purple-600 text-base">
                            {transfer.sendAmount} {transfer.fromCurrency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-4 py-4">
                      <Loader2 className="animate-spin text-purple-600 mx-auto mb-2" size={32} />
                      <p className="text-sm text-gray-600">Waiting for sender to approve payment...</p>
                    </div>

                    <button onClick={handleConfirmReceipt} disabled={isProcessing} className="w-full bg-green-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isProcessing ? <>
                          <Loader2 className="animate-spin" size={16} />
                          Confirming...
                        </> : <>
                          <CheckCircle2 size={16} />
                          Confirm Funds Received
                        </>}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-2">
                      Click confirm once you've received the funds in your {selectedPaymentMethod} account
                    </p>
                  </> : <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Funds Received!</h3>
                    <p className="text-gray-600 text-sm">Proceeding to send to recipient...</p>
                  </div>}
              </div>}

            {/* STEP 1: RECEIVE FUNDS FROM SENDER (Traditional flow - when payment method doesn't require request) */}
            {flowState === 'step1' && !showPaymentMethodSelection && !isRequestPaymentType && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="text-blue-600" size={20} />
                  Receive Funds from Sender
                </h2>

                {/* Money Transfer Tracker */}
                <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                    <Clock className="text-blue-600" size={18} />
                    Transfer Status
                  </h3>
                  <div className="space-y-3">
                    {/* Stage 1: Waiting for money */}
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${receiveFundsTracker === 'waiting' ? 'bg-blue-600 animate-pulse' : 'bg-green-500'}`}>
                        {receiveFundsTracker === 'waiting' ? <Loader2 className="text-white animate-spin" size={14} /> : <Check className="text-white" size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${receiveFundsTracker === 'waiting' ? 'text-blue-900' : 'text-gray-700'}`}>
                          Waiting for money from sender
                        </div>
                        {receiveFundsTracker === 'waiting' && <div className="text-xs text-blue-600 mt-0.5">
                            Sender is processing the payment via {selectedPaymentMethod}...
                          </div>}
                      </div>
                    </div>

                    {/* Stage 2: Money has been sent */}
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${receiveFundsTracker === 'waiting' ? 'bg-gray-300' : receiveFundsTracker === 'sent' ? 'bg-blue-600 animate-pulse' : 'bg-green-500'}`}>
                        {receiveFundsTracker === 'sent' ? <Loader2 className="text-white animate-spin" size={14} /> : receiveFundsTracker === 'confirm' ? <CheckCircle2 className="text-white" size={14} /> : <div className="w-2 h-2 bg-gray-500 rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${receiveFundsTracker === 'sent' ? 'text-blue-900' : receiveFundsTracker === 'confirm' ? 'text-gray-700' : 'text-gray-400'}`}>
                          Money has been sent
                        </div>
                        {receiveFundsTracker === 'sent' && <div className="text-xs text-blue-600 mt-0.5">
                            Payment is on its way to your {selectedPaymentMethod} account...
                          </div>}
                      </div>
                    </div>

                    {/* Stage 3: Confirm Funds Received */}
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${receiveFundsTracker === 'confirm' ? 'bg-green-600 animate-pulse' : 'bg-gray-300'}`}>
                        {receiveFundsTracker === 'confirm' ? <CheckCircle2 className="text-white" size={14} /> : <div className="w-2 h-2 bg-gray-500 rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${receiveFundsTracker === 'confirm' ? 'text-green-900' : 'text-gray-400'}`}>
                          Confirm Funds Received
                        </div>
                        {receiveFundsTracker === 'confirm' && <div className="text-xs text-green-600 mt-0.5">
                            Ready to confirm - click the button below!
                          </div>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1 text-xs">Awaiting Payment</h3>
                      <p className="text-xs text-blue-700">
                        Wait for BlueFox to send {transfer.sendAmount} {transfer.fromCurrency} to your {selectedPaymentMethod} account before you confirm receipt
                      </p>
                    </div>
                  </div>
                </div>

                {!fundsReceived ? <>
                    <button onClick={handleConfirmReceipt} disabled={isProcessing || receiveFundsTracker !== 'confirm'} className="w-full bg-green-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isProcessing ? <>
                          <Loader2 className="animate-spin" size={16} />
                          Confirming...
                        </> : <>
                          <CheckCircle2 size={16} />
                          Confirm Funds Received
                        </>}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-2">
                      {receiveFundsTracker !== 'confirm' ? 'Button will be enabled once funds are ready to confirm' : 'By confirming, you acknowledge receiving the full amount'}
                    </p>
                  </> : <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Funds Received!</h3>
                    <p className="text-gray-600 text-sm">Proceeding to send to recipient...</p>
                  </div>}
              </div>}

            {/* STEP 2: SEND TO RECIPIENT */}
            {flowState === 'step2' && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Send className="text-blue-600" size={20} />
                  Send To Recipient
                </h2>

                {!sentToRecipient ? <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-1 text-xs">Send Payment</h3>
                          <p className="text-xs text-blue-700">
                            Now send {transfer.receiveAmount} {transfer.toCurrency} to the recipient using their payment details
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <User size={18} className="text-purple-600" />
                        Recipient Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span className="text-gray-600">Recipient Name</span>
                          <span className="font-semibold text-gray-900">{recipientDetails.name}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="font-semibold text-gray-900">{transfer.recipientPaymentMethod}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span className="text-gray-600">Account</span>
                          <span className="font-semibold text-gray-900">{recipientDetails.account}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2 border-2 border-purple-600">
                          <span className="text-gray-600">Amount to Send</span>
                          <span className="font-bold text-purple-600 text-base">
                            {transfer.receiveAmount} {transfer.toCurrency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Proof of Payment *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-500 transition-colors">
                        <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(e, setRecipientPaymentProof)} className="hidden" id="recipient-payment-proof" />
                        <label htmlFor="recipient-payment-proof" className="cursor-pointer">
                          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                          {recipientPaymentProof ? <div className="text-sm">
                              <p className="font-semibold text-green-600">✓ File uploaded</p>
                              <p className="text-gray-600 text-xs">{recipientPaymentProof.name}</p>
                            </div> : <div className="text-sm">
                              <p className="font-semibold text-gray-700">Click to upload payment proof</p>
                              <p className="text-gray-500 text-xs">PNG, JPG, or PDF (max 5MB)</p>
                            </div>}
                        </label>
                      </div>
                    </div>

                    <button onClick={handleSendToRecipient} disabled={!recipientPaymentProof || isProcessing} className="w-full bg-blue-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isProcessing ? <>
                          <Loader2 className="animate-spin" size={16} />
                          Processing...
                        </> : <>
                          Confirm Payment Sent
                          <ArrowRight size={16} />
                        </>}
                    </button>

                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-800">
                        Where a payment reference is required, please enter only one letter or one number. Do not include personal details or the platform name for security reasons.
                      </p>
                    </div>
                  </> : <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Sent!</h3>
                    <p className="text-gray-600 text-sm">
                      {transfer.receiveAmount} {transfer.toCurrency} sent to {recipientDetails.name}
                    </p>
                  </div>}
              </div>}

            {/* STEP 3: RECIPIENT CONFIRMS */}
            {flowState === 'step3' && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />
                  Awaiting Recipient Confirmation
                </h2>

                {!recipientConfirmed ? <>
                    <div className="text-center py-6">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Loader2 className="text-blue-600 animate-spin" size={28} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Waiting for Recipient</h3>
                      <p className="text-gray-600 mb-3 text-sm">
                        {recipientDetails.name} needs to confirm they've received the money
                      </p>
                      <div className="max-w-sm mx-auto bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-gray-600">Recipient</span>
                          <span className="font-semibold text-gray-900">{recipientDetails.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-gray-600">Amount sent</span>
                          <span className="font-semibold text-gray-900">
                            {transfer.receiveAmount} {transfer.toCurrency}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Status</span>
                          <span className="font-semibold text-blue-600">Awaiting confirmation</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-700">
                          You'll be notified once the recipient confirms receipt of the funds
                        </p>
                      </div>
                    </div>

                    {/* Simulate recipient confirmation after 4 seconds */}
                    {setTimeout(() => {
                if (flowState === 'step3' && !recipientConfirmed) {
                  handleRecipientConfirm();
                }
              }, 4000) && null}
                  </> : <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Recipient Confirmed!</h3>
                    <p className="text-gray-600 text-sm">Proceeding to fee payment...</p>
                  </div>}
              </div>}

            {/* STEP 4: PAY FEES */}
            {flowState === 'step4' && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="text-blue-600" size={20} />
                  Pay Transaction Fees
                </h2>

                {!feesPaid ? <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-1 text-xs">Payment Required</h3>
                          <p className="text-xs text-blue-700">
                            Pay the platform fee to complete this transfer and unlock more deals.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                      <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <CreditCard size={18} className="text-amber-600" />
                        Fee Breakdown
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center bg-white rounded p-2">
                          <span className="text-gray-600">Transfer Amount</span>
                          <span className="font-semibold text-gray-900">${feeBreakdown.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2 border-2 border-amber-600">
                          <span className="text-gray-600">myPayupp Fee ({feeBreakdown.myPayuppFeePercent}%)</span>
                          <span className="font-bold text-amber-600 text-base">${feeBreakdown.myPayuppFee}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded p-2 bg-green-50 border border-green-200">
                          <span className="text-gray-600">Your Commission ({feeBreakdown.agentCommissionPercent}%)</span>
                          <span className="font-bold text-green-600 text-base">${feeBreakdown.agentCommission}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm">Select Payment Method</h3>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <button onClick={() => setFeePaymentMethod('card')} className={`p-3 rounded-lg border-2 transition-all ${feePaymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                          <CreditCard className={`mx-auto mb-2 ${feePaymentMethod === 'card' ? 'text-blue-600' : 'text-gray-400'}`} size={24} />
                          <div className="text-sm font-semibold text-gray-900">Card</div>
                        </button>
                        <button onClick={() => setFeePaymentMethod('mobile-money')} className={`p-3 rounded-lg border-2 transition-all ${feePaymentMethod === 'mobile-money' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                          <Smartphone className={`mx-auto mb-2 ${feePaymentMethod === 'mobile-money' ? 'text-blue-600' : 'text-gray-400'}`} size={24} />
                          <div className="text-sm font-semibold text-gray-900">Mobile Money</div>
                        </button>
                      </div>

                      {feePaymentMethod === 'card' && <div className="space-y-3 animate-in fade-in duration-300">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" maxLength={19} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                              <input type="text" placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" maxLength={5} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                              <input type="text" placeholder="123" value={cardCVV} onChange={e => setCardCVV(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" maxLength={3} />
                            </div>
                          </div>
                        </div>}

                      {feePaymentMethod === 'mobile-money' && <div className="animate-in fade-in duration-300">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Money Number</label>
                          <input type="tel" placeholder="+1234567890" value={mobileMoneyNumber} onChange={e => setMobileMoneyNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2" />
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                            <p className="text-xs text-amber-700">
                              You'll receive a prompt on your phone to approve the payment
                            </p>
                          </div>
                        </div>}
                    </div>

                    <button onClick={handlePayFees} disabled={!feePaymentMethod || feePaymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCVV) || feePaymentMethod === 'mobile-money' && !mobileMoneyNumber || isProcessing} className="w-full bg-blue-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isProcessing ? <>
                          <Loader2 className="animate-spin" size={16} />
                          {feePaymentMethod === 'mobile-money' ? 'Waiting for approval...' : 'Processing payment...'}
                        </> : <>
                          Pay ${feeBreakdown.myPayuppFee}
                          <ArrowRight size={16} />
                        </>}
                    </button>
                  </> : <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600 text-sm">Finalizing transfer...</p>
                  </div>}
              </div>}

            {/* COMPLETE STATE */}
            {flowState === 'complete' && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="text-center py-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Transfer Complete!</h3>
                  <p className="text-lg text-gray-700 mb-1">Successfully Processed</p>
                  <p className="text-gray-600 mb-6 text-sm">
                    {recipientDetails.name} confirmed receiving {transfer.receiveAmount} {transfer.toCurrency}
                  </p>
                  <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="text-sm text-green-800 mb-2">
                      <strong>Your earnings:</strong> ${feeBreakdown.agentCommission}
                    </div>
                    <div className="text-xs text-green-700 mb-1">
                      Platform fee paid: ${feeBreakdown.myPayuppFee}
                    </div>
                    <div className="text-xs text-green-700">
                      Transaction ID: AGT-{Date.now().toString().slice(-8)}
                    </div>
                  </div>
                  <button onClick={onComplete} className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    Return to Dashboard
                  </button>
                </div>
              </div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>;
};