import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexFormulaProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const LatexFormula: React.FC<LatexFormulaProps> = ({
  math,
  block = false,
  className = '',
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
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
