import React from 'react';
import { useSite } from '../../context/SiteContext';
import { MessageCircle, Phone, MapPin, Clock, Sparkles } from 'lucide-react';

export const SocialContact: React.FC = () => {
  const { data } = useSite();
  const { socialConfig } = data;

  const whatsappMessage = `Hola Maestra Rosy, me gustaría solicitar atención personal o información sobre lecturas de tarot y servicios esotéricos.`;
  const whatsappUrl = `https://wa.me/${socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="contacto" className="py-12 lg:py-14 lg:min-h-[calc(100vh-5rem)] lg:flex lg:flex-col lg:justify-center bg-mystic-dark relative">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-10 w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 liquid-glass-pill text-amber-300 text-xs font-semibold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase tracking-wider font-serif-title">Atención Directa & Confidencial</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient tracking-tight">
            Contacto Espiritual
          </h2>

          <p className="text-purple-200/90 text-base sm:text-xl font-serif-body leading-relaxed">
            Comunícate directamente con la Maestra Rosy por WhatsApp o llamada telefónica para agendar tu consulta de tarot o pedir informes sobre rituales y limpias.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* WhatsApp Card */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 text-white shadow-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all transform hover:-translate-y-1 border border-emerald-500/50 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="space-y-4 relative z-10">
              <div className="w-13 h-13 rounded-2xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 fill-emerald-950" />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-xl text-emerald-200">WhatsApp Directo</h3>
                <p className="text-emerald-100/90 font-serif-body text-xs sm:text-sm mt-1 leading-relaxed">
                  Atención prioritaria para citas de tarot y velones preparados.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-emerald-500/30 flex items-center justify-between font-serif-title font-bold text-xs sm:text-sm text-emerald-300 uppercase tracking-wider relative z-10">
              <span>{socialConfig.whatsappNumber}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>

          {/* Phone Card */}
          <a
            href={`tel:${socialConfig.phone.replace(/[^0-9+]/g, '')}`}
            className="group p-6 liquid-glass-card shadow-2xl hover:border-amber-400/70 transition-all transform hover:-translate-y-1 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-13 h-13 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center font-bold shrink-0 shadow-lg border border-amber-300 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-purple-950" />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-xl text-amber-300">Llamada Directa</h3>
                <p className="text-purple-200/90 font-serif-body text-xs sm:text-sm mt-1 leading-relaxed">
                  Llamada telefónica para consultas presenciales o virtuales.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-purple-900/60 flex items-center justify-between font-serif-title font-bold text-xs sm:text-sm text-amber-300 uppercase tracking-wider">
              <span>{socialConfig.phone}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>

          {/* Facebook Card */}
          {socialConfig.facebookUrl && (
            <a
              href={socialConfig.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 liquid-glass-card shadow-2xl hover:border-blue-400/70 transition-all transform hover:-translate-y-1 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-13 h-13 rounded-2xl bg-blue-950 text-blue-300 flex items-center justify-center shrink-0 shadow-lg border border-blue-500/40 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif-title font-bold text-xl text-purple-100 group-hover:text-blue-300 transition-colors">Facebook</h3>
                  <p className="text-purple-200/90 font-serif-body text-xs sm:text-sm mt-1 leading-relaxed">
                    Santuario espiritual & atención a clientes.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-purple-900/60 flex items-center justify-between font-serif-title font-bold text-xs text-blue-300 uppercase tracking-wider">
                <span>Visitar Facebook</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          )}

          {/* Instagram Card */}
          {socialConfig.instagramUrl && (
            <a
              href={socialConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 liquid-glass-card shadow-2xl hover:border-pink-400/70 transition-all transform hover:-translate-y-1 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-13 h-13 rounded-2xl bg-pink-950 text-pink-300 flex items-center justify-center shrink-0 shadow-lg border border-pink-500/40 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif-title font-bold text-xl text-purple-100 group-hover:text-pink-300 transition-colors">Instagram</h3>
                  <p className="text-purple-200/90 font-serif-body text-xs sm:text-sm mt-1 leading-relaxed">
                    Fotografías de velaciones y rituales.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-purple-900/60 flex items-center justify-between font-serif-title font-bold text-xs text-pink-300 uppercase tracking-wider">
                <span>Seguir en Instagram</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          )}
        </div>

        {/* Location & Schedule Banner */}
        <div className="liquid-glass-card p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center shrink-0 border border-amber-300 shadow-md">
              <MapPin className="w-6 h-6 text-purple-950" />
            </div>
            <div>
              <h4 className="font-serif-title font-bold text-lg text-amber-300">Santuario & Atención Virtual</h4>
              <p className="text-sm sm:text-base text-purple-200/90 font-serif-body mt-0.5">{socialConfig.locationAddress}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center shrink-0 border border-amber-300 shadow-md">
              <Clock className="w-6 h-6 text-purple-950" />
            </div>
            <div>
              <h4 className="font-serif-title font-bold text-lg text-amber-300">Horarios de Atención</h4>
              <p className="text-sm sm:text-base text-purple-200/90 font-serif-body mt-0.5">{socialConfig.workingHours}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
