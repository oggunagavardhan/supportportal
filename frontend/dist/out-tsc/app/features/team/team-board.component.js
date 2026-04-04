import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TicketService } from '../../core/services/ticket.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/card";
function TeamBoardComponent_div_29_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 16)(1, "div")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "titlecase");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 17);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const member_r1 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(member_r1.user.full_name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind1(6, 4, member_r1.user.role), " \u00B7 ", member_r1.user.email, "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", member_r1.assignedCount, " assigned");
} }
function TeamBoardComponent_div_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵtemplate(1, TeamBoardComponent_div_29_div_1_Template, 9, 6, "div", 15);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.memberSummaries);
} }
function TeamBoardComponent_ng_template_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 18);
    i0.ɵɵtext(1, "No staff records available.");
    i0.ɵɵelementEnd();
} }
export class TeamBoardComponent {
    auth = inject(AuthService);
    ticketService = inject(TicketService);
    staff = [];
    tickets = [];
    memberSummaries = [];
    unassignedCount = 0;
    constructor() {
        forkJoin({
            staff: this.auth.getStaffUsers(),
            tickets: this.ticketService.list({ page: 1 }),
        }).subscribe(({ staff, tickets }) => {
            this.staff = staff;
            this.tickets = tickets.results;
            this.unassignedCount = tickets.results.filter((ticket) => !ticket.assigned_to).length;
            this.memberSummaries = staff.map((user) => ({
                user,
                assignedCount: tickets.results.filter((ticket) => ticket.assigned_to?.id === user.id).length,
            }));
        });
    }
    static ɵfac = function TeamBoardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TeamBoardComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TeamBoardComponent, selectors: [["ng-component"]], decls: 42, vars: 5, consts: [["noStaff", ""], [1, "team-shell"], [1, "section-header"], [1, "chip"], [1, "intro"], [1, "metrics"], [1, "metric-card"], [1, "metric-label"], [1, "metric-value"], [1, "team-grid"], [1, "team-card"], ["class", "member-list", 4, "ngIf", "ngIfElse"], [1, "note-list"], [1, "note-item"], [1, "member-list"], ["class", "member-row", 4, "ngFor", "ngForOf"], [1, "member-row"], [1, "member-count"], [1, "empty"]], template: function TeamBoardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 1)(1, "div", 2)(2, "div")(3, "div", 3);
            i0.ɵɵtext(4, "Team Board");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h1");
            i0.ɵɵtext(6, "Support team snapshot");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 4);
            i0.ɵɵtext(8, "A quick view of active staff and how the visible queue is distributed.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(9, "div", 5)(10, "mat-card", 6)(11, "div", 7);
            i0.ɵɵtext(12, "Staff Members");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "div", 8);
            i0.ɵɵtext(14);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "mat-card", 6)(16, "div", 7);
            i0.ɵɵtext(17, "Visible Tickets");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div", 8);
            i0.ɵɵtext(19);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(20, "mat-card", 6)(21, "div", 7);
            i0.ɵɵtext(22, "Unassigned");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "div", 8);
            i0.ɵɵtext(24);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(25, "div", 9)(26, "mat-card", 10)(27, "h2");
            i0.ɵɵtext(28, "Staff Directory");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(29, TeamBoardComponent_div_29_Template, 2, 1, "div", 11)(30, TeamBoardComponent_ng_template_30_Template, 2, 0, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "mat-card", 10)(33, "h2");
            i0.ɵɵtext(34, "Queue Notes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "div", 12)(36, "div", 13);
            i0.ɵɵtext(37, "Unassigned tickets should be claimed quickly to reduce queue drift.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "div", 13);
            i0.ɵɵtext(39, "Use internal notes for staff coordination rather than customer-visible comments.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "div", 13);
            i0.ɵɵtext(41, "Keep ticket statuses fresh so the dashboard metrics remain trustworthy.");
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            const noStaff_r3 = i0.ɵɵreference(31);
            i0.ɵɵadvance(14);
            i0.ɵɵtextInterpolate(ctx.staff.length);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.tickets.length);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.unassignedCount);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngIf", ctx.memberSummaries.length)("ngIfElse", noStaff_r3);
        } }, dependencies: [CommonModule, i1.NgForOf, i1.NgIf, i1.TitleCasePipe, MatCardModule, i2.MatCard], styles: [".team-shell[_ngcontent-%COMP%] { display: grid; gap: 22px; }\n    .intro[_ngcontent-%COMP%] { margin: 10px 0 0; color: var(--muted); max-width: 60ch; line-height: 1.6; }\n    .metrics[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(3, 1fr);\n      gap: 16px;\n    }\n    .metric-card[_ngcontent-%COMP%], .team-card[_ngcontent-%COMP%] {\n      padding: 24px;\n      border-radius: 20px;\n      border: 1px solid var(--border);\n      background: #ffffff;\n      box-shadow: var(--shadow);\n    }\n    .metric-label[_ngcontent-%COMP%] { color: var(--muted); }\n    .metric-value[_ngcontent-%COMP%] {\n      margin-top: 12px;\n      font-size: 38px;\n      font-weight: 800;\n      color: #17366e;\n    }\n    .team-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: 1.2fr 0.8fr;\n      gap: 18px;\n    }\n    .team-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n      margin-top: 0;\n      color: #17366e;\n    }\n    .member-list[_ngcontent-%COMP%], .note-list[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 12px;\n      margin-top: 16px;\n    }\n    .member-row[_ngcontent-%COMP%], .note-item[_ngcontent-%COMP%] {\n      padding: 16px;\n      border-radius: 16px;\n      border: 1px solid #e4e9f2;\n      background: #f8fbff;\n    }\n    .member-row[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      gap: 14px;\n      align-items: center;\n    }\n    .member-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n      color: #1e293b;\n    }\n    .member-row[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n      color: var(--muted);\n    }\n    .member-count[_ngcontent-%COMP%] {\n      font-weight: 700;\n      color: #2563eb;\n      white-space: nowrap;\n    }\n    .empty[_ngcontent-%COMP%] {\n      color: var(--muted);\n      margin-bottom: 0;\n    }\n    @media (max-width: 960px) {\n      .metrics[_ngcontent-%COMP%], .team-grid[_ngcontent-%COMP%] { grid-template-columns: 1fr; }\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TeamBoardComponent, [{
        type: Component,
        args: [{ standalone: true, imports: [CommonModule, MatCardModule], template: `
    <section class="team-shell">
      <div class="section-header">
        <div>
          <div class="chip">Team Board</div>
          <h1>Support team snapshot</h1>
          <p class="intro">A quick view of active staff and how the visible queue is distributed.</p>
        </div>
      </div>

      <div class="metrics">
        <mat-card class="metric-card">
          <div class="metric-label">Staff Members</div>
          <div class="metric-value">{{ staff.length }}</div>
        </mat-card>
        <mat-card class="metric-card">
          <div class="metric-label">Visible Tickets</div>
          <div class="metric-value">{{ tickets.length }}</div>
        </mat-card>
        <mat-card class="metric-card">
          <div class="metric-label">Unassigned</div>
          <div class="metric-value">{{ unassignedCount }}</div>
        </mat-card>
      </div>

      <div class="team-grid">
        <mat-card class="team-card">
          <h2>Staff Directory</h2>
          <div class="member-list" *ngIf="memberSummaries.length; else noStaff">
            <div class="member-row" *ngFor="let member of memberSummaries">
              <div>
                <strong>{{ member.user.full_name }}</strong>
                <div>{{ member.user.role | titlecase }} · {{ member.user.email }}</div>
              </div>
              <div class="member-count">{{ member.assignedCount }} assigned</div>
            </div>
          </div>
          <ng-template #noStaff>
            <p class="empty">No staff records available.</p>
          </ng-template>
        </mat-card>

        <mat-card class="team-card">
          <h2>Queue Notes</h2>
          <div class="note-list">
            <div class="note-item">Unassigned tickets should be claimed quickly to reduce queue drift.</div>
            <div class="note-item">Use internal notes for staff coordination rather than customer-visible comments.</div>
            <div class="note-item">Keep ticket statuses fresh so the dashboard metrics remain trustworthy.</div>
          </div>
        </mat-card>
      </div>
    </section>
  `, styles: ["\n    .team-shell { display: grid; gap: 22px; }\n    .intro { margin: 10px 0 0; color: var(--muted); max-width: 60ch; line-height: 1.6; }\n    .metrics {\n      display: grid;\n      grid-template-columns: repeat(3, 1fr);\n      gap: 16px;\n    }\n    .metric-card, .team-card {\n      padding: 24px;\n      border-radius: 20px;\n      border: 1px solid var(--border);\n      background: #ffffff;\n      box-shadow: var(--shadow);\n    }\n    .metric-label { color: var(--muted); }\n    .metric-value {\n      margin-top: 12px;\n      font-size: 38px;\n      font-weight: 800;\n      color: #17366e;\n    }\n    .team-grid {\n      display: grid;\n      grid-template-columns: 1.2fr 0.8fr;\n      gap: 18px;\n    }\n    .team-card h2 {\n      margin-top: 0;\n      color: #17366e;\n    }\n    .member-list, .note-list {\n      display: grid;\n      gap: 12px;\n      margin-top: 16px;\n    }\n    .member-row, .note-item {\n      padding: 16px;\n      border-radius: 16px;\n      border: 1px solid #e4e9f2;\n      background: #f8fbff;\n    }\n    .member-row {\n      display: flex;\n      justify-content: space-between;\n      gap: 14px;\n      align-items: center;\n    }\n    .member-row strong {\n      color: #1e293b;\n    }\n    .member-row div {\n      color: var(--muted);\n    }\n    .member-count {\n      font-weight: 700;\n      color: #2563eb;\n      white-space: nowrap;\n    }\n    .empty {\n      color: var(--muted);\n      margin-bottom: 0;\n    }\n    @media (max-width: 960px) {\n      .metrics, .team-grid { grid-template-columns: 1fr; }\n    }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TeamBoardComponent, { className: "TeamBoardComponent", filePath: "src/app/features/team/team-board.component.ts", lineNumber: 140 }); })();
//# sourceMappingURL=team-board.component.js.map