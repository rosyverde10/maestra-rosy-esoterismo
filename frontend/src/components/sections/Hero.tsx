import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { ArrowDown, MessageCircle, Sparkles, Compass, ShieldCheck, Flame } from 'lucide-react';

export const Hero: React.FC = () => {
  const { data } = useSite();
  const { siteConfig } = data;
  const [heroLoaded, setHeroLoaded] = useState(false);

  const whatsappMessage = `Hola Maestra Rosy, vi su sitio web de esoterismo y me gustaría agendar una consulta o pedir informes.`;
  const whatsappUrl = `https://wa.me/${data.socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="inicio" className="relative overflow-hidden bg-mystic-pattern py-12 sm:py-16 md:py-20 border-b border-amber-500/25">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-purple-900/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Main Hero Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-up">
            
            {/* Celestial Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-purple-950/90 border border-amber-400/50 text-amber-300 text-xs font-semibold shadow-[0_0_20px_rgba(251,191,36,0.2)] backdrop-blur-md mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-star-glow" />
              <span className="tracking-wider uppercase">{siteConfig.heroBadge || "✨ Maestra Rosy • Canalizadora & Guía Espiritual"}</span>
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
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3 sm:pt-5">
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
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-shine text-purple-950 font-serif-title font-bold text-sm shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3 border border-amber-300 uppercase tracking-wider"
              >
                <span>{siteConfig.heroCtaButton || "Explorar Catálogo Esotérico"}</span>
                <ArrowDown className="w-4 h-4 text-purple-950 animate-bounce shrink-0" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold text-emerald-300 hover:text-white transition-all py-4 px-7 bg-emerald-950/80 hover:bg-emerald-900/90 rounded-full border border-emerald-500/50 shadow-xl backdrop-blur-md uppercase tracking-wider animate-pulse-glow"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 fill-emerald-400/20" />
                <span>{siteConfig.heroWhatsappCta || "Agendar Consulta Privada"}</span>
              </a>
            </div>

            {/* Feature Pillars Grid */}
            <div className="pt-7 sm:pt-9 border-t border-amber-500/20 grid grid-cols-3 gap-3 text-center max-w-xl mx-auto lg:mx-0">
              <div className="space-y-1 p-3.5 rounded-2xl bg-purple-950/50 backdrop-blur-md border border-amber-500/30 shadow-lg hover:border-amber-400/60 transition-all">
                <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="block font-serif-title font-bold text-amber-300 text-xs sm:text-sm">{siteConfig.heroFeature1Title || "Tarot Certero"}</span>
                <span className="block text-[11px] text-purple-200/80 font-serif-body">{siteConfig.heroFeature1Subtitle || "Presencial & En línea"}</span>
              </div>
              <div className="space-y-1 p-3.5 rounded-2xl bg-purple-950/50 backdrop-blur-md border border-amber-500/30 shadow-lg hover:border-amber-400/60 transition-all">
                <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="block font-serif-title font-bold text-amber-300 text-xs sm:text-sm">{siteConfig.heroFeature2Title || "Limpias & Sanación"}</span>
                <span className="block text-[11px] text-purple-200/80 font-serif-body">{siteConfig.heroFeature2Subtitle || "Aura y Energías"}</span>
              </div>
              <div className="space-y-1 p-3.5 rounded-2xl bg-purple-950/50 backdrop-blur-md border border-amber-500/30 shadow-lg hover:border-amber-400/60 transition-all">
                <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="block font-serif-title font-bold text-amber-300 text-xs sm:text-sm">{siteConfig.heroFeature3Title || "Productos Curados"}</span>
                <span className="block text-[11px] text-purple-200/80 font-serif-body">{siteConfig.heroFeature3Subtitle || "Velas y Lociones"}</span>
              </div>
            </div>

          </div>

          {/* Hero Showcase Image Box */}
          <div className="lg:col-span-5 relative animate-fade-up stagger-2">
            
            {/* Floating Celestial Badge */}
            <div className="absolute -top-5 -right-3 z-20 bg-[#120824] p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] border-2 border-amber-400/60 flex items-center gap-3 animate-float backdrop-blur-md">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-purple-950 flex items-center justify-center shadow-md shrink-0 font-bold border border-amber-300">
                <Compass className="w-6 h-6 text-purple-950" />
              </div>
              <div>
                <span className="block font-serif-title font-bold text-xs text-amber-300">Sanación & Claridad</span>
                <span className="block text-[10px] text-purple-200/80 font-medium">Trabajos espirituales con luz</span>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.9)] border-2 border-amber-400/50 bg-purple-950/80 min-h-[380px] group">
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

              <div className="absolute inset-0 bg-gradient-to-t from-[#06030b] via-[#06030b]/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 z-10">
                <span className="inline-block px-3.5 py-1 rounded-full bg-gold-shine text-purple-950 text-[11px] font-serif-title font-extrabold uppercase tracking-wider shadow-lg border border-amber-300">
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

      </div>
    </section>
  );
};
