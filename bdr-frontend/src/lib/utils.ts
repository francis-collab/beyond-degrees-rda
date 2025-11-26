// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';

/**
 * Minimal fallback de-duplication for Tailwind class names.
 * Keeps the first occurrence of each token and preserves order.
 * This is intentionally simple (no merging of conflicting utilities)
 * but acceptable for most use-cases where twMerge was used for dedupe.
 */
function dedupeTailwindClasses(input: string): string {
  if (!input) return '';
  const tokens = input.trim().split(/\s+/);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tokens) {
    if (!seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out.join(' ');
}

/**
 * Class name helper — uses clsx for conditional joining then dedupes tokens.
 * Signature kept the same as before.
 */
export function cn(...inputs: ClassValue[]) {
  const joined = clsx(inputs);
  return dedupeTailwindClasses(joined);
}
