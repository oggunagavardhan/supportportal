import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class TicketService {
    http = inject(HttpClient);
    apiUrl = 'http://localhost:8000/api/tickets';
    list(filters) {
        let params = new HttpParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                params = params.set(key, value);
            }
        });
        return this.http.get(`${this.apiUrl}/`, { params });
    }
    get(id) {
        return this.http.get(`${this.apiUrl}/${id}/`);
    }
    create(payload) {
        return this.http.post(`${this.apiUrl}/`, payload);
    }
    update(id, payload) {
        return this.http.patch(`${this.apiUrl}/${id}/`, payload);
    }
    delete(id) {
        return this.http.delete(`${this.apiUrl}/${id}/`);
    }
    addComment(id, payload) {
        return this.http.post(`${this.apiUrl}/${id}/comments/`, payload);
    }
    dashboard() {
        return this.http.get(`${this.apiUrl}/dashboard/`);
    }
    static ɵfac = function TicketService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TicketService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: TicketService, factory: TicketService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TicketService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=ticket.service.js.map