import React from 'react';
import { useSite } from '../../context/SiteContext';
import { MessageCircle, Phone, MapPin, Clock, Sparkles } from 'lucide-react';

export const SocialContact: React.FC = () => {
  const { data } = useSite();
  const { socialConfig } = data;

  const isIframePreview = typeof window !== 'undefined' && (window.location.search.includes('preview=true') || window.self !== window.top);

  const whatsappMessage = `Hola Maestra Rosy, me gustaría solicitar atención personal o información sobre lecturas de tarot y servicios esotéricos.`;
  const whatsappUrl = `https://wa.me/${socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isIframePreview) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section id="contacto" className="py-12 lg:py-16 bg-mystic-dark relative border-b border-amber-500/25">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8 lg:space-y-10 w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 liquid-glass-pill text-amber-300 text-xs font-semibold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase tracking-wider font-serif-title">Atención Directa & Santuario</span>
          </div>

          <h2 className="font-serif-title text-2xl sm:text-4xl lg:text-4xl font-extrabold text-gold-gradient tracking-tight">
            Contacto Espiritual & Atención Personal
          </h2>

          <p className="text-purple-200/90 text-sm sm:text-base lg:text-lg font-serif-body leading-relaxed">
            Comunícate directamente con la Maestra Rosy por WhatsApp o llamada telefónica para agendar tu consulta presencial o a distancia.
          </p>
        </div>

        {/* 2 Contact Cards Grid: WhatsApp & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up stagger-1">
          
          {/* WhatsApp Card */}
          <a
            href={isIframePreview ? '#' : whatsappUrl}
            target={isIframePreview ? '_self' : '_blank'}
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className={`group p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 text-white shadow-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] transition-all transform hover:-translate-y-1 border border-emerald-500/50 flex flex-col justify-between space-y-6 relative overflow-hidden ${
              isIframePreview ? 'cursor-default' : ''
            }`}
          >
            <div className="space-y-3 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 fill-emerald-950" />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-xl text-emerald-200">WhatsApp Directo</h3>
                <p className="text-emerald-100/90 font-serif-body text-xs sm:text-sm mt-1 leading-relaxed">
                  Atención prioritaria inmediata para agendar lecturas de tarot, limpias y productos consagrados.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-emerald-500/30 flex items-center justify-between font-serif-title font-bold text-xs sm:text-sm text-emerald-300 uppercase tracking-wider relative z-10">
              <span>{socialConfig.whatsappNumber}</span>
              <span className="group-hover:translate-x-1.5 transition-transform text-lg">→</span>
            </div>
          </a>

          {/* Phone Call Card */}
          <a
            href={isIframePreview ? '#' : `tel:${socialConfig.phone.replace(/[^0-9+]/g, '')}`}
            onClick={handleLinkClick}
            className={`group p-6 liquid-glass-card shadow-2xl hover:border-amber-400/80 transition-all transform hover:-translate-y-1 flex flex-col justify-between space-y-6 ${
              isIframePreview ? 'cursor-default' : ''
            }`}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center font-bold shrink-0 shadow-lg border border-amber-300 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-purple-950" />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-xl text-amber-300">Llamada Telefónica</h3>
                <p className="text-purple-200/90 font-serif-body text-xs sm:text-sm mt-1 leading-relaxed">
                  Llamada directa para consultar citas presenciales en santuario o coordinar velaciones a distancia.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-purple-900/60 flex items-center justify-between font-serif-title font-bold text-xs sm:text-sm text-amber-300 uppercase tracking-wider">
              <span>{socialConfig.phone}</span>
              <span className="group-hover:translate-x-1.5 transition-transform text-lg">→</span>
            </div>
          </a>

        </div>

        {/* Sanctuary Address & Working Hours Block */}
        <div className="liquid-glass-card p-6 sm:p-8 shadow-2xl border border-amber-500/30 animate-fade-up stagger-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center shrink-0 border border-amber-300 shadow-md">
                <MapPin className="w-5 h-5 text-purple-950" />
              </div>
              <div>
                <h4 className="font-serif-title font-bold text-base sm:text-lg text-amber-300">Ubicación del Santuario</h4>
                <p className="text-xs sm:text-sm text-purple-200/90 font-serif-body mt-0.5">{socialConfig.locationAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center shrink-0 border border-amber-300 shadow-md">
                <Clock className="w-5 h-5 text-purple-950" />
              </div>
              <div>
                <h4 className="font-serif-title font-bold text-base sm:text-lg text-amber-300">Horarios de Atención</h4>
                <p className="text-xs sm:text-sm text-purple-200/90 font-serif-body mt-0.5">{socialConfig.workingHours}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

