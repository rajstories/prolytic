import React from 'react';

type CalloutProps = {
  title: string;
  children: React.ReactNode;
};

export const Callout: React.FC<CalloutProps> = ({ title, children }) => {
  return (
    <div className="border-l-4 border-blue-600 bg-blue-50 px-5 py-4 rounded-lg">
      <p className="text-sm font-semibold text-blue-700 mb-2">{title}</p>
      <div className="text-sm text-slate-700 leading-relaxed">{children}</div>
    </div>
  );
};
