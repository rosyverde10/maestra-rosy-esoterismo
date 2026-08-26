import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { Menu, X, MessageCircle, Moon, Sparkles, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { data } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useBodyScrollLock(mobileMenuOpen);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    setTimeout(() => {
      if (href === '#inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }, 150);
  };

  const whatsappUrl = `https://wa.me/${data.socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(data.socialConfig.whatsappMessage)}`;

  return (
    <header className="sticky top-0 z-50 bg-[#06030b]/85 backdrop-blur-2xl border-b border-amber-500/30 py-3 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 flex items-center justify-between">

        {/* Brand Identity */}
        <a href="#" onClick={(e) => handleNavClick(e, '#inicio')} className="flex items-center gap-3 group">
          {data.siteConfig.logoImage ? (
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.35)] group-hover:scale-105 transition-transform">
              <img src={data.siteConfig.logoImage} alt="Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 via-purple-900 to-indigo-950 border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.4)] group-hover:rotate-12 transition-transform shrink-0">
              <Moon className="w-6 h-6 fill-amber-300 text-amber-300 animate-pulse" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-serif-title font-bold text-base sm:text-xl text-gold-gradient block tracking-widest uppercase">
                {data.siteConfig.businessName}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-star-glow hidden sm:inline" />
            </div>
            <span className="text-[10px] sm:text-xs text-purple-200/90 font-serif-body italic hidden sm:block tracking-wide">
              Guiado Astral • Tarot • Trabajos & Limpias Espirituales
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-9 text-xs sm:text-sm font-semibold tracking-wider text-purple-100 uppercase">
          <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')} className="hover:text-amber-300 transition-all hover:scale-105 flex items-center gap-1">
            <span>Inicio</span>
          </a>
          <a href="#catalogo" onClick={(e) => handleNavClick(e, '#catalogo')} className="hover:text-amber-300 transition-all hover:scale-105 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Catálogo Ritual</span>
          </a>
          <a href="#nosotros" onClick={(e) => handleNavClick(e, '#nosotros')} className="hover:text-amber-300 transition-all hover:scale-105 flex items-center gap-1">
            <span>Sanación & Don</span>
          </a>
          <a href="#contacto" onClick={(e) => handleNavClick(e, '#contacto')} className="hover:text-amber-300 transition-all hover:scale-105 flex items-center gap-1">
            <span>Contacto Directo</span>
          </a>
        </nav>

        {/* WhatsApp Action Button */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-shine text-purple-950 font-serif-title font-bold text-xs shadow-lg hover:shadow-amber-500/40 hover:scale-105 transition-all uppercase tracking-wider border border-amber-300"
          >
            <MessageCircle className="w-4 h-4 fill-purple-950" />
            <span>Consultar con Maestra Rosy</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2.5 rounded-xl bg-purple-950/60 text-amber-300 hover:bg-purple-900 focus:outline-none shrink-0 border border-amber-400/40 shadow-lg"
          aria-label="Menú"
        >
          <motion.div
            key={mobileMenuOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.div>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden border-t border-amber-500/30 bg-[#06030b]/98 backdrop-blur-2xl px-5 pt-4 pb-7 shadow-2xl"
          >
            <nav className="flex flex-col gap-2.5 font-medium text-purple-100">
              {[
                { href: '#inicio', label: 'Inicio' },
                { href: '#catalogo', label: 'Catálogo de Velas & Tarot' },
                { href: '#nosotros', label: 'Sanación, Limpias & Trayectoria' },
                { href: '#contacto', label: 'Contacto & Agendar Cita' },
              ].map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.2 }}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="py-3 px-4 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 hover:text-amber-300 font-serif-title font-semibold text-sm transition-all flex items-center justify-between border border-amber-500/20"
                >
                  <span>{link.label}</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.25 }}
              className="mt-5 pt-4 border-t border-amber-500/20"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gold-shine text-purple-950 font-serif-title font-bold text-center text-sm flex items-center justify-center gap-2.5 shadow-xl uppercase tracking-wider border border-amber-300"
              >
                <MessageCircle className="w-4 h-4 fill-purple-950" />
                <span>Consulta Directa WhatsApp</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
