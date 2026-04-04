import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { interval, Subscription } from 'rxjs';
import { AgentPerformanceService, AgentPerformanceData } from '../../core/services/agent-performance.service';

interface TeamMetrics {
  totalTickets: number;
  averageResolutionTime: number;
  teamSatisfaction: number;
  activeAgents: number;
}

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
  ],
  template: `
    <div class="performance-container">
      <div class="header">
        <h1>Agent Performance</h1>
        <p class="subtitle">Individual agent productivity and ticket resolution metrics</p>
      </div>

      <!-- Team Overview -->
      <div class="team-metrics-grid">
        <mat-card class="metric-card">
          <mat-card-content>
            <div class="metric-label">Active Agents</div>
            <div class="metric-value">{{ teamMetrics.activeAgents }}</div>
            <p class="status-text">Team members online</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-content>
            <div class="metric-label">Total Tickets Solved</div>
            <div class="metric-value">{{ teamMetrics.totalTickets }}</div>
            <p class="status-text">Closed this period</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-content>
            <div class="metric-label">Avg Resolution Time</div>
            <div class="metric-value">{{ teamMetrics.averageResolutionTime }}<span class="unit">h</span></div>
            <p class="status-text">Average across team</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-content>
            <div class="metric-label">Satisfaction Score</div>
            <div class="metric-value">{{ teamMetrics.teamSatisfaction }}<span class="unit">/5</span></div>
            <p class="status-text">Based on feedback</p>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Agent Performance Table -->
      <mat-tab-group>
        <mat-tab label="All Agents">
          <div class="tab-content">
            <div class="agents-table" *ngIf="agents.length > 0; else noData">
              <table mat-table [dataSource]="agents" class="agents-data-table">
                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let element">
                    <span class="status-badge" [ngClass]="element.status">
                      <span class="status-dot"></span>
                      {{ element.status | titlecase }}
                    </span>
                  </td>
                </ng-container>

                <!-- Name Column -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Agent Name</th>
                  <td mat-cell *matCellDef="let element">
                    <div class="agent-info">
                      <div class="agent-avatar">{{ getInitials(element.name) }}</div>
                      <div>
                        <p class="agent-name">{{ element.name }}</p>
                        <p class="agent-email">{{ element.email }}</p>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <!-- Tickets Solved Column -->
                <ng-container matColumnDef="ticketsSolved">
                  <th mat-header-cell *matHeaderCellDef>Tickets Solved</th>
                  <td mat-cell *matCellDef="let element">
                    <div class="progress-column">
                      <span class="progress-value">{{ element.ticketsSolved }}/{{ element.monthlyTarget }}</span>
                      <mat-progress-bar
                        mode="determinate"
                        [value]="(element.ticketsSolved / element.monthlyTarget) * 100"
                        class="mini-progress"
                      ></mat-progress-bar>
                    </div>
                  </td>
                </ng-container>

                <!-- Resolution Time Column -->
                <ng-container matColumnDef="resolutionTime">
                  <th mat-header-cell *matHeaderCellDef>Avg Resolution</th>
                  <td mat-cell *matCellDef="let element">
                    <span class="time-badge">{{ element.averageResolutionTime }}h</span>
                  </td>
                </ng-container>

                <!-- Customer Satisfaction Column -->
                <ng-container matColumnDef="satisfaction">
                  <th mat-header-cell *matHeaderCellDef>Satisfaction</th>
                  <td mat-cell *matCellDef="let element">
                    <div class="satisfaction-rating">
                      <span class="stars">{{ getStarRating(element.customerSatisfaction) }}</span>
                      <span class="rating-text">{{ element.customerSatisfaction.toFixed(1) }}/5</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Response Time Column -->
                <ng-container matColumnDef="responseTime">
                  <th mat-header-cell *matHeaderCellDef>Response Time</th>
                  <td mat-cell *matCellDef="let element">
                    <span [ngClass]="getResponseTimeClass(element.responseTime)">{{ element.responseTime }}m</span>
                  </td>
                </ng-container>

                <!-- Online Hours Column -->
                <ng-container matColumnDef="onlineHours">
                  <th mat-header-cell *matHeaderCellDef>Online Hours</th>
                  <td mat-cell *matCellDef="let element">
                    {{ element.onlineHours }}h
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
            <ng-template #noData>
              <div class="no-data">Loading agent data...</div>
            </ng-template>
          </div>
        </mat-tab>

        <!-- Top Performers Tab -->
        <mat-tab label="Top Performers">
          <div class="tab-content">
            <div class="top-performers-grid" *ngIf="getTopPerformers().length > 0">
              <div class="performer-card" *ngFor="let agent of getTopPerformers(); let i = index">
                <div class="performer-rank">{{ i + 1 }}</div>
                <div class="performer-info">
                  <div class="performer-avatar">{{ getInitials(agent.name) }}</div>
                  <h4>{{ agent.name }}</h4>
                  <p class="role">{{ agent.role }}</p>
                </div>
                <div class="performer-stats">
                  <div class="stat">
                    <span class="stat-label">Tickets</span>
                    <span class="stat-value">{{ agent.ticketsSolved }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Satisfaction</span>
                    <span class="stat-value">{{ agent.customerSatisfaction.toFixed(1) }}/5</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Resolution</span>
                    <span class="stat-value">{{ agent.averageResolutionTime }}h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Performance Trends Tab -->
        <mat-tab label="Performance Trends">
          <div class="tab-content" *ngIf="agents.length > 0">
            <div class="trends-container">
              <div class="trend-card">
                <h3>Highest Satisfaction Score</h3>
                <p class="trend-value">{{ getHighestSatisfaction().toFixed(1) }}/5</p>
                <p class="trend-agent">{{ getHighestSatisfactionAgent()?.name }}</p>
              </div>
              <div class="trend-card">
                <h3>Fastest Resolution</h3>
                <p class="trend-value">{{ getFastestResolution() }}h</p>
                <p class="trend-agent">{{ getFastestResolutionAgent()?.name }}</p>
              </div>
              <div class="trend-card">
                <h3>Most Tickets Solved</h3>
                <p class="trend-value">{{ getMostTicketsSolved() }}</p>
                <p class="trend-agent">{{ getMostTicketsSolvedAgent()?.name }}</p>
              </div>
              <div class="trend-card">
                <h3>Best Response Time</h3>
                <p class="trend-value">{{ getFastestResponseTime() }}m</p>
                <p class="trend-agent">{{ getFastestResponseTimeAgent()?.name }}</p>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>

      <!-- Last Updated -->
      <div class="footer">
        <p>Last updated: {{ lastUpdated | date: 'medium' }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .performance-container {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .header {
        margin-bottom: 32px;

        h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          color: var(--primary-strong);
          font-weight: 600;
        }

        .subtitle {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
        }
      }

      .team-metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 32px;
      }

      .metric-card {
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        mat-card-content {
          padding: 20px;
        }

        .metric-label {
          font-size: 14px;
          color: var(--muted);
          margin-bottom: 12px;
          font-weight: 600;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 8px;

          .unit {
            font-size: 16px;
            font-weight: normal;
            margin-left: 4px;
            color: var(--muted);
          }
        }

        .status-text {
          margin: 0;
          font-size: 12px;
          color: var(--muted);
        }
      }

      mat-tab-group {
        margin-bottom: 24px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .tab-content {
        padding: 24px;
      }

      .no-data {
        text-align: center;
        padding: 40px 20px;
        color: var(--muted);
      }

      .agents-table {
        overflow-x: auto;
      }

      .agents-data-table {
        width: 100%;

        th {
          background-color: rgba(0, 0, 0, 0.04);
          font-weight: 600;
          color: var(--primary-strong);
          text-transform: uppercase;
          font-size: 12px;
        }

        tr:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }

        .agent-info {
          display: flex;
          align-items: center;
          gap: 12px;

          .agent-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
          }

          .agent-name {
            margin: 0;
            font-weight: 600;
            color: var(--primary-strong);
          }

          .agent-email {
            margin: 0;
            font-size: 12px;
            color: var(--muted);
          }
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;

          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
          }

          &.active {
            background-color: #e8f5e9;
            color: #2e7d32;

            .status-dot {
              background-color: #4caf50;
            }
          }

          &.away {
            background-color: #fff3e0;
            color: #e65100;

            .status-dot {
              background-color: #ff9800;
            }
          }

          &.offline {
            background-color: #f5f5f5;
            color: #616161;

            .status-dot {
              background-color: #9e9e9e;
            }
          }
        }

        .progress-column {
          display: flex;
          flex-direction: column;
          gap: 6px;

          .progress-value {
            font-size: 12px;
            font-weight: 600;
            color: var(--primary-strong);
          }

          .mini-progress {
            height: 4px;
            border-radius: 2px;
          }
        }

        .time-badge {
          display: inline-block;
          padding: 4px 8px;
          background-color: #e3f2fd;
          color: #1976d2;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .satisfaction-rating {
          display: flex;
          align-items: center;
          gap: 8px;

          .stars {
            font-size: 12px;
            color: #ffc107;
          }

          .rating-text {
            font-size: 12px;
            font-weight: 600;
            color: var(--primary-strong);
          }
        }
      }

      .top-performers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;

        .performer-card {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          position: relative;

          .performer-rank {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }

          .performer-info {
            margin-bottom: 20px;

            .performer-avatar {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              font-size: 20px;
              margin: 0 auto 12px;
            }

            h4 {
              margin: 0 0 4px 0;
              color: var(--primary-strong);
              font-size: 16px;
            }

            .role {
              margin: 0;
              font-size: 12px;
              color: var(--muted);
              text-transform: uppercase;
            }
          }

          .performer-stats {
            display: flex;
            justify-content: space-around;

            .stat {
              display: flex;
              flex-direction: column;

              .stat-label {
                font-size: 11px;
                color: var(--muted);
                text-transform: uppercase;
                margin-bottom: 4px;
              }

              .stat-value {
                font-size: 18px;
                font-weight: 600;
                color: var(--primary);
              }
            }
          }
        }
      }

      .trends-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;

        .trend-card {
          background: linear-gradient(135deg, rgba(33, 150, 243, 0.08), rgba(33, 150, 243, 0.02));
          border: 1px solid rgba(33, 150, 243, 0.1);
          border-radius: 12px;
          padding: 24px;
          text-align: center;

          h3 {
            margin: 0 0 12px 0;
            font-size: 14px;
            color: var(--muted);
            text-transform: uppercase;
            font-weight: 600;
          }

          .trend-value {
            margin: 0 0 8px 0;
            font-size: 32px;
            font-weight: 700;
            color: var(--primary);
          }

          .trend-agent {
            margin: 0;
            font-size: 14px;
            color: var(--primary-strong);
            font-weight: 600;
          }
        }
      }

      .footer {
        text-align: center;
        padding-top: 24px;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        color: var(--muted);
        font-size: 12px;

        p {
          margin: 0;
        }
      }
    `,
  ],
})
export class PerformanceComponent implements OnInit, OnDestroy {
  agents: AgentPerformanceData[] = [];
  displayedColumns = ['status', 'name', 'ticketsSolved', 'resolutionTime', 'satisfaction', 'responseTime', 'onlineHours'];
  lastUpdated = new Date();

  teamMetrics: TeamMetrics = {
    totalTickets: 0,
    averageResolutionTime: 0,
    teamSatisfaction: 0,
    activeAgents: 0,
  };

  private updateSubscription: Subscription | null = null;

  constructor(private performanceService: AgentPerformanceService) {}

  ngOnInit(): void {
    this.loadPerformanceData();
    this.startRefreshing();
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  private loadPerformanceData(): void {
    this.performanceService.getAgentPerformance().subscribe({
      next: (data) => {
        this.agents = data;
        this.lastUpdated = new Date();
      },
      error: (err) => console.error('Error loading agent performance:', err),
    });

    this.performanceService.getTeamMetrics().subscribe({
      next: (data) => {
        this.teamMetrics = data;
      },
      error: (err) => console.error('Error loading team metrics:', err),
    });
  }

  private startRefreshing(): void {
    this.updateSubscription = interval(30000).subscribe(() => {
      this.loadPerformanceData();
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '★ ';
    }
    if (hasHalfStar && fullStars < 5) {
      stars += '⋆ ';
    }
    return stars.trim();
  }

  getTopPerformers(): AgentPerformanceData[] {
    return [...this.agents]
      .sort((a, b) => b.ticketsSolved - a.ticketsSolved)
      .slice(0, 3);
  }

  getResponseTimeClass(responseTime: number): string {
    if (responseTime <= 2) return 'fast';
    if (responseTime <= 3) return 'medium';
    return 'slow';
  }

  getHighestSatisfaction(): number {
    return Math.max(...this.agents.map((a) => a.customerSatisfaction), 0);
  }

  getHighestSatisfactionAgent(): AgentPerformanceData | undefined {
    return this.agents.reduce((prev, current) =>
      current.customerSatisfaction > prev.customerSatisfaction ? current : prev
    );
  }

  getFastestResolution(): number {
    const times = this.agents.map((a) => a.averageResolutionTime).filter((t) => t > 0);
    return times.length > 0 ? Math.min(...times) : 0;
  }

  getFastestResolutionAgent(): AgentPerformanceData | undefined {
    return this.agents.reduce((prev, current) =>
      current.averageResolutionTime < prev.averageResolutionTime ? current : prev
    );
  }

  getMostTicketsSolved(): number {
    return Math.max(...this.agents.map((a) => a.ticketsSolved), 0);
  }

  getMostTicketsSolvedAgent(): AgentPerformanceData | undefined {
    return this.agents.reduce((prev, current) =>
      current.ticketsSolved > prev.ticketsSolved ? current : prev
    );
  }

  getFastestResponseTime(): number {
    return Math.min(...this.agents.map((a) => a.responseTime), 0);
  }

  getFastestResponseTimeAgent(): AgentPerformanceData | undefined {
    return this.agents.reduce((prev, current) =>
      current.responseTime < prev.responseTime ? current : prev
    );
  }
}
