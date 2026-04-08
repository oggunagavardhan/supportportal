import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Feedback } from '../../core/models/ticket.models';
import { AuthService } from '../../core/services/auth.service';
import { I18nPipe } from '../../core/pipes/i18n.pipe';
import { I18nService } from '../../core/services/i18n.service';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';

@Component({
  standalone: true,
  selector: 'app-feedback',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, I18nPipe],
  template: `
    <section class="page-shell">
      <div class="section-header feedback-hero">
        <div class="hero-copy">
          <div class="chip">{{ 'feedback.chip' | t }}</div>
          <h1>{{ 'feedback.title' | t }}</h1>
          <p class="intro">{{ 'feedback.subtitle' | t }}</p>
        </div>
        <div class="hero-meta" aria-hidden="true">
          <div class="meta-value">{{ 'feedback.meta_value' | t }}</div>
          <div class="meta-label">{{ 'feedback.meta_label' | t }}</div>
        </div>
      </div>

      <mat-card class="glass-card feedback-card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="rating-section">
            <h3>{{ 'feedback.rating_title' | t }}</h3>
            <div class="stars">
              <span 
                *ngFor="let star of [1,2,3,4,5]" 
                class="star-icon"
                (click)="setRating(star)"
                [class.active]="star <= rating()">
                &#9733;
              </span>
            </div>
            <div class="error-msg" *ngIf="submittedAttempt() && rating() === 0">{{ 'feedback.rating_required' | t }}</div>
          </div>

          <mat-form-field appearance="outline" floatLabel="always">
            <mat-label>{{ 'feedback.category' | t }}</mat-label>
            <mat-select formControlName="category">
              <mat-option value="support">{{ 'feedback.category_support' | t }}</mat-option>
              <mat-option value="platform">{{ 'feedback.category_platform' | t }}</mat-option>
              <mat-option value="feature">{{ 'feedback.category_feature' | t }}</mat-option>
              <mat-option value="other">{{ 'feedback.category_other' | t }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" floatLabel="always">
            <mat-label>{{ 'feedback.comments_label' | t }}</mat-label>
            <textarea #commentsField matInput rows="5" formControlName="comments" [placeholder]="'feedback.comments_placeholder' | t"></textarea>
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" class="submit-btn" [disabled]="isSending()">
            {{ isSending() ? ('feedback.saving' | t) : (editingFeedbackId() ? ('feedback.update' | t) : ('feedback.submit' | t)) }}
          </button>
        </form>
      </mat-card>

      <mat-card class="glass-card feedback-list-card">
        <h3>{{ feedbackTitle() }}</h3>
        <div class="feedback-list" *ngIf="feedbackItems().length; else emptyFeedback">
          <article class="feedback-row" *ngFor="let item of feedbackItems()">
            <div class="feedback-row-top">
              <strong>{{ categoryLabel(item.category) }}</strong>
              <span class="feedback-date">{{ item.created_at | date:'medium' }}</span>
            </div>
            <div class="feedback-rating">{{ starsText(item.rating) }}</div>
            <p class="feedback-comment">{{ item.comments }}</p>
            <div class="feedback-actions" *ngIf="canEdit(item)">
              <button mat-stroked-button type="button" (click)="editFeedback(item)">{{ 'common.update' | t }}</button>
              <button mat-stroked-button type="button" class="delete-btn" (click)="deleteFeedback(item.id)">{{ 'common.delete' | t }}</button>
            </div>
          </article>
        </div>
        <ng-template #emptyFeedback>
          <p class="empty-feedback">{{ 'feedback.empty' | t }}</p>
        </ng-template>
      </mat-card>
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
    
    .feedback-list-card {
      padding: 18px;
      border-radius: 16px;
      border: 1px solid #d5e4ff;
      background: #ffffff;
    }
    .feedback-list-card h3 {
      margin: 0 0 12px;
      color: #17366e;
      font-size: 1.02rem;
    }
    .feedback-list {
      display: grid;
      gap: 10px;
    }
    .feedback-row {
      border: 1px solid #d5c8f7;
      border-radius: 12px;
      padding: 12px;
      background: #fcfaff;
    }
    .feedback-row-top {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      align-items: center;
    }
    .feedback-row-top strong {
      color: #1f2f46;
      text-transform: capitalize;
    }
    .feedback-date {
      color: #64748b;
      font-size: 12px;
    }
    .feedback-rating {
      color: #f59e0b;
      margin-top: 6px;
      font-size: 15px;
      letter-spacing: 1px;
    }
    .feedback-comment {
      margin: 8px 0;
      color: #334155;
      line-height: 1.45;
    }
    .feedback-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .feedback-actions button {
      min-height: 40px;
      border-radius: 12px;
      padding: 0 18px;
      font-weight: 700;
    }
    .feedback-actions button:not(.delete-btn) {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
      border: 1px solid #16a34a !important;
      color: #ffffff !important;
    }
    .delete-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
      border: 1px solid #dc2626 !important;
      color: #ffffff !important;
    }
    .empty-feedback {
      margin: 0;
      color: #64748b;
      font-size: 0.94rem;
    }
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
    :host-context(.dark-theme) .feedback-list-card {
      background: #1b2a46;
      border-color: #4d6892;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
    }
    :host-context(.dark-theme) .rating-section {
      border-color: #2f2f2f;
      background: #1a2741;
    }
    :host-context(.dark-theme) .feedback-list-card h3,
    :host-context(.dark-theme) .feedback-row-top strong {
      color: #f8fbff;
    }
    :host-context(.dark-theme) .feedback-row {
      background: #1a2741;
      border-color: #7b67a8;
    }
    :host-context(.dark-theme) .feedback-actions button:not(.delete-btn) {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
      border-color: #16a34a !important;
      color: #ffffff !important;
    }
    :host-context(.dark-theme) .delete-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
      border-color: #dc2626 !important;
      color: #ffffff !important;
    }
    :host-context(.dark-theme) .feedback-date,
    :host-context(.dark-theme) .feedback-comment,
    :host-context(.dark-theme) .empty-feedback {
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
  private auth = inject(AuthService);
  private i18n = inject(I18nService);

  rating = signal(0);
  submittedAttempt = signal(false);
  isSending = signal(false);
  feedbackItems = signal<Feedback[]>([]);
  editingFeedbackId = signal<number | null>(null);
  @ViewChild('commentsField') commentsField?: ElementRef<HTMLTextAreaElement>;
  currentUserId = computed(() => this.auth.user()?.id ?? null);
  feedbackTitle = computed(() => {
    const role = this.auth.user()?.role;
    if (role === 'admin' || role === 'agent') {
      return this.i18n.translate('feedback.list_staff_title');
    }
    return this.i18n.translate('feedback.list_customer_title');
  });

  form = this.fb.nonNullable.group({
    category: ['', Validators.required],
    comments: ['', Validators.required]
  });

  constructor() {
    this.loadFeedback();
  }

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

    const request$ = this.editingFeedbackId()
      ? this.ticketService.updateFeedback(this.editingFeedbackId()!, payload)
      : this.ticketService.submitFeedback(payload);

    request$.subscribe({
      next: () => {
        this.isSending.set(false);
        this.notify.success(
          this.editingFeedbackId()
            ? this.i18n.translate('feedback.updated')
            : this.i18n.translate('feedback.submitted'),
        );
        this.resetForm();
        this.loadFeedback();
      },
      error: () => {
        this.isSending.set(false);
        this.notify.error(this.i18n.translate('feedback.submit_failed'));
      }
    });
  }

  resetForm() {
    this.form.reset();
    this.rating.set(0);
    this.submittedAttempt.set(false);
    this.editingFeedbackId.set(null);
  }

  editFeedback(item: Feedback) {
    this.editingFeedbackId.set(item.id);
    this.rating.set(item.rating);
    this.submittedAttempt.set(false);
    this.form.patchValue({
      category: item.category,
      comments: item.comments,
    });
    this.notify.success(this.i18n.translate('feedback.loaded_for_edit'));
    setTimeout(() => {
      const field = this.commentsField?.nativeElement;
      if (!field) {
        return;
      }
      const rect = field.getBoundingClientRect();
      const viewportTop = 90;
      const viewportBottom = window.innerHeight - 90;
      const isVisible = rect.top >= viewportTop && rect.bottom <= viewportBottom;
      if (!isVisible) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
      field.focus({ preventScroll: true });
    }, 0);
  }

  deleteFeedback(id: number) {
    this.ticketService.deleteFeedback(id).subscribe({
      next: () => {
        const message = this.i18n.translate('feedback.deleted');
        this.notify.success(message);
        if (this.editingFeedbackId() === id) {
          this.resetForm();
        }
        this.loadFeedback();
      },
      error: () => {
        const message = this.i18n.translate('feedback.delete_failed');
        this.notify.error(message);
      },
    });
  }

  categoryLabel(category: Feedback['category']): string {
    if (category === 'support') return this.i18n.translate('feedback.category_support');
    if (category === 'platform') return this.i18n.translate('feedback.category_platform');
    if (category === 'feature') return this.i18n.translate('feedback.category_feature');
    return this.i18n.translate('feedback.category_other');
  }

  starsText(rating: number): string {
    return '★'.repeat(Math.max(0, Math.min(5, rating)));
  }

  canEdit(item: Feedback): boolean {
    const currentId = this.currentUserId();
    return currentId !== null && item.user === currentId;
  }

  private loadFeedback() {
    const role = this.auth.user()?.role;
    const scope = role === 'admin' || role === 'agent' ? 'all' : undefined;
    this.ticketService.listFeedback({ page: 1, page_size: 200, ...(scope ? { scope } : {}) }).subscribe({
      next: (res) => {
        const items = res.results ?? [];
        const currentId = this.currentUserId();
        this.feedbackItems.set(
          role === 'customer' && currentId !== null
            ? items.filter((item) => item.user === currentId)
            : items,
        );
      },
      error: () => this.feedbackItems.set([]),
    });
  }
}
