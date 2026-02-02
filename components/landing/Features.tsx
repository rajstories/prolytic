import React from 'react';
import { Type, TrendingUp, MessageCircle, ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description
}) => (
  <div className="p-10 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group cursor-default h-full flex flex-col">
    <div className="w-14 h-14 bg-brand-bg rounded-xl border border-slate-200 flex items-center justify-center mb-8 text-brand-navy group-hover:scale-105 group-hover:bg-brand-blue group-hover:text-white group-hover:border-transparent transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-brand-navy mb-4 tracking-tight">
      {title}
    </h3>
    <p className="text-brand-slate leading-relaxed text-base flex-1">
      {description}
    </p>
    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center text-brand-blue font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Learn more{' '}
      <ArrowRight
        size={16}
        className="ml-2 group-hover:translate-x-1 transition-transform"
      />
    </div>
  </div>
);

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Type size={28} strokeWidth={2} />,
      title: 'Cinematic Typography',
      description:
        'Automatically animate text with motion-design quality kinetic typography. Forget manual keyframes—our engine handles the timing, spacing, and easing for you.'
    },
    {
      icon: <TrendingUp size={28} strokeWidth={2} />,
      title: 'Predictive Reach',
      description:
        'Our proprietary AI analyzes millions of viral data points to score your hook before you publish. Optimize your content for maximum retention.'
    },
    {
      icon: <MessageCircle size={28} strokeWidth={2} />,
      title: 'Auto-DM Growth',
      description:
        'Turn passive views into active leads. Automatically trigger DM sequences when users comment specific keywords, boosting conversion by 300%.'
    }
  ];

  return (
    <section className="py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-sm font-bold text-brand-blue uppercase tracking-widest mb-4">
            Powerful Features
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-brand-navy tracking-tight mb-6">
            Everything you need to go viral.
          </h3>
          <p className="text-xl text-brand-slate leading-relaxed">
            Built for creators who value speed, quality, and data-driven results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
