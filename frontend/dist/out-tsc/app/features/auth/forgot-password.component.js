import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { AUTH_PAGE_STYLES } from './auth.shared-styles';
import { OtpInputComponent } from './components/otp-input.component';
import { matchingFieldsValidator, strongPasswordValidator } from './auth.validators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/card";
import * as i5 from "@angular/material/form-field";
import * as i6 from "@angular/material/input";
function ForgotPasswordComponent_form_9_div_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13);
    i0.ɵɵtext(1, "Enter a valid email address.");
    i0.ɵɵelementEnd();
} }
function ForgotPasswordComponent_form_9_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "form", 8);
    i0.ɵɵlistener("ngSubmit", function ForgotPasswordComponent_form_9_Template_form_ngSubmit_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.requestOtp()); });
    i0.ɵɵelementStart(1, "mat-form-field", 9)(2, "mat-label");
    i0.ɵɵtext(3, "Email");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "input", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, ForgotPasswordComponent_form_9_div_5_Template, 2, 0, "div", 11);
    i0.ɵɵelementStart(6, "button", 12);
    i0.ɵɵtext(7, "Send OTP");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("formGroup", ctx_r1.emailForm);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("invalid-field", ctx_r1.showFieldError(ctx_r1.emailForm.controls.email));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r1.showFieldError(ctx_r1.emailForm.controls.email));
} }
function ForgotPasswordComponent_form_10_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "form", 14);
    i0.ɵɵlistener("ngSubmit", function ForgotPasswordComponent_form_10_Template_form_ngSubmit_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.continueToPasswordStep()); });
    i0.ɵɵelementStart(1, "div", 15);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "app-otp-input", 16);
    i0.ɵɵelementStart(4, "div", 17)(5, "button", 12);
    i0.ɵɵtext(6, "Continue");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 18);
    i0.ɵɵlistener("click", function ForgotPasswordComponent_form_10_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.resendOtp()); });
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("formGroup", ctx_r1.otpForm);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("We sent a recovery code to ", ctx_r1.email(), ". Enter the 6-digit OTP to continue.");
    i0.ɵɵadvance();
    i0.ɵɵproperty("control", ctx_r1.otpForm.controls.otp_code);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.countdown() > 0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.countdown() > 0 ? "Resend in " + ctx_r1.countdown() + "s" : "Resend OTP", " ");
} }
function ForgotPasswordComponent_form_11_div_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 24)(1, "span");
    i0.ɵɵtext(2, "At least 8 characters");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "At least 1 uppercase letter");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span");
    i0.ɵɵtext(6, "At least 1 lowercase letter");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span");
    i0.ɵɵtext(8, "At least 1 number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span");
    i0.ɵɵtext(10, "At least 1 special character");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("valid", ctx_r1.hasRule("length"))("invalid", !ctx_r1.hasRule("length"));
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("valid", ctx_r1.hasRule("upper"))("invalid", !ctx_r1.hasRule("upper"));
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("valid", ctx_r1.hasRule("lower"))("invalid", !ctx_r1.hasRule("lower"));
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("valid", ctx_r1.hasRule("number"))("invalid", !ctx_r1.hasRule("number"));
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("valid", ctx_r1.hasRule("special"))("invalid", !ctx_r1.hasRule("special"));
} }
function ForgotPasswordComponent_form_11_div_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13);
    i0.ɵɵtext(1, "Passwords must match.");
    i0.ɵɵelementEnd();
} }
function ForgotPasswordComponent_form_11_div_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.successMessage());
} }
function ForgotPasswordComponent_form_11_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "form", 8);
    i0.ɵɵlistener("ngSubmit", function ForgotPasswordComponent_form_11_Template_form_ngSubmit_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.resetPassword()); });
    i0.ɵɵelementStart(1, "mat-form-field", 19)(2, "mat-label");
    i0.ɵɵtext(3, "New Password");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "input", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, ForgotPasswordComponent_form_11_div_5_Template, 11, 20, "div", 21);
    i0.ɵɵelementStart(6, "mat-form-field", 9)(7, "mat-label");
    i0.ɵɵtext(8, "Confirm Password");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "input", 22);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, ForgotPasswordComponent_form_11_div_10_Template, 2, 0, "div", 11);
    i0.ɵɵelementStart(11, "button", 12);
    i0.ɵɵtext(12, "Reset Password");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(13, ForgotPasswordComponent_form_11_div_13_Template, 2, 1, "div", 23);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("formGroup", ctx_r1.resetForm);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("invalid-field", ctx_r1.showFieldError(ctx_r1.resetForm.controls.new_password));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r1.resetForm.controls.new_password.dirty || ctx_r1.resetForm.controls.new_password.touched);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("invalid-field", ctx_r1.showConfirmError());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r1.showConfirmError());
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", ctx_r1.successMessage());
} }
export class ForgotPasswordComponent {
    fb = inject(FormBuilder);
    auth = inject(AuthService);
    notify = inject(NotificationService);
    router = inject(Router);
    destroyRef = inject(DestroyRef);
    step = signal(1);
    email = signal('');
    otpCode = signal('');
    countdown = signal(0);
    successMessage = signal('');
    timerId;
    redirectTimerId;
    emailForm = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
    });
    otpForm = this.fb.nonNullable.group({
        otp_code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
    resetForm = this.fb.nonNullable.group({
        new_password: ['', [Validators.required, strongPasswordValidator()]],
        confirm_password: ['', Validators.required],
    }, { validators: matchingFieldsValidator('new_password', 'confirm_password') });
    constructor() {
        this.destroyRef.onDestroy(() => {
            if (this.timerId) {
                window.clearInterval(this.timerId);
            }
            if (this.redirectTimerId) {
                window.clearTimeout(this.redirectTimerId);
            }
        });
    }
    requestOtp() {
        if (this.emailForm.invalid) {
            this.emailForm.markAllAsTouched();
            return;
        }
        const email = this.emailForm.controls.email.value;
        this.auth.requestPasswordReset(email).subscribe({
            next: (response) => {
                this.email.set(email);
                this.step.set(2);
                this.successMessage.set('');
                this.otpForm.patchValue({ otp_code: '' });
                this.startCountdownFrom(response.resend_available_at);
                this.notify.success(response.message);
            },
            error: (error) => this.notify.error(this.getErrorMessage(error, 'Unable to send OTP.')),
        });
    }
    continueToPasswordStep() {
        if (this.otpForm.invalid) {
            this.otpForm.markAllAsTouched();
            return;
        }
        this.otpCode.set(this.otpForm.controls.otp_code.value);
        this.step.set(3);
    }
    resetPassword() {
        if (this.resetForm.invalid) {
            this.resetForm.markAllAsTouched();
            return;
        }
        this.auth
            .resetPassword({ email: this.email(), otp_code: this.otpCode(), new_password: this.resetForm.controls.new_password.value })
            .subscribe({
            next: (response) => {
                this.successMessage.set('Password reset successful. Redirecting to login...');
                this.notify.success(response.message);
                this.redirectTimerId = window.setTimeout(() => {
                    void this.router.navigate(['/auth/login']);
                }, 1500);
            },
            error: (error) => this.notify.error(error.error?.non_field_errors?.[0] ?? 'Password reset failed.'),
        });
    }
    resendOtp() {
        this.auth.resendOtp({ email: this.email(), purpose: 'password_reset' }).subscribe({
            next: (response) => {
                this.notify.success(response.message);
                this.otpForm.patchValue({ otp_code: '' });
                this.startCountdownFrom(response.resend_available_at);
            },
            error: (error) => this.notify.error(this.getErrorMessage(error, 'Unable to resend OTP.')),
        });
    }
    stepTitle() {
        switch (this.step()) {
            case 1:
                return 'Recover your account';
            case 2:
                return 'Verify your OTP';
            default:
                return 'Create a new password';
        }
    }
    stepCopy() {
        switch (this.step()) {
            case 1:
                return 'Start with the email address attached to your account.';
            case 2:
                return 'Enter the 6-digit code from your inbox to continue.';
            default:
                return 'Use a strong password that meets the rules shown below the input.';
        }
    }
    showFieldError(control) {
        return control.invalid && (control.touched || control.dirty);
    }
    showConfirmError() {
        return !!this.resetForm.errors?.['fieldsMismatch'] && (this.resetForm.controls.confirm_password.touched || this.resetForm.controls.confirm_password.dirty);
    }
    hasRule(rule) {
        const value = this.resetForm.controls.new_password.value;
        if (!value) {
            return false;
        }
        switch (rule) {
            case 'length':
                return value.length >= 8;
            case 'upper':
                return /[A-Z]/.test(value);
            case 'lower':
                return /[a-z]/.test(value);
            case 'number':
                return /\d/.test(value);
            case 'special':
                return /[^A-Za-z\d]/.test(value);
        }
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
            const email = record['email'];
            if (Array.isArray(email) && typeof email[0] === 'string') {
                return email[0];
            }
        }
        return fallback;
    }
    static ɵfac = function ForgotPasswordComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ForgotPasswordComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ForgotPasswordComponent, selectors: [["ng-component"]], decls: 15, vars: 5, consts: [[1, "auth-shell", "theme-forgot"], [1, "auth-layout"], [1, "auth-card"], [1, "eyebrow"], ["class", "auth-form", 3, "formGroup", "ngSubmit", 4, "ngIf"], ["class", "auth-form two-actions", 3, "formGroup", "ngSubmit", 4, "ngIf"], [1, "links"], ["routerLink", "/auth/login"], [1, "auth-form", 3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "theme-field"], ["matInput", "", "formControlName", "email", "placeholder", "name@company.com"], ["class", "field-help error", 4, "ngIf"], ["mat-flat-button", "", "type", "submit", 1, "theme-primary-btn"], [1, "field-help", "error"], [1, "auth-form", "two-actions", 3, "ngSubmit", "formGroup"], [1, "otp-note"], [3, "control"], [1, "action-row"], ["mat-stroked-button", "", "type", "button", 1, "theme-secondary-btn", 3, "click", "disabled"], ["appearance", "outline", 1, "theme-field", "password-field"], ["matInput", "", "type", "password", "formControlName", "new_password", "placeholder", "Enter your new password"], ["class", "password-rules", 4, "ngIf"], ["matInput", "", "type", "password", "formControlName", "confirm_password", "placeholder", "Re-enter your password"], ["class", "success-text", 4, "ngIf"], [1, "password-rules"], [1, "success-text"]], template: function ForgotPasswordComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "section", 1)(2, "mat-card", 2)(3, "div", 3);
            i0.ɵɵtext(4, "Forgot Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h2");
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p");
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(9, ForgotPasswordComponent_form_9_Template, 8, 4, "form", 4)(10, ForgotPasswordComponent_form_10_Template, 9, 5, "form", 5)(11, ForgotPasswordComponent_form_11_Template, 14, 8, "form", 4);
            i0.ɵɵelementStart(12, "div", 6)(13, "a", 7);
            i0.ɵɵtext(14, "Back to login");
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(ctx.stepTitle());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.stepCopy());
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step() === 1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step() === 2);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.step() === 3);
        } }, dependencies: [CommonModule, i1.NgIf, ReactiveFormsModule, i2.ɵNgNoValidate, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.FormGroupDirective, i2.FormControlName, RouterLink,
            MatButtonModule, i3.MatButton, MatCardModule, i4.MatCard, MatFormFieldModule, i5.MatFormField, i5.MatLabel, MatInputModule, i6.MatInput, OtpInputComponent], styles: [".auth-shell[_ngcontent-%COMP%] {\n    min-height: 100vh;\n    display: grid;\n    place-items: center;\n    padding: 20px;\n    background:\n      radial-gradient(circle at top right, rgba(255, 255, 255, 0.75), transparent 28%),\n      linear-gradient(180deg, var(--auth-bg) 0%, color-mix(in srgb, var(--auth-bg) 78%, white) 100%);\n  }\n\n  .auth-layout[_ngcontent-%COMP%] {\n    width: min(100%, 450px);\n    display: grid;\n  }\n\n  .auth-card[_ngcontent-%COMP%] {\n    border-radius: 12px;\n    background: #ffffff;\n    border: 1px solid rgba(255, 255, 255, 0.72);\n    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);\n  }\n\n  .auth-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    margin: 14px 0 10px;\n    color: var(--auth-text);\n    line-height: 1.05;\n  }\n\n  .auth-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n   .field-help[_ngcontent-%COMP%], \n   .aux-text[_ngcontent-%COMP%] {\n    color: var(--auth-muted);\n    line-height: 1.55;\n  }\n\n  .auth-card[_ngcontent-%COMP%] {\n    padding: 32px;\n  }\n\n  .eyebrow[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    padding: 8px 12px;\n    border-radius: 999px;\n    background: color-mix(in srgb, var(--auth-accent) 12%, white);\n    color: var(--auth-text);\n    font-size: 12px;\n    font-weight: 700;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n  }\n\n  .auth-form[_ngcontent-%COMP%] {\n    display: grid;\n    gap: 14px;\n    margin-top: 24px;\n  }\n\n  .auth-form.two-actions[_ngcontent-%COMP%] {\n    gap: 12px;\n  }\n\n  .action-row[_ngcontent-%COMP%] {\n    display: flex;\n    gap: 12px;\n    flex-wrap: wrap;\n  }\n\n  .action-row[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n    flex: 1 1 180px;\n  }\n\n  .links[_ngcontent-%COMP%] {\n    display: flex;\n    justify-content: space-between;\n    gap: 12px;\n    flex-wrap: wrap;\n    margin-top: 20px;\n  }\n\n  .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n   .inline-link[_ngcontent-%COMP%] {\n    color: var(--auth-accent);\n    text-decoration: none;\n    font-weight: 700;\n  }\n\n  .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, \n   .inline-link[_ngcontent-%COMP%]:hover {\n    color: var(--auth-accent-hover);\n  }\n\n  .field-help[_ngcontent-%COMP%] {\n    font-size: 12px;\n    margin-top: -6px;\n  }\n\n  .field-help.error[_ngcontent-%COMP%] {\n    color: #dc2626;\n  }\n\n  .success-text[_ngcontent-%COMP%] {\n    color: #16a34a;\n    font-size: 14px;\n    font-weight: 700;\n    margin-top: 10px;\n  }\n\n  .otp-note[_ngcontent-%COMP%] {\n    padding: 14px 16px;\n    border-radius: 12px;\n    background: color-mix(in srgb, var(--auth-accent) 8%, white);\n    color: var(--auth-text);\n    font-size: 14px;\n  }\n\n  .password-rules[_ngcontent-%COMP%] {\n    display: grid;\n    gap: 6px;\n    margin-top: -2px;\n    padding: 12px 14px;\n    border-radius: 12px;\n    background: #fafafa;\n    border: 1px solid color-mix(in srgb, var(--auth-accent) 12%, white);\n  }\n\n  .password-rules[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    font-size: 12px;\n    color: var(--auth-muted);\n  }\n\n  .password-rules[_ngcontent-%COMP%]   span.invalid[_ngcontent-%COMP%] {\n    color: #dc2626;\n  }\n\n  .password-rules[_ngcontent-%COMP%]   span.valid[_ngcontent-%COMP%] {\n    color: #16a34a;\n  }\n\n  .theme-field[_ngcontent-%COMP%] {\n    --mdc-outlined-text-field-outline-color: var(--auth-border);\n    --mdc-outlined-text-field-focus-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-hover-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-label-text-color: var(--auth-muted);\n    --mdc-outlined-text-field-focus-label-text-color: var(--auth-accent);\n    --mat-form-field-focus-select-arrow-color: var(--auth-accent);\n  }\n\n  .theme-field.invalid-field[_ngcontent-%COMP%] {\n    --mdc-outlined-text-field-outline-color: #dc2626;\n    --mdc-outlined-text-field-hover-outline-color: #dc2626;\n    --mdc-outlined-text-field-focus-outline-color: #dc2626;\n    --mdc-outlined-text-field-label-text-color: #dc2626;\n    --mdc-outlined-text-field-focus-label-text-color: #dc2626;\n  }\n\n  .theme-primary-btn[_ngcontent-%COMP%] {\n    --mdc-filled-button-container-color: var(--auth-accent);\n    --mdc-filled-button-label-text-color: #ffffff;\n    min-height: 48px;\n    border-radius: 10px;\n  }\n\n  .theme-secondary-btn[_ngcontent-%COMP%] {\n    min-height: 48px;\n    border-radius: 10px;\n    color: var(--auth-accent);\n    border-color: color-mix(in srgb, var(--auth-accent) 34%, white);\n  }\n\n  .theme-primary-btn[_ngcontent-%COMP%]:hover {\n    --mdc-filled-button-container-color: var(--auth-accent-hover);\n  }\n\n  @media (max-width: 560px) {\n    .auth-shell[_ngcontent-%COMP%] {\n      padding: 14px;\n    }\n\n    .auth-card[_ngcontent-%COMP%] {\n      padding: 22px;\n    }\n\n    .links[_ngcontent-%COMP%] {\n      flex-direction: column;\n      align-items: flex-start;\n    }\n  }", ".theme-forgot[_ngcontent-%COMP%] {\n      --auth-bg: #F5F3FF;\n      --auth-accent: #7C3AED;\n      --auth-accent-hover: #6D28D9;\n      --auth-text: #2E1065;\n      --auth-muted: #6B7280;\n      --auth-border: #DDD6FE;\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ForgotPasswordComponent, [{
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
    <div class="auth-shell theme-forgot">
      <section class="auth-layout">
        <mat-card class="auth-card">
          <div class="eyebrow">Forgot Password</div>
          <h2>{{ stepTitle() }}</h2>
          <p>{{ stepCopy() }}</p>

          <form class="auth-form" [formGroup]="emailForm" *ngIf="step() === 1" (ngSubmit)="requestOtp()">
            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showFieldError(emailForm.controls.email)">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="name@company.com" />
            </mat-form-field>
            <div class="field-help error" *ngIf="showFieldError(emailForm.controls.email)">Enter a valid email address.</div>

            <button mat-flat-button type="submit" class="theme-primary-btn">Send OTP</button>
          </form>

          <form class="auth-form two-actions" [formGroup]="otpForm" *ngIf="step() === 2" (ngSubmit)="continueToPasswordStep()">
            <div class="otp-note">We sent a recovery code to {{ email() }}. Enter the 6-digit OTP to continue.</div>
            <app-otp-input [control]="otpForm.controls.otp_code"></app-otp-input>

            <div class="action-row">
              <button mat-flat-button type="submit" class="theme-primary-btn">Continue</button>
              <button mat-stroked-button type="button" class="theme-secondary-btn" [disabled]="countdown() > 0" (click)="resendOtp()">
                {{ countdown() > 0 ? 'Resend in ' + countdown() + 's' : 'Resend OTP' }}
              </button>
            </div>
          </form>

          <form class="auth-form" [formGroup]="resetForm" *ngIf="step() === 3" (ngSubmit)="resetPassword()">
            <mat-form-field appearance="outline" class="theme-field password-field" [class.invalid-field]="showFieldError(resetForm.controls.new_password)">
              <mat-label>New Password</mat-label>
              <input matInput type="password" formControlName="new_password" placeholder="Enter your new password" />
            </mat-form-field>

            <div class="password-rules" *ngIf="resetForm.controls.new_password.dirty || resetForm.controls.new_password.touched">
              <span [class.valid]="hasRule('length')" [class.invalid]="!hasRule('length')">At least 8 characters</span>
              <span [class.valid]="hasRule('upper')" [class.invalid]="!hasRule('upper')">At least 1 uppercase letter</span>
              <span [class.valid]="hasRule('lower')" [class.invalid]="!hasRule('lower')">At least 1 lowercase letter</span>
              <span [class.valid]="hasRule('number')" [class.invalid]="!hasRule('number')">At least 1 number</span>
              <span [class.valid]="hasRule('special')" [class.invalid]="!hasRule('special')">At least 1 special character</span>
            </div>

            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showConfirmError()">
              <mat-label>Confirm Password</mat-label>
              <input matInput type="password" formControlName="confirm_password" placeholder="Re-enter your password" />
            </mat-form-field>
            <div class="field-help error" *ngIf="showConfirmError()">Passwords must match.</div>

            <button mat-flat-button type="submit" class="theme-primary-btn">Reset Password</button>
            <div class="success-text" *ngIf="successMessage()">{{ successMessage() }}</div>
          </form>

          <div class="links">
            <a routerLink="/auth/login">Back to login</a>
          </div>
        </mat-card>
      </section>
    </div>
  `, styles: ["\n  .auth-shell {\n    min-height: 100vh;\n    display: grid;\n    place-items: center;\n    padding: 20px;\n    background:\n      radial-gradient(circle at top right, rgba(255, 255, 255, 0.75), transparent 28%),\n      linear-gradient(180deg, var(--auth-bg) 0%, color-mix(in srgb, var(--auth-bg) 78%, white) 100%);\n  }\n\n  .auth-layout {\n    width: min(100%, 450px);\n    display: grid;\n  }\n\n  .auth-card {\n    border-radius: 12px;\n    background: #ffffff;\n    border: 1px solid rgba(255, 255, 255, 0.72);\n    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);\n  }\n\n  .auth-card h2 {\n    margin: 14px 0 10px;\n    color: var(--auth-text);\n    line-height: 1.05;\n  }\n\n  .auth-card p,\n  .field-help,\n  .aux-text {\n    color: var(--auth-muted);\n    line-height: 1.55;\n  }\n\n  .auth-card {\n    padding: 32px;\n  }\n\n  .eyebrow {\n    display: inline-flex;\n    align-items: center;\n    padding: 8px 12px;\n    border-radius: 999px;\n    background: color-mix(in srgb, var(--auth-accent) 12%, white);\n    color: var(--auth-text);\n    font-size: 12px;\n    font-weight: 700;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n  }\n\n  .auth-form {\n    display: grid;\n    gap: 14px;\n    margin-top: 24px;\n  }\n\n  .auth-form.two-actions {\n    gap: 12px;\n  }\n\n  .action-row {\n    display: flex;\n    gap: 12px;\n    flex-wrap: wrap;\n  }\n\n  .action-row > * {\n    flex: 1 1 180px;\n  }\n\n  .links {\n    display: flex;\n    justify-content: space-between;\n    gap: 12px;\n    flex-wrap: wrap;\n    margin-top: 20px;\n  }\n\n  .links a,\n  .inline-link {\n    color: var(--auth-accent);\n    text-decoration: none;\n    font-weight: 700;\n  }\n\n  .links a:hover,\n  .inline-link:hover {\n    color: var(--auth-accent-hover);\n  }\n\n  .field-help {\n    font-size: 12px;\n    margin-top: -6px;\n  }\n\n  .field-help.error {\n    color: #dc2626;\n  }\n\n  .success-text {\n    color: #16a34a;\n    font-size: 14px;\n    font-weight: 700;\n    margin-top: 10px;\n  }\n\n  .otp-note {\n    padding: 14px 16px;\n    border-radius: 12px;\n    background: color-mix(in srgb, var(--auth-accent) 8%, white);\n    color: var(--auth-text);\n    font-size: 14px;\n  }\n\n  .password-rules {\n    display: grid;\n    gap: 6px;\n    margin-top: -2px;\n    padding: 12px 14px;\n    border-radius: 12px;\n    background: #fafafa;\n    border: 1px solid color-mix(in srgb, var(--auth-accent) 12%, white);\n  }\n\n  .password-rules span {\n    font-size: 12px;\n    color: var(--auth-muted);\n  }\n\n  .password-rules span.invalid {\n    color: #dc2626;\n  }\n\n  .password-rules span.valid {\n    color: #16a34a;\n  }\n\n  .theme-field {\n    --mdc-outlined-text-field-outline-color: var(--auth-border);\n    --mdc-outlined-text-field-focus-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-hover-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-label-text-color: var(--auth-muted);\n    --mdc-outlined-text-field-focus-label-text-color: var(--auth-accent);\n    --mat-form-field-focus-select-arrow-color: var(--auth-accent);\n  }\n\n  .theme-field.invalid-field {\n    --mdc-outlined-text-field-outline-color: #dc2626;\n    --mdc-outlined-text-field-hover-outline-color: #dc2626;\n    --mdc-outlined-text-field-focus-outline-color: #dc2626;\n    --mdc-outlined-text-field-label-text-color: #dc2626;\n    --mdc-outlined-text-field-focus-label-text-color: #dc2626;\n  }\n\n  .theme-primary-btn {\n    --mdc-filled-button-container-color: var(--auth-accent);\n    --mdc-filled-button-label-text-color: #ffffff;\n    min-height: 48px;\n    border-radius: 10px;\n  }\n\n  .theme-secondary-btn {\n    min-height: 48px;\n    border-radius: 10px;\n    color: var(--auth-accent);\n    border-color: color-mix(in srgb, var(--auth-accent) 34%, white);\n  }\n\n  .theme-primary-btn:hover {\n    --mdc-filled-button-container-color: var(--auth-accent-hover);\n  }\n\n  @media (max-width: 560px) {\n    .auth-shell {\n      padding: 14px;\n    }\n\n    .auth-card {\n      padding: 22px;\n    }\n\n    .links {\n      flex-direction: column;\n      align-items: flex-start;\n    }\n  }\n", "\n    .theme-forgot {\n      --auth-bg: #F5F3FF;\n      --auth-accent: #7C3AED;\n      --auth-accent-hover: #6D28D9;\n      --auth-text: #2E1065;\n      --auth-muted: #6B7280;\n      --auth-border: #DDD6FE;\n    }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ForgotPasswordComponent, { className: "ForgotPasswordComponent", filePath: "src/app/features/auth/forgot-password.component.ts", lineNumber: 100 }); })();
//# sourceMappingURL=forgot-password.component.js.map