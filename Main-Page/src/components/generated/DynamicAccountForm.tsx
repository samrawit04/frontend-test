"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { getCountryByName, PaymentMethodConfig } from "./CountryData";
export interface DynamicAccountFormProps {
  country: string;
  accountType: string;
  onFieldsChange: (details: string) => void;
  existingDetails?: string;
}
export default function DynamicAccountForm({
  country,
  accountType,
  onFieldsChange,
  existingDetails = ""
}: DynamicAccountFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const isInitialMount = useRef(true);
  const previousAccountType = useRef(accountType);
  const previousCountry = useRef(country);

  // Get country configuration
  const countryConfig = getCountryByName(country);
  const paymentConfig = countryConfig?.paymentMethods[accountType];

  // Parse existing details ONLY on initial mount or when switching back to a pre-filled form
  useEffect(() => {
    // Clear form when country or account type changes
    if (previousAccountType.current !== accountType || previousCountry.current !== country) {
      setFormData({});
      previousAccountType.current = accountType;
      previousCountry.current = country;
      return;
    }

    // Only parse existing details on initial mount if they exist
    if (isInitialMount.current && existingDetails && paymentConfig) {
      const parsed: Record<string, string> = {};
      paymentConfig.fields.forEach(field => {
        const regex = new RegExp(`${field.label}:\\s*(.+?)(?=\\s*\\||$)`, 'i');
        const match = existingDetails.match(regex);
        if (match) {
          parsed[field.name] = match[1].trim();
        }
      });
      setFormData(parsed);
      isInitialMount.current = false;
    }
  }, [existingDetails, paymentConfig, accountType, country]);

  // Memoize the onFieldsChange callback to prevent unnecessary re-renders
  const memoizedOnFieldsChange = useCallback(onFieldsChange, []);

  // Update parent component when form data changes
  useEffect(() => {
    if (paymentConfig) {
      const detailsString = paymentConfig.fields.map(field => {
        const value = formData[field.name] || '';
        return value ? `${field.label}: ${value}` : '';
      }).filter(Boolean).join(' | ');
      memoizedOnFieldsChange(detailsString);
    }
  }, [formData, paymentConfig, memoizedOnFieldsChange]);
  if (!countryConfig) {
    return <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          Please select a country first to see available payment methods.
        </p>
      </div>;
  }
  if (!paymentConfig) {
    return <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          Please select an account type to see required fields.
        </p>
      </div>;
  }
  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  return <div className="space-y-4">
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900 font-medium">
          Required fields for {accountType} in {country}
        </p>
      </div>

      {paymentConfig.fields.map(field => <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            {field.prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {field.prefix}
              </span>}
            <input type={field.type} value={formData[field.name] || ''} onChange={e => handleFieldChange(field.name, e.target.value)} placeholder={field.placeholder} required={field.required} className={`w-full ${field.prefix ? 'pl-8' : 'pl-4'} pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
          </div>
        </div>)}
    </div>;
}