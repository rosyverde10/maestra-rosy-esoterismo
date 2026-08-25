import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { ArrowDown, MessageCircle, Sparkles, Eye } from 'lucide-react';

export const Hero: React.FC = () => {
  const { data } = useSite();
  const { siteConfig } = data;
  const [heroLoaded, setHeroLoaded] = useState(false);

  const whatsappMessage = `Hola Maestra Rosy, vi su sitio web de esoterismo y me gustaría agendar una consulta o pedir informes.`;
  const whatsappUrl = `https://wa.me/${data.socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="inicio" className="relative overflow-hidden bg-mystic-pattern py-8 sm:py-12 md:py-16 border-b border-amber-500/20">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Hero Text */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left animate-fade-up">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-amber-400/40 text-amber-300 text-xs font-semibold shadow-lg backdrop-blur-md mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-star-glow" />
              <span>{siteConfig.heroBadge || "✨ Maestra Rosy • Canalizadora & Guía Espiritual"}</span>
            </div>

            <h1 className="font-serif-title font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-gold-gradient leading-[1.15] tracking-tight drop-shadow-lg">
              {siteConfig.heroTitle}
            </h1>

            <p className="text-purple-200/90 font-serif-body text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {siteConfig.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 sm:pt-4">
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
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-amber-950 font-bold text-base shadow-xl hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2.5 group border border-amber-300/40 transform hover:-translate-y-0.5"
              >
                <span>{siteConfig.heroCtaButton || "Ver Catálogo Esotérico"}</span>
                <ArrowDown className="w-4 h-4 text-amber-950 animate-bounce shrink-0" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-emerald-300 hover:text-emerald-200 transition-all py-3.5 px-6 bg-emerald-950/60 hover:bg-emerald-900/80 rounded-full border border-emerald-500/40 shadow-lg backdrop-blur-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteConfig.heroWhatsappCta || "Agendar Cita por WhatsApp"}</span>
              </a>
            </div>

            {/* Key Features Badges */}
            <div className="pt-6 sm:pt-8 border-t border-purple-900/40 grid grid-cols-3 gap-2 sm:gap-4 text-center max-w-xl mx-auto lg:mx-0">
              <div className="space-y-1 p-3 rounded-2xl bg-purple-950/60 backdrop-blur-md border border-amber-500/20 shadow-md">
                <span className="block font-bold text-amber-300 text-xs sm:text-sm">{siteConfig.heroFeature1Title || "Tarot Certero"}</span>
                <span className="block text-[11px] text-purple-300/80">{siteConfig.heroFeature1Subtitle || "Presencial & En línea"}</span>
              </div>
              <div className="space-y-1 p-3 rounded-2xl bg-purple-950/60 backdrop-blur-md border border-amber-500/20 shadow-md">
                <span className="block font-bold text-amber-300 text-xs sm:text-sm">{siteConfig.heroFeature2Title || "Limpias & Sanación"}</span>
                <span className="block text-[11px] text-purple-300/80">{siteConfig.heroFeature2Subtitle || "Aura y Energías"}</span>
              </div>
              <div className="space-y-1 p-3 rounded-2xl bg-purple-950/60 backdrop-blur-md border border-amber-500/20 shadow-md">
                <span className="block font-bold text-amber-300 text-xs sm:text-sm">{siteConfig.heroFeature3Title || "Productos Curados"}</span>
                <span className="block text-[11px] text-purple-300/80">{siteConfig.heroFeature3Subtitle || "Velas y Lociones"}</span>
              </div>
            </div>

          </div>

          {/* Hero Image Card */}
          <div className="lg:col-span-5 relative animate-fade-up stagger-2">
            
            {/* Decorative Floating Pill */}
            <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 z-20 bg-[#1e0e38] p-3 sm:p-4 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center gap-3 animate-float backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-900 to-indigo-900 text-amber-300 flex items-center justify-center shadow-md shrink-0 border border-amber-400/30">
                <Eye className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="block font-bold text-xs text-amber-300">Sanación & Claridad</span>
                <span className="block text-[10px] text-purple-300/80 font-medium">Trabajos de luz garantizados</span>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/40 bg-purple-950/80 min-h-[360px]">
              {!heroLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-purple-900/50 to-purple-950/40 animate-shimmer" />
              )}
              <img
                src={siteConfig.heroImage}
                alt="Maestra Rosy Esoterismo Altar"
                onLoad={() => setHeroLoaded(true)}
                className={`w-full h-[360px] sm:h-[440px] lg:h-[480px] xl:h-[540px] object-cover transition-all duration-700 hover:scale-105 ${
                  heroLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0517] via-purple-950/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5 z-10">
                <span className="inline-block px-3 py-1 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                  ✨ Altar Consagrado
                </span>
                <h3 className="font-serif-title font-bold text-xl sm:text-2xl xl:text-3xl text-amber-200 leading-tight">
                  Luz, Paz y Sabiduría Espiritual
                </h3>
                <p className="text-xs sm:text-sm text-purple-200/90 font-serif-body">
                  Ritualizaciones a la medida y lecturas de alta certez
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
