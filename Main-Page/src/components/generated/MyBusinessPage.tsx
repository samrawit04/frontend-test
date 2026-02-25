"use client";

import * as React from "react";
import { useState } from "react";
import { DollarSign, TrendingUp, ChevronRight, X, Edit2, AlertCircle, Building2, MapPin, Package, Activity, Award, Clock, CheckCircle2, Shield } from "lucide-react";
import { ExchangeRateTool } from "./ExchangeRateTool";
import SearchableCountryDropdown from "./SearchableCountryDropdown";
import DynamicAccountForm from "./DynamicAccountForm";
import { getCountryByName } from "./CountryData";
export interface MyBusinessPageProps {
  onBack?: () => void;
}
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
export default function MyBusinessPage({
  onBack
}: MyBusinessPageProps) {
  // Currency rates state
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([{
    id: '1',
    fromCurrency: 'USD',
    toCurrency: 'KES',
    baseAmount: 1,
    exchangeAmount: 146.28,
    officialRate: 148.5
  }, {
    id: '2',
    fromCurrency: 'GBP',
    toCurrency: 'KES',
    baseAmount: 1,
    exchangeAmount: 185.48,
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

  // Account details state
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

  // Sample transaction data (from AgentProfilePage)
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

  // Calculate business metrics
  const totalTransfers = transactions.length;
  const totalEarnings = transactions.reduce((sum, t) => sum + parseFloat(t.commission), 0).toFixed(2);
  const totalVolume = transactions.reduce((sum, t) => sum + parseFloat(t.amount.replace(/,/g, '')), 0).toLocaleString();
  const averageTransactionSize = transactions.length > 0 ? (transactions.reduce((sum, t) => sum + parseFloat(t.amount.replace(/,/g, '')), 0) / transactions.length).toFixed(2) : '0.00';
  const biggestCommission = transactions.length > 0 ? Math.max(...transactions.map(t => parseFloat(t.commission))).toFixed(2) : '0.00';
  const smallestCommission = transactions.length > 0 ? Math.min(...transactions.map(t => parseFloat(t.commission))).toFixed(2) : '0.00';
  const corridorStats = currencyRates.reduce((acc, rate) => {
    const corridor = `${rate.fromCurrency}-${rate.toCurrency}`;
    acc[corridor] = (acc[corridor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostPopularCorridor = Object.keys(corridorStats).length > 0 ? Object.entries(corridorStats).sort(([, a], [, b]) => b - a)[0][0].replace('-', ' → ') : 'N/A';
  const averageTransactionTime = '2.5 hours';
  const completedTransactionsPercent = transactions.length > 0 ? (transactions.filter(t => t.status === 'completed').length / transactions.length * 100).toFixed(1) : '0.0';

  // Helper functions
  const getOfficialRate = (from: string, to: string): number => {
    const ratesAgainstUSD: Record<string, number> = {
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
      'XAF': 604.50
    };
    const fromRate = ratesAgainstUSD[from] || 1;
    const toRate = ratesAgainstUSD[to] || 1;
    return from === to ? 1 : toRate / fromRate;
  };
  const getDefaultRate = (from: string, to: string, baseAmount: number = 1): number => {
    const officialRate = getOfficialRate(from, to);
    return officialRate * 0.985 * baseAmount;
  };
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
    if (rate.tiers && rate.tiers.length > 0) {
      setUseTieredPricing(true);
      setRateTiers(rate.tiers);
      setRateInputMode('percent');
    } else {
      setUseTieredPricing(false);
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
      }
    }
    setShowAddRateModal(false);
    setEditingRate(null);
  };
  const handleDeleteRate = (id: string) => {
    if (confirm('Are you sure you want to delete this currency route?')) {
      setCurrencyRates(rates => rates.filter(r => r.id !== id));
    }
  };
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
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Business</h1>
          <p className="text-gray-600">Manage your business operations, rates, and performance metrics</p>
        </div>

        {/* Business Overview Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-900">Transfers</p>
              </div>
              <p className="text-2xl font-bold text-emerald-900">{totalTransfers}</p>
              <p className="text-xs text-emerald-700 mt-1">Total completed transfers</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Volume</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">${totalVolume}</p>
              <p className="text-xs text-blue-700 mt-1">Across all transactions</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-900">Commission</p>
              </div>
              <p className="text-2xl font-bold text-green-900">${totalEarnings}</p>
              <p className="text-xs text-green-700 mt-1">Total earnings to date</p>
            </div>
          </div>
        </div>

        {/* Currency Exchange Rates Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Currency Exchange Rates</h2>
              <p className="text-sm text-gray-600 mt-1">Set your exchange rates for different currency routes</p>
            </div>
            <button onClick={handleAddRate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm flex items-center gap-2">
              <DollarSign size={16} />
              Add Currency Route
            </button>
          </div>

          {currencyRates.length === 0 ? <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No currency routes added yet</p>
              <button onClick={handleAddRate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm">
                Add Your First Route
              </button>
            </div> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {currencyRates.map(rate => {
            const officialRate = rate.officialRate;
            const yourRate = rate.exchangeAmount / rate.baseAmount;
            const difference = ((yourRate - officialRate) / officialRate * 100).toFixed(2);
            const isHigher = yourRate > officialRate;
            const rateFor1 = yourRate;
            const rateFor10 = yourRate * 10;
            const rateFor100 = yourRate * 100;
            return <div key={rate.id} className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">{rate.fromCurrency}</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                            <span className="text-xl font-bold text-gray-900">{rate.toCurrency}</span>
                          </div>
                          <p className="text-sm text-gray-600">{rate.tiers ? 'Tiered Pricing' : 'Currency Route'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditRate(rate)} className="p-2 hover:bg-white/50 rounded-lg transition-all">
                          <Edit2 size={16} className="text-blue-600" />
                        </button>
                        <button onClick={() => handleDeleteRate(rate.id)} className="p-2 hover:bg-white/50 rounded-lg transition-all">
                          <X size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {rate.tiers && rate.tiers.length > 0 ? <>
                          {rate.tiers.map((tier, idx) => {
                    const tierRate = tier.exchangeRate;
                    const tierDifference = ((tierRate - officialRate) / officialRate * 100).toFixed(2);
                    return <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs font-semibold text-gray-700">
                                    {tier.maxAmount ? `$${tier.minAmount.toLocaleString()} - $${tier.maxAmount.toLocaleString()}` : `Above $${tier.minAmount.toLocaleString()}`}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                                      {tier.profitPercent.toFixed(1)}% profit
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                  1 {rate.fromCurrency} = {tierRate.toFixed(2)} {rate.toCurrency}
                                </p>
                              </div>;
                  })}
                        </> : <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-600 mb-2">Your Rate</p>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-900">
                              1 {rate.fromCurrency} = {rateFor1.toFixed(2)} {rate.toCurrency}
                            </p>
                            <p className="text-sm text-gray-700">
                              10 {rate.fromCurrency} = {rateFor10.toFixed(2)} {rate.toCurrency}
                            </p>
                            <p className="text-sm text-gray-700">
                              100 {rate.fromCurrency} = {rateFor100.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} {rate.toCurrency}
                            </p>
                          </div>
                        </div>}

                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Official Rate</p>
                        <p className="text-sm font-semibold text-gray-700">
                          1 {rate.fromCurrency} = {officialRate.toFixed(2)} {rate.toCurrency}
                        </p>
                        {!rate.tiers && <div className="flex items-center gap-2 mt-2">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${isHigher ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {isHigher ? '+' : ''}{difference}%
                            </div>
                            <span className="text-xs text-gray-600">{isHigher ? 'above' : 'below'} market rate</span>
                          </div>}
                      </div>
                    </div>
                  </div>;
          })}
            </div>}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">Rate Management Tips</p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>• Your rate must always be lower than the official market rate</li>
                  <li>• Default rate is set at 1.5% below market rate</li>
                  <li>• Rates scale proportionally (e.g., 1→10→100)</li>
                  <li>• Update rates regularly to stay competitive</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Volume Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Volume</h2>
              <p className="text-sm text-gray-600 mt-1">Your available funds in different currencies for business operations</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm flex items-center gap-2">
              <DollarSign size={16} />
              Add Currency
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample currency volumes - these would be dynamic in a real app */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">US Dollar</p>
                    <p className="text-xs text-green-700">USD</p>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-white/50 rounded-lg transition-all">
                  <Edit2 size={14} className="text-green-700" />
                </button>
              </div>
              <p className="text-2xl font-bold text-green-900">$22,000</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-900">Nigerian Naira</p>
                    <p className="text-xs text-purple-700">NGN</p>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-white/50 rounded-lg transition-all">
                  <Edit2 size={14} className="text-purple-700" />
                </button>
              </div>
              <p className="text-2xl font-bold text-purple-900">₦2,000,000</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Kenyan Shilling</p>
                    <p className="text-xs text-blue-700">KES</p>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-white/50 rounded-lg transition-all">
                  <Edit2 size={14} className="text-blue-700" />
                </button>
              </div>
              <p className="text-2xl font-bold text-blue-900">KSh 450,000</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">Volume Management</p>
                <p className="text-xs text-blue-700 mt-1">
                  Keep your volume information updated to help customers know your capacity. This information is used to match you with appropriate transactions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Accounts Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Accounts</h2>
          
          {/* Encouraging Message */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-900 mb-2">💡 Safety Tip:</p>
                <p className="text-sm text-green-900">
                  We strongly encourage you to create business bank accounts and mobile money accounts specifically for your agent activities. This will help keep your personal details private and help separate your business transactions from personal finances.
                </p>
              </div>
            </div>
          </div>
          
          {/* Receiving Countries Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-md font-semibold text-gray-900">Receiving Countries</h3>
                <p className="text-sm text-gray-600">Your account details for receiving funds</p>
              </div>
              <button onClick={() => setShowAddReceivingAccount(true)} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm flex items-center gap-2">
                <Building2 size={16} />
                Add Account
              </button>
            </div>
            
            {receivingAccounts.length === 0 ? <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No receiving accounts added yet</p>
              </div> : <div className="space-y-3">
                {receivingAccounts.map(account => <div key={account.id} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <p className="font-semibold text-gray-900">{account.country}</p>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">{account.accountType}</p>
                          <p className="text-sm text-gray-600">{account.details}</p>
                        </div>
                      </div>
                      <button onClick={() => {
                  if (confirm('Are you sure you want to remove this account?')) {
                    setReceivingAccounts(accounts => accounts.filter(a => a.id !== account.id));
                  }
                }} className="p-2 hover:bg-white/50 rounded-lg transition-all">
                        <X size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>)}
              </div>}
          </div>

          {/* Sending Countries Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-md font-semibold text-gray-900">Sending Countries</h3>
                <p className="text-sm text-gray-600">Payment options you offer for sending money</p>
              </div>
              <button onClick={() => setShowAddSendingCountry(true)} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium text-sm flex items-center gap-2">
                <DollarSign size={16} />
                Add Account
              </button>
            </div>
            
            {sendingCountries.length === 0 ? <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <DollarSign className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No sending countries added yet</p>
              </div> : <div className="space-y-3">
                {sendingCountries.map(country => <div key={country.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">{country.country}</p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Account type:</span> {country.paymentMethods.map(m => m.type).join(', ')}
                          </p>
                          <div className="space-y-2">
                            {country.paymentMethods.map((method, idx) => <div key={idx} className="p-3 bg-white rounded-lg border border-purple-200">
                                <p className="text-sm font-semibold text-purple-700 mb-1">{method.type}</p>
                                <p className="text-xs text-gray-600">{method.details}</p>
                              </div>)}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => {
                  if (confirm('Are you sure you want to remove this country?')) {
                    setSendingCountries(countries => countries.filter(c => c.id !== country.id));
                  }
                }} className="p-2 hover:bg-white/50 rounded-lg transition-all">
                        <X size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>)}
              </div>}
          </div>
        </div>

        {/* NOTE at the bottom */}
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg mb-6">
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

        {/* Exchange Rate Tool Section */}
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Live Exchange Rate Calculator</h2>
            <p className="text-gray-600">Compare real-time exchange rates across multiple currencies</p>
          </div>
          <ExchangeRateTool />
        </div>

        {/* Back Button */}
        {onBack && <button onClick={onBack} className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
            <X size={20} />
            Close
          </button>}
      </div>

      {/* Add Receiving Account Modal - This would be the same modal from AgentProfilePage */}
      {/* Add Sending Country Modal - This would be the same modal from AgentProfilePage */}
      {/* Add/Edit Rate Modal - This would be the same modal from AgentProfilePage */}
      {/* For brevity, these modals are omitted but would be identical to the ones in AgentProfilePage */}
    </div>;
}