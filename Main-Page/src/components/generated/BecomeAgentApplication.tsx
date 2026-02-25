"use client";

import * as React from "react";
import { useState } from "react";
import { X, Plus, Check, MapPin, Globe, DollarSign, Calendar, Smartphone, FileText, Upload, PartyPopper, User, ShieldCheck, TrendingUp, Users, CheckCircle, Facebook, Twitter, Instagram, Linkedin, Loader2, ArrowRight } from "lucide-react";
import { EmailInputWithSuggestions } from "./EmailInputWithSuggestions";
export interface BecomeAgentApplicationProps {
  onSubmit?: (data: any) => void;
  onBack?: () => void;
  onForward?: () => void;
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
interface ResumeUpload {
  file: File | null;
}
export default function BecomeAgentApplication({
  onSubmit,
  onBack,
  onForward
}: BecomeAgentApplicationProps) {
  const [showApplication, setShowApplication] = useState(false);
  const [showDocumentChecklist, setShowDocumentChecklist] = useState(false);
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

  // Resume/CV/Profile upload
  const [resumeUpload, setResumeUpload] = useState<ResumeUpload>({
    file: null
  });
  const [resumeFileName, setResumeFileName] = useState('');

  // Co-signer information
  const [coSignerName, setCoSignerName] = useState('');
  const [coSignerEmail, setCoSignerEmail] = useState('');
  const [coSignerPhone, setCoSignerPhone] = useState('');

  // Social verification
  const [selectedSocial, setSelectedSocial] = useState<string | null>(null);
  const [socialVerified, setSocialVerified] = useState(false);
  const [socialMediaLink, setSocialMediaLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Popular countries and regions
  const countries = [
  // Africa - All countries
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Democratic Republic of Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe',
  // North America
  'United States', 'Canada', 'Mexico',
  // Europe - Major countries
  'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland', 'Portugal', 'Greece', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria',
  // Eastern Europe
  'Russia', 'Ukraine', 'Belarus', 'Moldova', 'Estonia', 'Latvia', 'Lithuania',
  // Asia - Major countries
  'China', 'Japan', 'India', 'South Korea', 'Singapore', 'Hong Kong', 'Taiwan', 'Thailand', 'Malaysia', 'Indonesia', 'Philippines', 'Vietnam', 'Bangladesh', 'Pakistan', 'Sri Lanka', 'Nepal', 'Myanmar', 'Cambodia', 'Laos',
  // Middle East
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Israel', 'Jordan', 'Lebanon', 'Turkey', 'Iran', 'Iraq',
  // South America
  'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'French Guiana',
  // Central America & Caribbean
  'Costa Rica', 'Panama', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Belize', 'Jamaica', 'Trinidad and Tobago', 'Barbados', 'Dominican Republic', 'Haiti', 'Cuba', 'Puerto Rico', 'Bahamas',
  // Oceania
  'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Samoa', 'Tonga', 'Vanuatu'].sort();
  const regions = [
  // Africa
  'West Africa', 'East Africa', 'North Africa', 'Southern Africa', 'Central Africa',
  // Europe
  'Europe', 'Western Europe', 'Eastern Europe', 'Northern Europe', 'Southern Europe',
  // Americas
  'North America', 'Central America', 'South America', 'Caribbean', 'Latin America',
  // Asia
  'Southeast Asia', 'East Asia', 'South Asia', 'Central Asia', 'Western Asia',
  // Middle East
  'Middle East', 'Gulf Countries',
  // Oceania
  'Oceania', 'Pacific Islands',
  // Other
  'Worldwide', 'Global'].sort();

  // Popular fintech apps for autosuggest
  const popularFintechApps = ['Mobile Money', 'Mpesa', 'Telecel Cash', 'Moniepoint', 'OPay', 'Flutterwave', 'Paystack', 'TapTap Send', 'WorldRemit', 'Remitly', 'Sendwave', 'Afriex', 'PAPSS', 'LemFi', 'Xoom', 'Eversend', 'Accrue', 'Chipper Cash', 'Pesa', 'Leatherback', 'Wise (TransferWise)', 'Revolut', 'PayPal', 'Skrill', 'Payoneer', 'Western Union', 'MoneyGram', 'Ria Money Transfer', 'M-Pesa', 'MTN Mobile Money', 'Airtel Money', 'Orange Money', 'Wave', 'Small World', 'Azimo', 'TransferGo', 'InstaReM', 'CurrencyFair', 'OFX', 'Mukuru', 'WorldFirst', 'Pangea Money Transfer', 'Remit2India', 'Xpress Money', 'UAE Exchange', 'Al Ansari Exchange', 'Alipay', 'WeChat Pay', 'GCash', 'PayMaya', 'Paytm', 'PhonePe', 'Google Pay', 'Cash App', 'Venmo', 'Zelle', 'Chime'];
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
  const handleResumeUpload = (file: File) => {
    setResumeUpload({
      file
    });
    setResumeFileName(file.name);
  };

  // Connect social
  const connectSocial = (platform: string) => {
    setIsLoading(true);
    setSelectedSocial(platform);

    // Simulate OAuth flow
    setTimeout(() => {
      setSocialVerified(true);
      setIsLoading(false);
    }, 2000);
  };

  // Continue with manual social verification
  const continueSocialVerification = () => {
    if (!socialMediaLink) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setSocialVerified(true);
      setIsLoading(false);
    }, 1500);
  };
  const handleSubmit = () => {
    const applicationData = {
      sendFrom: sendFromLocations,
      sendTo: sendToLocations,
      amount,
      frequency,
      fintechApps: fintechApps.map(app => app.name),
      resume: resumeFileName,
      proofOfFunds: {
        sendingCountry: sendingFileName,
        receivingCountry: receivingFileName
      },
      socialVerification: {
        platform: selectedSocial,
        link: socialMediaLink
      },
      coSigner: {
        name: coSignerName,
        email: coSignerEmail,
        phone: coSignerPhone
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
        return resumeUpload.file !== null;
      case 7:
        return proofOfFunds.sendingCountry !== null && proofOfFunds.receivingCountry !== null;
      case 8:
        return socialVerified;
      case 9:
        return coSignerName.trim() !== '' && coSignerEmail.trim() !== '' && coSignerPhone.trim() !== '';
      default:
        return false;
    }
  };
  const renderStepIndicator = () => <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto px-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(step => <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all shrink-0 text-sm ${currentStep === step ? 'bg-blue-600 text-white scale-110' : currentStep > step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {currentStep > step ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 9 && <div className={`h-1 w-4 rounded transition-all shrink-0 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`} />}
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

                <select value={location.value} onChange={e => updateSendFromLocation(location.id, 'value', e.target.value)} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base">
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

                <select value={location.value} onChange={e => updateSendToLocation(location.id, 'value', e.target.value)} className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base">
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
        <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-violet-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Resume / CV / Profile
        </h2>
        <p className="text-gray-600">
          Upload your professional profile document
        </p>
      </div>

      <div className="space-y-6">
        {/* Resume/CV Upload */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Resume, CV, or Professional Profile
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Upload your resume, CV, LinkedIn profile export, or any professional profile document
          </p>
          <div className="relative">
            <input type="file" id="resumeFile" onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleResumeUpload(file);
          }} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" />
            <label htmlFor="resumeFile" className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer transition-all ${resumeUpload.file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-violet-400 hover:bg-violet-50'}`}>
              {resumeUpload.file ? <>
                  <Check className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-700">{resumeFileName}</span>
                  <span className="text-xs text-green-600 mt-1">Click to change</span>
                </> : <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload</span>
                  <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</span>
                </>}
            </label>
          </div>
        </div>

        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
          <p className="text-sm text-violet-800">
            <strong>Why we need this:</strong> Your professional profile helps us understand your background and verify your identity as part of our agent vetting process.
          </p>
        </div>
      </div>
    </div>;
  const renderStep7 = () => <div className="space-y-6">
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
            <label htmlFor="sendingCountryFile" className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer transition-all ${proofOfFunds.sendingCountry ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'}`}>
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
            <label htmlFor="receivingCountryFile" className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer transition-all ${proofOfFunds.receivingCountry ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'}`}>
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
  const renderStep8 = () => <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-cyan-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Social Verification
        </h2>
        <p className="text-gray-600">
          Connect a social account to verify your identity
        </p>
      </div>

      <p className="text-gray-600 text-center mb-6">
        Connect at least one social media account to verify your identity.
      </p>

      {socialVerified ? <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-green-800 font-medium text-lg text-center">
            Connected to {selectedSocial}!
          </p>
        </div> : <div className="space-y-4 mb-6">
          <div className="space-y-3">
            <button onClick={() => connectSocial('Facebook')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] transition-all disabled:opacity-50">
              {isLoading && selectedSocial === 'Facebook' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Facebook className="w-5 h-5" />}
              <span className="font-semibold">Connect Facebook</span>
            </button>

            <button onClick={() => connectSocial('Twitter')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all disabled:opacity-50">
              {isLoading && selectedSocial === 'Twitter' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Twitter className="w-5 h-5" />}
              <span className="font-semibold">Connect Twitter</span>
            </button>

            <button onClick={() => connectSocial('Instagram')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50">
              {isLoading && selectedSocial === 'Instagram' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Instagram className="w-5 h-5" />}
              <span className="font-semibold">Connect Instagram</span>
            </button>

            <button onClick={() => connectSocial('LinkedIn')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all disabled:opacity-50">
              {isLoading && selectedSocial === 'LinkedIn' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Linkedin className="w-5 h-5" />}
              <span className="font-semibold">Connect LinkedIn</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or enter manually</span>
            </div>
          </div>

          <div className="space-y-3">
            <input type="url" value={socialMediaLink} onChange={e => setSocialMediaLink(e.target.value)} placeholder="Paste your social media profile link" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
            <p className="text-xs text-gray-500 px-1">
              This could be your website, profile, blog, or even a church, mosque, or club you're involved with.
            </p>
            <button onClick={continueSocialVerification} disabled={!socialMediaLink || isLoading} className="w-full py-3 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : 'Continue'}
            </button>
          </div>
        </div>}

      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
        <p className="text-sm text-cyan-800">
          <strong>Why we need this:</strong> Social verification helps us confirm your identity and build trust in our agent network.
        </p>
      </div>
    </div>;
  const renderStep9 = () => <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-pink-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Co-Signer Information
        </h2>
        <p className="text-gray-600">
          Provide details of someone who can vouch for you
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">What is a Co-Signer?</h4>
        <p className="text-sm text-blue-800 leading-relaxed">
          A co-signer is someone who agrees to take liability on your behalf in case you are not available to complete a transfer. 
          This could be a company staff member, spouse, family member, or business partner. We will reach out to them to accept being a co-signer for you.
        </p>
      </div>

      <div className="space-y-5">
        {/* Co-Signer Name */}
        <div>
          <label htmlFor="coSignerName" className="block text-sm font-medium text-gray-700 mb-2">
            Co-Signer Full Name <span className="text-red-500">*</span>
          </label>
          <input id="coSignerName" type="text" value={coSignerName} onChange={e => setCoSignerName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all" />
        </div>

        {/* Co-Signer Email */}
        <div>
          <EmailInputWithSuggestions id="coSignerEmail" value={coSignerEmail} onChange={setCoSignerEmail} label="Co-Signer Email" placeholder="john.doe@example.com" required />
        </div>

        {/* Co-Signer Phone */}
        <div>
          <label htmlFor="coSignerPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Co-Signer Phone Number <span className="text-red-500">*</span>
          </label>
          <input id="coSignerPhone" type="tel" value={coSignerPhone} onChange={e => setCoSignerPhone(e.target.value)} placeholder="+1 (555) 123-4567" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all" />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Your co-signer will receive an email to confirm their agreement to be your co-signer. Please ensure the information provided is accurate.
        </p>
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

  // If application flow hasn't started, show info page
  if (!showApplication) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Become an Agent
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join our network of trusted money transfer agents
            </p>
            <button onClick={() => setShowApplication(true)} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
              Become an Agent
            </button>
          </div>

          {/* Information Sections */}
          <div className="space-y-8 mt-12">
            {/* Who can be an agent? */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Who can be an agent?</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-gray-700">People with accounts in multiple countries</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-gray-700">Businesses with money sitting in offshore accounts</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-gray-700">Remote workers paid into foreign accounts</p>
                </div>
              </div>
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> We do not receive money or funds from anyone. We just match you and help make the process safer than the traditional methods of sending money abroad.
                </p>
              </div>
            </div>

            {/* How do agents benefit? */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How do agents benefit?</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-gray-700">Make profit on the spread in the exchange rate</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-gray-700">Move your money without having the money cross borders</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-gray-700">Help folks struggling with cross-border payments</p>
                </div>
              </div>
            </div>

            {/* How do you vet agents? */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How do you vet agents?</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Agents are subject to ongoing background checks and verification in line with our KYC and AML policies. 
                Senders are similarly verified and screened against applicable anti–money laundering requirements.
              </p>
            </div>

            {/* How much can an agent send? */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How much can an agent send?</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Transfer limits increase in stages, starting at $100 and up to $1M, based on successful transfers and verification requirements.
              </p>
            </div>

            {/* How do you protect agents? */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How do you protect agents?</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Agent identity details are only disclosed when required to complete a transaction. We also verify senders and apply privacy and security controls throughout the process.
              </p>
            </div>

            {/* Call to Action */}
            <div className="text-center py-8">
              <button onClick={() => setShowApplication(true)} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                Start Your Application
              </button>
            </div>
          </div>
        </div>
      </div>;
  }

  // Application flow
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

        {/* Show Document Checklist if not acknowledged */}
        {!showDocumentChecklist ? <div className="bg-white rounded-2xl shadow-xl p-6">
            {/* Document Icon */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Before We Start
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Get ready with your documents
            </p>

            {/* Documents Needed */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
                You'll need:
              </h3>

              {/* Document 1 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">
                      Sending Country Financial Statement
                    </h4>
                    <p className="text-sm text-gray-700">
                      Bank Statement, Mobile Money Statement or Fintech App Statement
                    </p>
                  </div>
                </div>
              </div>

              {/* Document 2 */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">
                      Receiving Country Financial Statement
                    </h4>
                    <p className="text-sm text-gray-700">
                      Bank Statement, Mobile Money Statement or Fintech App Statement
                    </p>
                  </div>
                </div>
              </div>

              {/* Document 3 */}
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">
                      Resume / CV / Profile
                    </h4>
                    <p className="text-sm text-gray-700">
                      Your professional profile, resume, CV, or LinkedIn profile export
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ready Button */}
            <button onClick={() => setShowDocumentChecklist(true)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
              I'm Ready
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Help Text */}
            <p className="text-center text-xs text-gray-500 mt-4">
              This helps us verify your identity and comply with regulations
            </p>
          </div> :
      // Main Application Form
      <div className="bg-white rounded-2xl shadow-xl p-8">
            {currentStep <= 9 && renderStepIndicator()}

            {/* Step Content */}
            <div className="min-h-[300px]">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
              {currentStep === 7 && renderStep7()}
              {currentStep === 8 && renderStep8()}
              {currentStep === 9 && renderStep9()}
              {currentStep === 10 && renderCongratulations()}
            </div>

            {/* Navigation */}
            {currentStep <= 9 && <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 ? <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Back
                </button> : <button onClick={() => {
            setShowDocumentChecklist(false);
          }} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Back to Documents
                </button>}

              <button onClick={() => {
            if (currentStep === 9) {
              setCurrentStep(10);
            } else {
              setCurrentStep(currentStep + 1);
            }
          }} disabled={!canProceed()} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${canProceed() ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {currentStep === 9 ? 'Submit Application' : 'Continue'}
              </button>
            </div>}
          </div>}

        {/* Progress Text */}
        {showDocumentChecklist && currentStep <= 9 && <div className="text-center mt-6 text-sm text-gray-600">
            Step {currentStep} of 9
          </div>}
      </div>
    </div>;
}