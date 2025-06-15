
// helpers.js
export function checkHeading(str) {
  // Checks if the string starts with a Markdown bullet or formatting symbol
  return /^(\*{1,2}|#{1,6}|\d+\.)\s*[^*]+/.test(str.trim());
}

export function replaceHeadingStarts(str) {
  return str
    .replace(/^(\*+|\_+|~+|`+|#+|>+|-+|\d+\.)\s*/g, '') // remove Markdown-like start tokens
    .replace(/\*+$/g, '') // remove trailing asterisks
    .replace(/\s+/g, ' ') // collapse spaces
    .trim();
}
// helper.js

// Remove markdown formatting characters from string
// export function sanitizeMarkdown(str) {
//   return str
//     .replace(/[*_~`]/g, '')      // remove markdown formatting
//     .replace(/\|/g, ' | ')       // make pipes readable in plain text
//     .replace(/-{2,}/g, '')       // remove horizontal rules like --- or ----
//     .replace(/\s+/g, ' ')        // collapse whitespace
//     .trim();
// }


