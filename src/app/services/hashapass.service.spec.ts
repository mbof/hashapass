import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HashapassService, calculateHashapass } from './hashapass.service';

describe('HashapassService', () => {
  let service: HashapassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HashapassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Cryptographic Parity & Test Vectors', () => {
    const testCases = [
      {
        description: 'standard ASCII inputs',
        master: 'secretkey123',
        parameter: 'google.com',
        expected: 'zUpz2XKS',
      },
      {
        description: 'long master password (>16 words / 64 bytes)',
        master: 'correct-horse-battery-staple',
        parameter: 'github.com',
        expected: 'OTmFPloS',
      },
      {
        description: 'alphanumeric inputs with leading symbol base64 output',
        master: 'admin12345',
        parameter: 'amazon.com',
        expected: '+oL1Sd6e',
      },
      {
        description: 'special characters',
        master: '!@#$%^&*()',
        parameter: 'test.org',
        expected: 'z7MW7zkq',
      },
      {
        description: 'Latin-1 non-ASCII characters (verifying 8-bit masking)',
        master: 'café',
        parameter: 'münchen',
        expected: 'E9Z7lmZJ',
      },
      {
        description: 'High Unicode and Emoji characters',
        master: '🔑',
        parameter: 'site🚀',
        expected: 'cfpEQysF',
      },
    ];

    for (const tc of testCases) {
      it(`should correctly generate password for ${tc.description}`, () => {
        const result = service.generate(tc.master, tc.parameter);
        expect(result).toBe(tc.expected);
        expect(result.length).toBe(8);
      });
    }

    it('should return empty string if master password or parameter is empty', () => {
      expect(service.generate('', 'google.com')).toBe('');
      expect(service.generate('secret', '')).toBe('');
      expect(service.generate('', '')).toBe('');
    });

    it('should always return exactly 8 characters for valid inputs', () => {
      const res = calculateHashapass('mySecret', 'myDomain');
      expect(res.length).toBe(8);
    });
  });
});
