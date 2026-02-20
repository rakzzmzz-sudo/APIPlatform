// Get the correct base URL at request time (not at module load)
// so window.location.origin is available on the client
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9999';
};
const dbAnonKey = process.env.NEXT_PUBLIC_DATABASE_ANON_KEY || 'mock-key';


class AppDbClient {
  private tableName: string | null = null;
  private filters: any[] = [];
  private _order: any = null;
  private limitCount: number | null = null;
  private isSingle: boolean = false;
  private operation: string = 'select';
  private operationData: any = null;

  constructor() {}
  
  // Auth namespace (mock)
  get auth() {
     return {
         getUser: async () => {
             // Return admin user for dev
             return { 
                 data: { 
                     user: { 
                         id: 'admin_user_id', 
                         email: 'admin@platform.com',
                         app_metadata: { role: 'admin', tenant_id: 'default_tenant' },
                         user_metadata: { full_name: 'Platform Admin' }
                     } 
                 }, 
                 error: null 
             };
         },
         signInWithPassword: async () => ({ data: { user: {}, session: {} }, error: null }),
         signUp: async (options: { email: string; password: string }) => ({ data: { user: { id: 'new_user_id' } }, error: null }),
         signOut: async () => ({ error: null }),
         onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
         getSession: async () => ({ 
           data: { 
             session: { 
               access_token: 'mock_token',
               user: { 
                 id: 'admin_user_id', 
                 email: 'admin@platform.com',
                 app_metadata: { role: 'admin', tenant_id: 'default_tenant' },
                 user_metadata: { full_name: 'Platform Admin' }
               }
             } 
           }, 
           error: null 
         }),
     }
  }

  from(table: string) {
    const instance = new AppDbClient();
    instance.tableName = table;
    return instance;
  }

  select(columns: string = '*') {
    this.operation = 'select';
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }
  
  neq(column: string, value: any) {
    this.filters.push({ column, operator: 'neq', value });
    return this;
  }
  
  gt(column: string, value: any) {
    this.filters.push({ column, operator: 'gt', value });
    return this;
  }
  
  gte(column: string, value: any) {
    this.filters.push({ column, operator: 'gte', value });
    return this;
  }
  
  lt(column: string, value: any) {
    this.filters.push({ column, operator: 'lt', value });
    return this;
  }
  
  lte(column: string, value: any) {
    this.filters.push({ column, operator: 'lte', value });
    return this;
  }
  
  like(column: string, value: any) {
    this.filters.push({ column, operator: 'like', value });
    return this;
  }
  
  ilike(column: string, value: any) {
      this.filters.push({ column, operator: 'ilike', value });
      return this;
  }
  
  in(column: string, values: any[]) {
      this.filters.push({ column, operator: 'in', value: values });
      return this;
  }

  order(column: string, { ascending = true }: { ascending?: boolean } = {}) {
    this._order = { [column]: ascending ? 'asc' : 'desc' };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isSingle = true;
    return this;
  }

  insert(data: any) {
    this.operation = 'insert';
    this.operationData = data;
    return this;
  }
  
  update(data: any) {
    this.operation = 'update';
    this.operationData = data;
    return this;
  }
  
  delete() {
    this.operation = 'delete';
    return this;
  }

  channel(name: string) {
      return this;
  }
  
  removeChannel(channel: any) {
      return Promise.resolve();
  }
  
  removeAllChannels() {
      return Promise.resolve();
  }
  
  // Realtime mocks
  on(event: string, filterOrCallback: any, callback?: any) {
      return this;
  }
  
  subscribe(callback?: (status: string, err?: any) => void) {
      return this;
  }
  
  unsubscribe() {
      return Promise.resolve();
  }

  // Final execution method
  async then(resolve: any, reject: any) {
    try {
        const result = await this.execute(this.operation, this.operationData);
        resolve(result);
    } catch (e) {
        reject(e);
    }
  }

  private async execute(operation: string, data: any = null) {
      if (!this.tableName) {
          return { data: null, error: { message: 'Table not defined' } };
      }

      try {
          // Resolve base URL at request time so window.location.origin is always correct
          const baseUrl = getBaseUrl();
          const endpoint = `${baseUrl}/api/db/${this.tableName}`;
          
          const payload = {
              operation,
              filters: this.filters,
              orderBy: this._order,
              limit: this.limitCount,
              single: this.isSingle,
              data
          };

          const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (!response.ok) {
               const err = await response.json();
               return { data: null, error: err.error || { message: 'Request failed' } };
          }

          return await response.json();

      } catch (error: any) {
          console.error('App DB Error:', error);
          return { data: null, error: { message: error.message } };
      }
  }
}

// Export singleton
export const db = new AppDbClient() as any;

export type User = {
  id: string;
  aud: string;
  role: string | null;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    [key: string]: any;
  };
  identities?: any[];
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  organization_name: string | null;
  balance: number;
  role: 'admin' | 'developer' | 'user';
  created_at: string;
  updated_at: string;
};
// ... other types can remain ...

export type Channel = {
  id: string;
  user_id: string;
  name: string;
  type: 'sms' | 'rcs' | 'whatsapp' | 'voice' | 'video' | 'facebook_messenger' | 'email';
  status: 'active' | 'inactive' | 'suspended';
  configuration: Record<string, unknown>;
  api_endpoint: string | null;
  daily_limit: number;
  rate_limit: number;
  created_at: string;
  updated_at: string;
};

export type Campaign = {
  id: string;
  user_id: string;
  channel_id: string | null;
  name: string;
  description: string | null;
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'failed';
  channel_type: string;
  target_audience: Record<string, unknown>;
  message_template: string | null;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  total_recipients: number;
  messages_sent: number;
  messages_delivered: number;
  messages_failed: number;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  user_id: string;
  campaign_id: string | null;
  channel_id: string | null;
  channel_type: string;
  recipient: string;
  content: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'read';
  direction: 'inbound' | 'outbound';
  cost: number;
  metadata: Record<string, unknown>;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
};

export type Analytics = {
  id: string;
  user_id: string;
  channel_type: string;
  date: string;
  hour: number | null;
  messages_sent: number;
  messages_delivered: number;
  messages_failed: number;
  delivery_rate: number;
  total_cost: number;
  created_at: string;
};
