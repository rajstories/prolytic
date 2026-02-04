import React from 'react';
import { motion } from 'framer-motion';

type DocHeroProps = {
  title: string;
  subtitle: string;
};

export const DocHero: React.FC<DocHeroProps> = ({ title, subtitle }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="border-b border-white/10 pb-10"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-blue-600 font-semibold">
        Documentation
      </p>
      <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-700 to-blue-500">
        {title}
      </h1>
      <p className="mt-5 text-lg text-slate-600 max-w-2xl leading-relaxed">
        {subtitle}
      </p>
    </motion.section>
  );
};
