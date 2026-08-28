import React from 'react';
import { useSite } from '../../context/SiteContext';
import { Heart, ShieldCheck, Flame, Sparkles, Sun, Eye } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data } = useSite();
  const { siteConfig } = data;

  return (
    <section id="nosotros" className="py-12 lg:py-14 lg:min-h-[calc(100vh-5rem)] lg:flex lg:flex-col lg:justify-center bg-mystic-dark border-b border-amber-500/25 relative overflow-hidden">
      
      {/* Ambient Blob */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none animate-float" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-10 relative z-10 w-full">
        
        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Text Block */}
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 liquid-glass-pill text-amber-300 text-xs font-semibold shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase tracking-wider font-serif-title">{siteConfig.aboutBadge || "✨ Don Espiritual & Devoción"}</span>
            </div>

            <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient leading-tight">
              {siteConfig.aboutTitle}
            </h2>

            <p className="text-purple-100/90 text-base sm:text-xl font-serif-body leading-relaxed font-normal">
              {siteConfig.aboutText}
            </p>

            <div className="p-6 liquid-glass-card shadow-2xl space-y-3">
              <h3 className="font-serif-title font-bold text-xl text-amber-300 flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                Consagración y Ritualización Personalizada
              </h3>
              <p className="text-purple-200/90 text-xs sm:text-sm leading-relaxed font-serif-body">
                {siteConfig.traditionText}
              </p>
            </div>
          </div>

          {/* Right Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-up stagger-2">
            
            <div className="p-6 liquid-glass-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center font-bold border border-amber-300 shadow-md">
                <Eye className="w-6 h-6 text-purple-950" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-amber-300">
                Lecturas de Tarot Certeras
              </h3>
              <p className="text-purple-200/90 font-serif-body text-xs sm:text-sm leading-relaxed">
                Consultas presenciales o virtuales con interpretación profunda y orientación clara en decisiones sentimentales y laborales.
              </p>
            </div>

            <div className="p-6 liquid-glass-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center font-bold border border-amber-300 shadow-md">
                <Sun className="w-6 h-6 text-purple-950" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-amber-300">
                Limpias Energéticas
              </h3>
              <p className="text-purple-200/90 font-serif-body text-xs sm:text-sm leading-relaxed">
                Desbloqueo de aura y purificación profunda para disolver mal de ojo, envidias y pesadez espiritual.
              </p>
            </div>

            <div className="p-6 liquid-glass-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center font-bold border border-amber-300 shadow-md">
                <ShieldCheck className="w-6 h-6 text-purple-950" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-amber-300">
                Amuletos Curados
              </h3>
              <p className="text-purple-200/90 font-serif-body text-xs sm:text-sm leading-relaxed">
                Cuarzos y amuletos impregnados de energía de resguardo personal para proteger tu hogar y negocio.
              </p>
            </div>

            <div className="p-6 liquid-glass-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center font-bold border border-amber-300 shadow-md">
                <Heart className="w-6 h-6 text-purple-950" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-amber-300">
                Atención Confidencial
              </h3>
              <p className="text-purple-200/90 font-serif-body text-xs sm:text-sm leading-relaxed">
                Trato empático, ético y absolutamente confidencial en cada consulta para tu plena tranquilidad.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
