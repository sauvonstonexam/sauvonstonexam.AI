export interface User {
  id: string;
  email: string;
  full_name: string;
  class: string;
  heard_from: string;
  tokens_month: number;
  tokens_day: number;
  status: 'free' | 'paid';
  is_admin: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  text: string;
  images?: string[];
  youtube?: string;
  source_url?: string;
  created_at: string;
}

export interface Credential {
  id: string;
  name: string;
  value: string;
  send_to_chat_webhook: boolean;
  send_to_payment_webhook: boolean;
  updated_at: string;
  updated_by: string;
}

export interface Parameter {
  id: string;
  name: string;
  value: string;
  type: 'api' | 'ads' | 'payment' | 'webhook' | 'iframe_url';
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  headers: Record<string, string>;
  created_at: string;
}
