import React from 'react';
import { useSite } from '../../context/SiteContext';
import { Lock, ShieldCheck, Moon, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin, onOpenAdminPanel }) => {
  const { data, isAdmin } = useSite();

  return (
    <footer className="bg-[#040208] text-purple-200/80 py-12 border-t border-amber-500/25 relative overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8 relative z-10">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-amber-500/20 text-center md:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-gold-shine text-purple-950 flex items-center justify-center shadow-lg shrink-0 border border-amber-300">
              <Moon className="w-6 h-6 fill-purple-950 text-purple-950" />
            </div>

            <div>
              <h3 className="font-serif-title font-bold text-xl text-gold-gradient tracking-widest uppercase">
                {data.siteConfig.businessName}
              </h3>
              <p className="text-xs text-purple-200/80 font-serif-body italic">
                Guiado Astral • Tarot • Trabajos & Limpias Espirituales
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-serif-title font-semibold tracking-wider text-purple-100 uppercase">
            <a href="#inicio" className="hover:text-amber-300 transition-colors">Inicio</a>
            <a href="#catalogo" className="hover:text-amber-300 transition-colors">Catálogo Ritual</a>
            <a href="#nosotros" className="hover:text-amber-300 transition-colors">Sanación & Don</a>
            <a href="#contacto" className="hover:text-amber-300 transition-colors">Contacto Directo</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300/70">
          <p className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {data.siteConfig.businessName}. Todos los derechos reservados.</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
          </p>

          <div className="flex items-center gap-4">
            {isAdmin ? (
              <button
                onClick={onOpenAdminPanel}
                className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 font-serif-title font-semibold text-xs transition-colors bg-emerald-950/90 px-4 py-2 rounded-full border border-emerald-500/50 shadow-md uppercase tracking-wider cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Panel Admin Activo
              </button>
            ) : (
              /* Discrete, subtle, non-flashy admin login button */
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 text-[11px] text-purple-300/40 hover:text-purple-200 font-serif-body transition-colors cursor-pointer opacity-70 hover:opacity-100"
                title="Acceso Administrador"
              >
                <Lock className="w-3 h-3 text-purple-300/40" />
                <span>Acceso Admin</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
