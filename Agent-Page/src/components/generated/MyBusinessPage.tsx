"use client";

import * as React from "react";
import { useState } from "react";
import { DollarSign, TrendingUp, ChevronRight, X, Edit2, AlertCircle, Building2, MapPin, Package, Activity, Award, Clock, CheckCircle2, Shield } from "lucide-react";
import { ExchangeRateTool } from "./ExchangeRateTool";
import SearchableCountryDropdown from "./SearchableCountryDropdown";
import DynamicAccountForm from "./DynamicAccountForm";
import { getCountryByName, COUNTRIES, CountryConfig } from "./CountryData";
import AccountCard from "./AccountCard";
import AccountModal from "./AccountModal";
import type { Account } from "./AccountCard";
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
  deliveryTime?: number;
  deliveryTimeUnit?: 'Minutes' | 'Hours' | 'Days';
  tiers?: Array<{
    minAmount: number;
    maxAmount: number | null;
    exchangeRate: number;
    profitPercent: number;
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
    officialRate: 148.5,
    deliveryTime: 5,
    deliveryTimeUnit: 'Minutes'
  }, {
    id: '2',
    fromCurrency: 'GBP',
    toCurrency: 'KES',
    baseAmount: 1,
    exchangeAmount: 185.48,
    officialRate: 188.2,
    deliveryTime: 10,
    deliveryTimeUnit: 'Minutes'
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
  const [deliveryTime, setDeliveryTime] = useState(5);
  const [deliveryTimeUnit, setDeliveryTimeUnit] = useState<'Minutes' | 'Hours' | 'Days'>('Minutes');

  // Account details state
  const [accounts, setAccounts] = useState<Account[]>([{
    id: '1',
    country: 'United States',
    accountType: 'Bank Account',
    details: 'John Doe, 021000021, 1234567890, Chase Bank'
  }, {
    id: '2',
    country: 'United States',
    accountType: 'Cash App',
    details: '$johndoe'
  }, {
    id: '3',
    country: 'United Kingdom',
    accountType: 'Revolut',
    details: 'jane@example.com'
  }, {
    id: '4',
    country: 'Kenya',
    accountType: 'M-Pesa',
    details: '+254 712 345 678, Jane Smith'
  }, {
    id: '5',
    country: 'Kenya',
    accountType: 'Bank Account',
    details: 'Jane Smith, 1234567890, Equity Bank'
  }, {
    id: '6',
    country: 'Ghana',
    accountType: 'Mobile Money - Request Payment',
    details: '+233 24 123 4567, MTN, Kofi Mensah'
  }]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

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
    setDeliveryTime(5);
    setDeliveryTimeUnit('Minutes');
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
    setDeliveryTime(rate.deliveryTime || 5);
    setDeliveryTimeUnit(rate.deliveryTimeUnit || 'Minutes');
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
          deliveryTime: deliveryTime,
          deliveryTimeUnit: deliveryTimeUnit,
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
          deliveryTime: deliveryTime,
          deliveryTimeUnit: deliveryTimeUnit,
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
          deliveryTime: deliveryTime,
          deliveryTimeUnit: deliveryTimeUnit,
          tiers: undefined
        } : r));
      } else {
        const rate: CurrencyRate = {
          id: Date.now().toString(),
          fromCurrency: newRate.fromCurrency,
          toCurrency: newRate.toCurrency,
          baseAmount: newRate.baseAmount,
          exchangeAmount: finalExchangeAmount,
          officialRate: officialRate,
          deliveryTime: deliveryTime,
          deliveryTimeUnit: deliveryTimeUnit
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
  const handleOpenAddAccount = () => {
    setEditingAccount(null);
    setShowAccountModal(true);
  };
  const handleOpenEditAccount = (account: Account) => {
    setEditingAccount(account);
    setShowAccountModal(true);
  };
  const handleSaveAccount = (accountData: Omit<Account, 'id'> | Account) => {
    if ('id' in accountData) {
      // Editing existing account
      setAccounts(prev => prev.map(acc => acc.id === accountData.id ? accountData : acc));
    } else {
      // Adding new account
      const newAccount: Account = {
        id: Date.now().toString(),
        country: accountData.country,
        accountType: accountData.accountType,
        details: accountData.details
      };
      setAccounts(prev => [...prev, newAccount]);
    }
  };
  const handleDeleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
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
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Business</h1>
          <p className="text-gray-600">Manage your business operations, rates, and performance metrics</p>
        </div>

        {/* Business Overview Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-emerald-600" />
                <p className="text-xs font-medium text-emerald-900">Transfers</p>
              </div>
              <p className="text-xl font-bold text-emerald-900">{totalTransfers}</p>
              <p className="text-xs text-emerald-700 mt-0.5">Total completed transfers</p>
            </div>

            <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-medium text-blue-900">Volume</p>
              </div>
              <p className="text-xl font-bold text-blue-900">${totalVolume}</p>
              <p className="text-xs text-blue-700 mt-0.5">Across all transactions</p>
            </div>

            <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <p className="text-xs font-medium text-green-900">Commission</p>
              </div>
              <p className="text-xl font-bold text-green-900">${totalEarnings}</p>
              <p className="text-xs text-green-700 mt-0.5">Total earnings to date</p>
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

                      {/* Delivery Time Display */}
                      {rate.deliveryTime && rate.deliveryTimeUnit && <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-xs text-gray-600">Delivery Time</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {rate.deliveryTime} {rate.deliveryTimeUnit}
                              </p>
                            </div>
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

          {/* Check Live Exchange Rates Button */}
          <div className="flex justify-center mt-6">
            <button onClick={() => {
            // Scroll to Exchange Rate Tool section below
            const exchangeRateSection = document.getElementById('exchange-rate-tool-section');
            if (exchangeRateSection) {
              exchangeRateSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }} className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl">
              <TrendingUp size={18} />
              Check Live Exchange Rates
            </button>
          </div>
        </div>

        {/* Volume Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Available Cash</h2>
              <p className="text-sm text-gray-600 mt-1">Your available funds in different currencies for business operations</p>
            </div>
            <button onClick={() => setShowAddCashModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm flex items-center gap-2">
              <DollarSign size={16} />
              Add Available Cash
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Dynamically render available cash entries */}
            {availableCashEntries.map(entry => {
            const countryConfig = getCountryByName(entry.country);
            const currencySymbol = countryConfig?.currency || entry.currency;
            const bgColor = ['from-green-50 to-green-100 border-green-200', 'from-purple-50 to-purple-100 border-purple-200', 'from-blue-50 to-blue-100 border-blue-200', 'from-amber-50 to-amber-100 border-amber-200', 'from-pink-50 to-pink-100 border-pink-200'];
            const iconColor = ['bg-green-600', 'bg-purple-600', 'bg-blue-600', 'bg-amber-600', 'bg-pink-600'];
            const textColor = ['text-green-900', 'text-purple-900', 'text-blue-900', 'text-amber-900', 'text-pink-900'];
            const colorIndex = parseInt(entry.id) % bgColor.length;
            return <div key={entry.id} className={`p-4 bg-gradient-to-br ${bgColor[colorIndex]} rounded-lg border`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 ${iconColor[colorIndex]} rounded-lg flex items-center justify-center`}>
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${textColor[colorIndex]}`}>{countryConfig?.name || entry.country}</p>
                        <p className="text-xs text-gray-700">{entry.currency}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-white/50 rounded-lg transition-all">
                        <Edit2 size={14} className="text-gray-700" />
                      </button>
                      <button onClick={() => {
                    if (confirm('Are you sure you want to remove this cash entry?')) {
                      setAvailableCashEntries(entries => entries.filter(e => e.id !== entry.id));
                    }
                  }} className="p-1.5 hover:bg-white/50 rounded-lg transition-all">
                        <X size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-2xl font-bold ${textColor[colorIndex]}`}>
                    {currencySymbol}{parseFloat(entry.amount).toLocaleString()}
                  </p>
                </div>;
          })}
          </div>
        </div>

        {/* Your Accounts Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Accounts</h2>
              <p className="text-sm text-gray-600 mt-1">Manage all your payment accounts - you can add multiple accounts per country</p>
            </div>
            <button onClick={handleOpenAddAccount} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm flex items-center gap-2">
              <Building2 size={16} />
              Add Account
            </button>
          </div>
          
          {/* Encouraging Message */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-900 mb-2">💡 Safety Tip:</p>
                <p className="text-sm text-green-900">
                  We strongly encourage you to create business bank accounts and mobile money accounts specifically for your agent activities. 
                  This will help keep your personal details private and help separate your business transactions from personal finances. 
                  You can add multiple payment methods for each country (e.g., Bank Account, Zelle, Cash App, and Venmo for the US).
                </p>
              </div>
            </div>
          </div>
          
          {/* Accounts grouped by country */}
          <div className="space-y-6">
            {accounts.length === 0 ? <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No accounts added yet</p>
                <button onClick={handleOpenAddAccount} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm">
                  Add Your First Account
                </button>
              </div> : <>
                {/* Group accounts by country */}
                {Object.entries(accounts.reduce((acc, account) => {
              if (!acc[account.country]) {
                acc[account.country] = [];
              }
              acc[account.country].push(account);
              return acc;
            }, {} as Record<string, Account[]>)).map(([country, countryAccounts]) => <div key={country} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-bold text-gray-900">{country}</h3>
                      <span className="text-sm text-gray-500">({countryAccounts.length} account{countryAccounts.length !== 1 ? 's' : ''})</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {countryAccounts.map(account => <AccountCard key={account.id} account={account} onEdit={handleOpenEditAccount} onDelete={handleDeleteAccount} />)}
                    </div>
                  </div>)}
              </>}
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
        <div className="mb-6" id="exchange-rate-tool-section">
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
                      exchangeAmount: parseFloat(calculatedRate.toFixed(2))
                    });
                  }
                }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="GHS">GHS - Ghanaian Cedi</option>
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
                      exchangeAmount: parseFloat(calculatedRate.toFixed(2))
                    });
                  }
                }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="GHS">GHS - Ghanaian Cedi</option>
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
              // Exact Amount Input
              <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Base Amount
                        </label>
                        <input type="number" value={newRate.baseAmount} onChange={e => setNewRate({
                    ...newRate,
                    baseAmount: parseFloat(e.target.value) || 1
                  })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="1" />
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
                      </div>
                    </>}
                  {(newRate.exchangeAmount > 0 || profitPercent > 0) && <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">Your Rate</p>
                          <p className="text-lg font-bold text-gray-900">
                            1 {newRate.fromCurrency} = {(newRate.exchangeAmount / newRate.baseAmount).toFixed(2)} {newRate.toCurrency}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">Delivery Time</p>
                          <p className="text-lg font-bold text-gray-900">
                            {deliveryTime} {deliveryTimeUnit}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-blue-200">
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${(() => {
                        const officialRate = getOfficialRate(newRate.fromCurrency, newRate.toCurrency);
                        const yourRate = newRate.exchangeAmount / newRate.baseAmount;
                        const isHigher = yourRate > officialRate;
                        return isHigher ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
                      })()}`}>
                              {(() => {
                          const officialRate = getOfficialRate(newRate.fromCurrency, newRate.toCurrency);
                          const yourRate = newRate.exchangeAmount / newRate.baseAmount;
                          const difference = ((yourRate - officialRate) / officialRate * 100).toFixed(2);
                          const isHigher = yourRate > officialRate;
                          return `${isHigher ? '+' : ''}${difference}%`;
                        })()}
                            </div>
                            <span className="text-xs text-gray-600">{(() => {
                          const officialRate = getOfficialRate(newRate.fromCurrency, newRate.toCurrency);
                          const yourRate = newRate.exchangeAmount / newRate.baseAmount;
                          const isHigher = yourRate > officialRate;
                          return isHigher ? 'above' : 'below';
                        })()} market rate</span>
                          </div>
                        </div>
                      </div>
                    </div>}

                  {/* Delivery Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery
                    </label>
                    <p className="text-xs text-gray-600 mb-3">
                      How long can you complete a delivery once you receive the funds?
                    </p>
                    <div className="flex gap-3">
                      <input type="number" value={deliveryTime} onChange={e => setDeliveryTime(parseInt(e.target.value) || 1)} min="1" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter time" />
                      <select value={deliveryTimeUnit} onChange={e => setDeliveryTimeUnit(e.target.value as 'Minutes' | 'Hours' | 'Days')} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[120px]">
                        <option value="Minutes">Minutes</option>
                        <option value="Hours">Hours</option>
                        <option value="Days">Days</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Confirmation Section */}
                  {(newRate.exchangeAmount > 0 || profitPercent > 0) && deliveryTime > 0 && <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-green-900 mb-3">Please Confirm Your Rate Details:</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                              <span className="text-sm text-gray-700">Exchange Rate:</span>
                              <span className="text-sm font-bold text-gray-900">
                                1 {newRate.fromCurrency} = {(newRate.exchangeAmount / newRate.baseAmount).toFixed(2)} {newRate.toCurrency}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                              <span className="text-sm text-gray-700">Delivery Time:</span>
                              <span className="text-sm font-bold text-gray-900">
                                {deliveryTime} {deliveryTimeUnit}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                              <span className="text-sm text-gray-700">Official Rate:</span>
                              <span className="text-sm font-bold text-gray-900">
                                1 {newRate.fromCurrency} = {getOfficialRate(newRate.fromCurrency, newRate.toCurrency).toFixed(2)} {newRate.toCurrency}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}
                </> :
            // Tiered Pricing Mode
            <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount Tiers
                  </label>
                  <div className="space-y-3">
                    {rateTiers.map((tier, index) => {
                  const officialRate = getOfficialRate(newRate.fromCurrency, newRate.toCurrency);
                  const tierRate = tier.profitPercent > 0 ? officialRate * (1 - tier.profitPercent / 100) : tier.exchangeRate;
                  return <div key={index} className="p-4 bg-white rounded-lg border-2 border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-900">Tier {index + 1}</p>
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
                        }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Max Amount ($)
                              </label>
                              <input type="number" value={tier.maxAmount || ''} onChange={e => {
                          const newTiers = [...rateTiers];
                          newTiers[index].maxAmount = e.target.value ? parseFloat(e.target.value) : null;
                          setRateTiers(newTiers);
                        }} placeholder="No limit" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
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
                          setRateTiers(newTiers);
                        }} step="0.1" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm" />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                            </div>
                          </div>
                          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Calculated Rate:</p>
                            <p className="text-sm font-semibold text-gray-900">
                              1 {newRate.fromCurrency} = {tierRate.toFixed(2)} {newRate.toCurrency}
                            </p>
                          </div>
                        </div>;
                })}
                  </div>
                  
                  {/* Delivery Section for Tiered Pricing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery
                    </label>
                    <p className="text-xs text-gray-600 mb-3">
                      How long can you complete a delivery once you receive the funds?
                    </p>
                    <div className="flex gap-3">
                      <input type="number" value={deliveryTime} onChange={e => setDeliveryTime(parseInt(e.target.value) || 1)} min="1" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter time" />
                      <select value={deliveryTimeUnit} onChange={e => setDeliveryTimeUnit(e.target.value as 'Minutes' | 'Hours' | 'Days')} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[120px]">
                        <option value="Minutes">Minutes</option>
                        <option value="Hours">Hours</option>
                        <option value="Days">Days</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Confirmation Section for Tiered Pricing */}
                  {rateTiers.some(tier => tier.profitPercent > 0) && deliveryTime > 0 && <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-green-900 mb-3">Please Confirm Your Rate Details:</p>
                          <div className="space-y-2">
                            <div className="p-2 bg-white/60 rounded">
                              <p className="text-xs text-gray-600 mb-1">Tiered Exchange Rates:</p>
                              {rateTiers.map((tier, idx) => {
                          const officialRate = getOfficialRate(newRate.fromCurrency, newRate.toCurrency);
                          const tierRate = tier.profitPercent > 0 ? officialRate * (1 - tier.profitPercent / 100) : tier.exchangeRate;
                          return <div key={idx} className="text-xs text-gray-900 ml-2">
                                    • {tier.maxAmount ? `$${tier.minAmount.toLocaleString()} - $${tier.maxAmount.toLocaleString()}` : `Above $${tier.minAmount.toLocaleString()}`}: 
                                    <span className="font-bold ml-1">
                                      1 {newRate.fromCurrency} = {tierRate.toFixed(2)} {newRate.toCurrency}
                                    </span>
                                  </div>;
                        })}
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                              <span className="text-sm text-gray-700">Delivery Time:</span>
                              <span className="text-sm font-bold text-gray-900">
                                {deliveryTime} {deliveryTimeUnit}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                              <span className="text-sm text-gray-700">Official Rate:</span>
                              <span className="text-sm font-bold text-gray-900">
                                1 {newRate.fromCurrency} = {getOfficialRate(newRate.fromCurrency, newRate.toCurrency).toFixed(2)} {newRate.toCurrency}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}
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

        {/* Account Modal */}
        <AccountModal isOpen={showAccountModal} onClose={() => setShowAccountModal(false)} onSave={handleSaveAccount} editingAccount={editingAccount} />
      </div>
    </div>;
}