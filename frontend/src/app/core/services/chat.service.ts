import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ChatMessage, ChatSession } from '../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/chat';

  sendMessage(payload: { message: string; session_id?: number | null }) {
    return this.http.post<{ session: ChatSession; user_message: ChatMessage; bot_message?: ChatMessage }>(
      `${this.apiUrl}/send`,
      payload,
    );
  }

  listSessions(mode?: 'admin' | 'customer') {
    const suffix = mode ? `?mode=${mode}` : '';
    return this.http.get<ChatSession[]>(`${this.apiUrl}/sessions${suffix}`);
  }

  listPendingSessions() {
    return this.http.get<ChatSession[]>(`${this.apiUrl}/sessions/pending`);
  }

  connectAgent(session_id: number) {
    return this.http.post<ChatSession>(`${this.apiUrl}/connect-agent`, { session_id });
  }

  startAdminChat(admin_id?: number | null) {
    const payload = admin_id ? { admin_id } : {};
    return this.http.post<ChatSession>(`${this.apiUrl}/start-admin`, payload);
  }

  startAgentChat(agent_id: number) {
    return this.http.post<ChatSession>(`${this.apiUrl}/start-agent`, { agent_id });
  }

  startCustomerChat() {
    return this.http.post<{ session: ChatSession; bot_message: ChatMessage }>(
      `${this.apiUrl}/start-customer`,
      {},
    );
  }

  getHistory(session_id: number) {
    return this.http.get<{ session: ChatSession; messages: ChatMessage[] }>(
      `${this.apiUrl}/history/${session_id}`,
    );
  }
}
