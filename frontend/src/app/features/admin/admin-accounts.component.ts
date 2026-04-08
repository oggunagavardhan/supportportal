import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserManagementService } from '../../core/services/user-management.service';
import { User } from '../../core/models/auth.models';

type AdminViewType = 'users' | 'agents';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <section class="page-shell admin-shell">
      <mat-card class="admin-card">
        <div class="section-header">
          <div>
            <div class="chip">{{ viewType === 'users' ? 'Customers' : 'Agents' }}</div>
            <h1>{{ viewType === 'users' ? 'User Management' : 'Agent Management' }}</h1>
          </div>
        </div>

        <mat-card class="sub-card">
          <h2>Create Account</h2>
          <form [formGroup]="createForm" (ngSubmit)="create()">
            <div class="grid">
              <mat-form-field appearance="outline" floatLabel="always">
                <mat-label>Full name</mat-label>
                <input matInput formControlName="full_name" placeholder="Enter full name" />
              </mat-form-field>

              <mat-form-field appearance="outline" floatLabel="always">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" placeholder="Enter email" />
              </mat-form-field>

              <mat-form-field appearance="outline" floatLabel="always">
                <mat-label>Password</mat-label>
                <input matInput type="password" formControlName="password" placeholder="8+ characters: A-Z, a-z, 0-9, #@$" />
              </mat-form-field>
            </div>

            <button mat-flat-button class="create-btn" type="submit" [disabled]="createForm.invalid || isCreateBusy">
              {{ isCreateBusy ? 'Creating...' : 'Create' }}
            </button>
          </form>
        </mat-card>

        <mat-card class="sub-card" *ngIf="canListRecords">
          <div class="list-header">
            <h2>Records</h2>
            <div class="hint">{{ viewType === 'users' ? 'Customer accounts' : 'Agent accounts' }}</div>
          </div>

          <div class="list" *ngIf="users.length; else emptyState">
            <div class="row" *ngFor="let u of users">
              <div class="left">
                <div class="name">{{ u.full_name }}</div>
                <div class="meta">
                  {{ u.email }} - {{ u.role | titlecase }}
                  <span *ngIf="u.is_superuser" class="pill super">Super admin</span>
                </div>
              </div>
              <div class="right" *ngIf="canManageRecords">
                <button mat-stroked-button class="edit-btn" type="button" (click)="startEdit(u)">Edit</button>
                <button mat-stroked-button class="delete-btn" type="button" (click)="remove(u)">Delete</button>
              </div>
            </div>
          </div>

          <ng-template #emptyState>
            <div class="empty">No matching records found.</div>
          </ng-template>

          <div class="edit" *ngIf="editUser && canManageRecords">
            <h3>Edit Account</h3>
            <form [formGroup]="editForm" (ngSubmit)="saveEdit()">
              <div class="grid">
                <mat-form-field appearance="outline" floatLabel="always">
                  <mat-label>Full name</mat-label>
                  <input matInput formControlName="full_name" placeholder="Enter full name" />
                </mat-form-field>
                <mat-form-field appearance="outline" floatLabel="always">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" placeholder="Enter email" />
                </mat-form-field>
                <mat-form-field appearance="outline" floatLabel="always">
                  <mat-label>Password</mat-label>
                  <input matInput type="password" formControlName="password" placeholder="8+ chars: A-Z, a-z, 0-9, #@$ (or leave blank)" />
                </mat-form-field>
              </div>

              <button mat-flat-button color="primary" type="submit" [disabled]="editForm.invalid || isEditBusy">
                {{ isEditBusy ? 'Saving...' : 'Save' }}
              </button>
              <button mat-stroked-button type="button" (click)="cancelEdit()">Cancel</button>
            </form>
          </div>
        </mat-card>
      </mat-card>
    </section>
  `,
  styles: [`
    .admin-shell {
      padding: 18px;
    }
    .admin-card {
      padding: 22px;
      border-radius: 22px;
      border: 1px solid var(--border);
      background:
        radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.12), transparent 42%),
        radial-gradient(circle at 100% 100%, rgba(14, 165, 233, 0.10), transparent 38%),
        var(--surface);
      box-shadow: 0 20px 36px rgba(15, 23, 42, 0.08);
    }
    .section-header {
      margin-bottom: 10px;
    }
    h1 {
      margin: 10px 0 0;
      font-size: 28px;
      color: #143b7a;
      letter-spacing: 0.01em;
    }
    .sub-card {
      margin-top: 16px;
      padding: 18px;
      border-radius: 18px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.88);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }
    h2,
    h3 {
      margin: 0 0 12px;
      color: #1e3a8a;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      align-items: center;
    }
    form {
      display: grid;
      gap: 12px;
    }
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 10px;
      gap: 10px;
    }
    .hint {
      color: var(--muted);
      font-size: 13px;
    }
    .list {
      display: grid;
      gap: 10px;
    }
    .row {
      border: 1px solid var(--border);
      background: linear-gradient(145deg, #f8fbff, #f2f7ff);
      border-radius: 14px;
      padding: 12px;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }
    .name {
      font-weight: 800;
      color: #1e293b;
    }
    .meta {
      color: var(--muted);
      font-size: 13px;
      margin-top: 4px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }
    .pill {
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(14, 165, 233, 0.15);
      color: #0369a1;
      font-weight: 700;
      font-size: 12px;
    }
    .super {
      background: rgba(16, 185, 129, 0.18);
      color: #047857;
    }
    .right {
      display: flex;
      gap: 10px;
    }
    .edit-btn {
      border: 2px solid #15803d !important;
      color: #ffffff !important;
      font-weight: 800;
      background: #15803d !important;
    }
    .delete-btn {
      border: 2px solid #dc2626 !important;
      color: #ffffff !important;
      font-weight: 800;
      background: #dc2626 !important;
    }
    .edit-btn:hover {
      background: #166534 !important;
      border-color: #166534 !important;
      color: #ffffff !important;
    }
    .delete-btn:hover {
      background: #b91c1c !important;
      border-color: #b91c1c !important;
      color: #ffffff !important;
    }
    :host-context(.dark-theme) .admin-shell .edit-btn {
      background: #15803d !important;
      border-color: #15803d !important;
      color: #ffffff !important;
    }
    :host-context(.dark-theme) .admin-shell .delete-btn {
      background: #dc2626 !important;
      border-color: #dc2626 !important;
      color: #ffffff !important;
    }
    :host-context(.dark-theme) .admin-shell .edit-btn:hover {
      background: #166534 !important;
      border-color: #166534 !important;
      color: #ffffff !important;
    }
    :host-context(.dark-theme) .admin-shell .delete-btn:hover {
      background: #b91c1c !important;
      border-color: #b91c1c !important;
      color: #ffffff !important;
    }
    .empty {
      color: var(--muted);
    }
    .edit {
      margin-top: 14px;
      border-top: 1px dashed #c7d2fe;
      padding-top: 14px;
    }
    @media (max-width: 820px) {
      .grid {
        grid-template-columns: 1fr;
      }
      .row {
        flex-direction: column;
        align-items: start;
      }
    }

    /* DARK THEME REFINEMENTS - High Contrast Borders and Text */
    :host-context(.dark-theme) .admin-card {
      background: #111827 !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      box-shadow: none !important;
    }

    :host-context(.dark-theme) h1,
    :host-context(.dark-theme) h2,
    :host-context(.dark-theme) h3 {
      color: #ffffff !important;
    }

    :host-context(.dark-theme) .sub-card {
      background: #1f2937 !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important; /* REINFORCED BORDER */
      box-shadow: none !important;
    }

    /* Deeply Override Material Input Borders */
    :host-context(.dark-theme) ::ng-deep .mat-mdc-form-field-appearance-outline .mdc-outlined-text-field__outline {
       --mdc-outlined-text-field-outline-color: rgba(255, 255, 255, 0.35) !important;
    }
    :host-context(.dark-theme) ::ng-deep .mat-mdc-form-field-appearance-outline.mat-focused .mdc-outlined-text-field__outline {
       --mdc-outlined-text-field-focus-outline-color: #60a5fa !important;
    }
    :host-context(.dark-theme) ::ng-deep .mat-mdc-form-field .mat-mdc-floating-label {
       color: #cbd5e1 !important;
    }

    :host-context(.dark-theme) input {
      color: #ffffff !important;
    }

    :host-context(.dark-theme) .row {
      background: #374151 !important;
      border: 1px solid rgba(255, 255, 255, 0.25) !important; /* CLEARER ROW BORDER */
      box-shadow: none !important;
    }

    :host-context(.dark-theme) .name {
      color: #ffffff !important;
    }

    :host-context(.dark-theme) .meta,
    :host-context(.dark-theme) .hint,
    :host-context(.dark-theme) .empty {
      color: #94a3af !important;
    }

    :host-context(.dark-theme) .meta,
    :host-context(.dark-theme) .hint,
    :host-context(.dark-theme) .empty {
      color: #94a3af !important;
    }

    :host-context(.dark-theme) .create-btn {
      background: #15803d !important;
      border: 1px solid #16a34a !important;
      color: #ffffff !important;
      font-weight: 800;
    }

    :host-context(.dark-theme) .create-btn:hover:not([disabled]) {
      background: #166534 !important;
      border-color: #15803d !important;
    }

    :host-context(.dark-theme) .create-btn[disabled] {
      background: #1e2937 !important;
      border-color: #374151 !important;
      color: #4b5563 !important;
      opacity: 0.6;
    }

    :host-context(.dark-theme) .edit-btn {
      background: #134e4a !important;
      border-color: #134e4a !important;
      color: #ffffff !important;
    }

    :host-context(.dark-theme) .pill {
      background: rgba(255, 255, 255, 0.1) !important;
      color: #ffffff !important;
    }
  `],
})
export class AdminAccountsComponent {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private usersApi = inject(UserManagementService);
  private notify = inject(NotificationService);

  viewType: AdminViewType = 'users';
  isSuperAdmin = false;
  canListRecords = false;
  canManageRecords = false;

  users: User[] = [];
  isCreateBusy = false;

  editUser: User | null = null;
  isEditBusy = false;

  createForm = inject(FormBuilder).nonNullable.group({
    full_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  editForm = inject(FormBuilder).nonNullable.group({
    full_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.minLength(8)],
  });

  constructor() {
    const dataType = this.route.snapshot.data['type'] as AdminViewType | undefined;
    if (dataType) this.viewType = dataType;

    const u = this.auth.user();
    this.isSuperAdmin = !!u?.is_superuser;
    this.canListRecords = this.isSuperAdmin || u?.role === 'admin';
    this.canManageRecords = this.isSuperAdmin || u?.role === 'admin';

    if (this.canListRecords) {
      this.load();
    }
  }

  private filterUsers(users: User[]): User[] {
    if (this.viewType === 'users') return users.filter((u) => u.role === 'customer');
    return users.filter((u) => u.role === 'agent');
  }

  private load(): void {
    this.usersApi.listUsers().subscribe({
      next: (all) => {
        this.users = this.filterUsers(all);
      },
      error: (err) => {
        this.notify.error(err?.error?.detail || 'Unable to load users.');
      },
    });
  }

  create(): void {
    if (this.createForm.invalid) return;

    this.isCreateBusy = true;
    const v = this.createForm.getRawValue();
    const payload: Partial<User> & { full_name: string; email: string; password: string } = {
      full_name: v.full_name,
      email: v.email,
      password: v.password,
      role: this.viewType === 'agents' ? 'agent' : 'customer',
    };

    this.usersApi.createUser(payload).subscribe({
      next: () => {
        this.notify.success('User created.');
        this.createForm.reset({
          full_name: '',
          email: '',
          password: '',
        });
        if (this.canListRecords) this.load();
      },
      error: (err) => {
        this.isCreateBusy = false;
        this.notify.error(err?.error?.detail || 'Unable to create user.');
      },
      complete: () => {
        this.isCreateBusy = false;
      },
    });
  }

  startEdit(u: User): void {
    if (!this.canManageRecords) return;
    this.editUser = u;
    this.editForm.setValue({
      full_name: u.full_name,
      email: u.email,
      password: '',
    });
  }

  cancelEdit(): void {
    this.editUser = null;
  }

  saveEdit(): void {
    if (!this.editUser) return;
    if (!this.canManageRecords) return;
    if (this.editForm.invalid) return;

    this.isEditBusy = true;
    const v = this.editForm.getRawValue();
    const payload: (Partial<User> & { password?: string }) = {
      full_name: v.full_name,
      email: v.email,
    };
    if (v.password) {
      payload.password = v.password;
    }

    this.usersApi.updateUser(this.editUser.id, payload).subscribe({
      next: () => {
        this.notify.success('User updated.');
        this.editUser = null;
        if (this.canListRecords) this.load();
      },
      error: (err) => {
        this.notify.error(err?.error?.detail || 'Unable to update user.');
      },
      complete: () => {
        this.isEditBusy = false;
      },
    });
  }

  remove(u: User): void {
    if (!this.canManageRecords) return;
    if (!window.confirm(`Delete ${u.email}?`)) return;
    this.usersApi.deleteUser(u.id).subscribe({
      next: () => {
        this.notify.success('User deleted.');
        if (this.canListRecords) this.load();
      },
      error: (err) => {
        this.notify.error(err?.error?.detail || 'Unable to delete user.');
      },
    });
  }
}
