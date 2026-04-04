import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';

import { User } from '../../core/models/auth.models';
import { Feedback } from '../../core/models/ticket.models';
import { TicketService } from '../../core/services/ticket.service';
import { UserManagementService } from '../../core/services/user-management.service';

type FeedbackCategory = 'support' | 'platform' | 'feature' | 'other';

interface RoleStats {
  total: number;
  avgRating: number;
  categories: Record<FeedbackCategory, number>;
}

@Component({
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <section class="page-shell analytics-shell">
      <header class="hero">
        <div>
          <div class="chip">Feedback</div>
          <h1>Customer & Agent Feedback</h1>
          <p class="muted">Simple feedback overview for super admin.</p>
        </div>
      </header>

      <div class="stats-grid">
        <article class="stat-card customer">
          <h2>Customer Feedback</h2>
          <div class="big">{{ customerStats.total }}</div>
          <p>Average rating: <strong>{{ customerStats.avgRating | number:'1.1-1' }}/5</strong></p>
        </article>
        <article class="stat-card agent">
          <h2>Agent Feedback</h2>
          <div class="big">{{ agentStats.total }}</div>
          <p>Average rating: <strong>{{ agentStats.avgRating | number:'1.1-1' }}/5</strong></p>
        </article>
      </div>

      <div class="graph-grid">
        <section class="graph-card">
          <h3>Customer Category Graph</h3>
          <div class="chart-area">
            <canvas
              baseChart
              [data]="customerChartData"
              [options]="customerChartOptions"
              [type]="'doughnut'">
            </canvas>
          </div>
          <div class="legend-list">
            <div class="legend-row" *ngFor="let row of customerBars">
              <div class="label"><span class="dot" [class]="row.label"></span>{{ row.label }}</div>
              <div class="count">{{ row.count }}</div>
            </div>
          </div>
        </section>

        <section class="graph-card">
          <h3>Agent Category Graph</h3>
          <div class="chart-area">
            <canvas
              baseChart
              [data]="agentChartData"
              [options]="agentChartOptions"
              [type]="'bar'">
            </canvas>
          </div>
          <div class="legend-list">
            <div class="legend-row" *ngFor="let row of agentBars">
              <div class="label"><span class="dot" [class]="row.label"></span>{{ row.label }}</div>
              <div class="count">{{ row.count }}</div>
            </div>
          </div>
        </section>
      </div>
    </section>
  `,
  styles: [`
    .analytics-shell {
      display: grid;
      gap: 18px;
    }
    .hero h1 {
      margin: 10px 0 0;
      color: #17366e;
      font-size: 34px;
    }
    .hero p {
      margin: 8px 0 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
    .stat-card {
      border-radius: 18px;
      border: 1px solid #d7e3f4;
      background: #ffffff;
      padding: 20px;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
    }
    .stat-card.customer {
      background: linear-gradient(145deg, #eef4ff, #f8fbff);
      border-color: #bfd5ff;
    }
    .stat-card.agent {
      background: linear-gradient(145deg, #eafcf4, #f5fff9);
      border-color: #b8efd5;
    }
    .stat-card h2 {
      margin: 0;
      color: #17366e;
      font-size: 22px;
    }
    .stat-card .big {
      margin-top: 8px;
      font-size: 38px;
      font-weight: 800;
      color: #17366e;
      line-height: 1;
    }
    .stat-card p {
      margin: 10px 0 0;
      color: #4b6288;
    }
    .graph-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
    .graph-card {
      border-radius: 18px;
      border: 1px solid #d7e3f4;
      background: #ffffff;
      padding: 18px;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
    }
    .graph-card h3 {
      margin: 0 0 14px;
      color: #17366e;
      font-size: 20px;
    }
    .chart-area {
      height: 220px;
      margin-bottom: 12px;
    }
    .legend-list {
      display: grid;
      gap: 10px;
    }
    .legend-row {
      display: grid;
      grid-template-columns: 1fr 32px;
      gap: 10px;
      align-items: center;
    }
    .label {
      color: #405a84;
      font-size: 14px;
      text-transform: capitalize;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }
    .dot.support { background: #3b82f6; }
    .dot.platform { background: #f59e0b; }
    .dot.feature { background: #14b8a6; }
    .dot.other { background: #8b5cf6; }
    .count {
      text-align: right;
      font-weight: 700;
      color: #17366e;
    }
    :host-context(.dark-theme) .hero h1,
    :host-context(.dark-theme) .stat-card h2,
    :host-context(.dark-theme) .stat-card .big,
    :host-context(.dark-theme) .graph-card h3,
    :host-context(.dark-theme) .count {
      color: #f8fbff;
    }
    :host-context(.dark-theme) .stat-card,
    :host-context(.dark-theme) .graph-card {
      background: #1b2a46;
      border-color: #6f93cb;
    }
    :host-context(.dark-theme) .stat-card p,
    :host-context(.dark-theme) .label {
      color: #d0def6;
    }
    @media (max-width: 980px) {
      .stats-grid,
      .graph-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class FeedbackAdminComponent {
  private ticketService = inject(TicketService);
  private userManagement = inject(UserManagementService);
  private readonly categoryLabels: FeedbackCategory[] = ['support', 'platform', 'feature', 'other'];

  feedbacks: Feedback[] = [];
  customerStats: RoleStats = this.emptyStats();
  agentStats: RoleStats = this.emptyStats();

  customerBars: Array<{ label: string; count: number; percent: number }> = [];
  agentBars: Array<{ label: string; count: number; percent: number }> = [];
  customerChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    radius: '88%',
    plugins: {
      legend: { display: false },
    },
    elements: {
      arc: {
        borderWidth: 0,
        hoverOffset: 8,
      },
    },
  };
  agentChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0, color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { display: false },
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
      },
    },
  };
  customerChartData: ChartData<'doughnut', number[], string> = {
    labels: ['Support', 'Platform', 'Feature', 'Other'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#3b82f6', '#f59e0b', '#14b8a6', '#8b5cf6'],
      borderWidth: 0,
    }],
  };
  agentChartData: ChartData<'bar', number[], string> = {
    labels: ['Support', 'Platform', 'Feature', 'Other'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#2563eb', '#ea580c', '#0d9488', '#7c3aed'],
      borderColor: ['#2563eb', '#ea580c', '#0d9488', '#7c3aed'],
      borderWidth: 0,
      maxBarThickness: 22,
    }],
  };

  constructor() {
    forkJoin({
      feedback: this.ticketService.listFeedback({ page: 1, page_size: 500 }),
      users: this.userManagement.listUsers(),
    }).subscribe({
      next: ({ feedback, users }) => {
        this.feedbacks = feedback.results ?? [];
        this.buildStats(users);
      },
      error: () => {
        this.feedbacks = [];
        this.buildStats([]);
      },
    });
  }

  private buildStats(users: User[]): void {
    const roleByUserId = new Map<number, string>(users.map((user) => [user.id, user.role]));
    const customerFeedback = this.feedbacks.filter((f) => roleByUserId.get(f.user) === 'customer');
    const agentFeedback = this.feedbacks.filter((f) => roleByUserId.get(f.user) === 'agent');

    this.customerStats = this.computeRoleStats(customerFeedback);
    this.agentStats = this.computeRoleStats(agentFeedback);

    this.customerBars = this.toBars(this.customerStats.categories);
    this.agentBars = this.toBars(this.agentStats.categories);
    this.customerChartData = {
      ...this.customerChartData,
      datasets: [{
        ...this.customerChartData.datasets[0],
        data: this.toChartValues(this.customerStats.categories),
      }],
    };
    this.agentChartData = {
      ...this.agentChartData,
      datasets: [{
        ...this.agentChartData.datasets[0],
        data: this.toChartValues(this.agentStats.categories),
      }],
    };
  }

  private computeRoleStats(list: Feedback[]): RoleStats {
    const categories: Record<FeedbackCategory, number> = {
      support: 0,
      platform: 0,
      feature: 0,
      other: 0,
    };
    if (!list.length) {
      return { total: 0, avgRating: 0, categories };
    }

    let ratingTotal = 0;
    list.forEach((feedback) => {
      const category = feedback.category as FeedbackCategory;
      categories[category] = (categories[category] ?? 0) + 1;
      ratingTotal += feedback.rating;
    });

    return {
      total: list.length,
      avgRating: ratingTotal / list.length,
      categories,
    };
  }

  private toBars(categories: Record<FeedbackCategory, number>): Array<{ label: string; count: number; percent: number }> {
    const rows = (Object.keys(categories) as FeedbackCategory[]).map((key) => ({
      label: key,
      count: categories[key],
    }));
    const max = Math.max(...rows.map((row) => row.count), 1);
    return rows.map((row) => ({
      ...row,
      percent: (row.count / max) * 100,
    }));
  }

  private toChartValues(categories: Record<FeedbackCategory, number>): number[] {
    return this.categoryLabels.map((key) => categories[key] ?? 0);
  }

  private emptyStats(): RoleStats {
    return {
      total: 0,
      avgRating: 0,
      categories: {
        support: 0,
        platform: 0,
        feature: 0,
        other: 0,
      },
    };
  }
}
