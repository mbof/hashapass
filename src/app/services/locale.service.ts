import { Injectable, signal, computed } from '@angular/core';
import { SupportedLocale, TRANSLATIONS, LocaleTranslations } from '../i18n/translations';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  readonly currentLocale = signal<SupportedLocale>('en');
  readonly t = computed<LocaleTranslations>(() => TRANSLATIONS[this.currentLocale()]);

  constructor() {
    this.initLocale();
  }

  /**
   * Detects the locale from a given path and search query.
   * Handles paths like /hashapass//fr/index.html, /hashapass/fr/, /fr/index.html, and ?lang=fr.
   */
  detectLocale(pathname: string, search: string): SupportedLocale | null {
    if (search) {
      const params = new URLSearchParams(search);
      const queryLang = params.get('lang') || params.get('l');
      if (queryLang && this.isSupported(queryLang.toLowerCase())) {
        return queryLang.toLowerCase() as SupportedLocale;
      }
    }

    if (!pathname) {
      return null;
    }

    // Collapse multiple consecutive slashes (e.g. /hashapass//fr/index.html -> /hashapass/fr/index.html)
    const normalized = pathname.replace(/\/+/g, '/').toLowerCase();

    // Match /hashapass/{lang} or /{lang} followed by / or /index.html or end of string
    const match = normalized.match(/(?:^|\/)(fr|de|ja|en)(?:\/|\/index\.html)?(?:\/)?$/);
    if (match && this.isSupported(match[1])) {
      return match[1] as SupportedLocale;
    }

    return null;
  }

  initLocale(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const detected = this.detectLocale(window.location.pathname, window.location.search);

    if (detected) {
      this.setLocale(detected, true);

      // Clean up malformed double slashes or legacy index.html in the address bar without reloading
      if (window.history && window.history.replaceState) {
        const base =
          (typeof document !== 'undefined' &&
            document.querySelector('base')?.getAttribute('href')) ||
          '/hashapass/';
        const cleanBase = base.endsWith('/') ? base : `${base}/`;
        const cleanPath = detected === 'en' ? cleanBase : `${cleanBase}?lang=${detected}`;
        const currentUrl = window.location.pathname + window.location.search;
        if (
          currentUrl.includes('//') ||
          currentUrl.includes('index.html') ||
          currentUrl.includes('/fr') ||
          currentUrl.includes('/de') ||
          currentUrl.includes('/ja')
        ) {
          window.history.replaceState(null, '', cleanPath);
        }
      }
      return;
    }

    // Fallback: check localStorage
    try {
      const stored = localStorage.getItem('hashapass_locale');
      if (stored && this.isSupported(stored)) {
        this.setLocale(stored as SupportedLocale, false);
        return;
      }
    } catch {
      // Ignore localStorage errors
    }

    // Fallback: browser navigator language
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.substring(0, 2).toLowerCase();
      if (this.isSupported(browserLang)) {
        this.setLocale(browserLang as SupportedLocale, false);
        return;
      }
    }

    // Default to English
    this.setLocale('en', false);
  }

  setLocale(locale: SupportedLocale, persist: boolean = true, updateUrl: boolean = false): void {
    if (!this.isSupported(locale)) {
      return;
    }

    this.currentLocale.set(locale);

    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = locale;
    }

    if (persist && typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('hashapass_locale', locale);
      } catch {
        // Ignore localStorage quota errors
      }
    }

    if (
      updateUrl &&
      typeof window !== 'undefined' &&
      window.history &&
      window.history.replaceState
    ) {
      const base =
        (typeof document !== 'undefined' && document.querySelector('base')?.getAttribute('href')) ||
        '/hashapass/';
      const cleanBase = base.endsWith('/') ? base : `${base}/`;
      const cleanPath = locale === 'en' ? cleanBase : `${cleanBase}?lang=${locale}`;
      window.history.replaceState(null, '', cleanPath);
    }
  }

  isSupported(locale: string): locale is SupportedLocale {
    return ['en', 'fr', 'de', 'ja'].includes(locale);
  }

  interpolate(template: string, params: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => (key in params ? params[key] : match));
  }
}
