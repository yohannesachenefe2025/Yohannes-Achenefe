import React from 'react';
import katex from 'katex';

interface MathFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  formula,
  displayMode = false,
  className = '',
}) => {
  try {
    const html = katex.renderToString(formula, {
      displayMode,
      throwOnError: false,
    });
    return (
      <span
        className={`font-serif text-slate-800 dark:text-slate-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <code className={`text-blue-700 dark:text-blue-300 font-mono ${className}`}>{formula}</code>;
  }
};
