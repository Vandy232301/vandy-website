import React, { useState } from 'react';
import { BentoCard } from './components/BentoCard';
import { SocialPill } from './components/SocialPill';
import { 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Send, 
  Gamepad2,
  Twitter,
  ArrowUpRight,
  Code2,
  Palette,
  Terminal,
  Cpu,
  Users,
  ChevronDown,
  Globe,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import NOVA_AVATAR from '../assets/fc3f352a7826e110a4b12bca4410c3eb1830ab06.png';
import DYNASTY_AVATAR from '../assets/03904df2942f7c80bca73f9a396f79905354fc62.png';
import CONSULT_AVATAR from '../assets/3bbc069757dad33abd5dd680bf92c4d16fa802b5.png';
import AVATAR_IMG from '../assets/280a05b4e7cffd644dd36f6c7453213920fff3ac.png';
import HERO_IMG from '../assets/280a05b4e7cffd644dd36f6c7453213920fff3ac.png';

// Unsplash Images
const TRADING_IMG = "https://images.unsplash.com/photo-1649848964263-2666b0c355a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHRyYWRpbmclMjBjaGFydCUyMGRhcmslMjBuZW9ufGVufDF8fHx8MTc3MDg4NjI3NXww&ixlib=rb-4.1.0&q=80&w=1080";
const AI_IMG = "https://images.unsplash.com/photo-1563949630094-40cf4bd52ade?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYnJhaW4lMjBjaGlwJTIwZ2xvd2luZyUyMGRhcmt8ZW58MXx8fHwxNzcwODg2Mjc1fDA&ixlib=rb-4.1.0&q=80&w=1080";
const COMMUNITY_IMG = "https://images.unsplash.com/photo-1675044794023-2c70962f4899?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG5ldHdvcmslMjBjb25uZWN0aW9uJTIwZG90cyUyMGxpbmVzJTIwZGFya3xlbnwxfHx8fDE3NzA4ODYyODN8MA&ixlib=rb-4.1.0&q=80&w=1080";

import { translations } from '../data/translations';

export default function App() {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const languages = ['RO', 'EN', 'ES', 'FR', 'DE', 'RU'];

  const t = translations[currentLang as keyof typeof translations];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 font-sans tracking-tight p-4 md:p-6 lg:p-8 flex justify-center">
      
      {/* Background Gradient - Minimal Grey */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black pointer-events-none" />

      {/* Main Container - Reduced Max Width */}
      <div className="w-full max-w-5xl relative z-10 flex flex-col gap-4">
        
        {/* Header - Compact & Horizontal */}
        <header className="flex flex-row justify-between items-center py-4 relative z-50">
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              VANDY
            </h1>
            <p className="text-neutral-500 text-xs font-medium hidden sm:block">{t.role}</p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Language Dropdown */}
            <div className="relative group">
                <button 
                    onClick={() => setLangOpen(!langOpen)}
                    className="flex items-center justify-between w-20 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
                >
                    <Globe size={12} className="text-neutral-400"/>
                    <span>{currentLang}</span>
                    <ChevronDown size={12} className={`text-neutral-500 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {langOpen && (
                    <div className="absolute right-0 top-full mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col z-50 py-1">
                        {languages.map(lang => (
                            <button
                                key={lang}
                                onClick={() => {
                                    setCurrentLang(lang);
                                    setLangOpen(false);
                                }}
                                className={`w-full py-2 text-xs text-center font-medium hover:bg-neutral-800 transition-colors ${currentLang === lang ? 'text-white bg-white/10' : 'text-neutral-500'}`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </header>

        {/* Bento Grid - Tighter Rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-[minmax(140px,auto)]">
          
          {/* Unified Hero Section (Profile + Image + Socials) */}
          <BentoCard colSpan="md:col-span-3" rowSpan="row-span-auto" className="p-0 overflow-hidden bg-neutral-900/40 border-neutral-800">
            <div className="flex flex-col">
              
              {/* Top Section: Content + Image */}
              <div className="flex flex-col md:flex-row border-b border-neutral-800/50">
                
                {/* Left: Content */}
                <div className="flex-1 p-6 pb-8 md:p-8 flex flex-col justify-between relative z-10 bg-gradient-to-br from-neutral-900/50 to-transparent">
                   <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-700 grayscale shadow-lg">
                          <ImageWithFallback src={AVATAR_IMG} alt="Vandy Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h2 className="text-white text-base font-bold tracking-wide">
                            {t.hero.greeting1} <br className="md:hidden" /> {t.hero.greeting2}
                          </h2>
                          <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-widest font-semibold">
                             {t.hero.role1} <br className="md:hidden" /> {t.hero.role2}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 text-neutral-600">
                         <Briefcase size={18} />
                         <TrendingUp size={18} />
                         <Code2 size={18} />
                         <Palette size={18} />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-3xl md:text-3xl font-bold leading-relaxed text-white tracking-tight max-w-xl">
                        {t.hero.title1} {t.hero.title2} <span className="text-neutral-500">{t.hero.title3}</span>
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
                        {t.hero.desc}
                      </p>
                   </div>
                </div>

                {/* Right: Feature Image */}
                <div className="w-full md:w-2/5 relative aspect-square md:aspect-auto border-l border-neutral-800/50 group">
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                   <ImageWithFallback 
                      src={HERO_IMG} 
                      alt="3D Character" 
                      loading="eager"
                      className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                   />
                </div>
              </div>

              {/* Bottom Section: Connect Bar */}
              <div className="p-4 md:px-8 bg-neutral-900/30 backdrop-blur-md flex flex-col md:flex-row items-center gap-4">
                 <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest whitespace-nowrap">{t.hero.connect}</span>
                 <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full">
                    <SocialPill icon={MessageCircle} label="Tiktok" href="https://www.tiktok.com/@vandy.001" />
                    <SocialPill icon={Instagram} label="Instagram" href="https://www.instagram.com/vandy_o1/" />
                    <SocialPill icon={Twitter} label="X" href="https://x.com/vandy_001" />
                    <SocialPill icon={Send} label="Telegram" href="https://t.me/VANDY_001_Official" />
                    <SocialPill icon={Youtube} label="Youtube" href="https://www.youtube.com/@vandy2323" />
                    <SocialPill icon={Gamepad2} label="Discord" href="https://discord.gg/AfAcgp3G" />
                 </div>
              </div>

            </div>
          </BentoCard>

        </div>

        {/* Projects Section Header */}
        <div className="flex items-center gap-3 py-6">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {t.projectsHeader.title}
            </h2>
            <p className="text-neutral-500 text-xs font-medium hidden sm:block">{t.projectsHeader.subtitle}</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* Project 1: Dynasty Trades */}
          <BentoCard 
            colSpan="col-span-1" 
            href="https://dynasty.vandy.ro/"
            className="group relative min-h-[400px] md:min-h-[450px] bg-neutral-950 border-neutral-900 hover:bg-neutral-950 hover:border-neutral-900 flex flex-col overflow-hidden"
          >
             {/* Top Section */}
             <div className="relative z-10 p-6 flex justify-between items-start">
                <div className="px-3 py-1 rounded-full bg-neutral-900/50 backdrop-blur-sm text-neutral-300 text-[10px] font-bold tracking-wider uppercase">
                   Trading
                </div>
                <ArrowUpRight className="text-neutral-500 group-hover:text-white transition-colors" size={20} />
             </div>

             {/* Dynasty Avatar */}
             <div className="absolute top-16 left-6 w-20 h-20 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl z-20 grayscale group-hover:grayscale-0 transition-all duration-500">
                <ImageWithFallback src={DYNASTY_AVATAR} alt="Dynasty Avatar" loading="lazy" className="w-full h-full object-cover" />
             </div>

             {/* Bottom Content */}
             <div className="relative z-10 p-6 mt-auto">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                   DYNASTY
                </h3>
                <p className="text-neutral-500 text-xs font-medium leading-relaxed">
                   {t.projects.dynastyDesc}
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-bold text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                     {t.projects.discover}
                  </span>
                </div>
             </div>
          </BentoCard>

          {/* Project 2: Nova AI */}
          <BentoCard colSpan="col-span-1" href="https://nova.vandy.ro/" className="group relative min-h-[400px] md:min-h-[450px] bg-neutral-950 border-neutral-900 hover:bg-neutral-950 hover:border-neutral-900 flex flex-col overflow-hidden">
             {/* Top Section */}
             <div className="relative z-10 p-6 flex justify-between items-start">
                <div className="px-3 py-1 rounded-full bg-neutral-900/50 backdrop-blur-sm text-neutral-300 text-[10px] font-bold tracking-wider uppercase">
                   Technology
                </div>
                <ArrowUpRight className="text-neutral-500 group-hover:text-white transition-colors" size={20} />
             </div>

             {/* Nova Avatar */}
             <div className="absolute top-16 left-6 w-20 h-20 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl z-20 grayscale group-hover:grayscale-0 transition-all duration-500">
                <ImageWithFallback src={NOVA_AVATAR} alt="Nova AI Avatar" loading="lazy" className="w-full h-full object-cover" />
             </div>

             {/* Bottom Content */}
             <div className="relative z-10 p-6 mt-auto w-full">
                <h3 className="text-2xl font-bold text-white mb-2">
                   NOVA
                </h3>
                <p className="text-neutral-500 text-xs font-medium leading-relaxed">
                   {t.projects.novaDesc}
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-bold text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                     {t.projects.discover}
                  </span>
                </div>
             </div>
          </BentoCard>

          {/* Project 3: Founders */}
          <BentoCard colSpan="col-span-1" href="https://calendar.app.google/VCpnWRt8HGQLPJATA" className="group relative min-h-[400px] md:min-h-[450px] bg-neutral-950 border-neutral-900 hover:bg-neutral-950 hover:border-neutral-900 flex flex-col overflow-hidden">
             {/* Top Section */}
             <div className="relative z-10 p-6 flex justify-between items-start">
                <div className="px-3 py-1 rounded-full bg-neutral-900/50 backdrop-blur-sm text-neutral-300 text-[10px] font-bold tracking-wider uppercase">
                   Services
                </div>
                <ArrowUpRight className="text-neutral-500 group-hover:text-white transition-colors" size={20} />
             </div>

             {/* Consult Avatar */}
             <div className="absolute top-16 left-6 w-20 h-20 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl z-20 grayscale group-hover:grayscale-0 transition-all duration-500">
                <ImageWithFallback src={CONSULT_AVATAR} alt="Consult Avatar" loading="lazy" className="w-full h-full object-cover" />
             </div>

             {/* Bottom Content */}
             <div className="relative z-10 p-6 mt-auto">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                   CONSULT
                </h3>
                <p className="text-neutral-500 text-xs font-medium leading-relaxed">
                   {t.projects.foundersDesc}
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-bold text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                     {t.projects.discover}
                  </span>
                </div>
             </div>
          </BentoCard>



        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-neutral-700 text-xs">
           <p>{t.footer}</p>
        </footer>
      </div>
    </div>
  );
}
