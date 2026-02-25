"use client";

import * as React from "react";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Shield, CheckCircle2, XCircle, Clock, Star, TrendingUp, Award, FileText, Upload, AlertCircle, DollarSign, Users, Building2, X, ChevronRight, BadgeCheck, Edit2, Camera, Package, Activity } from "lucide-react";
import SearchableCountryDropdown from "./SearchableCountryDropdown";
import DynamicAccountForm from "./DynamicAccountForm";
import { getCountryByName, COUNTRIES, CountryConfig } from "./CountryData";
export interface AgentProfilePageProps {
  agentData?: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    joinedDate?: string;
    avatar?: string;
    agentId?: string;
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
interface Transaction {
  id: string;
  date: string;
  sender: string;
  recipient: string;
  amount: string;
  currency: string;
  status: 'completed' | 'pending' | 'cancelled';
  commission: string;
  sendingCountry?: string;
  receivingCountry?: string;
}
export default function AgentProfilePage({
  agentData = {
    name: 'Jane Smith',
    email: 'jane.smith@agent.com',
    phone: '+254 712 345 678',
    location: 'Nairobi, Kenya',
    joinedDate: 'November 2023',
    avatar: undefined,
    agentId: 'AGT-2024-001'
  },
  onBack
}: AgentProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'verification' | 'reviews' | 'qualifications' | 'transactions'>('overview');
  const [showGuarantorModal, setShowGuarantorModal] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [currentQualificationLevel, setCurrentQualificationLevel] = useState(1);
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorEmail, setGuarantorEmail] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [selectedDocType, setSelectedDocType] = useState('');

  // Currency rates state
  interface CurrencyRate {
    id: string;
    fromCurrency: string;
    toCurrency: string;
    baseAmount: number;
    exchangeAmount: number;
    officialRate: number;
    tiers?: Array<{
      minAmount: number;
      maxAmount: number | null;
      exchangeRate: number;
      profitPercent: number;
    }>;
  }
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([{
    id: '1',
    fromCurrency: 'USD',
    toCurrency: 'KES',
    baseAmount: 1,
    exchangeAmount: 146.28,
    // 1.5% below official rate of 148.5
    officialRate: 148.5
  }, {
    id: '2',
    fromCurrency: 'GBP',
    toCurrency: 'KES',
    baseAmount: 1,
    exchangeAmount: 185.48,
    // 1.5% below official rate of 188.2
    officialRate: 188.2
  }]);
  const [showAddRateModal, setShowAddRateModal] = useState(false);
  const [editingRate, setEditingRate] = useState<CurrencyRate | null>(null);
  const [newRate, setNewRate] = useState({
    fromCurrency: 'USD',
    toCurrency: 'KES',
    baseAmount: 1,
    exchangeAmount: 0
  });

  // Add state for tiered pricing and input mode
  const [rateInputMode, setRateInputMode] = useState<'amount' | 'percent'>('percent');
  const [profitPercent, setProfitPercent] = useState(1.5);
  const [useTieredPricing, setUseTieredPricing] = useState(false);
  const [rateTiers, setRateTiers] = useState<Array<{
    minAmount: number;
    maxAmount: number | null;
    exchangeRate: number;
    profitPercent: number;
  }>>([{
    minAmount: 0,
    maxAmount: 100,
    exchangeRate: 0,
    profitPercent: 2.0
  }, {
    minAmount: 100,
    maxAmount: 1000,
    exchangeRate: 0,
    profitPercent: 1.5
  }, {
    minAmount: 1000,
    maxAmount: 10000,
    exchangeRate: 0,
    profitPercent: 1.2
  }, {
    minAmount: 10000,
    maxAmount: null,
    exchangeRate: 0,
    profitPercent: 1.0
  }]);

  // Account details state for receiving and sending
  interface ReceivingAccount {
    id: string;
    country: string;
    accountType: string;
    details: string;
  }
  interface SendingCountry {
    id: string;
    country: string;
    paymentMethods: Array<{
      type: string;
      details: string;
    }>;
  }
  const [receivingAccounts, setReceivingAccounts] = useState<ReceivingAccount[]>([{
    id: '1',
    country: 'United States',
    accountType: 'Bank Account',
    details: 'Chase Bank - Account ending in 1234'
  }, {
    id: '2',
    country: 'United Kingdom',
    accountType: 'Fintech',
    details: 'Revolut - Email: jane@example.com'
  }]);
  const [sendingCountries, setSendingCountries] = useState<SendingCountry[]>([{
    id: '1',
    country: 'Kenya',
    paymentMethods: [{
      type: 'M-Pesa',
      details: 'Phone Number: +254 712 345 678 | Account Name: Jane Smith'
    }, {
      type: 'Bank Account',
      details: 'Account Name: Jane Smith | Account Number: 1234567890 | Bank Name: Equity Bank'
    }]
  }, {
    id: '2',
    country: 'Nigeria',
    paymentMethods: [{
      type: 'Bank Account',
      details: 'Account Name: Jane Smith | Account Number: 0987654321 | Bank Name: GTBank'
    }, {
      type: 'Flutterwave',
      details: 'Email: jane@example.com'
    }]
  }]);
  const [showAddReceivingAccount, setShowAddReceivingAccount] = useState(false);
  const [showAddSendingCountry, setShowAddSendingCountry] = useState(false);
  const [newReceivingAccount, setNewReceivingAccount] = useState({
    country: '',
    accountType: '',
    details: ''
  });
  const [newSendingCountry, setNewSendingCountry] = useState({
    country: '',
    paymentMethods: [] as Array<{
      type: string;
      details: string;
    }>
  });
  const [currentSendingPaymentMethod, setCurrentSendingPaymentMethod] = useState({
    type: '',
    details: ''
  });
  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);

  // Add state for available cash modal
  const [showAddCashModal, setShowAddCashModal] = useState(false);
  const [newCashEntry, setNewCashEntry] = useState({
    country: '',
    currency: '',
    amount: ''
  });

  // Add state for storing available cash entries
  const [availableCashEntries, setAvailableCashEntries] = useState<Array<{
    id: string;
    country: string;
    currency: string;
    amount: string;
  }>>([{
    id: '1',
    country: 'United States',
    currency: 'USD',
    amount: '22000'
  }, {
    id: '2',
    country: 'Nigeria',
    currency: 'NGN',
    amount: '2000000'
  }, {
    id: '3',
    country: 'Kenya',
    currency: 'KES',
    amount: '450000'
  }]);

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
    status: 'completed',
    icon: Users
  }];

  // Sample reviews (for agents)
  const reviews: Review[] = [{
    id: '1',
    rating: 5,
    comment: 'Excellent agent! Very fast and reliable service. Funds received within minutes.',
    date: '2 days ago',
    reviewer: 'Michael T.'
  }, {
    id: '2',
    rating: 5,
    comment: 'Professional and trustworthy. Made the transfer process smooth and easy.',
    date: '5 days ago',
    reviewer: 'Sarah K.'
  }, {
    id: '3',
    rating: 5,
    comment: 'Best agent I\'ve worked with! Great communication and quick delivery.',
    date: '1 week ago',
    reviewer: 'David M.'
  }, {
    id: '4',
    rating: 4,
    comment: 'Good service overall. Had a minor delay but agent was very communicative.',
    date: '2 weeks ago',
    reviewer: 'Emma L.'
  }, {
    id: '5',
    rating: 5,
    comment: 'Highly recommended! Will definitely use again for future transfers.',
    date: '3 weeks ago',
    reviewer: 'James R.'
  }];
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  // Qualification levels for agents
  const qualificationLevels: QualificationLevel[] = [{
    level: 'Level 1',
    limit: '$100',
    requirements: ['Complete KYC verification', 'Verify email and phone'],
    status: currentQualificationLevel >= 0 ? 'completed' : 'current'
  }, {
    level: 'Level 2',
    limit: '$1,000',
    requirements: ['Complete first transfer under $100', 'Social Verification (compulsory)', 'Add a guarantor (who agrees to bear liability)'],
    status: currentQualificationLevel >= 1 ? 'completed' : currentQualificationLevel === 0 ? 'current' : 'locked'
  }, {
    level: 'Level 3',
    limit: '$10,000',
    requirements: ['Upload legal document (any of the following):', '• Property Document', '• Car Document', '• Marriage Certificate', '• Police Clearance Certificate', '• School/University Certificate', '• Utility Bill', '• Business Registration Document', '• Tax Bills', '• Insurance Documents', '• Tenancy Agreements or Rent Receipts', '• Government Correspondence'],
    status: currentQualificationLevel >= 2 ? 'completed' : currentQualificationLevel === 1 ? 'current' : 'locked'
  }, {
    level: 'Level 4',
    limit: '$100,000',
    requirements: ['Upload another legal document (different from Level 3)', 'Add a second guarantor'],
    status: currentQualificationLevel >= 3 ? 'completed' : currentQualificationLevel === 2 ? 'current' : 'locked'
  }, {
    level: 'Level 5',
    limit: '$1,000,000',
    requirements: ['Business only - Upload Business Certificate or Registration Documents', 'Provide Social Security or TIN'],
    status: currentQualificationLevel >= 4 ? 'completed' : currentQualificationLevel === 3 ? 'current' : 'locked'
  }];

  // Sample transaction history
  const transactions: Transaction[] = [{
    id: 'TXN-12345',
    date: '2024-01-15',
    sender: 'Michael T.',
    recipient: 'John K.',
    amount: '500.00',
    currency: 'USD',
    status: 'completed',
    commission: '12.50',
    sendingCountry: 'United States',
    receivingCountry: 'Kenya'
  }, {
    id: 'TXN-12344',
    date: '2024-01-14',
    sender: 'Sarah M.',
    recipient: 'Mary A.',
    amount: '250.00',
    currency: 'USD',
    status: 'completed',
    commission: '5.75',
    sendingCountry: 'United Kingdom',
    receivingCountry: 'Nigeria'
  }, {
    id: 'TXN-12343',
    date: '2024-01-13',
    sender: 'David L.',
    recipient: 'Peter N.',
    amount: '1,200.00',
    currency: 'USD',
    status: 'completed',
    commission: '27.60',
    sendingCountry: 'United States',
    receivingCountry: 'Ghana'
  }, {
    id: 'TXN-12342',
    date: '2024-01-12',
    sender: 'Emma R.',
    recipient: 'Grace W.',
    amount: '750.00',
    currency: 'USD',
    status: 'completed',
    commission: '17.25',
    sendingCountry: 'Canada',
    receivingCountry: 'Kenya'
  }, {
    id: 'TXN-12341',
    date: '2024-01-11',
    sender: 'James P.',
    recipient: 'Lucy O.',
    amount: '950.00',
    currency: 'USD',
    status: 'completed',
    commission: '21.85',
    sendingCountry: 'United States',
    receivingCountry: 'Uganda'
  }];

  // Calculate stats
  const totalTransfers = transactions.length;
  const totalEarnings = transactions.reduce((sum, t) => sum + parseFloat(t.commission), 0).toFixed(2);
  const totalVolume = transactions.reduce((sum, t) => sum + parseFloat(t.amount.replace(/,/g, '')), 0).toLocaleString();

  // Calculate additional business metrics
  const averageTransactionSize = transactions.length > 0 ? (transactions.reduce((sum, t) => sum + parseFloat(t.amount.replace(/,/g, '')), 0) / transactions.length).toFixed(2) : '0.00';
  const biggestCommission = transactions.length > 0 ? Math.max(...transactions.map(t => parseFloat(t.commission))).toFixed(2) : '0.00';
  const smallestCommission = transactions.length > 0 ? Math.min(...transactions.map(t => parseFloat(t.commission))).toFixed(2) : '0.00';

  // Calculate corridor statistics (using currency rates as proxy for corridors)
  const corridorStats = currencyRates.reduce((acc, rate) => {
    const corridor = `${rate.fromCurrency}-${rate.toCurrency}`;
    acc[corridor] = (acc[corridor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostPopularCorridor = Object.keys(corridorStats).length > 0 ? Object.entries(corridorStats).sort(([, a], [, b]) => b - a)[0][0].replace('-', ' → ') : 'N/A';

  // For most profitable corridor, we'll use the one with highest average commission
  const mostProfitableCorridor = currencyRates.length > 0 ? `${currencyRates[0].fromCurrency} → ${currencyRates[0].toCurrency}` : 'N/A';
  const averageTransactionTime = '2.5 hours'; // Mock data
  const completedTransactionsPercent = transactions.length > 0 ? (transactions.filter(t => t.status === 'completed').length / transactions.length * 100).toFixed(1) : '0.0';

  // Currency rate handlers
  const handleAddRate = () => {
    setEditingRate(null);
    const defaultExchange = getDefaultRate('USD', 'KES', 1);
    setNewRate({
      fromCurrency: 'USD',
      toCurrency: 'KES',
      baseAmount: 1,
      exchangeAmount: parseFloat(defaultExchange.toFixed(2))
    });
    setRateInputMode('percent');
    setProfitPercent(1.5);
    setUseTieredPricing(false);
    setRateTiers([{
      minAmount: 0,
      maxAmount: 100,
      exchangeRate: 0,
      profitPercent: 2.0
    }, {
      minAmount: 100,
      maxAmount: 1000,
      exchangeRate: 0,
      profitPercent: 1.5
    }, {
      minAmount: 1000,
      maxAmount: 10000,
      exchangeRate: 0,
      profitPercent: 1.2
    }, {
      minAmount: 10000,
      maxAmount: null,
      exchangeRate: 0,
      profitPercent: 1.0
    }]);
    setShowAddRateModal(true);
  };
  const handleEditRate = (rate: CurrencyRate) => {
    setEditingRate(rate);
    setNewRate({
      fromCurrency: rate.fromCurrency,
      toCurrency: rate.toCurrency,
      baseAmount: rate.baseAmount,
      exchangeAmount: rate.exchangeAmount
    });

    // Check if rate has tiers
    if (rate.tiers && rate.tiers.length > 0) {
      setUseTieredPricing(true);
      setRateTiers(rate.tiers);
      setRateInputMode('percent');
    } else {
      setUseTieredPricing(false);
      // Calculate profit percent from rate
      const officialRate = rate.officialRate || getOfficialRate(rate.fromCurrency, rate.toCurrency);
      const yourRate = rate.exchangeAmount / rate.baseAmount;
      const calculatedProfitPercent = (officialRate - yourRate) / officialRate * 100;
      setProfitPercent(calculatedProfitPercent > 0 ? calculatedProfitPercent : 1.5);
      setRateInputMode('amount');
    }
    setShowAddRateModal(true);
  };
  const handleSaveRate = () => {
    const officialRate = getOfficialRate(newRate.fromCurrency, newRate.toCurrency);
    if (useTieredPricing) {
      const validTiers = rateTiers.filter(tier => {
        const rate = tier.profitPercent > 0 ? officialRate * (1 - tier.profitPercent / 100) : tier.exchangeRate;
        return rate > 0 && rate < officialRate;
      });
      if (validTiers.length === 0) {
        alert('Please set valid rates for at least one tier. All rates must be lower than the official rate.');
        return;
      }
      const processedTiers = rateTiers.map(tier => ({
        ...tier,
        exchangeRate: tier.profitPercent > 0 ? officialRate * (1 - tier.profitPercent / 100) : tier.exchangeRate
      }));
      if (editingRate) {
        setCurrencyRates(rates => rates.map(r => r.id === editingRate.id ? {
          ...r,
          fromCurrency: newRate.fromCurrency,
          toCurrency: newRate.toCurrency,
          baseAmount: 1,
          exchangeAmount: processedTiers[0].exchangeRate,
          officialRate: officialRate,
          tiers: processedTiers
        } : r));
      } else {
        const rate: CurrencyRate = {
          id: Date.now().toString(),
          fromCurrency: newRate.fromCurrency,
          toCurrency: newRate.toCurrency,
          baseAmount: 1,
          exchangeAmount: processedTiers[0].exchangeRate,
          officialRate: officialRate,
          tiers: processedTiers
        };
        setCurrencyRates(rates => [...rates, rate]);
        // Auto-add countries to Available Cash and Your Accounts
        autoAddCountriesFromRate(rate);
      }
    } else {
      let yourRatePerUnit: number;
      if (rateInputMode === 'percent') {
        if (profitPercent <= 0 || profitPercent >= 100) {
          alert('Please enter a valid profit percentage between 0 and 100');
          return;
        }
        yourRatePerUnit = officialRate * (1 - profitPercent / 100);
        setNewRate({
          ...newRate,
          exchangeAmount: yourRatePerUnit * newRate.baseAmount
        });
      } else {
        if (!newRate.exchangeAmount || newRate.exchangeAmount <= 0) {
          alert('Please enter a valid exchange amount');
          return;
        }
        yourRatePerUnit = newRate.exchangeAmount / newRate.baseAmount;
      }
      if (yourRatePerUnit >= officialRate) {
        alert(`Your rate must be lower than the official rate of ${officialRate.toFixed(2)} ${newRate.toCurrency} per ${newRate.fromCurrency}`);
        return;
      }
      const finalExchangeAmount = rateInputMode === 'percent' ? yourRatePerUnit * newRate.baseAmount : newRate.exchangeAmount;
      if (editingRate) {
        setCurrencyRates(rates => rates.map(r => r.id === editingRate.id ? {
          ...r,
          fromCurrency: newRate.fromCurrency,
          toCurrency: newRate.toCurrency,
          baseAmount: newRate.baseAmount,
          exchangeAmount: finalExchangeAmount,
          officialRate: officialRate,
          tiers: undefined
        } : r));
      } else {
        const rate: CurrencyRate = {
          id: Date.now().toString(),
          fromCurrency: newRate.fromCurrency,
          toCurrency: newRate.toCurrency,
          baseAmount: newRate.baseAmount,
          exchangeAmount: finalExchangeAmount,
          officialRate: officialRate
        };
        setCurrencyRates(rates => [...rates, rate]);
        // Auto-add countries to Available Cash and Your Accounts
        autoAddCountriesFromRate(rate);
      }
    }
    setShowAddRateModal(false);
    setEditingRate(null);
  };

  // Auto-add countries to Available Cash and Your Accounts when adding a currency route
  const autoAddCountriesFromRate = (rate: CurrencyRate) => {
    // Get country info from currency codes
    const fromCountryInfo = getCurrencyCountry(rate.fromCurrency);
    const toCountryInfo = getCurrencyCountry(rate.toCurrency);

    // Add to Available Cash if not already present
    if (fromCountryInfo) {
      const existingCash = availableCashEntries.find(e => e.country === fromCountryInfo.name);
      if (!existingCash) {
        const newCash = {
          id: Date.now().toString() + '-from',
          country: fromCountryInfo.name,
          currency: rate.fromCurrency,
          amount: '0'
        };
        setAvailableCashEntries(entries => [...entries, newCash]);
      }
    }
    if (toCountryInfo) {
      const existingCash = availableCashEntries.find(e => e.country === toCountryInfo.name);
      if (!existingCash) {
        const newCash = {
          id: Date.now().toString() + '-to',
          country: toCountryInfo.name,
          currency: rate.toCurrency,
          amount: '0'
        };
        setAvailableCashEntries(entries => [...entries, newCash]);
      }
    }

    // Add to Your Accounts - fromCurrency country goes to receivingAccounts
    if (fromCountryInfo) {
      const existingReceiving = receivingAccounts.find(a => a.country === fromCountryInfo.name);
      if (!existingReceiving) {
        const defaultAccountType = Object.keys(fromCountryInfo.paymentMethods)[0] || 'Bank Account';
        const newAccount: ReceivingAccount = {
          id: Date.now().toString() + '-recv',
          country: fromCountryInfo.name,
          accountType: defaultAccountType,
          details: 'Please add your account details'
        };
        setReceivingAccounts(accounts => [...accounts, newAccount]);
      }
    }

    // Add to Your Accounts - toCurrency country goes to sendingCountries
    if (toCountryInfo) {
      const existingSending = sendingCountries.find(c => c.country === toCountryInfo.name);
      if (!existingSending) {
        const defaultAccountType = Object.keys(toCountryInfo.paymentMethods)[0] || 'Bank Account';
        const newCountry: SendingCountry = {
          id: Date.now().toString() + '-send',
          country: toCountryInfo.name,
          paymentMethods: [{
            type: defaultAccountType,
            details: 'Please add your account details'
          }]
        };
        setSendingCountries(countries => [...countries, newCountry]);
      }
    }
  };

  // Helper function to get country from currency code
  const getCurrencyCountry = (currencyCode: string): CountryConfig | undefined => {
    // Import at the top of the file already has getCountryByName
    // We need to find country by currency code instead
    return COUNTRIES.find(c => c.currency === currencyCode);
  };
  const handleDeleteRate = (id: string) => {
    if (confirm('Are you sure you want to delete this currency route?')) {
      setCurrencyRates(rates => rates.filter(r => r.id !== id));
    }
  };

  // Handlers for receiving accounts and sending countries
  const handleAddReceivingAccount = () => {
    if (!newReceivingAccount.country || !newReceivingAccount.accountType || !newReceivingAccount.details) {
      alert('Please fill in all account details');
      return;
    }
    const account: ReceivingAccount = {
      id: Date.now().toString(),
      country: newReceivingAccount.country,
      accountType: newReceivingAccount.accountType,
      details: newReceivingAccount.details
    };
    setReceivingAccounts(accounts => [...accounts, account]);
    setShowAddReceivingAccount(false);
    setNewReceivingAccount({
      country: '',
      accountType: '',
      details: ''
    });
  };
  const handleAddSendingCountry = () => {
    if (!newSendingCountry.country || newSendingCountry.paymentMethods.length === 0) {
      alert('Please select a country and add at least one payment method with account details');
      return;
    }
    const country: SendingCountry = {
      id: Date.now().toString(),
      country: newSendingCountry.country,
      paymentMethods: newSendingCountry.paymentMethods
    };
    setSendingCountries(countries => [...countries, country]);
    setShowAddSendingCountry(false);
    setNewSendingCountry({
      country: '',
      paymentMethods: []
    });
    setCurrentSendingPaymentMethod({
      type: '',
      details: ''
    });
    setIsAddingPaymentMethod(false);
  };
  const handleAddCash = () => {
    if (!newCashEntry.country || !newCashEntry.currency || !newCashEntry.amount) {
      alert('Please fill in all fields');
      return;
    }
    // Add the cash entry to the list
    const cashEntry = {
      id: Date.now().toString(),
      country: newCashEntry.country,
      currency: newCashEntry.currency,
      amount: newCashEntry.amount
    };
    setAvailableCashEntries(entries => [...entries, cashEntry]);
    setShowAddCashModal(false);
    setNewCashEntry({
      country: '',
      currency: '',
      amount: ''
    });
  };

  // Mock official exchange rate fetcher
  const getOfficialRate = (from: string, to: string): number => {
    // Comprehensive exchange rate data (rates as of 2024, against USD as base)
    const ratesAgainstUSD: Record<string, number> = {
      // Major World Currencies
      'USD': 1,
      'EUR': 0.92,
      'GBP': 0.79,
      'JPY': 149.50,
      'CHF': 0.88,
      'CAD': 1.36,
      'AUD': 1.53,
      'NZD': 1.64,
      'CNY': 7.24,
      'INR': 83.12,
      'SGD': 1.34,
      'HKD': 7.83,
      'SEK': 10.52,
      'NOK': 10.88,
      'DKK': 6.89,
      'KRW': 1320.45,
      'MXN': 17.15,
      'BRL': 4.98,
      'ARS': 350.50,
      'RUB': 92.50,
      'TRY': 32.15,
      'SAR': 3.75,
      'AED': 3.67,
      'THB': 35.80,
      'MYR': 4.72,
      'IDR': 15680.00,
      'PHP': 56.25,
      'PLN': 3.98,
      'CZK': 22.85,
      'HUF': 354.20,
      'ILS': 3.72,
      // African Currencies
      'ZAR': 18.75,
      'NGN': 780.20,
      'EGP': 30.90,
      'KES': 148.50,
      'GHS': 12.80,
      'MAD': 9.95,
      'TND': 3.12,
      'UGX': 3725.00,
      'TZS': 2515.00,
      'ETB': 56.75,
      'XOF': 604.50,
      'XAF': 604.50,
      'AOA': 830.50,
      'BWP': 13.55,
      'BIF': 2845.00,
      'CVE': 101.60,
      'KMF': 453.25,
      'CDF': 2785.00,
      'DJF': 177.72,
      'ERN': 15.00,
      'SZL': 18.75,
      'GMD': 67.50,
      'GNF': 8600.00,
      'LSL': 18.75,
      'LRD': 190.50,
      'LYD': 4.82,
      'MGA': 4515.00,
      'MWK': 1730.00,
      'MRU': 39.85,
      'MUR': 45.75,
      'MZN': 63.90,
      'NAD': 18.75,
      'RWF': 1305.00,
      'STN': 22.60,
      'SCR': 13.65,
      'SLL': 19750.00,
      'SOS': 571.50,
      'SSP': 130.26,
      'SDG': 601.50,
      'ZMW': 27.15,
      'ZWL': 322.00
    };

    // Get rates against USD
    const fromRate = ratesAgainstUSD[from];
    const toRate = ratesAgainstUSD[to];

    // If either currency is not found, return a default rate of 1
    if (!fromRate || !toRate) {
      console.warn(`Exchange rate not found for ${from} to ${to}, using default rate of 1`);
      return 1;
    }

    // If same currency, return 1
    if (from === to) {
      return 1;
    }

    // Calculate cross rate
    // Example: GHS to USD = 1 / 12.80 = 0.078125
    // Example: USD to GHS = 12.80 / 1 = 12.80
    const rate = toRate / fromRate;
    return rate;
  };

  // Calculate default rate (1.5% below official)
  const getDefaultRate = (from: string, to: string, baseAmount: number = 1): number => {
    const officialRate = getOfficialRate(from, to);
    const defaultRatePerUnit = officialRate * 0.985; // 1.5% below official
    return defaultRatePerUnit * baseAmount;
  };
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
  const renderStatusBadge = (status: 'completed' | 'pending' | 'not-started' | 'current' | 'locked' | 'cancelled') => {
    const styles = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'not-started': 'bg-gray-100 text-gray-600 border-gray-200',
      current: 'bg-blue-100 text-blue-700 border-blue-200',
      locked: 'bg-gray-100 text-gray-500 border-gray-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    const icons = {
      completed: <CheckCircle2 className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      'not-started': <XCircle className="w-4 h-4" />,
      current: <TrendingUp className="w-4 h-4" />,
      locked: <XCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
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
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{agentData.name}</h1>
                    <BadgeCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Alias: IronBear</p>
                  <p className="text-xs text-gray-500 mb-2">(We do not share your actual name and details with anyone on the platform. You have complete privacy.)</p>
                  <p className="text-gray-600 mb-2">{agentData.email}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {agentData.phone && <div className="flex items-center gap-1">
                        <Phone size={14} />
                        <span>{agentData.phone}</span>
                      </div>}
                    {agentData.location && <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{agentData.location}</span>
                      </div>}
                    {agentData.joinedDate && <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Joined {agentData.joinedDate}</span>
                      </div>}
                    {agentData.agentId && <div className="flex items-center gap-1">
                        <BadgeCheck size={14} />
                        <span className="font-mono">{agentData.agentId}</span>
                      </div>}
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all flex items-center gap-2">
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Agent Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
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
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transfers</p>
                  <p className="text-xl font-bold text-gray-900">{totalTransfers}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-xl font-bold text-gray-900">${totalEarnings}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Limit</p>
                  <p className="text-xl font-bold text-gray-900">
                    {qualificationLevels[currentQualificationLevel].limit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button onClick={() => setActiveTab('overview')} className={`px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                Overview
              </button>
              <button onClick={() => setActiveTab('performance')} className={`px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'performance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                Performance
              </button>
              <button onClick={() => setActiveTab('verification')} className={`px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'verification' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                Verification
              </button>
              <button onClick={() => setActiveTab('reviews')} className={`px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                Reviews & Ratings
              </button>
              <button onClick={() => setActiveTab('qualifications')} className={`px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'qualifications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                Qualifications
              </button>
              <button onClick={() => setActiveTab('transactions')} className={`px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'transactions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                Transactions
              </button>
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
                      <p className="text-lg font-semibold text-gray-900">Agent</p>
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

                {/* Co-Signer & Guarantor Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Co-Signer & Guarantor</h3>
                  <div className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                    {/* Co-Signer */}
                    <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 mb-1">Co-Signer</p>
                            <p className="text-sm text-gray-600 mb-3">Primary account co-signer</p>
                            <p className="font-semibold text-gray-900 mb-1">Michael Anderson</p>
                            <p className="text-sm text-gray-600 mb-1">michael.anderson@example.com</p>
                            <p className="text-sm text-gray-600">+254 700 123 456</p>
                          </div>
                        </div>
                        <div className="ml-3">
                          {renderStatusBadge('completed')}
                        </div>
                      </div>
                    </div>

                    {/* Guarantor 1 */}
                    <div className="p-4 bg-white rounded-lg border border-gray-200 mb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                            <Shield className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">Sarah Johnson</p>
                            <p className="text-sm text-gray-600 mb-1">Guarantor 1</p>
                            <p className="text-sm text-gray-600 mb-1">sarah.johnson@example.com</p>
                            <p className="text-sm text-gray-600 mb-2">+254 711 234 567</p>
                            <p className="text-sm text-gray-600 italic">Liable for Level 2 transactions</p>
                          </div>
                        </div>
                        <div className="ml-3">
                          {renderStatusBadge('completed')}
                        </div>
                      </div>
                    </div>

                    {/* Guarantor 2 */}
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                            <Shield className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">David Kimani</p>
                            <p className="text-sm text-gray-600 mb-1">Guarantor 2</p>
                            <p className="text-sm text-gray-600 mb-1">david.kimani@example.com</p>
                            <p className="text-sm text-gray-600 mb-2">+254 722 345 678</p>
                            <p className="text-sm text-gray-600 italic">Liable for Level 4 transactions</p>
                          </div>
                        </div>
                        <div className="ml-3">
                          {renderStatusBadge('completed')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent Performance */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Agent Performance</h3>
                  
                  {/* Current Qualification Level */}
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">Current Qualification Level</p>
                        <h4 className="text-3xl font-bold text-gray-900 mb-2">Level 2</h4>
                        <p className="text-sm text-gray-700 mb-4">Transfer limit: $1,000</p>
                        <button onClick={() => setActiveTab('qualifications')} className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                          View qualification details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {transactions.slice(0, 3).map(txn => <div key={txn.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{txn.id}</p>
                              <p className="text-xs text-gray-500">{txn.date}</p>
                            </div>
                          </div>
                          {renderStatusBadge(txn.status)}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{txn.sendingCountry || 'N/A'}</span>
                            <ChevronRight className="w-4 h-4" />
                            <span>{txn.receivingCountry || 'N/A'}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">${txn.amount}</p>
                            <p className="text-xs text-green-600 font-semibold">+${txn.commission}</p>
                          </div>
                        </div>
                      </div>)}
                  </div>
                  <button onClick={() => setActiveTab('transactions')} className="w-full mt-3 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2">
                    View All Transactions
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* NOTE at the bottom */}
                <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-amber-900 mb-2">Proceed with Care:</p>
                      <p className="text-sm text-amber-900">
                        All transactions should be conducted on the platform to enable proper monitoring and record-keeping. 
                        The platform does not support money laundering, terrorism, sex trafficking, fraud or the financing of criminal activities. 
                        Agents who transact outside the platform or knowingly engage in illegal activity will be held fully liable for their actions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>}

            {/* Performance Tab */}
            {activeTab === 'performance' && <div className="space-y-6">
                {/* Business Summary */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Business Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <p className="text-sm font-medium text-blue-900">Volume</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">${totalVolume}</p>
                      <p className="text-xs text-blue-700 mt-1">Total transferred</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-medium text-green-900">Commissions</p>
                      </div>
                      <p className="text-2xl font-bold text-green-900">${totalEarnings}</p>
                      <p className="text-xs text-green-700 mt-1">Total earned</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-emerald-600" />
                        <p className="text-sm font-medium text-emerald-900">Transfers</p>
                      </div>
                      <p className="text-2xl font-bold text-emerald-900">{totalTransfers}</p>
                      <p className="text-xs text-emerald-700 mt-1">Total count</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-pink-600" />
                        <p className="text-sm font-medium text-pink-900">Success Rate</p>
                      </div>
                      <p className="text-2xl font-bold text-pink-900">{completedTransactionsPercent}%</p>
                      <p className="text-xs text-pink-700 mt-1">Completion rate</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        <p className="text-sm font-medium text-indigo-900">Top Corridor</p>
                      </div>
                      <p className="text-lg font-bold text-indigo-900">{mostPopularCorridor}</p>
                      <p className="text-xs text-indigo-700 mt-1">Most used</p>
                    </div>
                  </div>
                </div>

                {/* Averages */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Averages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-900">Average Commission</p>
                          <p className="text-xs text-amber-700">Per transaction</p>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-amber-900">${(parseFloat(totalEarnings) / totalTransfers).toFixed(2)}</p>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-cyan-900">Average Transaction Time</p>
                          <p className="text-xs text-cyan-700">Start to completion</p>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-cyan-900">{averageTransactionTime}</p>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-900">Average Transaction Size</p>
                          <p className="text-xs text-purple-700">Amount per transfer</p>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-purple-900">${averageTransactionSize}</p>
                    </div>
                  </div>
                </div>

                {/* Daily Summary */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Summary</h3>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <p className="text-sm font-medium text-gray-700">Daily Volume</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">$2,450.00</p>
                        <p className="text-xs text-gray-600 mt-1">Today's transfers</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <p className="text-sm font-medium text-gray-700">Daily Commissions</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">$56.10</p>
                        <p className="text-xs text-gray-600 mt-1">Today's earnings</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-5 h-5 text-emerald-600" />
                          <p className="text-sm font-medium text-gray-700">Daily Transfers</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">3</p>
                        <p className="text-xs text-gray-600 mt-1">Completed today</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Summary */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Summary</h3>
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          <p className="text-sm font-medium text-gray-700">Monthly Volume</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">${totalVolume}</p>
                        <p className="text-xs text-gray-600 mt-1">This month's transfers</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <p className="text-sm font-medium text-gray-700">Monthly Commissions</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">${totalEarnings}</p>
                        <p className="text-xs text-gray-600 mt-1">This month's earnings</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-5 h-5 text-purple-600" />
                          <p className="text-sm font-medium text-gray-700">Monthly Transfers</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">67</p>
                        <p className="text-xs text-gray-600 mt-1">Total this month</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Annual Summary */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Annual Summary</h3>
                  <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-amber-600" />
                          <p className="text-sm font-medium text-gray-700">Annual Volume</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">$42,380.00</p>
                        <p className="text-xs text-gray-600 mt-1">Year to date</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <p className="text-sm font-medium text-gray-700">Annual Commissions</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">$974.74</p>
                        <p className="text-xs text-gray-600 mt-1">Year to date</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-5 h-5 text-amber-600" />
                          <p className="text-sm font-medium text-gray-700">Annual Transfers</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">67</p>
                        <p className="text-xs text-gray-600 mt-1">Total this year</p>
                      </div>
                    </div>
                  </div>
                </div>
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

            {/* Reviews Tab */}
            {activeTab === 'reviews' && <div>
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

            {/* Qualifications Tab */}
            {activeTab === 'qualifications' && <div>
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

            {/* Transactions Tab */}
            {activeTab === 'transactions' && <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Volume</p>
                    <p className="text-xl font-bold text-gray-900">${totalVolume}</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Route</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Commission</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(txn => <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-mono text-gray-900">{txn.id}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{txn.date}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <span>{txn.sendingCountry || 'N/A'}</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                              <span>{txn.receivingCountry || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                            ${txn.amount} {txn.currency}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-semibold text-green-600">
                            +${txn.commission}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {renderStatusBadge(txn.status)}
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Guarantor</h3>
              <button onClick={() => setShowGuarantorModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Your guarantor will receive a message to approve and agree to bear liability for your transactions.
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
                  <option value="business">Business Registration Document</option>
                  <option value="tax">Tax Bills</option>
                  <option value="insurance">Insurance Documents</option>
                  <option value="tenancy">Tenancy Agreements or Rent Receipts</option>
                  <option value="government">Government Correspondence</option>
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

      {/* Add/Edit Currency Rate Modal */}
      {showAddRateModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingRate ? 'Edit Currency Rate' : 'Add Currency Route'}
              </h3>
              <button onClick={() => setShowAddRateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Set your exchange rate for this currency route. You can set a single rate or use tiered pricing for different amounts.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Currency
                  </label>
                  <select value={newRate.fromCurrency} onChange={e => {
                const newFromCurrency = e.target.value;
                setNewRate({
                  ...newRate,
                  fromCurrency: newFromCurrency
                });
                // Recalculate exchange amount if in percent mode
                if (rateInputMode === 'percent' && !useTieredPricing) {
                  const officialRate = getOfficialRate(newFromCurrency, newRate.toCurrency);
                  const calculatedRate = officialRate * (1 - profitPercent / 100);
                  setNewRate({
                    ...newRate,
                    fromCurrency: newFromCurrency,
                    exchangeAmount: calculatedRate * newRate.baseAmount
                  });
                }
              }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <optgroup label="Major World Currencies">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="NZD">NZD - New Zealand Dollar</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="SGD">SGD - Singapore Dollar</option>
                      <option value="HKD">HKD - Hong Kong Dollar</option>
                      <option value="SEK">SEK - Swedish Krona</option>
                      <option value="NOK">NOK - Norwegian Krone</option>
                      <option value="DKK">DKK - Danish Krone</option>
                      <option value="KRW">KRW - South Korean Won</option>
                      <option value="MXN">MXN - Mexican Peso</option>
                      <option value="BRL">BRL - Brazilian Real</option>
                      <option value="ARS">ARS - Argentine Peso</option>
                      <option value="RUB">RUB - Russian Ruble</option>
                      <option value="TRY">TRY - Turkish Lira</option>
                      <option value="SAR">SAR - Saudi Riyal</option>
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="THB">THB - Thai Baht</option>
                      <option value="MYR">MYR - Malaysian Ringgit</option>
                      <option value="IDR">IDR - Indonesian Rupiah</option>
                      <option value="PHP">PHP - Philippine Peso</option>
                      <option value="PLN">PLN - Polish Zloty</option>
                      <option value="CZK">CZK - Czech Koruna</option>
                      <option value="HUF">HUF - Hungarian Forint</option>
                      <option value="ILS">ILS - Israeli Shekel</option>
                    </optgroup>
                    <optgroup label="African Currencies">
                      <option value="ZAR">ZAR - South African Rand</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="EGP">EGP - Egyptian Pound</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="GHS">GHS - Ghanaian Cedi</option>
                      <option value="MAD">MAD - Moroccan Dirham</option>
                      <option value="TND">TND - Tunisian Dinar</option>
                      <option value="UGX">UGX - Ugandan Shilling</option>
                      <option value="TZS">TZS - Tanzanian Shilling</option>
                      <option value="ETB">ETB - Ethiopian Birr</option>
                      <option value="XOF">XOF - West African CFA Franc</option>
                      <option value="XAF">XAF - Central African CFA Franc</option>
                      <option value="AOA">AOA - Angolan Kwanza</option>
                      <option value="BWP">BWP - Botswana Pula</option>
                      <option value="BIF">BIF - Burundian Franc</option>
                      <option value="CVE">CVE - Cape Verdean Escudo</option>
                      <option value="KMF">KMF - Comorian Franc</option>
                      <option value="CDF">CDF - Congolese Franc</option>
                      <option value="DJF">DJF - Djiboutian Franc</option>
                      <option value="ERN">ERN - Eritrean Nakfa</option>
                      <option value="SZL">SZL - Eswatini Lilangeni</option>
                      <option value="GMD">GMD - Gambian Dalasi</option>
                      <option value="GNF">GNF - Guinean Franc</option>
                      <option value="LSL">LSL - Lesotho Loti</option>
                      <option value="LRD">LRD - Liberian Dollar</option>
                      <option value="LYD">LYD - Libyan Dinar</option>
                      <option value="MGA">MGA - Malagasy Ariary</option>
                      <option value="MWK">MWK - Malawian Kwacha</option>
                      <option value="MRU">MRU - Mauritanian Ouguiya</option>
                      <option value="MUR">MUR - Mauritian Rupee</option>
                      <option value="MZN">MZN - Mozambican Metical</option>
                      <option value="NAD">NAD - Namibian Dollar</option>
                      <option value="RWF">RWF - Rwandan Franc</option>
                      <option value="STN">STN - São Tomé and Príncipe Dobra</option>
                      <option value="SCR">SCR - Seychellois Rupee</option>
                      <option value="SLL">SLL - Sierra Leonean Leone</option>
                      <option value="SOS">SOS - Somali Shilling</option>
                      <option value="SSP">SSP - South Sudanese Pound</option>
                      <option value="SDG">SDG - Sudanese Pound</option>
                      <option value="ZMW">ZMW - Zambian Kwacha</option>
                      <option value="ZWL">ZWL - Zimbabwean Dollar</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Currency
                  </label>
                  <select value={newRate.toCurrency} onChange={e => {
                const newToCurrency = e.target.value;
                setNewRate({
                  ...newRate,
                  toCurrency: newToCurrency
                });
                // Recalculate exchange amount if in percent mode
                if (rateInputMode === 'percent' && !useTieredPricing) {
                  const officialRate = getOfficialRate(newRate.fromCurrency, newToCurrency);
                  const calculatedRate = officialRate * (1 - profitPercent / 100);
                  setNewRate({
                    ...newRate,
                    toCurrency: newToCurrency,
                    exchangeAmount: calculatedRate * newRate.baseAmount
                  });
                }
              }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <optgroup label="Major World Currencies">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="NZD">NZD - New Zealand Dollar</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="SGD">SGD - Singapore Dollar</option>
                      <option value="HKD">HKD - Hong Kong Dollar</option>
                      <option value="SEK">SEK - Swedish Krona</option>
                      <option value="NOK">NOK - Norwegian Krone</option>
                      <option value="DKK">DKK - Danish Krone</option>
                      <option value="KRW">KRW - South Korean Won</option>
                      <option value="MXN">MXN - Mexican Peso</option>
                      <option value="BRL">BRL - Brazilian Real</option>
                      <option value="ARS">ARS - Argentine Peso</option>
                      <option value="RUB">RUB - Russian Ruble</option>
                      <option value="TRY">TRY - Turkish Lira</option>
                      <option value="SAR">SAR - Saudi Riyal</option>
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="THB">THB - Thai Baht</option>
                      <option value="MYR">MYR - Malaysian Ringgit</option>
                      <option value="IDR">IDR - Indonesian Rupiah</option>
                      <option value="PHP">PHP - Philippine Peso</option>
                      <option value="PLN">PLN - Polish Zloty</option>
                      <option value="CZK">CZK - Czech Koruna</option>
                      <option value="HUF">HUF - Hungarian Forint</option>
                      <option value="ILS">ILS - Israeli Shekel</option>
                    </optgroup>
                    <optgroup label="African Currencies">
                      <option value="ZAR">ZAR - South African Rand</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="EGP">EGP - Egyptian Pound</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="GHS">GHS - Ghanaian Cedi</option>
                      <option value="MAD">MAD - Moroccan Dirham</option>
                      <option value="TND">TND - Tunisian Dinar</option>
                      <option value="UGX">UGX - Ugandan Shilling</option>
                      <option value="TZS">TZS - Tanzanian Shilling</option>
                      <option value="ETB">ETB - Ethiopian Birr</option>
                      <option value="XOF">XOF - West African CFA Franc</option>
                      <option value="XAF">XAF - Central African CFA Franc</option>
                      <option value="AOA">AOA - Angolan Kwanza</option>
                      <option value="BWP">BWP - Botswana Pula</option>
                      <option value="BIF">BIF - Burundian Franc</option>
                      <option value="CVE">CVE - Cape Verdean Escudo</option>
                      <option value="KMF">KMF - Comorian Franc</option>
                      <option value="CDF">CDF - Congolese Franc</option>
                      <option value="DJF">DJF - Djiboutian Franc</option>
                      <option value="ERN">ERN - Eritrean Nakfa</option>
                      <option value="SZL">SZL - Eswatini Lilangeni</option>
                      <option value="GMD">GMD - Gambian Dalasi</option>
                      <option value="GNF">GNF - Guinean Franc</option>
                      <option value="LSL">LSL - Lesotho Loti</option>
                      <option value="LRD">LRD - Liberian Dollar</option>
                      <option value="LYD">LYD - Libyan Dinar</option>
                      <option value="MGA">MGA - Malagasy Ariary</option>
                      <option value="MWK">MWK - Malawian Kwacha</option>
                      <option value="MRU">MRU - Mauritanian Ouguiya</option>
                      <option value="MUR">MUR - Mauritian Rupee</option>
                      <option value="MZN">MZN - Mozambican Metical</option>
                      <option value="NAD">NAD - Namibian Dollar</option>
                      <option value="RWF">RWF - Rwandan Franc</option>
                      <option value="STN">STN - São Tomé and Príncipe Dobra</option>
                      <option value="SCR">SCR - Seychellois Rupee</option>
                      <option value="SLL">SLL - Sierra Leonean Leone</option>
                      <option value="SOS">SOS - Somali Shilling</option>
                      <option value="SSP">SSP - South Sudanese Pound</option>
                      <option value="SDG">SDG - Sudanese Pound</option>
                      <option value="ZMW">ZMW - Zambian Kwacha</option>
                      <option value="ZWL">ZWL - Zimbabwean Dollar</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Tiered Pricing Toggle */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Use Tiered Pricing</p>
                    <p className="text-xs text-gray-600 mt-1">Set different rates for different amount ranges</p>
                  </div>
                  <button onClick={() => setUseTieredPricing(!useTieredPricing)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useTieredPricing ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useTieredPricing ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {!useTieredPricing ?
          // Single Rate Mode
          <>
                  {/* Input Mode Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Set Rate By
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setRateInputMode('percent')} className={`px-4 py-3 rounded-lg font-semibold transition-all ${rateInputMode === 'percent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        Profit %
                      </button>
                      <button onClick={() => setRateInputMode('amount')} className={`px-4 py-3 rounded-lg font-semibold transition-all ${rateInputMode === 'amount' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        Exact Amount
                      </button>
                    </div>
                  </div>

                  {rateInputMode === 'percent' ?
            // Profit Percentage Input
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profit Percentage (% below official rate)
                      </label>
                      <div className="relative">
                        <input type="number" value={profitPercent || ''} onChange={e => {
                  const value = parseFloat(e.target.value) || 0;
                  setProfitPercent(value);
                  // Auto-calculate exchange amount
                  const officialRate = getOfficialRate(newRate.fromCurrency, newRate.toCurrency);
                  const calculatedRate = officialRate * (1 - value / 100);
                  setNewRate({
                    ...newRate,
                    exchangeAmount: parseFloat(calculatedRate.toFixed(2))
                  });
                }} placeholder="1.5" step="0.1" min="0" max="99" className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                          %
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Your profit margin below the official exchange rate
                      </p>
                    </div> :
            // Exact Amount Input (existing)
            <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Base Amount
                        </label>
                        <div className="flex gap-2">
                          {[1, 10, 100].map(amount => <button key={amount} onClick={() => {
                    const officialRate = getOfficialRate(newRate.fromCurrency, newRate.toCurrency);
                    const defaultExchange = getDefaultRate(newRate.fromCurrency, newRate.toCurrency, amount);
                    setNewRate({
                      ...newRate,
                      baseAmount: amount,
                      exchangeAmount: parseFloat(defaultExchange.toFixed(2))
                    });
                  }} className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${newRate.baseAmount === amount ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                              {amount}
                            </button>)}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Select the base amount in {newRate.fromCurrency} you want to set the rate for
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Exchange Amount
                        </label>
                        <div className="relative">
                          <input type="number" value={newRate.exchangeAmount || ''} onChange={e => setNewRate({
                    ...newRate,
                    exchangeAmount: parseFloat(e.target.value) || 0
                  })} placeholder="0.00" step="0.01" className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            {newRate.toCurrency}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          How much {newRate.toCurrency} will the recipient get for {newRate.baseAmount} {newRate.fromCurrency}
                        </p>
                      </div>
                    </>}

                  {(newRate.exchangeAmount > 0 || profitPercent > 0) && <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">Your Rate</p>
                          <p className="text-lg font-bold text-gray-900 mb-1">
                            1 {newRate.fromCurrency} = {(newRate.exchangeAmount / newRate.baseAmount).toFixed(2)} {newRate.toCurrency}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-blue-200">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-700">Official Rate</p>
                            <p className="text-sm font-semibold text-gray-700">
                              1 {newRate.fromCurrency} = {getOfficialRate(newRate.fromCurrency, newRate.toCurrency).toFixed(2)} {newRate.toCurrency}
                            </p>
                          </div>
                        </div>
                        {(() => {
                  const officialRate = getOfficialRate(newRate.fromCurrency, newRate.toCurrency);
                  const yourRate = newRate.exchangeAmount / newRate.baseAmount;
                  const diff = ((yourRate - officialRate) / officialRate * 100).toFixed(2);
                  const isHigher = yourRate > officialRate;
                  return <div className="flex items-center gap-2 mt-2">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${isHigher ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {isHigher ? '+' : ''}{diff}%
                            </div>
                            <span className="text-xs text-gray-600">
                              {isHigher ? 'above' : 'below'} market rate
                            </span>
                            {isHigher && <span className="text-xs text-red-600 font-medium ml-auto">⚠️ Must be below official rate</span>}
                          </div>;
                })()}
                      </div>
                    </div>}
                </> :
          // Tiered Pricing Mode
          <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Amount Tiers
                    </label>
                    <button onClick={() => {
                setRateTiers([...rateTiers, {
                  minAmount: rateTiers[rateTiers.length - 1]?.maxAmount || 0,
                  maxAmount: null,
                  exchangeRate: 0,
                  profitPercent: 1.5
                }]);
              }} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      + Add Tier
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {rateTiers.map((tier, index) => {
                const officialRate = getOfficialRate(newRate.fromCurrency, newRate.toCurrency);
                const tierRate = tier.profitPercent > 0 ? officialRate * (1 - tier.profitPercent / 100) : tier.exchangeRate;
                return <div key={index} className="p-4 bg-white rounded-lg border-2 border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-900">Tier {index + 1}</p>
                            {rateTiers.length > 1 && <button onClick={() => setRateTiers(rateTiers.filter((_, i) => i !== index))} className="p-1 hover:bg-gray-100 rounded transition-all">
                                <X size={16} className="text-red-600" />
                              </button>}
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Min Amount ($)
                              </label>
                              <input type="number" value={tier.minAmount} onChange={e => {
                        const newTiers = [...rateTiers];
                        newTiers[index].minAmount = parseFloat(e.target.value) || 0;
                        setRateTiers(newTiers);
                      }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Max Amount ($)
                              </label>
                              <input type="number" value={tier.maxAmount || ''} onChange={e => {
                        const newTiers = [...rateTiers];
                        newTiers[index].maxAmount = e.target.value ? parseFloat(e.target.value) : null;
                        setRateTiers(newTiers);
                      }} placeholder="No limit" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Profit % (below official rate)
                            </label>
                            <div className="relative">
                              <input type="number" value={tier.profitPercent} onChange={e => {
                        const newTiers = [...rateTiers];
                        newTiers[index].profitPercent = parseFloat(e.target.value) || 0;
                        newTiers[index].exchangeRate = officialRate * (1 - newTiers[index].profitPercent / 100);
                        setRateTiers(newTiers);
                      }} step="0.1" min="0" max="99" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                %
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 p-2 bg-white rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600 mb-1">Calculated Rate:</p>
                            <p className="text-sm font-semibold text-gray-900">
                              1 {newRate.fromCurrency} = {tierRate.toFixed(2)} {newRate.toCurrency}
                            </p>
                          </div>
                        </div>;
              })}
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Official Market Rate</p>
                    <p className="text-sm font-semibold text-gray-700">
                      1 {newRate.fromCurrency} = {getOfficialRate(newRate.fromCurrency, newRate.toCurrency).toFixed(2)} {newRate.toCurrency}
                    </p>
                  </div>
                </div>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddRateModal(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
                Cancel
              </button>
              <button onClick={handleSaveRate} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
                {editingRate ? 'Update Rate' : 'Add Rate'}
              </button>
            </div>
          </div>
        </div>}

      {/* Add Receiving Account Modal */}
      {showAddReceivingAccount && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Account</h3>
              <button onClick={() => setShowAddReceivingAccount(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Add your account details for receiving funds from customers.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <SearchableCountryDropdown value={newReceivingAccount.country} onChange={country => {
              setNewReceivingAccount({
                ...newReceivingAccount,
                country,
                accountType: '',
                details: ''
              });
            }} placeholder="Search and select country..." />
              </div>

              {/* Account Type field - always shown, but disabled if no country selected */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                {!newReceivingAccount.country ? <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed">
                    Please select a country first
                  </div> : <select value={newReceivingAccount.accountType} onChange={e => setNewReceivingAccount({
              ...newReceivingAccount,
              accountType: e.target.value,
              details: ''
            })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Select type...</option>
                    {newReceivingAccount.country && (() => {
                const countryConfig = getCountryByName(newReceivingAccount.country);
                return countryConfig ? Object.keys(countryConfig.paymentMethods).map(method => <option key={method} value={method}>{method}</option>) : null;
              })()}
                </select>}
              </div>
              {newReceivingAccount.country && newReceivingAccount.accountType && <DynamicAccountForm country={newReceivingAccount.country} accountType={newReceivingAccount.accountType} onFieldsChange={details => {
            setNewReceivingAccount({
              ...newReceivingAccount,
              details
            });
          }} />}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddReceivingAccount(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
                Cancel
              </button>
              <button onClick={handleAddReceivingAccount} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium">
                Add Account
              </button>
            </div>
          </div>
        </div>}

      {/* Add Sending Country Modal */}
      {showAddSendingCountry && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Sending Account</h3>
              <button onClick={() => {
            setShowAddSendingCountry(false);
            setNewSendingCountry({
              country: '',
              paymentMethods: []
            });
            setCurrentSendingPaymentMethod({
              type: '',
              details: ''
            });
            setIsAddingPaymentMethod(false);
          }} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Add a country and your account details for each payment method you offer for sending money there.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <SearchableCountryDropdown value={newSendingCountry.country} onChange={country => {
              setNewSendingCountry({
                country,
                paymentMethods: []
              });
              setCurrentSendingPaymentMethod({
                type: '',
                details: ''
              });
              setIsAddingPaymentMethod(false);
            }} placeholder="Search and select country..." />
              </div>

              {/* Account Type field - always shown, but disabled if no country selected */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                {!newSendingCountry.country ? <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed">
                    Please select a country first
                  </div> : !isAddingPaymentMethod ? <select value={currentSendingPaymentMethod.type} onChange={e => {
              setCurrentSendingPaymentMethod({
                type: e.target.value,
                details: ''
              });
              setIsAddingPaymentMethod(true);
            }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select type...</option>
                    {newSendingCountry.country && (() => {
                const countryConfig = getCountryByName(newSendingCountry.country);
                return countryConfig ? Object.keys(countryConfig.paymentMethods).map(method => <option key={method} value={method}>{method}</option>) : null;
              })()}
                </select> : <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                    {currentSendingPaymentMethod.type}
                  </div>}
              </div>

              {/* Display added payment methods */}
              {newSendingCountry.paymentMethods.length > 0 && <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Added Payment Methods
                  </label>
                  {newSendingCountry.paymentMethods.map((method, idx) => <div key={idx} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-purple-700 mb-1">{method.type}</p>
                          <p className="text-xs text-gray-600">{method.details}</p>
                        </div>
                        <button onClick={() => {
                  const updatedMethods = newSendingCountry.paymentMethods.filter((_, i) => i !== idx);
                  setNewSendingCountry({
                    ...newSendingCountry,
                    paymentMethods: updatedMethods
                  });
                }} className="p-1 hover:bg-white/50 rounded transition-all">
                          <X size={14} className="text-red-600" />
                        </button>
                      </div>
                    </div>)}
                </div>}

              {/* Add Payment Method Section - now only shows dynamic form when type is selected */}
              {newSendingCountry.country && isAddingPaymentMethod && currentSendingPaymentMethod.type && <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-gray-900">
                        Account Details for {currentSendingPaymentMethod.type}
                      </label>
                      <button onClick={() => {
                setCurrentSendingPaymentMethod({
                  type: '',
                  details: ''
                });
                setIsAddingPaymentMethod(false);
              }} className="text-xs text-red-600 hover:text-red-700 font-medium">
                        Cancel
                      </button>
                    </div>

                    <DynamicAccountForm country={newSendingCountry.country} accountType={currentSendingPaymentMethod.type} onFieldsChange={details => {
              setCurrentSendingPaymentMethod({
                ...currentSendingPaymentMethod,
                details
              });
            }} existingDetails={currentSendingPaymentMethod.details} />

                    {currentSendingPaymentMethod.details && <button onClick={() => {
              // Add the payment method to the list
              setNewSendingCountry({
                ...newSendingCountry,
                paymentMethods: [...newSendingCountry.paymentMethods, {
                  type: currentSendingPaymentMethod.type,
                  details: currentSendingPaymentMethod.details
                }]
              });
              // Reset current payment method
              setCurrentSendingPaymentMethod({
                type: '',
                details: ''
              });
              setIsAddingPaymentMethod(false);
            }} className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium text-sm">
                        Add This Payment Method
                      </button>}
                  </div>}

              {/* Add Another Payment Method button - shown when not adding and country is selected */}
              {newSendingCountry.country && !isAddingPaymentMethod && newSendingCountry.paymentMethods.length > 0 && <button onClick={() => setIsAddingPaymentMethod(true)} className="w-full px-4 py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-all font-medium text-sm flex items-center justify-center gap-2">
                    <DollarSign size={16} />
                    Add Another Payment Method
                  </button>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => {
            setShowAddSendingCountry(false);
            setNewSendingCountry({
              country: '',
              paymentMethods: []
            });
            setCurrentSendingPaymentMethod({
              type: '',
              details: ''
            });
            setIsAddingPaymentMethod(false);
          }} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
                Cancel
              </button>
              <button onClick={handleAddSendingCountry} disabled={newSendingCountry.paymentMethods.length === 0} className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                Add Country
              </button>
            </div>
          </div>
        </div>}

      {/* Add Cash Modal */}
      {showAddCashModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Available Cash</h3>
              <button onClick={() => setShowAddCashModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Add your available cash for different currencies.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <SearchableCountryDropdown value={newCashEntry.country} onChange={country => {
              const countryConfig = getCountryByName(country);
              setNewCashEntry({
                ...newCashEntry,
                country,
                currency: countryConfig ? countryConfig.currency : '',
                amount: ''
              });
            }} placeholder="Search and select country..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                {!newCashEntry.country ? <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed">
                    Please select a country first
                  </div> : <input type="text" value={newCashEntry.currency || (() => {
              const countryConfig = getCountryByName(newCashEntry.country);
              return countryConfig ? countryConfig.currency : '';
            })()} readOnly className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700" placeholder="Currency will be auto-filled" />}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input type="number" value={newCashEntry.amount} onChange={e => setNewCashEntry({
              ...newCashEntry,
              amount: e.target.value
            })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter amount" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddCashModal(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
                Cancel
              </button>
              <button onClick={handleAddCash} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium">
                Add Cash
              </button>
            </div>
          </div>
        </div>}
    </div>;
}