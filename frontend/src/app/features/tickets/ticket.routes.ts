import { Routes } from '@angular/router';

export const TICKET_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./ticket-list.component').then((m) => m.TicketListComponent),
    data: { mode: 'all' },
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./create-ticket.component').then((m) => m.CreateTicketComponent),
  },
  {
    path: 'track',
    loadComponent: () => import('./track-ticket.component').then((m) => m.TrackTicketComponent),
  },
  {
    path: 'active',
    loadComponent: () => import('./ticket-list.component').then((m) => m.TicketListComponent),
    data: { mode: 'active' },
  },
  {
    path: 'resolved',
    loadComponent: () => import('./ticket-list.component').then((m) => m.TicketListComponent),
    data: { mode: 'resolved' },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./ticket-detail.component').then((m) => m.TicketDetailComponent),
  },
];
