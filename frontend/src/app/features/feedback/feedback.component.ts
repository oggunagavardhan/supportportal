import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';

@Component({
  standalone: true,
  selector: 'app-feedback',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule],
  template: `
    <section class="page-shell">
      <div class="section-header feedback-hero">
        <div class="hero-copy">
          <div class="chip">Let us know</div>
          <h1>Submit Feedback</h1>
          <p class="intro">Share your experience in under one minute. We use this to improve support quality and response speed.</p>
        </div>
        <div class="hero-meta" aria-hidden="true">
          <div class="meta-value">5-star</div>
          <div class="meta-label">Quick rating</div>
        </div>
      </div>

      <mat-card class="glass-card feedback-card" *ngIf="!submitted(); else successState">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="rating-section">
            <h3>How was your overall experience?</h3>
            <div class="stars">
              <span 
                *ngFor="let star of [1,2,3,4,5]" 
                class="star-icon"
                (click)="setRating(star)"
                [class.active]="star <= rating()">
                &#9733;
              </span>
            </div>
            <div class="error-msg" *ngIf="submittedAttempt() && rating() === 0">Please select a rating.</div>
          </div>

          <mat-form-field appearance="outline" floatLabel="always">
            <mat-label>Feedback Category</mat-label>
            <mat-select formControlName="category">
              <mat-option value="support">Support Quality</mat-option>
              <mat-option value="platform">Platform Issue</mat-option>
              <mat-option value="feature">Feature Request</mat-option>
              <mat-option value="other">Other</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" floatLabel="always">
            <mat-label>Tell us more about your experience</mat-label>
            <textarea matInput rows="5" formControlName="comments" placeholder="What went well? What could be improved?"></textarea>
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" class="submit-btn" [disabled]="isSending()">
            {{ isSending() ? 'Sending...' : 'Submit Feedback' }}
          </button>
        </form>
      </mat-card>

      <ng-template #successState>
        <mat-card class="glass-card success-card">
          <h2>Thank you for your feedback!</h2>
          <p>We've received your thoughts and will use them to improve our service.</p>
          <button mat-stroked-button color="primary" (click)="resetForm()">Submit another response</button>
        </mat-card>
      </ng-template>
    </section>
  `,
  styles: [`
    .page-shell { display: grid; gap: 16px; padding: 0; box-sizing: border-box; width: 100%; }
    .feedback-hero {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      padding: 18px 20px;
      border-radius: 16px;
      border: 1px solid #d5e4ff;
      background: linear-gradient(140deg, #ffffff 0%, #eef5ff 100%);
      box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
    }
    .section-header h1 {
      margin: 8px 0 0;
      font-size: clamp(1.05rem, 1.4vw, 1.35rem);
      color: #17366e;
    }
    .intro { margin: 8px 0 0; color: #4d668a; max-width: 70ch; line-height: 1.5; }
    .hero-meta {
      min-width: 98px;
      text-align: center;
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid #d2e2fd;
      background: #f6faff;
    }
    .meta-value {
      color: #1d4ed8;
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1.1;
    }
    .meta-label {
      color: #5a6f8f;
      font-size: 0.8rem;
      margin-top: 4px;
    }
    
    .feedback-card {
      padding: 20px;
      border-radius: 20px;
      border: 1px solid #d5e4ff;
      background: #ffffff;
      box-shadow: 0 10px 18px rgba(15, 23, 42, 0.07);
      width: 100%;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .rating-section {
      text-align: left;
      padding: 14px;
      border-radius: 14px;
      border: 1px solid #2f2f2f;
      background: #f8fbff;
    }
    .rating-section h3 {
      font-size: 1rem;
      margin: 0 0 10px 0;
      color: #334155;
      text-align: center;
    }
    .stars {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .stars mat-icon { display: none; }
    .star-icon {
      font-size: 34px;
      color: #cbd5e1;
      cursor: pointer;
      transition: color 0.2s, transform 0.15s;
      user-select: none;
      line-height: 1;
      width: 38px;
      height: 38px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .star-icon:hover { transform: scale(1.15); }
    .star-icon.active {
      color: #facc15;
      background: transparent;
      box-shadow: none;
    }
    
    .error-msg {
      color: #dc2626;
      font-size: 13px;
      margin-top: 8px;
    }
    
    .submit-btn {
      padding: 14px 18px !important;
      font-size: 13px;
      border-radius: 12px;
      margin-top: 2px;
    }
    
    .success-card {
      padding: 28px 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      border-radius: 16px;
      border: 1px solid #d5e4ff;
      background: #ffffff;
      box-shadow: 0 10px 18px rgba(15, 23, 42, 0.07);
    }
    .success-card h2 { margin: 0; font-size: 1.5rem; color: #1e293b; }
    .success-card p { margin: 0 0 10px 0; color: #64748b; font-size: 0.98rem; }
    :host-context(.dark-theme) .section-header h1 {
      color: #f8fbff;
    }
    :host-context(.dark-theme) .intro,
    :host-context(.dark-theme) .rating-section h3 {
      color: #d0def6;
    }
    :host-context(.dark-theme) .feedback-hero {
      border-color: #3a537b;
      background: linear-gradient(140deg, #1a2741 0%, #1f3154 100%);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
    }
    :host-context(.dark-theme) .hero-meta {
      border-color: #4a6590;
      background: #1a2741;
    }
    :host-context(.dark-theme) .meta-value {
      color: #b8d3ff;
    }
    :host-context(.dark-theme) .meta-label {
      color: #d0def6;
    }
    :host-context(.dark-theme) .feedback-card,
    :host-context(.dark-theme) .success-card {
      background: #1b2a46;
      border-color: #4d6892;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
    }
    :host-context(.dark-theme) .rating-section {
      border-color: #2f2f2f;
      background: #1a2741;
    }
    :host-context(.dark-theme) .success-card h2 {
      color: #f8fbff;
    }
    :host-context(.dark-theme) .success-card p {
      color: #d0def6;
    }
    :host-context(.dark-theme) .star-icon {
      color: #d8e6ff;
      text-shadow: 0 0 1px rgba(216, 230, 255, 0.9);
    }
    :host-context(.dark-theme) .star-icon.active {
      color: #facc15 !important;
      -webkit-text-fill-color: #facc15;
      background: transparent;
      text-shadow: none;
      box-shadow: none;
    }
    @media (max-width: 720px) {
      .feedback-hero {
        flex-direction: column;
        align-items: flex-start;
      }
      .hero-meta {
        align-self: flex-start;
      }
    }
  `]
})
export class FeedbackComponent {
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);
  private ticketService = inject(TicketService);

  rating = signal(0);
  submittedAttempt = signal(false);
  submitted = signal(false);
  isSending = signal(false);

  form = this.fb.nonNullable.group({
    category: ['', Validators.required],
    comments: ['', Validators.required]
  });

  setRating(val: number) {
    this.rating.set(val);
  }

  submit() {
    this.submittedAttempt.set(true);
    if (this.form.invalid || this.rating() === 0) {
      if (this.form.invalid) this.form.markAllAsTouched();
      return;
    }

    this.isSending.set(true);
    const payload = {
      rating: this.rating(),
      category: this.form.getRawValue().category,
      comments: this.form.getRawValue().comments
    };

    this.ticketService.submitFeedback(payload).subscribe({
      next: () => {
        this.isSending.set(false);
        this.submitted.set(true);
        this.notify.success('Feedback submitted successfully!');
      },
      error: () => {
        this.isSending.set(false);
        this.notify.error('Failed to submit feedback. Please try again.');
      }
    });
  }

  resetForm() {
    this.form.reset();
    this.rating.set(0);
    this.submittedAttempt.set(false);
    this.submitted.set(false);
  }
}
