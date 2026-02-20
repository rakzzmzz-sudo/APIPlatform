export interface Platform {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  is_active: boolean;
  total_campaigns: number;
  success_rate: number;
  total_messages: number;
  last_sync: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  platform_id?: string;
  channel_id?: string;
  name: string;
  description?: string;
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'failed';
  channel_type: string;
  target_audience?: Record<string, any>;
  message_template?: string;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  total_recipients?: number;
  messages_sent: number;
  messages_delivered: number;
  messages_failed: number;
  success_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface PlatformMetric {
  id: string;
  platform_id: string;
  timestamp: string;
  messages_sent: number;
  success_rate: number;
  active_campaigns: number;
  response_time_ms: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  related_id?: string;
  created_at: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: Record<string, any>;
  updated_at: string;
}
