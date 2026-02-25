"use client";

import * as React from "react";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Shield, CheckCircle2, XCircle, Clock, Star, TrendingUp, Award, FileText, Upload, AlertCircle, DollarSign, Users, Building2, X, ChevronRight, BadgeCheck, Edit2, Camera } from "lucide-react";
export interface ProfilePageProps {
  userType?: 'user' | 'agent';
  userData?: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    joinedDate?: string;
    avatar?: string;
  };
  onBack?: () => void;
}
interface VerificationItem {
  id: string;
  name: string;
  status: 'completed' | 'pending' | 'not-started';
  icon: any;
}
interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  reviewer: string;
}
interface QualificationLevel {
  level: string;
  limit: string;
  requirements: string[];
  status: 'completed' | 'current' | 'locked';
}
export default function ProfilePage({
  userType = 'user',
  userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    joinedDate: 'January 2024',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  },
  onBack
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'reviews' | 'qualifications'>('overview');
  const [showGuarantorModal, setShowGuarantorModal] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [currentQualificationLevel, setCurrentQualificationLevel] = useState(0);
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorEmail, setGuarantorEmail] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [selectedDocType, setSelectedDocType] = useState('');

  // Sample verification items
  const verificationItems: VerificationItem[] = [{
    id: 'email',
    name: 'Email Verification',
    status: 'completed',
    icon: Mail
  }, {
    id: 'phone',
    name: 'Phone Verification',
    status: 'completed',
    icon: Phone
  }, {
    id: 'government-id',
    name: 'Government ID',
    status: 'completed',
    icon: FileText
  }, {
    id: 'face',
    name: 'Face Verification',
    status: 'completed',
    icon: Camera
  }, {
    id: 'sof',
    name: 'Source of Funds',
    status: 'completed',
    icon: DollarSign
  }, {
    id: 'bank-statement',
    name: 'Financial Documents',
    status: 'completed',
    icon: Building2
  }, {
    id: 'location',
    name: 'Location Services',
    status: 'completed',
    icon: MapPin
  }, {
    id: 'social',
    name: 'Social Verification',
    status: 'pending',
    icon: Users
  }];

  // Sample reviews (for agents)
  const reviews: Review[] = [{
    id: '1',
    rating: 5,
    comment: 'Great service! Very reliable and fast transfer.',
    date: '2 days ago',
    reviewer: 'Sarah M.'
  }, {
    id: '2',
    rating: 5,
    comment: 'Trustworthy agent. Completed transaction smoothly.',
    date: '1 week ago',
    reviewer: 'Michael T.'
  }, {
    id: '3',
    rating: 4,
    comment: 'Good experience, would recommend.',
    date: '2 weeks ago',
    reviewer: 'Emma L.'
  }];
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  // Qualification levels for agents
  const qualificationLevels: QualificationLevel[] = [{
    level: 'Level 1',
    limit: '$100',
    requirements: ['Complete a transaction at this level to qualify for Level 2'],
    status: currentQualificationLevel >= 0 ? 'completed' : 'current'
  }, {
    level: 'Level 2',
    limit: '$1,000',
    requirements: ['Complete a transaction at this level to qualify for Level 3'],
    status: currentQualificationLevel >= 1 ? 'completed' : currentQualificationLevel === 0 ? 'current' : 'locked'
  }, {
    level: 'Level 3',
    limit: '$10,000',
    requirements: ['Complete a transaction at this level to qualify for Level 4'],
    status: currentQualificationLevel >= 2 ? 'completed' : currentQualificationLevel === 1 ? 'current' : 'locked'
  }, {
    level: 'Level 4',
    limit: '$100,000',
    requirements: ['Complete a transaction at this level to qualify for Level 5'],
    status: currentQualificationLevel >= 3 ? 'completed' : currentQualificationLevel === 2 ? 'current' : 'locked'
  }, {
    level: 'Level 5',
    limit: '$1,000,000',
    requirements: ['Complete a transaction at this level to maintain your qualification'],
    status: currentQualificationLevel >= 4 ? 'completed' : currentQualificationLevel === 3 ? 'current' : 'locked'
  }];
  const handleGuarantorSubmit = () => {
    if (!guarantorName || !guarantorEmail || !guarantorPhone) {
      alert('Please fill in all guarantor details');
      return;
    }
    // Simulate sending message to guarantor
    alert(`Message sent to ${guarantorName} (${guarantorEmail}) to approve and agree to bear liability.`);
    setShowGuarantorModal(false);
    setGuarantorName('');
    setGuarantorEmail('');
    setGuarantorPhone('');
  };
  const handleDocumentUpload = () => {
    if (!uploadedDocument || !selectedDocType) {
      alert('Please select document type and upload a file');
      return;
    }
    alert(`Document uploaded successfully: ${uploadedDocument.name}`);
    setShowDocumentUpload(false);
    setUploadedDocument(null);
    setSelectedDocType('');
  };
  const renderStatusBadge = (status: 'completed' | 'pending' | 'not-started' | 'current' | 'locked') => {
    const styles = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'not-started': 'bg-gray-100 text-gray-600 border-gray-200',
      current: 'bg-blue-100 text-blue-700 border-blue-200',
      locked: 'bg-gray-100 text-gray-500 border-gray-200'
    };
    const icons = {
      completed: <CheckCircle2 className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      'not-started': <XCircle className="w-4 h-4" />,
      current: <TrendingUp className="w-4 h-4" />,
      locked: <XCircle className="w-4 h-4" />
    };
    return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        <span className="capitalize">{status === 'not-started' ? 'Not Started' : status}</span>
      </span>;
  };
  const renderStarRating = (rating: number) => {
    return <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />)}
      </div>;
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                  {userData.avatar ? <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" /> : <User size={48} className="text-gray-400" />}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-all">
                  <Camera size={18} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                      {userType === 'agent' && <BadgeCheck className="w-6 h-6 text-blue-600" />}
                    </div>
                    <p className="text-gray-600 mb-2">{userData.email}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {userData.phone && <div className="flex items-center gap-1">
                          <Phone size={14} />
                          <span>{userData.phone}</span>
                        </div>}
                      {userData.location && <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{userData.location}</span>
                        </div>}
                      {userData.joinedDate && <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Joined {userData.joinedDate}</span>
                        </div>}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all flex items-center gap-2">
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Stats */}
            {userType === 'agent' && <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-xl font-bold text-gray-900">{averageRating.toFixed(1)}/5</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                    <p className="text-xl font-bold text-gray-900">{totalReviews}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Limit</p>
                    <p className="text-xl font-bold text-gray-900">
                      {qualificationLevels[currentQualificationLevel].limit}
                    </p>
                  </div>
                </div>
              </div>}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button onClick={() => setActiveTab('overview')} className={`px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                Overview
              </button>
              <button onClick={() => setActiveTab('verification')} className={`px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'verification' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                Verification
              </button>
              {userType === 'agent' && <>
                  <button onClick={() => setActiveTab('reviews')} className={`px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                    Reviews & Ratings
                  </button>
                  <button onClick={() => setActiveTab('qualifications')} className={`px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'qualifications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                    Qualifications
                  </button>
                </>}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Account Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Account Status</p>
                      <p className="text-lg font-semibold text-gray-900">Active</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Account Type</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">Sender</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Verification Status</p>
                      <div className="flex items-center gap-2">
                        {renderStatusBadge('completed')}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Security Level</p>
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <p className="text-lg font-semibold text-gray-900">High</p>
                      </div>
                    </div>
                  </div>
                </div>

                {userType === 'agent' && <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">User Performance</h3>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Current Qualification Level</span>
                        <Award className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {qualificationLevels[currentQualificationLevel].level}
                      </p>
                      <p className="text-sm text-gray-600">
                        Transfer limit: {qualificationLevels[currentQualificationLevel].limit}
                      </p>
                      <button onClick={() => setActiveTab('qualifications')} className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                        View qualification details
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>}
              </div>}

            {/* Verification Tab */}
            {activeTab === 'verification' && <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Verification Progress</h3>
                <div className="space-y-3">
                  {verificationItems.map(item => {
                const Icon = item.icon;
                return <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.status === 'completed' ? 'bg-green-100' : item.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                            <Icon size={20} className={item.status === 'completed' ? 'text-green-600' : item.status === 'pending' ? 'text-yellow-600' : 'text-gray-500'} />
                          </div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                        {renderStatusBadge(item.status)}
                      </div>;
              })}
                </div>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Your account is verified</p>
                      <p className="text-xs text-blue-700 mt-1">
                        All required verification steps have been completed. Your account is secure and ready to use.
                      </p>
                    </div>
                  </div>
                </div>
              </div>}

            {/* Reviews Tab (Agent only) */}
            {activeTab === 'reviews' && userType === 'agent' && <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Reviews & Ratings</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-600">({totalReviews} reviews)</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {reviews.map(review => <div key={review.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{review.reviewer}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        {renderStarRating(review.rating)}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>)}
                </div>
              </div>}

            {/* Qualifications Tab (Agent only) */}
            {activeTab === 'qualifications' && userType === 'agent' && <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Qualification Levels</h3>
                <p className="text-gray-600 mb-6">
                  Complete requirements to increase your transfer limit and unlock higher levels.
                </p>
                <div className="space-y-4">
                  {qualificationLevels.map((level, index) => <div key={index} className={`p-5 rounded-lg border-2 ${level.status === 'completed' ? 'bg-green-50 border-green-200' : level.status === 'current' ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-bold text-gray-900">{level.level}</h4>
                            {renderStatusBadge(level.status)}
                          </div>
                          <p className="text-2xl font-bold text-blue-600">{level.limit}</p>
                          <p className="text-sm text-gray-600">Transfer limit per transaction</p>
                        </div>
                        {level.status === 'completed' && <CheckCircle2 className="w-8 h-8 text-green-600" />}
                      </div>
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                        <ul className="space-y-1">
                          {level.requirements.map((req, reqIndex) => <li key={reqIndex} className="text-sm text-gray-700 flex items-start gap-2">
                              {level.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-400 mt-0.5 shrink-0"></span>}
                              <span>{req}</span>
                            </li>)}
                        </ul>
                      </div>
                      {level.status === 'current' && <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                          {(index === 1 || index === 3) && <button onClick={() => setShowGuarantorModal(true)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm">
                              Add Guarantor
                            </button>}
                          {(index === 2 || index === 3 || index === 4) && <button onClick={() => setShowDocumentUpload(true)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium text-sm">
                              Upload Document
                            </button>}
                        </div>}
                    </div>)}
                </div>
              </div>}
          </div>
        </div>

        {/* Back Button */}
        {onBack && <button onClick={onBack} className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
            <X size={20} />
            Close Profile
          </button>}
      </div>

      {/* Guarantor Modal */}
      {showGuarantorModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Guarantor</h3>
              <button onClick={() => setShowGuarantorModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Your guarantor will receive a message to approve and agree to bear any liability for your transactions.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guarantor Name
                </label>
                <input type="text" value={guarantorName} onChange={e => setGuarantorName(e.target.value)} placeholder="Full name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guarantor Email
                </label>
                <input type="email" value={guarantorEmail} onChange={e => setGuarantorEmail(e.target.value)} placeholder="email@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guarantor Phone
                </label>
                <input type="tel" value={guarantorPhone} onChange={e => setGuarantorPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowGuarantorModal(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
                Cancel
              </button>
              <button onClick={handleGuarantorSubmit} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
                Send Request
              </button>
            </div>
          </div>
        </div>}

      {/* Document Upload Modal */}
      {showDocumentUpload && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Upload Legal Document</h3>
              <button onClick={() => setShowDocumentUpload(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Upload one of the following legal documents to proceed to the next level.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select value={selectedDocType} onChange={e => setSelectedDocType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select document type...</option>
                  <option value="property">Property Document</option>
                  <option value="car">Car Document</option>
                  <option value="marriage">Marriage Certificate</option>
                  <option value="police">Police Clearance Certificate</option>
                  <option value="school">School/University Certificate</option>
                  <option value="utility">Utility Bill</option>
                  <option value="business">Business Certificate</option>
                  <option value="ssn">Social Security / TIN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Document
                </label>
                <input type="file" onChange={e => setUploadedDocument(e.target.files?.[0] || null)} accept=".pdf,.jpg,.jpeg,.png" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                {uploadedDocument && <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 size={16} /> {uploadedDocument.name}
                  </p>}
                <p className="text-xs text-gray-500 mt-2">
                  Accepted formats: PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDocumentUpload(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
                Cancel
              </button>
              <button onClick={handleDocumentUpload} className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium">
                Upload
              </button>
            </div>
          </div>
        </div>}
    </div>;
}