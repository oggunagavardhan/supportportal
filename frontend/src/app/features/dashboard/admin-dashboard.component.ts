import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';

import { User } from '../../core/models/auth.models';
import { Ticket } from '../../core/models/ticket.models';
import { AuthService } from '../../core/services/auth.service';
import { TicketService } from '../../core/services/ticket.service';
import { TicketActivityChartComponent } from './ticket-activity-chart.component';

interface DashboardCard {
  label: string;
  value: number;
  hint: string;
  tone: 'blue' | 'green' | 'violet' | 'amber';
}

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatButtonModule, 
    MatCardModule, 
    MatTableModule,
    TicketActivityChartComponent
  ],
  template: `
    <section class="dashboard-shell" *ngIf="currentUser() as user">
      <div class="section-head">
        <div>
          <h1>Dashboard</h1>
          <p>{{ isStaff() ? 'Support operations overview' : 'Your support activity overview' }}</p>
        </div>
        <div class="live-pill">Live Data</div>
      </div>

      <div class="stats-grid">
        <mat-card class="metric-card" [class.blue]="card.tone === 'blue'" [class.green]="card.tone === 'green'" [class.violet]="card.tone === 'violet'" [class.amber]="card.tone === 'amber'" *ngFor="let card of summaryCards">
          <div class="metric-top">
            <div class="metric-icon">{{ card.label.charAt(0) }}</div>
            <div class="metric-hint">{{ card.hint }}</div>
          </div>
          <div class="metric-label">{{ card.label }}</div>
          <div class="metric-value">{{ card.value }}</div>
        </mat-card>
      </div>

      <div class="chart-container">
        <app-ticket-activity-chart></app-ticket-activity-chart>
      </div>

      <div class="list-container">
        <mat-card class="list-card main-list-card">
          <div class="card-head">
            <div>
              <h3>Recent Tickets</h3>
              <p>Latest activity across the portal</p>
            </div>
            <button mat-stroked-button color="primary" [routerLink]="['/tickets']">View all</button>
          </div>

          <div class="table-container" *ngIf="recentTickets.length > 0; else noTickets">
            <table mat-table [dataSource]="recentTickets">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let t">#{{ t.id }}</td>
              </ng-container>
              <ng-container matColumnDef="subject">
                <th mat-header-cell *matHeaderCellDef>Subject</th>
                <td mat-cell *matCellDef="let t" class="subject-cell">{{ t.title }}</td>
              </ng-container>
              <ng-container matColumnDef="customer">
                <th mat-header-cell *matHeaderCellDef>Customer</th>
                <td mat-cell *matCellDef="let t">{{ t.created_by.full_name }}</td>
              </ng-container>
              <ng-container matColumnDef="priority">
                <th mat-header-cell *matHeaderCellDef>Priority</th>
                <td mat-cell *matCellDef="let t">
                  <span class="p-pill" [class]="t.priority">{{ t.priority | titlecase }}</span>
                </td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let t">
                  <span class="s-pill" [class]="t.status">{{ statusLabel(t.status) }}</span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;" [routerLink]="['/tickets', row.id]"></tr>
            </table>
          </div>

          <ng-template #noTickets>
            <div class="empty-placeholder">No tickets found.</div>
          </ng-template>
        </mat-card>
      </div>
    </section>
  `,
  styles: [`
    .dashboard-container {
      padding: 14px;
      display: grid;
      gap: 22px;
      min-height: 100%;
      background: transparent;
      border-radius: 22px;
    }
    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .section-head h1 { margin: 0; font-size: 28px; font-weight: 700; color: #1e293b; }
    .section-head p { margin: 4px 0 0; color: #64748b; font-size: 14px; }
    .live-pill { padding: 6px 12px; border-radius: 999px; background: #dcfce7; color: #16a34a; font-weight: 700; font-size: 12px; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    .metric-card {
      padding: 20px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      background: #ffffff;
    }
    .metric-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .metric-icon {
      width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; color: #ffffff; font-weight: 800;
    }
    .metric-card.blue .metric-icon { background: #3b82f6; }
    .metric-card.green .metric-icon { background: #10b981; }
    .metric-card.violet .metric-icon { background: #8b5cf6; }
    .metric-card.amber .metric-icon { background: #f59e0b; }
    .metric-hint { font-size: 11px; color: #64748b; font-weight: 600; }
    .metric-label { font-size: 13px; color: #64748b; margin-bottom: 4px; }
    .metric-value { font-size: 24px; font-weight: 800; color: #1e293b; }

    .chart-container { width: 100%; margin-top: 32px; margin-bottom: 32px; }

    .list-container {
      width: 100%;
    }
    .list-card {
      padding: 24px;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .card-head { display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; }
    .card-head h3 { margin: 0; font-size: 18px; color: #1e293b; }
    .card-head p { margin: 4px 0 0; color: #64748b; font-size: 13px; }

    .bar-list { display: grid; gap: 20px; }
    .bar-meta { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
    .bar-track { height: 8px; border-radius: 999px; background: #f1f5f9; overflow: hidden; }
    .bar-fill { height: 100%; transition: width 0.6s ease; }
    .bar-fill.open { background: #3b82f6; }
    .bar-fill.progress { background: #f59e0b; }
    .bar-fill.closed { background: #10b981; }

    .table-container { width: 100%; overflow-x: auto; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; }
    th { text-align: left; padding: 12px 16px; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
    td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b; }
    tr:last-child td { border-bottom: 0; }
    tr { cursor: pointer; transition: background 0.2s; }
    tr:hover { background: #f8fafc; }

    .subject-cell { font-weight: 600; color: #1e63e9; }
    .p-pill, .s-pill { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .p-pill.high { background: #fee2e2; color: #dc2626; }
    .p-pill.medium { background: #ffedd5; color: #ea580c; }
    .p-pill.low { background: #f1f5f9; color: #64748b; }
    .s-pill.open { background: #dbeafe; color: #2563eb; }
    .s-pill.in_progress { background: #fef3c7; color: #d97706; }
    .s-pill.closed { background: #dcfce7; color: #16a34a; }

    .empty-placeholder { padding: 40px; text-align: center; color: #94a3b8; font-style: italic; }

    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .dashboard-footer-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .stats-grid { grid-template-columns: 1fr; }
      .section-head { flex-direction: column; align-items: flex-start; gap: 12px; }
    }

    /* DARK THEME REFINEMENTS */
    :host-context(.dark-theme) .section-head h1,
    :host-context(.dark-theme) .card-head h3,
    :host-context(.dark-theme) .metric-value,
    :host-context(.dark-theme) td {
      color: #ffffff !important;
    }

    :host-context(.dark-theme) .section-head p,
    :host-context(.dark-theme) .card-head p,
    :host-context(.dark-theme) .metric-label,
    :host-context(.dark-theme) .metric-hint,
    :host-context(.dark-theme) th {
      color: #94a3b8 !important;
    }

    :host-context(.dark-theme) .metric-card,
    :host-context(.dark-theme) .list-card {
      background: #1e293b !important;
      border-color: #334155 !important;
    }

    :host-context(.dark-theme) th,
    :host-context(.dark-theme) td {
      border-bottom-color: #334155 !important;
    }

    :host-context(.dark-theme) tr:hover {
      background: rgba(255, 255, 255, 0.03) !important;
    }

    :host-context(.dark-theme) .live-pill {
      background: #064e3b !important;
      color: #34d399 !important;
    }

    :host-context(.dark-theme) .empty-placeholder {
      color: #475569 !important;
    }

    :host-context(.dark-theme) .bar-track {
      background: #334155 !important;
    }

    /* Dark mode pill overrides */
    :host-context(.dark-theme) .p-pill.high { background: rgba(220,38,38,0.25) !important; color: #fca5a5 !important; }
    :host-context(.dark-theme) .p-pill.medium { background: rgba(234,88,12,0.25) !important; color: #fdba74 !important; }
    :host-context(.dark-theme) .p-pill.low { background: rgba(100,116,139,0.25) !important; color: #94a3b8 !important; }
    :host-context(.dark-theme) .s-pill.open { background: rgba(37,99,235,0.25) !important; color: #93c5fd !important; }
    :host-context(.dark-theme) .s-pill.in_progress { background: rgba(217,119,6,0.25) !important; color: #fcd34d !important; }
    :host-context(.dark-theme) .s-pill.closed { background: rgba(22,163,74,0.25) !important; color: #86efac !important; }

    :host-context(.dark-theme) .subject-cell { color: #60a5fa !important; }
  `],
})
export class AdminDashboardComponent {
  private auth = inject(AuthService);
  private ticketService = inject(TicketService);

  currentUser = this.auth.user;
  isStaff = computed(() => 
    ['admin', 'agent'].includes(this.currentUser()?.role ?? '') || 
    !!this.currentUser()?.is_superuser
  );

  summaryCards: DashboardCard[] = [];
  statusBars: Array<{ label: string; value: number; percent: number; tone: 'open' | 'progress' | 'closed' }> = [];
  recentTickets: Ticket[] = [];
  columns = ['id', 'subject', 'customer', 'priority', 'status'];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    const user = this.currentUser();
    if (!user) return;

    if (user.role === 'customer') {
      this.ticketService.list({ page: 1 }).subscribe(res => {
        this.bindCustomerDashboard(user, res.results, res.count);
      });
    } else {
      forkJoin({
        stats: this.ticketService.dashboard(),
        recent: this.ticketService.list({ page: 1 })
      }).subscribe(({ stats, recent }) => {
        this.bindStaffDashboard(stats, recent.results);
      });
    }
  }

  private bindStaffDashboard(stats: Record<string, number>, tickets: Ticket[]): void {
    const total = stats['total_tickets'] || 0;
    const open = stats['open_tickets'] || 0;
    const closed = stats['closed_tickets'] || 0;
    const high = stats['high_priority'] || 0;
    const inProgress = Math.max(total - open - closed, 0);

    this.summaryCards = [
      { label: 'Total Tickets', value: total, hint: 'Lifetime', tone: 'blue' },
      { label: 'Open Queue', value: open, hint: 'Waiting', tone: 'amber' },
      { label: 'In Progress', value: inProgress, hint: 'Active', tone: 'violet' },
      { label: 'High Priority', value: high, hint: 'Critical', tone: 'green' },
    ];

    this.setStatusBars(open, inProgress, closed);
    this.recentTickets = tickets.slice(0, 5);
  }

  private bindCustomerDashboard(user: User, tickets: Ticket[], total: number): void {
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const closed = tickets.filter(t => t.status === 'closed').length;
    const high = tickets.filter(t => t.priority === 'high').length;

    this.summaryCards = [
      { label: 'My Tickets', value: total, hint: user.full_name, tone: 'blue' },
      { label: 'Open', value: open, hint: 'Pending', tone: 'amber' },
      { label: 'In Progress', value: inProgress, hint: 'Work-in-progress', tone: 'violet' },
      { label: 'High Priority', value: high, hint: 'Urgent', tone: 'green' },
    ];

    this.setStatusBars(open, inProgress, closed);
    this.recentTickets = tickets.slice(0, 5);
  }

  private setStatusBars(open: number, inProgress: number, closed: number): void {
    const total = Math.max(open + inProgress + closed, 1);
    this.statusBars = [
      { label: 'Open', value: open, percent: (open/total)*100, tone: 'open' },
      { label: 'In Progress', value: inProgress, percent: (inProgress/total)*100, tone: 'progress' },
      { label: 'Closed', value: closed, percent: (closed/total)*100, tone: 'closed' },
    ];
  }

  statusLabel(status: string): string {
    if (status === 'in_progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
