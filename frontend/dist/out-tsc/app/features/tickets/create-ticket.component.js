import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/material/card";
import * as i4 from "@angular/material/form-field";
import * as i5 from "@angular/material/input";
import * as i6 from "@angular/material/select";
export class CreateTicketComponent {
    fb = inject(FormBuilder);
    ticketService = inject(TicketService);
    notify = inject(NotificationService);
    router = inject(Router);
    file;
    form = this.fb.nonNullable.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        priority: ['medium', Validators.required],
    });
    onFileSelect(event) {
        const input = event.target;
        this.file = input.files?.[0];
    }
    submit() {
        if (this.form.invalid)
            return;
        const formData = new FormData();
        Object.entries(this.form.getRawValue()).forEach(([key, value]) => formData.append(key, value));
        if (this.file) {
            formData.append('attachment', this.file);
        }
        this.ticketService.create(formData).subscribe({
            next: (ticket) => {
                this.notify.success('Ticket created successfully.');
                void this.router.navigate(['/tickets', ticket.id]);
            },
            error: () => this.notify.error('Unable to create ticket.'),
        });
    }
    static ɵfac = function CreateTicketComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CreateTicketComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CreateTicketComponent, selectors: [["ng-component"]], decls: 28, vars: 1, consts: [[1, "page-shell"], [1, "glass-card", "form-card"], [1, "chip"], [3, "ngSubmit", "formGroup"], ["appearance", "outline"], ["matInput", "", "formControlName", "title"], ["matInput", "", "rows", "5", "formControlName", "description"], ["formControlName", "priority"], ["value", "low"], ["value", "medium"], ["value", "high"], ["type", "file", 3, "change"], ["mat-flat-button", "", "color", "primary", "type", "submit"]], template: function CreateTicketComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "mat-card", 1)(2, "div", 2);
            i0.ɵɵtext(3, "New Ticket");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "h1");
            i0.ɵɵtext(5, "Create support ticket");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "form", 3);
            i0.ɵɵlistener("ngSubmit", function CreateTicketComponent_Template_form_ngSubmit_6_listener() { return ctx.submit(); });
            i0.ɵɵelementStart(7, "mat-form-field", 4)(8, "mat-label");
            i0.ɵɵtext(9, "Title");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(10, "input", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "mat-form-field", 4)(12, "mat-label");
            i0.ɵɵtext(13, "Description");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(14, "textarea", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "mat-form-field", 4)(16, "mat-label");
            i0.ɵɵtext(17, "Priority");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "mat-select", 7)(19, "mat-option", 8);
            i0.ɵɵtext(20, "Low");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "mat-option", 9);
            i0.ɵɵtext(22, "Medium");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "mat-option", 10);
            i0.ɵɵtext(24, "High");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(25, "input", 11);
            i0.ɵɵlistener("change", function CreateTicketComponent_Template_input_change_25_listener($event) { return ctx.onFileSelect($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "button", 12);
            i0.ɵɵtext(27, "Submit Ticket");
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("formGroup", ctx.form);
        } }, dependencies: [CommonModule,
            ReactiveFormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, MatButtonModule, i2.MatButton, MatCardModule, i3.MatCard, MatFormFieldModule, i4.MatFormField, i4.MatLabel, MatInputModule, i5.MatInput, MatSelectModule, i6.MatSelect, i6.MatOption], styles: [".form-card[_ngcontent-%COMP%] { max-width: 760px; padding: 28px; } form[_ngcontent-%COMP%] { display: grid; gap: 16px; margin-top: 16px; }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CreateTicketComponent, [{
        type: Component,
        args: [{ standalone: true, imports: [
                    CommonModule,
                    ReactiveFormsModule,
                    MatButtonModule,
                    MatCardModule,
                    MatFormFieldModule,
                    MatInputModule,
                    MatSelectModule,
                ], template: `
    <section class="page-shell">
      <mat-card class="glass-card form-card">
        <div class="chip">New Ticket</div>
        <h1>Create support ticket</h1>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput rows="5" formControlName="description"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="low">Low</mat-option>
              <mat-option value="medium">Medium</mat-option>
              <mat-option value="high">High</mat-option>
            </mat-select>
          </mat-form-field>
          <input type="file" (change)="onFileSelect($event)" />
          <button mat-flat-button color="primary" type="submit">Submit Ticket</button>
        </form>
      </mat-card>
    </section>
  `, styles: [".form-card { max-width: 760px; padding: 28px; } form { display: grid; gap: 16px; margin-top: 16px; }"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CreateTicketComponent, { className: "CreateTicketComponent", filePath: "src/app/features/tickets/create-ticket.component.ts", lineNumber: 55 }); })();
//# sourceMappingURL=create-ticket.component.js.map