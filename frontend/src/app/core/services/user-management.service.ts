import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';

import { User } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/auth';

  listUsers() {
    return this.http
      .get<{ results?: User[] } | User[]>(`${this.apiUrl}/users/`)
      .pipe(map((res) => (Array.isArray(res) ? res : res.results ?? [])));
  }

  createUser(payload: Partial<User> & { full_name: string; email: string; password: string }) {
    return this.http.post<User>(`${this.apiUrl}/users/`, payload);
  }

  updateUser(id: number, payload: Partial<User>) {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}/`, payload);
  }

  deleteUser(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}/`);
  }
}

