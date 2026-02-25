import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, Phone, Upload, Camera, MapPin, Check, AlertCircle, Loader2, ChevronRight, ChevronLeft, Shield, FileText, User, Facebook, Twitter, Instagram, Linkedin, CheckCircle2, Video, DollarSign, Building2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export interface ProfileKYCProps {
  onComplete?: () => void;
  onBack?: () => void;
  userEmail?: string;
}
type KYCStep = 'email-verification' | 'phone-verification' | 'government-id' | 'face-verification' | 'source-of-funds' | 'bank-statement' | 'location' | 'social-verification' | 'complete';
interface StepInfo {
  number: number;
  title: string;
  description: string;
  icon: any;
}
const STEPS_INFO: Record<KYCStep, StepInfo> = {
  'email-verification': {
    number: 1,
    title: 'Email Verification',
    description: 'Confirm your email address',
    icon: Mail
  },
  'phone-verification': {
    number: 2,
    title: 'Phone Verification',
    description: 'Verify your phone number',
    icon: Phone
  },
  'government-id': {
    number: 3,
    title: 'Government ID',
    description: 'Upload valid identification',
    icon: FileText
  },
  'source-of-funds': {
    number: 4,
    title: 'Source of Funds',
    description: 'Tell us about your income',
    icon: DollarSign
  },
  'bank-statement': {
    number: 5,
    title: 'Financial Documents',
    description: 'Upload bank/mobile money statement',
    icon: Building2
  },
  'location': {
    number: 6,
    title: 'Location Services',
    description: 'Enable location access',
    icon: MapPin
  },
  'social-verification': {
    number: 7,
    title: 'Social Verification',
    description: 'Connect a social account',
    icon: User
  },
  'face-verification': {
    number: 8,
    title: 'Live Face Check',
    description: 'Verify your identity',
    icon: Video
  },
  'complete': {
    number: 9,
    title: 'Complete',
    description: 'KYC verification complete',
    icon: CheckCircle2
  }
};
export const ProfileKYC = ({
  onComplete,
  onBack,
  userEmail
}: ProfileKYCProps) => {
  const [currentStep, setCurrentStep] = useState<KYCStep>('email-verification');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Email verification
  const [emailCode, setEmailCode] = useState(['', '', '', '', '', '']);
  const [emailVerified, setEmailVerified] = useState(false);
  const emailInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Phone verification
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState(['', '', '', '', '', '']);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const phoneInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Government ID
  const [idType, setIdType] = useState<'passport' | 'drivers-license' | 'national-id'>('passport');
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [idUploaded, setIdUploaded] = useState(false);

  // Face verification
  const [faceCheckStep, setFaceCheckStep] = useState<'ready' | 'center' | 'left' | 'right' | 'up' | 'down' | 'complete'>('ready');
  const [faceVerified, setFaceVerified] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Source of funds
  const [sourceOfFunds, setSourceOfFunds] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [sofCompleted, setSofCompleted] = useState(false);

  // Bank statement
  const [statementType, setStatementType] = useState<'bank' | 'mobile-money'>('bank');
  const [statement, setStatement] = useState<File | null>(null);
  const [statementUploaded, setStatementUploaded] = useState(false);

  // Location
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    country?: string;
  } | null>(null);

  // Social verification
  const [selectedSocial, setSelectedSocial] = useState<string | null>(null);
  const [socialVerified, setSocialVerified] = useState(false);
  const [socialMediaLink, setSocialMediaLink] = useState('');
  const totalSteps = 8;

  // Handle email code input
  const handleEmailCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...emailCode];
    newCode[index] = value;
    setEmailCode(newCode);
    if (value && index < 5) {
      emailInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle phone code input
  const handlePhoneCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...phoneCode];
    newCode[index] = value;
    setPhoneCode(newCode);
    if (value && index < 5) {
      phoneInputRefs.current[index + 1]?.focus();
    }
  };

  // Verify email
  const verifyEmail = async () => {
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (emailCode.join('').length === 6) {
        setEmailVerified(true);
        setIsLoading(false);
        setTimeout(() => setCurrentStep('phone-verification'), 1000);
      } else {
        setError('Please enter the complete verification code');
        setIsLoading(false);
      }
    }, 1500);
  };

  // Send phone OTP
  const sendPhoneOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('OTP sent to ' + phoneNumber);
    }, 1500);
  };

  // Verify phone
  const verifyPhone = async () => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (phoneCode.join('').length === 6) {
        setPhoneVerified(true);
        setIsLoading(false);
        setTimeout(() => setCurrentStep('government-id'), 1000);
      } else {
        setError('Please enter the complete OTP code');
        setIsLoading(false);
      }
    }, 1500);
  };

  // Upload ID
  const uploadID = async () => {
    if (!idFront) {
      setError('Please upload at least the front of your ID');
      return;
    }
    if (idType !== 'passport' && !idBack) {
      setError('Please upload both sides of your ID');
      return;
    }
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setIdUploaded(true);
      setIsLoading(false);
      setTimeout(() => setCurrentStep('source-of-funds'), 1000);
    }, 2000);
  };

  // Start face verification
  const startFaceVerification = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setFaceCheckStep('center');
    } catch (err) {
      setError('Unable to access camera. Please grant camera permissions.');
    }
  };

  // Face check sequence
  const completeFaceStep = () => {
    const steps: typeof faceCheckStep[] = ['center', 'left', 'right', 'up', 'down', 'complete'];
    const currentIndex = steps.indexOf(faceCheckStep);
    if (currentIndex < steps.length - 1) {
      setTimeout(() => {
        setFaceCheckStep(steps[currentIndex + 1]);
      }, 1500);
    }
    if (faceCheckStep === 'down') {
      setTimeout(() => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setFaceVerified(true);
        setTimeout(() => setCurrentStep('complete'), 1000);
      }, 2000);
    }
  };
  useEffect(() => {
    if (faceCheckStep !== 'ready' && faceCheckStep !== 'complete') {
      completeFaceStep();
    }
  }, [faceCheckStep]);

  // Complete SOF
  const completeSourceOfFunds = () => {
    if (!sourceOfFunds || !employmentStatus || !occupation || !companyName || !monthlyIncome) {
      setError('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setSofCompleted(true);
      setIsLoading(false);
      setTimeout(() => setCurrentStep('bank-statement'), 1000);
    }, 1000);
  };

  // Upload bank statement
  const uploadBankStatement = () => {
    if (!statement) {
      setError('Please upload your statement');
      return;
    }
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setStatementUploaded(true);
      setIsLoading(false);
      setTimeout(() => setCurrentStep('location'), 1000);
    }, 2000);
  };

  // Enable location
  const enableLocation = () => {
    setIsLoading(true);
    setError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationEnabled(true);
        setIsLoading(false);
        setTimeout(() => setCurrentStep('social-verification'), 1000);
      }, err => {
        setError('Unable to access location. Please enable location services.');
        setIsLoading(false);
      });
    } else {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
    }
  };

  // Connect social
  const connectSocial = (platform: string) => {
    setIsLoading(true);
    setSelectedSocial(platform);

    // Simulate OAuth flow
    setTimeout(() => {
      setSocialVerified(true);
      setIsLoading(false);
      setTimeout(() => setCurrentStep('face-verification'), 1000);
    }, 2000);
  };

  // Continue with manual social verification
  const continueSocialVerification = () => {
    if (!socialMediaLink) {
      setError('Please provide a social media link');
      return;
    }
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setSocialVerified(true);
      setIsLoading(false);
      setTimeout(() => setCurrentStep('face-verification'), 1000);
    }, 1500);
  };

  // Complete KYC
  useEffect(() => {
    if (currentStep === 'complete') {
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    }
  }, [currentStep]);
  const stepInfo = STEPS_INFO[currentStep];
  const StepIcon = stepInfo.icon;
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Complete KYC verification to start using PayUpp</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-blue-600">
              {stepInfo.number} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{
            width: `${stepInfo.number / totalSteps * 100}%`
          }} />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Step Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <StepIcon size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{stepInfo.title}</h2>
            <p className="text-blue-100">{stepInfo.description}</p>
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* Email Verification */}
              {currentStep === 'email-verification' && <motion.div key="email" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }}>
                  <p className="text-gray-600 mb-6 text-center">
                    We've sent a 6-digit code to <strong>{userEmail || 'your email'}</strong>
                  </p>
                  
                  <div className="flex gap-2 justify-center mb-6">
                    {emailCode.map((digit, index) => <input key={index} ref={el => {
                  emailInputRefs.current[index] = el;
                }} type="text" maxLength={1} value={digit} onChange={e => handleEmailCodeChange(index, e.target.value)} className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none" />)}
                  </div>

                  {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>}

                  {emailVerified ? <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-green-600" />
                      <p className="text-green-800 font-medium">Email verified successfully!</p>
                    </div> : <button onClick={verifyEmail} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isLoading ? <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Verifying...</span>
                        </> : <>
                          <span>Verify Email</span>
                          <ChevronRight size={18} />
                        </>}
                    </button>}

                  <button className="w-full mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Resend code
                  </button>
                </motion.div>}

              {/* Phone Verification */}
              {currentStep === 'phone-verification' && <motion.div key="phone" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+1 (555) 123-4567" className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button onClick={sendPhoneOTP} disabled={isLoading} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50">
                        Send OTP
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center mb-6">
                    {phoneCode.map((digit, index) => <input key={index} ref={el => {
                  phoneInputRefs.current[index] = el;
                }} type="text" maxLength={1} value={digit} onChange={e => handlePhoneCodeChange(index, e.target.value)} className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none" />)}
                  </div>

                  {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>}

                  {phoneVerified ? <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-green-600" />
                      <p className="text-green-800 font-medium">Phone verified successfully!</p>
                    </div> : <button onClick={verifyPhone} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isLoading ? <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Verifying...</span>
                        </> : <>
                          <span>Verify Phone</span>
                          <ChevronRight size={18} />
                        </>}
                    </button>}
                </motion.div>}

              {/* Government ID */}
              {currentStep === 'government-id' && <motion.div key="id" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ID Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['passport', 'drivers-license', 'national-id'] as const).map(type => <button key={type} onClick={() => setIdType(type)} className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${idType === type ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                          {type === 'passport' && 'Passport'}
                          {type === 'drivers-license' && "Driver's License"}
                          {type === 'national-id' && 'National ID'}
                        </button>)}
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Front of ID
                      </label>
                      <input type="file" accept="image/*" onChange={e => setIdFront(e.target.files?.[0] || null)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      {idFront && <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                          <Check size={16} /> {idFront.name}
                        </p>}
                    </div>

                    {idType !== 'passport' && <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Back of ID
                        </label>
                        <input type="file" accept="image/*" onChange={e => setIdBack(e.target.files?.[0] || null)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {idBack && <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                            <Check size={16} /> {idBack.name}
                          </p>}
                      </div>}
                  </div>

                  {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>}

                  {idUploaded ? <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-green-600" />
                      <p className="text-green-800 font-medium">ID uploaded successfully!</p>
                    </div> : <button onClick={uploadID} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isLoading ? <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Uploading...</span>
                        </> : <>
                          <Upload size={18} />
                          <span>Upload ID</span>
                        </>}
                    </button>}
                </motion.div>}

              {/* Source of Funds */}
              {currentStep === 'source-of-funds' && <motion.div key="sof" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Source of Funds
                      </label>
                      <select value={sourceOfFunds} onChange={e => setSourceOfFunds(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select source</option>
                        <option value="employment">Employment/Salary</option>
                        <option value="business">Business Income</option>
                        <option value="investment">Investment Returns</option>
                        <option value="savings">Savings</option>
                        <option value="inheritance">Inheritance/Gift</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Status
                      </label>
                      <select value={employmentStatus} onChange={e => setEmploymentStatus(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select status</option>
                        <option value="employed">Employed</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="unemployed">Unemployed</option>
                        <option value="student">Student</option>
                        <option value="retired">Retired</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Occupation
                      </label>
                      <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="e.g., Software Engineer" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company/Business/Organization Name
                      </label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g., Acme Corp" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Income Range
                      </label>
                      <select value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select range</option>
                        <option value="<1000">Less than $1,000</option>
                        <option value="1000-5000">$1,000 - $5,000</option>
                        <option value="5000-10000">$5,000 - $10,000</option>
                        <option value="10000-25000">$10,000 - $25,000</option>
                        <option value=">25000">More than $25,000</option>
                      </select>
                    </div>
                  </div>

                  {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>}

                  {sofCompleted ? <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-green-600" />
                      <p className="text-green-800 font-medium">Information saved successfully!</p>
                    </div> : <button onClick={completeSourceOfFunds} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isLoading ? <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Saving...</span>
                        </> : <>
                          <span>Continue</span>
                          <ChevronRight size={18} />
                        </>}
                    </button>}
                </motion.div>}

              {/* Bank Statement */}
              {currentStep === 'bank-statement' && <motion.div key="statement" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Statement Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setStatementType('bank')} className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${statementType === 'bank' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                        Bank Statement
                      </button>
                      <button onClick={() => setStatementType('mobile-money')} className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${statementType === 'mobile-money' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                        Mobile Money / Fintech
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Statement (Last 3 months)
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Bank Statement, Mobile Money Statement or Fintech App Statement
                    </p>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setStatement(e.target.files?.[0] || null)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {statement && <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <Check size={16} /> {statement.name}
                      </p>}
                    <p className="text-xs text-gray-500 mt-2">
                      Accepted formats: PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>

                  {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>}

                  {statementUploaded ? <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-green-600" />
                      <p className="text-green-800 font-medium">Statement uploaded successfully!</p>
                    </div> : <button onClick={uploadBankStatement} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isLoading ? <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Uploading...</span>
                        </> : <>
                          <Upload size={18} />
                          <span>Upload Statement</span>
                        </>}
                    </button>}
                </motion.div>}

              {/* Location */}
              {currentStep === 'location' && <motion.div key="location" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }} className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin size={40} className="text-blue-600" />
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    We need to verify your location for security and compliance purposes.
                  </p>

                  <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <ul className="text-left space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check size={18} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>Your exact location is never shared publicly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={18} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>Location is only used for compliance verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={18} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>You can disable this later in settings</span>
                      </li>
                    </ul>
                  </div>

                  {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>}

                  {locationEnabled ? <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
                      <p className="text-green-800 font-medium">Location verified successfully!</p>
                      {userLocation && <p className="text-sm text-gray-600 mt-2">
                          Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                        </p>}
                    </div> : <button onClick={enableLocation} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isLoading ? <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Getting location...</span>
                        </> : <>
                          <MapPin size={18} />
                          <span>Enable Location Services</span>
                        </>}
                    </button>}
                </motion.div>}

              {/* Social Verification */}
              {currentStep === 'social-verification' && <motion.div key="social" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }} className="text-center">
                  <p className="text-gray-600 mb-6">
                    Connect at least one social media account to verify your identity.
                  </p>

                  {socialVerified ? <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
                      <p className="text-green-800 font-medium text-lg">
                        Connected to {selectedSocial}!
                      </p>
                    </div> : <div className="space-y-4 mb-6">
                      <div className="space-y-3">
                        <button onClick={() => connectSocial('Facebook')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] transition-all disabled:opacity-50">
                          {isLoading && selectedSocial === 'Facebook' ? <Loader2 size={20} className="animate-spin" /> : <Facebook size={20} />}
                          <span className="font-semibold">Connect Facebook</span>
                        </button>

                        <button onClick={() => connectSocial('Twitter')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all disabled:opacity-50">
                          {isLoading && selectedSocial === 'Twitter' ? <Loader2 size={20} className="animate-spin" /> : <Twitter size={20} />}
                          <span className="font-semibold">Connect Twitter</span>
                        </button>

                        <button onClick={() => connectSocial('Instagram')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50">
                          {isLoading && selectedSocial === 'Instagram' ? <Loader2 size={20} className="animate-spin" /> : <Instagram size={20} />}
                          <span className="font-semibold">Connect Instagram</span>
                        </button>

                        <button onClick={() => connectSocial('LinkedIn')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all disabled:opacity-50">
                          {isLoading && selectedSocial === 'LinkedIn' ? <Loader2 size={20} className="animate-spin" /> : <Linkedin size={20} />}
                          <span className="font-semibold">Connect LinkedIn</span>
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white text-gray-500 font-medium">Or paste your social media link</span>
                        </div>
                      </div>

                      {/* Social Media Link Input */}
                      <div className="text-left">
                        <label htmlFor="socialMediaLink" className="block text-sm font-medium text-gray-700 mb-2">
                          Social Media Profile Link
                        </label>
                        <input id="socialMediaLink" type="url" value={socialMediaLink} onChange={e => setSocialMediaLink(e.target.value)} placeholder="https://facebook.com/yourprofile" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                        <p className="text-xs text-gray-500 mt-1">Paste a link to your Facebook, Twitter, Instagram, or LinkedIn profile</p>
                        <p className="text-xs font-medium text-blue-600 mt-2 bg-blue-50 border border-blue-200 rounded p-2">
                          <strong>Please make your social media pages public for assessment</strong>
                        </p>
                      </div>

                      {/* Continue Button for Manual Entry */}
                      {socialMediaLink && <div className="pt-2">
                          {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                              <p className="text-sm text-red-800">{error}</p>
                            </div>}
                          <button onClick={continueSocialVerification} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            {isLoading ? <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Verifying...</span>
                              </> : <>
                                <span>Continue</span>
                                <ChevronRight size={18} />
                              </>}
                          </button>
                        </div>}
                    </div>}
                </motion.div>}

              {/* Face Verification */}
              {currentStep === 'face-verification' && <motion.div key="face" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }} className="text-center">
                  {faceCheckStep === 'ready' ? <>
                      <p className="text-gray-600 mb-6">
                        We'll guide you through a quick face verification to confirm your identity.
                      </p>
                      <div className="bg-blue-50 rounded-xl p-6 mb-6">
                        <ul className="text-left space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check size={18} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>Make sure you're in a well-lit area</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={18} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>Remove glasses and face coverings</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={18} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>Follow the on-screen instructions</span>
                          </li>
                        </ul>
                      </div>
                      <button onClick={startFaceVerification} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2">
                        <Camera size={18} />
                        <span>Start Face Verification</span>
                      </button>
                    </> : faceCheckStep === 'complete' ? <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
                      <p className="text-green-800 font-medium text-lg">Face verified successfully!</p>
                    </div> : <>
                      <div className="bg-gray-900 rounded-xl overflow-hidden mb-6 relative">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-80 object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white text-center bg-black/50 px-6 py-3 rounded-lg">
                            <p className="text-xl font-bold mb-1">
                              {faceCheckStep === 'center' && 'Look at the camera'}
                              {faceCheckStep === 'left' && 'Turn your head LEFT'}
                              {faceCheckStep === 'right' && 'Turn your head RIGHT'}
                              {faceCheckStep === 'up' && 'Look UP'}
                              {faceCheckStep === 'down' && 'Look DOWN'}
                            </p>
                            <Loader2 size={24} className="animate-spin mx-auto mt-2" />
                          </div>
                        </div>
                      </div>
                    </>}
                  
                  {error && <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>}
                </motion.div>}

              {/* Complete */}
              {currentStep === 'complete' && <motion.div key="complete" initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="text-center py-8">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={56} className="text-green-600" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    Verification Complete!
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Your account is now fully verified. You can start using PayUpp!
                  </p>

                  <div className="bg-blue-50 rounded-xl p-6">
                    <p className="text-sm text-gray-700">
                      Redirecting you to your dashboard...
                    </p>
                    <Loader2 size={24} className="animate-spin text-blue-600 mx-auto mt-4" />
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>
        </div>

        {/* Back Button */}
        {currentStep !== 'complete' && onBack && <button onClick={onBack} className="mt-6 text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-2 mx-auto">
            <ChevronLeft size={18} />
            <span>Back</span>
          </button>}
      </div>
    </div>;
};