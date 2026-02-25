"use client";

import * as React from "react";
import { Edit2, X, MapPin, Building2, AlertCircle } from "lucide-react";
export interface Account {
  id: string;
  country: string;
  accountType: string;
  details: string;
}
export interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}
export default function AccountCard({
  account,
  onEdit,
  onDelete
}: AccountCardProps) {
  // Check if this is a "Request Payment" type account
  const isRequestPayment = account.accountType.toLowerCase().includes('request payment');
  return <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
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
            <p className="text-sm text-gray-700 font-medium mb-1">{account.accountType}</p>
            <p className="text-sm text-gray-600">{account.details}</p>
            
            {/* Show info box for Request Payment accounts */}
            {isRequestPayment && <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900 mb-1">Payment Request Method</p>
                    <p className="text-xs text-blue-800">
                      With this option, senders will provide their mobile money number or fintech ID, 
                      and you'll send them a payment request which they'll approve to complete the transaction.
                    </p>
                  </div>
                </div>
              </div>}
          </div>
        </div>
        <div className="flex gap-2 ml-2">
          <button onClick={() => onEdit(account)} className="p-2 hover:bg-white/70 rounded-lg transition-all" title="Edit account">
            <Edit2 size={16} className="text-blue-600" />
          </button>
          <button onClick={() => {
          if (confirm('Are you sure you want to remove this account?')) {
            onDelete(account.id);
          }
        }} className="p-2 hover:bg-white/70 rounded-lg transition-all" title="Delete account">
            <X size={16} className="text-red-600" />
          </button>
        </div>
      </div>
    </div>;
}