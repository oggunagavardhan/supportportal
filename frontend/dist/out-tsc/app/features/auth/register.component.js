import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { AUTH_PAGE_STYLES } from './auth.shared-styles';
import { PASSWORD_RULES, matchingFieldsValidator, strongPasswordValidator } from './auth.validators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/card";
import * as i5 from "@angular/material/form-field";
import * as i6 from "@angular/material/input";
function RegisterComponent_div_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵtext(1, "Full name is required.");
    i0.ɵɵelementEnd();
} }
function RegisterComponent_div_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵtext(1, "Enter a valid email address.");
    i0.ɵɵelementEnd();
} }
function RegisterComponent_div_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 16)(1, "span");
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
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵclassProp("valid", ctx_r0.hasRule("length"))("invalid", !ctx_r0.hasRule("length"));
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("valid", ctx_r0.hasRule("upper"))("invalid", !ctx_r0.hasRule("upper"));
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("valid", ctx_r0.hasRule("lower"))("invalid", !ctx_r0.hasRule("lower"));
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("valid", ctx_r0.hasRule("number"))("invalid", !ctx_r0.hasRule("number"));
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("valid", ctx_r0.hasRule("special"))("invalid", !ctx_r0.hasRule("special"));
} }
function RegisterComponent_div_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵtext(1, "Passwords must match.");
    i0.ɵɵelementEnd();
} }
export class RegisterComponent {
    fb = inject(FormBuilder);
    auth = inject(AuthService);
    notify = inject(NotificationService);
    router = inject(Router);
    passwordRules = PASSWORD_RULES;
    form = this.fb.nonNullable.group({
        full_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, strongPasswordValidator()]],
        confirm_password: ['', Validators.required],
    }, { validators: matchingFieldsValidator('password', 'confirm_password') });
    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const { confirm_password: _confirmPassword, ...payload } = this.form.getRawValue();
        this.auth.register(payload).subscribe({
            next: () => {
                this.notify.success('Registration complete. Sign in to continue.');
                void this.router.navigate(['/auth/login']);
            },
            error: () => this.notify.error('Registration failed. Check the form and try again.'),
        });
    }
    showFieldError(control) {
        return control.invalid && (control.touched || control.dirty);
    }
    showConfirmError() {
        return !!this.form.errors?.['fieldsMismatch'] && (this.form.controls.confirm_password.touched || this.form.controls.confirm_password.dirty);
    }
    hasRule(rule) {
        const value = this.form.controls.password.value;
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
    static ɵfac = function RegisterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RegisterComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RegisterComponent, selectors: [["ng-component"]], decls: 35, vars: 13, consts: [[1, "auth-shell", "theme-register"], [1, "auth-layout"], [1, "auth-card"], [1, "eyebrow"], [1, "auth-form", 3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "theme-field"], ["matInput", "", "formControlName", "full_name", "placeholder", "Vardhan Oggu"], ["class", "field-help error", 4, "ngIf"], ["matInput", "", "formControlName", "email", "placeholder", "name@company.com"], ["matInput", "", "type", "password", "formControlName", "password", "placeholder", "Create a strong password"], ["class", "password-rules", 4, "ngIf"], ["matInput", "", "type", "password", "formControlName", "confirm_password", "placeholder", "Re-enter your password"], ["mat-flat-button", "", "type", "submit", 1, "theme-primary-btn"], [1, "links"], ["routerLink", "/auth/login"], [1, "field-help", "error"], [1, "password-rules"]], template: function RegisterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "section", 1)(2, "mat-card", 2)(3, "div", 3);
            i0.ɵɵtext(4, "Register");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h2");
            i0.ɵɵtext(6, "Create your account");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p");
            i0.ɵɵtext(8, "Use your full name, work email, and a strong password to get started.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "form", 4);
            i0.ɵɵlistener("ngSubmit", function RegisterComponent_Template_form_ngSubmit_9_listener() { return ctx.submit(); });
            i0.ɵɵelementStart(10, "mat-form-field", 5)(11, "mat-label");
            i0.ɵɵtext(12, "Full Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(13, "input", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(14, RegisterComponent_div_14_Template, 2, 0, "div", 7);
            i0.ɵɵelementStart(15, "mat-form-field", 5)(16, "mat-label");
            i0.ɵɵtext(17, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(18, "input", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(19, RegisterComponent_div_19_Template, 2, 0, "div", 7);
            i0.ɵɵelementStart(20, "mat-form-field", 5)(21, "mat-label");
            i0.ɵɵtext(22, "Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(23, "input", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(24, RegisterComponent_div_24_Template, 11, 20, "div", 10);
            i0.ɵɵelementStart(25, "mat-form-field", 5)(26, "mat-label");
            i0.ɵɵtext(27, "Confirm Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(28, "input", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(29, RegisterComponent_div_29_Template, 2, 0, "div", 7);
            i0.ɵɵelementStart(30, "button", 12);
            i0.ɵɵtext(31, "Create Account");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(32, "div", 13)(33, "a", 14);
            i0.ɵɵtext(34, "Back to login");
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("invalid-field", ctx.showFieldError(ctx.form.controls.full_name));
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", ctx.showFieldError(ctx.form.controls.full_name));
            i0.ɵɵadvance();
            i0.ɵɵclassProp("invalid-field", ctx.showFieldError(ctx.form.controls.email));
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", ctx.showFieldError(ctx.form.controls.email));
            i0.ɵɵadvance();
            i0.ɵɵclassProp("invalid-field", ctx.showFieldError(ctx.form.controls.password));
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", ctx.form.controls.password.dirty || ctx.form.controls.password.touched);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("invalid-field", ctx.showConfirmError());
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", ctx.showConfirmError());
        } }, dependencies: [CommonModule, i1.NgIf, ReactiveFormsModule, i2.ɵNgNoValidate, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.FormGroupDirective, i2.FormControlName, RouterLink,
            MatButtonModule, i3.MatButton, MatCardModule, i4.MatCard, MatFormFieldModule, i5.MatFormField, i5.MatLabel, MatInputModule, i6.MatInput], styles: [".auth-shell[_ngcontent-%COMP%] {\n    min-height: 100vh;\n    display: grid;\n    place-items: center;\n    padding: 20px;\n    background:\n      radial-gradient(circle at top right, rgba(255, 255, 255, 0.75), transparent 28%),\n      linear-gradient(180deg, var(--auth-bg) 0%, color-mix(in srgb, var(--auth-bg) 78%, white) 100%);\n  }\n\n  .auth-layout[_ngcontent-%COMP%] {\n    width: min(100%, 450px);\n    display: grid;\n  }\n\n  .auth-card[_ngcontent-%COMP%] {\n    border-radius: 12px;\n    background: #ffffff;\n    border: 1px solid rgba(255, 255, 255, 0.72);\n    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);\n  }\n\n  .auth-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    margin: 14px 0 10px;\n    color: var(--auth-text);\n    line-height: 1.05;\n  }\n\n  .auth-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n   .field-help[_ngcontent-%COMP%], \n   .aux-text[_ngcontent-%COMP%] {\n    color: var(--auth-muted);\n    line-height: 1.55;\n  }\n\n  .auth-card[_ngcontent-%COMP%] {\n    padding: 32px;\n  }\n\n  .eyebrow[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    padding: 8px 12px;\n    border-radius: 999px;\n    background: color-mix(in srgb, var(--auth-accent) 12%, white);\n    color: var(--auth-text);\n    font-size: 12px;\n    font-weight: 700;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n  }\n\n  .auth-form[_ngcontent-%COMP%] {\n    display: grid;\n    gap: 14px;\n    margin-top: 24px;\n  }\n\n  .auth-form.two-actions[_ngcontent-%COMP%] {\n    gap: 12px;\n  }\n\n  .action-row[_ngcontent-%COMP%] {\n    display: flex;\n    gap: 12px;\n    flex-wrap: wrap;\n  }\n\n  .action-row[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n    flex: 1 1 180px;\n  }\n\n  .links[_ngcontent-%COMP%] {\n    display: flex;\n    justify-content: space-between;\n    gap: 12px;\n    flex-wrap: wrap;\n    margin-top: 20px;\n  }\n\n  .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n   .inline-link[_ngcontent-%COMP%] {\n    color: var(--auth-accent);\n    text-decoration: none;\n    font-weight: 700;\n  }\n\n  .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, \n   .inline-link[_ngcontent-%COMP%]:hover {\n    color: var(--auth-accent-hover);\n  }\n\n  .field-help[_ngcontent-%COMP%] {\n    font-size: 12px;\n    margin-top: -6px;\n  }\n\n  .field-help.error[_ngcontent-%COMP%] {\n    color: #dc2626;\n  }\n\n  .success-text[_ngcontent-%COMP%] {\n    color: #16a34a;\n    font-size: 14px;\n    font-weight: 700;\n    margin-top: 10px;\n  }\n\n  .otp-note[_ngcontent-%COMP%] {\n    padding: 14px 16px;\n    border-radius: 12px;\n    background: color-mix(in srgb, var(--auth-accent) 8%, white);\n    color: var(--auth-text);\n    font-size: 14px;\n  }\n\n  .password-rules[_ngcontent-%COMP%] {\n    display: grid;\n    gap: 6px;\n    margin-top: -2px;\n    padding: 12px 14px;\n    border-radius: 12px;\n    background: #fafafa;\n    border: 1px solid color-mix(in srgb, var(--auth-accent) 12%, white);\n  }\n\n  .password-rules[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    font-size: 12px;\n    color: var(--auth-muted);\n  }\n\n  .password-rules[_ngcontent-%COMP%]   span.invalid[_ngcontent-%COMP%] {\n    color: #dc2626;\n  }\n\n  .password-rules[_ngcontent-%COMP%]   span.valid[_ngcontent-%COMP%] {\n    color: #16a34a;\n  }\n\n  .theme-field[_ngcontent-%COMP%] {\n    --mdc-outlined-text-field-outline-color: var(--auth-border);\n    --mdc-outlined-text-field-focus-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-hover-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-label-text-color: var(--auth-muted);\n    --mdc-outlined-text-field-focus-label-text-color: var(--auth-accent);\n    --mat-form-field-focus-select-arrow-color: var(--auth-accent);\n  }\n\n  .theme-field.invalid-field[_ngcontent-%COMP%] {\n    --mdc-outlined-text-field-outline-color: #dc2626;\n    --mdc-outlined-text-field-hover-outline-color: #dc2626;\n    --mdc-outlined-text-field-focus-outline-color: #dc2626;\n    --mdc-outlined-text-field-label-text-color: #dc2626;\n    --mdc-outlined-text-field-focus-label-text-color: #dc2626;\n  }\n\n  .theme-primary-btn[_ngcontent-%COMP%] {\n    --mdc-filled-button-container-color: var(--auth-accent);\n    --mdc-filled-button-label-text-color: #ffffff;\n    min-height: 48px;\n    border-radius: 10px;\n  }\n\n  .theme-secondary-btn[_ngcontent-%COMP%] {\n    min-height: 48px;\n    border-radius: 10px;\n    color: var(--auth-accent);\n    border-color: color-mix(in srgb, var(--auth-accent) 34%, white);\n  }\n\n  .theme-primary-btn[_ngcontent-%COMP%]:hover {\n    --mdc-filled-button-container-color: var(--auth-accent-hover);\n  }\n\n  @media (max-width: 560px) {\n    .auth-shell[_ngcontent-%COMP%] {\n      padding: 14px;\n    }\n\n    .auth-card[_ngcontent-%COMP%] {\n      padding: 22px;\n    }\n\n    .links[_ngcontent-%COMP%] {\n      flex-direction: column;\n      align-items: flex-start;\n    }\n  }", ".theme-register[_ngcontent-%COMP%] {\n      --auth-bg: #F0FDF4;\n      --auth-accent: #16A34A;\n      --auth-accent-hover: #15803D;\n      --auth-text: #14532D;\n      --auth-muted: #6B7280;\n      --auth-border: #BBF7D0;\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RegisterComponent, [{
        type: Component,
        args: [{ standalone: true, imports: [
                    CommonModule,
                    ReactiveFormsModule,
                    RouterLink,
                    MatButtonModule,
                    MatCardModule,
                    MatFormFieldModule,
                    MatInputModule,
                ], template: `
    <div class="auth-shell theme-register">
      <section class="auth-layout">
        <mat-card class="auth-card">
          <div class="eyebrow">Register</div>
          <h2>Create your account</h2>
          <p>Use your full name, work email, and a strong password to get started.</p>

          <form class="auth-form" [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showFieldError(form.controls.full_name)">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="full_name" placeholder="Vardhan Oggu" />
            </mat-form-field>
            <div class="field-help error" *ngIf="showFieldError(form.controls.full_name)">Full name is required.</div>

            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showFieldError(form.controls.email)">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="name@company.com" />
            </mat-form-field>
            <div class="field-help error" *ngIf="showFieldError(form.controls.email)">Enter a valid email address.</div>

            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showFieldError(form.controls.password)">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Create a strong password" />
            </mat-form-field>
            <div class="password-rules" *ngIf="form.controls.password.dirty || form.controls.password.touched">
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

            <button mat-flat-button type="submit" class="theme-primary-btn">Create Account</button>
          </form>

          <div class="links">
            <a routerLink="/auth/login">Back to login</a>
          </div>
        </mat-card>
      </section>
    </div>
  `, styles: ["\n  .auth-shell {\n    min-height: 100vh;\n    display: grid;\n    place-items: center;\n    padding: 20px;\n    background:\n      radial-gradient(circle at top right, rgba(255, 255, 255, 0.75), transparent 28%),\n      linear-gradient(180deg, var(--auth-bg) 0%, color-mix(in srgb, var(--auth-bg) 78%, white) 100%);\n  }\n\n  .auth-layout {\n    width: min(100%, 450px);\n    display: grid;\n  }\n\n  .auth-card {\n    border-radius: 12px;\n    background: #ffffff;\n    border: 1px solid rgba(255, 255, 255, 0.72);\n    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);\n  }\n\n  .auth-card h2 {\n    margin: 14px 0 10px;\n    color: var(--auth-text);\n    line-height: 1.05;\n  }\n\n  .auth-card p,\n  .field-help,\n  .aux-text {\n    color: var(--auth-muted);\n    line-height: 1.55;\n  }\n\n  .auth-card {\n    padding: 32px;\n  }\n\n  .eyebrow {\n    display: inline-flex;\n    align-items: center;\n    padding: 8px 12px;\n    border-radius: 999px;\n    background: color-mix(in srgb, var(--auth-accent) 12%, white);\n    color: var(--auth-text);\n    font-size: 12px;\n    font-weight: 700;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n  }\n\n  .auth-form {\n    display: grid;\n    gap: 14px;\n    margin-top: 24px;\n  }\n\n  .auth-form.two-actions {\n    gap: 12px;\n  }\n\n  .action-row {\n    display: flex;\n    gap: 12px;\n    flex-wrap: wrap;\n  }\n\n  .action-row > * {\n    flex: 1 1 180px;\n  }\n\n  .links {\n    display: flex;\n    justify-content: space-between;\n    gap: 12px;\n    flex-wrap: wrap;\n    margin-top: 20px;\n  }\n\n  .links a,\n  .inline-link {\n    color: var(--auth-accent);\n    text-decoration: none;\n    font-weight: 700;\n  }\n\n  .links a:hover,\n  .inline-link:hover {\n    color: var(--auth-accent-hover);\n  }\n\n  .field-help {\n    font-size: 12px;\n    margin-top: -6px;\n  }\n\n  .field-help.error {\n    color: #dc2626;\n  }\n\n  .success-text {\n    color: #16a34a;\n    font-size: 14px;\n    font-weight: 700;\n    margin-top: 10px;\n  }\n\n  .otp-note {\n    padding: 14px 16px;\n    border-radius: 12px;\n    background: color-mix(in srgb, var(--auth-accent) 8%, white);\n    color: var(--auth-text);\n    font-size: 14px;\n  }\n\n  .password-rules {\n    display: grid;\n    gap: 6px;\n    margin-top: -2px;\n    padding: 12px 14px;\n    border-radius: 12px;\n    background: #fafafa;\n    border: 1px solid color-mix(in srgb, var(--auth-accent) 12%, white);\n  }\n\n  .password-rules span {\n    font-size: 12px;\n    color: var(--auth-muted);\n  }\n\n  .password-rules span.invalid {\n    color: #dc2626;\n  }\n\n  .password-rules span.valid {\n    color: #16a34a;\n  }\n\n  .theme-field {\n    --mdc-outlined-text-field-outline-color: var(--auth-border);\n    --mdc-outlined-text-field-focus-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-hover-outline-color: var(--auth-accent);\n    --mdc-outlined-text-field-label-text-color: var(--auth-muted);\n    --mdc-outlined-text-field-focus-label-text-color: var(--auth-accent);\n    --mat-form-field-focus-select-arrow-color: var(--auth-accent);\n  }\n\n  .theme-field.invalid-field {\n    --mdc-outlined-text-field-outline-color: #dc2626;\n    --mdc-outlined-text-field-hover-outline-color: #dc2626;\n    --mdc-outlined-text-field-focus-outline-color: #dc2626;\n    --mdc-outlined-text-field-label-text-color: #dc2626;\n    --mdc-outlined-text-field-focus-label-text-color: #dc2626;\n  }\n\n  .theme-primary-btn {\n    --mdc-filled-button-container-color: var(--auth-accent);\n    --mdc-filled-button-label-text-color: #ffffff;\n    min-height: 48px;\n    border-radius: 10px;\n  }\n\n  .theme-secondary-btn {\n    min-height: 48px;\n    border-radius: 10px;\n    color: var(--auth-accent);\n    border-color: color-mix(in srgb, var(--auth-accent) 34%, white);\n  }\n\n  .theme-primary-btn:hover {\n    --mdc-filled-button-container-color: var(--auth-accent-hover);\n  }\n\n  @media (max-width: 560px) {\n    .auth-shell {\n      padding: 14px;\n    }\n\n    .auth-card {\n      padding: 22px;\n    }\n\n    .links {\n      flex-direction: column;\n      align-items: flex-start;\n    }\n  }\n", "\n    .theme-register {\n      --auth-bg: #F0FDF4;\n      --auth-accent: #16A34A;\n      --auth-accent-hover: #15803D;\n      --auth-text: #14532D;\n      --auth-muted: #6B7280;\n      --auth-border: #BBF7D0;\n    }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RegisterComponent, { className: "RegisterComponent", filePath: "src/app/features/auth/register.component.ts", lineNumber: 86 }); })();
//# sourceMappingURL=register.component.js.map