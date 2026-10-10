import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexFormulaProps {
  math: string;
  block?: boolean;
  className?: string;
}

/**
 * Pre-processes LaTeX string to fix common issues:
 * 1. Unescaped percent signs (e.g. 50% -> 50\%) so KaTeX doesn't treat them as comments
 * 2. Unescaped Chinese characters inside math mode
 */
function cleanLatexString(raw: string): string {
  if (!raw) return '';
  // Replace unescaped % with \%
  let res = raw.replace(/(^|[^\\])%/g, '$1\\%');

  // Wrap bare CJK characters in \text{...} if not already inside \text
  // Only if they aren't preceded by \text{
  res = res.replace(/([\u4e00-\u9fa5]+)/g, (match, p1, offset, string) => {
    // Check if preceded by \text{
    const before = string.slice(0, offset);
    if (/\\text\{[^}]*$/.test(before)) {
      return match;
    }
    return `\\text{${match}}`;
  });

  return res;
}

export const LatexFormula: React.FC<LatexFormulaProps> = ({
  math,
  block = false,
  className = '',
}) => {
  const html = useMemo(() => {
    try {
      const sanitized = cleanLatexString(math);
      return katex.renderToString(sanitized, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        trust: true,
      });
    } catch {
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`my-3 overflow-x-auto py-2 text-center text-slate-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block align-baseline text-emerald-400 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * MathText Component:
 * Automatically parses mixed prose containing inline math ($...$ or $$...$$
 * or LaTeX expressions with \sum, \frac, \mathbb, etc.) and renders them with KaTeX.
 */
interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const parts = useMemo(() => {
    if (!text) return [];

    // Split text by lines first to preserve line breaks
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      // Regex to detect:
      // 1. $$ ... $$ (block math)
      // 2. $ ... $ (inline math)
      // 3. LaTeX commands like \sum_{...}, \frac{...}{...}, \mathbb{...}, etc.
      // 4. Common standalone math expressions like E[...] or P(...)
      const tokens: React.ReactNode[] = [];
      // Match $...$ or $$...$$
      const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\(?:sum|frac|prod|int|mathbb|mathrm|approx|le|ge|ne|times|cdot|implies|to|in|deg|infty|ln|log|cup|cap)[a-zA-Z0-9_{}^\\()+\-*=/, ]+)/g;

      let lastIndex = 0;
      let match;

      while ((match = mathRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          tokens.push(
            <span key={`${lIdx}-${lastIndex}`}>
              {line.substring(lastIndex, match.index)}
            </span>
          );
        }

        const rawMatch = match[0];
        let mathContent = rawMatch;
        let isBlock = false;

        if (rawMatch.startsWith('$$') && rawMatch.endsWith('$$')) {
          mathContent = rawMatch.slice(2, -2);
          isBlock = true;
        } else if (rawMatch.startsWith('$') && rawMatch.endsWith('$')) {
          mathContent = rawMatch.slice(1, -1);
        }

        tokens.push(
          <LatexFormula
            key={`${lIdx}-${match.index}`}
            math={mathContent}
            block={isBlock}
            className="mx-0.5"
          />
        );

        lastIndex = mathRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        tokens.push(
          <span key={`${lIdx}-${lastIndex}`}>{line.substring(lastIndex)}</span>
        );
      }

      return (
        <React.Fragment key={lIdx}>
          {lIdx > 0 && <br className="my-1" />}
          {tokens.length > 0 ? tokens : line}
        </React.Fragment>
      );
    });
  }, [text]);

  return <span className={className}>{parts}</span>;
};
