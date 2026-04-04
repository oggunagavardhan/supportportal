import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as i0 from "@angular/core";
export class NotificationService {
    snackBar = inject(MatSnackBar);
    success(message) {
        this.snackBar.open(message, 'Close', { duration: 3000 });
    }
    error(message) {
        this.snackBar.open(message, 'Close', { duration: 4000 });
    }
    static ɵfac = function NotificationService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NotificationService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: NotificationService, factory: NotificationService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NotificationService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=notification.service.js.map