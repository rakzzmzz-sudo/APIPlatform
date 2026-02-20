import { IVRNode, IVRProject, Connection, ValidationError, IVRPage } from '../types/ivr';

/**
 * Validates an IVR workflow and returns any errors or warnings
 */
export function validateIVRFlow(project: IVRProject): ValidationError[] {
  const errors: ValidationError[] = [];
  
  project.pages.forEach(page => {
    // Check for start node
    const startNodes = page.nodes.filter(n => n.type === 'start');
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
    const endNodes = page.nodes.filter(n => n.type === 'endFlow');
    if (endNodes.length === 0) {
      errors.push({
        nodeId: 'page',
        type: 'warning',
        message: `Page "${page.name}" should have at least one end flow node`
      });
    }

    // Validate each node
    page.nodes.forEach(node => {
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
 */
function validateNode(node: IVRNode, page: IVRPage): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (node.type) {
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
        } catch (e: any) {
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
 */
function validateConnections(nodes: IVRNode[], connections: Connection[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const nodeIds = new Set(nodes.map(n => n.id));

  // Check for invalid connections
  connections.forEach(conn => {
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
  nodes.forEach(node => {
    if (node.type !== 'start' && node.type !== 'endFlow') {
      const hasIncoming = connections.some(c => c.to === node.id);
      if (!hasIncoming) {
        errors.push({
          nodeId: node.id,
          type: 'warning',
          message: `Node "${node.name}" has no incoming connections`
        });
      }
    }
    
    if (node.type !== 'endFlow' && node.type !== 'jumperExit') {
      const hasOutgoing = connections.some(c => c.from === node.id);
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
 */
function checkForCycles(nodes: IVRNode[], connections: Connection[], errors: ValidationError[]): void {
  const adjacencyList: Map<string, string[]> = new Map();
  
  // Build adjacency list
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
  });
  
  connections.forEach(conn => {
    const neighbors = adjacencyList.get(conn.from) || [];
    neighbors.push(conn.to);
    adjacencyList.set(conn.from, neighbors);
  });

  // DFS to detect cycles
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycleNodes: string[] = [];

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
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
  for (const node of nodes) {
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

/**
 * Gets a human-readable description of a node type
 */
export function getNodeTypeDescription(type: string): string {
  const descriptions: Record<string, string> = {
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
