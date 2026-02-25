"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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

  // Get country configuration
  const countryConfig = getCountryByName(country);
  const paymentConfig = countryConfig?.paymentMethods[accountType];

  // Parse existing details when component mounts or when existingDetails changes
  useEffect(() => {
    if (existingDetails && paymentConfig) {
      const parsed: Record<string, string> = {};

      // Try to parse old format with labels (e.g., "Account Name: John | Bank: Chase")
      paymentConfig.fields.forEach(field => {
        const regex = new RegExp(`${field.label}:\\s*(.+?)(?=\\s*\\||$)`, 'i');
        const match = existingDetails.match(regex);
        if (match) {
          parsed[field.name] = match[1].trim();
        }
      });

      // If no fields were parsed (new format), try simple comma-separated parsing
      if (Object.keys(parsed).length === 0 && existingDetails) {
        const values = existingDetails.split(',').map(v => v.trim());
        paymentConfig.fields.forEach((field, index) => {
          if (values[index]) {
            parsed[field.name] = values[index];
          }
        });
      }
      setFormData(parsed);
    }
  }, [existingDetails, paymentConfig]);

  // Update parent component when form data changes
  useEffect(() => {
    if (paymentConfig) {
      const detailsString = paymentConfig.fields.map(field => formData[field.name] || '').filter(Boolean).join(', ');
      onFieldsChange(detailsString);
    }
  }, [formData, paymentConfig, onFieldsChange]);
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
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
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