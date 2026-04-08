import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Ticket } from '../../core/models/ticket.models';
import { TicketService } from '../../core/services/ticket.service';
import { I18nPipe } from '../../core/pipes/i18n.pipe';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    I18nPipe,
  ],
  template: `
    <section class="ticket-page">
      <div class="info-box">
        <div class="info-chip">{{ 'tickets.track.guide_chip' | t }}</div>
        <h3>{{ 'tickets.track.guide_title' | t }}</h3>
        <p>{{ 'tickets.track.guide_body' | t }}</p>
      </div>

      <mat-card class="glass-card tracking-card">
        <div class="tracking-header">
          <h2>{{ 'tickets.track.find_title' | t }}</h2>
          <span class="hint">{{ 'tickets.track.example_hint' | t }}</span>
        </div>
        <p class="track-note">{{ 'tickets.track.note' | t }}</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="tracking-form">
          <mat-form-field appearance="outline" class="id-input" floatLabel="always">
            <mat-label>{{ 'tickets.track.ticket_id' | t }}</mat-label>
            <input matInput formControlName="ticketId" [placeholder]="'tickets.track.ticket_id_placeholder' | t" type="number" />
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" class="track-btn" [disabled]="form.invalid || isLoading">
            {{ isLoading ? ('tickets.track.searching' | t) : ('tickets.track.track_button' | t) }}
          </button>
        </form>

        <span *ngIf="errorMessage" class="error-msg">
          {{ errorMessage }}
        </span>
      </mat-card>

      <mat-card class="glass-card ticket-result" *ngIf="foundTicket as ticket">
        <h3>{{ 'tickets.track.details_title' | t }}</h3>
        <p class="result-sub">{{ 'tickets.track.details_subtitle' | t }}</p>
        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">{{ 'tickets.track.label_id' | t }}</span>
            <span class="result-value">#{{ ticket.id }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">{{ 'tickets.track.label_status' | t }}</span>
            <span class="result-badge status" [ngClass]="ticket.status">
              {{ ('tickets.status.' + ticket.status) | t }}
            </span>
          </div>
          <div class="result-item">
            <span class="result-label">{{ 'tickets.track.label_priority' | t }}</span>
            <span class="result-badge priority" [ngClass]="ticket.priority">{{ ('tickets.priority_' + ticket.priority) | t }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">{{ 'tickets.track.label_updated' | t }}</span>
            <span class="result-value">{{ ticket.updated_at | date:'medium' }}</span>
          </div>
          <div class="result-item full">
            <span class="result-label">{{ 'tickets.track.label_title' | t }}</span>
            <span class="result-value">{{ ticket.title }}</span>
          </div>
          <div class="result-item full">
            <span class="result-label">{{ 'tickets.track.label_description' | t }}</span>
            <span class="result-value">{{ ticket.description }}</span>
          </div>
        </div>
      </mat-card>
    </section>
  `,
  styles: [`
    .ticket-page {
      display: grid;
      gap: 20px;
      box-sizing: border-box;
      height: auto;
      align-content: start;
    }
    .info-box {
      border: 1px solid #c9dbff;
      border-radius: 18px;
      background: linear-gradient(155deg, #f9fbff 0%, #edf4ff 100%);
      padding: 18px 16px 16px;
      width: 100%;
      align-self: start;
      min-height: 132px;
      box-shadow: 0 10px 22px rgba(37, 99, 235, 0.08);
    }
    .info-chip {
      width: fit-content;
      margin-bottom: 8px;
      padding: 5px 10px;
      border-radius: 999px;
      background: #dbeafe;
      color: #1d4ed8;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .info-box h3 {
      margin: 0 0 9px;
      color: #0f4c81;
      font-size: 19px;
      line-height: 1.2;
    }
    .info-box p {
      margin: 3px 0 0;
      color: #234f80;
      line-height: 1.55;
      font-size: 15px;
    }
    .tracking-card {
      padding: 24px 24px 22px;
      border: 1px solid #c9dbff;
      box-shadow: 0 14px 28px rgba(37, 99, 235, 0.1);
      background: linear-gradient(165deg, #ffffff 0%, #f5f9ff 100%);
      border-radius: 22px;
      width: 100%;
      box-sizing: border-box;
    }
    .tracking-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 14px;
      flex-wrap: wrap;
    }
    .tracking-header h2 {
      margin: 0;
      font-size: 24px;
      color: #153f84;
      letter-spacing: -0.01em;
    }
    .hint {
      color: #45638f;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      background: #eaf2ff;
      border: 1px solid #d0e0ff;
    }
    .tracking-form {
      margin-top: 16px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .track-note {
      margin: 10px 0 0;
      color: #48658f;
      font-size: 14px;
      line-height: 1.5;
    }
    .id-input {
      flex: 1;
    }
    .track-btn {
      min-width: 160px;
      height: 56px;
      border-radius: 14px;
      font-weight: 700;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.24);
    }
    .track-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 14px 24px rgba(37, 99, 235, 0.28);
    }
    .error-msg {
      color: #dc2626;
      font-weight: 700;
      font-size: 13px;
      margin-top: 10px;
      padding: 0;
      border: none;
      background: transparent;
      display: inline-block;
      width: auto;
      max-width: 100%;
    }
    .ticket-result {
      padding: 20px;
      border-radius: 20px;
      border: 1px solid #c9dbff;
      background: linear-gradient(165deg, #ffffff 0%, #f4f9ff 100%);
      box-shadow: 0 12px 24px rgba(37, 99, 235, 0.1);
    }
    .ticket-result h3 {
      margin: 0;
      font-size: 22px;
      color: #153f84;
    }
    .result-sub {
      margin: 6px 0 12px;
      color: #4f6990;
      font-size: 13px;
    }
    .result-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 14px;
    }
    .result-item {
      border: 1px solid #d0e0ff;
      border-radius: 14px;
      background: linear-gradient(160deg, #ffffff 0%, #eef5ff 100%);
      padding: 11px 13px;
      display: grid;
      gap: 6px;
      min-height: 56px;
    }
    .result-label {
      font-size: 12px;
      font-weight: 700;
      color: #111827;
      letter-spacing: 0.02em;
    }
    .result-value {
      color: #111827 !important;
      font-size: 15px;
      line-height: 1.45;
      font-weight: 600;
    }
    .result-item .result-value,
    .result-item.full .result-value {
      color: #111827 !important;
    }
    .result-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 24px;
      width: fit-content;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.01em;
      border: 1px solid transparent;
    }
    .result-badge.status.open {
      color: #1d4ed8;
      background: #dbeafe;
      border-color: #93c5fd;
    }
    .result-badge.status.in_progress {
      color: #9a5b04;
      background: #fef3c7;
      border-color: #fcd34d;
    }
    .result-badge.status.closed {
      color: #047857;
      background: #d1fae5;
      border-color: #6ee7b7;
    }
    .result-badge.priority.low {
      color: #374151;
      background: #f3f4f6;
      border-color: #d1d5db;
    }
    .result-badge.priority.medium {
      color: #b45309;
      background: #ffedd5;
      border-color: #fdba74;
    }
    .result-badge.priority.high {
      color: #b91c1c;
      background: #fee2e2;
      border-color: #fca5a5;
    }
    .result-grid .full {
      grid-column: 1 / -1;
    }
    :host-context(.dark-theme) .tracking-card {
      background: linear-gradient(165deg, #1b2a46 0%, #223a62 100%);
      border-color: #6f93cb;
    }
    :host-context(.dark-theme) .info-box {
      background: linear-gradient(155deg, #1b2a46 0%, #233a61 100%);
      border-color: #6f93cb;
    }
    :host-context(.dark-theme) .info-chip {
      background: rgba(147, 197, 253, 0.18);
      border: 1px solid rgba(147, 197, 253, 0.3);
      color: #cde3ff;
    }
    :host-context(.dark-theme) .info-box h3 {
      color: #dbeafe;
    }
    :host-context(.dark-theme) .info-box p {
      color: #bcd5f7;
    }
    :host-context(.dark-theme) .tracking-header h2 {
      color: #f8fbff;
    }
    :host-context(.dark-theme) .hint {
      color: #d0def6;
      background: rgba(147, 197, 253, 0.12);
      border-color: rgba(147, 197, 253, 0.3);
    }
    :host-context(.dark-theme) .track-note {
      color: #d0def6;
    }
    :host-context(.dark-theme) .id-input {
      --mdc-outlined-text-field-outline-color: #7ea1d8;
      --mdc-outlined-text-field-focus-outline-color: #93c5fd;
      --mdc-outlined-text-field-hover-outline-color: #93c5fd;
      --mdc-outlined-text-field-label-text-color: #d8e6ff;
      --mdc-outlined-text-field-focus-label-text-color: #dbeafe;
    }
    :host-context(.dark-theme) .ticket-result {
      background: linear-gradient(165deg, #1b2a46 0%, #223a62 100%);
      border-color: #6f93cb;
      color: #d0def6;
    }
    :host-context(.dark-theme) .ticket-result h3 {
      color: #f8fbff;
    }
    :host-context(.dark-theme) .result-sub {
      color: #c5d7f4;
    }
    :host-context(.dark-theme) .result-item {
      background: linear-gradient(160deg, #223555 0%, #294168 100%);
      border-color: #6f93cb;
    }
    :host-context(.dark-theme) .result-label {
      color: #bdd4f7;
    }
    :host-context(.dark-theme) .result-value {
      color: #f4f8ff;
    }
    @media (max-width: 760px) {
      .tracking-form {
        flex-direction: column;
      }
      .track-btn {
        width: 100%;
      }
      .tracking-card {
        padding: 18px;
      }
      .result-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class TrackTicketComponent {
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private i18n = inject(I18nService);

  errorMessage = '';
  isLoading = false;
  foundTicket: Ticket | null = null;

  form = this.fb.nonNullable.group({
    ticketId: ['', [Validators.required, Validators.min(1)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    const ticketId = this.form.getRawValue().ticketId;
    
    this.errorMessage = '';
    this.isLoading = true;
    this.foundTicket = null;
    
    this.ticketService.get(String(ticketId)).subscribe({
      next: (ticket) => {
        this.isLoading = false;
        this.foundTicket = ticket;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = this.i18n.translate('tickets.track.not_found');
      }
    });
  }
}
