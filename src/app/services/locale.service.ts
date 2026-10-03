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

  normalizeLocale(lang: string): SupportedLocale | null {
    if (!lang) {
      return null;
    }
    const l = lang.toLowerCase();
    if (l === 'pt' || l === 'pt-br' || l === 'pt_br') {
      return 'pt-BR';
    }
    if (['en', 'fr', 'de', 'ja'].includes(l)) {
      return l as SupportedLocale;
    }
    return null;
  }

  /**
   * Detects the locale from a given path and search query.
   * Handles paths like /hashapass//pt-BR/index.html, /hashapass/pt-br/, and ?lang=pt-BR.
   */
  detectLocale(pathname: string, search: string): SupportedLocale | null {
    if (search) {
      const params = new URLSearchParams(search);
      const queryLang = params.get('lang') || params.get('l');
      if (queryLang) {
        const normalized = this.normalizeLocale(queryLang);
        if (normalized) {
          return normalized;
        }
      }
    }

    if (!pathname) {
      return null;
    }

    // Collapse multiple consecutive slashes (e.g. /hashapass//pt-BR/index.html -> /hashapass/pt-br/index.html)
    const normalized = pathname.replace(/\/+/g, '/').toLowerCase();

    // Match /hashapass/{lang} or /{lang} followed by / or /index.html or end of string
    const match = normalized.match(
      /(?:^|\/)(fr|de|ja|en|pt-br|pt_br|pt)(?:\/|\/index\.html)?(?:\/)?$/,
    );
    if (match) {
      const detected = this.normalizeLocale(match[1]);
      if (detected) {
        return detected;
      }
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
          /(?:\/hashapass)?\/(fr|de|ja|pt-br|pt)/i.test(currentUrl)
        ) {
          window.history.replaceState(null, '', cleanPath);
        }
      }
      return;
    }

    // Fallback: check localStorage
    try {
      const stored = localStorage.getItem('hashapass_locale');
      if (stored) {
        const normalized = this.normalizeLocale(stored);
        if (normalized) {
          this.setLocale(normalized, false);
          return;
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    // Fallback: browser navigator language
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.substring(0, 2).toLowerCase();
      const normalized =
        this.normalizeLocale(navigator.language) || this.normalizeLocale(browserLang);
      if (normalized) {
        this.setLocale(normalized, false);
        return;
      }
    }

    // Default to English
    this.setLocale('en', false);
  }

  setLocale(
    locale: SupportedLocale | string,
    persist: boolean = true,
    updateUrl: boolean = false,
  ): void {
    const target = this.normalizeLocale(locale);
    if (!target) {
      return;
    }

    this.currentLocale.set(target);

    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = target;
    }

    if (persist && typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('hashapass_locale', target);
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
      const cleanPath = target === 'en' ? cleanBase : `${cleanBase}?lang=${target}`;
      window.history.replaceState(null, '', cleanPath);
    }
  }

  isSupported(locale: string): locale is SupportedLocale {
    return ['en', 'fr', 'de', 'ja', 'pt-BR'].includes(locale as SupportedLocale);
  }

  interpolate(template: string, params: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => (key in params ? params[key] : match));
  }
}
