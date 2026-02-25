"use client";

import React, { useState } from 'react';
import { MessageCircle, X, Send, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}
interface GeneralChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}
export const GeneralChatWidget = ({
  isOpen,
  onClose
}: GeneralChatWidgetProps) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: 'Hello! Welcome to PayUpp Support. How can we help you today?',
    sender: 'support',
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! A support representative will assist you shortly. In the meantime, feel free to check our Help Center for quick answers.",
        sender: 'support',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportResponse]);
    }, 1000);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const quickActions = ['I need help with a transfer', 'How do I become an agent?', 'What are your fees?', 'Security and verification'];
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop for mobile */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/50 z-50 md:hidden" />

          {/* Chat Window */}
          <motion.div initial={{
        opacity: 0,
        y: 20,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: 20,
        scale: 0.95
      }} transition={{
        duration: 0.2
      }} className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-full md:max-w-[380px] h-full md:h-[600px] bg-white md:rounded-2xl shadow-2xl border-t md:border border-gray-200 z-50 flex flex-col overflow-hidden" style={{
        maxHeight: 'calc(100vh)'
      }}>
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                  <Headphones size={20} />
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">PayUpp Support</h3>
                  <p className="text-xs text-blue-100">Online - We typically reply instantly</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map(message => <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' : 'bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-md'} px-4 py-2.5 shadow-sm`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                    </p>
                  </div>
                </div>)}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickActions.map((action, index) => <button key={index} onClick={() => {
              setInputMessage(action);
            }} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap transition-colors">
                    {action}
                  </button>)}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5">
                  <textarea value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-500 resize-none outline-none" rows={1} style={{
                maxHeight: '80px'
              }} />
                </div>
                <button onClick={handleSendMessage} disabled={!inputMessage.trim()} className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0">
                  <Send size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Chat with our support team
              </p>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
};