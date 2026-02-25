// Country-specific payment options
// Each country shows: most popular option, 1 bank, and another fintech option

export interface PaymentOption {
  name: string;
  type: 'mobile' | 'bank' | 'fintech';
  popular?: boolean; // Mark the most popular option
}

export const PAYMENT_OPTIONS_BY_COUNTRY: Record<string, PaymentOption[]> = {
  // African Countries
  'Ghana': [
    { name: 'MTN Momo', type: 'mobile', popular: true },
    { name: 'Ecobank', type: 'bank' },
    { name: 'Telecel Cash', type: 'fintech' }
  ],
  'Nigeria': [
    { name: 'OPay', type: 'mobile', popular: true },
    { name: 'GTBank', type: 'bank' },
    { name: 'Flutterwave', type: 'fintech' }
  ],
  'Kenya': [
    { name: 'M-Pesa', type: 'mobile', popular: true },
    { name: 'Equity Bank', type: 'bank' },
    { name: 'Airtel Money', type: 'fintech' }
  ],
  'South Africa': [
    { name: 'SnapScan', type: 'mobile', popular: true },
    { name: 'Standard Bank', type: 'bank' },
    { name: 'Yoco', type: 'fintech' }
  ],
  'Uganda': [
    { name: 'MTN Mobile Money', type: 'mobile', popular: true },
    { name: 'Stanbic Bank', type: 'bank' },
    { name: 'Airtel Money', type: 'fintech' }
  ],
  'Tanzania': [
    { name: 'M-Pesa', type: 'mobile', popular: true },
    { name: 'CRDB Bank', type: 'bank' },
    { name: 'Tigo Pesa', type: 'fintech' }
  ],
  'Rwanda': [
    { name: 'MTN Mobile Money', type: 'mobile', popular: true },
    { name: 'Bank of Kigali', type: 'bank' },
    { name: 'Airtel Money', type: 'fintech' }
  ],
  'Egypt': [
    { name: 'Vodafone Cash', type: 'mobile', popular: true },
    { name: 'National Bank of Egypt', type: 'bank' },
    { name: 'Fawry', type: 'fintech' }
  ],
  'Morocco': [
    { name: 'CIH Mobile', type: 'mobile', popular: true },
    { name: 'Attijariwafa Bank', type: 'bank' },
    { name: 'Wafacash', type: 'fintech' }
  ],
  'Ethiopia': [
    { name: 'M-Birr', type: 'mobile', popular: true },
    { name: 'Commercial Bank of Ethiopia', type: 'bank' },
    { name: 'HelloCash', type: 'fintech' }
  ],
  'Zambia': [
    { name: 'MTN Mobile Money', type: 'mobile', popular: true },
    { name: 'Zanaco', type: 'bank' },
    { name: 'Airtel Money', type: 'fintech' }
  ],
  'Botswana': [
    { name: 'Orange Money', type: 'mobile', popular: true },
    { name: 'First National Bank', type: 'bank' },
    { name: 'MyZaka', type: 'fintech' }
  ],
  'Mauritius': [
    { name: 'My.t Money', type: 'mobile', popular: true },
    { name: 'MCB', type: 'bank' },
    { name: 'Juice', type: 'fintech' }
  ],

  // North America
  'United States': [
    { name: 'Venmo', type: 'fintech', popular: true },
    { name: 'Chase Bank', type: 'bank' },
    { name: 'CashApp', type: 'fintech' }
  ],
  'USA': [
    { name: 'Venmo', type: 'fintech', popular: true },
    { name: 'Chase Bank', type: 'bank' },
    { name: 'CashApp', type: 'fintech' }
  ],
  'Canada': [
    { name: 'Interac e-Transfer', type: 'fintech', popular: true },
    { name: 'TD Bank', type: 'bank' },
    { name: 'PayPal', type: 'fintech' }
  ],
  'Mexico': [
    { name: 'OXXO Pay', type: 'fintech', popular: true },
    { name: 'BBVA México', type: 'bank' },
    { name: 'Mercado Pago', type: 'fintech' }
  ],

  // Europe
  'United Kingdom': [
    { name: 'Revolut', type: 'fintech', popular: true },
    { name: 'HSBC', type: 'bank' },
    { name: 'Monzo', type: 'fintech' }
  ],
  'UK': [
    { name: 'Revolut', type: 'fintech', popular: true },
    { name: 'HSBC', type: 'bank' },
    { name: 'Monzo', type: 'fintech' }
  ],
  'Germany': [
    { name: 'PayPal', type: 'fintech', popular: true },
    { name: 'Deutsche Bank', type: 'bank' },
    { name: 'N26', type: 'fintech' }
  ],
  'France': [
    { name: 'PayPal', type: 'fintech', popular: true },
    { name: 'BNP Paribas', type: 'bank' },
    { name: 'Lydia', type: 'fintech' }
  ],
  'Spain': [
    { name: 'Bizum', type: 'mobile', popular: true },
    { name: 'Banco Santander', type: 'bank' },
    { name: 'Verse', type: 'fintech' }
  ],
  'Italy': [
    { name: 'Satispay', type: 'mobile', popular: true },
    { name: 'Intesa Sanpaolo', type: 'bank' },
    { name: 'PayPal', type: 'fintech' }
  ],
  'Netherlands': [
    { name: 'iDEAL', type: 'fintech', popular: true },
    { name: 'ING', type: 'bank' },
    { name: 'Tikkie', type: 'fintech' }
  ],
  'Sweden': [
    { name: 'Swish', type: 'mobile', popular: true },
    { name: 'Swedbank', type: 'bank' },
    { name: 'Klarna', type: 'fintech' }
  ],
  'Norway': [
    { name: 'Vipps', type: 'mobile', popular: true },
    { name: 'DNB', type: 'bank' },
    { name: 'PayPal', type: 'fintech' }
  ],
  'Denmark': [
    { name: 'MobilePay', type: 'mobile', popular: true },
    { name: 'Danske Bank', type: 'bank' },
    { name: 'PayPal', type: 'fintech' }
  ],
  'Poland': [
    { name: 'BLIK', type: 'mobile', popular: true },
    { name: 'PKO Bank Polski', type: 'bank' },
    { name: 'PayPal', type: 'fintech' }
  ],
  'Switzerland': [
    { name: 'TWINT', type: 'mobile', popular: true },
    { name: 'UBS', type: 'bank' },
    { name: 'Revolut', type: 'fintech' }
  ],

  // Asia
  'India': [
    { name: 'UPI', type: 'mobile', popular: true },
    { name: 'ICICI Bank', type: 'bank' },
    { name: 'Paytm', type: 'fintech' }
  ],
  'China': [
    { name: 'WeChat Pay', type: 'mobile', popular: true },
    { name: 'Bank of China', type: 'bank' },
    { name: 'Alipay', type: 'fintech' }
  ],
  'Japan': [
    { name: 'PayPay', type: 'mobile', popular: true },
    { name: 'Mitsubishi UFJ', type: 'bank' },
    { name: 'Line Pay', type: 'fintech' }
  ],
  'South Korea': [
    { name: 'KakaoPay', type: 'mobile', popular: true },
    { name: 'KB Kookmin Bank', type: 'bank' },
    { name: 'Toss', type: 'fintech' }
  ],
  'Singapore': [
    { name: 'PayNow', type: 'mobile', popular: true },
    { name: 'DBS Bank', type: 'bank' },
    { name: 'GrabPay', type: 'fintech' }
  ],
  'Philippines': [
    { name: 'GCash', type: 'mobile', popular: true },
    { name: 'BDO', type: 'bank' },
    { name: 'PayMaya', type: 'fintech' }
  ],
  'Thailand': [
    { name: 'PromptPay', type: 'mobile', popular: true },
    { name: 'Bangkok Bank', type: 'bank' },
    { name: 'TrueMoney', type: 'fintech' }
  ],
  'Malaysia': [
    { name: 'Touch \'n Go eWallet', type: 'mobile', popular: true },
    { name: 'Maybank', type: 'bank' },
    { name: 'GrabPay', type: 'fintech' }
  ],
  'Indonesia': [
    { name: 'GoPay', type: 'mobile', popular: true },
    { name: 'Bank Mandiri', type: 'bank' },
    { name: 'OVO', type: 'fintech' }
  ],
  'Vietnam': [
    { name: 'MoMo', type: 'mobile', popular: true },
    { name: 'Vietcombank', type: 'bank' },
    { name: 'ZaloPay', type: 'fintech' }
  ],
  'Pakistan': [
    { name: 'Easypaisa', type: 'mobile', popular: true },
    { name: 'HBL', type: 'bank' },
    { name: 'JazzCash', type: 'fintech' }
  ],
  'Bangladesh': [
    { name: 'bKash', type: 'mobile', popular: true },
    { name: 'Dutch-Bangla Bank', type: 'bank' },
    { name: 'Nagad', type: 'fintech' }
  ],

  // Middle East
  'United Arab Emirates': [
    { name: 'Payit', type: 'mobile', popular: true },
    { name: 'Emirates NBD', type: 'bank' },
    { name: 'Beam', type: 'fintech' }
  ],
  'Saudi Arabia': [
    { name: 'STC Pay', type: 'mobile', popular: true },
    { name: 'Al Rajhi Bank', type: 'bank' },
    { name: 'Mada Pay', type: 'fintech' }
  ],
  'Qatar': [
    { name: 'QNB Mobile', type: 'mobile', popular: true },
    { name: 'Qatar National Bank', type: 'bank' },
    { name: 'Ooredoo Money', type: 'fintech' }
  ],
  'Kuwait': [
    { name: 'KNet', type: 'mobile', popular: true },
    { name: 'National Bank of Kuwait', type: 'bank' },
    { name: 'Tap', type: 'fintech' }
  ],
  'Israel': [
    { name: 'Bit', type: 'mobile', popular: true },
    { name: 'Bank Hapoalim', type: 'bank' },
    { name: 'Pepper', type: 'fintech' }
  ],

  // South America
  'Brazil': [
    { name: 'Pix', type: 'mobile', popular: true },
    { name: 'Banco do Brasil', type: 'bank' },
    { name: 'PicPay', type: 'fintech' }
  ],
  'Argentina': [
    { name: 'Mercado Pago', type: 'fintech', popular: true },
    { name: 'Banco Nación', type: 'bank' },
    { name: 'Ualá', type: 'fintech' }
  ],
  'Chile': [
    { name: 'Khipu', type: 'mobile', popular: true },
    { name: 'Banco de Chile', type: 'bank' },
    { name: 'Mach', type: 'fintech' }
  ],
  'Colombia': [
    { name: 'Nequi', type: 'mobile', popular: true },
    { name: 'Bancolombia', type: 'bank' },
    { name: 'Daviplata', type: 'fintech' }
  ],
  'Peru': [
    { name: 'Yape', type: 'mobile', popular: true },
    { name: 'BCP', type: 'bank' },
    { name: 'Plin', type: 'fintech' }
  ],

  // Oceania
  'Australia': [
    { name: 'PayID', type: 'fintech', popular: true },
    { name: 'Commonwealth Bank', type: 'bank' },
    { name: 'PayPal', type: 'fintech' }
  ],
  'New Zealand': [
    { name: 'POLi', type: 'fintech', popular: true },
    { name: 'ANZ', type: 'bank' },
    { name: 'PayPal', type: 'fintech' }
  ],

  // Default fallback
  'Default': [
    { name: 'Bank Transfer', type: 'bank', popular: true },
    { name: 'International Bank', type: 'bank' },
    { name: 'Mobile Money', type: 'mobile' }
  ]
};

// Helper function to get payment options for a country
export const getPaymentOptionsForCountry = (country: string): PaymentOption[] => {
  return PAYMENT_OPTIONS_BY_COUNTRY[country] || PAYMENT_OPTIONS_BY_COUNTRY['Default'];
};

// Helper function to format payment options as a readable string
export const formatPaymentOptions = (country: string): string => {
  const options = getPaymentOptionsForCountry(country);
  return options.map(opt => opt.name).join(', ');
};
