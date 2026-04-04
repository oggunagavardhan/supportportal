export const TICKET_ROUTES = [
    {
        path: '',
        loadComponent: () => import('./ticket-list.component').then((m) => m.TicketListComponent),
    },
    {
        path: 'new',
        loadComponent: () => import('./create-ticket.component').then((m) => m.CreateTicketComponent),
    },
    {
        path: ':id',
        loadComponent: () => import('./ticket-detail.component').then((m) => m.TicketDetailComponent),
    },
];
//# sourceMappingURL=ticket.routes.js.map