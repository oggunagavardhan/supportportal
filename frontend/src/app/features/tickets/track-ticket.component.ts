import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Ticket } from '../../core/models/ticket.models';
import { TicketService } from '../../core/services/ticket.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <section class="ticket-page">
      <div class="info-box">
        <h3>How Ticket Tracking Works</h3>
        <p>
          Each support request gets a unique Track ID. Enter that ID to view the
          ticket status, priority, assigned support owner, and latest update details.
          Keep this ID safe so you can quickly check progress anytime.
        </p>
      </div>

      <mat-card class="glass-card tracking-card">
        <div class="tracking-header">
          <h2>Find your ticket</h2>
          <span class="hint">Example: 104, 205, 501</span>
        </div>
        <p class="track-note">
          Enter the ticket ID you received while creating a request to quickly view the latest status and details.
        </p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="tracking-form">
          <mat-form-field appearance="outline" class="id-input" floatLabel="always">
            <mat-label>Ticket ID</mat-label>
            <input matInput formControlName="ticketId" placeholder="Enter ticket number" type="number" />
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" class="track-btn" [disabled]="form.invalid || isLoading">
            {{ isLoading ? 'Searching...' : 'Track Ticket' }}
          </button>
        </form>

        <span *ngIf="errorMessage" class="error-msg">
          {{ errorMessage }}
        </span>
      </mat-card>

      <mat-card class="glass-card ticket-result" *ngIf="foundTicket as ticket">
        <h3>Ticket Details</h3>
        <p class="result-sub">Live ticket snapshot from your support queue.</p>
        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">Ticket ID</span>
            <span class="result-value">#{{ ticket.id }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Status</span>
            <span class="result-badge status" [ngClass]="ticket.status">
              {{ ticket.status === 'in_progress' ? 'In Progress' : (ticket.status | titlecase) }}
            </span>
          </div>
          <div class="result-item">
            <span class="result-label">Priority</span>
            <span class="result-badge priority" [ngClass]="ticket.priority">{{ ticket.priority | titlecase }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Updated</span>
            <span class="result-value">{{ ticket.updated_at | date:'medium' }}</span>
          </div>
          <div class="result-item full">
            <span class="result-label">Title</span>
            <span class="result-value">{{ ticket.title }}</span>
          </div>
          <div class="result-item full">
            <span class="result-label">Description</span>
            <span class="result-value">{{ ticket.description }}</span>
          </div>
        </div>
      </mat-card>
    </section>
  `,
  styles: [`
    .ticket-page {
      display: grid;
      gap: 18px;
      box-sizing: border-box;
      height: auto;
      align-content: start;
    }
    .info-box {
      border: 1px solid #d7e3f4;
      border-radius: 16px;
      background: #f8fbff;
      padding: 18px 14px 14px;
      width: 100%;
      align-self: start;
      min-height: 132px;
    }
    .info-box h3 {
      margin: 0 0 8px;
      color: #0f4c81;
      font-size: 18px;
      line-height: 1.2;
    }
    .info-box p {
      margin: 3px 0 0;
      color: #24507f;
      line-height: 1.45;
      font-size: 15px;
    }
    .tracking-card {
      padding: 24px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      background: #ffffff;
      border-radius: 20px;
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
      font-size: 22px;
      color: #17366e;
    }
    .hint {
      color: #60708c;
      font-size: 13px;
    }
    .tracking-form {
      margin-top: 16px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .track-note {
      margin: 10px 0 0;
      color: #4f6790;
      font-size: 14px;
      line-height: 1.5;
    }
    .id-input {
      flex: 1;
    }
    .track-btn {
      min-width: 160px;
      height: 56px;
      border-radius: 12px;
      font-weight: 700;
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.24);
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
      border-radius: 18px;
      border: 1px solid #d7e3f4;
      background: #ffffff;
    }
    .ticket-result h3 {
      margin: 0;
      font-size: 20px;
      color: #17366e;
    }
    .result-sub {
      margin: 6px 0 12px;
      color: #5f7391;
      font-size: 13px;
    }
    .result-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 14px;
    }
    .result-item {
      border: 1px solid #d8e4f4;
      border-radius: 12px;
      background: #f8fbff;
      padding: 10px 12px;
      display: grid;
      gap: 6px;
      min-height: 56px;
    }
    .result-label {
      font-size: 12px;
      font-weight: 700;
      color: #506788;
      letter-spacing: 0.02em;
    }
    .result-value {
      color: #17366e;
      font-size: 15px;
      line-height: 1.45;
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
      background: #1b2a46;
      border-color: #6f93cb;
    }
    :host-context(.dark-theme) .info-box {
      background: #1b2a46;
      border-color: #6f93cb;
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
      background: #1b2a46;
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
      background: #223555;
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
        this.errorMessage = 'No ticket found. Please check once.';
      }
    });
  }
}
