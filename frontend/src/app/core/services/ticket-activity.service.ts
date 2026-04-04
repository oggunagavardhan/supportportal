import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface TicketActivityData {
  date: string;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class TicketActivityService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/tickets';

  getTicketActivity(): Observable<TicketActivityData[]> {
    return this.http.get<TicketActivityData[]>(`${this.apiUrl}/activity/`);
  }
}
