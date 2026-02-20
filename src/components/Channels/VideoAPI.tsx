import { useState, useEffect } from 'react';
import {
  Video, Monitor, Camera, ShoppingCart, Clock, Settings, Play, BarChart3,
  Package, Key, Code, Download, Copy, CheckCircle, FileText, X, Search,
  Zap, Users, Globe, PhoneCall, UserPlus, Link as LinkIcon, Maximize2,
  Calendar, Brain, Mic, Sparkles, Plus, Wand2, Volume2, Mic2, MessageSquare,
  Radio, Tv, Youtube, Twitch as TwitchIcon, Facebook, Activity, RefreshCw, PlayCircle, StopCircle, Sliders, Eye, Wifi
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import VideoRoom from './VideoRoom';

interface VideoProduct {
  id: string;
  product_name: string;
  product_type: string;
  industry: string;
  description: string;
  features: string[];
  monthly_price: number;
  per_minute_price: number;
  setup_fee: number;
  max_participants: number;
  storage_gb: number;
  api_calls_limit: number;
  has_sdk: boolean;
  has_api: boolean;
}

interface VideoPurchase {
  id: string;
  product_id: string;
  api_key: string;
  sdk_access_token: string;
  status: string;
  usage_minutes: number;
  storage_used_gb: number;
  api_calls_used: number;
  purchased_at: string;
  product: VideoProduct;
}

interface VideoTemplate {
  id: string;
  template_name: string;
  industry: string;
  template_type: string;
  description: string;
  features: string[];
  configuration: any;
  is_premium: boolean;
}

interface VideoSession {
  id: string;
  sessionUrl: string;
  roomId: string;
  participants: number;
}

const SAMPLE_VIDEO_PRODUCTS = [
  {
    product_name: 'Standard Video API',
    product_type: 'conferencing',
    industry: 'all',
    description: 'Perfect for small teams and simple video integrations.',
    features: JSON.stringify(['720p HD Video', 'Up to 10 participants', 'Chat support', 'Web SDK access']),
    monthly_price: 99.00,
    per_minute_price: 0.05,
    setup_fee: 0,
    max_participants: 10,
    storage_gb: 10,
    api_calls_limit: 10000,
    has_sdk: true,
    has_api: true
  },
  {
    product_name: 'Enterprise Video Suite',
    product_type: 'conferencing',
    industry: 'corporate',
    description: 'High-scale video solutions for large organizations.',
    features: JSON.stringify(['4K Ultra HD', 'Up to 1000 participants', 'White labeling', 'Advanced Analytics']),
    monthly_price: 499.00,
    per_minute_price: 0.02,
    setup_fee: 1000.00,
    max_participants: 1000,
    storage_gb: 500,
    api_calls_limit: 500000,
    has_sdk: true,
    has_api: true
  },
  {
    product_name: 'Telehealth Secure API',
    product_type: 'conferencing',
    industry: 'healthcare',
    description: 'HIPAA compliant video communication for healthcare providers.',
    features: JSON.stringify(['End-to-end Encryption', 'Waiting Room', 'BHR available', 'DICOM support']),
    monthly_price: 299.00,
    per_minute_price: 0.08,
    setup_fee: 250.00,
    max_participants: 4,
    storage_gb: 100,
    api_calls_limit: 50000,
    has_sdk: true,
    has_api: true
  }
];

const SAMPLE_TEMPLATES = [
  {
    template_name: 'Healthcare Consult',
    industry: 'healthcare',
    template_type: 'conferencing',
    description: 'Secure one-on-one medical consultation room.',
    features: JSON.stringify(['Encrypted', 'Waiting Room', 'File Sharing']),
    configuration: JSON.stringify({ participant_limit: 2, duration: 30, recording: true }),
    is_premium: true
  },
  {
    template_name: 'Virtual Classroom',
    industry: 'education',
    template_type: 'conferencing',
    description: 'Teacher-led classroom with controls for students.',
    features: JSON.stringify(['Polls', 'Raise Hand', 'Breakout Rooms']),
    configuration: JSON.stringify({ participant_limit: 50, duration: 60, recording: true }),
    is_premium: false
  }
];

const SAMPLE_CAPABILITIES = [
  // Core Features
  { capability_name: 'HD Video', description: 'Crystal clear high-definition video up to 4K resolution.', icon: 'Video', is_available: true, display_order: 1, category: 'Core' },
  { capability_name: 'Spatial Audio', description: 'Immersive 3D audio for realistic conversation feel.', icon: 'Mic', is_available: true, display_order: 2, category: 'Core' },
  { capability_name: 'Screen Share', description: 'Ultra-low latency screen sharing for collaborative work.', icon: 'Monitor', is_available: true, display_order: 3, category: 'Core' },
  
  // Advanced Features
  { capability_name: 'Cloud Recording', description: 'Safe and encrypted recording of all your video sessions.', icon: 'Camera', is_available: true, display_order: 10, category: 'Advanced' },
  { capability_name: 'Custom Branding', description: 'White-label the interface to match your corporate identity.', icon: 'Layout', is_available: true, display_order: 11, category: 'Advanced' },
  { capability_name: 'RTMP Streaming', description: 'Broadcast sessions to YouTube, Twitch, or custom RTMP targets.', icon: 'Radio', is_available: true, display_order: 12, category: 'Advanced' },
  
  // AI Features
  { capability_name: 'AI Transcription', description: 'Real-time multi-language transcription and closed captioning.', icon: 'Languages', is_available: true, display_order: 20, category: 'AI' },
  { capability_name: 'Smart Noise Cancellation', description: 'Suppress background noise and isolate human voice intelligently.', icon: 'Shield', is_available: true, display_order: 21, category: 'AI' },
  { capability_name: 'AI Meetings Summary', description: 'Generate structured summaries and action items automatically.', icon: 'Brain', is_available: true, display_order: 22, category: 'AI' },
  
  // Infrastructure
  { capability_name: 'Auto-Scaling SFU', description: 'Highly scalable Selective Forwarding Unit for 1000+ participants.', icon: 'Zap', is_available: true, display_order: 30, category: 'Infrastructure' },
  { capability_name: 'Global Mesh Network', description: 'Lowest possible latency with our worldwide edge network.', icon: 'Globe', is_available: true, display_order: 31, category: 'Infrastructure' }
];

const SAMPLE_BACKGROUND_CONFIGS = [
  { config_name: 'Standard Blur', processing_type: 'blur', quality: 'high', blur_intensity: 50, performance_mode: 'balanced', use_gpu_acceleration: true, is_default: true, wasm_module_version: 'v2.1.0' },
  { config_name: 'Office Background', processing_type: 'replacement', quality: 'high', performance_mode: 'performance', use_gpu_acceleration: true, is_default: false, wasm_module_version: 'v2.1.0' },
  { config_name: 'Privacy Mode', processing_type: 'blur', quality: 'medium', blur_intensity: 80, performance_mode: 'performance', use_gpu_acceleration: false, is_default: false, wasm_module_version: 'v1.5.0' }
];

const SAMPLE_NOISE_CONFIGS = [
  { config_name: 'Standard Noise Removal', ai_model: 'rnnoise_standard', noise_suppression_level: 70, filter_keyboard_typing: true, filter_dog_barking: false, filter_fan_noise: true, voice_isolation: true, is_default: true },
  { config_name: 'Aggressive Filtering', ai_model: 'krisp_v2', noise_suppression_level: 95, filter_keyboard_typing: true, filter_dog_barking: true, filter_fan_noise: true, voice_isolation: true, is_default: false },
  { config_name: 'Low Latency Mode', ai_model: 'web_recurrent', noise_suppression_level: 40, filter_keyboard_typing: false, filter_dog_barking: false, filter_fan_noise: true, voice_isolation: false, is_default: false }
];

const SAMPLE_TRANSCRIPTION_CONFIGS = [
  { config_name: 'English (US) Standard', language: 'en-US', ai_model: 'whisper_base', enable_speaker_diarization: true, enable_punctuation: true, enable_translation: false, word_timestamps: true, confidence_threshold: 0.85, is_default: true },
  { config_name: 'Spanish Live Translate', language: 'es-ES', ai_model: 'whisper_large', enable_speaker_diarization: true, enable_punctuation: true, enable_translation: true, word_timestamps: false, confidence_threshold: 0.90, is_default: false },
  { config_name: 'Technical Meetings', language: 'en-US', ai_model: 'deep_gram_nova', enable_speaker_diarization: true, enable_punctuation: true, enable_translation: false, word_timestamps: true, confidence_threshold: 0.95, is_default: false }
];

const SAMPLE_RTMP_CONFIGS = [
  { config_name: 'YouTube Live', platform: 'youtube', stream_url: 'rtmp://a.rtmp.youtube.com/live2', stream_key: '****', video_bitrate_kbps: 4500, audio_bitrate_kbps: 128, video_codec: 'h264', audio_codec: 'aac', video_resolution: '1080p', framerate: 30, is_active: true },
  { config_name: 'Twitch Stream', platform: 'twitch', stream_url: 'rtmp://live.twitch.tv/app', stream_key: '****', video_bitrate_kbps: 6000, audio_bitrate_kbps: 160, video_codec: 'h264', audio_codec: 'aac', video_resolution: '1080p', framerate: 60, is_active: false },
  { config_name: 'Facebook Live', platform: 'facebook', stream_url: 'rtmps://live-api-s.facebook.com:443/rtmp/', stream_key: '****', video_bitrate_kbps: 4000, audio_bitrate_kbps: 128, video_codec: 'h264', audio_codec: 'aac', video_resolution: '720p', framerate: 30, is_active: false }
];

const SAMPLE_HLS_CONFIGS = [
  { config_name: 'Global CDN Standard', cdn_provider: 'cloudfront', latency_mode: 'standard_latency', segment_duration_seconds: 6, playlist_length_segments: 10, enable_adaptive_streaming: true, max_viewers: 100000, enable_drm: false, is_active: true },
  { config_name: 'Low Latency Edge', cdn_provider: 'akamai', latency_mode: 'low_latency', segment_duration_seconds: 2, playlist_length_segments: 6, enable_adaptive_streaming: true, max_viewers: 50000, enable_drm: true, drm_provider: 'widevine', is_active: false }
];

export default function VideoAPI() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'marketplace' | 'my-apis' | 'templates' | 'capabilities' | 'sdks' | 'recordings' | 'network' | 'ai-processing' | 'broadcasting'>('overview');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedProductType, setSelectedProductType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [videoProducts, setVideoProducts] = useState<VideoProduct[]>([]);
  const [myPurchases, setMyPurchases] = useState<VideoPurchase[]>([]);
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [capabilities, setCapabilities] = useState<any[]>([]);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [recordingConfigs, setRecordingConfigs] = useState<any[]>([]);
  const [storageConfigs, setStorageConfigs] = useState<any[]>([]);
  const [networkMetrics, setNetworkMetrics] = useState<any[]>([]);
  const [bitrateConfigs, setBitrateConfigs] = useState<any[]>([]);
  const [simulcastConfigs, setSimulcastConfigs] = useState<any[]>([]);
  const [backgroundConfigs, setBackgroundConfigs] = useState<any[]>([]);
  const [virtualBackgrounds, setVirtualBackgrounds] = useState<any[]>([]);
  const [noiseConfigs, setNoiseConfigs] = useState<any[]>([]);
  const [transcriptionConfigs, setTranscriptionConfigs] = useState<any[]>([]);
  const [rtmpConfigs, setRtmpConfigs] = useState<any[]>([]);
  const [hlsConfigs, setHlsConfigs] = useState<any[]>([]);
  const [broadcastSessions, setBroadcastSessions] = useState<any[]>([]);
  const [aiAnalytics, setAiAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [videoRooms, setVideoRooms] = useState<any[]>([]);

  const [startCallModal, setStartCallModal] = useState(false);
  const [callType, setCallType] = useState<'p2p' | 'group_sfu' | 'group_mcu' | 'webinar'>('group_sfu');
  const [enableScreenShare, setEnableScreenShare] = useState(true);
  const [enableWhiteboard, setEnableWhiteboard] = useState(true);
  const [enableSIP, setEnableSIP] = useState(false);

  const [purchaseModal, setPurchaseModal] = useState<VideoProduct | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [videoSessionModal, setVideoSessionModal] = useState<{ template: VideoTemplate; session: VideoSession } | null>(null);
  const [startingSession, setStartingSession] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const [scheduleMeetingModal, setScheduleMeetingModal] = useState(false);
  const [meetingAIConfigs, setMeetingAIConfigs] = useState<any[]>([]);
  const [selectedAIConfig, setSelectedAIConfig] = useState<string>('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [participantEmails, setParticipantEmails] = useState('');
  const [enableAITranscription, setEnableAITranscription] = useState(true);
  
  // Advanced Features State
  const [isRunningNetworkTest, setIsRunningNetworkTest] = useState(false);
  const [networkTestResults, setNetworkTestResults] = useState<{download: number, upload: number, jitter: number} | null>(null);
  const [aiFeaturesEnabled, setAiFeaturesEnabled] = useState<Record<string, boolean>>({
    'blur': true,
    'noise': true,
    'transcription': true
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [streamDuration, setStreamDuration] = useState(0);

  const runNetworkTest = () => {
    setIsRunningNetworkTest(true);
    setNetworkTestResults(null);
    setTimeout(() => {
      setNetworkTestResults({
        download: 150 + Math.random() * 50,
        upload: 45 + Math.random() * 15,
        jitter: 2 + Math.random() * 5
      });
      setIsRunningNetworkTest(false);
    }, 3000);
  };

  const toggleAiFeature = (feature: string) => {
    setAiFeaturesEnabled(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const toggleBroadcast = () => {
    setIsBroadcasting(!isBroadcasting);
    if (!isBroadcasting) {
      setStreamDuration(0);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBroadcasting) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBroadcasting]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const industries = ['all', 'healthcare', 'education', 'finance', 'retail', 'corporate', 'legal', 'real_estate'];
  const productTypes = ['all', 'conferencing', 'recording', 'streaming'];

  useEffect(() => {
    if (user) {
      Promise.all([
        loadVideoProducts(),
        loadMyPurchases(),
        loadTemplates(),
        loadMeetingAIConfigs(),
        loadCapabilities(),
        loadRecordings(),
        loadRecordingConfigs(),
        loadStorageConfigs(),
        loadNetworkMetrics(),
        loadBitrateConfigs(),
        loadSimulcastConfigs(),
        loadBackgroundConfigs(),
        loadVirtualBackgrounds(),
        loadNoiseConfigs(),
        loadTranscriptionConfigs(),
        loadRtmpConfigs(),
        loadHlsConfigs(),
        loadBroadcastSessions(),
        loadAiAnalytics(),
        loadVideoRooms()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  const loadVideoRooms = async () => {
    const { data, error } = await db
      .from('video_rooms')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setVideoRooms(data);
    }
  };

  const seedVideoData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Seed Products
      for (const product of SAMPLE_VIDEO_PRODUCTS) {
        await db.from('video_api_products').insert(product);
      }
      
      // Seed Templates
      for (const template of SAMPLE_TEMPLATES) {
        await db.from('video_templates').insert(template);
      }
      
      // Seed Capabilities
      for (const cap of SAMPLE_CAPABILITIES) {
        await db.from('video_api_capabilities').insert(cap);
      }

      // Seed AI Configurations
      for (const config of SAMPLE_BACKGROUND_CONFIGS) {
        await db.from('background_processing_configs').insert(config);
      }
      for (const config of SAMPLE_NOISE_CONFIGS) {
        await db.from('noise_cancellation_configs').insert(config);
      }
      for (const config of SAMPLE_TRANSCRIPTION_CONFIGS) {
        await db.from('transcription_configs').insert(config);
      }

      // Seed Broadcasting Configurations
      for (const config of SAMPLE_RTMP_CONFIGS) {
        await db.from('rtmp_broadcast_configs').insert(config);
      }
      for (const config of SAMPLE_HLS_CONFIGS) {
        await db.from('hls_streaming_configs').insert(config);
      }

      // Seed Broadcast Sessions
      const broadcastStatuses = ['live', 'ended', 'scheduled'];
      for (let i = 0; i < 5; i++) {
        await db.from('broadcast_sessions').insert({
          broadcast_name: `Session ${i + 1} - ${['Tech Talk', 'Webinar', 'Game Stream', 'Product Launch'][i % 4]}`,
          status: broadcastStatuses[i % 3],
          viewer_count: i === 0 ? 1250 : 0, // One live session with viewers
          peak_viewer_count: 1500 + (i * 100),
          started_at: new Date(Date.now() - 1000 * 60 * 60 * (i + 1)).toISOString(),
          ended_at: i % 3 === 1 ? new Date().toISOString() : null
        });
      }

      // Seed Network Metrics (Mock Data) with valid relations
      // First create a mock room and participant to satisfy foreign key constraints
      const mockRoomId = 'seed-room-' + Date.now();
      await db.from('video_rooms').insert({
        id: mockRoomId,
        room_name: 'Network Test Room',
        status: 'active',
        created_by: user.id || 'system',
        started_at: new Date().toISOString()
      });

      const mockParticipantId = 'seed-participant-' + Date.now();
      await db.from('video_room_participants').insert({
        id: mockParticipantId,
        room_uuid: mockRoomId,
        participant_name: 'Test User',
        peer_id: 'peer-' + Date.now(),
        is_host: true,
        joined_at: new Date().toISOString()
      });

      for (let i = 0; i < 20; i++) {
        await db.from('network_quality_metrics').insert({
          room_uuid: mockRoomId,
          participant_uuid: mockParticipantId, // Use valid foreign key
          bitrate_kbps: 1500 + Math.random() * 2000,
          latency_ms: 20 + Math.random() * 50,
          jitter_ms: Math.random() * 10,
          packet_loss_percentage: Math.random(),
          resolution: '1080p',
          framerate: 60,
          measured_at: new Date(Date.now() - 1000 * 60 * i).toISOString(),
          quality_rating: ['excellent', 'good', 'fair'][i % 3], // cycling quality
          quality_score: 85 + Math.floor(Math.random() * 15),
          round_trip_time_ms: 40 + Math.random() * 20,
          bandwidth_mbps: 5 + Math.random() * 10,
          current_resolution: '1920x1080'
        });
      }

      // Seed AI Analytics (Mock Data)
      for (let i = 0; i < 15; i++) {
        await db.from('ai_processing_analytics').insert({
          processing_type: ['blur', 'noise_cancellation', 'transcription'][i % 3],
          total_processing_time_seconds: 120 + i * 10,
          cpu_usage_percentage: 15 + Math.random() * 20,
          gpu_usage_percentage: 30 + Math.random() * 40,
          frames_processed: 5000 + i * 1000,
          error_count: Math.floor(Math.random() * 3),
          quality_score: 90 + Math.floor(Math.random() * 10),
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString()
        });
      }

      // Seed an initial purchase for the user
      const { data: products } = await db.from('video_api_products').select('*').limit(1);
      if (products && products.length > 0) {
        await db.from('video_api_purchases').insert({
          user_id: user.id,
          product_id: products[0].id,
          api_key: `vapi_sample_${Math.random().toString(36).substr(2, 9)}`,
          sdk_access_token: `vsdk_sample_${Math.random().toString(36).substr(2, 9)}`,
          status: 'active',
          usage_minutes: 1250,
          storage_used_gb: 4.5,
          api_calls_used: 850
        });
      }

      setNotification({
        type: 'success',
        message: 'Successfully seeded sample video data!'
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      console.error('Error seeding video data:', error);
      setNotification({
        type: 'error',
        message: 'Failed to seed: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (copiedKey) {
      const timer = setTimeout(() => setCopiedKey(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedKey]);

  const loadVideoProducts = async () => {
    const { data, error } = await db
      .from('video_api_products')
      .select('*')
      .eq('is_available', true)
      .order('monthly_price');

    if (!error && data) {
      setVideoProducts(data.map((p: any) => ({
        ...p,
        features: typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || [])
      })));
    }
  };

  const loadMyPurchases = async () => {
    if (!user) return;

    const { data: productsData } = await db.from('video_api_products').select('*');
    const { data, error } = await db
      .from('video_api_purchases')
      .select('*')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (!error && data) {
      const enrichedPurchases = data.map((purchase: any) => {
        const product = purchase.product || (productsData || []).find((p: any) => p.id === purchase.product_id);
        return {
          ...purchase,
          product: product || { product_name: 'Unknown API', industry: 'unknown', api_calls_limit: 0, storage_gb: 0, max_participants: 0 }
        };
      });
      setMyPurchases(enrichedPurchases);
    }
  };

  const loadTemplates = async () => {
    const { data, error } = await db
      .from('video_templates')
      .select('*')
      .order('template_name');

    if (!error && data) {
      setTemplates(data.map((t: any) => ({
        ...t,
        features: typeof t.features === 'string' ? JSON.parse(t.features) : (t.features || []),
        configuration: typeof t.configuration === 'string' ? JSON.parse(t.configuration) : (t.configuration || {})
      })));
    }
  };

  const loadMeetingAIConfigs = async () => {
    if (!user) return;

    const { data, error } = await db
      .from('meeting_ai_configurations')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (!error && data) {
      setMeetingAIConfigs(data);
      const defaultConfig = data.find((c: any) => c.is_default);
      if (defaultConfig) {
        setSelectedAIConfig(defaultConfig.id);
      }
    }
  };

  const loadCapabilities = async () => {
    const { data, error } = await db
      .from('video_api_capabilities')
      .select('*')
      .eq('is_available', true)
      .order('display_order');

    if (!error && data) {
      setCapabilities(data);
    }
  };

  const loadRecordings = async () => {
    const { data, error } = await db
      .from('video_recordings')
      .select('*, recording_analytics(*)')
      .order('started_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setRecordings(data);
    }
  };

  const loadRecordingConfigs = async () => {
    const { data, error } = await db
      .from('video_recording_configs')
      .select('*')
      .order('is_default', { ascending: false });

    if (!error && data) {
      setRecordingConfigs(data);
    }
  };

  const loadStorageConfigs = async () => {
    const { data, error } = await db
      .from('cloud_storage_configs')
      .select('*')
      .order('is_default', { ascending: false });

    if (!error && data) {
      setStorageConfigs(data);
    }
  };

  const loadNetworkMetrics = async () => {
    const { data, error } = await db
      .from('network_quality_metrics')
      .select('*, video_call_participants(*)')
      .order('measured_at', { ascending: false })
      .limit(100);

    if (!error && data) {
      setNetworkMetrics(data);
    }
  };

  const loadBitrateConfigs = async () => {
    const { data, error } = await db
      .from('adaptive_bitrate_configs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBitrateConfigs(data);
    }
  };

  const loadSimulcastConfigs = async () => {
    const { data, error } = await db
      .from('simulcast_configs')
      .select('*')
      .order('is_default', { ascending: false });

    if (!error && data) {
      setSimulcastConfigs(data);
    }
  };

  const loadBackgroundConfigs = async () => {
    const { data, error } = await db
      .from('background_processing_configs')
      .select('*')
      .order('is_default', { ascending: false });

    if (!error && data) {
      setBackgroundConfigs(data);
    }
  };

  const loadVirtualBackgrounds = async () => {
    const { data, error } = await db
      .from('virtual_backgrounds')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (!error && data) {
      setVirtualBackgrounds(data);
    }
  };

  const loadNoiseConfigs = async () => {
    const { data, error } = await db
      .from('noise_cancellation_configs')
      .select('*')
      .order('is_default', { ascending: false });

    if (!error && data) {
      setNoiseConfigs(data);
    }
  };

  const loadTranscriptionConfigs = async () => {
    const { data, error } = await db
      .from('transcription_configs')
      .select('*')
      .order('is_default', { ascending: false });

    if (!error && data) {
      setTranscriptionConfigs(data);
    }
  };

  const loadRtmpConfigs = async () => {
    const { data, error } = await db
      .from('rtmp_broadcast_configs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRtmpConfigs(data);
    }
  };

  const loadHlsConfigs = async () => {
    const { data, error } = await db
      .from('hls_streaming_configs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setHlsConfigs(data);
    }
  };

  const loadBroadcastSessions = async () => {
    const { data, error } = await db
      .from('broadcast_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setBroadcastSessions(data);
    }
  };

  const loadAiAnalytics = async () => {
    const { data, error } = await db
      .from('ai_processing_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setAiAnalytics(data);
    }
  };

  const handleScheduleMeeting = async () => {
    if (!user || !meetingTitle || !meetingDate || !meetingTime) {
      setNotification({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    try {
      const scheduledDateTime = new Date(`${meetingDate}T${meetingTime}`);
      const roomId = `room_${Math.random().toString(36).substr(2, 9)}`;
      const meetingLink = `${window.location.origin}/video/${roomId}`;

      const selectedConfig = meetingAIConfigs.find(c => c.id === selectedAIConfig);
      const participantsArray = participantEmails.split(',').map(e => e.trim()).filter(e => e);

      const { data: meetingData, error } = await db
        .from('meetings')
        .insert({
          host_user_id: user.id,
          meeting_title: meetingTitle,
          meeting_description: `Scheduled video meeting with AI features`,
          meeting_type: 'video_conference',
          scheduled_start_time: scheduledDateTime.toISOString(),
          scheduled_end_time: new Date(scheduledDateTime.getTime() + 60 * 60 * 1000).toISOString(),
          room_id: roomId,
          room_url: meetingLink,
          meeting_link: meetingLink,
          max_participants: 100,
          enable_transcription: selectedConfig?.enable_transcription || enableAITranscription,
          enable_recording: selectedConfig?.enable_recording || false,
          enable_ai_summary: selectedConfig?.enable_ai_insights || false,
          enable_action_items: selectedConfig?.enable_action_items || false,
          enable_sentiment_analysis: selectedConfig?.enable_sentiment_analysis || false,
          transcription_language: selectedConfig?.transcription_language || 'en',
          participant_emails: participantsArray,
          status: 'scheduled',
          allow_screen_share: true,
          allow_chat: true
        })
        .select()
        .single();

      if (error) throw error;

      if (selectedAIConfig && meetingData) {
        await db
          .from('meeting_ai_configuration_links')
          .insert({
            meeting_id: meetingData.id,
            configuration_id: selectedAIConfig
          });
      }

      setNotification({ type: 'success', message: 'Meeting scheduled successfully!' });
      setScheduleMeetingModal(false);
      setMeetingTitle('');
      setMeetingDate('');
      setMeetingTime('');
      setParticipantEmails('');
    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      setNotification({ type: 'error', message: 'Failed to schedule meeting. Please try again.' });
    }
  };

  const handlePurchase = async () => {
    if (!purchaseModal || !user) return;

    setPurchasing(true);

    try {
      const apiKey = `vapi_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      const sdkToken = `vsdk_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const totalPrice = Number(purchaseModal.setup_fee || 0) + Number(purchaseModal.monthly_price || 0);

      const cartItemData = {
        product_id: purchaseModal.id,
        product_name: purchaseModal.product_name,
        product_type: purchaseModal.product_type,
        description: purchaseModal.description,
        monthly_price: purchaseModal.monthly_price,
        setup_fee: purchaseModal.setup_fee
      };

      const { error: cartError } = await db
        .from('cart_items')
        .insert({
          user_id: user.id,
          item_type: 'video_api',
          item_data: cartItemData,
          quantity: 1,
          unit_price: totalPrice,
          total_price: totalPrice
        });

      if (cartError) {
        console.error('Cart error:', cartError);
        throw new Error('Failed to add to cart');
      }

      const { error: purchaseError } = await db
        .from('video_api_purchases')
        .insert({
          user_id: user.id,
          product_id: purchaseModal.id,
          api_key: apiKey,
          sdk_access_token: sdkToken,
          status: 'active',
          expires_at: expiresAt.toISOString(),
          usage_minutes: 0,
          storage_used_gb: 0,
          api_calls_used: 0
        });

      if (purchaseError) {
        console.error('Purchase error:', purchaseError);
        throw new Error('Failed to activate API');
      }

      setNotification({
        type: 'success',
        message: `${purchaseModal.product_name} purchased and activated! Check My APIs tab.`
      });

      await loadMyPurchases();
      setActiveTab('my-apis');
    } catch (error: any) {
      console.error('Purchase failed:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Purchase failed. Please try again.'
      });
    } finally {
      setPurchasing(false);
      setPurchaseModal(null);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
  };

  const handleSDKDownload = (sdk: any) => {
    let sdkContent = '';
    const platform = sdk.platform.toLowerCase();

    if (platform.includes('ios')) {
      sdkContent = `// Video SDK for iOS - Version ${sdk.version}
// Complete Swift SDK with all features

import Foundation
import AVFoundation
import WebRTC

public class VideoSDK {
    public static let shared = VideoSDK()
    private var peerConnection: RTCPeerConnection?
    private var localVideoTrack: RTCVideoTrack?
    private var localAudioTrack: RTCAudioTrack?

    // Initialize SDK with API Key
    public func initialize(apiKey: String) {
        print("Initializing Video SDK with API Key: \\(apiKey)")
        setupPeerConnection()
    }

    // Join a video room
    public func joinRoom(roomId: String, completion: @escaping (Bool) -> Void) {
        print("Joining room: \\(roomId)")
        setupLocalTracks()
        completion(true)
    }

    // Enable/Disable Camera
    public func toggleCamera(enabled: Bool) {
        localVideoTrack?.isEnabled = enabled
    }

    // Enable/Disable Microphone
    public func toggleMicrophone(enabled: Bool) {
        localAudioTrack?.isEnabled = enabled
    }

    // Start Screen Sharing
    public func startScreenShare() {
        print("Starting screen share")
    }

    // Leave Room
    public func leaveRoom() {
        peerConnection?.close()
        print("Left room successfully")
    }

    private func setupPeerConnection() {
        // WebRTC peer connection setup
    }

    private func setupLocalTracks() {
        // Setup video and audio tracks
    }
}

// Example Usage:
// let sdk = VideoSDK.shared
// sdk.initialize(apiKey: "your_api_key")
// sdk.joinRoom(roomId: "room123") { success in
//     print("Joined: \\(success)")
// }`;
    } else if (platform.includes('android')) {
      sdkContent = `// Video SDK for Android - Version ${sdk.version}
// Complete Kotlin SDK with all features

package com.videosdk

import android.content.Context
import org.webrtc.*

class VideoSDK private constructor() {

    companion object {
        val instance: VideoSDK by lazy { VideoSDK() }
    }

    private var peerConnection: PeerConnection? = null
    private var localVideoTrack: VideoTrack? = null
    private var localAudioTrack: AudioTrack? = null
    private var apiKey: String? = null

    // Initialize SDK with API Key
    fun initialize(context: Context, apiKey: String) {
        this.apiKey = apiKey
        println("Initializing Video SDK with API Key: $apiKey")
        setupPeerConnectionFactory(context)
    }

    // Join a video room
    fun joinRoom(roomId: String, callback: (Boolean) -> Unit) {
        println("Joining room: $roomId")
        setupLocalTracks()
        callback(true)
    }

    // Toggle Camera
    fun toggleCamera(enabled: Boolean) {
        localVideoTrack?.setEnabled(enabled)
    }

    // Toggle Microphone
    fun toggleMicrophone(enabled: Boolean) {
        localAudioTrack?.setEnabled(enabled)
    }

    // Start Screen Sharing
    fun startScreenShare() {
        println("Starting screen share")
    }

    // Leave Room
    fun leaveRoom() {
        peerConnection?.close()
        println("Left room successfully")
    }

    private fun setupPeerConnectionFactory(context: Context) {
        // WebRTC peer connection factory setup
    }

    private fun setupLocalTracks() {
        // Setup video and audio tracks
    }
}

// Example Usage:
// val sdk = VideoSDK.instance
// sdk.initialize(context, "your_api_key")
// sdk.joinRoom("room123") { success ->
//     println("Joined: $success")
// }`;
    } else if (platform.includes('web') || platform.includes('javascript')) {
      sdkContent = `// Video SDK for Web - Version ${sdk.version}
// Complete JavaScript/TypeScript SDK with all features

class VideoSDK {
  constructor() {
    this.apiKey = null;
    this.localStream = null;
    this.peerConnection = null;
    this.roomId = null;
  }

  // Initialize SDK with API Key
  initialize(apiKey) {
    this.apiKey = apiKey;
    console.log('Initializing Video SDK with API Key:', apiKey);
    return this;
  }

  // Join a video room
  async joinRoom(roomId, options = {}) {
    this.roomId = roomId;
    console.log('Joining room:', roomId);

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: options.video !== false,
        audio: options.audio !== false
      });

      await this.setupPeerConnection();
      return { success: true, stream: this.localStream };
    } catch (error) {
      console.error('Error joining room:', error);
      return { success: false, error };
    }
  }

  // Toggle Camera
  toggleCamera(enabled) {
    const videoTracks = this.localStream?.getVideoTracks();
    videoTracks?.forEach(track => track.enabled = enabled);
  }

  // Toggle Microphone
  toggleMicrophone(enabled) {
    const audioTracks = this.localStream?.getAudioTracks();
    audioTracks?.forEach(track => track.enabled = enabled);
  }

  // Start Screen Sharing
  async startScreenShare() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      console.log('Screen sharing started');
      return screenStream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      return null;
    }
  }

  // Leave Room
  leaveRoom() {
    this.localStream?.getTracks().forEach(track => track.stop());
    this.peerConnection?.close();
    console.log('Left room successfully');
  }

  async setupPeerConnection() {
    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };
    this.peerConnection = new RTCPeerConnection(configuration);
  }
}

// Example Usage:
// const sdk = new VideoSDK();
// sdk.initialize('your_api_key');
// const result = await sdk.joinRoom('room123');
// if (result.success) {
//   document.querySelector('#video').srcObject = result.stream;
// }

export default VideoSDK;`;
    } else if (platform.includes('react')) {
      sdkContent = `// Video SDK for React - Version ${sdk.version}
// Complete React SDK with hooks and components

import React, { createContext, useContext, useState, useEffect } from 'react';

// Video SDK Context
const VideoSDKContext = createContext(null);

// Initialize Provider
export function VideoSDKProvider({ apiKey, children }) {
  const [sdk, setSDK] = useState(null);

  useEffect(() => {
    const videoSDK = new VideoSDK();
    videoSDK.initialize(apiKey);
    setSDK(videoSDK);
  }, [apiKey]);

  return (
    <VideoSDKContext.Provider value={sdk}>
      {children}
    </VideoSDKContext.Provider>
  );
}

// useVideoSDK Hook
export function useVideoSDK() {
  const context = useContext(VideoSDKContext);
  if (!context) {
    throw new Error('useVideoSDK must be used within VideoSDKProvider');
  }
  return context;
}

// useVideoRoom Hook
export function useVideoRoom(roomId) {
  const sdk = useVideoSDK();
  const [localStream, setLocalStream] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (sdk && roomId) {
      joinRoom();
    }

    return () => {
      if (sdk) {
        sdk.leaveRoom();
      }
    };
  }, [sdk, roomId]);

  const joinRoom = async () => {
    const result = await sdk.joinRoom(roomId);
    if (result.success) {
      setLocalStream(result.stream);
      setIsConnected(true);
    }
  };

  const toggleCamera = (enabled) => {
    sdk.toggleCamera(enabled);
  };

  const toggleMicrophone = (enabled) => {
    sdk.toggleMicrophone(enabled);
  };

  return {
    localStream,
    participants,
    isConnected,
    toggleCamera,
    toggleMicrophone
  };
}

// Video Component
export function VideoView({ stream, muted = false }) {
  const videoRef = React.useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

class VideoSDK {
  constructor() {
    this.apiKey = null;
    this.localStream = null;
  }

  initialize(apiKey) {
    this.apiKey = apiKey;
    console.log('Video SDK initialized');
  }

  async joinRoom(roomId) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      return { success: true, stream: this.localStream };
    } catch (error) {
      return { success: false, error };
    }
  }

  toggleCamera(enabled) {
    this.localStream?.getVideoTracks().forEach(track => track.enabled = enabled);
  }

  toggleMicrophone(enabled) {
    this.localStream?.getAudioTracks().forEach(track => track.enabled = enabled);
  }

  leaveRoom() {
    this.localStream?.getTracks().forEach(track => track.stop());
  }
}

// Example Usage:
// <VideoSDKProvider apiKey="your_api_key">
//   <YourComponent />
// </VideoSDKProvider>`;
    } else if (platform.includes('flutter')) {
      sdkContent = `// Video SDK for Flutter - Version ${sdk.version}
// Complete Dart SDK with all features

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';

class VideoSDK {
  static final VideoSDK _instance = VideoSDK._internal();
  factory VideoSDK() => _instance;
  VideoSDK._internal();

  String? _apiKey;
  MediaStream? _localStream;
  RTCPeerConnection? _peerConnection;

  // Initialize SDK with API Key
  void initialize(String apiKey) {
    _apiKey = apiKey;
    print('Initializing Video SDK with API Key: $_apiKey');
  }

  // Join a video room
  Future<Map<String, dynamic>> joinRoom(String roomId) async {
    print('Joining room: $roomId');

    try {
      final mediaConstraints = {
        'audio': true,
        'video': {
          'facingMode': 'user'
        }
      };

      _localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      await _setupPeerConnection();

      return {'success': true, 'stream': _localStream};
    } catch (e) {
      print('Error joining room: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  // Toggle Camera
  void toggleCamera(bool enabled) {
    _localStream?.getVideoTracks().forEach((track) {
      track.enabled = enabled;
    });
  }

  // Toggle Microphone
  void toggleMicrophone(bool enabled) {
    _localStream?.getAudioTracks().forEach((track) {
      track.enabled = enabled;
    });
  }

  // Start Screen Sharing
  Future<MediaStream?> startScreenShare() async {
    try {
      final screenStream = await navigator.mediaDevices.getDisplayMedia({
        'video': true
      });
      print('Screen sharing started');
      return screenStream;
    } catch (e) {
      print('Error starting screen share: $e');
      return null;
    }
  }

  // Leave Room
  void leaveRoom() {
    _localStream?.getTracks().forEach((track) => track.stop());
    _peerConnection?.close();
    print('Left room successfully');
  }

  Future<void> _setupPeerConnection() async {
    final configuration = {
      'iceServers': [
        {'urls': 'stun:stun.l.google.com:19302'}
      ]
    };
    _peerConnection = await createPeerConnection(configuration);
  }
}

// VideoView Widget
class VideoView extends StatefulWidget {
  final MediaStream stream;
  final bool mirror;

  const VideoView({
    Key? key,
    required this.stream,
    this.mirror = false,
  }) : super(key: key);

  @override
  _VideoViewState createState() => _VideoViewState();
}

class _VideoViewState extends State<VideoView> {
  final RTCVideoRenderer _renderer = RTCVideoRenderer();

  @override
  void initState() {
    super.initState();
    _initRenderer();
  }

  void _initRenderer() async {
    await _renderer.initialize();
    _renderer.srcObject = widget.stream;
  }

  @override
  void dispose() {
    _renderer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RTCVideoView(
      _renderer,
      mirror: widget.mirror,
      objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover,
    );
  }
}

// Example Usage:
// final sdk = VideoSDK();
// sdk.initialize('your_api_key');
// final result = await sdk.joinRoom('room123');
// if (result['success']) {
//   // Use VideoView widget to display stream
// }`;
    } else {
      sdkContent = `// Video SDK - Version ${sdk.version}
// Complete SDK with all features for ${sdk.platform}

Documentation and sample code for ${sdk.platform}

Features included:
- Real-time video and audio communication
- Screen sharing capabilities
- Recording functionality
- Chat and messaging
- Whiteboard collaboration
- Virtual backgrounds
- Noise suppression
- AI-powered features
- Broadcasting and streaming
- Full API access

Please refer to the documentation at ${sdk.docs} for complete implementation details.

Installation:
Follow the platform-specific installation guide in the documentation.

Quick Start:
1. Initialize the SDK with your API key
2. Join a room using the room ID
3. Configure video/audio settings
4. Handle participant events
5. Implement UI controls

For complete examples and tutorials, visit our documentation portal.`;
    }

    const blob = new Blob([sdkContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sdk.platform.replace(/\s+/g, '-').toLowerCase()}-v${sdk.version}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setNotification({
      type: 'success',
      message: `${sdk.platform} downloaded successfully!`
    });
  };

  const handleUseTemplate = async (template: VideoTemplate) => {
    if (!user) return;

    setStartingSession(true);

    try {
      const roomId = `room_${Math.random().toString(36).substr(2, 9)}`;
      const sessionUrl = `${window.location.origin}/video/${roomId}`;

      const { data: roomData, error } = await db
        .from('video_rooms')
        .insert({
          room_id: roomId,
          host_user_id: user.id,
          template_id: template.id,
          room_name: template.template_name,
          room_type: template.template_type,
          max_participants: template.configuration.participant_limit,
          duration_minutes: template.configuration.duration,
          recording_enabled: template.configuration.recording,
          screen_sharing_enabled: true,
          whiteboard_enabled: true,
          chat_enabled: true,
          status: 'active',
          started_at: new Date().toISOString()
        });

      if (error) throw error;

      const session: VideoSession = {
        id: roomData.id,
        sessionUrl,
        roomId,
        participants: 0
      };

      setVideoSessionModal({ template, session });
      setNotification({
        type: 'success',
        message: `Video session created successfully!`
      });
    } catch (error) {
      console.error('Error creating room:', error);
      setNotification({
        type: 'error',
        message: 'Failed to create video session. Please try again.'
      });
    } finally {
      setStartingSession(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setVideoSessionModal(null);
  };

  const handleShareLink = (sessionUrl: string) => {
    navigator.clipboard.writeText(sessionUrl);
    setNotification({
      type: 'success',
      message: 'Room link copied to clipboard!'
    });
  };

  const handleLeaveRoom = () => {
    setActiveRoomId(null);
  };

  const filteredProducts = videoProducts.filter(product => {
    const matchesIndustry = selectedIndustry === 'all' || product.industry === selectedIndustry;
    const matchesType = selectedProductType === 'all' || product.product_type === selectedProductType;
    const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesType && matchesSearch;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesIndustry = selectedIndustry === 'all' || template.industry === selectedIndustry;
    const matchesSearch = template.template_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  const getIndustryColor = (industry: string) => {
    const colors: Record<string, string> = {
      healthcare: 'bg-red-500/20 text-red-400 border-red-500/30',
      education: 'bg-[#39FF14]/20/20 text-[#39FF14] border-[#39FF14]/30',
      finance: 'bg-green-500/20 text-green-400 border-green-500/30',
      retail: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
      corporate: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
      legal: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      real_estate: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30'
    };
    return colors[industry] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'cancelled': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#012419]">


      <div className="p-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-1 mb-8 inline-flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'marketplace' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('my-apis')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'my-apis' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            My APIs
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'templates' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('capabilities')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'capabilities' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Capabilities
          </button>
          <button
            onClick={() => setActiveTab('sdks')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'sdks' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            SDKs
          </button>
          <button
            onClick={() => setActiveTab('recordings')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'recordings' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Recordings
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'network' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Network Quality
          </button>
          <button
            onClick={() => setActiveTab('ai-processing')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'ai-processing' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Processing
          </button>
          <button
            onClick={() => setActiveTab('broadcasting')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'broadcasting' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Broadcasting
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Video Platform Overview</h2>
                <p className="text-slate-400 mt-1">Manage your video meetings and conferences</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStartCallModal(true)}
                  className="bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-green-500/20"
                >
                  <Video className="w-5 h-5" />
                  Start Call Now
                </button>
                <button
                  onClick={() => setScheduleMeetingModal(true)}
                  className="bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-[#39FF14]/20"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Meeting
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={seedVideoData}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Load Sample Data
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Active APIs</p>
                    <p className="text-3xl font-bold text-white">{myPurchases.filter(p => p.status === 'active').length}</p>
                  </div>
                  <div className="bg-[#39FF14]/20 p-3 rounded-xl">
                    <Package className="w-6 h-6 text-[#39FF14]" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Currently subscribed</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Total Minutes</p>
                    <p className="text-3xl font-bold text-white">
                      {myPurchases.reduce((acc, p) => acc + p.usage_minutes, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Video usage this month</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">API Calls</p>
                    <p className="text-3xl font-bold text-white">
                      {myPurchases.reduce((acc, p) => acc + p.api_calls_used, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-[#39FF14]/20 p-3 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-[#39FF14]" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Total API requests</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Storage Used</p>
                    <p className="text-3xl font-bold text-white">
                      {myPurchases.reduce((acc, p) => acc + Number(p.storage_used_gb), 0).toFixed(1)} GB
                    </p>
                  </div>
                  <div className="bg-[#39FF14]/20 p-3 rounded-xl">
                    <Monitor className="w-6 h-6 text-[#39FF14]" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Cloud storage</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Video Sessions</h2>
                <button 
                  onClick={loadVideoRooms}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
              
              {videoRooms.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 text-sm">
                        <th className="py-3 px-4">Room Name</th>
                        <th className="py-3 px-4">Room ID</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Created At</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videoRooms.map((room) => (
                        <tr key={room.id} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 px-4 font-medium text-white">{room.room_name || 'Untitled Room'}</td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-xs">{room.room_id}</td>
                          <td className="py-3 px-4 text-slate-300 capitalize">{room.room_type || 'General'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              room.status === 'active' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-slate-500/20 text-slate-400'
                            }`}>
                              {room.status ? room.status.toUpperCase() : 'UNKNOWN'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-sm">
                            {new Date(room.started_at).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {room.status === 'active' && (
                              <button
                                onClick={() => handleJoinRoom(room.room_id)}
                                className="text-[#39FF14] hover:text-[#39FF14] font-medium text-sm transition-colors"
                              >
                                Join Room
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Video className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No active video sessions found.</p>
                  <button 
                    onClick={() => setStartCallModal(true)}
                    className="text-[#39FF14] hover:text-[#39FF14] mt-2 font-medium"
                  >
                    Start your first call
                  </button>
                </div>
              )}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Platform Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Video,
                    title: 'Video Conferencing',
                    description: 'Real-time HD/4K video conferencing with up to 1000 participants',
                  },
                  {
                    icon: Monitor,
                    title: 'Screen Sharing',
                    description: 'High-quality screen sharing with annotation and co-browsing',
                  },
                  {
                    icon: Camera,
                    title: 'Recording & Streaming',
                    description: 'Cloud recording with auto-transcription and live streaming',
                  },
                  {
                    icon: Code,
                    title: 'SDK & API Access',
                    description: 'Full SDK support and RESTful APIs for custom integration',
                  },
                  {
                    icon: Zap,
                    title: 'Low Latency',
                    description: 'Ultra-low latency communication for real-time interactions',
                  },
                  {
                    icon: Globe,
                    title: 'Global Infrastructure',
                    description: 'Worldwide edge network for optimal performance',
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
                      <div className="bg-[#39FF14]/20 p-3 rounded-lg w-fit mb-4">
                        <Icon className="w-6 h-6 text-[#39FF14]" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-slate-400 text-sm">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search video APIs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry === 'all' ? 'All Industries' : industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedProductType}
                  onChange={(e) => setSelectedProductType(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                >
                  {productTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{product.product_name}</h3>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getIndustryColor(product.industry)}`}>
                          {product.industry.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30">
                          {product.product_type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-4">{product.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Max Participants:</span>
                      <span className="text-white font-medium">{product.max_participants}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Storage:</span>
                      <span className="text-white font-medium">{product.storage_gb} GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">API Calls:</span>
                      <span className="text-white font-medium">{product.api_calls_limit.toLocaleString()}/mo</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {product.has_sdk && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] rounded text-xs">
                        <Code className="w-3 h-3" />
                        SDK
                      </div>
                    )}
                    {product.has_api && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        <Key className="w-3 h-3" />
                        API
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-700 pt-4 mb-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-slate-400 text-sm">Monthly:</span>
                      <span className="text-white text-2xl font-bold">RM {Number(product.monthly_price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-slate-400 text-sm">Per Minute:</span>
                      <span className="text-white font-medium">RM {Number(product.per_minute_price).toFixed(4)}</span>
                    </div>
                    {product.setup_fee > 0 && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-400 text-sm">Setup Fee:</span>
                        <span className="text-white font-medium">RM {Number(product.setup_fee).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setPurchaseModal(product)}
                    className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Purchase API
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-apis' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">My Video APIs</h2>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Browse Marketplace
              </button>
            </div>

            {myPurchases.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
                <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No APIs Yet</h3>
                <p className="text-slate-400 mb-6">Purchase your first video API to get started</p>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg inline-flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myPurchases.map((purchase) => (
                  <div key={purchase.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-xl font-semibold text-white">{purchase.product.product_name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(purchase.status)}`}>
                            {purchase.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getIndustryColor(purchase.product.industry)}`}>
                            {purchase.product.industry.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm">Purchased {new Date(purchase.purchased_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-xs mb-1">Usage Minutes</p>
                        <p className="text-white text-lg font-semibold">{purchase.usage_minutes.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs mt-1">of unlimited</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-xs mb-1">API Calls</p>
                        <p className="text-white text-lg font-semibold">{purchase.api_calls_used.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs mt-1">of {purchase.product.api_calls_limit.toLocaleString()}/mo</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-xs mb-1">Storage Used</p>
                        <p className="text-white text-lg font-semibold">{Number(purchase.storage_used_gb).toFixed(1)} GB</p>
                        <p className="text-slate-500 text-xs mt-1">of {purchase.product.storage_gb} GB</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-xs mb-1">Max Participants</p>
                        <p className="text-white text-lg font-semibold">{purchase.product.max_participants}</p>
                        <p className="text-slate-500 text-xs mt-1">concurrent</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-700 pt-4 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            API Key
                          </label>
                          <button
                            onClick={() => copyToClipboard(purchase.api_key, `api_${purchase.id}`)}
                            className="text-[#39FF14] hover:text-[#39FF14] text-sm flex items-center gap-1"
                          >
                            {copiedKey === `api_${purchase.id}` ? (
                              <><CheckCircle className="w-4 h-4" /> Copied!</>
                            ) : (
                              <><Copy className="w-4 h-4" /> Copy</>
                            )}
                          </button>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm text-white break-all">
                          {purchase.api_key}
                        </div>
                      </div>

                      {purchase.product.has_sdk && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              SDK Access Token
                            </label>
                            <button
                              onClick={() => copyToClipboard(purchase.sdk_access_token, `sdk_${purchase.id}`)}
                              className="text-[#39FF14] hover:text-[#39FF14] text-sm flex items-center gap-1"
                            >
                              {copiedKey === `sdk_${purchase.id}` ? (
                                <><CheckCircle className="w-4 h-4" /> Copied!</>
                              ) : (
                                <><Copy className="w-4 h-4" /> Copy</>
                              )}
                            </button>
                          </div>
                          <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm text-white break-all">
                            {purchase.sdk_access_token}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => setActiveTab('sdks')}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download SDK
                        </button>
                        <button
                          onClick={() => window.open('https://docs.videoapi.com', '_blank')}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          API Documentation
                        </button>
                        <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                          <Settings className="w-4 h-4" />
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
              </div>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{template.template_name}</h3>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getIndustryColor(template.industry)}`}>
                          {template.industry.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#39FF14]/20/20 text-[#39FF14] border border-[#39FF14]/30">
                          {template.template_type.toUpperCase()}
                        </span>
                        {template.is_premium && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            PREMIUM
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-4">{template.description}</p>

                  <div className="mb-4">
                    <p className="text-slate-300 text-sm font-medium mb-2">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.features.slice(0, 4).map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-900/50 text-slate-300 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                      {template.features.length > 4 && (
                        <span className="px-2 py-1 bg-slate-900/50 text-slate-400 rounded text-xs">
                          +{template.features.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-white">{template.configuration.duration} mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Participants:</span>
                      <span className="text-white">Up to {template.configuration.participant_limit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recording:</span>
                      <span className="text-white">{template.configuration.recording ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUseTemplate(template)}
                    disabled={startingSession}
                    className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    {startingSession ? 'Starting...' : 'Use Template'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'capabilities' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Video Platform Capabilities</h2>
              <p className="text-slate-400">Comprehensive features for enterprise-grade video communications</p>
            </div>

            {['Core', 'Advanced', 'AI', 'Infrastructure'].map(category => {
              const categoryCapabilities = capabilities.filter(c => (c.category || '').toLowerCase() === category.toLowerCase());
              if (categoryCapabilities.length === 0) return null;

              const categoryColors: Record<string, string> = {
                Core: 'from-[#39FF14]/30 to-[#32e012]/30',
                Advanced: 'from-green-600/30 to-green-500/30',
                AI: 'from-[#39FF14]/40 to-green-400/40',
                Infrastructure: 'from-slate-700/50 to-slate-600/50'
              };

              return (
                <div key={category} className="space-y-4">
                  <div className={`bg-gradient-to-r ${categoryColors[category] || 'from-slate-600 to-slate-700'} p-4 rounded-xl`}>
                    <h3 className="text-xl font-bold text-white capitalize">{category} Capabilities</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryCapabilities.map((capability) => (
                      <div key={capability.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-white font-semibold flex-1">{capability.capability_name}</h4>
                          {capability.requires_license && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
                              PRO
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{capability.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {(capability.supported_platforms || ['Web', 'iOS', 'Android']).map((platform: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-900/50 text-slate-300 rounded text-xs">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'sdks' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Cross-Platform SDKs</h2>
              <p className="text-slate-400">Native libraries for seamless integration across all platforms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  platform: 'iOS SDK',
                  icon: 'Smartphone',
                  description: 'Native iOS framework with Swift and Objective-C support',
                  version: '3.2.1',
                  size: '45 MB',
                  minVersion: 'iOS 13.0+',
                  languages: ['Swift', 'Objective-C'],
                  docs: 'https://docs.example.com/ios'
                },
                {
                  platform: 'Android SDK',
                  icon: 'Smartphone',
                  description: 'Native Android SDK with Kotlin and Java support',
                  version: '3.2.0',
                  size: '38 MB',
                  minVersion: 'Android 8.0+',
                  languages: ['Kotlin', 'Java'],
                  docs: 'https://docs.example.com/android'
                },
                {
                  platform: 'Web SDK (JavaScript)',
                  icon: 'Globe',
                  description: 'Browser-based WebRTC with React hooks and vanilla JS',
                  version: '3.1.5',
                  size: '12 MB',
                  minVersion: 'Modern browsers',
                  languages: ['JavaScript', 'TypeScript'],
                  docs: 'https://docs.example.com/web'
                },
                {
                  platform: 'React SDK',
                  icon: 'Code',
                  description: 'React components and hooks for rapid development',
                  version: '2.5.3',
                  size: '8 MB',
                  minVersion: 'React 16.8+',
                  languages: ['JavaScript', 'TypeScript'],
                  docs: 'https://docs.example.com/react'
                },
                {
                  platform: 'Flutter SDK',
                  icon: 'Zap',
                  description: 'Cross-platform SDK for Flutter applications',
                  version: '2.1.0',
                  size: '22 MB',
                  minVersion: 'Flutter 3.0+',
                  languages: ['Dart'],
                  docs: 'https://docs.example.com/flutter'
                },
                {
                  platform: 'Electron SDK',
                  icon: 'Monitor',
                  description: 'Desktop SDK for Windows, Mac, and Linux',
                  version: '2.0.8',
                  size: '35 MB',
                  minVersion: 'Electron 20+',
                  languages: ['JavaScript', 'TypeScript'],
                  docs: 'https://docs.example.com/electron'
                },
                {
                  platform: 'React Native SDK',
                  icon: 'Smartphone',
                  description: 'Native mobile SDK for React Native apps',
                  version: '2.4.1',
                  size: '28 MB',
                  minVersion: 'RN 0.68+',
                  languages: ['JavaScript', 'TypeScript'],
                  docs: 'https://docs.example.com/react-native'
                },
                {
                  platform: 'Unity SDK',
                  icon: 'Gamepad2',
                  description: 'Real-time video for gaming and metaverse',
                  version: '1.8.0',
                  size: '52 MB',
                  minVersion: 'Unity 2020.3+',
                  languages: ['C#'],
                  docs: 'https://docs.example.com/unity'
                }
              ].map((sdk, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{sdk.platform}</h3>
                      <p className="text-slate-400 text-sm">{sdk.description}</p>
                    </div>
                    <div className="bg-[#39FF14]/20 p-2 rounded-lg">
                      <Code className="w-6 h-6 text-[#39FF14]" />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Version:</span>
                      <span className="text-white font-medium">{sdk.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Size:</span>
                      <span className="text-white font-medium">{sdk.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Min Version:</span>
                      <span className="text-white font-medium">{sdk.minVersion}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-slate-400 text-xs mb-2">Languages:</p>
                    <div className="flex flex-wrap gap-1">
                      {sdk.languages.map((lang, langIdx) => (
                        <span key={langIdx} className="px-2 py-1 bg-slate-900/50 text-slate-300 rounded text-xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSDKDownload(sdk)}
                      className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => window.open(sdk.docs, '_blank')}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Quick Start Guides</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '5-Minute Integration', desc: 'Get started with basic video calls in minutes' },
                  { title: 'API Reference', desc: 'Complete API documentation with examples' },
                  { title: 'Sample Projects', desc: 'Download working examples for each platform' },
                  { title: 'Video Tutorials', desc: 'Step-by-step video guides and walkthroughs' }
                ].map((guide, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-[#39FF14]/50 transition-all cursor-pointer">
                    <h4 className="text-white font-semibold mb-1">{guide.title}</h4>
                    <p className="text-slate-400 text-sm">{guide.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recordings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Recording Management</h2>
                <p className="text-slate-400">Manage, archive, and analyze your video recordings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Total Recordings</h3>
                  <Video className="w-6 h-6 text-[#39FF14]" />
                </div>
                <p className="text-3xl font-bold text-white">{recordings.length}</p>
                <p className="text-sm text-slate-400 mt-1">All time</p>
              </div>

              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Storage Used</h3>
                  <Package className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {recordings.reduce((acc, r) => acc + (r.file_size_mb || 0), 0).toFixed(2)} GB
                </p>
                <p className="text-sm text-slate-400 mt-1">Across all recordings</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-[#39FF14]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Active Recordings</h3>
                  <CheckCircle className="w-6 h-6 text-[#39FF14]" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {recordings.filter(r => r.status === 'recording').length}
                </p>
                <p className="text-sm text-slate-400 mt-1">In progress now</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recording Configurations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recordingConfigs.map((config) => (
                  <div key={config.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{config.config_name}</h4>
                      {config.is_default && (
                        <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] text-xs rounded">DEFAULT</span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="text-white capitalize">{config.recording_type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Quality:</span>
                        <span className="text-white">{config.video_quality.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Auto-start:</span>
                        <span className="text-white">{config.auto_start_recording ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Cloud Storage Providers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storageConfigs.map((config) => (
                  <div key={config.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{config.config_name}</h4>
                      {config.is_default && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">DEFAULT</span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Provider:</span>
                        <span className="text-white uppercase">{config.provider.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Bucket:</span>
                        <span className="text-white text-xs truncate">{config.bucket_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Region:</span>
                        <span className="text-white">{config.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Auto-upload:</span>
                        <span className="text-white">{config.auto_upload ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Retention:</span>
                        <span className="text-white">{config.retention_days} days</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Recordings</h3>
              <div className="space-y-3">
                {recordings.slice(0, 10).map((recording) => (
                  <div key={recording.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">{recording.recording_name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-2">
                          <div>
                            <span className="text-slate-400">Type:</span>
                            <span className="text-white ml-2 capitalize">{recording.recording_type.replace('_', ' ')}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Size:</span>
                            <span className="text-white ml-2">{recording.file_size_mb?.toFixed(2) || 'N/A'} MB</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Duration:</span>
                            <span className="text-white ml-2">{Math.floor(recording.duration_seconds / 60)} min</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Status:</span>
                            <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                              recording.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              recording.status === 'recording' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>
                              {recording.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {recording.status === 'completed' && (
                        <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ml-4">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}
                    </div>
                    {recording.recording_analytics && recording.recording_analytics.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-slate-400">Views:</span>
                          <span className="text-white ml-2">{recording.recording_analytics[0].view_count}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Downloads:</span>
                          <span className="text-white ml-2">{recording.recording_analytics[0].download_count}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Unique Viewers:</span>
                          <span className="text-white ml-2">{recording.recording_analytics[0].unique_viewers}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Avg Quality:</span>
                          <span className="text-white ml-2">{recording.recording_analytics[0].average_quality_score}/100</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Network Quality Management</h2>
              <p className="text-slate-400">Monitor and optimize video quality with adaptive streaming</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">Excellent Quality</h3>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {networkMetrics.filter(m => m.quality_rating === 'excellent').length}
                </p>
                <p className="text-xs text-slate-400 mt-1">Active connections</p>
              </div>

              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">Good Quality</h3>
                  <CheckCircle className="w-5 h-5 text-[#39FF14]" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {networkMetrics.filter(m => m.quality_rating === 'good').length}
                </p>
                <p className="text-xs text-slate-400 mt-1">Active connections</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-[#39FF14]/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">Fair Quality</h3>
                  <Zap className="w-5 h-5 text-[#39FF14]" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {networkMetrics.filter(m => m.quality_rating === 'fair').length}
                </p>
                <p className="text-xs text-slate-400 mt-1">Need optimization</p>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">Poor Quality</h3>
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {networkMetrics.filter(m => m.quality_rating === 'poor' || m.quality_rating === 'critical').length}
                </p>
                <p className="text-xs text-slate-400 mt-1">Requires attention</p>
              </div>
            </div>

            {/* Advanced Network Analysis */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Real-time Network Analysis</h3>
                  <p className="text-slate-400 text-sm">Run a comprehensive diagnostic of your connection quality</p>
                </div>
                <button 
                  onClick={runNetworkTest}
                  disabled={isRunningNetworkTest}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
                    isRunningNetworkTest 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-[#39FF14] hover:bg-[#32e012] text-black shadow-lg shadow-[#39FF14]/20'
                  }`}
                >
                  {isRunningNetworkTest ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Running Test...
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      Run Network Test
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-6 border border-slate-700/50">
                {!networkTestResults && !isRunningNetworkTest ? (
                   <div className="text-center py-8">
                     <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                     <p className="text-slate-400">Click "Run Network Test" to analyze your connection stability and speed.</p>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-400">Download Speed</span>
                        <span className={`font-mono font-bold ${isRunningNetworkTest ? 'animate-pulse' : 'text-green-400'}`}>
                          {isRunningNetworkTest ? '---' : networkTestResults?.download.toFixed(1)} Mbps
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-1000 ease-out"
                          style={{ width: isRunningNetworkTest ? '100%' : `${Math.min((networkTestResults?.download || 0) / 2, 100)}%` }} 
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-400">Upload Speed</span>
                        <span className={`font-mono font-bold ${isRunningNetworkTest ? 'animate-pulse' : 'text-[#39FF14]'}`}>
                          {isRunningNetworkTest ? '---' : networkTestResults?.upload.toFixed(1)} Mbps
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#39FF14]/20 transition-all duration-1000 ease-out"
                          style={{ width: isRunningNetworkTest ? '100%' : `${Math.min((networkTestResults?.upload || 0) / 1, 100)}%` }} 
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-400">Jitter (ms)</span>
                        <span className={`font-mono font-bold ${isRunningNetworkTest ? 'animate-pulse' : 'text-[#39FF14]'}`}>
                          {isRunningNetworkTest ? '---' : networkTestResults?.jitter.toFixed(1)} ms
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#39FF14] transition-all duration-1000 ease-out"
                          style={{ width: isRunningNetworkTest ? '100%' : `${Math.min((networkTestResults?.jitter || 0) * 10, 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Mock Graph Visual */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                   <h4 className="text-sm font-semibold text-slate-400 mb-4">Real-time Latency Monitor</h4>
                   <div className="h-32 flex items-end gap-1">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-t-sm transition-all duration-500 ${
                            isRunningNetworkTest ? 'animate-pulse bg-[#39FF14]/50' : 'bg-slate-700'
                          }`}
                          style={{ 
                            height: isRunningNetworkTest 
                              ? `${20 + Math.random() * 60}%` 
                              : `${20 + Math.sin(i * 0.5) * 15 + Math.random() * 30}%`,
                            opacity: 0.5 + (i / 40) * 0.5
                          }}
                        />
                      ))}
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Adaptive Bitrate Configurations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bitrateConfigs.map((config) => (
                  <div key={config.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">{config.config_name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          config.enabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {config.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Min Bitrate:</span>
                        <span className="text-white">{config.min_bitrate_kbps} kbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target:</span>
                        <span className="text-white">{config.target_bitrate_kbps} kbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Max Bitrate:</span>
                        <span className="text-white">{config.max_bitrate_kbps} kbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Speed:</span>
                        <span className="text-white capitalize">{config.adaptation_speed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Preference:</span>
                        <span className="text-white capitalize">{config.quality_preference}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Simulcast Configurations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simulcastConfigs.map((config) => (
                  <div key={config.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{config.config_name}</h4>
                      {config.is_default && (
                        <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] text-xs rounded">DEFAULT</span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                        <p className="text-green-400 font-semibold mb-2">High Quality</p>
                        <div className="space-y-1">
                          <div className="text-slate-400 text-xs">Resolution</div>
                          <div className="text-white text-xs">{config.high_resolution}</div>
                          <div className="text-slate-400 text-xs">Bitrate</div>
                          <div className="text-white text-xs">{config.high_bitrate_kbps} kbps</div>
                          <div className="text-slate-400 text-xs">FPS</div>
                          <div className="text-white text-xs">{config.high_framerate}</div>
                        </div>
                      </div>

                      <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded p-3">
                        <p className="text-[#39FF14] font-semibold mb-2">Medium</p>
                        <div className="space-y-1">
                          <div className="text-slate-400 text-xs">Resolution</div>
                          <div className="text-white text-xs">{config.medium_resolution}</div>
                          <div className="text-slate-400 text-xs">Bitrate</div>
                          <div className="text-white text-xs">{config.medium_bitrate_kbps} kbps</div>
                          <div className="text-slate-400 text-xs">FPS</div>
                          <div className="text-white text-xs">{config.medium_framerate}</div>
                        </div>
                      </div>

                      <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded p-3">
                        <p className="text-[#39FF14] font-semibold mb-2">Low</p>
                        <div className="space-y-1">
                          <div className="text-slate-400 text-xs">Resolution</div>
                          <div className="text-white text-xs">{config.low_resolution}</div>
                          <div className="text-slate-400 text-xs">Bitrate</div>
                          <div className="text-white text-xs">{config.low_bitrate_kbps} kbps</div>
                          <div className="text-slate-400 text-xs">FPS</div>
                          <div className="text-white text-xs">{config.low_framerate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Real-time Network Statistics</h3>
              <div className="space-y-3">
                {networkMetrics.slice(0, 10).map((metric) => (
                  <div key={metric.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold">
                          {metric.video_call_participants?.participant_name || 'Unknown Participant'}
                        </h4>
                        <p className="text-slate-400 text-xs">
                          {new Date(metric.measured_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        metric.quality_rating === 'excellent' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        metric.quality_rating === 'good' ? 'bg-[#39FF14]/20/20 text-[#39FF14] border border-[#39FF14]/30' :
                        metric.quality_rating === 'fair' ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {metric.quality_rating?.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400 text-xs">Quality Score</span>
                        <p className="text-white font-semibold">{metric.quality_score}/100</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">Packet Loss</span>
                        <p className="text-white font-semibold">{metric.packet_loss_percentage?.toFixed(2)}%</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">Jitter</span>
                        <p className="text-white font-semibold">{metric.jitter_ms?.toFixed(1)} ms</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">RTT</span>
                        <p className="text-white font-semibold">{metric.round_trip_time_ms?.toFixed(0)} ms</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">Bandwidth</span>
                        <p className="text-white font-semibold">{metric.bandwidth_mbps?.toFixed(1)} Mbps</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">Resolution</span>
                        <p className="text-white font-semibold">{metric.current_resolution}</p>
                      </div>
                    </div>
                    {metric.adaptive_bitrate_active && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-[#39FF14]" />
                          <span className="text-[#39FF14] font-semibold">Adaptive Bitrate Active</span>
                          <span className="text-slate-400">- Currently streaming at</span>
                          <span className="text-white font-semibold capitalize">{metric.simulcast_layer}</span>
                          <span className="text-slate-400">quality layer</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Network Quality Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#39FF14]" />
                    Adaptive Bitrate Streaming
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Automatically adjusts video quality based on available bandwidth to maintain stable connections
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-green-400" />
                    Simulcast Technology
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Publishers send multiple quality streams simultaneously for optimal viewer experience
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#39FF14]" />
                    Real-time Diagnostics
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Monitor packet loss, jitter, RTT, and bandwidth in real-time for proactive optimization
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-processing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">AI & Advanced Media Processing</h2>
              <p className="text-slate-400">Client-side AI processing for professional video quality</p>
            </div>

            {/* AI Playground */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 border-r border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#39FF14]" />
                    Real-time AI Playground
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${aiFeaturesEnabled.blur ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-slate-800 text-slate-500'}`}>
                          <Wand2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Background Blur</p>
                          <p className="text-xs text-slate-400">Subject isolation</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleAiFeature('blur')}
                        className={`relative w-11 h-6 rounded-full transition-colors ${aiFeaturesEnabled.blur ? 'bg-[#39FF14]' : 'bg-slate-700'}`}
                      >
                        <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${aiFeaturesEnabled.blur ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${aiFeaturesEnabled.noise ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-slate-800 text-slate-500'}`}>
                          <Volume2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Noise Suppression</p>
                          <p className="text-xs text-slate-400">Audio filtering</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleAiFeature('noise')}
                        className={`relative w-11 h-6 rounded-full transition-colors ${aiFeaturesEnabled.noise ? 'bg-[#39FF14]' : 'bg-slate-700'}`}
                      >
                        <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${aiFeaturesEnabled.noise ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${aiFeaturesEnabled.transcription ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Live Transcription</p>
                          <p className="text-xs text-slate-400">Speech-to-text</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleAiFeature('transcription')}
                        className={`relative w-11 h-6 rounded-full transition-colors ${aiFeaturesEnabled.transcription ? 'bg-[#39FF14]' : 'bg-slate-700'}`}
                      >
                        <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${aiFeaturesEnabled.transcription ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col items-center justify-center bg-slate-900 relative">
                   {/* Camera Preview */}
                   <div className="relative w-full aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-xl">
                      {/* Placeholder Image/Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                         <Users className="w-20 h-20 text-slate-500" />
                      </div>
                      
                      {/* Blur Layer */}
                      {aiFeaturesEnabled.blur && (
                        <div className="absolute inset-0 backdrop-blur-md transition-all duration-500">
                          {/* Cutout for subject (simulated) */}
                          <div className="absolute inset-x-1/4 inset-y-10 bg-slate-300/10 rounded-full blur-xl" />
                        </div>
                      )}

                      {/* Subject (Simulated) */}
                      <div className="absolute inset-x-1/3 bottom-0 h-4/5 bg-slate-400 rounded-t-full shadow-2xl opacity-80 flex items-center justify-center">
                         <div className="w-20 h-20 bg-slate-300 rounded-full -mt-20 relative">
                            {/* Face details */}
                            <div className="absolute top-6 left-5 w-2 h-2 bg-slate-500 rounded-full" />
                            <div className="absolute top-6 right-5 w-2 h-2 bg-slate-500 rounded-full" />
                            <div className="absolute bottom-5 left-7 w-6 h-2 bg-slate-500 rounded-full opacity-50" />
                         </div>
                      </div>

                      {/* Overlays */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        {aiFeaturesEnabled.noise && (
                           <span className="px-2 py-1 bg-[#39FF14]/20/80 text-white text-xs rounded-full flex items-center gap-1">
                             <Mic className="w-3 h-3" /> Noise Reduced
                           </span>
                        )}
                        {aiFeaturesEnabled.transcription && (
                           <span className="px-2 py-1 bg-green-500/80 text-white text-xs rounded-full flex items-center gap-1">
                             <MessageSquare className="w-3 h-3" /> Transcribing
                           </span>
                        )}
                      </div>

                      {/* Transcription Caption */}
                      {aiFeaturesEnabled.transcription && (
                        <div className="absolute bottom-4 left-4 right-4 bg-black/60 p-2 rounded text-center">
                           <p className="text-white text-sm">"Hello, this is a real-time demonstration of the AI features..."</p>
                        </div>
                      )}
                   </div>
                   <p className="text-xs text-slate-500 mt-4">Simulated Preview</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Background Processing</h3>
                  <Wand2 className="w-6 h-6 text-[#39FF14]" />
                </div>
                <p className="text-3xl font-bold text-white">{backgroundConfigs.filter(c => c.enabled).length}</p>
                <p className="text-sm text-slate-400 mt-1">Active configurations</p>
              </div>

              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Noise Cancellation</h3>
                  <Volume2 className="w-6 h-6 text-[#39FF14]" />
                </div>
                <p className="text-3xl font-bold text-white">{noiseConfigs.filter(c => c.enabled).length}</p>
                <p className="text-sm text-slate-400 mt-1">AI models enabled</p>
              </div>

              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Live Transcription</h3>
                  <MessageSquare className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">{transcriptionConfigs.filter(c => c.enabled).length}</p>
                <p className="text-sm text-slate-400 mt-1">Languages supported</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Background Blur & Replacement</h3>
              <p className="text-slate-400 mb-4">WebAssembly-powered background processing without green screens</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {backgroundConfigs.map((config) => (
                  <div key={config.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{config.config_name}</h4>
                      {config.is_default && (
                        <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] text-xs rounded">DEFAULT</span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="text-white capitalize">{config.processing_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Quality:</span>
                        <span className="text-white uppercase">{config.quality}</span>
                      </div>
                      {config.processing_type === 'blur' && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Blur Intensity:</span>
                          <span className="text-white">{config.blur_intensity}%</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Performance:</span>
                        <span className="text-white capitalize">{config.performance_mode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">GPU Acceleration:</span>
                        <span className="text-white">{config.use_gpu_acceleration ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">WASM Version:</span>
                        <span className="text-white text-xs">{config.wasm_module_version}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Virtual Backgrounds Library</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {virtualBackgrounds.slice(0, 8).map((bg) => (
                  <div key={bg.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 hover:border-[#39FF14]/50 transition-all cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded mb-2 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-slate-600" />
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">{bg.background_name}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 capitalize">{bg.category}</span>
                      {bg.is_premium && (
                        <span className="px-1.5 py-0.5 bg-[#39FF14]/20 text-[#39FF14] rounded">PRO</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">AI Noise Cancellation</h3>
              <p className="text-slate-400 mb-4">Filter out background noise including typing, barking, and fan sounds</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {noiseConfigs.map((config) => (
                  <div key={config.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{config.config_name}</h4>
                      {config.is_default && (
                        <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded">DEFAULT</span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">AI Model:</span>
                        <span className="text-white text-xs">{config.ai_model.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Suppression:</span>
                        <span className="text-white">{config.noise_suppression_level}%</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <p className="text-slate-400 text-xs mb-2">Active Filters:</p>
                        <div className="flex flex-wrap gap-1">
                          {config.filter_keyboard_typing && (
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">Typing</span>
                          )}
                          {config.filter_dog_barking && (
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">Barking</span>
                          )}
                          {config.filter_fan_noise && (
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">Fan</span>
                          )}
                          {config.voice_isolation && (
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">Voice Isolation</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Live Transcription</h3>
              <p className="text-slate-400 mb-4">Real-time speech-to-text with speaker diarization and translation</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {transcriptionConfigs.map((config) => (
                  <div key={config.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{config.config_name}</h4>
                      {config.is_default && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">DEFAULT</span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">AI Model:</span>
                        <span className="text-white text-xs">{config.ai_model.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Language:</span>
                        <span className="text-white">{config.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="text-white">{(config.confidence_threshold * 100).toFixed(0)}%</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <p className="text-slate-400 text-xs mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {config.enable_speaker_diarization && (
                            <span className="px-2 py-0.5 bg-[#39FF14]/10 text-[#39FF14] text-xs rounded">Speaker ID</span>
                          )}
                          {config.enable_punctuation && (
                            <span className="px-2 py-0.5 bg-[#39FF14]/10 text-[#39FF14] text-xs rounded">Punctuation</span>
                          )}
                          {config.enable_translation && (
                            <span className="px-2 py-0.5 bg-[#39FF14]/10 text-[#39FF14] text-xs rounded">Translation</span>
                          )}
                          {config.word_timestamps && (
                            <span className="px-2 py-0.5 bg-[#39FF14]/10 text-[#39FF14] text-xs rounded">Timestamps</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">AI Processing Analytics</h3>
              <div className="space-y-3">
                {aiAnalytics.slice(0, 6).map((analytics) => (
                  <div key={analytics.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold capitalize">{analytics.processing_type.replace('_', ' ')}</h4>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs">Quality: {analytics.quality_score}/100</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400 text-xs">Processing Time</span>
                        <p className="text-white font-semibold">{Math.floor(analytics.total_processing_time_seconds / 60)} min</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">CPU Usage</span>
                        <p className="text-white font-semibold">{analytics.cpu_usage_percentage?.toFixed(1)}%</p>
                      </div>
                      {analytics.gpu_usage_percentage && (
                        <div>
                          <span className="text-slate-400 text-xs">GPU Usage</span>
                          <p className="text-white font-semibold">{analytics.gpu_usage_percentage?.toFixed(1)}%</p>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400 text-xs">Frames Processed</span>
                        <p className="text-white font-semibold">{analytics.frames_processed?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">Errors</span>
                        <p className="text-white font-semibold">{analytics.error_count}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">AI Processing Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-[#39FF14]" />
                    Background Blur/Replace
                  </h4>
                  <p className="text-slate-400 text-sm">
                    WASM-powered silhouette detection for professional backgrounds without green screens
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-[#39FF14]" />
                    AI Noise Cancellation
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Remove typing, barking, and background noise using advanced AI models
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-400" />
                    Live Transcription
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Real-time speech-to-text with speaker detection and multi-language translation
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'broadcasting' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Broadcasting & Live Streaming</h2>
              <p className="text-slate-400">Stream to millions with RTMP and HLS</p>
            </div>

            {/* Live Studio */}
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
               <div className="relative aspect-video bg-black flex items-center justify-center group">
                  {isBroadcasting ? (
                    <>
                      {/* Animated bars or placeholder for live video */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
                      <div className="absolute inset-0 flex items-end justify-center gap-1 pb-0 opacity-30">
                        {/* Audio visualizer bars simulated */}
                         {[...Array(40)].map((_, i) => (
                           <div key={i} className="w-2 bg-[#39FF14] rounded-t-sm animate-pulse" style={{ height: `${20 + Math.random() * 60}%`, animationDuration: `${0.5 + Math.random()}s` }} />
                         ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="bg-[#39FF14]/10 p-8 rounded-full animate-pulse">
                           <Wifi className="w-24 h-24 text-[#39FF14]" />
                         </div>
                      </div>

                      <div className="absolute top-6 left-6 flex items-center gap-3">
                         <span className="px-3 py-1 bg-red-600 text-white font-bold text-sm rounded animate-pulse shadow-lg shadow-red-500/50">LIVE</span>
                         <span className="px-3 py-1 bg-black/60 text-white font-mono text-sm rounded backdrop-blur-sm border border-white/10">
                           {formatDuration(streamDuration)}
                         </span>
                      </div>
                      <div className="absolute top-6 right-6 flex items-center gap-2">
                         <span className="flex items-center gap-1.5 px-3 py-1 bg-black/60 text-white text-sm rounded backdrop-blur-sm border border-white/10">
                           <Eye className="w-4 h-4 text-slate-300" /> 1,245
                         </span>
                         <span className="flex items-center gap-1.5 px-3 py-1 bg-black/60 text-white text-sm rounded backdrop-blur-sm border border-white/10">
                           <Activity className="w-4 h-4 text-green-400" /> Excellent
                         </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                       <Radio className="w-20 h-20 text-slate-800 mx-auto mb-4" />
                       <h3 className="text-slate-600 text-xl font-medium">Stream Offline</h3>
                       <p className="text-slate-700 text-sm mt-2">Check your RTMP configuration to start streaming</p>
                    </div>
                  )}

                  {/* Controls Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <button onClick={toggleBroadcast} className={`px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 ${isBroadcasting ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 text-white' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20 text-white'}`}>
                              {isBroadcasting ? <StopCircle className="w-5 h-5 fill-current" /> : <PlayCircle className="w-5 h-5 fill-current" />}
                              {isBroadcasting ? 'End Broadcast' : 'Go Live'}
                           </button>
                           <div className="h-8 w-px bg-white/20 mx-2" />
                           <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm flex items-center gap-2 transition-colors">
                              <Sliders className="w-4 h-4" /> Stream Settings
                           </button>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="px-3 py-1 rounded bg-black/40 text-xs text-slate-300 border border-white/10 font-mono">
                              1920x1080 @ 60fps
                           </div>
                           <div className="px-3 py-1 rounded bg-black/40 text-xs text-slate-300 border border-white/10 font-mono">
                              6000 kbps
                           </div>
                        </div>
                   </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">Live Broadcasts</h3>
                  <Radio className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {broadcastSessions.filter(b => b.status === 'live').length}
                </p>
                <p className="text-xs text-slate-400 mt-1">Currently streaming</p>
              </div>

              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">RTMP Configs</h3>
                  <Youtube className="w-5 h-5 text-[#39FF14]" />
                </div>
                <p className="text-2xl font-bold text-white">{rtmpConfigs.length}</p>
                <p className="text-xs text-slate-400 mt-1">Active destinations</p>
              </div>

              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">HLS Streams</h3>
                  <Tv className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">{hlsConfigs.length}</p>
                <p className="text-xs text-slate-400 mt-1">CDN configurations</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-[#39FF14]/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">Peak Viewers</h3>
                  <Users className="w-5 h-5 text-[#39FF14]" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {Math.max(...broadcastSessions.map(b => b.peak_viewer_count || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">All-time high</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">RTMP Broadcast Configurations</h3>
              <p className="text-slate-400 mb-4">Stream to YouTube, Twitch, Facebook, and custom RTMP destinations</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rtmpConfigs.map((config) => (
                  <div key={config.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {config.platform === 'youtube' && <Youtube className="w-5 h-5 text-red-400" />}
                        {config.platform === 'twitch' && <TwitchIcon className="w-5 h-5 text-[#39FF14]" />}
                        {config.platform === 'facebook' && <Facebook className="w-5 h-5 text-[#39FF14]" />}
                        {config.platform === 'linkedin' && <Globe className="w-5 h-5 text-[#39FF14]" />}
                        <h4 className="text-white font-semibold">{config.config_name}</h4>
                      </div>
                      {config.is_active && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">ACTIVE</span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Platform:</span>
                        <span className="text-white capitalize">{config.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Video Quality:</span>
                        <span className="text-white">{config.video_resolution} @ {config.framerate}fps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Video Bitrate:</span>
                        <span className="text-white">{config.video_bitrate_kbps} kbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Audio Bitrate:</span>
                        <span className="text-white">{config.audio_bitrate_kbps} kbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Codec:</span>
                        <span className="text-white uppercase">{config.video_codec} / {config.audio_codec}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">HLS Streaming Configurations</h3>
              <p className="text-slate-400 mb-4">Adaptive bitrate streaming for massive viewer scale with low latency</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hlsConfigs.map((config) => (
                  <div key={config.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{config.config_name}</h4>
                      {config.is_active && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">ACTIVE</span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">CDN Provider:</span>
                        <span className="text-white uppercase">{config.cdn_provider.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Latency Mode:</span>
                        <span className="text-white capitalize">{config.latency_mode.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Segment Duration:</span>
                        <span className="text-white">{config.segment_duration_seconds}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Max Viewers:</span>
                        <span className="text-white">{config.max_viewers?.toLocaleString() || 'Unlimited'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Adaptive Streaming:</span>
                        <span className="text-white">{config.enable_adaptive_streaming ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      {config.enable_drm && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">DRM:</span>
                          <span className="text-white uppercase">{config.drm_provider}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Broadcast Sessions</h3>
              <div className="space-y-3">
                {broadcastSessions.map((session) => (
                  <div key={session.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-semibold">{session.broadcast_name}</h4>
                          <span className={`px-3 py-1 rounded text-xs font-semibold ${
                            session.status === 'live' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' :
                            session.status === 'scheduled' ? 'bg-[#39FF14]/20/20 text-[#39FF14] border border-[#39FF14]/30' :
                            session.status === 'ended' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {session.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-slate-400">Type:</span>
                            <span className="text-white ml-2 uppercase">{session.broadcast_type}</span>
                          </div>
                          {session.status === 'live' && (
                            <>
                              <div>
                                <span className="text-slate-400">Current Viewers:</span>
                                <span className="text-white ml-2">{session.viewer_count?.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">Peak Viewers:</span>
                                <span className="text-white ml-2">{session.peak_viewer_count?.toLocaleString()}</span>
                              </div>
                            </>
                          )}
                          {session.status === 'ended' && (
                            <>
                              <div>
                                <span className="text-slate-400">Peak Viewers:</span>
                                <span className="text-white ml-2">{session.peak_viewer_count?.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">Duration:</span>
                                <span className="text-white ml-2">{Math.floor(session.duration_seconds / 60)} min</span>
                              </div>
                              <div>
                                <span className="text-slate-400">Total Watch Time:</span>
                                <span className="text-white ml-2">{session.total_watch_time_minutes?.toLocaleString()} min</span>
                              </div>
                            </>
                          )}
                          {session.status === 'scheduled' && (
                            <div>
                              <span className="text-slate-400">Scheduled:</span>
                              <span className="text-white ml-2">{new Date(session.scheduled_start).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {session.status === 'live' && (
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ml-4">
                          <Radio className="w-4 h-4" />
                          View Stream
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Broadcasting Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-red-400" />
                    RTMP Streaming
                  </h4>
                  <p className="text-slate-400 text-sm mb-2">
                    Push video to YouTube Live, Twitch, Facebook Live, and custom RTMP endpoints
                  </p>
                  <ul className="text-slate-400 text-xs space-y-1">
                    <li>• Multiple simultaneous destinations</li>
                    <li>• Automatic failover to backup servers</li>
                    <li>• Custom video/audio bitrate control</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Tv className="w-5 h-5 text-green-400" />
                    HLS Streaming
                  </h4>
                  <p className="text-slate-400 text-sm mb-2">
                    Adaptive bitrate streaming for millions of viewers with CDN delivery
                  </p>
                  <ul className="text-slate-400 text-xs space-y-1">
                    <li>• Multiple quality variants (360p to 4K)</li>
                    <li>• Ultra-low latency mode available</li>
                    <li>• DRM protection support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {purchaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Purchase Video API</h3>
                <p className="text-slate-400">Get instant access with API keys and SDK</p>
              </div>
              <button
                onClick={() => setPurchaseModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 mb-6">
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <h4 className="text-xl font-semibold text-white mb-2">{purchaseModal.product_name}</h4>
                <p className="text-slate-400 text-sm mb-3">{purchaseModal.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getIndustryColor(purchaseModal.industry)}`}>
                    {purchaseModal.industry.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30">
                    {purchaseModal.product_type.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Included Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {purchaseModal.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Max Participants</p>
                  <p className="text-white text-lg font-bold">{purchaseModal.max_participants}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Cloud Storage</p>
                  <p className="text-white text-lg font-bold">{purchaseModal.storage_gb} GB</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">API Calls Limit</p>
                  <p className="text-white text-lg font-bold">{purchaseModal.api_calls_limit.toLocaleString()}/mo</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Access Type</p>
                  <div className="flex gap-2">
                    {purchaseModal.has_sdk && (
                      <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] rounded text-xs">SDK</span>
                    )}
                    {purchaseModal.has_api && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">API</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Subscription:</span>
                    <span className="text-white font-medium">RM {Number(purchaseModal.monthly_price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Per Minute Rate:</span>
                    <span className="text-white font-medium">RM {Number(purchaseModal.per_minute_price).toFixed(4)}</span>
                  </div>
                  {purchaseModal.setup_fee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">One-time Setup Fee:</span>
                      <span className="text-white font-medium">RM {Number(purchaseModal.setup_fee).toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#39FF14] font-semibold">Total Today:</span>
                    <span className="text-white text-2xl font-bold">
                      RM {(Number(purchaseModal.setup_fee) + Number(purchaseModal.monthly_price)).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[#39FF14] text-xs mt-2">
                    API keys and SDK access will be generated instantly after purchase
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPurchaseModal(null)}
                disabled={purchasing}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {purchasing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Confirm Purchase
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`${
            notification.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
          } border backdrop-blur-sm rounded-lg p-4 max-w-md`}>
            <div className="flex items-start gap-3">
              <div className={`${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } rounded-full p-1`}>
                {notification.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <X className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {notification.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className="text-white text-sm mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {videoSessionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Video Session Ready</h3>
                <p className="text-slate-400">{videoSessionModal.template.template_name}</p>
              </div>
              <button
                onClick={() => setVideoSessionModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-[#39FF14] to-[#32e012] p-8 rounded-2xl">
                  <Video className="w-16 h-16 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-xs mb-1">Session Type</p>
                  <p className="text-white font-semibold">{videoSessionModal.template.template_type}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-xs mb-1">Max Participants</p>
                  <p className="text-white font-semibold">{videoSessionModal.template.configuration.participant_limit}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-xs mb-1">Duration</p>
                  <p className="text-white font-semibold">{videoSessionModal.template.configuration.duration} mins</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Session URL</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm text-[#39FF14] break-all">
                      {videoSessionModal.session.sessionUrl}
                    </div>
                    <button
                      onClick={() => copyToClipboard(videoSessionModal.session.sessionUrl, 'session_url')}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      {copiedKey === 'session_url' ? (
                        <><CheckCircle className="w-4 h-4" /> Copied</>
                      ) : (
                        <><Copy className="w-4 h-4" /> Copy</>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Room ID</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm text-white">
                      {videoSessionModal.session.roomId}
                    </div>
                    <button
                      onClick={() => copyToClipboard(videoSessionModal.session.roomId, 'room_id')}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      {copiedKey === 'room_id' ? (
                        <><CheckCircle className="w-4 h-4" /> Copied</>
                      ) : (
                        <><Copy className="w-4 h-4" /> Copy</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-4">
                <h4 className="text-[#39FF14] font-semibold mb-3 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5" />
                  Join Meeting
                </h4>
                <p className="text-slate-300 text-sm mb-3">Click to enter the video conference room</p>
                <button
                  onClick={() => handleJoinRoom(videoSessionModal.session.roomId)}
                  className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  Join Now
                </button>
              </div>

              <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-4">
                <h4 className="text-[#39FF14] font-semibold mb-3 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Invite Participants
                </h4>
                <p className="text-slate-300 text-sm mb-3">Share the link with other participants</p>
                <button
                  onClick={() => handleShareLink(videoSessionModal.session.sessionUrl)}
                  className="w-full bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  Share Link
                </button>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Session Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {videoSessionModal.template.features.slice(0, 8).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setVideoSessionModal(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Close
              </button>
              <button className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Maximize2 className="w-5 h-5" />
                Open in Full Screen
              </button>
            </div>
          </div>
        </div>
      )}

      {startCallModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Video className="w-7 h-7 text-green-400" />
                  Start Video Call
                </h3>
                <p className="text-slate-400">Choose your call configuration and features</p>
              </div>
              <button
                onClick={() => setStartCallModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Call Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCallType('p2p')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      callType === 'p2p'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-green-400" />
                      <span className="text-white font-semibold">P2P Call</span>
                    </div>
                    <p className="text-slate-400 text-xs">1-on-1 high-quality video call with ultra-low latency</p>
                  </button>

                  <button
                    onClick={() => setCallType('group_sfu')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      callType === 'group_sfu'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-green-400" />
                      <span className="text-white font-semibold">Group Room (SFU)</span>
                    </div>
                    <p className="text-slate-400 text-xs">Up to 50 active speakers with optimized bandwidth</p>
                  </button>

                  <button
                    onClick={() => setCallType('group_mcu')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      callType === 'group_mcu'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-[#39FF14]" />
                      <span className="text-white font-semibold">Group Room (MCU)</span>
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">PRO</span>
                    </div>
                    <p className="text-slate-400 text-xs">Large conferences with 100+ participants</p>
                  </button>

                  <button
                    onClick={() => setCallType('webinar')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      callType === 'webinar'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="w-5 h-5 text-[#39FF14]" />
                      <span className="text-white font-semibold">Webinar Mode</span>
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">PRO</span>
                    </div>
                    <p className="text-slate-400 text-xs">Broadcast to thousands of viewers</p>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Media & Collaboration Features</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableScreenShare}
                      onChange={(e) => setEnableScreenShare(e.target.checked)}
                      className="w-5 h-5 text-green-600 bg-slate-900 border-slate-700 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-green-400" />
                        <span className="text-white font-medium">Screen Sharing</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">Share your screen, window, or tab</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableWhiteboard}
                      onChange={(e) => setEnableWhiteboard(e.target.checked)}
                      className="w-5 h-5 text-green-600 bg-slate-900 border-slate-700 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#39FF14]" />
                        <span className="text-white font-medium">Virtual Whiteboard</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">Collaborative drawing and annotations</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableSIP}
                      onChange={(e) => setEnableSIP(e.target.checked)}
                      className="w-5 h-5 text-green-600 bg-slate-900 border-slate-700 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-[#39FF14]" />
                        <span className="text-white font-medium">SIP Interconnect</span>
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">PRO</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">Allow phone dial-in for audio participants</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h4 className="text-white font-semibold">Included Features</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    HD Video & Audio
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Real-time Chat
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Emoji Reactions
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Hand Raise
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStartCallModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const roomId = `room_${Math.random().toString(36).substr(2, 9)}`;
                  setActiveRoomId(roomId);
                  setStartCallModal(false);
                  setNotification({ type: 'success', message: 'Call started successfully!' });
                }}
                className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                Start Call
              </button>
            </div>
          </div>
        </div>
      )}

      {scheduleMeetingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Calendar className="w-7 h-7 text-[#39FF14]" />
                  Schedule Video Meeting
                </h3>
                <p className="text-slate-400">Create a new meeting with AI-powered features</p>
              </div>
              <button
                onClick={() => setScheduleMeetingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g., Weekly Team Sync"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Participant Emails (comma-separated)
                </label>
                <textarea
                  value={participantEmails}
                  onChange={(e) => setParticipantEmails(e.target.value)}
                  placeholder="john@example.com, jane@example.com"
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
              </div>

              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-[#39FF14]" />
                  <h4 className="text-white font-semibold">Meeting AI Configuration</h4>
                </div>

                {meetingAIConfigs.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      AI Features Preset
                    </label>
                    <select
                      value={selectedAIConfig}
                      onChange={(e) => setSelectedAIConfig(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14] mb-3"
                    >
                      {meetingAIConfigs.map(config => (
                        <option key={config.id} value={config.id}>
                          {config.configuration_name}
                          {config.is_default && ' (Default)'}
                        </option>
                      ))}
                    </select>

                    {selectedAIConfig && (() => {
                      const config = meetingAIConfigs.find(c => c.id === selectedAIConfig);
                      return config ? (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mic className="w-4 h-4 text-[#39FF14]" />
                            <span className="text-slate-300">Transcription:</span>
                            <span className="text-white font-medium">
                              {config.enable_transcription ? 'On' : 'Off'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-[#39FF14]" />
                            <span className="text-slate-300">Recording:</span>
                            <span className="text-white font-medium">
                              {config.enable_recording ? 'On' : 'Off'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-[#39FF14]" />
                            <span className="text-slate-300">AI Insights:</span>
                            <span className="text-white font-medium">
                              {config.enable_ai_insights ? 'On' : 'Off'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#39FF14]" />
                            <span className="text-slate-300">Action Items:</span>
                            <span className="text-white font-medium">
                              {config.enable_action_items ? 'On' : 'Off'}
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                ) : (
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableAITranscription}
                        onChange={(e) => setEnableAITranscription(e.target.checked)}
                        className="w-5 h-5 text-[#39FF14] bg-slate-900 border-slate-700 rounded focus:ring-2 focus:ring-[#39FF14]"
                      />
                      <div>
                        <span className="text-white font-medium">Enable AI Transcription</span>
                        <p className="text-slate-400 text-xs mt-0.5">Real-time speech-to-text with speaker identification</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Meeting Features</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    HD Video & Audio
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Screen Sharing
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Chat & Reactions
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Up to 100 Participants
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setScheduleMeetingModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleMeeting}
                disabled={!meetingTitle || !meetingDate || !meetingTime}
                className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {activeRoomId && (
        <VideoRoom roomId={activeRoomId} onLeave={handleLeaveRoom} />
      )}
    </div>
  );
}
