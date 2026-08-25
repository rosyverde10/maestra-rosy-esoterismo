import React from 'react';
import { useSite } from '../../context/SiteContext';
import { Heart, ShieldCheck, Flame, Sparkles, Sun, Eye } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data } = useSite();
  const { siteConfig } = data;

  return (
    <section id="nosotros" className="py-16 sm:py-24 bg-[#0f071d] border-b border-amber-500/20 relative">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 space-y-12 sm:space-y-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Block */}
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{siteConfig.aboutBadge || "✨ Don Espiritual & Devoción"}</span>
            </div>

            <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient leading-tight">
              {siteConfig.aboutTitle}
            </h2>

            <p className="text-purple-200/90 text-base sm:text-lg font-serif-body leading-relaxed">
              {siteConfig.aboutText}
            </p>

            <div className="p-6 rounded-2xl bg-purple-950/50 border border-amber-500/20 shadow-xl space-y-3 backdrop-blur-md">
              <h3 className="font-serif-title font-bold text-lg text-amber-300 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                Consagración y Preparación de Velones
              </h3>
              <p className="text-purple-200/80 text-xs sm:text-sm leading-relaxed font-serif-body">
                {siteConfig.traditionText}
              </p>
            </div>
          </div>

          {/* Right Visual Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-fade-up stagger-2">
            
            <div className="p-6 rounded-2xl bg-purple-950/60 border border-amber-500/20 shadow-xl space-y-3 backdrop-blur-md transform transition-transform hover:-translate-y-1 hover:border-amber-400/40">
              <div className="w-12 h-12 rounded-xl bg-purple-900/80 text-amber-300 flex items-center justify-center font-bold border border-amber-400/30">
                <Eye className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-amber-300">
                Lecturas de Tarot Certeras
              </h3>
              <p className="text-purple-200/70 text-xs leading-relaxed">
                Consultas presenciales o virtuales con interpretación profunda y orientación en decisiones sentimentales y laborales.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-950/60 border border-amber-500/20 shadow-xl space-y-3 backdrop-blur-md transform transition-transform hover:-translate-y-1 hover:border-amber-400/40">
              <div className="w-12 h-12 rounded-xl bg-purple-900/80 text-amber-300 flex items-center justify-center font-bold border border-amber-400/30">
                <Sun className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-amber-300">
                Limpias Energéticas
              </h3>
              <p className="text-purple-200/70 text-xs leading-relaxed">
                Desbloqueo de aura y purificación para disolver el mal de ojo, envidias y cargas energéticas acumuladas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-950/60 border border-amber-500/20 shadow-xl space-y-3 backdrop-blur-md transform transition-transform hover:-translate-y-1 hover:border-amber-400/40">
              <div className="w-12 h-12 rounded-xl bg-purple-900/80 text-amber-300 flex items-center justify-center font-bold border border-amber-400/30">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-amber-300">
                Amuletos Curados
              </h3>
              <p className="text-purple-200/70 text-xs leading-relaxed">
                Cuarzos y amuletos impregnados de energía de protección personal para resguardar tu hogar y negocio.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-950/60 border border-amber-500/20 shadow-xl space-y-3 backdrop-blur-md transform transition-transform hover:-translate-y-1 hover:border-amber-400/40">
              <div className="w-12 h-12 rounded-xl bg-purple-900/80 text-amber-300 flex items-center justify-center font-bold border border-amber-400/30">
                <Heart className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-amber-300">
                Atención Confidencial
              </h3>
              <p className="text-purple-200/70 text-xs leading-relaxed">
                Trato respetuoso, discreto y empático en cada consulta espiritual para tu total tranquilidad.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
