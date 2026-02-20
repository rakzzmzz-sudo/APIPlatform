'use client';
import React, { useState, useEffect } from 'react';
import {
  FileText, Search, Book, Download, Eye, X, Calendar,
  Users, Package, Tag, Filter, CheckCircle, TrendingUp, Clock,
  MessageSquare, Phone, Video, Bot, Mail, Globe, Zap, AlertCircle
} from 'lucide-react';

const MANUALS = [
  {
    id: 'msg-sms',
    title: 'SMS API User Manual',
    product: 'SMS API',
    category: 'Messaging',
    description: 'Complete guide to configuring SMS campaigns, bulk sending, routing, and checking delivery reports.',
    docType: 'user_guide',
    version: '2.1.0',
    pages: 12,
    size: '2.4 MB',
    date: '2026-02-15',
    downloads: 1254,
    icon: MessageSquare,
    color: '#39FF14',
    screenshotUrl: '/manual-screenshots/sms.png'
  },
  {
    id: 'msg-whatsapp',
    title: 'WhatsApp API Integration Guide',
    product: 'WhatsApp API',
    category: 'Social',
    description: 'Detailed instructions for connecting WhatsApp Business API, managing templates, and handling rich media.',
    docType: 'integration_guide',
    version: '1.5.0',
    pages: 18,
    size: '3.1 MB',
    date: '2026-02-18',
    downloads: 890,
    icon: MessageSquare,
    color: '#25D366',
    screenshotUrl: '/manual-screenshots/whatsapp.png'
  },
  {
    id: 'msg-rcs',
    title: 'RCS Business Messaging Guide',
    product: 'RCS API',
    category: 'Messaging',
    description: 'Learn how to send rich conversational messages, interactive buttons, and carousels using RCS.',
    docType: 'user_guide',
    version: '1.0.0',
    pages: 15,
    size: '2.8 MB',
    date: '2026-02-10',
    downloads: 543,
    icon: MessageSquare,
    color: '#6366f1',
    screenshotUrl: '/manual-screenshots/rcs.png'
  },
  {
    id: 'voice-api',
    title: 'Voice API Administration',
    product: 'Voice API',
    category: 'Voice',
    description: 'Admin guide for Voice API programmable calls, IVR configuration, and text-to-speech routing.',
    docType: 'admin_guide',
    version: '3.0.1',
    pages: 22,
    size: '4.5 MB',
    date: '2026-02-05',
    downloads: 756,
    icon: Phone,
    color: '#22d3ee',
    screenshotUrl: '/manual-screenshots/voice.png'
  },
  {
    id: 'video-api',
    title: 'Video API Implementation',
    product: 'Video API',
    category: 'Video',
    description: 'Setup high-quality programmable video, WebRTC rooms, recording, and composition layouts.',
    docType: 'integration_guide',
    version: '1.2.0',
    pages: 14,
    size: '2.1 MB',
    date: '2026-01-20',
    downloads: 412,
    icon: Video,
    color: '#fb7185',
    screenshotUrl: '/manual-screenshots/video.png'
  },
  {
    id: 'email-api',
    title: 'Email API Setup & Delivery',
    product: 'Email API',
    category: 'Messaging',
    description: 'Configure SMTP, domain authentication (SPF/DKIM), and manage high-volume transactional emails.',
    docType: 'user_guide',
    version: '2.5.0',
    pages: 16,
    size: '1.9 MB',
    date: '2026-02-12',
    downloads: 1120,
    icon: Mail,
    color: '#f59e0b',
    screenshotUrl: '/manual-screenshots/email.png'
  },
  {
    id: 'sip-trunk',
    title: 'SIP Trunking Architecture',
    product: 'SIP Trunk',
    category: 'Voice',
    description: 'Enterprise guide for configuring PBX connections, signaling security, and active call management.',
    docType: 'admin_guide',
    version: '4.1.0',
    pages: 25,
    size: '5.2 MB',
    date: '2026-01-15',
    downloads: 654,
    icon: Phone,
    color: '#34d399',
    screenshotUrl: '/manual-screenshots/sip-trunk.png'
  },
  {
    id: 'did',
    title: 'DID Numbers Provisioning',
    product: 'DID Numbers',
    category: 'Voice',
    description: 'Manual for purchasing, assigning, and routing local and toll-free Direct Inward Dialing numbers.',
    docType: 'user_guide',
    version: '1.8.0',
    pages: 10,
    size: '1.5 MB',
    date: '2026-02-01',
    downloads: 875,
    icon: Globe,
    color: '#fbbf24',
    screenshotUrl: '/manual-screenshots/did.png'
  }
];

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDocType, setSelectedDocType] = useState<string>('All');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<string | null>(null);

  const categories = ['All', 'Messaging', 'Voice', 'Video', 'Social'];
  const docTypes = [
    { id: 'All', name: 'All Types' },
    { id: 'user_guide', name: 'User Guides' },
    { id: 'admin_guide', name: 'Admin Guides' },
    { id: 'integration_guide', name: 'Integration Guides' }
  ];

  const filteredDocs = MANUALS.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesDocType = selectedDocType === 'All' || doc.docType === selectedDocType;
    return matchesSearch && matchesCategory && matchesDocType;
  });

  const getDocTypeColor = (docType: string) => {
    switch (docType) {
      case 'user_guide': return 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/30';
      case 'admin_guide': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'integration_guide': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  // PDF Generation function mapping a screenshot to an HTML print view
  const generatePDFManual = (doc: typeof MANUALS[0]) => {
    setIsGeneratingPDF(doc.id);
    
    // We construct a rich dynamic printable HTML document containing the app screenshot
    const now = new Date().toLocaleDateString('en-MY', { year:'numeric', month:'long', day:'numeric' });
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${doc.title} - PDF Manual</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 40px; color: #1f2937; line-height: 1.6; }
    .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { color: #111827; font-size: 32px; margin: 0 0 10px 0; }
    .meta { color: #6b7280; font-size: 14px; display: flex; gap: 20px; }
    h2 { font-size: 20px; color: #374151; margin-top: 40px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; }
    p { font-size: 15px; color: #4b5563; }
    .screenshot { width: 100%; border-radius: 12px; border: 1px solid #e5e7eb; margin: 20px 0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
    .badge { display: inline-block; padding: 4px 10px; background: #f3f4f6; border-radius: 4px; font-weight: 600; font-size: 12px; color: #4b5563; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .info-item label { display: block; font-size: 12px; color: #6b7280; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; }
    .info-item span { font-size: 15px; color: #111827; font-weight: 500; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${doc.title}</h1>
    <div class="meta">
      <span><strong>Product:</strong> ${doc.product}</span>
      <span><strong>Generated:</strong> ${now}</span>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-item"><label>Document Type</label><span>${doc.docType.replace('_',' ').toUpperCase()}</span></div>
    <div class="info-item"><label>Platform Version</label><span>v${doc.version}</span></div>
    <div class="info-item"><label>Category</label><span>${doc.category}</span></div>
    <div class="info-item"><label>Target Audience</label><span>System Administrators & Developers</span></div>
  </div>

  <h2>1. Overview</h2>
  <p>${doc.description}</p>
  <p>This document serves as the official configuration and administration guide for ${doc.product}, detailing the primary interface, features, and setup flow within the CPaaS Platform.</p>

  <h2>2. Dashboard & Configuration Interface</h2>
  <p>Below is the authenticated view of the ${doc.product} configuration screen. From this interface, you can manage active connections, view usage analytics, and configure routing policies.</p>
  
  <img src="${window.location.origin}${doc.screenshotUrl}" class="screenshot" alt="${doc.product} Configuration Screenshot" onerror="this.src='https://placehold.co/1200x800/f3f4f6/a1a1aa?text=Screenshot+Pending...'"/>
  
  <h2>3. Key Administration Tasks</h2>
  <ul>
    <li><strong>Provisioning:</strong> Ensure your tenant has sufficient balance before activating new channels.</li>
    <li><strong>Webhooks:</strong> Set up delivery receipt endpoints in the settings menu to receive real-time status updates.</li>
    <li><strong>Access Management:</strong> Use the API Keys section to generate dedicated tokens for this specific product.</li>
  </ul>

  <div class="footer">
    CPaaS Documentation Center &mdash; &copy; ${new Date().getFullYear()} Maxis Communications. All rights reserved.
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      // Print when image loads or after timeout
      win.onload = () => {
        setTimeout(() => {
          win.print();
          setIsGeneratingPDF(null);
        }, 800);
      };
    } else {
      alert('Please allow pop-ups to export the PDF manual');
      setIsGeneratingPDF(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#012419]">
      <div className="p-8">
        {/* Header & Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search product manuals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#012419]/80 border border-[#024d30] rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14] transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCategory === cat ? 'bg-[#39FF14] text-black' : 'bg-[#024d30]/40 text-slate-400 border border-[#024d30] hover:text-white'}`}
              >
                {cat === 'All' ? 'All Products' : cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {docTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedDocType(type.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedDocType === type.id ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50' : 'bg-[#024d30]/40 text-slate-400 border border-[#024d30] hover:text-white'}`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* Documentation Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Book className="w-6 h-6 text-[#39FF14]"/> Product User Manuals
            </h2>
            <p className="text-slate-400 font-medium">
              Showing <span className="text-white">{filteredDocs.length}</span> manuals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => {
              const Icon = doc.icon;
              const isGenerating = isGeneratingPDF === doc.id;

              return (
                <div key={doc.id} className="bg-[#012419]/80 border border-[#024d30] rounded-2xl overflow-hidden hover:border-[#39FF14]/40 transition-all hover:shadow-lg hover:shadow-[#39FF14]/5 flex flex-col group">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: `${doc.color}20` }}>
                        <Icon className="w-6 h-6" style={{ color: doc.color }} />
                      </div>
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${getDocTypeColor(doc.docType)}`}>
                        {doc.docType.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-[#39FF14] transition-colors">{doc.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-semibold text-slate-300">{doc.product}</span>
                    </div>

                    <p className="text-sm text-slate-400 mb-6 flex-1">{doc.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 mb-6 bg-[#024d30]/20 p-4 rounded-xl">
                      <div className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400"/> {doc.pages} Pages</div>
                      <div className="flex items-center gap-1.5"><Package className="w-4 h-4 text-slate-400"/> {doc.size}</div>
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400"/> v{doc.version}</div>
                      <div className="flex items-center gap-1.5"><Download className="w-4 h-4 text-slate-400"/> {doc.downloads}</div>
                    </div>

                    <button
                      onClick={() => generatePDFManual(doc)}
                      disabled={!!isGeneratingPDF}
                      className="w-full bg-[#39FF14]/10 hover:bg-[#39FF14] text-[#39FF14] hover:text-black border border-[#39FF14]/50 hover:border-[#39FF14] transition-all px-4 py-3 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isGenerating ? <Clock className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4"/>}
                      {isGenerating ? 'Building PDF...' : 'Download PDF Manual'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDocs.length === 0 && (
            <div className="border border-dashed border-[#024d30] rounded-2xl p-16 text-center">
              <AlertCircle className="w-12 h-12 text-[#39FF14]/50 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">No Manuals Found</h3>
              <p className="text-slate-400">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
