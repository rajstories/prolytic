import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Features } from './Features';
import { Pricing } from './Pricing';
import { OnboardingModal } from './OnboardingModal';
import { Architecture } from './Architecture';
import { Layout } from '../layout';

export const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Layout className="bg-white">
      <Navbar onOpenModal={openModal} />
      <main>
        <div id="product" className="scroll-mt-28">
          <Hero onOpenModal={openModal} />
        </div>

        <div id="solutions" className="bg-brand-bg border-t border-slate-100 scroll-mt-28">
          <Features />
        </div>

        <div id="architecture" className="scroll-mt-28">
          <Architecture />
        </div>

        <div id="pricing" className="scroll-mt-28">
          <Pricing />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center shadow-lg shadow-slate-900/10">
              <div className="w-3.5 h-3.5 border-[1.5px] border-white rounded-[1px] transform rotate-45 translate-y-[0.5px]"></div>
            </div>
            <span className="font-semibold text-brand-navy tracking-tight text-base">
              Prolytic
            </span>
          </div>
          <p className="font-medium text-slate-500">&copy; 2026 Prolytic Inc.</p>
        </div>
      </footer>

      <OnboardingModal isOpen={isModalOpen} onClose={closeModal} />
    </Layout>
  );
};
