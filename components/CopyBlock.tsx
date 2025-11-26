import React, { useState } from 'react';

interface CopyBlockProps {
  title: string;
  subtitle: string;
  text: string;
  accentColor?: string;
}

export const CopyBlock: React.FC<CopyBlockProps> = ({
  title,
  subtitle,
  text,
  accentColor = 'blue'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const accentClasses =
    accentColor === 'rose'
      ? 'bg-rose-50 text-rose-700'
      : 'bg-blue-50 text-blue-700';

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${accentClasses}`}
        >
          {title === 'Community Reply' ? 'Engage' : 'Flagship'}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
        {text}
      </p>
      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className={`text-xs px-3 py-1.5 rounded border transition-colors duration-200 ${
            copied
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
};




