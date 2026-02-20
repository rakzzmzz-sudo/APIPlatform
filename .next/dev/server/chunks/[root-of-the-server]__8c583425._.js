module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
// Force reset if the client is stale (doesn't have the new models)
if (("TURBOPACK compile-time value", "development") !== 'production' && globalForPrisma.prisma) {
    const requiredModels = [
        'videoApiProduct',
        'meeting',
        'meetingParticipant',
        'meetingTranscript',
        'meetingActionItem',
        'meetingSummary',
        'meetingAnalytics',
        'meetingAIInsight',
        'emailCampaign',
        'emailTemplate',
        'emailContactList',
        'emailContact',
        'emailContactListMember',
        'emailAutomationSequence',
        'emailProviderConfig',
        'emailCampaignAnalytics',
        'emailSendingQuota',
        'emailCampaignRecipient',
        'product',
        'productTier'
    ];
    const currentModels = Object.keys(globalForPrisma.prisma).filter((k)=>!k.startsWith('_') && !k.startsWith('$'));
    const isStale = requiredModels.some((model)=>!globalForPrisma.prisma[model]);
    if (isStale) {
        const missing = requiredModels.filter((m)=>!globalForPrisma.prisma[m]);
        // Log to a file we can read
        try {
            const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
            fs.appendFileSync('prisma_debug.log', `${new Date().toISOString()} - Stale! Missing: ${missing.join(', ')}. Available: ${currentModels.length} models.\n`);
        } catch (e) {}
        // Nuke it
        if (globalForPrisma.prisma.$disconnect) {
            globalForPrisma.prisma.$disconnect();
        }
        globalForPrisma.prisma = undefined;
    } else {
        try {
            const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
            fs.appendFileSync('prisma_debug.log', `${new Date().toISOString()} - Prisma OK. Available: ${currentModels.length} models.\n`);
        } catch (e) {}
    }
}
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma; // Last schema update: 2026-02-17 (Added Meeting AI and Video API tables)
}),
"[project]/src/app/api/db/[table]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
async function POST(request, { params } // Params is a promise in newer Next.js versions
) {
    try {
        const { table } = await params;
        const body = await request.json();
        const { operation, filters, data, orderBy, limit, single } = body;
        console.log(`API DB Request: ${table} ${operation}`, {
            filters,
            orderBy
        });
        // Map table name to Prisma model name
        // e.g. "customers" -> "customer", "customer_health_scores" -> "customerHealthScore"
        const modelName = mapTableToModel(table);
        let model = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"][modelName];
        if (!model) {
            const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
            const timestamp = new Date().toISOString();
            const availableModels = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"]).filter((k)=>!k.startsWith('_') && !k.startsWith('$'));
            try {
                const clientPath = "[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)";
                fs.appendFileSync('prisma_debug.log', `${timestamp} - API Match Fail! Table: ${table}, Model: ${modelName}. Client: ${clientPath}. Available: ${availableModels.length} models.\n`);
            } catch (e) {}
            console.error(`Table ${table} (model ${modelName}) not found in shared Prisma instance. Attempting fresh instantiation...`);
            // Try to create a one-off client as a last resort
            try {
                const { PrismaClient } = __turbopack_context__.r("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
                const freshPrisma = new PrismaClient();
                if (freshPrisma[modelName]) {
                    console.log(`Found ${modelName} in fresh Prisma instance. Using it for this request.`);
                    model = freshPrisma[modelName];
                } else {
                    const available = Object.keys(freshPrisma).filter((k)=>!k.startsWith('_') && !k.startsWith('$'));
                    console.error(`Model ${modelName} STILL NOT FOUND in fresh instance. Available: ${available.join(', ')}`);
                    try {
                        fs.appendFileSync('prisma_debug.log', `${timestamp} - Fresh Instance FAIL! Model: ${modelName}. Available: ${available.join(', ')}\n`);
                    } catch (e) {}
                }
            } catch (e) {
                console.error(`Failed to create fresh Prisma instance: ${e.message}`);
            }
        }
        if (!model) {
            // FALLBACK: If model is missing (stale client), try raw SQL for known tables
            // This handles the correct table names directly from the DB
            const validFallbackTables = [
                'products',
                'product_tiers'
            ];
            if (validFallbackTables.includes(table)) {
                console.warn(`Model ${modelName} not found. Attempting raw SQL fallback for table ${table}.`);
                try {
                    let query = `SELECT * FROM "${table}"`;
                    const params = [];
                    // 1. WHERE clause
                    if (filters && filters.length > 0) {
                        const conditions = [];
                        filters.forEach((f)=>{
                            // Very basic SQL construction for the specific use case in ProductCatalog
                            // operator 'eq' is the main one used
                            if (f.operator === 'eq') {
                                conditions.push(`"${f.column}" = $${params.length + 1}`);
                                params.push(f.value);
                            }
                        // Add more if needed, but ProductCatalog only uses eq('status', 'active')
                        });
                        if (conditions.length > 0) {
                            query += ` WHERE ${conditions.join(' AND ')}`;
                        }
                    }
                    // 2. ORDER BY
                    if (orderBy) {
                        // orderBy is { column: 'asc'|'desc' }
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
                    console.log(`Executing Raw SQL Fallback: ${query}`, params);
                    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$queryRawUnsafe(query, ...params);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        data: result,
                        error: null
                    });
                } catch (rawError) {
                    console.error('Raw SQL Fallback Failed:', rawError);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: `Table ${table} (model ${modelName}) not found and raw fallback failed: ${rawError.message}`
                    }, {
                        status: 500
                    });
                }
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Table ${table} (model ${modelName}) not found`
            }, {
                status: 400
            });
        }
        let result;
        if (operation === 'select') {
            const queryOptions = {
                where: buildWhereClause(filters)
            };
            if (orderBy) {
                queryOptions.orderBy = orderBy;
            }
            if (limit) {
                queryOptions.take = limit;
            }
            const rows = await model.findMany(queryOptions);
            if (single) {
                result = rows[0] || null;
            } else {
                result = rows;
            }
        } else if (operation === 'insert') {
            if (Array.isArray(data)) {
                result = await model.createMany({
                    data: data
                });
            } else {
                result = await model.create({
                    data: data
                });
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid operation'
            }, {
                status: 400
            });
        }
        // Supabase response format: { data: result, error: null }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: result,
            error: null
        });
    } catch (error) {
        console.error('Database API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: null,
            error: {
                message: error.message
            }
        }, {
            status: 500
        });
    }
}
function mapTableToModel(tableName) {
    // Simple mapping strategy: singularize and camelCase
    // or explicit mapping
    const mapping = {
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
        'profiles': 'user',
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
        'product_tiers': 'productTier'
    };
    return mapping[tableName] || tableName;
}
function buildWhereClause(filters) {
    if (!filters || filters.length === 0) return {};
    const where = {};
    filters.forEach((filter)=>{
        const { column, operator, value } = filter;
        // Prisma filters: https://www.prisma.io/docs/concepts/components/prisma-client/filtering
        if (operator === 'eq') {
            where[column] = value;
        } else if (operator === 'neq') {
            where[column] = {
                not: value
            };
        } else if (operator === 'gt') {
            where[column] = {
                gt: value
            };
        } else if (operator === 'gte') {
            where[column] = {
                gte: value
            };
        } else if (operator === 'lt') {
            where[column] = {
                lt: value
            };
        } else if (operator === 'lte') {
            where[column] = {
                lte: value
            };
        } else if (operator === 'like' || operator === 'ilike') {
            where[column] = {
                contains: value.replace(/%/g, '')
            }; // Simple adaptation
        } else if (operator === 'in') {
            where[column] = {
                in: value
            };
        }
    });
    return where;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8c583425._.js.map