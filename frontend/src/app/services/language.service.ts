import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private http = inject(HttpClient);

    // Default to English or local storage
    currentLang = signal<string>(localStorage.getItem('preferred_lang') || 'en');
    translations = signal<any>({});

    constructor() {
        // Automatically load translations when language changes
        effect(() => {
            this.loadTranslations(this.currentLang());
        });
    }

    setLanguage(lang: string) {
        this.currentLang.set(lang);
        localStorage.setItem('preferred_lang', lang);
    }

    private loadTranslations(lang: string) {
        this.http.get(`/i18n/${lang}.json`).subscribe({
            next: (t) => this.translations.set(t),
            error: (err) => console.error(`Could not load translations for ${lang}`, err)
        });
    }

    translate(key: string, params?: any): string {
        const keys = key.split('.');
        let value = this.translations();

        for (const k of keys) {
            if (value) {
                value = value[k];
            }
        }

        if (typeof value !== 'string') return key;

        if (params) {
            Object.keys(params).forEach(p => {
                value = (value as string).replace(`{{${p}}}`, params[p]);
            });
        }

        return value;
    }
}
