module.exports = [
"[project]/src/utils/ivrValidator.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNodeTypeDescription",
    ()=>getNodeTypeDescription,
    "validateIVRFlow",
    ()=>validateIVRFlow
]);
function validateIVRFlow(project) {
    const errors = [];
    project.pages.forEach((page)=>{
        // Check for start node
        const startNodes = page.nodes.filter((n)=>n.type === 'start');
        if (startNodes.length === 0) {
            errors.push({
                nodeId: 'page',
                type: 'error',
                message: `Page "${page.name}" must have a start node`
            });
        } else if (startNodes.length > 1) {
            errors.push({
                nodeId: startNodes[1].id,
                type: 'error',
                message: `Page "${page.name}" can only have one start node`
            });
        }
        // Check for end node
        const endNodes = page.nodes.filter((n)=>n.type === 'endFlow');
        if (endNodes.length === 0) {
            errors.push({
                nodeId: 'page',
                type: 'warning',
                message: `Page "${page.name}" should have at least one end flow node`
            });
        }
        // Validate each node
        page.nodes.forEach((node)=>{
            const nodeErrors = validateNode(node, page);
            errors.push(...nodeErrors);
        });
        // Validate connections
        const connectionErrors = validateConnections(page.nodes, page.connections);
        errors.push(...connectionErrors);
    });
    return errors;
}
/**
 * Validates an individual node
 */ function validateNode(node, page) {
    const errors = [];
    switch(node.type){
        case 'setParams':
            if (!node.parameters || Object.keys(node.parameters).length === 0) {
                errors.push({
                    nodeId: node.id,
                    type: 'warning',
                    message: 'SetParams node has no parameters defined',
                    field: 'parameters'
                });
            }
            break;
        case 'playMessage':
            if (!node.messages || node.messages.length === 0) {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'PlayMessage node must have at least one message',
                    field: 'messages'
                });
            }
            break;
        case 'getDigits':
            if (!node.resultVariable || node.resultVariable.trim() === '') {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'GetDigits node must specify a result variable',
                    field: 'resultVariable'
                });
            }
            if (!node.messages || node.messages.length === 0) {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'GetDigits node must have at least one message',
                    field: 'messages'
                });
            }
            if (node.maxDigits < node.minDigits) {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'Maximum digits cannot be less than minimum digits',
                    field: 'maxDigits'
                });
            }
            break;
        case 'playMenu':
            if (!node.options || node.options.length === 0) {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'PlayMenu node must have at least one option',
                    field: 'options'
                });
            }
            if (!node.messages || node.messages.length === 0) {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'PlayMenu node must have at least one message',
                    field: 'messages'
                });
            }
            break;
        case 'runScript':
            if (!node.script || node.script.trim() === '') {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'RunScript node must have a script',
                    field: 'script'
                });
            } else {
                // Basic JavaScript syntax validation
                try {
                    new Function(node.script);
                } catch (e) {
                    errors.push({
                        nodeId: node.id,
                        type: 'error',
                        message: `Script has syntax errors: ${e.message}`,
                        field: 'script'
                    });
                }
            }
            break;
        case 'switch':
            if (!node.variable || node.variable.trim() === '') {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'Switch node must specify a variable',
                    field: 'variable'
                });
            }
            if (!node.conditions || node.conditions.length === 0) {
                errors.push({
                    nodeId: node.id,
                    type: 'warning',
                    message: 'Switch node has no conditions',
                    field: 'conditions'
                });
            }
            break;
        case 'callAPI':
            if (!node.url || node.url.trim() === '') {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'CallAPI node must specify a URL',
                    field: 'url'
                });
            }
            if (!node.responseVariable || node.responseVariable.trim() === '') {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'CallAPI node must specify a response variable',
                    field: 'responseVariable'
                });
            }
            break;
        case 'endFlow':
            if (node.endType === 'transfer' && (!node.transferNumber || node.transferNumber.trim() === '')) {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'Transfer end flow must specify a transfer number',
                    field: 'transferNumber'
                });
            }
            break;
        case 'jumperExit':
            if (!node.jumperName || node.jumperName.trim() === '') {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'Jumper exit must specify a jumper name',
                    field: 'jumperName'
                });
            }
            break;
        case 'jumperEntry':
            if (!node.jumperName || node.jumperName.trim() === '') {
                errors.push({
                    nodeId: node.id,
                    type: 'error',
                    message: 'Jumper entry must specify a jumper name',
                    field: 'jumperName'
                });
            }
            break;
    }
    return errors;
}
/**
 * Validates connections between nodes
 */ function validateConnections(nodes, connections) {
    const errors = [];
    const nodeIds = new Set(nodes.map((n)=>n.id));
    // Check for invalid connections
    connections.forEach((conn)=>{
        if (!nodeIds.has(conn.from)) {
            errors.push({
                nodeId: conn.from,
                type: 'error',
                message: `Connection references non-existent node: ${conn.from}`
            });
        }
        if (!nodeIds.has(conn.to)) {
            errors.push({
                nodeId: conn.to,
                type: 'error',
                message: `Connection references non-existent node: ${conn.to}`
            });
        }
    });
    // Check for orphaned nodes (except start and end)
    nodes.forEach((node)=>{
        if (node.type !== 'start' && node.type !== 'endFlow') {
            const hasIncoming = connections.some((c)=>c.to === node.id);
            if (!hasIncoming) {
                errors.push({
                    nodeId: node.id,
                    type: 'warning',
                    message: `Node "${node.name}" has no incoming connections`
                });
            }
        }
        if (node.type !== 'endFlow' && node.type !== 'jumperExit') {
            const hasOutgoing = connections.some((c)=>c.from === node.id);
            if (!hasOutgoing) {
                errors.push({
                    nodeId: node.id,
                    type: 'warning',
                    message: `Node "${node.name}" has no outgoing connections`
                });
            }
        }
    });
    // Check for potential infinite loops
    checkForCycles(nodes, connections, errors);
    return errors;
}
/**
 * Checks for cycles in the flow that could create infinite loops
 */ function checkForCycles(nodes, connections, errors) {
    const adjacencyList = new Map();
    // Build adjacency list
    nodes.forEach((node)=>{
        adjacencyList.set(node.id, []);
    });
    connections.forEach((conn)=>{
        const neighbors = adjacencyList.get(conn.from) || [];
        neighbors.push(conn.to);
        adjacencyList.set(conn.from, neighbors);
    });
    // DFS to detect cycles
    const visited = new Set();
    const recursionStack = new Set();
    const cycleNodes = [];
    function dfs(nodeId) {
        visited.add(nodeId);
        recursionStack.add(nodeId);
        const neighbors = adjacencyList.get(nodeId) || [];
        for (const neighbor of neighbors){
            if (!visited.has(neighbor)) {
                if (dfs(neighbor)) {
                    cycleNodes.push(nodeId);
                    return true;
                }
            } else if (recursionStack.has(neighbor)) {
                cycleNodes.push(nodeId);
                cycleNodes.push(neighbor);
                return true;
            }
        }
        recursionStack.delete(nodeId);
        return false;
    }
    // Check all nodes
    for (const node of nodes){
        if (!visited.has(node.id)) {
            if (dfs(node.id)) {
                errors.push({
                    nodeId: cycleNodes[0],
                    type: 'warning',
                    message: `Potential infinite loop detected involving these nodes: ${cycleNodes.join(', ')}`
                });
                break;
            }
        }
    }
}
function getNodeTypeDescription(type) {
    const descriptions = {
        start: 'Flow Entry Point',
        setParams: 'Set Parameters',
        playMessage: 'Play Message',
        getDigits: 'Get User Input',
        playMenu: 'Menu Options',
        playConfirm: 'Confirmation Prompt',
        runScript: 'Run JavaScript',
        switch: 'Conditional Routing',
        callAPI: 'API Call',
        endFlow: 'End Call',
        connector: 'Visual Connector',
        jumperEntry: 'Jump Entry Point',
        jumperExit: 'Jump to Page'
    };
    return descriptions[type] || type;
}
}),
"[project]/src/contexts/IVRContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IVRProvider",
    ()=>IVRProvider,
    "useIVR",
    ()=>useIVR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$ivrValidator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/ivrValidator.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const IVRContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function useIVR() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(IVRContext);
    if (!context) {
        throw new Error('useIVR must be used within IVRProvider');
    }
    return context;
}
function IVRProvider({ children }) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        project: null,
        currentPage: null,
        selectedNodes: [],
        clipboard: [],
        history: [],
        historyIndex: -1,
        viewport: {
            x: 0,
            y: 0,
            zoom: 1
        },
        validationErrors: []
    });
    const saveToHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((project)=>{
        setState((prev)=>{
            const newHistory = prev.history.slice(0, prev.historyIndex + 1);
            newHistory.push(JSON.parse(JSON.stringify(project)));
            return {
                ...prev,
                history: newHistory.slice(-50),
                historyIndex: Math.min(newHistory.length - 1, 49)
            };
        });
    }, []);
    const createProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((name, description)=>{
        const newProject = {
            id: `project_${Date.now()}`,
            name,
            description,
            pages: [
                {
                    id: `page_${Date.now()}`,
                    name: 'Main',
                    nodes: [],
                    connections: []
                }
            ],
            variables: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'draft',
            version: 1
        };
        setState((prev)=>({
                ...prev,
                project: newProject,
                currentPage: newProject.pages[0].id,
                selectedNodes: [],
                history: [
                    newProject
                ],
                historyIndex: 0
            }));
    }, []);
    const loadProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((project)=>{
        setState((prev)=>({
                ...prev,
                project,
                currentPage: project.pages[0]?.id || null,
                selectedNodes: [],
                history: [
                    project
                ],
                historyIndex: 0
            }));
    }, []);
    const updateProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updates)=>{
        setState((prev)=>{
            if (!prev.project) return prev;
            const updatedProject = {
                ...prev.project,
                ...updates,
                updated_at: new Date().toISOString()
            };
            saveToHistory(updatedProject);
            return {
                ...prev,
                project: updatedProject
            };
        });
    }, [
        saveToHistory
    ]);
    const getCurrentPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!state.project || !state.currentPage) return null;
        return state.project.pages.find((p)=>p.id === state.currentPage) || null;
    }, [
        state.project,
        state.currentPage
    ]);
    const addPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((name)=>{
        setState((prev)=>{
            if (!prev.project) return prev;
            const newPage = {
                id: `page_${Date.now()}`,
                name,
                nodes: [],
                connections: []
            };
            const updatedProject = {
                ...prev.project,
                pages: [
                    ...prev.project.pages,
                    newPage
                ],
                updated_at: new Date().toISOString()
            };
            saveToHistory(updatedProject);
            return {
                ...prev,
                project: updatedProject,
                currentPage: newPage.id
            };
        });
    }, [
        saveToHistory
    ]);
    const deletePage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((pageId)=>{
        setState((prev)=>{
            if (!prev.project || prev.project.pages.length <= 1) return prev;
            const updatedPages = prev.project.pages.filter((p)=>p.id !== pageId);
            const updatedProject = {
                ...prev.project,
                pages: updatedPages,
                updated_at: new Date().toISOString()
            };
            saveToHistory(updatedProject);
            return {
                ...prev,
                project: updatedProject,
                currentPage: prev.currentPage === pageId ? updatedPages[0].id : prev.currentPage
            };
        });
    }, [
        saveToHistory
    ]);
    const setCurrentPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((pageId)=>{
        setState((prev)=>({
                ...prev,
                currentPage: pageId,
                selectedNodes: []
            }));
    }, []);
    const addNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((node)=>{
        setState((prev)=>{
            if (!prev.project || !prev.currentPage) return prev;
            const updatedPages = prev.project.pages.map((page)=>{
                if (page.id !== prev.currentPage) return page;
                return {
                    ...page,
                    nodes: [
                        ...page.nodes,
                        node
                    ]
                };
            });
            const updatedProject = {
                ...prev.project,
                pages: updatedPages,
                updated_at: new Date().toISOString()
            };
            saveToHistory(updatedProject);
            return {
                ...prev,
                project: updatedProject
            };
        });
    }, [
        saveToHistory
    ]);
    const updateNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nodeId, updates)=>{
        setState((prev)=>{
            if (!prev.project || !prev.currentPage) return prev;
            const updatedPages = prev.project.pages.map((page)=>{
                if (page.id !== prev.currentPage) return page;
                return {
                    ...page,
                    nodes: page.nodes.map((node)=>node.id === nodeId ? {
                            ...node,
                            ...updates
                        } : node)
                };
            });
            const updatedProject = {
                ...prev.project,
                pages: updatedPages,
                updated_at: new Date().toISOString()
            };
            saveToHistory(updatedProject);
            return {
                ...prev,
                project: updatedProject
            };
        });
    }, [
        saveToHistory
    ]);
    const deleteNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nodeId)=>{
        setState((prev)=>{
            if (!prev.project || !prev.currentPage) return prev;
            const updatedPages = prev.project.pages.map((page)=>{
                if (page.id !== prev.currentPage) return page;
                return {
                    ...page,
                    nodes: page.nodes.filter((n)=>n.id !== nodeId),
                    connections: page.connections.filter((c)=>c.from !== nodeId && c.to !== nodeId)
                };
            });
            const updatedProject = {
                ...prev.project,
                pages: updatedPages,
                updated_at: new Date().toISOString()
            };
            saveToHistory(updatedProject);
            return {
                ...prev,
                project: updatedProject,
                selectedNodes: prev.selectedNodes.filter((id)=>id !== nodeId)
            };
        });
    }, [
        saveToHistory
    ]);
    const deleteNodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nodeIds)=>{
        nodeIds.forEach((id)=>deleteNode(id));
    }, [
        deleteNode
    ]);
    const addConnection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((connection)=>{
        setState((prev)=>{
            if (!prev.project || !prev.currentPage) return prev;
            const updatedPages = prev.project.pages.map((page)=>{
                if (page.id !== prev.currentPage) return page;
                // Check if connection already exists
                const exists = page.connections.some((c)=>c.from === connection.from && c.to === connection.to);
                if (exists) return page;
                return {
                    ...page,
                    connections: [
                        ...page.connections,
                        connection
                    ]
                };
            });
            const updatedProject = {
                ...prev.project,
                pages: updatedPages,
                updated_at: new Date().toISOString()
            };
            saveToHistory(updatedProject);
            return {
                ...prev,
                project: updatedProject
            };
        });
    }, [
        saveToHistory
    ]);
    const deleteConnection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((connectionId)=>{
        setState((prev)=>{
            if (!prev.project || !prev.currentPage) return prev;
            const updatedPages = prev.project.pages.map((page)=>{
                if (page.id !== prev.currentPage) return page;
                return {
                    ...page,
                    connections: page.connections.filter((c)=>c.id !== connectionId)
                };
            });
            const updatedProject = {
                ...prev.project,
                pages: updatedPages,
                updated_at: new Date().toISOString()
            };
            saveToHistory(updatedProject);
            return {
                ...prev,
                project: updatedProject
            };
        });
    }, [
        saveToHistory
    ]);
    const selectNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nodeId, multi = false)=>{
        setState((prev)=>{
            if (multi) {
                const isSelected = prev.selectedNodes.includes(nodeId);
                return {
                    ...prev,
                    selectedNodes: isSelected ? prev.selectedNodes.filter((id)=>id !== nodeId) : [
                        ...prev.selectedNodes,
                        nodeId
                    ]
                };
            }
            return {
                ...prev,
                selectedNodes: [
                    nodeId
                ]
            };
        });
    }, []);
    const clearSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setState((prev)=>({
                ...prev,
                selectedNodes: []
            }));
    }, []);
    const copy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const currentPage = getCurrentPage();
        if (!currentPage) return;
        const selectedNodesData = currentPage.nodes.filter((n)=>state.selectedNodes.includes(n.id));
        setState((prev)=>({
                ...prev,
                clipboard: selectedNodesData
            }));
    }, [
        getCurrentPage,
        state.selectedNodes
    ]);
    const paste = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((position)=>{
        if (state.clipboard.length === 0) return;
        const offset = position || {
            x: 50,
            y: 50
        };
        const newNodes = state.clipboard.map((node)=>({
                ...node,
                id: `node_${Date.now()}_${Math.random()}`,
                position: {
                    x: node.position.x + offset.x,
                    y: node.position.y + offset.y
                }
            }));
        newNodes.forEach((node)=>addNode(node));
    }, [
        state.clipboard,
        addNode
    ]);
    const undo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setState((prev)=>{
            if (prev.historyIndex <= 0) return prev;
            const newIndex = prev.historyIndex - 1;
            return {
                ...prev,
                project: prev.history[newIndex],
                historyIndex: newIndex
            };
        });
    }, []);
    const redo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setState((prev)=>{
            if (prev.historyIndex >= prev.history.length - 1) return prev;
            const newIndex = prev.historyIndex + 1;
            return {
                ...prev,
                project: prev.history[newIndex],
                historyIndex: newIndex
            };
        });
    }, []);
    const setViewport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((viewport)=>{
        setState((prev)=>({
                ...prev,
                viewport: {
                    ...prev.viewport,
                    ...viewport
                }
            }));
    }, []);
    const validate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!state.project) return [];
        const errors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$ivrValidator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateIVRFlow"])(state.project);
        setState((prev)=>({
                ...prev,
                validationErrors: errors
            }));
        return errors;
    }, [
        state.project
    ]);
    const getSelectedNodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const currentPage = getCurrentPage();
        if (!currentPage) return [];
        return currentPage.nodes.filter((n)=>state.selectedNodes.includes(n.id));
    }, [
        getCurrentPage,
        state.selectedNodes
    ]);
    const value = {
        ...state,
        createProject,
        loadProject,
        updateProject,
        addPage,
        deletePage,
        setCurrentPage,
        addNode,
        updateNode,
        deleteNode,
        deleteNodes,
        addConnection,
        deleteConnection,
        selectNode,
        clearSelection,
        copy,
        paste,
        undo,
        redo,
        setViewport,
        validate,
        getCurrentPage,
        getSelectedNodes
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IVRContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/IVRContext.tsx",
        lineNumber: 457,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/stores/workflowStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWorkflowStore",
    ()=>useWorkflowStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/core/dist/esm/index.mjs [app-ssr] (ecmascript)");
;
;
const initialNodes = [
    {
        id: 'start-1',
        type: 'trigger',
        position: {
            x: 250,
            y: 100
        },
        data: {
            label: 'Start',
            triggerType: 'manual',
            icon: 'Play'
        }
    }
];
const useWorkflowStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        nodes: initialNodes,
        edges: [],
        selectedNode: null,
        workflowName: 'Untitled Workflow',
        workflowDescription: '',
        isDirty: false,
        setNodes: (nodes)=>set({
                nodes,
                isDirty: true
            }),
        setEdges: (edges)=>set({
                edges,
                isDirty: true
            }),
        onNodesChange: (changes)=>{
            set({
                nodes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyNodeChanges"])(changes, get().nodes),
                isDirty: true
            });
        },
        onEdgesChange: (changes)=>{
            set({
                edges: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyEdgeChanges"])(changes, get().edges),
                isDirty: true
            });
        },
        onConnect: (connection)=>{
            set({
                edges: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addEdge"])({
                    ...connection,
                    animated: true,
                    type: 'smoothstep'
                }, get().edges),
                isDirty: true
            });
        },
        addNode: (node)=>{
            set({
                nodes: [
                    ...get().nodes,
                    node
                ],
                isDirty: true
            });
        },
        deleteNode: (nodeId)=>{
            set({
                nodes: get().nodes.filter((n)=>n.id !== nodeId),
                edges: get().edges.filter((e)=>e.source !== nodeId && e.target !== nodeId),
                isDirty: true
            });
        },
        updateNode: (nodeId, data)=>{
            set({
                nodes: get().nodes.map((node)=>node.id === nodeId ? {
                        ...node,
                        data: {
                            ...node.data,
                            ...data
                        }
                    } : node),
                isDirty: true
            });
        },
        setSelectedNode: (node)=>set({
                selectedNode: node
            }),
        setWorkflowName: (name)=>set({
                workflowName: name,
                isDirty: true
            }),
        setWorkflowDescription: (description)=>set({
                workflowDescription: description,
                isDirty: true
            }),
        resetWorkflow: ()=>set({
                nodes: initialNodes,
                edges: [],
                selectedNode: null,
                workflowName: 'Untitled Workflow',
                workflowDescription: '',
                isDirty: false
            }),
        loadWorkflow: (nodes, edges, name, description)=>set({
                nodes,
                edges,
                workflowName: name,
                workflowDescription: description,
                isDirty: false
            })
    }));
}),
"[project]/src/app/[...slug]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DynamicPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2f$Dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Dashboard/Dashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Settings$2f$Settings$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Settings/Settings.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Campaigns$2f$CampaignManagementNew$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Campaigns/CampaignManagementNew.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$ProductCatalog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Management/ProductCatalog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$Billing$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Management/Billing.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$Resources$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Management/Resources.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$Reports$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Management/Reports.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$Recordings$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Management/Recordings.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Developer$2f$GetStarted$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Developer/GetStarted.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Developer$2f$Support$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Developer/Support.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Developer$2f$Documentation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Developer/Documentation.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Testing$2f$FeatureValidation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Testing/FeatureValidation.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$VideoAPI$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/VideoAPI.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkSMS$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/BulkSMS.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkRCS$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/BulkRCS.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkWhatsApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/BulkWhatsApp.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$VoiceAPI$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/VoiceAPI.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$ContactCenterNew$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/ContactCenterNew.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Chatbot$2f$ChatbotBuilder$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Chatbot/ChatbotBuilder.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$VoiceAgentPlatform$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/VoiceAgentPlatform.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$MeetingsAI$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/MeetingsAI.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Cart$2f$Cart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Cart/Cart.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$WorkFlow$2f$WorkFlowHub$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/WorkFlow/WorkFlowHub.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$APIMarketplace$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/APIMarketplace.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$EmailCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/EmailCampaigns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$TelcoAPI$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/TelcoAPI.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$TikTokCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/TikTokCampaigns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$InstagramCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/InstagramCampaigns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$FacebookCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/FacebookCampaigns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$YouTubeCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/YouTubeCampaigns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$LinkedInCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/LinkedInCampaigns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkViber$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/BulkViber.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkLine$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/BulkLine.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkWeChat$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Channels/BulkWeChat.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$Subscriptions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Management/Subscriptions.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$CustomersEnhanced$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Management/CustomersEnhanced.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function DynamicPage({ params }) {
    // Use React.use() to unwrap the promise in a client component
    const resolvedParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(params);
    const slug = resolvedParams.slug;
    const view = slug ? slug[0] : 'dashboard';
    switch(view){
        case 'dashboard':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2f$Dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 51,
                columnNumber: 14
            }, this);
        case 'product-catalog':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$ProductCatalog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 53,
                columnNumber: 14
            }, this);
        case 'billing':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$Billing$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 55,
                columnNumber: 14
            }, this);
        case 'settings':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Settings$2f$Settings$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 57,
                columnNumber: 14
            }, this);
        case 'subscriptions':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$Subscriptions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 59,
                columnNumber: 14
            }, this);
        case 'customers':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$CustomersEnhanced$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 61,
                columnNumber: 14
            }, this);
        case 'resources':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$Resources$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 63,
                columnNumber: 14
            }, this);
        case 'reports':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$Reports$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 65,
                columnNumber: 14
            }, this);
        case 'recordings':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Management$2f$Recordings$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 67,
                columnNumber: 14
            }, this);
        case 'campaigns':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Campaigns$2f$CampaignManagementNew$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 69,
                columnNumber: 14
            }, this);
        case 'workflow':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$WorkFlow$2f$WorkFlowHub$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 71,
                columnNumber: 14
            }, this);
        case 'get-started':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Developer$2f$GetStarted$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 73,
                columnNumber: 14
            }, this);
        case 'support':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Developer$2f$Support$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 75,
                columnNumber: 14
            }, this);
        case 'documentation':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Developer$2f$Documentation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 77,
                columnNumber: 14
            }, this);
        case 'feature-validation':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Testing$2f$FeatureValidation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 79,
                columnNumber: 14
            }, this);
        case 'tiktok':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$TikTokCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 81,
                columnNumber: 14
            }, this);
        case 'instagram':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$InstagramCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 83,
                columnNumber: 14
            }, this);
        case 'facebook':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$FacebookCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 85,
                columnNumber: 14
            }, this);
        case 'youtube':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$YouTubeCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 87,
                columnNumber: 14
            }, this);
        case 'linkedin':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$LinkedInCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 89,
                columnNumber: 14
            }, this);
        case 'viber':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkViber$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 91,
                columnNumber: 14
            }, this);
        case 'line':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkLine$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 93,
                columnNumber: 14
            }, this);
        case 'wechat':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkWeChat$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 95,
                columnNumber: 14
            }, this);
        case 'sms':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkSMS$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 97,
                columnNumber: 14
            }, this);
        case 'rcs':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkRCS$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 99,
                columnNumber: 14
            }, this);
        case 'whatsapp':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$BulkWhatsApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 101,
                columnNumber: 14
            }, this);
        case 'voice-api':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$VoiceAPI$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 103,
                columnNumber: 14
            }, this);
        case 'cc':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$ContactCenterNew$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 105,
                columnNumber: 14
            }, this);
        case 'chatbot':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Chatbot$2f$ChatbotBuilder$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 107,
                columnNumber: 14
            }, this);
        case 'voice-agent':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$VoiceAgentPlatform$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 109,
                columnNumber: 14
            }, this);
        case 'meetings-ai':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$MeetingsAI$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 111,
                columnNumber: 14
            }, this);
        case 'video-api':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$VideoAPI$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 113,
                columnNumber: 14
            }, this);
        case 'api-marketplace':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$APIMarketplace$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 115,
                columnNumber: 14
            }, this);
        case 'email':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$EmailCampaigns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 117,
                columnNumber: 14
            }, this);
        case 'telco-api':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Channels$2f$TelcoAPI$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                onNavigate: ()=>{}
            }, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 119,
                columnNumber: 14
            }, this); // Dummy onNavigate, ideally refactor component to use router
        case 'cart':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Cart$2f$Cart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                onNavigate: ()=>{}
            }, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 121,
                columnNumber: 14
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2f$Dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/[...slug]/page.tsx",
                lineNumber: 123,
                columnNumber: 14
            }, this);
    }
}
}),
];

//# sourceMappingURL=src_90d9b43c._.js.map