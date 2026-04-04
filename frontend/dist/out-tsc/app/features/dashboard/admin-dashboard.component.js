import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TicketService } from '../../core/services/ticket.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/card";
const _c0 = () => [1, 2, 3, 4];
const _c1 = a0 => ["/tickets", a0];
function AdminDashboardComponent_section_0_mat_card_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card", 24)(1, "div", 25)(2, "div", 26);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 27);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 28);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 29);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const card_r1 = ctx.$implicit;
    i0.ɵɵclassProp("blue", card_r1.tone === "blue")("green", card_r1.tone === "green")("violet", card_r1.tone === "violet")("amber", card_r1.tone === "amber");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(card_r1.label.charAt(0));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r1.hint);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r1.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r1.value);
} }
function AdminDashboardComponent_section_0_div_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 30);
} }
function AdminDashboardComponent_section_0_div_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const point_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(point_r2.label);
} }
function AdminDashboardComponent_section_0_div_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 31)(1, "div", 32)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 33);
    i0.ɵɵelement(7, "div", 34);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r3 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r3.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r3.value);
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", item_r3.percent, "%");
    i0.ɵɵclassProp("open", item_r3.tone === "open")("progress", item_r3.tone === "progress")("closed", item_r3.tone === "closed");
} }
function AdminDashboardComponent_section_0_div_47_a_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 37)(1, "div", 38)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 39)(8, "span", 40);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "span", 41);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ticket_r4 = ctx.$implicit;
    const ctx_r4 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(11, _c1, ticket_r4.id));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ticket_r4.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("#", ticket_r4.id, " \u00B7 ", i0.ɵɵpipeBind2(6, 8, ticket_r4.updated_at, "mediumDate"), "");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngClass", ctx_r4.statusClass(ticket_r4.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r4.statusLabel(ticket_r4.status));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ticket_r4.priority);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ticket_r4.priority);
} }
function AdminDashboardComponent_section_0_div_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35);
    i0.ɵɵtemplate(1, AdminDashboardComponent_section_0_div_47_a_1_Template, 12, 13, "a", 36);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r4.recentTickets);
} }
function AdminDashboardComponent_section_0_ng_template_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 42)(1, "h3");
    i0.ɵɵtext(2, "No tickets yet");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r4.isStaff() ? "Once new tickets are created, they will appear here." : "Create your first ticket to start the conversation.");
} }
function AdminDashboardComponent_section_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 2)(1, "div", 3)(2, "div")(3, "h1");
    i0.ɵɵtext(4, "Dashboard");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 4);
    i0.ɵɵtext(8, "Live Data");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 5);
    i0.ɵɵtemplate(10, AdminDashboardComponent_section_0_mat_card_10_Template, 10, 12, "mat-card", 6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 7)(12, "mat-card", 8)(13, "div", 9)(14, "div")(15, "h2");
    i0.ɵɵtext(16, "Ticket Activity");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "p");
    i0.ɵɵtext(18, "Recent activity across the latest visible tickets.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "a", 10);
    i0.ɵɵtext(20, "Open queue");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 11)(22, "div", 12);
    i0.ɵɵtemplate(23, AdminDashboardComponent_section_0_div_23_Template, 1, 0, "div", 13);
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(24, "svg", 14);
    i0.ɵɵelement(25, "path", 15)(26, "path", 16);
    i0.ɵɵelementEnd()();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelementStart(27, "div", 17);
    i0.ɵɵtemplate(28, AdminDashboardComponent_section_0_div_28_Template, 2, 1, "div", 18);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "mat-card", 8)(30, "div", 9)(31, "div")(32, "h2");
    i0.ɵɵtext(33, "Status Breakdown");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "p");
    i0.ɵɵtext(35);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(36, "div", 19);
    i0.ɵɵtemplate(37, AdminDashboardComponent_section_0_div_37_Template, 8, 10, "div", 20);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(38, "mat-card", 21)(39, "div", 9)(40, "div")(41, "h2");
    i0.ɵɵtext(42);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "p");
    i0.ɵɵtext(44);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(45, "a", 22);
    i0.ɵɵtext(46);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(47, AdminDashboardComponent_section_0_div_47_Template, 2, 1, "div", 23)(48, AdminDashboardComponent_section_0_ng_template_48_Template, 5, 1, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const emptyState_r6 = i0.ɵɵreference(49);
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r4.isStaff() ? "Support operations overview" : "Your support activity overview");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngForOf", ctx_r4.summaryCards);
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("ngForOf", i0.ɵɵpureFunction0(13, _c0));
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("d", ctx_r4.trendAreaPath);
    i0.ɵɵadvance();
    i0.ɵɵattribute("d", ctx_r4.trendLinePath);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r4.trendSeries);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r4.isStaff() ? "Current queue mix" : "Your ticket mix");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r4.statusBars);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r4.isStaff() ? "Recent Ticket Activity" : "Recent Requests");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r4.isStaff() ? "Most recently updated tickets in your visible queue." : "Your latest ticket updates and current status.");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r4.isStaff() ? "Create internal ticket" : "Create ticket");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r4.recentTickets.length)("ngIfElse", emptyState_r6);
} }
export class AdminDashboardComponent {
    auth = inject(AuthService);
    ticketService = inject(TicketService);
    currentUser = this.auth.user;
    isStaff = computed(() => ['admin', 'agent'].includes(this.currentUser()?.role ?? ''));
    summaryCards = [];
    recentTickets = [];
    trendSeries = [];
    trendLinePath = '';
    trendAreaPath = '';
    statusBars = [];
    constructor() {
        const user = this.currentUser();
        if (!user) {
            return;
        }
        if (user.role === 'customer') {
            this.ticketService.list({ page: 1 }).subscribe((response) => {
                this.bindCustomerDashboard(user, response.results, response.count);
            });
            return;
        }
        forkJoin({
            stats: this.ticketService.dashboard(),
            recent: this.ticketService.list({ page: 1 }),
        }).subscribe(({ stats, recent }) => {
            this.bindStaffDashboard(stats, recent.results);
        });
    }
    statusClass(status) {
        return status === 'in_progress' ? 'in-progress' : status;
    }
    statusLabel(status) {
        return status === 'in_progress' ? 'In Progress' : status[0].toUpperCase() + status.slice(1);
    }
    bindStaffDashboard(stats, recentTickets) {
        const total = stats['total_tickets'] ?? 0;
        const open = stats['open_tickets'] ?? 0;
        const closed = stats['closed_tickets'] ?? 0;
        const highPriority = stats['high_priority'] ?? 0;
        const inProgress = Math.max(total - open - closed, 0);
        this.summaryCards = [
            { label: 'Total Tickets', value: total, hint: 'All visible work', tone: 'blue' },
            { label: 'Open Queue', value: open, hint: 'Needs action', tone: 'amber' },
            { label: 'In Progress', value: inProgress, hint: 'Being handled', tone: 'violet' },
            { label: 'High Priority', value: highPriority, hint: 'Escalation watch', tone: 'green' },
        ];
        this.recentTickets = recentTickets.slice(0, 5);
        this.setCharts(recentTickets, [
            { label: 'Open', value: open, tone: 'open' },
            { label: 'In Progress', value: inProgress, tone: 'progress' },
            { label: 'Closed', value: closed, tone: 'closed' },
        ]);
    }
    bindCustomerDashboard(user, recentTickets, total) {
        const open = recentTickets.filter((ticket) => ticket.status === 'open').length;
        const inProgress = recentTickets.filter((ticket) => ticket.status === 'in_progress').length;
        const closed = recentTickets.filter((ticket) => ticket.status === 'closed').length;
        const highPriority = recentTickets.filter((ticket) => ticket.priority === 'high').length;
        this.summaryCards = [
            { label: 'My Tickets', value: total, hint: user.full_name, tone: 'blue' },
            { label: 'Open', value: open, hint: 'Waiting updates', tone: 'amber' },
            { label: 'In Progress', value: inProgress, hint: 'Under review', tone: 'violet' },
            { label: 'High Priority', value: highPriority, hint: 'Urgent tickets', tone: 'green' },
        ];
        this.recentTickets = recentTickets.slice(0, 5);
        this.setCharts(recentTickets, [
            { label: 'Open', value: open, tone: 'open' },
            { label: 'In Progress', value: inProgress, tone: 'progress' },
            { label: 'Closed', value: closed, tone: 'closed' },
        ]);
    }
    setCharts(recentTickets, bars) {
        this.trendSeries = this.buildTrendSeries(recentTickets);
        this.trendLinePath = this.buildLinePath(this.trendSeries);
        this.trendAreaPath = this.buildAreaPath(this.trendSeries);
        const maxValue = Math.max(...bars.map((item) => item.value), 1);
        this.statusBars = bars.map((item) => ({
            ...item,
            percent: (item.value / maxValue) * 100,
        }));
    }
    buildTrendSeries(recentTickets) {
        const counts = new Map();
        recentTickets.forEach((ticket) => {
            const date = new Date(ticket.updated_at);
            const label = `${date.getMonth() + 1}/${date.getDate()}`;
            counts.set(label, (counts.get(label) ?? 0) + 1);
        });
        const points = Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
        const padded = points.slice(-6);
        while (padded.length < 6) {
            padded.unshift({ label: `-`, value: 0 });
        }
        return padded;
    }
    buildLinePath(series) {
        if (!series.length)
            return '';
        const width = 600;
        const height = 240;
        const max = Math.max(...series.map((point) => point.value), 1);
        return series
            .map((point, index) => {
            const x = (index / Math.max(series.length - 1, 1)) * width;
            const y = height - (point.value / max) * 180 - 20;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
            .join(' ');
    }
    buildAreaPath(series) {
        if (!series.length)
            return '';
        const width = 600;
        const height = 240;
        const max = Math.max(...series.map((point) => point.value), 1);
        const line = series
            .map((point, index) => {
            const x = (index / Math.max(series.length - 1, 1)) * width;
            const y = height - (point.value / max) * 180 - 20;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
            .join(' ');
        return `${line} L ${width} ${height} L 0 ${height} Z`;
    }
    static ɵfac = function AdminDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdminDashboardComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AdminDashboardComponent, selectors: [["ng-component"]], decls: 1, vars: 1, consts: [["emptyState", ""], ["class", "dashboard-shell", 4, "ngIf"], [1, "dashboard-shell"], [1, "section-head"], [1, "live-pill"], [1, "stats-grid"], ["class", "metric-card", 3, "blue", "green", "violet", "amber", 4, "ngFor", "ngForOf"], [1, "chart-grid"], [1, "chart-card"], [1, "card-head"], ["routerLink", "/tickets"], [1, "trend-wrap"], [1, "trend-chart"], ["class", "trend-grid-line", 4, "ngFor", "ngForOf"], ["viewBox", "0 0 600 240", "preserveAspectRatio", "none", 1, "trend-svg"], [1, "trend-area"], [1, "trend-line"], [1, "trend-labels"], [4, "ngFor", "ngForOf"], [1, "bar-list"], ["class", "bar-row", 4, "ngFor", "ngForOf"], [1, "list-card"], ["routerLink", "/tickets/new", 1, "inline-action"], ["class", "ticket-list", 4, "ngIf", "ngIfElse"], [1, "metric-card"], [1, "metric-top"], [1, "metric-icon"], [1, "metric-hint"], [1, "metric-label"], [1, "metric-value"], [1, "trend-grid-line"], [1, "bar-row"], [1, "bar-meta"], [1, "bar-track"], [1, "bar-fill"], [1, "ticket-list"], ["class", "ticket-row", 3, "routerLink", 4, "ngFor", "ngForOf"], [1, "ticket-row", 3, "routerLink"], [1, "ticket-main"], [1, "ticket-side"], [1, "status-pill", 3, "ngClass"], [1, "priority-pill", 3, "ngClass"], [1, "empty-state"]], template: function AdminDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, AdminDashboardComponent_section_0_Template, 50, 14, "section", 1);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.currentUser());
        } }, dependencies: [CommonModule, i1.NgClass, i1.NgForOf, i1.NgIf, i1.DatePipe, RouterLink, MatButtonModule, MatCardModule, i2.MatCard], styles: [".dashboard-shell[_ngcontent-%COMP%] { display: grid; gap: 24px; }\n    .section-head[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 16px;\n    }\n    .section-head[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n      margin: 0;\n      font-size: 44px;\n      color: #17366e;\n    }\n    .section-head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n      margin: 8px 0 0;\n      color: #64748b;\n      font-size: 16px;\n    }\n    .live-pill[_ngcontent-%COMP%] {\n      padding: 10px 16px;\n      border-radius: 12px;\n      background: #dcfce7;\n      color: #059669;\n      font-weight: 700;\n    }\n    .stats-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(4, 1fr);\n      gap: 18px;\n    }\n    .metric-card[_ngcontent-%COMP%] {\n      padding: 24px;\n      border-radius: 20px;\n      border: 1px solid #dfe7f4;\n      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);\n      background: #ffffff;\n    }\n    .metric-top[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 12px;\n      margin-bottom: 18px;\n    }\n    .metric-icon[_ngcontent-%COMP%] {\n      width: 52px;\n      height: 52px;\n      border-radius: 16px;\n      display: grid;\n      place-items: center;\n      color: #ffffff;\n      font-size: 20px;\n      font-weight: 800;\n    }\n    .metric-card.blue[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] { background: linear-gradient(135deg, #3b82f6, #2563eb); }\n    .metric-card.green[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] { background: linear-gradient(135deg, #10b981, #059669); }\n    .metric-card.violet[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }\n    .metric-card.amber[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] { background: linear-gradient(135deg, #f59e0b, #d97706); }\n    .metric-hint[_ngcontent-%COMP%] {\n      padding: 8px 12px;\n      border-radius: 999px;\n      background: #f8fafc;\n      color: #64748b;\n      font-size: 12px;\n      font-weight: 700;\n    }\n    .metric-label[_ngcontent-%COMP%] {\n      color: #48617f;\n      font-size: 15px;\n      margin-bottom: 8px;\n    }\n    .metric-value[_ngcontent-%COMP%] {\n      color: #17366e;\n      font-size: 42px;\n      font-weight: 800;\n    }\n    .chart-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: 1.6fr 0.9fr;\n      gap: 18px;\n    }\n    .chart-card[_ngcontent-%COMP%], .list-card[_ngcontent-%COMP%] {\n      padding: 24px;\n      border-radius: 20px;\n      border: 1px solid #dfe7f4;\n      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);\n      background: #ffffff;\n    }\n    .card-head[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: start;\n      gap: 14px;\n      margin-bottom: 20px;\n    }\n    .card-head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n      margin: 0;\n      font-size: 22px;\n      color: #17366e;\n    }\n    .card-head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n      margin: 6px 0 0;\n      color: #64748b;\n    }\n    .card-head[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], .inline-action[_ngcontent-%COMP%] {\n      color: #2563eb;\n      text-decoration: none;\n      font-weight: 700;\n    }\n    .trend-wrap[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 10px;\n    }\n    .trend-chart[_ngcontent-%COMP%] {\n      position: relative;\n      height: 280px;\n      border-radius: 18px;\n      background: linear-gradient(180deg, #f8fbff, #ffffff);\n      overflow: hidden;\n      border: 1px solid #e7edf7;\n    }\n    .trend-grid-line[_ngcontent-%COMP%] {\n      position: absolute;\n      left: 0;\n      right: 0;\n      height: 1px;\n      border-top: 1px dashed #d7e1ef;\n    }\n    .trend-grid-line[_ngcontent-%COMP%]:nth-child(1) { top: 20%; }\n    .trend-grid-line[_ngcontent-%COMP%]:nth-child(2) { top: 40%; }\n    .trend-grid-line[_ngcontent-%COMP%]:nth-child(3) { top: 60%; }\n    .trend-grid-line[_ngcontent-%COMP%]:nth-child(4) { top: 80%; }\n    .trend-svg[_ngcontent-%COMP%] {\n      width: 100%;\n      height: 100%;\n      display: block;\n    }\n    .trend-area[_ngcontent-%COMP%] {\n      fill: rgba(16, 185, 129, 0.18);\n    }\n    .trend-line[_ngcontent-%COMP%] {\n      fill: none;\n      stroke: #10b981;\n      stroke-width: 4;\n      stroke-linecap: round;\n      stroke-linejoin: round;\n    }\n    .trend-labels[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(6, 1fr);\n      color: #94a3b8;\n      font-size: 12px;\n      text-align: center;\n    }\n    .bar-list[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 20px;\n    }\n    .bar-meta[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      gap: 12px;\n      margin-bottom: 8px;\n      color: #334155;\n    }\n    .bar-track[_ngcontent-%COMP%] {\n      height: 12px;\n      border-radius: 999px;\n      background: #eef2f7;\n      overflow: hidden;\n    }\n    .bar-fill[_ngcontent-%COMP%] {\n      height: 100%;\n      border-radius: inherit;\n    }\n    .bar-fill.open[_ngcontent-%COMP%] { background: linear-gradient(135deg, #3b82f6, #2563eb); }\n    .bar-fill.progress[_ngcontent-%COMP%] { background: linear-gradient(135deg, #f59e0b, #d97706); }\n    .bar-fill.closed[_ngcontent-%COMP%] { background: linear-gradient(135deg, #10b981, #059669); }\n    .ticket-list[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 12px;\n    }\n    .ticket-row[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      gap: 16px;\n      align-items: center;\n      padding: 16px 18px;\n      border-radius: 16px;\n      border: 1px solid #e5ebf5;\n      text-decoration: none;\n      color: inherit;\n      background: #fbfcff;\n    }\n    .ticket-main[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 6px;\n    }\n    .ticket-main[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n      color: #1e293b;\n      font-size: 16px;\n    }\n    .ticket-main[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n      color: #64748b;\n      font-size: 13px;\n    }\n    .ticket-side[_ngcontent-%COMP%] {\n      display: flex;\n      gap: 10px;\n      flex-wrap: wrap;\n      justify-content: flex-end;\n    }\n    .empty-state[_ngcontent-%COMP%] {\n      padding: 18px;\n      border-radius: 16px;\n      border: 1px dashed #d7e1ef;\n      background: #fbfcff;\n    }\n    .empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n      margin-top: 0;\n      color: #17366e;\n    }\n    .empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n      margin-bottom: 0;\n      color: #64748b;\n    }\n    @media (max-width: 1200px) {\n      .stats-grid[_ngcontent-%COMP%] { grid-template-columns: repeat(2, 1fr); }\n      .chart-grid[_ngcontent-%COMP%] { grid-template-columns: 1fr; }\n    }\n    @media (max-width: 720px) {\n      .section-head[_ngcontent-%COMP%] {\n        flex-direction: column;\n        align-items: stretch;\n      }\n      .section-head[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n        font-size: 36px;\n      }\n      .stats-grid[_ngcontent-%COMP%] { grid-template-columns: 1fr; }\n      .ticket-row[_ngcontent-%COMP%] {\n        flex-direction: column;\n        align-items: stretch;\n      }\n      .ticket-side[_ngcontent-%COMP%] {\n        justify-content: flex-start;\n      }\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdminDashboardComponent, [{
        type: Component,
        args: [{ standalone: true, imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule], template: `
    <section class="dashboard-shell" *ngIf="currentUser() as user">
      <div class="section-head">
        <div>
          <h1>Dashboard</h1>
          <p>{{ isStaff() ? 'Support operations overview' : 'Your support activity overview' }}</p>
        </div>
        <div class="live-pill">Live Data</div>
      </div>

      <div class="stats-grid">
        <mat-card class="metric-card" [class.blue]="card.tone === 'blue'" [class.green]="card.tone === 'green'" [class.violet]="card.tone === 'violet'" [class.amber]="card.tone === 'amber'" *ngFor="let card of summaryCards">
          <div class="metric-top">
            <div class="metric-icon">{{ card.label.charAt(0) }}</div>
            <div class="metric-hint">{{ card.hint }}</div>
          </div>
          <div class="metric-label">{{ card.label }}</div>
          <div class="metric-value">{{ card.value }}</div>
        </mat-card>
      </div>

      <div class="chart-grid">
        <mat-card class="chart-card">
          <div class="card-head">
            <div>
              <h2>Ticket Activity</h2>
              <p>Recent activity across the latest visible tickets.</p>
            </div>
            <a routerLink="/tickets">Open queue</a>
          </div>

          <div class="trend-wrap">
            <div class="trend-chart">
              <div class="trend-grid-line" *ngFor="let _ of [1,2,3,4]"></div>
              <svg viewBox="0 0 600 240" preserveAspectRatio="none" class="trend-svg">
                <path [attr.d]="trendAreaPath" class="trend-area"></path>
                <path [attr.d]="trendLinePath" class="trend-line"></path>
              </svg>
            </div>
            <div class="trend-labels">
              <div *ngFor="let point of trendSeries">{{ point.label }}</div>
            </div>
          </div>
        </mat-card>

        <mat-card class="chart-card">
          <div class="card-head">
            <div>
              <h2>Status Breakdown</h2>
              <p>{{ isStaff() ? 'Current queue mix' : 'Your ticket mix' }}</p>
            </div>
          </div>

          <div class="bar-list">
            <div class="bar-row" *ngFor="let item of statusBars">
              <div class="bar-meta">
                <strong>{{ item.label }}</strong>
                <span>{{ item.value }}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" [class.open]="item.tone === 'open'" [class.progress]="item.tone === 'progress'" [class.closed]="item.tone === 'closed'" [style.width.%]="item.percent"></div>
              </div>
            </div>
          </div>
        </mat-card>
      </div>

      <mat-card class="list-card">
        <div class="card-head">
          <div>
            <h2>{{ isStaff() ? 'Recent Ticket Activity' : 'Recent Requests' }}</h2>
            <p>{{ isStaff() ? 'Most recently updated tickets in your visible queue.' : 'Your latest ticket updates and current status.' }}</p>
          </div>
          <a routerLink="/tickets/new" class="inline-action">{{ isStaff() ? 'Create internal ticket' : 'Create ticket' }}</a>
        </div>

        <div class="ticket-list" *ngIf="recentTickets.length; else emptyState">
          <a class="ticket-row" *ngFor="let ticket of recentTickets" [routerLink]="['/tickets', ticket.id]">
            <div class="ticket-main">
              <strong>{{ ticket.title }}</strong>
              <span>#{{ ticket.id }} · {{ ticket.updated_at | date:'mediumDate' }}</span>
            </div>
            <div class="ticket-side">
              <span class="status-pill" [ngClass]="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
              <span class="priority-pill" [ngClass]="ticket.priority">{{ ticket.priority }}</span>
            </div>
          </a>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <h3>No tickets yet</h3>
            <p>{{ isStaff() ? 'Once new tickets are created, they will appear here.' : 'Create your first ticket to start the conversation.' }}</p>
          </div>
        </ng-template>
      </mat-card>
    </section>
  `, styles: ["\n    .dashboard-shell { display: grid; gap: 24px; }\n    .section-head {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 16px;\n    }\n    .section-head h1 {\n      margin: 0;\n      font-size: 44px;\n      color: #17366e;\n    }\n    .section-head p {\n      margin: 8px 0 0;\n      color: #64748b;\n      font-size: 16px;\n    }\n    .live-pill {\n      padding: 10px 16px;\n      border-radius: 12px;\n      background: #dcfce7;\n      color: #059669;\n      font-weight: 700;\n    }\n    .stats-grid {\n      display: grid;\n      grid-template-columns: repeat(4, 1fr);\n      gap: 18px;\n    }\n    .metric-card {\n      padding: 24px;\n      border-radius: 20px;\n      border: 1px solid #dfe7f4;\n      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);\n      background: #ffffff;\n    }\n    .metric-top {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 12px;\n      margin-bottom: 18px;\n    }\n    .metric-icon {\n      width: 52px;\n      height: 52px;\n      border-radius: 16px;\n      display: grid;\n      place-items: center;\n      color: #ffffff;\n      font-size: 20px;\n      font-weight: 800;\n    }\n    .metric-card.blue .metric-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); }\n    .metric-card.green .metric-icon { background: linear-gradient(135deg, #10b981, #059669); }\n    .metric-card.violet .metric-icon { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }\n    .metric-card.amber .metric-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }\n    .metric-hint {\n      padding: 8px 12px;\n      border-radius: 999px;\n      background: #f8fafc;\n      color: #64748b;\n      font-size: 12px;\n      font-weight: 700;\n    }\n    .metric-label {\n      color: #48617f;\n      font-size: 15px;\n      margin-bottom: 8px;\n    }\n    .metric-value {\n      color: #17366e;\n      font-size: 42px;\n      font-weight: 800;\n    }\n    .chart-grid {\n      display: grid;\n      grid-template-columns: 1.6fr 0.9fr;\n      gap: 18px;\n    }\n    .chart-card, .list-card {\n      padding: 24px;\n      border-radius: 20px;\n      border: 1px solid #dfe7f4;\n      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);\n      background: #ffffff;\n    }\n    .card-head {\n      display: flex;\n      justify-content: space-between;\n      align-items: start;\n      gap: 14px;\n      margin-bottom: 20px;\n    }\n    .card-head h2 {\n      margin: 0;\n      font-size: 22px;\n      color: #17366e;\n    }\n    .card-head p {\n      margin: 6px 0 0;\n      color: #64748b;\n    }\n    .card-head a, .inline-action {\n      color: #2563eb;\n      text-decoration: none;\n      font-weight: 700;\n    }\n    .trend-wrap {\n      display: grid;\n      gap: 10px;\n    }\n    .trend-chart {\n      position: relative;\n      height: 280px;\n      border-radius: 18px;\n      background: linear-gradient(180deg, #f8fbff, #ffffff);\n      overflow: hidden;\n      border: 1px solid #e7edf7;\n    }\n    .trend-grid-line {\n      position: absolute;\n      left: 0;\n      right: 0;\n      height: 1px;\n      border-top: 1px dashed #d7e1ef;\n    }\n    .trend-grid-line:nth-child(1) { top: 20%; }\n    .trend-grid-line:nth-child(2) { top: 40%; }\n    .trend-grid-line:nth-child(3) { top: 60%; }\n    .trend-grid-line:nth-child(4) { top: 80%; }\n    .trend-svg {\n      width: 100%;\n      height: 100%;\n      display: block;\n    }\n    .trend-area {\n      fill: rgba(16, 185, 129, 0.18);\n    }\n    .trend-line {\n      fill: none;\n      stroke: #10b981;\n      stroke-width: 4;\n      stroke-linecap: round;\n      stroke-linejoin: round;\n    }\n    .trend-labels {\n      display: grid;\n      grid-template-columns: repeat(6, 1fr);\n      color: #94a3b8;\n      font-size: 12px;\n      text-align: center;\n    }\n    .bar-list {\n      display: grid;\n      gap: 20px;\n    }\n    .bar-meta {\n      display: flex;\n      justify-content: space-between;\n      gap: 12px;\n      margin-bottom: 8px;\n      color: #334155;\n    }\n    .bar-track {\n      height: 12px;\n      border-radius: 999px;\n      background: #eef2f7;\n      overflow: hidden;\n    }\n    .bar-fill {\n      height: 100%;\n      border-radius: inherit;\n    }\n    .bar-fill.open { background: linear-gradient(135deg, #3b82f6, #2563eb); }\n    .bar-fill.progress { background: linear-gradient(135deg, #f59e0b, #d97706); }\n    .bar-fill.closed { background: linear-gradient(135deg, #10b981, #059669); }\n    .ticket-list {\n      display: grid;\n      gap: 12px;\n    }\n    .ticket-row {\n      display: flex;\n      justify-content: space-between;\n      gap: 16px;\n      align-items: center;\n      padding: 16px 18px;\n      border-radius: 16px;\n      border: 1px solid #e5ebf5;\n      text-decoration: none;\n      color: inherit;\n      background: #fbfcff;\n    }\n    .ticket-main {\n      display: grid;\n      gap: 6px;\n    }\n    .ticket-main strong {\n      color: #1e293b;\n      font-size: 16px;\n    }\n    .ticket-main span {\n      color: #64748b;\n      font-size: 13px;\n    }\n    .ticket-side {\n      display: flex;\n      gap: 10px;\n      flex-wrap: wrap;\n      justify-content: flex-end;\n    }\n    .empty-state {\n      padding: 18px;\n      border-radius: 16px;\n      border: 1px dashed #d7e1ef;\n      background: #fbfcff;\n    }\n    .empty-state h3 {\n      margin-top: 0;\n      color: #17366e;\n    }\n    .empty-state p {\n      margin-bottom: 0;\n      color: #64748b;\n    }\n    @media (max-width: 1200px) {\n      .stats-grid { grid-template-columns: repeat(2, 1fr); }\n      .chart-grid { grid-template-columns: 1fr; }\n    }\n    @media (max-width: 720px) {\n      .section-head {\n        flex-direction: column;\n        align-items: stretch;\n      }\n      .section-head h1 {\n        font-size: 36px;\n      }\n      .stats-grid { grid-template-columns: 1fr; }\n      .ticket-row {\n        flex-direction: column;\n        align-items: stretch;\n      }\n      .ticket-side {\n        justify-content: flex-start;\n      }\n    }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AdminDashboardComponent, { className: "AdminDashboardComponent", filePath: "src/app/features/dashboard/admin-dashboard.component.ts", lineNumber: 375 }); })();
//# sourceMappingURL=admin-dashboard.component.js.map