import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { StorageService } from './storage.service';
import * as i0 from "@angular/core";
export class AuthService {
    http = inject(HttpClient);
    router = inject(Router);
    storage = inject(StorageService);
    apiUrl = 'http://localhost:8000/api/auth';
    userSignal = signal(this.readStoredUser());
    user = computed(() => this.userSignal());
    isAuthenticated = computed(() => this.hasValidAccessToken());
    register(payload) {
        return this.http.post(`${this.apiUrl}/register/`, payload);
    }
    loginStart(payload) {
        return this.http.post(`${this.apiUrl}/login/`, payload);
    }
    verifyOtp(payload) {
        return this.http.post(`${this.apiUrl}/verify-otp/`, payload).pipe(tap((response) => {
            if ('access' in response) {
                this.storeSession(response);
            }
        }));
    }
    resendOtp(payload) {
        return this.http.post(`${this.apiUrl}/resend-otp/`, payload);
    }
    requestPasswordReset(email) {
        return this.http.post(`${this.apiUrl}/forgot-password/`, { email });
    }
    resetPassword(payload) {
        return this.http.post(`${this.apiUrl}/reset-password/`, payload);
    }
    loadProfile() {
        return this.http.get(`${this.apiUrl}/profile/`).pipe(tap((user) => {
            this.persistUser(user);
        }));
    }
    updateProfile(payload) {
        return this.http.patch(`${this.apiUrl}/profile/`, payload).pipe(tap((user) => {
            this.persistUser(user);
        }));
    }
    getStaffUsers() {
        return this.http.get(`${this.apiUrl}/staff-users/`);
    }
    logout() {
        this.storage.clearAuth();
        this.userSignal.set(null);
        void this.router.navigate(['/auth/login']);
    }
    hasValidAccessToken() {
        const token = this.storage.get('access_token');
        if (!token) {
            return false;
        }
        try {
            const [, payload] = token.split('.');
            if (!payload) {
                this.storage.clearAuth();
                this.userSignal.set(null);
                return false;
            }
            const decoded = JSON.parse(atob(this.normalizeBase64(payload)));
            if (!decoded.exp) {
                return true;
            }
            const isValid = decoded.exp * 1000 > Date.now();
            if (!isValid) {
                this.storage.clearAuth();
                this.userSignal.set(null);
            }
            return isValid;
        }
        catch {
            this.storage.clearAuth();
            this.userSignal.set(null);
            return false;
        }
    }
    storeSession(response) {
        this.storage.set('access_token', response.access);
        this.storage.set('refresh_token', response.refresh);
        this.persistUser(response.user);
        void this.router.navigate(['/dashboard']);
    }
    readStoredUser() {
        if (!this.hasValidAccessToken()) {
            return null;
        }
        const raw = this.storage.get('user');
        return raw ? JSON.parse(raw) : null;
    }
    normalizeBase64(value) {
        const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
        const padding = normalized.length % 4;
        return padding ? normalized + '='.repeat(4 - padding) : normalized;
    }
    persistUser(user) {
        this.storage.set('user', JSON.stringify(user));
        this.userSignal.set(user);
    }
    static ɵfac = function AuthService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=auth.service.js.map