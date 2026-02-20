import { useState } from 'react';
import { Users, Key, Plug, Shield, FileText, Settings as SettingsIcon, Bell, Download, Activity } from 'lucide-react';
import UserManagement from './UserManagement';
import AccessManagement from './AccessManagement';
import IntegrationsManagement from './IntegrationsManagement';
import SecurityManagement from './SecurityManagement';
import AuditManagement from './AuditManagement';
import Preferences from './Preferences';
import NotificationsSettings from './NotificationsSettings';
import DataPrivacy from './DataPrivacy';
import ActivityLogs from './ActivityLogs';

type Tab = 'preferences' | 'users' | 'access' | 'integrations' | 'security' | 'notifications' | 'privacy' | 'activity' | 'audit';

const tabs = [
  { id: 'preferences' as Tab, label: 'Preferences', icon: SettingsIcon },
  { id: 'users' as Tab, label: 'User Management', icon: Users },
  { id: 'access' as Tab, label: 'Access Management', icon: Key },
  { id: 'integrations' as Tab, label: 'Integrations', icon: Plug },
  { id: 'security' as Tab, label: 'Security', icon: Shield },
  { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
  { id: 'privacy' as Tab, label: 'Data & Privacy', icon: Download },
  { id: 'activity' as Tab, label: 'Activity', icon: Activity },
  { id: 'audit' as Tab, label: 'Audit Logs', icon: FileText },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('preferences');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'preferences':
        return <Preferences />;
      case 'users':
        return <UserManagement />;
      case 'access':
        return <AccessManagement />;
      case 'integrations':
        return <IntegrationsManagement />;
      case 'security':
        return <SecurityManagement />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'privacy':
        return <DataPrivacy />;
      case 'activity':
        return <ActivityLogs />;
      case 'audit':
        return <AuditManagement />;
      default:
        return <Preferences />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#013221] p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400 text-lg">Manage your platform configuration and preferences</p>
      </div>

      <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-2xl overflow-hidden">
        <div className="border-b border-[#024d30]">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-medium transition-all relative whitespace-nowrap ${
                    isActive
                      ? 'text-[#39FF14] bg-[#024d30]/50'
                      : 'text-slate-400 hover:text-white hover:bg-[#024d30]/30'
                  }`}
                >
                  <Icon className="w-5 h-5" style={{ color: '#40C706' }} />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#39FF14] to-[#32e012]"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
