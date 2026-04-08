import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TicketService } from '../../core/services/ticket.service';
import { Notification } from '../../core/models/ticket.models';
import { I18nPipe } from '../../core/pipes/i18n.pipe';

@Component({
  standalone: true,
  selector: 'app-notifications',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, I18nPipe],
  template: `
    <section class="page-shell">
      <div class="section-header">
        <div>
          <div class="chip">{{ 'notifications.alerts' | t }}</div>
          <h1>{{ 'notifications.title' | t }}</h1>
          <p class="intro">{{ 'notifications.subtitle' | t }}</p>
        </div>
        <button mat-stroked-button (click)="markAllAsRead()">{{ 'notifications.mark_all_read' | t }}</button>
      </div>

      <div class="notifications-list">
        <mat-card class="glass-card notif-card" *ngFor="let n of notifications" [class.unread]="!n.read">
          <div class="notif-icon-wrap" [class]="n.type">
            <mat-icon>{{ getIcon(n.type) }}</mat-icon>
          </div>
          <div class="notif-content">
            <div class="notif-top">
              <h4>{{ n.title }}</h4>
              <span class="notif-time">{{ n.created_at | date:'short' }}</span>
            </div>
            <p>{{ n.message }}</p>
          </div>
          <div class="unread-dot" *ngIf="!n.read"></div>
        </mat-card>

        <mat-card class="glass-card empty-state" *ngIf="notifications.length === 0">
          <mat-icon class="huge-icon">notifications_off</mat-icon>
          <h3>{{ 'notifications.empty_title' | t }}</h3>
          <p>{{ 'notifications.empty_copy' | t }}</p>
        </mat-card>
      </div>
    </section>
  `,
  styles: [`
    .page-shell { display: grid; gap: 22px; padding: 0; box-sizing: border-box; }
    .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px; }
    .section-header h1 { margin: 10px 0 0; font-size: 36px; color: #17366e; }
    .intro { margin: 10px 0 0; color: var(--muted); }
    
    .notifications-list { display: flex; flex-direction: column; gap: 16px; width: 100%; }
    .notif-card {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
      position: relative;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .notif-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    }
    .notif-card.unread {
      background: #f8fbff;
      border-color: #dbeafe;
    }
    .notif-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .notif-icon-wrap.ticket { background: #eff6ff; color: #2563eb; }
    .notif-icon-wrap.system { background: #fef2f2; color: #dc2626; }
    .notif-icon-wrap.message { background: #f0fdf4; color: #16a34a; }
    
    .notif-content { flex: 1; }
    .notif-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
    .notif-top h4 { margin: 0; font-size: 16px; font-weight: 700; color: #1e293b; }
    .notif-time { font-size: 12px; color: #94a3b8; font-weight: 600; }
    .notif-content p { margin: 0; font-size: 14px; color: #475569; line-height: 1.5; }
    
    .unread-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #2563eb;
      position: absolute;
      top: 24px;
      right: 20px;
    }
    
    .empty-state {
      padding: 60px 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .huge-icon { font-size: 64px; width: 64px; height: 64px; color: #cbd5e1; margin-bottom: 16px; }
    .empty-state h3 { margin: 0 0 8px 0; font-size: 20px; color: #334155; }
    .empty-state p { margin: 0; color: #64748b; }
    
    @media (max-width: 640px) {
      .section-header { flex-direction: column; align-items: flex-start; gap: 16px; }
    }
  `]
})
export class NotificationsComponent implements OnInit {
  private ticketService = inject(TicketService);
  notifications: Notification[] = [];

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.ticketService.getNotifications().subscribe(res => {
      this.notifications = res.results;
    });
  }

  getIcon(type: string): string {
    if (type === 'ticket') return 'confirmation_number';
    if (type === 'system') return 'warning';
    return 'forum';
  }

  markAllAsRead() {
    this.ticketService.markAllNotificationsRead().subscribe(() => {
      this.loadNotifications();
    });
  }
}
