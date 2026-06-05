import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Serialize an object for embedding in a <script type="application/ld+json">.
 * Escapes `<` (and the U+2028 / U+2029 line separators JSON.stringify leaves
 * raw) so a value like a business name containing "</script>" can't break out
 * of the tag. Match chars are built with fromCharCode to keep the source ASCII.
 */
export function jsonLd(data: unknown): string {
  const lineSep = String.fromCharCode(0x2028);
  const paraSep = String.fromCharCode(0x2029);
  return JSON.stringify(data)
    .split("<").join("\\u003c")
    .split(lineSep).join("\\u2028")
    .split(paraSep).join("\\u2029");
}
