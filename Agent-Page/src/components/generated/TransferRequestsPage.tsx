"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { TrendingUp, Clock, CheckCircle2, XCircle, MessageCircle, Eye, DollarSign, ArrowUpRight, Home, BarChart3, Mail, User, LogOut, Power, AlertCircle, MapPin, Timer, Edit, X, Building2, Smartphone, Send, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReceiveMoneyFlow } from "./ReceiveMoneyFlow";
export interface TransferRequestsPageProps {
  agentName?: string;
  onLogout?: () => void;
  onBack?: () => void;
}
interface Order {
  id: string;
  type: 'incoming' | 'in-progress' | 'completed';
  sender: string;
  amount: number;
  currency: string;
  receiveCurrency: string;
  receiveAmount: number;
  fromCountry: string;
  toCountry: string;
  fromFlag: string;
  toFlag: string;
  status: 'pending' | 'accepted' | 'sending' | 'completed' | 'declined';
  expiresIn?: number; // seconds
  timestamp: Date;
  commission: number;
  receivePaymentMethod: string;
}

// Mock data generator
const generateMockOrders = (): Order[] => {
  const currencies = [{
    code: 'GHS',
    country: 'Ghana',
    flag: '🇬🇭',
    paymentMethod: 'MTN Mobile Money Ghana'
  }, {
    code: 'NGN',
    country: 'Nigeria',
    flag: '🇳🇬',
    paymentMethod: 'GTBank Nigeria'
  }, {
    code: 'KES',
    country: 'Kenya',
    flag: '🇰🇪',
    paymentMethod: 'M-Pesa Kenya'
  }, {
    code: 'USD',
    country: 'USA',
    flag: '🇺🇸',
    paymentMethod: 'CashApp'
  }, {
    code: 'GBP',
    country: 'UK',
    flag: '🇬🇧',
    paymentMethod: 'Barclays Bank UK'
  }, {
    code: 'EUR',
    country: 'Europe',
    flag: '🇪🇺',
    paymentMethod: 'Revolut Europe'
  }] as any[];
  const aliases = ['Baobab', 'Acacia', 'Marula', 'Lion', 'Elephant', 'Leopard', 'Cheetah', 'Rhino', 'Giraffe', 'Zebra', 'Adinkra', 'Sankofa', 'Ankh', 'Ubuntu', 'Simba'];
  const orders: Order[] = [];

  // Incoming orders (3)
  for (let i = 0; i < 3; i++) {
    const from = currencies[Math.floor(Math.random() * currencies.length)];
    let to = currencies[Math.floor(Math.random() * currencies.length)];
    while (to.code === from.code) {
      to = currencies[Math.floor(Math.random() * currencies.length)];
    }
    const sendAmount = Math.floor(Math.random() * 5000) + 500;
    const commissionRate = (Math.random() * 3 + 2) / 100; // 2-5%
    orders.push({
      id: `ORD-${Date.now()}-${i}`,
      type: 'incoming',
      sender: aliases[Math.floor(Math.random() * aliases.length)],
      amount: sendAmount,
      currency: from.code,
      receiveCurrency: to.code,
      receiveAmount: Math.floor(Math.random() * 4000) + 400,
      fromCountry: from.country,
      toCountry: to.country,
      fromFlag: from.flag,
      toFlag: to.flag,
      status: 'pending',
      expiresIn: Math.floor(Math.random() * 600) + 300,
      // 5-15 minutes
      timestamp: new Date(),
      commission: parseFloat((sendAmount * commissionRate).toFixed(2)),
      receivePaymentMethod: to.paymentMethod
    });
  }

  // In-progress orders (2)
  for (let i = 3; i < 5; i++) {
    const from = currencies[Math.floor(Math.random() * currencies.length)];
    let to = currencies[Math.floor(Math.random() * currencies.length)];
    while (to.code === from.code) {
      to = currencies[Math.floor(Math.random() * currencies.length)];
    }
    const sendAmount = Math.floor(Math.random() * 5000) + 500;
    const commissionRate = (Math.random() * 3 + 2) / 100; // 2-5%
    orders.push({
      id: `ORD-${Date.now()}-${i}`,
      type: 'in-progress',
      sender: aliases[Math.floor(Math.random() * aliases.length)],
      amount: sendAmount,
      currency: from.code,
      receiveCurrency: to.code,
      receiveAmount: Math.floor(Math.random() * 4000) + 400,
      fromCountry: from.country,
      toCountry: to.country,
      fromFlag: from.flag,
      toFlag: to.flag,
      status: 'sending',
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      // last hour
      commission: parseFloat((sendAmount * commissionRate).toFixed(2)),
      receivePaymentMethod: to.paymentMethod
    });
  }
  return orders;
};
export default function TransferRequestsPage({
  agentName = "Agent Name",
  onLogout,
  onBack
}: TransferRequestsPageProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'in-progress'>('all');
  const [orders, setOrders] = useState<Order[]>(generateMockOrders());
  const [mobileActiveNav, setMobileActiveNav] = useState<'dashboard' | 'stats' | 'inbox'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [makeOfferOrder, setMakeOfferOrder] = useState<Order | null>(null);
  const [offerExchangeRate, setOfferExchangeRate] = useState('');
  const [offerDeliveryTime, setOfferDeliveryTime] = useState('');
  const [offerPaymentMethod, setOfferPaymentMethod] = useState('');
  const [offerPayoutMethod, setOfferPayoutMethod] = useState('');
  const [showOfferSuccessNotification, setShowOfferSuccessNotification] = useState(false);

  // Custom payment method management
  const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] = useState(false);
  const [customPaymentMethods, setCustomPaymentMethods] = useState<Array<{
    id: string;
    country: string;
    type: 'bank' | 'mobile-money' | 'mobile-money-request' | 'fintech';
    name: string;
    accountDetails: string;
    additionalInfo?: string;
  }>>([]);
  const [newPaymentCountry, setNewPaymentCountry] = useState('');
  const [newPaymentType, setNewPaymentType] = useState<'bank' | 'mobile-money' | 'mobile-money-request' | 'fintech'>('bank');
  const [newPaymentName, setNewPaymentName] = useState('');
  const [newPaymentAccount, setNewPaymentAccount] = useState('');
  const [newPaymentAdditionalInfo, setNewPaymentAdditionalInfo] = useState('');

  // Stats
  const [stats, setStats] = useState({
    earningsToday: 245.50,
    monthlyVolume: 12450.00,
    liveTransfers: 2
  });

  // Countdown timer for expiring orders
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => prevOrders.map(order => {
        if (order.expiresIn && order.expiresIn > 0) {
          return {
            ...order,
            expiresIn: order.expiresIn - 1
          };
        }
        return order;
      }).filter(order => !order.expiresIn || order.expiresIn > 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate new orders coming in
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance every 10 seconds
        const newOrders = generateMockOrders().filter(o => o.type === 'incoming').slice(0, 1);
        setOrders(prev => [...newOrders, ...prev]);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  const handleAccept = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
  };
  const handleMakeOffer = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setMakeOfferOrder(order);
      // Pre-fill with current values
      setOfferExchangeRate((order.receiveAmount / order.amount).toFixed(4));
      setOfferDeliveryTime('5-15 minutes');
      setOfferPaymentMethod(getAgentPaymentMethodsForCountry(order.fromCountry)[0]);
      setOfferPayoutMethod(getAgentPaymentMethodsForCountry(order.toCountry)[0]);
    }
  };
  const handleSubmitOffer = () => {
    if (makeOfferOrder) {
      // Create a counter offer (in real app, this would be sent to the sender)
      console.log('Counter offer submitted:', {
        orderId: makeOfferOrder.id,
        exchangeRate: offerExchangeRate,
        deliveryTime: offerDeliveryTime,
        paymentMethod: offerPaymentMethod,
        payoutMethod: offerPayoutMethod
      });
      // Close modal
      setMakeOfferOrder(null);
      // Show success notification
      setShowOfferSuccessNotification(true);
      // Auto-hide notification after 4 seconds
      setTimeout(() => {
        setShowOfferSuccessNotification(false);
      }, 4000);
    }
  };
  const handleCloseMakeOffer = () => {
    setMakeOfferOrder(null);
    setOfferExchangeRate('');
    setOfferDeliveryTime('');
    setOfferPaymentMethod('');
    setOfferPayoutMethod('');
  };
  const handleOpenAddPaymentMethod = () => {
    if (makeOfferOrder) {
      setNewPaymentCountry(makeOfferOrder.toCountry);
    }
    setShowAddPaymentMethodModal(true);
  };
  const handleCloseAddPaymentMethod = () => {
    setShowAddPaymentMethodModal(false);
    setNewPaymentType('bank');
    setNewPaymentName('');
    setNewPaymentAccount('');
    setNewPaymentAdditionalInfo('');
  };
  const handleSaveNewPaymentMethod = () => {
    if (!newPaymentName || !newPaymentAccount) {
      alert('Please fill in all required fields');
      return;
    }
    const newMethod = {
      id: `custom-${Date.now()}`,
      country: newPaymentCountry,
      type: newPaymentType,
      name: newPaymentName,
      accountDetails: newPaymentAccount,
      additionalInfo: newPaymentAdditionalInfo
    };
    setCustomPaymentMethods(prev => [...prev, newMethod]);
    // Auto-select the newly added payment method
    setOfferPaymentMethod(newMethod.name);
    // Close the modal
    handleCloseAddPaymentMethod();
    // In a real app, this would sync to the backend and update "Your Accounts" section
    console.log('New payment method added and would sync to My Business Page:', newMethod);
  };
  const handlePaymentMethodChange = (value: string) => {
    if (value === 'ADD_NEW') {
      handleOpenAddPaymentMethod();
    } else {
      setOfferPaymentMethod(value);
    }
  };
  const handleCompleteTransfer = () => {
    if (selectedOrder) {
      setOrders(prevOrders => prevOrders.map(order => order.id === selectedOrder.id ? {
        ...order,
        status: 'completed',
        type: 'completed',
        expiresIn: undefined
      } : order));
      setStats(prev => ({
        ...prev,
        earningsToday: prev.earningsToday + selectedOrder.commission,
        liveTransfers: prev.liveTransfers > 0 ? prev.liveTransfers - 1 : 0
      }));
      setSelectedOrder(null);
    }
  };
  const handleBackFromFlow = () => {
    setSelectedOrder(null);
  };
  const handleDecline = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'new') return order.type === 'incoming';
    if (activeTab === 'in-progress') return order.type === 'in-progress';
    return true;
  });
  const getAgentPaymentMethodsForCountry = (country: string): string[] => {
    const countryPaymentMethods: Record<string, string[]> = {
      'United States': ['Stanbic Bank USA', 'CashApp', 'Venmo', 'Zelle'],
      'USA': ['Stanbic Bank USA', 'CashApp', 'Venmo', 'Zelle'],
      'Canada': ['Royal Bank of Canada', 'Interac', 'TD Canada Trust'],
      'United Kingdom': ['Barclays Bank', 'HSBC UK', 'PayPal'],
      'UK': ['Barclays Bank', 'HSBC UK', 'PayPal'],
      'Nigeria': ['GTBank Nigeria', 'Access Bank', 'MTN Mobile Money Nigeria'],
      'Kenya': ['M-Pesa Kenya', 'Equity Bank Kenya', 'KCB Bank Kenya'],
      'Ghana': ['MTN Mobile Money Ghana', 'Vodafone Cash Ghana', 'Ecobank Ghana'],
      'Default': ['Stanbic Bank', 'Equity Bank', 'MTN Mobile Money']
    };
    const defaultMethods = countryPaymentMethods[country] || countryPaymentMethods['Default'];
    const customMethods = customPaymentMethods.filter(method => method.country === country).map(method => method.name);
    return [...defaultMethods, ...customMethods];
  };

  // Check if the selected payment type is a "Request Payment" type
  const isRequestPaymentType = newPaymentType === 'mobile-money-request';

  // If an order is selected, show the ReceiveMoneyFlow
  if (selectedOrder) {
    const transferData = {
      id: selectedOrder.id,
      fromCountry: selectedOrder.fromCountry,
      toCountry: selectedOrder.toCountry,
      fromFlag: selectedOrder.fromFlag,
      toFlag: selectedOrder.toFlag,
      fromCurrency: selectedOrder.currency,
      toCurrency: selectedOrder.receiveCurrency,
      senderName: selectedOrder.sender,
      recipientPaymentMethod: selectedOrder.receivePaymentMethod,
      recipientAccountDetails: '+254712345678',
      // Mock data
      sendAmount: selectedOrder.amount.toFixed(2),
      receiveAmount: selectedOrder.receiveAmount.toFixed(2),
      exchangeRate: selectedOrder.receiveAmount / selectedOrder.amount,
      fee: `$${(selectedOrder.amount * 0.02).toFixed(2)}`,
      deliveryTime: '5-15 minutes'
    };
    return <ReceiveMoneyFlow transfer={transferData} onComplete={handleCompleteTransfer} onBack={handleBackFromFlow} />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Navigation Bar */}
      {/* Empty header removed */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button onClick={() => setActiveTab('all')} className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
                All Transactions
                <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs">
                  {orders.length}
                </span>
              </button>
              <button onClick={() => setActiveTab('new')} className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'new' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
                New Requests
                <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                  {orders.filter(o => o.type === 'incoming').length}
                </span>
              </button>
              <button onClick={() => setActiveTab('in-progress')} className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'in-progress' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
                In Progress
                <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                  {orders.filter(o => o.type === 'in-progress').length}
                </span>
              </button>
            </nav>
          </div>

          {/* Orders Feed */}
          <div className="p-4 sm:p-6">
            <AnimatePresence mode="popLayout">
              {filteredOrders.length === 0 ? <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No {activeTab === 'new' ? 'new requests' : activeTab === 'in-progress' ? 'active transfers' : 'transactions'} yet
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isOnline ? "You'll see orders here when customers request transfers" : "Turn online to start receiving transfer requests"}
                  </p>
                </motion.div> : <div className="space-y-3">
                  {filteredOrders.map((order, index) => <motion.div key={order.id} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                x: -100
              }} transition={{
                delay: index * 0.1
              }} className={`bg-gradient-to-r ${order.type === 'incoming' ? 'from-orange-50 to-white border-orange-200' : 'from-blue-50 to-white border-blue-200'} rounded-xl border p-2 sm:p-3 hover:shadow-lg transition-shadow`}>
                      {/* Order Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {order.sender.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{order.sender}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                              <span className="flex items-center gap-1">
                                <span>{order.fromFlag}</span>
                                <span>{order.fromCountry}</span>
                              </span>
                              <span>→</span>
                              <span className="flex items-center gap-1">
                                <span>{order.toFlag}</span>
                                <span>{order.toCountry}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expires In Badge for Incoming Orders */}
                        {order.type === 'incoming' && order.expiresIn !== undefined && <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${order.expiresIn < 120 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'} text-xs font-semibold`}>
                            <Timer size={12} />
                            <span>{formatTime(order.expiresIn)}</span>
                          </div>}

                        {/* Status Badge for In-Progress */}
                        {order.type === 'in-progress' && <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold">
                            <Clock size={12} />
                            <span>Processing</span>
                          </div>}
                      </div>

                      {/* Transfer Details */}
                      <div className="grid grid-cols-2 gap-3 mb-2 bg-white rounded-lg p-2 border border-gray-100">
                        <div>
                          <div className="text-xs text-gray-600 mb-0.5">Send Amount</div>
                          <div className="font-bold text-gray-900 text-sm">
                            {order.amount.toLocaleString()} {order.currency}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-0.5">Receive Amount</div>
                          <div className="font-bold text-blue-600 text-sm">
                            {order.receiveAmount.toLocaleString()} {order.receiveCurrency}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-0.5">Send Via</div>
                          <div className="text-xs font-semibold text-gray-900">{order.receivePaymentMethod}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-0.5">Your Commission</div>
                          <div className="text-xs font-semibold text-green-600">
                            ${order.commission.toFixed(2)} ({(order.commission / order.amount * 100).toFixed(1)}%)
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {order.type === 'incoming' && <div className="flex gap-2">
                          <button onClick={() => handleAccept(order.id)} className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-green-600/30 text-sm">
                            <CheckCircle2 size={16} />
                            Accept
                          </button>
                          <button onClick={() => handleMakeOffer(order.id)} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 text-sm">
                            <Edit size={16} />
                            Make Counter-Offer
                          </button>
                          <button onClick={() => handleDecline(order.id)} className="flex-1 bg-white border-2 border-red-300 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-50 transition-all flex items-center justify-center gap-1.5 text-sm">
                            <XCircle size={16} />
                            Decline
                          </button>
                        </div>}

                      {order.type === 'in-progress' && <div className="flex gap-2">
                          <button className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 text-sm">
                            <MessageCircle size={16} />
                            Chat
                          </button>
                          <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 text-sm">
                            <Eye size={16} />
                            Details
                          </button>
                        </div>}
                    </motion.div>)}
                </div>}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Success Notification for Counter-Offer */}
      <AnimatePresence>
        {showOfferSuccessNotification && <motion.div initial={{
        opacity: 0,
        y: -50,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: -50,
        scale: 0.95
      }} className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] max-w-md w-full mx-4">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-green-500 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="text-green-600" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-base">Counter-Offer Sent!</h4>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Your counter-offer has been sent to the sender
                  </p>
                </div>
                <button onClick={() => setShowOfferSuccessNotification(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* Make Offer Modal */}
      <AnimatePresence>
        {makeOfferOrder && <>
            {/* Backdrop */}
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={handleCloseMakeOffer} />
            
            {/* Modal */}
            <motion.div initial={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:w-full z-50 max-h-[90vh] overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Edit className="text-blue-600" size={20} />
                      Make Counter Offer
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">Edit the deal terms and send to {makeOfferOrder.sender}</p>
                  </div>
                  <button onClick={handleCloseMakeOffer} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors">
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-4 sm:p-6">
                  {/* Original Deal Summary */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Original Deal</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Send Amount:</span>
                        <span className="font-semibold text-gray-900 ml-1">
                          {makeOfferOrder.amount.toLocaleString()} {makeOfferOrder.currency}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Receive Amount:</span>
                        <span className="font-semibold text-gray-900 ml-1">
                          {makeOfferOrder.receiveAmount.toLocaleString()} {makeOfferOrder.receiveCurrency}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Rate:</span>
                        <span className="font-semibold text-gray-900 ml-1">
                          {(makeOfferOrder.receiveAmount / makeOfferOrder.amount).toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Commission:</span>
                        <span className="font-semibold text-green-600 ml-1">
                          ${makeOfferOrder.commission.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Edit Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Exchange Rate *
                      </label>
                      <input type="number" step="0.0001" value={offerExchangeRate} onChange={e => setOfferExchangeRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., 1.2345" />
                      <p className="text-xs text-gray-500 mt-1">
                        Rate: 1 {makeOfferOrder.currency} = {offerExchangeRate || '...'} {makeOfferOrder.receiveCurrency}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Delivery Time *
                      </label>
                      <select value={offerDeliveryTime} onChange={e => setOfferDeliveryTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                        <option value="">Select delivery time</option>
                        <option value="1-5 minutes">1-5 minutes</option>
                        <option value="5-15 minutes">5-15 minutes</option>
                        <option value="15-30 minutes">15-30 minutes</option>
                        <option value="30-60 minutes">30-60 minutes</option>
                        <option value="1-2 hours">1-2 hours</option>
                        <option value="2-4 hours">2-4 hours</option>
                        <option value="4-24 hours">4-24 hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Sender Payment Method *
                      </label>
                      <select value={offerPaymentMethod} onChange={e => handlePaymentMethodChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                        <option value="">Select payment method</option>
                        {getAgentPaymentMethodsForCountry(makeOfferOrder.fromCountry).map(method => <option key={method} value={method}>{method}</option>)}
                        <option value="ADD_NEW" className="font-semibold text-blue-600">+ Add New Payment Method</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Payment method in {makeOfferOrder.fromCountry} (where sender will send money from)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Recipient Abroad Payout Method *
                      </label>
                      <select value={offerPayoutMethod} onChange={e => setOfferPayoutMethod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                        <option value="">Select payout method</option>
                        {getAgentPaymentMethodsForCountry(makeOfferOrder.toCountry).map(method => <option key={method} value={method}>{method}</option>)}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Payment method you'll use to send {makeOfferOrder.receiveCurrency} to recipient in {makeOfferOrder.toCountry}
                      </p>
                    </div>
                  </div>

                  {/* Calculated New Values */}
                  {offerExchangeRate && parseFloat(offerExchangeRate) > 0 && <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Your Counter Offer</h4>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Sender pays:</span>
                          <span className="font-bold text-blue-900">
                            {makeOfferOrder.amount.toLocaleString()} {makeOfferOrder.currency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Recipient receives:</span>
                          <span className="font-bold text-blue-900">
                            {(makeOfferOrder.amount * parseFloat(offerExchangeRate)).toFixed(2)} {makeOfferOrder.receiveCurrency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Exchange Rate:</span>
                          <span className="font-bold text-blue-900">{offerExchangeRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Delivery Time:</span>
                          <span className="font-bold text-blue-900">{offerDeliveryTime || 'Not set'}</span>
                        </div>
                      </div>
                    </div>}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button onClick={handleCloseMakeOffer} className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Cancel
                    </button>
                    <button onClick={handleSubmitOffer} disabled={!offerExchangeRate || !offerDeliveryTime || !offerPaymentMethod || !offerPayoutMethod || parseFloat(offerExchangeRate) <= 0} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 text-sm flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} />
                      Send Offer to {makeOfferOrder.sender}
                    </button>
                  </div>

                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                    <p className="text-xs text-amber-800">
                      <strong>Note:</strong> Your counter offer will be sent to {makeOfferOrder.sender}. They can accept, decline, or make another counter offer.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>}
      </AnimatePresence>

      {/* Add New Payment Method Modal */}
      <AnimatePresence>
        {showAddPaymentMethodModal && <>
            {/* Backdrop */}
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={handleCloseAddPaymentMethod} />
            
            {/* Modal */}
            <motion.div initial={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:w-full z-50 max-h-[90vh] overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <CreditCard className="text-green-600" size={20} />
                      Add New Payment Method
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">Add your payment account for {newPaymentCountry}</p>
                  </div>
                  <button onClick={handleCloseAddPaymentMethod} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors">
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Payment Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method Type *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setNewPaymentType('bank')} className={`p-3 rounded-lg border-2 transition-all text-left ${newPaymentType === 'bank' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                          <Building2 className={`mb-1 ${newPaymentType === 'bank' ? 'text-blue-600' : 'text-gray-400'}`} size={20} />
                          <div className="text-sm font-semibold text-gray-900">Bank Account</div>
                        </button>
                        <button type="button" onClick={() => setNewPaymentType('mobile-money')} className={`p-3 rounded-lg border-2 transition-all text-left ${newPaymentType === 'mobile-money' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                          <Smartphone className={`mb-1 ${newPaymentType === 'mobile-money' ? 'text-blue-600' : 'text-gray-400'}`} size={20} />
                          <div className="text-sm font-semibold text-gray-900">Mobile Money</div>
                        </button>
                        <button type="button" onClick={() => setNewPaymentType('mobile-money-request')} className={`p-3 rounded-lg border-2 transition-all text-left ${newPaymentType === 'mobile-money-request' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                          <Send className={`mb-1 ${newPaymentType === 'mobile-money-request' ? 'text-blue-600' : 'text-gray-400'}`} size={20} />
                          <div className="text-sm font-semibold text-gray-900">Mobile Money - Request Payment</div>
                        </button>
                        <button type="button" onClick={() => setNewPaymentType('fintech')} className={`p-3 rounded-lg border-2 transition-all text-left ${newPaymentType === 'fintech' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                          <DollarSign className={`mb-1 ${newPaymentType === 'fintech' ? 'text-blue-600' : 'text-gray-400'}`} size={20} />
                          <div className="text-sm font-semibold text-gray-900">Fintech App</div>
                        </button>
                      </div>
                    </div>

                    {/* Show info box for Request Payment types */}
                    {isRequestPaymentType && <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-blue-900 mb-2">
                              💡 Request For Payment Option
                            </p>
                            <p className="text-sm text-blue-900">
                              This payment method means the sender will send their mobile money number or fintech ID, 
                              and you (the agent) will send them a payment request to approve. This is useful for 
                              services like Mobile Money in Ghana, Kenya, Uganda, Wise, Revolut, Cash App, Venmo, and Zelle 
                              where you can request payments directly from senders.
                            </p>
                          </div>
                        </div>
                      </div>}

                    {/* Payment Name/Provider */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {newPaymentType === 'bank' ? 'Bank Name' : newPaymentType === 'mobile-money' ? 'Payment Provider Name' : newPaymentType === 'mobile-money-request' ? 'Payment Provider Name' : 'Fintech App Name'} *
                      </label>
                      <input type="text" value={newPaymentName} onChange={e => setNewPaymentName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder={newPaymentType === 'bank' ? 'e.g., Chase Bank' : newPaymentType === 'mobile-money' || newPaymentType === 'mobile-money-request' ? 'e.g., M-Pesa' : 'e.g., CashApp'} />
                    </div>

                    {/* Account Details */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {newPaymentType === 'bank' ? 'Account Number' : newPaymentType === 'mobile-money' || newPaymentType === 'mobile-money-request' ? 'Mobile Number' : 'Account ID / Username'} *
                      </label>
                      <input type="text" value={newPaymentAccount} onChange={e => setNewPaymentAccount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder={newPaymentType === 'bank' ? 'e.g., 1234567890' : newPaymentType === 'mobile-money' || newPaymentType === 'mobile-money-request' ? 'e.g., +254712345678' : 'e.g., $username or ID'} />
                    </div>

                    {/* Additional Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Additional Details (Optional)
                      </label>
                      <textarea value={newPaymentAdditionalInfo} onChange={e => setNewPaymentAdditionalInfo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" rows={3} placeholder={newPaymentType === 'bank' ? 'e.g., Account holder name, branch, SWIFT code' : newPaymentType === 'mobile-money-request' ? 'e.g., Request payment instructions' : 'Any additional information about this payment method'} />
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-xs text-blue-700">
                          This payment method will be saved to your "Your Accounts" section on the My Business Page and can be used for future transfers to {newPaymentCountry}.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button onClick={handleCloseAddPaymentMethod} className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Cancel
                    </button>
                    <button onClick={handleSaveNewPaymentMethod} disabled={!newPaymentName || !newPaymentAccount} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg shadow-green-600/30 text-sm flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} />
                      Save Payment Method
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => setMobileActiveNav('dashboard')} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${mobileActiveNav === 'dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
            <Home size={24} />
            <span className="text-xs font-semibold">Dashboard</span>
          </button>
          <button onClick={() => setMobileActiveNav('stats')} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${mobileActiveNav === 'stats' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
            <BarChart3 size={24} />
            <span className="text-xs font-semibold">Stats</span>
          </button>
          <button onClick={() => setMobileActiveNav('inbox')} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors relative ${mobileActiveNav === 'inbox' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
            <Mail size={24} />
            {orders.filter(o => o.type === 'incoming').length > 0 && <span className="absolute top-0 right-2 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {orders.filter(o => o.type === 'incoming').length}
              </span>}
            <span className="text-xs font-semibold">Inbox</span>
          </button>
        </div>
      </nav>
    </div>;
}