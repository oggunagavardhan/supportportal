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
        <div class="header-copy">
          <div class="chip">Help Center</div>
          <h1>{{ isStaff() ? 'Support operations guide' : 'Need help using the portal?' }}</h1>
          <p class="intro">
            {{ isStaff()
              ? 'Quick operating notes for support agents and admins handling the queue.'
              : 'Everything customers need to create better tickets and get faster responses.' }}
          </p>
        </div>
        <div class="header-actions">
          <a mat-flat-button color="primary" routerLink="/tickets/new">Create Ticket</a>
        </div>
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

      <mat-card class="guide-card faq-card">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-list">
          <details class="faq-item" open>
            <summary>How do I create a good support ticket?</summary>
            <p>Use a clear title, exact issue details, what you expected, and what actually happened. Add screenshots or error text if available.</p>
          </details>

          <details class="faq-item">
            <summary>How can I track my ticket status?</summary>
            <p>Go to Track Ticket and enter your Track ID. You can see status, priority, assigned support owner, and latest updates.</p>
          </details>

          <details class="faq-item">
            <summary>What do Open, In Progress, and Closed mean?</summary>
            <p>Open means waiting for action, In Progress means a support member is actively working on it, and Closed means the request is resolved.</p>
          </details>

          <details class="faq-item">
            <summary>When can I assign a ticket?</summary>
            <p>Staff can assign customer-raised tickets from pending issues. Agent-originated tickets may not require assignment depending on your workflow settings.</p>
          </details>

          <details class="faq-item">
            <summary>Where can I chat about a ticket?</summary>
            <p>Use Messages to open Customer Conversations or Admin Conversations. Replies are stored per ticket conversation thread.</p>
          </details>

          <details class="faq-item">
            <summary>How do I submit feedback?</summary>
            <p>Open Feedback, select a star rating, choose category, and submit comments. Super admin can review submitted feedback summaries.</p>
          </details>
        </div>
      </mat-card>
    </section>
  `,
  styles: [`
    .help-shell { display: grid; gap: 18px; }
    .section-header {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: center;
      padding: 20px 22px;
      border-radius: 16px;
      border: 1px solid #d5e4ff;
      background: linear-gradient(140deg, #ffffff 0%, #eff5ff 100%);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    }
    .header-copy h1 {
      margin: 8px 0 0;
      color: #17366e;
      font-size: clamp(1.3rem, 1.8vw, 1.9rem);
    }
    .intro { margin: 10px 0 0; color: #4b6589; max-width: 64ch; line-height: 1.6; }
    .header-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      min-width: 150px;
    }
    .guide-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }
    .guide-card {
      padding: 18px 20px;
      border-radius: 16px;
      border: 1px solid #d8e6fa;
      background: #ffffff;
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.06);
    }
    .guide-card h2 {
      margin: 0;
      color: #17366e;
      font-size: 1.12rem;
    }
    ul {
      margin: 12px 0 0;
      padding-left: 20px;
      color: #4f6586;
      line-height: 1.65;
    }
    .priority-list {
      display: grid;
      gap: 12px;
      margin-top: 12px;
    }
    .priority-list div {
      display: grid;
      gap: 8px;
    }
    .priority-list p {
      margin: 0;
      color: #506788;
    }
    .action-stack {
      display: grid;
      gap: 12px;
      margin-top: 12px;
    }
    .action-link {
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid #d8e4fa;
      background: #f5f9ff;
      color: #2563eb;
      text-decoration: none;
      font-weight: 700;
      transition: background 0.2s ease, transform 0.2s ease;
    }
    .action-link:hover {
      background: #e8f1ff;
      transform: translateY(-1px);
    }
    .faq-card {
      grid-column: 1 / -1;
    }
    .faq-list {
      display: grid;
      gap: 10px;
      margin-top: 12px;
    }
    .faq-item {
      border: 1px solid #d8e4fa;
      border-radius: 12px;
      background: #f8fbff;
      padding: 10px 12px;
    }
    .faq-item summary {
      cursor: pointer;
      color: #17366e;
      font-weight: 700;
      font-size: 0.95rem;
      outline: none;
    }
    .faq-item p {
      margin: 10px 0 0;
      color: #506788;
      line-height: 1.55;
      font-size: 0.9rem;
    }
    :host-context(.dark-theme) .section-header {
      border-color: #3a537b;
      background: linear-gradient(140deg, #1a2741 0%, #1f3154 100%);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
    }
    :host-context(.dark-theme) .header-copy h1 {
      color: #f4f8ff;
    }
    :host-context(.dark-theme) .intro,
    :host-context(.dark-theme) ul,
    :host-context(.dark-theme) .priority-list p {
      color: #c6d7f4;
    }
    :host-context(.dark-theme) .guide-card,
    :host-context(.dark-theme) .action-link,
    :host-context(.dark-theme) .faq-item {
      border-color: #476189;
      background: #1a2741;
      box-shadow: none;
    }
    :host-context(.dark-theme) .guide-card h2,
    :host-context(.dark-theme) .faq-item summary {
      color: #f4f8ff;
    }
    :host-context(.dark-theme) .action-link {
      color: #b8d3ff;
    }
    :host-context(.dark-theme) .faq-item p {
      color: #c6d7f4;
    }
    :host-context(.dark-theme) .action-link:hover {
      background: #22345a;
    }
    @media (max-width: 860px) {
      .section-header {
        padding: 16px;
        flex-direction: column;
        align-items: flex-start;
      }
      .header-actions {
        width: 100%;
        justify-content: flex-start;
      }
      .guide-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class HelpCenterComponent {
  private auth = inject(AuthService);
  isStaff = computed(
    () =>
      ['admin', 'agent'].includes(this.auth.user()?.role ?? '') ||
      !!this.auth.user()?.is_superuser,
  );
}
