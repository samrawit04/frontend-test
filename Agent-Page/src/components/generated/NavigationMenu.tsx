"use client";

import * as React from "react";
import { Send } from "lucide-react";
export interface NavigationMenuProps {
  onNavigate?: (section: string) => void;
  currentView?: string;
}
export default function NavigationMenu({
  onNavigate,
  currentView
}: NavigationMenuProps) {
  const handleNavigate = (section: string) => {
    onNavigate?.(section);
  };
  return <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and main navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <button onClick={() => handleNavigate('profile')} className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Send className="w-5 h-5 text-white" />
              </div>
              <span>Payupp</span>
            </button>

            {/* Main Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => handleNavigate('browseOffers')} className={`px-4 py-5 text-sm font-medium transition-all border-b-2 ${currentView === 'browseOffers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-700 hover:text-blue-600'}`}>
                Browse Offers
              </button>
              <button onClick={() => handleNavigate('howItWorks')} className={`px-4 py-5 text-sm font-medium transition-all border-b-2 ${currentView === 'howItWorks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-700 hover:text-blue-600'}`}>
                How It Works
              </button>
              <button onClick={() => handleNavigate('becomeAgent')} className={`px-4 py-5 text-sm font-medium transition-all border-b-2 ${currentView === 'becomeAgent' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-700 hover:text-blue-600'}`}>
                Become An Agent
              </button>
            </div>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center gap-1">
            <button onClick={() => handleNavigate('myBusiness')} className={`px-4 py-5 text-sm font-medium transition-all border-b-2 hidden sm:block ${currentView === 'myBusiness' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-700 hover:text-blue-600'}`}>
              My Business
            </button>
            <button onClick={() => handleNavigate('transferRequests')} className={`px-4 py-2 mx-2 text-white text-sm font-medium rounded-lg transition-colors ${currentView === 'transferRequests' ? 'bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'}`}>
              Orders
            </button>
            <button onClick={() => handleNavigate('help')} className={`px-4 py-5 text-sm font-medium transition-all border-b-2 hidden sm:block ${currentView === 'help' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-700 hover:text-blue-600'}`}>
              Help
            </button>
            <button onClick={() => handleNavigate('profile')} className={`px-4 py-5 text-sm font-medium transition-all border-b-2 hidden sm:block ${currentView === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-700 hover:text-blue-600'}`}>
              Profile
            </button>
          </div>
        </div>
      </div>
    </nav>;
}