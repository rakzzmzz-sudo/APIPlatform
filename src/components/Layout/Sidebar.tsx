"use client";

import {
  Home,
  MessageSquare,
  MessageCircle,
  Phone,
  Video,
  Bot,
  Facebook,
  Mail,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  User,
  Instagram,
  Music,
  Linkedin,
  Youtube,
  FolderKanban,
  Package,
  CreditCard,
  BookOpen,
  BarChart3,
  Mic,
  Play,
  HelpCircle,
  FileText,
  CheckCircle,
  Code,
  Workflow,
  Users,
  Antenna,
  Building2,
  MapPin,
  Activity,
  Network,
  Hash,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { profile, signOut, hasMenuAccess } = useAuth();
  const pathname = usePathname();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'MAIN', menuKey: 'dashboard', path: '/' },
    { id: 'sms', label: 'SMS API', icon: MessageSquare, section: 'COMMUNICATION', menuKey: 'bulk_sms', path: '/sms' },
    { id: 'rcs', label: 'RCS API', icon: MessageCircle, section: 'COMMUNICATION', menuKey: 'bulk_rcs', path: '/rcs' },
    { id: 'whatsapp', label: 'Whatsapp API', icon: MessageCircle, section: 'COMMUNICATION', menuKey: 'bulk_whatsapp', path: '/whatsapp' },
    { id: 'telephony', label: 'Voice API', icon: Phone, section: 'COMMUNICATION', menuKey: 'telephony', path: '/voice-api' },
    { id: 'chatbot', label: 'AI Chat bot', icon: Bot, section: 'COMMUNICATION', menuKey: 'chatbot', path: '/chatbot' },
    { id: 'voice-agent', label: 'Voice Agent', icon: Phone, section: 'COMMUNICATION', menuKey: 'voice_agent', path: '/voice-agent' },
    { id: 'meetings-ai', label: 'Meetings AI', icon: Video, section: 'COMMUNICATION', menuKey: 'meetings_ai', path: '/meetings-ai' },
    { id: 'recordings', label: 'Recordings', icon: Mic, section: 'COMMUNICATION', menuKey: 'recordings', path: '/recordings' },
    { id: 'video-api', label: 'Video API', icon: Code, section: 'COMMUNICATION', menuKey: 'video_api', path: '/video-api' },
    { id: 'email', label: 'Email', icon: Mail, section: 'COMMUNICATION', menuKey: 'email_campaigns', path: '/email' },
    { id: 'sim-swap', label: 'SIM Swap Detection', icon: Antenna, section: 'COMMUNICATION', menuKey: 'telco_api', path: '/sim-swap' },
    { id: 'number-verify', label: 'Number Verification', icon: CheckCircle, section: 'COMMUNICATION', menuKey: 'telco_api', path: '/number-verification' },
    { id: 'device-location', label: 'Device Location', icon: MapPin, section: 'COMMUNICATION', menuKey: 'telco_api', path: '/device-location' },
    { id: 'qod', label: 'Quality on Demand', icon: Activity, section: 'COMMUNICATION', menuKey: 'telco_api', path: '/qod' },
    { id: 'sip-trunk', label: 'SIP Trunk', icon: Network, section: 'COMMUNICATION', menuKey: 'sip_trunk', path: '/sip-trunk' },
    { id: 'did', label: 'DID Numbers', icon: Hash, section: 'COMMUNICATION', menuKey: 'sip_trunk', path: '/did' },
    { id: 'tiktok', label: 'TikTok', icon: Music, section: 'SOCIAL PLATFORMS', menuKey: 'tiktok', path: '/tiktok' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, section: 'SOCIAL PLATFORMS', menuKey: 'instagram', path: '/instagram' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, section: 'SOCIAL PLATFORMS', menuKey: 'facebook', path: '/facebook' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, section: 'SOCIAL PLATFORMS', menuKey: 'youtube', path: '/youtube' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, section: 'SOCIAL PLATFORMS', menuKey: 'linkedin', path: '/linkedin' },
    { id: 'viber', label: 'Viber', icon: Phone, section: 'SOCIAL PLATFORMS', menuKey: 'viber', path: '/viber' },
    { id: 'line', label: 'Line', icon: MessageCircle, section: 'SOCIAL PLATFORMS', menuKey: 'line', path: '/line' },
    { id: 'wechat', label: 'WeChat', icon: MessageSquare, section: 'SOCIAL PLATFORMS', menuKey: 'wechat', path: '/wechat' },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard, section: 'MANAGEMENT', menuKey: 'billing', path: '/billing' },
    { id: 'resources', label: 'Resources', icon: BookOpen, section: 'MANAGEMENT', menuKey: 'resources', path: '/resources' },
    { id: 'reports', label: 'Reports', icon: BarChart3, section: 'MANAGEMENT', menuKey: 'reports', path: '/reports' },
    { id: 'api-marketplace', label: 'API Marketplace', icon: Package, section: 'MANAGEMENT', menuKey: 'api_marketplace', path: '/api-marketplace' },
    { id: 'it-service', label: 'IT Service Management', icon: Shield, section: 'MANAGEMENT', menuKey: 'api_marketplace', path: '/it-service' },


    { id: 'documentation', label: 'Documentation', icon: FileText, section: 'MANAGEMENT', menuKey: 'documentation', path: '/documentation' },
    { id: 'feature-validation', label: 'Feature Validation', icon: CheckCircle, section: 'MANAGEMENT', menuKey: 'feature_validation', path: '/feature-validation' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, section: 'SETTINGS', menuKey: 'settings', path: '/settings' },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, section: 'MANAGEMENT', menuKey: 'subscriptions', path: '/subscriptions' },
  ];

  const filteredNavigationItems = navigationItems.filter(item => hasMenuAccess(item.menuKey));
  const sections = Array.from(new Set(filteredNavigationItems.map(item => item.section)));

  return (
    <div className="w-64 bg-[#012419] flex flex-col h-screen transition-all duration-300">
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <img src="/image copy.png" alt="Logo" className="w-12 h-12 drop-shadow-[0_0_8px_rgba(57,255,20,0.3)]" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-emerald-900 scrollbar-track-transparent">
        {sections.map(section => {
          const sectionItems = filteredNavigationItems.filter(item => item.section === section);
          if (sectionItems.length === 0) return null;

          return (
            <div key={section} className="mb-8">
              <div className="px-6 mb-3">
                <span className="text-[10px] font-bold text-[#39FF14] uppercase tracking-[0.2em] opacity-70">
                  {section}
                </span>
              </div>
              <nav className="space-y-1 px-4">
                {sectionItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));

                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-[#39FF14]/10 text-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.15)] border border-[#39FF14]/20'
                          : 'text-slate-400 hover:bg-slate-800/30 hover:text-white hover:translate-x-1'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} style={{ color: isActive ? '#39FF14' : '#39FF14' }} />
                        <span className={`text-sm font-medium tracking-wide ${isActive ? 'text-[#39FF14]' : 'group-hover:text-[#39FF14]'}`}>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 animate-pulse" style={{ color: '#39FF14' }} />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>
    </div>
  );
}
