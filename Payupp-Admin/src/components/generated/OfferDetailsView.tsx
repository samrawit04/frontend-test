import React, { useState } from 'react';
import { ArrowRight, Star, ShieldCheck, Clock, TrendingUp, Info, Building2, Smartphone, Banknote } from 'lucide-react';
interface Offer {
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
  exchangeRate: number;
  fee: string | number;
  deliveryTime: string;
  verified: boolean;
  availableMethods?: string[];
}
interface OfferDetailsViewProps {
  offer: Offer;
  onProceed: (amount: string) => void;
  onBack: () => void;
}
export const OfferDetailsView: React.FC<OfferDetailsViewProps> = ({
  offer,
  onProceed,
  onBack
}) => {
  const [sendAmount, setSendAmount] = useState('1000');
  const feeAmount = typeof offer.fee === 'string' ? parseFloat(offer.fee.replace(/[^0-9.]/g, '')) : offer.fee;
  const receiveAmount = (parseFloat(sendAmount || '0') - feeAmount) * offer.exchangeRate;
  const handleProceed = () => {
    if (sendAmount && parseFloat(sendAmount) > 0) {
      onProceed(sendAmount);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button onClick={onBack} className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2">
          ← Back to offers
        </button>

        {/* Combined Single Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {offer.agentName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">{offer.agentName}</h2>
                  {offer.verified && <ShieldCheck size={16} className="text-blue-600" />}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star size={12} fill="currentColor" className="text-orange-500" />
                  <span className="font-semibold">{offer.rating}</span>
                  <span className="text-gray-400">({offer.reviewCount})</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock size={14} />
                <span>{offer.deliveryTime}</span>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{offer.fromFlag}</span>
              <span className="text-sm font-medium text-gray-700">{offer.fromCountry}</span>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
            <div className="flex items-center gap-2">
              <span className="text-2xl">{offer.toFlag}</span>
              <span className="text-sm font-medium text-gray-700">{offer.toCountry}</span>
            </div>
          </div>

          {/* Payment Methods */}
          {offer.availableMethods && offer.availableMethods.length > 0 && <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Available Payment Methods</div>
              <div className="flex gap-2 flex-wrap">
                {offer.availableMethods.includes('bank_transfer') && <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                    <Building2 size={12} />
                    Bank
                  </div>}
                {offer.availableMethods.includes('cash_pickup') && <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    <Banknote size={12} />
                    Cash
                  </div>}
                {offer.availableMethods.includes('mobile_money') && <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                    <Smartphone size={12} />
                    Mobile
                  </div>}
              </div>
            </div>}

          <h3 className="text-lg font-bold text-gray-900 mb-4">How much do you want to send?</h3>

          {/* Send Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">You send</label>
            <div className="relative">
              <input type="number" value={sendAmount} onChange={e => setSendAmount(e.target.value)} placeholder="Enter amount" className="w-full text-2xl font-bold text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-600">{offer.fromCurrency}</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount to send</span>
              <span className="font-semibold text-gray-900">
                {parseFloat(sendAmount || '0').toLocaleString()} {offer.fromCurrency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transfer fee</span>
              <span className="font-semibold text-gray-900">
                -{feeAmount.toFixed(2)} {offer.fromCurrency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Exchange rate</span>
              <span className="font-semibold text-gray-900">
                1 {offer.fromCurrency} = {offer.exchangeRate} {offer.toCurrency}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Recipient gets</span>
                <span className="text-xl font-bold text-blue-600">
                  {receiveAmount.toFixed(2)} {offer.toCurrency}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button onClick={handleProceed} disabled={!sendAmount || parseFloat(sendAmount) <= 0} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            Continue to Transfer
            <ArrowRight size={20} />
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            Estimated delivery: {offer.deliveryTime}
          </p>
          <p className="text-xs text-blue-700 text-center">
            P2P is open to all payment corridors and countries.
          </p>
        </div>
      </div>
    </div>;
};