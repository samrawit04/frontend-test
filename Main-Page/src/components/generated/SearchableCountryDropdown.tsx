"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, MapPin, X } from "lucide-react";
import { COUNTRIES, CountryConfig, getRegions } from "./CountryData";
export interface SearchableCountryDropdownProps {
  value: string;
  onChange: (country: string) => void;
  placeholder?: string;
  className?: string;
}
export default function SearchableCountryDropdown({
  value,
  onChange,
  placeholder = "Search and select country...",
  className = ""
}: SearchableCountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown when user starts typing
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsOpen(true);
    }
  }, [searchQuery]);

  // Filter countries based on search query - always filter, even with empty query
  const filteredCountries = searchQuery.trim() ? COUNTRIES.filter(country => country.name.toLowerCase().startsWith(searchQuery.toLowerCase()) || country.code.toLowerCase().startsWith(searchQuery.toLowerCase())) : COUNTRIES;

  // Group countries by region
  const regions = getRegions();
  const groupedCountries = regions.map(region => ({
    region,
    countries: filteredCountries.filter(c => c.region === region)
  })).filter(group => group.countries.length > 0);
  const handleSelect = (country: CountryConfig) => {
    onChange(country.name);
    setIsOpen(false);
    setSearchQuery("");
  };
  const handleClear = () => {
    onChange("");
    setSearchQuery("");
  };
  return <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Selected value or search input */}
      <div onClick={() => {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }} className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-pointer transition-all ${isOpen ? "ring-2 ring-blue-500 border-transparent" : ""}`}>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
          {value && !searchQuery ? <div className="flex items-center justify-between flex-1">
              <span className="text-gray-900 font-medium">{value}</span>
              <div className="flex items-center gap-1">
                <button onClick={e => {
              e.stopPropagation();
              handleClear();
              setTimeout(() => inputRef.current?.focus(), 100);
            }} className="p-1 hover:bg-gray-100 rounded transition-all">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </div> : <div className="flex items-center justify-between flex-1">
              <input ref={inputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setIsOpen(true)} placeholder={placeholder} className="flex-1 outline-none bg-transparent" onClick={e => e.stopPropagation()} />
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
            </div>}
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {filteredCountries.length === 0 ? <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No countries found</p>
            </div> : <div className="py-2">
              {groupedCountries.map(({
          region,
          countries
        }) => <div key={region}>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50 sticky top-0">
                    {region}
                  </div>
                  {countries.map(country => <button key={country.code} onClick={() => handleSelect(country)} className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-all flex items-center gap-3 ${value === country.name ? "bg-blue-50 text-blue-700" : "text-gray-900"}`}>
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium">{country.name}</div>
                        <div className="text-xs text-gray-500">{country.currency}</div>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{country.code}</span>
                    </button>)}
                </div>)}
            </div>}
        </div>}
    </div>;
}