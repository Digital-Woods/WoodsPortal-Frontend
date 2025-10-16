import pako from 'pako'
import { Base64 } from 'js-base64'

export function encodeObject(obj: unknown): string {
  try {
    if (!obj) return ""
    const json = JSON.stringify(obj)
    const compressed = pako.deflate(json) // returns Uint8Array
    const base64 = Base64.fromUint8Array(compressed, true) // URL-safe

    return base64
  } catch (error) {
    console.error('Failed to encode object:', error)
    return ''
  }
}

export function decodeObject(encoded: string): any {
  try {
    if (!encoded) return null

    const uint8Array = Base64.toUint8Array(encoded)
    const decompressed = pako.inflate(uint8Array, { to: 'string' })

    return JSON.parse(decompressed)
  } catch (error) {
    console.error('Failed to decode object:', error)
    return null
  }
}
