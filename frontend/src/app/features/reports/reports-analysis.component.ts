import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';

import { Ticket } from '../../core/models/ticket.models';
import { I18nPipe } from '../../core/pipes/i18n.pipe';
import { I18nService } from '../../core/services/i18n.service';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';

interface ReportStat {
  labelKey: string;
  value: number;
  hintKey: string;
  tone: 'blue' | 'amber' | 'green' | 'violet';
}

interface StatusBand {
  labelKey: string;
  value: number;
  percent: number;
  tone: 'open' | 'progress' | 'closed';
}

interface PriorityBand {
  labelKey: string;
  value: number;
  percent: number;
  tone: 'low' | 'medium' | 'high';
}

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, NgChartsModule, I18nPipe],
  template: `
    <section class="report-shell">
      <div class="header glass-card">
        <div>
          <div class="chip">{{ 'reports.chip' | t }}</div>
          <h1>{{ 'reports.title' | t }}</h1>
          <p>{{ 'reports.subtitle' | t }}</p>
        </div>
        <button mat-stroked-button type="button" (click)="loadReport()">{{ 'reports.refresh' | t }}</button>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card" [class.blue]="item.tone === 'blue'" [class.amber]="item.tone === 'amber'" [class.green]="item.tone === 'green'" [class.violet]="item.tone === 'violet'" *ngFor="let item of stats">
          <div class="stat-label">{{ item.labelKey | t }}</div>
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-hint">{{ item.hintKey | t }}</div>
        </mat-card>
      </div>

      <div class="panel-grid">
        <mat-card class="panel glass-card">
          <h2>{{ 'reports.status_title' | t }}</h2>
          <p class="sub">{{ 'reports.status_subtitle' | t }}</p>
          <div class="pie-area">
            <canvas
              baseChart
              [data]="statusChartData"
              [options]="statusChartOptions"
              [type]="'pie'">
            </canvas>
          </div>
          <div class="bands legend-bands">
            <div class="band" *ngFor="let row of statusBands">
              <div class="row-meta">
                <strong><span class="tone-dot" [class]="row.tone"></span>{{ row.labelKey | t }}</strong>
                <span>{{ row.value }} ({{ row.percent | number:'1.0-0' }}%)</span>
              </div>
            </div>
          </div>
        </mat-card>

        <mat-card class="panel glass-card">
          <h2>{{ 'reports.priority_title' | t }}</h2>
          <p class="sub">{{ 'reports.priority_subtitle' | t }}</p>
          <div class="pie-area">
            <canvas
              baseChart
              [data]="priorityChartData"
              [options]="priorityChartOptions"
              [type]="'doughnut'">
            </canvas>
          </div>
          <div class="bands legend-bands">
            <div class="band" *ngFor="let row of priorityBands">
              <div class="row-meta">
                <strong><span class="tone-dot" [class]="row.tone"></span>{{ row.labelKey | t }}</strong>
                <span>{{ row.value }} ({{ row.percent | number:'1.0-0' }}%)</span>
              </div>
            </div>
          </div>
        </mat-card>
      </div>

      <mat-card class="list-panel glass-card">
        <div class="list-head">
          <div>
            <h2>{{ 'reports.recent_title' | t }}</h2>
            <p class="sub">{{ 'reports.recent_subtitle' | t }}</p>
          </div>
        </div>

        <div class="ticket-list" *ngIf="recentTickets.length; else noRecent">
          <div class="ticket-row" *ngFor="let ticket of recentTickets">
            <div class="left">
              <strong>#{{ ticket.id }} {{ ticket.title }}</strong>
              <span>{{ 'reports.updated_by' | t: { name: ticket.created_by.full_name, date: ((ticket.updated_at | date:'short') || '') } }}</span>
            </div>
            <div class="right">
              <span class="status" [class.open]="ticket.status === 'open'" [class.progress]="ticket.status === 'in_progress'" [class.closed]="ticket.status === 'closed'">
                {{ ('tickets.status.' + ticket.status) | t }}
              </span>
              <span class="priority" [class.low]="ticket.priority === 'low'" [class.medium]="ticket.priority === 'medium'" [class.high]="ticket.priority === 'high'">{{ ('tickets.priority_' + ticket.priority) | t }}</span>
            </div>
          </div>
        </div>

        <ng-template #noRecent>
          <div class="muted">{{ 'reports.no_recent' | t }}</div>
        </ng-template>
      </mat-card>
    </section>
  `,
  styles: [`
    .report-shell {
      display: grid;
      gap: 20px;
    }
    .header {
      padding: 20px 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      background: linear-gradient(115deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.09));
    }
    .header h1 {
      margin: 10px 0 0;
      font-size: 30px;
      color: var(--primary-strong);
      letter-spacing: 0.02em;
    }
    .header p {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }
    .stat-card {
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 18px;
      box-shadow: var(--shadow);
      background: var(--surface);
    }
    .stat-card.blue { background: linear-gradient(160deg, rgba(37, 99, 235, 0.16), transparent 60%), var(--surface); }
    .stat-card.amber { background: linear-gradient(160deg, rgba(217, 119, 6, 0.16), transparent 60%), var(--surface); }
    .stat-card.green { background: linear-gradient(160deg, rgba(5, 150, 105, 0.16), transparent 60%), var(--surface); }
    .stat-card.violet { background: linear-gradient(160deg, rgba(37, 99, 235, 0.16), transparent 60%), var(--surface); }
    .stat-label {
      color: var(--muted);
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .stat-value {
      margin-top: 10px;
      font-size: 28px;
      font-weight: 800;
      color: var(--text);
      line-height: 1.1;
    }
    .stat-hint {
      margin-top: 6px;
      color: var(--muted);
      font-size: 12px;
    }
    .panel-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .panel,
    .list-panel {
      border-radius: 18px;
      padding: 18px;
    }
    h2 {
      margin: 0;
      font-size: 18px;
      color: var(--text);
    }
    .sub {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 12px;
    }
    .bands {
      display: grid;
      gap: 16px;
      margin-top: 16px;
    }
    .pie-area {
      margin-top: 16px;
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }
    .legend-bands {
      margin-top: 8px;
      gap: 10px;
    }
    .row-meta {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
      color: var(--muted);
      font-size: 13px;
    }
    .row-meta strong {
      color: var(--text);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .tone-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }
    .tone-dot.open { background: #3b82f6; }
    .tone-dot.progress { background: #f59e0b; }
    .tone-dot.closed { background: #10b981; }
    .tone-dot.low { background: #60a5fa; }
    .tone-dot.medium { background: #f59e0b; }
    .tone-dot.high { background: #ef4444; }
    .track {
      height: 12px;
      background: rgba(100, 116, 139, 0.12);
      border-radius: 999px;
      overflow: hidden;
    }
    .fill {
      height: 100%;
      border-radius: inherit;
      transition: width 220ms ease;
    }
    .fill.open { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .fill.progress { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .fill.closed { background: linear-gradient(135deg, #10b981, #059669); }
    .fill.low { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
    .fill.medium { background: linear-gradient(135deg, #f59e0b, #f97316); }
    .fill.high { background: linear-gradient(135deg, #f87171, #ef4444); }
    .list-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: start;
      margin-bottom: 12px;
    }
    .ticket-list {
      display: grid;
      gap: 10px;
    }
    .ticket-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: rgba(148, 163, 184, 0.06);
    }
    .left {
      display: grid;
      gap: 4px;
    }
    .left strong {
      color: var(--text);
      font-size: 13px;
    }
    .left span {
      color: var(--muted);
      font-size: 11px;
    }
    .right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .status,
    .priority {
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }
    .status.open { background: rgba(37, 99, 235, 0.14); color: #2563eb; }
    .status.progress { background: rgba(217, 119, 6, 0.14); color: #d97706; }
    .status.closed { background: rgba(5, 150, 105, 0.14); color: #059669; }
    .priority.low { background: rgba(59, 130, 246, 0.14); color: #1d4ed8; }
    .priority.medium { background: rgba(245, 158, 11, 0.14); color: #b45309; }
    .priority.high { background: rgba(239, 68, 68, 0.14); color: #dc2626; }
    .muted {
      color: var(--muted);
      font-size: 14px;
    }
    @media (max-width: 1100px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .panel-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 760px) {
      .header {
        flex-direction: column;
        align-items: stretch;
      }
      .header h1 {
        font-size: 30px;
      }
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .ticket-row {
        flex-direction: column;
        align-items: stretch;
      }
      .right {
        justify-content: flex-start;
      }
    }
  `],
})
export class ReportsAnalysisComponent {
  private ticketService = inject(TicketService);
  private notify = inject(NotificationService);
  private i18n = inject(I18nService);

  stats: ReportStat[] = [];
  statusBands: StatusBand[] = [];
  priorityBands: PriorityBand[] = [];
  statusChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
        hoverOffset: 6,
      },
    },
  };
  priorityChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    radius: '88%',
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
        hoverOffset: 8,
      },
    },
  };
  statusChartData: ChartData<'pie', number[], string> = {
    labels: ['Open', 'In Progress', 'Closed'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
      borderWidth: 0,
    }],
  };
  priorityChartData: ChartData<'doughnut', number[], string> = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#60a5fa', '#f59e0b', '#ef4444'],
      borderColor: ['#1e293b', '#1e293b', '#1e293b'],
      borderWidth: 1,
    }],
  };
  recentTickets: Ticket[] = [];
  constructor() {
    this.loadReport();
  }

  loadReport(): void {
    forkJoin({
      stats: this.ticketService.dashboard(),
      recent: this.ticketService.list({ page: 1, ordering: '-updated_at' }),
    }).subscribe({
      next: ({ stats, recent }) => {
        const total = stats['total_tickets'] ?? 0;
        const open = stats['open_tickets'] ?? 0;
        const closed = stats['closed_tickets'] ?? 0;
        const inProgress = Math.max(total - open - closed, 0);
        const highPriority = stats['high_priority'] ?? 0;

        const baseTotal = Math.max(total, 1);
        this.stats = [
          { labelKey: 'reports.stats.total', value: total, hintKey: 'reports.stats.total_hint', tone: 'blue' },
          { labelKey: 'reports.stats.open', value: open, hintKey: 'reports.stats.open_hint', tone: 'amber' },
          { labelKey: 'reports.stats.progress', value: inProgress, hintKey: 'reports.stats.progress_hint', tone: 'violet' },
          { labelKey: 'reports.stats.high', value: highPriority, hintKey: 'reports.stats.high_hint', tone: 'green' },
        ];

        this.statusBands = [
          { labelKey: 'tickets.status.open', value: open, percent: (open / baseTotal) * 100, tone: 'open' },
          { labelKey: 'tickets.status.in_progress', value: inProgress, percent: (inProgress / baseTotal) * 100, tone: 'progress' },
          { labelKey: 'tickets.status.closed', value: closed, percent: (closed / baseTotal) * 100, tone: 'closed' },
        ];

        const source = recent.results;
        const low = source.filter((t) => t.priority === 'low').length;
        const medium = source.filter((t) => t.priority === 'medium').length;
        const high = source.filter((t) => t.priority === 'high').length;
        const priorityTotal = Math.max(source.length, 1);

        this.priorityBands = [
          { labelKey: 'tickets.priority_low', value: low, percent: (low / priorityTotal) * 100, tone: 'low' },
          { labelKey: 'tickets.priority_medium', value: medium, percent: (medium / priorityTotal) * 100, tone: 'medium' },
          { labelKey: 'tickets.priority_high', value: high, percent: (high / priorityTotal) * 100, tone: 'high' },
        ];
        this.statusChartData = {
          ...this.statusChartData,
          datasets: [{
            ...this.statusChartData.datasets[0],
            data: [open, inProgress, closed],
          }],
        };
        this.priorityChartData = {
          ...this.priorityChartData,
          datasets: [{
            ...this.priorityChartData.datasets[0],
            data: [low, medium, high],
          }],
        };
        this.recentTickets = source.slice(0, 8);
      },
      error: (err) => {
        const message = err?.error?.detail || this.i18n.translate('reports.load_failed');
        this.notify.error(message);
      },
    });
  }

}
