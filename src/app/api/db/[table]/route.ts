import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(
  request: Request,
  { params }: { params: Promise<{ table: string }> } // Params is a promise in newer Next.js versions
) {
  try {
    const { table } = await params;
    const body = await request.json();
    const { operation, filters, data, orderBy, limit, single } = body;

    console.log(`API DB Request: ${table} ${operation}`, { filters, orderBy });

    // Map table name to Prisma model name
    // e.g. "customers" -> "customer", "customer_health_scores" -> "customerHealthScore"
    const modelName = mapTableToModel(table);
    
    let model = (prisma as any)[modelName];
    
    if (!model) {
      const fs = require('fs');
      const timestamp = new Date().toISOString();
      const availableModels = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
      
      try {
        const clientPath = require.resolve('@prisma/client');
        fs.appendFileSync('prisma_debug.log', `${timestamp} - API Match Fail! Table: ${table}, Model: ${modelName}. Client: ${clientPath}. Available: ${availableModels.length} models.\n`);
      } catch (e) {}

      console.error(`Table ${table} (model ${modelName}) not found in shared Prisma instance. Attempting fresh instantiation...`);
      // Try to create a one-off client as a last resort
      try {
        const { PrismaClient } = require('@prisma/client');
        const freshPrisma = new PrismaClient();
        if ((freshPrisma as any)[modelName]) {
          console.log(`Found ${modelName} in fresh Prisma instance. Using it for this request.`);
          model = (freshPrisma as any)[modelName];
        } else {
           const available = Object.keys(freshPrisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
           console.error(`Model ${modelName} STILL NOT FOUND in fresh instance. Available: ${available.join(', ')}`);
           try {
             fs.appendFileSync('prisma_debug.log', `${timestamp} - Fresh Instance FAIL! Model: ${modelName}. Available: ${available.join(', ')}\n`);
           } catch (e) {}
        }
      } catch (e: any) {
        console.error(`Failed to create fresh Prisma instance: ${e.message}`);
      }
    }

    if (!model) {
       // FALLBACK: If model is missing (stale client), try raw SQL for known tables
       // This handles the correct table names directly from the DB
       const validFallbackTables = ['products', 'product_tiers', 'cart_items', 'payment_methods', 'transactions', 'api_marketplace_keys', 'orders', 'user_subscriptions', 'user_offers', 'product_documentation'];
       if (validFallbackTables.includes(table)) {
         console.warn(`Model ${modelName} not found. Attempting raw SQL fallback for table ${table}.`);
         try {
            let result;
            
            if (operation === 'insert') {
                const crypto = require('crypto');
                const insertData = Array.isArray(data) ? data : [data];
                
                // We assume all items have same keys if array
                // For cart_items, we need to ensure ID is generated
                const keys = Object.keys(insertData[0]);
                if (!keys.includes('id')) {
                    keys.unshift('id');
                }
                // Also ensure timestamps
                if (!keys.includes('created_at')) keys.push('created_at');
                if (!keys.includes('updated_at')) keys.push('updated_at');
                if (!keys.includes('status') && table === 'cart_items') keys.push('status');

                const columns = keys.map(k => `"${k}"`).join(', ');
                const values: string[] = [];
                const flatParams: any[] = [];
                
                for (const item of insertData) {
                    // Fill defaults
                    if (!item.id) item.id = crypto.randomUUID();
                    if (!item.created_at) item.created_at = new Date().toISOString();
                    if (!item.updated_at) item.updated_at = new Date().toISOString();
                    if (!item.status && table === 'cart_items') item.status = 'active';
                    
                    const placeholders: string[] = [];
                    keys.forEach(k => {
                        placeholders.push(`$${flatParams.length + 1}`);
                        let val = item[k];
                        // Handle objects/arrays for text columns (sqlite)
                        if (typeof val === 'object' && val !== null && !(val instanceof Date)) {
                            val = JSON.stringify(val);
                        }
                        flatParams.push(val);
                    });
                    values.push(`(${placeholders.join(', ')})`);
                }

                const query = `INSERT INTO "${table}" (${columns}) VALUES ${values.join(', ')}`;
                console.log(`Executing Raw SQL INSERT Fallback: ${query}`, flatParams);
                await prisma.$executeRawUnsafe(query, ...flatParams);
                
                // Return input data as result (mocking Prisma's return)
                result = Array.isArray(data) ? insertData : insertData[0];
            
            } else {
                // SELECT Fallback
                let query = `SELECT * FROM "${table}"`;
                const params: any[] = [];
                
                // 1. WHERE clause
                if (filters && filters.length > 0) {
                  const conditions: string[] = [];
                  filters.forEach((f: any) => {
                    if (f.operator === 'eq') {
                       conditions.push(`"${f.column}" = $${params.length + 1}`);
                       params.push(f.value);
                    } 
                  });
                  
                  if (conditions.length > 0) {
                    query += ` WHERE ${conditions.join(' AND ')}`;
                  }
                }
                
                // 2. ORDER BY
                if (orderBy) {
                   const entries = Object.entries(orderBy);
                   if (entries.length > 0) {
                     const [col, dir] = entries[0];
                     const direction = String(dir).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
                     query += ` ORDER BY "${col}" ${direction}`;
                   }
                }
                
                // 3. LIMIT
                if (limit) {
                   query += ` LIMIT ${parseInt(String(limit))}`;
                }
                
                console.log(`Executing Raw SQL SELECT Fallback: ${query}`, params);
                result = await prisma.$queryRawUnsafe(query, ...params);
            }
            
            return NextResponse.json({ data: result, error: null });
            
         } catch (rawError: any) {
            console.error('Raw SQL Fallback Failed:', rawError);
            return NextResponse.json({ 
                error: `Table ${table} (model ${modelName}) not found and raw fallback failed: ${rawError.message}` 
            }, { status: 500 });
         }
       }
    
      return NextResponse.json({ 
        error: `Table ${table} (model ${modelName}) not found` 
      }, { status: 400 });
    }

    let result;

    if (operation === 'select') {
      const queryOptions: any = {
        where: buildWhereClause(filters),
      };

      if (orderBy) {
        queryOptions.orderBy = orderBy;
      }
      
      if (limit) {
        queryOptions.take = parseInt(limit);
      }

      if (single) {
        result = await model.findFirst(queryOptions);
      } else {
        result = await model.findMany(queryOptions);
      }
    } else if (operation === 'insert') {
      try {
        result = Array.isArray(data) 
          ? await model.createMany({ data: data })
          : await model.create({ data: data });
        return NextResponse.json({ data: result, error: null });
      } catch (err: any) {
        console.error(`Prisma INSERT Error on table ${table}:`, err);
        // Fallback for missing model or DB sync issue
        return NextResponse.json({ data: null, error: { message: err.message, code: err.code } }, { status: 500 });
      }
    } else if (operation === 'update') {
      result = await model.updateMany({
        where: buildWhereClause(filters),
        data: data
      });
    } else if (operation === 'delete') {
      result = await model.deleteMany({
        where: buildWhereClause(filters)
      });
    } else {
      return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    // Supabase response format: { data: result, error: null }
    return NextResponse.json({ data: result, error: null });

  } catch (error: any) {
    console.error('Database API Error:', error);
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 500 });
  }
}

function mapTableToModel(tableName: string): string {
  // Simple mapping strategy: singularize and camelCase
  // or explicit mapping
  const mapping: Record<string, string> = {
    'users': 'user',
    'customers': 'customer',
    'industries': 'industry',
    'customer_segments': 'customerSegment',
    'customer_health_scores': 'customerHealthScore',
    'customer_interactions': 'customerInteraction',
    'customer_support_tickets': 'customerSupportTicket',
    'customer_activities': 'customerActivity',
    'customer_notes': 'customerNote',
    'customer_revenue_metrics': 'customerRevenueMetric',
    // Platform models
    'platforms': 'platform',
    'campaigns': 'campaign',
    'notifications': 'notification',
    // Project management models
    'pm_projects': 'pmProject',
    'pm_issues': 'pmIssue',
    'pm_issue_types': 'pmIssueType',
    'pm_issue_statuses': 'pmIssueStatus',
    'pm_issue_priorities': 'pmIssuePriority',
    'pm_sprints': 'pmSprint',
    // SMS models
    'sms_campaigns': 'smsCampaign',
    'sms_templates': 'smsTemplate',
    'sms_configurations': 'smsConfiguration',
    'sms_messages': 'smsMessage',
    // RCS models
    'rcs_campaigns': 'rcsCampaign',
    'rcs_templates': 'rcsTemplate',
    'rcs_messages': 'rcsMessage',
    // Auth & Access models
    'profiles': 'user', // Maps Supabase 'profiles' to Prisma 'User'
    'menu_access_control': 'menuAccessControl',
    // WhatsApp models
    'whatsapp_campaigns': 'whatsAppCampaign',
    'whatsapp_messages': 'whatsAppMessage',
    'whatsapp_templates': 'whatsAppTemplate',
    'tenant_whatsapp_configs': 'whatsAppConfig',
    'tenant_whatsapp_numbers': 'whatsAppNumber',
    'rcs_aggregator_configurations': 'rcsAggregatorConfiguration',
    'sample_whatsapp_configs': 'sampleWhatsAppConfig',
    'sample_whatsapp_numbers': 'sampleWhatsAppNumber',
    // Chatbot models
    'cb_bots': 'cbBot',
    'cb_ml_configs': 'cbMLConfig',
    'cb_intents': 'cbIntent',
    'cb_entities': 'cbEntity',
    'cb_conversations': 'cbConversation',
    'cb_messages': 'cbMessage',
    'cb_knowledge_base': 'cbKnowledgeBase',
    'cb_integrations': 'cbIntegration',
    // Video API models
    'video_api_products': 'videoApiProduct',
    'video_api_purchases': 'videoApiPurchase',
    'video_templates': 'videoTemplate',
    'meeting_ai_configurations': 'meetingAIConfiguration',
    'video_api_capabilities': 'videoApiCapability',
    'video_recordings': 'videoRecording',
    'recording_analytics': 'recordingAnalytics',
    'video_recording_configs': 'videoRecordingConfig',
    'cloud_storage_configs': 'cloudStorageConfig',
    'network_quality_metrics': 'networkQualityMetric',
    'video_room_participants': 'videoCallParticipant',
    'adaptive_bitrate_configs': 'adaptiveBitrateConfig',
    'simulcast_configs': 'simulcastConfig',
    'background_processing_configs': 'backgroundProcessingConfig',
    'virtual_backgrounds': 'virtualBackground',
    'noise_cancellation_configs': 'noiseCancellationConfig',
    'transcription_configs': 'transcriptionConfig',
    'rtmp_broadcast_configs': 'rtmpBroadcastConfig',
    'hls_streaming_configs': 'hlsStreamingConfig',
    'broadcast_sessions': 'broadcastSession',
    'ai_processing_analytics': 'aiProcessingAnalytics',
    'meetings': 'meeting',
     'meeting_ai_configuration_links': 'meetingAIConfigurationLink',
    'meeting_participants': 'meetingParticipant',
    'meeting_transcripts': 'meetingTranscript',
    'meeting_action_items': 'meetingActionItem',
    'meeting_summaries': 'meetingSummary',
    'meeting_analytics': 'meetingAnalytics',
    'meeting_ai_insights': 'meetingAIInsight',
    'video_rooms': 'videoRoom',
    'video_room_signals': 'videoRoomSignal',
    'cart_items': 'cartItem',
    // Email models
    'email_campaigns': 'emailCampaign',
    'email_templates': 'emailTemplate',
    'email_contact_lists': 'emailContactList',
    'email_contacts': 'emailContact',
    'email_contact_list_members': 'emailContactListMember',
    'email_automation_sequences': 'emailAutomationSequence',
    'email_provider_configs': 'emailProviderConfig',
    'email_campaign_analytics': 'emailCampaignAnalytics',
    'email_sending_quotas': 'emailSendingQuota',
    'email_campaign_recipients': 'emailCampaignRecipient',
    // Product Catalog models
    'products': 'product',
    'product_tiers': 'productTier',
    'payment_methods': 'paymentMethod',
    'transactions': 'transaction',
    'api_marketplace_keys': 'apiMarketplaceKey',
    'orders': 'order',
    'user_subscriptions': 'userSubscription',
    'user_offers': 'userOffer',
    'product_documentation': 'productDocumentation'
  };
  
  return mapping[tableName] || tableName;
}

function buildWhereClause(filters: any[]) {
  if (!filters || filters.length === 0) return {};
  
  const where: any = {};
  
  filters.forEach(filter => {
    const { column, operator, value } = filter;
    
    // Prisma filters: https://www.prisma.io/docs/concepts/components/prisma-client/filtering
    if (operator === 'eq') {
      where[column] = value;
    } else if (operator === 'neq') {
      where[column] = { not: value };
    } else if (operator === 'gt') {
      where[column] = { gt: value };
    } else if (operator === 'gte') {
      where[column] = { gte: value };
    } else if (operator === 'lt') {
      where[column] = { lt: value };
    } else if (operator === 'lte') {
      where[column] = { lte: value };
    } else if (operator === 'like' || operator === 'ilike') {
      where[column] = { contains: value.replace(/%/g, '') }; // Simple adaptation
    } else if (operator === 'in') {
        where[column] = { in: value };
    }
  });
  
  return where;
}
