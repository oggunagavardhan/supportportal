import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { NotificationService } from '../../core/services/notification.service';
import { StorageService } from '../../core/services/storage.service';

interface AppSettings {
  dark_mode: boolean;
  push_notifications: boolean;
  email_alerts: boolean;
  compact_dashboard: boolean;
  show_internal_tips: boolean;
  auto_refresh_queue: boolean;
  language: string;
  timezone: string;
}

const SETTINGS_KEY = 'app_settings';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
  ],
  template: `
    <form class="settings-shell" [formGroup]="form" (ngSubmit)="save()">
      <header class="page-head">
        <div>
          <h1>Settings</h1>
          <p>Core configuration sections</p>
        </div>
      </header>

      <div class="settings-stack">
        <mat-card class="settings-card">
          <div class="section-head">
            <h2>Appearance</h2>
          </div>

          <div class="row-card">
            <div>
              <strong>Dark Mode</strong>
              <span>Toggle dark theme for the app</span>
            </div>
            <mat-slide-toggle color="primary" formControlName="dark_mode" (change)="onDarkModeToggle()"></mat-slide-toggle>
          </div>

          <div class="row-card">
            <div>
              <strong>Compact Dashboard</strong>
              <span>Use denser spacing for lists and cards</span>
            </div>
            <mat-slide-toggle color="primary" formControlName="compact_dashboard"></mat-slide-toggle>
          </div>
        </mat-card>

        <mat-card class="settings-card">
          <div class="section-head">
            <h2>Notifications</h2>
          </div>
          <div class="row-card">
            <div>
              <strong>Push Notifications</strong>
              <span>Receive browser push notifications</span>
            </div>
            <mat-slide-toggle color="primary" formControlName="push_notifications"></mat-slide-toggle>
          </div>
          <div class="row-card">
            <div>
              <strong>Email Alerts</strong>
              <span>Receive email alerts for important events</span>
            </div>
            <mat-slide-toggle color="primary" formControlName="email_alerts"></mat-slide-toggle>
          </div>
          <div class="row-card">
            <div>
              <strong>In-app Tips</strong>
              <span>Show helpful tips while working in the portal</span>
            </div>
            <mat-slide-toggle color="primary" formControlName="show_internal_tips"></mat-slide-toggle>
          </div>
        </mat-card>

        <mat-card class="settings-card">
          <div class="section-head">
            <h2>Language & Region</h2>
          </div>
          <div class="select-grid">
            <label class="select-field">
              <span>Language</span>
              <select formControlName="language">
                <option *ngFor="let language of languages" [value]="language.value">{{ language.label }}</option>
              </select>
            </label>
            <label class="select-field">
              <span>Timezone</span>
              <select formControlName="timezone">
                <option *ngFor="let timezone of timezones" [value]="timezone">{{ timezone }}</option>
              </select>
            </label>
          </div>
          <div class="summary-panel">
            <strong>Selected: {{ languageLabel(form.controls.language.value) }} | {{ form.controls.timezone.value }}</strong>
            <span>{{ previewTimestamp }}</span>
          </div>
        </mat-card>

        <div class="form-actions">
          <button type="submit" class="save-button">Save changes</button>
          <button type="button" class="reset-button" (click)="reset()">Reset defaults</button>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .settings-shell {
      display: grid;
      gap: 22px;
    }
    .page-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }
    .page-head h1 {
      margin: 0;
      font-size: 1.875rem;
      color: #17366e;
      letter-spacing: -0.04em;
    }
    .page-head p {
      margin: 8px 0 0;
      color: #60708c;
      font-size: 1.04rem;
    }
    .settings-stack {
      display: grid;
      gap: 22px;
    }
    .settings-card {
      padding: 28px;
      border-radius: 26px;
      border: 1px solid #d7e3f4;
      background: #ffffff;
      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.05);
    }
    .section-head {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 22px;
    }
    .section-head h2 {
      margin: 0;
      font-size: 1.95rem;
      color: #17366e;
      letter-spacing: -0.04em;
    }
    .section-icon {
      width: 50px;
      height: 50px;
      border-radius: 16px;
      display: grid;
      place-items: center;
    }
    .section-icon mat-icon {
      font-size: 1.55rem;
      width: 1.55rem;
      height: 1.55rem;
    }
    .blue { background: #dbeafe; color: #2563eb; }
    .purple { background: #dbeafe; color: #1d4ed8; }
    .green { background: #d1fae5; color: #059669; }
    .coral { background: #fee2e2; color: #ef4444; }
    .row-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      padding: 20px;
      border-radius: 18px;
      background: #f8fbff;
      border: 1px solid #e2eaf5;
    }
    .row-card + .row-card {
      margin-top: 16px;
    }
    .row-card strong,
    .action-tile strong {
      display: block;
      color: #17366e;
      font-size: 1.05rem;
      margin-bottom: 4px;
    }
    .row-card span,
    .action-tile span,
    .summary-panel span {
      color: #60708c;
      line-height: 1.5;
    }
    .select-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }
    .select-field {
      display: grid;
      gap: 12px;
      color: #17366e;
      font-weight: 700;
    }
    .select-field span {
      font-size: 1rem;
    }
    .select-field select {
      height: 54px;
      padding: 0 16px;
      border-radius: 16px;
      border: 1px solid #dfe7f3;
      background: #f8fbff;
      color: #17366e;
      font: inherit;
      outline: none;
    }
    .select-field select:focus {
      border-color: #4f7df4;
      box-shadow: 0 0 0 4px rgba(79, 125, 244, 0.12);
    }
    .summary-panel {
      margin-top: 20px;
      padding: 18px 20px;
      border-radius: 18px;
      border: 1px solid #e2eaf5;
      background: #f8fbff;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 12px;
    }
    .save-button,
    .reset-button {
      min-width: 140px;
      height: 44px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.95rem;
    }
    .save-button {
      background: #1f6feb;
      color: #fff;
    }
    .reset-button {
      background: #f8fafd;
      color: #23496e;
      border: 1px solid #dce9fe;
    }
    .summary-panel strong {
      display: block;
      color: #17366e;
      margin-bottom: 6px;
      font-size: 1.05rem;
    }
    .action-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }
    .action-tile {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      width: 100%;
      padding: 20px;
      border-radius: 18px;
      border: 1px solid #e2eaf5;
      background: #f8fbff;
      text-align: left;
      color: inherit;
    }
    .action-tile mat-icon {
      color: #94a3b8;
    }
    @media (max-width: 960px) {
      .page-head {
        flex-direction: column;
        align-items: stretch;
      }
      .select-grid,
      .action-grid {
        grid-template-columns: 1fr;
      }
      .row-card {
        flex-direction: column;
        align-items: flex-start;
      }
    }
    @media (max-width: 680px) {
      .settings-card {
        padding: 22px 18px;
        border-radius: 22px;
      }
      .section-head h2 {
        font-size: 1.6rem;
      }
    }
  `],
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private storage = inject(StorageService);
  private notify = inject(NotificationService);
  private auth = inject(AuthService);
  private i18n = inject(I18nService);

  user = this.auth.user;
  languages = [
    { label: 'English', value: 'en' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Telugu', value: 'te' },
  ];
  timezones = ['UTC', 'Asia/Kolkata', 'Europe/London', 'America/New_York'];
  previewTimestamp = 'Tuesday, March 31, 2026 at 9:38:57 AM';

  form = this.fb.nonNullable.group({
    dark_mode: false,
    push_notifications: true,
    email_alerts: true,
    compact_dashboard: false,
    show_internal_tips: true,
    auto_refresh_queue: false,
    language: 'en',
    timezone: 'UTC',
  });

  constructor() {
    const saved = this.readSettings();
    if (saved) {
      this.form.patchValue({
        ...saved,
        language: this.normalizeLanguageValue(saved.language),
      });
      this.applyTheme(saved.dark_mode);
    } else {
      this.applyTheme(this.form.controls.dark_mode.value);
    }

    this.form.controls.language.valueChanges.subscribe(() => this.updatePreviewTimestamp());
    this.form.controls.timezone.valueChanges.subscribe(() => this.updatePreviewTimestamp());
    this.form.controls.language.valueChanges.subscribe((language) => {
      this.i18n.setLanguage(this.normalizeLanguageValue(language));
    });
    this.i18n.setLanguage(this.normalizeLanguageValue(this.form.controls.language.value));
    this.updatePreviewTimestamp();
  }

  save(): void {
    const settings = this.form.getRawValue();
    this.storage.set(SETTINGS_KEY, JSON.stringify(settings));

    this.applyTheme(settings.dark_mode);
    this.i18n.setLanguage(this.normalizeLanguageValue(settings.language));
    localStorage.setItem('theme', settings.dark_mode ? 'dark' : 'light');

    this.notify.success('Settings saved successfully.');
  }

  reset(): void {
    this.form.setValue({
      dark_mode: false,
      push_notifications: true,
      email_alerts: true,
      compact_dashboard: false,
      show_internal_tips: true,
      auto_refresh_queue: false,
      language: 'en',
      timezone: 'UTC',
    });
    this.updatePreviewTimestamp();
    this.applyTheme(false);
    this.i18n.setLanguage('en');
    this.notify.success('Settings reset to defaults.');
  }

  onDarkModeToggle(): void {
    const darkMode = this.form.controls.dark_mode.value;
    this.applyTheme(darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }

  updatePreviewTimestamp(): void {
    const language = this.normalizeLanguageValue(this.form.controls.language.value);
    const timezone = this.form.controls.timezone.value;

    const now = new Date();
    const locale = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
    const formatted = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: timezone,
      hour12: true,
    }).format(now);

    this.previewTimestamp = `${formatted} (${timezone})`;
  }

  private applyTheme(isDark: boolean): void {
    const root = document.documentElement;
    if (isDark) {
      root.style.colorScheme = 'dark';
      root.classList.add('dark-theme');
    } else {
      root.style.colorScheme = 'light';
      root.classList.remove('dark-theme');
    }
  }

  private readSettings(): AppSettings | null {
    const raw = this.storage.get(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as AppSettings) : null;
  }

  languageLabel(value: string): string {
    return this.languages.find((language) => language.value === value)?.label || 'English';
  }

  private normalizeLanguageValue(value: string | null | undefined): string {
    if (!value) return 'en';
    const normalized = value.toLowerCase();
    if (normalized === 'english' || normalized === 'en') return 'en';
    if (normalized === 'hindi' || normalized === 'hi') return 'hi';
    if (normalized === 'telugu' || normalized === 'te') return 'te';
    return 'en';
  }
}
