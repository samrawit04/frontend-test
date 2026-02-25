"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { X, AlertCircle, Plus, Trash2 } from "lucide-react";
import SearchableCountryDropdown from "./SearchableCountryDropdown";
import DynamicAccountForm from "./DynamicAccountForm";
import { getCountryByName } from "./CountryData";
export interface Account {
  id: string;
  country: string;
  accountType: string;
  details: string;
}
export interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<Account, 'id'> | Account) => void;
  editingAccount?: Account | null;
}
interface AccountTypeEntry {
  tempId: string;
  accountType: string;
  details: string;
}
export default function AccountModal({
  isOpen,
  onClose,
  onSave,
  editingAccount = null
}: AccountModalProps) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [accountEntries, setAccountEntries] = useState<AccountTypeEntry[]>([{
    tempId: Date.now().toString(),
    accountType: '',
    details: ''
  }]);

  // Populate form when editing
  useEffect(() => {
    if (editingAccount) {
      setSelectedCountry(editingAccount.country);
      setAccountEntries([{
        tempId: Date.now().toString(),
        accountType: editingAccount.accountType,
        details: editingAccount.details
      }]);
    } else {
      setSelectedCountry('');
      setAccountEntries([{
        tempId: Date.now().toString(),
        accountType: '',
        details: ''
      }]);
    }
  }, [editingAccount, isOpen]);
  const handleAddAnotherAccountType = () => {
    setAccountEntries(prev => [...prev, {
      tempId: Date.now().toString(),
      accountType: '',
      details: ''
    }]);
  };
  const handleRemoveAccountType = (tempId: string) => {
    if (accountEntries.length > 1) {
      setAccountEntries(prev => prev.filter(entry => entry.tempId !== tempId));
    }
  };
  const handleAccountTypeChange = (tempId: string, accountType: string) => {
    setAccountEntries(prev => prev.map(entry => entry.tempId === tempId ? {
      ...entry,
      accountType,
      details: ''
    } : entry));
  };
  const handleDetailsChange = (tempId: string, details: string) => {
    setAccountEntries(prev => prev.map(entry => entry.tempId === tempId ? {
      ...entry,
      details
    } : entry));
  };
  const handleSave = () => {
    if (!selectedCountry) {
      alert('Please select a country');
      return;
    }

    // Validate all entries
    const validEntries = accountEntries.filter(entry => entry.accountType && entry.details);
    if (validEntries.length === 0) {
      alert('Please fill in at least one complete account with type and details');
      return;
    }
    if (validEntries.length < accountEntries.length) {
      const confirmSave = confirm('Some accounts are incomplete. Do you want to save only the complete accounts?');
      if (!confirmSave) return;
    }
    if (editingAccount) {
      // When editing, only save the first entry (editing mode doesn't support multiple)
      onSave({
        id: editingAccount.id,
        country: selectedCountry,
        accountType: validEntries[0].accountType,
        details: validEntries[0].details
      });
    } else {
      // Save all valid entries as separate accounts
      validEntries.forEach(entry => {
        onSave({
          country: selectedCountry,
          accountType: entry.accountType,
          details: entry.details
        });
      });
    }

    // Reset form
    setSelectedCountry('');
    setAccountEntries([{
      tempId: Date.now().toString(),
      accountType: '',
      details: ''
    }]);
    onClose();
  };
  const handleCancel = () => {
    setSelectedCountry('');
    setAccountEntries([{
      tempId: Date.now().toString(),
      accountType: '',
      details: ''
    }]);
    onClose();
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {editingAccount ? 'Edit Account' : 'Add Account(s)'}
          </h3>
          <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          {editingAccount ? 'Update your account details below.' : 'Add one or multiple account types for your selected country. You can add different payment methods like Bank Account, Mobile Money, and others all at once.'}
        </p>

        <div className="space-y-6">
          {/* Country Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <SearchableCountryDropdown value={selectedCountry} onChange={country => {
            setSelectedCountry(country);
            // Reset all account entries when country changes
            setAccountEntries([{
              tempId: Date.now().toString(),
              accountType: '',
              details: ''
            }]);
          }} placeholder="Search and select country..." />
          </div>

          {/* Account Type Entries */}
          {accountEntries.map((entry, index) => {
          const isRequestPaymentType = entry.accountType.toLowerCase().includes('request payment');
          return <div key={entry.tempId} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 space-y-4">
                {/* Header with remove button */}
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">
                    Account Type {accountEntries.length > 1 ? `#${index + 1}` : ''}
                  </h4>
                  {accountEntries.length > 1 && <button onClick={() => handleRemoveAccountType(entry.tempId)} className="p-1.5 hover:bg-white/50 rounded-lg transition-all text-red-600" title="Remove this account type">
                      <Trash2 size={16} />
                    </button>}
                </div>

                {/* Account Type Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  {!selectedCountry ? <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed">
                      Please select a country first
                    </div> : <select value={entry.accountType} onChange={e => handleAccountTypeChange(entry.tempId, e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select type...</option>
                      {selectedCountry && (() => {
                  const countryConfig = getCountryByName(selectedCountry);
                  return countryConfig ? Object.keys(countryConfig.paymentMethods).map(method => <option key={method} value={method}>
                                {method}
                              </option>) : null;
                })()}
                    </select>}
                </div>

                {/* Info box for Request Payment types */}
                {isRequestPaymentType && <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-blue-900 mb-1">
                          💡 Request For Payment Option
                        </p>
                        <p className="text-xs text-blue-900">
                          This payment method means the sender will send their mobile money number or fintech ID, 
                          and you (the agent) will send them a payment request to approve.
                        </p>
                      </div>
                    </div>
                  </div>}

                {/* Dynamic Account Form */}
                {selectedCountry && entry.accountType && <DynamicAccountForm country={selectedCountry} accountType={entry.accountType} existingDetails={entry.details} onFieldsChange={details => handleDetailsChange(entry.tempId, details)} />}
              </div>;
        })}

          {/* Add Another Account Type Button */}
          {!editingAccount && selectedCountry && <button onClick={handleAddAnotherAccountType} className="w-full px-4 py-3 border-2 border-dashed border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium text-sm flex items-center justify-center gap-2">
              <Plus size={18} />
              Add Another Account Type
            </button>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button onClick={handleCancel} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium">
            {editingAccount ? 'Update Account' : `Add ${accountEntries.filter(e => e.accountType && e.details).length || ''} Account${accountEntries.filter(e => e.accountType && e.details).length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>;
}