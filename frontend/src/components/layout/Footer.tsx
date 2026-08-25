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
    <footer className="bg-[#090312] text-purple-200/80 py-12 border-t border-amber-500/20 relative overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 space-y-8 relative z-10">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-purple-900/60 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-900 to-indigo-900 text-amber-300 flex items-center justify-center shadow-lg shrink-0 border border-amber-400/40">
              <Moon className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>

            <div>
              <h3 className="font-serif-title font-bold text-lg text-amber-300">
                {data.siteConfig.businessName}
              </h3>
              <p className="text-xs text-purple-300/80">
                Lecturas de Tarot, Limpias Energéticas & Productos Curados
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-purple-200/90">
            <a href="#inicio" className="hover:text-amber-300 transition-colors">Inicio</a>
            <a href="#catalogo" className="hover:text-amber-300 transition-colors">Catálogo Esotérico</a>
            <a href="#nosotros" className="hover:text-amber-300 transition-colors">Sanación & Don</a>
            <a href="#contacto" className="hover:text-amber-300 transition-colors">Contacto Espiritual</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300/60">
          <p className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} {data.siteConfig.businessName}. Todos los derechos reservados.</span>
            <Sparkles className="w-3 h-3 text-amber-400 inline" />
          </p>

          <div className="flex items-center gap-4">
            {isAdmin ? (
              <button
                onClick={onOpenAdminPanel}
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30"
              >
                <ShieldCheck className="w-4 h-4" />
                Panel Admin Activo
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 text-amber-400/80 hover:text-amber-200 transition-colors opacity-75 hover:opacity-100 bg-purple-950/60 px-3 py-1.5 rounded-lg border border-amber-500/20"
              >
                <Lock className="w-3.5 h-3.5" />
                Acceso Administrador
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
