import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/card";
import * as i5 from "@angular/material/form-field";
import * as i6 from "@angular/material/input";
import * as i7 from "@angular/material/select";
import * as i8 from "@angular/material/table";
const _c0 = a0 => ["/tickets", a0];
function TicketListComponent_mat_card_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 34)(1, "div", 35)(2, "div", 36);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "div", 37);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 38);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const card_r2 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(card_r2.label);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(card_r2.value);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r2.caption);
} }
function TicketListComponent_ng_container_79_th_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 52);
    i0.ɵɵtext(1, "ID");
    i0.ɵɵelementEnd();
} }
function TicketListComponent_ng_container_79_td_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 53);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ticket_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("#", ticket_r3.id, "");
} }
function TicketListComponent_ng_container_79_th_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 52);
    i0.ɵɵtext(1, "Title");
    i0.ɵɵelementEnd();
} }
function TicketListComponent_ng_container_79_td_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 53)(1, "a", 54);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ticket_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(2, _c0, ticket_r4.id));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ticket_r4.title);
} }
function TicketListComponent_ng_container_79_th_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 52);
    i0.ɵɵtext(1, "Priority");
    i0.ɵɵelementEnd();
} }
function TicketListComponent_ng_container_79_td_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 53)(1, "span", 55);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ticket_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ticket_r5.priority);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ticket_r5.priority);
} }
function TicketListComponent_ng_container_79_th_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 52);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function TicketListComponent_ng_container_79_td_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 53)(1, "span", 56);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ticket_r6 = ctx.$implicit;
    const ctx_r6 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r6.statusClass(ticket_r6.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r6.statusLabel(ticket_r6.status));
} }
function TicketListComponent_ng_container_79_th_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 52);
    i0.ɵɵtext(1, "Assignee");
    i0.ɵɵelementEnd();
} }
function TicketListComponent_ng_container_79_td_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 53);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ticket_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate((ticket_r8.assigned_to == null ? null : ticket_r8.assigned_to.full_name) || "Unassigned");
} }
function TicketListComponent_ng_container_79_th_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 52);
    i0.ɵɵtext(1, "Updated");
    i0.ɵɵelementEnd();
} }
function TicketListComponent_ng_container_79_td_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 53);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ticket_r9 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, ticket_r9.updated_at, "medium"));
} }
function TicketListComponent_ng_container_79_th_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 52);
    i0.ɵɵtext(1, "Actions");
    i0.ɵɵelementEnd();
} }
function TicketListComponent_ng_container_79_td_23_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 53)(1, "div", 57)(2, "a", 58);
    i0.ɵɵtext(3, "Edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 59);
    i0.ɵɵlistener("click", function TicketListComponent_ng_container_79_td_23_Template_button_click_4_listener() { const ticket_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r6 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r6.deleteTicket(ticket_r11.id)); });
    i0.ɵɵtext(5, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ticket_r11 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(1, _c0, ticket_r11.id));
} }
function TicketListComponent_ng_container_79_tr_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 60);
} }
function TicketListComponent_ng_container_79_tr_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 61);
} }
function TicketListComponent_ng_container_79_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "div", 39)(2, "table", 40);
    i0.ɵɵelementContainerStart(3, 41);
    i0.ɵɵtemplate(4, TicketListComponent_ng_container_79_th_4_Template, 2, 0, "th", 42)(5, TicketListComponent_ng_container_79_td_5_Template, 2, 1, "td", 43);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(6, 44);
    i0.ɵɵtemplate(7, TicketListComponent_ng_container_79_th_7_Template, 2, 0, "th", 42)(8, TicketListComponent_ng_container_79_td_8_Template, 3, 4, "td", 43);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(9, 45);
    i0.ɵɵtemplate(10, TicketListComponent_ng_container_79_th_10_Template, 2, 0, "th", 42)(11, TicketListComponent_ng_container_79_td_11_Template, 3, 2, "td", 43);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(12, 46);
    i0.ɵɵtemplate(13, TicketListComponent_ng_container_79_th_13_Template, 2, 0, "th", 42)(14, TicketListComponent_ng_container_79_td_14_Template, 3, 2, "td", 43);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(15, 47);
    i0.ɵɵtemplate(16, TicketListComponent_ng_container_79_th_16_Template, 2, 0, "th", 42)(17, TicketListComponent_ng_container_79_td_17_Template, 2, 1, "td", 43);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(18, 48);
    i0.ɵɵtemplate(19, TicketListComponent_ng_container_79_th_19_Template, 2, 0, "th", 42)(20, TicketListComponent_ng_container_79_td_20_Template, 3, 4, "td", 43);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(21, 49);
    i0.ɵɵtemplate(22, TicketListComponent_ng_container_79_th_22_Template, 2, 0, "th", 42)(23, TicketListComponent_ng_container_79_td_23_Template, 6, 3, "td", 43);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵtemplate(24, TicketListComponent_ng_container_79_tr_24_Template, 1, 0, "tr", 50)(25, TicketListComponent_ng_container_79_tr_25_Template, 1, 0, "tr", 51);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r6 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("dataSource", ctx_r6.tickets);
    i0.ɵɵadvance(22);
    i0.ɵɵproperty("matHeaderRowDef", ctx_r6.displayedColumns);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matRowDefColumns", ctx_r6.displayedColumns);
} }
function TicketListComponent_ng_template_80_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 62)(1, "h3");
    i0.ɵɵtext(2, "No tickets match these filters");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r6 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r6.isCustomer ? "Try resetting the filters or create a new ticket to get started." : "Broaden the filters or check back when new support requests arrive.");
} }
export class TicketListComponent {
    fb = inject(FormBuilder);
    ticketService = inject(TicketService);
    authService = inject(AuthService);
    notify = inject(NotificationService);
    tickets = [];
    summaryCards = [];
    isCustomer = this.authService.user()?.role === 'customer';
    page = 1;
    hasNext = false;
    totalCount = 0;
    displayedColumns = this.isCustomer
        ? ['id', 'title', 'priority', 'status', 'updated_at', 'actions']
        : ['id', 'title', 'priority', 'status', 'assignee', 'updated_at', 'actions'];
    filters = this.fb.nonNullable.group({
        search: '',
        status: '',
        priority: '',
        date_from: '',
        date_to: '',
        page: 1,
    });
    constructor() {
        this.load();
    }
    load() {
        this.ticketService.list(this.filters.getRawValue()).subscribe((response) => {
            this.tickets = response.results;
            this.totalCount = response.count;
            this.page = Number(this.filters.controls.page.value);
            this.hasNext = !!response.next;
            this.summaryCards = this.buildSummaryCards(response.results, response.count);
        });
    }
    changePage(delta) {
        const nextPage = Math.max(1, Number(this.filters.controls.page.value) + delta);
        this.filters.patchValue({ page: nextPage });
        this.load();
    }
    applyPreset(preset) {
        this.filters.patchValue({
            status: preset === 'high' ? '' : preset,
            priority: preset === 'high' ? 'high' : '',
            page: 1,
        });
        this.load();
    }
    resetFilters() {
        this.filters.patchValue({
            search: '',
            status: '',
            priority: '',
            date_from: '',
            date_to: '',
            page: 1,
        });
        this.load();
    }
    statusClass(status) {
        return status === 'in_progress' ? 'in-progress' : status;
    }
    statusLabel(status) {
        return status === 'in_progress' ? 'In Progress' : status[0].toUpperCase() + status.slice(1);
    }
    deleteTicket(id) {
        if (!window.confirm('Delete this ticket?')) {
            return;
        }
        this.ticketService.delete(id).subscribe({
            next: () => {
                this.notify.success('Ticket deleted successfully.');
                if (this.tickets.length === 1 && this.page > 1) {
                    this.filters.patchValue({ page: this.page - 1 });
                }
                this.load();
            },
            error: () => this.notify.error('Unable to delete ticket.'),
        });
    }
    buildSummaryCards(tickets, totalCount) {
        const open = tickets.filter((ticket) => ticket.status === 'open').length;
        const inProgress = tickets.filter((ticket) => ticket.status === 'in_progress').length;
        const highPriority = tickets.filter((ticket) => ticket.priority === 'high').length;
        return [
            {
                label: this.isCustomer ? 'My total tickets' : 'Visible queue',
                value: totalCount,
                caption: this.isCustomer ? 'Your personal support history across all pages.' : 'Current filtered ticket count across the queue.',
            },
            {
                label: 'Open on this page',
                value: open,
                caption: 'Requests that still need action or a first response.',
            },
            {
                label: 'In progress',
                value: inProgress,
                caption: 'Tickets currently being worked by support staff.',
            },
            {
                label: 'High priority',
                value: highPriority,
                caption: 'Urgent cases surfaced in the current result set.',
            },
        ];
    }
    static ɵfac = function TicketListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TicketListComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TicketListComponent, selectors: [["ng-component"]], decls: 89, vars: 14, consts: [["noTickets", ""], [1, "ticket-page"], [1, "section-header"], [1, "chip"], [1, "intro"], ["mat-flat-button", "", "color", "primary", "routerLink", "/tickets/new"], [1, "summary-grid"], ["class", "glass-card summary-card", 4, "ngFor", "ngForOf"], [1, "glass-card", "filter-card"], [1, "filter-header"], ["mat-stroked-button", "", "type", "button", 3, "click"], [1, "quick-filters"], ["mat-stroked-button", "", "type", "button", 1, "quick-filter", 3, "click"], [1, "filter-grid", 3, "formGroup"], ["appearance", "outline"], ["matInput", "", "formControlName", "search", "placeholder", "Title or ID"], ["formControlName", "status"], ["value", ""], ["value", "open"], ["value", "in_progress"], ["value", "closed"], ["formControlName", "priority"], ["value", "low"], ["value", "medium"], ["value", "high"], ["matInput", "", "type", "date", "formControlName", "date_from"], ["matInput", "", "type", "date", "formControlName", "date_to"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "click"], [1, "glass-card", "table-card"], [1, "table-header"], [1, "table-badge"], [4, "ngIf", "ngIfElse"], [1, "pager"], ["mat-stroked-button", "", "type", "button", 3, "click", "disabled"], [1, "glass-card", "summary-card"], [1, "summary-top"], [1, "summary-label"], [1, "summary-dot"], [1, "summary-value"], [1, "table-wrap"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "id"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "title"], ["matColumnDef", "priority"], ["matColumnDef", "status"], ["matColumnDef", "assignee"], ["matColumnDef", "updated_at"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], [3, "routerLink"], [1, "priority-pill", 3, "ngClass"], [1, "status-pill", 3, "ngClass"], [1, "action-buttons"], ["mat-stroked-button", "", 1, "edit-btn", 3, "routerLink"], ["mat-stroked-button", "", "type", "button", 1, "delete-btn", 3, "click"], ["mat-header-row", ""], ["mat-row", ""], [1, "empty-state"]], template: function TicketListComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "section", 1)(1, "div", 2)(2, "div")(3, "div", 3);
            i0.ɵɵtext(4, "Ticket Center");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h1");
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 4);
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "a", 5);
            i0.ɵɵtext(10, "Create Ticket");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "div", 6);
            i0.ɵɵtemplate(12, TicketListComponent_mat_card_12_Template, 9, 3, "mat-card", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "mat-card", 8)(14, "div", 9)(15, "div")(16, "div", 3);
            i0.ɵɵtext(17, "Smart Filters");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "h2");
            i0.ɵɵtext(19, "Refine the queue");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(20, "button", 10);
            i0.ɵɵlistener("click", function TicketListComponent_Template_button_click_20_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.resetFilters()); });
            i0.ɵɵtext(21, "Reset");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(22, "div", 11)(23, "button", 12);
            i0.ɵɵlistener("click", function TicketListComponent_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.applyPreset("open")); });
            i0.ɵɵtext(24, "Open");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "button", 12);
            i0.ɵɵlistener("click", function TicketListComponent_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.applyPreset("in_progress")); });
            i0.ɵɵtext(26, "In Progress");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "button", 12);
            i0.ɵɵlistener("click", function TicketListComponent_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.applyPreset("closed")); });
            i0.ɵɵtext(28, "Closed");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "button", 12);
            i0.ɵɵlistener("click", function TicketListComponent_Template_button_click_29_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.applyPreset("high")); });
            i0.ɵɵtext(30, "High Priority");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(31, "form", 13)(32, "mat-form-field", 14)(33, "mat-label");
            i0.ɵɵtext(34, "Search");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(35, "input", 15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "mat-form-field", 14)(37, "mat-label");
            i0.ɵɵtext(38, "Status");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "mat-select", 16)(40, "mat-option", 17);
            i0.ɵɵtext(41, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(42, "mat-option", 18);
            i0.ɵɵtext(43, "Open");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "mat-option", 19);
            i0.ɵɵtext(45, "In Progress");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "mat-option", 20);
            i0.ɵɵtext(47, "Closed");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(48, "mat-form-field", 14)(49, "mat-label");
            i0.ɵɵtext(50, "Priority");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "mat-select", 21)(52, "mat-option", 17);
            i0.ɵɵtext(53, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(54, "mat-option", 22);
            i0.ɵɵtext(55, "Low");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(56, "mat-option", 23);
            i0.ɵɵtext(57, "Medium");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(58, "mat-option", 24);
            i0.ɵɵtext(59, "High");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(60, "mat-form-field", 14)(61, "mat-label");
            i0.ɵɵtext(62, "From");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(63, "input", 25);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(64, "mat-form-field", 14)(65, "mat-label");
            i0.ɵɵtext(66, "To");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(67, "input", 26);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(68, "button", 27);
            i0.ɵɵlistener("click", function TicketListComponent_Template_button_click_68_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.load()); });
            i0.ɵɵtext(69, "Apply");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(70, "mat-card", 28)(71, "div", 29)(72, "div")(73, "h2");
            i0.ɵɵtext(74);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(75, "p");
            i0.ɵɵtext(76);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(77, "div", 30);
            i0.ɵɵtext(78);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(79, TicketListComponent_ng_container_79_Template, 26, 3, "ng-container", 31)(80, TicketListComponent_ng_template_80_Template, 5, 1, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelementStart(82, "div", 32)(83, "button", 33);
            i0.ɵɵlistener("click", function TicketListComponent_Template_button_click_83_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.changePage(-1)); });
            i0.ɵɵtext(84, "Previous");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(85, "span");
            i0.ɵɵtext(86);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(87, "button", 33);
            i0.ɵɵlistener("click", function TicketListComponent_Template_button_click_87_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.changePage(1)); });
            i0.ɵɵtext(88, "Next");
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            const noTickets_r12 = i0.ɵɵreference(81);
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(ctx.isCustomer ? "Track your requests" : "Manage the support queue");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.isCustomer ? "Watch status changes, add context, and keep your active cases organized." : "Filter the workload, surface urgent cases, and keep ownership visible across the team.", " ");
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngForOf", ctx.summaryCards);
            i0.ɵɵadvance(19);
            i0.ɵɵproperty("formGroup", ctx.filters);
            i0.ɵɵadvance(43);
            i0.ɵɵtextInterpolate(ctx.isCustomer ? "Latest ticket updates" : "Queue snapshot");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate3("Showing ", ctx.tickets.length, " of ", ctx.totalCount, " ticket", ctx.totalCount === 1 ? "" : "s", ".");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.isCustomer ? "Customer view" : "Staff view");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.tickets.length)("ngIfElse", noTickets_r12);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", ctx.page <= 1);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1("Page ", ctx.page, "");
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", !ctx.hasNext);
        } }, dependencies: [CommonModule, i1.NgClass, i1.NgForOf, i1.NgIf, i1.DatePipe, ReactiveFormsModule, i2.ɵNgNoValidate, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.FormGroupDirective, i2.FormControlName, RouterLink,
            MatButtonModule, i3.MatAnchor, i3.MatButton, MatCardModule, i4.MatCard, MatFormFieldModule, i5.MatFormField, i5.MatLabel, MatInputModule, i6.MatInput, MatSelectModule, i7.MatSelect, i7.MatOption, MatTableModule, i8.MatTable, i8.MatHeaderCellDef, i8.MatHeaderRowDef, i8.MatColumnDef, i8.MatCellDef, i8.MatRowDef, i8.MatHeaderCell, i8.MatCell, i8.MatHeaderRow, i8.MatRow], styles: [".ticket-page[_ngcontent-%COMP%] { display: grid; gap: 22px; }\n    .section-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] { margin: 10px 0 0; font-size: 36px; color: #17366e; }\n    .intro[_ngcontent-%COMP%] { margin: 10px 0 0; color: var(--muted); max-width: 62ch; line-height: 1.6; }\n    .summary-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }\n    .summary-card[_ngcontent-%COMP%] {\n      padding: 22px;\n      border: 1px solid #e4e9f2;\n      background: linear-gradient(180deg, #ffffff, #fbfcff);\n    }\n    .summary-card[_ngcontent-%COMP%]:nth-child(1)   .summary-dot[_ngcontent-%COMP%] { background: linear-gradient(135deg, #3b82f6, #2563eb); }\n    .summary-card[_ngcontent-%COMP%]:nth-child(2)   .summary-dot[_ngcontent-%COMP%] { background: linear-gradient(135deg, #f59e0b, #d97706); }\n    .summary-card[_ngcontent-%COMP%]:nth-child(3)   .summary-dot[_ngcontent-%COMP%] { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }\n    .summary-card[_ngcontent-%COMP%]:nth-child(4)   .summary-dot[_ngcontent-%COMP%] { background: linear-gradient(135deg, #10b981, #059669); }\n    .summary-top[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: center; gap: 12px; }\n    .summary-label[_ngcontent-%COMP%] { color: var(--muted); font-size: 14px; font-weight: 700; }\n    .summary-dot[_ngcontent-%COMP%] {\n      width: 12px;\n      height: 12px;\n      border-radius: 999px;\n      background: linear-gradient(135deg, #3b82f6, #4f46e5);\n    }\n    .summary-value[_ngcontent-%COMP%] { font-size: 34px; font-weight: 800; margin: 16px 0 10px; color: #17366e; }\n    .summary-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: var(--muted); line-height: 1.5; }\n    .filter-card[_ngcontent-%COMP%], .table-card[_ngcontent-%COMP%] {\n      padding: 22px;\n      border: 1px solid var(--border);\n      box-shadow: var(--shadow);\n      background: #ffffff;\n    }\n    .filter-header[_ngcontent-%COMP%], .table-header[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      gap: 16px;\n      align-items: center;\n      margin-bottom: 18px;\n    }\n    .filter-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .table-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { margin: 10px 0 0; font-size: 24px; color: #17366e; }\n    .table-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 8px 0 0; color: var(--muted); }\n    .table-badge[_ngcontent-%COMP%] {\n      padding: 10px 14px;\n      border-radius: 999px;\n      background: #eef3ff;\n      color: #3358c8;\n      font-size: 13px;\n      font-weight: 700;\n      white-space: nowrap;\n    }\n    .quick-filters[_ngcontent-%COMP%] { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }\n    .quick-filter[_ngcontent-%COMP%] { border-radius: 999px; }\n    .filter-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; align-items: center; }\n    .table-wrap[_ngcontent-%COMP%] {\n      overflow-x: auto;\n      border: 1px solid #e7edf7;\n      border-radius: 18px;\n      background: #fcfdff;\n    }\n    table[_ngcontent-%COMP%] { width: 100%; }\n    th[_ngcontent-%COMP%] { color: #64748b; font-weight: 700; background: #f8fbff; }\n    td[_ngcontent-%COMP%], th[_ngcontent-%COMP%] { white-space: nowrap; }\n    td[_ngcontent-%COMP%] { color: #334155; }\n    a[_ngcontent-%COMP%] { color: var(--primary-strong); text-decoration: none; font-weight: 700; }\n    .action-buttons[_ngcontent-%COMP%] { display: flex; gap: 8px; }\n    .edit-btn[_ngcontent-%COMP%] {\n      color: #15803d !important;\n      border-color: rgba(21, 128, 61, 0.35) !important;\n      background: rgba(240, 253, 244, 0.9) !important;\n    }\n    .delete-btn[_ngcontent-%COMP%] {\n      color: #dc2626 !important;\n      border-color: rgba(220, 38, 38, 0.35) !important;\n      background: rgba(254, 242, 242, 0.95) !important;\n    }\n    .pager[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 12px; padding-top: 18px; align-items: center; }\n    .empty-state[_ngcontent-%COMP%] {\n      padding: 24px;\n      border-radius: 20px;\n      background: #fbfcff;\n      border: 1px dashed var(--border);\n    }\n    .empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin-top: 0; }\n    .empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { color: var(--muted); margin-bottom: 0; }\n    @media (max-width: 1180px) {\n      .summary-grid[_ngcontent-%COMP%] { grid-template-columns: repeat(2, 1fr); }\n      .filter-grid[_ngcontent-%COMP%] { grid-template-columns: repeat(3, 1fr); }\n    }\n    @media (max-width: 720px) {\n      .summary-grid[_ngcontent-%COMP%], .filter-grid[_ngcontent-%COMP%] { grid-template-columns: 1fr; }\n      .filter-header[_ngcontent-%COMP%], .table-header[_ngcontent-%COMP%] { align-items: start; flex-direction: column; }\n      .pager[_ngcontent-%COMP%] { justify-content: space-between; }\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TicketListComponent, [{
        type: Component,
        args: [{ standalone: true, imports: [
                    CommonModule,
                    ReactiveFormsModule,
                    RouterLink,
                    MatButtonModule,
                    MatCardModule,
                    MatFormFieldModule,
                    MatInputModule,
                    MatSelectModule,
                    MatTableModule,
                ], template: `
    <section class="ticket-page">
      <div class="section-header">
        <div>
          <div class="chip">Ticket Center</div>
          <h1>{{ isCustomer ? 'Track your requests' : 'Manage the support queue' }}</h1>
          <p class="intro">
            {{ isCustomer
              ? 'Watch status changes, add context, and keep your active cases organized.'
              : 'Filter the workload, surface urgent cases, and keep ownership visible across the team.' }}
          </p>
        </div>
        <a mat-flat-button color="primary" routerLink="/tickets/new">Create Ticket</a>
      </div>

      <div class="summary-grid">
        <mat-card class="glass-card summary-card" *ngFor="let card of summaryCards">
          <div class="summary-top">
            <div class="summary-label">{{ card.label }}</div>
            <div class="summary-dot"></div>
          </div>
          <div class="summary-value">{{ card.value }}</div>
          <p>{{ card.caption }}</p>
        </mat-card>
      </div>

      <mat-card class="glass-card filter-card">
        <div class="filter-header">
          <div>
            <div class="chip">Smart Filters</div>
            <h2>Refine the queue</h2>
          </div>
          <button mat-stroked-button type="button" (click)="resetFilters()">Reset</button>
        </div>

        <div class="quick-filters">
          <button mat-stroked-button type="button" class="quick-filter" (click)="applyPreset('open')">Open</button>
          <button mat-stroked-button type="button" class="quick-filter" (click)="applyPreset('in_progress')">In Progress</button>
          <button mat-stroked-button type="button" class="quick-filter" (click)="applyPreset('closed')">Closed</button>
          <button mat-stroked-button type="button" class="quick-filter" (click)="applyPreset('high')">High Priority</button>
        </div>

        <form [formGroup]="filters" class="filter-grid">
          <mat-form-field appearance="outline">
            <mat-label>Search</mat-label>
            <input matInput formControlName="search" placeholder="Title or ID" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="">All</mat-option>
              <mat-option value="open">Open</mat-option>
              <mat-option value="in_progress">In Progress</mat-option>
              <mat-option value="closed">Closed</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="">All</mat-option>
              <mat-option value="low">Low</mat-option>
              <mat-option value="medium">Medium</mat-option>
              <mat-option value="high">High</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>From</mat-label>
            <input matInput type="date" formControlName="date_from" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>To</mat-label>
            <input matInput type="date" formControlName="date_to" />
          </mat-form-field>
          <button mat-flat-button color="primary" type="button" (click)="load()">Apply</button>
        </form>
      </mat-card>

      <mat-card class="glass-card table-card">
        <div class="table-header">
          <div>
            <h2>{{ isCustomer ? 'Latest ticket updates' : 'Queue snapshot' }}</h2>
            <p>Showing {{ tickets.length }} of {{ totalCount }} ticket{{ totalCount === 1 ? '' : 's' }}.</p>
          </div>
          <div class="table-badge">{{ isCustomer ? 'Customer view' : 'Staff view' }}</div>
        </div>

        <ng-container *ngIf="tickets.length; else noTickets">
          <div class="table-wrap">
            <table mat-table [dataSource]="tickets">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let ticket">#{{ ticket.id }}</td>
              </ng-container>

              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Title</th>
                <td mat-cell *matCellDef="let ticket">
                  <a [routerLink]="['/tickets', ticket.id]">{{ ticket.title }}</a>
                </td>
              </ng-container>

              <ng-container matColumnDef="priority">
                <th mat-header-cell *matHeaderCellDef>Priority</th>
                <td mat-cell *matCellDef="let ticket">
                  <span class="priority-pill" [ngClass]="ticket.priority">{{ ticket.priority }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let ticket">
                  <span class="status-pill" [ngClass]="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="assignee">
                <th mat-header-cell *matHeaderCellDef>Assignee</th>
                <td mat-cell *matCellDef="let ticket">{{ ticket.assigned_to?.full_name || 'Unassigned' }}</td>
              </ng-container>

              <ng-container matColumnDef="updated_at">
                <th mat-header-cell *matHeaderCellDef>Updated</th>
                <td mat-cell *matCellDef="let ticket">{{ ticket.updated_at | date:'medium' }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let ticket">
                  <div class="action-buttons">
                    <a mat-stroked-button class="edit-btn" [routerLink]="['/tickets', ticket.id]">Edit</a>
                    <button mat-stroked-button class="delete-btn" type="button" (click)="deleteTicket(ticket.id)">Delete</button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </ng-container>

        <ng-template #noTickets>
          <div class="empty-state">
            <h3>No tickets match these filters</h3>
            <p>{{ isCustomer ? 'Try resetting the filters or create a new ticket to get started.' : 'Broaden the filters or check back when new support requests arrive.' }}</p>
          </div>
        </ng-template>

        <div class="pager">
          <button mat-stroked-button type="button" (click)="changePage(-1)" [disabled]="page <= 1">Previous</button>
          <span>Page {{ page }}</span>
          <button mat-stroked-button type="button" (click)="changePage(1)" [disabled]="!hasNext">Next</button>
        </div>
      </mat-card>
    </section>
  `, styles: ["\n    .ticket-page { display: grid; gap: 22px; }\n    .section-header h1 { margin: 10px 0 0; font-size: 36px; color: #17366e; }\n    .intro { margin: 10px 0 0; color: var(--muted); max-width: 62ch; line-height: 1.6; }\n    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }\n    .summary-card {\n      padding: 22px;\n      border: 1px solid #e4e9f2;\n      background: linear-gradient(180deg, #ffffff, #fbfcff);\n    }\n    .summary-card:nth-child(1) .summary-dot { background: linear-gradient(135deg, #3b82f6, #2563eb); }\n    .summary-card:nth-child(2) .summary-dot { background: linear-gradient(135deg, #f59e0b, #d97706); }\n    .summary-card:nth-child(3) .summary-dot { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }\n    .summary-card:nth-child(4) .summary-dot { background: linear-gradient(135deg, #10b981, #059669); }\n    .summary-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }\n    .summary-label { color: var(--muted); font-size: 14px; font-weight: 700; }\n    .summary-dot {\n      width: 12px;\n      height: 12px;\n      border-radius: 999px;\n      background: linear-gradient(135deg, #3b82f6, #4f46e5);\n    }\n    .summary-value { font-size: 34px; font-weight: 800; margin: 16px 0 10px; color: #17366e; }\n    .summary-card p { margin: 0; color: var(--muted); line-height: 1.5; }\n    .filter-card, .table-card {\n      padding: 22px;\n      border: 1px solid var(--border);\n      box-shadow: var(--shadow);\n      background: #ffffff;\n    }\n    .filter-header, .table-header {\n      display: flex;\n      justify-content: space-between;\n      gap: 16px;\n      align-items: center;\n      margin-bottom: 18px;\n    }\n    .filter-header h2, .table-header h2 { margin: 10px 0 0; font-size: 24px; color: #17366e; }\n    .table-header p { margin: 8px 0 0; color: var(--muted); }\n    .table-badge {\n      padding: 10px 14px;\n      border-radius: 999px;\n      background: #eef3ff;\n      color: #3358c8;\n      font-size: 13px;\n      font-weight: 700;\n      white-space: nowrap;\n    }\n    .quick-filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }\n    .quick-filter { border-radius: 999px; }\n    .filter-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; align-items: center; }\n    .table-wrap {\n      overflow-x: auto;\n      border: 1px solid #e7edf7;\n      border-radius: 18px;\n      background: #fcfdff;\n    }\n    table { width: 100%; }\n    th { color: #64748b; font-weight: 700; background: #f8fbff; }\n    td, th { white-space: nowrap; }\n    td { color: #334155; }\n    a { color: var(--primary-strong); text-decoration: none; font-weight: 700; }\n    .action-buttons { display: flex; gap: 8px; }\n    .edit-btn {\n      color: #15803d !important;\n      border-color: rgba(21, 128, 61, 0.35) !important;\n      background: rgba(240, 253, 244, 0.9) !important;\n    }\n    .delete-btn {\n      color: #dc2626 !important;\n      border-color: rgba(220, 38, 38, 0.35) !important;\n      background: rgba(254, 242, 242, 0.95) !important;\n    }\n    .pager { display: flex; justify-content: flex-end; gap: 12px; padding-top: 18px; align-items: center; }\n    .empty-state {\n      padding: 24px;\n      border-radius: 20px;\n      background: #fbfcff;\n      border: 1px dashed var(--border);\n    }\n    .empty-state h3 { margin-top: 0; }\n    .empty-state p { color: var(--muted); margin-bottom: 0; }\n    @media (max-width: 1180px) {\n      .summary-grid { grid-template-columns: repeat(2, 1fr); }\n      .filter-grid { grid-template-columns: repeat(3, 1fr); }\n    }\n    @media (max-width: 720px) {\n      .summary-grid, .filter-grid { grid-template-columns: 1fr; }\n      .filter-header, .table-header { align-items: start; flex-direction: column; }\n      .pager { justify-content: space-between; }\n    }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TicketListComponent, { className: "TicketListComponent", filePath: "src/app/features/tickets/ticket-list.component.ts", lineNumber: 285 }); })();
//# sourceMappingURL=ticket-list.component.js.map