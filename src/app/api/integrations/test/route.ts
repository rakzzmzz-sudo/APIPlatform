import { NextRequest, NextResponse } from 'next/server';
import net from 'net';

type TestResult = {
  success: boolean;
  latency?: number;
  error?: string;
  details?: string;
};

// TCP socket connectivity test — used for SMPP, SMTP, LDAP, SIP, etc.
async function testTcpConnection(host: string, port: number, timeoutMs = 5000): Promise<TestResult> {
  const start = Date.now();
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeoutMs);

    socket.connect(port, host, () => {
      const latency = Date.now() - start;
      socket.destroy();
      resolve({ success: true, latency, details: `TCP connection to ${host}:${port} succeeded` });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ success: false, error: `Connection timed out after ${timeoutMs}ms`, latency: Date.now() - start });
    });

    socket.on('error', (err) => {
      socket.destroy();
      resolve({ success: false, error: err.message, latency: Date.now() - start });
    });
  });
}

// HTTP/HTTPS reachability test — used for REST, API, Graph, Postman, BSS, OSS, WebRTC signaling
async function testHttpConnection(url: string, timeoutMs = 8000): Promise<TestResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': 'CPaaS-Platform/1.0 IntegrationTest' }
    });
    clearTimeout(timer);
    const latency = Date.now() - start;
    return {
      success: response.status < 500,
      latency,
      details: `HTTP ${response.status} from ${url}`
    };
  } catch (err: any) {
    clearTimeout(timer);
    const latency = Date.now() - start;
    if (err.name === 'AbortError') {
      return { success: false, latency, error: `Request timed out after ${timeoutMs}ms` };
    }
    // DNS failure, ECONNREFUSED etc — treat ECONNREFUSED as "host reachable, port refused"
    if (err.cause?.code === 'ECONNREFUSED') {
      return { success: false, latency, error: `Connection refused — host reachable but port rejected` };
    }
    return { success: false, latency, error: err.message || 'Unknown network error' };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { integrationId, integrationName, config } = body as {
      integrationId: string;
      integrationName: string;
      config: Record<string, string>;
    };

    if (!integrationId || !config) {
      return NextResponse.json({ success: false, error: 'Missing integrationId or config' }, { status: 400 });
    }

    let result: TestResult;

    // Route to correct test method based on integration type
    switch (integrationId) {
      // TCP-based protocols
      case 'smpp':
      case 'sms-gateway': {
        const host = config.host || 'smpp.carrier.cpaas.io';
        const port = parseInt(config.port || '2775', 10);
        result = await testTcpConnection(host, port);
        result.details = result.success
          ? `SMPP TCP socket open on ${host}:${port}. Login will require system_id + password authentication.`
          : result.error;
        break;
      }

      case 'smtp': {
        const host = config.host || 'smtp.relay.cpaas.io';
        const port = parseInt(config.port || '587', 10);
        result = await testTcpConnection(host, port);
        result.details = result.success
          ? `SMTP server reachable on ${host}:${port}. STARTTLS and AUTH will be negotiated on connect.`
          : result.error;
        break;
      }

      case 'ldap': {
        const host = config.host || 'ldap.corp.cpaas.io';
        const port = parseInt(config.port || '636', 10);
        result = await testTcpConnection(host, port);
        result.details = result.success
          ? `LDAP server reachable on ${host}:${port}. Bind DN credentials will be used for authentication.`
          : result.error;
        break;
      }

      case 'sip-gateway': {
        const proxyParts = (config.sip_proxy || 'sip.trunk.cpaas.io').split(':');
        const host = proxyParts[0];
        const port = parseInt(config.port || '5060', 10);
        result = await testTcpConnection(host, port);
        result.details = result.success
          ? `SIP proxy reachable on ${host}:${port}. Registration with SIP credentials will be attempted on connect.`
          : result.error;
        break;
      }

      case 'rcs-gateway': {
        const gatewayUrl = config.rcs_gateway || 'https://rcs-gw.carrier.cpaas.io';
        result = await testHttpConnection(gatewayUrl);
        result.details = result.success
          ? `RCS Gateway HTTP endpoint ${gatewayUrl} is reachable. Use your API key for authenticated requests.`
          : result.error;
        break;
      }

      // HTTP/HTTPS-based integrations
      case 'rest-api':
      case 'general-api': {
        const baseUrl = config.base_url || config.host || 'https://api.platform.cpaas.io/v3';
        const url = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
        result = await testHttpConnection(url);
        result.details = result.success
          ? `REST API endpoint ${url} is reachable. OAuth 2.0 token will be acquired from ${config.token_url || 'token endpoint'}.`
          : result.error;
        break;
      }

      case 'graph-api': {
        // Test both MS Graph and Meta endpoints
        const msGraphResult = await testHttpConnection('https://graph.microsoft.com');
        const metaResult = await testHttpConnection('https://graph.facebook.com');
        const bothOk = msGraphResult.success && metaResult.success;
        result = {
          success: bothOk || msGraphResult.success || metaResult.success,
          latency: Math.max(msGraphResult.latency || 0, metaResult.latency || 0),
          details: `MS Graph: ${msGraphResult.success ? '✓ reachable' : '✗ ' + msGraphResult.error} | Meta Graph: ${metaResult.success ? '✓ reachable' : '✗ ' + metaResult.error}`
        };
        break;
      }

      case 'postman': {
        const postmanResult = await testHttpConnection('https://api.getpostman.com');
        result = {
          ...postmanResult,
          details: postmanResult.success
            ? `Postman API (api.getpostman.com) is reachable. Your PMAK API key will be validated on actual API calls.`
            : postmanResult.error
        };
        break;
      }

      case 'webrtc-gateway': {
        const signalingUrl = (config.signaling || 'wss://webrtc.media.cpaas.io/signal')
          .replace('wss://', 'https://')
          .replace('ws://', 'http://');
        result = await testHttpConnection(signalingUrl);
        result.details = result.success
          ? `WebRTC signaling server reachable. STUN/TURN will be tested during ICE negotiation.`
          : result.error;
        break;
      }

      case 'bss': {
        const bssUrl = config.bss_endpoint || 'https://bss.core.cpaas.io/api/v2';
        result = await testHttpConnection(bssUrl);
        result.details = result.success
          ? `BSS endpoint ${bssUrl} is reachable. CDR mediation and billing API will authenticate via API key.`
          : result.error;
        break;
      }

      case 'oss': {
        const ossUrl = config.oss_endpoint || 'https://oss.infra.cpaas.io/api/v1';
        result = await testHttpConnection(ossUrl);
        result.details = result.success
          ? `OSS endpoint ${ossUrl} is reachable. NETCONF/YANG and SNMP channels will open on service subscription.`
          : result.error;
        break;
      }

      default: {
        // Generic — try HTTP if it looks like a URL, otherwise TCP
        const hostOrUrl = config.host || config.base_url || config.url || '';
        if (hostOrUrl.startsWith('http')) {
          result = await testHttpConnection(hostOrUrl);
        } else if (hostOrUrl && config.port) {
          result = await testTcpConnection(hostOrUrl, parseInt(config.port, 10));
        } else {
          result = { success: false, error: 'No host or URL configured to test against.' };
        }
        break;
      }
    }

    return NextResponse.json({
      success: result.success,
      latency: result.latency,
      details: result.details || result.error,
      tested_at: new Date().toISOString(),
      integration: integrationName
    });

  } catch (err: any) {
    console.error('[IntegrationTest] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}
