"use client";

import React, { useState } from 'react';
import { Phone, X, Delete, PhoneCall } from 'lucide-react';

interface DialpadProps {
  onClose: () => void;
}

export default function Dialpad({ onClose }: DialpadProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');

  const handleNumberClick = (num: string) => {
    setPhoneNumber(prev => prev + num);
  };

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (phoneNumber.length > 0) {
      setCallStatus('calling');
      // Simulate call connection
      setTimeout(() => setCallStatus('connected'), 2000);
    }
  };

  const handleEndCall = () => {
    setCallStatus('idle');
    setPhoneNumber('');
  };

  const buttons = [
    { label: '1', sub: '' },
    { label: '2', sub: 'ABC' },
    { label: '3', sub: 'DEF' },
    { label: '4', sub: 'GHI' },
    { label: '5', sub: 'JKL' },
    { label: '6', sub: 'MNO' },
    { label: '7', sub: 'PQRS' },
    { label: '8', sub: 'TUV' },
    { label: '9', sub: 'WXYZ' },
    { label: '*', sub: '' },
    { label: '0', sub: '+' },
    { label: '#', sub: '' },
  ];

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#39FF14]/20 rounded-full flex items-center justify-center">
            <Phone className="w-4 h-4 text-brand-lime" />
          </div>
          <span className="text-white font-bold">Dialpad</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Display */}
      <div className="p-6 bg-white/5 relative">
        <div className="text-center mb-2">
          {callStatus === 'calling' && (
            <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wider animate-pulse">Calling...</span>
          )}
          {callStatus === 'connected' && (
            <span className="text-xs text-green-400 font-semibold uppercase tracking-wider">Connected</span>
          )}
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 min-h-[60px] flex items-center justify-center border border-white/5">
          <input
            type="text"
            value={phoneNumber}
            readOnly
            placeholder="Enter number"
            className="bg-transparent text-white text-2xl font-mono text-center w-full outline-none"
          />
        </div>
        {phoneNumber.length > 0 && callStatus === 'idle' && (
          <button
            onClick={handleDelete}
            className="absolute right-8 top-1/2 -translate-y-1/2 mt-1 p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white"
          >
            <Delete className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Keypad */}
      <div className="p-4 grid grid-cols-3 gap-3">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => handleNumberClick(btn.label)}
            disabled={callStatus !== 'idle'}
            className={`aspect-square rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col items-center justify-center group ${
              callStatus !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">
              {btn.label}
            </span>
            {btn.sub && (
              <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                {btn.sub}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Call Button */}
      <div className="p-4 pt-0">
        {callStatus === 'idle' ? (
          <button
            onClick={handleCall}
            disabled={phoneNumber.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-wider shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-all"
          >
            <PhoneCall className="w-5 h-5" />
            Call
          </button>
        ) : (
          <button
            onClick={handleEndCall}
            className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-wider shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 transition-all"
          >
            <Phone className="w-5 h-5 rotate-[135deg]" />
            End Call
          </button>
        )}
      </div>
    </div>
  );
}
