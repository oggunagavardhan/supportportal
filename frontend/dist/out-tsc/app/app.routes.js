import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
export const appRoutes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./layout/app-shell.component').then((m) => m.AppShellComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
            },
            {
                path: 'tickets',
                loadChildren: () => import('./features/tickets/ticket.routes').then((m) => m.TICKET_ROUTES),
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/settings/settings.component').then((m) => m.SettingsComponent),
            },
            {
                path: 'help',
                loadComponent: () => import('./features/help/help-center.component').then((m) => m.HelpCenterComponent),
            },
            {
                path: 'team',
                canActivate: [roleGuard],
                data: { roles: ['admin', 'agent'] },
                loadComponent: () => import('./features/team/team-board.component').then((m) => m.TeamBoardComponent),
            },
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
        ],
    },
    { path: '**', redirectTo: '' },
];
//# sourceMappingURL=app.routes.js.map