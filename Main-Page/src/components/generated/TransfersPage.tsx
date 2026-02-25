import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Send, User, MapPin, ArrowRight, DollarSign, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export interface TransfersPageProps {
  onBack?: () => void;
  onViewTransfer?: (transferId: string) => void;
  onResumeTransfer?: (transfer: Transfer) => void;
}
interface Transfer {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recipientName: string;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  fromCountry: string;
  toCountry: string;
  fromFlag: string;
  toFlag: string;
  agentName: string;
  createdAt: Date;
  estimatedDelivery: string;
  paymentMethod: string;
}

// Mock data for ongoing and past transfers
const MOCK_TRANSFERS: Transfer[] = [{
  id: 'TXN-12345678',
  status: 'processing',
  recipientName: 'Jane Smith',
  sendAmount: 1000,
  sendCurrency: 'GHS',
  receiveAmount: 95,
  receiveCurrency: 'USD',
  fromCountry: 'Ghana',
  toCountry: 'United States',
  fromFlag: '🇬🇭',
  toFlag: '🇺🇸',
  agentName: 'Ankh',
  createdAt: new Date(Date.now() - 1000 * 60 * 15),
  // 15 minutes ago
  estimatedDelivery: '15-30 mins',
  paymentMethod: 'Mobile Money (MTN)'
}, {
  id: 'TXN-12345677',
  status: 'pending',
  recipientName: 'Michael Johnson',
  sendAmount: 500,
  sendCurrency: 'NGN',
  receiveAmount: 47.5,
  receiveCurrency: 'USD',
  fromCountry: 'Nigeria',
  toCountry: 'United States',
  fromFlag: '🇳🇬',
  toFlag: '🇺🇸',
  agentName: 'Okavango River',
  createdAt: new Date(Date.now() - 1000 * 60 * 30),
  // 30 minutes ago
  estimatedDelivery: '1-2 hours',
  paymentMethod: 'Bank Transfer'
}, {
  id: 'TXN-12345676',
  status: 'completed',
  recipientName: 'Sarah Williams',
  sendAmount: 2000,
  sendCurrency: 'GHS',
  receiveAmount: 190,
  receiveCurrency: 'USD',
  fromCountry: 'Ghana',
  toCountry: 'United States',
  fromFlag: '🇬🇭',
  toFlag: '🇺🇸',
  agentName: 'Shoebill',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  // 2 days ago
  estimatedDelivery: '15-30 mins',
  paymentMethod: 'Mobile Money (MTN)'
}, {
  id: 'TXN-12345675',
  status: 'completed',
  recipientName: 'David Brown',
  sendAmount: 750,
  sendCurrency: 'KES',
  receiveAmount: 65,
  receiveCurrency: 'USD',
  fromCountry: 'Kenya',
  toCountry: 'United States',
  fromFlag: '🇰🇪',
  toFlag: '🇺🇸',
  agentName: 'Gye Nyame',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  // 7 days ago
  estimatedDelivery: '30 mins',
  paymentMethod: 'M-Pesa'
}, {
  id: 'TXN-12345674',
  status: 'failed',
  recipientName: 'Emma Wilson',
  sendAmount: 1500,
  sendCurrency: 'GHS',
  receiveAmount: 142.5,
  receiveCurrency: 'USD',
  fromCountry: 'Ghana',
  toCountry: 'United States',
  fromFlag: '🇬🇭',
  toFlag: '🇺🇸',
  agentName: 'Orange River',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  // 14 days ago
  estimatedDelivery: '1 hour',
  paymentMethod: 'Bank Transfer'
}];
const getStatusColor = (status: Transfer['status']) => {
  switch (status) {
    case 'pending':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'processing':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};
const getStatusIcon = (status: Transfer['status']) => {
  switch (status) {
    case 'pending':
      return <Clock size={16} />;
    case 'processing':
      return <Clock size={16} className="animate-pulse" />;
    case 'completed':
      return <CheckCircle2 size={16} />;
    case 'failed':
      return <AlertCircle size={16} />;
    default:
      return <Clock size={16} />;
  }
};
const getStatusText = (status: Transfer['status']) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return 'Unknown';
  }
};
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};
export const TransfersPage: React.FC<TransfersPageProps> = ({
  onBack,
  onViewTransfer,
  onResumeTransfer
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter transfers based on status and search
  const filteredTransfers = MOCK_TRANSFERS.filter(transfer => {
    const matchesFilter = selectedFilter === 'all' || transfer.status === selectedFilter;
    const matchesSearch = searchQuery === '' || transfer.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) || transfer.id.toLowerCase().includes(searchQuery.toLowerCase()) || transfer.agentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Separate ongoing (pending/processing) and completed/failed transfers
  const ongoingTransfers = filteredTransfers.filter(t => t.status === 'pending' || t.status === 'processing');
  const pastTransfers = filteredTransfers.filter(t => t.status === 'completed' || t.status === 'failed');
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button onClick={onBack} className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4">
            <ArrowLeft size={20} />
            Back to home
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Transfers</h1>
              <p className="text-gray-600 mt-1">Track and manage your money transfers</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xs text-gray-600">Total Transfers</div>
                <div className="text-xl font-bold text-blue-600">{MOCK_TRANSFERS.length}</div>
              </div>
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-xs text-gray-600">Completed</div>
                <div className="text-xl font-bold text-green-600">
                  {MOCK_TRANSFERS.filter(t => t.status === 'completed').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by recipient, transaction ID, or agent..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'pending', 'processing', 'completed', 'failed'] as const).map(filter => <button key={filter} onClick={() => setSelectedFilter(filter)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {filter !== 'all' && <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                      {MOCK_TRANSFERS.filter(t => t.status === filter).length}
                    </span>}
                </button>)}
            </div>
          </div>
        </div>

        {/* Ongoing Transfers */}
        {ongoingTransfers.length > 0 && <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="text-blue-600" size={24} />
              Ongoing Transfers
            </h2>
            <div className="space-y-4">
              {ongoingTransfers.map(transfer => <motion.div key={transfer.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Transfer Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{transfer.recipientName}</h3>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${getStatusColor(transfer.status)}`}>
                              {getStatusIcon(transfer.status)}
                              {getStatusText(transfer.status)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">Transaction ID: {transfer.id}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Amount Details */}
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{transfer.fromFlag}</span>
                            <ArrowRight className="text-gray-400" size={16} />
                            <span className="text-2xl">{transfer.toFlag}</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-600">You sent</div>
                            <div className="font-bold text-gray-900">
                              {transfer.sendAmount.toLocaleString()} {transfer.sendCurrency}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              Recipient gets {transfer.receiveAmount.toLocaleString()} {transfer.receiveCurrency}
                            </div>
                          </div>
                        </div>

                        {/* Agent & Time Details */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User size={16} className="text-gray-400" />
                            <span className="text-gray-600">Agent:</span>
                            <span className="font-semibold text-gray-900">{transfer.agentName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock size={16} className="text-gray-400" />
                            <span className="text-gray-600">Started:</span>
                            <span className="font-semibold text-gray-900">{formatRelativeTime(transfer.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="text-gray-600">Delivery:</span>
                            <span className="font-semibold text-gray-900">{transfer.estimatedDelivery}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Button */}
                    <button onClick={() => onResumeTransfer?.(transfer)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2 sm:self-center">
                      View Details
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>)}
            </div>
          </div>}

        {/* Past Transfers */}
        {pastTransfers.length > 0 && <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-600" size={24} />
              Past Transfers
            </h2>
            <div className="space-y-3">
              {pastTransfers.map(transfer => <motion.div key={transfer.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Transfer Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{transfer.recipientName}</h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${getStatusColor(transfer.status)}`}>
                            {getStatusIcon(transfer.status)}
                            {getStatusText(transfer.status)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{formatRelativeTime(transfer.createdAt)}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{transfer.fromFlag}</span>
                          <span className="font-semibold text-gray-900">
                            {transfer.sendAmount.toLocaleString()} {transfer.sendCurrency}
                          </span>
                        </div>
                        <ArrowRight className="text-gray-400" size={16} />
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{transfer.toFlag}</span>
                          <span className="font-semibold text-blue-600">
                            {transfer.receiveAmount.toLocaleString()} {transfer.receiveCurrency}
                          </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">Agent: {transfer.agentName}</span>
                      </div>
                    </div>

                    {/* Right: Action Button */}
                    <button onClick={() => onViewTransfer?.(transfer.id)} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 sm:self-center">
                      View Receipt
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>)}
            </div>
          </div>}

        {/* Empty State */}
        {filteredTransfers.length === 0 && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No transfers found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search or filters' : 'You haven\'t made any transfers yet'}
            </p>
            <button onClick={onBack} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Start a Transfer
            </button>
          </div>}
      </div>
    </div>;
};