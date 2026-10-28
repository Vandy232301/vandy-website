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
  Code2,
  Palette,
  ChevronDown,
  Globe,
  Briefcase,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { ProjectCard } from './components/ProjectCard';
import { PromoFlags } from './components/PromoFlags';
import { PROJECTS } from '../data/projects';
import { useLoves } from './hooks/useLoves';
// Personajul negru, varianta din 22.10.2026 (semi-profil, ținuta B). Owner,
// 29.10.2026: „Pe vandy.ro este imagine aia neagra cu mine negru, vrau sa o
// inlocuiesti cu imagine noua cu mine negru si la fel si la favicon sa o pui."
// Sursa, 4096²: ~/art-cinematic-video-ai/projects/personaj_v2/avatar_semi_v3.png
//   sips -Z 1024 avatar_semi_v3.png --out src/assets/vandy-personaj.png
// Aceeași imagine a plecat și în public/og-image.png (1024², cât scrie în meta),
// iar decupajul pe față în favicon-uri și apple-touch-icon.
// Randarea veche (280a05b4…png) rămâne în repo, nefolosită, dacă vrei înapoi.
import AVATAR_IMG from '../assets/vandy-personaj.png';
import HERO_IMG from '../assets/vandy-personaj.png';

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
  const { loves, lovedIds, love } = useLoves();

  return (
    <>
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

        {/* ATELIER AI — oferta principală. Stă deasupra steagurilor pentru că
            e singurul lucru pe care îl vindem direct de pe prima pagină. */}
        <a
          href="/mentorat"
          className="group relative overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900/70 hover:bg-neutral-900 hover:border-neutral-600 transition-colors backdrop-blur-sm p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5 md:gap-8"
        >
          <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent blur-xl" />
          </div>

          <div className="relative flex-1 min-w-0 space-y-2.5">
            <span className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500">
              {t.mentorat.tag}
            </span>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
              {t.mentorat.title}
            </h3>
            <p className="text-neutral-500 text-xs font-medium">
              {t.mentorat.meta}
              {t.mentorat.nota && <span className="text-neutral-600"> · {t.mentorat.nota}</span>}
            </p>
          </div>

          <span className="relative shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black tracking-tight group-hover:bg-neutral-200 transition-colors">
            {t.mentorat.cta}
            <ArrowUpRight size={15} />
          </span>
        </a>

        {/* Live offers — one coloured flag per project with an active promo */}
        <div className="pt-6">
          <PromoFlags />
        </div>

        {/* Projects Section Header */}
        <div className="flex items-center gap-3 py-6">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {t.projectsHeader.title}
            </h2>
            <p className="text-neutral-500 text-xs font-medium hidden sm:block">{t.projectsHeader.subtitle}</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              description={t.projects[project.descKey]}
              discoverLabel={t.projects.discover}
              loves={loves[project.id] ?? 0}
              hasLoved={lovedIds.has(project.id)}
              onLove={love}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-neutral-700 text-xs">
           <p>{t.footer}</p>
        </footer>
      </div>
    </div>
    </>
  );
}
