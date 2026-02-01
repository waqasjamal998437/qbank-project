'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';

export default function MinimalBuddy() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hi there! 👋 I'm MinimalBuddy, your study companion. How can I help you today?", isUser: false }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, isUser: true }]);
      setMessage('');
      
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Thanks for your message! I'm here to help you succeed in your medical studies. Feel free to ask me anything!", 
          isUser: false 
        }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40"
          aria-label="Open chat"
        >
          <MessageCircle className="w-7 h-7 transition-transform group-hover:scale-110" />
          {/* Pulse effect */}
          <span className="absolute inset-0 rounded-2xl bg-indigo-400 animate-ping opacity-25"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-96 overflow-hidden border border-gray-100 dark:border-slate-800">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-4">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">MinimalBuddy</h3>
                    <p className="text-white/70 text-xs">Online • Always here to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-900 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.isUser
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 shadow-sm border border-gray-100 dark:border-slate-700 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="w-full px-4 py-3 pl-4 bg-gray-100 dark:bg-slate-800 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 transition-all"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={`p-3 rounded-2xl transition-all duration-300 ${
                    message.trim()
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/30'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
