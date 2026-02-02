import React, { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';

export const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const tiers = [
    {
      name: 'Hobby',
      price: 0,
      description: 'For individuals exploring content creation.',
      features: [
        '10 minutes AI processing/mo',
        '720p video exports',
        'Standard watermarks',
        'Basic caption styles',
        'Community support'
      ],
      cta: 'Start Free',
      highlighted: false
    },
    {
      name: 'Pro',
      price: isAnnual ? 15 : 19,
      description: 'For serious creators and freelancers.',
      features: [
        '60 minutes AI processing/mo',
        '4K Ultra HD exports',
        'No watermarks',
        'Predictive Reach Analytics',
        'Trending Hashtag generation',
        'Priority processing'
      ],
      cta: 'Go Pro',
      highlighted: true
    },
    {
      name: 'Studio',
      price: isAnnual ? 79 : 99,
      description: 'For agencies and high-volume media teams.',
      features: [
        'Unlimited video projects',
        'Team Workspaces',
        'Advanced collaboration tools',
        'Custom brand fonts & styles',
        'API Access',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  const faqs = [
    {
      question: 'Can I cancel anytime?',
      answer:
        'Yes. There are no long-term contracts for monthly plans. You can cancel or downgrade your subscription at any time from your account settings.'
    },
    {
      question: 'What are AI credits?',
      answer:
        'Credits measure the amount of video footage you process. 1 minute of video equals 1 credit. Unused credits roll over for up to 3 months on Pro plans.'
    },
    {
      question: 'Do you offer student discounts?',
      answer:
        'Yes! Students with a valid .edu email address are eligible for 50% off the Pro plan for the first year.'
    },
    {
      question: 'What happens if I exceed my limits?',
      answer:
        "You'll be notified when you're close to your limit. You can purchase 'Top-Up' packs instantly or upgrade to the next tier."
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#1A1A40] font-black text-4xl md:text-5xl tracking-tight mb-6">
            Simple pricing for viral growth.
          </h2>
          <p className="text-xl text-slate-500">
            Start for free, upgrade when you go viral.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-semibold ${
                !isAnnual ? 'text-[#1A1A40]' : 'text-slate-400'
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 bg-[#1A1A40] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                  isAnnual ? 'translate-x-8' : 'translate-x-0'
                }`}
              ></div>
            </button>
            <span
              className={`text-sm font-semibold ${
                isAnnual ? 'text-[#1A1A40]' : 'text-slate-400'
              }`}
            >
              Annually{' '}
              <span className="text-emerald-600 text-xs ml-1 font-bold">
                (Save 20%)
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative z-10">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-8 rounded-2xl flex flex-col h-full transition-all duration-300 ${
                tier.highlighted
                  ? 'bg-[#1A1A40] text-white shadow-2xl shadow-blue-900/20 scale-105 ring-1 ring-white/10'
                  : 'bg-white border border-slate-200 text-slate-900 hover:border-blue-200 hover:shadow-xl'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <h3
                className={`text-xl font-bold mb-2 ${
                  tier.highlighted ? 'text-white' : 'text-[#1A1A40]'
                }`}
              >
                {tier.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black tracking-tight">
                  ${tier.price}
                </span>
                <span
                  className={`text-sm font-medium ${
                    tier.highlighted ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  /mo
                </span>
              </div>
              <p
                className={`text-sm mb-8 leading-relaxed ${
                  tier.highlighted ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {tier.description}
              </p>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium">
                    <Check
                      size={18}
                      className={`shrink-0 ${
                        tier.highlighted ? 'text-blue-400' : 'text-blue-600'
                      }`}
                    />
                    <span
                      className={
                        tier.highlighted ? 'text-slate-100' : 'text-slate-700'
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  tier.highlighted
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#1A1A40]'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto border-t border-slate-100 pt-20">
          <div className="flex items-center gap-3 mb-10 justify-center">
            <HelpCircle className="text-blue-600" />
            <h3 className="text-2xl font-bold text-[#1A1A40]">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h4 className="font-bold text-[#1A1A40] mb-2 text-lg">
                  {faq.question}
                </h4>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
