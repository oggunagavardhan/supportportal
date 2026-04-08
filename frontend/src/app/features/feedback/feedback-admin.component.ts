import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { Feedback } from '../../core/models/ticket.models';
import { TicketService } from '../../core/services/ticket.service';
import { I18nPipe } from '../../core/pipes/i18n.pipe';
import { I18nService } from '../../core/services/i18n.service';

type FeedbackCategory = 'support' | 'platform' | 'feature' | 'other';

interface RoleStats {
  total: number;
  avgRating: number;
  categories: Record<FeedbackCategory, number>;
}

interface FeedbackRowView {
  id: number;
  userName: string;
  role: string;
  category: FeedbackCategory;
  rating: number;
  comments: string;
  created_at: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, NgChartsModule, I18nPipe],
  template: `
    <section class="page-shell analytics-shell">
      <header class="hero">
        <div>
          <div class="chip">{{ 'feedback.admin.chip' | t }}</div>
          <h1>{{ 'feedback.admin.title' | t }}</h1>
          <p class="muted">{{ 'feedback.admin.subtitle' | t }}</p>
        </div>
      </header>

      <div class="stats-grid">
        <article class="stat-card customer">
          <h2>{{ 'feedback.admin.customer_title' | t }}</h2>
          <div class="big">{{ customerStats.total }}</div>
          <p>{{ 'feedback.admin.avg_rating' | t }}: <strong>{{ customerStats.avgRating | number:'1.1-1' }}/5</strong></p>
        </article>
        <article class="stat-card agent">
          <h2>{{ 'feedback.admin.agent_title' | t }}</h2>
          <div class="big">{{ agentStats.total }}</div>
          <p>{{ 'feedback.admin.avg_rating' | t }}: <strong>{{ agentStats.avgRating | number:'1.1-1' }}/5</strong></p>
        </article>
      </div>

      <div class="graph-grid">
        <section class="graph-card">
          <h3>{{ 'feedback.admin.customer_graph' | t }}</h3>
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
              <div class="label"><span class="dot" [class]="row.label"></span>{{ categoryLabel(row.label) }}</div>
              <div class="count">{{ row.count }}</div>
            </div>
          </div>
        </section>

        <section class="graph-card">
          <h3>{{ 'feedback.admin.agent_graph' | t }}</h3>
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
              <div class="label"><span class="dot" [class]="row.label"></span>{{ categoryLabel(row.label) }}</div>
              <div class="count">{{ row.count }}</div>
            </div>
          </div>
        </section>
      </div>

      <section class="feedback-feed-card">
        <h3>{{ 'feedback.admin.recent_title' | t }}</h3>
        <div class="feedback-feed" *ngIf="recentFeedback.length; else noRecentFeedback">
          <article class="feedback-item" *ngFor="let item of recentFeedback | slice:0:12">
            <div class="item-top">
              <div class="item-meta">
                <strong>{{ item.userName }}</strong>
                <span class="role-pill">{{ item.role | titlecase }}</span>
                <span class="cat-pill">{{ categoryLabel(item.category) }}</span>
              </div>
              <time>{{ item.created_at | date:'medium' }}</time>
            </div>
            <div class="rating">{{ stars(item.rating) }}</div>
            <p>{{ item.comments }}</p>
          </article>
        </div>
        <ng-template #noRecentFeedback>
          <p class="no-feedback">{{ 'feedback.admin.empty' | t }}</p>
        </ng-template>
      </section>
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
    .feedback-feed-card {
      border-radius: 18px;
      border: 1px solid #d7e3f4;
      background: #ffffff;
      padding: 18px;
    }
    .feedback-feed-card h3 {
      margin: 0 0 12px;
      color: #17366e;
      font-size: 20px;
    }
    .feedback-feed {
      display: grid;
      gap: 10px;
    }
    .feedback-item {
      border: 1px solid #d5c8f7;
      border-radius: 12px;
      padding: 12px;
      background: #fcfaff;
    }
    .item-top {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
    }
    .item-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .item-meta strong {
      color: #17366e;
    }
    .role-pill, .cat-pill {
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      border: 1px solid #d5c8f7;
      color: #5b4a8f;
      background: #f7f2ff;
    }
    .item-top time {
      font-size: 12px;
      color: #64748b;
      white-space: nowrap;
    }
    .rating {
      margin-top: 6px;
      color: #f59e0b;
      letter-spacing: 1px;
      font-size: 14px;
    }
    .feedback-item p {
      margin: 8px 0 0;
      color: #334155;
      line-height: 1.45;
    }
    .no-feedback {
      margin: 0;
      color: #64748b;
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
    .dot.other { background: #2563eb; }
    .count {
      text-align: right;
      font-weight: 700;
      color: #17366e;
    }
    :host-context(.dark-theme) .hero h1,
    :host-context(.dark-theme) .stat-card h2,
    :host-context(.dark-theme) .stat-card .big,
    :host-context(.dark-theme) .graph-card h3,
    :host-context(.dark-theme) .feedback-feed-card h3,
    :host-context(.dark-theme) .item-meta strong,
    :host-context(.dark-theme) .count {
      color: #f8fbff;
    }
    :host-context(.dark-theme) .stat-card,
    :host-context(.dark-theme) .graph-card,
    :host-context(.dark-theme) .feedback-feed-card {
      background: #1b2a46;
      border-color: #6f93cb;
    }
    :host-context(.dark-theme) .stat-card p,
    :host-context(.dark-theme) .label,
    :host-context(.dark-theme) .feedback-item p,
    :host-context(.dark-theme) .item-top time,
    :host-context(.dark-theme) .no-feedback {
      color: #d0def6;
    }
    :host-context(.dark-theme) .feedback-item {
      background: #1a2741;
      border-color: #7b67a8;
    }
    :host-context(.dark-theme) .role-pill,
    :host-context(.dark-theme) .cat-pill {
      border-color: #7b67a8;
      color: #e7d9ff;
      background: #2a2050;
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
  private i18n = inject(I18nService);
  private readonly categoryLabels: FeedbackCategory[] = ['support', 'platform', 'feature', 'other'];

  feedbacks: Feedback[] = [];
  customerStats: RoleStats = this.emptyStats();
  agentStats: RoleStats = this.emptyStats();

  customerBars: Array<{ label: FeedbackCategory; count: number; percent: number }> = [];
  agentBars: Array<{ label: FeedbackCategory; count: number; percent: number }> = [];
  recentFeedback: FeedbackRowView[] = [];
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
    indexAxis: 'x',
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, stepSize: 1, color: '#94a3b8' },
        suggestedMax: 5,
        grace: '5%',
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false,
      },
    },
  };
  customerChartData: ChartData<'doughnut', number[], string> = {
    labels: ['Support', 'Platform', 'Feature', 'Other'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#3b82f6', '#f59e0b', '#14b8a6', '#2563eb'],
      borderWidth: 0,
    }],
  };
  agentChartData: ChartData<'bar', number[], string> = {
    labels: ['Support', 'Platform', 'Feature', 'Other'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#2563eb', '#ea580c', '#0d9488', '#1d4ed8'],
      borderColor: ['#2563eb', '#ea580c', '#0d9488', '#1d4ed8'],
      borderWidth: 0,
      maxBarThickness: 22,
    }],
  };

  constructor() {
    this.ticketService.listFeedback({ page: 1, page_size: 500 }).subscribe({
      next: (feedback) => {
        const raw = feedback as unknown as Feedback[] | { results?: Feedback[] };
        const results = Array.isArray(raw) ? raw : (raw.results ?? []);
        this.feedbacks = results;
        this.buildStats();
      },
      error: () => {
        this.feedbacks = [];
        this.buildStats();
      },
    });
  }

  private buildStats(): void {
    const customerFeedback = this.feedbacks.filter((f) => this.resolveRole(f) === 'customer');
    const agentFeedback = this.feedbacks.filter((f) => this.resolveRole(f) === 'agent');

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

    this.recentFeedback = [...this.feedbacks]
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
      .map((item) => ({
        id: item.id,
        userName: item.user_name ?? `User #${item.user}`,
        role: this.resolveRole(item),
        category: item.category as FeedbackCategory,
        rating: item.rating,
        comments: item.comments,
        created_at: item.created_at,
      }));
  }

  stars(rating: number): string {
    const safe = Math.max(0, Math.min(5, rating));
    return '★'.repeat(safe) + '☆'.repeat(5 - safe);
  }

  categoryLabel(category: FeedbackCategory): string {
    if (category === 'support') return this.i18n.translate('feedback.category_support');
    if (category === 'platform') return this.i18n.translate('feedback.category_platform');
    if (category === 'feature') return this.i18n.translate('feedback.category_feature');
    return this.i18n.translate('feedback.category_other');
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

  private toBars(categories: Record<FeedbackCategory, number>): Array<{ label: FeedbackCategory; count: number; percent: number }> {
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

  private resolveRole(item: Feedback): string {
    const role = (item.user_role ?? '').toLowerCase();
    if (role === 'agent' || role === 'customer' || role === 'admin') {
      return role;
    }
    // Fallback for older API payloads that don't include role yet.
    return 'customer';
  }
}
