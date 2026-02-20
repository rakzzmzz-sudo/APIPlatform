import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Code, 
  ExternalLink, 
  Search, 
  X, 
  Play, 
  Download, 
  CheckCircle, 
  MessageSquare, 
  Phone, 
  Video as VideoIcon, 
  Mail, 
  Bot, 
  Database, 
  ShieldCheck, 
  Globe, 
  Share2,
  Zap,
  Cpu,
  Trophy,
  Users,
  Copy,
  Eye,
  EyeOff,
  Terminal,
  Activity
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'documentation' | 'video' | 'guide' | 'api';
  category: 'Communication' | 'Voice & Video' | 'Business Tools' | 'Telco APIs' | 'Social Platforms' | 'Onboarding';
  url: string;
  content?: {
    overview: string;
    features: string[];
    sections: {
      title: string;
      content: string;
      code?: string;
    }[];
    learningPath: {
      step: number;
      title: string;
      duration: string;
      completed: boolean;
    }[];
  };
}

const ALL_RESOURCES: Resource[] = [
  // Onboarding
  {
    id: 'platform-overview',
    title: 'Platform Overview & Architecture',
    description: 'Understand the high-level architecture and core components of our CPaaS ecosystem.',
    type: 'video',
    category: 'Onboarding',
    url: '#',
    content: {
      overview: 'A comprehensive 10-minute overview of how our global network connects to your application.',
      features: ['Global Edge Network', 'Security & Compliance', 'Scalability', 'Service Health'],
      sections: [{ title: 'Infrastructure', content: 'Our platform is distributed across 35 regions for 99.99% uptime.' }],
      learningPath: [{ step: 1, title: 'Network Topology', duration: '10m', completed: true }]
    }
  },
  {
    id: 'first-steps',
    title: 'Your First 24 Hours',
    description: 'A step-by-step checklist to get your account fully verified and ready for production.',
    type: 'guide',
    category: 'Onboarding',
    url: '#',
    content: {
      overview: 'Follow this guide to move from sandbox to production environment smoothly.',
      features: ['Account Verification', 'Team Invite', 'Billing Setup', 'First API Call'],
      sections: [{ title: 'Verification', content: 'Upload your business documents in the Settings area.' }],
      learningPath: [{ step: 1, title: 'Account Settings', duration: '15m', completed: true }]
    }
  },

  // Messaging & Communication
  {
    id: 'sms-api',
    title: 'SMS API Reference',
    description: 'Deep dive into global SMS delivery with our high-throughput REST API.',
    type: 'api',
    category: 'Communication',
    url: '#',
    content: {
      overview: 'Our SMS API enables you to send high-priority notifications, OTPs, and marketing messages to 200+ countries with millisecond latency.',
      features: ['Automatic fallbacks', 'URL shortening', 'Concatenation logic', 'DLR tracking'],
      sections: [
        { 
          title: 'Quick Send', 
          content: 'The basic endpoint for sending a message.',
          code: 'POST /v1/sms/send\n{\n  "to": "+60123456789",\n  "text": "Your code is 1234"\n}'
        }
      ],
      learningPath: [
        { step: 1, title: 'Authentication', duration: '5m', completed: true },
        { step: 2, title: 'Country Codes', duration: '5m', completed: false }
      ]
    }
  },
  {
    id: 'whatsapp-guide',
    title: 'WhatsApp Business API Guide',
    description: 'Master interactive messaging and template management on WhatsApp.',
    type: 'guide',
    category: 'Communication',
    url: '#',
    content: {
      overview: 'Build rich, conversational experiences on the world\'s most popular messaging app.',
      features: ['Interactive Buttons', 'Rich Media (PDF/MP4)', 'Shared Inboxes', 'Templates'],
      sections: [{ title: 'Opt-in Policy', content: 'Ensure you follow the mandatory opt-in rules before starting conversations.' }],
      learningPath: [{ step: 1, title: 'Meta Business Setup', duration: '20m', completed: false }]
    }
  },
  {
    id: 'rcs-intro',
    title: 'RCS Messaging Basics',
    description: 'Rich Communication Services - the future of native Android messaging.',
    type: 'video',
    category: 'Communication',
    url: '#',
    content: {
      overview: 'Learn how to use RCS to send rich, branded content directly to the native messaging app on Android.',
      features: ['Verified Senders', 'Carousels', 'Suggested Replies', 'Branding'],
      sections: [{ title: 'Device Support', content: 'RCS depends on carrier and device support.' }],
      learningPath: [{ step: 1, title: 'Sender Registration', duration: '15m', completed: false }]
    }
  },
  {
    id: 'viber-integration',
    title: 'Viber for Business',
    description: 'Low-cost, high-engagement messaging for stable customer relationships.',
    type: 'documentation',
    category: 'Communication',
    url: '#'
  },
  {
    id: 'line-wechat-basics',
    title: 'Line & WeChat Quickstart',
    description: 'Navigate the specific requirements for major Asian messaging platforms.',
    type: 'documentation',
    category: 'Communication',
    url: '#'
  },

  // Voice & Video
  {
    id: 'voice-api-ref',
    title: 'Voice API Documentation',
    description: 'Programmable voice calls, IVRs, and recording management.',
    type: 'api',
    category: 'Voice & Video',
    url: '#',
    content: {
      overview: 'Build complex call flows using our intuitive Voice XML or REST API.',
      features: ['Text-to-Speech (TTS)', 'Speech Recognition (ASR)', 'Recording', 'Transcriptions'],
      sections: [{ title: 'Make a Call', content: 'Initiate an outbound call.', code: 'POST /v1/voice/calls\n{\n  "to": "+60...",\n  "script_url": "https://..."\n}' }],
      learningPath: [{ step: 1, title: 'SIP Trunking', duration: '30m', completed: false }]
    }
  },
  {
    id: 'ai-voice-agent',
    title: 'AI Voice Agent Platform',
    description: 'Deploy human-like AI agents that handle outbound and inbound calls.',
    type: 'guide',
    category: 'Voice & Video',
    url: '#',
    content: {
      overview: 'Our LLM-powered voice agents can handle complex customer queries with low latency and high accuracy.',
      features: ['Emotional Intelligence', 'Zero-buffer ASR', 'Custom Voices', 'CRM Sync'],
      sections: [{ title: 'Prompt Engineering', content: 'Design effective prompts for your AI agent.' }],
      learningPath: [{ step: 1, title: 'Agent Configuration', duration: '45m', completed: false }]
    }
  },
  {
    id: 'video-api-sdk',
    title: 'Video Engine SDK',
    description: 'Embed HD multi-party video conferencing into your apps.',
    type: 'documentation',
    category: 'Voice & Video',
    url: '#'
  },

  // Telco APIs
  {
    id: 'number-verify',
    title: 'Number Verify (CAMARA)',
    description: 'Seamless silent authentication using network-level mobile verification.',
    type: 'api',
    category: 'Telco APIs',
    url: '#',
    content: {
      overview: 'Verify ownership of a mobile number directly with the carrier without OTPs.',
      features: ['Silent Auth', 'Prevention of OTP interception', 'Network-level trust'],
      sections: [{ title: 'API Flow', content: 'Client -> CPaaS -> Global MNO -> Verification.' }],
      learningPath: [{ step: 1, title: 'Header Injection', duration: '10m', completed: false }]
    }
  },
  {
    id: 'sim-swap',
    title: 'SIM Swap Detection',
    description: 'Protect your users from account takeovers by detecting recent SIM changes.',
    type: 'api',
    category: 'Telco APIs',
    url: '#',
    content: {
      overview: 'Check if a subscriber\'s SIM card has been swapped in the last few hours or days.',
      features: ['Fraud Prevention', 'Risk Scoring', 'Real-time check'],
      sections: [{ title: 'Risk Thresholds', content: 'Different banks use different risk windows.' }],
      learningPath: [{ step: 1, title: 'Integration in Auth Flow', duration: '15m', completed: false }]
    }
  },
  {
    id: 'device-location',
    title: 'Device Location Verification',
    description: 'Verify user location using telco-grade precision, anti-spoofing.',
    type: 'api',
    category: 'Telco APIs',
    url: '#'
  },
  {
    id: 'qod-api',
    title: 'Quality on Demand (QoD)',
    description: 'Dynamically boost network performance for critical gaming or video apps.',
    type: 'documentation',
    category: 'Telco APIs',
    url: '#'
  },

  // Business Tools
  {
    id: 'email-campaigns',
    title: 'Email Marketing Masterclass',
    description: 'Deliver high-volume email campaigns that land in the inbox.',
    type: 'video',
    category: 'Business Tools',
    url: '#',
    content: {
      overview: 'Optimizing deliverability with SPF, DKIM, and DMARC setups.',
      features: ['Visual Designer', 'Segmentation', 'Spam Score Check', 'SMTP Relay'],
      sections: [{ title: 'DKIM Setup', content: 'Add these DNS records to verify your domain.' }],
      learningPath: [{ step: 1, title: 'Domain Warm-up', duration: '14 days', completed: false }]
    }
  },
  {
    id: 'chatbot-v3',
    title: 'Omnichannel Chatbot Builder',
    description: 'Visual drag-and-drop builder for AI-powered chat experiences.',
    type: 'guide',
    category: 'Business Tools',
    url: '#'
  },
  {
    id: 'contact-center',
    title: 'Contact Center as a Service',
    description: 'The complete cloud setup for modern support teams.',
    type: 'documentation',
    category: 'Business Tools',
    url: '#'
  },

  // Social Platforms
  {
    id: 'tiktok-marketing',
    title: 'TikTok Ads API Integration',
    description: 'Sync your CRM data with TikTok for powerful retargeting.',
    type: 'documentation',
    category: 'Social Platforms',
    url: '#'
  },
  {
    id: 'instagram-dm',
    title: 'Instagram DM for Business',
    description: 'Automate interactions on the world\'s visual social network.',
    type: 'api',
    category: 'Social Platforms',
    url: '#'
  },
  {
    id: 'facebook-ads',
    title: 'Facebook Lead Ads Sync',
    description: 'Automatically pull leads from Meta into your messaging flows.',
    type: 'documentation',
    category: 'Social Platforms',
    url: '#'
  },
  {
    id: 'youtube-content',
    title: 'YouTube Creator API',
    description: 'Monitor brand mentions and sentiment across YouTube videos.',
    type: 'api',
    category: 'Social Platforms',
    url: '#'
  }
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Resource['category'] | 'All'>('All');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [initializingStep, setInitializingStep] = useState<string | null>(null);
  const [provisionedResources, setProvisionedResources] = useState<Record<string, { apiKey: string, apiSecret: string, endpoint: string }>>({});
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  const handleInitialize = (resourceId: string, resourceTitle: string) => {
    setInitializingStep(resourceId);
    
    // Simulate multi-stage provisioning
    setTimeout(() => {
      const mockApiKey = `mk_live_${Math.random().toString(36).substring(2, 12)}`;
      const mockApiSecret = `sk_${Math.random().toString(36).substring(2, 20)}${Math.random().toString(36).substring(2, 20)}`;
      const mockEndpoint = `https://api.cpaas-global.com/v3/${resourceId}`;

      setProvisionedResources(prev => ({
        ...prev,
        [resourceId]: {
          apiKey: mockApiKey,
          apiSecret: mockApiSecret,
          endpoint: mockEndpoint
        }
      }));
      
      setInitializingStep(null);
      // We don't alert anymore, we show the sandbox view in the modal
    }, 2000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // Visual feedback could be added here if needed, but alert is simpler for now or a toast if available
    // For this implementation, we'll rely on the button state change if possible, but let's stick to simple for now.
  };

  const categories: (Resource['category'] | 'All')[] = [
    'All',
    'Onboarding',
    'Communication',
    'Voice & Video',
    'Telco APIs',
    'Business Tools',
    'Social Platforms'
  ];

  const filteredResources = useMemo(() => {
    return ALL_RESOURCES.filter(resource => {
      const matchesSearch = 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || resource.category === selectedCategory;
        
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'documentation': return FileText;
      case 'video': return Video;
      case 'guide': return BookOpen;
      case 'api': return Code;
      default: return FileText;
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Communication': return { color: '#39FF14', icon: MessageSquare };
      case 'Voice & Video': return { color: '#39FF14', icon: Phone };
      case 'Telco APIs': return { color: '#39FF14', icon: Database };
      case 'Business Tools': return { color: '#39FF14', icon: Zap };
      case 'Social Platforms': return { color: '#39FF14', icon: Share2 };
      default: return { color: '#39FF14', icon: Globe };
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#012419] p-8 selection:bg-[#39FF14] selection:text-black">


      <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#39FF14] transition-colors" />
          <input
            type="text"
            placeholder="Search API references, guides, tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#013221] border border-[#024d30] rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#39FF14] shadow-inner transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat
                  ? 'bg-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20 scale-105'
                  : 'bg-[#013221] border border-[#024d30] text-slate-500 hover:text-white hover:border-[#39FF14]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const Icon = getTypeIcon(resource.type);
          const theme = getCategoryTheme(resource.category);
          return (
            <div
              key={resource.id}
              className="group relative bg-[#013221]/40 border border-[#024d30] rounded-3xl p-8 hover:border-[#39FF14]/40 transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.05)] flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-[#012419] border border-[#024d30] rounded-2xl group-hover:border-[#39FF14]/30 transition-all">
                  <Icon className="w-6 h-6 text-[#39FF14]" />
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-slate-800 text-slate-500">{resource.type}</span>
                   <div className="flex items-center gap-1.5 text-[#39FF14]">
                      <theme.icon className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{resource.category}</span>
                   </div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#39FF14] transition-colors">{resource.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{resource.description}</p>
              </div>

              <button
                onClick={() => setSelectedResource(resource)}
                className="w-full bg-[#013221] hover:bg-[#39FF14] text-[#39FF14] hover:text-black border border-[#39FF14]/20 hover:border-[#39FF14] px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn"
              >
                ACCESS RESOURCE
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-[#013221]/20 border-2 border-dashed border-[#024d30] rounded-3xl p-20 text-center">
          <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-6" />
          <h2 className="text-white font-black text-2xl mb-2 tracking-tight">RESOURCE NOT FOUND</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">We couldn't find any results matching your current filters. Try refining your search or exploring a different category.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="text-[#39FF14] font-black text-sm uppercase tracking-widest border-b-2 border-[#39FF14] pb-1 hover:text-[#32e012] hover:border-[#32e012] transition-colors"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}

      {selectedResource && selectedResource.content && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 lg:p-12 animate-in fade-in duration-300">
          <div className="bg-[#012419] border border-[#39FF14]/30 rounded-[2.5rem] max-w-6xl w-full h-full overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col">
            <div className="p-8 border-b border-[#024d30] flex items-center justify-between shrink-0 bg-[#013221]/30">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-[#012419] border border-[#39FF14]/20 rounded-2xl shadow-lg">
                  {React.createElement(getTypeIcon(selectedResource.type), { className: "w-8 h-8 text-[#39FF14]" })}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#39FF14]">{selectedResource.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{selectedResource.type}</span>
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tighter">{selectedResource.title}</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="w-12 h-12 flex items-center justify-center bg-[#013221] border border-[#024d30] rounded-full text-slate-500 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-12">
              <div className="max-w-4xl mx-auto space-y-16">
                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-4">
                    Product Overview
                    <div className="flex-1 h-px bg-[#024d30]"></div>
                  </h3>
                  <p className="text-2xl font-medium text-slate-300 leading-relaxed">{selectedResource.content.overview}</p>
                </section>

                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-4">
                    Key Features
                    <div className="flex-1 h-px bg-[#024d30]"></div>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedResource.content.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-4 bg-[#013221]/40 p-6 rounded-3xl border border-[#024d30] group hover:border-[#39FF14]/30 transition-all">
                        <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 flex items-center justify-center group-hover:bg-[#39FF14] transition-all">
                           <CheckCircle className="w-4 h-4 text-[#39FF14] group-hover:text-black transition-all" />
                        </div>
                        <span className="text-white font-bold tracking-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-4">
                    Technical Specifications
                    <div className="flex-1 h-px bg-[#024d30]"></div>
                  </h3>
                  <div className="space-y-8">
                    {selectedResource.content.sections.map((section, index) => (
                      <div key={index} className="bg-[#013221]/30 border border-[#024d30] rounded-[2rem] p-8">
                        <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{section.title}</h4>
                        <p className="text-slate-400 mb-8 leading-relaxed font-medium">{section.content}</p>
                        {section.code && (
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#39FF14]/5 to-blue-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <pre className="relative bg-[#011a12] border border-[#024d30] rounded-2xl p-6 overflow-x-auto shadow-2xl">
                              <code className="text-xs text-[#39FF14] font-mono leading-relaxed">{section.code}</code>
                            </pre>
                            <button className="absolute top-4 right-4 p-2 bg-[#013221] hover:bg-[#39FF14] text-slate-500 hover:text-black rounded-xl border border-[#024d30] hover:border-[#39FF14] transition-all shadow-lg active:scale-90">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pb-12">
                   <div className="bg-gradient-to-br from-[#024d30]/60 to-[#013221]/60 border border-[#39FF14]/30 rounded-[2.5rem] p-10 overflow-hidden relative">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                     <h3 className="text-2xl font-black text-white mb-2 tracking-tight">STRUCTURED LEARNING PATH</h3>
                     <p className="text-slate-400 text-sm font-medium mb-10">Follow our curated sequence of modules to become a certified expert in this product.</p>
                     
                     <div className="space-y-4">
                       {selectedResource.content.learningPath.map((step) => (
                         <div
                           key={step.step}
                           className={`flex items-center gap-6 p-6 rounded-3xl border transition-all ${
                             step.completed
                               ? 'bg-[#39FF14]/10 border-[#39FF14]/30'
                               : 'bg-[#011a12]/40 border-[#024d30] hover:border-[#39FF14]/40 hover:translate-x-1'
                           }`}
                         >
                           <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-black transform rotate-3 transition-transform ${
                             step.completed
                               ? 'bg-[#39FF14] text-black shadow-[0_0_20px_rgba(57,255,20,0.4)]'
                               : 'bg-[#013221] border border-[#024d30] text-slate-500'
                           }`}>
                             {step.completed ? <CheckCircle className="w-6 h-6 stroke-[3]" /> : step.step}
                           </div>
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-0.5">
                                <h4 className={`text-lg font-black tracking-tight ${step.completed ? 'text-[#39FF14]' : 'text-white'}`}>
                                    {step.title}
                                </h4>
                                {step.completed && <span className="text-[8px] font-black uppercase tracking-widest text-[#39FF14] bg-[#39FF14]/10 px-2 py-0.5 rounded-full">Validated</span>}
                             </div>
                             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{step.duration} Module</p>
                           </div>
                       {!step.completed && (
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             handleInitialize(selectedResource.id, step.title);
                           }}
                           disabled={initializingStep === selectedResource.id || !!provisionedResources[selectedResource.id]}
                           className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                             provisionedResources[selectedResource.id]
                               ? 'bg-emerald-500 text-black cursor-default'
                               : initializingStep === selectedResource.id
                                 ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                 : 'bg-[#39FF14] hover:bg-white text-black'
                           }`}
                         >
                           {provisionedResources[selectedResource.id] ? (
                             <>
                               <CheckCircle className="w-4 h-4" />
                               PROVISIONED
                             </>
                           ) : initializingStep === selectedResource.id ? (
                             <>
                               <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                               PROVISIONING...
                             </>
                           ) : (
                             <>
                               <Play className="w-4 h-4 fill-current" />
                               INITIALIZE
                             </>
                           )}
                         </button>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
              </section>

               {provisionedResources[selectedResource.id] && (
                 <section className="pb-12">
                   <div className="bg-black/40 border border-[#39FF14]/50 rounded-[2.5rem] p-10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8">
                        <Zap className="w-12 h-12 text-[#39FF14] opacity-20 animate-pulse" />
                     </div>
                     
                     <h3 className="text-2xl font-black text-[#39FF14] mb-2 tracking-tight">SANDBOX ENVIRONMENT ACTIVE</h3>
                     <p className="text-slate-400 text-sm font-medium mb-8">Integrated testing environment for {selectedResource.title}.</p>
                     
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="space-y-6">
                         <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">API Key</label>
                            <div className="flex items-center gap-2 bg-[#011a12] border border-[#024d30] p-4 rounded-xl group/key">
                               <code className="flex-1 text-sm text-[#39FF14] font-mono truncate">{provisionedResources[selectedResource.id].apiKey}</code>
                               <button 
                                 onClick={() => copyToClipboard(provisionedResources[selectedResource.id].apiKey, 'API Key')}
                                 className="p-2 hover:bg-[#39FF14]/10 rounded-lg transition-colors group-hover/key:text-[#39FF14]"
                               >
                                 <Copy className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                         
                         <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">API Secret</label>
                            <div className="flex items-center gap-2 bg-[#011a12] border border-[#024d30] p-4 rounded-xl group/secret">
                               <code className="flex-1 text-sm text-[#39FF14] font-mono truncate">
                                 {revealedSecrets[selectedResource.id] ? provisionedResources[selectedResource.id].apiSecret : '••••••••••••••••••••••••••••••••'}
                               </code>
                               <button 
                                 onClick={() => setRevealedSecrets(prev => ({ ...prev, [selectedResource.id]: !prev[selectedResource.id] }))}
                                 className="p-2 hover:bg-[#39FF14]/10 rounded-lg transition-colors"
                               >
                                 {revealedSecrets[selectedResource.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                               </button>
                               <button 
                                 onClick={() => copyToClipboard(provisionedResources[selectedResource.id].apiSecret, 'API Secret')}
                                 className="p-2 hover:bg-[#39FF14]/10 rounded-lg transition-colors group-hover/secret:text-[#39FF14]"
                               >
                                 <Copy className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                       </div>

                       <div className="space-y-6">
                         <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Regional Endpoint</label>
                            <div className="flex items-center gap-2 bg-[#011a12] border border-[#024d30] p-4 rounded-xl">
                               <Globe className="w-4 h-4 text-slate-500" />
                               <code className="flex-1 text-xs text-slate-300 font-mono italic">{provisionedResources[selectedResource.id].endpoint}</code>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 bg-[#39FF14]/10 hover:bg-[#39FF14] border border-[#39FF14]/30 text-[#39FF14] hover:text-black p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                               <Terminal className="w-4 h-4" />
                               Playground
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                               <Download className="w-4 h-4" />
                               Get SDK
                            </button>
                         </div>
                       </div>
                     </div>

                     <div className="mt-8 pt-8 border-t border-[#024d30] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-emerald-500" />
                           <span className="text-[10px] font-bold text-slate-400">Sandbox Isolation: ENABLED</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Activity className="w-4 h-4 text-[#39FF14]" />
                           <span className="text-[10px] font-bold text-slate-400">Status: OPERATIONAL</span>
                        </div>
                     </div>
                   </div>
                 </section>
               )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
