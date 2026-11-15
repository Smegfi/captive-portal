/**
 * Detects whether a string already contains HTML markup.
 * Rich-text content from the editor starts with a tag; legacy plain-text templates do not.
 */
export function looksLikeHtml(content: string): boolean {
   return /^\s*</.test(content);
}

/**
 * Converts plain-text content (with newlines) into simple HTML paragraphs so
 * ProseKit and email clients can render it consistently. HTML input is returned unchanged.
 */
export function toRichTextHtml(content: string): string {
   const trimmed = content.trim();
   if (!trimmed) {
      return "";
   }

   if (looksLikeHtml(trimmed)) {
      return trimmed;
   }

   return trimmed
      .split(/\n{2,}/)
      .map((paragraph) => {
         const withBreaks = paragraph
            .split("\n")
            .map((line) => escapeHtml(line))
            .join("<br>");
         return `<p>${withBreaks}</p>`;
      })
      .join("");
}

/**
 * Prepares body content for an HTML email: keep rich HTML as-is, or convert
 * legacy plain-text templates by turning newlines into <br /> tags.
 */
export function toEmailBodyHtml(content: string): string {
   if (looksLikeHtml(content)) {
      return content;
   }

   return escapeHtml(content).replaceAll("\n", "<br />");
}

function escapeHtml(value: string): string {
   return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
