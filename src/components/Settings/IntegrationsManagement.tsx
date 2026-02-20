/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle, XCircle, Settings, RefreshCw, ChevronDown, ChevronRight,
  Code, MessageSquare, Shield, Database, Network, Zap, AlertCircle, Copy,
  Eye, EyeOff, Plus, Info, Save, X, Wifi, Loader2, Terminal
} from 'lucide-react';

type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending' | 'testing';

type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'password' | 'number' | 'select' | 'url';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  hint?: string;
};

type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  version?: string;
  features: string[];
  fields: FieldDef[];
  defaultConfig: Record<string, string>;
  lastSync?: string;
  throughput?: string;
};

type IntegrationCategory = {
  id: string;
  label: string;
  icon: any;
  color: string;
  description: string;
  integrations: IntegrationItem[];
};

// ------------------------------------------------------------------
// Integration schema (fields define the edit form, defaultConfig the initial values)
// ------------------------------------------------------------------
const integrationSchema: IntegrationCategory[] = [
  {
    id: 'messaging-protocols',
    label: 'Messaging Protocols',
    icon: MessageSquare,
    color: '#39FF14',
    description: 'Core messaging transport and relay protocols',
    integrations: [
      {
        id: 'smpp',
        name: 'SMPP',
        description: 'Short Message Peer-to-Peer — high-throughput SMS delivery to carrier networks via SMPP v3.4.',
        status: 'connected',
        version: 'SMPP v3.4',
        features: ['Bulk SMS dispatch', 'DLR callbacks', 'Session binding (TX/RX/TRX)', 'Throttling control', 'Enquire link keepalive'],
        fields: [
          { key: 'host', label: 'Host', type: 'text', placeholder: 'smpp.carrier.example.com', required: true },
          { key: 'port', label: 'Port', type: 'number', placeholder: '2775', required: true },
          { key: 'system_id', label: 'System ID', type: 'text', placeholder: 'your_system_id', required: true },
          { key: 'password', label: 'Password', type: 'password', placeholder: 'SMPP password', required: true },
          { key: 'system_type', label: 'System Type', type: 'text', placeholder: 'VMA' },
          { key: 'bind_type', label: 'Bind Type', type: 'select', options: ['Transmitter (TX)', 'Receiver (RX)', 'Transceiver (TRX)'] },
          { key: 'window_size', label: 'Window Size', type: 'number', placeholder: '10', hint: 'Max outstanding PDUs' },
          { key: 'enquire_link_interval', label: 'Enquire Link Interval', type: 'text', placeholder: '30s' },
        ],
        defaultConfig: { host: 'smpp.carrier.cpaas.io', port: '2775', system_id: 'cpaas_prod_01', password: '', system_type: 'VMA', bind_type: 'Transceiver (TRX)', window_size: '10', enquire_link_interval: '30s' },
        lastSync: new Date(Date.now() - 8 * 60000).toISOString(), throughput: '1,200 msg/sec'
      },
      {
        id: 'smtp',
        name: 'SMTP',
        description: 'Simple Mail Transfer Protocol — transactional and bulk email delivery via relay servers.',
        status: 'connected',
        version: 'SMTP / ESMTP',
        features: ['TLS/STARTTLS support', 'DKIM signing', 'SPF validation', 'Bounce handling', 'AUTH LOGIN / PLAIN'],
        fields: [
          { key: 'host', label: 'SMTP Host', type: 'text', placeholder: 'smtp.relay.example.com', required: true },
          { key: 'port', label: 'Port', type: 'number', placeholder: '587', required: true },
          { key: 'username', label: 'Username / Email', type: 'text', placeholder: 'user@yourdomain.com', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
          { key: 'encryption', label: 'Encryption', type: 'select', options: ['STARTTLS', 'SSL/TLS', 'None'] },
          { key: 'from_domain', label: 'From Domain', type: 'text', placeholder: 'yourdomain.com' },
          { key: 'dkim_selector', label: 'DKIM Selector', type: 'text', placeholder: 'k1' },
          { key: 'timeout', label: 'Timeout', type: 'text', placeholder: '30s' },
        ],
        defaultConfig: { host: 'smtp.relay.cpaas.io', port: '587', username: '', password: '', encryption: 'STARTTLS', from_domain: '', dkim_selector: 'k1', timeout: '30s' },
        lastSync: new Date(Date.now() - 12 * 60000).toISOString(), throughput: '500 emails/min'
      }
    ]
  },
  {
    id: 'directory-auth',
    label: 'Directory & Authentication',
    icon: Shield,
    color: '#22d3ee',
    description: 'Identity providers and directory services',
    integrations: [
      {
        id: 'ldap',
        name: 'LDAP / Active Directory',
        description: 'LDAPv3 directory for enterprise SSO, user provisioning, and role mapping to platform roles.',
        status: 'connected',
        version: 'LDAPv3',
        features: ['LDAPS (SSL/TLS)', 'Group-based role mapping', 'User sync & provisioning', 'Nested group support', 'Start TLS'],
        fields: [
          { key: 'host', label: 'LDAP Host', type: 'text', placeholder: 'ldap.corp.example.com', required: true },
          { key: 'port', label: 'Port', type: 'number', placeholder: '636 (LDAPS) or 389', required: true },
          { key: 'bind_dn', label: 'Bind DN', type: 'text', placeholder: 'cn=svc-account,dc=corp,dc=com', required: true },
          { key: 'bind_password', label: 'Bind Password', type: 'password', required: true },
          { key: 'base_dn', label: 'Base DN', type: 'text', placeholder: 'dc=corp,dc=com', required: true },
          { key: 'user_filter', label: 'User Filter', type: 'text', placeholder: '(sAMAccountName={{username}})' },
          { key: 'group_dn', label: 'Group DN', type: 'text', placeholder: 'ou=Groups,dc=corp,dc=com' },
          { key: 'tls', label: 'TLS Mode', type: 'select', options: ['LDAPS', 'StartTLS', 'None'] },
        ],
        defaultConfig: { host: 'ldap.corp.cpaas.io', port: '636', bind_dn: '', bind_password: '', base_dn: 'dc=corp,dc=io', user_filter: '(sAMAccountName={{username}})', group_dn: '', tls: 'LDAPS' },
        lastSync: new Date(Date.now() - 25 * 60000).toISOString()
      }
    ]
  },
  {
    id: 'api-integrations',
    label: 'API & Web Services',
    icon: Code,
    color: '#a78bfa',
    description: 'REST, GraphQL, and API platform connectors',
    integrations: [
      {
        id: 'rest-api',
        name: 'REST API',
        description: 'RESTful API connector for webhooks, callbacks, and third-party service integration via HTTP/S.',
        status: 'connected',
        version: 'HTTP/1.1 + HTTP/2',
        features: ['OAuth 2.0 auth', 'JWT bearer tokens', 'Webhook delivery', 'Retry logic with backoff', 'OpenAPI 3.0 spec'],
        fields: [
          { key: 'base_url', label: 'Base URL', type: 'url', placeholder: 'https://api.example.com/v1', required: true },
          { key: 'auth_type', label: 'Auth Type', type: 'select', options: ['OAuth 2.0 (Client Credentials)', 'Bearer Token', 'API Key', 'Basic Auth', 'None'] },
          { key: 'client_id', label: 'Client ID', type: 'text', placeholder: 'your_client_id' },
          { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: 'your_client_secret' },
          { key: 'token_url', label: 'Token Endpoint', type: 'url', placeholder: 'https://auth.example.com/oauth/token' },
          { key: 'api_key', label: 'API Key (if used)', type: 'password', placeholder: 'Bearer or X-API-Key value' },
          { key: 'rate_limit', label: 'Rate Limit', type: 'text', placeholder: '1000 req/hour' },
          { key: 'timeout', label: 'Timeout', type: 'text', placeholder: '30s' },
        ],
        defaultConfig: { base_url: 'https://api.platform.cpaas.io/v3', auth_type: 'OAuth 2.0 (Client Credentials)', client_id: '', client_secret: '', token_url: '', api_key: '', rate_limit: '1000 req/hour', timeout: '30s' },
        lastSync: new Date(Date.now() - 2 * 60000).toISOString(), throughput: '1,000 req/hour'
      },
      {
        id: 'graph-api',
        name: 'Graph API',
        description: 'Microsoft & Meta Graph API connector for Office 365, Teams, WhatsApp Business, and social integrations.',
        status: 'connected',
        version: 'Graph API v18 / MS Graph v1.0',
        features: ['MS Teams messaging', 'WhatsApp Business API', 'Calendar & email access', 'User directory sync', 'Webhooks (change notifications)'],
        fields: [
          { key: 'provider', label: 'Provider', type: 'select', options: ['Microsoft + Meta', 'Microsoft Only', 'Meta Only'] },
          { key: 'ms_tenant_id', label: 'MS Tenant ID', type: 'text', placeholder: 'corp.onmicrosoft.com' },
          { key: 'ms_client_id', label: 'MS App (Client) ID', type: 'text', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
          { key: 'ms_client_secret', label: 'MS Client Secret', type: 'password' },
          { key: 'meta_app_id', label: 'Meta App ID', type: 'text', placeholder: '123456789' },
          { key: 'meta_token', label: 'Meta Permanent Token', type: 'password' },
          { key: 'webhook_verify_token', label: 'Webhook Verify Token', type: 'password', hint: 'Used for Meta webhook verification' },
          { key: 'scope', label: 'MS Scopes', type: 'text', placeholder: 'Chat.ReadWrite Mail.Send User.Read' },
        ],
        defaultConfig: { provider: 'Microsoft + Meta', ms_tenant_id: '', ms_client_id: '', ms_client_secret: '', meta_app_id: '', meta_token: '', webhook_verify_token: '', scope: 'Chat.ReadWrite Mail.Send User.Read' },
        lastSync: new Date(Date.now() - 5 * 60000).toISOString()
      },
      {
        id: 'postman',
        name: 'Postman / API Testing',
        description: 'Postman workspace sync for automated API testing, collection running, and CI/CD integration.',
        status: 'connected',
        version: 'Postman API v10',
        features: ['Collection sync', 'Automated test runs (Newman)', 'Environment variables', 'CI/CD webhook triggers', 'API monitoring', 'Mock server'],
        fields: [
          { key: 'api_key', label: 'Postman API Key (PMAK)', type: 'password', required: true, placeholder: 'PMAK-xxxxxxxxxx' },
          { key: 'workspace_id', label: 'Workspace ID', type: 'text', placeholder: 'ws_xxxxxxxx' },
          { key: 'collection_id', label: 'Collection ID', type: 'text', placeholder: 'col_xxxxxxxx' },
          { key: 'environment', label: 'Environment', type: 'select', options: ['Production', 'Staging', 'Development', 'Local'] },
          { key: 'monitor_id', label: 'Monitor ID', type: 'text', placeholder: 'mon_xxxxxxxx' },
          { key: 'schedule', label: 'Run Schedule', type: 'select', options: ['Every 5 minutes', 'Every 15 minutes', 'Every 30 minutes', 'Hourly', 'Daily', 'Manual'] },
        ],
        defaultConfig: { api_key: '', workspace_id: '', collection_id: '', environment: 'Production', monitor_id: '', schedule: 'Every 15 minutes' },
        lastSync: new Date(Date.now() - 15 * 60000).toISOString()
      },
      {
        id: 'general-api',
        name: 'General API Gateway',
        description: 'Centralized API gateway managing rate limits, versioning, and access control across all platform APIs.',
        status: 'connected',
        version: 'Kong Gateway v3.5',
        features: ['JWT / API key auth', 'Rate limiting (global + per-consumer)', 'Request transformation', 'Canary releases', 'Plugin ecosystem'],
        fields: [
          { key: 'host', label: 'Gateway Host', type: 'text', placeholder: 'gateway.example.com', required: true },
          { key: 'admin_port', label: 'Admin Port', type: 'number', placeholder: '8001' },
          { key: 'proxy_port', label: 'Proxy Port', type: 'number', placeholder: '8000' },
          { key: 'auth_plugin', label: 'Auth Plugin', type: 'select', options: ['JWT + Key-Auth', 'OAuth 2.0', 'Basic Auth', 'HMAC', 'Key Auth Only'] },
          { key: 'rate_limit_global', label: 'Global Rate Limit', type: 'text', placeholder: '10,000 req/min' },
          { key: 'upstream', label: 'Upstream URL', type: 'url', placeholder: 'http://internal-api:3000' },
          { key: 'tls', label: 'TLS', type: 'select', options: ['Enabled (wildcard cert)', 'Enabled (custom cert)', 'Disabled'] },
          { key: 'load_balancer', label: 'Load Balancer', type: 'select', options: ['Round-Robin', 'Least Connections', 'Hash (IP)', 'Random'] },
        ],
        defaultConfig: { host: 'gateway.cpaas.io', admin_port: '8001', proxy_port: '8000', auth_plugin: 'JWT + Key-Auth', rate_limit_global: '10,000 req/min', upstream: '', tls: 'Enabled (wildcard cert)', load_balancer: 'Round-Robin' },
        lastSync: new Date(Date.now() - 10 * 60000).toISOString(), throughput: '10,000 req/min'
      }
    ]
  },
  {
    id: 'bss-oss',
    label: 'BSS / OSS Systems',
    icon: Database,
    color: '#f59e0b',
    description: 'Business and Operational Support Systems',
    integrations: [
      {
        id: 'bss',
        name: 'BSS (Business Support System)',
        description: 'Billing, mediation, and customer management system integration for telco-grade monetization.',
        status: 'connected',
        version: 'TM Forum Open API',
        features: ['Real-time CDR mediation', 'Prepaid / postpaid billing', 'Product catalog sync', 'Invoice generation', 'Usage-based charging'],
        fields: [
          { key: 'bss_endpoint', label: 'BSS Endpoint', type: 'url', required: true, placeholder: 'https://bss.example.com/api/v2' },
          { key: 'api_key', label: 'API Key', type: 'password', required: true },
          { key: 'mediation_type', label: 'Mediation Type', type: 'select', options: ['Real-time CDR', 'Batch CDR', 'Event-based'] },
          { key: 'billing_model', label: 'Billing Model', type: 'select', options: ['Prepaid + Postpaid', 'Prepaid Only', 'Postpaid Only'] },
          { key: 'cdr_format', label: 'CDR Format', type: 'select', options: ['ASN.1 / CSV', 'JSON', 'XML', 'Diameter'] },
          { key: 'sync_interval', label: 'Sync Interval', type: 'select', options: ['Real-time', 'Every 1 minute', 'Every 5 minutes', 'Every 15 minutes'] },
        ],
        defaultConfig: { bss_endpoint: '', api_key: '', mediation_type: 'Real-time CDR', billing_model: 'Prepaid + Postpaid', cdr_format: 'ASN.1 / CSV', sync_interval: 'Real-time' },
        lastSync: new Date(Date.now() - 1 * 60000).toISOString(), throughput: '5,000 CDR/sec'
      },
      {
        id: 'oss',
        name: 'OSS (Operational Support System)',
        description: 'Network inventory, provisioning, fault management, and performance monitoring integration.',
        status: 'connected',
        version: 'ETSI NFV / TM Forum',
        features: ['Network inventory management', 'Service provisioning automation', 'Fault & alarm management (SNMP)', 'Performance KPI collection', 'NETCONF/YANG config'],
        fields: [
          { key: 'oss_endpoint', label: 'OSS Endpoint', type: 'url', required: true, placeholder: 'https://oss.example.com/api/v1' },
          { key: 'api_key', label: 'API Key', type: 'password', required: true },
          { key: 'fault_protocol', label: 'Fault Protocol', type: 'select', options: ['SNMP v3 + Syslog', 'SNMP v2c', 'Syslog Only', 'OpenConfig'] },
          { key: 'config_protocol', label: 'Config Protocol', type: 'select', options: ['NETCONF / YANG', 'RESTCONF', 'SNMP Set', 'CLI (SSH)'] },
          { key: 'performance_collector', label: 'Metrics Collector', type: 'select', options: ['Prometheus + Grafana', 'InfluxDB + Grafana', 'ELK Stack', 'Custom'] },
          { key: 'discovery_interval', label: 'Discovery Interval', type: 'select', options: ['Real-time', '1 minute', '5 minutes', '15 minutes', '1 hour'] },
        ],
        defaultConfig: { oss_endpoint: '', api_key: '', fault_protocol: 'SNMP v3 + Syslog', config_protocol: 'NETCONF / YANG', performance_collector: 'Prometheus + Grafana', discovery_interval: '5 minutes' },
        lastSync: new Date(Date.now() - 3 * 60000).toISOString()
      }
    ]
  },
  {
    id: 'gateways',
    label: 'Communication Gateways',
    icon: Network,
    color: '#f97316',
    description: 'Carrier-grade messaging, voice, and media gateways',
    integrations: [
      {
        id: 'sms-gateway',
        name: 'SMS Gateway',
        description: 'Carrier-grade SMS aggregator gateway with multi-route failover, DLR tracking, and number masking.',
        status: 'connected',
        version: 'SMPP v3.4 / HTTP',
        features: ['Multi-carrier routing', 'Automatic failover', 'DLR tracking', 'Number masking / SenderID', 'Two-way SMS (MO/MT)', 'Flash SMS support'],
        fields: [
          { key: 'host', label: 'Gateway Host', type: 'text', required: true, placeholder: 'sms-gw.carrier.example.com' },
          { key: 'port', label: 'Port', type: 'number', placeholder: '2776' },
          { key: 'primary_route', label: 'Primary Route', type: 'text', placeholder: 'Telco A — MY' },
          { key: 'fallback_route', label: 'Fallback Route', type: 'text', placeholder: 'Telco B — SG' },
          { key: 'sender_id', label: 'Sender ID / Mask', type: 'text', placeholder: 'YourBrand', required: true },
          { key: 'dlr_url', label: 'DLR Webhook URL', type: 'url', placeholder: 'https://yourapp.com/dlr/sms' },
          { key: 'max_tps', label: 'Max TPS', type: 'text', placeholder: '500 msg/sec' },
          { key: 'username', label: 'Username', type: 'text' },
          { key: 'password', label: 'Password', type: 'password' },
        ],
        defaultConfig: { host: 'sms-gw.carrier.cpaas.io', port: '2776', primary_route: 'Telco A — MY', fallback_route: 'Telco B — SG', sender_id: 'CPaaSBiz', dlr_url: '', max_tps: '500 msg/sec', username: '', password: '' },
        lastSync: new Date(Date.now() - 1 * 60000).toISOString(), throughput: '500 msg/sec'
      },
      {
        id: 'rcs-gateway',
        name: 'RCS Gateway',
        description: 'Rich Communication Services gateway for verified sender messaging with carousels and quick replies.',
        status: 'connected',
        version: 'GSMA Universal Profile 2.4',
        features: ['Verified sender (blue tick)', 'Rich cards & carousels', 'Suggested replies / actions', 'File sharing', 'Read receipts', 'Fallback to SMS'],
        fields: [
          { key: 'rcs_gateway', label: 'RCS Gateway URL', type: 'url', required: true, placeholder: 'https://rcs-gw.carrier.example.com' },
          { key: 'api_key', label: 'API Key', type: 'password', required: true },
          { key: 'sender_id', label: 'Verified Sender ID', type: 'text', required: true, placeholder: 'YourBrand_Verified' },
          { key: 'fallback', label: 'Fallback Channel', type: 'select', options: ['SMS (automatic)', 'SMS (manual trigger)', 'None'] },
          { key: 'profile', label: 'RCS Profile', type: 'select', options: ['Universal Profile 2.4', 'Universal Profile 2.3', 'Custom'] },
          { key: 'dlr_webhook', label: 'DLR Webhook URL', type: 'url', placeholder: 'https://yourapp.com/dlr/rcs' },
          { key: 'max_message_size', label: 'Max Message Size', type: 'text', placeholder: '100KB' },
        ],
        defaultConfig: { rcs_gateway: 'https://rcs-gw.carrier.cpaas.io', api_key: '', sender_id: 'CPaaS_Verified', fallback: 'SMS (automatic)', profile: 'Universal Profile 2.4', dlr_webhook: '', max_message_size: '100KB' },
        lastSync: new Date(Date.now() - 7 * 60000).toISOString(), throughput: '200 msg/sec'
      },
      {
        id: 'webrtc-gateway',
        name: 'WebRTC Gateway',
        description: 'Browser-based real-time communication gateway for HD audio/video calls and data channels.',
        status: 'connected',
        version: 'WebRTC W3C / RFC 8829',
        features: ['STUN/TURN/ICE server', 'E2E encrypted media (SRTP/DTLS)', 'SFU media server (Janus)', 'NAT traversal', 'Screen sharing', 'Recording (S3)'],
        fields: [
          { key: 'signaling', label: 'Signaling (WSS)', type: 'url', required: true, placeholder: 'wss://webrtc.example.com/signal' },
          { key: 'stun', label: 'STUN Server', type: 'text', placeholder: 'stun:stun.example.com:3478' },
          { key: 'turn', label: 'TURN Server', type: 'text', placeholder: 'turn:turn.example.com:3478' },
          { key: 'turn_username', label: 'TURN Username', type: 'text' },
          { key: 'turn_password', label: 'TURN Password', type: 'password' },
          { key: 'sfu', label: 'SFU Engine', type: 'select', options: ['Janus Gateway', 'mediasoup', 'Kurento', 'Ant Media', 'Custom'] },
          { key: 'record_bucket', label: 'Recording Bucket (S3)', type: 'text', placeholder: 's3://your-bucket/recordings' },
          { key: 'codec', label: 'Preferred Codec', type: 'select', options: ['VP9 + Opus', 'VP8 + Opus', 'H.264 + Opus', 'AV1 + Opus'] },
        ],
        defaultConfig: { signaling: 'wss://webrtc.media.cpaas.io/signal', stun: 'stun:stun.cpaas.io:3478', turn: 'turn:turn.cpaas.io:3478', turn_username: '', turn_password: '', sfu: 'Janus Gateway', record_bucket: '', codec: 'VP9 + Opus' },
        lastSync: new Date(Date.now() - 3 * 60000).toISOString(), throughput: '500 concurrent calls'
      },
      {
        id: 'sip-gateway',
        name: 'SIP Gateway / Trunk',
        description: 'Session Initiation Protocol gateway for carrier SIP trunking, PSTN interconnect, and IVR integration.',
        status: 'connected',
        version: 'SIP RFC 3261 / RTP',
        features: ['SIP trunk registration', 'PSTN breakout (inbound/outbound)', 'G.711/G.722/Opus codec', 'DTMF (RFC 2833)', 'TLS/SRTP encryption', 'CDR generation'],
        fields: [
          { key: 'sip_proxy', label: 'SIP Proxy Host', type: 'text', required: true, placeholder: 'sip.trunk.example.com' },
          { key: 'port', label: 'Port', type: 'number', placeholder: '5060 (UDP) or 5061 (TLS)' },
          { key: 'username', label: 'SIP Username', type: 'text', required: true, placeholder: 'trunk_account_01' },
          { key: 'password', label: 'SIP Password', type: 'password', required: true },
          { key: 'domain', label: 'SIP Domain', type: 'text', placeholder: 'sip.example.com' },
          { key: 'codec_preference', label: 'Codec Preference', type: 'select', options: ['G.722 > G.711u > Opus', 'G.711u > G.722', 'Opus > G.722 > G.711u', 'G.711u Only'] },
          { key: 'registration_ttl', label: 'Registration TTL', type: 'text', placeholder: '3600s' },
          { key: 'did_number', label: 'DID / DDI Number', type: 'text', placeholder: '+60123456789' },
          { key: 'transport', label: 'Transport', type: 'select', options: ['UDP', 'TCP', 'TLS', 'Auto'] },
        ],
        defaultConfig: { sip_proxy: 'sip.trunk.cpaas.io', port: '5060', username: '', password: '', domain: 'sip.cpaas.io', codec_preference: 'G.722 > G.711u > Opus', registration_ttl: '3600s', did_number: '', transport: 'UDP' },
        lastSync: new Date(Date.now() - 0 * 60000).toISOString(), throughput: '1,000 concurrent calls'
      }
    ]
  },
  {
    id: 'payment-gateways',
    label: 'Payment Gateways',
    icon: Database,
    color: '#818cf8',
    description: 'Payment processing, recurring billing, and financial transaction gateways',
    integrations: [
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Global card payments, subscriptions, invoicing, and financial infrastructure.',
        status: 'disconnected',
        version: 'Stripe API v2024',
        features: ['Card payments (Visa/MC/Amex)', 'Recurring subscriptions', 'Webhooks', 'Refunds & disputes', 'Invoice generation', 'Multi-currency'],
        fields: [
          { key: 'publishable_key', label: 'Publishable Key', type: 'text', required: true, placeholder: 'pk_live_...' },
          { key: 'secret_key', label: 'Secret Key', type: 'password', required: true, placeholder: 'sk_live_...' },
          { key: 'webhook_secret', label: 'Webhook Signing Secret', type: 'password', placeholder: 'whsec_...' },
          { key: 'webhook_url', label: 'Webhook Endpoint URL', type: 'url', placeholder: 'https://yourapp.com/webhooks/stripe' },
          { key: 'currency', label: 'Default Currency', type: 'select', options: ['MYR', 'USD', 'SGD', 'EUR', 'GBP'] },
          { key: 'mode', label: 'Mode', type: 'select', options: ['Live', 'Test'] },
        ],
        defaultConfig: { publishable_key: '', secret_key: '', webhook_secret: '', webhook_url: '', currency: 'MYR', mode: 'Test' },
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'PayPal Checkout, PayPal Commerce Platform, and PayPal Subscriptions API.',
        status: 'disconnected',
        version: 'PayPal REST API v2',
        features: ['PayPal Checkout button', 'Credit/debit card vault', 'Subscriptions', 'Payouts', 'Invoicing', 'Fraud protection'],
        fields: [
          { key: 'client_id', label: 'Client ID', type: 'text', required: true, placeholder: 'AaBbCcDd...' },
          { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
          { key: 'webhook_id', label: 'Webhook ID', type: 'text', placeholder: 'WH-xxxx' },
          { key: 'webhook_url', label: 'Webhook URL', type: 'url', placeholder: 'https://yourapp.com/webhooks/paypal' },
          { key: 'currency', label: 'Currency', type: 'select', options: ['MYR', 'USD', 'SGD', 'EUR'] },
          { key: 'mode', label: 'Mode', type: 'select', options: ['Live', 'Sandbox'] },
        ],
        defaultConfig: { client_id: '', client_secret: '', webhook_id: '', webhook_url: '', currency: 'MYR', mode: 'Sandbox' },
      },
      {
        id: 'billplz',
        name: 'Billplz',
        description: 'Malaysian payment gateway with FPX online banking, credit cards, and direct debit.',
        status: 'disconnected',
        version: 'Billplz API v3',
        features: ['FPX online banking (MY)', 'Credit/debit card', 'Direct debit (CIMB, Maybank)', 'Bill & collection pages', 'Webhooks', 'Instant transfer'],
        fields: [
          { key: 'api_key', label: 'API Key', type: 'password', required: true, placeholder: 'Your Billplz API Key' },
          { key: 'collection_id', label: 'Collection ID', type: 'text', required: true, placeholder: 'Your Billplz Collection ID' },
          { key: 'x_signature_key', label: 'X-Signature Key', type: 'password', placeholder: 'For webhook verification' },
          { key: 'callback_url', label: 'Callback URL', type: 'url', placeholder: 'https://yourapp.com/payment/billplz/callback' },
          { key: 'redirect_url', label: 'Redirect URL', type: 'url', placeholder: 'https://yourapp.com/payment/success' },
          { key: 'mode', label: 'Mode', type: 'select', options: ['Production', 'Sandbox'] },
        ],
        defaultConfig: { api_key: '', collection_id: '', x_signature_key: '', callback_url: '', redirect_url: '', mode: 'Sandbox' },
      },
      {
        id: 'toyyibpay',
        name: 'toyyibPay',
        description: 'Malaysian payment gateway supporting FPX, credit/debit cards, and e-wallets.',
        status: 'disconnected',
        version: 'toyyibPay API v1',
        features: ['FPX (all MY banks)', 'Credit/debit card', 'E-wallets (Touch n Go, GrabPay)', 'Auto-refund', 'Webhook callbacks', 'Custom bill pages'],
        fields: [
          { key: 'user_secret_key', label: 'User Secret Key', type: 'password', required: true },
          { key: 'category_code', label: 'Category Code', type: 'text', required: true, placeholder: 'Your toyyibPay category code' },
          { key: 'callback_url', label: 'Callback URL', type: 'url', placeholder: 'https://yourapp.com/payment/toyyib/callback' },
          { key: 'return_url', label: 'Return URL', type: 'url', placeholder: 'https://yourapp.com/payment/result' },
          { key: 'mode', label: 'Mode', type: 'select', options: ['Production', 'Development'] },
        ],
        defaultConfig: { user_secret_key: '', category_code: '', callback_url: '', return_url: '', mode: 'Development' },
      },
      {
        id: 'ipay88',
        name: 'iPay88',
        description: 'Malaysian payment gateway with FPX, credit/debit cards, and regional payment methods across SEA.',
        status: 'disconnected',
        version: 'iPay88 API v2',
        features: ['FPX online banking', 'Visa / Mastercard', 'AmexCard', 'E-wallets', 'Recurring billing', 'SEA multi-currency'],
        fields: [
          { key: 'merchant_code', label: 'Merchant Code', type: 'text', required: true, placeholder: 'iPayXXXXXX' },
          { key: 'merchant_key', label: 'Merchant Key', type: 'password', required: true },
          { key: 'response_url', label: 'Response URL', type: 'url', placeholder: 'https://yourapp.com/payment/ipay88/response' },
          { key: 'backend_url', label: 'Backend URL', type: 'url', placeholder: 'https://yourapp.com/payment/ipay88/backend' },
          { key: 'currency', label: 'Currency', type: 'select', options: ['MYR', 'USD', 'SGD', 'THB', 'IDR'] },
          { key: 'mode', label: 'Environment', type: 'select', options: ['Production', 'Staging'] },
        ],
        defaultConfig: { merchant_code: '', merchant_key: '', response_url: '', backend_url: '', currency: 'MYR', mode: 'Staging' },
      },
      {
        id: 'adyen',
        name: 'Adyen',
        description: 'Enterprise payment platform used by global businesses for card acquiring and alternative payment methods.',
        status: 'disconnected',
        version: 'Adyen API v69',
        features: ['Card acquiring (global)', 'Alternative payment methods', 'Tokenization & vaulting', 'Fraud & risk management', '3DS2 authentication', 'POS + eCommerce'],
        fields: [
          { key: 'api_key', label: 'API Key', type: 'password', required: true, placeholder: 'AQE...xxx' },
          { key: 'merchant_account', label: 'Merchant Account', type: 'text', required: true, placeholder: 'YourCompanyECOM' },
          { key: 'client_key', label: 'Client Key (Drop-in)', type: 'text', placeholder: 'test_XXXXXXXXX or live_XXXXXXXXX' },
          { key: 'webhook_hmac', label: 'Webhook HMAC Key', type: 'password', placeholder: 'For notification validation' },
          { key: 'webhook_url', label: 'Webhook URL', type: 'url', placeholder: 'https://yourapp.com/webhooks/adyen' },
          { key: 'environment', label: 'Environment', type: 'select', options: ['Live (EU)', 'Live (US)', 'Live (AU)', 'Test'] },
          { key: 'currency', label: 'Default Currency', type: 'select', options: ['MYR', 'USD', 'EUR', 'GBP', 'SGD'] },
        ],
        defaultConfig: { api_key: '', merchant_account: '', client_key: '', webhook_hmac: '', webhook_url: '', environment: 'Test', currency: 'MYR' },
      }
    ]
  }
];

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const STORAGE_KEY = 'cpaas_integration_configs';

function loadConfigs(): Record<string, Record<string, string>> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveConfigs(configs: Record<string, Record<string, string>>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

const statusConfig: Record<IntegrationStatus, { label: string; color: string; dot: string }> = {
  connected:    { label: 'Connected',    color: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30',   dot: 'bg-[#39FF14]' },
  disconnected: { label: 'Disconnected', color: 'bg-slate-500/15 text-slate-400 border-slate-500/30',   dot: 'bg-slate-400' },
  error:        { label: 'Error',        color: 'bg-red-500/15 text-red-400 border-red-500/30',         dot: 'bg-red-400' },
  pending:      { label: 'Pending',      color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',   dot: 'bg-amber-400' },
  testing:      { label: 'Testing…',    color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',      dot: 'bg-cyan-400 animate-pulse' },
};

// ------------------------------------------------------------------
// Edit Modal
// ------------------------------------------------------------------
type TestLog = { ts: string; msg: string; ok: boolean };

function EditModal({
  item, config, onSave, onClose
}: {
  item: IntegrationItem;
  config: Record<string, string>;
  onSave: (id: string, newConfig: Record<string, string>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Record<string, string>>({ ...config });
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; details?: string; latency?: number } | null>(null);
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [saved, setSaved] = useState(false);

  const addLog = (msg: string, ok: boolean) =>
    setLogs(prev => [{ ts: new Date().toLocaleTimeString(), msg, ok }, ...prev]);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    addLog(`Testing ${item.name}…`, true);

    try {
      const res = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId: item.id, integrationName: item.name, config: form })
      });
      const data = await res.json();
      setTestResult(data);
      addLog(
        data.success
          ? `✓ Connected — ${data.details || 'OK'} (${data.latency}ms)`
          : `✗ Failed — ${data.details || data.error}`,
        data.success
      );
    } catch (err: any) {
      setTestResult({ success: false, details: err.message });
      addLog(`✗ Network error — ${err.message}`, false);
    }
    setTesting(false);
  };

  const handleSave = () => {
    onSave(item.id, form);
    setSaved(true);
    addLog('✓ Configuration saved', true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isValid = item.fields
    .filter(f => f.required)
    .every(f => (form[f.key] || '').trim().length > 0);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#011a12] border border-[#024d30] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/60"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#024d30]">
          <div>
            <h2 className="text-white font-black text-lg tracking-tight">Configure {item.name}</h2>
            <p className="text-slate-500 text-xs">{item.version}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#024d30] rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {item.fields.map(field => (
              <div key={field.key} className={field.type === 'url' || (field.key === 'signaling' || field.key === 'base_url' || field.key === 'bss_endpoint' || field.key === 'oss_endpoint' || field.key === 'rcs_gateway') ? 'col-span-2' : ''}>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {field.label}
                  {field.required && <span className="text-[#39FF14] ml-1">*</span>}
                </label>

                {field.type === 'select' ? (
                  <select
                    value={form[field.key] || ''}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-all"
                  >
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type={field.type === 'password' && !reveal[field.key] ? 'password' : field.type === 'number' ? 'number' : 'text'}
                      value={form[field.key] || ''}
                      onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-all font-mono pr-9"
                    />
                    {field.type === 'password' && (
                      <button
                        type="button"
                        onClick={() => setReveal(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#39FF14] transition-colors"
                      >
                        {reveal[field.key] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                )}
                {field.hint && <p className="text-slate-600 text-[10px] mt-1">{field.hint}</p>}
              </div>
            ))}
          </div>

          {/* Test Console */}
          {(logs.length > 0 || testResult !== null) && (
            <div className="bg-black/60 border border-[#024d30]/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-3.5 h-3.5 text-[#39FF14]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Connection Log</span>
              </div>
              {testResult !== null && (
                <div className={`flex items-start gap-3 p-3 rounded-xl ${
                  testResult.success ? 'bg-[#39FF14]/10 border border-[#39FF14]/20' : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  {testResult.success
                    ? <CheckCircle className="w-4 h-4 text-[#39FF14] shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest ${testResult.success ? 'text-[#39FF14]' : 'text-red-400'}`}>
                      {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                      {testResult.latency !== undefined && ` · ${testResult.latency}ms`}
                    </p>
                    {testResult.details && <p className="text-slate-300 text-xs mt-1">{testResult.details}</p>}
                  </div>
                </div>
              )}
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {logs.map((l, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] font-mono">
                    <span className="text-slate-600 shrink-0">{l.ts}</span>
                    <span className={l.ok ? 'text-slate-300' : 'text-red-400'}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#024d30]">
          <button
            onClick={handleTest}
            disabled={testing || !isValid}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#024d30]/60 hover:bg-[#024d30] border border-[#024d30] text-slate-300 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-40"
          >
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
            {testing ? 'Testing…' : 'Test Connection'}
          </button>

          <div className="ml-auto flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2.5 text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-40 ${
                saved
                  ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30'
                  : 'bg-[#39FF14] hover:bg-[#32e012] text-black'
              }`}
            >
              {saved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? 'Saved!' : 'Save Config'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Integration Card
// ------------------------------------------------------------------
function IntegrationCard({
  item, onEdit
}: {
  item: IntegrationItem;
  onEdit: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const st = statusConfig[item.status];

  return (
    <div className={`bg-[#012419]/60 border rounded-2xl overflow-hidden transition-all ${expanded ? 'border-[#39FF14]/30' : 'border-[#024d30] hover:border-[#39FF14]/20'}`}>
      <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${st.dot}`} />
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${st.color}`}>
              {st.label}
            </span>
          </div>
          <div>
            <h4 className="text-white font-bold text-base">{item.name}</h4>
            <p className="text-slate-500 text-xs">{item.version}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {item.throughput && <span className="text-[10px] font-bold text-slate-400 bg-[#024d30]/40 px-2 py-1 rounded-lg">{item.throughput}</span>}
          {item.lastSync && <span className="text-[10px] text-slate-500 hidden md:block">Synced {new Date(item.lastSync).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
          <button
            onClick={e => { e.stopPropagation(); onEdit(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#39FF14]/10 hover:bg-[#39FF14] text-[#39FF14] hover:text-black border border-[#39FF14]/20 hover:border-[#39FF14] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Settings className="w-3 h-3" /> Edit
          </button>
          {expanded ? <ChevronDown className="w-4 h-4 text-[#39FF14]" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-[#024d30]/50 pt-5 space-y-4">
          <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 flex items-center gap-2">
              <Zap className="w-3 h-3 text-[#39FF14]" /> Features & Capabilities
            </h5>
            <div className="flex flex-wrap gap-2">
              {item.features.map((f, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-[#024d30]/40 border border-[#024d30] rounded-full text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-[#39FF14] shrink-0" /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Add Integration Modal (gateway / type picker)
// ------------------------------------------------------------------
const ADD_CATALOG: { id: string; name: string; category: string; icon: string; description: string }[] = [
  { id: 'stripe', name: 'Stripe', category: 'payment-gateways', icon: '💳', description: 'Global card payments & subscriptions' },
  { id: 'paypal', name: 'PayPal', category: 'payment-gateways', icon: '🅿️', description: 'PayPal Checkout & Commerce Platform' },
  { id: 'billplz', name: 'Billplz', category: 'payment-gateways', icon: '🇲🇾', description: 'Malaysian FPX + card gateway' },
  { id: 'toyyibpay', name: 'toyyibPay', category: 'payment-gateways', icon: '💰', description: 'FPX, cards & e-wallets (MY)' },
  { id: 'ipay88', name: 'iPay88', category: 'payment-gateways', icon: '💵', description: 'SEA multi-currency gateway' },
  { id: 'adyen', name: 'Adyen', category: 'payment-gateways', icon: '🌐', description: 'Enterprise global acquiring' },
  { id: 'smpp', name: 'SMPP', category: 'messaging-protocols', icon: '📡', description: 'High-throughput SMS carrier relay' },
  { id: 'smtp', name: 'SMTP', category: 'messaging-protocols', icon: '✉️', description: 'Email relay server' },
  { id: 'ldap', name: 'LDAP / AD', category: 'directory-auth', icon: '🔒', description: 'Enterprise directory & SSO' },
  { id: 'rest-api', name: 'REST API', category: 'api-integrations', icon: '🔗', description: 'Generic REST / HTTP connector' },
  { id: 'graph-api', name: 'Graph API', category: 'api-integrations', icon: '📊', description: 'MS + Meta Graph API' },
  { id: 'postman', name: 'Postman', category: 'api-integrations', icon: '🧪', description: 'API testing & CI/CD' },
  { id: 'general-api', name: 'API Gateway', category: 'api-integrations', icon: '⚙️', description: 'Kong API gateway' },
  { id: 'bss', name: 'BSS', category: 'bss-oss', icon: '📋', description: 'Billing support system' },
  { id: 'oss', name: 'OSS', category: 'bss-oss', icon: '🖧', description: 'Network ops support system' },
  { id: 'sms-gateway', name: 'SMS Gateway', category: 'gateways', icon: '💬', description: 'Carrier SMS aggregator' },
  { id: 'rcs-gateway', name: 'RCS Gateway', category: 'gateways', icon: '📲', description: 'Rich communication services' },
  { id: 'webrtc-gateway', name: 'WebRTC', category: 'gateways', icon: '🎥', description: 'Real-time audio/video' },
  { id: 'sip-gateway', name: 'SIP / Trunk', category: 'gateways', icon: '📞', description: 'Carrier SIP trunking' },
];

const categoryLabels: Record<string, string> = {
  'payment-gateways': '💳 Payment Gateways',
  'messaging-protocols': '📡 Messaging Protocols',
  'directory-auth': '🔒 Directory & Auth',
  'api-integrations': '🔗 API & Web Services',
  'bss-oss': '📋 BSS / OSS',
  'gateways': '🌐 Communication Gateways',
};

function AddIntegrationModal({
  onSelect, onClose
}: {
  onSelect: (id: string, categoryId: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = ADD_CATALOG.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const grouped = Object.entries(categoryLabels).reduce<Record<string, typeof ADD_CATALOG>>((acc, [key]) => {
    const items = filtered.filter(i => i.category === key);
    if (items.length) acc[key] = items;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#011a12] border border-[#024d30] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#024d30]">
          <div>
            <h2 className="text-white font-black text-lg">Add Integration</h2>
            <p className="text-slate-500 text-xs">Choose a gateway or protocol to configure</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#024d30] rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="px-6 pt-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search integrations…"
              className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all pl-9"
            />
            <Info className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', ...Object.keys(categoryLabels)]).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat ? 'bg-[#39FF14] text-black' : 'bg-[#024d30]/40 text-slate-400 border border-[#024d30]'
                }`}
              >
                {cat === 'all' ? 'All' : categoryLabels[cat].split(' ').slice(1).join(' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
          {Object.entries(grouped).map(([catId, items]) => (
            <div key={catId}>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{categoryLabels[catId]}</p>
              <div className="grid grid-cols-2 gap-2">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.id, item.category)}
                    className="flex items-center gap-3 p-4 bg-[#012419]/80 border border-[#024d30] hover:border-[#39FF14]/40 hover:bg-[#024d30]/40 rounded-xl text-left transition-all group"
                  >
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-white font-bold text-sm group-hover:text-[#39FF14] transition-colors">{item.name}</p>
                      <p className="text-slate-500 text-[10px] leading-snug">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500 text-sm">No integrations match your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
export default function IntegrationsManagement() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(integrationSchema.map(c => c.id))
  );
  const [activeFilter, setActiveFilter] = useState<'all' | IntegrationStatus>('all');
  const [editingItem, setEditingItem] = useState<IntegrationItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [configs, setConfigs] = useState<Record<string, Record<string, string>>>({});
  const [categories, setCategories] = useState<IntegrationCategory[]>(integrationSchema);

  // Load persisted configs from localStorage on mount
  useEffect(() => {
    const stored = loadConfigs();
    setConfigs(stored);
  }, []);

  const handleSave = useCallback((id: string, newConfig: Record<string, string>) => {
    const updated = { ...configs, [id]: newConfig };
    setConfigs(updated);
    saveConfigs(updated);
    setCategories(prev => prev.map(cat => ({
      ...cat,
      integrations: cat.integrations.map(intg =>
        intg.id === id
          ? { ...intg, status: 'connected' as IntegrationStatus, lastSync: new Date().toISOString() }
          : intg
      )
    })));
  }, [configs]);

  // When user picks an item from Add modal, find it in the schema and open its edit form
  const handleAddSelect = useCallback((itemId: string, categoryId: string) => {
    setShowAddModal(false);
    // Find the integration in any category
    for (const cat of integrationSchema) {
      const found = cat.integrations.find(i => i.id === itemId);
      if (found) {
        // Ensure it's visible in categories state (mark as pending if not yet configured)
        setCategories(prev => {
          // Check if already present
          const exists = prev.some(c => c.integrations.some(i => i.id === itemId));
          if (exists) return prev;
          return prev.map(c =>
            c.id === categoryId
              ? { ...c, integrations: [...c.integrations, { ...found, status: 'pending' as IntegrationStatus }] }
              : c
          );
        });
        // Expand that category
        setExpandedCategories(prev => new Set([...prev, categoryId]));
        // Open its edit modal immediately
        setEditingItem(found);
        return;
      }
    }
  }, []);

  const getConfig = (item: IntegrationItem) => ({
    ...item.defaultConfig,
    ...(configs[item.id] || {})
  });

  const toggleCategory = (id: string) => setExpandedCategories(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const totalConnected = categories.reduce((s, c) => s + c.integrations.filter(i => i.status === 'connected').length, 0);
  const totalIntegrations = categories.reduce((s, c) => s + c.integrations.length, 0);
  const totalErrors = categories.reduce((s, c) => s + c.integrations.filter(i => i.status === 'error').length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Integrations</h2>
          <p className="text-slate-400 text-sm">Configure and manage protocol connectors, gateways, and third-party systems</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#39FF14]/10"
        >
          <Plus className="w-4 h-4" /> Add Integration
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: totalIntegrations, color: '#39FF14', icon: Network },
          { label: 'Connected', value: totalConnected, color: '#39FF14', icon: CheckCircle },
          { label: 'Categories', value: categories.length, color: '#22d3ee', icon: Database },
          { label: 'Errors', value: totalErrors, color: totalErrors > 0 ? '#f87171' : '#39FF14', icon: AlertCircle },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#012419]/60 border border-[#024d30] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-[#024d30]/60 rounded-xl">
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className="text-3xl font-black text-white">{stat.value}</span>
              </div>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter + info bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'connected', 'disconnected', 'error'] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeFilter === f ? 'bg-[#39FF14] text-black' : 'bg-[#024d30]/40 text-slate-400 hover:text-white border border-[#024d30]'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" /> Click <strong className="text-slate-400">Edit</strong> to configure and test any integration
        </span>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {categories.map(category => {
          const Icon = category.icon;
          const isExpanded = expandedCategories.has(category.id);
          const filtered = activeFilter === 'all'
            ? category.integrations
            : category.integrations.filter(i => i.status === activeFilter);

          if (filtered.length === 0) return null;

          return (
            <div key={category.id} className="space-y-3">
              <button className="w-full flex items-center justify-between group" onClick={() => toggleCategory(category.id)}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: `${category.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: category.color }} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-black text-sm tracking-tight">{category.label}</h3>
                    <p className="text-slate-500 text-xs">{category.description}</p>
                  </div>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#024d30]/60 text-slate-400">{filtered.length}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="text-[10px] uppercase tracking-widest font-bold">{filtered.filter(i => i.status === 'connected').length}/{filtered.length} Connected</span>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="space-y-3 pl-4 border-l-2 border-[#024d30]/60">
                  {filtered.map(item => (
                    <IntegrationCard
                      key={item.id}
                      item={item}
                      onEdit={() => setEditingItem(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditModal
          item={editingItem}
          config={getConfig(editingItem)}
          onSave={handleSave}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <AddIntegrationModal
          onSelect={handleAddSelect}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
