import React from 'react';
import { Settings, Play, Phone, Clock } from 'lucide-react';

export default function VoiceManagement() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Voice Management & IVR</h2>
        <p className="text-slate-400 mb-6">
          Configure your Voice AI settings, IVR menus, and call routing rules here.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#39FF14]/20 p-2 rounded-lg">
                <Play className="w-6 h-6 text-[#39FF14]" />
              </div>
              <h3 className="text-lg font-semibold text-white">IVR Menus</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Set up auto-attendant menus with multi-level options and custom greetings.
            </p>
            <button className="bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Manage Menus
            </button>
          </div>

          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#39FF14]/20/20 p-2 rounded-lg">
                <Settings className="w-6 h-6 text-[#39FF14]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Call Routing</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Configure business hours, holiday routing, and failover numbers.
            </p>
            <button className="bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Configure Routing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
