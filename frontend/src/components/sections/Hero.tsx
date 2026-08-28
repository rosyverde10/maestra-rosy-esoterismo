import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext';
import { ArrowDown, MessageCircle, Sparkles, Compass } from 'lucide-react';

export const Hero: React.FC = () => {
  const { data } = useSite();
  const { siteConfig } = data;
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Sequential Illumination Loop State for Ticker Capsules
  const [activeStatIndex, setActiveStatIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const whatsappMessage = `Hola Maestra Rosy, me gustaría agendar una consulta privada o solicitar informes sobre sus servicios esotéricos.`;
  const whatsappUrl = `https://wa.me/${data.socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  const stats = [
    {
      title: '+15 Años',
      subtitle: 'Guiado Espiritual',
      glowClass: 'border-amber-400/90 shadow-[0_0_35px_rgba(251,191,36,0.7)] scale-105 bg-purple-950/95 border-2',
      titleClass: 'text-gold-gradient'
    },
    {
      title: '100%',
      subtitle: 'Atención Confidencial',
      glowClass: 'border-purple-400/90 shadow-[0_0_35px_rgba(192,132,252,0.7)] scale-105 bg-purple-950/95 border-2',
      titleClass: 'text-mystic-gradient'
    },
    {
      title: 'Presencial',
      subtitle: 'Y Consultas Virtuales',
      glowClass: 'border-emerald-400/90 shadow-[0_0_35px_rgba(52,211,153,0.7)] scale-105 bg-emerald-950/90 border-2',
      titleClass: 'text-emerald-300'
    },
    {
      title: '24/7',
      subtitle: 'Atención por WhatsApp',
      glowClass: 'border-teal-400/90 shadow-[0_0_35px_rgba(45,212,191,0.7)] scale-105 bg-teal-950/90 border-2',
      titleClass: 'text-teal-300'
    }
  ];

  return (
    <section id="inicio" className="relative overflow-hidden bg-mystic-pattern py-14 sm:py-20 border-b border-amber-500/25">
      
      {/* Background Liquid Ambient Blobs */}
      <div className="absolute top-10 left-1/4 w-[550px] h-[550px] bg-amber-600/15 rounded-full blur-[140px] pointer-events-none animate-float" />
      <div className="absolute bottom-10 right-1/4 w-[480px] h-[480px] bg-purple-800/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10 space-y-12 sm:space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Main Hero Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-up">
            
            {/* Liquid Glass Badge */}
            <div className="inline-flex items-center gap-2.5 px-4.5 py-2 liquid-glass-pill text-amber-300 text-xs font-semibold shadow-lg mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-star-glow" />
              <span className="tracking-wider uppercase font-serif-title">{siteConfig.heroBadge || "Maestra Rosy • Canalizadora & Guía Espiritual"}</span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-gold-gradient leading-[1.12] tracking-tight drop-shadow-2xl">
              {siteConfig.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-purple-100/90 font-serif-body text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {siteConfig.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#catalogo"
                onClick={(e) => {
                  e.preventDefault();
                  const targetElement = document.querySelector('#catalogo');
                  if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    if (window.history.replaceState) {
                      window.history.replaceState(null, '', window.location.pathname);
                    }
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 liquid-glass-btn text-xs sm:text-sm flex items-center justify-center gap-3 uppercase tracking-wider"
              >
                <span>{siteConfig.heroCtaButton || "Explorar Catálogo Esotérico"}</span>
                <ArrowDown className="w-4 h-4 text-purple-950 animate-bounce shrink-0" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold text-emerald-300 hover:text-white transition-all py-4 px-7 bg-emerald-950/80 hover:bg-emerald-900/90 rounded-full border border-emerald-500/50 shadow-xl backdrop-blur-md uppercase tracking-wider animate-pulse-glow font-serif-title"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 fill-emerald-400/20" />
                <span>{siteConfig.heroWhatsappCta || "Agendar Consulta Privada"}</span>
              </a>
            </div>

          </div>

          {/* Hero Showcase Image Box */}
          <div className="lg:col-span-5 relative animate-fade-up stagger-2">
            
            {/* Floating Celestial Badge */}
            <div className="absolute -top-5 -right-3 z-20 liquid-glass-pill p-4 shadow-[0_10px_30px_rgba(0,0,0,0.9)] border-2 border-amber-400/60 flex items-center gap-3 animate-float">
              <div className="w-11 h-11 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center shadow-md shrink-0 font-bold border border-amber-300">
                <Compass className="w-6 h-6 text-purple-950" />
              </div>
              <div>
                <span className="block font-serif-title font-bold text-xs text-amber-300">Sanación & Claridad</span>
                <span className="block text-[10px] text-purple-200/90 font-serif-body">Trabajos espirituales con luz</span>
              </div>
            </div>

            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-amber-400/50 bg-purple-950/80 min-h-[380px] group">
              {!heroLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-purple-900/50 to-purple-950/40 animate-shimmer" />
              )}
              <img
                src={siteConfig.heroImage}
                alt="Maestra Rosy Esoterismo Altar"
                onLoad={() => setHeroLoaded(true)}
                className={`w-full h-[380px] sm:h-[460px] lg:h-[500px] xl:h-[560px] object-cover transition-all duration-700 group-hover:scale-105 ${
                  heroLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#05020a] via-[#05020a]/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 z-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-gold-shine text-purple-950 text-[11px] font-serif-title font-extrabold uppercase tracking-wider shadow-lg border border-amber-300">
                  ✨ Altar Consagrado & Preparado
                </span>
                <h3 className="font-serif-title font-bold text-2xl sm:text-3xl text-amber-200 leading-tight">
                  Luz, Paz y Sabiduría Espiritual
                </h3>
                <p className="text-xs sm:text-sm text-purple-200/90 font-serif-body">
                  Ritualizaciones personalizadas y lecturas con máxima discreción
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Live Statistics Ticker Banner - Continuous Sequential Illumination */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-amber-500/20 text-center">
          {stats.map((stat, idx) => {
            const isActive = activeStatIndex === idx;
            return (
              <div
                key={idx}
                className={`p-4 rounded-full transition-all duration-700 space-y-1 cursor-default ${
                  isActive
                    ? stat.glowClass
                    : 'liquid-glass-pill opacity-75 border-amber-500/25'
                }`}
              >
                <span className={`font-serif-title font-extrabold text-2xl sm:text-3xl block transition-all duration-700 ${isActive ? stat.titleClass : 'text-gold-gradient'}`}>
                  {stat.title}
                </span>
                <span className={`block text-xs font-serif-body transition-colors duration-700 ${isActive ? 'text-white font-semibold' : 'text-purple-200/90'}`}>
                  {stat.subtitle}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
