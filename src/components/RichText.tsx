import React from 'react';

interface RichTextProps {
  text: string;
}

/**
 * Recursively parses **bold**, *italic*, `[[term|tip]]`, [[term|tip]], and `code` spans.
 */
export const RichText: React.FC<RichTextProps> = ({ text }) => {
  // Handle `[[term|tip]]` wrapped in backticks first, then [[term|tip]], **bold**, `code`, and *italic*
  const regex = /(`\[\[[^\]]+\]\]`|\[\[[^\]]+\]\]|\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null;

        if (part.startsWith('`[[') && part.endsWith(']]`')) {
          const inner = part.slice(3, -3);
          const [term, tip] = inner.split('|');
          return (
            <code key={idx} className="inline-code inline-term" title={tip || term}>
              {term}
            </code>
          );
        }

        if (part.startsWith('[[') && part.endsWith(']]')) {
          const inner = part.slice(2, -2);
          const [term, tip] = inner.split('|');
          return (
            <span key={idx} className="inline-term" title={tip || term}>
              {term}
            </span>
          );
        }

        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} style={{ color: 'var(--ink)', fontWeight: 800 }}>
              <RichText text={part.slice(2, -2)} />
            </strong>
          );
        }

        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={idx} className="inline-code">
              {part.slice(1, -1)}
            </code>
          );
        }

        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return (
            <em key={idx} style={{ fontStyle: 'italic', color: 'var(--ink)' }}>
              <RichText text={part.slice(1, -1)} />
            </em>
          );
        }

        if (part.includes('\n')) {
          const lines = part.split('\n');
          return (
            <React.Fragment key={idx}>
              {lines.map((ln, lIdx) => (
                <React.Fragment key={lIdx}>
                  {lIdx > 0 && <br />}
                  {ln}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        }

        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
};
