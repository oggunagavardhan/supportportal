import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Feedback, Notification, PaginatedResponse, Ticket, TicketUpdatePayload } from '../models/ticket.models';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/tickets';
  private notifyUrl = 'http://localhost:8000/api/notifications';
  private feedbackUrl = 'http://localhost:8000/api/feedback';

  list(filters: Record<string, string | number>) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.http.get<PaginatedResponse<Ticket>>(`${this.apiUrl}/`, { params });
  }

  get(id: string) {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}/`);
  }

  create(payload: FormData) {
    return this.http.post<Ticket>(`${this.apiUrl}/`, payload);
  }

  update(id: number, payload: TicketUpdatePayload) {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}/`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  addComment(id: number, payload: { message: string; is_internal: boolean }) {
    return this.http.post(`${this.apiUrl}/${id}/comments/`, payload);
  }

  dashboard() {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/dashboard/`);
  }

  getNotifications() {
    return this.http.get<PaginatedResponse<Notification>>(`${this.notifyUrl}/`);
  }

  createNotification(payload: { title: string; message: string; type: Notification['type']; read?: boolean; audience?: 'self' | 'agent' | 'customer' | 'all' }) {
    return this.http.post<Notification>(`${this.notifyUrl}/`, payload);
  }

  updateNotification(id: number, payload: Partial<{ title: string; message: string; type: Notification['type']; read: boolean }>) {
    return this.http.patch<Notification>(`${this.notifyUrl}/${id}/`, payload);
  }

  deleteNotification(id: number) {
    return this.http.delete<void>(`${this.notifyUrl}/${id}/`);
  }

  markAllNotificationsRead() {
    return this.http.post(`${this.notifyUrl}/mark_all_read/`, {});
  }

  submitFeedback(payload: { rating: number; category: string; comments: string }) {
    return this.http.post<Feedback>(`${this.feedbackUrl}/`, payload);
  }

  updateFeedback(id: number, payload: { rating: number; category: string; comments: string }) {
    return this.http.patch<Feedback>(`${this.feedbackUrl}/${id}/`, payload);
  }

  deleteFeedback(id: number) {
    return this.http.delete<void>(`${this.feedbackUrl}/${id}/`);
  }

  listFeedback(filters: Record<string, string | number> = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.http.get<PaginatedResponse<Feedback>>(`${this.feedbackUrl}/`, { params });
  }
}
