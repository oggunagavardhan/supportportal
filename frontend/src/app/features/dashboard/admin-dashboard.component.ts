import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
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
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, NgChartsModule, TicketActivityChartComponent],
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

      <div class="chart-grid">
        <app-ticket-activity-chart></app-ticket-activity-chart>

        <mat-card class="chart-card">
          <div class="card-head">
            <div>
              <h2>Status Breakdown</h2>
              <p>{{ isStaff() ? 'Current queue mix' : 'Your ticket mix' }}</p>
            </div>
          </div>

          <div class="status-pie-wrap">
            <canvas
              baseChart
              [data]="statusPieData"
              [options]="statusPieOptions"
              type="pie"
            ></canvas>
          </div>
        </mat-card>
      </div>

      <mat-card class="list-card">
        <div class="card-head">
          <div>
            <h2>{{ isStaff() ? 'Recent Ticket Activity' : 'Recent Requests' }}</h2>
            <p>{{ isStaff() ? 'Most recently updated tickets in your visible queue.' : 'Your latest ticket updates and current status.' }}</p>
          </div>
        </div>

        <div class="ticket-list" *ngIf="recentTickets.length; else emptyState">
          <a class="ticket-row" *ngFor="let ticket of recentTickets" [routerLink]="['/tickets', ticket.id]">
            <div class="ticket-main">
              <strong>{{ ticket.title }}</strong>
              <span>#{{ ticket.id }} · {{ ticket.updated_at | date:'mediumDate' }}</span>
            </div>
            <div class="ticket-side">
              <span class="status-pill" [ngClass]="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
              <span class="priority-pill" [ngClass]="ticket.priority">{{ ticket.priority }}</span>
            </div>
          </a>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <h3>No tickets yet</h3>
            <p>{{ isStaff() ? 'Once new tickets are created, they will appear here.' : 'Create your first ticket to start the conversation.' }}</p>
          </div>
        </ng-template>
      </mat-card>
    </section>
  `,
  styles: [`
    .dashboard-shell { display: grid; gap: 24px; }
    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .section-head h1 {
      margin: 0;
      font-size: 32px;
      color: #17366e;
    }
    .section-head p {
      margin: 8px 0 0;
      color: #64748b;
      font-size: 16px;
    }
    .live-pill {
      padding: 10px 16px;
      border-radius: 12px;
      background: #dcfce7;
      color: #059669;
      font-weight: 700;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
    }
    .metric-card {
      padding: 24px;
      border-radius: 20px;
      border: 1px solid #dfe7f4;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
      background: #ffffff;
    }
    .metric-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 18px;
    }
    .metric-icon {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: grid;
      place-items: center;
      color: #ffffff;
      font-size: 20px;
      font-weight: 800;
    }
    .metric-card.blue .metric-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .metric-card.green .metric-icon { background: linear-gradient(135deg, #10b981, #059669); }
    .metric-card.violet .metric-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .metric-card.amber .metric-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .metric-hint {
      padding: 8px 12px;
      border-radius: 999px;
      background: #f8fafc;
      color: #64748b;
      font-size: 12px;
      font-weight: 700;
    }
    .metric-label {
      color: #48617f;
      font-size: 15px;
      margin-bottom: 8px;
    }
    .metric-value {
      color: #17366e;
      font-size: 28px;
      font-weight: 800;
    }
    .chart-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
    }
    .chart-card, .list-card {
      padding: 24px;
      border-radius: 20px;
      border: 1px solid #dfe7f4;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
      background: #ffffff;
    }
    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 14px;
      margin-bottom: 20px;
    }
    .card-head h2 {
      margin: 0;
      font-size: 22px;
      color: #17366e;
    }
    .card-head p {
      margin: 6px 0 0;
      color: #64748b;
    }
    .card-head a, .inline-action {
      color: #2563eb;
      text-decoration: none;
      font-weight: 700;
    }
    .trend-wrap {
      display: grid;
      gap: 10px;
    }
    .trend-chart {
      position: relative;
      height: 280px;
      border-radius: 18px;
      background: linear-gradient(180deg, #f8fbff, #ffffff);
      overflow: hidden;
      border: 1px solid #e7edf7;
    }
    .trend-grid-line {
      position: absolute;
      left: 0;
      right: 0;
      height: 1px;
      border-top: 1px dashed #d7e1ef;
    }
    .trend-grid-line:nth-child(1) { top: 20%; }
    .trend-grid-line:nth-child(2) { top: 40%; }
    .trend-grid-line:nth-child(3) { top: 60%; }
    .trend-grid-line:nth-child(4) { top: 80%; }
    .trend-svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .trend-area {
      fill: rgba(16, 185, 129, 0.18);
    }
    .trend-line {
      fill: none;
      stroke: #10b981;
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .trend-labels {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      color: #94a3b8;
      font-size: 12px;
      text-align: center;
    }
    .status-pie-wrap {
      min-height: 300px;
      display: grid;
      place-items: center;
      padding: 6px 0;
    }
    .ticket-list {
      display: grid;
      gap: 12px;
    }
    .ticket-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      padding: 16px 18px;
      border-radius: 16px;
      border: 1px solid #e5ebf5;
      text-decoration: none;
      color: inherit;
      background: #fbfcff;
    }
    .ticket-main {
      display: grid;
      gap: 6px;
    }
    .ticket-main strong {
      color: #1e293b;
      font-size: 16px;
    }
    .ticket-main span {
      color: #64748b;
      font-size: 13px;
    }
    .ticket-side {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .empty-state {
      padding: 18px;
      border-radius: 16px;
      border: 1px dashed #d7e1ef;
      background: #fbfcff;
    }
    .empty-state h3 {
      margin-top: 0;
      color: #17366e;
    }
    .empty-state p {
      margin-bottom: 0;
      color: #64748b;
    }
    :host-context(.dark-theme) .section-head h1,
    :host-context(.dark-theme) .card-head h2,
    :host-context(.dark-theme) .ticket-main strong,
    :host-context(.dark-theme) .empty-state h3 {
      color: #e2e8f0;
    }
    :host-context(.dark-theme) .section-head p,
    :host-context(.dark-theme) .card-head p,
    :host-context(.dark-theme) .metric-label,
    :host-context(.dark-theme) .ticket-main span,
    :host-context(.dark-theme) .empty-state p {
      color: #94a3b8;
    }
    :host-context(.dark-theme) .metric-value {
      color: #f8fafc;
    }
    :host-context(.dark-theme) .metric-hint {
      background: #1e293b;
      color: #cbd5e1;
    }
    :host-context(.dark-theme) .ticket-row {
      background: #0f172a;
      border-color: #334155;
    }
    :host-context(.dark-theme) .empty-state {
      background: #0f172a;
      border-color: #334155;
    }
    @media (max-width: 1200px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .chart-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 720px) {
      .section-head {
        flex-direction: column;
        align-items: stretch;
      }
      .section-head h1 {
        font-size: 30px;
      }
      .stats-grid { grid-template-columns: 1fr; }
      .ticket-row {
        flex-direction: column;
        align-items: stretch;
      }
      .ticket-side {
        justify-content: flex-start;
      }
    }
  `],
})
export class AdminDashboardComponent {
  private auth = inject(AuthService);
  private ticketService = inject(TicketService);

  currentUser = this.auth.user;
  isStaff = computed(() => ['admin', 'agent'].includes(this.currentUser()?.role ?? ''));
  summaryCards: DashboardCard[] = [];
  recentTickets: Ticket[] = [];
  statusPieData: ChartData<'pie', number[], string> = {
    labels: ['Open', 'In Progress', 'Closed'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#2563eb', '#f59e0b', '#10b981'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  get statusPieOptions(): ChartConfiguration<'pie'>['options'] {
    const dark = document.documentElement.classList.contains('dark-theme');
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: dark ? '#cbd5e1' : '#334155',
            boxWidth: 14,
            boxHeight: 14,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 13, weight: 600 },
            padding: 16,
          },
        },
      },
    };
  }

  constructor() {
    const user = this.currentUser();
    if (!user) {
      return;
    }

    if (user.role === 'customer') {
      this.ticketService.list({ page: 1 }).subscribe((response) => {
        this.bindCustomerDashboard(user, response.results, response.count);
      });
      return;
    }

    forkJoin({
      stats: this.ticketService.dashboard(),
      recent: this.ticketService.list({ page: 1 }),
    }).subscribe(({ stats, recent }) => {
      this.bindStaffDashboard(stats, recent.results);
    });
  }

  statusClass(status: Ticket['status']): string {
    return status === 'in_progress' ? 'in-progress' : status;
  }

  statusLabel(status: Ticket['status']): string {
    return status === 'in_progress' ? 'In Progress' : status[0].toUpperCase() + status.slice(1);
  }

  private bindStaffDashboard(stats: Record<string, number>, recentTickets: Ticket[]): void {
    const total = stats['total_tickets'] ?? 0;
    const open = stats['open_tickets'] ?? 0;
    const closed = stats['closed_tickets'] ?? 0;
    const highPriority = stats['high_priority'] ?? 0;
    const inProgress = Math.max(total - open - closed, 0);

    this.summaryCards = [
      { label: 'Total Tickets', value: total, hint: 'All visible work', tone: 'blue' },
      { label: 'Open Queue', value: open, hint: 'Needs action', tone: 'amber' },
      { label: 'In Progress', value: inProgress, hint: 'Being handled', tone: 'violet' },
      { label: 'High Priority', value: highPriority, hint: 'Escalation watch', tone: 'green' },
    ];
    this.recentTickets = recentTickets.slice(0, 5);
    this.setCharts(recentTickets, [
      { label: 'Open', value: open, tone: 'open' },
      { label: 'In Progress', value: inProgress, tone: 'progress' },
      { label: 'Closed', value: closed, tone: 'closed' },
    ]);
  }

  private bindCustomerDashboard(user: User, recentTickets: Ticket[], total: number): void {
    const open = recentTickets.filter((ticket) => ticket.status === 'open').length;
    const inProgress = recentTickets.filter((ticket) => ticket.status === 'in_progress').length;
    const closed = recentTickets.filter((ticket) => ticket.status === 'closed').length;
    const highPriority = recentTickets.filter((ticket) => ticket.priority === 'high').length;

    this.summaryCards = [
      { label: 'My Tickets', value: total, hint: user.full_name, tone: 'blue' },
      { label: 'Open', value: open, hint: 'Waiting updates', tone: 'amber' },
      { label: 'In Progress', value: inProgress, hint: 'Under review', tone: 'violet' },
      { label: 'High Priority', value: highPriority, hint: 'Urgent tickets', tone: 'green' },
    ];
    this.recentTickets = recentTickets.slice(0, 5);
    this.setCharts(recentTickets, [
      { label: 'Open', value: open, tone: 'open' },
      { label: 'In Progress', value: inProgress, tone: 'progress' },
      { label: 'Closed', value: closed, tone: 'closed' },
    ]);
  }

  private setCharts(
    _recentTickets: Ticket[],
    bars: Array<{ label: string; value: number; tone: 'open' | 'progress' | 'closed' }>,
  ): void {
    this.statusPieData = {
      ...this.statusPieData,
      datasets: [
        {
          ...this.statusPieData.datasets[0],
          data: bars.map((item) => item.value),
        },
      ],
    };
  }
}
