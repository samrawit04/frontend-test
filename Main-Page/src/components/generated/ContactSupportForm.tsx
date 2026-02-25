"use client";

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface ContactSupportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (message: string) => void;
}
export const ContactSupportForm = ({
  isOpen,
  onClose,
  onSubmit
}: ContactSupportFormProps) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onSubmit?.(message);

      // Reset after 2 seconds
      setTimeout(() => {
        setMessage('');
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/50 z-50" />

          {/* Modal */}
          <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} transition={{
        duration: 0.2
      }} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Contact Support</h2>
                    <p className="text-sm text-blue-100">We'll respond within 24 hours</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                {!isSuccess ? <>
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        How can we help you?
                      </label>
                      <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your question or issue..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm" rows={6} required />
                      <p className="text-xs text-gray-500 mt-2">
                        Please be as detailed as possible to help us assist you better.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                      <button type="submit" disabled={!message.trim() || isSubmitting} className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                        {isSubmitting ? <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </> : <>
                            <Send size={18} />
                            Submit
                          </>}
                      </button>
                    </div>
                  </> : <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Our support team will get back to you soon.
                    </p>
                  </div>}
              </form>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
};