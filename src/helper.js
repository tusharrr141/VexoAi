
// helpers.js

/**
 * Check if a line starts like a heading or markdown bullet point
 */
export function checkHeading(line) {
  return /^(\*{1,2}|#{1,6}|\d+\.)\s*[^*]+/.test(line.trim());
}

/**
 * Clean formatting from every line of a multi-line string
 */
// export function cleanMarkdownOutput(text) {
//   return text
//     .split("\n")
//     .map(line =>
//       line
//         // Remove markdown-style bullets/headings at start
//         .replace(/^(\s*)([*_\-~#>`]+|\d+\.)\s*/g, "")
//         // Remove bold/italic markdown wrappers like *word*, *word, word*
//         .replace(/[*_~`]+(\w[\w\s\-.,:;!?'"()\[\]]*?)?[*_~`]+/g, "$1")
//         .replace(/\*(\w+)/g, "$1") // remove leading *
//         .replace(/(\w+)\*/g, "$1") // remove trailing *
//         // Remove remaining isolated asterisks
//         .replace(/\*/g, "")
//         .replace(/\s+/g, " ") // collapse extra spaces
//         .trim()
//     )
//     .join("\n");
// }
export function cleanMarkdownOutput(text) {
  return text
    .split("\n")
    .map(line =>
      line
        // Remove markdown bullets, numbers, special symbols at start
        .replace(/^(\*+|_+|~+|`+|#+|>+|-+|\d+\.)\s*/g, "")
        // Remove asterisks from *word*, *word, word*, and in the middle
        .replace(/\*(\S.*?)\*/g, "$1")  // *text* → text
        .replace(/(^|\s)\*(\w+)/g, "$1$2")  // *word → word
        .replace(/(\w+)\*(\s|$)/g, "$1$2")  // word* → word
        .replace(/\*/g, "") // remove any remaining rogue asterisks
        // Collapse multiple spaces and trim
        .replace(/\s+/g, " ")
        .trim()
    )
    .join("\n");
}






// export function checkHeading(str) {
//   // Checks if the string starts with a Markdown bullet or formatting symbol
//   return /^(\*{1,2}|#{1,6}|\d+\.)\s*[^*]+/.test(str.trim());
// }

// export function replaceHeadingStarts(str) {
//   return str
//     .replace(/^(\*+|\_+|~+|`+|#+|>+|-+|\d+\.)\s*/g, '') // remove Markdown-like start tokens
//     .replace(/\*+$/g, '') // remove trailing asterisks
//     .replace(/\s+/g, ' ') // collapse spaces
//     .trim();
// }
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


