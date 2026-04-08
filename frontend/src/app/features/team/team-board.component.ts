import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { User } from '../../core/models/auth.models';
import { Ticket, TicketUpdatePayload } from '../../core/models/ticket.models';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';

interface TeamMemberSummary {
  user: User;
  assignedCount: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatSelectModule, MatFormFieldModule],
  template: `
    <section class="team-shell">
      <header class="section-header">
        <div class="header-main">
          <div class="header-title-block">
            <div class="header-chip">Assign Tickets</div>
            <h1>Ticket Assignment Console</h1>
          </div>
          <p class="intro">Track queue health, review pending tickets, and route issues to the right staff member quickly.</p>
        </div>
      </header>

      <div class="metrics">
        <mat-card class="metric-card staff">
          <div class="metric-label">Staff Members</div>
          <div class="metric-value">{{ staff.length }}</div>
        </mat-card>
        <mat-card class="metric-card total">
          <div class="metric-label">Visible Tickets</div>
          <div class="metric-value">{{ visibleTickets.length }}</div>
        </mat-card>
        <mat-card class="metric-card open">
          <div class="metric-label">Open</div>
          <div class="metric-value">{{ statusCounts.open }}</div>
        </mat-card>
        <mat-card class="metric-card progress">
          <div class="metric-label">In Progress</div>
          <div class="metric-value">{{ statusCounts.in_progress }}</div>
        </mat-card>
        <mat-card class="metric-card closed">
          <div class="metric-label">Closed</div>
          <div class="metric-value">{{ statusCounts.closed }}</div>
        </mat-card>
        <mat-card class="metric-card unassigned">
          <div class="metric-label">Unassigned</div>
          <div class="metric-value">{{ unassignedCount }}</div>
        </mat-card>
      </div>

      <div class="team-grid">
        <mat-card class="team-card tickets-card">
          <div class="card-head">
            <h2>Pending Issues</h2>
            <div class="filter-actions">
              <button type="button" class="filter-btn" [class.active]="statusFilter === ''" (click)="statusFilter=''">All</button>
              <button type="button" class="filter-btn" [class.active]="statusFilter === 'open'" (click)="statusFilter='open'">Open</button>
              <button type="button" class="filter-btn" [class.active]="statusFilter === 'in_progress'" (click)="statusFilter='in_progress'">In Progress</button>
              <button type="button" class="filter-btn" [class.active]="statusFilter === 'closed'" (click)="statusFilter='closed'">Closed</button>
            </div>
          </div>

          <div class="ticket-list" *ngIf="filteredTickets.length; else noTickets">
            <article class="ticket-item" [ngClass]="ticket.status" *ngFor="let ticket of filteredTickets">
              <div class="ticket-main" (click)="goToTicket(ticket.id)">
                <div class="ticket-title-row">
                  <strong>#{{ ticket.id }} {{ ticket.title }}</strong>
                  <span class="status-badge">{{ ticketStatusLabel(ticket.status) }}</span>
                </div>
                <div class="ticket-meta">
                  <span>{{ ticket.created_by.email }}</span>
                  <span class="dot">&middot;</span>
                  <span>Priority: {{ ticket.priority | titlecase }}</span>
                  <span class="dot">&middot;</span>
                  <span>Last Updated Ago: {{ ticketAgeHours(ticket) }}h</span>
                  <span class="dot">&middot;</span>
                  <span>Updated: {{ ticket.updated_at | date:'short' }}</span>
                </div>
                <div class="ticket-assignee">
                  Assigned to: <strong>{{ ticket.assigned_to?.full_name || 'Unassigned' }}</strong>
                </div>
              </div>
              <div class="actions-section">
                <mat-form-field
                  *ngIf="ticket.created_by.role === 'customer' && !ticket.assigned_to"
                  appearance="outline"
                  class="assign-dropdown"
                  (click)="$event.stopPropagation()">
                  <mat-label>Assign to</mat-label>
                  <mat-select [value]="null" (selectionChange)="assignTicket(ticket, $event.value)">
                    <mat-option [value]="null">Unassigned</mat-option>
                    <mat-option *ngFor="let s of agents" [value]="s.id">
                      {{ s.full_name }} ({{ s.role | titlecase }})
                    </mat-option>
                  </mat-select>
                </mat-form-field>
                <button type="button" class="solve-btn" (click)="toggleIssueStatus(ticket, $event)">
                  {{ ticket.status === 'closed' ? 'Mark Pending' : 'Mark Completed' }}
                </button>
                <button type="button" class="reply-btn" (click)="goToTicket(ticket.id, $event)">Open Ticket</button>
              </div>
            </article>
          </div>
          <ng-template #noTickets>
            <p class="empty">No tickets match the selected filter.</p>
          </ng-template>
        </mat-card>

        <mat-card class="team-card staff-card">
          <div class="card-head">
            <h2>Staff Directory</h2>
          </div>
          <div class="member-list" *ngIf="memberSummaries.length; else noStaff">
            <div class="member-row" *ngFor="let member of memberSummaries">
              <div class="member-main">
                <strong>{{ member.user.full_name }}</strong>
                <div class="member-sub">{{ member.user.role | titlecase }} &middot; {{ member.user.email }}</div>
              </div>
              <div class="member-count">{{ member.assignedCount }} assigned</div>
            </div>
          </div>
          <ng-template #noStaff>
            <p class="empty">No staff records available.</p>
          </ng-template>
        </mat-card>
      </div>
    </section>
  `,
  styles: [`
    .team-shell {
      display: grid;
      gap: 20px;
      padding: 12px;
      border-radius: 0;
      border: 0;
      background: transparent;
    }
    .section-header {
      padding: 20px 22px;
      border-radius: 20px;
      border: 1px solid #c8daf8;
      background:
        radial-gradient(circle at 90% 20%, rgba(56, 189, 248, 0.12), transparent 35%),
        linear-gradient(145deg, #ffffff 0%, #edf4ff 100%);
    }
    .header-main {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      align-items: center;
      gap: 18px;
    }
    .header-title-block {
      display: grid;
      gap: 10px;
    }
    .header-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #1e40af;
      background: linear-gradient(135deg, #dbeafe 0%, #e6efff 100%);
      border: 1px solid #b9d2ff;
    }
    .section-header h1 {
      margin: 0;
      font-size: clamp(1.35rem, 2.2vw, 1.9rem);
      color: #153a77;
      letter-spacing: -0.02em;
    }
    .intro {
      margin: 10px 0 0;
      color: #53637d;
      max-width: 68ch;
      line-height: 1.6;
      font-size: 0.98rem;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 12px;
    }
    .metric-card,
    .team-card {
      padding: 18px;
      border-radius: 16px;
      border: 1px solid #d6e2f6;
      background: #ffffff;
      box-shadow: 0 10px 22px rgba(20, 58, 119, 0.08);
    }
    .metric-card.staff { background: #ffffff; border-color: #d6e2f6; }
    .metric-card.total { background: #ffffff; border-color: #d6e2f6; }
    .metric-card.open { background: #ffffff; border-color: #d6e2f6; }
    .metric-card.progress { background: #ffffff; border-color: #d6e2f6; }
    .metric-card.closed { background: #ffffff; border-color: #d6e2f6; }
    .metric-card.unassigned { background: #ffffff; border-color: #d6e2f6; }
    .metric-card.staff {
      background: linear-gradient(145deg, #dbeafe 0%, #e8f1ff 100%);
      border-color: #a9c9ff;
    }
    .metric-card.total {
      background: linear-gradient(145deg, #ede9fe 0%, #f4efff 100%);
      border-color: #c9bcff;
    }
    .metric-card.open {
      background: linear-gradient(145deg, #ecfff4 0%, #f7fff9 100%);
      border-color: #bcefd2;
    }
    .metric-card.progress {
      background: linear-gradient(145deg, #fff6e8 0%, #fffaf2 100%);
      border-color: #ffe0b3;
    }
    .metric-card.closed {
      background: linear-gradient(145deg, #f3f0ff 0%, #faf8ff 100%);
      border-color: #ddd3ff;
    }
    .metric-card.unassigned {
      background: linear-gradient(145deg, #fff0f0 0%, #fff8f8 100%);
      border-color: #ffd1d1;
    }
    .metric-label {
      color: #5b6f8f;
      font-size: 0.86rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .metric-value {
      margin-top: 10px;
      font-size: 1.9rem;
      font-weight: 800;
      color: #17366e;
    }
    .team-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    .tickets-card {
      min-height: auto;
    }
    .team-card h2 {
      margin: 0;
      color: #17366e;
      font-size: 1.35rem;
      letter-spacing: -0.01em;
    }
    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 12px;
    }
    .filter-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .filter-btn {
      border: 1px solid #d2def2;
      border-radius: 999px;
      background: #f8fbff;
      color: #1f3a74;
      padding: 7px 12px;
      font-weight: 600;
      font-size: 0.84rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .filter-btn:hover {
      border-color: #aac5f1;
      background: #edf4ff;
    }
    .filter-btn.active {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      border-color: transparent;
      color: #fff;
      box-shadow: 0 8px 16px rgba(37, 99, 235, 0.24);
    }
    .ticket-list {
      display: grid;
      gap: 10px;
    }
    .ticket-item {
      padding: 14px;
      border-radius: 14px;
      border: 1px solid #deebff;
      background: #ffffff;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
    }
    .ticket-main {
      flex: 1;
      cursor: pointer;
    }
    .ticket-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .ticket-title-row strong {
      color: #1f3359;
      font-size: 1.02rem;
      letter-spacing: -0.01em;
    }
    .status-badge {
      padding: 4px 9px;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 700;
      color: #1d4ed8;
      background: #eaf1ff;
      border: 1px solid #cfe0ff;
      white-space: nowrap;
    }
    .ticket-item.in_progress .status-badge {
      color: #b45309;
      background: #fff6e9;
      border-color: #ffdcae;
    }
    .ticket-item.closed .status-badge {
      color: #047857;
      background: #ecfdf5;
      border-color: #b7f0d2;
    }
    .ticket-meta {
      margin-top: 8px;
      color: #1f3f72;
      font-size: 0.85rem;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      font-weight: 600;
    }
    .dot {
      color: #5f7fae;
    }
    .ticket-assignee {
      margin-top: 8px;
      color: #4a6387;
      font-size: 0.88rem;
    }
    .ticket-assignee strong {
      color: #1f3359;
    }
    .actions-section {
      display: flex;
      gap: 7px;
      flex-shrink: 0;
      align-items: center;
      padding-top: 2px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .assign-dropdown {
      width: 220px;
      margin-right: 2px;
    }
    :host ::ng-deep .assign-dropdown .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    :host ::ng-deep .assign-dropdown .mat-mdc-text-field-wrapper {
      height: 40px;
      border-radius: 10px;
      background: #ffffff;
    }
    :host ::ng-deep .assign-dropdown .mdc-notched-outline__leading,
    :host ::ng-deep .assign-dropdown .mdc-notched-outline__notch,
    :host ::ng-deep .assign-dropdown .mdc-notched-outline__trailing {
      border-color: #cfdcf2 !important;
    }
    .solve-btn,
    .reply-btn {
      border: 1px solid transparent;
      border-radius: 10px;
      color: #ffffff;
      padding: 8px 11px;
      font-weight: 700;
      font-size: 0.8rem;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.2s ease;
      white-space: nowrap;
    }
    .solve-btn {
      background: linear-gradient(135deg, #0ea85c, #1fbe73);
      box-shadow: 0 8px 16px rgba(14, 168, 92, 0.24);
    }
    .reply-btn {
      background: linear-gradient(135deg, #265bd7, #3a76ee);
      box-shadow: 0 8px 16px rgba(38, 91, 215, 0.24);
    }
    .solve-btn:hover,
    .reply-btn:hover {
      transform: translateY(-1px);
    }
    .member-list {
      display: grid;
      gap: 10px;
    }
    .member-row {
      padding: 12px;
      border-radius: 12px;
      border: 1px solid #dfe8f7;
      background: #ffffff;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }
    .member-main strong {
      color: #1f3359;
    }
    .member-sub {
      margin-top: 4px;
      color: #5f7494;
      font-size: 0.84rem;
    }
    .member-count {
      padding: 5px 10px;
      border-radius: 999px;
      font-weight: 700;
      color: #2563eb;
      background: #e9f1ff;
      border: 1px solid #cadcff;
      white-space: nowrap;
      font-size: 0.8rem;
    }
    .empty {
      color: #60708c;
      margin: 8px 0 0;
    }
    :host-context(.dark-theme) .team-shell {
      background: transparent;
      border-color: transparent;
    }
    :host-context(.dark-theme) .section-header {
      background:
        radial-gradient(circle at 90% 20%, rgba(56, 189, 248, 0.14), transparent 35%),
        linear-gradient(145deg, #15243d 0%, #162b4b 100%);
      border-color: #2b4a79;
    }
    :host-context(.dark-theme) .section-header h1 {
      color: #dbeafe;
    }
    :host-context(.dark-theme) .metric-card,
    :host-context(.dark-theme) .team-card {
      background: #131a2b;
      border-color: #233047;
      box-shadow: none;
    }
    :host-context(.dark-theme) .metric-card.staff { background: linear-gradient(145deg, #123058 0%, #193a66 100%); border-color: #3560a1; }
    :host-context(.dark-theme) .metric-card.total { background: linear-gradient(145deg, #2c2152 0%, #3b2c66 100%); border-color: #6953a9; }
    :host-context(.dark-theme) .metric-card.open { background: linear-gradient(145deg, #153222 0%, #1a3a29 100%); border-color: #2b6844; }
    :host-context(.dark-theme) .metric-card.progress { background: linear-gradient(145deg, #3b2914 0%, #493118 100%); border-color: #855524; }
    :host-context(.dark-theme) .metric-card.closed { background: linear-gradient(145deg, #2b2144 0%, #342956 100%); border-color: #5a4890; }
    :host-context(.dark-theme) .metric-card.unassigned { background: linear-gradient(145deg, #3d1b1d 0%, #4b2023 100%); border-color: #87393e; }
    :host-context(.dark-theme) .team-card h2,
    :host-context(.dark-theme) .member-main strong,
    :host-context(.dark-theme) .ticket-title-row strong,
    :host-context(.dark-theme) .ticket-assignee strong,
    :host-context(.dark-theme) .metric-value {
      color: #e2e8f0;
    }
    :host-context(.dark-theme) .metric-label,
    :host-context(.dark-theme) .member-sub,
    :host-context(.dark-theme) .ticket-meta,
    :host-context(.dark-theme) .ticket-assignee,
    :host-context(.dark-theme) .intro,
    :host-context(.dark-theme) .empty {
      color: #94a3b8;
    }
    :host-context(.dark-theme) .member-row {
      background: #0f172a;
      border-color: #334155;
    }
    :host-context(.dark-theme) .ticket-item {
      background: #0f172a;
      border-color: #334155;
    }
    :host-context(.dark-theme) .status-badge {
      background: #1b2b47;
      border-color: #2e4770;
      color: #bfdbfe;
    }
    :host-context(.dark-theme) .filter-btn {
      background: #0f172a;
      border-color: #334155;
      color: #cbd5e1;
    }
    :host-context(.dark-theme) .filter-btn.active {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }
    :host-context(.dark-theme) ::ng-deep .assign-dropdown .mat-mdc-text-field-wrapper {
      background: #0f172a;
    }
    :host-context(.dark-theme) ::ng-deep .assign-dropdown .mdc-notched-outline__leading,
    :host-context(.dark-theme) ::ng-deep .assign-dropdown .mdc-notched-outline__notch,
    :host-context(.dark-theme) ::ng-deep .assign-dropdown .mdc-notched-outline__trailing {
      border-color: #334155 !important;
    }
    :host-context(.dark-theme) .solve-btn {
      background: linear-gradient(135deg, #0f9e55, #1cae67);
    }
    :host-context(.dark-theme) .reply-btn {
      background: linear-gradient(135deg, #2458d2, #326de7);
    }
    :host-context(.dark-theme) .member-count {
      background: #1b2b47;
      border-color: #2d456c;
      color: #bfdbfe;
    }
    :host-context(.dark-theme) .header-chip {
      color: #bfdbfe;
      background: #1b2b47;
      border-color: #2f4770;
    }
    @media (max-width: 960px) {
      .header-main {
        grid-template-columns: 1fr;
      }
      .metrics {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .team-grid {
        grid-template-columns: 1fr;
      }
      .card-head {
        flex-direction: column;
      }
      .ticket-item {
        flex-direction: column;
      }
      .actions-section {
        width: 100%;
        justify-content: flex-end;
      }
      .assign-dropdown {
        width: 100%;
      }
    }
    @media (max-width: 640px) {
      .metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .section-header {
        padding: 16px;
      }
      .actions-section {
        justify-content: stretch;
      }
      .solve-btn,
      .reply-btn {
        flex: 1;
      }
      .member-row {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `],
})
export class TeamBoardComponent {
  private auth = inject(AuthService);
  private ticketService = inject(TicketService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  staff: User[] = [];
  agents: User[] = [];
  tickets: Ticket[] = [];
  memberSummaries: TeamMemberSummary[] = [];
  unassignedCount = 0;
  visibleTickets: Ticket[] = [];
  statusFilter: '' | 'open' | 'in_progress' | 'closed' = '';

  get filteredTickets(): Ticket[] {
    if (!this.statusFilter) {
      return this.visibleTickets;
    }
    return this.visibleTickets.filter((ticket) => ticket.status === this.statusFilter);
  }

  get statusCounts() {
    return {
      open: this.visibleTickets.filter((t) => t.status === 'open').length,
      in_progress: this.visibleTickets.filter((t) => t.status === 'in_progress').length,
      closed: this.visibleTickets.filter((t) => t.status === 'closed').length,
    };
  }

  ticketAgeHours(ticket: Ticket): number {
    const updated = new Date(ticket.updated_at).getTime();
    const now = new Date().getTime();
    return Math.floor((now - updated) / (1000 * 60 * 60));
  }

  assignCountsByAgent(): Array<{ name: string; count: number }> {
    const counts: Record<string, number> = {};
    this.visibleTickets.forEach((ticket) => {
      const key = ticket.assigned_to?.full_name || 'Unassigned';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }

  constructor() {
    forkJoin({
      staff: this.auth.getStaffUsers(),
      tickets: this.ticketService.list({ page: 1 }),
    }).subscribe(({ staff, tickets }) => {
      this.staff = staff;
      this.agents = staff.filter((user) => user.role === 'agent');
      this.tickets = tickets.results;
      this.visibleTickets = tickets.results;
      this.unassignedCount = tickets.results.filter((ticket) => !ticket.assigned_to).length;
      this.memberSummaries = this.agents.map((user) => ({
        user,
        assignedCount: tickets.results.filter((ticket) => ticket.assigned_to?.id === user.id).length,
      }));
    });
  }

  goToTicket(ticketId: number, event?: MouseEvent): void {
    event?.stopPropagation();
    this.router.navigate(['/tickets', ticketId]);
  }

  ticketStatusLabel(status: 'open' | 'in_progress' | 'closed'): string {
    if (status === 'closed') {
      return 'Completed';
    }
    if (status === 'in_progress') {
      return 'In Progress';
    }
    return 'Pending';
  }

  toggleIssueStatus(ticket: Ticket, event: MouseEvent): void {
    event.stopPropagation();

    const newStatus = ticket.status === 'closed' ? 'open' : 'closed';
    const payload: TicketUpdatePayload = {
      status: newStatus,
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      assigned_to_id: ticket.assigned_to?.id ?? null,
    };

    this.ticketService.update(ticket.id, payload).subscribe({
      next: () => {
        ticket.status = newStatus;
        const text = newStatus === 'closed' ? 'completed' : 'pending';
        this.notify.success(`Issue #${ticket.id} marked ${text}.`);
      },
      error: (err) => {
        const apiMessage = err?.error?.detail || err?.error?.message || 'Unable to contact API';
        this.notify.error(`Failed to update issue #${ticket.id}: ${apiMessage}`);
        console.error('Toggle issue status error', err);
      },
    });
  }

  assignTicket(ticket: Ticket, userId: number | null): void {
    const payload: TicketUpdatePayload = {
      status: userId ? 'in_progress' : ticket.status,
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      assigned_to_id: userId,
    };

    this.ticketService.update(ticket.id, payload).subscribe({
      next: (updatedTicket: Ticket) => {
        ticket.assigned_to = updatedTicket.assigned_to;
        this.notify.success(`Ticket #${ticket.id} assigned successfully.`);
        this.refreshData();
      },
      error: () => this.notify.error('Failed to assign ticket.'),
    });
  }

  private refreshData(): void {
    forkJoin({
      staff: this.auth.getStaffUsers(),
      tickets: this.ticketService.list({ page: 1 }),
    }).subscribe(({ staff, tickets }) => {
      this.staff = staff;
      this.agents = staff.filter((user) => user.role === 'agent');
      this.tickets = tickets.results;
      this.visibleTickets = tickets.results;
      this.unassignedCount = tickets.results.filter((ticket) => !ticket.assigned_to).length;
      this.memberSummaries = this.agents.map((user) => ({
        user,
        assignedCount: tickets.results.filter((ticket) => ticket.assigned_to?.id === user.id).length,
      }));
    });
  }
}
