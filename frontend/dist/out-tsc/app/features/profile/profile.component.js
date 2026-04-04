import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/card";
import * as i5 from "@angular/material/form-field";
import * as i6 from "@angular/material/icon";
import * as i7 from "@angular/material/input";
function ProfileComponent_section_0_div_65_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 21)(1, "button", 22);
    i0.ɵɵtext(2, "Save Changes");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 23);
    i0.ɵɵlistener("click", function ProfileComponent_section_0_div_65_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.cancelEdit()); });
    i0.ɵɵtext(4, "Cancel");
    i0.ɵɵelementEnd()();
} }
function ProfileComponent_section_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 1)(1, "header", 2)(2, "h1");
    i0.ɵɵtext(3, "Profile");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p");
    i0.ɵɵtext(5, "Manage your personal information");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "mat-card", 3)(7, "div", 4)(8, "div", 5)(9, "div", 6)(10, "div", 7);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 8)(13, "mat-icon");
    i0.ɵɵtext(14, "photo_camera");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(15, "div", 9)(16, "h2");
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "p");
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(20, "button", 10);
    i0.ɵɵlistener("click", function ProfileComponent_section_0_Template_button_click_20_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleEdit()); });
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "form", 11);
    i0.ɵɵlistener("ngSubmit", function ProfileComponent_section_0_Template_form_ngSubmit_22_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveProfile()); });
    i0.ɵɵelementStart(23, "label", 12)(24, "span", 13)(25, "mat-icon");
    i0.ɵɵtext(26, "person_outline");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(27, " Full Name ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "mat-form-field", 14);
    i0.ɵɵelement(29, "input", 15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(30, "label", 12)(31, "span", 13)(32, "mat-icon");
    i0.ɵɵtext(33, "mail_outline");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(34, " Email Address ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "mat-form-field", 14);
    i0.ɵɵelement(36, "input", 16);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "div", 12)(38, "span", 13)(39, "mat-icon");
    i0.ɵɵtext(40, "business_center");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(41, " Department ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "div", 17);
    i0.ɵɵtext(43);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(44, "div", 12)(45, "span", 13)(46, "mat-icon");
    i0.ɵɵtext(47, "verified_user");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(48, " Role ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "div", 17);
    i0.ɵɵtext(50);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(51, "div", 18)(52, "span", 13)(53, "mat-icon");
    i0.ɵɵtext(54, "support_agent");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(55, " Support Portal Access ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "div", 19);
    i0.ɵɵtext(57);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(58, "div", 18)(59, "span", 13)(60, "mat-icon");
    i0.ɵɵtext(61, "confirmation_number");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(62, " Ticket Summary ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "div", 19);
    i0.ɵɵtext(64);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(65, ProfileComponent_section_0_div_65_Template, 5, 0, "div", 20);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const currentUser_r4 = ctx.ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(11);
    i0.ɵɵtextInterpolate(ctx_r1.initials());
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(currentUser_r4.full_name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.roleLabel());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.editing ? "Cancel Edit" : "Edit Profile", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("readonly", !ctx_r1.editing);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("readonly", !ctx_r1.editing);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.departmentLabel());
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.roleLabel());
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.accessSummary());
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.ticketSummary());
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.editing);
} }
export class ProfileComponent {
    ticketService = inject(TicketService);
    auth = inject(AuthService);
    notify = inject(NotificationService);
    fb = inject(FormBuilder);
    user = this.auth.user;
    ticketCount = 0;
    editing = false;
    initials = computed(() => (this.user()?.full_name?.trim()?.charAt(0) ?? 'U').toUpperCase());
    roleLabel = computed(() => {
        const role = this.user()?.role ?? 'customer';
        return role === 'admin' ? 'Administrator' : role === 'agent' ? 'Support Agent' : 'Portal User';
    });
    departmentLabel = computed(() => {
        const role = this.user()?.role ?? 'customer';
        return role === 'customer' ? 'Customer Support' : 'Support Operations';
    });
    accessSummary = computed(() => {
        const role = this.user()?.role ?? 'customer';
        return role === 'customer'
            ? 'Create tickets, track updates, verify OTP login, and manage your account details in the Support Portal.'
            : 'Review incoming tickets, manage assignments, update ticket status, and monitor workspace activity in the Support Portal.';
    });
    ticketSummary = computed(() => {
        const role = this.user()?.role ?? 'customer';
        return role === 'customer'
            ? `${this.ticketCount} ticket${this.ticketCount === 1 ? '' : 's'} linked to your account.`
            : `${this.ticketCount} ticket${this.ticketCount === 1 ? '' : 's'} currently visible in your team workspace.`;
    });
    form = this.fb.nonNullable.group({
        full_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
    });
    constructor() {
        this.ticketService.list({ page: 1 }).subscribe((response) => {
            this.ticketCount = response.count;
        });
        this.patchForm();
    }
    toggleEdit() {
        this.editing = !this.editing;
        if (this.editing) {
            this.patchForm();
        }
    }
    cancelEdit() {
        this.patchForm();
        this.editing = false;
    }
    saveProfile() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.auth.updateProfile(this.form.getRawValue()).subscribe({
            next: () => {
                this.notify.success('Profile updated successfully.');
                this.editing = false;
            },
            error: (error) => {
                this.notify.error(error.error?.email?.[0] ?? 'Unable to update profile.');
            },
        });
    }
    patchForm() {
        const currentUser = this.user();
        if (!currentUser) {
            return;
        }
        this.form.patchValue({
            full_name: currentUser.full_name,
            email: currentUser.email,
        });
    }
    static ɵfac = function ProfileComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ProfileComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ProfileComponent, selectors: [["ng-component"]], decls: 1, vars: 1, consts: [["class", "profile-shell", 4, "ngIf"], [1, "profile-shell"], [1, "page-head"], [1, "profile-card"], [1, "profile-top"], [1, "identity-block"], [1, "avatar-wrap"], [1, "avatar"], ["type", "button", "aria-label", "Avatar placeholder", 1, "avatar-badge"], [1, "identity-copy"], ["mat-flat-button", "", "color", "primary", "type", "button", 1, "edit-trigger", 3, "click"], [1, "profile-grid", 3, "ngSubmit", "formGroup"], [1, "field-card"], [1, "field-label"], ["appearance", "outline"], ["matInput", "", "formControlName", "full_name", 3, "readonly"], ["matInput", "", "formControlName", "email", 3, "readonly"], [1, "field-value"], [1, "field-card", "wide-card"], [1, "field-value", "multi-line"], ["class", "form-actions", 4, "ngIf"], [1, "form-actions"], ["mat-flat-button", "", "color", "primary", "type", "submit"], ["mat-stroked-button", "", "type", "button", 3, "click"]], template: function ProfileComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, ProfileComponent_section_0_Template, 66, 12, "section", 0);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.user());
        } }, dependencies: [CommonModule, i1.NgIf, ReactiveFormsModule, i2.ɵNgNoValidate, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.FormGroupDirective, i2.FormControlName, MatButtonModule, i3.MatButton, MatCardModule, i4.MatCard, MatFormFieldModule, i5.MatFormField, MatIconModule, i6.MatIcon, MatInputModule, i7.MatInput], styles: [".profile-shell[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 22px;\n    }\n    .page-head[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n      margin: 0;\n      font-size: 2.2rem;\n      color: #17366e;\n      letter-spacing: -0.04em;\n    }\n    .page-head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n      margin: 8px 0 0;\n      color: #60708c;\n      font-size: 1.04rem;\n    }\n    .profile-card[_ngcontent-%COMP%] {\n      padding: 28px;\n      border-radius: 26px;\n      border: 1px solid #d7e3f4;\n      background: #ffffff;\n      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.05);\n    }\n    .profile-top[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 20px;\n      margin-bottom: 28px;\n    }\n    .identity-block[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 18px;\n    }\n    .avatar-wrap[_ngcontent-%COMP%] {\n      position: relative;\n    }\n    .avatar[_ngcontent-%COMP%] {\n      width: 92px;\n      height: 92px;\n      border-radius: 50%;\n      display: grid;\n      place-items: center;\n      background: linear-gradient(180deg, #4f7df4, #4453ea);\n      color: #ffffff;\n      font-size: 2.2rem;\n      font-weight: 800;\n      letter-spacing: -0.06em;\n    }\n    .avatar-badge[_ngcontent-%COMP%] {\n      position: absolute;\n      right: -2px;\n      bottom: -2px;\n      width: 38px;\n      height: 38px;\n      border-radius: 50%;\n      border: 1px solid #d7e3f4;\n      background: #ffffff;\n      display: grid;\n      place-items: center;\n      color: #5b6b84;\n    }\n    .identity-copy[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n      margin: 0 0 6px;\n      font-size: 2rem;\n      color: #17366e;\n      letter-spacing: -0.04em;\n    }\n    .identity-copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n      margin: 0;\n      color: #60708c;\n      font-size: 1.08rem;\n    }\n    .edit-trigger[_ngcontent-%COMP%] {\n      min-width: 136px;\n      height: 46px;\n      border-radius: 14px;\n      padding-inline: 18px;\n    }\n    .profile-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(2, minmax(0, 1fr));\n      gap: 18px;\n    }\n    .field-card[_ngcontent-%COMP%] {\n      min-width: 0;\n    }\n    .field-label[_ngcontent-%COMP%] {\n      display: inline-flex;\n      align-items: center;\n      gap: 10px;\n      margin-bottom: 12px;\n      color: #314968;\n      font-weight: 700;\n      font-size: 1rem;\n    }\n    .field-label[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      color: #5a6b84;\n      font-size: 1.25rem;\n      width: 1.25rem;\n      height: 1.25rem;\n    }\n    .field-card[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n    .field-value[_ngcontent-%COMP%] {\n      min-height: 58px;\n      display: flex;\n      align-items: center;\n      padding: 0 20px;\n      border-radius: 18px;\n      border: 1px solid #dfe7f3;\n      background: #f8fbff;\n      color: #53637e;\n      font-size: 1rem;\n    }\n    .multi-line[_ngcontent-%COMP%] {\n      min-height: 76px;\n      line-height: 1.55;\n      padding-top: 14px;\n      padding-bottom: 14px;\n    }\n    .wide-card[_ngcontent-%COMP%] {\n      grid-column: 1 / -1;\n    }\n    .form-actions[_ngcontent-%COMP%] {\n      grid-column: 1 / -1;\n      display: flex;\n      justify-content: flex-end;\n      gap: 12px;\n      margin-top: 4px;\n    }\n    [_nghost-%COMP%]     .profile-card .mat-mdc-form-field-subscript-wrapper {\n      display: none;\n    }\n    [_nghost-%COMP%]     .profile-card .mdc-notched-outline__leading, \n   [_nghost-%COMP%]     .profile-card .mdc-notched-outline__notch, \n   [_nghost-%COMP%]     .profile-card .mdc-notched-outline__trailing {\n      border-color: #dfe7f3;\n    }\n    [_nghost-%COMP%]     .profile-card .mdc-text-field--outlined {\n      border-radius: 18px;\n      background: #f8fbff;\n    }\n    [_nghost-%COMP%]     .profile-card .mat-mdc-input-element[readonly] {\n      color: #53637e;\n      cursor: default;\n    }\n    @media (max-width: 960px) {\n      .profile-top[_ngcontent-%COMP%] {\n        flex-direction: column;\n        align-items: stretch;\n      }\n      .profile-grid[_ngcontent-%COMP%] {\n        grid-template-columns: 1fr;\n      }\n      .identity-block[_ngcontent-%COMP%] {\n        align-items: flex-start;\n      }\n      .form-actions[_ngcontent-%COMP%] {\n        justify-content: stretch;\n        flex-wrap: wrap;\n      }\n    }\n    @media (max-width: 680px) {\n      .profile-card[_ngcontent-%COMP%] {\n        padding: 22px 18px;\n        border-radius: 22px;\n      }\n      .identity-block[_ngcontent-%COMP%] {\n        flex-direction: column;\n      }\n      .identity-copy[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n        font-size: 1.65rem;\n      }\n      .avatar[_ngcontent-%COMP%] {\n        width: 82px;\n        height: 82px;\n        font-size: 2rem;\n      }\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ProfileComponent, [{
        type: Component,
        args: [{ standalone: true, imports: [
                    CommonModule,
                    ReactiveFormsModule,
                    MatButtonModule,
                    MatCardModule,
                    MatFormFieldModule,
                    MatIconModule,
                    MatInputModule,
                ], template: `
    <section class="profile-shell" *ngIf="user() as currentUser">
      <header class="page-head">
        <h1>Profile</h1>
        <p>Manage your personal information</p>
      </header>

      <mat-card class="profile-card">
        <div class="profile-top">
          <div class="identity-block">
            <div class="avatar-wrap">
              <div class="avatar">{{ initials() }}</div>
              <button class="avatar-badge" type="button" aria-label="Avatar placeholder">
                <mat-icon>photo_camera</mat-icon>
              </button>
            </div>

            <div class="identity-copy">
              <h2>{{ currentUser.full_name }}</h2>
              <p>{{ roleLabel() }}</p>
            </div>
          </div>

          <button mat-flat-button color="primary" type="button" class="edit-trigger" (click)="toggleEdit()">
            {{ editing ? 'Cancel Edit' : 'Edit Profile' }}
          </button>
        </div>

        <form class="profile-grid" [formGroup]="form" (ngSubmit)="saveProfile()">
          <label class="field-card">
            <span class="field-label">
              <mat-icon>person_outline</mat-icon>
              Full Name
            </span>
            <mat-form-field appearance="outline">
              <input matInput formControlName="full_name" [readonly]="!editing" />
            </mat-form-field>
          </label>

          <label class="field-card">
            <span class="field-label">
              <mat-icon>mail_outline</mat-icon>
              Email Address
            </span>
            <mat-form-field appearance="outline">
              <input matInput formControlName="email" [readonly]="!editing" />
            </mat-form-field>
          </label>

          <div class="field-card">
            <span class="field-label">
              <mat-icon>business_center</mat-icon>
              Department
            </span>
            <div class="field-value">{{ departmentLabel() }}</div>
          </div>

          <div class="field-card">
            <span class="field-label">
              <mat-icon>verified_user</mat-icon>
              Role
            </span>
            <div class="field-value">{{ roleLabel() }}</div>
          </div>

          <div class="field-card wide-card">
            <span class="field-label">
              <mat-icon>support_agent</mat-icon>
              Support Portal Access
            </span>
            <div class="field-value multi-line">{{ accessSummary() }}</div>
          </div>

          <div class="field-card wide-card">
            <span class="field-label">
              <mat-icon>confirmation_number</mat-icon>
              Ticket Summary
            </span>
            <div class="field-value multi-line">{{ ticketSummary() }}</div>
          </div>

          <div class="form-actions" *ngIf="editing">
            <button mat-flat-button color="primary" type="submit">Save Changes</button>
            <button mat-stroked-button type="button" (click)="cancelEdit()">Cancel</button>
          </div>
        </form>
      </mat-card>
    </section>
  `, styles: ["\n    .profile-shell {\n      display: grid;\n      gap: 22px;\n    }\n    .page-head h1 {\n      margin: 0;\n      font-size: 2.2rem;\n      color: #17366e;\n      letter-spacing: -0.04em;\n    }\n    .page-head p {\n      margin: 8px 0 0;\n      color: #60708c;\n      font-size: 1.04rem;\n    }\n    .profile-card {\n      padding: 28px;\n      border-radius: 26px;\n      border: 1px solid #d7e3f4;\n      background: #ffffff;\n      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.05);\n    }\n    .profile-top {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 20px;\n      margin-bottom: 28px;\n    }\n    .identity-block {\n      display: flex;\n      align-items: center;\n      gap: 18px;\n    }\n    .avatar-wrap {\n      position: relative;\n    }\n    .avatar {\n      width: 92px;\n      height: 92px;\n      border-radius: 50%;\n      display: grid;\n      place-items: center;\n      background: linear-gradient(180deg, #4f7df4, #4453ea);\n      color: #ffffff;\n      font-size: 2.2rem;\n      font-weight: 800;\n      letter-spacing: -0.06em;\n    }\n    .avatar-badge {\n      position: absolute;\n      right: -2px;\n      bottom: -2px;\n      width: 38px;\n      height: 38px;\n      border-radius: 50%;\n      border: 1px solid #d7e3f4;\n      background: #ffffff;\n      display: grid;\n      place-items: center;\n      color: #5b6b84;\n    }\n    .identity-copy h2 {\n      margin: 0 0 6px;\n      font-size: 2rem;\n      color: #17366e;\n      letter-spacing: -0.04em;\n    }\n    .identity-copy p {\n      margin: 0;\n      color: #60708c;\n      font-size: 1.08rem;\n    }\n    .edit-trigger {\n      min-width: 136px;\n      height: 46px;\n      border-radius: 14px;\n      padding-inline: 18px;\n    }\n    .profile-grid {\n      display: grid;\n      grid-template-columns: repeat(2, minmax(0, 1fr));\n      gap: 18px;\n    }\n    .field-card {\n      min-width: 0;\n    }\n    .field-label {\n      display: inline-flex;\n      align-items: center;\n      gap: 10px;\n      margin-bottom: 12px;\n      color: #314968;\n      font-weight: 700;\n      font-size: 1rem;\n    }\n    .field-label mat-icon {\n      color: #5a6b84;\n      font-size: 1.25rem;\n      width: 1.25rem;\n      height: 1.25rem;\n    }\n    .field-card mat-form-field {\n      width: 100%;\n    }\n    .field-value {\n      min-height: 58px;\n      display: flex;\n      align-items: center;\n      padding: 0 20px;\n      border-radius: 18px;\n      border: 1px solid #dfe7f3;\n      background: #f8fbff;\n      color: #53637e;\n      font-size: 1rem;\n    }\n    .multi-line {\n      min-height: 76px;\n      line-height: 1.55;\n      padding-top: 14px;\n      padding-bottom: 14px;\n    }\n    .wide-card {\n      grid-column: 1 / -1;\n    }\n    .form-actions {\n      grid-column: 1 / -1;\n      display: flex;\n      justify-content: flex-end;\n      gap: 12px;\n      margin-top: 4px;\n    }\n    :host ::ng-deep .profile-card .mat-mdc-form-field-subscript-wrapper {\n      display: none;\n    }\n    :host ::ng-deep .profile-card .mdc-notched-outline__leading,\n    :host ::ng-deep .profile-card .mdc-notched-outline__notch,\n    :host ::ng-deep .profile-card .mdc-notched-outline__trailing {\n      border-color: #dfe7f3;\n    }\n    :host ::ng-deep .profile-card .mdc-text-field--outlined {\n      border-radius: 18px;\n      background: #f8fbff;\n    }\n    :host ::ng-deep .profile-card .mat-mdc-input-element[readonly] {\n      color: #53637e;\n      cursor: default;\n    }\n    @media (max-width: 960px) {\n      .profile-top {\n        flex-direction: column;\n        align-items: stretch;\n      }\n      .profile-grid {\n        grid-template-columns: 1fr;\n      }\n      .identity-block {\n        align-items: flex-start;\n      }\n      .form-actions {\n        justify-content: stretch;\n        flex-wrap: wrap;\n      }\n    }\n    @media (max-width: 680px) {\n      .profile-card {\n        padding: 22px 18px;\n        border-radius: 22px;\n      }\n      .identity-block {\n        flex-direction: column;\n      }\n      .identity-copy h2 {\n        font-size: 1.65rem;\n      }\n      .avatar {\n        width: 82px;\n        height: 82px;\n        font-size: 2rem;\n      }\n    }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ProfileComponent, { className: "ProfileComponent", filePath: "src/app/features/profile/profile.component.ts", lineNumber: 298 }); })();
//# sourceMappingURL=profile.component.js.map