import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/button";
function AppShellComponent_div_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 23)(1, "div", 24);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "a", 25);
    i0.ɵɵtext(4, "Create Ticket");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 26)(6, "div", 27);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 28)(9, "strong");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵpipe(13, "titlecase");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const currentUser_r1 = ctx.ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.currentSection());
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.initials(currentUser_r1.full_name));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(currentUser_r1.full_name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(13, 4, currentUser_r1.role));
} }
function AppShellComponent_a_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 29)(1, "span", 13);
    i0.ɵɵtext(2, "M");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "Team");
    i0.ɵɵelementEnd()();
} }
function AppShellComponent_div_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30)(1, "div", 31);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "strong");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const currentUser_r3 = ctx.ngIf;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.initials(currentUser_r3.full_name));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(currentUser_r3.full_name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(currentUser_r3.email);
} }
export class AppShellComponent {
    auth = inject(AuthService);
    router = inject(Router);
    destroyRef = inject(DestroyRef);
    user = this.auth.user;
    isStaff = computed(() => ['admin', 'agent'].includes(this.auth.user()?.role ?? ''));
    currentSection = signal(this.getSectionLabel(this.router.url));
    constructor() {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
            this.currentSection.set(this.getSectionLabel(event.urlAfterRedirects));
        });
    }
    logout() {
        this.auth.logout();
    }
    initials(fullName) {
        return fullName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join('');
    }
    getSectionLabel(url) {
        if (url.includes('/tickets'))
            return 'Tickets';
        if (url.includes('/team'))
            return 'Team';
        if (url.includes('/help'))
            return 'Help';
        if (url.includes('/settings'))
            return 'Settings';
        if (url.includes('/profile'))
            return 'Profile';
        return 'Dashboard';
    }
    static ɵfac = function AppShellComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppShellComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppShellComponent, selectors: [["app-shell"]], decls: 48, vars: 4, consts: [[1, "workspace-shell"], [1, "topbar"], [1, "topbar-left"], ["type", "button", "aria-label", "Navigation", 1, "menu-chip"], [1, "brand-mark"], [1, "brand-copy"], [1, "brand-name"], [1, "brand-subtitle"], ["class", "topbar-right", 4, "ngIf"], [1, "workspace-body"], [1, "sidebar"], [1, "nav"], ["routerLink", "/dashboard", "routerLinkActive", "active"], [1, "nav-icon"], ["routerLink", "/tickets", "routerLinkActive", "active"], ["routerLink", "/team", "routerLinkActive", "active", 4, "ngIf"], ["routerLink", "/help", "routerLinkActive", "active"], ["routerLink", "/settings", "routerLinkActive", "active"], ["routerLink", "/profile", "routerLinkActive", "active"], [1, "sidebar-footer"], ["class", "footer-card", 4, "ngIf"], ["mat-stroked-button", "", "color", "primary", 1, "logout", 3, "click"], [1, "content", "page-shell"], [1, "topbar-right"], [1, "route-pill"], ["mat-stroked-button", "", "routerLink", "/tickets/new", 1, "top-action"], [1, "profile-chip"], [1, "profile-avatar"], [1, "profile-text"], ["routerLink", "/team", "routerLinkActive", "active"], [1, "footer-card"], [1, "footer-mark"]], template: function AppShellComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "header", 1)(2, "div", 2)(3, "button", 3);
            i0.ɵɵtext(4, "|||");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div", 4);
            i0.ɵɵtext(6, "S");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "div", 5)(8, "div", 6);
            i0.ɵɵtext(9, "Support Portal");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "div", 7);
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(12, AppShellComponent_div_12_Template, 14, 6, "div", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "div", 9)(14, "aside", 10)(15, "nav", 11)(16, "a", 12)(17, "span", 13);
            i0.ɵɵtext(18, "D");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "span");
            i0.ɵɵtext(20, "Dashboard");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(21, "a", 14)(22, "span", 13);
            i0.ɵɵtext(23, "T");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "span");
            i0.ɵɵtext(25, "Tickets");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(26, AppShellComponent_a_26_Template, 5, 0, "a", 15);
            i0.ɵɵelementStart(27, "a", 16)(28, "span", 13);
            i0.ɵɵtext(29, "H");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "span");
            i0.ɵɵtext(31, "Help");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(32, "a", 17)(33, "span", 13);
            i0.ɵɵtext(34, "S");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "span");
            i0.ɵɵtext(36, "Settings");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(37, "a", 18)(38, "span", 13);
            i0.ɵɵtext(39, "P");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "span");
            i0.ɵɵtext(41, "Profile");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(42, "div", 19);
            i0.ɵɵtemplate(43, AppShellComponent_div_43_Template, 8, 3, "div", 20);
            i0.ɵɵelementStart(44, "button", 21);
            i0.ɵɵlistener("click", function AppShellComponent_Template_button_click_44_listener() { return ctx.logout(); });
            i0.ɵɵtext(45, "Logout");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(46, "main", 22);
            i0.ɵɵelement(47, "router-outlet");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(ctx.isStaff() ? "Support operations excellence" : "Customer support workspace");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.user());
            i0.ɵɵadvance(14);
            i0.ɵɵproperty("ngIf", ctx.isStaff());
            i0.ɵɵadvance(17);
            i0.ɵɵproperty("ngIf", ctx.user());
        } }, dependencies: [CommonModule, i1.NgIf, i1.TitleCasePipe, RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, i2.MatAnchor, i2.MatButton], styles: [".workspace-shell[_ngcontent-%COMP%] {\n      height: 100vh;\n      display: grid;\n      grid-template-rows: 82px 1fr;\n      background: #f6f8fc;\n      overflow: hidden;\n    }\n    .topbar[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 16px;\n      padding: 0 24px;\n      background: #ffffff;\n      border-bottom: 1px solid #e4e9f2;\n    }\n    .topbar-left[_ngcontent-%COMP%], .topbar-right[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 14px;\n      min-width: 0;\n    }\n    .menu-chip[_ngcontent-%COMP%] {\n      width: 44px;\n      height: 44px;\n      border-radius: 12px;\n      border: 1px solid #dbe4f0;\n      background: #ffffff;\n      color: #475569;\n      font-size: 14px;\n      font-weight: 800;\n      letter-spacing: 0.12em;\n      cursor: default;\n    }\n    .brand-mark[_ngcontent-%COMP%], .footer-mark[_ngcontent-%COMP%], .profile-avatar[_ngcontent-%COMP%] {\n      width: 42px;\n      height: 42px;\n      border-radius: 14px;\n      display: grid;\n      place-items: center;\n      background: linear-gradient(135deg, #3563e9, #4f46e5);\n      color: #ffffff;\n      font-weight: 800;\n      box-shadow: 0 8px 18px rgba(53, 99, 233, 0.24);\n    }\n    .brand-copy[_ngcontent-%COMP%], .profile-text[_ngcontent-%COMP%] {\n      min-width: 0;\n    }\n    .brand-name[_ngcontent-%COMP%] {\n      font-size: 18px;\n      font-weight: 800;\n      color: #24408e;\n    }\n    .brand-subtitle[_ngcontent-%COMP%], .profile-text[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .footer-card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n      color: #64748b;\n      font-size: 14px;\n    }\n    .route-pill[_ngcontent-%COMP%] {\n      padding: 10px 16px;\n      border-radius: 12px;\n      background: #eef2f8;\n      color: #475569;\n      font-weight: 700;\n    }\n    .top-action[_ngcontent-%COMP%] {\n      min-height: 42px;\n      border-radius: 12px;\n      border-color: #d3ddf1;\n    }\n    .profile-chip[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 12px;\n      padding-left: 8px;\n    }\n    .profile-text[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .footer-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n      display: block;\n      color: #334155;\n      font-size: 15px;\n    }\n    .workspace-body[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: 260px 1fr;\n      min-height: 0;\n    }\n    .sidebar[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      justify-content: space-between;\n      background: #ffffff;\n      border-right: 1px solid #e4e9f2;\n      padding: 12px 12px 14px;\n      min-height: 0;\n      overflow: auto;\n    }\n    .nav[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 10px;\n      padding-top: 8px;\n    }\n    .nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 14px;\n      padding: 14px 16px;\n      border-radius: 16px;\n      text-decoration: none;\n      color: #334155;\n      font-weight: 700;\n      transition: background 120ms ease, transform 120ms ease;\n    }\n    .nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n      background: #f8fafc;\n      transform: translateX(2px);\n    }\n    .nav[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%] {\n      background: linear-gradient(135deg, #3b5bdb, #4f46e5);\n      color: #ffffff;\n      box-shadow: 0 14px 28px rgba(79, 70, 229, 0.22);\n    }\n    .nav-icon[_ngcontent-%COMP%] {\n      width: 28px;\n      height: 28px;\n      border-radius: 10px;\n      display: grid;\n      place-items: center;\n      background: rgba(59, 91, 219, 0.08);\n      font-size: 12px;\n      letter-spacing: 0.08em;\n    }\n    .nav[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]   .nav-icon[_ngcontent-%COMP%] {\n      background: rgba(255, 255, 255, 0.18);\n    }\n    .sidebar-footer[_ngcontent-%COMP%] {\n      display: grid;\n      gap: 10px;\n      margin-top: 16px;\n    }\n    .footer-card[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      padding: 10px 12px;\n      border-radius: 14px;\n      background: #eef3ff;\n      color: #334155;\n      min-width: 0;\n    }\n    .footer-card[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n      min-width: 0;\n    }\n    .footer-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n   .footer-card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n    }\n    .logout[_ngcontent-%COMP%] {\n      min-height: 40px;\n      border-radius: 12px;\n    }\n    .content[_ngcontent-%COMP%] {\n      overflow: auto;\n      min-height: 0;\n    }\n    @media (max-width: 1100px) {\n      .topbar[_ngcontent-%COMP%] {\n        padding: 0 16px;\n      }\n      .workspace-body[_ngcontent-%COMP%] {\n        grid-template-columns: 220px 1fr;\n      }\n    }\n    @media (max-width: 860px) {\n      .workspace-shell[_ngcontent-%COMP%] {\n        grid-template-rows: auto auto 1fr;\n      }\n      .topbar[_ngcontent-%COMP%] {\n        flex-direction: column;\n        align-items: stretch;\n        padding: 14px;\n      }\n      .topbar-right[_ngcontent-%COMP%] {\n        justify-content: space-between;\n        flex-wrap: wrap;\n      }\n      .workspace-body[_ngcontent-%COMP%] {\n        grid-template-columns: 1fr;\n      }\n      .sidebar[_ngcontent-%COMP%] {\n        border-right: 0;\n        border-bottom: 1px solid #e4e9f2;\n      }\n      .nav[_ngcontent-%COMP%] {\n        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n      }\n      .nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n        justify-content: center;\n      }\n      .sidebar-footer[_ngcontent-%COMP%] {\n        grid-template-columns: 1fr auto;\n        align-items: center;\n      }\n    }\n    @media (max-width: 640px) {\n      .brand-subtitle[_ngcontent-%COMP%], .profile-text[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .footer-card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n        display: none;\n      }\n      .footer-mark[_ngcontent-%COMP%] {\n        width: 36px;\n        height: 36px;\n        border-radius: 12px;\n        font-size: 14px;\n      }\n      .footer-card[_ngcontent-%COMP%] {\n        padding: 8px 10px;\n      }\n      .nav[_ngcontent-%COMP%] {\n        grid-template-columns: 1fr;\n      }\n      .sidebar-footer[_ngcontent-%COMP%] {\n        grid-template-columns: 1fr;\n      }\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppShellComponent, [{
        type: Component,
        args: [{ standalone: true, selector: 'app-shell', imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule], template: `
    <div class="workspace-shell">
      <header class="topbar">
        <div class="topbar-left">
          <button type="button" class="menu-chip" aria-label="Navigation">|||</button>
          <div class="brand-mark">S</div>
          <div class="brand-copy">
            <div class="brand-name">Support Portal</div>
            <div class="brand-subtitle">{{ isStaff() ? 'Support operations excellence' : 'Customer support workspace' }}</div>
          </div>
        </div>

        <div class="topbar-right" *ngIf="user() as currentUser">
          <div class="route-pill">{{ currentSection() }}</div>
          <a mat-stroked-button class="top-action" routerLink="/tickets/new">Create Ticket</a>
          <div class="profile-chip">
            <div class="profile-avatar">{{ initials(currentUser.full_name) }}</div>
            <div class="profile-text">
              <strong>{{ currentUser.full_name }}</strong>
              <span>{{ currentUser.role | titlecase }}</span>
            </div>
          </div>
        </div>
      </header>

      <div class="workspace-body">
        <aside class="sidebar">
          <nav class="nav">
            <a routerLink="/dashboard" routerLinkActive="active">
              <span class="nav-icon">D</span>
              <span>Dashboard</span>
            </a>
            <a routerLink="/tickets" routerLinkActive="active">
              <span class="nav-icon">T</span>
              <span>Tickets</span>
            </a>
            <a routerLink="/team" routerLinkActive="active" *ngIf="isStaff()">
              <span class="nav-icon">M</span>
              <span>Team</span>
            </a>
            <a routerLink="/help" routerLinkActive="active">
              <span class="nav-icon">H</span>
              <span>Help</span>
            </a>
            <a routerLink="/settings" routerLinkActive="active">
              <span class="nav-icon">S</span>
              <span>Settings</span>
            </a>
            <a routerLink="/profile" routerLinkActive="active">
              <span class="nav-icon">P</span>
              <span>Profile</span>
            </a>
          </nav>

          <div class="sidebar-footer">
            <div class="footer-card" *ngIf="user() as currentUser">
              <div class="footer-mark">{{ initials(currentUser.full_name) }}</div>
              <div>
                <strong>{{ currentUser.full_name }}</strong>
                <div>{{ currentUser.email }}</div>
              </div>
            </div>
            <button mat-stroked-button class="logout" color="primary" (click)="logout()">Logout</button>
          </div>
        </aside>

        <main class="content page-shell">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `, styles: ["\n    .workspace-shell {\n      height: 100vh;\n      display: grid;\n      grid-template-rows: 82px 1fr;\n      background: #f6f8fc;\n      overflow: hidden;\n    }\n    .topbar {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 16px;\n      padding: 0 24px;\n      background: #ffffff;\n      border-bottom: 1px solid #e4e9f2;\n    }\n    .topbar-left, .topbar-right {\n      display: flex;\n      align-items: center;\n      gap: 14px;\n      min-width: 0;\n    }\n    .menu-chip {\n      width: 44px;\n      height: 44px;\n      border-radius: 12px;\n      border: 1px solid #dbe4f0;\n      background: #ffffff;\n      color: #475569;\n      font-size: 14px;\n      font-weight: 800;\n      letter-spacing: 0.12em;\n      cursor: default;\n    }\n    .brand-mark, .footer-mark, .profile-avatar {\n      width: 42px;\n      height: 42px;\n      border-radius: 14px;\n      display: grid;\n      place-items: center;\n      background: linear-gradient(135deg, #3563e9, #4f46e5);\n      color: #ffffff;\n      font-weight: 800;\n      box-shadow: 0 8px 18px rgba(53, 99, 233, 0.24);\n    }\n    .brand-copy, .profile-text {\n      min-width: 0;\n    }\n    .brand-name {\n      font-size: 18px;\n      font-weight: 800;\n      color: #24408e;\n    }\n    .brand-subtitle, .profile-text span, .footer-card div {\n      color: #64748b;\n      font-size: 14px;\n    }\n    .route-pill {\n      padding: 10px 16px;\n      border-radius: 12px;\n      background: #eef2f8;\n      color: #475569;\n      font-weight: 700;\n    }\n    .top-action {\n      min-height: 42px;\n      border-radius: 12px;\n      border-color: #d3ddf1;\n    }\n    .profile-chip {\n      display: flex;\n      align-items: center;\n      gap: 12px;\n      padding-left: 8px;\n    }\n    .profile-text strong, .footer-card strong {\n      display: block;\n      color: #334155;\n      font-size: 15px;\n    }\n    .workspace-body {\n      display: grid;\n      grid-template-columns: 260px 1fr;\n      min-height: 0;\n    }\n    .sidebar {\n      display: flex;\n      flex-direction: column;\n      justify-content: space-between;\n      background: #ffffff;\n      border-right: 1px solid #e4e9f2;\n      padding: 12px 12px 14px;\n      min-height: 0;\n      overflow: auto;\n    }\n    .nav {\n      display: grid;\n      gap: 10px;\n      padding-top: 8px;\n    }\n    .nav a {\n      display: flex;\n      align-items: center;\n      gap: 14px;\n      padding: 14px 16px;\n      border-radius: 16px;\n      text-decoration: none;\n      color: #334155;\n      font-weight: 700;\n      transition: background 120ms ease, transform 120ms ease;\n    }\n    .nav a:hover {\n      background: #f8fafc;\n      transform: translateX(2px);\n    }\n    .nav a.active {\n      background: linear-gradient(135deg, #3b5bdb, #4f46e5);\n      color: #ffffff;\n      box-shadow: 0 14px 28px rgba(79, 70, 229, 0.22);\n    }\n    .nav-icon {\n      width: 28px;\n      height: 28px;\n      border-radius: 10px;\n      display: grid;\n      place-items: center;\n      background: rgba(59, 91, 219, 0.08);\n      font-size: 12px;\n      letter-spacing: 0.08em;\n    }\n    .nav a.active .nav-icon {\n      background: rgba(255, 255, 255, 0.18);\n    }\n    .sidebar-footer {\n      display: grid;\n      gap: 10px;\n      margin-top: 16px;\n    }\n    .footer-card {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      padding: 10px 12px;\n      border-radius: 14px;\n      background: #eef3ff;\n      color: #334155;\n      min-width: 0;\n    }\n    .footer-card > div {\n      min-width: 0;\n    }\n    .footer-card strong,\n    .footer-card div {\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n    }\n    .logout {\n      min-height: 40px;\n      border-radius: 12px;\n    }\n    .content {\n      overflow: auto;\n      min-height: 0;\n    }\n    @media (max-width: 1100px) {\n      .topbar {\n        padding: 0 16px;\n      }\n      .workspace-body {\n        grid-template-columns: 220px 1fr;\n      }\n    }\n    @media (max-width: 860px) {\n      .workspace-shell {\n        grid-template-rows: auto auto 1fr;\n      }\n      .topbar {\n        flex-direction: column;\n        align-items: stretch;\n        padding: 14px;\n      }\n      .topbar-right {\n        justify-content: space-between;\n        flex-wrap: wrap;\n      }\n      .workspace-body {\n        grid-template-columns: 1fr;\n      }\n      .sidebar {\n        border-right: 0;\n        border-bottom: 1px solid #e4e9f2;\n      }\n      .nav {\n        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n      }\n      .nav a {\n        justify-content: center;\n      }\n      .sidebar-footer {\n        grid-template-columns: 1fr auto;\n        align-items: center;\n      }\n    }\n    @media (max-width: 640px) {\n      .brand-subtitle, .profile-text span, .footer-card div {\n        display: none;\n      }\n      .footer-mark {\n        width: 36px;\n        height: 36px;\n        border-radius: 12px;\n        font-size: 14px;\n      }\n      .footer-card {\n        padding: 8px 10px;\n      }\n      .nav {\n        grid-template-columns: 1fr;\n      }\n      .sidebar-footer {\n        grid-template-columns: 1fr;\n      }\n    }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppShellComponent, { className: "AppShellComponent", filePath: "src/app/layout/app-shell.component.ts", lineNumber: 313 }); })();
//# sourceMappingURL=app-shell.component.js.map