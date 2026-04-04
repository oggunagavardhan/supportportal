import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { AUTH_PAGE_STYLES } from './auth.shared-styles';
import { OtpInputComponent } from './components/otp-input.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/card";
import * as i5 from "@angular/material/form-field";
import * as i6 from "@angular/material/input";
function LoginComponent_form_9_div_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵtext(1, "Enter a valid email address.");
    i0.ɵɵelementEnd();
} }
function LoginComponent_form_9_div_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵtext(1, "Password is required.");
    i0.ɵɵelementEnd();
} }
function LoginComponent_form_9_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "form", 9);
    i0.ɵɵlistener("ngSubmit", function LoginComponent_form_9_Template_form_ngSubmit_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.submitCredentials()); });
    i0.ɵɵelementStart(1, "mat-form-field", 10)(2, "mat-label");
    i0.ɵɵtext(3, "Email");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "input", 11);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, LoginComponent_form_9_div_5_Template, 2, 0, "div", 12);
    i0.ɵɵelementStart(6, "mat-form-field", 10)(7, "mat-label");
    i0.ɵɵtext(8, "Password");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "input", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, LoginComponent_form_9_div_10_Template, 2, 0, "div", 12);
    i0.ɵɵelementStart(11, "button", 14);
    i0.ɵɵtext(12, "Send OTP");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("formGroup", ctx_r1.loginForm);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("invalid-field", ctx_r1.showFieldError(ctx_r1.loginForm.controls.email));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r1.showFieldError(ctx_r1.loginForm.controls.email));
    i0.ɵɵadvance();
    i0.ɵɵclassProp("invalid-field", ctx_r1.showFieldError(ctx_r1.loginForm.controls.password));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r1.showFieldError(ctx_r1.loginForm.controls.password));
} }
function LoginComponent_form_10_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "form", 16);
    i0.ɵɵlistener("ngSubmit", function LoginComponent_form_10_Template_form_ngSubmit_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.submitOtp()); });
    i0.ɵɵelementStart(1, "div", 17);
    i0.ɵɵtext(2, "OTP expires in 5 minutes. Resend becomes available once the timer reaches zero.");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "app-otp-input", 18);
    i0.ɵɵelementStart(4, "div", 19)(5, "button", 14);
    i0.ɵɵtext(6, "Verify OTP");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 20);
    i0.ɵɵlistener("click", function LoginComponent_form_10_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.resendOtp()); });
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("formGroup", ctx_r1.otpForm);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("control", ctx_r1.otpForm.controls.otp_code);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.countdown() > 0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.countdown() > 0 ? "Resend in " + ctx_r1.countdown() + "s" : "Resend OTP", " ");
} }
export class LoginComponent {
    fb = inject(FormBuilder);
    auth = inject(AuthService);
    notify = inject(NotificationService);
    destroyRef = inject(DestroyRef);
    step = signal(1);
    email = signal('');
    countdown = signal(0);
    timerId;
    loginForm = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });
    otpForm = this.fb.nonNullable.group({
        otp_code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
    constructor() {
        this.destroyRef.onDestroy(() => {
            if (this.timerId) {
                window.clearInterval(this.timerId);
            }
        });
    }
    submitCredentials() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }
        this.auth.loginStart(this.loginForm.getRawValue()).subscribe({
            next: (response) => {
                this.email.set(this.loginForm.controls.email.value);
                this.step.set(2);
                this.otpForm.patchValue({ otp_code: '' });
                this.startCountdownFrom(response.resend_available_at);
                this.notify.success(response.message);
            },
            error: (error) => this.notify.error(this.getErrorMessage(error, 'Login failed.')),
        });
    }
    submitOtp() {
        if (this.otpForm.invalid) {
            this.otpForm.markAllAsTouched();
            return;
        }
        this.auth
            .verifyOtp({ email: this.email(), otp_code: this.otpForm.controls.otp_code.value, purpose: 'login' })
            .subscribe({
            error: (error) => this.notify.error(this.getErrorMessage(error, 'OTP verification failed.')),
        });
    }
    resendOtp() {
        this.auth.resendOtp({ email: this.email(), purpose: 'login' }).subscribe({
            next: (response) => {
                this.notify.success(response.message);
                this.otpForm.patchValue({ otp_code: '' });
                this.startCountdownFrom(response.resend_available_at);
            },
            error: (error) => this.notify.error(this.getErrorMessage(error, 'Unable to resend OTP.')),
        });
    }
    showFieldError(control) {
        return control.invalid && (control.touched || control.dirty);
    }
    startCountdownFrom(resendAvailableAt) {
        if (this.timerId) {
            window.clearInterval(this.timerId);
        }
        const target = resendAvailableAt ? new Date(resendAvailableAt).getTime() : Date.now() + 60000;
        const tick = () => {
            const seconds = Math.max(0, Math.ceil((target - Date.now()) / 1000));
            this.countdown.set(seconds);
            if (seconds === 0 && this.timerId) {
                window.clearInterval(this.timerId);
            }
        };
        tick();
        this.timerId = window.setInterval(tick, 1000);
    }
    getErrorMessage(error, fallback) {
        const payload = error.error;
        if (typeof payload === 'string') {
            return payload;
        }
        if (payload && typeof payload === 'object') {
            const record = payload;
            const detail = record['detail'];
            if (typeof detail === 'string') {
                return detail;
            }
            const nonFieldErrors = record['non_field_errors'];
            if (Array.isArray(nonFieldErrors) && typeof nonFieldErrors[0] === 'string') {
                return nonFieldErrors[0];
            }
        }
        return fallback;
    }
    static ɵfac = function LoginComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoginComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LoginComponent, selectors: [["ng-component"]], decls: 16, vars: 5, consts: [[1, "auth-shell", "theme-login"], [1, "auth-layout"], [1, "auth-card"], [1, "eyebrow"], ["class", "auth-form", 3, "formGroup", "ngSubmit", 4, "ngIf"], ["class", "auth-form two-actions", 3, "formGroup", "ngSubmit", 4, "ngIf"], [1, "links"], ["routerLink", "/auth/register"], ["routerLink", "/auth/forgot-password"], [1, "auth-form", 3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "theme-field"], ["matInput", "", "formControlName", "email", "placeholder", "name@company.com"], ["class", "field-help error", 4, "ngIf"], ["matInput", "", "type", "password", "formControlName", "password", "placeholder", "Your password"], ["mat-flat-button", "", "type", "submit", 1, "theme-primary-btn"], [1, "field-help", "error"], [1, "auth-form", "two-actions", 3, "ngSubmit", "formGroup"], [1, "otp-note"], [3, "control"], [1, "action-row"], ["mat-stroked-button", "", "type", "button", 1, "theme-secondary-btn", 3, "click", "disabled"]], template: function LoginComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "section", 1)(2, "mat-card", 2)(3, "div", 3);
            i0.ɵɵtext(4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h2");
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p");
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(9, LoginComponent_form_9_Template, 13, 7, "form", 4)(10, LoginComponent_form_10_Template, 9, 4, "form", 5);
            i0.ɵɵelementStart(11, "div", 6)(12, "a", 7);
            i0.ɵɵtext(13, "Create account");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "a", 8);
            i0.ɵɵtext(15, "Forgot password?");
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.step() === 1 ? "Login" : "OTP Check");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.step() === 1 ? "Welcome back" : "Verify your 6-digit code");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.step() === 1 ? "Enter your email and password to receive a one-time verification code." : "We sent a code to " + ctx.email() + ". Enter it below to continue.", " ");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step() === 1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step() === 2);
        } }, dependencies: [CommonModule, i1.NgIf, ReactiveFormsModule, i2.ɵNgNoValidate, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.FormGroupDirective, i2.FormControlName, RouterLink,
            MatButtonModule, i3.MatButton, MatCardModule, i4.MatCard, MatFormFieldModule, i5.MatFormField, i5.MatLabel, MatInputModule, i6.MatInput, OtpInputComponent], styles: [".auth-shell[_ngcontent-%COMP%] {\n    min-height: 100vh;\n    display: grid;\n    place-items: center;\n    padding: 20px;\n    background:\n      radial-gradient(circle at top right, rgba(255, 255, 255, 0.75), transparent 28%),\n      linear-gradient(180deg, var(--auth-bg) 0%, color-mix(in srgb, var(--auth-bg) 78%, white) 100%);\n  }\n\n  .auth-layout[_ngcontent-%COMP%] {\n    width: min(100%, 450px);\n    display: grid;\n  }\n\n  .auth-card[_ngcontent-%COMP%] {\n    border-radius: 12px;\n    background: #ffffff;\n    border: 1px solid rgba(255, 255, 255, 0.72);\n    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);\n  }\n\n  .auth-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    margin: 14px 0 10px;\n    color: var(--auth-text);\n    line-height: 1.05;\n  }\n\n  .auth-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n   .field-help[_ngcontent-%COMP%], \n   .aux-text[_ngcontent-%COMP%] {\n    color: var(--auth-muted);\n    line-height: 1.55;\n  }\n\n  .auth-card[_ngcontent-%COMP%] {\n    padding: 32px;\n  }\n\n  .eyebrow[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    padding: 8px 12px;\n    border-radius: 999px;\n    background: color-mix(in srgb, var(--auth-accent) 12%, white);\n    color: var(--auth-text);\n    font-size: 12px;\n    font-weight: 700;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n  }\n\n  .auth-form[_ngcontent-%COMP%] {\n    display: grid;\n    gap: 14px;\n    margin-top: 24px;\n  }\n\n  .auth-form.two-actions[_ngcontent-%COMP%] {\n    gap: 12px;\n  }\n\n  .action-row[_ngcontent-%COMP%] {\n    display: flex;\n    gap: 12px;\n    flex-wrap: wrap;\n  }\n\n  .action-row[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n    flex: 1 1 180px;\n  }\n\n  .links[_ngcontent-%COMP%] {\n    display: flex;\n    justify-content: space-between;\n    gap: 12px;\n    flex-wrap: wrap;\n    margin-top: 20px;\n  }\n\n  .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n   .inline-link[_ngcontent-%COMP%] {\n    color: var(--auth-accent);\n    text-decoration: none;\n    font-weight: 700;\n  }\n\n  .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, \n   .inline-link[_ngcontent-%COMP%]:hover {\n    color: var(--auth-accent-hover);\n  }\n\n  .field-help[_ngcontent-%COMP%] {\n    font-size: 12px;\n    margin-top: -6px;\n  }\n\n  .field-help.error[_ngcontent-%COMP%] {\n    color: #dc2626;\n  }\n\n  .success-text[_ngcontent-%COMP%] {\n    color: #16a34a;\n    font-size: 14px;\n    font-weight: 700;\n    margin-top: 10px;\n  }\n\n  .otp-note[_ngcontent-%COMP%] {\n    padding: 14px 16px;\n    border-radius: 12px;\n    background: color-mix(in srgb, var(--auth-accent) 8%, white);\n    color: var(--auth-text);\n    font-size: 14px;\n  }\n\n  .password-rules[_ngcontent-%COMP%] {\n    display: grid;\n    gap: 6px;\n    margin-top: -2px;\n    padding: 12px 14px;\n    border-radius: 12px;\n    background: #fafafa;\n    border: 1px solid color-mix(in srgb, var(--auth-accent) 12%, white);\n  }\n\n  .password-rules[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    font-size: 12px;\n    color: var(--auth-muted);\n  }\n\n  .password-rules[_ngcontent-%COMP%]   span.invalid[_ngcontent-%COMP%] {\n    color: #dc2626;\n  }\n\n  .password-rules[_ngcontent-%COMP%]   span.valid[_ngcontent-%COMP%] {\n    color: #16a34a;\n  }\n\n  .theme-field[_ngcontent-%COMP%] {\n    --mdc-outlined-text-field-outline-color: var(--auth-border);\n    --mdc-outlined-text-field-focus-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-hover-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-label-text-color: var(--auth-muted);\n    --mdc-outlined-text-field-focus-label-text-color: var(--auth-accent);\n    --mat-form-field-focus-select-arrow-color: var(--auth-accent);\n  }\n\n  .theme-field.invalid-field[_ngcontent-%COMP%] {\n    --mdc-outlined-text-field-outline-color: #dc2626;\n    --mdc-outlined-text-field-hover-outline-color: #dc2626;\n    --mdc-outlined-text-field-focus-outline-color: #dc2626;\n    --mdc-outlined-text-field-label-text-color: #dc2626;\n    --mdc-outlined-text-field-focus-label-text-color: #dc2626;\n  }\n\n  .theme-primary-btn[_ngcontent-%COMP%] {\n    --mdc-filled-button-container-color: var(--auth-accent);\n    --mdc-filled-button-label-text-color: #ffffff;\n    min-height: 48px;\n    border-radius: 10px;\n  }\n\n  .theme-secondary-btn[_ngcontent-%COMP%] {\n    min-height: 48px;\n    border-radius: 10px;\n    color: var(--auth-accent);\n    border-color: color-mix(in srgb, var(--auth-accent) 34%, white);\n  }\n\n  .theme-primary-btn[_ngcontent-%COMP%]:hover {\n    --mdc-filled-button-container-color: var(--auth-accent-hover);\n  }\n\n  @media (max-width: 560px) {\n    .auth-shell[_ngcontent-%COMP%] {\n      padding: 14px;\n    }\n\n    .auth-card[_ngcontent-%COMP%] {\n      padding: 22px;\n    }\n\n    .links[_ngcontent-%COMP%] {\n      flex-direction: column;\n      align-items: flex-start;\n    }\n  }", ".theme-login[_ngcontent-%COMP%] {\n      --auth-bg: #EEF5FF;\n      --auth-accent: #2563EB;\n      --auth-accent-hover: #1D4ED8;\n      --auth-text: #1E3A8A;\n      --auth-muted: #6B7280;\n      --auth-border: #BFDBFE;\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoginComponent, [{
        type: Component,
        args: [{ standalone: true, imports: [
                    CommonModule,
                    ReactiveFormsModule,
                    RouterLink,
                    MatButtonModule,
                    MatCardModule,
                    MatFormFieldModule,
                    MatInputModule,
                    OtpInputComponent,
                ], template: `
    <div class="auth-shell theme-login">
      <section class="auth-layout">
        <mat-card class="auth-card">
          <div class="eyebrow">{{ step() === 1 ? 'Login' : 'OTP Check' }}</div>
          <h2>{{ step() === 1 ? 'Welcome back' : 'Verify your 6-digit code' }}</h2>
          <p>
            {{ step() === 1
              ? 'Enter your email and password to receive a one-time verification code.'
              : 'We sent a code to ' + email() + '. Enter it below to continue.' }}
          </p>

          <form class="auth-form" [formGroup]="loginForm" *ngIf="step() === 1" (ngSubmit)="submitCredentials()">
            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showFieldError(loginForm.controls.email)">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="name@company.com" />
            </mat-form-field>
            <div class="field-help error" *ngIf="showFieldError(loginForm.controls.email)">Enter a valid email address.</div>

            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showFieldError(loginForm.controls.password)">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Your password" />
            </mat-form-field>
            <div class="field-help error" *ngIf="showFieldError(loginForm.controls.password)">Password is required.</div>

            <button mat-flat-button type="submit" class="theme-primary-btn">Send OTP</button>
          </form>

          <form class="auth-form two-actions" [formGroup]="otpForm" *ngIf="step() === 2" (ngSubmit)="submitOtp()">
            <div class="otp-note">OTP expires in 5 minutes. Resend becomes available once the timer reaches zero.</div>
            <app-otp-input [control]="otpForm.controls.otp_code"></app-otp-input>

            <div class="action-row">
              <button mat-flat-button type="submit" class="theme-primary-btn">Verify OTP</button>
              <button mat-stroked-button type="button" class="theme-secondary-btn" [disabled]="countdown() > 0" (click)="resendOtp()">
                {{ countdown() > 0 ? 'Resend in ' + countdown() + 's' : 'Resend OTP' }}
              </button>
            </div>
          </form>

          <div class="links">
            <a routerLink="/auth/register">Create account</a>
            <a routerLink="/auth/forgot-password">Forgot password?</a>
          </div>
        </mat-card>
      </section>
    </div>
  `, styles: ["\n  .auth-shell {\n    min-height: 100vh;\n    display: grid;\n    place-items: center;\n    padding: 20px;\n    background:\n      radial-gradient(circle at top right, rgba(255, 255, 255, 0.75), transparent 28%),\n      linear-gradient(180deg, var(--auth-bg) 0%, color-mix(in srgb, var(--auth-bg) 78%, white) 100%);\n  }\n\n  .auth-layout {\n    width: min(100%, 450px);\n    display: grid;\n  }\n\n  .auth-card {\n    border-radius: 12px;\n    background: #ffffff;\n    border: 1px solid rgba(255, 255, 255, 0.72);\n    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);\n  }\n\n  .auth-card h2 {\n    margin: 14px 0 10px;\n    color: var(--auth-text);\n    line-height: 1.05;\n  }\n\n  .auth-card p,\n  .field-help,\n  .aux-text {\n    color: var(--auth-muted);\n    line-height: 1.55;\n  }\n\n  .auth-card {\n    padding: 32px;\n  }\n\n  .eyebrow {\n    display: inline-flex;\n    align-items: center;\n    padding: 8px 12px;\n    border-radius: 999px;\n    background: color-mix(in srgb, var(--auth-accent) 12%, white);\n    color: var(--auth-text);\n    font-size: 12px;\n    font-weight: 700;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n  }\n\n  .auth-form {\n    display: grid;\n    gap: 14px;\n    margin-top: 24px;\n  }\n\n  .auth-form.two-actions {\n    gap: 12px;\n  }\n\n  .action-row {\n    display: flex;\n    gap: 12px;\n    flex-wrap: wrap;\n  }\n\n  .action-row > * {\n    flex: 1 1 180px;\n  }\n\n  .links {\n    display: flex;\n    justify-content: space-between;\n    gap: 12px;\n    flex-wrap: wrap;\n    margin-top: 20px;\n  }\n\n  .links a,\n  .inline-link {\n    color: var(--auth-accent);\n    text-decoration: none;\n    font-weight: 700;\n  }\n\n  .links a:hover,\n  .inline-link:hover {\n    color: var(--auth-accent-hover);\n  }\n\n  .field-help {\n    font-size: 12px;\n    margin-top: -6px;\n  }\n\n  .field-help.error {\n    color: #dc2626;\n  }\n\n  .success-text {\n    color: #16a34a;\n    font-size: 14px;\n    font-weight: 700;\n    margin-top: 10px;\n  }\n\n  .otp-note {\n    padding: 14px 16px;\n    border-radius: 12px;\n    background: color-mix(in srgb, var(--auth-accent) 8%, white);\n    color: var(--auth-text);\n    font-size: 14px;\n  }\n\n  .password-rules {\n    display: grid;\n    gap: 6px;\n    margin-top: -2px;\n    padding: 12px 14px;\n    border-radius: 12px;\n    background: #fafafa;\n    border: 1px solid color-mix(in srgb, var(--auth-accent) 12%, white);\n  }\n\n  .password-rules span {\n    font-size: 12px;\n    color: var(--auth-muted);\n  }\n\n  .password-rules span.invalid {\n    color: #dc2626;\n  }\n\n  .password-rules span.valid {\n    color: #16a34a;\n  }\n\n  .theme-field {\n    --mdc-outlined-text-field-outline-color: var(--auth-border);\n    --mdc-outlined-text-field-focus-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-hover-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-label-text-color: var(--auth-muted);\n    --mdc-outlined-text-field-focus-label-text-color: var(--auth-accent);\n    --mat-form-field-focus-select-arrow-color: var(--auth-accent);\n  }\n\n  .theme-field.invalid-field {\n    --mdc-outlined-text-field-outline-color: #dc2626;\n    --mdc-outlined-text-field-hover-outline-color: #dc2626;\n    --mdc-outlined-text-field-focus-outline-color: #dc2626;\n    --mdc-outlined-text-field-label-text-color: #dc2626;\n    --mdc-outlined-text-field-focus-label-text-color: #dc2626;\n  }\n\n  .theme-primary-btn {\n    --mdc-filled-button-container-color: var(--auth-accent);\n    --mdc-filled-button-label-text-color: #ffffff;\n    min-height: 48px;\n    border-radius: 10px;\n  }\n\n  .theme-secondary-btn {\n    min-height: 48px;\n    border-radius: 10px;\n    color: var(--auth-accent);\n    border-color: color-mix(in srgb, var(--auth-accent) 34%, white);\n  }\n\n  .theme-primary-btn:hover {\n    --mdc-filled-button-container-color: var(--auth-accent-hover);\n  }\n\n  @media (max-width: 560px) {\n    .auth-shell {\n      padding: 14px;\n    }\n\n    .auth-card {\n      padding: 22px;\n    }\n\n    .links {\n      flex-direction: column;\n      align-items: flex-start;\n    }\n  }\n", "\n    .theme-login {\n      --auth-bg: #EEF5FF;\n      --auth-accent: #2563EB;\n      --auth-accent-hover: #1D4ED8;\n      --auth-text: #1E3A8A;\n      --auth-muted: #6B7280;\n      --auth-border: #BFDBFE;\n    }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/features/auth/login.component.ts", lineNumber: 86 }); })();
//# sourceMappingURL=login.component.js.map