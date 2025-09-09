import React from 'react';

// Basic URL regex (http/https/www) — intentionally simple and safe.
const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

/**
 * Render Reddit selftext preserving paragraphs/line breaks and linkifying URLs.
 */
export function renderSelfText(text: string): React.ReactNode {
  if (!text) return null;
  // Split into paragraphs by blank lines
  const paragraphs = text.split(/\r?\n\r?\n/);
  return paragraphs.map((para, i) => (
    <p key={i} className="mb-4 whitespace-pre-wrap break-words leading-7">
      {linkify(para)}
    </p>
  ));
}

function linkify(s: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(urlRegex);
  while ((match = regex.exec(s)) !== null) {
    const [raw] = match;
    const start = match.index;
    if (start > lastIndex) out.push(s.slice(lastIndex, start));
    const href = raw.startsWith('http') ? raw : `https://${raw}`;
    out.push(
      <a key={out.length}
         href={href}
         target="_blank"
         rel="noopener noreferrer"
         className="text-brand hover:underline break-words">
        {raw}
      </a>
    );
    lastIndex = start + raw.length;
  }
  if (lastIndex < s.length) out.push(s.slice(lastIndex));
  return out;
}
