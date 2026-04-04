import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="page-shell">
      <mat-card class="placeholder-card">
        <mat-icon class="ph-icon">construction</mat-icon>
        <h2>Coming Soon</h2>
        <p>The feature you are trying to access (<code>{{ currentRoute }}</code>) is currently under development.</p>
      </mat-card>
    </div>
  `,
  styles: [`
    .placeholder-card {
      padding: 40px;
      text-align: center;
      border-radius: 20px;
      margin-top: 20px;
    }
    .ph-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--primary);
      margin-bottom: 16px;
      opacity: 0.8;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 28px;
      color: var(--primary-strong);
    }
    p {
      color: var(--muted);
      font-size: 16px;
    }
  `]
})
export class PlaceholderComponent {
  currentRoute = '';
  constructor(private router: Router) {
    this.currentRoute = this.router.url;
  }
}
