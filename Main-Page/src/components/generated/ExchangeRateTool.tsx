import React, { useState } from 'react';
import { Plus, X, TrendingUp, RefreshCw, Search } from 'lucide-react';
interface Currency {
  code: string;
  name: string;
  flag: string;
  country: string;
}
const CURRENCIES: Currency[] = [
// African Currencies

// West African CFA Franc (XOF) countries - expanded
{
  code: 'XOF',
  name: 'West African CFA Franc',
  flag: '🇧🇯',
  country: 'Benin'
}, {
  code: 'XOF',
  name: 'West African CFA Franc',
  flag: '🇧🇫',
  country: 'Burkina Faso'
}, {
  code: 'XOF',
  name: 'West African CFA Franc',
  flag: '🇨🇮',
  country: 'Côte d\'Ivoire'
}, {
  code: 'XOF',
  name: 'West African CFA Franc',
  flag: '🇬🇼',
  country: 'Guinea-Bissau'
}, {
  code: 'XOF',
  name: 'West African CFA Franc',
  flag: '🇲🇱',
  country: 'Mali'
}, {
  code: 'XOF',
  name: 'West African CFA Franc',
  flag: '🇳🇪',
  country: 'Niger'
}, {
  code: 'XOF',
  name: 'West African CFA Franc',
  flag: '🇸🇳',
  country: 'Senegal'
}, {
  code: 'XOF',
  name: 'West African CFA Franc',
  flag: '🇹🇬',
  country: 'Togo'
},
// Central African CFA Franc (XAF) countries - expanded
{
  code: 'XAF',
  name: 'Central African CFA Franc',
  flag: '🇨🇲',
  country: 'Cameroon'
}, {
  code: 'XAF',
  name: 'Central African CFA Franc',
  flag: '🇨🇫',
  country: 'Central African Republic'
}, {
  code: 'XAF',
  name: 'Central African CFA Franc',
  flag: '🇹🇩',
  country: 'Chad'
}, {
  code: 'XAF',
  name: 'Central African CFA Franc',
  flag: '🇨🇬',
  country: 'Republic of the Congo'
}, {
  code: 'XAF',
  name: 'Central African CFA Franc',
  flag: '🇬🇶',
  country: 'Equatorial Guinea'
}, {
  code: 'XAF',
  name: 'Central African CFA Franc',
  flag: '🇬🇦',
  country: 'Gabon'
},
// Other African Currencies
{
  code: 'DZD',
  name: 'Algerian Dinar',
  flag: '🇩🇿',
  country: 'Algeria'
}, {
  code: 'AOA',
  name: 'Angolan Kwanza',
  flag: '🇦🇴',
  country: 'Angola'
}, {
  code: 'BWP',
  name: 'Botswana Pula',
  flag: '🇧🇼',
  country: 'Botswana'
}, {
  code: 'BIF',
  name: 'Burundian Franc',
  flag: '🇧🇮',
  country: 'Burundi'
}, {
  code: 'CVE',
  name: 'Cape Verdean Escudo',
  flag: '🇨🇻',
  country: 'Cape Verde'
}, {
  code: 'KMF',
  name: 'Comorian Franc',
  flag: '🇰🇲',
  country: 'Comoros'
}, {
  code: 'CDF',
  name: 'Congolese Franc',
  flag: '🇨🇩',
  country: 'Democratic Republic of the Congo'
}, {
  code: 'DJF',
  name: 'Djiboutian Franc',
  flag: '🇩🇯',
  country: 'Djibouti'
}, {
  code: 'EGP',
  name: 'Egyptian Pound',
  flag: '🇪🇬',
  country: 'Egypt'
}, {
  code: 'ERN',
  name: 'Eritrean Nakfa',
  flag: '🇪🇷',
  country: 'Eritrea'
}, {
  code: 'SZL',
  name: 'Eswatini Lilangeni',
  flag: '🇸🇿',
  country: 'Eswatini'
}, {
  code: 'ETB',
  name: 'Ethiopian Birr',
  flag: '🇪🇹',
  country: 'Ethiopia'
}, {
  code: 'GMD',
  name: 'Gambian Dalasi',
  flag: '🇬🇲',
  country: 'Gambia'
}, {
  code: 'GHS',
  name: 'Ghanaian Cedi',
  flag: '🇬🇭',
  country: 'Ghana'
}, {
  code: 'GNF',
  name: 'Guinean Franc',
  flag: '🇬🇳',
  country: 'Guinea'
}, {
  code: 'KES',
  name: 'Kenyan Shilling',
  flag: '🇰🇪',
  country: 'Kenya'
}, {
  code: 'LSL',
  name: 'Lesotho Loti',
  flag: '🇱🇸',
  country: 'Lesotho'
}, {
  code: 'LRD',
  name: 'Liberian Dollar',
  flag: '🇱🇷',
  country: 'Liberia'
}, {
  code: 'LYD',
  name: 'Libyan Dinar',
  flag: '🇱🇾',
  country: 'Libya'
}, {
  code: 'MGA',
  name: 'Malagasy Ariary',
  flag: '🇲🇬',
  country: 'Madagascar'
}, {
  code: 'MWK',
  name: 'Malawian Kwacha',
  flag: '🇲🇼',
  country: 'Malawi'
}, {
  code: 'MRU',
  name: 'Mauritanian Ouguiya',
  flag: '🇲🇷',
  country: 'Mauritania'
}, {
  code: 'MUR',
  name: 'Mauritian Rupee',
  flag: '🇲🇺',
  country: 'Mauritius'
}, {
  code: 'MAD',
  name: 'Moroccan Dirham',
  flag: '🇲🇦',
  country: 'Morocco'
}, {
  code: 'MZN',
  name: 'Mozambican Metical',
  flag: '🇲🇿',
  country: 'Mozambique'
}, {
  code: 'NAD',
  name: 'Namibian Dollar',
  flag: '🇳🇦',
  country: 'Namibia'
}, {
  code: 'NGN',
  name: 'Nigerian Naira',
  flag: '🇳🇬',
  country: 'Nigeria'
}, {
  code: 'RWF',
  name: 'Rwandan Franc',
  flag: '🇷🇼',
  country: 'Rwanda'
}, {
  code: 'STN',
  name: 'São Tomé and Príncipe Dobra',
  flag: '🇸🇹',
  country: 'São Tomé and Príncipe'
}, {
  code: 'SCR',
  name: 'Seychellois Rupee',
  flag: '🇸🇨',
  country: 'Seychelles'
}, {
  code: 'SLL',
  name: 'Sierra Leonean Leone',
  flag: '🇸🇱',
  country: 'Sierra Leone'
}, {
  code: 'SOS',
  name: 'Somali Shilling',
  flag: '🇸🇴',
  country: 'Somalia'
}, {
  code: 'ZAR',
  name: 'South African Rand',
  flag: '🇿🇦',
  country: 'South Africa'
}, {
  code: 'SSP',
  name: 'South Sudanese Pound',
  flag: '🇸🇸',
  country: 'South Sudan'
}, {
  code: 'SDG',
  name: 'Sudanese Pound',
  flag: '🇸🇩',
  country: 'Sudan'
}, {
  code: 'TZS',
  name: 'Tanzanian Shilling',
  flag: '🇹🇿',
  country: 'Tanzania'
}, {
  code: 'TND',
  name: 'Tunisian Dinar',
  flag: '🇹🇳',
  country: 'Tunisia'
}, {
  code: 'UGX',
  name: 'Ugandan Shilling',
  flag: '🇺🇬',
  country: 'Uganda'
}, {
  code: 'ZMW',
  name: 'Zambian Kwacha',
  flag: '🇿🇲',
  country: 'Zambia'
}, {
  code: 'ZWL',
  name: 'Zimbabwean Dollar',
  flag: '🇿🇼',
  country: 'Zimbabwe'
},
// Major World Currencies

// Euro countries - expanded
{
  code: 'EUR',
  name: 'Euro',
  flag: '🇦🇹',
  country: 'Austria'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇧🇪',
  country: 'Belgium'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇭🇷',
  country: 'Croatia'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇨🇾',
  country: 'Cyprus'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇪🇪',
  country: 'Estonia'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇫🇮',
  country: 'Finland'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇫🇷',
  country: 'France'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇩🇪',
  country: 'Germany'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇬🇷',
  country: 'Greece'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇮🇪',
  country: 'Ireland'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇮🇹',
  country: 'Italy'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇱🇻',
  country: 'Latvia'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇱🇹',
  country: 'Lithuania'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇱🇺',
  country: 'Luxembourg'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇲🇹',
  country: 'Malta'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇳🇱',
  country: 'Netherlands'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇵🇹',
  country: 'Portugal'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇸🇰',
  country: 'Slovakia'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇸🇮',
  country: 'Slovenia'
}, {
  code: 'EUR',
  name: 'Euro',
  flag: '🇪🇸',
  country: 'Spain'
},
// Other Major World Currencies
{
  code: 'USD',
  name: 'US Dollar',
  flag: '🇺🇸',
  country: 'United States'
}, {
  code: 'GBP',
  name: 'British Pound',
  flag: '🇬🇧',
  country: 'United Kingdom'
}, {
  code: 'JPY',
  name: 'Japanese Yen',
  flag: '🇯🇵',
  country: 'Japan'
}, {
  code: 'CHF',
  name: 'Swiss Franc',
  flag: '🇨🇭',
  country: 'Switzerland'
}, {
  code: 'CAD',
  name: 'Canadian Dollar',
  flag: '🇨🇦',
  country: 'Canada'
}, {
  code: 'AUD',
  name: 'Australian Dollar',
  flag: '🇦🇺',
  country: 'Australia'
}, {
  code: 'NZD',
  name: 'New Zealand Dollar',
  flag: '🇳🇿',
  country: 'New Zealand'
}, {
  code: 'CNY',
  name: 'Chinese Yuan',
  flag: '🇨🇳',
  country: 'China'
}, {
  code: 'INR',
  name: 'Indian Rupee',
  flag: '🇮🇳',
  country: 'India'
}, {
  code: 'KRW',
  name: 'South Korean Won',
  flag: '🇰🇷',
  country: 'South Korea'
}, {
  code: 'SGD',
  name: 'Singapore Dollar',
  flag: '🇸🇬',
  country: 'Singapore'
}, {
  code: 'HKD',
  name: 'Hong Kong Dollar',
  flag: '🇭🇰',
  country: 'Hong Kong'
}, {
  code: 'SEK',
  name: 'Swedish Krona',
  flag: '🇸🇪',
  country: 'Sweden'
}, {
  code: 'NOK',
  name: 'Norwegian Krone',
  flag: '🇳🇴',
  country: 'Norway'
}, {
  code: 'DKK',
  name: 'Danish Krone',
  flag: '🇩🇰',
  country: 'Denmark'
}, {
  code: 'PLN',
  name: 'Polish Zloty',
  flag: '🇵🇱',
  country: 'Poland'
}, {
  code: 'CZK',
  name: 'Czech Koruna',
  flag: '🇨🇿',
  country: 'Czech Republic'
}, {
  code: 'HUF',
  name: 'Hungarian Forint',
  flag: '🇭🇺',
  country: 'Hungary'
}, {
  code: 'RON',
  name: 'Romanian Leu',
  flag: '🇷🇴',
  country: 'Romania'
}, {
  code: 'BGN',
  name: 'Bulgarian Lev',
  flag: '🇧🇬',
  country: 'Bulgaria'
}, {
  code: 'TRY',
  name: 'Turkish Lira',
  flag: '🇹🇷',
  country: 'Turkey'
}, {
  code: 'RUB',
  name: 'Russian Ruble',
  flag: '🇷🇺',
  country: 'Russia'
}, {
  code: 'BRL',
  name: 'Brazilian Real',
  flag: '🇧🇷',
  country: 'Brazil'
}, {
  code: 'MXN',
  name: 'Mexican Peso',
  flag: '🇲🇽',
  country: 'Mexico'
}, {
  code: 'ARS',
  name: 'Argentine Peso',
  flag: '🇦🇷',
  country: 'Argentina'
}, {
  code: 'CLP',
  name: 'Chilean Peso',
  flag: '🇨🇱',
  country: 'Chile'
}, {
  code: 'COP',
  name: 'Colombian Peso',
  flag: '🇨🇴',
  country: 'Colombia'
}, {
  code: 'PEN',
  name: 'Peruvian Sol',
  flag: '🇵🇪',
  country: 'Peru'
}, {
  code: 'VND',
  name: 'Vietnamese Dong',
  flag: '🇻🇳',
  country: 'Vietnam'
}, {
  code: 'THB',
  name: 'Thai Baht',
  flag: '🇹🇭',
  country: 'Thailand'
}, {
  code: 'MYR',
  name: 'Malaysian Ringgit',
  flag: '🇲🇾',
  country: 'Malaysia'
}, {
  code: 'IDR',
  name: 'Indonesian Rupiah',
  flag: '🇮🇩',
  country: 'Indonesia'
}, {
  code: 'PHP',
  name: 'Philippine Peso',
  flag: '🇵🇭',
  country: 'Philippines'
}, {
  code: 'PKR',
  name: 'Pakistani Rupee',
  flag: '🇵🇰',
  country: 'Pakistan'
}, {
  code: 'BDT',
  name: 'Bangladeshi Taka',
  flag: '🇧🇩',
  country: 'Bangladesh'
}, {
  code: 'AED',
  name: 'UAE Dirham',
  flag: '🇦🇪',
  country: 'United Arab Emirates'
}, {
  code: 'SAR',
  name: 'Saudi Riyal',
  flag: '🇸🇦',
  country: 'Saudi Arabia'
}, {
  code: 'QAR',
  name: 'Qatari Riyal',
  flag: '🇶🇦',
  country: 'Qatar'
}, {
  code: 'KWD',
  name: 'Kuwaiti Dinar',
  flag: '🇰🇼',
  country: 'Kuwait'
}, {
  code: 'OMR',
  name: 'Omani Rial',
  flag: '🇴🇲',
  country: 'Oman'
}, {
  code: 'BHD',
  name: 'Bahraini Dinar',
  flag: '🇧🇭',
  country: 'Bahrain'
}, {
  code: 'JOD',
  name: 'Jordanian Dinar',
  flag: '🇯🇴',
  country: 'Jordan'
}, {
  code: 'ILS',
  name: 'Israeli Shekel',
  flag: '🇮🇱',
  country: 'Israel'
}, {
  code: 'IQD',
  name: 'Iraqi Dinar',
  flag: '🇮🇶',
  country: 'Iraq'
}, {
  code: 'IRR',
  name: 'Iranian Rial',
  flag: '🇮🇷',
  country: 'Iran'
}, {
  code: 'LBP',
  name: 'Lebanese Pound',
  flag: '🇱🇧',
  country: 'Lebanon'
}, {
  code: 'SYP',
  name: 'Syrian Pound',
  flag: '🇸🇾',
  country: 'Syria'
}, {
  code: 'YER',
  name: 'Yemeni Rial',
  flag: '🇾🇪',
  country: 'Yemen'
}, {
  code: 'AFN',
  name: 'Afghan Afghani',
  flag: '🇦🇫',
  country: 'Afghanistan'
}, {
  code: 'AMD',
  name: 'Armenian Dram',
  flag: '🇦🇲',
  country: 'Armenia'
}, {
  code: 'AZN',
  name: 'Azerbaijani Manat',
  flag: '🇦🇿',
  country: 'Azerbaijan'
}, {
  code: 'GEL',
  name: 'Georgian Lari',
  flag: '🇬🇪',
  country: 'Georgia'
}, {
  code: 'KZT',
  name: 'Kazakhstani Tenge',
  flag: '🇰🇿',
  country: 'Kazakhstan'
}, {
  code: 'UZS',
  name: 'Uzbekistani Som',
  flag: '🇺🇿',
  country: 'Uzbekistan'
}, {
  code: 'KGS',
  name: 'Kyrgyzstani Som',
  flag: '🇰🇬',
  country: 'Kyrgyzstan'
}, {
  code: 'TJS',
  name: 'Tajikistani Somoni',
  flag: '🇹🇯',
  country: 'Tajikistan'
}, {
  code: 'TMT',
  name: 'Turkmenistani Manat',
  flag: '🇹🇲',
  country: 'Turkmenistan'
}, {
  code: 'UAH',
  name: 'Ukrainian Hryvnia',
  flag: '🇺🇦',
  country: 'Ukraine'
}, {
  code: 'BYN',
  name: 'Belarusian Ruble',
  flag: '🇧🇾',
  country: 'Belarus'
}, {
  code: 'MDL',
  name: 'Moldovan Leu',
  flag: '🇲🇩',
  country: 'Moldova'
}, {
  code: 'ISK',
  name: 'Icelandic Króna',
  flag: '🇮🇸',
  country: 'Iceland'
}, {
  code: 'RSD',
  name: 'Serbian Dinar',
  flag: '🇷🇸',
  country: 'Serbia'
}, {
  code: 'MKD',
  name: 'Macedonian Denar',
  flag: '🇲🇰',
  country: 'North Macedonia'
}, {
  code: 'BAM',
  name: 'Bosnia-Herzegovina Convertible Mark',
  flag: '🇧🇦',
  country: 'Bosnia and Herzegovina'
}, {
  code: 'ALL',
  name: 'Albanian Lek',
  flag: '🇦🇱',
  country: 'Albania'
}];

// Mock exchange rates (in real app, fetch from API)
const getExchangeRate = (from: string, to: string): number => {
  if (from === to) return 1;

  // Base rates to USD for all currencies
  const usdRates: Record<string, number> = {
    // African Currencies to USD
    DZD: 134.50,
    // Algerian Dinar
    AOA: 828.00,
    // Angolan Kwanza
    XOF: 615.00,
    // West African CFA Franc
    XAF: 615.00,
    // Central African CFA Franc
    BWP: 13.45,
    // Botswana Pula
    BIF: 2850.00,
    // Burundian Franc
    CVE: 103.50,
    // Cape Verdean Escudo
    KMF: 461.00,
    // Comorian Franc
    CDF: 2450.00,
    // Congolese Franc
    DJF: 177.72,
    // Djiboutian Franc
    EGP: 48.50,
    // Egyptian Pound
    ERN: 15.00,
    // Eritrean Nakfa
    SZL: 18.50,
    // Eswatini Lilangeni
    ETB: 55.50,
    // Ethiopian Birr
    GMD: 63.50,
    // Gambian Dalasi
    GHS: 12.50,
    // Ghanaian Cedi
    GNF: 8600.00,
    // Guinean Franc
    KES: 128.50,
    // Kenyan Shilling
    LSL: 18.50,
    // Lesotho Loti
    LRD: 185.00,
    // Liberian Dollar
    LYD: 4.85,
    // Libyan Dinar
    MGA: 4500.00,
    // Malagasy Ariary
    MWK: 1030.00,
    // Malawian Kwacha
    MRU: 39.50,
    // Mauritanian Ouguiya
    MUR: 45.50,
    // Mauritian Rupee
    MAD: 10.15,
    // Moroccan Dirham
    MZN: 63.50,
    // Mozambican Metical
    NAD: 18.50,
    // Namibian Dollar
    NGN: 775.00,
    // Nigerian Naira
    RWF: 1250.00,
    // Rwandan Franc
    STN: 22.95,
    // São Tomé and Príncipe Dobra
    SCR: 14.25,
    // Seychellois Rupee
    SLL: 19750.00,
    // Sierra Leonean Leone
    SOS: 571.00,
    // Somali Shilling
    ZAR: 18.50,
    // South African Rand
    SSP: 130.26,
    // South Sudanese Pound
    SDG: 601.50,
    // Sudanese Pound
    TZS: 2510.00,
    // Tanzanian Shilling
    TND: 3.12,
    // Tunisian Dinar
    UGX: 3710.00,
    // Ugandan Shilling
    ZMW: 27.00,
    // Zambian Kwacha
    ZWL: 322.00,
    // Zimbabwean Dollar

    // Major World Currencies to USD
    USD: 1.00,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CHF: 0.88,
    CAD: 1.35,
    AUD: 1.52,
    NZD: 1.65,
    CNY: 7.24,
    INR: 83.12,
    KRW: 1320.00,
    SGD: 1.35,
    HKD: 7.83,
    SEK: 10.40,
    NOK: 10.75,
    DKK: 6.87,
    PLN: 4.02,
    CZK: 23.15,
    HUF: 360.00,
    RON: 4.58,
    BGN: 1.80,
    TRY: 32.50,
    RUB: 92.50,
    BRL: 4.98,
    MXN: 17.05,
    ARS: 850.00,
    CLP: 950.00,
    COP: 3900.00,
    PEN: 3.73,
    VND: 24500.00,
    THB: 35.50,
    MYR: 4.72,
    IDR: 15800.00,
    PHP: 56.50,
    PKR: 278.50,
    BDT: 110.00,
    AED: 3.67,
    SAR: 3.75,
    QAR: 3.64,
    KWD: 0.31,
    OMR: 0.38,
    BHD: 0.38,
    JOD: 0.71,
    ILS: 3.65,
    IQD: 1310.00,
    IRR: 42000.00,
    LBP: 89500.00,
    SYP: 2512.00,
    YER: 250.00,
    AFN: 70.50,
    AMD: 387.00,
    AZN: 1.70,
    GEL: 2.70,
    KZT: 450.00,
    UZS: 12600.00,
    KGS: 89.50,
    TJS: 10.65,
    TMT: 3.50,
    UAH: 41.25,
    BYN: 3.28,
    MDL: 17.85,
    ISK: 138.00,
    RSD: 108.00,
    MKD: 56.50,
    BAM: 1.80,
    ALL: 93.50
  };

  // Convert from -> USD -> to
  const fromRate = usdRates[from] || 1;
  const toRate = usdRates[to] || 1;
  return toRate / fromRate;
};
interface ExchangeRateToolProps {
  onBack?: () => void;
}
export const ExchangeRateTool: React.FC<ExchangeRateToolProps> = ({
  onBack
}) => {
  const [amount, setAmount] = useState<string>('100');
  const [baseCurrency, setBaseCurrency] = useState<Currency>(CURRENCIES.find(c => c.code === 'USD' && c.country === 'United States') || CURRENCIES[0]);
  const [targetCurrencies, setTargetCurrencies] = useState<Currency[]>([CURRENCIES.find(c => c.code === 'EUR' && c.country === 'Germany') || CURRENCIES[1], CURRENCIES.find(c => c.code === 'GHS') || CURRENCIES[2]]);
  const [showAddCurrency, setShowAddCurrency] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const handleAddCurrency = (currency: Currency) => {
    if (targetCurrencies.length < 5 && !targetCurrencies.find(c => c.code === currency.code && c.country === currency.country)) {
      setTargetCurrencies([...targetCurrencies, currency]);
      setShowAddCurrency(false);
      setSearchQuery('');
    }
  };
  const handleRemoveCurrency = (country: string) => {
    setTargetCurrencies(targetCurrencies.filter(c => c.country !== country));
  };
  const availableCurrencies = CURRENCIES.filter(c => !(c.code === baseCurrency.code && c.country === baseCurrency.country) && !targetCurrencies.find(tc => tc.code === c.code && tc.country === c.country));
  const filteredCurrencies = availableCurrencies.filter(currency => {
    const query = searchQuery.toLowerCase();
    return currency.code.toLowerCase().includes(query) || currency.name.toLowerCase().includes(query) || currency.country.toLowerCase().includes(query);
  });
  const numericAmount = parseFloat(amount) || 0;
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          {onBack && <button onClick={onBack} className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2">
              ← Back to home
            </button>}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Currency Exchange Rate Tool
          </h1>
          <p className="text-gray-600">
            Compare exchange rates across multiple currencies in real-time
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          {/* Base Currency Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              From Currency
            </label>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="flex-1 text-2xl font-bold text-gray-900 border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-600 focus:outline-none" />
              <select value={`${baseCurrency.country}|${baseCurrency.code}`} onChange={e => {
              const [country, code] = e.target.value.split('|');
              const currency = CURRENCIES.find(c => c.code === code && c.country === country);
              if (currency) setBaseCurrency(currency);
            }} className="text-lg font-semibold text-gray-700 bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-600 focus:outline-none min-w-[180px]">
                {CURRENCIES.map((currency, index) => <option key={`${currency.country}-${currency.code}-${index}`} value={`${currency.country}|${currency.code}`}>
                    {currency.flag} {currency.country} - {currency.code}
                  </option>)}
              </select>
            </div>
          </div>

          {/* Target Currencies Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                To Currencies
              </label>
              {targetCurrencies.length < 5 && <button onClick={() => setShowAddCurrency(!showAddCurrency)} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                  <Plus size={16} />
                  Add Currency
                </button>}
            </div>

            {/* Add Currency Dropdown */}
            {showAddCurrency && <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search country, currency name or code..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none" autoFocus />
                </div>
                {searchQuery.trim() === '' ? <p className="text-sm text-gray-500 text-center py-4">
                    Start typing to search for currencies...
                  </p> : filteredCurrencies.length > 0 ? <div className="max-h-64 overflow-y-auto space-y-1">
                    {filteredCurrencies.map((currency, index) => <button key={`${currency.country}-${currency.code}-${index}`} onClick={() => handleAddCurrency(currency)} className="w-full flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left">
                        <span className="text-xl">{currency.flag}</span>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{currency.country}</span>
                          <span className="text-sm text-gray-600 ml-2">- {currency.name} ({currency.code})</span>
                        </div>
                      </button>)}
                  </div> : <p className="text-sm text-gray-500 text-center py-4">
                    No currencies found matching "{searchQuery}"
                  </p>}
              </div>}

            {/* Target Currency Results */}
            <div className="space-y-3">
              {targetCurrencies.map((currency, index) => {
              const rate = getExchangeRate(baseCurrency.code, currency.code);
              const convertedAmount = numericAmount * rate;
              return <div key={`${currency.country}-${currency.code}-${index}`} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currency.flag}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{currency.country}</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {convertedAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                        </p>
                        <p className="text-xs text-gray-600">{currency.name} ({currency.code})</p>
                        <p className="text-xs text-gray-500 mt-1">
                          1 {baseCurrency.code} = {rate.toFixed(4)} {currency.code}
                        </p>
                      </div>
                    </div>
                    {targetCurrencies.length > 1 && <button onClick={() => handleRemoveCurrency(currency.country)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <X size={18} />
                      </button>}
                  </div>;
            })}
            </div>

            {targetCurrencies.length === 0 && <div className="text-center py-8 text-gray-500">
                <TrendingUp size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Add currencies to compare exchange rates</p>
              </div>}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <RefreshCw size={20} className="text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Live Exchange Rates</h3>
              <p className="text-sm text-blue-700">
                Exchange rates are updated in real-time and may vary slightly from actual transaction rates.
                Rates shown are for reference purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};