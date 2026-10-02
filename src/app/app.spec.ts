import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render hashapass title and form', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('hashapass');
    expect(compiled.querySelector('#parameterId')).toBeTruthy();
    expect(compiled.querySelector('#seedId')).toBeTruthy();
    expect(compiled.querySelector('#resultId')).toBeTruthy();
  });

  it('should generate password and clear master password on form submit', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.parameter = 'google.com';
    app.seed = 'secretkey123';

    app.onUpdate();

    expect(app.result()).toBe('zUpz2XKS');
    expect(app.seed).toBe(''); // Seed cleared for security
  });

  it('should toggle zippies', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.zippyWhy()).toBe(false);

    app.toggleZippy('why');
    expect(app.zippyWhy()).toBe(true);

    app.toggleZippy('why');
    expect(app.zippyWhy()).toBe(false);
  });

  it('should switch languages and update rendered text', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    await fixture.whenStable();

    // Default English
    expect(app.t.submitButton).toBe('Hashapass!');

    // Switch to French
    app.setLanguage('fr');
    fixture.detectChanges();
    expect(app.currentLocale).toBe('fr');
    expect(app.t.parameterLabel).toBe('Paramètre');
    expect(app.t.submitButton).toBe('Hashapass !');

    // Switch to Japanese
    app.setLanguage('ja');
    fixture.detectChanges();
    expect(app.currentLocale).toBe('ja');
    expect(app.t.parameterLabel).toBe('パラメータ');
  });

  it('should dismiss banner and persist dismissal', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.showBanner()).toBe(true);

    app.dismissBanner();
    expect(app.showBanner()).toBe(false);
    expect(localStorage.getItem('hashapass_banner_dismissed')).toBe('1');
  });
});
