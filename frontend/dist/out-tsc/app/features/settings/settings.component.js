import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { StorageService } from '../../core/services/storage.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/card";
import * as i5 from "@angular/material/icon";
import * as i6 from "@angular/material/slide-toggle";
function SettingsComponent_option_71_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const language_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", language_r1);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(language_r1);
} }
function SettingsComponent_option_76_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const timezone_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", timezone_r2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(timezone_r2);
} }
function SettingsComponent_div_106_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7)(1, "div")(2, "strong");
    i0.ɵɵtext(3, "Auto Refresh Queue");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5, "Keep the ticket workspace fresh for admin and support staff");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(6, "mat-slide-toggle", 26);
    i0.ɵɵelementEnd();
} }
const SETTINGS_KEY = 'app_settings';
export class SettingsComponent {
    fb = inject(FormBuilder);
    storage = inject(StorageService);
    notify = inject(NotificationService);
    auth = inject(AuthService);
    user = this.auth.user;
    isStaff = computed(() => ['admin', 'agent'].includes(this.user()?.role ?? ''));
    languages = ['English', 'Hindi', 'Telugu'];
    timezones = ['UTC', 'Asia/Kolkata', 'Europe/London', 'America/New_York'];
    previewTimestamp = 'Tuesday, March 31, 2026 at 9:38:57 AM';
    form = this.fb.nonNullable.group({
        dark_mode: false,
        push_notifications: true,
        email_alerts: true,
        compact_dashboard: false,
        show_internal_tips: true,
        auto_refresh_queue: false,
        language: 'English',
        timezone: 'UTC',
    });
    constructor() {
        const saved = this.readSettings();
        if (saved) {
            this.form.patchValue(saved);
        }
    }
    save() {
        this.storage.set(SETTINGS_KEY, JSON.stringify(this.form.getRawValue()));
        this.notify.success('Settings saved successfully.');
    }
    readSettings() {
        const raw = this.storage.get(SETTINGS_KEY);
        return raw ? JSON.parse(raw) : null;
    }
    static ɵfac = function SettingsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SettingsComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SettingsComponent, selectors: [["ng-component"]], decls: 107, vars: 8, consts: [[1, "settings-shell"], [1, "page-head"], ["mat-flat-button", "", "color", "primary", 3, "click"], [1, "settings-stack", 3, "formGroup"], [1, "settings-card"], [1, "section-head"], [1, "section-icon", "blue"], [1, "row-card"], ["color", "primary", "formControlName", "dark_mode"], ["color", "primary", "formControlName", "compact_dashboard"], [1, "section-icon", "purple"], ["color", "primary", "formControlName", "push_notifications"], ["color", "primary", "formControlName", "email_alerts"], ["color", "primary", "formControlName", "show_internal_tips"], [1, "section-icon", "green"], [1, "select-grid"], [1, "select-field"], ["formControlName", "language"], [3, "value", 4, "ngFor", "ngForOf"], ["formControlName", "timezone"], [1, "summary-panel"], [1, "section-icon", "coral"], [1, "action-grid"], ["type", "button", 1, "action-tile"], ["class", "row-card", 4, "ngIf"], [3, "value"], ["color", "primary", "formControlName", "auto_refresh_queue"]], template: function SettingsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "h1");
            i0.ɵɵtext(4, "Settings");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6, "Manage your preferences");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "button", 2);
            i0.ɵɵlistener("click", function SettingsComponent_Template_button_click_7_listener() { return ctx.save(); });
            i0.ɵɵtext(8, "Save Settings");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "div", 3)(10, "mat-card", 4)(11, "div", 5)(12, "div", 6)(13, "mat-icon");
            i0.ɵɵtext(14, "palette");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "h2");
            i0.ɵɵtext(16, "Appearance");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "div", 7)(18, "div")(19, "strong");
            i0.ɵɵtext(20, "Dark Mode");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "span");
            i0.ɵɵtext(22, "Toggle dark theme");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(23, "mat-slide-toggle", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "div", 7)(25, "div")(26, "strong");
            i0.ɵɵtext(27, "Compact Dashboard");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "span");
            i0.ɵɵtext(29, "Use denser cards and a tighter workspace layout");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(30, "mat-slide-toggle", 9);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(31, "mat-card", 4)(32, "div", 5)(33, "div", 10)(34, "mat-icon");
            i0.ɵɵtext(35, "notifications_none");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(36, "h2");
            i0.ɵɵtext(37, "Notifications");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(38, "div", 7)(39, "div")(40, "strong");
            i0.ɵɵtext(41, "Push Notifications");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(42, "span");
            i0.ɵɵtext(43, "Receive notifications in browser");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(44, "mat-slide-toggle", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "div", 7)(46, "div")(47, "strong");
            i0.ɵɵtext(48, "Email Alerts");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "span");
            i0.ɵɵtext(50, "Receive important updates via email");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(51, "mat-slide-toggle", 12);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(52, "div", 7)(53, "div")(54, "strong");
            i0.ɵɵtext(55, "Support Guidance");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(56, "span");
            i0.ɵɵtext(57);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(58, "mat-slide-toggle", 13);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(59, "mat-card", 4)(60, "div", 5)(61, "div", 14)(62, "mat-icon");
            i0.ɵɵtext(63, "language");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(64, "h2");
            i0.ɵɵtext(65, "Language & Region");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(66, "div", 15)(67, "label", 16)(68, "span");
            i0.ɵɵtext(69, "Language");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(70, "select", 17);
            i0.ɵɵtemplate(71, SettingsComponent_option_71_Template, 2, 2, "option", 18);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(72, "label", 16)(73, "span");
            i0.ɵɵtext(74, "Timezone");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(75, "select", 19);
            i0.ɵɵtemplate(76, SettingsComponent_option_76_Template, 2, 2, "option", 18);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(77, "div", 20)(78, "strong");
            i0.ɵɵtext(79);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(80, "span");
            i0.ɵɵtext(81);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(82, "mat-card", 4)(83, "div", 5)(84, "div", 21)(85, "mat-icon");
            i0.ɵɵtext(86, "lock_open");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(87, "h2");
            i0.ɵɵtext(88, "Privacy & Security");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(89, "div", 22)(90, "button", 23)(91, "div")(92, "strong");
            i0.ɵɵtext(93, "Change Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(94, "span");
            i0.ɵɵtext(95, "Use the forgot password flow to update your account password");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(96, "mat-icon");
            i0.ɵɵtext(97, "arrow_forward");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(98, "button", 23)(99, "div")(100, "strong");
            i0.ɵɵtext(101, "Active Sessions");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(102, "span");
            i0.ɵɵtext(103, "Current session is managed by your JWT login in this support portal");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(104, "mat-icon");
            i0.ɵɵtext(105, "arrow_forward");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(106, SettingsComponent_div_106_Template, 7, 0, "div", 24);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(48);
            i0.ɵɵtextInterpolate(ctx.isStaff() ? "Show inline operational tips while handling the queue" : "Show inline tips while creating and tracking requests");
            i0.ɵɵadvance(14);
            i0.ɵɵproperty("ngForOf", ctx.languages);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngForOf", ctx.timezones);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate2("Selected: ", ctx.form.controls.language.value, " | ", ctx.form.controls.timezone.value, "");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.previewTimestamp);
            i0.ɵɵadvance(25);
            i0.ɵɵproperty("ngIf", ctx.isStaff());
        } }, dependencies: [CommonModule, i1.NgForOf, i1.NgIf, ReactiveFormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.FormGroupDirective, i2.FormControlName, MatButtonModule, i3.MatButton, MatCardModule, i4.MatCard, MatIconModule, i5.MatIcon, MatSlideToggleModule, i6.MatSlideToggle], styles: [".settings-shell[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 22px;\n    }\n    .page-head[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: flex-start;\n      justify-content: space-between;\n      gap: 16px;\n    }\n    .page-head[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n      margin: 0;\n      font-size: 2.2rem;\n      color: #17366e;\n      letter-spacing: -0.04em;\n    }\n    .page-head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n      margin: 8px 0 0;\n      color: #60708c;\n      font-size: 1.04rem;\n    }\n    .settings-stack[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 22px;\n    }\n    .settings-card[_ngcontent-%COMP%] {\n      padding: 28px;\n      border-radius: 26px;\n      border: 1px solid #d7e3f4;\n      background: #ffffff;\n      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.05);\n    }\n    .section-head[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 14px;\n      margin-bottom: 22px;\n    }\n    .section-head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n      margin: 0;\n      font-size: 1.95rem;\n      color: #17366e;\n      letter-spacing: -0.04em;\n    }\n    .section-icon[_ngcontent-%COMP%] {\n      width: 50px;\n      height: 50px;\n      border-radius: 16px;\n      display: grid;\n      place-items: center;\n    }\n    .section-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 1.55rem;\n      width: 1.55rem;\n      height: 1.55rem;\n    }\n    .blue[_ngcontent-%COMP%] { background: #dbeafe; color: #2563eb; }\n    .purple[_ngcontent-%COMP%] { background: #f3e8ff; color: #9333ea; }\n    .green[_ngcontent-%COMP%] { background: #d1fae5; color: #059669; }\n    .coral[_ngcontent-%COMP%] { background: #fee2e2; color: #ef4444; }\n    .row-card[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 18px;\n      padding: 20px;\n      border-radius: 18px;\n      background: #f8fbff;\n      border: 1px solid #e2eaf5;\n    }\n    .row-card[_ngcontent-%COMP%]    + .row-card[_ngcontent-%COMP%] {\n      margin-top: 16px;\n    }\n    .row-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n   .action-tile[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n      display: block;\n      color: #17366e;\n      font-size: 1.05rem;\n      margin-bottom: 4px;\n    }\n    .row-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n   .action-tile[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n   .summary-panel[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n      color: #60708c;\n      line-height: 1.5;\n    }\n    .select-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(2, minmax(0, 1fr));\n      gap: 18px;\n    }\n    .select-field[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 12px;\n      color: #17366e;\n      font-weight: 700;\n    }\n    .select-field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n      font-size: 1rem;\n    }\n    .select-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n      height: 54px;\n      padding: 0 16px;\n      border-radius: 16px;\n      border: 1px solid #dfe7f3;\n      background: #f8fbff;\n      color: #17366e;\n      font: inherit;\n      outline: none;\n    }\n    .select-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus {\n      border-color: #4f7df4;\n      box-shadow: 0 0 0 4px rgba(79, 125, 244, 0.12);\n    }\n    .summary-panel[_ngcontent-%COMP%] {\n      margin-top: 20px;\n      padding: 18px 20px;\n      border-radius: 18px;\n      border: 1px solid #e2eaf5;\n      background: #f8fbff;\n    }\n    .summary-panel[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n      display: block;\n      color: #17366e;\n      margin-bottom: 6px;\n      font-size: 1.05rem;\n    }\n    .action-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(2, minmax(0, 1fr));\n      gap: 16px;\n      margin-bottom: 16px;\n    }\n    .action-tile[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 18px;\n      width: 100%;\n      padding: 20px;\n      border-radius: 18px;\n      border: 1px solid #e2eaf5;\n      background: #f8fbff;\n      text-align: left;\n      color: inherit;\n    }\n    .action-tile[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      color: #94a3b8;\n    }\n    @media (max-width: 960px) {\n      .page-head[_ngcontent-%COMP%] {\n        flex-direction: column;\n        align-items: stretch;\n      }\n      .select-grid[_ngcontent-%COMP%], \n   .action-grid[_ngcontent-%COMP%] {\n        grid-template-columns: 1fr;\n      }\n      .row-card[_ngcontent-%COMP%] {\n        flex-direction: column;\n        align-items: flex-start;\n      }\n    }\n    @media (max-width: 680px) {\n      .settings-card[_ngcontent-%COMP%] {\n        padding: 22px 18px;\n        border-radius: 22px;\n      }\n      .section-head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n        font-size: 1.6rem;\n      }\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SettingsComponent, [{
        type: Component,
        args: [{ standalone: true, imports: [
                    CommonModule,
                    ReactiveFormsModule,
                    MatButtonModule,
                    MatCardModule,
                    MatIconModule,
                    MatSlideToggleModule,
                ], template: `
    <section class="settings-shell">
      <header class="page-head">
        <div>
          <h1>Settings</h1>
          <p>Manage your preferences</p>
        </div>
        <button mat-flat-button color="primary" (click)="save()">Save Settings</button>
      </header>

      <div class="settings-stack" [formGroup]="form">
        <mat-card class="settings-card">
          <div class="section-head">
            <div class="section-icon blue"><mat-icon>palette</mat-icon></div>
            <h2>Appearance</h2>
          </div>

          <div class="row-card">
            <div>
              <strong>Dark Mode</strong>
              <span>Toggle dark theme</span>
            </div>
            <mat-slide-toggle color="primary" formControlName="dark_mode"></mat-slide-toggle>
          </div>

          <div class="row-card">
            <div>
              <strong>Compact Dashboard</strong>
              <span>Use denser cards and a tighter workspace layout</span>
            </div>
            <mat-slide-toggle color="primary" formControlName="compact_dashboard"></mat-slide-toggle>
          </div>
        </mat-card>

        <mat-card class="settings-card">
          <div class="section-head">
            <div class="section-icon purple"><mat-icon>notifications_none</mat-icon></div>
            <h2>Notifications</h2>
          </div>

          <div class="row-card">
            <div>
              <strong>Push Notifications</strong>
              <span>Receive notifications in browser</span>
            </div>
            <mat-slide-toggle color="primary" formControlName="push_notifications"></mat-slide-toggle>
          </div>

          <div class="row-card">
            <div>
              <strong>Email Alerts</strong>
              <span>Receive important updates via email</span>
            </div>
            <mat-slide-toggle color="primary" formControlName="email_alerts"></mat-slide-toggle>
          </div>

          <div class="row-card">
            <div>
              <strong>Support Guidance</strong>
              <span>{{ isStaff()
                ? 'Show inline operational tips while handling the queue'
                : 'Show inline tips while creating and tracking requests' }}</span>
            </div>
            <mat-slide-toggle color="primary" formControlName="show_internal_tips"></mat-slide-toggle>
          </div>
        </mat-card>

        <mat-card class="settings-card">
          <div class="section-head">
            <div class="section-icon green"><mat-icon>language</mat-icon></div>
            <h2>Language & Region</h2>
          </div>

          <div class="select-grid">
            <label class="select-field">
              <span>Language</span>
              <select formControlName="language">
                <option *ngFor="let language of languages" [value]="language">{{ language }}</option>
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
            <strong>Selected: {{ form.controls.language.value }} | {{ form.controls.timezone.value }}</strong>
            <span>{{ previewTimestamp }}</span>
          </div>
        </mat-card>

        <mat-card class="settings-card">
          <div class="section-head">
            <div class="section-icon coral"><mat-icon>lock_open</mat-icon></div>
            <h2>Privacy & Security</h2>
          </div>

          <div class="action-grid">
            <button type="button" class="action-tile">
              <div>
                <strong>Change Password</strong>
                <span>Use the forgot password flow to update your account password</span>
              </div>
              <mat-icon>arrow_forward</mat-icon>
            </button>

            <button type="button" class="action-tile">
              <div>
                <strong>Active Sessions</strong>
                <span>Current session is managed by your JWT login in this support portal</span>
              </div>
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>

          <div class="row-card" *ngIf="isStaff()">
            <div>
              <strong>Auto Refresh Queue</strong>
              <span>Keep the ticket workspace fresh for admin and support staff</span>
            </div>
            <mat-slide-toggle color="primary" formControlName="auto_refresh_queue"></mat-slide-toggle>
          </div>
        </mat-card>
      </div>
    </section>
  `, styles: ["\n    .settings-shell {\n      display: grid;\n      gap: 22px;\n    }\n    .page-head {\n      display: flex;\n      align-items: flex-start;\n      justify-content: space-between;\n      gap: 16px;\n    }\n    .page-head h1 {\n      margin: 0;\n      font-size: 2.2rem;\n      color: #17366e;\n      letter-spacing: -0.04em;\n    }\n    .page-head p {\n      margin: 8px 0 0;\n      color: #60708c;\n      font-size: 1.04rem;\n    }\n    .settings-stack {\n      display: grid;\n      gap: 22px;\n    }\n    .settings-card {\n      padding: 28px;\n      border-radius: 26px;\n      border: 1px solid #d7e3f4;\n      background: #ffffff;\n      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.05);\n    }\n    .section-head {\n      display: flex;\n      align-items: center;\n      gap: 14px;\n      margin-bottom: 22px;\n    }\n    .section-head h2 {\n      margin: 0;\n      font-size: 1.95rem;\n      color: #17366e;\n      letter-spacing: -0.04em;\n    }\n    .section-icon {\n      width: 50px;\n      height: 50px;\n      border-radius: 16px;\n      display: grid;\n      place-items: center;\n    }\n    .section-icon mat-icon {\n      font-size: 1.55rem;\n      width: 1.55rem;\n      height: 1.55rem;\n    }\n    .blue { background: #dbeafe; color: #2563eb; }\n    .purple { background: #f3e8ff; color: #9333ea; }\n    .green { background: #d1fae5; color: #059669; }\n    .coral { background: #fee2e2; color: #ef4444; }\n    .row-card {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 18px;\n      padding: 20px;\n      border-radius: 18px;\n      background: #f8fbff;\n      border: 1px solid #e2eaf5;\n    }\n    .row-card + .row-card {\n      margin-top: 16px;\n    }\n    .row-card strong,\n    .action-tile strong {\n      display: block;\n      color: #17366e;\n      font-size: 1.05rem;\n      margin-bottom: 4px;\n    }\n    .row-card span,\n    .action-tile span,\n    .summary-panel span {\n      color: #60708c;\n      line-height: 1.5;\n    }\n    .select-grid {\n      display: grid;\n      grid-template-columns: repeat(2, minmax(0, 1fr));\n      gap: 18px;\n    }\n    .select-field {\n      display: grid;\n      gap: 12px;\n      color: #17366e;\n      font-weight: 700;\n    }\n    .select-field span {\n      font-size: 1rem;\n    }\n    .select-field select {\n      height: 54px;\n      padding: 0 16px;\n      border-radius: 16px;\n      border: 1px solid #dfe7f3;\n      background: #f8fbff;\n      color: #17366e;\n      font: inherit;\n      outline: none;\n    }\n    .select-field select:focus {\n      border-color: #4f7df4;\n      box-shadow: 0 0 0 4px rgba(79, 125, 244, 0.12);\n    }\n    .summary-panel {\n      margin-top: 20px;\n      padding: 18px 20px;\n      border-radius: 18px;\n      border: 1px solid #e2eaf5;\n      background: #f8fbff;\n    }\n    .summary-panel strong {\n      display: block;\n      color: #17366e;\n      margin-bottom: 6px;\n      font-size: 1.05rem;\n    }\n    .action-grid {\n      display: grid;\n      grid-template-columns: repeat(2, minmax(0, 1fr));\n      gap: 16px;\n      margin-bottom: 16px;\n    }\n    .action-tile {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 18px;\n      width: 100%;\n      padding: 20px;\n      border-radius: 18px;\n      border: 1px solid #e2eaf5;\n      background: #f8fbff;\n      text-align: left;\n      color: inherit;\n    }\n    .action-tile mat-icon {\n      color: #94a3b8;\n    }\n    @media (max-width: 960px) {\n      .page-head {\n        flex-direction: column;\n        align-items: stretch;\n      }\n      .select-grid,\n      .action-grid {\n        grid-template-columns: 1fr;\n      }\n      .row-card {\n        flex-direction: column;\n        align-items: flex-start;\n      }\n    }\n    @media (max-width: 680px) {\n      .settings-card {\n        padding: 22px 18px;\n        border-radius: 22px;\n      }\n      .section-head h2 {\n        font-size: 1.6rem;\n      }\n    }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SettingsComponent, { className: "SettingsComponent", filePath: "src/app/features/settings/settings.component.ts", lineNumber: 341 }); })();
//# sourceMappingURL=settings.component.js.map