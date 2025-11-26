import React, { useState } from 'react';

interface CommentCardProps {
  text: string;
  index: number;
}

export const CommentCard: React.FC<CommentCardProps> = ({ text, index }) => {
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

  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <p className="text-slate-700 text-sm leading-relaxed mb-2">{text}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs font-medium text-slate-400">Option #{index + 1}</span>
        <button
          onClick={handleCopy}
          className={`text-xs px-2 py-1 rounded transition-colors duration-200 flex items-center gap-1
            ${copied 
              ? 'bg-green-100 text-green-700 font-medium' 
              : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
            }`}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12a1.5 1.5 0 01.439 1.061V16.5a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-2.25A2.25 2.25 0 0012.75 12h-2.25a2.25 2.25 0 00-2.25 2.25v2.25a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5V3.5a1.5 1.5 0 011.5-1.5h2.25v2.25a.75.75 0 00.75.75h2.25a.75.75 0 00.75-.75V2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};