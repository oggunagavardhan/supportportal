import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class StorageService {
    set(key, value) {
        localStorage.setItem(key, value);
    }
    get(key) {
        return localStorage.getItem(key);
    }
    remove(key) {
        localStorage.removeItem(key);
    }
    clearAuth() {
        ['access_token', 'refresh_token', 'user'].forEach((key) => this.remove(key));
    }
    static ɵfac = function StorageService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StorageService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: StorageService, factory: StorageService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StorageService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=storage.service.js.map