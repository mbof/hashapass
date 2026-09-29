import { Injectable } from '@angular/core';

const CHRSZ = 8;

function safeAdd(x: number, y: number): number {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xffff);
}

function coreSha1(x: number[], len: number): number[] {
  x[len >> 5] |= 0x80 << (24 - (len % 32));
  x[(((len + 64) >> 9) << 4) + 15] = len;

  const w = new Array<number>(80);
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;
  let e = -1009589776;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    const olde = e;

    for (let j = 0; j < 80; j++) {
      if (j < 16) {
        w[j] = x[i + j];
      } else {
        const t = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
        w[j] = (t << 1) | (t >>> 31);
      }

      const t = safeAdd(
        safeAdd(
          (a << 5) | (a >>> 27),
          j < 20
            ? (b & c) | (~b & d)
            : j < 40
            ? b ^ c ^ d
            : j < 60
            ? (b & c) | (b & d) | (c & d)
            : b ^ c ^ d
        ),
        safeAdd(
          safeAdd(e, w[j]),
          j < 20
            ? 1518500249
            : j < 40
            ? 1859775393
            : j < 60
            ? -1894007588
            : -899497514
        )
      );

      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = t;
    }

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
    e = safeAdd(e, olde);
  }

  return [a, b, c, d, e];
}

function str2binb(str: string): number[] {
  const bin: number[] = [];
  const mask = (1 << CHRSZ) - 1;
  for (let i = 0; i < str.length * CHRSZ; i += CHRSZ) {
    bin[i >> 5] |= (str.charCodeAt(i / CHRSZ) & mask) << (24 - (i % 32));
  }
  return bin;
}

/**
 * Computes deterministic 8-character Hashapass password.
 * Preserves 100% bug-for-bug compatibility with original Hashapass algorithm
 * including 8-bit masking (charCodeAt & 0xFF) for non-ASCII characters.
 */
export function calculateHashapass(masterPassword: string, parameter: string): string {
  if (!masterPassword || !parameter) {
    return '';
  }

  let bkey = str2binb(masterPassword);
  if (bkey.length > 16) {
    bkey = coreSha1(bkey, masterPassword.length * CHRSZ);
  }

  const ipad = new Array<number>(16);
  const opad = new Array<number>(16);
  for (let i = 0; i < 16; i++) {
    ipad[i] = (bkey[i] || 0) ^ 0x36363636;
    opad[i] = (bkey[i] || 0) ^ 0x5c5c5c5c;
  }

  let hash = coreSha1(ipad.concat(str2binb(parameter)), 512 + parameter.length * CHRSZ);
  hash = coreSha1(opad.concat(hash), 672);

  const b64pad = '';
  const tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let str = '';

  for (let i = 0; i < 4 * hash.length; i += 3) {
    const triplet =
      (((hash[i >> 2] >> (8 * (3 - (i % 4)))) & 0xff) << 16) |
      (((hash[(i + 1) >> 2] >> (8 * (3 - ((i + 1) % 4)))) & 0xff) << 8) |
      ((hash[(i + 2) >> 2] >> (8 * (3 - ((i + 2) % 4)))) & 0xff);

    for (let j = 0; j < 4; j++) {
      if (8 * i + 6 * j > 32 * hash.length) {
        str += b64pad;
      } else {
        str += tab.charAt((triplet >> (6 * (3 - j))) & 0x3f);
      }
    }
  }

  // Exactly 8 characters, matching original behavior
  return str.substring(0, 8);
}

@Injectable({
  providedIn: 'root',
})
export class HashapassService {
  generate(masterPassword: string, parameter: string): string {
    return calculateHashapass(masterPassword, parameter);
  }
}
