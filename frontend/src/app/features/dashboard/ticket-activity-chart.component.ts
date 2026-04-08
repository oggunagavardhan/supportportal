import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TicketActivityService, TicketActivityData } from '../../core/services/ticket-activity.service';

Chart.register(...registerables);

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Component({
  selector: 'app-ticket-activity-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, NgChartsModule],
  template: `
    <mat-card class="chart-card">
      <div class="chart-header">
        <div>
          <h3>Ticket Activity</h3>
          <p class="chart-subtitle">Recent activity across the latest visible tickets.</p>
        </div>
        <div class="chart-controls">
          <button mat-stroked-button [class.active]="selectedRange === '1W'" (click)="setRange('1W')">1W</button>
          <button mat-stroked-button [class.active]="selectedRange === '1M'" (click)="setRange('1M')">1M</button>
          <button mat-stroked-button [class.active]="selectedRange === '1Y'" (click)="setRange('1Y')">1Y</button>
        </div>
      </div>

      <div class="chart-container" *ngIf="chartData && !isLoading">
        <canvas 
          baseChart 
          [data]="chartData"
          [options]="chartOptions"
          type="bar">
        </canvas>
      </div>

      <div class="loading" *ngIf="isLoading">
        <p>Loading ticket activity data...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button mat-button (click)="loadData()">Retry</button>
      </div>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .chart-card {
      padding: 24px;
      border-radius: 20px;
      border: 1px solid #dfe7f4;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
      background: #ffffff;
      width: 100%;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .chart-header h3 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: #17366e;
    }

    .chart-subtitle {
      margin: 6px 0 0;
      font-size: 14px;
      color: #64748b;
    }

    .chart-controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .chart-controls button {
      min-width: 60px;
      border-radius: 10px;
      font-weight: 600;
    }

    .chart-controls button.active {
      background-color: #2563eb;
      color: #ffffff;
    }

    :host-context(.dark-theme) .chart-header h3 {
      color: #e2e8f0;
    }

    :host-context(.dark-theme) .chart-subtitle,
    :host-context(.dark-theme) .loading {
      color: #94a3b8;
    }

    :host-context(.dark-theme) .chart-card {
      background: #131a2b;
      border-color: #233047;
      box-shadow: none;
    }

    :host-context(.dark-theme) .chart-controls button {
      color: #ffffff;
      border-color: rgba(148, 163, 184, 0.45);
    }

    :host-context(.dark-theme) .chart-controls .mat-mdc-stroked-button:not(.active) {
      color: #ffffff !important;
      --mdc-outlined-button-label-text-color: #ffffff;
    }

    :host-context(.dark-theme) .chart-controls button.active {
      color: #ffffff;
      border-color: #2563eb;
    }

    .chart-container {
      position: relative;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading, .error {
      text-align: center;
      padding: 40px 20px;
      color: #6b7280;
    }

    .error {
      color: #dc2626;
    }
  `],
})
export class TicketActivityChartComponent implements OnInit, OnDestroy {
  private ticketActivityService = inject(TicketActivityService);
  private destroy$ = new Subject<void>();
  private themeObserver?: MutationObserver;

  chartData: any;
  chartOptions: ChartConfiguration['options'] = {};
  isLoading = false;
  error: string | null = null;
  selectedRange = '1W';
  allData: TicketActivityData[] = [];

  ngOnInit(): void {
    this.initializeChart();
    this.loadData();
    this.observeThemeChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.themeObserver?.disconnect();
  }

  private initializeChart(): void {
    const isDarkTheme = this.isDarkThemeActive();
    const axisColor = isDarkTheme ? '#ffffff' : '#6b7280';
    const gridColor = isDarkTheme ? 'rgba(148, 163, 184, 0.22)' : 'rgba(15, 23, 42, 0.08)';
    const tooltipBg = isDarkTheme ? '#0f172a' : '#111827';
    const tooltipText = '#f8fafc';

    const that = this;
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipText,
          bodyColor: tooltipText,
          borderColor: isDarkTheme ? '#334155' : 'transparent',
          borderWidth: isDarkTheme ? 1 : 0,
          callbacks: {
            title: (context: any) => {
              const index = context[0].dataIndex;
              const item = that.filterDataByRange(that.allData, that.selectedRange)[index];
              if (!item) return '';
              const date = new Date(item.date);
              return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
          },
          border: {
            color: gridColor,
          },
          ticks: {
            stepSize: 1,
            precision: 0,
            color: axisColor
          },
        },
        x: {
          grid: {
            display: false,
          },
          border: {
            color: gridColor,
          },
          ticks: {
            maxRotation: 25,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 31,
            color: axisColor,
            font: {
              size: 10
            }
          },
        },
      } as any,
    };
  }

  private isDarkThemeActive(): boolean {
    return document.documentElement.classList.contains('dark-theme')
      || document.body.classList.contains('dark-theme');
  }

  private observeThemeChanges(): void {
    this.themeObserver = new MutationObserver(() => {
      this.initializeChart();
      if (this.allData.length > 0) {
        this.updateChart(this.filterDataByRange(this.allData, this.selectedRange));
      }
    });

    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    this.ticketActivityService
      .getTicketActivity()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: TicketActivityData[]) => {
          this.allData = data;
          this.updateChart(this.filterDataByRange(data, this.selectedRange));
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading ticket activity:', error);
          this.error = 'Failed to load ticket activity data. Please try again.';
          this.isLoading = false;
        },
      });
  }

  private filterDataByRange(data: TicketActivityData[], range: string): TicketActivityData[] {
    const now = new Date();
    // Set now to end of day to include today's data fully
    now.setHours(23, 59, 59, 999);
    
    let daysToShow = 7;
    switch (range) {
      case '1M': daysToShow = 30; break;
      case '1Y': daysToShow = 365; break;
      case '1W': default: daysToShow = 7; break;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysToShow);
    cutoffDate.setHours(0, 0, 0, 0);

    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate && itemDate <= now;
    });
  }

  private updateChart(data: TicketActivityData[]): void {
    let labels: string[] = [];
    let counts: number[] = [];

    if (this.selectedRange === '1Y') {
      // Aggregate by month
      const monthlyData = new Map<string, number>();
      // Initialize all 12 months with 0
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        monthlyData.set(key, 0);
      }

      data.forEach(item => {
        const d = new Date(item.date);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        if (monthlyData.has(key)) {
          monthlyData.set(key, monthlyData.get(key)! + item.count);
        }
      });

      labels = Array.from(monthlyData.keys()).map(key => {
        const [year, month] = key.split('-').map(Number);
        return MONTH_NAMES[month - 1];
      });
      counts = Array.from(monthlyData.values());
    } else {
      labels = data.map((item) => {
        const d = new Date(item.date);
        return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
      });
      counts = data.map((item) => item.count);
    }

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Tickets',
          data: counts,
          backgroundColor: '#1e63e9',
          hoverBackgroundColor: '#1749ae',
          borderRadius: 4,
          borderSkipped: false,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
          maxBarThickness: 45,
        },
      ],
    };
  }

  setRange(range: string): void {
    this.selectedRange = range;
    this.initializeChart();
    this.updateChart(this.filterDataByRange(this.allData, range));
  }
}
