import React from 'react';
import { Menu } from 'lucide-react';

interface NavbarProps {
  onOpenModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal }) => {
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a
          href="#product"
          onClick={(e) => scrollToSection(e, 'product')}
          className="flex items-center gap-4 cursor-pointer"
        >
          <div className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center shadow-lg shadow-slate-900/10">
            <div className="w-3.5 h-3.5 border-[1.5px] border-white rounded-[1px] transform rotate-45 translate-y-[0.5px]"></div>
          </div>

          <span className="font-sans font-semibold text-base tracking-[0.15em] text-[#0F172A] uppercase pt-0.5">
            Prolytic
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#solutions"
            onClick={(e) => scrollToSection(e, 'solutions')}
            className="text-sm font-medium text-slate-500 hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            Solutions
          </a>
          <a 
            href="#pricing" 
            onClick={(e) => scrollToSection(e, 'pricing')}
            className="text-sm font-medium text-slate-500 hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            Pricing
          </a>
          <a 
            href="/docs"
            className="text-sm font-medium text-slate-500 hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            Documentation
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="/onboarding"
            className="bg-[#2563EB] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 duration-200"
          >
            Get Started Free
          </a>

          <button className="md:hidden text-slate-500 hover:text-[#0F172A] transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};
