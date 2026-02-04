import React from 'react';

type CodeBlockProps = {
  filename?: string;
  language?: string;
  children: React.ReactNode;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  filename = 'prolytic.ts',
  language = 'ts',
  children
}) => {
  return (
    <div className="rounded-xl border border-slate-900/80 bg-[#0B0B0D] shadow-xl shadow-black/20 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <span className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {filename} • {language}
        </div>
      </div>
      <pre className="px-5 py-4 text-sm md:text-base font-mono leading-relaxed text-slate-100 whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
};
