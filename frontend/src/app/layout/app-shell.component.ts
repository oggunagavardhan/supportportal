import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';

import { AuthService } from '../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  template: `
    <div class="workspace-shell">
      <header class="topbar">
        <div class="topbar-left">
          <button type="button" class="menu-chip" aria-label="Navigation" (click)="toggleSidebar()" [class.active]="sidebarOpen()">
            <span class="menu-icon" aria-hidden="true"></span>
          </button>
          <div class="brand-mark">S</div>
          <div class="brand-copy">
            <div class="brand-name">Support Portal</div>
            <div class="brand-subtitle">{{ isStaff() ? 'Support operations excellence' : 'Customer support workspace' }}</div>
          </div>
        </div>

        <div class="topbar-right" *ngIf="user() as currentUser">
          <a *ngIf="!isAdminView()" mat-stroked-button class="top-action" routerLink="/tickets/new">Create Ticket</a>

          <button mat-icon-button class="notif-btn" routerLink="/notifications" aria-label="Notifications">
            <span class="bell-icon" aria-hidden="true">🔔</span>
          </button>

          <button mat-icon-button class="theme-toggle" (click)="toggleTheme()" [attr.aria-label]="isDarkMode() ? 'Switch to light theme' : 'Switch to dark theme'">
            <span class="theme-icon">{{ isDarkMode() ? '☀️' : '🌙' }}</span>
          </button>

          <div class="profile-chip">
            <div class="profile-avatar">{{ initials(currentUser.full_name) }}</div>
            <div class="profile-text">
              <strong>{{ currentUser.full_name }}</strong>
              <span>{{ currentUser.role | titlecase }}</span>
            </div>
          </div>
        </div>
      </header>

      <div class="workspace-body">
        <aside class="sidebar" [class.customer-role]="isCustomer()" [class.mobile-open]="sidebarOpen()" (click)="closeSidebarOnNav()">
          <nav class="nav" [class.no-scroll]="isCustomer()">
            <ng-container *ngFor="let item of dynamicMenuItems()">
              <a *ngIf="!item.category" [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="item.exact ? {exact: true} : {exact: false}">
                <span class="nav-icon">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </a>
            </ng-container>
          </nav>

          <div class="sidebar-footer">
            <button mat-stroked-button class="logout" color="primary" (click)="logout()">Logout</button>
          </div>
        </aside>

        <main class="content page-shell">
          <router-outlet></router-outlet>
        </main>

        <div class="mobile-overlay" *ngIf="sidebarOpen()" (click)="toggleSidebar()" aria-hidden="true"></div>
      </div>
    </div>
  `,
  styles: [`
    .workspace-shell {
      --shell-spacing: 14px;
      --panel-inset: 12px;
      height: 100vh;
      display: grid;
      grid-template-rows: 82px 1fr;
      background: var(--bg);
      overflow: hidden;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 0 24px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }
    .topbar-left, .topbar-right {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }
    .menu-chip {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: var(--surface);
      cursor: pointer;
      display: none;
      transition: all 0.3s ease;
    }

    .menu-chip:hover {
      border-color: var(--primary);
      background: var(--primary-soft);
    }

    .menu-chip.active .menu-icon::before {
      background: var(--primary);
      box-shadow:
        0 5px 0 0 var(--primary),
        0 10px 0 0 var(--primary);
    }
    .menu-icon {
      width: 18px;
      height: 14px;
      display: block;
      position: relative;
      margin: 0 auto;
    }
    .menu-icon::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 1px;
      height: 3px;
      background: var(--muted);
      border-radius: 3px;
      box-shadow:
        0 5px 0 0 var(--muted),
        0 10px 0 0 var(--muted);
    }
    .brand-mark, .footer-mark, .profile-avatar {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #3563e9, #4f46e5);
      color: #ffffff;
      font-weight: 800;
      box-shadow: 0 8px 18px rgba(53, 99, 233, 0.24);
    }
    .brand-copy, .profile-text {
      min-width: 0;
    }
    .brand-name {
      font-size: 18px;
      font-weight: 800;
      color: var(--primary-strong);
    }
    .brand-subtitle, .profile-text span, .footer-card > div:not(.footer-mark) {
      color: var(--muted);
      font-size: 14px;
    }
    .top-action {
      min-height: 42px;
      padding: 0 16px;
      border-radius: 12px;
      border: 1px solid #9ca3af !important;
      background: #e5e7eb !important;
      color: #1d4ed8 !important;
      font-weight: 600;
    }
    .top-action:hover {
      background: #d1d5db !important;
      border-color: #6b7280 !important;
    }
    :host-context(.dark-theme) .top-action {
      background: #334155 !important;
      border-color: #64748b !important;
      color: #93c5fd !important;
    }
    :host-context(.dark-theme) .top-action:hover {
      background: #3f4e63 !important;
      border-color: #94a3b8 !important;
    }
    .notif-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-soft);
      margin-right: 6px;
      border: 1px solid var(--border);
      color: var(--primary-strong);
    }
    .bell-icon {
      font-size: 18px;
      line-height: 1;
      width: 28px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif;
    }
    .theme-toggle {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-soft);
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all 120ms ease;
    }
    .theme-toggle:hover {
      background: var(--primary-soft);
      border-color: var(--border);
      transform: scale(1.05);
    }
    .theme-icon {
      font-size: 18px;
      line-height: 1;
      display: flex;
      align-items: center;
    }
    .profile-chip {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 8px;
    }
    .profile-text strong, .footer-card strong {
      display: block;
      color: var(--text);
      font-size: 15px;
    }
    .workspace-body {
      display: grid;
      grid-template-columns: 260px 1fr;
      height: 100%;
      min-height: 0;
      gap: var(--shell-spacing);
      padding: 0 var(--shell-spacing) 0 0;
      align-items: stretch;
    }
    .sidebar {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: var(--surface);
      border: 0;
      border-radius: 0;
      padding: var(--panel-inset);
      min-height: 0;
      height: 100%;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .nav-category {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--muted);
      font-weight: 700;
      margin: 16px 14px 4px;
    }
    .nav {
      display: grid;
      gap: 10px;
      padding-top: 0;
      padding-bottom: 20px;
      overflow-y: auto;
      overflow-x: hidden;
      flex: 1;
      min-height: 0;
    }
    .nav.no-scroll {
      overflow-y: hidden;
    }
    .nav::-webkit-scrollbar {
      width: 4px;
    }
    .nav::-webkit-scrollbar-thumb {
      background-color: var(--border);
      border-radius: 4px;
    }
    .nav a {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 14px;
      text-decoration: none;
      color: var(--text);
      font-weight: 600;
      font-size: 14px;
      line-height: 1.35;
      min-height: 46px;
      transition: all 0.3s ease;
      overflow: visible;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      margin: 2px 0;
    }
    .nav a span:last-child {
      white-space: normal;
      word-break: break-word;
    }
    .nav a:hover {
      background: rgba(59, 130, 246, 0.12);
      color: var(--primary);
      transform: translateX(2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.14);
    }
    .nav a.active {
      background: linear-gradient(135deg, #3b5bdb, #4f46e5);
      color: #ffffff;
      border-radius: 999px;
      box-shadow: 0 8px 18px rgba(79, 70, 229, 0.24);
    }
    .nav-icon {
      width: 28px;
      height: 28px;
      border-radius: 10px;
      display: grid;
      place-items: center;
      background: rgba(59, 130, 246, 0.14);
      color: #1d4ed8 !important;
      font-size: 12px;
      letter-spacing: 0.08em;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .nav a.active .nav-icon {
      background: rgba(255, 255, 255, 0.18);
      color: #ffffff !important;
    }
    .sidebar-footer {
      display: grid;
      gap: 10px;
      margin-top: 16px;
    }
    .footer-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 14px;
      background: var(--primary-soft);
      color: var(--text);
      min-width: 0;
    }
    .footer-mark {
      color: #ffffff !important;
    }
    .footer-card > div {
      min-width: 0;
    }
    .footer-card strong,
    .footer-card div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .logout {
      min-height: 40px;
      border-radius: 12px;
      background: #dc2626 !important;
      color: #ffffff !important;
      border: 1px solid #dc2626 !important;
      font-weight: 700;
    }
    .logout:hover {
      background: #b91c1c !important;
      border-color: #b91c1c !important;
    }
    .content {
      overflow: auto;
      min-height: 0;
      height: 100%;
      padding: var(--panel-inset);
      margin-top: var(--shell-spacing);
      box-sizing: border-box;
      border-radius: 14px;
      background: transparent;
    }
    @media (max-width: 1100px) {
      .topbar {
        padding: 0 16px;
      }
      .workspace-body {
        grid-template-columns: 220px 1fr;
      }
    }
    @media (max-width: 860px) {
      .workspace-shell {
        grid-template-rows: auto auto 1fr;
      }
      .menu-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .topbar {
        flex-direction: column;
        align-items: stretch;
        padding: 14px;
        max-height: 180px;
        overflow-y: auto;
      }
      .topbar-right {
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .workspace-body {
        grid-template-columns: 1fr;
        position: relative;
        overflow: hidden;
      }
      .sidebar {
        position: fixed;
        left: 0;
        top: 180px;
        width: 260px;
        max-height: calc(100vh - 180px);
        border-right: 1px solid #e4e9f2;
        border-bottom: 0;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 999;
      }
      .sidebar.mobile-open {
        transform: translateX(0);
      }
      .mobile-overlay {
        position: fixed;
        top: 180px;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        animation: fadeIn 0.3s ease;
      }
      .nav {
        grid-template-columns: 1fr;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .nav a {
        justify-content: flex-start;
      }
      .sidebar-footer {
        grid-template-columns: 1fr;
        align-items: stretch;
      }
    }
    @media (max-width: 640px) {
      .brand-subtitle, .profile-text span, .footer-card div {
        display: none;
      }
      .footer-mark {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        font-size: 14px;
      }
      .footer-card {
        padding: 8px 10px;
      }
      .nav {
        grid-template-columns: 1fr;
      }
      .sidebar-footer {
        grid-template-columns: 1fr;
      }
      .sidebar {
        width: 240px;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `],
})
export class AppShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  user = this.auth.user;
  isStaff = computed(
    () =>
      ['admin', 'agent'].includes(this.auth.user()?.role ?? '') ||
      !!this.auth.user()?.is_superuser,
  );
  isSuperAdmin = computed(() => !!this.auth.user()?.is_superuser);
  isCustomer = computed(() => (this.auth.user()?.role ?? '') === 'customer');
  isAdminView = computed(
    () => this.auth.user()?.role === 'admin' || !!this.auth.user()?.is_superuser,
  );

  dynamicMenuItems = computed(() => {
    const role = this.auth.user()?.role;
    const isSuper = this.auth.user()?.is_superuser;

    if (isSuper || role === 'admin') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: 'D', exact: true },
        { category: 'System Overview' },
        { path: '/tickets', label: 'All Tickets', icon: 'T', exact: false },
        { path: '/team', label: 'Assign Tickets', icon: 'A', exact: false },
        { path: '/reports', label: 'Reports & Analytics', icon: 'R', exact: false },
        ...(isSuper ? [{ path: '/admin/feedback', label: 'Feedback', icon: 'F', exact: false }] : []),
        { category: 'Management' },
        { path: '/admin/agents', label: 'Manage Agents', icon: 'M', exact: false },
        { path: '/admin/users', label: 'User Management', icon: 'U', exact: false },
        { category: 'Communication' },
        { path: '/messages/customer-conversations', label: 'Customer Conversations', icon: 'C', exact: false },
        { path: '/messages/admin-conversations', label: 'Admin Conversations', icon: 'A', exact: false },
        { category: 'System configuration' },
        { path: '/settings', label: 'System Settings', icon: 'S', exact: false },
        { path: '/audit-logs', label: 'Audit Logs', icon: 'L', exact: false },
        { category: 'Account' },
        { path: '/profile', label: 'Profile', icon: 'P', exact: false },
      ];
    } else if (role === 'agent') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: 'D', exact: true },
        { category: 'Ticket Management' },
        { path: '/tickets', label: 'Assigned Tickets', icon: 'A', exact: true },
        { path: '/tickets/active', label: 'My Active Tickets', icon: 'M', exact: false },
        { path: '/tickets/resolved', label: 'Resolved Tickets', icon: 'R', exact: false },
        { category: 'Communication' },
        { path: '/messages/customer-conversations', label: 'Customer Conversations', icon: 'C', exact: false },
        { path: '/messages/admin-conversations', label: 'Admin Conversations', icon: 'A', exact: false },
        { category: 'Account' },
        { path: '/profile', label: 'Profile', icon: 'U', exact: false },
        { path: '/settings', label: 'Settings', icon: 'S', exact: false },
      ];
    } else {
      // CUSTOMER
      return [
        { path: '/dashboard', label: 'Dashboard', icon: 'D', exact: true },
        { category: 'Tickets' },
        { path: '/tickets', label: 'My Tickets', icon: 'T', exact: true },
        { path: '/tickets/track', label: 'Track Ticket', icon: 'T', exact: false },
        { category: 'Communication' },
        { path: '/messages', label: 'Messages / Chat', icon: 'M', exact: false },
        { path: '/help', label: 'Knowledge Base (FAQ)', icon: 'K', exact: false },
        { path: '/feedback', label: 'Feedback', icon: 'F', exact: false },
        { category: 'Account' },
        { path: '/profile', label: 'Profile', icon: 'P', exact: false },
        { path: '/settings', label: 'Settings', icon: 'S', exact: false },
      ];
    }
  });
  currentSection = signal(this.getSectionLabel(this.router.url));
  isDarkMode = signal(this.getStoredTheme() === 'dark');
  sidebarOpen = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.currentSection.set(this.getSectionLabel(event.urlAfterRedirects));
      });
    
    this.applyTheme(this.isDarkMode());
  }

  toggleTheme(): void {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    this.applyTheme(newMode);
  }

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebarOnNav(): void {
    // Close sidebar when a nav link is clicked (on mobile/tablet)
    if (this.sidebarOpen() && window.innerWidth < 860) {
      this.sidebarOpen.set(false);
    }
  }

  private getStoredTheme(): string {
    return localStorage.getItem('theme') || 'light';
  }

  private applyTheme(isDark: boolean): void {
    const root = document.documentElement;
    if (isDark) {
      root.style.colorScheme = 'dark';
      root.classList.add('dark-theme');
    } else {
      root.style.colorScheme = 'light';
      root.classList.remove('dark-theme');
    }
  }

  logout(): void {
    this.auth.logout();
  }

  initials(fullName: string): string {
    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  private getSectionLabel(url: string): string {
    if (url.includes('/tickets')) return 'Tickets';
    if (url.includes('/admin/feedback') || url.includes('/feedback')) return 'Feedback';
    if (url.includes('/messages')) return 'Conversations';
    if (url.includes('/team')) return 'Team';
    if (url.includes('/reports')) return 'Reports';
    if (url.includes('/audit-logs')) return 'Audit Logs';
    if (url.includes('/notifications')) return 'Notifications';
    if (url.includes('/help')) return 'Help';
    if (url.includes('/settings')) return 'Settings';
    if (url.includes('/profile')) return 'Profile';
    return 'Dashboard';
  }
}
