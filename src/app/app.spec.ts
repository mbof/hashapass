import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
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
});
