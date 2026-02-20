"use client";

import { use } from 'react';
import { usePathname } from 'next/navigation';
import Dashboard from '@/components/Dashboard/Dashboard';
import ChannelPage from '@/components/Channels/ChannelPage';
import Settings from '@/components/Settings/Settings';
import ProductCatalog from '@/components/Management/ProductCatalog';
import Billing from '@/components/Management/Billing';
import Resources from '@/components/Management/Resources';
import Reports from '@/components/Management/Reports';
import Recordings from '@/components/Management/Recordings';


import Documentation from '@/components/Developer/Documentation';
import FeatureValidation from '@/components/Testing/FeatureValidation';
import VideoAPI from '@/components/Channels/VideoAPI';
import BulkSMS from '@/components/Channels/BulkSMS';
import BulkRCS from '@/components/Channels/BulkRCS';
import BulkWhatsApp from '@/components/Channels/BulkWhatsApp';
import VoiceAPI from '@/components/Channels/VoiceAPI';
import ContactCenterNew from '@/components/Channels/ContactCenterNew';
import ChatbotBuilder from '@/components/Chatbot/ChatbotBuilder';
import VoiceAgent from '@/components/Channels/VoiceAgentPlatform';
import MeetingsAI from '@/components/Channels/MeetingsAI';
import Cart from '@/components/Cart/Cart';
import APIMarketplace from '@/components/Channels/APIMarketplace';
import EmailCampaigns from '@/components/Channels/EmailCampaigns';
import TelcoAPI from '@/components/Channels/TelcoAPI';
import TikTokCampaigns from '@/components/Channels/TikTokCampaigns';
import InstagramCampaigns from '@/components/Channels/InstagramCampaigns';
import FacebookCampaigns from '@/components/Channels/FacebookCampaigns';
import YouTubeCampaigns from '@/components/Channels/YouTubeCampaigns';
import LinkedInCampaigns from '@/components/Channels/LinkedInCampaigns';
import BulkViber from '@/components/Channels/BulkViber';
import BulkLine from '@/components/Channels/BulkLine';
import BulkWeChat from '@/components/Channels/BulkWeChat';
import Subscriptions from '@/components/Management/Subscriptions';
import SimSwapAPI from '@/components/Channels/SimSwapAPI';
import { useRouter } from 'next/navigation';
import NumberVerificationAPI from '@/components/Channels/NumberVerificationAPI';
import DeviceLocationAPI from '@/components/Channels/DeviceLocationAPI';
import QoDAPI from '@/components/Channels/QoDAPI';
import SIPTrunk from '@/components/Channels/SIPTrunk';
import DIDManagement from '@/components/Channels/DIDManagement';
import ITServiceManagement from '@/components/Management/ITServiceManagement';

export default function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const router = useRouter();
  // Use React.use() to unwrap the promise in a client component
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const view = slug ? slug[0] : 'dashboard';

  switch (view) {
    case 'dashboard':
      return <Dashboard />;
    case 'product-catalog':
      return <ProductCatalog />;
    case 'billing':
      return <Billing />;
    case 'settings':
      return <Settings />;
    case 'subscriptions':
      return <Subscriptions />;
    case 'resources':
      return <Resources />;
    case 'reports':
      return <Reports />;
    case 'recordings':
      return <Recordings />;


    case 'documentation':
      return <Documentation />;
    case 'feature-validation':
      return <FeatureValidation />;
    case 'tiktok':
      return <TikTokCampaigns />;
    case 'instagram':
      return <InstagramCampaigns />;
    case 'facebook':
      return <FacebookCampaigns />;
    case 'youtube':
      return <YouTubeCampaigns />;
    case 'linkedin':
      return <LinkedInCampaigns />;
    case 'viber':
      return <BulkViber />;
    case 'line':
      return <BulkLine />;
    case 'wechat':
      return <BulkWeChat />;
    case 'sms':
      return <BulkSMS />;
    case 'rcs':
      return <BulkRCS />;
    case 'whatsapp':
      return <BulkWhatsApp />;
    case 'voice-api':
      return <VoiceAPI />;
    case 'cc':
      return <ContactCenterNew />;
    case 'chatbot':
      return <ChatbotBuilder />;
    case 'voice-agent':
      return <VoiceAgent />;
    case 'meetings-ai':
      return <MeetingsAI />;
    case 'video-api':
      return <VideoAPI />;
    case 'api-marketplace':
      return <APIMarketplace />;
    case 'email':
      return <EmailCampaigns />;
    case 'sim-swap':
      return <SimSwapAPI />;
    case 'number-verification':
      return <NumberVerificationAPI />;
    case 'device-location':
      return <DeviceLocationAPI />;
    case 'qod':
      return <QoDAPI />;
    case 'sip-trunk':
      return <SIPTrunk />;
    case 'did':
      return <DIDManagement />;
    case 'it-service':
      return <ITServiceManagement />;
    case 'telco-api':
      return <TelcoAPI onNavigate={(path) => router.push(path.startsWith('/') ? path : `/${path}`)} />;
    case 'cart':
      return <Cart onNavigate={(path) => router.push(path.startsWith('/') ? path : `/${path}`)} />;
    default:
      return <Dashboard />;
  }
}
