export const AUTH_ROUTES = [
    {
        path: 'login',
        loadComponent: () => import('./login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () => import('./register.component').then((m) => m.RegisterComponent),
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password.component').then((m) => m.ForgotPasswordComponent),
    },
    { path: '', pathMatch: 'full', redirectTo: 'login' },
];
//# sourceMappingURL=auth.routes.js.map