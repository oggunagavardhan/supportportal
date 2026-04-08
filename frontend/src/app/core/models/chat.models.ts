export interface ChatSession {
  id: number;
  user: number;
  user_name?: string;
  user_role?: string;
  agent?: number | null;
  agent_name?: string | null;
  status: 'pending' | 'active' | 'closed';
  created_at: string;
}

export interface ChatMessage {
  id: number;
  session: number;
  message: string;
  sender_type: 'user' | 'bot' | 'agent';
  timestamp: string;
}
