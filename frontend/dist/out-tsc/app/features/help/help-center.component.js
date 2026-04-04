import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/material/card";
function HelpCenterComponent_ul_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ul")(1, "li");
    i0.ɵɵtext(2, "Claim ownership early for unassigned tickets.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "li");
    i0.ɵɵtext(4, "Use internal notes for staff-only coordination.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "li");
    i0.ɵɵtext(6, "Keep ticket status accurate so the dashboard stays useful.");
    i0.ɵɵelementEnd()();
} }
function HelpCenterComponent_ng_template_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ul")(1, "li");
    i0.ɵɵtext(2, "Include error text, screenshots, and expected behavior.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "li");
    i0.ɵɵtext(4, "Use one ticket per issue so history stays clean.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "li");
    i0.ɵɵtext(6, "Watch your email and dashboard for OTP or ticket updates.");
    i0.ɵɵelementEnd()();
} }
export class HelpCenterComponent {
    auth = inject(AuthService);
    isStaff = computed(() => ['admin', 'agent'].includes(this.auth.user()?.role ?? ''));
    static ɵfac = function HelpCenterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HelpCenterComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: HelpCenterComponent, selectors: [["ng-component"]], decls: 57, vars: 5, consts: [["customerTips", ""], [1, "help-shell"], [1, "section-header"], [1, "chip"], [1, "intro"], ["mat-flat-button", "", "color", "primary", "routerLink", "/tickets/new"], [1, "guide-grid"], [1, "guide-card"], [4, "ngIf", "ngIfElse"], [1, "priority-list"], [1, "priority-pill", "low"], [1, "priority-pill", "medium"], [1, "priority-pill", "high"], [1, "action-stack"], ["routerLink", "/dashboard", 1, "action-link"], ["routerLink", "/tickets", 1, "action-link"], ["routerLink", "/profile", 1, "action-link"]], template: function HelpCenterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 1)(1, "div", 2)(2, "div")(3, "div", 3);
            i0.ɵɵtext(4, "Help Center");
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
            i0.ɵɵelementStart(11, "div", 6)(12, "mat-card", 7)(13, "h2");
            i0.ɵɵtext(14, "How the flow works");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "ul")(16, "li");
            i0.ɵɵtext(17, "Create a ticket with a clear title and useful description.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "li");
            i0.ɵɵtext(19, "Track the ticket from open to in progress to closed.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "li");
            i0.ɵɵtext(21, "Add comments instead of creating duplicate requests.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(22, "mat-card", 7)(23, "h2");
            i0.ɵɵtext(24);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(25, HelpCenterComponent_ul_25_Template, 7, 0, "ul", 8)(26, HelpCenterComponent_ng_template_26_Template, 7, 0, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "mat-card", 7)(29, "h2");
            i0.ɵɵtext(30, "Priority guide");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "div", 9)(32, "div")(33, "span", 10);
            i0.ɵɵtext(34, "Low");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "p");
            i0.ɵɵtext(36, "General questions or non-blocking issues.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(37, "div")(38, "span", 11);
            i0.ɵɵtext(39, "Medium");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "p");
            i0.ɵɵtext(41, "Important issues with manageable workarounds.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(42, "div")(43, "span", 12);
            i0.ɵɵtext(44, "High");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "p");
            i0.ɵɵtext(46, "Blocking issues needing urgent attention.");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(47, "mat-card", 7)(48, "h2");
            i0.ɵɵtext(49, "Useful actions");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "div", 13)(51, "a", 14);
            i0.ɵɵtext(52, "Go to Dashboard");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(53, "a", 15);
            i0.ɵɵtext(54, "Open Ticket Center");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "a", 16);
            i0.ɵɵtext(56, "Review Profile");
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            const customerTips_r1 = i0.ɵɵreference(27);
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(ctx.isStaff() ? "Support operations guide" : "Need help using the portal?");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.isStaff() ? "Quick operating notes for support agents and admins handling the queue." : "Everything customers need to create better tickets and get faster responses.", " ");
            i0.ɵɵadvance(16);
            i0.ɵɵtextInterpolate(ctx.isStaff() ? "Staff best practices" : "How to get faster support");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.isStaff())("ngIfElse", customerTips_r1);
        } }, dependencies: [CommonModule, i1.NgIf, RouterLink, MatButtonModule, i2.MatAnchor, MatCardModule, i3.MatCard], styles: [".help-shell[_ngcontent-%COMP%] { display: grid; gap: 22px; }\n    .intro[_ngcontent-%COMP%] { margin: 10px 0 0; color: var(--muted); max-width: 64ch; line-height: 1.6; }\n    .guide-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(2, 1fr);\n      gap: 18px;\n    }\n    .guide-card[_ngcontent-%COMP%] {\n      padding: 24px;\n      border-radius: 20px;\n      border: 1px solid var(--border);\n      background: #ffffff;\n      box-shadow: var(--shadow);\n    }\n    .guide-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n      margin-top: 0;\n      color: #17366e;\n    }\n    ul[_ngcontent-%COMP%] {\n      margin: 16px 0 0;\n      padding-left: 20px;\n      color: var(--muted);\n      line-height: 1.8;\n    }\n    .priority-list[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 14px;\n      margin-top: 16px;\n    }\n    .priority-list[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 8px;\n    }\n    .priority-list[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n      margin: 0;\n      color: var(--muted);\n    }\n    .action-stack[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 12px;\n      margin-top: 16px;\n    }\n    .action-link[_ngcontent-%COMP%] {\n      padding: 14px 16px;\n      border-radius: 14px;\n      border: 1px solid #dbe4f0;\n      background: #f8fbff;\n      color: #2563eb;\n      text-decoration: none;\n      font-weight: 700;\n    }\n    @media (max-width: 860px) {\n      .guide-grid[_ngcontent-%COMP%] { grid-template-columns: 1fr; }\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HelpCenterComponent, [{
        type: Component,
        args: [{ standalone: true, imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule], template: `
    <section class="help-shell">
      <div class="section-header">
        <div>
          <div class="chip">Help Center</div>
          <h1>{{ isStaff() ? 'Support operations guide' : 'Need help using the portal?' }}</h1>
          <p class="intro">
            {{ isStaff()
              ? 'Quick operating notes for support agents and admins handling the queue.'
              : 'Everything customers need to create better tickets and get faster responses.' }}
          </p>
        </div>
        <a mat-flat-button color="primary" routerLink="/tickets/new">Create Ticket</a>
      </div>

      <div class="guide-grid">
        <mat-card class="guide-card">
          <h2>How the flow works</h2>
          <ul>
            <li>Create a ticket with a clear title and useful description.</li>
            <li>Track the ticket from open to in progress to closed.</li>
            <li>Add comments instead of creating duplicate requests.</li>
          </ul>
        </mat-card>

        <mat-card class="guide-card">
          <h2>{{ isStaff() ? 'Staff best practices' : 'How to get faster support' }}</h2>
          <ul *ngIf="isStaff(); else customerTips">
            <li>Claim ownership early for unassigned tickets.</li>
            <li>Use internal notes for staff-only coordination.</li>
            <li>Keep ticket status accurate so the dashboard stays useful.</li>
          </ul>
          <ng-template #customerTips>
            <ul>
              <li>Include error text, screenshots, and expected behavior.</li>
              <li>Use one ticket per issue so history stays clean.</li>
              <li>Watch your email and dashboard for OTP or ticket updates.</li>
            </ul>
          </ng-template>
        </mat-card>

        <mat-card class="guide-card">
          <h2>Priority guide</h2>
          <div class="priority-list">
            <div><span class="priority-pill low">Low</span><p>General questions or non-blocking issues.</p></div>
            <div><span class="priority-pill medium">Medium</span><p>Important issues with manageable workarounds.</p></div>
            <div><span class="priority-pill high">High</span><p>Blocking issues needing urgent attention.</p></div>
          </div>
        </mat-card>

        <mat-card class="guide-card">
          <h2>Useful actions</h2>
          <div class="action-stack">
            <a routerLink="/dashboard" class="action-link">Go to Dashboard</a>
            <a routerLink="/tickets" class="action-link">Open Ticket Center</a>
            <a routerLink="/profile" class="action-link">Review Profile</a>
          </div>
        </mat-card>
      </div>
    </section>
  `, styles: ["\n    .help-shell { display: grid; gap: 22px; }\n    .intro { margin: 10px 0 0; color: var(--muted); max-width: 64ch; line-height: 1.6; }\n    .guide-grid {\n      display: grid;\n      grid-template-columns: repeat(2, 1fr);\n      gap: 18px;\n    }\n    .guide-card {\n      padding: 24px;\n      border-radius: 20px;\n      border: 1px solid var(--border);\n      background: #ffffff;\n      box-shadow: var(--shadow);\n    }\n    .guide-card h2 {\n      margin-top: 0;\n      color: #17366e;\n    }\n    ul {\n      margin: 16px 0 0;\n      padding-left: 20px;\n      color: var(--muted);\n      line-height: 1.8;\n    }\n    .priority-list {\n      display: grid;\n      gap: 14px;\n      margin-top: 16px;\n    }\n    .priority-list div {\n      display: grid;\n      gap: 8px;\n    }\n    .priority-list p {\n      margin: 0;\n      color: var(--muted);\n    }\n    .action-stack {\n      display: grid;\n      gap: 12px;\n      margin-top: 16px;\n    }\n    .action-link {\n      padding: 14px 16px;\n      border-radius: 14px;\n      border: 1px solid #dbe4f0;\n      background: #f8fbff;\n      color: #2563eb;\n      text-decoration: none;\n      font-weight: 700;\n    }\n    @media (max-width: 860px) {\n      .guide-grid { grid-template-columns: 1fr; }\n    }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(HelpCenterComponent, { className: "HelpCenterComponent", filePath: "src/app/features/help/help-center.component.ts", lineNumber: 130 }); })();
//# sourceMappingURL=help-center.component.js.map