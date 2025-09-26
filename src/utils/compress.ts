import { deflateRaw, inflateRaw } from "pako";

type NodeZlib = typeof import("node:zlib");

type BrotliCodec = {
  compress(input: Uint8Array): Uint8Array;
  decompress(input: Uint8Array): Uint8Array;
};

const isNode =
  typeof process !== "undefined" && typeof process.versions?.node === "string";

const nodeZlib: NodeZlib | null = (() => {
  if (!isNode) return null;
  try {
    const req = eval("require") as NodeJS.Require;
    return req("node:zlib") as NodeZlib;
  } catch {
    return null;
  }
})();

let injectedBrotli: BrotliCodec | null = null;

const nodeBrotli: BrotliCodec | null = nodeZlib
  ? {
      compress(input) {
        const buf = Buffer.from(input);
        return new Uint8Array(
          nodeZlib!.brotliCompressSync(buf, {
            params: {
              [nodeZlib!.constants.BROTLI_PARAM_QUALITY]: 11,
              [nodeZlib!.constants.BROTLI_PARAM_MODE]:
                nodeZlib!.constants.BROTLI_MODE_GENERIC,
              [nodeZlib!.constants.BROTLI_PARAM_LGWIN]: 17,
            },
          })
        );
      },
      decompress(input) {
        const buf = Buffer.from(input);
        return new Uint8Array(nodeZlib!.brotliDecompressSync(buf));
      },
    }
  : null;

const getBrotli = (): BrotliCodec | null => injectedBrotli ?? nodeBrotli;

const encodeUtf8 = (s: string): Uint8Array => {
  const TextEncoderCtor = (globalThis as any).TextEncoder as
    | (new () => TextEncoder)
    | undefined;
  if (TextEncoderCtor) return new TextEncoderCtor().encode(s);
  if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(s, "utf8"));
  throw new Error("No UTF-8 encoder available in this environment");
};

const decodeUtf8 = (bytes: Uint8Array): string => {
  const TextDecoderCtor = (globalThis as any).TextDecoder as
    | (new () => TextDecoder)
    | undefined;
  if (TextDecoderCtor) return new TextDecoderCtor().decode(bytes);
  if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("utf8");
  throw new Error("No UTF-8 decoder available in this environment");
};

/** Helpers */
export const toB64 = (u8: Uint8Array) => {
  if (typeof Buffer !== "undefined") return Buffer.from(u8).toString("base64");
  const btoaFn = (globalThis as any).btoa as ((input: string) => string) | undefined;
  if (!btoaFn) throw new Error("Base64 encoding not supported in this environment");
  let binary = "";
  for (let i = 0; i < u8.length; i++) binary += String.fromCharCode(u8[i]);
  return btoaFn(binary);
};

export const fromB64 = (b64: string) => {
  if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(b64, "base64"));
  const atobFn = (globalThis as any).atob as ((input: string) => string) | undefined;
  if (!atobFn) throw new Error("Base64 decoding not supported in this environment");
  const binary = atobFn(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
};

/** Tiny header so we know how to decompress later.
 *  Magic = "WP1" (0x57 0x50 0x31), then 1 byte 'method'.
 *  Layout: [W][P][1][method][payload...]
 */
const MAGIC = Uint8Array.from([0x57, 0x50, 0x31]); // "WP1"

enum Method {
  DeflateRaw = 1,
  Brotli = 2,               // plain Brotli (no dictionary)
  NibbleRLE = 3,
  NibbleRLE_Deflate = 4,
}

/* ========== Method A: raw DEFLATE ========== */
const deflateRawBytes = (u8: Uint8Array): Uint8Array => {
  if (nodeZlib) {
    const buf = Buffer.from(u8);
    return new Uint8Array(
      nodeZlib.deflateRawSync(buf, { level: 9, memLevel: 9, windowBits: 15 })
    );
  }
  return deflateRaw(u8, { level: 9, memLevel: 9, windowBits: 15 });
};

const inflateRawBytes = (u8: Uint8Array): Uint8Array => {
  if (nodeZlib) {
    const buf = Buffer.from(u8);
    return new Uint8Array(nodeZlib.inflateRawSync(buf));
  }
  return inflateRaw(u8);
};

export const compressDeflateRaw = (s: string): Uint8Array =>
  deflateRawBytes(encodeUtf8(s));

export const decompressDeflateRaw = (u8: Uint8Array): string =>
  decodeUtf8(inflateRawBytes(u8));

/* ========== Method B: Brotli (no dict; Node zlib typings OK) ========== */
export function compressBrotli(s: string): Uint8Array {
  const codec = getBrotli();
  if (!codec)
    throw new Error(
      "Brotli compression is not available; call registerBrotliCodec() in the browser"
    );
  return codec.compress(encodeUtf8(s));
}

export function decompressBrotli(u8: Uint8Array): string {
  const codec = getBrotli();
  if (!codec)
    throw new Error(
      "Brotli decompression is not available; call registerBrotliCodec() in the browser"
    );
  return decodeUtf8(codec.decompress(u8));
}

export const registerBrotliCodec = (codec: BrotliCodec) => {
  injectedBrotli = codec;
};

/* ========== Method C: Nibble (4-bit) packing with tiny RLE ==========
   Works when alphabet ≤ 16 (single-byte chars). */
export function compressNibbleRLE(s: string): Uint8Array | null {
  const alphabet = Array.from(new Set(s.split("")));
  if (alphabet.length === 0) return new Uint8Array([0]); // empty
  if (alphabet.length > 16) return null;

  const idx = new Map<string, number>();
  for (let i = 0; i < alphabet.length; i++) {
    const code = alphabet[i].charCodeAt(0);
    if (code > 255) return null; // restrict to single-byte chars
    idx.set(alphabet[i], i);
  }

  // Build token list: literals as indices (0..15), or run marker (0xF0|index) + length
  const tokens: number[] = [];
  for (let p = 0; p < s.length; ) {
    const c = s[p];
    let run = 1;
    while (p + run < s.length && s[p + run] === c && run < 255) run++;
    const i = idx.get(c)!;
    if (run >= 2) {
      tokens.push(0xf0 | i, run);
      p += run;
    } else {
      tokens.push(i); // single literal
      p++;
    }
  }

  // Pack consecutive literal indices into bytes (two nibbles per byte).
  // If there's a trailing single literal, emit it as a run token (len=1), NOT as padded nibble.
  const packed: number[] = [];
  let i = 0;
  while (i < tokens.length) {
    const v = tokens[i];

    // Run token: 0xF* followed by length
    if (v >= 0xf0) {
      const len = tokens[++i];
      packed.push(v, len);
      i++;
      continue;
    }

    // Literal(s)
    const hasSecond =
      i + 1 < tokens.length && tokens[i + 1] < 0xf0; // next is also literal
    if (hasSecond) {
      const hi = v & 0x0f;
      const lo = tokens[i + 1] & 0x0f;
      packed.push((hi << 4) | lo);
      i += 2;
    } else {
      // Trailing single literal: encode as a run token length=1
      const hi = v & 0x0f;
      packed.push(0xf0 | hi, 1);
      i += 1;
    }
  }

  // Header: [count][symbols...]
  const header = Uint8Array.from([
    alphabet.length,
    ...alphabet.map(c => c.charCodeAt(0)),
  ]);
  const body = Uint8Array.from(packed);
  const out = new Uint8Array(header.length + body.length);
  out.set(header, 0);
  out.set(body, header.length);
  return out;
}

export function decompressNibbleRLE(u8: Uint8Array): string {
  let p = 0;
  const count = u8[p++];
  if (count === 0) return "";
  const alphabet: string[] = [];
  for (let i = 0; i < count; i++) alphabet.push(String.fromCharCode(u8[p++]));

  let out = "";

  // Read body: bytes are either packed literals (two nibbles) or run tokens (0xF* + len)
  while (p < u8.length) {
    const b = u8[p++];

    if (b >= 0xf0) {
      // Run token: 0xF0|idx followed by length
      const idx = b & 0x0f;
      if (p >= u8.length) throw new Error("Malformed NibbleRLE: missing run length");
      const len = u8[p++];
      out += alphabet[idx].repeat(len);
      continue;
    }

    // Packed two literals (always consume both nibbles as literals)
    const hi = (b >> 4) & 0x0f;
    const lo = b & 0x0f;
    out += alphabet[hi];
    out += alphabet[lo];
  }

  return out;
}

/* ========== Auto: try multiple, pick smallest, tag with header ========== */
export function compressAuto(s: string): Uint8Array {
  const candidates: { m: Method; bin: Uint8Array }[] = [];

  // deflateRaw
  const d = compressDeflateRaw(s);
  candidates.push({ m: Method.DeflateRaw, bin: d });

  // brotli
  const brotliCodec = getBrotli();
  if (brotliCodec) {
    const brotliBytes = brotliCodec.compress(encodeUtf8(s));
    candidates.push({ m: Method.Brotli, bin: brotliBytes });
  }

  // nibbleRLE (and deflate over it)
  const nib = compressNibbleRLE(s);
  if (nib) {
    candidates.push({ m: Method.NibbleRLE, bin: nib });
    const nibDef = deflateRawBytes(nib);
    candidates.push({ m: Method.NibbleRLE_Deflate, bin: nibDef });
  }

  candidates.sort((a, b) => a.bin.length - b.bin.length);
  const best = candidates[0];

  // prepend header
  const out = new Uint8Array(MAGIC.length + 1 + best.bin.length);
  out.set(MAGIC, 0);
  out[MAGIC.length] = best.m;
  out.set(best.bin, MAGIC.length + 1);
  return out;
}

export function decompressAuto(u8: Uint8Array): string {
  if (u8.length < MAGIC.length + 1) throw new Error("Invalid payload");
  if (u8[0] !== MAGIC[0] || u8[1] !== MAGIC[1] || u8[2] !== MAGIC[2]) {
    throw new Error("Magic mismatch: not a WP1 stream");
  }
  const m = u8[MAGIC.length] as Method;
  const body = u8.subarray(MAGIC.length + 1);

  switch (m) {
    case Method.DeflateRaw:
      return decompressDeflateRaw(body);
    case Method.Brotli:
      return decompressBrotli(body);
    case Method.NibbleRLE:
      return decompressNibbleRLE(body);
    case Method.NibbleRLE_Deflate: {
      const inflated = inflateRawBytes(body);
      return decompressNibbleRLE(inflated);
    }
    default:
      throw new Error("Unknown method id");
  }
}
