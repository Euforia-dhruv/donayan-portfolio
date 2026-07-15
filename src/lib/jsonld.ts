/**
 * Serialize data for injection into a <script type="application/ld+json"> tag.
 *
 * `JSON.stringify` does NOT escape `<`, so a value containing `</script>`
 * (e.g. a project title) would break out of the script context and enable
 * stored XSS on public pages. We escape `<`, `>`, and `&` into unicode escapes
 * (the canonical OWASP-recommended approach) which is inert inside JSON.
 */
export function jsonLdSafe(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
