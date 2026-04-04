import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/card";
import * as i5 from "@angular/material/checkbox";
import * as i6 from "@angular/material/form-field";
import * as i7 from "@angular/material/input";
import * as i8 from "@angular/material/select";
function TicketDetailComponent_section_0_mat_form_field_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-form-field", 9)(1, "mat-label");
    i0.ɵɵtext(2, "Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "mat-select", 28)(4, "mat-option", 29);
    i0.ɵɵtext(5, "Open");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "mat-option", 30);
    i0.ɵɵtext(7, "In Progress");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "mat-option", 31);
    i0.ɵɵtext(9, "Closed");
    i0.ɵɵelementEnd()()();
} }
function TicketDetailComponent_section_0_mat_form_field_52_mat_option_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const staff_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", staff_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", staff_r3.full_name, " ");
} }
function TicketDetailComponent_section_0_mat_form_field_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-form-field", 9)(1, "mat-label");
    i0.ɵɵtext(2, "Assign to");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "mat-select", 32)(4, "mat-option", 33);
    i0.ɵɵtext(5, "Unassigned");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, TicketDetailComponent_section_0_mat_form_field_52_mat_option_6_Template, 2, 2, "mat-option", 34);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", null);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r1.staffUsers);
} }
function TicketDetailComponent_section_0_div_64_span_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 5);
    i0.ɵɵtext(1, "Internal note");
    i0.ɵɵelementEnd();
} }
function TicketDetailComponent_section_0_div_64_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35)(1, "div", 36);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 37);
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, TicketDetailComponent_section_0_div_64_span_8_Template, 2, 0, "span", 38);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const comment_r4 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(comment_r4.author.full_name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(5, 4, comment_r4.created_at, "short"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(comment_r4.message);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", comment_r4.is_internal);
} }
function TicketDetailComponent_section_0_mat_checkbox_70_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-checkbox", 39);
    i0.ɵɵtext(1, "Internal note");
    i0.ɵɵelementEnd();
} }
function TicketDetailComponent_section_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 1)(1, "div", 2)(2, "mat-card", 3)(3, "div", 4)(4, "div")(5, "div", 5);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "h1");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "button", 6);
    i0.ɵɵlistener("click", function TicketDetailComponent_section_0_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.deleteTicket()); });
    i0.ɵɵtext(12, "Delete");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 7)(14, "div")(15, "strong");
    i0.ɵɵtext(16, "Status:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "div")(19, "strong");
    i0.ɵɵtext(20, "Priority:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(21);
    i0.ɵɵpipe(22, "titlecase");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "div")(24, "strong");
    i0.ɵɵtext(25, "Created:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(26);
    i0.ɵɵpipe(27, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "div")(29, "strong");
    i0.ɵɵtext(30, "Assigned:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "form", 8);
    i0.ɵɵlistener("ngSubmit", function TicketDetailComponent_section_0_Template_form_ngSubmit_32_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.updateTicket()); });
    i0.ɵɵelementStart(33, "mat-form-field", 9)(34, "mat-label");
    i0.ɵɵtext(35, "Title");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(36, "input", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "mat-form-field", 9)(38, "mat-label");
    i0.ɵɵtext(39, "Priority");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "mat-select", 11)(41, "mat-option", 12);
    i0.ɵɵtext(42, "Low");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "mat-option", 13);
    i0.ɵɵtext(44, "Medium");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "mat-option", 14);
    i0.ɵɵtext(46, "High");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(47, "mat-form-field", 15)(48, "mat-label");
    i0.ɵɵtext(49, "Description");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(50, "textarea", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(51, TicketDetailComponent_section_0_mat_form_field_51_Template, 10, 0, "mat-form-field", 17)(52, TicketDetailComponent_section_0_mat_form_field_52_Template, 7, 2, "mat-form-field", 17);
    i0.ɵɵelementStart(53, "div", 18)(54, "button", 19);
    i0.ɵɵtext(55, "Save Ticket");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(56, "mat-card", 20)(57, "div", 21)(58, "div")(59, "div", 5);
    i0.ɵɵtext(60, "Conversation");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "h2");
    i0.ɵɵtext(62, "Ticket discussion");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(63, "div", 22);
    i0.ɵɵtemplate(64, TicketDetailComponent_section_0_div_64_Template, 9, 7, "div", 23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(65, "form", 24);
    i0.ɵɵlistener("ngSubmit", function TicketDetailComponent_section_0_Template_form_ngSubmit_65_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.postComment()); });
    i0.ɵɵelementStart(66, "mat-form-field", 9)(67, "mat-label");
    i0.ɵɵtext(68, "Add comment");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(69, "textarea", 25);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(70, TicketDetailComponent_section_0_mat_checkbox_70_Template, 2, 0, "mat-checkbox", 26);
    i0.ɵɵelementStart(71, "button", 27);
    i0.ɵɵtext(72, "Send");
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("Ticket #", ctx_r1.ticket.id, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.ticket.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.ticket.description);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.statusLabel(ctx_r1.ticket.status), "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(22, 13, ctx_r1.ticket.priority), "");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(27, 15, ctx_r1.ticket.created_at, "medium"), "");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", (ctx_r1.ticket.assigned_to == null ? null : ctx_r1.ticket.assigned_to.full_name) || "Unassigned", "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r1.editForm);
    i0.ɵɵadvance(19);
    i0.ɵɵproperty("ngIf", ctx_r1.isStaff);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isStaff);
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("ngForOf", ctx_r1.ticket.comments);
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r1.commentForm);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", ctx_r1.isStaff);
} }
export class TicketDetailComponent {
    route = inject(ActivatedRoute);
    router = inject(Router);
    ticketService = inject(TicketService);
    notify = inject(NotificationService);
    auth = inject(AuthService);
    fb = inject(FormBuilder);
    ticket;
    isStaff = ['admin', 'agent'].includes(this.auth.user()?.role ?? '');
    staffUsers = [];
    commentForm = this.fb.nonNullable.group({
        message: ['', Validators.required],
        is_internal: false,
    });
    editForm = this.fb.nonNullable.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        priority: 'medium',
        status: 'open',
        assigned_to_id: [null],
    });
    constructor() {
        if (this.isStaff) {
            this.auth.getStaffUsers().subscribe((users) => {
                this.staffUsers = users;
            });
        }
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.load(id);
        }
    }
    load(id) {
        this.ticketService.get(id).subscribe((ticket) => {
            this.ticket = ticket;
            this.editForm.patchValue({
                title: ticket.title,
                description: ticket.description,
                priority: ticket.priority,
                status: ticket.status,
                assigned_to_id: ticket.assigned_to?.id ?? null,
            });
        });
    }
    postComment() {
        if (!this.ticket || this.commentForm.invalid)
            return;
        this.ticketService.addComment(this.ticket.id, this.commentForm.getRawValue()).subscribe({
            next: () => {
                this.notify.success('Comment added.');
                this.commentForm.patchValue({ message: '', is_internal: false });
                this.load(String(this.ticket?.id));
            },
            error: () => this.notify.error('Unable to add comment.'),
        });
    }
    updateTicket() {
        if (!this.ticket || this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            return;
        }
        const payload = {
            title: this.editForm.controls.title.value,
            description: this.editForm.controls.description.value,
            priority: this.editForm.controls.priority.value,
        };
        if (this.isStaff) {
            payload.status = this.editForm.controls.status.value;
            payload.assigned_to_id = this.editForm.controls.assigned_to_id.value;
        }
        this.ticketService.update(this.ticket.id, payload).subscribe({
            next: () => {
                this.notify.success('Ticket updated.');
                this.load(String(this.ticket?.id));
            },
            error: () => this.notify.error('Unable to update ticket.'),
        });
    }
    deleteTicket() {
        if (!this.ticket || !window.confirm('Delete this ticket?')) {
            return;
        }
        this.ticketService.delete(this.ticket.id).subscribe({
            next: () => {
                this.notify.success('Ticket deleted.');
                void this.router.navigate(['/tickets']);
            },
            error: () => this.notify.error('Unable to delete ticket.'),
        });
    }
    statusLabel(status) {
        return status === 'in_progress' ? 'In Progress' : status[0].toUpperCase() + status.slice(1);
    }
    static ɵfac = function TicketDetailComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TicketDetailComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TicketDetailComponent, selectors: [["ng-component"]], decls: 1, vars: 1, consts: [["class", "page-shell", 4, "ngIf"], [1, "page-shell"], [1, "two-col"], [1, "glass-card", "detail-card"], [1, "card-header"], [1, "chip"], ["mat-stroked-button", "", "type", "button", 1, "delete-btn", 3, "click"], [1, "meta-grid"], [1, "edit-grid", 3, "ngSubmit", "formGroup"], ["appearance", "outline"], ["matInput", "", "formControlName", "title"], ["formControlName", "priority"], ["value", "low"], ["value", "medium"], ["value", "high"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "rows", "5", "formControlName", "description"], ["appearance", "outline", 4, "ngIf"], [1, "form-actions", "full-width"], ["mat-flat-button", "", "type", "submit", 1, "save-btn"], [1, "glass-card", "comments-card"], [1, "comments-head"], [1, "comment-list"], ["class", "comment", 4, "ngFor", "ngForOf"], [3, "ngSubmit", "formGroup"], ["matInput", "", "rows", "4", "formControlName", "message"], ["formControlName", "is_internal", 4, "ngIf"], ["mat-flat-button", "", "color", "primary", "type", "submit"], ["formControlName", "status"], ["value", "open"], ["value", "in_progress"], ["value", "closed"], ["formControlName", "assigned_to_id"], [3, "value"], [3, "value", 4, "ngFor", "ngForOf"], [1, "comment"], [1, "author"], [1, "time"], ["class", "chip", 4, "ngIf"], ["formControlName", "is_internal"]], template: function TicketDetailComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, TicketDetailComponent_section_0_Template, 73, 18, "section", 0);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.ticket);
        } }, dependencies: [CommonModule, i1.NgForOf, i1.NgIf, i1.TitleCasePipe, i1.DatePipe, ReactiveFormsModule, i2.ɵNgNoValidate, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.FormGroupDirective, i2.FormControlName, MatButtonModule, i3.MatButton, MatCardModule, i4.MatCard, MatCheckboxModule, i5.MatCheckbox, MatFormFieldModule, i6.MatFormField, i6.MatLabel, MatInputModule, i7.MatInput, MatSelectModule, i8.MatSelect, i8.MatOption], styles: [".detail-card[_ngcontent-%COMP%], .comments-card[_ngcontent-%COMP%] {\n      padding: 24px;\n      border: 1px solid var(--border);\n      background: #ffffff;\n      box-shadow: var(--shadow);\n    }\n    .card-header[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      gap: 18px;\n      align-items: start;\n    }\n    .card-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] { margin: 14px 0 8px; font-size: 34px; color: #17366e; }\n    .card-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: var(--muted); max-width: 60ch; line-height: 1.6; }\n    .meta-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(2, 1fr);\n      gap: 14px;\n      margin: 18px 0 22px;\n    }\n    .meta-grid[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n      padding: 14px 16px;\n      border-radius: 16px;\n      background: #f8fbff;\n      border: 1px solid #e7edf7;\n    }\n    .edit-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }\n    .full-width[_ngcontent-%COMP%] { grid-column: 1 / -1; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; gap: 12px; }\n    .save-btn[_ngcontent-%COMP%] {\n      --mdc-filled-button-container-color: #15803d;\n      --mdc-filled-button-label-text-color: #ffffff;\n    }\n    .delete-btn[_ngcontent-%COMP%] {\n      color: #dc2626 !important;\n      border-color: rgba(220, 38, 38, 0.35) !important;\n      background: rgba(254, 242, 242, 0.95) !important;\n    }\n    .comments-head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { margin: 12px 0 0; color: #17366e; }\n    .comment-list[_ngcontent-%COMP%] { display: grid; gap: 12px; max-height: 420px; overflow: auto; margin: 18px 0 16px; }\n    .comment[_ngcontent-%COMP%] { padding: 14px; background: #f8fbff; border-radius: 16px; border: 1px solid var(--border); }\n    .author[_ngcontent-%COMP%] { font-weight: 700; }\n    .time[_ngcontent-%COMP%] { font-size: 12px; color: var(--muted); margin-top: 4px; }\n    form[_ngcontent-%COMP%] { display: grid; gap: 12px; }\n    @media (max-width: 960px) {\n      .meta-grid[_ngcontent-%COMP%], .edit-grid[_ngcontent-%COMP%] { grid-template-columns: 1fr; }\n      .card-header[_ngcontent-%COMP%] { flex-direction: column; }\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TicketDetailComponent, [{
        type: Component,
        args: [{ standalone: true, imports: [
                    CommonModule,
                    ReactiveFormsModule,
                    MatButtonModule,
                    MatCardModule,
                    MatCheckboxModule,
                    MatFormFieldModule,
                    MatInputModule,
                    MatSelectModule,
                ], template: `
    <section class="page-shell" *ngIf="ticket">
      <div class="two-col">
        <mat-card class="glass-card detail-card">
          <div class="card-header">
            <div>
              <div class="chip">Ticket #{{ ticket.id }}</div>
              <h1>{{ ticket.title }}</h1>
              <p>{{ ticket.description }}</p>
            </div>
            <button mat-stroked-button class="delete-btn" type="button" (click)="deleteTicket()">Delete</button>
          </div>

          <div class="meta-grid">
            <div><strong>Status:</strong> {{ statusLabel(ticket.status) }}</div>
            <div><strong>Priority:</strong> {{ ticket.priority | titlecase }}</div>
            <div><strong>Created:</strong> {{ ticket.created_at | date:'medium' }}</div>
            <div><strong>Assigned:</strong> {{ ticket.assigned_to?.full_name || 'Unassigned' }}</div>
          </div>

          <form [formGroup]="editForm" class="edit-grid" (ngSubmit)="updateTicket()">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput rows="5" formControlName="description"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" *ngIf="isStaff">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="open">Open</mat-option>
                <mat-option value="in_progress">In Progress</mat-option>
                <mat-option value="closed">Closed</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" *ngIf="isStaff">
              <mat-label>Assign to</mat-label>
              <mat-select formControlName="assigned_to_id">
                <mat-option [value]="null">Unassigned</mat-option>
                <mat-option *ngFor="let staff of staffUsers" [value]="staff.id">
                  {{ staff.full_name }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <div class="form-actions full-width">
              <button mat-flat-button class="save-btn" type="submit">Save Ticket</button>
            </div>
          </form>
        </mat-card>

        <mat-card class="glass-card comments-card">
          <div class="comments-head">
            <div>
              <div class="chip">Conversation</div>
              <h2>Ticket discussion</h2>
            </div>
          </div>
          <div class="comment-list">
            <div class="comment" *ngFor="let comment of ticket.comments">
              <div class="author">{{ comment.author.full_name }}</div>
              <div class="time">{{ comment.created_at | date:'short' }}</div>
              <p>{{ comment.message }}</p>
              <span class="chip" *ngIf="comment.is_internal">Internal note</span>
            </div>
          </div>
          <form [formGroup]="commentForm" (ngSubmit)="postComment()">
            <mat-form-field appearance="outline">
              <mat-label>Add comment</mat-label>
              <textarea matInput rows="4" formControlName="message"></textarea>
            </mat-form-field>
            <mat-checkbox formControlName="is_internal" *ngIf="isStaff">Internal note</mat-checkbox>
            <button mat-flat-button color="primary" type="submit">Send</button>
          </form>
        </mat-card>
      </div>
    </section>
  `, styles: ["\n    .detail-card, .comments-card {\n      padding: 24px;\n      border: 1px solid var(--border);\n      background: #ffffff;\n      box-shadow: var(--shadow);\n    }\n    .card-header {\n      display: flex;\n      justify-content: space-between;\n      gap: 18px;\n      align-items: start;\n    }\n    .card-header h1 { margin: 14px 0 8px; font-size: 34px; color: #17366e; }\n    .card-header p { margin: 0; color: var(--muted); max-width: 60ch; line-height: 1.6; }\n    .meta-grid {\n      display: grid;\n      grid-template-columns: repeat(2, 1fr);\n      gap: 14px;\n      margin: 18px 0 22px;\n    }\n    .meta-grid div {\n      padding: 14px 16px;\n      border-radius: 16px;\n      background: #f8fbff;\n      border: 1px solid #e7edf7;\n    }\n    .edit-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }\n    .full-width { grid-column: 1 / -1; }\n    .form-actions { display: flex; gap: 12px; }\n    .save-btn {\n      --mdc-filled-button-container-color: #15803d;\n      --mdc-filled-button-label-text-color: #ffffff;\n    }\n    .delete-btn {\n      color: #dc2626 !important;\n      border-color: rgba(220, 38, 38, 0.35) !important;\n      background: rgba(254, 242, 242, 0.95) !important;\n    }\n    .comments-head h2 { margin: 12px 0 0; color: #17366e; }\n    .comment-list { display: grid; gap: 12px; max-height: 420px; overflow: auto; margin: 18px 0 16px; }\n    .comment { padding: 14px; background: #f8fbff; border-radius: 16px; border: 1px solid var(--border); }\n    .author { font-weight: 700; }\n    .time { font-size: 12px; color: var(--muted); margin-top: 4px; }\n    form { display: grid; gap: 12px; }\n    @media (max-width: 960px) {\n      .meta-grid, .edit-grid { grid-template-columns: 1fr; }\n      .card-header { flex-direction: column; }\n    }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TicketDetailComponent, { className: "TicketDetailComponent", filePath: "src/app/features/tickets/ticket-detail.component.ts", lineNumber: 173 }); })();
//# sourceMappingURL=ticket-detail.component.js.map