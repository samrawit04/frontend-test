"use client";

import React, { useState } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}
interface ChatWidgetProps {
  agentName?: string;
  agentAvatar?: string;
  agentLocation?: string;
}
export const ChatWidget = ({
  agentName = 'Agent',
  agentAvatar,
  agentLocation = 'Online'
}: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: 'Hello! I can help with your transfer. How can I assist you?',
    sender: 'agent',
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

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I've received your message. Let me help you with that!",
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1000);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return <>
      {/* Chat Button - Fixed at bottom right */}
      <motion.button onClick={() => setIsOpen(true)} className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all ${isOpen ? 'scale-0' : 'scale-100'}`} whileHover={{
      scale: 1.1
    }} whileTap={{
      scale: 0.95
    }} initial={{
      scale: 0,
      opacity: 0
    }} animate={{
      scale: isOpen ? 0 : 1,
      opacity: isOpen ? 0 : 1
    }} transition={{
      duration: 0.2
    }}>
        <MessageCircle size={24} />
        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          1
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && <motion.div initial={{
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
      }} className="fixed bottom-6 right-6 w-full max-w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden" style={{
        maxHeight: 'calc(100vh - 3rem)'
      }}>
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                  {agentAvatar ? <img src={agentAvatar} alt={agentName} className="w-full h-full rounded-full object-cover" /> : <User size={20} />}
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{agentName}</h3>
                  <p className="text-xs text-blue-100">{agentLocation}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
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
                <button onClick={() => {
              setInputMessage('What are your fees?');
              handleSendMessage();
            }} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap transition-colors">
                  Your fees?
                </button>
                <button onClick={() => {
              setInputMessage('How long does it take?');
              handleSendMessage();
            }} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap transition-colors">
                  Delivery time?
                </button>
                <button onClick={() => {
              setInputMessage('What payment methods do you accept?');
              handleSendMessage();
            }} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap transition-colors">
                  Payment methods?
                </button>
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
                Chat directly with your agent
              </p>
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* Mobile Responsive - Full screen on small devices */}
      <style>{`
        @media (max-width: 640px) {
          .fixed.bottom-6.right-6.w-full.max-w-\\[380px\\] {
            bottom: 0;
            right: 0;
            left: 0;
            max-width: 100%;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
          }
        }
      `}</style>
    </>;
};