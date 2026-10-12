import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from './app';
import { LocaleService } from './services/locale.service';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
    const localeService = TestBed.inject(LocaleService);
    localeService.setLocale('en', false);
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

  it('should generate password and keep master password on form submit', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.parameter = 'google.com';
    app.seed = 'secretkey123';

    app.onUpdate();

    expect(app.result()).toBe('zUpz2XKS');
    expect(app.seed).toBe('secretkey123'); // Master password is kept
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

    // Switch to Portuguese (pt-BR)
    app.setLanguage('pt-BR');
    fixture.detectChanges();
    expect(app.currentLocale).toBe('pt-BR');
    expect(app.t.parameterLabel).toBe('Parâmetro');
    expect(app.t.seedLabel).toBe('Senha mestra');
  });

  it('should dismiss banner and persist dismissal', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.showBanner()).toBe(true);

    app.dismissBanner();
    expect(app.showBanner()).toBe(false);
    expect(localStorage.getItem('hashapass_banner_dismissed')).toBe('1');
  });

  it('should interpolate link placeholders in banner and footer for natural sentence structure', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    // English
    expect(app.bannerHtml()).toContain(
      'Please update your bookmarks to <a href="https://mbof.github.io/hashapass/">mbof.github.io/hashapass</a>.',
    );
    expect(app.footerHtml()).toContain(
      'Hosted on <a href="https://mbof.github.io/hashapass/">GitHub Pages</a>',
    );

    // French - space after "vers "
    app.setLanguage('fr');
    expect(app.bannerHtml()).toContain(
      'mettre à jour vos favoris vers <a href="https://mbof.github.io/hashapass/">mbof.github.io/hashapass</a>.',
    );

    // Japanese - natural word order with {url} in the middle
    app.setLanguage('ja');
    expect(app.bannerHtml()).toContain(
      'ブックマークを <a href="https://mbof.github.io/hashapass/">mbof.github.io/hashapass</a> に更新してください。',
    );
    expect(app.footerHtml()).toContain(
      '<a href="https://mbof.github.io/hashapass/">GitHub Pages</a>でホスト中',
    );

    // Portuguese - Brazilian Portuguese (pt-BR)
    app.setLanguage('pt-BR');
    expect(app.bannerHtml()).toContain(
      'Atualize seus favoritos para <a href="https://mbof.github.io/hashapass/">mbof.github.io/hashapass</a>.',
    );
    expect(app.footerHtml()).toContain(
      'Hospedado no <a href="https://mbof.github.io/hashapass/">GitHub Pages</a>',
    );
  });

  it('should have default password visibility (master invisible, generated visible)', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();

    expect(app.showMasterPassword()).toBe(false);
    expect(app.showGeneratedPassword()).toBe(true);

    const compiled = fixture.nativeElement as HTMLElement;
    const seedInput = compiled.querySelector('#seedId') as HTMLInputElement;
    const resultInput = compiled.querySelector('#resultId') as HTMLInputElement;

    expect(seedInput.type).toBe('password');
    expect(resultInput.type).toBe('text');
  });

  it('should toggle master and generated password visibility', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const seedInput = compiled.querySelector('#seedId') as HTMLInputElement;
    const resultInput = compiled.querySelector('#resultId') as HTMLInputElement;

    // Toggle master password to visible
    app.toggleMasterPasswordVisibility();
    fixture.detectChanges();
    expect(app.showMasterPassword()).toBe(true);
    expect(seedInput.type).toBe('text');

    // Toggle back to invisible
    app.toggleMasterPasswordVisibility();
    fixture.detectChanges();
    expect(app.showMasterPassword()).toBe(false);
    expect(seedInput.type).toBe('password');

    // Toggle generated password to invisible
    app.toggleGeneratedPasswordVisibility();
    fixture.detectChanges();
    expect(app.showGeneratedPassword()).toBe(false);
    expect(resultInput.type).toBe('password');

    // Toggle back to visible
    app.toggleGeneratedPasswordVisibility();
    fixture.detectChanges();
    expect(app.showGeneratedPassword()).toBe(true);
    expect(resultInput.type).toBe('text');
  });

  it('should not mark result input as readonly so native cut/copy works', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const resultInput = compiled.querySelector('#resultId') as HTMLInputElement;

    expect(resultInput.readOnly).toBe(false);
  });

  it('should copy generated password via copyToClipboard', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    await fixture.whenStable();

    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextSpy },
      configurable: true,
    });

    app.result.set('secretpass123');
    fixture.detectChanges();

    await app.copyToClipboard();
    expect(writeTextSpy).toHaveBeenCalledWith('secretpass123');
    expect(app.copied()).toBe(true);
  });

  it('should have autofocus attribute on parameter input for initial focus', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const paramInput = compiled.querySelector('#parameterId') as HTMLInputElement;

    expect(paramInput.hasAttribute('autofocus')).toBe(true);
  });
});
