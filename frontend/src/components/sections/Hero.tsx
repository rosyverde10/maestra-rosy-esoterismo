import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { ArrowDown, MessageCircle, Sparkles, Compass, RotateCw, Eye } from 'lucide-react';

interface SpiritualAdviceCard {
  title: string;
  symbol: string;
  advice: string;
  element: string;
}

const adviceCards: SpiritualAdviceCard[] = [
  {
    title: 'La Estrella de la Luz',
    symbol: '⭐',
    advice: 'Tus caminos de paz y salud se abren. Confía en la purificación y en tu fuerza interior para soltar pesadumbres pasadas.',
    element: 'Prosperidad & Claridad'
  },
  {
    title: 'El Sol de la Abundancia',
    symbol: '☀️',
    advice: 'Día propicio para proyectos laborales y comerciales. Las intenciones de crecimiento económico se multiplican con fe.',
    element: 'Éxito Financiero'
  },
  {
    title: 'La Luna de la Intuición',
    symbol: '🌙',
    advice: 'Escucha tus pálpitos en el amor y en la familia. Momento ideal para realizar endulzamientos y disolver malentendidos.',
    element: 'Armonía de Pareja'
  },
  {
    title: 'El Escudo del Arcángel',
    symbol: '🛡️',
    advice: 'Estás protegido de miradas o intenciones pesadas. Una limpia espiritual reforzará tu aura para mantenerte inquebrantable.',
    element: 'Protección Absoluta'
  }
];

export const Hero: React.FC = () => {
  const { data } = useSite();
  const { siteConfig } = data;
  const [heroLoaded, setHeroLoaded] = useState(false);
  
  const [currentAdviceIndex, setCurrentAdviceIndex] = useState(0);
  const activeCard = adviceCards[currentAdviceIndex];

  const handleDrawCard = () => {
    setCurrentAdviceIndex((prev) => (prev + 1) % adviceCards.length);
  };

  const whatsappMessage = `Hola Maestra Rosy, me salió la carta del día "${activeCard.title}" en su sitio web y me gustaría agendar una consulta de tarot o pedir informes.`;
  const whatsappUrl = `https://wa.me/${data.socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

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
            <div className="inline-flex items-center gap-2.5 px-4 py-2 liquid-glass-pill text-amber-300 text-xs font-semibold shadow-lg mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-star-glow" />
              <span className="tracking-wider uppercase font-serif-title">{siteConfig.heroBadge || "✨ Maestra Rosy • Canalizadora & Guía Espiritual"}</span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-gold-gradient leading-[1.12] tracking-tight drop-shadow-2xl">
              {siteConfig.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-purple-100/90 font-serif-body text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {siteConfig.heroSubtitle}
            </p>

            {/* Interactive Daily Tarot / Guidance Card Generator */}
            <div className="p-6 liquid-glass-card shadow-2xl space-y-4 max-w-xl mx-auto lg:mx-0 text-left relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-serif-title font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  Consejo Espiritual del Día
                </span>
                <button
                  onClick={handleDrawCard}
                  className="px-3.5 py-1.5 rounded-full bg-purple-950/80 hover:bg-purple-900 text-amber-300 text-xs font-serif-title font-semibold border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Girar Carta</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/80 border border-amber-500/25 flex items-center gap-4 shadow-inner">
                <div className="w-13 h-13 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center text-3xl shadow-lg border border-amber-300 shrink-0">
                  {activeCard.symbol}
                </div>
                <div>
                  <h4 className="font-serif-title font-bold text-base text-amber-300">
                    {activeCard.title} — <span className="text-xs text-purple-200/90 font-serif-body font-normal">{activeCard.element}</span>
                  </h4>
                  <p className="text-xs text-purple-100/90 font-serif-body mt-1 leading-relaxed italic">
                    "{activeCard.advice}"
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
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

        {/* Live Statistics Ticker Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-amber-500/20 text-center">
          <div className="p-4 liquid-glass-pill space-y-1">
            <span className="font-serif-title font-extrabold text-2xl sm:text-3xl text-gold-gradient">+15 Años</span>
            <span className="block text-xs text-purple-200/90 font-serif-body">Guiado Espiritual</span>
          </div>
          <div className="p-4 liquid-glass-pill space-y-1">
            <span className="font-serif-title font-extrabold text-2xl sm:text-3xl text-gold-gradient">100%</span>
            <span className="block text-xs text-purple-200/90 font-serif-body">Atención Confidencial</span>
          </div>
          <div className="p-4 liquid-glass-pill space-y-1">
            <span className="font-serif-title font-extrabold text-2xl sm:text-3xl text-gold-gradient">Presencial</span>
            <span className="block text-xs text-purple-200/90 font-serif-body">Y Consultas Virtuales</span>
          </div>
          <div className="p-4 liquid-glass-pill space-y-1">
            <span className="font-serif-title font-extrabold text-2xl sm:text-3xl text-gold-gradient">24/7</span>
            <span className="block text-xs text-purple-200/90 font-serif-body">Atención por WhatsApp</span>
          </div>
        </div>

      </div>
    </section>
  );
};
