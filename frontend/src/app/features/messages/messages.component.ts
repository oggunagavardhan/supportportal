import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TicketService } from '../../core/services/ticket.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Ticket, Comment } from '../../core/models/ticket.models';

type ConversationMode = 'all' | 'customer' | 'admin';

@Component({
  standalone: true,
  selector: 'app-messages',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule],
  template: `
    <div class="chat-layout">
      <!-- Sidebar -->
      <mat-card class="glass-card chat-sidebar">
        <div class="sidebar-header">
          <h2>{{ sidebarTitle }}</h2>
          <p class="muted">{{ sidebarSubtitle }}</p>
        </div>
        <div class="conversation-list" *ngIf="tickets.length; else noTickets">
          <div 
            *ngFor="let t of tickets" 
            class="conversation-item" 
            [class.active]="t.id === activeTicket?.id"
            (click)="selectTicket(t)">
            <div class="avatar">{{ t.created_by.full_name.charAt(0) | uppercase }}</div>
            <div class="convo-content">
              <div class="convo-top">
                <strong>{{ conversationDisplayName(t) }}</strong>
                <span class="status-dot" [class]="t.status"></span>
              </div>
              <p class="convo-preview">Ticket #{{ t.id }} - {{ t.title }}</p>
            </div>
          </div>
        </div>
        <ng-template #noTickets>
          <div class="empty-list">No active conversations found.</div>
        </ng-template>
      </mat-card>

      <!-- Main Chat Area -->
      <mat-card class="glass-card chat-main" *ngIf="activeTicket; else noSelection">
        <div class="chat-header">
          <div>
            <h3>{{ conversationDisplayName(activeTicket) }}</h3>
            <div class="ticket-sub">Ticket #{{ activeTicket.id }} - {{ activeTicket.title }}</div>
            <span class="status-badge" [class]="activeTicket.status">{{ activeTicket.status | uppercase }}</span>
          </div>
        </div>

        <div class="chat-messages" #scrollContainer>
          <div class="message-wrapper">
            <!-- Initial Description as First Message -->
            <div class="message-bubble" [ngClass]="isMe(activeTicket.created_by.id) ? 'sent' : 'received'">
              <div class="message-meta">
                <strong>{{ isMe(activeTicket.created_by.id) ? 'You' : activeTicket.created_by.full_name }}</strong>
                &middot; {{ getInitialMessageTimestamp() }}
              </div>
              <div class="message-body">{{ activeTicket.description }}</div>
            </div>

            <!-- Threaded Comments -->
            <div 
              *ngFor="let msg of activeTicket.comments; let idx = index" 
              class="message-bubble" 
              [ngClass]="isMe(msg.author.id) ? 'sent' : 'received'">
              <div class="message-meta">
                <strong>{{ isMe(msg.author.id) ? 'You' : msg.author.full_name }}</strong> 
                <span *ngIf="msg.is_internal" class="internal-badge">Internal</span>
                &middot; {{ getMessageTimestamp(msg, idx) }}
              </div>
              <div class="message-body">{{ msg.message }}</div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <form [formGroup]="form" (ngSubmit)="sendMessage()">
            <mat-form-field appearance="outline" class="chat-input-field">
              <input matInput formControlName="message" placeholder="Type your reply here..." autocomplete="off">
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || sending">
              Send
            </button>
          </form>
        </div>
      </mat-card>

      <ng-template #noSelection>
        <mat-card class="glass-card empty-chat">
          <mat-icon class="huge-icon">forum</mat-icon>
          <h2>Select a conversation</h2>
          <p>Choose a ticket from the left to start viewing your messages and replies.</p>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .chat-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;
      height: calc(100vh - 120px);
      padding: 0;
      margin: 10px 12px;
    }
    .chat-sidebar {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 0;
    }
    .col-header { color: #17366e; }
    .sidebar-header {
      padding: 24px;
      border-bottom: 1px solid var(--border);
      background: #fafcff;
      border-radius: 20px 20px 0 0;
    }
    .sidebar-header h2 { margin: 0; color: #17366e; font-size: 20px; }
    .sidebar-header p { margin: 4px 0 0; font-size: 13px; color: var(--muted); }
    .conversation-list {
      flex: 1;
      overflow-y: auto;
    }
    .conversation-item {
      display: flex;
      gap: 12px;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: background 0.2s;
    }
    .conversation-item:hover {
      background: #f8fbff;
    }
    .conversation-item.active {
      background: var(--primary-soft);
      border-left: 4px solid var(--primary);
      padding-left: 20px;
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #4f46e5);
      color: #ffffff !important;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }
    .convo-content {
      min-width: 0;
      flex: 1;
    }
    .convo-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
    }
    .convo-top strong {
      font-size: 14px;
      color: var(--text);
    }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .status-dot.open { background: var(--primary); }
    .status-dot.in_progress { background: var(--warning); }
    .status-dot.closed { background: var(--success); }
    .convo-preview {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .empty-list {
      padding: 24px;
      text-align: center;
      color: var(--muted);
    }
    .chat-main {
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
    }
    .chat-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fafcff;
      border-radius: 20px 20px 0 0;
    }
    .chat-header h3 { margin: 0; font-size: 18px; color: #17366e; }
    .ticket-sub {
      margin-top: 4px;
      font-size: 12px;
      color: var(--muted);
    }
    .status-badge {
      display: inline-block;
      margin-top: 6px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
    }
    .status-badge.open { background: var(--primary-soft); color: var(--primary-strong); }
    .status-badge.in_progress { background: rgba(245,158,11,0.1); color: var(--warning); }
    .status-badge.closed { background: rgba(16,185,129,0.1); color: var(--success); }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background: #ffffff;
    }
    .message-wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .message-bubble {
      max-width: 75%;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .message-bubble.received {
      align-self: flex-start;
    }
    .message-bubble.sent {
      align-self: flex-end;
      align-items: flex-end;
    }
    .message-meta {
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 2px;
      font-family: 'IBM Plex Sans', 'Segoe UI', Roboto, Arial, sans-serif !important;
      font-style: normal;
      font-weight: 500;
      letter-spacing: 0;
    }
    .internal-badge {
      background: #fcd34d;
      color: #92400e;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      margin: 0 4px;
    }
    .message-body {
      padding: 14px 18px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
    }
    .received .message-body {
      background: #f1f5f9;
      color: #334155;
      border-bottom-left-radius: 4px;
    }
    .sent .message-body {
      background: var(--primary);
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }
    .chat-input-area {
      padding: 20px 24px 0 24px;
      border-top: 1px solid var(--border);
      background: #fafcff;
      border-radius: 0 0 20px 20px;
    }
    .chat-input-area form {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .chat-input-field {
      flex: 1;
    }
    .chat-input-area button {
      height: 54px;
      margin-bottom: 22px;
      padding: 0 24px;
      border-radius: 12px;
    }
    .empty-chat {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: var(--muted);
      background: #fafcff;
      height: 100%;
    }
    .huge-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      opacity: 0.2;
      margin-bottom: 16px;
    }
    @media (max-width: 860px) {
      .chat-layout {
        grid-template-columns: 1fr;
        height: auto;
      }
      .chat-sidebar {
        max-height: 300px;
      }
      .chat-main {
        min-height: 500px;
      }
    }
    :host-context(.dark-theme) .sidebar-header,
    :host-context(.dark-theme) .chat-header,
    :host-context(.dark-theme) .chat-input-area {
      background: #1b2a46;
      border-color: #6f93cb;
    }
    :host-context(.dark-theme) .sidebar-header h2,
    :host-context(.dark-theme) .chat-header h3 {
      color: #f8fbff;
    }
    :host-context(.dark-theme) .ticket-sub,
    :host-context(.dark-theme) .convo-preview,
    :host-context(.dark-theme) .message-meta {
      color: #d0def6;
    }
    :host-context(.dark-theme) .chat-messages {
      background: #15243d;
    }
    :host-context(.dark-theme) .conversation-item:hover {
      background: #223555;
    }
    :host-context(.dark-theme) .conversation-item.active {
      background: #223d66;
      border-left-color: #60a5fa;
    }
    :host-context(.dark-theme) .status-badge.closed {
      background: #064e3b;
      color: #86efac;
      border: 1px solid #10b981;
    }
    :host-context(.dark-theme) .status-badge.open {
      background: #1e3a8a;
      color: #bfdbfe;
      border: 1px solid #3b82f6;
    }
    :host-context(.dark-theme) .status-badge.in_progress {
      background: #78350f;
      color: #fcd34d;
      border: 1px solid #f59e0b;
    }
  `]
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  tickets: Ticket[] = [];
  activeTicket: Ticket | null = null;
  currentUserId: number | undefined;
  mode: ConversationMode = (this.route.snapshot.data['mode'] as ConversationMode | undefined) ?? 'all';
  targetTicketId: number | null = null;
  sidebarTitle = 'Conversations';
  sidebarSubtitle = 'Your active support threads';
  sending = false;

  form = this.fb.nonNullable.group({
    message: ['', Validators.required]
  });

  ngOnInit() {
    this.currentUserId = this.authService.user()?.id;
    const queryTicketId = this.route.snapshot.queryParamMap.get('ticketId');
    this.targetTicketId = queryTicketId ? Number(queryTicketId) : null;
    this.setSidebarMeta();
    this.loadTickets();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  isMe(authorId: number): boolean {
    return this.currentUserId === authorId;
  }

  loadTickets() {
    this.ticketService.list({ page: 1 }).subscribe(res => {
      this.tickets = this.filterTicketsByMode(res.results);
      if (this.tickets.length > 0) {
        if (this.targetTicketId) {
          const target = this.tickets.find((t) => t.id === this.targetTicketId);
          if (target) {
            this.selectTicket(target);
            this.targetTicketId = null;
            return;
          }
        }
        const stillValid = this.activeTicket && this.tickets.some((t) => t.id === this.activeTicket?.id);
        if (!stillValid) {
          this.selectTicket(this.tickets[0]);
        }
      } else {
        this.activeTicket = null;
      }
    });
  }

  selectTicket(ticket: Ticket) {
    this.loadTicketDetails(ticket.id);
  }

  loadTicketDetails(id: number) {
    this.ticketService.get(String(id)).subscribe(res => {
      this.activeTicket = res;
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  sendMessage() {
    if (this.form.invalid || !this.activeTicket) return;
    this.sending = true;
    const payload = {
      message: this.form.getRawValue().message,
      is_internal: false
    };

    this.ticketService.addComment(this.activeTicket.id, payload).subscribe({
      next: () => {
        this.form.reset();
        this.sending = false;
        if (this.activeTicket) {
          this.loadTicketDetails(this.activeTicket.id);
        }
      },
      error: () => {
        this.sending = false;
        this.notify.error('Failed to send message');
      }
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) {}
  }

  private setSidebarMeta(): void {
    if (this.mode === 'customer') {
      this.sidebarTitle = 'Customer Conversations';
      this.sidebarSubtitle = 'Chats created by customer tickets';
      return;
    }
    if (this.mode === 'admin') {
      this.sidebarTitle = 'Admin Conversations';
      this.sidebarSubtitle = 'Chats that include admin conversations';
      return;
    }
    this.sidebarTitle = 'Conversations';
    this.sidebarSubtitle = 'Your active support threads';
  }

  private filterTicketsByMode(tickets: Ticket[]): Ticket[] {
    if (this.mode === 'customer') {
      return tickets.filter((ticket) => ticket.created_by.role === 'customer');
    }
    if (this.mode === 'admin') {
      return tickets.filter(
        (ticket) =>
          ticket.created_by.role === 'admin' ||
          ticket.assigned_to?.role === 'admin' ||
          ticket.comments.some((comment) => comment.author.role === 'admin'),
      );
    }
    return tickets;
  }

  conversationDisplayName(ticket: Ticket): string {
    const currentUser = this.authService.user();
    const isCustomerView = currentUser?.role === 'customer' && this.mode === 'all';
    const currentUserId = currentUser?.id;

    if (isCustomerView) {
      return ticket.assigned_to?.full_name || 'Support Agent';
    }

    // For admin/agent views, prefer showing the other participant instead of self.
    if (currentUserId) {
      const createdByOther = ticket.created_by.id !== currentUserId ? ticket.created_by.full_name : null;
      const assignedToOther = ticket.assigned_to?.id && ticket.assigned_to.id !== currentUserId
        ? ticket.assigned_to.full_name
        : null;
      if (assignedToOther) {
        return assignedToOther;
      }
      if (createdByOther) {
        return createdByOther;
      }
    }

    if (this.mode === 'admin') {
      return ticket.assigned_to?.full_name || ticket.created_by.full_name;
    }
    if (this.mode === 'customer') {
      return ticket.created_by.full_name;
    }
    return ticket.created_by.full_name;
  }

  getMessageTimestamp(comment: Comment, commentIndex: number): string {
    if (!this.activeTicket) return '';

    // Create a list of all messages (description + comments)
    const allMessages: Array<{ created_at: string; author_id: number }> = [
      { created_at: this.activeTicket.created_at, author_id: this.activeTicket.created_by.id },
      ...this.activeTicket.comments.map(c => ({ created_at: c.created_at, author_id: c.author.id }))
    ];

    // Current message index in the full list (commentIndex + 1 because description is at index 0)
    const currentIndex = commentIndex + 1;
    const currentDate = new Date(comment.created_at).toDateString(); // e.g., "Mon Mar 31 2026"

    // Check if there's a previous message
    let showFullDate = true; // Default to full date for first message

    if (currentIndex > 0) {
      const previousMessage = allMessages[currentIndex - 1];
      const previousDate = new Date(previousMessage.created_at).toDateString();
      const sameDayAndUser = previousDate === currentDate && previousMessage.author_id === comment.author.id;

      if (sameDayAndUser) {
        // Same user, same day - show only time
        showFullDate = false;
      } else {
        // Different day or different user - show full date
        showFullDate = true;
      }
    }

    // Format the timestamp
    const dateObj = new Date(comment.created_at);
    if (showFullDate) {
      // Format: "3/31/26, 11:58 AM"
      return new Intl.DateTimeFormat('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(dateObj);
    } else {
      // Format: "11:58 AM"
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(dateObj);
    }
  }

  getInitialMessageTimestamp(): string {
    if (!this.activeTicket) return '';
    // Initial message always shows full date + time since it's the first message
    const dateObj = new Date(this.activeTicket.created_at);
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(dateObj);
  }
}
