/**
 * Serialise structured data for embedding inside a `<script>` tag safely.
 *
 * `JSON.stringify` is not enough on its own. It does not escape `<`, so a value
 * containing the literal `</script>` closes the tag early and everything after
 * it is parsed as HTML. On this site every JSON-LD field is author-written, so
 * that is a self-inflicted wound rather than an attacker's, but "the only author
 * is trusted" is exactly the assumption that stops being true the day a second
 * author, a CMS import, or a copied title with markup in it arrives. Escaping
 * here costs nothing and removes the assumption.
 *
 * The three sequences that matter inside a script element:
 *   <  and  >   so no tag, comment, or CDATA section can start or end
 *   &           so an escaped sequence cannot be reconstituted by the parser
 * plus U+2028 and U+2029, which are valid in JSON strings but are line
 * terminators in JavaScript and break a script that is later read as JS.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}
