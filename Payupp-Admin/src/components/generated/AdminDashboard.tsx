import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Activity, CreditCard, Smartphone, Zap, Globe, ArrowRight, CheckCircle2, UserCheck, FileText, AlertCircle, Send, Clock, ArrowUpRight, ArrowDownRight, MapPin, Calendar, Filter, Download, RefreshCw, AlertTriangle, XCircle, ChevronDown, ChevronUp, Ban, Scale, Eye, Calculator, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlatformFeeSchedule } from './PlatformFeeSchedule';
export interface AdminDashboardProps {
  onBack?: () => void;
}

// Mock data
interface ActivityEvent {
  id: string;
  type: 'transfer' | 'kyc' | 'agent';
  title: string;
  description: string;
  timestamp: Date;
  amount?: string;
  status: 'success' | 'pending' | 'warning';
}
interface Dispute {
  id: string;
  transactionId: string;
  userName: string;
  agentName: string;
  amount: string;
  currency: string;
  reason: string;
  status: 'investigating' | 'pending_review' | 'escalated';
  openedDate: Date;
  priority: 'high' | 'medium' | 'low';
}
interface BannedUser {
  id: string;
  name: string;
  email: string;
  userType: 'user' | 'agent';
  reason: string;
  bannedDate: Date;
  bannedBy: string;
  permanentBan: boolean;
}
interface PendingRequest {
  id: string;
  sendCountry: string;
  sendCountryFlag: string;
  receiveCountry: string;
  receiveCountryFlag: string;
  amount: number;
  currency: string;
  senderPhone: string;
  senderEmail: string;
  requestDate: Date;
  urgency: 'high' | 'medium' | 'low';
}

// Financial overview data
interface CountryVolume {
  country: string;
  flag: string;
  volume: number;
  transactions: number;
  change: number;
}
interface Corridor {
  from: string;
  to: string;
  fromFlag: string;
  toFlag: string;
  volume: number;
  transactions: number;
}
interface TimeMetric {
  period: string;
  volume: number;
  transactions: number;
  fees: number;
}
export default function AdminDashboard({
  onBack
}: AdminDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('today');
  const [liveActivities, setLiveActivities] = useState<ActivityEvent[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showDisputesExpanded, setShowDisputesExpanded] = useState(false);
  const [showBannedUsersExpanded, setShowBannedUsersExpanded] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'fees'>('dashboard');
  const [viewedContactInfo, setViewedContactInfo] = useState<Set<string>>(new Set());

  // Financial overview data
  const financialOverview = {
    totalSent: 18472938.20,
    totalUsers: 45238,
    revenue: 234872.45,
    netProfit: 156234.80,
    totalAgents: 892,
    agentEarnings: 78638.65,
    cardFees: 45234.20,
    momoFees: 98456.30,
    apiFees: 91181.95
  };

  // Top countries by volume
  const topCountries: CountryVolume[] = [{
    country: 'Ghana',
    flag: '🇬🇭',
    volume: 487293.50,
    transactions: 3421,
    change: 12.5
  }, {
    country: 'Nigeria',
    flag: '🇳🇬',
    volume: 423847.20,
    transactions: 2893,
    change: 8.3
  }, {
    country: 'Kenya',
    flag: '🇰🇪',
    volume: 298473.40,
    transactions: 2156,
    change: -3.2
  }, {
    country: 'United States',
    flag: '🇺🇸',
    volume: 287493.10,
    transactions: 1842,
    change: 15.7
  }, {
    country: 'South Africa',
    flag: '🇿🇦',
    volume: 198234.80,
    transactions: 1534,
    change: 5.4
  }];

  // Most popular corridors
  const popularCorridors: Corridor[] = [{
    from: 'Ghana',
    to: 'USA',
    fromFlag: '🇬🇭',
    toFlag: '🇺🇸',
    volume: 342847.30,
    transactions: 2134
  }, {
    from: 'Nigeria',
    to: 'UK',
    fromFlag: '🇳🇬',
    toFlag: '🇬🇧',
    volume: 298473.20,
    transactions: 1893
  }, {
    from: 'Kenya',
    to: 'USA',
    fromFlag: '🇰🇪',
    toFlag: '🇺🇸',
    volume: 234829.50,
    transactions: 1567
  }, {
    from: 'Ghana',
    to: 'UK',
    fromFlag: '🇬🇭',
    toFlag: '🇬🇧',
    volume: 198234.70,
    transactions: 1342
  }, {
    from: 'South Africa',
    to: 'Australia',
    fromFlag: '🇿🇦',
    toFlag: '🇦🇺',
    volume: 167293.40,
    transactions: 987
  }];

  // Time-based performance
  const timeMetrics: TimeMetric[] = [{
    period: 'Today',
    volume: 87293.50,
    transactions: 142,
    fees: 1247.82
  }, {
    period: 'Past Week',
    volume: 542847.30,
    transactions: 847,
    fees: 7823.45
  }, {
    period: 'Past Month',
    volume: 1847293.50,
    transactions: 3421,
    fees: 23847.29
  }, {
    period: 'Past Quarter',
    volume: 5234829.70,
    transactions: 9842,
    fees: 68234.87
  }, {
    period: 'Past Year',
    volume: 18472938.20,
    transactions: 38472,
    fees: 234872.45
  }];

  // Mock disputes data
  const ongoingDisputes: Dispute[] = [{
    id: 'DSP-001',
    transactionId: 'TXN-847293',
    userName: 'John Doe',
    agentName: 'Global Express Ltd.',
    amount: '1,000',
    currency: 'GHS',
    reason: 'Payment not received by recipient',
    status: 'escalated',
    openedDate: new Date(Date.now() - 86400000 * 2),
    priority: 'high'
  }, {
    id: 'DSP-002',
    transactionId: 'TXN-847185',
    userName: 'Sarah Mitchell',
    agentName: 'SwiftPay Connect',
    amount: '500',
    currency: 'USD',
    reason: 'Incorrect exchange rate applied',
    status: 'investigating',
    openedDate: new Date(Date.now() - 43200000),
    priority: 'medium'
  }, {
    id: 'DSP-003',
    transactionId: 'TXN-846973',
    userName: 'Michael Chen',
    agentName: 'East Africa Direct',
    amount: '2,500',
    currency: 'KES',
    reason: 'Agent unresponsive after payment',
    status: 'pending_review',
    openedDate: new Date(Date.now() - 172800000),
    priority: 'high'
  }, {
    id: 'DSP-004',
    transactionId: 'TXN-846821',
    userName: 'Emma Wilson',
    agentName: 'Euro Connect Plus',
    amount: '750',
    currency: 'EUR',
    reason: 'Delayed delivery beyond promised time',
    status: 'investigating',
    openedDate: new Date(Date.now() - 21600000),
    priority: 'low'
  }];

  // Mock banned users data
  const bannedUsers: BannedUser[] = [{
    id: 'BAN-001',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    userType: 'agent',
    reason: 'Multiple complaints of fraud and non-delivery',
    bannedDate: new Date(Date.now() - 604800000),
    bannedBy: 'Admin Team',
    permanentBan: true
  }, {
    id: 'BAN-002',
    name: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    userType: 'user',
    reason: 'Repeated chargebacks and policy violations',
    bannedDate: new Date(Date.now() - 259200000),
    bannedBy: 'Compliance Officer',
    permanentBan: false
  }, {
    id: 'BAN-003',
    name: 'David Park',
    email: 'david.p@example.com',
    userType: 'agent',
    reason: 'Money laundering suspicion and AML violation',
    bannedDate: new Date(Date.now() - 1209600000),
    bannedBy: 'Legal Team',
    permanentBan: true
  }, {
    id: 'BAN-004',
    name: 'Jennifer Lee',
    email: 'jennifer.l@example.com',
    userType: 'user',
    reason: 'Identity verification fraud attempt',
    bannedDate: new Date(Date.now() - 432000000),
    bannedBy: 'KYC Team',
    permanentBan: true
  }, {
    id: 'BAN-005',
    name: 'Thomas White',
    email: 'thomas.w@example.com',
    userType: 'agent',
    reason: 'Systematic overcharging and fee manipulation',
    bannedDate: new Date(Date.now() - 86400000),
    bannedBy: 'Admin Team',
    permanentBan: false
  }];

  // Mock pending requests data (transfers with no agents)
  const pendingRequests: PendingRequest[] = [{
    id: 'PND-001',
    sendCountry: 'Ghana',
    sendCountryFlag: '🇬🇭',
    receiveCountry: 'United States',
    receiveCountryFlag: '🇺🇸',
    amount: 5000,
    currency: 'GHS',
    senderPhone: '+233 24 123 4567',
    senderEmail: 'kwame.mensah@example.com',
    requestDate: new Date(Date.now() - 3600000),
    urgency: 'high'
  }, {
    id: 'PND-002',
    sendCountry: 'Nigeria',
    sendCountryFlag: '🇳🇬',
    receiveCountry: 'United Kingdom',
    receiveCountryFlag: '🇬🇧',
    amount: 250000,
    currency: 'NGN',
    senderPhone: '+234 81 987 6543',
    senderEmail: 'adebayo.okon@example.com',
    requestDate: new Date(Date.now() - 7200000),
    urgency: 'medium'
  }, {
    id: 'PND-003',
    sendCountry: 'Kenya',
    sendCountryFlag: '🇰🇪',
    receiveCountry: 'Canada',
    receiveCountryFlag: '🇨🇦',
    amount: 150000,
    currency: 'KES',
    senderPhone: '+254 70 555 1234',
    senderEmail: 'njeri.kamau@example.com',
    requestDate: new Date(Date.now() - 10800000),
    urgency: 'high'
  }, {
    id: 'PND-004',
    sendCountry: 'South Africa',
    sendCountryFlag: '🇿🇦',
    receiveCountry: 'Australia',
    receiveCountryFlag: '🇦🇺',
    amount: 15000,
    currency: 'ZAR',
    senderPhone: '+27 82 123 9876',
    senderEmail: 'thabo.dlamini@example.com',
    requestDate: new Date(Date.now() - 14400000),
    urgency: 'low'
  }, {
    id: 'PND-005',
    sendCountry: 'Uganda',
    sendCountryFlag: '🇺🇬',
    receiveCountry: 'United States',
    receiveCountryFlag: '🇺🇸',
    amount: 2500000,
    currency: 'UGX',
    senderPhone: '+256 77 888 5432',
    senderEmail: 'sarah.nabwire@example.com',
    requestDate: new Date(Date.now() - 18000000),
    urgency: 'medium'
  }];

  // Generate mock live activities
  useEffect(() => {
    const initialActivities: ActivityEvent[] = [{
      id: '1',
      type: 'transfer',
      title: 'New Transfer Started',
      description: 'GHS 1,000 → USD by Global Express Ltd.',
      timestamp: new Date(Date.now() - 2000),
      amount: '$95.00',
      status: 'success'
    }, {
      id: '2',
      type: 'kyc',
      title: 'KYC Verified',
      description: 'John Doe completed Level 2 verification',
      timestamp: new Date(Date.now() - 45000),
      status: 'success'
    }, {
      id: '3',
      type: 'agent',
      title: 'Agent Application Received',
      description: 'New agent application from Lagos, Nigeria',
      timestamp: new Date(Date.now() - 120000),
      status: 'pending'
    }, {
      id: '4',
      type: 'transfer',
      title: 'Transfer Completed',
      description: 'KES 100,000 → CAD by East Africa Direct',
      timestamp: new Date(Date.now() - 180000),
      amount: '$950.00',
      status: 'success'
    }, {
      id: '5',
      type: 'kyc',
      title: 'Document Upload',
      description: 'Sarah M. uploaded proof of address',
      timestamp: new Date(Date.now() - 300000),
      status: 'pending'
    }];
    setLiveActivities(initialActivities);
  }, []);

  // Auto-refresh live activities
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      const newActivity: ActivityEvent = {
        id: Date.now().toString(),
        type: ['transfer', 'kyc', 'agent'][Math.floor(Math.random() * 3)] as any,
        title: ['New Transfer Started', 'Transfer Completed', 'KYC Verified', 'Agent Application Received', 'Document Upload', 'Payment Confirmed'][Math.floor(Math.random() * 6)],
        description: ['GHS 1,500 → USD by SwiftPay Connect', 'NGN 50,000 → EUR by Euro Connect Plus', 'Michael T. completed Level 3 verification', 'New agent from Accra, Ghana', 'Emma L. uploaded bank statement'][Math.floor(Math.random() * 5)],
        timestamp: new Date(),
        amount: Math.random() > 0.5 ? `$${(Math.random() * 1000).toFixed(2)}` : undefined,
        status: ['success', 'pending'][Math.floor(Math.random() * 2)] as any
      };
      setLiveActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh]);
  const toggleContactInfo = (requestId: string) => {
    setViewedContactInfo(prev => {
      const newSet = new Set(prev);
      if (newSet.has(requestId)) {
        newSet.delete(requestId);
      } else {
        newSet.add(requestId);
      }
      return newSet;
    });
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  const getRelativeTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // If viewing fee schedule, render that component
  if (currentView === 'fees') {
    return <PlatformFeeSchedule onBack={() => setCurrentView('dashboard')} />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">PayUpp Platform Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('fees')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm">
                <Calculator size={16} />
                <span className="hidden sm:inline">Fee Schedule</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button onClick={() => setAutoRefresh(!autoRefresh)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${autoRefresh ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                <RefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Live</span>
              </button>
              <button
                onClick={() => window.dispatchEvent(new Event('payupp-admin-logout'))}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Financial Overview Cards */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="text-blue-600" size={20} />
            Financial Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Total Sent */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Send className="text-blue-600" size={24} />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  12.5%
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Total Sent (USD)</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialOverview.totalSent)}</p>
            </motion.div>

            {/* Total Users */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.1
          }} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="text-green-600" size={24} />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  8.3%
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(financialOverview.totalUsers)}</p>
            </motion.div>

            {/* Revenue */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  15.7%
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialOverview.revenue)}</p>
            </motion.div>

            {/* Net Profit */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-5 text-white hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
                <span className="text-xs font-medium text-white/90 flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  18.2%
                </span>
              </div>
              <h3 className="text-sm text-white/90 mb-1">Net Profit</h3>
              <p className="text-2xl font-bold text-white">{formatCurrency(financialOverview.netProfit)}</p>
            </motion.div>

            {/* Total Agents */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <UserCheck className="text-orange-600" size={24} />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  6.8%
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Total Agents</h3>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(financialOverview.totalAgents)}</p>
            </motion.div>

            {/* Agent Earnings */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5
          }} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-teal-600" size={24} />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  22.4%
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">Agent Earnings</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialOverview.agentEarnings)}</p>
            </motion.div>
          </div>

          {/* Fee Breakdown */}
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="text-blue-600" size={18} />
              Total Fees Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Card Fees</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(financialOverview.cardFees)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Mobile Money Fees</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(financialOverview.momoFees)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">API Fees</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(financialOverview.apiFees)}</span>
              </div>
            </div>
          </div>

          {/* Pending Requests - Transfers with no agents */}
          <div className="mt-4 bg-white rounded-xl border border-orange-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="text-orange-600" size={18} />
                Pending Requests
                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                  {pendingRequests.length} Need Attention
                </span>
              </h3>
              <p className="text-xs text-gray-500">Transfers waiting for agent assignment</p>
            </div>
            <div className="space-y-3">
              {pendingRequests.map((request, index) => <motion.div key={request.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }} className="p-4 bg-orange-50/50 border border-orange-100 rounded-lg hover:bg-orange-50 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${request.urgency === 'high' ? 'bg-red-100' : request.urgency === 'medium' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                          <AlertCircle className={request.urgency === 'high' ? 'text-red-600' : request.urgency === 'medium' ? 'text-orange-600' : 'text-yellow-600'} size={16} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{request.sendCountryFlag}</span>
                          <ArrowRight className="text-gray-400" size={16} />
                          <span className="text-2xl">{request.receiveCountryFlag}</span>
                          <div className="ml-2">
                            <p className="font-semibold text-gray-900 text-sm">
                              {request.sendCountry} → {request.receiveCountry}
                            </p>
                            <p className="text-xs text-gray-500">{request.id}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-11 space-y-2">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Amount</p>
                            <p className="text-sm font-bold text-gray-900">
                              {formatNumber(request.amount)} {request.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Requested</p>
                            <p className="text-sm text-gray-700 flex items-center gap-1">
                              <Clock size={12} />
                              {getRelativeTime(request.requestDate)}
                            </p>
                          </div>
                        </div>
                        
                        {viewedContactInfo.has(request.id) && <motion.div initial={{
                      opacity: 0,
                      height: 0
                    }} animate={{
                      opacity: 1,
                      height: 'auto'
                    }} exit={{
                      opacity: 0,
                      height: 0
                    }} className="pt-2 border-t border-orange-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="bg-white p-2 rounded border border-orange-100">
                                <p className="text-xs text-gray-600 mb-0.5">Phone Number</p>
                                <p className="text-sm font-medium text-gray-900">{request.senderPhone}</p>
                              </div>
                              <div className="bg-white p-2 rounded border border-orange-100">
                                <p className="text-xs text-gray-600 mb-0.5">Email Address</p>
                                <p className="text-sm font-medium text-gray-900">{request.senderEmail}</p>
                              </div>
                            </div>
                          </motion.div>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleContactInfo(request.id)} className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1">
                        <Eye size={12} />
                        {viewedContactInfo.has(request.id) ? 'Hide' : 'View'}
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all flex items-center gap-1 shadow-sm">
                        <Bell size={12} />
                        Notify Sender
                      </button>
                    </div>
                  </div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Volume Analysis & Corridors */}
        <section className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Top Countries */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="text-blue-600" size={20} />
              Top Countries by Volume
            </h2>
            <div className="space-y-3">
              {topCountries.map((country, index) => <motion.div key={country.country} initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: index * 0.1
            }} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{country.country}</p>
                      <p className="text-xs text-gray-600">{formatNumber(country.transactions)} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(country.volume)}</p>
                    <p className={`text-xs font-medium flex items-center gap-1 justify-end ${country.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {country.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(country.change)}%
                    </p>
                  </div>
                </motion.div>)}
            </div>
          </div>

          {/* Most Popular Corridors */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="text-blue-600" size={20} />
              Most Popular Corridors
            </h2>
            <div className="space-y-3">
              {popularCorridors.map((corridor, index) => <motion.div key={`${corridor.from}-${corridor.to}`} initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: index * 0.1
            }} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xl">{corridor.fromFlag}</span>
                      <ArrowRight className="text-gray-400" size={16} />
                      <span className="text-xl">{corridor.toFlag}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{corridor.from} → {corridor.to}</p>
                      <p className="text-xs text-gray-600">{formatNumber(corridor.transactions)} transfers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">{formatCurrency(corridor.volume)}</p>
                  </div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Time-Based Performance */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Time-Based Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {timeMetrics.map((metric, index) => <motion.div key={metric.period} initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: index * 0.1
          }} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">{metric.period}</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Volume</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(metric.volume)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transactions</p>
                    <p className="text-sm font-semibold text-blue-600">{formatNumber(metric.transactions)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fees Collected</p>
                    <p className="text-sm font-semibold text-green-600">{formatCurrency(metric.fees)}</p>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </section>

        {/* Live Activity Feed */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="text-blue-600" size={20} />
              Live Activity Feed
              {autoRefresh && <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                  Live
                </span>}
            </h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <AnimatePresence>
                {liveActivities.map(activity => <motion.div key={activity.id} initial={{
                opacity: 0,
                y: -20
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                x: -100
              }} className="flex items-start gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-all">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${activity.type === 'transfer' ? 'bg-blue-100' : activity.type === 'kyc' ? 'bg-green-100' : 'bg-purple-100'}`}>
                      {activity.type === 'transfer' && <Send className="text-blue-600" size={18} />}
                      {activity.type === 'kyc' && <UserCheck className="text-green-600" size={18} />}
                      {activity.type === 'agent' && <FileText className="text-purple-600" size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-gray-900 text-sm">{activity.title}</p>
                        {activity.amount && <span className="text-sm font-bold text-blue-600 whitespace-nowrap">{activity.amount}</span>}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {getRelativeTime(activity.timestamp)}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${activity.status === 'success' ? 'bg-green-100 text-green-700' : activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {activity.status === 'success' && <CheckCircle2 size={10} className="inline mr-1" />}
                          {activity.status === 'pending' && <Clock size={10} className="inline mr-1" />}
                          {activity.status === 'warning' && <AlertCircle size={10} className="inline mr-1" />}
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </motion.div>)}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Ongoing Disputes & Banned Users */}
        <section className="mt-6 grid lg:grid-cols-2 gap-6">
          {/* Ongoing Disputes */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={() => setShowDisputesExpanded(!showDisputesExpanded)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Scale className="text-orange-600" size={20} />
                Ongoing Disputes
                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                  {ongoingDisputes.length}
                </span>
              </h2>
              {showDisputesExpanded ? <ChevronUp className="text-gray-400" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
            </button>
            
            <AnimatePresence>
              {showDisputesExpanded && <motion.div initial={{
              height: 0,
              opacity: 0
            }} animate={{
              height: 'auto',
              opacity: 1
            }} exit={{
              height: 0,
              opacity: 0
            }} transition={{
              duration: 0.3
            }} className="overflow-hidden">
                  <div className="max-h-96 overflow-y-auto border-t border-gray-200">
                    {ongoingDisputes.map((dispute, index) => <motion.div key={dispute.id} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: index * 0.1
                }} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dispute.priority === 'high' ? 'bg-red-100' : dispute.priority === 'medium' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                              <AlertTriangle className={dispute.priority === 'high' ? 'text-red-600' : dispute.priority === 'medium' ? 'text-orange-600' : 'text-yellow-600'} size={16} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{dispute.id}</p>
                              <p className="text-xs text-gray-500">{dispute.transactionId}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${dispute.status === 'escalated' ? 'bg-red-100 text-red-700' : dispute.status === 'investigating' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {dispute.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="ml-10">
                          <p className="text-sm text-gray-700 mb-1">
                            <span className="font-medium">{dispute.userName}</span> vs <span className="font-medium">{dispute.agentName}</span>
                          </p>
                          <p className="text-sm text-gray-600 mb-2">{dispute.reason}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock size={12} />
                              {getRelativeTime(dispute.openedDate)}
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                              {dispute.amount} {dispute.currency}
                            </span>
                          </div>
                          <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            <Eye size={12} />
                            View Details
                          </button>
                        </div>
                      </motion.div>)}
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>

          {/* Banned Users List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={() => setShowBannedUsersExpanded(!showBannedUsersExpanded)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Ban className="text-red-600" size={20} />
                Banned Users
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  {bannedUsers.length}
                </span>
              </h2>
              {showBannedUsersExpanded ? <ChevronUp className="text-gray-400" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
            </button>
            
            <AnimatePresence>
              {showBannedUsersExpanded && <motion.div initial={{
              height: 0,
              opacity: 0
            }} animate={{
              height: 'auto',
              opacity: 1
            }} exit={{
              height: 0,
              opacity: 0
            }} transition={{
              duration: 0.3
            }} className="overflow-hidden">
                  <div className="max-h-96 overflow-y-auto border-t border-gray-200">
                    {bannedUsers.map((user, index) => <motion.div key={user.id} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: index * 0.1
                }} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                            <XCircle className="text-red-600" size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${user.userType === 'agent' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {user.userType}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{user.reason}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock size={12} />
                                  {getRelativeTime(user.bannedDate)}
                                </span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.permanentBan ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                  {user.permanentBan ? 'Permanent' : 'Temporary'}
                                </span>
                              </div>
                              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                <Eye size={12} />
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>)}
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>;
}