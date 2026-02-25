import React, { useState, useRef, useEffect } from 'react';
import { Mail, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
export interface EmailInputWithSuggestionsProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
}
const POPULAR_EMAIL_DOMAINS = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@icloud.com', '@outlook.com'];
export const EmailInputWithSuggestions: React.FC<EmailInputWithSuggestionsProps> = ({
  id = 'email',
  value,
  onChange,
  placeholder = 'you@example.com',
  disabled = false,
  className = '',
  label,
  required = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Generate suggestions as user types
    if (!value || value.includes('@')) {
      // If there's already an @ symbol, check if we should suggest completions
      if (value.includes('@') && !value.endsWith('@')) {
        const [localPart, domainPart] = value.split('@');
        const matchingDomains = POPULAR_EMAIL_DOMAINS.filter(domain => domain.toLowerCase().includes('@' + domainPart.toLowerCase())).map(domain => localPart + domain);
        if (matchingDomains.length > 0 && domainPart.length > 0) {
          setSuggestions(matchingDomains);
          setShowSuggestions(true);
          setSelectedIndex(0);
        } else {
          setShowSuggestions(false);
          setSuggestions([]);
        }
      } else if (value.endsWith('@')) {
        // Show all suggestions when user types @
        const allSuggestions = POPULAR_EMAIL_DOMAINS.map(domain => value + domain.substring(1));
        setSuggestions(allSuggestions);
        setShowSuggestions(true);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
        setSuggestions([]);
      }
      return;
    }

    // If user is typing but hasn't reached @ yet, suggest all popular domains
    if (value.length > 0 && !value.includes('@')) {
      const allSuggestions = POPULAR_EMAIL_DOMAINS.map(domain => value + domain);
      setSuggestions(allSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(0);
    }
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        if (showSuggestions && suggestions[selectedIndex]) {
          e.preventDefault();
          onChange(suggestions[selectedIndex]);
          setShowSuggestions(false);
        }
        break;
      case 'Tab':
        if (showSuggestions && suggestions[selectedIndex]) {
          e.preventDefault();
          onChange(suggestions[selectedIndex]);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };
  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  const handleFocus = () => {
    if (value && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };
  return <div className={className}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && '*'}
        </label>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
          <Mail size={18} className="text-gray-400" />
        </div>

        {/* Actual input */}
        <input ref={inputRef} id={id} type="email" value={value} onChange={handleChange} onKeyDown={handleKeyDown} onFocus={handleFocus} placeholder={placeholder} className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all relative z-10" disabled={disabled} autoComplete="off" />

        {showSuggestions && suggestions.length > 0 && <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-20">
            <ChevronDown size={16} className="text-gray-400" />
          </div>}

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && <motion.div ref={dropdownRef} initial={{
          opacity: 0,
          y: -10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -10
        }} transition={{
          duration: 0.15
        }} className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {suggestions.map((suggestion, index) => <button key={index} type="button" onClick={() => handleSuggestionClick(suggestion)} className={`w-full text-left px-4 py-3 text-sm transition-colors ${index === selectedIndex ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'} ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`} onMouseEnter={() => setSelectedIndex(index)}>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span>{suggestion}</span>
                  </div>
                </button>)}
            </motion.div>}
        </AnimatePresence>
      </div>

      {showSuggestions && suggestions.length > 0 && <p className="mt-1.5 text-xs text-gray-500">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">↑</kbd>{' '}
          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">↓</kbd> to navigate,{' '}
          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">Enter</kbd> or{' '}
          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">Tab</kbd> to select
        </p>}
    </div>;
};