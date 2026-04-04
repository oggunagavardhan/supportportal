import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AuthService } from '../../core/services/auth.service';
import { Ticket } from '../../core/models/ticket.models';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';

interface TicketSummaryCard {
  label: string;
  value: number;
  caption: string;
}

type TicketMode = 'all' | 'active' | 'resolved';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <section class="ticket-page">
      <div class="summary-grid" *ngIf="showSummary">
        <mat-card class="glass-card summary-card" *ngFor="let card of summaryCards">
          <div class="summary-top">
            <div class="summary-label">{{ card.label }}</div>
            <div class="summary-dot"></div>
          </div>
          <div class="summary-value">{{ card.value }}</div>
          <p>{{ card.caption }}</p>
        </mat-card>
      </div>

      <mat-card class="glass-card filter-card" *ngIf="showFilters">
        <div class="filter-header">
          <div>
            <div class="chip">Smart Filters</div>
            <h2>{{ filterTitle }}</h2>
          </div>
          <button mat-stroked-button type="button" (click)="resetFilters()">Reset</button>
        </div>

        <div class="quick-filters" *ngIf="!isAgentMode">
          <button mat-stroked-button type="button" class="quick-filter" (click)="applyPreset('open')">Open</button>
          <button mat-stroked-button type="button" class="quick-filter" (click)="applyPreset('in_progress')">In Progress</button>
          <button mat-stroked-button type="button" class="quick-filter" (click)="applyPreset('closed')">Closed</button>
          <button mat-stroked-button type="button" class="quick-filter" (click)="applyPreset('high')">High Priority</button>
        </div>

        <form [formGroup]="filters" class="filter-grid">
          <mat-form-field appearance="outline" floatLabel="always">
            <mat-label>Search</mat-label>
            <input matInput formControlName="search" placeholder="Title or ID" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status" [disabled]="isAgentMode">
              <mat-option value="open">Open</mat-option>
              <mat-option value="in_progress">In Progress</mat-option>
              <mat-option value="closed">Closed</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="low">Low</mat-option>
              <mat-option value="medium">Medium</mat-option>
              <mat-option value="high">High</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>From</mat-label>
            <input matInput [matDatepicker]="fromPicker" formControlName="date_from" (focus)="fromPicker.open()" />
            <mat-datepicker #fromPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>To</mat-label>
            <input matInput [matDatepicker]="toPicker" formControlName="date_to" (focus)="toPicker.open()" />
            <mat-datepicker #toPicker></mat-datepicker>
          </mat-form-field>
          <button mat-flat-button color="primary" type="button" (click)="load()">Apply</button>
        </form>
      </mat-card>

      <mat-card class="glass-card table-card">
        <div class="table-header">
          <div>
            <h2>{{ isCustomer ? 'Latest ticket updates' : 'Queue snapshot' }}</h2>
            <p>Showing {{ tickets.length }} of {{ totalCount }} ticket{{ totalCount === 1 ? '' : 's' }}.</p>
          </div>
          <div class="table-badge">{{ isCustomer ? 'Customer view' : 'Staff view' }}</div>
        </div>

        <ng-container *ngIf="tickets.length; else noTickets">
          <div class="table-wrap">
            <table mat-table [dataSource]="tickets">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>Ticket ID</th>
                <td mat-cell *matCellDef="let ticket">#{{ ticket.id }}</td>
              </ng-container>

              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Title</th>
                <td mat-cell *matCellDef="let ticket">
                  <a [routerLink]="['/tickets', ticket.id]">{{ ticket.title }}</a>
                </td>
              </ng-container>

              <ng-container matColumnDef="priority">
                <th mat-header-cell *matHeaderCellDef>Priority</th>
                <td mat-cell *matCellDef="let ticket">
                  <span class="priority-pill" [ngClass]="ticket.priority">{{ ticket.priority }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let ticket">
                  <span class="status-pill" [ngClass]="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="assignee">
                <th mat-header-cell *matHeaderCellDef>Assignee</th>
                <td mat-cell *matCellDef="let ticket">{{ ticket.assigned_to?.full_name || 'Unassigned' }}</td>
              </ng-container>

              <ng-container matColumnDef="updated_at">
                <th mat-header-cell *matHeaderCellDef>Updated</th>
                <td mat-cell *matCellDef="let ticket">{{ ticket.updated_at | date:'medium' }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let ticket">
                  <div class="action-buttons">
                    <a mat-stroked-button class="edit-btn" [routerLink]="['/tickets', ticket.id]">Edit</a>
                    <button mat-stroked-button class="delete-btn" type="button" (click)="deleteTicket(ticket.id)">Delete</button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </ng-container>

        <ng-template #noTickets>
          <div class="empty-state">
            <h3>No tickets match these filters</h3>
            <p>{{ isCustomer ? 'Try resetting the filters or create a new ticket to get started.' : 'Broaden the filters or check back when new support requests arrive.' }}</p>
          </div>
        </ng-template>

        <div class="pager">
          <button mat-stroked-button type="button" (click)="changePage(-1)" [disabled]="page <= 1">Previous</button>
          <span>Page {{ page }}</span>
          <button mat-stroked-button type="button" (click)="changePage(1)" [disabled]="!hasNext">Next</button>
        </div>
      </mat-card>
    </section>
  `,
  styles: [`
    .ticket-page {
      display: grid;
      gap: 22px;
      padding: 14px;
      border-radius: 22px;
      background: transparent;
    }
    .section-header h1 { margin: 10px 0 0; font-size: 36px; color: #17366e; }
    .intro { margin: 10px 0 0; color: var(--muted); max-width: 62ch; line-height: 1.6; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .summary-card {
      padding: 22px;
      border: 1px solid #e4e9f2;
      background: linear-gradient(180deg, #ffffff, #f9fbff);
      box-shadow: 0 10px 18px rgba(30, 58, 138, 0.08);
    }
    .summary-card:nth-child(1) {
      background: linear-gradient(145deg, #e8f1ff, #dbeafe);
      border-color: #93c5fd;
    }
    .summary-card:nth-child(2) {
      background: linear-gradient(145deg, #fff6e5, #fff0cf);
      border-color: #ffd48a;
    }
    .summary-card:nth-child(3) {
      background: linear-gradient(145deg, #f5edff, #ece0ff);
      border-color: #cdb4ff;
    }
    .summary-card:nth-child(4) {
      background: linear-gradient(145deg, #e9fff7, #d7fff1);
      border-color: #9deccf;
    }
    .summary-card:nth-child(1) .summary-dot { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .summary-card:nth-child(2) .summary-dot { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .summary-card:nth-child(3) .summary-dot { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
    .summary-card:nth-child(4) .summary-dot { background: linear-gradient(135deg, #10b981, #059669); }
    .summary-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .summary-label { color: var(--muted); font-size: 14px; font-weight: 700; }
    .summary-dot {
      width: 12px;
      height: 12px;
      border-radius: 999px;
      background: linear-gradient(135deg, #3b82f6, #4f46e5);
    }
    .summary-value { font-size: 24px; font-weight: 800; margin: 16px 0 10px; color: #17366e; }
    .summary-card p { margin: 0; color: var(--muted); line-height: 1.5; }
    .filter-card, .table-card {
      padding: 22px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      background: #ffffff;
    }
    .filter-header, .table-header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      margin-bottom: 18px;
    }
    .filter-header h2, .table-header h2 { margin: 10px 0 0; font-size: 24px; color: #17366e; }
    .table-header p { margin: 8px 0 0; color: var(--muted); }
    .table-badge {
      padding: 10px 14px;
      border-radius: 999px;
      background: #eef3ff;
      color: #3358c8;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }
    .quick-filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
    .quick-filter { border-radius: 999px; }
    .filter-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; align-items: center; }
    .table-wrap {
      overflow-x: auto;
      border: 1px solid #e7edf7;
      border-radius: 18px;
      background: #fcfdff;
    }
    table { width: 100%; }
    th { color: #64748b; font-weight: 700; background: #f8fbff; }
    td, th { white-space: nowrap; }
    td { color: #334155; }
    a { color: var(--primary-strong); text-decoration: none; font-weight: 700; }
    .action-buttons { display: flex; gap: 8px; }
    .edit-btn {
      border: 2px solid #15803d !important;
      color: #ffffff !important;
      background: #15803d !important;
      font-weight: 600;
    }
    .edit-btn:hover {
      background: #166534 !important;
      border-color: #166534 !important;
    }
    .delete-btn {
      border: 2px solid #dc2626 !important;
      color: #ffffff !important;
      background: #dc2626 !important;
      font-weight: 600;
    }
    .delete-btn:hover {
      background: #b91c1c !important;
      border-color: #b91c1c !important;
    }
    .pager { display: flex; justify-content: flex-end; gap: 12px; padding-top: 18px; align-items: center; }
    .empty-state {
      padding: 24px;
      border-radius: 20px;
      background: #fbfcff;
      border: 1px dashed var(--border);
    }
    .empty-state h3 { margin-top: 0; }
    .empty-state p { color: var(--muted); margin-bottom: 0; }
    @media (max-width: 1180px) {
      .summary-grid { grid-template-columns: repeat(2, 1fr); }
      .filter-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 720px) {
      .summary-grid, .filter-grid { grid-template-columns: 1fr; }
      .filter-header, .table-header { align-items: start; flex-direction: column; }
      .pager { justify-content: space-between; }
    }
    :host-context(.dark-theme) .summary-card {
      background: #1b2a46 !important;
      border-color: #6f93cb !important;
    }
    :host-context(.dark-theme) .summary-card:nth-child(1),
    :host-context(.dark-theme) .summary-card:nth-child(2),
    :host-context(.dark-theme) .summary-card:nth-child(3),
    :host-context(.dark-theme) .summary-card:nth-child(4) {
      background: #1b2a46 !important;
      border-color: #6f93cb !important;
    }
    :host-context(.dark-theme) .summary-label {
      color: #d8e6ff !important;
    }
    :host-context(.dark-theme) .summary-value {
      color: #ffffff !important;
    }
    :host-context(.dark-theme) .summary-card p {
      color: #d0def6 !important;
    }
    :host-context(.dark-theme) .table-wrap {
      background: #1b2a46;
      border-color: #6f93cb;
    }
    :host-context(.dark-theme) th {
      background: #223555;
      color: #e8f1ff;
    }
    :host-context(.dark-theme) td {
      color: #d7e7ff;
    }
    :host-context(.dark-theme) .edit-btn {
      border: 2px solid #15803d !important;
      color: #ffffff !important;
      background: #15803d !important;
    }
    :host-context(.dark-theme) .edit-btn:hover {
      background: #166534 !important;
      border-color: #166534 !important;
    }
    :host-context(.dark-theme) .delete-btn {
      border: 2px solid #dc2626 !important;
      color: #ffffff !important;
      background: #dc2626 !important;
    }
    :host-context(.dark-theme) .delete-btn:hover {
      background: #b91c1c !important;
      border-color: #b91c1c !important;
    }
    .priority-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      color: #ffffff;
    }
    .priority-pill.low {
      background: #475569;
      border: 1px solid #64748b;
    }
    .priority-pill.medium {
      background: #ea580c;
      border: 1px solid #f97316;
    }
    .priority-pill.high {
      background: #dc2626;
      border: 1px solid #ef4444;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      color: #ffffff;
    }
    .status-pill.open {
      background: #2563eb;
      border: 1px solid #3b82f6;
    }
    .status-pill.in-progress {
      background: #d97706;
      border: 1px solid #f59e0b;
    }
    .status-pill.closed {
      background: #16a34a;
      border: 1px solid #22c55e;
    }
  `],
})
export class TicketListComponent {
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);
  private route = inject(ActivatedRoute);

  tickets: Ticket[] = [];
  summaryCards: TicketSummaryCard[] = [];
  isCustomer = this.authService.user()?.role === 'customer';
  isAgent = this.authService.user()?.role === 'agent';
  mode = (this.route.snapshot.data['mode'] as TicketMode | undefined) ?? 'all';
  showSummary = this.mode === 'all';
  showFilters = this.mode === 'all';
  isAgentMode = this.isAgent && this.mode !== 'all';
  filterTitle =
    this.mode === 'active'
      ? 'My active tickets'
      : this.mode === 'resolved'
        ? 'My resolved tickets'
        : 'Refine the queue';
  isAdminView =
    this.authService.user()?.role === 'admin' || !!this.authService.user()?.is_superuser;
  page = 1;
  hasNext = false;
  totalCount = 0;
  displayedColumns = this.isCustomer
    ? ['id', 'title', 'priority', 'status', 'updated_at', 'actions']
    : ['id', 'title', 'priority', 'status', 'assignee', 'updated_at', 'actions'];

  filters = this.fb.nonNullable.group({
    search: '',
    status: '',
    priority: '',
    date_from: '',
    date_to: '',
    page: 1,
  });

  constructor() {
    this.applyModeDefaults();
    this.load();
  }

  load(): void {
    const requestFilters = this.buildRequestFilters();
    this.ticketService.list(requestFilters).subscribe((response) => {
      this.tickets = response.results;
      this.totalCount = response.count;
      this.page = Number(this.filters.controls.page.value);
      this.hasNext = !!response.next;
      this.summaryCards = this.buildSummaryCards(response.results, response.count);
    });
  }

  changePage(delta: number): void {
    const nextPage = Math.max(1, Number(this.filters.controls.page.value) + delta);
    this.filters.patchValue({ page: nextPage });
    this.load();
  }

  applyPreset(preset: 'open' | 'in_progress' | 'closed' | 'high'): void {
    this.filters.patchValue({
      status: preset === 'high' ? '' : preset,
      priority: preset === 'high' ? 'high' : '',
      page: 1,
    });
    this.load();
  }

  resetFilters(): void {
    this.filters.patchValue({
      search: '',
      status: '',
      priority: '',
      date_from: '',
      date_to: '',
      page: 1,
    });
    this.applyModeDefaults();
    this.load();
  }

  statusClass(status: Ticket['status']): string {
    return status === 'in_progress' ? 'in-progress' : status;
  }

  statusLabel(status: Ticket['status']): string {
    return status === 'in_progress' ? 'In Progress' : status[0].toUpperCase() + status.slice(1);
  }

  deleteTicket(id: number): void {
    if (!window.confirm('Delete this ticket?')) {
      return;
    }
    this.ticketService.delete(id).subscribe({
      next: () => {
        this.notify.success('Ticket deleted successfully.');
        if (this.tickets.length === 1 && this.page > 1) {
          this.filters.patchValue({ page: this.page - 1 });
        }
        this.load();
      },
      error: () => this.notify.error('Unable to delete ticket.'),
    });
  }

  private buildSummaryCards(tickets: Ticket[], totalCount: number): TicketSummaryCard[] {
    const open = tickets.filter((ticket) => ticket.status === 'open').length;
    const inProgress = tickets.filter((ticket) => ticket.status === 'in_progress').length;
    const highPriority = tickets.filter((ticket) => ticket.priority === 'high').length;

    return [
      {
        label: this.isCustomer ? 'My total tickets' : 'Visible queue',
        value: totalCount,
        caption: this.isCustomer ? 'Your personal support history across all pages.' : 'Current filtered ticket count across the queue.',
      },
      {
        label: 'Open on this page',
        value: open,
        caption: 'Requests that still need action or a first response.',
      },
      {
        label: 'In progress',
        value: inProgress,
        caption: 'Tickets currently being worked by support staff.',
      },
      {
        label: 'High priority',
        value: highPriority,
        caption: 'Urgent cases surfaced in the current result set.',
      },
    ];
  }

  private applyModeDefaults(): void {
    if (!this.isAgentMode) {
      return;
    }
    const status = this.mode === 'active' ? 'in_progress' : 'closed';
    this.filters.patchValue({ status });
  }

  private buildRequestFilters(): Record<string, string | number> {
    const requestFilters = { ...this.filters.getRawValue() } as Record<string, string | number>;
    if (this.isAgent) {
      const userId = this.authService.user()?.id;
      if (userId) {
        requestFilters['assigned_to'] = userId;
      }
    }
    if (this.isAgentMode) {
      requestFilters['status'] = this.mode === 'active' ? 'in_progress' : 'closed';
    }
    return requestFilters;
  }
}
