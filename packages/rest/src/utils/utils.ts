export function isBufferLike(
  value: unknown
): value is ArrayBuffer | Buffer | Uint8Array | Uint8ClampedArray {
  return (
    value instanceof ArrayBuffer ||
    value instanceof Uint8Array ||
    value instanceof Uint8ClampedArray
  );
}
