// IVR Workflow Type Definitions

export type NodeType = 
  | 'start'
  | 'setParams'
  | 'playMessage'
  | 'getDigits'
  | 'playMenu'
  | 'playConfirm'
  | 'runScript'
  | 'switch'
  | 'callAPI'
  | 'endFlow'
  | 'connector'
  | 'jumperEntry'
  | 'jumperExit';

export type EndFlowType = 'disconnect' | 'transfer';

export interface Position {
  x: number;
  y: number;
}

export interface MessageItem {
  id: string;
  type: 'text' | 'audio' | 'ssml' | 'number' | 'date';
  value: string;
  voice?: string;
  language?: string;
}

export interface BaseNode {
  id: string;
  type: NodeType;
  position: Position;
  name: string;
  description?: string;
}

export interface StartNode extends BaseNode {
  type: 'start';
}

export interface SetParamsNode extends BaseNode {
  type: 'setParams';
  parameters: Record<string, any>;
  variables: Record<string, any>;
}

export interface PlayMessageNode extends BaseNode {
  type: 'playMessage';
  messages: MessageItem[];
  voice?: string;
  language?: string;
  loop?: number;
  bargeIn?: boolean;
}

export interface GetDigitsNode extends BaseNode {
  type: 'getDigits';
  messages: MessageItem[];
  resultVariable: string;
  minDigits: number;
  maxDigits: number;
  timeout: number;
  finishOnKey?: string;
  attempts?: number;
  invalidMessage?: MessageItem[];
}

export interface PlayMenuNode extends BaseNode {
  type: 'playMenu';
  messages: MessageItem[];
  options: MenuOption[];
  timeout: number;
  attempts: number;
  invalidMessage?: MessageItem[];
}

export interface MenuOption {
  key: string;
  label: string;
  action: string;
}

export interface PlayConfirmNode extends BaseNode {
  type: 'playConfirm';
  messages: MessageItem[];
  confirmKey: string;
  cancelKey: string;
  timeout: number;
}

export interface RunScriptNode extends BaseNode {
  type: 'runScript';
  script: string;
  variables: string[];
}

export interface SwitchNode extends BaseNode {
  type: 'switch';
  variable: string;
  conditions: SwitchCondition[];
  defaultAction: string;
}

export interface SwitchCondition {
  condition: string;
  label: string;
  action: string;
}

export interface CallAPINode extends BaseNode {
  type: 'callAPI';
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  responseVariable: string;
  timeout?: number;
}

export interface EndFlowNode extends BaseNode {
  type: 'endFlow';
  endType: EndFlowType;
  transferNumber?: string;
  message?: MessageItem[];
}

export interface ConnectorNode extends BaseNode {
  type: 'connector';
  label?: string;
}

export interface JumperEntryNode extends BaseNode {
  type: 'jumperEntry';
  jumperName: string;
}

export interface JumperExitNode extends BaseNode {
  type: 'jumperExit';
  jumperName: string;
  targetPage?: string;
}

export type IVRNode = 
  | StartNode
  | SetParamsNode
  | PlayMessageNode
  | GetDigitsNode
  | PlayMenuNode
  | PlayConfirmNode
  | RunScriptNode
  | SwitchNode
  | CallAPINode
  | EndFlowNode
  | ConnectorNode
  | JumperEntryNode
  | JumperExitNode;

export interface Connection {
  id: string;
  from: string;
  to: string;
  fromPort?: string;
  toPort?: string;
  label?: string;
}

export interface IVRPage {
  id: string;
  name: string;
  nodes: IVRNode[];
  connections: Connection[];
}

export interface IVRProject {
  id: string;
  name: string;
  description?: string;
  pages: IVRPage[];
  variables: Record<string, any>;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'active' | 'archived';
  version: number;
}

export interface ValidationError {
  nodeId: string;
  type: 'error' | 'warning';
  message: string;
  field?: string;
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface IVRContextState {
  project: IVRProject | null;
  currentPage: string | null;
  selectedNodes: string[];
  clipboard: IVRNode[];
  history: IVRProject[];
  historyIndex: number;
  viewport: CanvasViewport;
  validationErrors: ValidationError[];
}
