import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule],
  template: `
    <section class="help-shell">
      <div class="section-header">
        <div>
          <div class="chip">Help Center</div>
          <h1>{{ isStaff() ? 'Support operations guide' : 'Need help using the portal?' }}</h1>
          <p class="intro">
            {{ isStaff()
              ? 'Quick operating notes for support agents and admins handling the queue.'
              : 'Everything customers need to create better tickets and get faster responses.' }}
          </p>
        </div>
        <a mat-flat-button color="primary" routerLink="/tickets/new">Create Ticket</a>
      </div>

      <div class="guide-grid">
        <mat-card class="guide-card">
          <h2>How the flow works</h2>
          <ul>
            <li>Create a ticket with a clear title and useful description.</li>
            <li>Track the ticket from open to in progress to closed.</li>
            <li>Add comments instead of creating duplicate requests.</li>
          </ul>
        </mat-card>

        <mat-card class="guide-card">
          <h2>{{ isStaff() ? 'Staff best practices' : 'How to get faster support' }}</h2>
          <ul *ngIf="isStaff(); else customerTips">
            <li>Claim ownership early for unassigned tickets.</li>
            <li>Use internal notes for staff-only coordination.</li>
            <li>Keep ticket status accurate so the dashboard stays useful.</li>
          </ul>
          <ng-template #customerTips>
            <ul>
              <li>Include error text, screenshots, and expected behavior.</li>
              <li>Use one ticket per issue so history stays clean.</li>
              <li>Watch your email and dashboard for OTP or ticket updates.</li>
            </ul>
          </ng-template>
        </mat-card>

        <mat-card class="guide-card">
          <h2>Priority guide</h2>
          <div class="priority-list">
            <div><span class="priority-pill low">Low</span><p>General questions or non-blocking issues.</p></div>
            <div><span class="priority-pill medium">Medium</span><p>Important issues with manageable workarounds.</p></div>
            <div><span class="priority-pill high">High</span><p>Blocking issues needing urgent attention.</p></div>
          </div>
        </mat-card>

        <mat-card class="guide-card">
          <h2>Useful actions</h2>
          <div class="action-stack">
            <a routerLink="/dashboard" class="action-link">Go to Dashboard</a>
            <a routerLink="/tickets" class="action-link">Open Ticket Center</a>
            <a routerLink="/profile" class="action-link">Review Profile</a>
          </div>
        </mat-card>
      </div>
    </section>
  `,
  styles: [`
    .help-shell { display: grid; gap: 22px; }
    .intro { margin: 10px 0 0; color: var(--muted); max-width: 64ch; line-height: 1.6; }
    .guide-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
    .guide-card {
      padding: 24px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: #ffffff;
      box-shadow: var(--shadow);
    }
    .guide-card h2 {
      margin-top: 0;
      color: #17366e;
    }
    ul {
      margin: 16px 0 0;
      padding-left: 20px;
      color: var(--muted);
      line-height: 1.8;
    }
    .priority-list {
      display: grid;
      gap: 14px;
      margin-top: 16px;
    }
    .priority-list div {
      display: grid;
      gap: 8px;
    }
    .priority-list p {
      margin: 0;
      color: var(--muted);
    }
    .action-stack {
      display: grid;
      gap: 12px;
      margin-top: 16px;
    }
    .action-link {
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid #dbe4f0;
      background: #f8fbff;
      color: #2563eb;
      text-decoration: none;
      font-weight: 700;
    }
    @media (max-width: 860px) {
      .guide-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class HelpCenterComponent {
  private auth = inject(AuthService);
  isStaff = computed(() => ['admin', 'agent'].includes(this.auth.user()?.role ?? ''));
}
