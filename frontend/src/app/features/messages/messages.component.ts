import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { I18nPipe } from '../../core/pipes/i18n.pipe';
import { I18nService } from '../../core/services/i18n.service';
import { NotificationService } from '../../core/services/notification.service';
import { ChatService } from '../../core/services/chat.service';
import { UserManagementService } from '../../core/services/user-management.service';
import { ChatMessage, ChatSession } from '../../core/models/chat.models';
import { User } from '../../core/models/auth.models';
import { StorageService } from '../../core/services/storage.service';

type ConversationMode = 'all' | 'customer' | 'admin';

@Component({
  standalone: true,
  selector: 'app-messages',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule, I18nPipe],
  template: `
    <div class="chat-layout">
      <!-- Sidebar -->
      <mat-card class="glass-card chat-sidebar">
        <div class="sidebar-header">
          <h2>{{ sidebarTitle | t }}</h2>
          <p class="muted">{{ sidebarSubtitle | t }}</p>
        </div>
        <div class="conversation-list" *ngIf="sessions.length; else noSessions">
          <button
            type="button"
            *ngFor="let s of sessions"
            class="conversation-item"
            [class.active]="s.id === activeSession?.id"
            (click)="selectSession(s)">
            <div class="avatar" *ngIf="mode !== 'customer'">{{ sessionAvatar(s) }}</div>
            <div class="convo-content">
              <div class="convo-top">
                <strong>{{ sessionDisplayName(s) }}</strong>
                <span class="status-dot" [class]="s.status"></span>
              </div>
              <p class="convo-preview">{{ sessionSubline(s) }}</p>
            </div>
          </button>
        </div>
        <ng-template #noSessions>
          <div class="empty-list">{{ 'messages.empty_conversations' | t }}</div>
        </ng-template>
      </mat-card>

      <!-- Main Chat Area -->
      <mat-card class="glass-card chat-main" *ngIf="activeSession || canStartChat; else noSelection">
        <div class="chat-header">
          <ng-container *ngIf="activeSession; else newChatHeader">
            <div>
              <h3>{{ headerTitle(activeSession) }}</h3>
              <div class="ticket-sub">{{ headerSubline(activeSession) }}</div>
              <span class="status-badge" [class]="activeSession.status">{{ statusLabel(activeSession.status) }}</span>
            </div>
          </ng-container>
          <ng-template #newChatHeader>
            <div>
              <h3>{{ 'messages.new_chat_title' | t }}</h3>
              <div class="ticket-sub">{{ 'messages.new_chat_copy' | t }}</div>
            </div>
          </ng-template>
        </div>

        <div class="chat-messages" #scrollContainer>
          <div class="message-wrapper" *ngIf="messages.length; else emptyThread">
            <div
              *ngFor="let msg of visibleMessages()"
              class="message-bubble" 
              [ngClass]="bubbleClass(msg)">
              <div class="message-meta">
                <strong>{{ senderLabel(msg) }}</strong>
                &middot; {{ formatTimestamp(msg.timestamp) }}
              </div>
              <div class="message-body">{{ msg.message }}</div>
            </div>

            <div class="message-bubble received bot-typing" *ngIf="botTyping">
              <div class="message-meta">
                <strong>{{ 'messages.bot' | t }}</strong>
                &middot; {{ 'messages.bot_typing' | t }}
              </div>
              <div class="message-body">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
              </div>
            </div>
          </div>
          <ng-template #emptyThread>
            <div class="empty-thread">{{ 'messages.new_chat_hint' | t }}</div>
          </ng-template>
        </div>

        <button
          class="start-floating"
          mat-flat-button
          color="primary"
          type="button"
          *ngIf="!activeSession && canStartChat"
          [disabled]="sending"
          (click)="startCustomerChat()">
          {{ 'messages.start_chat' | t }}
        </button>

        <div class="chat-input-area" *ngIf="showInputArea()">
          <form [formGroup]="form" (ngSubmit)="sendMessage()">
            <mat-form-field appearance="outline" class="chat-input-field">
              <input matInput formControlName="message" [placeholder]="'messages.reply_placeholder' | t" autocomplete="off">
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || sending">
              {{ 'messages.send' | t }}
            </button>
          </form>
        </div>
      </mat-card>

      <ng-template #noSelection>
        <mat-card class="glass-card empty-chat">
          <button class="start-only" mat-flat-button color="primary" type="button" *ngIf="showAdminStarter || showAgentStarter" (click)="startHeaderChat()">
            {{ 'messages.start_chat' | t }}
          </button>
          <button class="start-only" mat-flat-button color="primary" type="button" *ngIf="canStartChat" [disabled]="sending" (click)="startCustomerChat()">
            {{ 'messages.start_chat' | t }}
          </button>
          <mat-icon class="huge-icon">forum</mat-icon>
          <h2>{{ 'messages.select_conversation' | t }}</h2>
          <p>{{ 'messages.select_conversation_copy' | t }}</p>
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
      border: 1px solid #d5c8f7;
      border-radius: 20px;
      background: #ffffff;
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
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
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
    .status-dot.pending { background: var(--warning); }
    .status-dot.active { background: var(--success); }
    .status-dot.closed { background: #94a3b8; }
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
      border: 1px solid #d5c8f7;
      border-radius: 20px;
      background: #ffffff;
      position: relative;
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
      text-transform: uppercase;
    }
    .status-badge.pending { background: rgba(245,158,11,0.12); color: #b45309; }
    .status-badge.active { background: rgba(16,185,129,0.12); color: #047857; }
    .status-badge.closed { background: rgba(148,163,184,0.2); color: #475569; }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background: #ffffff;
      border-left: 1px solid #d5c8f7;
      border-right: 1px solid #d5c8f7;
    }
    .message-wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .empty-thread {
      text-align: center;
      color: #94a3b8;
      font-size: 13px;
      padding: 24px;
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
    .message-bubble.bot .message-body {
      background: #f3f4f6;
      color: #374151;
      border-bottom-left-radius: 4px;
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
    .message-body {
      padding: 14px 18px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-line;
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
    .bot-typing .message-body {
      display: flex;
      gap: 6px;
      align-items: center;
      justify-content: flex-start;
      min-width: 80px;
    }
    .typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #94a3b8;
      animation: typingPulse 1.2s infinite ease-in-out;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingPulse {
      0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
      40% { opacity: 1; transform: translateY(-2px); }
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
    .start-floating {
      position: absolute;
      right: 24px;
      bottom: 40px;
      height: 48px;
      border-radius: 14px;
      padding: 0 22px;
      font-weight: 700;
      box-shadow: 0 10px 18px rgba(124, 58, 237, 0.2);
      z-index: 2;
    }
    .start-only {
      position: absolute;
      right: 24px;
      bottom: 24px;
      height: 48px;
      border-radius: 14px;
      padding: 0 22px;
      font-weight: 700;
      box-shadow: 0 10px 18px rgba(124, 58, 237, 0.2);
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
      border: 1px solid #d5c8f7;
      border-radius: 20px;
      position: relative;
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
    :host-context(.dark-theme) .chat-sidebar,
    :host-context(.dark-theme) .chat-main,
    :host-context(.dark-theme) .empty-chat {
      border-color: #7b67a8;
      background: #1b2a46;
    }
    :host-context(.dark-theme) .chat-messages {
      border-left-color: #7b67a8;
      border-right-color: #7b67a8;
      background: #15243d;
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
    :host-context(.dark-theme) .conversation-item:hover {
      background: #223555;
    }
    :host-context(.dark-theme) .conversation-item.active {
      background: #223d66;
      border-left-color: #60a5fa;
    }
    :host-context(.dark-theme) .received .message-body,
    :host-context(.dark-theme) .bot-typing .message-body {
      background: #1f2f4d;
      color: #e2e8f0;
    }
    :host-context(.dark-theme) .message-bubble.bot .message-body {
      background: #1f2f4d;
      color: #e2e8f0;
    }
    :host-context(.dark-theme) .empty-thread {
      color: #94a3b8;
    }
  `]
})
export class MessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
  private chatService = inject(ChatService);
  private userService = inject(UserManagementService);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private i18n = inject(I18nService);
  private storage = inject(StorageService);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  sessions: ChatSession[] = [];
  activeSession: ChatSession | null = null;
  messages: ChatMessage[] = [];
  currentUserRole: string | undefined;
  currentUserId: number | undefined;
  isSuperAdmin = false;
  canStartChat = false;
  mode: ConversationMode = (this.route.snapshot.data['mode'] as ConversationMode | undefined) ?? 'all';
  sidebarTitle = 'messages.sidebar_all_title';
  sidebarSubtitle = 'messages.sidebar_all_subtitle';
  sending = false;
  botTyping = false;
  private socket: WebSocket | null = null;
  admins: User[] = [];
  selectedAdminId: number | null = null;
  showAdminStarter = false;
  agents: User[] = [];
  selectedAgentId: number | null = null;
  showAgentStarter = false;

  form = this.fb.nonNullable.group({
    message: ['', Validators.required]
  });

  ngOnInit() {
    this.currentUserRole = this.authService.user()?.role;
    this.currentUserId = this.authService.user()?.id;
    this.isSuperAdmin = !!this.authService.user()?.is_superuser;
    this.canStartChat = this.currentUserRole === 'customer';
    this.showAdminStarter = this.currentUserRole === 'agent' && this.mode === 'admin';
    this.showAgentStarter = false;
    this.setSidebarMeta();
    this.loadSessions();
    this.loadAdmins();
    this.loadAgents();

    if (!this.currentUserRole) {
      this.authService.loadProfile().subscribe({
        next: (user) => {
          this.currentUserRole = user.role;
          this.currentUserId = user.id;
          this.isSuperAdmin = !!user.is_superuser;
          this.canStartChat = this.currentUserRole === 'customer';
          this.showAdminStarter = this.currentUserRole === 'agent' && this.mode === 'admin';
          this.showAgentStarter = false;
          this.setSidebarMeta();
        },
      });
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.closeSocket();
  }

  loadSessions() {
    const modeParam = this.mode === 'admin' || this.mode === 'customer' ? this.mode : undefined;
    this.chatService.listSessions(modeParam).subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        if (this.sessions.length > 0) {
          const stillValid = this.activeSession && this.sessions.some((s) => s.id === this.activeSession?.id);
          if (!stillValid) {
            this.selectSession(this.sessions[0]);
          }
        } else {
          this.activeSession = null;
          this.messages = [];
        }
      },
      error: () => {
        // silent fail for empty chat lists
      }
    });
  }

  selectSession(session: ChatSession) {
    this.activeSession = session;
    this.loadSessionDetails(session.id);
  }

  loadSessionDetails(id: number) {
    this.chatService.getHistory(id).subscribe({
      next: (res) => {
        this.activeSession = res.session;
        this.messages = res.messages;
        this.connectSocket(res.session.id);
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: () => {
        // silent fail for empty/failed history load
      }
    });
  }

  private loadAdmins(): void {
    if (!this.showAdminStarter) return;
    this.userService.listUsers().subscribe({
      next: (users) => {
        this.admins = users.filter((u) => u.role === 'admin');
        if (this.admins.length > 0 && !this.selectedAdminId) {
          this.selectedAdminId = this.admins[0].id;
        }
      },
      error: () => {
        this.admins = [];
      }
    });
  }

  startAdminChat(): void {
    if (!this.selectedAdminId) {
      this.selectedAdminId = this.admins[0]?.id ?? null;
    }
    this.chatService.startAdminChat(this.selectedAdminId).subscribe({
      next: (session) => {
        this.upsertSession(session);
        this.selectSession(session);
      },
      error: () => {
        this.notify.error(this.i18n.translate('messages.start_admin_failed'));
      }
    });
  }

  private loadAgents(): void {
    if (!this.showAgentStarter) return;
    this.userService.listUsers().subscribe({
      next: (users) => {
        this.agents = users.filter((u) => u.role === 'agent');
        if (this.agents.length > 0 && !this.selectedAgentId) {
          this.selectedAgentId = this.agents[0].id;
        }
      },
      error: () => {
        this.agents = [];
      }
    });
  }

  startAgentChat(): void {
    if (!this.selectedAgentId) {
      if (this.agents.length > 0) {
        this.selectedAgentId = this.agents[0].id;
      } else {
        this.notify.error(this.i18n.translate('messages.admin_only_error'));
        return;
      }
    }
    this.chatService.startAgentChat(this.selectedAgentId).subscribe({
      next: (session) => {
        this.upsertSession(session);
        this.selectSession(session);
      },
      error: () => {
        this.notify.error(this.i18n.translate('messages.start_admin_failed'));
      }
    });
  }

  startHeaderChat(): void {
    if (this.showAdminStarter) {
      this.startAdminChat();
      return;
    }
    if (this.showAgentStarter) {
      this.startAgentChat();
    }
  }

  startCustomerChat(): void {
    if (this.sending) {
      return;
    }
    this.sending = true;
    this.chatService.startCustomerChat().subscribe({
      next: (res) => {
        this.sending = false;
        this.upsertSession(res.session);
        this.selectSession(res.session);
        if (res.bot_message) {
          this.appendMessage(res.bot_message);
        }
      },
      error: (err) => {
        // Recovery path: in some first-load cases backend may already have an active
        // session while start call fails transiently. Open an existing customer session.
        this.chatService.listSessions('customer').subscribe({
          next: (sessions) => {
            this.sending = false;
            this.sessions = sessions;
            if (sessions.length > 0) {
              this.selectSession(sessions[0]);
              return;
            }
            const detail = err?.error?.detail;
            this.notify.error(detail || this.i18n.translate('messages.start_chat_failed'));
          },
          error: () => {
            this.sending = false;
            const detail = err?.error?.detail;
            this.notify.error(detail || this.i18n.translate('messages.start_chat_failed'));
          },
        });
      }
    });
  }

  headerTitle(session: ChatSession): string {
    if (this.mode === 'admin') {
      return this.i18n.translate('messages.admin_conversation');
    }
    return this.sessionDisplayName(session);
  }

  headerSubline(session: ChatSession): string {
    if (this.mode === 'admin') {
      return session.user_name || this.i18n.translate('messages.admin');
    }
    return this.sessionSubline(session);
  }

  sendMessage() {
    if (!this.showInputArea()) return;
    const text = this.form.getRawValue().message.trim();
    if (!text) return;

    if (!this.activeSession && this.canStartChat) {
      this.sending = true;
      this.botTyping = true;
      this.chatService.startCustomerChat().subscribe({
        next: (res) => {
          this.upsertSession(res.session);
          this.activeSession = res.session;
          if (res.bot_message) {
            this.appendMessage(res.bot_message);
          }
          this.sendMessageWithSession(text, res.session.id);
        },
        error: () => {
          this.sending = false;
          this.botTyping = false;
          this.notify.error(this.i18n.translate('messages.start_chat_failed'));
        }
      });
      return;
    }

    this.sendMessageWithSession(text, this.activeSession?.id);
  }

  private sendMessageWithSession(text: string, sessionId?: number): void {
    this.botTyping = this.currentUserRole === 'customer';
    this.chatService.sendMessage({ message: text, session_id: sessionId }).subscribe({
      next: (res) => {
        this.form.reset();
        this.sending = false;
        this.botTyping = false;
        if (res.user_message) {
          this.appendMessage(res.user_message);
        }
        if (res.bot_message) {
          this.appendMessage(res.bot_message);
        }
        if (res.session) {
          this.activeSession = res.session;
          this.upsertSession(res.session);
          this.updateSession(res.session);
          this.connectSocket(res.session.id);
        }
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: () => {
        this.sending = false;
        this.botTyping = false;
        this.notify.error(this.i18n.translate('messages.send_failed'));
      }
    });
  }

  showInputArea(): boolean {
    if (this.currentUserRole === 'admin' && this.mode === 'customer') return false;
    if (this.currentUserRole === 'customer') return !!this.activeSession;
    return !!this.activeSession;
  }

  private updateSession(updated: ChatSession) {
    this.sessions = this.sessions.map((s) => (s.id === updated.id ? updated : s));
  }

  private upsertSession(session: ChatSession) {
    const exists = this.sessions.some((s) => s.id === session.id);
    if (!exists) {
      this.sessions = [session, ...this.sessions];
    }
  }

  private appendMessage(message: ChatMessage): void {
    const exists = this.messages.some((m) => m.id === message.id);
    if (!exists) {
      this.messages = [...this.messages, message];
    }
  }

  visibleMessages(): ChatMessage[] {
    // Admin customer-conversation view is read-only; hide all agent-authored bubbles.
    if (this.currentUserRole === 'admin' && this.mode === 'customer') {
      return this.messages.filter((m) => m.sender_type !== 'agent');
    }
    return this.messages;
  }

  private connectSocket(sessionId: number): void {
    this.closeSocket();
    const token = this.storage.get('access_token');
    if (!token) return;
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://localhost:8000/ws/chat/${sessionId}/?token=${token}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'message' && payload.message) {
          this.appendMessage(payload.message);
          setTimeout(() => this.scrollToBottom(), 50);
        }
      } catch {
        // ignore malformed messages
      }
    };
  }

  private closeSocket(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  bubbleClass(msg: ChatMessage): string {
    const isSent = this.isSentByMe(msg);
    if (msg.sender_type === 'bot') {
      return 'received bot';
    }
    return isSent ? 'sent' : 'received';
  }

  isSentByMe(msg: ChatMessage): boolean {
    if (this.currentUserRole === 'customer') {
      return msg.sender_type === 'user';
    }
    if (this.currentUserId && this.activeSession?.user === this.currentUserId) {
      return msg.sender_type === 'user';
    }
    if (this.currentUserId && this.activeSession?.agent === this.currentUserId) {
      return msg.sender_type === 'agent';
    }
    return msg.sender_type === 'agent';
  }

  senderLabel(msg: ChatMessage): string {
    if (msg.sender_type === 'bot') {
      return this.i18n.translate('messages.bot');
    }
    if (this.isSentByMe(msg)) {
      return this.i18n.translate('messages.you');
    }
    if (this.currentUserRole === 'customer') {
      return this.activeSession?.agent_name || this.i18n.translate('messages.agent');
    }
    if (msg.sender_type === 'agent') return this.activeSession?.agent_name || this.i18n.translate('messages.agent');
    if (this.activeSession?.user_role === 'admin') return this.i18n.translate('messages.admin');
    return this.activeSession?.user_name || this.i18n.translate('messages.customer');
  }

  sessionDisplayName(session: ChatSession): string {
    if (this.currentUserRole === 'customer') {
      return session.agent_name || this.i18n.translate('messages.support_agent');
    }
    if (this.mode === 'admin') {
      return session.user_name || this.i18n.translate('messages.admin');
    }
    return session.user_name || this.i18n.translate('messages.customer');
  }

  sessionSubline(session: ChatSession): string {
    if (session.status === 'active' && session.agent_name && this.currentUserRole === 'customer') {
      return this.i18n.translate('messages.connected_with', { name: session.agent_name });
    }
    return this.statusLabel(session.status);
  }

  statusLabel(status: ChatSession['status']): string {
    if (status === 'pending') return this.i18n.translate('messages.session_pending');
    if (status === 'active') return this.i18n.translate('messages.session_active');
    return this.i18n.translate('messages.session_closed');
  }

  sessionAvatar(session: ChatSession): string {
    const name = this.sessionDisplayName(session);
    return name ? name.charAt(0).toUpperCase() : 'C';
  }

  formatTimestamp(timestamp: string): string {
    const dateObj = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(dateObj);
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }

  private setSidebarMeta(): void {
    if (this.mode === 'customer') {
      this.sidebarTitle = 'messages.sidebar_customer_title';
      this.sidebarSubtitle = 'messages.sidebar_customer_subtitle';
      return;
    }
    if (this.mode === 'admin') {
      this.sidebarTitle = 'messages.sidebar_admin_title';
      this.sidebarSubtitle = 'messages.sidebar_admin_subtitle';
      return;
    }
    this.sidebarTitle = 'messages.sidebar_all_title';
    this.sidebarSubtitle = 'messages.sidebar_all_subtitle';
  }
}
