import React, { useState, useEffect, useRef } from 'react';
import { Search, Star, CheckCircle2, ShieldCheck, Clock, CreditCard, Building2, Banknote, Smartphone, Info, ChevronDown, TrendingUp, Users, Globe, ArrowRight, DollarSign, Zap, Award, MapPin, Send, Receipt, X, Menu, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnnouncementBar } from './AnnouncementBar';
import { BrowseOffers } from './BrowseOffers';
import { OfferDetailsView } from './OfferDetailsView';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';
import { ProfileKYC } from './ProfileKYC';
import BecomeAgentApplication from './BecomeAgentApplication';
import { SendMoneyFlow } from './SendMoneyFlow';
import ProfilePage from './ProfilePage';
import { ChatWidget } from './ChatWidget';
import { ExchangeRateTool } from './ExchangeRateTool';
import { TermsAndPrivacy } from './TermsAndPrivacy';
import { getPaymentOptionsForCountry } from './paymentMethodsByCountry';
import { ContactSupportForm } from './ContactSupportForm';
import { GeneralChatWidget } from './GeneralChatWidget';
import MyBusinessPage from './MyBusinessPage';
import { TransfersPage } from './TransfersPage';

// --- Types ---

type PayoutMethod = 'bank_transfer' | 'mobile_money';
type AgentType = 'all-in-one' | 'sending' | 'receiving';
interface Agent {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  exchangeRate: number;
  fee: number;
  verificationStatus: 'verified' | 'premium';
  availableMethods: PayoutMethod[];
  sendingPaymentMethods?: PayoutMethod[]; // How sender pays the agent (in sending country)
  receivingPaymentMethods?: PayoutMethod[]; // How agent pays recipient (in receiving country)
  location: string;
  responseTime: string;
  type: AgentType;
  sendingCountry?: string;
  receivingCountry?: string;
}
interface Currency {
  name: string;
  code: string;
  flag: string;
  countryName?: string;
}

// --- Currency Data ---

// Sending currencies: African + Major Global
const SENDING_CURRENCIES: Currency[] = [
// Popular African currencies
{
  name: 'Nigerian Naira',
  code: 'NGN',
  flag: '🇳🇬',
  countryName: 'Nigeria'
}, {
  name: 'Ghanaian Cedi',
  code: 'GHS',
  flag: '🇬🇭',
  countryName: 'Ghana'
}, {
  name: 'Kenyan Shilling',
  code: 'KES',
  flag: '🇰🇪',
  countryName: 'Kenya'
}, {
  name: 'South African Rand',
  code: 'ZAR',
  flag: '🇿🇦',
  countryName: 'South Africa'
}, {
  name: 'Ugandan Shilling',
  code: 'UGX',
  flag: '🇺🇬',
  countryName: 'Uganda'
}, {
  name: 'Tanzanian Shilling',
  code: 'TZS',
  flag: '🇹🇿',
  countryName: 'Tanzania'
}, {
  name: 'Egyptian Pound',
  code: 'EGP',
  flag: '🇪🇬',
  countryName: 'Egypt'
}, {
  name: 'Moroccan Dirham',
  code: 'MAD',
  flag: '🇲🇦',
  countryName: 'Morocco'
}, {
  name: 'Ethiopian Birr',
  code: 'ETB',
  flag: '🇪🇹',
  countryName: 'Ethiopia'
},
// West African CFA franc (XOF) - Individual countries
{
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇧🇯',
  countryName: 'Benin'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇧🇫',
  countryName: 'Burkina Faso'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇨🇮',
  countryName: 'Côte d\'Ivoire'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇬🇼',
  countryName: 'Guinea-Bissau'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇲🇱',
  countryName: 'Mali'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇳🇪',
  countryName: 'Niger'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇸🇳',
  countryName: 'Senegal'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇹🇬',
  countryName: 'Togo'
},
// Central African CFA franc (XAF) - Individual countries
{
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇨🇲',
  countryName: 'Cameroon'
}, {
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇨🇫',
  countryName: 'Central African Republic'
}, {
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇹🇩',
  countryName: 'Chad'
}, {
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇨🇬',
  countryName: 'Congo (Brazzaville)'
}, {
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇬🇶',
  countryName: 'Equatorial Guinea'
}, {
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇬🇦',
  countryName: 'Gabon'
}, {
  name: 'Rwandan Franc',
  code: 'RWF',
  flag: '🇷🇼',
  countryName: 'Rwanda'
},
// Major Global currencies
{
  name: 'US Dollar',
  code: 'USD',
  flag: '🇺🇸',
  countryName: 'United States'
},
// Euro (EUR) - Individual European countries
{
  name: 'Euro',
  code: 'EUR',
  flag: '🇦🇹',
  countryName: 'Austria'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇧🇪',
  countryName: 'Belgium'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇭🇷',
  countryName: 'Croatia'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇨🇾',
  countryName: 'Cyprus'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇪🇪',
  countryName: 'Estonia'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇫🇮',
  countryName: 'Finland'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇫🇷',
  countryName: 'France'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇩🇪',
  countryName: 'Germany'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇬🇷',
  countryName: 'Greece'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇮🇪',
  countryName: 'Ireland'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇮🇹',
  countryName: 'Italy'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇱🇻',
  countryName: 'Latvia'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇱🇹',
  countryName: 'Lithuania'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇱🇺',
  countryName: 'Luxembourg'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇲🇹',
  countryName: 'Malta'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇳🇱',
  countryName: 'Netherlands'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇵🇹',
  countryName: 'Portugal'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇸🇰',
  countryName: 'Slovakia'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇸🇮',
  countryName: 'Slovenia'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇪🇸',
  countryName: 'Spain'
}, {
  name: 'British Pound',
  code: 'GBP',
  flag: '🇬🇧',
  countryName: 'United Kingdom'
},
// Additional major world currencies
{
  name: 'Chinese Yuan',
  code: 'CNY',
  flag: '🇨🇳',
  countryName: 'China'
}, {
  name: 'Canadian Dollar',
  code: 'CAD',
  flag: '🇨🇦',
  countryName: 'Canada'
}, {
  name: 'Japanese Yen',
  code: 'JPY',
  flag: '🇯🇵',
  countryName: 'Japan'
}, {
  name: 'Australian Dollar',
  code: 'AUD',
  flag: '🇦🇺',
  countryName: 'Australia'
}, {
  name: 'Swiss Franc',
  code: 'CHF',
  flag: '🇨🇭',
  countryName: 'Switzerland'
}, {
  name: 'Indian Rupee',
  code: 'INR',
  flag: '🇮🇳',
  countryName: 'India'
}, {
  name: 'Mexican Peso',
  code: 'MXN',
  flag: '🇲🇽',
  countryName: 'Mexico'
}, {
  name: 'Brazilian Real',
  code: 'BRL',
  flag: '🇧🇷',
  countryName: 'Brazil'
}, {
  name: 'Singapore Dollar',
  code: 'SGD',
  flag: '🇸🇬',
  countryName: 'Singapore'
}, {
  name: 'Hong Kong Dollar',
  code: 'HKD',
  flag: '🇭🇰',
  countryName: 'Hong Kong'
}, {
  name: 'South Korean Won',
  code: 'KRW',
  flag: '🇰🇷',
  countryName: 'South Korea'
}, {
  name: 'Swedish Krona',
  code: 'SEK',
  flag: '🇸🇪',
  countryName: 'Sweden'
}, {
  name: 'Norwegian Krone',
  code: 'NOK',
  flag: '🇳🇴',
  countryName: 'Norway'
}, {
  name: 'Danish Krone',
  code: 'DKK',
  flag: '🇩🇰',
  countryName: 'Denmark'
}, {
  name: 'New Zealand Dollar',
  code: 'NZD',
  flag: '🇳🇿',
  countryName: 'New Zealand'
}, {
  name: 'Polish Zloty',
  code: 'PLN',
  flag: '🇵🇱',
  countryName: 'Poland'
}, {
  name: 'Thai Baht',
  code: 'THB',
  flag: '🇹🇭',
  countryName: 'Thailand'
}, {
  name: 'Malaysian Ringgit',
  code: 'MYR',
  flag: '🇲🇾',
  countryName: 'Malaysia'
}, {
  name: 'Indonesian Rupiah',
  code: 'IDR',
  flag: '🇮🇩',
  countryName: 'Indonesia'
}, {
  name: 'Philippine Peso',
  code: 'PHP',
  flag: '🇵🇭',
  countryName: 'Philippines'
}, {
  name: 'Turkish Lira',
  code: 'TRY',
  flag: '🇹🇷',
  countryName: 'Turkey'
}, {
  name: 'Russian Ruble',
  code: 'RUB',
  flag: '🇷🇺',
  countryName: 'Russia'
}, {
  name: 'UAE Dirham',
  code: 'AED',
  flag: '🇦🇪',
  countryName: 'United Arab Emirates'
}, {
  name: 'Saudi Riyal',
  code: 'SAR',
  flag: '🇸🇦',
  countryName: 'Saudi Arabia'
},
// Additional major world currencies
{
  name: 'Argentine Peso',
  code: 'ARS',
  flag: '🇦🇷',
  countryName: 'Argentina'
}, {
  name: 'Chilean Peso',
  code: 'CLP',
  flag: '🇨🇱',
  countryName: 'Chile'
}, {
  name: 'Colombian Peso',
  code: 'COP',
  flag: '🇨🇴',
  countryName: 'Colombia'
}, {
  name: 'Peruvian Sol',
  code: 'PEN',
  flag: '🇵🇪',
  countryName: 'Peru'
}, {
  name: 'Vietnamese Dong',
  code: 'VND',
  flag: '🇻🇳',
  countryName: 'Vietnam'
}, {
  name: 'Bangladeshi Taka',
  code: 'BDT',
  flag: '🇧🇩',
  countryName: 'Bangladesh'
}, {
  name: 'Pakistani Rupee',
  code: 'PKR',
  flag: '🇵🇰',
  countryName: 'Pakistan'
}, {
  name: 'Israeli New Shekel',
  code: 'ILS',
  flag: '🇮🇱',
  countryName: 'Israel'
}, {
  name: 'Qatari Riyal',
  code: 'QAR',
  flag: '🇶🇦',
  countryName: 'Qatar'
}, {
  name: 'Kuwaiti Dinar',
  code: 'KWD',
  flag: '🇰🇼',
  countryName: 'Kuwait'
}, {
  name: 'Czech Koruna',
  code: 'CZK',
  flag: '🇨🇿',
  countryName: 'Czech Republic'
}, {
  name: 'Hungarian Forint',
  code: 'HUF',
  flag: '🇭🇺',
  countryName: 'Hungary'
}, {
  name: 'Romanian Leu',
  code: 'RON',
  flag: '🇷🇴',
  countryName: 'Romania'
}, {
  name: 'Bulgarian Lev',
  code: 'BGN',
  flag: '🇧🇬',
  countryName: 'Bulgaria'
}, {
  name: 'Croatian Kuna',
  code: 'HRK',
  flag: '🇭🇷',
  countryName: 'Croatia'
}, {
  name: 'Icelandic Króna',
  code: 'ISK',
  flag: '🇮🇸',
  countryName: 'Iceland'
}, {
  name: 'Bahraini Dinar',
  code: 'BHD',
  flag: '🇧🇭',
  countryName: 'Bahrain'
}, {
  name: 'Jordanian Dinar',
  code: 'JOD',
  flag: '🇯🇴',
  countryName: 'Jordan'
}, {
  name: 'Omani Rial',
  code: 'OMR',
  flag: '🇴🇲',
  countryName: 'Oman'
}, {
  name: 'Lebanese Pound',
  code: 'LBP',
  flag: '🇱🇧',
  countryName: 'Lebanon'
}, {
  name: 'Sri Lankan Rupee',
  code: 'LKR',
  flag: '🇱🇰',
  countryName: 'Sri Lanka'
}, {
  name: 'Nepalese Rupee',
  code: 'NPR',
  flag: '🇳🇵',
  countryName: 'Nepal'
}, {
  name: 'Afghan Afghani',
  code: 'AFN',
  flag: '🇦🇫',
  countryName: 'Afghanistan'
}, {
  name: 'Myanmar Kyat',
  code: 'MMK',
  flag: '🇲🇲',
  countryName: 'Myanmar'
}, {
  name: 'Cambodian Riel',
  code: 'KHR',
  flag: '🇰🇭',
  countryName: 'Cambodia'
}, {
  name: 'Lao Kip',
  code: 'LAK',
  flag: '🇱🇦',
  countryName: 'Laos'
}, {
  name: 'Brunei Dollar',
  code: 'BND',
  flag: '🇧🇳',
  countryName: 'Brunei'
}, {
  name: 'Mongolian Tugrik',
  code: 'MNT',
  flag: '🇲🇳',
  countryName: 'Mongolia'
}, {
  name: 'Maldivian Rufiyaa',
  code: 'MVR',
  flag: '🇲🇻',
  countryName: 'Maldives'
}, {
  name: 'Kazakhstani Tenge',
  code: 'KZT',
  flag: '🇰🇿',
  countryName: 'Kazakhstan'
}, {
  name: 'Uzbekistani Som',
  code: 'UZS',
  flag: '🇺🇿',
  countryName: 'Uzbekistan'
}, {
  name: 'Georgian Lari',
  code: 'GEL',
  flag: '🇬🇪',
  countryName: 'Georgia'
}, {
  name: 'Armenian Dram',
  code: 'AMD',
  flag: '🇦🇲',
  countryName: 'Armenia'
}, {
  name: 'Azerbaijani Manat',
  code: 'AZN',
  flag: '🇦🇿',
  countryName: 'Azerbaijan'
}, {
  name: 'Belarusian Ruble',
  code: 'BYN',
  flag: '🇧🇾',
  countryName: 'Belarus'
}, {
  name: 'Ukrainian Hryvnia',
  code: 'UAH',
  flag: '🇺🇦',
  countryName: 'Ukraine'
}, {
  name: 'Serbian Dinar',
  code: 'RSD',
  flag: '🇷🇸',
  countryName: 'Serbia'
}, {
  name: 'Macedonian Denar',
  code: 'MKD',
  flag: '🇲🇰',
  countryName: 'North Macedonia'
}, {
  name: 'Albanian Lek',
  code: 'ALL',
  flag: '🇦🇱',
  countryName: 'Albania'
}, {
  name: 'Bosnian Mark',
  code: 'BAM',
  flag: '🇧🇦',
  countryName: 'Bosnia and Herzegovina'
}, {
  name: 'Moldovan Leu',
  code: 'MDL',
  flag: '🇲🇩',
  countryName: 'Moldova'
}, {
  name: 'Venezuelan Bolívar',
  code: 'VES',
  flag: '🇻🇪',
  countryName: 'Venezuela'
}, {
  name: 'Uruguayan Peso',
  code: 'UYU',
  flag: '🇺🇾',
  countryName: 'Uruguay'
}, {
  name: 'Paraguayan Guaraní',
  code: 'PYG',
  flag: '🇵🇾',
  countryName: 'Paraguay'
}, {
  name: 'Bolivian Boliviano',
  code: 'BOB',
  flag: '🇧🇴',
  countryName: 'Bolivia'
}, {
  name: 'Ecuadorian Sucre',
  code: 'ECS',
  flag: '🇪🇨',
  countryName: 'Ecuador'
}, {
  name: 'Costa Rican Colón',
  code: 'CRC',
  flag: '🇨🇷',
  countryName: 'Costa Rica'
}, {
  name: 'Guatemalan Quetzal',
  code: 'GTQ',
  flag: '🇬🇹',
  countryName: 'Guatemala'
}, {
  name: 'Honduran Lempira',
  code: 'HNL',
  flag: '🇭🇳',
  countryName: 'Honduras'
}, {
  name: 'Nicaraguan Córdoba',
  code: 'NIO',
  flag: '🇳🇮',
  countryName: 'Nicaragua'
}, {
  name: 'Panamanian Balboa',
  code: 'PAB',
  flag: '🇵🇦',
  countryName: 'Panama'
}, {
  name: 'Dominican Peso',
  code: 'DOP',
  flag: '🇩🇴',
  countryName: 'Dominican Republic'
}, {
  name: 'Jamaican Dollar',
  code: 'JMD',
  flag: '🇯🇲',
  countryName: 'Jamaica'
}, {
  name: 'Trinidad Dollar',
  code: 'TTD',
  flag: '🇹🇹',
  countryName: 'Trinidad and Tobago'
}, {
  name: 'Barbadian Dollar',
  code: 'BBD',
  flag: '🇧🇧',
  countryName: 'Barbados'
}, {
  name: 'Bahamian Dollar',
  code: 'BSD',
  flag: '🇧🇸',
  countryName: 'Bahamas'
}, {
  name: 'East Caribbean Dollar',
  code: 'XCD',
  flag: '🌴',
  countryName: 'East Caribbean'
}, {
  name: 'Haitian Gourde',
  code: 'HTG',
  flag: '🇭🇹',
  countryName: 'Haiti'
}, {
  name: 'Cuban Peso',
  code: 'CUP',
  flag: '🇨🇺',
  countryName: 'Cuba'
}, {
  name: 'Fijian Dollar',
  code: 'FJD',
  flag: '🇫🇯',
  countryName: 'Fiji'
}, {
  name: 'Papua New Guinean Kina',
  code: 'PGK',
  flag: '🇵🇬',
  countryName: 'Papua New Guinea'
}, {
  name: 'Samoan Tala',
  code: 'WST',
  flag: '🇼🇸',
  countryName: 'Samoa'
}, {
  name: 'Tongan Paʻanga',
  code: 'TOP',
  flag: '🇹🇴',
  countryName: 'Tonga'
}, {
  name: 'Vanuatu Vatu',
  code: 'VUV',
  flag: '🇻🇺',
  countryName: 'Vanuatu'
}, {
  name: 'Zimbabwean Dollar',
  code: 'ZWL',
  flag: '🇿🇼',
  countryName: 'Zimbabwe'
}];

// Receiving currencies: Major global settlement currencies
const RECEIVING_CURRENCIES: Currency[] = [
// Popular African currencies
{
  name: 'Nigerian Naira',
  code: 'NGN',
  flag: '🇳🇬',
  countryName: 'Nigeria'
}, {
  name: 'Ghanaian Cedi',
  code: 'GHS',
  flag: '🇬🇭',
  countryName: 'Ghana'
}, {
  name: 'Kenyan Shilling',
  code: 'KES',
  flag: '🇰🇪',
  countryName: 'Kenya'
}, {
  name: 'South African Rand',
  code: 'ZAR',
  flag: '🇿🇦',
  countryName: 'South Africa'
}, {
  name: 'Ugandan Shilling',
  code: 'UGX',
  flag: '🇺🇬',
  countryName: 'Uganda'
}, {
  name: 'Tanzanian Shilling',
  code: 'TZS',
  flag: '🇹🇿',
  countryName: 'Tanzania'
}, {
  name: 'Egyptian Pound',
  code: 'EGP',
  flag: '🇪🇬',
  countryName: 'Egypt'
}, {
  name: 'Moroccan Dirham',
  code: 'MAD',
  flag: '🇲🇦',
  countryName: 'Morocco'
}, {
  name: 'Ethiopian Birr',
  code: 'ETB',
  flag: '🇪🇹',
  countryName: 'Ethiopia'
},
// West African CFA franc (XOF) - Individual countries
{
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇧🇯',
  countryName: 'Benin'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇧🇫',
  countryName: 'Burkina Faso'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇨🇮',
  countryName: 'Côte d\'Ivoire'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇬🇼',
  countryName: 'Guinea-Bissau'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇲🇱',
  countryName: 'Mali'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇳🇪',
  countryName: 'Niger'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇸🇳',
  countryName: 'Senegal'
}, {
  name: 'West African CFA franc',
  code: 'XOF',
  flag: '🇹🇬',
  countryName: 'Togo'
},
// Central African CFA franc (XAF) - Individual countries
{
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇨🇲',
  countryName: 'Cameroon'
}, {
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇨🇫',
  countryName: 'Central African Republic'
}, {
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇹🇩',
  countryName: 'Chad'
}, {
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇨🇬',
  countryName: 'Congo (Brazzaville)'
}, {
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇬🇶',
  countryName: 'Equatorial Guinea'
}, {
  name: 'Central African CFA franc',
  code: 'XAF',
  flag: '🇬🇦',
  countryName: 'Gabon'
}, {
  name: 'Rwandan Franc',
  code: 'RWF',
  flag: '🇷🇼',
  countryName: 'Rwanda'
},
// Major Global currencies
{
  name: 'US Dollar',
  code: 'USD',
  flag: '🇺🇸',
  countryName: 'United States'
},
// Euro (EUR) - Individual European countries
{
  name: 'Euro',
  code: 'EUR',
  flag: '🇦🇹',
  countryName: 'Austria'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇧🇪',
  countryName: 'Belgium'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇭🇷',
  countryName: 'Croatia'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇨🇾',
  countryName: 'Cyprus'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇪🇪',
  countryName: 'Estonia'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇫🇮',
  countryName: 'Finland'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇫🇷',
  countryName: 'France'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇩🇪',
  countryName: 'Germany'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇬🇷',
  countryName: 'Greece'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇮🇪',
  countryName: 'Ireland'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇮🇹',
  countryName: 'Italy'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇱🇻',
  countryName: 'Latvia'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇱🇹',
  countryName: 'Lithuania'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇱🇺',
  countryName: 'Luxembourg'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇲🇹',
  countryName: 'Malta'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇳🇱',
  countryName: 'Netherlands'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇵🇹',
  countryName: 'Portugal'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇸🇰',
  countryName: 'Slovakia'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇸🇮',
  countryName: 'Slovenia'
}, {
  name: 'Euro',
  code: 'EUR',
  flag: '🇪🇸',
  countryName: 'Spain'
}, {
  name: 'British Pound',
  code: 'GBP',
  flag: '🇬🇧',
  countryName: 'United Kingdom'
},
// Additional major world currencies
{
  name: 'Chinese Yuan',
  code: 'CNY',
  flag: '🇨🇳',
  countryName: 'China'
}, {
  name: 'Canadian Dollar',
  code: 'CAD',
  flag: '🇨🇦',
  countryName: 'Canada'
}, {
  name: 'Japanese Yen',
  code: 'JPY',
  flag: '🇯🇵',
  countryName: 'Japan'
}, {
  name: 'Australian Dollar',
  code: 'AUD',
  flag: '🇦🇺',
  countryName: 'Australia'
}, {
  name: 'Swiss Franc',
  code: 'CHF',
  flag: '🇨🇭',
  countryName: 'Switzerland'
}, {
  name: 'Indian Rupee',
  code: 'INR',
  flag: '🇮🇳',
  countryName: 'India'
}, {
  name: 'Mexican Peso',
  code: 'MXN',
  flag: '🇲🇽',
  countryName: 'Mexico'
}, {
  name: 'Brazilian Real',
  code: 'BRL',
  flag: '🇧🇷',
  countryName: 'Brazil'
}, {
  name: 'Singapore Dollar',
  code: 'SGD',
  flag: '🇸🇬',
  countryName: 'Singapore'
}, {
  name: 'Hong Kong Dollar',
  code: 'HKD',
  flag: '🇭🇰',
  countryName: 'Hong Kong'
}, {
  name: 'South Korean Won',
  code: 'KRW',
  flag: '🇰🇷',
  countryName: 'South Korea'
}, {
  name: 'Swedish Krona',
  code: 'SEK',
  flag: '🇸🇪',
  countryName: 'Sweden'
}, {
  name: 'Norwegian Krone',
  code: 'NOK',
  flag: '🇳🇴',
  countryName: 'Norway'
}, {
  name: 'Danish Krone',
  code: 'DKK',
  flag: '🇩🇰',
  countryName: 'Denmark'
}, {
  name: 'New Zealand Dollar',
  code: 'NZD',
  flag: '🇳🇿',
  countryName: 'New Zealand'
}, {
  name: 'Polish Zloty',
  code: 'PLN',
  flag: '🇵🇱',
  countryName: 'Poland'
}, {
  name: 'Thai Baht',
  code: 'THB',
  flag: '🇹🇭',
  countryName: 'Thailand'
}, {
  name: 'Malaysian Ringgit',
  code: 'MYR',
  flag: '🇲🇾',
  countryName: 'Malaysia'
}, {
  name: 'Indonesian Rupiah',
  code: 'IDR',
  flag: '🇮🇩',
  countryName: 'Indonesia'
}, {
  name: 'Philippine Peso',
  code: 'PHP',
  flag: '🇵🇭',
  countryName: 'Philippines'
}, {
  name: 'Turkish Lira',
  code: 'TRY',
  flag: '🇹🇷',
  countryName: 'Turkey'
}, {
  name: 'Russian Ruble',
  code: 'RUB',
  flag: '🇷🇺',
  countryName: 'Russia'
}, {
  name: 'UAE Dirham',
  code: 'AED',
  flag: '🇦🇪',
  countryName: 'United Arab Emirates'
}, {
  name: 'Saudi Riyal',
  code: 'SAR',
  flag: '🇸🇦',
  countryName: 'Saudi Arabia'
},
// Additional major world currencies
{
  name: 'Argentine Peso',
  code: 'ARS',
  flag: '🇦🇷',
  countryName: 'Argentina'
}, {
  name: 'Chilean Peso',
  code: 'CLP',
  flag: '🇨🇱',
  countryName: 'Chile'
}, {
  name: 'Colombian Peso',
  code: 'COP',
  flag: '🇨🇴',
  countryName: 'Colombia'
}, {
  name: 'Peruvian Sol',
  code: 'PEN',
  flag: '🇵🇪',
  countryName: 'Peru'
}, {
  name: 'Vietnamese Dong',
  code: 'VND',
  flag: '🇻🇳',
  countryName: 'Vietnam'
}, {
  name: 'Bangladeshi Taka',
  code: 'BDT',
  flag: '🇧🇩',
  countryName: 'Bangladesh'
}, {
  name: 'Pakistani Rupee',
  code: 'PKR',
  flag: '🇵🇰',
  countryName: 'Pakistan'
}, {
  name: 'Israeli New Shekel',
  code: 'ILS',
  flag: '🇮🇱',
  countryName: 'Israel'
}, {
  name: 'Qatari Riyal',
  code: 'QAR',
  flag: '🇶🇦',
  countryName: 'Qatar'
}, {
  name: 'Kuwaiti Dinar',
  code: 'KWD',
  flag: '🇰🇼',
  countryName: 'Kuwait'
}, {
  name: 'Czech Koruna',
  code: 'CZK',
  flag: '🇨🇿',
  countryName: 'Czech Republic'
}, {
  name: 'Hungarian Forint',
  code: 'HUF',
  flag: '🇭🇺',
  countryName: 'Hungary'
}, {
  name: 'Romanian Leu',
  code: 'RON',
  flag: '🇷🇴',
  countryName: 'Romania'
}, {
  name: 'Bulgarian Lev',
  code: 'BGN',
  flag: '🇧🇬',
  countryName: 'Bulgaria'
}, {
  name: 'Croatian Kuna',
  code: 'HRK',
  flag: '🇭🇷',
  countryName: 'Croatia'
}, {
  name: 'Icelandic Króna',
  code: 'ISK',
  flag: '🇮🇸',
  countryName: 'Iceland'
}, {
  name: 'Bahraini Dinar',
  code: 'BHD',
  flag: '🇧🇭',
  countryName: 'Bahrain'
}, {
  name: 'Jordanian Dinar',
  code: 'JOD',
  flag: '🇯🇴',
  countryName: 'Jordan'
}, {
  name: 'Omani Rial',
  code: 'OMR',
  flag: '🇴🇲',
  countryName: 'Oman'
}, {
  name: 'Lebanese Pound',
  code: 'LBP',
  flag: '🇱🇧',
  countryName: 'Lebanon'
}, {
  name: 'Sri Lankan Rupee',
  code: 'LKR',
  flag: '🇱🇰',
  countryName: 'Sri Lanka'
}, {
  name: 'Nepalese Rupee',
  code: 'NPR',
  flag: '🇳🇵',
  countryName: 'Nepal'
}, {
  name: 'Afghan Afghani',
  code: 'AFN',
  flag: '🇦🇫',
  countryName: 'Afghanistan'
}, {
  name: 'Myanmar Kyat',
  code: 'MMK',
  flag: '🇲🇲',
  countryName: 'Myanmar'
}, {
  name: 'Cambodian Riel',
  code: 'KHR',
  flag: '🇰🇭',
  countryName: 'Cambodia'
}, {
  name: 'Lao Kip',
  code: 'LAK',
  flag: '🇱🇦',
  countryName: 'Laos'
}, {
  name: 'Brunei Dollar',
  code: 'BND',
  flag: '🇧🇳',
  countryName: 'Brunei'
}, {
  name: 'Mongolian Tugrik',
  code: 'MNT',
  flag: '🇲🇳',
  countryName: 'Mongolia'
}, {
  name: 'Maldivian Rufiyaa',
  code: 'MVR',
  flag: '🇲🇻',
  countryName: 'Maldives'
}, {
  name: 'Kazakhstani Tenge',
  code: 'KZT',
  flag: '🇰🇿',
  countryName: 'Kazakhstan'
}, {
  name: 'Uzbekistani Som',
  code: 'UZS',
  flag: '🇺🇿',
  countryName: 'Uzbekistan'
}, {
  name: 'Georgian Lari',
  code: 'GEL',
  flag: '🇬🇪',
  countryName: 'Georgia'
}, {
  name: 'Armenian Dram',
  code: 'AMD',
  flag: '🇦🇲',
  countryName: 'Armenia'
}, {
  name: 'Azerbaijani Manat',
  code: 'AZN',
  flag: '🇦🇿',
  countryName: 'Azerbaijan'
}, {
  name: 'Belarusian Ruble',
  code: 'BYN',
  flag: '🇧🇾',
  countryName: 'Belarus'
}, {
  name: 'Ukrainian Hryvnia',
  code: 'UAH',
  flag: '🇺🇦',
  countryName: 'Ukraine'
}, {
  name: 'Serbian Dinar',
  code: 'RSD',
  flag: '🇷🇸',
  countryName: 'Serbia'
}, {
  name: 'Macedonian Denar',
  code: 'MKD',
  flag: '🇲🇰',
  countryName: 'North Macedonia'
}, {
  name: 'Albanian Lek',
  code: 'ALL',
  flag: '🇦🇱',
  countryName: 'Albania'
}, {
  name: 'Bosnian Mark',
  code: 'BAM',
  flag: '🇧🇦',
  countryName: 'Bosnia and Herzegovina'
}, {
  name: 'Moldovan Leu',
  code: 'MDL',
  flag: '🇲🇩',
  countryName: 'Moldova'
}, {
  name: 'Venezuelan Bolívar',
  code: 'VES',
  flag: '🇻🇪',
  countryName: 'Venezuela'
}, {
  name: 'Uruguayan Peso',
  code: 'UYU',
  flag: '🇺🇾',
  countryName: 'Uruguay'
}, {
  name: 'Paraguayan Guaraní',
  code: 'PYG',
  flag: '🇵🇾',
  countryName: 'Paraguay'
}, {
  name: 'Bolivian Boliviano',
  code: 'BOB',
  flag: '🇧🇴',
  countryName: 'Bolivia'
}, {
  name: 'Ecuadorian Sucre',
  code: 'ECS',
  flag: '🇪🇨',
  countryName: 'Ecuador'
}, {
  name: 'Costa Rican Colón',
  code: 'CRC',
  flag: '🇨🇷',
  countryName: 'Costa Rica'
}, {
  name: 'Guatemalan Quetzal',
  code: 'GTQ',
  flag: '🇬🇹',
  countryName: 'Guatemala'
}, {
  name: 'Honduran Lempira',
  code: 'HNL',
  flag: '🇭🇳',
  countryName: 'Honduras'
}, {
  name: 'Nicaraguan Córdoba',
  code: 'NIO',
  flag: '🇳🇮',
  countryName: 'Nicaragua'
}, {
  name: 'Panamanian Balboa',
  code: 'PAB',
  flag: '🇵🇦',
  countryName: 'Panama'
}, {
  name: 'Dominican Peso',
  code: 'DOP',
  flag: '🇩🇴',
  countryName: 'Dominican Republic'
}, {
  name: 'Jamaican Dollar',
  code: 'JMD',
  flag: '🇯🇲',
  countryName: 'Jamaica'
}, {
  name: 'Trinidad Dollar',
  code: 'TTD',
  flag: '🇹🇹',
  countryName: 'Trinidad and Tobago'
}, {
  name: 'Barbadian Dollar',
  code: 'BBD',
  flag: '🇧🇧',
  countryName: 'Barbados'
}, {
  name: 'Bahamian Dollar',
  code: 'BSD',
  flag: '🇧🇸',
  countryName: 'Bahamas'
}, {
  name: 'East Caribbean Dollar',
  code: 'XCD',
  flag: '🌴',
  countryName: 'East Caribbean'
}, {
  name: 'Haitian Gourde',
  code: 'HTG',
  flag: '🇭🇹',
  countryName: 'Haiti'
}, {
  name: 'Cuban Peso',
  code: 'CUP',
  flag: '🇨🇺',
  countryName: 'Cuba'
}, {
  name: 'Fijian Dollar',
  code: 'FJD',
  flag: '🇫🇯',
  countryName: 'Fiji'
}, {
  name: 'Papua New Guinean Kina',
  code: 'PGK',
  flag: '🇵🇬',
  countryName: 'Papua New Guinea'
}, {
  name: 'Samoan Tala',
  code: 'WST',
  flag: '🇼🇸',
  countryName: 'Samoa'
}, {
  name: 'Tongan Paʻanga',
  code: 'TOP',
  flag: '🇹🇴',
  countryName: 'Tonga'
}, {
  name: 'Vanuatu Vatu',
  code: 'VUV',
  flag: '🇻🇺',
  countryName: 'Vanuatu'
}, {
  name: 'Zimbabwean Dollar',
  code: 'ZWL',
  flag: '🇿🇼',
  countryName: 'Zimbabwe'
}];

// Popular sending currencies (first 5)
const POPULAR_SENDING = SENDING_CURRENCIES.slice(0, 7);

// --- Location Options for Agent Signup ---

const LOCATION_OPTIONS = {
  worldwide: [{
    id: 'worldwide',
    label: 'Worldwide',
    type: 'worldwide'
  }],
  continents: [{
    id: 'africa',
    label: 'Africa',
    type: 'continent'
  }, {
    id: 'europe',
    label: 'Europe',
    type: 'continent'
  }, {
    id: 'americas',
    label: 'Americas',
    type: 'continent'
  }, {
    id: 'asia',
    label: 'Asia',
    type: 'continent'
  }, {
    id: 'oceania',
    label: 'Oceania',
    type: 'continent'
  }],
  regions: [{
    id: 'west-africa',
    label: 'West Africa',
    type: 'region'
  }, {
    id: 'east-africa',
    label: 'East Africa',
    type: 'region'
  }, {
    id: 'southern-africa',
    label: 'Southern Africa',
    type: 'region'
  }, {
    id: 'north-africa',
    label: 'North Africa',
    type: 'region'
  }, {
    id: 'western-europe',
    label: 'Western Europe',
    type: 'region'
  }, {
    id: 'eastern-europe',
    label: 'Eastern Europe',
    type: 'region'
  }, {
    id: 'south-america',
    label: 'South America',
    type: 'region'
  }, {
    id: 'central-america',
    label: 'Central America',
    type: 'region'
  }, {
    id: 'north-america',
    label: 'North America',
    type: 'region'
  }, {
    id: 'southeast-asia',
    label: 'Southeast Asia',
    type: 'region'
  }, {
    id: 'middle-east',
    label: 'Middle East',
    type: 'region'
  }],
  countries: [{
    id: 'australia',
    label: 'Australia',
    type: 'country',
    flag: '🇦🇺'
  }, {
    id: 'brazil',
    label: 'Brazil',
    type: 'country',
    flag: '🇧🇷'
  }, {
    id: 'canada',
    label: 'Canada',
    type: 'country',
    flag: '🇨🇦'
  }, {
    id: 'china',
    label: 'China',
    type: 'country',
    flag: '🇨🇳'
  }, {
    id: 'egypt',
    label: 'Egypt',
    type: 'country',
    flag: '🇪🇬'
  }, {
    id: 'ethiopia',
    label: 'Ethiopia',
    type: 'country',
    flag: '🇪🇹'
  }, {
    id: 'france',
    label: 'France',
    type: 'country',
    flag: '🇫🇷'
  }, {
    id: 'germany',
    label: 'Germany',
    type: 'country',
    flag: '🇩🇪'
  }, {
    id: 'ghana',
    label: 'Ghana',
    type: 'country',
    flag: '🇬🇭'
  }, {
    id: 'india',
    label: 'India',
    type: 'country',
    flag: '🇮🇳'
  }, {
    id: 'italy',
    label: 'Italy',
    type: 'country',
    flag: '🇮🇹'
  }, {
    id: 'japan',
    label: 'Japan',
    type: 'country',
    flag: '🇯🇵'
  }, {
    id: 'kenya',
    label: 'Kenya',
    type: 'country',
    flag: '🇰🇪'
  }, {
    id: 'mexico',
    label: 'Mexico',
    type: 'country',
    flag: '🇲🇽'
  }, {
    id: 'morocco',
    label: 'Morocco',
    type: 'country',
    flag: '🇲🇦'
  }, {
    id: 'nigeria',
    label: 'Nigeria',
    type: 'country',
    flag: '🇳🇬'
  }, {
    id: 'south-africa',
    label: 'South Africa',
    type: 'country',
    flag: '🇿🇦'
  }, {
    id: 'spain',
    label: 'Spain',
    type: 'country',
    flag: '🇪🇸'
  }, {
    id: 'tanzania',
    label: 'Tanzania',
    type: 'country',
    flag: '🇹🇿'
  }, {
    id: 'uganda',
    label: 'Uganda',
    type: 'country',
    flag: '🇺🇬'
  }, {
    id: 'uk',
    label: 'United Kingdom',
    type: 'country',
    flag: '🇬🇧'
  }, {
    id: 'usa',
    label: 'United States',
    type: 'country',
    flag: '🇺🇸'
  }]
};
const TRADE_VOLUME_OPTIONS = [{
  value: '<1000',
  label: '<$1,000'
}, {
  value: '1000-10000',
  label: '$1,000 - $10,000'
}, {
  value: '10000-100000',
  label: '$10,000 - $100,000'
}, {
  value: '100000-1000000',
  label: '$100,000 - $1M'
}, {
  value: '>1000000',
  label: '>$1M'
}] as any[];

// --- Mock Data ---

// Agent aliases pool
const AGENT_ALIASES = ['Ankh', 'Okavango River', 'Shoebill', 'Gye Nyame', 'Orange River', 'Weaverbird', 'Akan Stool', 'Senegal River', 'Lilac-breasted Roller', 'Adinkrahene', 'Kasai River', 'African Grey Parrot', 'Sankofa', 'Limpopo River', 'Hadeda Ibis', 'Cowrie Shell', 'Benue River', 'Marabou Stork', 'Nyame Dua', 'Chari River', 'Superb Starling', 'Akoben', 'Volta River', 'Hamerkop', 'Funtumia', 'Blue Crane', 'Kintinkantan'];

// Function to get a random subset of aliases
const getRandomAliases = (count: number): string[] => {
  const shuffled = [...AGENT_ALIASES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
const AGENTS: Agent[] = [{
  id: 'a1',
  name: 'Global Express Ltd.',
  rating: 4.9,
  reviewsCount: 1240,
  deliveryTime: '15-30 mins',
  exchangeRate: 0.095,
  fee: 1.50,
  verificationStatus: 'premium',
  availableMethods: ['bank_transfer', 'mobile_money'],
  sendingPaymentMethods: ['bank_transfer', 'mobile_money'],
  receivingPaymentMethods: ['bank_transfer', 'mobile_money'],
  location: 'Ghana → USA',
  responseTime: 'Under 5 mins',
  type: 'all-in-one',
  sendingCountry: 'Ghana',
  receivingCountry: 'USA'
}, {
  id: 'a2',
  name: 'SwiftPay Connect',
  rating: 4.7,
  reviewsCount: 856,
  deliveryTime: '1-2 hours',
  exchangeRate: 0.093,
  fee: 0.99,
  verificationStatus: 'verified',
  availableMethods: ['bank_transfer', 'mobile_money'],
  sendingPaymentMethods: ['mobile_money'],
  receivingPaymentMethods: ['bank_transfer', 'mobile_money'],
  location: 'Ghana → USA',
  responseTime: '10 mins',
  type: 'all-in-one',
  sendingCountry: 'Ghana',
  receivingCountry: 'USA'
}, {
  id: 'a3',
  name: 'Ghana Quick Collect',
  rating: 4.8,
  reviewsCount: 542,
  deliveryTime: 'Same day',
  exchangeRate: 0.094,
  fee: 2.00,
  verificationStatus: 'verified',
  availableMethods: ['bank_transfer'],
  sendingPaymentMethods: ['bank_transfer', 'mobile_money'],
  receivingPaymentMethods: ['bank_transfer', 'mobile_money'],
  location: 'Accra, Ghana',
  responseTime: '5 mins',
  type: 'sending',
  sendingCountry: 'Ghana',
  receivingCountry: 'USA'
}, {
  id: 'a4',
  name: 'USA Direct Payout',
  rating: 4.9,
  reviewsCount: 1105,
  deliveryTime: 'Instant',
  exchangeRate: 0.096,
  fee: 0,
  verificationStatus: 'premium',
  availableMethods: ['mobile_money'],
  sendingPaymentMethods: ['bank_transfer', 'mobile_money'],
  receivingPaymentMethods: ['bank_transfer', 'mobile_money'],
  location: 'New York, USA',
  responseTime: 'Instant',
  type: 'receiving',
  sendingCountry: 'Ghana',
  receivingCountry: 'USA'
}];
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// @component: PayUppMarketplace
export const PayUppMarketplace = () => {
  const [page, setPage] = useState<'home' | 'results' | 'how-it-works' | 'become-agent' | 'help' | 'pricing' | 'waitlist' | 'agent-signup' | 'browse-offers' | 'login' | 'signup' | 'profile-kyc' | 'agent-application' | 'send-money-flow' | 'offer-details' | 'profile' | 'exchange-rate' | 'terms-privacy' | 'my-business' | 'transfers'>('home');
  const [navigationHistory, setNavigationHistory] = useState<Array<typeof page>>(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [sendAmount, setSendAmount] = useState<string>('1000');
  const [sendCurrency, setSendCurrency] = useState<Currency>(SENDING_CURRENCIES.find(c => c.code === 'GHS') || SENDING_CURRENCIES[0]);
  const [receiveCurrency, setReceiveCurrency] = useState<Currency>(RECEIVING_CURRENCIES.find(c => c.code === 'USD') || RECEIVING_CURRENCIES[0]);
  const [showSendCurrencyDropdown, setShowSendCurrencyDropdown] = useState(false);
  const [showReceiveCurrencyDropdown, setShowReceiveCurrencyDropdown] = useState(false);
  const [sendCurrencySearch, setSendCurrencySearch] = useState('');
  const [receiveCurrencySearch, setReceiveCurrencySearch] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    deliverySpeed: 'all',
    payoutMethod: 'all' as PayoutMethod | 'all'
  });
  const [sendingPaymentMethod, setSendingPaymentMethod] = useState<PayoutMethod | 'all'>('all');
  const [receivingPaymentMethod, setReceivingPaymentMethod] = useState<PayoutMethod | 'all'>('all');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  // Track current step in send money flow
  const [sendMoneyStep, setSendMoneyStep] = useState<number>(1);

  // State for editable receive amount
  const [receiveAmount, setReceiveAmount] = useState<string>('');

  // State for contact support and chat
  const [showContactForm, setShowContactForm] = useState(false);
  const [showGeneralChat, setShowGeneralChat] = useState(false);

  // State for agents with randomized aliases
  const [displayAgents, setDisplayAgents] = useState<Agent[]>(AGENTS);

  // Agent signup form state
  const [agentSignupForm, setAgentSignupForm] = useState({
    email: '',
    phone: '',
    country: '',
    tradeVolume: '',
    paymentType: 'both' as 'stablecoins' | 'fiat' | 'both',
    sendingLocations: [] as string[],
    receivingLocations: [] as string[]
  });
  const [showSendingDropdown, setShowSendingDropdown] = useState(false);
  const [showReceivingDropdown, setShowReceivingDropdown] = useState(false);

  // Refs for click-outside detection
  const sendingDropdownRef = useRef<HTMLDivElement>(null);
  const receivingDropdownRef = useRef<HTMLDivElement>(null);
  const sendCurrencyDropdownRef = useRef<HTMLDivElement>(null);
  const receiveCurrencyDropdownRef = useRef<HTMLDivElement>(null);

  // Randomize agent names on mount
  useEffect(() => {
    const aliases = getRandomAliases(AGENTS.length);
    const agentsWithAliases = AGENTS.map((agent, index) => ({
      ...agent,
      name: aliases[index],
      // Update location and countries based on current currency selection
      sendingCountry: sendCurrency.countryName || agent.sendingCountry,
      receivingCountry: receiveCurrency.countryName || agent.receivingCountry,
      location: `${sendCurrency.countryName || agent.sendingCountry || 'Unknown'} → ${receiveCurrency.countryName || agent.receivingCountry || 'Unknown'}`
    }));
    setDisplayAgents(agentsWithAliases);

    // Calculate and set receive amount
    if (sendAmount && parseFloat(sendAmount) > 0 && agentsWithAliases.length > 0) {
      const amount = parseFloat(sendAmount);
      const bestRate = Math.max(...agentsWithAliases.map(a => a.exchangeRate));
      const calculatedReceive = (amount * bestRate).toFixed(2);
      setReceiveAmount(calculatedReceive);
    } else {
      setReceiveAmount('0.00');
    }
  }, [sendCurrency, receiveCurrency, sendAmount]);

  // Close sending dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sendingDropdownRef.current && !sendingDropdownRef.current.contains(event.target as Node)) {
        setShowSendingDropdown(false);
      }
    };
    if (showSendingDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSendingDropdown]);

  // Close receiving dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (receivingDropdownRef.current && !receivingDropdownRef.current.contains(event.target as Node)) {
        setShowReceivingDropdown(false);
      }
    };
    if (showReceivingDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReceivingDropdown]);

  // Close send currency dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sendCurrencyDropdownRef.current && !sendCurrencyDropdownRef.current.contains(event.target as Node)) {
        setShowSendCurrencyDropdown(false);
      }
    };
    if (showSendCurrencyDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSendCurrencyDropdown]);

  // Close receive currency dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (receiveCurrencyDropdownRef.current && !receiveCurrencyDropdownRef.current.contains(event.target as Node)) {
        setShowReceiveCurrencyDropdown(false);
      }
    };
    if (showReceiveCurrencyDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReceiveCurrencyDropdown]);

  // Navigation function that tracks history
  const navigateToPage = (newPage: typeof page) => {
    // If we're not at the end of history, clear forward history
    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push(newPage);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setPage(newPage);
  };

  // Allow global navigation from the public layout header
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ page?: typeof page }>;
      const targetPage = customEvent.detail?.page;
      if (targetPage) {
        navigateToPage(targetPage);
      }
    };

    window.addEventListener('payupp:navigate', handler as EventListener);
    return () => {
      window.removeEventListener('payupp:navigate', handler as EventListener);
    };
  }, [navigateToPage]);

  // Navigate back in history
  const navigateBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPage(navigationHistory[newIndex]);
    }
  };

  // Navigate forward in history
  const navigateForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPage(navigationHistory[newIndex]);
    }
  };

  // Check if we can navigate forward
  const canGoForward = historyIndex < navigationHistory.length - 1;

  // Filter currencies based on search
  const filteredSendCurrencies = sendCurrencySearch ? SENDING_CURRENCIES.filter(c => c.name.toLowerCase().includes(sendCurrencySearch.toLowerCase()) || c.code.toLowerCase().includes(sendCurrencySearch.toLowerCase()) || c.countryName?.toLowerCase().includes(sendCurrencySearch.toLowerCase())) : SENDING_CURRENCIES;
  const filteredReceiveCurrencies = receiveCurrencySearch ? RECEIVING_CURRENCIES.filter(c => c.name.toLowerCase().includes(receiveCurrencySearch.toLowerCase()) || c.code.toLowerCase().includes(receiveCurrencySearch.toLowerCase()) || c.countryName?.toLowerCase().includes(receiveCurrencySearch.toLowerCase())) : RECEIVING_CURRENCIES;

  // Filter agents based on selected filters
  const filteredAgents = displayAgents.filter(agent => {
    if (selectedFilters.payoutMethod !== 'all' && !agent.availableMethods.includes(selectedFilters.payoutMethod)) {
      return false;
    }
    return true;
  });

  // Swap currencies function
  const swapCurrencies = () => {
    const tempCurrency = sendCurrency;
    setSendCurrency(receiveCurrency);
    setReceiveCurrency(tempCurrency);
  };

  // Get receive amount display
  const getReceiveAmountDisplay = () => {
    return receiveAmount;
  };

  // Handle search
  const handleSearch = () => {
    if (sendAmount && parseFloat(sendAmount) > 0) {
      navigateToPage('results');
    }
  };

  // Handle select agent from browse offers
  const handleSelectAgent = (offer: any) => {
    setSelectedOffer(offer);
    navigateToPage('offer-details');
  };

  // Handle proceed from offer details
  const handleProceedFromOffer = (amount: string) => {
    setSendAmount(amount);
    navigateToPage('send-money-flow');
  };
  return <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <AnnouncementBar onClick={() => navigateToPage('browse-offers')} />

      <AnimatePresence mode="wait">
        {/* HOME PAGE - Fully Responsive */}
        {page === 'home' && <motion.div key="home" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            {/* Hero Section - Mobile-First Responsive */}
            <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 sm:py-12 md:py-16 lg:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mobile & Tablet: Transfer Module First, Then Content */}
                <div className="lg:hidden space-y-8">
                  {/* Transfer Input Module - Mobile/Tablet */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                    <div className="space-y-5">
                      {/* You Send */}
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                          You send
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <input type="number" value={sendAmount} onChange={e => setSendAmount(e.target.value)} className="flex-1 text-2xl sm:text-3xl font-bold text-gray-900 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none pb-2" placeholder="1000" />
                          <div className="relative">
                            <button onClick={() => setShowSendCurrencyDropdown(!showSendCurrencyDropdown)} className="flex items-center gap-2 text-lg font-semibold text-gray-700 bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 min-w-[120px]">
                              <span className="text-2xl">{sendCurrency.flag}</span>
                              <span>{sendCurrency.code}</span>
                              <ChevronDown size={18} className="text-gray-400" />
                            </button>

                            {showSendCurrencyDropdown && <div ref={sendCurrencyDropdownRef} className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 max-h-80 overflow-y-auto w-80">
                                <div className="px-4 py-2 border-b border-gray-100">
                                  <input type="text" placeholder="Search currency or country..." value={sendCurrencySearch} onChange={e => setSendCurrencySearch(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                {!sendCurrencySearch && <>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                      Popular
                                    </div>
                                    {POPULAR_SENDING.map(currency => <button key={`popular-${currency.code}-${currency.flag}-${currency.countryName || ''}`} onClick={() => {
                              setSendCurrency(currency);
                              setShowSendCurrencyDropdown(false);
                              setSendCurrencySearch('');
                            }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                        <span className="text-2xl">{currency.flag}</span>
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-900">{currency.countryName || currency.name}</div>
                                          <div className="text-sm text-gray-500">{currency.code} - {currency.name}</div>
                                        </div>
                                      </button>)}
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-t border-gray-100 mt-2">
                                      All Currencies
                                    </div>
                                  </>}
                                {filteredSendCurrencies.map(currency => <button key={`${currency.code}-${currency.flag}-${currency.countryName || ''}`} onClick={() => {
                            setSendCurrency(currency);
                            setShowSendCurrencyDropdown(false);
                            setSendCurrencySearch('');
                          }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                <span className="text-2xl">{currency.flag}</span>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{currency.countryName || currency.name}</div>
                                  <div className="text-sm text-gray-500">{currency.code} - {currency.name}</div>
                                </div>
                              </button>)}
                                {filteredSendCurrencies.length === 0 && <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                  No currencies found
                                </div>}
                          </div>}
                          </div>
                        </div>
                      </div>

                      {/* Currency Swap Button */}
                      <div className="flex justify-center -my-2">
                        <button onClick={swapCurrencies} className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg" aria-label="Swap currencies">
                          <RefreshCw size={20} />
                        </button>
                      </div>

                      {/* Recipient Gets */}
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                          Recipient gets
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <input type="number" value={receiveAmount} onChange={e => {
                        const newReceiveValue = e.target.value;
                        setReceiveAmount(newReceiveValue);

                        // Calculate reverse: what sendAmount would be needed to get this receiveAmount
                        const receiveValue = parseFloat(newReceiveValue);
                        if (filteredAgents.length > 0 && receiveValue > 0) {
                          const bestRate = Math.max(...filteredAgents.map(a => a.exchangeRate));
                          const newSendAmount = (receiveValue / bestRate).toFixed(2);
                          setSendAmount(newSendAmount);
                        } else if (!newReceiveValue || receiveValue === 0) {
                          setSendAmount('');
                        }
                      }} className="flex-1 text-3xl font-bold text-blue-600 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none pb-2" placeholder="0.00" />
                          <div className="relative">
                            <button onClick={() => setShowReceiveCurrencyDropdown(!showReceiveCurrencyDropdown)} className="flex items-center gap-2 text-lg font-semibold text-gray-700 bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 min-w-[120px]">
                              <span className="text-2xl">{receiveCurrency.flag}</span>
                              <span>{receiveCurrency.code}</span>
                              <ChevronDown size={18} className="text-gray-400" />
                            </button>

                            {showReceiveCurrencyDropdown && <div ref={receiveCurrencyDropdownRef} className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 max-h-80 overflow-y-auto w-80">
                                <div className="px-4 py-2 border-b border-gray-100">
                                  <input type="text" placeholder="Search currency..." value={receiveCurrencySearch} onChange={e => setReceiveCurrencySearch(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                  Major Currencies
                                </div>
                                {filteredReceiveCurrencies.map(currency => <button key={`${currency.code}-${currency.flag}-${currency.countryName || ''}`} onClick={() => {
                            setReceiveCurrency(currency);
                            setShowReceiveCurrencyDropdown(false);
                            setReceiveCurrencySearch('');
                          }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                    <span className="text-2xl">{currency.flag}</span>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{currency.countryName || currency.name}</div>
                                      <div className="text-sm text-gray-500">{currency.code} - {currency.name}</div>
                                    </div>
                                  </button>)}
                                {filteredReceiveCurrencies.length === 0 && <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                  No currencies found
                                </div>}
                              </div>}
                          </div>
                        </div>
                        {!selectedAgent && filteredAgents.length > 0 && <p className="text-xs text-gray-500 mt-2">
                            <Info size={12} className="inline mr-1" />
                            Final amount depends on agent selected
                          </p>}
                      </div>

                      {/* Exchange Rate Info */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Best rate</span>
                          <span className="font-semibold text-gray-900">
                            1 {sendCurrency.code} = {filteredAgents[0]?.exchangeRate || 1.05} {receiveCurrency.code}
                          </span>
                        </div>
                      </div>

                      {/* Search Button */}
                      <button onClick={handleSearch} disabled={!sendAmount || parseFloat(sendAmount) <= 0} className="w-full bg-blue-600 text-white text-base sm:text-lg font-semibold py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <Search size={20} />
                        Find Agent
                      </button>

                      <p className="text-xs text-gray-500 text-center">
                        No hidden fees. No surprises. All parties go through our verification process.
                      </p>
                    </div>
                  </div>

                  {/* Headline + Trust Signals - Mobile/Tablet */}
                  <div className="text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                      Send money internationally, without the complexity
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-5 sm:mb-6">
                      Find Locals Who Can Help You Send Money Abroad
                    </p>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">500+</div>
                        <div className="text-xs sm:text-sm text-gray-600">Verified Agents</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">$10M+</div>
                        <div className="text-xs sm:text-sm text-gray-600">Transferred</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">4.8★</div>
                        <div className="text-xs sm:text-sm text-gray-600">Rating</div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <CheckCircle2 className="text-green-600 shrink-0" size={20} />
                        <span className="text-sm sm:text-base text-gray-700">Privacy-first</span>
                      </div>
                      <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <CheckCircle2 className="text-green-600 shrink-0" size={20} />
                        <span className="text-sm sm:text-base text-gray-700">Low fees, great rates</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout: Side by Side */}
                <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-start">
                  {/* Left: Headline + Trust Signals */}
                  <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                      Send money internationally, without the complexity
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8">
                      Find Locals Who Can Help You Send Money Abroad
                    </p>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                        <div className="text-sm text-gray-600">Verified Agents</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">$10M+</div>
                        <div className="text-sm text-gray-600">Transferred</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">4.8★</div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <CheckCircle2 className="text-green-600" size={20} />
                        <span className="text-gray-700">Multiple corridors</span>
                      </div>
                      <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <CheckCircle2 className="text-green-600" size={20} />
                        <span className="text-gray-700">Privacy-first</span>
                      </div>
                      <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <CheckCircle2 className="text-green-600" size={20} />
                        <span className="text-gray-700">Low fees, great rates</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Transfer Input Module - Desktop version with same logic */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
                    <div className="space-y-6">
                      {/* You Send */}
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                          You send
                        </label>
                        <div className="flex items-center gap-3">
                          <input type="number" value={sendAmount} onChange={e => setSendAmount(e.target.value)} className="flex-1 text-3xl font-bold text-gray-900 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none pb-2" placeholder="1000" />
                          <div className="relative">
                            <button onClick={() => setShowSendCurrencyDropdown(!showSendCurrencyDropdown)} className="flex items-center gap-2 text-lg font-semibold text-gray-700 bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 min-w-[120px]">
                              <span className="text-2xl">{sendCurrency.flag}</span>
                              <span>{sendCurrency.code}</span>
                              <ChevronDown size={18} className="text-gray-400" />
                            </button>

                            {showSendCurrencyDropdown && <div ref={sendCurrencyDropdownRef} className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 max-h-80 overflow-y-auto w-80">
                                <div className="px-4 py-2 border-b border-gray-100">
                                  <input type="text" placeholder="Search currency or country..." value={sendCurrencySearch} onChange={e => setSendCurrencySearch(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                {!sendCurrencySearch && <>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                      Popular
                                    </div>
                                    {POPULAR_SENDING.map(currency => <button key={`popular-${currency.code}-${currency.flag}-${currency.countryName || ''}`} onClick={() => {
                              setSendCurrency(currency);
                              setShowSendCurrencyDropdown(false);
                              setSendCurrencySearch('');
                            }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                        <span className="text-2xl">{currency.flag}</span>
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-900">{currency.countryName || currency.name}</div>
                                          <div className="text-sm text-gray-500">{currency.code} - {currency.name}</div>
                                        </div>
                                      </button>)}
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-t border-gray-100 mt-2">
                                      All Currencies
                                    </div>
                                  </>}
                                {filteredSendCurrencies.map(currency => <button key={`${currency.code}-${currency.flag}-${currency.countryName || ''}`} onClick={() => {
                            setSendCurrency(currency);
                            setShowSendCurrencyDropdown(false);
                            setSendCurrencySearch('');
                          }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                    <span className="text-2xl">{currency.flag}</span>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{currency.countryName || currency.name}</div>
                                      <div className="text-sm text-gray-500">{currency.code} - {currency.name}</div>
                                    </div>
                                  </button>)}
                                {filteredSendCurrencies.length === 0 && <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                  No currencies found
                                </div>}
                          </div>}
                          </div>
                        </div>
                      </div>

                      {/* Recipient Gets */}
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                          Recipient gets
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <input type="number" value={receiveAmount} onChange={e => {
                        const newReceiveValue = e.target.value;
                        setReceiveAmount(newReceiveValue);

                        // Calculate reverse: what sendAmount would be needed to get this receiveAmount
                        const receiveValue = parseFloat(newReceiveValue);
                        if (filteredAgents.length > 0 && receiveValue > 0) {
                          const bestRate = Math.max(...filteredAgents.map(a => a.exchangeRate));
                          const newSendAmount = (receiveValue / bestRate).toFixed(2);
                          setSendAmount(newSendAmount);
                        } else if (!newReceiveValue || receiveValue === 0) {
                          setSendAmount('');
                        }
                      }} className="flex-1 text-3xl font-bold text-blue-600 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none pb-2" placeholder="0.00" />
                          <div className="relative">
                            <button onClick={() => setShowReceiveCurrencyDropdown(!showReceiveCurrencyDropdown)} className="flex items-center gap-2 text-lg font-semibold text-gray-700 bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 min-w-[120px]">
                              <span className="text-2xl">{receiveCurrency.flag}</span>
                              <span>{receiveCurrency.code}</span>
                              <ChevronDown size={18} className="text-gray-400" />
                            </button>

                            {showReceiveCurrencyDropdown && <div ref={receiveCurrencyDropdownRef} className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 max-h-80 overflow-y-auto w-80">
                                <div className="px-4 py-2 border-b border-gray-100">
                                  <input type="text" placeholder="Search currency..." value={receiveCurrencySearch} onChange={e => setReceiveCurrencySearch(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                  Major Currencies
                                </div>
                                {filteredReceiveCurrencies.map(currency => <button key={`${currency.code}-${currency.flag}-${currency.countryName || ''}`} onClick={() => {
                            setReceiveCurrency(currency);
                            setShowReceiveCurrencyDropdown(false);
                            setReceiveCurrencySearch('');
                          }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                    <span className="text-2xl">{currency.flag}</span>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{currency.countryName || currency.name}</div>
                                      <div className="text-sm text-gray-500">{currency.code} - {currency.name}</div>
                                    </div>
                                  </button>)}
                                {filteredReceiveCurrencies.length === 0 && <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                  No currencies found
                                </div>}
                              </div>}
                          </div>
                        </div>
                        {!selectedAgent && filteredAgents.length > 0 && <p className="text-xs text-gray-500 mt-2">
                            <Info size={12} className="inline mr-1" />
                            Final amount depends on agent selected
                          </p>}
                      </div>

                      {/* Exchange Rate Info */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Best rate</span>
                          <span className="font-semibold text-gray-900">
                            1 {sendCurrency.code} = {filteredAgents[0]?.exchangeRate || 1.05} {receiveCurrency.code}
                          </span>
                        </div>
                      </div>

                      {/* Search Button */}
                      <button onClick={handleSearch} disabled={!sendAmount || parseFloat(sendAmount) <= 0} className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <Search size={20} />
                        Find Agent
                      </button>

                      <p className="text-xs text-gray-500 text-center">
                        No hidden fees. No surprises. All parties go through our verification process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Trust Features - Responsive */}
            <section className="py-0 lg:py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop: Show inline with hero section */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-6">
                  {/* Multiple corridors */}
                  <div className="bg-green-50 rounded-2xl p-6 flex gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full font-bold text-base sm:text-lg mb-4">
                      <ShieldCheck className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Multiple corridors</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        P2P is open to all payment corridors, payment options and countries.
                      </p>
                    </div>
                  </div>

                  {/* Privacy-first */}
                  <div className="bg-blue-50 rounded-2xl p-6 flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full font-bold text-base sm:text-lg mb-4">
                      <Clock className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Privacy-first</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        We do not disclose identity details unless required for a transaction.
                      </p>
                    </div>
                  </div>

                  {/* Verified agents */}
                  <div className="bg-purple-50 rounded-2xl p-6 flex gap-4">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full font-bold text-base sm:text-lg mb-4">
                      <Users className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Verified agents</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Every agent passes our 10-point verification process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>}

        {/* AGENT DISCOVERY PAGE (RESULTS) - Responsive */}
        {page === 'results' && <motion.div key="results" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            {/* Results Header - Responsive */}
            <section className="bg-gray-50 border-b border-gray-200 py-4 sm:py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {sendCurrency.countryName || sendCurrency.code} → {receiveCurrency.countryName || receiveCurrency.code}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Found {filteredAgents.length} agents for your transfer
                    </p>
                  </div>
                  <button onClick={() => navigateToPage('home')} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
                    ← Edit transfer details
                  </button>
                </div>

                {/* Editable You Send Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Side: Amount and Currency Selection */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-2 block">
                        You send
                      </label>
                      <div className="flex items-center gap-2">
                        <input type="number" value={sendAmount} onChange={e => setSendAmount(e.target.value)} className="flex-1 text-xl font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="1000" />
                        <div className="relative">
                          <button onClick={() => setShowSendCurrencyDropdown(!showSendCurrencyDropdown)} className="flex items-center gap-2 text-base font-semibold text-gray-700 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 min-w-[110px] border border-gray-300">
                            <span className="text-xl">{sendCurrency.flag}</span>
                            <span>{sendCurrency.code}</span>
                            <ChevronDown size={16} className="text-gray-400" />
                          </button>

                          {showSendCurrencyDropdown && <div ref={sendCurrencyDropdownRef} className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 max-h-80 overflow-y-auto w-80">
                              <div className="px-4 py-2 border-b border-gray-100">
                                <input type="text" placeholder="Search currency or country..." value={sendCurrencySearch} onChange={e => setSendCurrencySearch(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                              {!sendCurrencySearch && <>
                                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Popular
                                  </div>
                                  {POPULAR_SENDING.map(currency => <button key={`popular-${currency.code}-${currency.flag}-${currency.countryName || ''}`} onClick={() => {
                            setSendCurrency(currency);
                            setShowSendCurrencyDropdown(false);
                            setSendCurrencySearch('');
                          }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                      <span className="text-2xl">{currency.flag}</span>
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-900">{currency.countryName || currency.name}</div>
                                        <div className="text-sm text-gray-500">{currency.code} - {currency.name}</div>
                                      </div>
                                    </button>)}
                                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-t border-gray-100 mt-2">
                                    All Currencies
                                  </div>
                                </>}
                              {filteredSendCurrencies.map(currency => <button key={`${currency.code}-${currency.flag}-${currency.countryName || ''}`} onClick={() => {
                          setSendCurrency(currency);
                          setShowSendCurrencyDropdown(false);
                          setSendCurrencySearch('');
                        }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                <span className="text-2xl">{currency.flag}</span>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{currency.countryName || currency.name}</div>
                                  <div className="text-sm text-gray-500">{currency.code} - {currency.name}</div>
                                </div>
                              </button>)}
                              {filteredSendCurrencies.length === 0 && <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                  No currencies found
                                </div>}
                          </div>}
                        </div>

                        <span className="text-xl font-bold text-gray-400">→</span>

                        <div className="relative">
                          <button onClick={() => setShowReceiveCurrencyDropdown(!showReceiveCurrencyDropdown)} className="flex items-center gap-2 text-base font-semibold text-gray-700 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 min-w-[110px] border border-gray-300">
                            <span className="text-xl">{receiveCurrency.flag}</span>
                            <span>{receiveCurrency.code}</span>
                            <ChevronDown size={16} className="text-gray-400" />
                          </button>

                          {showReceiveCurrencyDropdown && <div ref={receiveCurrencyDropdownRef} className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 max-h-80 overflow-y-auto w-80">
                              <div className="px-4 py-2 border-b border-gray-100">
                                <input type="text" placeholder="Search currency..." value={receiveCurrencySearch} onChange={e => setReceiveCurrencySearch(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Major Currencies
                              </div>
                              {filteredReceiveCurrencies.map(currency => <button key={`${currency.code}-${currency.flag}-${currency.countryName || ''}`} onClick={() => {
                          setReceiveCurrency(currency);
                          setShowReceiveCurrencyDropdown(false);
                          setReceiveCurrencySearch('');
                        }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                <span className="text-2xl">{currency.flag}</span>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{currency.countryName || currency.name}</div>
                                  <div className="text-sm text-gray-500">{currency.code} - {currency.name}</div>
                                </div>
                              </button>)}
                              {filteredReceiveCurrencies.length === 0 && <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                  No currencies found
                                </div>}
                          </div>}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Payment Method Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Sending Country Payment Method */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">
                          Sending Country Payment Method
                        </label>
                        <select value={sendingPaymentMethod} onChange={e => setSendingPaymentMethod(e.target.value as PayoutMethod | 'all')} className="w-full h-[44px] text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-3 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                          <option value="all">All methods</option>
                          <option value="bank_transfer">Bank transfer</option>
                          <option value="mobile_money">Mobile money</option>
                        </select>
                      </div>

                      {/* Receiving Country Payout Method */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">
                          Receiving Country Payout Method
                        </label>
                        <select value={receivingPaymentMethod} onChange={e => setReceivingPaymentMethod(e.target.value as PayoutMethod | 'all')} className="w-full h-[44px] text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-3 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                          <option value="all">All methods</option>
                          <option value="bank_transfer">Bank transfer</option>
                          <option value="mobile_money">Mobile money</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Filters & Results - Responsive */}
            <section className="py-8 sm:py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                  {/* Sidebar Filters - Hidden on Mobile, Visible on Tablet+ */}
                  <aside className="hidden sm:block sm:w-56 lg:w-64 shrink-0">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 sticky top-24">
                      <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-3 block">
                            Payout method
                          </label>
                          <div className="space-y-2">
                            {(['all', 'bank_transfer', 'mobile_money'] as const).map(method => <button key={method} onClick={() => setSelectedFilters({
                          ...selectedFilters,
                          payoutMethod: method
                        })} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFilters.payoutMethod === method ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:text-gray-900'}`}>
                                {method === 'all' && 'All methods'}
                                {method === 'bank_transfer' && 'Bank transfer'}
                                {method === 'mobile_money' && 'Mobile money'}
                              </button>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>

                  {/* Agent Cards - Single Column on Mobile */}
                  <div className="flex-1">
                    {/* Mobile Filter Toggle */}
                    <div className="sm:hidden mb-4">
                      <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium">
                        <span>Filters: {selectedFilters.payoutMethod === 'all' ? 'All methods' : selectedFilters.payoutMethod.replace('_', ' ')}</span>
                        <ChevronDown size={18} />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      {filteredAgents.map(agent => <div key={agent.id} className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all p-4 sm:p-6 cursor-pointer group">
                          {/* Agent Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg">
                                {agent.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">{agent.name}</h3>
                                  {agent.verificationStatus === 'premium' && <ShieldCheck size={14} className="text-blue-600" />}
                                </div>
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mt-0.5">
                                  <Star size={12} fill="currentColor" className="text-orange-500" />
                                  <span className="font-semibold">{agent.rating}</span>
                                  <span className="text-gray-400">({agent.reviewsCount})</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-4">
                            <MapPin size={14} className="text-gray-400" />
                            <span>{agent.location}</span>
                          </div>

                          {/* Exchange Rate and Recipient Gets - Shown for all agents */}
                          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs sm:text-sm text-gray-600">Exchange rate</span>
                              <span className="text-base sm:text-lg font-bold text-gray-900">
                                1 {sendCurrency.code} = {agent.exchangeRate} {receiveCurrency.code}
                              </span>
                            </div>
                            <div className="border-t border-gray-200 mt-2 sm:mt-3 pt-2 sm:pt-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm font-medium text-gray-700">
                                  Recipient gets
                                </span>
                                <span className="text-lg sm:text-xl font-bold text-blue-600">
                                  {formatCurrency((parseFloat(sendAmount) - agent.fee) * agent.exchangeRate, receiveCurrency.code)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Info */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                              <Clock size={14} className="text-gray-400" />
                              <span>{agent.deliveryTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                              <CheckCircle2 size={14} className="text-green-500" />
                              <span>{agent.verificationStatus === 'premium' ? 'Premium' : 'Verified'}</span>
                            </div>
                          </div>

                          {/* Payment Methods - Separated by Country */}
                          <div className="space-y-3 mb-4">
                            {/* Sending Country Payment Methods */}
                            {agent.sendingPaymentMethods && agent.sendingPaymentMethods.length > 0 && <div>
                                <div className="text-xs font-medium text-gray-500 mb-1.5">
                                  {agent.sendingCountry || 'Sending'} payment options:
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {(() => {
                            const paymentOptions = getPaymentOptionsForCountry(agent.sendingCountry || 'Default');
                            return paymentOptions.map((option, idx) => <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${option.type === 'bank' ? 'bg-blue-50 text-blue-700' : option.type === 'mobile' ? 'bg-purple-50 text-purple-700' : 'bg-green-50 text-green-700'}`}>
                                        {option.type === 'bank' ? <Building2 size={12} /> : <Smartphone size={12} />}
                                        {option.name}
                                      </div>);
                          })()}
                                </div>
                              </div>}

                            {/* Receiving Country Payment Methods */}
                            {agent.receivingPaymentMethods && agent.receivingPaymentMethods.length > 0 && <div>
                                <div className="text-xs font-medium text-gray-500 mb-1.5">
                                  {agent.receivingCountry || 'Receiving'} payout options:
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {(() => {
                            const paymentOptions = getPaymentOptionsForCountry(agent.receivingCountry || 'Default');
                            return paymentOptions.map((option, idx) => <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${option.type === 'bank' ? 'bg-green-50 text-green-700' : option.type === 'mobile' ? 'bg-orange-50 text-orange-700' : 'bg-teal-50 text-teal-700'}`}>
                                        {option.type === 'bank' ? <Building2 size={12} /> : <Smartphone size={12} />}
                                        {option.name}
                                      </div>);
                          })()}
                                </div>
                              </div>}
                          </div>

                          {/* Select Button */}
                          <button onClick={() => {
                      // Store the agent as an offer for the offer details view
                      const offerData = {
                        id: agent.id,
                        agentName: agent.name,
                        agentRating: agent.rating,
                        agentReviews: agent.reviewsCount,
                        exchangeRate: agent.exchangeRate,
                        fee: agent.fee,
                        deliveryTime: agent.deliveryTime,
                        sendAmount: parseFloat(sendAmount),
                        sendCurrency: sendCurrency.code,
                        receiveCurrency: receiveCurrency.code,
                        receiveAmount: (parseFloat(sendAmount) - agent.fee) * agent.exchangeRate,
                        availableMethods: agent.availableMethods,
                        verificationStatus: agent.verificationStatus,
                        location: agent.location,
                        // Add required fields for offer details and send money flow
                        amount: sendAmount,
                        fromCurrency: sendCurrency.code,
                        toCurrency: receiveCurrency.code,
                        fromCountry: sendCurrency.countryName || 'Ghana',
                        toCountry: receiveCurrency.countryName || 'USA',
                        fromFlag: sendCurrency.flag,
                        toFlag: receiveCurrency.flag,
                        rating: agent.rating,
                        reviewCount: agent.reviewsCount,
                        verified: agent.verificationStatus === 'premium' || agent.verificationStatus === 'verified'
                      };
                      setSelectedOffer(offerData);
                      // Navigate to offer details page first to enter amount
                      setPage('offer-details');
                    }} className="w-full bg-blue-600 text-white text-base sm:text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors group-hover:bg-blue-700 flex items-center justify-center gap-2">
                            Select agent
                            <ArrowRight size={16} />
                          </button>
                        </div>)}
                    </div>

                    {/* Trust Banner - Responsive */}
                    <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 sm:p-6 text-white">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-base sm:text-lg mb-2">Your security is our priority</h3>
                          <p className="text-blue-100 text-sm leading-relaxed">
                            Please complete all communications and transactions exclusively on this platform. We maintain a zero-tolerance policy for illegal activity, including fraud, money laundering, and terrorism financing. Transactions are initiated at the user's discretion and must comply with our platform rules and applicable laws.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>}

        {/* BROWSE OFFERS PAGE - Amount Entry */}
        {page === 'browse-offers' && <motion.div key="browse-offers" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <BrowseOffers onSelectAgent={handleSelectAgent} />
          </motion.div>}

        {/* OFFER DETAILS PAGE - Amount Entry */}
        {page === 'offer-details' && selectedOffer && <motion.div key="offer-details" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <OfferDetailsView offer={selectedOffer} onProceed={handleProceedFromOffer} onBack={() => navigateToPage('browse-offers')} />
          </motion.div>}

        {/* SEND MONEY FLOW PAGE - 4 Step Process */}
        {page === 'send-money-flow' && selectedOffer && <motion.div key="send-money-flow" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <SendMoneyFlow offer={selectedOffer} onStepChange={step => setSendMoneyStep(step)} onComplete={() => {
          // After successful transfer, go back to home or show success
          setPage('home');
          setSelectedOffer(null);
          setSendMoneyStep(1);
        }} onBack={() => navigateToPage('offer-details')} onForward={canGoForward ? navigateForward : undefined} />
          </motion.div>}

        {/* HOW IT WORKS PAGE - Fully Responsive */}
        {page === 'how-it-works' && <motion.div key="how-it-works" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-50 to-white py-12 sm:py-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  How PayUpp Works
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-5 sm:mb-6">
                  Peer-to-Peer (P2P) payments have existed for decades. We just brought it online.
                </p>
                <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-5 sm:px-6 py-3 rounded-full text-sm sm:text-base font-semibold">
                  <DollarSign size={20} />
                  <span>Our pricing: maximum 0.5%</span>
                </div>
              </div>
            </section>

            {/* Steps - Mobile: Stacked, Tablet/Desktop: Side by Side */}
            <section className="py-12 sm:py-16">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-16 sm:space-y-24">
                  {/* Step 1 */}
                  <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div className="order-2 md:order-1">
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-full font-bold text-base sm:text-lg mb-4">
                        1
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Search</h2>
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        Enter how much you want to send and where it's going. We'll show you the best rates and fastest agents.
                      </p>
                    </div>
                    <div className="order-1 md:order-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 sm:p-12 flex items-center justify-center">
                      <div className="text-center">
                        <Search size={60} className="text-blue-600 mx-auto mb-4 sm:hidden" />
                        <Search size={80} className="text-blue-600 mx-auto mb-4 hidden sm:block" />
                        <div className="text-5xl sm:text-6xl mb-2">🌍</div>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">Enter amount & destination</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-8 sm:p-12 flex items-center justify-center">
                      <div className="text-center">
                        <Users size={60} className="text-green-600 mx-auto mb-4 sm:hidden" />
                        <Users size={80} className="text-green-600 mx-auto mb-4 hidden sm:block" />
                        <div className="text-5xl sm:text-6xl mb-2">👥</div>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">Matched with trusted agents</p>
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 text-green-600 rounded-full font-bold text-base sm:text-lg mb-4">
                        2
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">We Match You With Agents</h2>
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        We connect you with trusted local agents in both countries. All agents are verified and rated by real users.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-8 sm:p-12 flex items-center justify-center">
                      <div className="text-center">
                        <DollarSign size={60} className="text-purple-600 mx-auto mb-4 sm:hidden" />
                        <DollarSign size={80} className="text-purple-600 mx-auto mb-4 hidden sm:block" />
                        <div className="text-5xl sm:text-6xl mb-2">💳</div>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">Multiple payment options</p>
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 text-purple-600 rounded-full font-bold text-base sm:text-lg mb-4">
                        3
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Pay Locally</h2>
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        Pay locally using cash, bank transfer, or mobile money. Your payment is held securely in escrow until delivery is confirmed.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 sm:p-12 flex items-center justify-center">
                      <div className="text-center">
                        <CheckCircle2 size={60} className="text-orange-600 mx-auto mb-4 sm:hidden" />
                        <CheckCircle2 size={80} className="text-orange-600 mx-auto mb-4 hidden sm:block" />
                        <div className="text-5xl sm:text-6xl mb-2">✅</div>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">Fast & secure delivery</p>
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 text-orange-600 rounded-full font-bold text-base sm:text-lg mb-4">
                        4
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Money Delivered</h2>
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        The recipient gets their money locally — fast and affordable. Most transfers complete in under 30 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA - Responsive */}
            <section className="bg-gray-50 py-12 sm:py-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Ready to send money?</h2>
                <p className="text-base sm:text-lg text-gray-600 mb-8">
                  Join thousands of people who trust PayUpp for their international transfers.
                </p>
                <button onClick={() => navigateToPage('home')} className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-base sm:text-lg font-semibold rounded-xl hover:bg-blue-700 inline-flex items-center gap-2">
                  Get started
                  <ArrowRight size={20} />
                </button>
              </div>
            </section>
          </motion.div>}

        {/* HELP PAGE - Fully Responsive */}
        {page === 'help' && <motion.div key="help" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-gray-50 to-white py-8 sm:py-10">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  How can we help you?
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                  Find answers to common questions about PayUpp
                </p>
              </div>
            </section>

            {/* General Questions */}
            <section className="py-8 sm:py-10 bg-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 sm:mb-6">
                  General Questions
                </h2>

                <div className="space-y-4 sm:space-y-5">
                  {/* Question 1 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2.5">
                      What is PayUpp?
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      PayUpp is a peer-to-peer international money transfer platform that connects you with verified local agents in both sending and receiving countries. This allows for fast, affordable, and secure cross-border transfers without the complexity of traditional banking.
                    </p>
                  </div>

                  {/* Question 2 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2.5">
                      Does PayUpp accept transfers?
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      We do not receive transfers or money from senders. We only facilitate the meeting between the sender and verified local agents. Payments are done directly to agents. These kinds of arrangements have existed for decades. We are just bringing it online.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Transfers */}
            <section className="py-8 sm:py-10 bg-gray-50">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 sm:mb-6">
                  Transfers
                </h2>

                <div className="space-y-4 sm:space-y-5">
                  {/* Question 1 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2.5">
                      How long does a transfer take?
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Most transfers are completed within 15-30 minutes. The exact time depends on the agent you select and their current availability. You can see estimated delivery times before selecting an agent.
                    </p>
                  </div>

                  {/* Question 2 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2.5">
                      What are the fees?
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Fees vary by agent, transfer amount, and delivery method. You'll see the exact fee before selecting an agent. There are no hidden costs - what you see is what you pay.
                    </p>
                  </div>

                  {/* Question 3 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2.5">
                      What payment methods are available?
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Payment methods vary by agent and location. Common options include local fintech apps, bank transfer, and mobile money (like MTN Momo, M-Pesa, Orange Money, etc.) You can filter agents by your preferred payment method.
                    </p>
                  </div>

                  {/* Question 4 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2.5">
                      What's the minimum and maximum I can send?
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Limits vary by agent and payment method. Most agents support transfers from $50 to $10,000. Higher amounts may require additional verification for security purposes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Agents */}
            <section className="py-8 sm:py-10 bg-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 sm:mb-6">
                  Agents
                </h2>

                <div className="space-y-4 sm:space-y-5">
                  {/* Question 1 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2.5">
                      How are agents verified?
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      All agents undergo a comprehensive 10-point verification process including identity verification, payment method verification, background checks, and compliance screening. We continuously monitor agent performance and user ratings.
                    </p>
                  </div>

                  {/* Question 2 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2.5">
                      How do I become an agent?
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      If you have access to funds in more than one country or can facilitate local payments, you can apply to become an agent. Visit our <button onClick={() => navigateToPage('my-business')} className="text-blue-600 hover:text-blue-700 font-medium">My Business</button> page to learn more and apply.
                    </p>
                  </div>

                  {/* Question 3 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2.5">
                      How much can I earn as an agent?
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Earnings vary based on your transaction volume, the routes you serve, and your fees. You set your own rates. Top agents earn between $2,000-$10,000 per month depending on their activity level.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="py-8 sm:py-10 bg-gray-50">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 sm:mb-6">
                  Security
                </h2>

                <div className="space-y-4 sm:space-y-5">
                  {/* Question 1 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2.5">
                      What if something goes wrong?
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Our support team is available to resolve any issues. All transactions are monitored and disputes are resolved fairly through our dispute system which involve financial institutions.
                    </p>
                  </div>

                  {/* Question 2 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2.5">
                      How is my personal information protected?
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      We use bank-level encryption to protect your data. Your personal and financial information is never shared with agents beyond what's necessary to complete the transfer. We comply with all international data protection regulations.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Support CTA */}
            <section className="py-8 sm:py-10 bg-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-10 text-center text-white">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                    Still have questions?
                  </h2>
                  <p className="text-base sm:text-lg text-blue-100 mb-5 sm:mb-6">
                    Our support team is here to help
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => setShowContactForm(true)} className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 text-base sm:text-lg font-semibold rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                      Contact Support
                    </button>
                    <button onClick={() => setShowGeneralChat(true)} className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 text-white text-base sm:text-lg font-semibold rounded-xl hover:bg-blue-400 transition-colors inline-flex items-center gap-2">
                      Chat with us
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>}

        {/* BECOME AN AGENT PAGE - Fully Responsive */}
        {page === 'become-agent' && <motion.div key="become-agent" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <BecomeAgentApplication onSubmit={data => {
          console.log('Agent application submitted:', data);
          // Handle application submission
          navigateToPage('home');
        }} onBack={() => navigateToPage('home')} />
          </motion.div>}

        {/* BECOME AN AGENT APPLICATION PAGE */}
        {page === 'agent-application' && <motion.div key="agent-application" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <BecomeAgentApplication onSubmit={data => {
          console.log('Agent application submitted:', data);
          // Handle application submission
          navigateToPage('home');
        }} onBack={navigateBack} />
          </motion.div>}

        {/* SIGNUP PAGE - Fully Responsive with Social Signup */}
        {page === 'signup' && <motion.div key="signup" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <SignupPage onBack={navigateBack} onForward={canGoForward ? navigateForward : undefined} onSignupSuccess={(method, email, name) => {
          console.log(`Signed up via ${method}`, email, name);
          // Handle successful signup - redirect to KYC profile completion
          navigateToPage('profile-kyc');
        }} onLogin={() => navigateToPage('login')} />
          </motion.div>}

        {/* PROFILE KYC PAGE - Complete verification */}
        {page === 'profile-kyc' && <motion.div key="profile-kyc" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <ProfileKYC onComplete={() => {
          console.log('KYC completed');
          // Redirect to home/dashboard after completion
          navigateToPage('home');
        }} onBack={navigateBack} onForward={canGoForward ? navigateForward : undefined} />
          </motion.div>}

        {/* PROFILE PAGE - View and manage profile */}
        {page === 'profile' && <motion.div key="profile" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <ProfilePage userType="agent" userData={{
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+2 (555) 123-4567',
          location: 'New York, USA',
          joinedDate: 'January 2024'
        }} onBack={() => navigateToPage('home')} />
          </motion.div>}

        {/* LOGIN PAGE - Fully Responsive with Social Login */}
        {page === 'login' && <motion.div key="login" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <LoginPage onBack={navigateBack} onForward={canGoForward ? navigateForward : undefined} onLoginSuccess={(method, email) => {
          console.log(`Logged in via ${method}`, email);
          // Handle successful login - redirect to dashboard or home
          navigateToPage('home');
        }} onForgotPassword={() => {
          // Handle forgot password flow
          console.log('Forgot password clicked');
        }} onSignUp={() => navigateToPage('signup')} />
          </motion.div>}

        {/* EXCHANGE RATE TOOL PAGE */}
        {page === 'exchange-rate' && <motion.div key="exchange-rate" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <ExchangeRateTool onBack={() => navigateToPage('home')} />
          </motion.div>}

        {/* TERMS & PRIVACY PAGE */}
        {page === 'terms-privacy' && <motion.div key="terms-privacy" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <TermsAndPrivacy onBack={() => navigateToPage('home')} />
          </motion.div>}

        {/* MY BUSINESS PAGE */}
        {page === 'my-business' && <motion.div key="my-business" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <MyBusinessPage onBack={() => navigateToPage('home')} />
          </motion.div>}

        {/* TRANSFERS PAGE */}
        {page === 'transfers' && <motion.div key="transfers" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <TransfersPage onBack={() => navigateToPage('home')} onViewTransfer={transferId => {
          console.log('View transfer:', transferId);
          // In a real app, this would navigate to a detailed transfer view
          // For now, we can just show an alert or navigate to send-money-flow
        }} onResumeTransfer={transfer => {
          // Map transfer to offer format
          const offerData = {
            id: transfer.id,
            agentName: transfer.agentName,
            rating: 4.8,
            reviewCount: 150,
            exchangeRate: transfer.receiveAmount / transfer.sendAmount,
            fee: 0,
            deliveryTime: transfer.estimatedDelivery,
            amount: transfer.sendAmount.toString(),
            fromCurrency: transfer.sendCurrency,
            toCurrency: transfer.receiveCurrency,
            fromCountry: transfer.fromCountry,
            toCountry: transfer.toCountry,
            fromFlag: transfer.fromFlag,
            toFlag: transfer.toFlag,
            verified: true
          };
          setSelectedOffer(offerData);
          setSendAmount(transfer.sendAmount.toString());

          // Determine which step to start at based on status
          if (transfer.status === 'pending') {
            setSendMoneyStep(2); // Start at "Send to Agent" step
          } else if (transfer.status === 'processing') {
            setSendMoneyStep(3); // Start at "Agent Sends" step
          }
          navigateToPage('send-money-flow');
        }} />
          </motion.div>}

        {/* WAITLIST LANDING PAGE - Fully Responsive */}
        {page === 'waitlist' && <motion.div key="waitlist" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 sm:py-16 flex items-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 sm:p-12">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg">
                    <Send className="text-white" size={40} />
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    Join the PayUpp Waitlist
                  </h1>
                  
                  <p className="text-base sm:text-lg text-gray-600 mb-8">
                    Be among the first to experience fast, secure, and affordable international money transfers. We're launching soon!
                  </p>

                  {/* Benefits */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Zap size={20} className="text-white" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Early Access</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Award size={20} className="text-white" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Special Perks</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <DollarSign size={20} className="text-white" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Best Rates</p>
                    </div>
                  </div>

                  {/* Email Form */}
                  <div className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input type="email" placeholder="Enter your email" value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
                      <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 whitespace-nowrap">
                        Join Waitlist
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-200">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">500+</div>
                      <div className="text-xs sm:text-sm text-gray-600">Agents Ready</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">50+</div>
                      <div className="text-xs sm:text-sm text-gray-600">Countries</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">2,500+</div>
                      <div className="text-xs sm:text-sm text-gray-600">On Waitlist</div>
                    </div>
                  </div>

                  {/* Back Button */}
                  <button onClick={() => navigateToPage('home')} className="mt-8 text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-2">
                    ← Back to home
                  </button>
                </div>
              </div>
            </section>
          </motion.div>}

        {/* Footer - Responsive */}
        <footer className="bg-gray-900 text-white py-8 sm:py-12 mt-12 sm:mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="col-span-2 sm:col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Send className="text-white" size={18} />
                  </div>
                  <span className="font-bold text-xl">PayUpp</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Peer-to-peer cross-border transfers through verified local agents.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <button onClick={() => navigateToPage('home')} className="hover:text-white">
                      Send Money
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigateToPage('browse-offers')} className="hover:text-white">
                      Browse Offers
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigateToPage('how-it-works')} className="hover:text-white">
                      How It Works
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">For Agents</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <button onClick={() => navigateToPage('my-business')} className="hover:text-white">
                      My Business
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigateToPage('exchange-rate')} className="hover:text-white">
                      Exchange Rate
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigateToPage('become-agent')} className="hover:text-white">
                      Agent FAQ
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <button onClick={() => navigateToPage('help')} className="hover:text-white">
                      Help Center
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigateToPage('terms-privacy')} className="hover:text-white">
                      Terms & Privacy
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-xs sm:text-sm text-gray-400 text-center">
              © 2026 Payupp. All rights reserved.
            </div>
          </div>
        </footer>
      </AnimatePresence>

      {/* Chat Widget - Fixed at bottom right */}
      {page === 'send-money-flow' && sendMoneyStep === 3 && selectedOffer && <ChatWidget agentName={selectedOffer.agentName} agentLocation={selectedOffer.location || `${selectedOffer.fromCountry} → ${selectedOffer.toCountry}`} />}

      {/* Contact Support Form Modal */}
      <ContactSupportForm isOpen={showContactForm} onClose={() => setShowContactForm(false)} onSubmit={message => {
      console.log('Support message:', message);
    }} />

      {/* General Chat Widget */}
      <GeneralChatWidget isOpen={showGeneralChat} onClose={() => setShowGeneralChat(false)} />
      </div>;
};