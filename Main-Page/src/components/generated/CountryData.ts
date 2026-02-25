// Comprehensive country list with payment method configurations

export interface PaymentMethodConfig {
  type: string;
  fields: {
    name: string;
    label: string;
    placeholder: string;
    prefix?: string;
    required: boolean;
    type: 'text' | 'number' | 'email';
  }[];
}

export interface CountryConfig {
  name: string;
  code: string;
  region: string;
  currency: string;
  paymentMethods: {
    [key: string]: PaymentMethodConfig;
  };
}

export const COUNTRIES: CountryConfig[] = [
  // North America
  {
    name: 'United States',
    code: 'US',
    region: 'North America',
    currency: 'USD',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'John Doe', required: true, type: 'text' },
          { name: 'routingNumber', label: 'Routing Number', placeholder: '021000021', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '1234567890', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Chase Bank', required: true, type: 'text' },
        ],
      },
      'Cash App': {
        type: 'Cash App',
        fields: [
          { name: 'cashAppId', label: 'Cash App ID', placeholder: '$username', prefix: '$', required: true, type: 'text' },
        ],
      },
      'Zelle': {
        type: 'Zelle',
        fields: [
          { name: 'email', label: 'Email or Phone', placeholder: 'user@example.com', required: true, type: 'text' },
        ],
      },
      'Venmo': {
        type: 'Venmo',
        fields: [
          { name: 'venmoId', label: 'Venmo ID', placeholder: '@username', prefix: '@', required: true, type: 'text' },
        ],
      },
      'PayPal': {
        type: 'PayPal',
        fields: [
          { name: 'email', label: 'PayPal Email', placeholder: 'user@example.com', required: true, type: 'email' },
        ],
      },
    },
  },
  {
    name: 'Canada',
    code: 'CA',
    region: 'North America',
    currency: 'CAD',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'John Doe', required: true, type: 'text' },
          { name: 'transitNumber', label: 'Transit Number', placeholder: '12345', required: true, type: 'text' },
          { name: 'institutionNumber', label: 'Institution Number', placeholder: '001', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '1234567', required: true, type: 'text' },
        ],
      },
      'Interac': {
        type: 'Interac',
        fields: [
          { name: 'email', label: 'Email', placeholder: 'user@example.com', required: true, type: 'email' },
        ],
      },
    },
  },
  {
    name: 'Mexico',
    code: 'MX',
    region: 'North America',
    currency: 'MXN',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Carlos García', required: true, type: 'text' },
          { name: 'clabe', label: 'CLABE', placeholder: '012345678901234567', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'BBVA, Santander', required: true, type: 'text' },
        ],
      },
    },
  },

  // Africa - North Africa
  {
    name: 'Algeria',
    code: 'DZ',
    region: 'Africa',
    currency: 'DZD',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Egypt',
    code: 'EG',
    region: 'Africa',
    currency: 'EGP',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'National Bank of Egypt', required: true, type: 'text' },
        ],
      },
      'Mobile Wallet': {
        type: 'Mobile Wallet',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: '+20 10 1234 5678', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Vodafone Cash, Etisalat Cash', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Libya',
    code: 'LY',
    region: 'Africa',
    currency: 'LYD',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Morocco',
    code: 'MA',
    region: 'Africa',
    currency: 'MAD',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Attijariwafa Bank', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Tunisia',
    code: 'TN',
    region: 'Africa',
    currency: 'TND',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },

  // Africa - West Africa
  {
    name: 'Benin',
    code: 'BJ',
    region: 'Africa',
    currency: 'XOF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'MTN, Moov', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Burkina Faso',
    code: 'BF',
    region: 'Africa',
    currency: 'XOF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Orange Money, Moov', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Cape Verde',
    code: 'CV',
    region: 'Africa',
    currency: 'CVE',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Côte d\'Ivoire',
    code: 'CI',
    region: 'Africa',
    currency: 'XOF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Orange Money, MTN', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Gambia',
    code: 'GM',
    region: 'Africa',
    currency: 'GMD',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Ghana',
    code: 'GH',
    region: 'Africa',
    currency: 'GHS',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Kofi Mensah', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '0123456789', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'GCB Bank', required: true, type: 'text' },
          { name: 'branch', label: 'Branch', placeholder: 'Accra Main Branch', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: '+233 24 123 4567', required: true, type: 'text' },
          { name: 'network', label: 'Network', placeholder: 'MTN, Vodafone, AirtelTigo', required: true, type: 'text' },
          { name: 'accountName', label: 'Account Name', placeholder: 'Kofi Mensah', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Guinea',
    code: 'GN',
    region: 'Africa',
    currency: 'GNF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Orange Money, MTN', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Guinea-Bissau',
    code: 'GW',
    region: 'Africa',
    currency: 'XOF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Liberia',
    code: 'LR',
    region: 'Africa',
    currency: 'LRD',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Orange Money, MTN', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Mali',
    code: 'ML',
    region: 'Africa',
    currency: 'XOF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Orange Money, Moov', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Mauritania',
    code: 'MR',
    region: 'Africa',
    currency: 'MRU',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Niger',
    code: 'NE',
    region: 'Africa',
    currency: 'XOF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Orange Money, Moov', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Nigeria',
    code: 'NG',
    region: 'Africa',
    currency: 'NGN',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Adeola Williams', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '0123456789', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'GTBank', required: true, type: 'text' },
        ],
      },
      'Flutterwave': {
        type: 'Flutterwave',
        fields: [
          { name: 'email', label: 'Email', placeholder: 'user@example.com', required: true, type: 'email' },
        ],
      },
      'Paystack': {
        type: 'Paystack',
        fields: [
          { name: 'email', label: 'Email', placeholder: 'user@example.com', required: true, type: 'email' },
        ],
      },
    },
  },
  {
    name: 'Senegal',
    code: 'SN',
    region: 'Africa',
    currency: 'XOF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Orange Money, Free Money', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Sierra Leone',
    code: 'SL',
    region: 'Africa',
    currency: 'SLL',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Orange Money, Afrimoney', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Togo',
    code: 'TG',
    region: 'Africa',
    currency: 'XOF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'T-Money, Flooz', required: true, type: 'text' },
        ],
      },
    },
  },

  // Africa - Central Africa
  {
    name: 'Cameroon',
    code: 'CM',
    region: 'Africa',
    currency: 'XAF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Orange Money, MTN', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Central African Republic',
    code: 'CF',
    region: 'Africa',
    currency: 'XAF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Chad',
    code: 'TD',
    region: 'Africa',
    currency: 'XAF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Congo (Brazzaville)',
    code: 'CG',
    region: 'Africa',
    currency: 'XAF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Congo (Kinshasa)',
    code: 'CD',
    region: 'Africa',
    currency: 'CDF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'M-Pesa, Orange Money', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Equatorial Guinea',
    code: 'GQ',
    region: 'Africa',
    currency: 'XAF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Gabon',
    code: 'GA',
    region: 'Africa',
    currency: 'XAF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'São Tomé and Príncipe',
    code: 'ST',
    region: 'Africa',
    currency: 'STN',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },

  // Africa - East Africa
  {
    name: 'Burundi',
    code: 'BI',
    region: 'Africa',
    currency: 'BIF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Comoros',
    code: 'KM',
    region: 'Africa',
    currency: 'KMF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Djibouti',
    code: 'DJ',
    region: 'Africa',
    currency: 'DJF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Eritrea',
    code: 'ER',
    region: 'Africa',
    currency: 'ERN',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    region: 'Africa',
    currency: 'ETB',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Commercial Bank of Ethiopia', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Telebirr', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Kenya',
    code: 'KE',
    region: 'Africa',
    currency: 'KES',
    paymentMethods: {
      'M-Pesa': {
        type: 'M-Pesa',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: '+254 712 345 678', required: true, type: 'text' },
          { name: 'accountName', label: 'Account Name', placeholder: 'Jane Mwangi', required: true, type: 'text' },
        ],
      },
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Jane Mwangi', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '0123456789', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Equity Bank, KCB', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Madagascar',
    code: 'MG',
    region: 'Africa',
    currency: 'MGA',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Malawi',
    code: 'MW',
    region: 'Africa',
    currency: 'MWK',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Mauritius',
    code: 'MU',
    region: 'Africa',
    currency: 'MUR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Mozambique',
    code: 'MZ',
    region: 'Africa',
    currency: 'MZN',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'M-Pesa, Mpesa', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Rwanda',
    code: 'RW',
    region: 'Africa',
    currency: 'RWF',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank of Kigali', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'MTN Mobile Money, Airtel Money', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Seychelles',
    code: 'SC',
    region: 'Africa',
    currency: 'SCR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Somalia',
    code: 'SO',
    region: 'Africa',
    currency: 'SOS',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'South Sudan',
    code: 'SS',
    region: 'Africa',
    currency: 'SSP',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Sudan',
    code: 'SD',
    region: 'Africa',
    currency: 'SDG',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Tanzania',
    code: 'TZ',
    region: 'Africa',
    currency: 'TZS',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'CRDB, NMB', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'M-Pesa, Tigo Pesa, Airtel Money', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Uganda',
    code: 'UG',
    region: 'Africa',
    currency: 'UGX',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Stanbic Bank, Centenary Bank', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'MTN Mobile Money, Airtel Money', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Zambia',
    code: 'ZM',
    region: 'Africa',
    currency: 'ZMW',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'MTN Mobile Money, Airtel Money', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
    region: 'Africa',
    currency: 'ZWL',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'Mobile Money': {
        type: 'Mobile Money',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Phone Number', required: true, type: 'text' },
          { name: 'provider', label: 'Provider', placeholder: 'Ecocash, OneMoney', required: true, type: 'text' },
        ],
      },
    },
  },

  // Africa - Southern Africa
  {
    name: 'Angola',
    code: 'AO',
    region: 'Africa',
    currency: 'AOA',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Botswana',
    code: 'BW',
    region: 'Africa',
    currency: 'BWP',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Eswatini',
    code: 'SZ',
    region: 'Africa',
    currency: 'SZL',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Lesotho',
    code: 'LS',
    region: 'Africa',
    currency: 'LSL',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Namibia',
    code: 'NA',
    region: 'Africa',
    currency: 'NAD',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'South Africa',
    code: 'ZA',
    region: 'Africa',
    currency: 'ZAR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Thabo Mbeki', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '1234567890', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Standard Bank', required: true, type: 'text' },
          { name: 'branchCode', label: 'Branch Code', placeholder: '051001', required: true, type: 'text' },
        ],
      },
    },
  },

  // Europe
  {
    name: 'United Kingdom',
    code: 'GB',
    region: 'Europe',
    currency: 'GBP',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'John Smith', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '12345678', required: true, type: 'text' },
          { name: 'sortCode', label: 'Sort Code', placeholder: '12-34-56', required: true, type: 'text' },
        ],
      },
      'Revolut': {
        type: 'Revolut',
        fields: [
          { name: 'email', label: 'Email', placeholder: 'user@example.com', required: true, type: 'email' },
        ],
      },
      'Wise': {
        type: 'Wise',
        fields: [
          { name: 'email', label: 'Email', placeholder: 'user@example.com', required: true, type: 'email' },
        ],
      },
    },
  },
  {
    name: 'France',
    code: 'FR',
    region: 'Europe',
    currency: 'EUR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Marie Dubois', required: true, type: 'text' },
          { name: 'iban', label: 'IBAN', placeholder: 'FR76 1234 5678 9012 3456 7890 123', required: true, type: 'text' },
          { name: 'bic', label: 'BIC/SWIFT', placeholder: 'BNPAFRPP', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Germany',
    code: 'DE',
    region: 'Europe',
    currency: 'EUR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Hans Mueller', required: true, type: 'text' },
          { name: 'iban', label: 'IBAN', placeholder: 'DE89 3704 0044 0532 0130 00', required: true, type: 'text' },
          { name: 'bic', label: 'BIC/SWIFT', placeholder: 'COBADEFFXXX', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Italy',
    code: 'IT',
    region: 'Europe',
    currency: 'EUR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'iban', label: 'IBAN', placeholder: 'IT60 X054 2811 1010 0000 0123 456', required: true, type: 'text' },
          { name: 'bic', label: 'BIC/SWIFT', placeholder: 'BCITITMMXXX', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Spain',
    code: 'ES',
    region: 'Europe',
    currency: 'EUR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'iban', label: 'IBAN', placeholder: 'ES91 2100 0418 4502 0005 1332', required: true, type: 'text' },
          { name: 'bic', label: 'BIC/SWIFT', placeholder: 'CAIXESBBXXX', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Netherlands',
    code: 'NL',
    region: 'Europe',
    currency: 'EUR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'iban', label: 'IBAN', placeholder: 'NL91 ABNA 0417 1643 00', required: true, type: 'text' },
          { name: 'bic', label: 'BIC/SWIFT', placeholder: 'ABNANL2A', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Poland',
    code: 'PL',
    region: 'Europe',
    currency: 'PLN',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'iban', label: 'IBAN', placeholder: 'PL61 1090 1014 0000 0712 1981 2874', required: true, type: 'text' },
          { name: 'bic', label: 'BIC/SWIFT', placeholder: 'WBKPPLPP', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Russia',
    code: 'RU',
    region: 'Europe',
    currency: 'RUB',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Sberbank', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Turkey',
    code: 'TR',
    region: 'Europe',
    currency: 'TRY',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'iban', label: 'IBAN', placeholder: 'TR33 0006 1005 1978 6457 8413 26', required: true, type: 'text' },
        ],
      },
    },
  },

  // Asia
  {
    name: 'India',
    code: 'IN',
    region: 'Asia',
    currency: 'INR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Rajesh Kumar', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '123456789012', required: true, type: 'text' },
          { name: 'ifscCode', label: 'IFSC Code', placeholder: 'SBIN0001234', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'State Bank of India', required: true, type: 'text' },
        ],
      },
      'UPI': {
        type: 'UPI',
        fields: [
          { name: 'upiId', label: 'UPI ID', placeholder: 'user@paytm', required: true, type: 'text' },
        ],
      },
      'Paytm': {
        type: 'Paytm',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: '+91 98765 43210', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'China',
    code: 'CN',
    region: 'Asia',
    currency: 'CNY',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: '李明', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '6222021234567890123', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'ICBC', required: true, type: 'text' },
        ],
      },
      'Alipay': {
        type: 'Alipay',
        fields: [
          { name: 'alipayId', label: 'Alipay ID', placeholder: 'user@alipay.com', required: true, type: 'text' },
        ],
      },
      'WeChat Pay': {
        type: 'WeChat Pay',
        fields: [
          { name: 'wechatId', label: 'WeChat ID', placeholder: 'wechat_user123', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Japan',
    code: 'JP',
    region: 'Asia',
    currency: 'JPY',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
          { name: 'branchCode', label: 'Branch Code', placeholder: 'Branch Code', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'South Korea',
    code: 'KR',
    region: 'Asia',
    currency: 'KRW',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'KB Bank, Shinhan Bank', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Philippines',
    code: 'PH',
    region: 'Asia',
    currency: 'PHP',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Juan dela Cruz', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '1234567890', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'BDO, BPI, Metrobank', required: true, type: 'text' },
        ],
      },
      'GCash': {
        type: 'GCash',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: '+63 917 123 4567', required: true, type: 'text' },
          { name: 'accountName', label: 'Account Name', placeholder: 'Juan dela Cruz', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Indonesia',
    code: 'ID',
    region: 'Asia',
    currency: 'IDR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'BCA, Mandiri, BRI', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Thailand',
    code: 'TH',
    region: 'Asia',
    currency: 'THB',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bangkok Bank, Kasikorn Bank', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Vietnam',
    code: 'VN',
    region: 'Asia',
    currency: 'VND',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Vietcombank, Techcombank', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Malaysia',
    code: 'MY',
    region: 'Asia',
    currency: 'MYR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Maybank, CIMB', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Singapore',
    code: 'SG',
    region: 'Asia',
    currency: 'SGD',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'DBS, OCBC, UOB', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Pakistan',
    code: 'PK',
    region: 'Asia',
    currency: 'PKR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'HBL, UBL', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    region: 'Asia',
    currency: 'BDT',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
      'bKash': {
        type: 'bKash',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', placeholder: '+880 1711 123456', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    region: 'Asia',
    currency: 'SAR',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'iban', label: 'IBAN', placeholder: 'SA03 8000 0000 6080 1016 7519', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    region: 'Asia',
    currency: 'AED',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'iban', label: 'IBAN', placeholder: 'AE07 0331 2345 6789 0123 456', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Israel',
    code: 'IL',
    region: 'Asia',
    currency: 'ILS',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
          { name: 'branchNumber', label: 'Branch Number', placeholder: 'Branch Number', required: true, type: 'text' },
        ],
      },
    },
  },

  // Oceania
  {
    name: 'Australia',
    code: 'AU',
    region: 'Oceania',
    currency: 'AUD',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'John Smith', required: true, type: 'text' },
          { name: 'bsb', label: 'BSB Number', placeholder: '123-456', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '12345678', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    region: 'Oceania',
    currency: 'NZD',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '12-3456-7890123-00', required: true, type: 'text' },
        ],
      },
    },
  },

  // South America
  {
    name: 'Brazil',
    code: 'BR',
    region: 'South America',
    currency: 'BRL',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'João Silva', required: true, type: 'text' },
          { name: 'bankCode', label: 'Bank Code', placeholder: '001', required: true, type: 'text' },
          { name: 'branchNumber', label: 'Branch Number', placeholder: '1234', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: '12345678-9', required: true, type: 'text' },
        ],
      },
      'Pix': {
        type: 'Pix',
        fields: [
          { name: 'pixKey', label: 'PIX Key', placeholder: 'email, phone, CPF, or random key', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Argentina',
    code: 'AR',
    region: 'South America',
    currency: 'ARS',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'cbu', label: 'CBU', placeholder: '0110599520000001234567', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Chile',
    code: 'CL',
    region: 'South America',
    currency: 'CLP',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Banco de Chile', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Colombia',
    code: 'CO',
    region: 'South America',
    currency: 'COP',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bancolombia', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Peru',
    code: 'PE',
    region: 'South America',
    currency: 'PEN',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'BCP, Interbank', required: true, type: 'text' },
        ],
      },
    },
  },
  {
    name: 'Venezuela',
    code: 'VE',
    region: 'South America',
    currency: 'VES',
    paymentMethods: {
      'Bank Account': {
        type: 'Bank Account',
        fields: [
          { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', required: true, type: 'text' },
          { name: 'accountNumber', label: 'Account Number', placeholder: 'Account Number', required: true, type: 'text' },
          { name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', required: true, type: 'text' },
        ],
      },
    },
  },
];

// Helper function to get country by name
export const getCountryByName = (name: string): CountryConfig | undefined => {
  return COUNTRIES.find(c => c.name.toLowerCase() === name.toLowerCase());
};

// Helper function to search countries
export const searchCountries = (query: string): CountryConfig[] => {
  const lowerQuery = query.toLowerCase();
  return COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.code.toLowerCase().includes(lowerQuery) ||
    c.region.toLowerCase().includes(lowerQuery)
  );
};

// Get all unique regions
export const getRegions = (): string[] => {
  const regions = new Set(COUNTRIES.map(c => c.region));
  return Array.from(regions).sort();
};

// Get countries by region
export const getCountriesByRegion = (region: string): CountryConfig[] => {
  return COUNTRIES.filter(c => c.region === region);
};
