import React from 'react';
import { useSite } from '../../context/SiteContext';
import { MessageCircle, Phone, MapPin, Clock, Sparkles } from 'lucide-react';

export const SocialContact: React.FC = () => {
  const { data } = useSite();
  const { socialConfig } = data;

  const isIframePreview = typeof window !== 'undefined' && (window.location.search.includes('preview=true') || window.self !== window.top);

  const whatsappMessage = `Hola Maestra Rosy, me gustaría solicitar atención personal o información sobre lecturas de tarot y servicios esotéricos.`;
  const whatsappUrl = `https://wa.me/${socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.6616089851174!2d-99.16781268509355!3d19.427024986887556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5bd15a7%3A0x6a6d36e2f1e2f1e2!2sAngel%20de%20la%20Independencia!5e0!3m2!1ses!2smx!4v1620000000000!5m2!1ses!2smx";
  const mapEmbedUrl = socialConfig.googleMapsUrl || defaultMapUrl;

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
            <span className="uppercase tracking-wider font-serif-title">Atención Directa & Ubicación</span>
          </div>

          <h2 className="font-serif-title text-2xl sm:text-4xl lg:text-4xl font-extrabold text-gold-gradient tracking-tight">
            Contacto Espiritual & Ubicación del Santuario
          </h2>

          <p className="text-purple-200/90 text-sm sm:text-base lg:text-lg font-serif-body leading-relaxed">
            Comunícate directamente con la Maestra Rosy por WhatsApp o llamada telefónica para agendar tu consulta o visitarnos en nuestro altar.
          </p>
        </div>

        {/* 2 Contact Cards Grid: WhatsApp & Phone ONLY */}
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

        {/* Integrated Google Maps & Sanctuary Address Block */}
        <div className="liquid-glass-card p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-500/30 animate-fade-up stagger-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b border-amber-500/20 pb-6">
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

          {/* Dark Mode Interactive Google Maps Frame */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-[#07030e] h-[280px] sm:h-[340px] w-full group">
            <iframe
              title="Ubicación Google Maps Maestra Rosy"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={`w-full h-full filter invert-[90%] hue-rotate-180 contrast-[1.25] brightness-[0.85] saturate-[1.2] ${
                isIframePreview ? 'pointer-events-none' : ''
              }`}
            />
            {/* Transparent overlay in preview mode */}
            {isIframePreview && (
              <div className="absolute inset-0 z-20 bg-transparent cursor-default" />
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
