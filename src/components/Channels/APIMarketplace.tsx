import { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, TrendingUp, Key, Copy, CheckCircle, ExternalLink,
  Code, Package, Zap, Shield, Clock, DollarSign, Activity, Plus, X,
  Download, Settings, Share2, Globe, MessageSquare, Phone, Video,
  Terminal, ShieldAlert, Cpu, Layers, ShoppingCart, Info, Eye, EyeOff
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';

interface Industry {
  id: string;
  industry_name: string;
  icon: any;
  description: string;
}

interface APIMarketplaceProps {
  onNavigate?: (page: string) => void;
}

const USE_CASES = [
  { id: 'all', name: 'All Use Cases' },
  { id: 'auth', name: 'Authentication & Security' },
  { id: 'marketing', name: 'Customer Engagement' },
  { id: 'ops', name: 'Operational Services' },
  { id: 'support', name: 'Support & Concierge' },
  { id: 'kyc', name: 'Identity & Compliance' }
];

const INDUSTRIES: Industry[] = [
  { id: 'all', industry_name: 'All Industries', icon: Globe, description: 'All available APIs' },
  { id: 'finance', industry_name: 'Finance & Banking', icon: Shield, description: 'Secure financial communications' },
  { id: 'retail', industry_name: 'Retail & E-commerce', icon: ShoppingCart, description: 'Engagement and logistics' },
  { id: 'health', industry_name: 'Healthcare', icon: Activity, description: 'Privacy-first medical connectivity' },
  { id: 'tech', industry_name: 'Tech & SaaS', icon: Cpu, description: 'Developer-first infrastructure' }
];

const MARKETPLACE_APIS = [
  // Communication
  {
    id: 'otp-verify',
    title: 'Omnichannel OTP Verify',
    useCaseId: 'auth',
    industryId: 'finance',
    description: 'High-speed delivery of one-time passwords via SMS, WhatsApp, and Voice.',
    pricing: 'RM 0.05 / verification',
    unitPrice: 0.05,
    status: '99.99%',
    latency: '1.2s',
    features: ['Failover Logic', 'Country Filtering', 'Custom Templates'],
    icon: ShieldAlert,
    productCode: 'OTP_VERIFY'
  },
  {
    id: 'verified-wa',
    title: 'WhatsApp Verified Senders',
    useCaseId: 'marketing',
    industryId: 'retail',
    description: 'Official API for WhatsApp Business Messaging with Green Badge support.',
    pricing: 'RM 450.00 / month',
    unitPrice: 450.00,
    status: '99.98%',
    latency: '0.8s',
    features: ['Rich Media', 'Templates', 'Interactive Buttons'],
    icon: MessageSquare,
    productCode: 'WA_SENDER'
  },
  {
    id: 'sim-swap',
    title: 'SIM Swap Detection',
    useCaseId: 'auth',
    industryId: 'finance',
    description: 'Real-time detection of SIM change events to prevent account takeover.',
    pricing: 'RM 0.12 / check',
    unitPrice: 0.12,
    status: '99.95%',
    latency: '0.4s',
    features: ['Network Insights', 'Fraud Scoring', 'Telco-Grade'],
    icon: Phone,
    productCode: 'SIM_SWAP'
  },
  {
    id: 'video-kyc',
    title: 'Live Video KYC',
    useCaseId: 'kyc',
    industryId: 'finance',
    description: 'Secure, low-latency video streaming for remote identity verification.',
    pricing: 'RM 5.50 / session',
    unitPrice: 5.50,
    status: '100%',
    latency: '150ms',
    features: ['Face Matching', 'OCR Integration', 'Recording'],
    icon: Video,
    productCode: 'VIDEO_KYC'
  },
// ... rest of MARKETPLACE_APIS ...
  {
    id: 'voice-concierge',
    title: 'AI Voice Concierge',
    useCaseId: 'support',
    industryId: 'health',
    description: 'Natural language voice bot for appointment scheduling and triage.',
    pricing: 'RM 0.85 / minute',
    unitPrice: 0.85,
    status: '99.90%',
    latency: '1.8s',
    features: ['Multi-lingual', 'HIPAA Compliant', 'Sentiment Analysis'],
    icon: Activity,
    productCode: 'VOICE_CONCIERGE'
  },
  {
    id: 'device-loc',
    title: 'Device Location API',
    useCaseId: 'ops',
    industryId: 'tech',
    description: 'Accurate location data retrieved directly from mobile network operators.',
    pricing: 'RM 0.25 / request',
    unitPrice: 0.25,
    status: '99.99%',
    latency: '0.6s',
    features: ['Precision Radius', 'Battery Friendly', 'Consent Flow'],
    icon: Globe,
    productCode: 'DEV_LOC'
  }
];

export default function APIMarketplace({ onNavigate }: APIMarketplaceProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedUseCase, setSelectedUseCase] = useState('all');
  const [activeTab, setActiveTab] = useState<'browse' | 'keys'>('browse');
  const [customizingApi, setCustomizingApi] = useState<any | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<{ [key: string]: boolean }>({});
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Mock data for API keys (usually from DB)
  const [myKeys, setMyKeys] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadKeys();
    }
  }, [user]);

  const loadKeys = async () => {
    try {
      const { data } = await db
        .from('api_marketplace_keys')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      if (data) setMyKeys(data);
    } catch (err) {
      console.error('Failed to load keys:', err);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const filteredApis = useMemo(() => {
    return MARKETPLACE_APIS.filter(api => {
      const matchesSearch = api.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           api.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = selectedIndustry === 'all' || api.industryId === selectedIndustry;
      const matchesUseCase = selectedUseCase === 'all' || api.useCaseId === selectedUseCase;
      return matchesSearch && matchesIndustry && matchesUseCase;
    });
  }, [searchQuery, selectedIndustry, selectedUseCase]);

  const handleAddToCart = async (api: any) => {
    if (!user) {
      setNotification({ type: 'error', message: 'Please sign in to add items to cart' });
      return;
    }

    setAddingToCart(api.id);
    
    try {
      const { error } = await db
        .from('cart_items')
        .insert({
          user_id: user.id,
          item_type: 'product_tier',
          item_data: JSON.stringify({
            product_id: api.id,
            product_name: api.title,
            product_sku: api.productCode,
            tier_name: 'Marketplace API',
            tier_sku: `${api.productCode}_TIER`,
            description: api.description,
            price: api.unitPrice,
            setup_fee: 0,
            price_unit: 'request',
            features: {
                use_case: api.useCaseId,
                real_time: true
            },
            support_level: 'Community'
          }),
          quantity: 1,
          unit_price: api.unitPrice,
          total_price: api.unitPrice
        });

      if (error) throw error;

      setNotification({ type: 'success', message: `${api.title} added to cart!` });
    } catch (err) {
      console.error('Cart Error:', err);
      setNotification({ type: 'error', message: 'Failed to add to cart' });
    } finally {
      setAddingToCart(null);
    }
  };

  const handleDownloadSDK = (apiTitle: string) => {
    setNotification({ type: 'success', message: `Initializing SDK download for ${apiTitle}...` });
    setTimeout(() => {
      // Mock download action
    }, 1000);
  };

  const toggleKeyVisibility = (key: string) => {
    setRevealedKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setNotification({ type: 'success', message: `${label} copied to clipboard!` });
  };

  return (
    <div className="flex-1 overflow-auto bg-[#012419]">


      <div className="p-12">
        {/* Navigation & Controls */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="flex items-center gap-1 bg-[#011a12] border border-[#024d30] rounded-2xl p-1 w-fit h-fit">
            <button 
              onClick={() => setActiveTab('browse')}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === 'browse' ? 'bg-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              Browse Ecosystem
            </button>
            <button 
              onClick={() => setActiveTab('keys')}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === 'keys' ? 'bg-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              My Subscriptions ({myKeys.length})
            </button>
          </div>

          <div className="flex-1 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px] group">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#39FF14] transition-colors" />
              <input 
                type="text" 
                placeholder="Search use cases, features, or industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#011a12] border border-[#024d30] rounded-2xl pl-12 pr-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#39FF14]/50 focus:ring-4 focus:ring-[#39FF14]/5 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-[#011a12] border border-[#024d30] rounded-2xl px-6 py-4 text-white text-sm font-bold appearance-none hover:border-[#39FF14]/30 transition-all outline-none cursor-pointer"
              >
                {INDUSTRIES.map(ind => (
                  <option key={ind.id} value={ind.id} className="bg-[#011a12]">{ind.industry_name}</option>
                ))}
              </select>
              
              <select 
                value={selectedUseCase}
                onChange={(e) => setSelectedUseCase(e.target.value)}
                className="bg-[#011a12] border border-[#024d30] rounded-2xl px-6 py-4 text-white text-sm font-bold appearance-none hover:border-[#39FF14]/30 transition-all outline-none cursor-pointer"
              >
                {USE_CASES.map(uc => (
                  <option key={uc.id} value={uc.id} className="bg-[#011a12]">{uc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {activeTab === 'browse' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApis.map((api) => (
              <div 
                key={api.id}
                className="group relative bg-[#011a12]/60 border border-[#024d30] rounded-[2.5rem] p-8 hover:border-[#39FF14]/50 hover:bg-[#011a12] transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl h-full flex flex-col"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <api.icon className="w-32 h-32" />
                </div>

                <div className="relative flex flex-col h-full">
                  <div className="flex items-start justify-between mb-8">
                    <div className="bg-[#39FF14]/10 p-4 rounded-2xl border border-[#39FF14]/20 group-hover:border-[#39FF14]/50 transition-all">
                      <api.icon className="w-8 h-8 text-[#39FF14]" />
                    </div>
                    <div className="text-right">
                       <div className="flex items-center gap-2 justify-end mb-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{api.status} Uptime</span>
                       </div>
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Latency: {api.latency}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-[#39FF14] transition-colors">{api.title}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed h-12 line-clamp-2">
                    {api.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#012419] border border-[#024d30] rounded-2xl p-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Pricing</label>
                       <span className="text-white font-black text-sm">{api.pricing}</span>
                    </div>
                    <div className="bg-[#012419] border border-[#024d30] rounded-2xl p-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Endpoints</label>
                       <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 text-[#39FF14]" />
                          <span className="text-white font-black text-xs">Global Edge</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-10 mt-auto">
                    {api.features.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-[#011a12] border border-[#024d30] rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-2">
                    <button 
                      onClick={() => handleAddToCart(api)}
                      disabled={addingToCart === api.id}
                      className="flex items-center justify-center gap-2 bg-[#39FF14] hover:bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-[#39FF14]/10 active:scale-95 disabled:opacity-50"
                    >
                      {addingToCart === api.id ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Buy Access
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setCustomizingApi(api)}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border border-slate-700"
                    >
                      <Settings className="w-4 h-4" />
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {myKeys.length === 0 ? (
              <div className="bg-[#011a12]/40 border border-[#024d30] border-dashed rounded-[3rem] p-24 text-center">
                 <Key className="w-24 h-24 text-slate-800 mx-auto mb-8" />
                 <h3 className="text-3xl font-black text-white mb-2">No active subscriptions</h3>
                 <p className="text-slate-500 font-medium mb-10 max-w-lg mx-auto">Purchase an API from the marketplace to start building industry-leading integrations.</p>
                 <button 
                   onClick={() => setActiveTab('browse')}
                   className="bg-[#39FF14] text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#39FF14]/20 hover:bg-white transition-all font-bold"
                 >
                   Browse Ecosystem
                 </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {myKeys.map((keyData) => {
                  const product = MARKETPLACE_APIS.find(a => a.id === keyData.product_id);
                  return (
                    <div key={keyData.id} className="bg-[#011a12] border border-[#024d30] rounded-[2.5rem] p-10 group hover:border-[#39FF14]/30 transition-all shadow-xl">
                       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 border-b border-[#024d30] pb-10">
                          <div className="flex items-center gap-6">
                             <div className="bg-[#39FF14]/10 p-5 rounded-3xl border border-[#39FF14]/20 shadow-inner">
                                {product ? <product.icon className="w-10 h-10 text-[#39FF14]" /> : <Terminal className="w-10 h-10 text-[#39FF14]" />}
                             </div>
                             <div>
                                <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{keyData.key_name || 'My API Key'}</h3>
                                <div className="flex items-center gap-3">
                                   <span className="text-[10px] font-black text-[#39FF14] uppercase tracking-widest">{product?.title || 'Unknown API'}</span>
                                   <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{(keyData.environment || 'production').toUpperCase()}</span>
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-3 flex-wrap">
                             <button className="flex items-center gap-2 bg-[#012419] border border-[#024d30] hover:border-[#39FF14]/50 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#39FF14] transition-all">
                                <Activity className="w-4 h-4" />
                                Analytics
                             </button>
                             <button 
                               onClick={() => handleDownloadSDK(product?.title || 'API')}
                               className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white transition-all"
                             >
                                <Download className="w-4 h-4" />
                                Credentials
                             </button>
                             <button 
                               onClick={() => setCustomizingApi(product)}
                               className="p-4 bg-[#011a12] border border-[#024d30] hover:border-[#39FF14]/50 rounded-2xl text-slate-500 hover:text-[#39FF14] transition-all"
                             >
                                <Settings className="w-5 h-5" />
                             </button>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-6">
                             <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">Primary API Key</label>
                                <div className="flex items-center gap-3 bg-[#012419] border border-[#024d30] p-5 rounded-2xl group/key focus-within:border-[#39FF14]/50 transition-all">
                                   <code className="flex-1 text-sm text-[#39FF14] font-mono tracking-wider truncate">
                                     {revealedKeys[`key_${keyData.id}`] ? keyData.api_key : '••••••••••••••••••••••••••••••••'}
                                   </code>
                                   <button 
                                     onClick={() => toggleKeyVisibility(`key_${keyData.id}`)}
                                     className="p-3 bg-[#011a12] rounded-xl text-slate-500 hover:text-[#39FF14] transition-all"
                                   >
                                     {revealedKeys[`key_${keyData.id}`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                   </button>
                                   <button 
                                     onClick={() => copyToClipboard(keyData.api_key, 'API Key')}
                                     className="p-3 bg-[#011a12] rounded-xl text-slate-500 hover:text-[#39FF14] transition-all"
                                   >
                                      <Copy className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>

                             <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold">API Secret</label>
                                <div className="flex items-center gap-3 bg-[#012419] border border-[#024d30] p-5 rounded-2xl group/secret focus-within:border-[#39FF14]/50 transition-all">
                                   <code className="flex-1 text-sm text-[#39FF14] font-mono tracking-wider truncate">
                                     {revealedKeys[`sec_${keyData.id}`] ? keyData.api_secret : '••••••••••••••••••••••••••••••••'}
                                   </code>
                                   <button 
                                     onClick={() => toggleKeyVisibility(`sec_${keyData.id}`)}
                                     className="p-3 bg-[#011a12] rounded-xl text-slate-500 hover:text-[#39FF14] transition-all"
                                   >
                                     {revealedKeys[`sec_${keyData.id}`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                   </button>
                                   <button 
                                     onClick={() => copyToClipboard(keyData.api_secret, 'API Secret')}
                                     className="p-3 bg-[#011a12] rounded-xl text-slate-500 hover:text-[#39FF14] transition-all"
                                   >
                                      <Copy className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>
                          </div>

                          <div className="bg-[#012419] border border-[#024d30] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between">
                             <div className="absolute top-0 right-0 p-8">
                                <Cpu className="w-24 h-24 text-[#39FF14] opacity-[0.03]" />
                             </div>
                             <div>
                                <h4 className="text-sm font-black text-white mb-6 uppercase tracking-widest">Integration Health</h4>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Requests (24h)</span>
                                       <span className="text-sm font-black text-white">{keyData.total_requests?.toLocaleString() || '0'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Integration Status</span>
                                       <div className="flex items-center gap-2">
                                          <span className="text-xs font-black text-emerald-500">OPERATIONAL</span>
                                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                       </div>
                                    </div>
                                </div>
                             </div>
                             
                             <div className="pt-8 border-t border-[#024d30] flex items-center gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest text-white transition-all border border-slate-700">
                                   <Terminal className="w-3 h-3" />
                                   Debugger
                                </button>
                                <button 
                                  onClick={() => handleDownloadSDK(product?.title || 'API')}
                                  className="flex-1 flex items-center justify-center gap-2 bg-[#39FF14]/10 hover:bg-[#39FF14] border border-[#39FF14]/30 text-[#39FF14] hover:text-black py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
                                >
                                   <Download className="w-3 h-3" />
                                   Get SDK
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Persistent Notification System */}
      {notification && (
        <div className="fixed top-8 right-8 z-[100] animate-slide-in">
          <div className={`${
            notification.type === 'success' ? 'bg-[#011a12] border-[#39FF14]/50' : 'bg-red-950 border-red-500/50'
          } border-2 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 min-w-[320px]`}>
            <div className={`${
              notification.type === 'success' ? 'bg-[#39FF14] text-black' : 'bg-red-500 text-white'
            } p-3 rounded-2xl`}>
              {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <p className="font-black text-white text-sm uppercase tracking-widest">{notification.type}</p>
              <p className="text-slate-400 text-xs font-bold leading-relaxed">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-auto text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Customize Modal */}
      {customizingApi && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[110] p-6 overflow-y-auto">
           <div className="bg-[#011a12] border border-[#024d30] w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(57,255,20,0.1)] my-auto animate-modal-in">
              <div className="p-10 border-b border-[#024d30] flex items-center justify-between bg-gradient-to-r from-[#012419] to-transparent">
                 <div className="flex items-center gap-5">
                    <div className="bg-[#39FF14]/10 p-4 rounded-2xl border border-[#39FF14]/20">
                       <Settings className="w-8 h-8 text-[#39FF14]" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white mb-0.5 tracking-tight uppercase">API Customization</h3>
                       <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{customizingApi.title}</p>
                    </div>
                 </div>
                 <button onClick={() => setCustomizingApi(null)} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                    <X className="w-8 h-8" />
                 </button>
              </div>
              
              <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[#39FF14] block">Region Selection</label>
                       <select className="w-full bg-[#012419] border border-[#024d30] rounded-2xl px-5 py-4 text-white text-sm font-bold flex items-center justify-between outline-none hover:border-[#39FF14]/30 transition-all cursor-pointer">
                          <option className="bg-[#011a12]">Global (Edge Acceleration)</option>
                          <option className="bg-[#011a12]">Asia Pacific (Singapore)</option>
                          <option className="bg-[#011a12]">Europe (Frankfurt)</option>
                          <option className="bg-[#011a12]">US East (Virginia)</option>
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[#39FF14] block">Data Retention</label>
                       <div className="grid grid-cols-2 gap-3">
                          <button className="bg-[#39FF14] text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#39FF14]/10">30 Days</button>
                          <button className="bg-[#012419] border border-[#024d30] text-slate-500 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-slate-500 transition-all">90 Days</button>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#39FF14] block">Webhook & Endpoint URL</label>
                    <div className="relative">
                        <Terminal className="w-4 h-4 text-slate-600 absolute left-5 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          placeholder="https://your-server.com/api/webhooks"
                          className="w-full bg-[#012419] border border-[#024d30] rounded-2xl px-12 py-5 text-white font-mono text-xs outline-none focus:border-[#39FF14]/50 transition-all"
                        />
                    </div>
                 </div>

                 <div className="bg-[#012419] border border-[#024d30] border-dashed rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-4">
                       <Info className="w-5 h-5 text-[#39FF14]" />
                       <h4 className="text-xs font-black text-white uppercase tracking-widest">Advanced Configuration</h4>
                    </div>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">Enabling enterprise-grade configurations may affect your transaction throughput and base unit pricing. Contact architecture support for specialized scaling.</p>
                    <div className="flex gap-3">
                       <button className="flex-1 px-6 py-4 bg-[#011a12] border border-[#024d30] rounded-xl text-[10px] font-black text-white hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-all uppercase tracking-widest">Compliance Pack</button>
                       <button className="flex-1 px-6 py-4 bg-[#011a12] border border-[#024d30] rounded-xl text-[10px] font-black text-white hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-all uppercase tracking-widest">Failover Logic</button>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-[#012419]/50 border-t border-[#024d30] flex items-center justify-end gap-6">
                 <button onClick={() => setCustomizingApi(null)} className="px-8 py-5 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all font-bold">Discard Changes</button>
                 <button 
                   onClick={() => {
                     setNotification({ type: 'success', message: 'API configuration updated successfully! Changes are being deployed to the edge.' });
                     setCustomizingApi(null);
                   }}
                   className="bg-[#39FF14] text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-[#39FF14]/20 hover:bg-white transition-all transform active:scale-95 font-bold"
                 >
                   Save & Deploy
                 </button>
              </div>
           </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-modal-in {
          animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slide-in {
          animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(2, 77, 48, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #024d30;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #39FF14;
        }
      `}</style>
    </div>
  );
}
