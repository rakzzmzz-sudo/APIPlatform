(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/Channels/APIMarketplace.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>APIMarketplace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/key.js [app-client] (ecmascript) <export default as Key>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check-circle.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/video.js [app-client] (ecmascript) <export default as Video>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/terminal.js [app-client] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-alert.js [app-client] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cpu.js [app-client] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const USE_CASES = [
    {
        id: 'all',
        name: 'All Use Cases'
    },
    {
        id: 'auth',
        name: 'Authentication & Security'
    },
    {
        id: 'marketing',
        name: 'Customer Engagement'
    },
    {
        id: 'ops',
        name: 'Operational Services'
    },
    {
        id: 'support',
        name: 'Support & Concierge'
    },
    {
        id: 'kyc',
        name: 'Identity & Compliance'
    }
];
const INDUSTRIES = [
    {
        id: 'all',
        industry_name: 'All Industries',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"],
        description: 'All available APIs'
    },
    {
        id: 'finance',
        industry_name: 'Finance & Banking',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
        description: 'Secure financial communications'
    },
    {
        id: 'retail',
        industry_name: 'Retail & E-commerce',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
        description: 'Engagement and logistics'
    },
    {
        id: 'health',
        industry_name: 'Healthcare',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
        description: 'Privacy-first medical connectivity'
    },
    {
        id: 'tech',
        industry_name: 'Tech & SaaS',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"],
        description: 'Developer-first infrastructure'
    }
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
        features: [
            'Failover Logic',
            'Country Filtering',
            'Custom Templates'
        ],
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"],
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
        features: [
            'Rich Media',
            'Templates',
            'Interactive Buttons'
        ],
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
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
        features: [
            'Network Insights',
            'Fraud Scoring',
            'Telco-Grade'
        ],
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"],
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
        features: [
            'Face Matching',
            'OCR Integration',
            'Recording'
        ],
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"],
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
        features: [
            'Multi-lingual',
            'HIPAA Compliant',
            'Sentiment Analysis'
        ],
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
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
        features: [
            'Precision Radius',
            'Battery Friendly',
            'Consent Flow'
        ],
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"],
        productCode: 'DEV_LOC'
    }
];
function APIMarketplace({ onNavigate }) {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedIndustry, setSelectedIndustry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [selectedUseCase, setSelectedUseCase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('browse');
    const [customizingApi, setCustomizingApi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [revealedKeys, setRevealedKeys] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [addingToCart, setAddingToCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [notification, setNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Mock data for API keys (usually from DB)
    const [myKeys, setMyKeys] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "APIMarketplace.useEffect": ()=>{
            if (user) {
                loadKeys();
            }
        }
    }["APIMarketplace.useEffect"], [
        user
    ]);
    const loadKeys = async ()=>{
        try {
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('api_marketplace_keys').select('*').eq('user_id', user?.id).order('created_at', {
                ascending: false
            });
            if (data) setMyKeys(data);
        } catch (err) {
            console.error('Failed to load keys:', err);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "APIMarketplace.useEffect": ()=>{
            if (notification) {
                const timer = setTimeout({
                    "APIMarketplace.useEffect.timer": ()=>setNotification(null)
                }["APIMarketplace.useEffect.timer"], 5000);
                return ({
                    "APIMarketplace.useEffect": ()=>clearTimeout(timer)
                })["APIMarketplace.useEffect"];
            }
        }
    }["APIMarketplace.useEffect"], [
        notification
    ]);
    const filteredApis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "APIMarketplace.useMemo[filteredApis]": ()=>{
            return MARKETPLACE_APIS.filter({
                "APIMarketplace.useMemo[filteredApis]": (api)=>{
                    const matchesSearch = api.title.toLowerCase().includes(searchQuery.toLowerCase()) || api.description.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesIndustry = selectedIndustry === 'all' || api.industryId === selectedIndustry;
                    const matchesUseCase = selectedUseCase === 'all' || api.useCaseId === selectedUseCase;
                    return matchesSearch && matchesIndustry && matchesUseCase;
                }
            }["APIMarketplace.useMemo[filteredApis]"]);
        }
    }["APIMarketplace.useMemo[filteredApis]"], [
        searchQuery,
        selectedIndustry,
        selectedUseCase
    ]);
    const handleAddToCart = async (api)=>{
        if (!user) {
            setNotification({
                type: 'error',
                message: 'Please sign in to add items to cart'
            });
            return;
        }
        setAddingToCart(api.id);
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cart_items').insert({
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
            setNotification({
                type: 'success',
                message: `${api.title} added to cart!`
            });
        } catch (err) {
            console.error('Cart Error:', err);
            setNotification({
                type: 'error',
                message: 'Failed to add to cart'
            });
        } finally{
            setAddingToCart(null);
        }
    };
    const handleDownloadSDK = (apiTitle)=>{
        setNotification({
            type: 'success',
            message: `Initializing SDK download for ${apiTitle}...`
        });
        setTimeout(()=>{
        // Mock download action
        }, 1000);
    };
    const toggleKeyVisibility = (key)=>{
        setRevealedKeys((prev)=>({
                ...prev,
                [key]: !prev[key]
            }));
    };
    const copyToClipboard = (text, label)=>{
        navigator.clipboard.writeText(text);
        setNotification({
            type: 'success',
            message: `${label} copied to clipboard!`
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-3dc5895164da2bbe" + " " + "flex-1 overflow-auto bg-[#012419]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-3dc5895164da2bbe" + " " + "p-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3dc5895164da2bbe" + " " + "flex flex-col lg:flex-row gap-8 mb-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-1 bg-[#011a12] border border-[#024d30] rounded-2xl p-1 w-fit h-fit",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab('browse'),
                                        className: "jsx-3dc5895164da2bbe" + " " + `px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'browse' ? 'bg-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20' : 'text-slate-500 hover:text-white'}`,
                                        children: "Browse Ecosystem"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                        lineNumber: 248,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab('keys'),
                                        className: "jsx-3dc5895164da2bbe" + " " + `px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'keys' ? 'bg-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20' : 'text-slate-500 hover:text-white'}`,
                                        children: [
                                            "My Subscriptions (",
                                            myKeys.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                        lineNumber: 256,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3dc5895164da2bbe" + " " + "flex-1 flex flex-wrap items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3dc5895164da2bbe" + " " + "relative flex-1 min-w-[300px] group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#39FF14] transition-colors"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                lineNumber: 268,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Search use cases, features, or industries...",
                                                value: searchQuery,
                                                onChange: (e)=>setSearchQuery(e.target.value),
                                                className: "jsx-3dc5895164da2bbe" + " " + "w-full bg-[#011a12] border border-[#024d30] rounded-2xl pl-12 pr-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#39FF14]/50 focus:ring-4 focus:ring-[#39FF14]/5 transition-all outline-none"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                lineNumber: 269,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                        lineNumber: 267,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: selectedIndustry,
                                                onChange: (e)=>setSelectedIndustry(e.target.value),
                                                className: "jsx-3dc5895164da2bbe" + " " + "bg-[#011a12] border border-[#024d30] rounded-2xl px-6 py-4 text-white text-sm font-bold appearance-none hover:border-[#39FF14]/30 transition-all outline-none cursor-pointer",
                                                children: INDUSTRIES.map((ind)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: ind.id,
                                                        className: "jsx-3dc5895164da2bbe" + " " + "bg-[#011a12]",
                                                        children: ind.industry_name
                                                    }, ind.id, false, {
                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                lineNumber: 279,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: selectedUseCase,
                                                onChange: (e)=>setSelectedUseCase(e.target.value),
                                                className: "jsx-3dc5895164da2bbe" + " " + "bg-[#011a12] border border-[#024d30] rounded-2xl px-6 py-4 text-white text-sm font-bold appearance-none hover:border-[#39FF14]/30 transition-all outline-none cursor-pointer",
                                                children: USE_CASES.map((uc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: uc.id,
                                                        className: "jsx-3dc5895164da2bbe" + " " + "bg-[#011a12]",
                                                        children: uc.name
                                                    }, uc.id, false, {
                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                lineNumber: 289,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                        lineNumber: 278,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this),
                    activeTab === 'browse' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3dc5895164da2bbe" + " " + "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                        children: filteredApis.map((api)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3dc5895164da2bbe" + " " + "group relative bg-[#011a12]/60 border border-[#024d30] rounded-[2.5rem] p-8 hover:border-[#39FF14]/50 hover:bg-[#011a12] transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl h-full flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3dc5895164da2bbe" + " " + "absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(api.icon, {
                                            className: "w-32 h-32"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 310,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                        lineNumber: 309,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3dc5895164da2bbe" + " " + "relative flex flex-col h-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-3dc5895164da2bbe" + " " + "flex items-start justify-between mb-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-3dc5895164da2bbe" + " " + "bg-[#39FF14]/10 p-4 rounded-2xl border border-[#39FF14]/20 group-hover:border-[#39FF14]/50 transition-all",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(api.icon, {
                                                            className: "w-8 h-8 text-[#39FF14]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 316,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                        lineNumber: 315,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-3dc5895164da2bbe" + " " + "text-right",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-2 justify-end mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-3dc5895164da2bbe" + " " + "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                        lineNumber: 320,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-3dc5895164da2bbe" + " " + "text-[10px] font-black text-emerald-500 uppercase tracking-widest",
                                                                        children: [
                                                                            api.status,
                                                                            " Uptime"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                        lineNumber: 321,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                lineNumber: 319,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-3dc5895164da2bbe" + " " + "text-[10px] font-bold text-slate-500 uppercase tracking-widest",
                                                                children: [
                                                                    "Avg Latency: ",
                                                                    api.latency
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 24
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                        lineNumber: 318,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                lineNumber: 314,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-3dc5895164da2bbe" + " " + "text-2xl font-black text-white mb-2 tracking-tight group-hover:text-[#39FF14] transition-colors",
                                                children: api.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                lineNumber: 327,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-3dc5895164da2bbe" + " " + "text-slate-400 text-sm font-medium mb-8 leading-relaxed h-12 line-clamp-2",
                                                children: api.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                lineNumber: 328,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-3dc5895164da2bbe" + " " + "grid grid-cols-2 gap-4 mb-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-3dc5895164da2bbe" + " " + "bg-[#012419] border border-[#024d30] rounded-2xl p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "jsx-3dc5895164da2bbe" + " " + "text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1",
                                                                children: "Pricing"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                lineNumber: 334,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-3dc5895164da2bbe" + " " + "text-white font-black text-sm",
                                                                children: api.pricing
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                lineNumber: 335,
                                                                columnNumber: 24
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-3dc5895164da2bbe" + " " + "bg-[#012419] border border-[#024d30] rounded-2xl p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "jsx-3dc5895164da2bbe" + " " + "text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1",
                                                                children: "Endpoints"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                lineNumber: 338,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                                        className: "w-3 h-3 text-[#39FF14]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                        lineNumber: 340,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-3dc5895164da2bbe" + " " + "text-white font-black text-xs",
                                                                        children: "Global Edge"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                        lineNumber: 341,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                lineNumber: 339,
                                                                columnNumber: 24
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                        lineNumber: 337,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                lineNumber: 332,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-3dc5895164da2bbe" + " " + "flex flex-wrap gap-2 mb-10 mt-auto",
                                                children: api.features.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-3dc5895164da2bbe" + " " + "px-3 py-1 bg-[#011a12] border border-[#024d30] rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-wider",
                                                        children: f
                                                    }, i, false, {
                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                        lineNumber: 348,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                lineNumber: 346,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-3dc5895164da2bbe" + " " + "grid grid-cols-2 gap-3 pb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleAddToCart(api),
                                                        disabled: addingToCart === api.id,
                                                        className: "jsx-3dc5895164da2bbe" + " " + "flex items-center justify-center gap-2 bg-[#39FF14] hover:bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-[#39FF14]/10 active:scale-95 disabled:opacity-50",
                                                        children: addingToCart === api.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-3dc5895164da2bbe" + " " + "w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 361,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 364,
                                                                    columnNumber: 27
                                                                }, this),
                                                                "Buy Access"
                                                            ]
                                                        }, void 0, true)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setCustomizingApi(api),
                                                        className: "jsx-3dc5895164da2bbe" + " " + "flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border border-slate-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                lineNumber: 373,
                                                                columnNumber: 23
                                                            }, this),
                                                            "Customize"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                        lineNumber: 369,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                lineNumber: 354,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                        lineNumber: 313,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, api.id, true, {
                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                lineNumber: 305,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                        lineNumber: 303,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3dc5895164da2bbe" + " " + "space-y-8",
                        children: myKeys.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3dc5895164da2bbe" + " " + "bg-[#011a12]/40 border border-[#024d30] border-dashed rounded-[3rem] p-24 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                    className: "w-24 h-24 text-slate-800 mx-auto mb-8"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 385,
                                    columnNumber: 18
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "jsx-3dc5895164da2bbe" + " " + "text-3xl font-black text-white mb-2",
                                    children: "No active subscriptions"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 386,
                                    columnNumber: 18
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-3dc5895164da2bbe" + " " + "text-slate-500 font-medium mb-10 max-w-lg mx-auto",
                                    children: "Purchase an API from the marketplace to start building industry-leading integrations."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 387,
                                    columnNumber: 18
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveTab('browse'),
                                    className: "jsx-3dc5895164da2bbe" + " " + "bg-[#39FF14] text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#39FF14]/20 hover:bg-white transition-all font-bold",
                                    children: "Browse Ecosystem"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 388,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                            lineNumber: 384,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3dc5895164da2bbe" + " " + "grid grid-cols-1 gap-6",
                            children: myKeys.map((keyData)=>{
                                const product = MARKETPLACE_APIS.find((a)=>a.id === keyData.product_id);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-3dc5895164da2bbe" + " " + "bg-[#011a12] border border-[#024d30] rounded-[2.5rem] p-10 group hover:border-[#39FF14]/30 transition-all shadow-xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-3dc5895164da2bbe" + " " + "flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 border-b border-[#024d30] pb-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-3dc5895164da2bbe" + " " + "bg-[#39FF14]/10 p-5 rounded-3xl border border-[#39FF14]/20 shadow-inner",
                                                            children: product ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(product.icon, {
                                                                className: "w-10 h-10 text-[#39FF14]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                lineNumber: 404,
                                                                columnNumber: 44
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                                                                className: "w-10 h-10 text-[#39FF14]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                lineNumber: 404,
                                                                columnNumber: 100
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 403,
                                                            columnNumber: 30
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-3dc5895164da2bbe",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-3xl font-black text-white mb-1 tracking-tight",
                                                                    children: keyData.key_name || 'My API Key'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 407,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-3dc5895164da2bbe" + " " + "text-[10px] font-black text-[#39FF14] uppercase tracking-widest",
                                                                            children: product?.title || 'Unknown API'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 409,
                                                                            columnNumber: 36
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-3dc5895164da2bbe" + " " + "w-1 h-1 rounded-full bg-slate-700"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 410,
                                                                            columnNumber: 36
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-3dc5895164da2bbe" + " " + "text-[10px] font-black text-slate-500 uppercase tracking-widest",
                                                                            children: (keyData.environment || 'production').toUpperCase()
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 411,
                                                                            columnNumber: 36
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 408,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 406,
                                                            columnNumber: 30
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-3 flex-wrap",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-2 bg-[#012419] border border-[#024d30] hover:border-[#39FF14]/50 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#39FF14] transition-all",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 418,
                                                                    columnNumber: 33
                                                                }, this),
                                                                "Analytics"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 417,
                                                            columnNumber: 30
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleDownloadSDK(product?.title || 'API'),
                                                            className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white transition-all",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 425,
                                                                    columnNumber: 33
                                                                }, this),
                                                                "Credentials"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 421,
                                                            columnNumber: 30
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setCustomizingApi(product),
                                                            className: "jsx-3dc5895164da2bbe" + " " + "p-4 bg-[#011a12] border border-[#024d30] hover:border-[#39FF14]/50 rounded-2xl text-slate-500 hover:text-[#39FF14] transition-all",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                                className: "w-5 h-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                lineNumber: 432,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 428,
                                                            columnNumber: 30
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 416,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 401,
                                            columnNumber: 24
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-3dc5895164da2bbe" + " " + "grid grid-cols-1 md:grid-cols-2 gap-12",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "space-y-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-3dc5895164da2bbe",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold",
                                                                    children: "Primary API Key"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 440,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-3 bg-[#012419] border border-[#024d30] p-5 rounded-2xl group/key focus-within:border-[#39FF14]/50 transition-all",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                            className: "jsx-3dc5895164da2bbe" + " " + "flex-1 text-sm text-[#39FF14] font-mono tracking-wider truncate",
                                                                            children: revealedKeys[`key_${keyData.id}`] ? keyData.api_key : '••••••••••••••••••••••••••••••••'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 442,
                                                                            columnNumber: 36
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>toggleKeyVisibility(`key_${keyData.id}`),
                                                                            className: "jsx-3dc5895164da2bbe" + " " + "p-3 bg-[#011a12] rounded-xl text-slate-500 hover:text-[#39FF14] transition-all",
                                                                            children: revealedKeys[`key_${keyData.id}`] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                                                className: "w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                lineNumber: 449,
                                                                                columnNumber: 75
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                className: "w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                lineNumber: 449,
                                                                                columnNumber: 108
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 445,
                                                                            columnNumber: 36
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>copyToClipboard(keyData.api_key, 'API Key'),
                                                                            className: "jsx-3dc5895164da2bbe" + " " + "p-3 bg-[#011a12] rounded-xl text-slate-500 hover:text-[#39FF14] transition-all",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                                className: "w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                lineNumber: 455,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 451,
                                                                            columnNumber: 36
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 441,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 439,
                                                            columnNumber: 30
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-3dc5895164da2bbe",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block font-bold",
                                                                    children: "API Secret"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 461,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-3 bg-[#012419] border border-[#024d30] p-5 rounded-2xl group/secret focus-within:border-[#39FF14]/50 transition-all",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                            className: "jsx-3dc5895164da2bbe" + " " + "flex-1 text-sm text-[#39FF14] font-mono tracking-wider truncate",
                                                                            children: revealedKeys[`sec_${keyData.id}`] ? keyData.api_secret : '••••••••••••••••••••••••••••••••'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 463,
                                                                            columnNumber: 36
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>toggleKeyVisibility(`sec_${keyData.id}`),
                                                                            className: "jsx-3dc5895164da2bbe" + " " + "p-3 bg-[#011a12] rounded-xl text-slate-500 hover:text-[#39FF14] transition-all",
                                                                            children: revealedKeys[`sec_${keyData.id}`] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                                                className: "w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                lineNumber: 470,
                                                                                columnNumber: 75
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                className: "w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                lineNumber: 470,
                                                                                columnNumber: 108
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 466,
                                                                            columnNumber: 36
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>copyToClipboard(keyData.api_secret, 'API Secret'),
                                                                            className: "jsx-3dc5895164da2bbe" + " " + "p-3 bg-[#011a12] rounded-xl text-slate-500 hover:text-[#39FF14] transition-all",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                                className: "w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                lineNumber: 476,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 472,
                                                                            columnNumber: 36
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 462,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 460,
                                                            columnNumber: 30
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 438,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "bg-[#012419] border border-[#024d30] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-3dc5895164da2bbe" + " " + "absolute top-0 right-0 p-8",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"], {
                                                                className: "w-24 h-24 text-[#39FF14] opacity-[0.03]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                lineNumber: 484,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 483,
                                                            columnNumber: 30
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-3dc5895164da2bbe",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-sm font-black text-white mb-6 uppercase tracking-widest",
                                                                    children: "Integration Health"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 487,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-3dc5895164da2bbe" + " " + "space-y-6",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-3dc5895164da2bbe" + " " + "flex items-center justify-between",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-xs font-bold text-slate-500 uppercase tracking-widest",
                                                                                    children: "Total Requests (24h)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                    lineNumber: 490,
                                                                                    columnNumber: 40
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-sm font-black text-white",
                                                                                    children: keyData.total_requests?.toLocaleString() || '0'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                    lineNumber: 491,
                                                                                    columnNumber: 40
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 489,
                                                                            columnNumber: 37
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-3dc5895164da2bbe" + " " + "flex items-center justify-between",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-xs font-bold text-slate-500 uppercase tracking-widest",
                                                                                    children: "Integration Status"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                    lineNumber: 494,
                                                                                    columnNumber: 40
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "jsx-3dc5895164da2bbe" + " " + "text-xs font-black text-emerald-500",
                                                                                            children: "OPERATIONAL"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                            lineNumber: 496,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-3dc5895164da2bbe" + " " + "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                            lineNumber: 497,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                                    lineNumber: 495,
                                                                                    columnNumber: 40
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 493,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 488,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 486,
                                                            columnNumber: 30
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-3dc5895164da2bbe" + " " + "pt-8 border-t border-[#024d30] flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: "jsx-3dc5895164da2bbe" + " " + "flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest text-white transition-all border border-slate-700",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                                                                            className: "w-3 h-3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 505,
                                                                            columnNumber: 36
                                                                        }, this),
                                                                        "Debugger"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 504,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleDownloadSDK(product?.title || 'API'),
                                                                    className: "jsx-3dc5895164da2bbe" + " " + "flex-1 flex items-center justify-center gap-2 bg-[#39FF14]/10 hover:bg-[#39FF14] border border-[#39FF14]/30 text-[#39FF14] hover:text-black py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                            className: "w-3 h-3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                            lineNumber: 512,
                                                                            columnNumber: 36
                                                                        }, this),
                                                                        "Get SDK"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                                    lineNumber: 508,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 503,
                                                            columnNumber: 30
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 482,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 437,
                                            columnNumber: 24
                                        }, this)
                                    ]
                                }, keyData.id, true, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 400,
                                    columnNumber: 21
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                            lineNumber: 396,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                        lineNumber: 382,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            notification && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-3dc5895164da2bbe" + " " + "fixed top-8 right-8 z-[100] animate-slide-in",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-3dc5895164da2bbe" + " " + `${notification.type === 'success' ? 'bg-[#011a12] border-[#39FF14]/50' : 'bg-red-950 border-red-500/50'} border-2 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 min-w-[320px]`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3dc5895164da2bbe" + " " + `${notification.type === 'success' ? 'bg-[#39FF14] text-black' : 'bg-red-500 text-white'} p-3 rounded-2xl`,
                            children: notification.type === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                lineNumber: 536,
                                columnNumber: 50
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                lineNumber: 536,
                                columnNumber: 88
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                            lineNumber: 533,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3dc5895164da2bbe",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-3dc5895164da2bbe" + " " + "font-black text-white text-sm uppercase tracking-widest",
                                    children: notification.type
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 539,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-3dc5895164da2bbe" + " " + "text-slate-400 text-xs font-bold leading-relaxed",
                                    children: notification.message
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 540,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                            lineNumber: 538,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setNotification(null),
                            className: "jsx-3dc5895164da2bbe" + " " + "ml-auto text-slate-500 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                lineNumber: 543,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                            lineNumber: 542,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                    lineNumber: 530,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                lineNumber: 529,
                columnNumber: 9
            }, this),
            customizingApi && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-3dc5895164da2bbe" + " " + "fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[110] p-6 overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-3dc5895164da2bbe" + " " + "bg-[#011a12] border border-[#024d30] w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(57,255,20,0.1)] my-auto animate-modal-in",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3dc5895164da2bbe" + " " + "p-10 border-b border-[#024d30] flex items-center justify-between bg-gradient-to-r from-[#012419] to-transparent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-3dc5895164da2bbe" + " " + "bg-[#39FF14]/10 p-4 rounded-2xl border border-[#39FF14]/20",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                className: "w-8 h-8 text-[#39FF14]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                lineNumber: 556,
                                                columnNumber: 24
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 555,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-3dc5895164da2bbe",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-2xl font-black text-white mb-0.5 tracking-tight uppercase",
                                                    children: "API Customization"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 559,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-slate-500 text-xs font-black uppercase tracking-widest",
                                                    children: customizingApi.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 560,
                                                    columnNumber: 24
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 558,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 554,
                                    columnNumber: 18
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCustomizingApi(null),
                                    className: "jsx-3dc5895164da2bbe" + " " + "text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-8 h-8"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                        lineNumber: 564,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 563,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                            lineNumber: 553,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3dc5895164da2bbe" + " " + "p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-3dc5895164da2bbe" + " " + "grid grid-cols-1 md:grid-cols-2 gap-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-3dc5895164da2bbe" + " " + "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-[10px] font-black uppercase tracking-widest text-[#39FF14] block",
                                                    children: "Region Selection"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 571,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "w-full bg-[#012419] border border-[#024d30] rounded-2xl px-5 py-4 text-white text-sm font-bold flex items-center justify-between outline-none hover:border-[#39FF14]/30 transition-all cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            className: "jsx-3dc5895164da2bbe" + " " + "bg-[#011a12]",
                                                            children: "Global (Edge Acceleration)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 573,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            className: "jsx-3dc5895164da2bbe" + " " + "bg-[#011a12]",
                                                            children: "Asia Pacific (Singapore)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 574,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            className: "jsx-3dc5895164da2bbe" + " " + "bg-[#011a12]",
                                                            children: "Europe (Frankfurt)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 575,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            className: "jsx-3dc5895164da2bbe" + " " + "bg-[#011a12]",
                                                            children: "US East (Virginia)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 576,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 572,
                                                    columnNumber: 24
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 570,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-3dc5895164da2bbe" + " " + "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-[10px] font-black uppercase tracking-widest text-[#39FF14] block",
                                                    children: "Data Retention"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "grid grid-cols-2 gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "jsx-3dc5895164da2bbe" + " " + "bg-[#39FF14] text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#39FF14]/10",
                                                            children: "30 Days"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 582,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "jsx-3dc5895164da2bbe" + " " + "bg-[#012419] border border-[#024d30] text-slate-500 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-slate-500 transition-all",
                                                            children: "90 Days"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                            lineNumber: 583,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 581,
                                                    columnNumber: 24
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 579,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 569,
                                    columnNumber: 18
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-3dc5895164da2bbe" + " " + "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "jsx-3dc5895164da2bbe" + " " + "text-[10px] font-black uppercase tracking-widest text-[#39FF14] block",
                                            children: "Webhook & Endpoint URL"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 589,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-3dc5895164da2bbe" + " " + "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                                                    className: "w-4 h-4 text-slate-600 absolute left-5 top-1/2 -translate-y-1/2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 591,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "https://your-server.com/api/webhooks",
                                                    className: "jsx-3dc5895164da2bbe" + " " + "w-full bg-[#012419] border border-[#024d30] rounded-2xl px-12 py-5 text-white font-mono text-xs outline-none focus:border-[#39FF14]/50 transition-all"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 592,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 590,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 588,
                                    columnNumber: 18
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-3dc5895164da2bbe" + " " + "bg-[#012419] border border-[#024d30] border-dashed rounded-3xl p-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-3dc5895164da2bbe" + " " + "flex items-center gap-4 mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                    className: "w-5 h-5 text-[#39FF14]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 602,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "text-xs font-black text-white uppercase tracking-widest",
                                                    children: "Advanced Configuration"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 603,
                                                    columnNumber: 24
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 601,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-3dc5895164da2bbe" + " " + "text-slate-500 text-xs font-medium leading-relaxed mb-6",
                                            children: "Enabling enterprise-grade configurations may affect your transaction throughput and base unit pricing. Contact architecture support for specialized scaling."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 605,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-3dc5895164da2bbe" + " " + "flex gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "flex-1 px-6 py-4 bg-[#011a12] border border-[#024d30] rounded-xl text-[10px] font-black text-white hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-all uppercase tracking-widest",
                                                    children: "Compliance Pack"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 607,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "jsx-3dc5895164da2bbe" + " " + "flex-1 px-6 py-4 bg-[#011a12] border border-[#024d30] rounded-xl text-[10px] font-black text-white hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-all uppercase tracking-widest",
                                                    children: "Failover Logic"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                                    lineNumber: 608,
                                                    columnNumber: 24
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                            lineNumber: 606,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 600,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                            lineNumber: 568,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3dc5895164da2bbe" + " " + "p-10 bg-[#012419]/50 border-t border-[#024d30] flex items-center justify-end gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCustomizingApi(null),
                                    className: "jsx-3dc5895164da2bbe" + " " + "px-8 py-5 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all font-bold",
                                    children: "Discard Changes"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 614,
                                    columnNumber: 18
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setNotification({
                                            type: 'success',
                                            message: 'API configuration updated successfully! Changes are being deployed to the edge.'
                                        });
                                        setCustomizingApi(null);
                                    },
                                    className: "jsx-3dc5895164da2bbe" + " " + "bg-[#39FF14] text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-[#39FF14]/20 hover:bg-white transition-all transform active:scale-95 font-bold",
                                    children: "Save & Deploy"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                                    lineNumber: 615,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                            lineNumber: 613,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                    lineNumber: 552,
                    columnNumber: 12
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
                lineNumber: 551,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "3dc5895164da2bbe",
                children: ".animate-fade-in.jsx-3dc5895164da2bbe{animation:.8s cubic-bezier(.16,1,.3,1) fadeIn}.animate-modal-in.jsx-3dc5895164da2bbe{animation:.5s cubic-bezier(.16,1,.3,1) modalIn}.animate-slide-in.jsx-3dc5895164da2bbe{animation:.5s cubic-bezier(.16,1,.3,1) slideIn}@keyframes fadeIn{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes modalIn{0%{opacity:0;transform:scale(.95)translateY(20px)}to{opacity:1;transform:scale(1)translateY(0)}}@keyframes slideIn{0%{opacity:0;transform:translate(50px)}to{opacity:1;transform:translate(0)}}.custom-scrollbar.jsx-3dc5895164da2bbe::-webkit-scrollbar{width:8px}.custom-scrollbar.jsx-3dc5895164da2bbe::-webkit-scrollbar-track{background:#024d301a}.custom-scrollbar.jsx-3dc5895164da2bbe::-webkit-scrollbar-thumb{background:#024d30;border-radius:10px}.custom-scrollbar.jsx-3dc5895164da2bbe.jsx-3dc5895164da2bbe::-webkit-scrollbar-thumb:hover{background:#39ff14}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Channels/APIMarketplace.tsx",
        lineNumber: 241,
        columnNumber: 5
    }, this);
}
_s(APIMarketplace, "1A/xhp0+Lr8yxGSv8NMsrgBUpzE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = APIMarketplace;
var _c;
__turbopack_context__.k.register(_c, "APIMarketplace");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_Channels_APIMarketplace_tsx_499c6bcb._.js.map