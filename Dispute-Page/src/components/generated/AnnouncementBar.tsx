import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface Announcement {
  type: 'need' | 'can';
  amount: string;
  currency: string;
  currencySymbol: string;
  country: string;
  countryFlag: string;
  fromCountry: string;
  fromFlag: string;
}
interface AnnouncementBarProps {
  onClick?: () => void;
}
const ANNOUNCEMENTS: Announcement[] = [
// African to African (30%)
{
  type: 'can',
  amount: '150,000',
  currency: 'KES',
  currencySymbol: 'KES',
  country: 'Kenya',
  countryFlag: '🇰🇪',
  fromCountry: 'Ghana',
  fromFlag: '🇬🇭'
}, {
  type: 'need',
  amount: '25,000',
  currency: 'ZAR',
  currencySymbol: 'R',
  country: 'South Africa',
  countryFlag: '🇿🇦',
  fromCountry: 'Nigeria',
  fromFlag: '🇳🇬'
}, {
  type: 'can',
  amount: '50,000',
  currency: 'MUR',
  currencySymbol: 'MUR',
  country: 'Mauritius',
  countryFlag: '🇲🇺',
  fromCountry: 'Ghana',
  fromFlag: '🇬🇭'
}, {
  type: 'need',
  amount: '80,000',
  currency: 'TZS',
  currencySymbol: 'TSh',
  country: 'Tanzania',
  countryFlag: '🇹🇿',
  fromCountry: 'Kenya',
  fromFlag: '🇰🇪'
},
// African to International (70%)
{
  type: 'can',
  amount: '5,000',
  currency: 'USD',
  currencySymbol: '$',
  country: 'USA',
  countryFlag: '🇺🇸',
  fromCountry: 'Ghana',
  fromFlag: '🇬🇭'
}, {
  type: 'need',
  amount: '1,500',
  currency: 'CNY',
  currencySymbol: '¥',
  country: 'China',
  countryFlag: '🇨🇳',
  fromCountry: 'Kenya',
  fromFlag: '🇰🇪'
}, {
  type: 'can',
  amount: '3,500',
  currency: 'EUR',
  currencySymbol: '€',
  country: 'Europe',
  countryFlag: '🇪🇺',
  fromCountry: 'South Africa',
  fromFlag: '🇿🇦'
}, {
  type: 'need',
  amount: '2,500',
  currency: 'GBP',
  currencySymbol: '£',
  country: 'UK',
  countryFlag: '🇬🇧',
  fromCountry: 'Ghana',
  fromFlag: '🇬🇭'
}, {
  type: 'can',
  amount: '8,000',
  currency: 'USD',
  currencySymbol: '$',
  country: 'USA',
  countryFlag: '🇺🇸',
  fromCountry: 'Nigeria',
  fromFlag: '🇳🇬'
}, {
  type: 'need',
  amount: '4,200',
  currency: 'GBP',
  currencySymbol: '£',
  country: 'UK',
  countryFlag: '🇬🇧',
  fromCountry: 'Tanzania',
  fromFlag: '🇹🇿'
}, {
  type: 'can',
  amount: '1,200',
  currency: 'CAD',
  currencySymbol: 'C$',
  country: 'Canada',
  countryFlag: '🇨🇦',
  fromCountry: 'Kenya',
  fromFlag: '🇰🇪'
}, {
  type: 'need',
  amount: '500',
  currency: 'EUR',
  currencySymbol: '€',
  country: 'Germany',
  countryFlag: '🇩🇪',
  fromCountry: 'Egypt',
  fromFlag: '🇪🇬'
}, {
  type: 'can',
  amount: '850',
  currency: 'AUD',
  currencySymbol: 'A$',
  country: 'Australia',
  countryFlag: '🇦🇺',
  fromCountry: 'South Africa',
  fromFlag: '🇿🇦'
}];
export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    // Change announcement every 15 seconds (15000ms)
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % ANNOUNCEMENTS.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);
  const current = ANNOUNCEMENTS[currentIndex];
  return <div className="bg-gradient-to-r from-blue-600 to-purple-700 border-b border-blue-800 cursor-pointer hover:from-blue-700 hover:to-purple-800 transition-colors" onClick={onClick}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2.5 sm:py-3">
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: 10
          }} transition={{
            duration: 0.3
          }} className="flex items-center justify-center gap-2 text-white text-sm sm:text-base">
              <span className="font-semibold">
                {current.type === 'need' ? 'Need' : 'Can send'}
              </span>
              <span className="font-bold text-yellow-300">
                {current.currencySymbol} {current.amount}
              </span>
              <span>
                {current.type === 'need' ? 'sent to' : 'to'}
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="text-xl">{current.countryFlag}</span>
                <span>{current.country}</span>
              </span>
              <span>from</span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="text-xl">{current.fromFlag}</span>
                <span>{current.fromCountry}</span>
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>;
};