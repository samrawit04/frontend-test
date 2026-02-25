"use client";

import * as React from "react";
import { useState } from "react";
import { X, Plus, Check, MapPin, Globe, DollarSign, Calendar, Smartphone, FileText, Upload, PartyPopper } from "lucide-react";
export interface BecomeAgentApplicationProps {
  onSubmit?: (data: any) => void;
  onBack?: () => void;
}
interface LocationEntry {
  id: string;
  type: 'country' | 'region';
  value: string;
}
interface FintechApp {
  id: string;
  name: string;
}
interface ProofOfFunds {
  sendingCountry: File | null;
  receivingCountry: File | null;
}
export default function BecomeAgentApplication({
  onSubmit,
  onBack
}: BecomeAgentApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [sendFromLocations, setSendFromLocations] = useState<LocationEntry[]>([{
    id: '1',
    type: 'country',
    value: ''
  }]);
  const [sendToLocations, setSendToLocations] = useState<LocationEntry[]>([{
    id: '1',
    type: 'country',
    value: ''
  }]);
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'fixed' | 'daily' | 'weekly' | 'monthly' | 'quarterly'>('fixed');
  const [fintechApps, setFintechApps] = useState<FintechApp[]>([]);
  const [currentAppInput, setCurrentAppInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [proofOfFunds, setProofOfFunds] = useState<ProofOfFunds>({
    sendingCountry: null,
    receivingCountry: null
  });
  const [sendingFileName, setSendingFileName] = useState('');
  const [receivingFileName, setReceivingFileName] = useState('');

  // Popular countries and regions
  const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Nigeria', 'Kenya', 'Ghana', 'South Africa', 'India', 'China', 'Japan', 'Brazil', 'Mexico', 'UAE', 'Singapore'];
  const regions = ['Europe', 'West Africa', 'East Africa', 'North America', 'South America', 'Southeast Asia', 'Middle East', 'Caribbean', 'Central America'];

  // Popular fintech apps for autosuggest
  const popularFintechApps = ['TapTap Send', 'WorldRemit', 'Remitly', 'Sendwave', 'Afriex', 'PAPSS', 'LemFi', 'Xoom', 'Eversend', 'Accrue', 'Chipper Cash', 'Pesa', 'Leatherback', 'Wise (TransferWise)', 'Revolut', 'PayPal', 'Skrill', 'Payoneer', 'Western Union', 'MoneyGram', 'Ria Money Transfer', 'M-Pesa', 'MTN Mobile Money', 'Airtel Money', 'Orange Money', 'Wave', 'Small World', 'Azimo', 'TransferGo', 'InstaReM', 'CurrencyFair', 'OFX', 'Mukuru', 'WorldFirst', 'Pangea Money Transfer', 'Remit2India', 'Xpress Money', 'UAE Exchange', 'Al Ansari Exchange', 'Alipay', 'WeChat Pay', 'GCash', 'PayMaya', 'Paytm', 'PhonePe', 'Google Pay', 'Cash App', 'Venmo', 'Zelle', 'Chime', 'Flutterwave', 'Paystack'];
  const addSendFromLocation = () => {
    setSendFromLocations([...sendFromLocations, {
      id: Date.now().toString(),
      type: 'country',
      value: ''
    }]);
  };
  const addSendToLocation = () => {
    setSendToLocations([...sendToLocations, {
      id: Date.now().toString(),
      type: 'country',
      value: ''
    }]);
  };
  const removeSendFromLocation = (id: string) => {
    if (sendFromLocations.length > 1) {
      setSendFromLocations(sendFromLocations.filter(loc => loc.id !== id));
    }
  };
  const removeSendToLocation = (id: string) => {
    if (sendToLocations.length > 1) {
      setSendToLocations(sendToLocations.filter(loc => loc.id !== id));
    }
  };
  const updateSendFromLocation = (id: string, field: 'type' | 'value', value: string) => {
    setSendFromLocations(sendFromLocations.map(loc => loc.id === id ? {
      ...loc,
      [field]: value
    } : loc));
  };
  const updateSendToLocation = (id: string, field: 'type' | 'value', value: string) => {
    setSendToLocations(sendToLocations.map(loc => loc.id === id ? {
      ...loc,
      [field]: value
    } : loc));
  };
  const addFintechApp = (appName: string) => {
    if (appName.trim() && !fintechApps.find(app => app.name.toLowerCase() === appName.toLowerCase())) {
      setFintechApps([...fintechApps, {
        id: Date.now().toString(),
        name: appName.trim()
      }]);
      setCurrentAppInput('');
      setShowSuggestions(false);
    }
  };
  const removeFintechApp = (id: string) => {
    setFintechApps(fintechApps.filter(app => app.id !== id));
  };
  const filteredSuggestions = popularFintechApps.filter(app => app.toLowerCase().includes(currentAppInput.toLowerCase()) && !fintechApps.find(existingApp => existingApp.name.toLowerCase() === app.toLowerCase()));
  const handleFileUpload = (type: 'sendingCountry' | 'receivingCountry', file: File) => {
    setProofOfFunds({
      ...proofOfFunds,
      [type]: file
    });
    if (type === 'sendingCountry') {
      setSendingFileName(file.name);
    } else {
      setReceivingFileName(file.name);
    }
  };
  const handleSubmit = () => {
    const applicationData = {
      sendFrom: sendFromLocations,
      sendTo: sendToLocations,
      amount,
      frequency,
      fintechApps: fintechApps.map(app => app.name),
      proofOfFunds: {
        sendingCountry: sendingFileName,
        receivingCountry: receivingFileName
      }
    };
    onSubmit?.(applicationData);
  };
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return sendFromLocations.every(loc => loc.value.trim() !== '');
      case 2:
        return sendToLocations.every(loc => loc.value.trim() !== '');
      case 3:
        return amount.trim() !== '' && parseFloat(amount) > 0;
      case 4:
        return !!frequency;
      case 5:
        return fintechApps.length > 0;
      case 6:
        return proofOfFunds.sendingCountry !== null && proofOfFunds.receivingCountry !== null;
      default:
        return false;
    }
  };
  const renderStepIndicator = () => <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto px-4">
      {[1, 2, 3, 4, 5, 6].map(step => <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 ${currentStep === step ? 'bg-blue-600 text-white scale-110' : currentStep > step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {currentStep > step ? <Check className="w-5 h-5" /> : step}
          </div>
          {step < 6 && <div className={`h-1 w-8 rounded transition-all shrink-0 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`} />}
        </React.Fragment>)}
    </div>;
  const renderStep1 = () => <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Where can you send money from?
        </h2>
        <p className="text-gray-600">
          Select the countries or regions you can send money from
        </p>
      </div>

      <div className="space-y-4">
        {sendFromLocations.map((location, index) => <div key={location.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <button onClick={() => updateSendFromLocation(location.id, 'type', 'country')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${location.type === 'country' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'}`}>
                    Country
                  </button>
                  <button onClick={() => updateSendFromLocation(location.id, 'type', 'region')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${location.type === 'region' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'}`}>
                    Region
                  </button>
                </div>

                <select value={location.value} onChange={e => updateSendFromLocation(location.id, 'value', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select {location.type}...</option>
                  {(location.type === 'country' ? countries : regions).map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              {sendFromLocations.length > 1 && <button onClick={() => removeSendFromLocation(location.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>}
            </div>
          </div>)}

        <button onClick={addSendFromLocation} className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2 font-medium">
          <Plus className="w-5 h-5" />
          Add another location
        </button>
      </div>
    </div>;
  const renderStep2 = () => <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Where can you send money to?
        </h2>
        <p className="text-gray-600">
          Select the countries or regions you can send money to
        </p>
      </div>

      <div className="space-y-4">
        {sendToLocations.map((location, index) => <div key={location.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <button onClick={() => updateSendToLocation(location.id, 'type', 'country')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${location.type === 'country' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:border-green-300'}`}>
                    Country
                  </button>
                  <button onClick={() => updateSendToLocation(location.id, 'type', 'region')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${location.type === 'region' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:border-green-300'}`}>
                    Region
                  </button>
                </div>

                <select value={location.value} onChange={e => updateSendToLocation(location.id, 'value', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="">Select {location.type}...</option>
                  {(location.type === 'country' ? countries : regions).map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              {sendToLocations.length > 1 && <button onClick={() => removeSendToLocation(location.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>}
            </div>
          </div>)}

        <button onClick={addSendToLocation} className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 transition-all flex items-center justify-center gap-2 font-medium">
          <Plus className="w-5 h-5" />
          Add another location
        </button>
      </div>
    </div>;
  const renderStep3 = () => <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How much do you want to send?
        </h2>
        <p className="text-gray-600">
          Enter the amount you're willing to send
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (USD)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
            $
          </span>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-10 pr-4 py-4 text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" min="0" step="0.01" />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          This is the amount you're willing to facilitate per transaction
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You can adjust this amount later in your agent dashboard
        </p>
      </div>
    </div>;
  const renderStep4 = () => <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How often do you want to send?
        </h2>
        <p className="text-gray-600">
          Select your preferred frequency
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[{
        value: 'one-time',
        label: 'One Time'
      }, {
        value: 'daily',
        label: 'Daily'
      }, {
        value: 'weekly',
        label: 'Weekly'
      }, {
        value: 'monthly',
        label: 'Monthly'
      }, {
        value: 'quarterly',
        label: 'Quarterly'
      }].map(option => <button key={option.value} onClick={() => setFrequency(option.value as any)} className={`p-4 rounded-lg border-2 text-left transition-all ${frequency === option.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{option.label}</div>
              </div>
              {frequency === option.value && <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>}
            </div>
          </button>)}
      </div>
    </div>;
  const renderStep5 = () => <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Which fintech apps do you use?
        </h2>
        <p className="text-gray-600">
          Tell us which apps you use to send money
        </p>
      </div>

      <div className="space-y-4">
        {/* Added Apps */}
        {fintechApps.length > 0 && <div className="space-y-2">
            {fintechApps.map(app => <div key={app.id} className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg flex items-center justify-between">
                <span className="font-medium text-indigo-900">{app.name}</span>
                <button onClick={() => removeFintechApp(app.id)} className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>)}
          </div>}

        {/* Input with Autosuggest */}
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input type="text" value={currentAppInput} onChange={e => {
              setCurrentAppInput(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }} onFocus={() => setShowSuggestions(currentAppInput.length > 0)} placeholder="Type fintech app name..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" onKeyPress={e => {
              if (e.key === 'Enter' && currentAppInput.trim()) {
                e.preventDefault();
                addFintechApp(currentAppInput);
              }
            }} />
              
              {/* Autosuggest Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredSuggestions.map(app => <button key={app} onClick={() => addFintechApp(app)} className="w-full px-4 py-2 text-left hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0">
                      {app}
                    </button>)}
                </div>}
            </div>
            <button onClick={() => {
            if (currentAppInput.trim()) {
              addFintechApp(currentAppInput);
            }
          }} disabled={!currentAppInput.trim()} className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-800">
            <strong>Note:</strong> These apps help us understand which countries you can send money to, as each app serves different regions.
          </p>
        </div>
      </div>
    </div>;
  const renderStep6 = () => <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Proof of Funds
        </h2>
        <p className="text-gray-600">
          Upload your financial statements from both countries
        </p>
      </div>

      <div className="space-y-6">
        {/* Sending Country Statement */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sending Country Statement
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Bank Statement, Mobile Money Statement or Fintech App Statement
          </p>
          <div className="relative">
            <input type="file" id="sendingCountryFile" onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload('sendingCountry', file);
          }} accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
            <label htmlFor="sendingCountryFile" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${proofOfFunds.sendingCountry ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'}`}>
              {proofOfFunds.sendingCountry ? <>
                  <Check className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-700">{sendingFileName}</span>
                  <span className="text-xs text-green-600 mt-1">Click to change</span>
                </> : <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload</span>
                  <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</span>
                </>}
            </label>
          </div>
        </div>

        {/* Receiving Country Statement */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Receiving Country Statement
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Bank Statement, Mobile Money Statement or Fintech App Statement
          </p>
          <div className="relative">
            <input type="file" id="receivingCountryFile" onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload('receivingCountry', file);
          }} accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
            <label htmlFor="receivingCountryFile" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${proofOfFunds.receivingCountry ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'}`}>
              {proofOfFunds.receivingCountry ? <>
                  <Check className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-700">{receivingFileName}</span>
                  <span className="text-xs text-green-600 mt-1">Click to change</span>
                </> : <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload</span>
                  <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</span>
                </>}
            </label>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Your statements must be from the last 3 months and show sufficient funds for transactions.
          </p>
        </div>
      </div>
    </div>;
  const renderCongratulations = () => <div className="space-y-6 text-center py-8">
      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
        <PartyPopper className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Congratulations!
      </h2>
      <p className="text-lg text-gray-600 max-w-md mx-auto">
        Your application has been submitted successfully.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto mt-6">
        <p className="text-sm text-blue-900 leading-relaxed">
          You will hear from us in <strong>24-48 hours</strong> if you have been approved.
        </p>
      </div>
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Check className="w-5 h-5 text-green-600" />
          <span>Application submitted</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Check className="w-5 h-5 text-green-600" />
          <span>Documents uploaded</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Check className="w-5 h-5 text-green-600" />
          <span>Under review</span>
        </div>
      </div>
      <button onClick={onBack} className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
        Return to Home
      </button>
    </div>;
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Become an Agent
          </h1>
          <p className="text-gray-600">
            Join our network of trusted money transfer agents
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep <= 6 && renderStepIndicator()}

          {/* Step Content */}
          <div className="min-h-[300px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}
            {currentStep === 7 && renderCongratulations()}
          </div>

          {/* Navigation */}
          {currentStep <= 6 && <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 ? <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Back
                </button> : <button onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Cancel
                </button>}

              <button onClick={() => {
            if (currentStep === 6) {
              setCurrentStep(7);
            } else {
              setCurrentStep(currentStep + 1);
            }
          }} disabled={!canProceed()} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${canProceed() ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {currentStep === 6 ? 'Submit Application' : 'Continue'}
              </button>
            </div>}
        </div>

        {/* Progress Text */}
        {currentStep <= 6 && <div className="text-center mt-6 text-sm text-gray-600">
            Step {currentStep} of 6
          </div>}
      </div>
    </div>;
}