import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  let service: LocaleService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocaleService);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('detectLocale', () => {
    it('should detect double-slash French path (/hashapass//fr/index.html)', () => {
      expect(service.detectLocale('/hashapass//fr/index.html', '')).toBe('fr');
    });

    it('should detect double-slash German path (/hashapass//de/index.html)', () => {
      expect(service.detectLocale('/hashapass//de/index.html', '')).toBe('de');
    });

    it('should detect double-slash Japanese path (/hashapass//ja/index.html)', () => {
      expect(service.detectLocale('/hashapass//ja/index.html', '')).toBe('ja');
    });

    it('should detect legacy apex double-slash path (//fr/index.html)', () => {
      expect(service.detectLocale('//fr/index.html', '')).toBe('fr');
    });

    it('should detect double-slash Portuguese paths (/hashapass//pt/index.html, /hashapass//pt-br/index.html, /hashapass//pt-BR/index.html)', () => {
      expect(service.detectLocale('/hashapass//pt/index.html', '')).toBe('pt-BR');
      expect(service.detectLocale('/hashapass//pt-br/index.html', '')).toBe('pt-BR');
      expect(service.detectLocale('/hashapass//pt-BR/index.html', '')).toBe('pt-BR');
    });

    it('should detect clean directory paths (/hashapass/fr/, /hashapass/de, /hashapass/pt, /hashapass/pt-BR)', () => {
      expect(service.detectLocale('/hashapass/fr/', '')).toBe('fr');
      expect(service.detectLocale('/hashapass/de', '')).toBe('de');
      expect(service.detectLocale('/hashapass/ja/index.html', '')).toBe('ja');
      expect(service.detectLocale('/hashapass/pt/', '')).toBe('pt-BR');
      expect(service.detectLocale('/hashapass/pt-br', '')).toBe('pt-BR');
      expect(service.detectLocale('/hashapass/pt-BR', '')).toBe('pt-BR');
    });

    it('should detect query parameters (?lang=fr, ?l=de, ?lang=pt-BR, ?lang=pt)', () => {
      expect(service.detectLocale('/hashapass/', '?lang=fr')).toBe('fr');
      expect(service.detectLocale('/hashapass/', '?l=de')).toBe('de');
      expect(service.detectLocale('/hashapass/', '?lang=ja')).toBe('ja');
      expect(service.detectLocale('/hashapass/', '?lang=pt-BR')).toBe('pt-BR');
      expect(service.detectLocale('/hashapass/', '?lang=pt')).toBe('pt-BR');
      expect(service.detectLocale('/hashapass/', '?lang=pt-br')).toBe('pt-BR');
    });

    it('should return null for standard paths or unknown locales', () => {
      expect(service.detectLocale('/hashapass/', '')).toBeNull();
      expect(service.detectLocale('/hashapass/index.html', '')).toBeNull();
      expect(service.detectLocale('/hashapass/es/index.html', '')).toBeNull();
      expect(service.detectLocale('', '')).toBeNull();
    });
  });

  describe('setLocale & reactive translations', () => {
    it('should default to English translations', () => {
      service.setLocale('en');
      expect(service.currentLocale()).toBe('en');
      expect(service.t().parameterLabel).toBe('Parameter');
      expect(service.t().submitButton).toBe('Hashapass!');
    });

    it('should reactively switch to French', () => {
      service.setLocale('fr');
      expect(service.currentLocale()).toBe('fr');
      expect(service.t().parameterLabel).toBe('Paramètre');
      expect(service.t().submitButton).toBe('Hashapass !');
      expect(document.documentElement.lang).toBe('fr');
    });

    it('should reactively switch to German', () => {
      service.setLocale('de');
      expect(service.currentLocale()).toBe('de');
      expect(service.t().seedLabel).toBe('Master-Passwort');
      expect(document.documentElement.lang).toBe('de');
    });

    it('should reactively switch to Japanese', () => {
      service.setLocale('ja');
      expect(service.currentLocale()).toBe('ja');
      expect(service.t().parameterLabel).toBe('パラメータ');
      expect(service.t().seedLabel).toBe('マスターパスワード');
      expect(document.documentElement.lang).toBe('ja');
    });

    it('should reactively switch to Brazilian Portuguese', () => {
      service.setLocale('pt-BR');
      expect(service.currentLocale()).toBe('pt-BR');
      expect(service.t().parameterLabel).toBe('Parâmetro');
      expect(service.t().seedLabel).toBe('Senha mestra');
      expect(service.t().submitButton).toBe('Hashapass!');
      expect(document.documentElement.lang).toBe('pt-BR');
    });

    it('should normalize pt to pt-BR in setLocale', () => {
      service.setLocale('pt');
      expect(service.currentLocale()).toBe('pt-BR');
      expect(document.documentElement.lang).toBe('pt-BR');
    });

    it('should persist selected locale to localStorage', () => {
      service.setLocale('fr', true);
      expect(localStorage.getItem('hashapass_locale')).toBe('fr');
    });

    it('should ignore unsupported locale strings', () => {
      service.setLocale('en');
      service.setLocale('invalid');
      expect(service.currentLocale()).toBe('en');
    });
  });

  describe('interpolate', () => {
    it('should replace named placeholders with provided parameters', () => {
      const template = 'Update bookmarks to {url}. Hosted on {link}';
      const result = service.interpolate(template, {
        url: 'example.com',
        link: 'GitHub',
      });
      expect(result).toBe('Update bookmarks to example.com. Hosted on GitHub');
    });

    it('should preserve unknown placeholders', () => {
      const template = 'Hello {name}, keep {unknown}';
      const result = service.interpolate(template, { name: 'World' });
      expect(result).toBe('Hello World, keep {unknown}');
    });
  });

  describe('URL normalization on initialization', () => {
    it('should clean up double-slash path via history.replaceState', () => {
      window.history.pushState({}, '', '/hashapass//fr/index.html');
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      service.initLocale();

      expect(service.currentLocale()).toBe('fr');
      expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/hashapass/?lang=fr');
    });
  });
});
