(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/Chatbot/ChatbotIntegrations.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatbotIntegrations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/headphones.js [app-client] (ecmascript) <export default as Headphones>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bar-chart-3.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$more$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/more-horizontal.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/key.js [app-client] (ecmascript) <export default as Key>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check-circle.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader.js [app-client] (ecmascript) <export default as Loader>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function ChatbotIntegrations({ botId }) {
    _s();
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [providers, setProviders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [botIntegrations, setBotIntegrations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showConfigModal, setShowConfigModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedProvider, setSelectedProvider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [configForm, setConfigForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [integrationName, setIntegrationName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [editingIntegration, setEditingIntegration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const iconMap = {
        MessageSquare: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
        Share2: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"],
        Users: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        Brain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"],
        Database: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"],
        Phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"],
        Headphones: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__["Headphones"],
        CreditCard: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
        Package: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
        BarChart3: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        Zap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
        MoreHorizontal: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$more$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"],
        TrendingUp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"]
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatbotIntegrations.useEffect": ()=>{
            if (botId) {
                loadData();
            }
        }
    }["ChatbotIntegrations.useEffect"], [
        botId
    ]);
    const loadData = async ()=>{
        setLoading(true);
        try {
            const [categoriesRes, providersRes, integrationsRes] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_integration_categories').select('*').order('sort_order'),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_integration_providers').select('*').eq('is_active', true),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_bot_integrations').select('*, cb_integration_providers(*)').eq('bot_id', botId)
            ]);
            if (categoriesRes.data) setCategories(categoriesRes.data);
            if (providersRes.data) setProviders(providersRes.data);
            if (integrationsRes.data) setBotIntegrations(integrationsRes.data);
        } catch (error) {
            console.error('Error loading integration data:', error);
        } finally{
            setLoading(false);
        }
    };
    const filteredProviders = providers.filter((provider)=>{
        const matchesCategory = selectedCategory === 'all' || provider.category_id === selectedCategory;
        const matchesSearch = provider.provider_display_name.toLowerCase().includes(searchTerm.toLowerCase()) || provider.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    const openConfigModal = (provider, existing)=>{
        setSelectedProvider(provider);
        setEditingIntegration(existing || null);
        setIntegrationName(existing?.integration_name || `${provider.provider_display_name} Integration`);
        if (existing) {
            setConfigForm(existing.configuration || {});
        } else {
            const initialConfig = {};
            Object.keys(provider.configuration_schema || {}).forEach((key)=>{
                initialConfig[key] = '';
            });
            setConfigForm(initialConfig);
        }
        setShowConfigModal(true);
    };
    const closeConfigModal = ()=>{
        setShowConfigModal(false);
        setSelectedProvider(null);
        setEditingIntegration(null);
        setConfigForm({});
        setIntegrationName('');
    };
    const saveIntegration = async ()=>{
        if (!selectedProvider) return;
        try {
            const integrationData = {
                bot_id: botId,
                provider_id: selectedProvider.id,
                integration_name: integrationName,
                configuration: configForm,
                is_active: true,
                sync_status: 'configured'
            };
            if (editingIntegration) {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_bot_integrations').update(integrationData).eq('id', editingIntegration.id);
                if (error) throw error;
            } else {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_bot_integrations').insert(integrationData);
                if (error) throw error;
            }
            closeConfigModal();
            loadData();
        } catch (error) {
            alert('Failed to save integration: ' + error.message);
        }
    };
    const toggleIntegration = async (integration)=>{
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_bot_integrations').update({
                is_active: !integration.is_active
            }).eq('id', integration.id);
            if (error) throw error;
            loadData();
        } catch (error) {
            alert('Failed to toggle integration: ' + error.message);
        }
    };
    const deleteIntegration = async (integrationId)=>{
        if (!confirm('Are you sure you want to delete this integration?')) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_bot_integrations').delete().eq('id', integrationId);
            if (error) throw error;
            loadData();
        } catch (error) {
            alert('Failed to delete integration: ' + error.message);
        }
    };
    const testConnection = async (integration)=>{
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_bot_integrations').update({
                sync_status: 'testing',
                last_sync_at: new Date().toISOString()
            }).eq('id', integration.id);
            if (error) throw error;
            setTimeout(()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_bot_integrations').update({
                    sync_status: 'connected'
                }).eq('id', integration.id).then(()=>loadData());
            }, 2000);
            loadData();
        } catch (error) {
            alert('Failed to test connection: ' + error.message);
        }
    };
    const getIntegrationStatus = (integration)=>{
        if (!integration.is_active) {
            return {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"],
                color: 'text-gray-500',
                bg: 'bg-gray-500/20',
                label: 'Inactive'
            };
        }
        switch(integration.sync_status){
            case 'connected':
                return {
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"],
                    color: 'text-green-500',
                    bg: 'bg-green-500/20',
                    label: 'Connected'
                };
            case 'testing':
                return {
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"],
                    color: 'text-[#39FF14]',
                    bg: 'bg-[#39FF14]/20',
                    label: 'Testing'
                };
            case 'error':
                return {
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
                    color: 'text-red-500',
                    bg: 'bg-red-500/20',
                    label: 'Error'
                };
            default:
                return {
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
                    color: 'text-yellow-500',
                    bg: 'bg-yellow-500/20',
                    label: 'Configured'
                };
        }
    };
    const isProviderConfigured = (providerId)=>{
        return botIntegrations.some((int)=>int.provider_id === providerId);
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-96",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"], {
                className: "w-8 h-8 text-[#39FF14] animate-spin"
            }, void 0, false, {
                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                lineNumber: 237,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
            lineNumber: 236,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gray-800 rounded-lg p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-white",
                                        children: "Channel Integrations"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                        lineNumber: 247,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-400 text-sm mt-1",
                                        children: "Connect your chatbot to messaging platforms, CRMs, and other services"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                        lineNumber: 248,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                lineNumber: 246,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-gray-400",
                                    children: [
                                        botIntegrations.filter((i)=>i.is_active).length,
                                        " Active"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                        lineNumber: 245,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col lg:flex-row gap-4 mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "Search integrations...",
                            value: searchTerm,
                            onChange: (e)=>setSearchTerm(e.target.value),
                            className: "flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                            lineNumber: 260,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 mb-6 overflow-x-auto pb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedCategory('all'),
                                className: `px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-[#39FF14] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`,
                                children: [
                                    "All (",
                                    providers.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                lineNumber: 270,
                                columnNumber: 11
                            }, this),
                            categories.map((category)=>{
                                const count = providers.filter((p)=>p.category_id === category.id).length;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedCategory(category.id),
                                    className: `px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${selectedCategory === category.id ? 'bg-[#39FF14] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`,
                                    children: [
                                        category.category_display_name,
                                        " (",
                                        count,
                                        ")"
                                    ]
                                }, category.id, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                    lineNumber: 283,
                                    columnNumber: 15
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                children: filteredProviders.map((provider)=>{
                    const Icon = iconMap[provider.configuration_schema?.icon] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"];
                    const configured = isProviderConfigured(provider.id);
                    const integration = botIntegrations.find((i)=>i.provider_id === provider.id);
                    const status = integration ? getIntegrationStatus(integration) : null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-10 h-10 rounded-lg ${configured ? 'bg-[#39FF14]/20' : 'bg-gray-700'} flex items-center justify-center`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    className: `w-5 h-5 ${configured ? 'text-[#39FF14]' : 'text-gray-400'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                    lineNumber: 314,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 313,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-white font-semibold",
                                                        children: provider.provider_display_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                        lineNumber: 317,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-500",
                                                        children: provider.provider_type
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                        lineNumber: 318,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 316,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                        lineNumber: 312,
                                        columnNumber: 17
                                    }, this),
                                    configured && status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${status.bg} px-2 py-1 rounded flex items-center gap-1`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(status.icon, {
                                                className: `w-3 h-3 ${status.color} ${status.icon === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"] ? 'animate-spin' : ''}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 323,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-xs ${status.color}`,
                                                children: status.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 324,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                        lineNumber: 322,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                lineNumber: 311,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 text-sm mb-3 line-clamp-2",
                                children: provider.description
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                lineNumber: 329,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-1 mb-3",
                                children: [
                                    provider.capabilities?.slice(0, 3).map((cap, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded",
                                            children: cap.replace(/_/g, ' ')
                                        }, idx, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 333,
                                            columnNumber: 19
                                        }, this)),
                                    provider.capabilities?.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded",
                                        children: [
                                            "+",
                                            provider.capabilities.length - 3
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                        lineNumber: 338,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                lineNumber: 331,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: configured && integration ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>openConfigModal(provider, integration),
                                            className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                    lineNumber: 351,
                                                    columnNumber: 23
                                                }, this),
                                                "Configure"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 347,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>toggleIntegration(integration),
                                            className: `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${integration.is_active ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`,
                                            children: integration.is_active ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 362,
                                                columnNumber: 48
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 362,
                                                columnNumber: 76
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 354,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>testConnection(integration),
                                            className: "bg-[#39FF14] hover:bg-[#32e012] text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 368,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 364,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>openConfigModal(provider),
                                    className: "flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 376,
                                            columnNumber: 21
                                        }, this),
                                        "Connect"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                    lineNumber: 372,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                lineNumber: 344,
                                columnNumber: 15
                            }, this)
                        ]
                    }, provider.id, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                        lineNumber: 307,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                lineNumber: 299,
                columnNumber: 7
            }, this),
            filteredProviders.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gray-800 rounded-lg p-12 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                        className: "w-16 h-16 text-gray-600 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                        lineNumber: 388,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-semibold text-gray-400 mb-2",
                        children: "No integrations found"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                        lineNumber: 389,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500",
                        children: "Try adjusting your search or category filter"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                        lineNumber: 390,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                lineNumber: 387,
                columnNumber: 9
            }, this),
            showConfigModal && selectedProvider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-b border-gray-700 sticky top-0 bg-gray-800",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-bold text-white",
                                                children: [
                                                    editingIntegration ? 'Configure' : 'Connect',
                                                    " ",
                                                    selectedProvider.provider_display_name
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 400,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 text-sm mt-1",
                                                children: selectedProvider.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 403,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                        lineNumber: 399,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: closeConfigModal,
                                        className: "text-gray-400 hover:text-white",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "w-6 h-6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 406,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                        lineNumber: 405,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                lineNumber: 398,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                            lineNumber: 397,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-semibold text-gray-300 mb-2",
                                            children: "Integration Name"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 413,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: integrationName,
                                            onChange: (e)=>setIntegrationName(e.target.value),
                                            placeholder: "e.g., Production Slack Bot",
                                            className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 416,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                    lineNumber: 412,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                                className: "w-5 h-5 text-[#39FF14] mt-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 427,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-sm font-semibold text-[#39FF14] mb-1",
                                                        children: [
                                                            "Authentication: ",
                                                            selectedProvider.auth_type
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                        lineNumber: 429,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-[#39FF14]/80",
                                                        children: [
                                                            selectedProvider.auth_type === 'api_key' && 'Enter your API key to authenticate',
                                                            selectedProvider.auth_type === 'oauth2' && 'OAuth 2.0 authentication required',
                                                            selectedProvider.auth_type === 'token' && 'Enter your access token',
                                                            selectedProvider.auth_type === 'basic_auth' && 'Enter your username and password'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                        lineNumber: 430,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 428,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                        lineNumber: 426,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                    lineNumber: 425,
                                    columnNumber: 15
                                }, this),
                                Object.entries(selectedProvider.configuration_schema || {}).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-semibold text-gray-300 mb-2",
                                                children: key.split('_').map((w)=>w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 442,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: key.includes('secret') || key.includes('password') || key.includes('token') ? 'password' : 'text',
                                                value: configForm[key] || '',
                                                onChange: (e)=>setConfigForm({
                                                        ...configForm,
                                                        [key]: e.target.value
                                                    }),
                                                placeholder: `Enter ${key.replace(/_/g, ' ')}`,
                                                className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                lineNumber: 445,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, key, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                        lineNumber: 441,
                                        columnNumber: 17
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-700 rounded-lg p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-sm font-semibold text-gray-300 mb-2",
                                            children: "Capabilities"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 456,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: selectedProvider.capabilities?.map((cap, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "px-3 py-1 bg-gray-600 text-gray-200 text-xs rounded-full",
                                                    children: cap.replace(/_/g, ' ')
                                                }, idx, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                                    lineNumber: 459,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 457,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                    lineNumber: 455,
                                    columnNumber: 15
                                }, this),
                                selectedProvider.documentation_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: selectedProvider.documentation_url,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "flex items-center gap-2 text-[#39FF14] hover:text-[#39FF14] text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 473,
                                            columnNumber: 19
                                        }, this),
                                        "View Documentation"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                    lineNumber: 467,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                            lineNumber: 411,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-t border-gray-700 flex gap-3 sticky bottom-0 bg-gray-800",
                            children: [
                                editingIntegration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>deleteIntegration(editingIntegration.id),
                                    className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                            lineNumber: 485,
                                            columnNumber: 19
                                        }, this),
                                        "Delete"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                    lineNumber: 481,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: closeConfigModal,
                                    className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                    lineNumber: 489,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: saveIntegration,
                                    className: "flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg font-semibold transition-colors",
                                    children: editingIntegration ? 'Save Changes' : 'Connect Integration'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                                    lineNumber: 495,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                            lineNumber: 479,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                    lineNumber: 396,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
                lineNumber: 395,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Chatbot/ChatbotIntegrations.tsx",
        lineNumber: 243,
        columnNumber: 5
    }, this);
}
_s(ChatbotIntegrations, "/MWpPtWE04Ta46Sv9TvMKMLpg6U=");
_c = ChatbotIntegrations;
var _c;
__turbopack_context__.k.register(_c, "ChatbotIntegrations");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Chatbot/ChatbotBuilder.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatbotBuilder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Chatbot$2f$ChatbotIntegrations$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Chatbot/ChatbotIntegrations.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plug$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plug.js [app-client] (ecmascript) <export default as Plug>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen.js [app-client] (ecmascript) <export default as Edit2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.js [app-client] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/server.js [app-client] (ecmascript) <export default as Server>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hard-drive.js [app-client] (ecmascript) <export default as HardDrive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader.js [app-client] (ecmascript) <export default as Loader>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function ChatbotBuilder() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('dashboard');
    const [dataLoading, setDataLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [bots, setBots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedBot, setSelectedBot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [intents, setIntents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [entities, setEntities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [conversations, setConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [knowledgeBase, setKnowledgeBase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [integrations, setIntegrations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showNewIntentModal, setShowNewIntentModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showNewEntityModal, setShowNewEntityModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showNewKBModal, setShowNewKBModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingIntentId, setEditingIntentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingEntityId, setEditingEntityId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingKBId, setEditingKBId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [intentForm, setIntentForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        intent_name: '',
        intent_display_name: '',
        intent_description: '',
        training_phrases: [],
        action_type: 'text',
        is_active: true,
        priority: 5
    });
    const [currentPhrase, setCurrentPhrase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [entityForm, setEntityForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        entity_name: '',
        entity_display_name: '',
        entity_type: 'list',
        values: [],
        regex_pattern: '',
        is_active: true
    });
    const [currentEntityValue, setCurrentEntityValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [currentEntitySynonyms, setCurrentEntitySynonyms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [testMessage, setTestMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [testConversation, setTestConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSendingMessage, setIsSendingMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [testSessionId, setTestSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedLLMProvider, setSelectedLLMProvider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('openai');
    const [selectedConversation, setSelectedConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [conversationMessages, setConversationMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showConversationModal, setShowConversationModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mlConfigs, setMlConfigs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showNewMLConfigModal, setShowNewMLConfigModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingMLConfigId, setEditingMLConfigId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mlConfigForm, setMlConfigForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        config_name: '',
        nlu_engine: 'llm',
        llm_provider: 'openai',
        llm_model: 'gpt-3.5-turbo',
        confidence_threshold: 0.7,
        temperature: 0.7,
        max_tokens: 500,
        is_active: true
    });
    const [kbForm, setKbForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        content: '',
        content_type: 'article',
        category: '',
        tags: [],
        url: '',
        source_type: 'manual',
        file: null,
        is_active: true
    });
    const [currentTag, setCurrentTag] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [uploadProgress, setUploadProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [trainingStatus, setTrainingStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        intent_classifier: {
            status: 'idle',
            last_trained: null,
            progress: 0
        },
        entity_extractor: {
            status: 'idle',
            last_trained: null,
            progress: 0
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatbotBuilder.useEffect": ()=>{
            loadBots();
        }
    }["ChatbotBuilder.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatbotBuilder.useEffect": ()=>{
            if (selectedBot) {
                loadBotData();
            }
        }
    }["ChatbotBuilder.useEffect"], [
        selectedBot
    ]);
    const loadBots = async ()=>{
        setDataLoading(true);
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_bots').select('*').order('created_at', {
                ascending: false
            });
            if (error) throw error;
            setBots(data || []);
            if (data && data.length > 0 && !selectedBot) {
                setSelectedBot(data[0].id);
            }
        } catch (error) {
            console.error('Error loading bots:', error);
        } finally{
            setDataLoading(false);
        }
    };
    const seedSampleBots = async ()=>{
        const SAMPLE_BOTS = [
            {
                name: 'WhatsApp Customer Care',
                description: 'Automated WhatsApp bot for customer support and order tracking',
                platform: 'whatsapp',
                type: 'support',
                status: 'active',
                language: 'en',
                greeting_message: 'Hi! Welcome to our WhatsApp support. How can I help you today?',
                configuration: JSON.stringify({
                    welcome_msg: true,
                    auto_reply: true
                })
            },
            {
                name: 'Telegram News Bot',
                description: 'Telegram bot for delivering real-time news updates and alerts',
                platform: 'telegram',
                type: 'informational',
                status: 'active',
                language: 'en',
                greeting_message: 'Welcome to the News Alert bot! You will receive updates here.',
                configuration: JSON.stringify({
                    categories: [
                        'tech',
                        'world',
                        'finance'
                    ]
                })
            },
            {
                name: 'Facebook Sales Assistant',
                description: 'Facebook bot for handling product inquiries and lead generation',
                platform: 'facebook',
                type: 'sales',
                status: 'active',
                language: 'en',
                greeting_message: 'Hello! Interested in our products? I can show you the latest catalog.',
                configuration: JSON.stringify({
                    flow: 'sales_funnel'
                })
            },
            {
                name: 'TikTok Interactive Bot',
                description: 'TikTok bot for engaging with followers and managing contests',
                platform: 'tiktok',
                type: 'engagement',
                status: 'active',
                language: 'en',
                greeting_message: 'Hey TikToker! Ready to join the challenge?',
                configuration: JSON.stringify({
                    mode: 'contest'
                })
            },
            {
                name: 'Messenger Support Bot',
                description: 'Messenger bot for 24/7 automated customer service',
                platform: 'messenger',
                type: 'support',
                status: 'active',
                language: 'en',
                greeting_message: 'How can we assist you on Messenger today?',
                configuration: JSON.stringify({
                    persistent_menu: true
                })
            },
            {
                name: 'Instagram Shopping Bot',
                description: 'Instagram bot for product catalogs and seamless shopping experience',
                platform: 'instagram',
                type: 'sales',
                status: 'active',
                language: 'en',
                greeting_message: 'Welcome to our Instagram shop! Browse our latest collections.',
                configuration: JSON.stringify({
                    shop_id: 'instashop_1'
                })
            },
            {
                name: 'Viber Business Bot',
                description: 'Viber bot for secure business communications and notifications',
                platform: 'viber',
                type: 'business',
                status: 'active',
                language: 'en',
                greeting_message: 'Welcome to our official Viber business account.',
                configuration: JSON.stringify({
                    security: 'high'
                })
            },
            {
                name: 'Webchat Help Desk',
                description: 'Webchat bot for real-time website assistance and FAQ handling',
                platform: 'webchat',
                type: 'support',
                status: 'active',
                language: 'en',
                greeting_message: 'Hello! How can I help you with our website today?',
                configuration: JSON.stringify({
                    theme: 'blue'
                })
            },
            {
                name: 'Line Service Bot',
                description: 'Line bot for service bookings and appointment management',
                platform: 'line',
                type: 'service',
                status: 'active',
                language: 'en',
                greeting_message: 'Welcome! Use this bot to book your next appointment.',
                configuration: JSON.stringify({
                    calendar_id: 'line_cal_1'
                })
            },
            {
                name: 'Line Global Bot',
                description: 'Global Line bot for multi-language customer engagement',
                platform: 'line',
                type: 'conversational',
                status: 'active',
                language: 'en',
                greeting_message: 'Hello and welcome to our global Line channel.',
                configuration: JSON.stringify({
                    regions: [
                        'APAC',
                        'EMEA',
                        'AMER'
                    ]
                })
            }
        ];
        setDataLoading(true);
        try {
            // 1. Insert Bots
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_bots').insert(SAMPLE_BOTS);
            // 2. Load Bots to get their IDs
            const { data: createdBots, error: loadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_bots').select('*');
            if (loadError) throw loadError;
            // 3. For each bot, seed related tables
            for (const bot of createdBots || []){
                // Skip if bot doesn't match one of our samples (to avoid re-seeding existing bots if logic allows)
                if (!SAMPLE_BOTS.find((s)=>s.name === bot.name)) continue;
                // --- SEED INTENTS ---
                const intents = [
                    {
                        bot_id: bot.id,
                        intent_name: 'greeting',
                        intent_display_name: 'Greeting',
                        intent_description: 'User says hello',
                        training_phrases: JSON.stringify([
                            'Hi',
                            'Hello',
                            'Hey there'
                        ]),
                        action_type: 'text',
                        priority: 5
                    },
                    {
                        bot_id: bot.id,
                        intent_name: 'help',
                        intent_display_name: 'Help Request',
                        intent_description: 'User needs assistance',
                        training_phrases: JSON.stringify([
                            'Help',
                            'I need help',
                            'Support'
                        ]),
                        action_type: 'text',
                        priority: 4
                    },
                    {
                        bot_id: bot.id,
                        intent_name: 'bye',
                        intent_display_name: 'Goodbye',
                        intent_description: 'User says goodbye',
                        training_phrases: JSON.stringify([
                            'Bye',
                            'Goodbye',
                            'See you'
                        ]),
                        action_type: 'text',
                        priority: 5
                    },
                    {
                        bot_id: bot.id,
                        intent_name: 'status_check',
                        intent_display_name: 'Status Check',
                        intent_description: 'Check order/service status',
                        training_phrases: JSON.stringify([
                            'Where is my order?',
                            'Track status',
                            'Check my booking'
                        ]),
                        action_type: 'api',
                        priority: 3
                    },
                    {
                        bot_id: bot.id,
                        intent_name: 'refund',
                        intent_display_name: 'Refund Inquiry',
                        intent_description: 'Inquire about refunds',
                        training_phrases: JSON.stringify([
                            'I want a refund',
                            'Refund policy',
                            'Money back'
                        ]),
                        action_type: 'text',
                        priority: 2
                    }
                ];
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_intents').insert(intents);
                // --- SEED ENTITIES ---
                const entities = [
                    {
                        bot_id: bot.id,
                        entity_name: 'order_id',
                        entity_display_name: 'Order ID',
                        entity_type: 'regex',
                        regex_pattern: 'ORD-\\d{5}',
                        is_active: true
                    },
                    {
                        bot_id: bot.id,
                        entity_name: 'product_type',
                        entity_display_name: 'Product Type',
                        entity_type: 'list',
                        values: JSON.stringify([
                            {
                                value: 'electronics',
                                synonyms: [
                                    'gadget',
                                    'tech'
                                ]
                            },
                            {
                                value: 'fashion',
                                synonyms: [
                                    'clothing',
                                    'wear'
                                ]
                            }
                        ]),
                        is_active: true
                    }
                ];
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_entities').insert(entities);
                // --- SEED KB ---
                const kbItems = [
                    {
                        bot_id: bot.id,
                        title: 'How to use this bot',
                        content: 'Simply type your request in natural language. I can help with orders, support, and FAQs.',
                        content_type: 'article',
                        category: 'General'
                    },
                    {
                        bot_id: bot.id,
                        title: 'Return Policy',
                        content: 'Our return policy allows items to be returned within 30 days of purchase.',
                        content_type: 'faq',
                        category: 'Policies'
                    },
                    {
                        bot_id: bot.id,
                        title: 'Shipping Times',
                        content: 'Standard shipping takes 3-5 business days. Express takes 1-2.',
                        content_type: 'faq',
                        category: 'Shipping'
                    }
                ];
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_knowledge_base').insert(kbItems);
                // --- SEED ML CONFIG ---
                const mlConfig = {
                    bot_id: bot.id,
                    config_name: 'Standard NLU Config',
                    nlu_engine: 'llm',
                    llm_provider: 'openai',
                    llm_model: 'gpt-3.5-turbo',
                    confidence_threshold: 0.7,
                    is_active: true
                };
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_ml_configs').insert(mlConfig);
                // --- SEED CONVERSATIONS & MESSAGES ---
                const sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
                const { data: conversation, error: convError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_conversations').insert({
                    bot_id: bot.id,
                    session_id: sessionId,
                    user_id: `user-${Math.random().toString(36).substr(2, 5)}`,
                    channel: bot.platform || 'web',
                    status: 'completed',
                    message_count: 2
                });
                if (conversation) {
                    const convId = Array.isArray(conversation) ? conversation[0].id : conversation.id;
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_messages').insert([
                        {
                            conversation_id: convId,
                            message_type: 'user',
                            message_text: 'Hello, I need help with my order',
                            detected_intent: 'help',
                            intent_confidence: 0.95
                        },
                        {
                            conversation_id: convId,
                            message_type: 'bot',
                            message_text: 'Hi! Sure, I can help you with that. What is your order ID?'
                        }
                    ]);
                }
            }
            alert(`Successfully seeded 10 bots with full sample data sets!`);
            await loadBots();
        } catch (error) {
            console.error('Error seeding bots:', error);
            alert('Failed to seed sample bots: ' + error.message);
        } finally{
            setDataLoading(false);
        }
    };
    const loadBotData = async ()=>{
        if (!selectedBot) return;
        await Promise.all([
            loadIntents(),
            loadEntities(),
            loadConversations(),
            loadKnowledgeBase(),
            loadIntegrations(),
            loadMLConfigs()
        ]);
    };
    const loadMLConfigs = async ()=>{
        if (!selectedBot) return;
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_ml_configs').select('*').eq('bot_id', selectedBot).order('created_at', {
                ascending: false
            });
            if (error) throw error;
            setMlConfigs(data || []);
        } catch (error) {
            console.error('Error loading ML configs:', error);
        }
    };
    const loadIntents = async ()=>{
        if (!selectedBot) return;
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_intents').select('*').eq('bot_id', selectedBot).order('priority', {
                ascending: false
            });
            if (error) throw error;
            const processedIntents = (data || []).map((intent)=>({
                    ...intent,
                    training_phrases: typeof intent.training_phrases === 'string' ? JSON.parse(intent.training_phrases) : intent.training_phrases || []
                }));
            setIntents(processedIntents);
        } catch (error) {
            console.error('Error loading intents:', error);
        }
    };
    const loadEntities = async ()=>{
        if (!selectedBot) return;
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_entities').select('*').eq('bot_id', selectedBot).order('entity_display_name');
            if (error) throw error;
            const processedEntities = (data || []).map((entity)=>({
                    ...entity,
                    values: typeof entity.values === 'string' ? JSON.parse(entity.values) : entity.values || []
                }));
            setEntities(processedEntities);
        } catch (error) {
            console.error('Error loading entities:', error);
        }
    };
    const loadConversations = async ()=>{
        if (!selectedBot) return;
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_conversations').select('*').eq('bot_id', selectedBot).order('started_at', {
                ascending: false
            }).limit(50);
            if (error) throw error;
            setConversations(data || []);
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    };
    const loadKnowledgeBase = async ()=>{
        if (!selectedBot) return;
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_knowledge_base').select('*').eq('bot_id', selectedBot).order('created_at', {
                ascending: false
            });
            if (error) throw error;
            const processedKB = (data || []).map((item)=>({
                    ...item,
                    tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags || []
                }));
            setKnowledgeBase(processedKB);
        } catch (error) {
            console.error('Error loading knowledge base:', error);
        }
    };
    const loadIntegrations = async ()=>{
        if (!selectedBot) return;
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_integrations').select('*').eq('bot_id', selectedBot).order('integration_name');
            if (error) throw error;
            setIntegrations(data || []);
        } catch (error) {
            console.error('Error loading integrations:', error);
        }
    };
    const resetIntentForm = ()=>{
        setIntentForm({
            intent_name: '',
            intent_display_name: '',
            intent_description: '',
            training_phrases: [],
            action_type: 'text',
            is_active: true,
            priority: 5
        });
        setCurrentPhrase('');
    };
    const resetEntityForm = ()=>{
        setEntityForm({
            entity_name: '',
            entity_display_name: '',
            entity_type: 'list',
            values: [],
            regex_pattern: '',
            is_active: true
        });
        setCurrentEntityValue('');
        setCurrentEntitySynonyms('');
    };
    const addTrainingPhrase = ()=>{
        if (currentPhrase.trim()) {
            setIntentForm({
                ...intentForm,
                training_phrases: [
                    ...intentForm.training_phrases,
                    currentPhrase.trim()
                ]
            });
            setCurrentPhrase('');
        }
    };
    const removeTrainingPhrase = (index)=>{
        setIntentForm({
            ...intentForm,
            training_phrases: intentForm.training_phrases.filter((_, i)=>i !== index)
        });
    };
    const addEntityValue = ()=>{
        if (currentEntityValue.trim()) {
            const newValue = {
                value: currentEntityValue.trim(),
                synonyms: currentEntitySynonyms ? currentEntitySynonyms.split(',').map((s)=>s.trim()) : []
            };
            setEntityForm({
                ...entityForm,
                values: [
                    ...entityForm.values,
                    newValue
                ]
            });
            setCurrentEntityValue('');
            setCurrentEntitySynonyms('');
        }
    };
    const removeEntityValue = (index)=>{
        setEntityForm({
            ...entityForm,
            values: entityForm.values.filter((_, i)=>i !== index)
        });
    };
    const editIntent = (intent)=>{
        setEditingIntentId(intent.id);
        setIntentForm({
            intent_name: intent.intent_name,
            intent_display_name: intent.intent_display_name,
            intent_description: intent.intent_description,
            training_phrases: intent.training_phrases || [],
            action_type: intent.action_type,
            is_active: intent.is_active,
            priority: intent.priority
        });
        setShowNewIntentModal(true);
    };
    const deleteIntent = async (id)=>{
        if (!confirm('Are you sure you want to delete this intent?')) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_intents').delete().eq('id', id);
            if (error) throw error;
            loadIntents();
        } catch (error) {
            alert('Failed to delete intent: ' + error.message);
        }
    };
    const handleSaveIntent = async ()=>{
        if (!selectedBot || !intentForm.intent_name || !intentForm.intent_display_name) {
            alert('Please fill in all required fields');
            return;
        }
        try {
            if (editingIntentId) {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_intents').update({
                    intent_name: intentForm.intent_name,
                    intent_display_name: intentForm.intent_display_name,
                    intent_description: intentForm.intent_description,
                    training_phrases: intentForm.training_phrases,
                    action_type: intentForm.action_type,
                    is_active: intentForm.is_active,
                    priority: intentForm.priority
                }).eq('id', editingIntentId);
                if (error) throw error;
            } else {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_intents').insert({
                    bot_id: selectedBot,
                    intent_name: intentForm.intent_name,
                    intent_display_name: intentForm.intent_display_name,
                    intent_description: intentForm.intent_description,
                    training_phrases: intentForm.training_phrases,
                    action_type: intentForm.action_type,
                    is_system_intent: false,
                    is_active: intentForm.is_active,
                    priority: intentForm.priority
                });
                if (error) throw error;
            }
            setShowNewIntentModal(false);
            setEditingIntentId(null);
            resetIntentForm();
            loadIntents();
        } catch (error) {
            alert('Failed to save intent: ' + error.message);
        }
    };
    const editEntity = (entity)=>{
        setEditingEntityId(entity.id);
        setEntityForm({
            entity_name: entity.entity_name,
            entity_display_name: entity.entity_display_name,
            entity_type: entity.entity_type,
            values: entity.values || [],
            regex_pattern: entity.regex_pattern || '',
            is_active: entity.is_active
        });
        setShowNewEntityModal(true);
    };
    const deleteEntity = async (id)=>{
        if (!confirm('Are you sure you want to delete this entity?')) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_entities').delete().eq('id', id);
            if (error) throw error;
            loadEntities();
        } catch (error) {
            alert('Failed to delete entity: ' + error.message);
        }
    };
    const handleSaveEntity = async ()=>{
        if (!selectedBot || !entityForm.entity_name || !entityForm.entity_display_name) {
            alert('Please fill in all required fields');
            return;
        }
        try {
            if (editingEntityId) {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_entities').update({
                    entity_name: entityForm.entity_name,
                    entity_display_name: entityForm.entity_display_name,
                    entity_type: entityForm.entity_type,
                    values: entityForm.values,
                    regex_pattern: entityForm.regex_pattern || null,
                    is_active: entityForm.is_active
                }).eq('id', editingEntityId);
                if (error) throw error;
            } else {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_entities').insert({
                    bot_id: selectedBot,
                    entity_name: entityForm.entity_name,
                    entity_display_name: entityForm.entity_display_name,
                    entity_type: entityForm.entity_type,
                    values: entityForm.values,
                    regex_pattern: entityForm.regex_pattern || null,
                    is_active: entityForm.is_active
                });
                if (error) throw error;
            }
            setShowNewEntityModal(false);
            setEditingEntityId(null);
            resetEntityForm();
            loadEntities();
        } catch (error) {
            alert('Failed to save entity: ' + error.message);
        }
    };
    const handleTestMessage = async ()=>{
        if (!testMessage.trim() || isSendingMessage || !selectedBot) return;
        const userMessage = testMessage;
        const userMsg = {
            type: 'user',
            text: userMessage,
            timestamp: new Date()
        };
        setTestConversation((prev)=>[
                ...prev,
                userMsg
            ]);
        setTestMessage('');
        setIsSendingMessage(true);
        try {
            const apiUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/chatbot-query`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bot_id: selectedBot,
                    message: userMessage,
                    session_id: testSessionId || undefined,
                    user_id: 'test_user',
                    channel: 'web_test',
                    llm_provider: selectedLLMProvider
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get chatbot response');
            }
            const data = await response.json();
            if (!testSessionId && data.session_id) {
                setTestSessionId(data.session_id);
            }
            const botResponse = {
                type: 'bot',
                text: data.response,
                timestamp: new Date(),
                intent: data.detected_intent?.intent_name || null,
                confidence: data.detected_intent?.confidence || 0,
                provider: data.provider,
                model: data.model,
                kb_used: data.knowledge_base_used,
                metadata: data.metadata
            };
            setTestConversation((prev)=>[
                    ...prev,
                    botResponse
                ]);
        } catch (error) {
            console.error('Error processing message:', error);
            const fallbackResponse = {
                type: 'bot',
                text: `Error: ${error.message || 'Failed to process your message. Please check your API keys and try again.'}`,
                timestamp: new Date(),
                intent: null,
                confidence: 0,
                isError: true
            };
            setTestConversation((prev)=>[
                    ...prev,
                    fallbackResponse
                ]);
        } finally{
            setIsSendingMessage(false);
        }
    };
    const findBestIntent = (message)=>{
        const lowerMessage = message.toLowerCase();
        let bestMatch = {
            intent: null,
            confidence: 0
        };
        for (const intent of intents){
            if (!intent.is_active) continue;
            for (const phrase of intent.training_phrases){
                const similarity = calculateSimilarity(lowerMessage, phrase.toLowerCase());
                if (similarity > bestMatch.confidence) {
                    bestMatch = {
                        intent: intent.intent_display_name,
                        confidence: similarity
                    };
                }
            }
        }
        return bestMatch;
    };
    const calculateSimilarity = (str1, str2)=>{
        const words1 = new Set(str1.split(/\s+/));
        const words2 = new Set(str2.split(/\s+/));
        const intersection = new Set([
            ...words1
        ].filter((x)=>words2.has(x)));
        const union = new Set([
            ...words1,
            ...words2
        ]);
        return union.size > 0 ? intersection.size / union.size : 0;
    };
    const loadConversationMessages = async (conversationId)=>{
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_messages').select('*').eq('conversation_id', conversationId).order('created_at', {
                ascending: true
            });
            if (error) throw error;
            setConversationMessages(data || []);
            setSelectedConversation(conversationId);
            setShowConversationModal(true);
        } catch (error) {
            console.error('Error loading conversation messages:', error);
        }
    };
    const resetMLConfigForm = ()=>{
        setMlConfigForm({
            config_name: '',
            nlu_engine: 'llm',
            llm_provider: 'openai',
            llm_model: 'gpt-3.5-turbo',
            confidence_threshold: 0.7,
            temperature: 0.7,
            max_tokens: 500,
            is_active: true
        });
    };
    const editMLConfig = (config)=>{
        setEditingMLConfigId(config.id);
        setMlConfigForm({
            config_name: config.config_name,
            nlu_engine: config.nlu_engine,
            llm_provider: config.llm_provider,
            llm_model: config.llm_model,
            confidence_threshold: config.confidence_threshold,
            temperature: config.temperature,
            max_tokens: config.max_tokens,
            is_active: config.is_active
        });
        setShowNewMLConfigModal(true);
    };
    const deleteMLConfig = async (id)=>{
        if (!confirm('Are you sure you want to delete this ML configuration?')) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_ml_configs').delete().eq('id', id);
            if (error) throw error;
            loadMLConfigs();
        } catch (error) {
            alert('Failed to delete ML config: ' + error.message);
        }
    };
    const handleSaveMLConfig = async ()=>{
        if (!selectedBot || !mlConfigForm.config_name) {
            alert('Please fill in all required fields');
            return;
        }
        try {
            if (editingMLConfigId) {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_ml_configs').update(mlConfigForm).eq('id', editingMLConfigId);
                if (error) throw error;
            } else {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_ml_configs').insert({
                    bot_id: selectedBot,
                    ...mlConfigForm
                });
                if (error) throw error;
            }
            setShowNewMLConfigModal(false);
            setEditingMLConfigId(null);
            resetMLConfigForm();
            loadMLConfigs();
        } catch (error) {
            alert('Failed to save ML config: ' + error.message);
        }
    };
    const startTraining = async (type)=>{
        setTrainingStatus((prev)=>({
                ...prev,
                [type]: {
                    ...prev[type],
                    status: 'training',
                    progress: 0
                }
            }));
        const progressInterval = setInterval(()=>{
            setTrainingStatus((prev)=>{
                const currentProgress = prev[type].progress;
                if (currentProgress >= 100) {
                    clearInterval(progressInterval);
                    return {
                        ...prev,
                        [type]: {
                            status: 'completed',
                            last_trained: new Date().toISOString(),
                            progress: 100
                        }
                    };
                }
                return {
                    ...prev,
                    [type]: {
                        ...prev[type],
                        progress: currentProgress + 10
                    }
                };
            });
        }, 300);
        setTimeout(()=>{
            clearInterval(progressInterval);
            setTrainingStatus((prev)=>({
                    ...prev,
                    [type]: {
                        status: 'completed',
                        last_trained: new Date().toISOString(),
                        progress: 100
                    }
                }));
            setTimeout(()=>{
                setTrainingStatus((prev)=>({
                        ...prev,
                        [type]: {
                            ...prev[type],
                            status: 'idle',
                            progress: 0
                        }
                    }));
            }, 2000);
        }, 3500);
    };
    const resetKBForm = ()=>{
        setKbForm({
            title: '',
            content: '',
            content_type: 'article',
            category: '',
            tags: [],
            url: '',
            source_type: 'manual',
            file: null,
            is_active: true
        });
        setCurrentTag('');
        setUploadProgress(0);
    };
    const addTag = ()=>{
        if (currentTag.trim() && !kbForm.tags.includes(currentTag.trim())) {
            setKbForm({
                ...kbForm,
                tags: [
                    ...kbForm.tags,
                    currentTag.trim()
                ]
            });
            setCurrentTag('');
        }
    };
    const removeTag = (index)=>{
        setKbForm({
            ...kbForm,
            tags: kbForm.tags.filter((_, i)=>i !== index)
        });
    };
    const editKnowledgeBase = (item)=>{
        setEditingKBId(item.id);
        setKbForm({
            title: item.title,
            content: item.content,
            content_type: item.content_type,
            category: item.category || '',
            tags: item.tags || [],
            url: '',
            source_type: 'manual',
            file: null,
            is_active: item.is_active
        });
        setShowNewKBModal(true);
    };
    const deleteKnowledgeBase = async (id)=>{
        if (!confirm('Are you sure you want to delete this article?')) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_knowledge_base').delete().eq('id', id);
            if (error) throw error;
            loadKnowledgeBase();
        } catch (error) {
            alert('Failed to delete article: ' + error.message);
        }
    };
    const handleFileUpload = async (file)=>{
        setIsProcessing(true);
        setUploadProgress(0);
        try {
            const reader = new FileReader();
            reader.onprogress = (e)=>{
                if (e.lengthComputable) {
                    setUploadProgress(e.loaded / e.total * 100);
                }
            };
            reader.onload = async (e)=>{
                const text = e.target?.result;
                setKbForm((prev)=>({
                        ...prev,
                        content: text,
                        title: prev.title || file.name.replace(/\.[^/.]+$/, '')
                    }));
                setUploadProgress(100);
                setIsProcessing(false);
            };
            if (file.type === 'application/pdf') {
                alert('PDF parsing requires a backend service. Please copy/paste content for now.');
                setIsProcessing(false);
                return;
            }
            reader.readAsText(file);
        } catch (error) {
            alert('Failed to process file: ' + error.message);
            setIsProcessing(false);
        }
    };
    const handleURLIngestion = async (url)=>{
        setIsProcessing(true);
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const textContent = doc.body.innerText;
            setKbForm((prev)=>({
                    ...prev,
                    content: textContent,
                    url: url,
                    title: prev.title || doc.title || 'Imported from URL'
                }));
            alert('Content imported successfully from URL');
        } catch (error) {
            alert('Failed to fetch URL: ' + error.message);
        } finally{
            setIsProcessing(false);
        }
    };
    const handleSaveKnowledgeBase = async ()=>{
        if (!selectedBot || !kbForm.title || !kbForm.content) {
            alert('Please fill in title and content');
            return;
        }
        try {
            const kbData = {
                title: kbForm.title,
                content: kbForm.content,
                content_type: kbForm.content_type,
                category: kbForm.category || null,
                tags: kbForm.tags.length > 0 ? kbForm.tags : null,
                url: kbForm.url || null,
                is_active: kbForm.is_active,
                metadata: {
                    source_type: kbForm.source_type,
                    imported_at: new Date().toISOString()
                }
            };
            if (editingKBId) {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_knowledge_base').update(kbData).eq('id', editingKBId);
                if (error) throw error;
            } else {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].from('cb_knowledge_base').insert({
                    bot_id: selectedBot,
                    ...kbData
                });
                if (error) throw error;
            }
            setShowNewKBModal(false);
            setEditingKBId(null);
            resetKBForm();
            loadKnowledgeBase();
        } catch (error) {
            alert('Failed to save article: ' + error.message);
        }
    };
    if (dataLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1049,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400",
                        children: "Loading chatbot builder..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1050,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                lineNumber: 1048,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
            lineNumber: 1047,
            columnNumber: 7
        }, this);
    }
    const currentBot = bots.find((b)=>b.id === selectedBot);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold text-white mb-2 flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                            className: "w-8 h-8 text-[#39FF14]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1064,
                                            columnNumber: 15
                                        }, this),
                                        "AI Chatbot Builder"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 1063,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400",
                                    children: "Build intelligent conversational AI with advanced NLU and multi-turn conversations"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 1067,
                                    columnNumber: 13
                                }, this),
                                currentBot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-gray-500",
                                            children: "Current Bot:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1070,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: selectedBot || '',
                                            onChange: (e)=>setSelectedBot(e.target.value),
                                            className: "bg-gray-800 border border-gray-700 text-[#39FF14] font-medium px-2 py-1 rounded transition-colors focus:outline-none focus:border-[#39FF14]",
                                            children: bots.map((bot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: bot.id,
                                                    children: bot.name
                                                }, bot.id, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1077,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1071,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `px-2 py-1 rounded text-xs ${currentBot.status === 'active' ? 'bg-green-500/20 text-green-400' : currentBot.status === 'training' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`,
                                            children: currentBot.status
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1082,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded uppercase font-bold",
                                            children: currentBot.platform || 'web'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1089,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 1069,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 1062,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: seedSampleBots,
                                    disabled: dataLoading,
                                    className: "bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold border border-gray-700 hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                            className: "w-4 h-4 text-[#39FF14]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1101,
                                            columnNumber: 15
                                        }, this),
                                        "Load Sample Bots"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 1096,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1107,
                                            columnNumber: 15
                                        }, this),
                                        "New Chatbot"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 1104,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 1095,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                    lineNumber: 1061,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                lineNumber: 1060,
                columnNumber: 7
            }, this),
            bots.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gray-800 rounded-lg p-12 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                        className: "w-20 h-20 text-gray-600 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1116,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-bold text-white mb-2",
                        children: "No chatbots found"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1117,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 mb-6",
                        children: "Create your first AI chatbot to get started"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1118,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-[#39FF14] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#32e012] transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "w-5 h-5 inline mr-2"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1120,
                                columnNumber: 13
                            }, this),
                            "Create Chatbot"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1119,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                lineNumber: 1115,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-2 mb-6 overflow-x-auto pb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('dashboard'),
                                className: `px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1133,
                                        columnNumber: 15
                                    }, this),
                                    "Dashboard"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1127,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('intents'),
                                className: `px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'intents' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1142,
                                        columnNumber: 15
                                    }, this),
                                    "Intents (",
                                    intents.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1136,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('entities'),
                                className: `px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'entities' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1151,
                                        columnNumber: 15
                                    }, this),
                                    "Entities (",
                                    entities.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1145,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('chat'),
                                className: `px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'chat' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1160,
                                        columnNumber: 15
                                    }, this),
                                    "Test Chat"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1154,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('logs'),
                                className: `px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'logs' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1169,
                                        columnNumber: 15
                                    }, this),
                                    "Conversation Logs (",
                                    conversations.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1163,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('ml-settings'),
                                className: `px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'ml-settings' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1178,
                                        columnNumber: 15
                                    }, this),
                                    "ML Settings"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1172,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('knowledge-base'),
                                className: `px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'knowledge-base' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1187,
                                        columnNumber: 15
                                    }, this),
                                    "Knowledge Base (",
                                    knowledgeBase.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1181,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('integrations'),
                                className: `px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'integrations' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plug$3e$__["Plug"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1196,
                                        columnNumber: 15
                                    }, this),
                                    "Integrations (",
                                    integrations.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1190,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1126,
                        columnNumber: 11
                    }, this),
                    activeTab === 'dashboard' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                        className: "w-8 h-8 text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1206,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white/80 text-sm",
                                                        children: "Intents"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1207,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1205,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl font-bold text-white",
                                                children: intents.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1209,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white/70 text-sm mt-1",
                                                children: [
                                                    intents.filter((i)=>i.is_active).length,
                                                    " active"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1210,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1204,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                        className: "w-8 h-8 text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1215,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white/80 text-sm",
                                                        children: "Entities"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1216,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1214,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl font-bold text-white",
                                                children: entities.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1218,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white/70 text-sm mt-1",
                                                children: [
                                                    entities.filter((e)=>e.is_active).length,
                                                    " active"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1219,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1213,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                        className: "w-8 h-8 text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1224,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white/80 text-sm",
                                                        children: "Conversations"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1225,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1223,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl font-bold text-white",
                                                children: conversations.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1227,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white/70 text-sm mt-1",
                                                children: "Total sessions"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1228,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1222,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                        className: "w-8 h-8 text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1233,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white/80 text-sm",
                                                        children: "Engine"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1234,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1232,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-bold text-white",
                                                children: currentBot?.nlu_engine
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1236,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white/70 text-sm mt-1",
                                                children: "NLU Engine"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1237,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1231,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1203,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-800 rounded-lg p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-bold text-white mb-4",
                                        children: "Bot Configuration"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1242,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                                        children: "Bot Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1245,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-gray-700 rounded px-4 py-2 text-white",
                                                        children: currentBot?.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1246,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1244,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                                        children: "Language"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1249,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-gray-700 rounded px-4 py-2 text-white",
                                                        children: currentBot?.language
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1250,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1248,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                                        children: "Confidence Threshold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1253,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-gray-700 rounded px-4 py-2 text-white",
                                                        children: currentBot?.confidence_threshold
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1254,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1252,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                                        children: "Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1257,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `rounded px-4 py-2 font-medium ${currentBot?.status === 'active' ? 'bg-green-500/20 text-green-400' : currentBot?.status === 'training' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`,
                                                        children: currentBot?.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1258,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1256,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1243,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1241,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-800 rounded-lg p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-bold text-white mb-4",
                                        children: "Features Enabled"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1270,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 bg-gray-700 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-5 h-5 text-green-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1273,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "Multi-turn Conversations"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1274,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1272,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 bg-gray-700 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-5 h-5 text-green-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1277,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "Intent Recognition (ML)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1278,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1276,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 bg-gray-700 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-5 h-5 text-green-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1281,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "Entity Extraction (ML)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1282,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1280,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 bg-gray-700 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-5 h-5 text-green-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1285,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "API Tool Calling"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1286,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1284,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 bg-gray-700 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-5 h-5 text-green-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1289,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "Context Management"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1290,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1288,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 bg-gray-700 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-5 h-5 text-green-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1293,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "Knowledge Base RAG"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1294,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1292,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 bg-gray-700 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-5 h-5 text-green-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1297,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "Spacy Word Embeddings"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1298,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1296,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 bg-gray-700 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-5 h-5 text-green-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1301,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "Zero-shot NLU (LLM)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1302,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1300,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 bg-gray-700 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-5 h-5 text-green-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1305,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "Channel Integrations"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1306,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1304,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1271,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1269,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1202,
                        columnNumber: 13
                    }, this),
                    activeTab === 'intents' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white",
                                        children: "Intent Management"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1316,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setEditingIntentId(null);
                                            resetIntentForm();
                                            setShowNewIntentModal(true);
                                        },
                                        className: "bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1325,
                                                columnNumber: 19
                                            }, this),
                                            "New Intent"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1317,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1315,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-4",
                                children: intents.map((intent)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-800 rounded-lg p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-start mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3 mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-lg font-bold text-white",
                                                                        children: intent.intent_display_name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1336,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs text-gray-500 font-mono",
                                                                        children: [
                                                                            "(",
                                                                            intent.intent_name,
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1337,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    intent.is_system_intent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded",
                                                                        children: "System"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1339,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `px-2 py-1 text-xs rounded ${intent.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`,
                                                                        children: intent.is_active ? 'Active' : 'Inactive'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1341,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] text-xs rounded",
                                                                        children: [
                                                                            "Priority: ",
                                                                            intent.priority
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1346,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1335,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-gray-400 text-sm",
                                                                children: intent.intent_description
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1350,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1334,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>editIntent(intent),
                                                                className: "text-[#39FF14] hover:text-[#39FF14] p-2 hover:bg-[#39FF14]/20 rounded transition-colors",
                                                                title: "Edit Intent",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1358,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1353,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>deleteIntent(intent.id),
                                                                className: "text-red-400 hover:text-red-300 p-2 hover:bg-red-600/20 rounded transition-colors",
                                                                title: "Delete Intent",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1365,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1360,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1352,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1333,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-500",
                                                                children: [
                                                                    "Training Phrases (",
                                                                    intent.training_phrases.length,
                                                                    "):"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1371,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-2 mt-2",
                                                                children: [
                                                                    intent.training_phrases.slice(0, 5).map((phrase, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded",
                                                                            children: [
                                                                                '"',
                                                                                phrase,
                                                                                '"'
                                                                            ]
                                                                        }, idx, true, {
                                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                            lineNumber: 1374,
                                                                            columnNumber: 29
                                                                        }, this)),
                                                                    intent.training_phrases.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "px-2 py-1 bg-gray-700 text-gray-400 text-sm rounded",
                                                                        children: [
                                                                            "+",
                                                                            intent.training_phrases.length - 5,
                                                                            " more"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1379,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1372,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1370,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-4 text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500",
                                                                children: "Action:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1386,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `px-2 py-1 rounded text-xs ${intent.action_type === 'api' ? 'bg-[#39FF14]/20 text-[#39FF14]' : intent.action_type === 'text' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-gray-500/20 text-gray-400'}`,
                                                                children: intent.action_type
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1387,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1385,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1369,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, intent.id, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1332,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1330,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1314,
                        columnNumber: 13
                    }, this),
                    activeTab === 'entities' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white",
                                        children: "Entity Management"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1405,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setEditingEntityId(null);
                                            resetEntityForm();
                                            setShowNewEntityModal(true);
                                        },
                                        className: "bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1414,
                                                columnNumber: 19
                                            }, this),
                                            "New Entity"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1406,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1404,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: entities.map((entity)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-800 rounded-lg p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-start mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3 mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-lg font-bold text-white",
                                                                        children: entity.entity_display_name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1425,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `px-2 py-1 text-xs rounded ${entity.entity_type === 'system' ? 'bg-[#39FF14]/20 text-[#39FF14]' : entity.entity_type === 'regex' ? 'bg-[#39FF14]/20 text-[#39FF14]' : entity.entity_type === 'list' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`,
                                                                        children: entity.entity_type
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1426,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `px-2 py-1 text-xs rounded ${entity.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`,
                                                                        children: entity.is_active ? 'Active' : 'Inactive'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1434,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1424,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-gray-500 text-sm font-mono",
                                                                children: [
                                                                    "@",
                                                                    entity.entity_name
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1440,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1423,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>editEntity(entity),
                                                                className: "text-[#39FF14] hover:text-[#39FF14] p-2 hover:bg-[#39FF14]/20 rounded transition-colors",
                                                                title: "Edit Entity",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1448,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1443,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>deleteEntity(entity.id),
                                                                className: "text-red-400 hover:text-red-300 p-2 hover:bg-red-600/20 rounded transition-colors",
                                                                title: "Delete Entity",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1455,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1450,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1442,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1422,
                                                columnNumber: 21
                                            }, this),
                                            entity.regex_pattern && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 p-2 bg-gray-700 rounded",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-gray-400",
                                                        children: "Pattern:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1461,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                        className: "text-xs text-green-400 font-mono block mt-1",
                                                        children: entity.regex_pattern
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1462,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1460,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, entity.id, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1421,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1419,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1403,
                        columnNumber: 13
                    }, this),
                    activeTab === 'chat' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-2 bg-gray-800 rounded-lg p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-xl font-bold text-white",
                                                        children: "Chat Interface"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1476,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-400 text-sm",
                                                        children: "Test your chatbot with real LLM integration"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1477,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1475,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setTestConversation([]);
                                                        setTestSessionId('');
                                                    },
                                                    className: "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                                                    children: "Clear Chat"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1480,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1479,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1474,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 flex gap-2 items-center bg-gray-700 p-3 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-300 font-medium",
                                                children: "LLM Provider:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1493,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSelectedLLMProvider('openai'),
                                                className: `px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${selectedLLMProvider === 'openai' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`,
                                                children: "OpenAI"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1494,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSelectedLLMProvider('gemini'),
                                                className: `px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${selectedLLMProvider === 'gemini' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`,
                                                children: "Google Gemini"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1504,
                                                columnNumber: 19
                                            }, this),
                                            testSessionId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ml-auto flex items-center gap-2 text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-400",
                                                        children: "Session:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1516,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-300 font-mono",
                                                        children: [
                                                            testSessionId.substring(0, 8),
                                                            "..."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1517,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1515,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1492,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-900 rounded-lg h-96 overflow-y-auto p-4 mb-4",
                                        children: testConversation.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-center h-full text-gray-500",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                        className: "w-12 h-12 mx-auto mb-2 opacity-50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1526,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mb-2",
                                                        children: "Start a conversation to test your bot"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1527,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-600",
                                                        children: [
                                                            "Using ",
                                                            selectedLLMProvider === 'openai' ? 'OpenAI GPT' : 'Google Gemini'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1528,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1525,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1524,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                testConversation.map((msg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `max-w-[80%] rounded-lg p-3 ${msg.type === 'user' ? 'bg-[#39FF14] text-black font-semibold' : msg.isError ? 'bg-red-900/50 text-red-200 border border-red-700' : 'bg-gray-700 text-gray-200'}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm whitespace-pre-wrap",
                                                                    children: msg.text
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1542,
                                                                    columnNumber: 29
                                                                }, this),
                                                                msg.type === 'bot' && !msg.isError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-2 pt-2 border-t border-gray-600 space-y-1",
                                                                    children: [
                                                                        msg.intent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs opacity-75",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "Intent:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                                    lineNumber: 1547,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                " ",
                                                                                msg.intent,
                                                                                " (",
                                                                                (msg.confidence * 100).toFixed(1),
                                                                                "%)"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                            lineNumber: 1546,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        msg.provider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs opacity-75",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold",
                                                                                    children: "Model:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                                    lineNumber: 1552,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                " ",
                                                                                msg.provider,
                                                                                "/",
                                                                                msg.model
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                            lineNumber: 1551,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        msg.kb_used && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs text-green-400",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                    className: "w-3 h-3 inline mr-1"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                                    lineNumber: 1557,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                "Knowledge Base Used (",
                                                                                msg.metadata?.kb_matches || 0,
                                                                                " matches)"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                            lineNumber: 1556,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1544,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1535,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, idx, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1534,
                                                        columnNumber: 25
                                                    }, this)),
                                                isSendingMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-start",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-gray-700 text-gray-200 rounded-lg p-3",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"], {
                                                                    className: "w-4 h-4 animate-spin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1570,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm",
                                                                    children: "Thinking..."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1571,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1569,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1568,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1567,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1532,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1522,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: testMessage,
                                                onChange: (e)=>setTestMessage(e.target.value),
                                                onKeyPress: (e)=>e.key === 'Enter' && !e.shiftKey && handleTestMessage(),
                                                placeholder: "Type your message here...",
                                                disabled: isSendingMessage,
                                                className: "flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] disabled:opacity-50"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1581,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleTestMessage,
                                                disabled: isSendingMessage || !testMessage.trim(),
                                                className: "bg-[#39FF14] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                                children: isSendingMessage ? 'Sending...' : 'Send'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1590,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1580,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1473,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-800 rounded-lg p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-bold text-white mb-4",
                                        children: "Debug Info"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1601,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-900 rounded-lg p-4 h-[500px] overflow-y-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-gray-400 font-semibold mb-1",
                                                            children: "Configuration"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1605,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-gray-800 p-2 rounded",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-gray-300",
                                                                    children: [
                                                                        "Bot ID: ",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[#39FF14] font-mono",
                                                                            children: selectedBot
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                            lineNumber: 1607,
                                                                            columnNumber: 64
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1607,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-gray-300",
                                                                    children: [
                                                                        "Session ID: ",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[#39FF14] font-mono",
                                                                            children: testSessionId || 'Not started'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                            lineNumber: 1608,
                                                                            columnNumber: 68
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1608,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-gray-300",
                                                                    children: [
                                                                        "LLM Provider: ",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[#39FF14]",
                                                                            children: selectedLLMProvider
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                            lineNumber: 1609,
                                                                            columnNumber: 70
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1609,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-gray-300",
                                                                    children: [
                                                                        "Messages: ",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[#39FF14]",
                                                                            children: testConversation.length
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                            lineNumber: 1610,
                                                                            columnNumber: 66
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1610,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1606,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1604,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-gray-400 font-semibold mb-1",
                                                            children: "Last Response Metadata"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1615,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-gray-800 p-2 rounded",
                                                            children: testConversation.length > 0 && testConversation[testConversation.length - 1].type === 'bot' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                                className: "text-gray-300 font-mono whitespace-pre-wrap",
                                                                children: JSON.stringify(testConversation[testConversation.length - 1], null, 2)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1618,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-gray-500",
                                                                children: "No bot response yet"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1622,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1616,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1614,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1603,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1602,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1600,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1472,
                        columnNumber: 13
                    }, this),
                    activeTab === 'logs' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold text-white mb-4",
                                children: "Conversation Logs"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1634,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-800 rounded-lg overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            className: "bg-gray-700",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-left text-sm font-semibold text-gray-300",
                                                        children: "Session ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1639,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-left text-sm font-semibold text-gray-300",
                                                        children: "User"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1640,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-left text-sm font-semibold text-gray-300",
                                                        children: "Channel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1641,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-left text-sm font-semibold text-gray-300",
                                                        children: "Messages"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1642,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-left text-sm font-semibold text-gray-300",
                                                        children: "Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1643,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-left text-sm font-semibold text-gray-300",
                                                        children: "Started"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1644,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1638,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1637,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: conversations.map((conv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    onClick: ()=>loadConversationMessages(conv.id),
                                                    className: "border-t border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-3 text-sm text-gray-300 font-mono",
                                                            children: [
                                                                conv.session_id.substring(0, 12),
                                                                "..."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1654,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-3 text-sm text-gray-300",
                                                            children: conv.user_id
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1655,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-3 text-sm",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded",
                                                                children: conv.channel
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1657,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1656,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-3 text-sm text-gray-300",
                                                            children: conv.message_count
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1659,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-3 text-sm",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `px-2 py-1 text-xs rounded ${conv.status === 'completed' ? 'bg-green-500/20 text-green-400' : conv.status === 'active' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-gray-500/20 text-gray-400'}`,
                                                                children: conv.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1661,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1660,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-3 text-sm text-gray-400",
                                                            children: new Date(conv.started_at).toLocaleString()
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1669,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, conv.id, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1649,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1647,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 1636,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1635,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1633,
                        columnNumber: 13
                    }, this),
                    activeTab === 'ml-settings' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-white",
                                        children: "ML & NLU Configuration"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1681,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setEditingMLConfigId(null);
                                            resetMLConfigForm();
                                            setShowNewMLConfigModal(true);
                                        },
                                        className: "bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1690,
                                                columnNumber: 19
                                            }, this),
                                            "New ML Config"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1682,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1680,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-4",
                                children: mlConfigs.map((config)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-800 rounded-lg p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-start mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-bold text-white",
                                                                    children: config.config_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1701,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `px-2 py-1 text-xs rounded ${config.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`,
                                                                    children: config.is_active ? 'Active' : 'Inactive'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1702,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1700,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1699,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>editMLConfig(config),
                                                                className: "text-[#39FF14] hover:text-[#39FF14] p-2 hover:bg-[#39FF14]/20 rounded transition-colors",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1714,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1710,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>deleteMLConfig(config.id),
                                                                className: "text-red-400 hover:text-red-300 p-2 hover:bg-red-600/20 rounded transition-colors",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1720,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1716,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1709,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1698,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500",
                                                                children: "NLU Engine:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1726,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-white font-medium",
                                                                children: config.nlu_engine
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1727,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1725,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500",
                                                                children: "LLM Provider:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1730,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-white font-medium",
                                                                children: config.llm_provider
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1731,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1729,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500",
                                                                children: "Model:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1734,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-white font-medium",
                                                                children: config.llm_model
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1735,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1733,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500",
                                                                children: "Confidence:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1738,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-white font-medium",
                                                                children: [
                                                                    (config.confidence_threshold * 100).toFixed(0),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1739,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1737,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1724,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, config.id, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1697,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1695,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-800 rounded-lg p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                className: "w-5 h-5 text-yellow-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1748,
                                                columnNumber: 19
                                            }, this),
                                            "Training Status"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1747,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-gray-700 rounded-lg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-white font-semibold flex items-center gap-2",
                                                                        children: [
                                                                            "Intent Classifier",
                                                                            trainingStatus.intent_classifier.status === 'training' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "w-4 h-4 border-2 border-[#39FF14] border-t-transparent rounded-full animate-spin"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                                lineNumber: 1758,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            trainingStatus.intent_classifier.status === 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                className: "w-4 h-4 text-green-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                                lineNumber: 1761,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1755,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-gray-400 text-sm",
                                                                        children: trainingStatus.intent_classifier.last_trained ? `Last trained: ${new Date(trainingStatus.intent_classifier.last_trained).toLocaleString()}` : 'Never trained'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1764,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1754,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>startTraining('intent_classifier'),
                                                                disabled: trainingStatus.intent_classifier.status === 'training',
                                                                className: "bg-[#39FF14] text-black px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1775,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    "Train Now"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1770,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1753,
                                                        columnNumber: 21
                                                    }, this),
                                                    trainingStatus.intent_classifier.status === 'training' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-full bg-gray-600 rounded-full h-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bg-[#39FF14] h-2 rounded-full transition-all duration-300",
                                                                    style: {
                                                                        width: `${trainingStatus.intent_classifier.progress}%`
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1782,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1781,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-400 mt-2",
                                                                children: [
                                                                    "Training in progress... ",
                                                                    trainingStatus.intent_classifier.progress,
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1787,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1780,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1752,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-gray-700 rounded-lg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-white font-semibold flex items-center gap-2",
                                                                        children: [
                                                                            "Entity Extractor",
                                                                            trainingStatus.entity_extractor.status === 'training' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "w-4 h-4 border-2 border-[#39FF14] border-t-transparent rounded-full animate-spin"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                                lineNumber: 1798,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            trainingStatus.entity_extractor.status === 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                className: "w-4 h-4 text-green-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                                lineNumber: 1801,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1795,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-gray-400 text-sm",
                                                                        children: trainingStatus.entity_extractor.last_trained ? `Last trained: ${new Date(trainingStatus.entity_extractor.last_trained).toLocaleString()}` : 'Never trained'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1804,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1794,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>startTraining('entity_extractor'),
                                                                disabled: trainingStatus.entity_extractor.status === 'training',
                                                                className: "bg-[#39FF14] text-black px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1815,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    "Train Now"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1810,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1793,
                                                        columnNumber: 21
                                                    }, this),
                                                    trainingStatus.entity_extractor.status === 'training' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-full bg-gray-600 rounded-full h-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bg-[#39FF14] h-2 rounded-full transition-all duration-300",
                                                                    style: {
                                                                        width: `${trainingStatus.entity_extractor.progress}%`
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1822,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1821,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-400 mt-2",
                                                                children: [
                                                                    "Training in progress... ",
                                                                    trainingStatus.entity_extractor.progress,
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1827,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1820,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1792,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1751,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-6 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                    className: "w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1835,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-gray-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold text-[#39FF14] mb-1",
                                                            children: "Training Information"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1837,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: "Training uses your configured intents and entities to improve the NLU model. The process typically takes 3-5 seconds and includes data validation, feature extraction, and model optimization."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1838,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1836,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1834,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1833,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1746,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1679,
                        columnNumber: 13
                    }, this),
                    activeTab === 'knowledge-base' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white",
                                        children: "Knowledge Base & FAQ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1849,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowNewKBModal(true),
                                        className: "bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1854,
                                                columnNumber: 19
                                            }, this),
                                            "Add Article"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1850,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1848,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-4",
                                children: knowledgeBase.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-800 rounded-lg p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-start mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3 mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-lg font-bold text-white",
                                                                        children: item.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1865,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `px-2 py-1 text-xs rounded ${item.content_type === 'faq' ? 'bg-[#39FF14]/20 text-[#39FF14]' : item.content_type === 'article' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-gray-500/20 text-gray-400'}`,
                                                                        children: item.content_type
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1866,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    item.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded",
                                                                        children: item.category
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 1874,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1864,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-gray-400 text-sm line-clamp-2",
                                                                children: item.content
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1877,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1863,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>editKnowledgeBase(item),
                                                                className: "text-[#39FF14] hover:text-[#39FF14] p-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1884,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1880,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>deleteKnowledgeBase(item.id),
                                                                className: "text-red-400 hover:text-red-300 p-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 1890,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1886,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1879,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1862,
                                                columnNumber: 21
                                            }, this),
                                            item.tags && item.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-2 mt-2",
                                                children: item.tags.map((tag, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded",
                                                        children: [
                                                            "#",
                                                            tag
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1897,
                                                        columnNumber: 27
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 1895,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 1861,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1859,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1847,
                        columnNumber: 13
                    }, this),
                    activeTab === 'integrations' && selectedBot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Chatbot$2f$ChatbotIntegrations$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        botId: selectedBot
                    }, void 0, false, {
                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                        lineNumber: 1910,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true),
            showNewIntentModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative border border-gray-700 my-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setShowNewIntentModal(false);
                                setEditingIntentId(null);
                                resetIntentForm();
                            },
                            className: "absolute top-4 right-4 text-gray-400 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 1926,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 1918,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white mb-6 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                    className: "w-6 h-6 text-[#39FF14]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 1930,
                                    columnNumber: 15
                                }, this),
                                editingIntentId ? 'Edit Intent' : 'Create New Intent'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 1929,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Intent Name *"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1937,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: intentForm.intent_name,
                                                    onChange: (e)=>setIntentForm({
                                                            ...intentForm,
                                                            intent_name: e.target.value
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    placeholder: "greeting"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1938,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-1",
                                                    children: "Lowercase, no spaces (e.g., order_status)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1945,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1936,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Display Name *"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1949,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: intentForm.intent_display_name,
                                                    onChange: (e)=>setIntentForm({
                                                            ...intentForm,
                                                            intent_display_name: e.target.value
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    placeholder: "Greeting"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1950,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1948,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 1935,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Description"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1961,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: intentForm.intent_description,
                                            onChange: (e)=>setIntentForm({
                                                    ...intentForm,
                                                    intent_description: e.target.value
                                                }),
                                            className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] h-20",
                                            placeholder: "Describe what this intent represents..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1962,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 1960,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Training Phrases"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1971,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: currentPhrase,
                                                    onChange: (e)=>setCurrentPhrase(e.target.value),
                                                    onKeyPress: (e)=>e.key === 'Enter' && (e.preventDefault(), addTrainingPhrase()),
                                                    className: "flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    placeholder: "Enter a training phrase and press Enter"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1973,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: addTrainingPhrase,
                                                    className: "bg-[#39FF14] text-black px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 1985,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1981,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1972,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: intentForm.training_phrases.map((phrase, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white text-sm",
                                                            children: phrase
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1991,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>removeTrainingPhrase(idx),
                                                            className: "text-red-400 hover:text-red-300",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 1996,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 1992,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 1990,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 1988,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 mt-2",
                                            children: "Add at least 5 training phrases for better accuracy"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2001,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 1970,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Action Type"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2008,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: intentForm.action_type,
                                                    onChange: (e)=>setIntentForm({
                                                            ...intentForm,
                                                            action_type: e.target.value
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "text",
                                                            children: "Text Response"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2014,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "api",
                                                            children: "API Call"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2015,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "webhook",
                                                            children: "Webhook"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2016,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "knowledge_base",
                                                            children: "Knowledge Base"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2017,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2009,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2007,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Priority"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2022,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: intentForm.priority,
                                                    onChange: (e)=>setIntentForm({
                                                            ...intentForm,
                                                            priority: parseInt(e.target.value)
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    min: "1",
                                                    max: "10"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2023,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2021,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2034,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 h-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: intentForm.is_active,
                                                            onChange: (e)=>setIntentForm({
                                                                    ...intentForm,
                                                                    is_active: e.target.checked
                                                                }),
                                                            className: "w-5 h-5 rounded border-gray-700 bg-gray-800"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2036,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white",
                                                            children: "Active"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2042,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2035,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2033,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2006,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3 pt-4 border-t border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setShowNewIntentModal(false);
                                                setEditingIntentId(null);
                                                resetIntentForm();
                                            },
                                            className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2048,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSaveIntent,
                                            disabled: !intentForm.intent_name || !intentForm.intent_display_name,
                                            className: "flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
                                            children: editingIntentId ? 'Update Intent' : 'Create Intent'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2058,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2047,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 1934,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                    lineNumber: 1917,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                lineNumber: 1916,
                columnNumber: 9
            }, this),
            showNewEntityModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative border border-gray-700 my-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setShowNewEntityModal(false);
                                setEditingEntityId(null);
                                resetEntityForm();
                            },
                            className: "absolute top-4 right-4 text-gray-400 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 2082,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2074,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white mb-6 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                    className: "w-6 h-6 text-[#39FF14]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2086,
                                    columnNumber: 15
                                }, this),
                                editingEntityId ? 'Edit Entity' : 'Create New Entity'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2085,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Entity Name *"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2093,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: entityForm.entity_name,
                                                    onChange: (e)=>setEntityForm({
                                                            ...entityForm,
                                                            entity_name: e.target.value
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    placeholder: "product_name"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2094,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-1",
                                                    children: "Lowercase, no spaces (e.g., product_type)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2101,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2092,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Display Name *"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2105,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: entityForm.entity_display_name,
                                                    onChange: (e)=>setEntityForm({
                                                            ...entityForm,
                                                            entity_display_name: e.target.value
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    placeholder: "Product Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2106,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2104,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2091,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Entity Type"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2117,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: entityForm.entity_type,
                                            onChange: (e)=>setEntityForm({
                                                    ...entityForm,
                                                    entity_type: e.target.value
                                                }),
                                            className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "list",
                                                    children: "List - Predefined values with synonyms"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2123,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "regex",
                                                    children: "Regex - Pattern matching"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2124,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "system",
                                                    children: "System - Built-in (date, time, number, etc.)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2125,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2118,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2116,
                                    columnNumber: 15
                                }, this),
                                entityForm.entity_type === 'list' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Entity Values"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2131,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: currentEntityValue,
                                                    onChange: (e)=>setCurrentEntityValue(e.target.value),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    placeholder: "Enter value (e.g., laptop)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2133,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: currentEntitySynonyms,
                                                    onChange: (e)=>setCurrentEntitySynonyms(e.target.value),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    placeholder: "Enter synonyms separated by commas (e.g., notebook, computer)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2140,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: addEntityValue,
                                                    className: "w-full bg-[#39FF14] text-black px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors flex items-center justify-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2151,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Add Value"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2147,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2132,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: entityForm.values.map((val, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-gray-800 p-3 rounded-lg flex justify-between items-start",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-white font-semibold",
                                                                    children: val.value
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2159,
                                                                    columnNumber: 27
                                                                }, this),
                                                                val.synonyms && val.synonyms.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-gray-400 mt-1",
                                                                    children: [
                                                                        "Synonyms: ",
                                                                        val.synonyms.join(', ')
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2161,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2158,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>removeEntityValue(idx),
                                                            className: "text-red-400 hover:text-red-300",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 2170,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2166,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2157,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2155,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2130,
                                    columnNumber: 17
                                }, this),
                                entityForm.entity_type === 'regex' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Regex Pattern"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2180,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: entityForm.regex_pattern,
                                            onChange: (e)=>setEntityForm({
                                                    ...entityForm,
                                                    regex_pattern: e.target.value
                                                }),
                                            className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] font-mono text-sm",
                                            placeholder: "^[A-Z]{2}\\d{6}$"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2181,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 mt-1",
                                            children: "Enter a valid regular expression pattern"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2188,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2179,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2195,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: entityForm.is_active,
                                                    onChange: (e)=>setEntityForm({
                                                            ...entityForm,
                                                            is_active: e.target.checked
                                                        }),
                                                    className: "w-5 h-5 rounded border-gray-700 bg-gray-800"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2197,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white",
                                                    children: "Active"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2203,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2196,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2194,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3 pt-4 border-t border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setShowNewEntityModal(false);
                                                setEditingEntityId(null);
                                                resetEntityForm();
                                            },
                                            className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2208,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSaveEntity,
                                            disabled: !entityForm.entity_name || !entityForm.entity_display_name,
                                            className: "flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
                                            children: editingEntityId ? 'Update Entity' : 'Create Entity'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2218,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2207,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2090,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                    lineNumber: 2073,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                lineNumber: 2072,
                columnNumber: 9
            }, this),
            showNewMLConfigModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative border border-gray-700 my-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setShowNewMLConfigModal(false);
                                setEditingMLConfigId(null);
                                resetMLConfigForm();
                            },
                            className: "absolute top-4 right-4 text-gray-400 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 2242,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2234,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white mb-6 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
                                    className: "w-6 h-6 text-[#39FF14]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2246,
                                    columnNumber: 15
                                }, this),
                                editingMLConfigId ? 'Edit ML Configuration' : 'Create ML Configuration'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2245,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Configuration Name *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2252,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: mlConfigForm.config_name,
                                            onChange: (e)=>setMlConfigForm({
                                                    ...mlConfigForm,
                                                    config_name: e.target.value
                                                }),
                                            className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                            placeholder: "Production Config"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2253,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2251,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "NLU Engine"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2264,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: mlConfigForm.nlu_engine,
                                                    onChange: (e)=>setMlConfigForm({
                                                            ...mlConfigForm,
                                                            nlu_engine: e.target.value
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "spacy",
                                                            children: "Spacy (Word Embeddings)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2270,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "llm",
                                                            children: "LLM (Zero-shot)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2271,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "hybrid",
                                                            children: "Hybrid (Spacy + LLM)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2272,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "rasa",
                                                            children: "Rasa NLU"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2273,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "dialogflow",
                                                            children: "Dialogflow"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2274,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "luis",
                                                            children: "Microsoft LUIS"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2275,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2265,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2263,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "LLM Provider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2280,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: mlConfigForm.llm_provider,
                                                    onChange: (e)=>setMlConfigForm({
                                                            ...mlConfigForm,
                                                            llm_provider: e.target.value
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "openai",
                                                            children: "OpenAI"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2286,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "gemini",
                                                            children: "Google Gemini"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2287,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "anthropic",
                                                            children: "Anthropic (Claude)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2288,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "azure",
                                                            children: "Azure OpenAI"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2289,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "cohere",
                                                            children: "Cohere"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2290,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "huggingface",
                                                            children: "HuggingFace"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2291,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2281,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2279,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2262,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Model"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2298,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: mlConfigForm.llm_model,
                                                    onChange: (e)=>setMlConfigForm({
                                                            ...mlConfigForm,
                                                            llm_model: e.target.value
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    children: [
                                                        mlConfigForm.llm_provider === 'openai' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "gpt-4",
                                                                    children: "GPT-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2306,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "gpt-4-turbo",
                                                                    children: "GPT-4 Turbo"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2307,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "gpt-3.5-turbo",
                                                                    children: "GPT-3.5 Turbo"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2308,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true),
                                                        mlConfigForm.llm_provider === 'gemini' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "gemini-pro",
                                                                    children: "Gemini Pro"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2313,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "gemini-pro-vision",
                                                                    children: "Gemini Pro Vision"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2314,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "gemini-ultra",
                                                                    children: "Gemini Ultra"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2315,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true),
                                                        mlConfigForm.llm_provider === 'anthropic' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "claude-3-opus",
                                                                    children: "Claude 3 Opus"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2320,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "claude-3-sonnet",
                                                                    children: "Claude 3 Sonnet"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2321,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "claude-3-haiku",
                                                                    children: "Claude 3 Haiku"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2322,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true),
                                                        ![
                                                            'openai',
                                                            'gemini',
                                                            'anthropic'
                                                        ].includes(mlConfigForm.llm_provider) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "default",
                                                            children: "Default Model"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2326,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2299,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2297,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Confidence Threshold"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2332,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "0.05",
                                                    min: "0",
                                                    max: "1",
                                                    value: mlConfigForm.confidence_threshold,
                                                    onChange: (e)=>setMlConfigForm({
                                                            ...mlConfigForm,
                                                            confidence_threshold: parseFloat(e.target.value)
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2333,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-1",
                                                    children: "0.0 - 1.0 (higher = more strict)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2342,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2331,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2296,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Temperature"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2348,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "0.1",
                                                    min: "0",
                                                    max: "2",
                                                    value: mlConfigForm.temperature,
                                                    onChange: (e)=>setMlConfigForm({
                                                            ...mlConfigForm,
                                                            temperature: parseFloat(e.target.value)
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2349,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-1",
                                                    children: "0.0 = deterministic, 2.0 = creative"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2358,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2347,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Max Tokens"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2362,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "50",
                                                    min: "50",
                                                    max: "4000",
                                                    value: mlConfigForm.max_tokens,
                                                    onChange: (e)=>setMlConfigForm({
                                                            ...mlConfigForm,
                                                            max_tokens: parseInt(e.target.value)
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2363,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-1",
                                                    children: "Maximum response length"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2372,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2361,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2346,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2377,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: mlConfigForm.is_active,
                                                    onChange: (e)=>setMlConfigForm({
                                                            ...mlConfigForm,
                                                            is_active: e.target.checked
                                                        }),
                                                    className: "w-5 h-5 rounded border-gray-700 bg-gray-800"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2379,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white",
                                                    children: "Active Configuration"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2385,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2378,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2376,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3 pt-4 border-t border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setShowNewMLConfigModal(false);
                                                setEditingMLConfigId(null);
                                                resetMLConfigForm();
                                            },
                                            className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2390,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSaveMLConfig,
                                            disabled: !mlConfigForm.config_name,
                                            className: "flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
                                            children: editingMLConfigId ? 'Update Configuration' : 'Create Configuration'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2400,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2389,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2250,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                    lineNumber: 2233,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                lineNumber: 2232,
                columnNumber: 9
            }, this),
            showConversationModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full p-6 relative border border-gray-700 my-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setShowConversationModal(false);
                                setSelectedConversation(null);
                                setConversationMessages([]);
                            },
                            className: "absolute top-4 right-4 text-gray-400 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 2424,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2416,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white mb-6 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                    className: "w-6 h-6 text-[#39FF14]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2428,
                                    columnNumber: 15
                                }, this),
                                "Conversation Details"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2427,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800 rounded-lg p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-medium text-gray-400 mb-2",
                                            children: "Session Information"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2434,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-4 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-500",
                                                            children: "Session ID:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2437,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-white font-mono",
                                                            children: selectedConversation
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2438,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2436,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-500",
                                                            children: "Total Messages:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2441,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-white",
                                                            children: conversationMessages.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2442,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2440,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2435,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2433,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800 rounded-lg p-4 max-h-[600px] overflow-y-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-medium text-gray-400 mb-4",
                                            children: "Message History"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2448,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: conversationMessages.map((msg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex ${msg.message_type === 'user' ? 'justify-end' : 'justify-start'}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `max-w-[80%] rounded-lg p-4 ${msg.message_type === 'user' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-700 text-gray-200'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs font-semibold opacity-75",
                                                                        children: msg.message_type === 'user' ? 'User' : 'Bot'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 2456,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs opacity-60",
                                                                        children: new Date(msg.created_at).toLocaleTimeString()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                        lineNumber: 2459,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 2455,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm whitespace-pre-wrap",
                                                                children: msg.message_text
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 2463,
                                                                columnNumber: 25
                                                            }, this),
                                                            msg.detected_intent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-3 pt-3 border-t border-gray-600 text-xs",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "opacity-75",
                                                                            children: [
                                                                                "Intent: ",
                                                                                msg.detected_intent
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                            lineNumber: 2467,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        msg.intent_confidence && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "opacity-75",
                                                                            children: [
                                                                                "Confidence: ",
                                                                                (msg.intent_confidence * 100).toFixed(0),
                                                                                "%"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                            lineNumber: 2469,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2466,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 2465,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 2452,
                                                        columnNumber: 23
                                                    }, this)
                                                }, msg.id, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2451,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2449,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2447,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowConversationModal(false);
                                            setSelectedConversation(null);
                                            setConversationMessages([]);
                                        },
                                        className: "bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold",
                                        children: "Close"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                        lineNumber: 2483,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2482,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2432,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                    lineNumber: 2415,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                lineNumber: 2414,
                columnNumber: 9
            }, this),
            showNewKBModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full p-6 relative border border-gray-700 my-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setShowNewKBModal(false);
                                setEditingKBId(null);
                                resetKBForm();
                            },
                            className: "absolute top-4 right-4 text-gray-400 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                lineNumber: 2510,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2502,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white mb-6 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                    className: "w-6 h-6 text-[#39FF14]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2514,
                                    columnNumber: 15
                                }, this),
                                editingKBId ? 'Edit Article' : 'Add New Article'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2513,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 bg-gray-800 p-4 rounded-lg border border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setKbForm({
                                                    ...kbForm,
                                                    source_type: 'manual'
                                                }),
                                            className: `flex-1 py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${kbForm.source_type === 'manual' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2526,
                                                    columnNumber: 19
                                                }, this),
                                                "Manual Entry"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2520,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setKbForm({
                                                    ...kbForm,
                                                    source_type: 'upload'
                                                }),
                                            className: `flex-1 py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${kbForm.source_type === 'upload' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2535,
                                                    columnNumber: 19
                                                }, this),
                                                "Upload Document"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2529,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setKbForm({
                                                    ...kbForm,
                                                    source_type: 'url'
                                                }),
                                            className: `flex-1 py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${kbForm.source_type === 'url' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2544,
                                                    columnNumber: 19
                                                }, this),
                                                "Import from URL"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2538,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setKbForm({
                                                    ...kbForm,
                                                    source_type: 'storage'
                                                }),
                                            className: `flex-1 py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${kbForm.source_type === 'storage' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__["Server"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2553,
                                                    columnNumber: 19
                                                }, this),
                                                "Storage"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2547,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2519,
                                    columnNumber: 15
                                }, this),
                                kbForm.source_type === 'upload' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800 p-6 rounded-lg border border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-3",
                                            children: "Upload Document"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2560,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[#39FF14] transition-colors cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "file",
                                                    accept: ".txt,.md,.csv,.json,.xml,.html",
                                                    onChange: (e)=>{
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setKbForm({
                                                                ...kbForm,
                                                                file
                                                            });
                                                            handleFileUpload(file);
                                                        }
                                                    },
                                                    className: "hidden",
                                                    id: "file-upload"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2562,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "file-upload",
                                                    className: "cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                            className: "w-12 h-12 text-gray-500 mx-auto mb-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2576,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-white font-semibold mb-1",
                                                            children: "Click to upload or drag and drop"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2577,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-400 text-sm",
                                                            children: "Supported: TXT, MD, CSV, JSON, XML, HTML"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2578,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2575,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2561,
                                            columnNumber: 19
                                        }, this),
                                        isProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-[#39FF14] mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"], {
                                                            className: "w-4 h-4 animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2584,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm",
                                                            children: [
                                                                "Processing file... ",
                                                                Math.round(uploadProgress),
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2585,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2583,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full bg-gray-700 rounded-full h-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-[#39FF14] h-2 rounded-full transition-all duration-300",
                                                        style: {
                                                            width: `${uploadProgress}%`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 2588,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2587,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2582,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2559,
                                    columnNumber: 17
                                }, this),
                                kbForm.source_type === 'url' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800 p-6 rounded-lg border border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-3",
                                            children: "Import from URL"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2600,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "url",
                                                    value: kbForm.url,
                                                    onChange: (e)=>setKbForm({
                                                            ...kbForm,
                                                            url: e.target.value
                                                        }),
                                                    placeholder: "https://example.com/article",
                                                    className: "flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2602,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>kbForm.url && handleURLIngestion(kbForm.url),
                                                    disabled: !kbForm.url || isProcessing,
                                                    className: "bg-[#39FF14] text-black px-6 py-3 rounded-lg hover:bg-[#32e012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold",
                                                    children: isProcessing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"], {
                                                        className: "w-5 h-5 animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 2615,
                                                        columnNumber: 25
                                                    }, this) : 'Import'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2609,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2601,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 mt-2",
                                            children: "Paste a URL to import content from a webpage"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2621,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2599,
                                    columnNumber: 17
                                }, this),
                                kbForm.source_type === 'storage' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800 p-6 rounded-lg border border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-4",
                                            children: "Connect to Storage"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2627,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__["Server"], {
                                                                    className: "w-6 h-6 text-[#39FF14]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2631,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-white font-semibold",
                                                                    children: "FTP/SFTP"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2632,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2630,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-400 text-sm",
                                                            children: "Connect to FTP or SFTP server"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2634,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2629,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__["HardDrive"], {
                                                                    className: "w-6 h-6 text-green-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2638,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-white font-semibold",
                                                                    children: "NAS/SAN"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                    lineNumber: 2639,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2637,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-400 text-sm",
                                                            children: "Connect to network storage"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2641,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2636,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2628,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[#39FF14] text-sm",
                                                children: "Storage integrations require configuration. Contact your administrator to set up storage connections."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                lineNumber: 2645,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2644,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2626,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Title *"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2654,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: kbForm.title,
                                                    onChange: (e)=>setKbForm({
                                                            ...kbForm,
                                                            title: e.target.value
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    placeholder: "Article title"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2655,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2653,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: "Content Type"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2665,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: kbForm.content_type,
                                                    onChange: (e)=>setKbForm({
                                                            ...kbForm,
                                                            content_type: e.target.value
                                                        }),
                                                    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "article",
                                                            children: "Article"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2671,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "faq",
                                                            children: "FAQ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2672,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "documentation",
                                                            children: "Documentation"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2673,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "guide",
                                                            children: "Guide"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2674,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "policy",
                                                            children: "Policy"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2675,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2666,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2664,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2652,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Category"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2681,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: kbForm.category,
                                            onChange: (e)=>setKbForm({
                                                    ...kbForm,
                                                    category: e.target.value
                                                }),
                                            className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                            placeholder: "e.g., Product Info, Troubleshooting, Billing"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2682,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2680,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Content *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2692,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: kbForm.content,
                                            onChange: (e)=>setKbForm({
                                                    ...kbForm,
                                                    content: e.target.value
                                                }),
                                            className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] h-48 resize-none",
                                            placeholder: "Enter the article content..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2693,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 mt-1",
                                            children: [
                                                kbForm.content.length,
                                                " characters"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2699,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2691,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Tags"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2703,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: currentTag,
                                                    onChange: (e)=>setCurrentTag(e.target.value),
                                                    onKeyPress: (e)=>e.key === 'Enter' && (e.preventDefault(), addTag()),
                                                    className: "flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]",
                                                    placeholder: "Add tag and press Enter"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2705,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: addTag,
                                                    className: "bg-[#39FF14] text-black px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                        lineNumber: 2717,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2713,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2704,
                                            columnNumber: 17
                                        }, this),
                                        kbForm.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: kbForm.tags.map((tag, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white text-sm",
                                                            children: [
                                                                "#",
                                                                tag
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2724,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>removeTag(idx),
                                                            className: "text-red-400 hover:text-red-300",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                                lineNumber: 2729,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                            lineNumber: 2725,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2723,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2721,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2702,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            id: "kb-active",
                                            checked: kbForm.is_active,
                                            onChange: (e)=>setKbForm({
                                                    ...kbForm,
                                                    is_active: e.target.checked
                                                }),
                                            className: "w-5 h-5 rounded bg-gray-800 border-gray-700 text-[#39FF14] focus:ring-[#39FF14]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2738,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "kb-active",
                                            className: "text-gray-300 cursor-pointer",
                                            children: "Make this article active and searchable"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2745,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2737,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3 pt-4 border-t border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setShowNewKBModal(false);
                                                setEditingKBId(null);
                                                resetKBForm();
                                            },
                                            className: "bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2751,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSaveKnowledgeBase,
                                            className: "bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg transition-colors font-semibold flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                    className: "w-5 h-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                                    lineNumber: 2765,
                                                    columnNumber: 19
                                                }, this),
                                                editingKBId ? 'Update Article' : 'Save Article'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                            lineNumber: 2761,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                                    lineNumber: 2750,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                            lineNumber: 2518,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                    lineNumber: 2501,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
                lineNumber: 2500,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Chatbot/ChatbotBuilder.tsx",
        lineNumber: 1059,
        columnNumber: 5
    }, this);
}
_s(ChatbotBuilder, "tbIHPYJGjfRVyXSGsdjMqILcdMc=");
_c = ChatbotBuilder;
var _c;
__turbopack_context__.k.register(_c, "ChatbotBuilder");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_Chatbot_8acf9003._.js.map