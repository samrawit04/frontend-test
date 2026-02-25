import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Clock, Star, DollarSign, TrendingUp, CheckCircle2, Building2, Smartphone, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
interface TransferOffer {
  id: string;
  fromCountry: string;
  toCountry: string;
  fromFlag: string;
  toFlag: string;
  fromCurrency: string;
  toCurrency: string;
  agentName: string;
  rating: number;
  reviewCount: number;
  amount: string;
  exchangeRate: number;
  fee: string;
  deliveryTime: string;
  verified: boolean;
}
const TRANSFER_OFFERS: TransferOffer[] = [
// African to African (30%)
{
  id: '1',
  fromCountry: 'Ghana',
  toCountry: 'Kenya',
  fromFlag: '🇬🇭',
  toFlag: '🇰🇪',
  fromCurrency: 'GHS',
  toCurrency: 'KES',
  agentName: 'AfricaPay Connect',
  rating: 4.8,
  reviewCount: 892,
  amount: '150,000',
  exchangeRate: 19.5,
  fee: 'KES 500',
  deliveryTime: '1-2 hours',
  verified: true
}, {
  id: '2',
  fromCountry: 'Nigeria',
  toCountry: 'South Africa',
  fromFlag: '🇳🇬',
  toFlag: '🇿🇦',
  fromCurrency: 'NGN',
  toCurrency: 'ZAR',
  agentName: 'Sahara Direct',
  rating: 4.7,
  reviewCount: 645,
  amount: '25,000',
  exchangeRate: 0.024,
  fee: 'ZAR 150',
  deliveryTime: '30-45 mins',
  verified: true
}, {
  id: '3',
  fromCountry: 'Ghana',
  toCountry: 'Mauritius',
  fromFlag: '🇬🇭',
  toFlag: '🇲🇺',
  fromCurrency: 'GHS',
  toCurrency: 'MUR',
  agentName: 'Island Transfer Plus',
  rating: 4.9,
  reviewCount: 523,
  amount: '50,000',
  exchangeRate: 5.8,
  fee: 'MUR 200',
  deliveryTime: 'Same day',
  verified: true
},
// African to International (70%)
{
  id: '4',
  fromCountry: 'Ghana',
  toCountry: 'United States',
  fromFlag: '🇬🇭',
  toFlag: '🇺🇸',
  fromCurrency: 'GHS',
  toCurrency: 'USD',
  agentName: 'Global Express Ltd.',
  rating: 4.9,
  reviewCount: 1240,
  amount: '5,000',
  exchangeRate: 0.095,
  fee: 'USD 15',
  deliveryTime: '15-30 mins',
  verified: true
}, {
  id: '5',
  fromCountry: 'Ghana',
  toCountry: 'United States',
  fromFlag: '🇬🇭',
  toFlag: '🇺🇸',
  fromCurrency: 'GHS',
  toCurrency: 'USD',
  agentName: 'SwiftPay Connect',
  rating: 4.7,
  reviewCount: 856,
  amount: '3,500',
  exchangeRate: 0.093,
  fee: 'USD 10',
  deliveryTime: '1-2 hours',
  verified: true
}, {
  id: '6',
  fromCountry: 'Kenya',
  toCountry: 'Canada',
  fromFlag: '🇰🇪',
  toFlag: '🇨🇦',
  fromCurrency: 'KES',
  toCurrency: 'CAD',
  agentName: 'East Africa Direct',
  rating: 4.7,
  reviewCount: 542,
  amount: '1,200',
  exchangeRate: 0.0095,
  fee: 'CAD 30',
  deliveryTime: 'Same day',
  verified: true
}, {
  id: '7',
  fromCountry: 'South Africa',
  toCountry: 'Australia',
  fromFlag: '🇿🇦',
  toFlag: '🇦🇺',
  fromCurrency: 'ZAR',
  toCurrency: 'AUD',
  agentName: 'TransWorld Money',
  rating: 4.9,
  reviewCount: 1105,
  amount: '850',
  exchangeRate: 0.088,
  fee: 'AUD 20',
  deliveryTime: 'Instant',
  verified: true
}, {
  id: '8',
  fromCountry: 'Egypt',
  toCountry: 'Germany',
  fromFlag: '🇪🇬',
  toFlag: '🇩🇪',
  fromCurrency: 'EGP',
  toCurrency: 'EUR',
  agentName: 'Euro Connect Plus',
  rating: 4.6,
  reviewCount: 678,
  amount: '500',
  exchangeRate: 0.020,
  fee: '€15',
  deliveryTime: '2-4 hours',
  verified: true
}, {
  id: '9',
  fromCountry: 'Morocco',
  toCountry: 'France',
  fromFlag: '🇲🇦',
  toFlag: '🇫🇷',
  fromCurrency: 'MAD',
  toCurrency: 'EUR',
  agentName: 'MaghrebPay',
  rating: 4.8,
  reviewCount: 923,
  amount: '1,800',
  exchangeRate: 0.094,
  fee: '€12',
  deliveryTime: '30-60 mins',
  verified: true
}, {
  id: '10',
  fromCountry: 'Tanzania',
  toCountry: 'United Kingdom',
  fromFlag: '🇹🇿',
  toFlag: '🇬🇧',
  fromCurrency: 'TZS',
  toCurrency: 'GBP',
  agentName: 'Kilimanjaro Transfer',
  rating: 4.7,
  reviewCount: 445,
  amount: '650',
  exchangeRate: 0.00033,
  fee: '£18',
  deliveryTime: '1-3 hours',
  verified: true
}];
interface BrowseOffersProps {
  onSelectAgent?: (offer: TransferOffer) => void;
}
export const BrowseOffers = ({
  onSelectAgent
}: BrowseOffersProps) => {
  const [offers] = useState(TRANSFER_OFFERS.slice(0, 10));
  const [selectedFilter, setSelectedFilter] = useState('all');
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Browse Transfer Offers
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Found {offers.length} agents for your transfer
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Filters</h3>
              <div className="space-y-2">
                <button onClick={() => setSelectedFilter('all')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                  All methods
                </button>
                <button onClick={() => setSelectedFilter('bank')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'bank' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                  Bank transfer
                </button>
                <button onClick={() => setSelectedFilter('cash')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'cash' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                  Cash pickup
                </button>
                <button onClick={() => setSelectedFilter('mobile')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'mobile' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                  Mobile money
                </button>
              </div>
            </div>
          </div>

          {/* Offers List */}
          <div className="flex-1 space-y-4">
            {offers.map(offer => {
            return <motion.div key={offer.id} initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="p-4 sm:p-5">
                    {/* Agent Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {offer.agentName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                              {offer.agentName}
                            </h3>
                            {offer.verified && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                Premium
                              </span>}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star size={14} fill="currentColor" className="text-orange-400" />
                            <span className="font-semibold text-gray-900">{offer.rating}</span>
                            <span className="text-gray-500">({offer.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Offer Description - Tweet Style with Pills */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center flex-wrap gap-2 text-sm sm:text-base text-gray-700">
                        <span className="font-medium">Can send</span>
                        <span className="px-3 py-1.5 rounded-full border-2 border-pink-600 text-pink-600 font-semibold">
                          {offer.toCurrency} {offer.amount}
                        </span>
                        <span className="font-medium">from</span>
                        <span className="px-3 py-1.5 rounded-full border-2 border-pink-600 text-pink-600 font-semibold">
                          {offer.fromFlag} {offer.fromCountry}
                        </span>
                        <span className="font-medium">to</span>
                        <span className="px-3 py-1.5 rounded-full border-2 border-pink-600 text-pink-600 font-semibold">
                          {offer.toFlag} {offer.toCountry}
                        </span>
                      </div>
                    </div>

                    {/* Payment Methods and Delivery Time */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          <Building2 size={14} />
                          Bank
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                          <DollarSign size={14} />
                          Cash
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                          <Smartphone size={14} />
                          Mobile
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs sm:text-sm font-medium whitespace-nowrap">
                        <Clock size={14} className="text-blue-600" />
                        {offer.deliveryTime}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button onClick={() => onSelectAgent?.(offer)} className="w-full bg-blue-600 text-white text-base sm:text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      Select agent
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>;
          })}
          </div>
        </div>

        {/* Protection Banner */}
        <div className="mt-6 bg-blue-600 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShieldCheck size={24} className="text-white" />
            <h3 className="text-lg font-bold text-white">We take security seriously</h3>
          </div>
          <p className="text-blue-100 text-sm max-w-2xl mx-auto">
            Both senders and agents go through our security check system. We keep adding to this.
          </p>
        </div>
      </div>
    </div>;
};

// Add ShieldCheck import
const ShieldCheck = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>;