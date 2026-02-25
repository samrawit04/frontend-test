"use client";

import React from 'react';
import { ArrowLeft, DollarSign, TrendingDown, Info, Calculator } from 'lucide-react';
interface PlatformFeeScheduleProps {
  onBack?: () => void;
}

// Calculate fees based on transfer amount using the same logic from ReceiveMoneyFlow
const calculateFeesForAmount = (amount: number) => {
  let agentCommissionPercent = 0;
  let platformFeePercent = 0;

  // Agent Commission: Linear interpolation between $50 (2.5%) and $1,000,000 (1.1%)
  if (amount <= 50) {
    agentCommissionPercent = 2.5;
  } else if (amount >= 1000000) {
    agentCommissionPercent = 1.1;
  } else {
    const x1 = 50;
    const x2 = 1000000;
    const y1 = 2.5;
    const y2 = 1.1;
    agentCommissionPercent = y1 + (amount - x1) * (y2 - y1) / (x2 - x1);
  }

  // Platform Fee: Linear interpolation between $50 (0.5%) and $1,000,000 (0.2%)
  if (amount <= 50) {
    platformFeePercent = 0.5;
  } else if (amount >= 1000000) {
    platformFeePercent = 0.2;
  } else {
    const x1 = 51;
    const x2 = 999999;
    const y1 = 0.5;
    const y2 = 0.2;
    platformFeePercent = y1 + (amount - x1) * (y2 - y1) / (x2 - x1);
  }
  const totalPercent = agentCommissionPercent + platformFeePercent;
  return {
    agentCommissionPercent: parseFloat(agentCommissionPercent.toFixed(3)),
    platformFeePercent: parseFloat(platformFeePercent.toFixed(3)),
    totalPercent: parseFloat(totalPercent.toFixed(3))
  };
};
export const PlatformFeeSchedule: React.FC<PlatformFeeScheduleProps> = ({
  onBack
}) => {
  // Define key milestones for the table
  const milestones = [50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
  const feeData = milestones.map(amount => ({
    amount,
    ...calculateFeesForAmount(amount)
  }));
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          {onBack && <button onClick={onBack} className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2 text-sm transition-colors">
              <ArrowLeft size={18} />
              Back
            </button>}
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calculator className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Platform Fee Schedule</h1>
                <p className="text-gray-600 text-sm mb-4">
                  Transparent pricing structure for agents. Our fees scale dynamically based on transaction amount, 
                  rewarding higher volume transfers with better rates.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <TrendingDown className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1 text-sm">Dynamic Fee Scaling</h3>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Fees are calculated using <strong>linear interpolation</strong> between key milestones. 
                        As transaction amounts increase, both agent commission and platform fees decrease proportionally, 
                        making larger transfers more profitable for agents.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Breakdown Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Agent Commission Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Agent Commission</h3>
                <p className="text-xs text-gray-600">Your earnings per transaction</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="text-gray-700">At $50 or less:</span>
                <span className="font-bold text-green-600">2.500%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-700">At $1,000,000+:</span>
                <span className="font-bold text-green-600">1.100%</span>
              </div>
              <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
                Linear decrease between $50 and $1,000,000
              </div>
            </div>
          </div>

          {/* Platform Fee Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calculator className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Platform Fee</h3>
                <p className="text-xs text-gray-600">Service charge per transaction</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                <span className="text-gray-700">At $50 or less:</span>
                <span className="font-bold text-purple-600">0.500%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-700">At $1,000,000+:</span>
                <span className="font-bold text-purple-600">0.200%</span>
              </div>
              <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
                Linear decrease between $51 and $999,999
              </div>
            </div>
          </div>
        </div>

        {/* Fee Schedule Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Info className="text-blue-600" size={20} />
              Detailed Fee Schedule
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Reference table showing fees at key transaction amounts
            </p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                    Transaction Amount
                  </th>
                  <th className="text-right py-3 px-6 text-sm font-semibold text-gray-700">
                    Agent Commission %
                  </th>
                  <th className="text-right py-3 px-6 text-sm font-semibold text-gray-700">
                    Platform Fee %
                  </th>
                  <th className="text-right py-3 px-6 text-sm font-semibold text-gray-700">
                    Total Fees %
                  </th>
                </tr>
              </thead>
              <tbody>
                {feeData.map((row, index) => <tr key={row.amount} className={`border-b border-gray-100 transition-colors hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="py-3 px-6">
                      <span className="font-semibold text-gray-900">{formatCurrency(row.amount)}</span>
                      <span className="text-gray-500 text-sm ml-2">(${row.amount.toLocaleString()})</span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                        {row.agentCommissionPercent.toFixed(3)}%
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                        {row.platformFeePercent.toFixed(3)}%
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                        {row.totalPercent.toFixed(3)}%
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {feeData.map((row, index) => <div key={row.amount} className={`p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <div className="font-bold text-gray-900 mb-3 text-base">
                  {formatCurrency(row.amount)}
                  <span className="text-gray-500 text-sm font-normal ml-2">
                    (${row.amount.toLocaleString()})
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Agent Commission</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {row.agentCommissionPercent.toFixed(3)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Platform Fee</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      {row.platformFeePercent.toFixed(3)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Total Fees</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      {row.totalPercent.toFixed(3)}%
                    </span>
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="text-amber-600" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm">How It Works</h3>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                  <span>
                    Fees are calculated automatically for each transaction based on the exact transfer amount.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                  <span>
                    Agent commission is your earnings and is paid to you after the transaction completes.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                  <span>
                    Platform fees are deducted to maintain and improve the service infrastructure.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                  <span>
                    Amounts between milestones use linear interpolation for fair, transparent pricing.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default PlatformFeeSchedule;