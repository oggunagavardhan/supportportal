import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'tickets',
        loadChildren: () =>
          import('./features/tickets/ticket.routes').then((m) => m.TICKET_ROUTES),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./features/help/help-center.component').then((m) => m.HelpCenterComponent),
      },
      {
        path: 'team',
        canActivate: [roleGuard],
        data: { roles: ['admin', 'agent'] },
        loadComponent: () =>
          import('./features/team/team-board.component').then((m) => m.TeamBoardComponent),
      },
      {
        path: 'messages',
        loadComponent: () => import('./features/messages/messages.component').then((m) => m.MessagesComponent),
        data: { mode: 'all' },
      },
      {
        path: 'messages/customer-conversations',
        canActivate: [roleGuard],
        data: { roles: ['admin', 'agent'], mode: 'customer' },
        loadComponent: () => import('./features/messages/messages.component').then((m) => m.MessagesComponent),
      },
      {
        path: 'messages/admin-conversations',
        canActivate: [roleGuard],
        data: { roles: ['admin', 'agent'], mode: 'admin' },
        loadComponent: () => import('./features/messages/messages.component').then((m) => m.MessagesComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then((m) => m.NotificationsComponent),
      },
      {
        path: 'feedback',
        loadComponent: () => import('./features/feedback/feedback.component').then((m) => m.FeedbackComponent),
      },
      {
        path: 'admin/feedback',
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadComponent: () =>
          import('./features/feedback/feedback-admin.component').then((m) => m.FeedbackAdminComponent),
      },
      {
        path: 'reports',
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadComponent: () =>
          import('./features/reports/reports-analysis.component').then((m) => m.ReportsAnalysisComponent),
      },
      {
        path: 'audit-logs',
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadComponent: () =>
          import('./features/audit-logs/audit-logs.component').then((m) => m.AuditLogsComponent),
      },
      {
        path: 'admin/notifications',
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadComponent: () =>
          import('./features/admin/notification-management.component').then((m) => m.NotificationManagementComponent),
      },
      {
        path: 'admin/users',
        canActivate: [roleGuard],
        data: { roles: ['admin'], type: 'users' },
        loadComponent: () =>
          import('./features/admin/admin-accounts.component').then((m) => m.AdminAccountsComponent),
      },
      {
        path: 'admin/agents',
        canActivate: [roleGuard],
        data: { roles: ['admin'], type: 'agents' },
        loadComponent: () =>
          import('./features/admin/admin-accounts.component').then((m) => m.AdminAccountsComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: '' },
];
