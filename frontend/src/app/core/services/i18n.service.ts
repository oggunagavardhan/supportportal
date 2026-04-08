import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { StorageService } from './storage.service';

type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationMap = Record<string, TranslationValue>;

@Injectable({ providedIn: 'root' })
export class I18nService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private readonly storageKey = 'app_language';
  private readonly defaultLanguage = 'en';

  private lang = signal<string>(this.getInitialLanguage());
  private translations = signal<TranslationMap>({});
  private cache = new Map<string, TranslationMap>();

  currentLanguage = computed(() => this.lang());

  constructor() {
    this.loadLanguage(this.lang());
  }

  setLanguage(language: string): void {
    if (!language || language === this.lang()) {
      return;
    }
    this.lang.set(language);
    this.storage.set(this.storageKey, language);
    this.loadLanguage(language);
  }

  translate(key: string, params?: Record<string, string | number>): string {
    if (!key) {
      return '';
    }
    const value = this.resolveKey(key, this.translations());
    if (typeof value !== 'string') {
      return key;
    }
    return this.interpolate(value, params);
  }

  hasKey(key: string): boolean {
    const value = this.resolveKey(key, this.translations());
    return typeof value === 'string';
  }

  private getInitialLanguage(): string {
    const raw = this.storage.get(this.storageKey);
    return this.normalizeLanguage(raw) || this.defaultLanguage;
  }

  private normalizeLanguage(language: string | null | undefined): string | null {
    if (!language) {
      return null;
    }
    const normalized = language.toLowerCase();
    if (normalized === 'english' || normalized === 'en') {
      return 'en';
    }
    if (normalized === 'hindi' || normalized === 'hi') {
      return 'hi';
    }
    if (normalized === 'telugu' || normalized === 'te') {
      return 'te';
    }
    return normalized;
  }

  private loadLanguage(language: string): void {
    const cached = this.cache.get(language);
    if (cached) {
      this.translations.set(cached);
      return;
    }
    this.http.get<TranslationMap>(`assets/i18n/${language}.json`).subscribe({
      next: (data) => {
        this.cache.set(language, data);
        this.translations.set(data);
      },
      error: () => {
        if (language !== this.defaultLanguage) {
          this.setLanguage(this.defaultLanguage);
        }
      },
    });
  }

  private resolveKey(path: string, source: TranslationMap): TranslationValue | undefined {
    return path.split('.').reduce<TranslationValue | undefined>((acc, part) => {
      if (!acc || typeof acc === 'string') {
        return undefined;
      }
      return acc[part];
    }, source);
  }

  private interpolate(value: string, params?: Record<string, string | number>): string {
    if (!params) {
      return value;
    }
    return Object.entries(params).reduce((result, [key, param]) => {
      return result.replace(new RegExp(`{${key}}`, 'g'), String(param));
    }, value);
  }
}
