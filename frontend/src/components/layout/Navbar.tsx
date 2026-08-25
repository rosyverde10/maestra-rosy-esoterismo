import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { Menu, X, MessageCircle, Moon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { data } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock scroll when mobile menu drawer is open
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
    <header className="sticky top-0 z-50 bg-[#120726]/90 backdrop-blur-xl border-b border-amber-500/20 py-2.5 sm:py-3 transition-all duration-300 shadow-2xl">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 flex items-center justify-between">

        {/* Logo */}
        <a href="#" onClick={(e) => handleNavClick(e, '#inicio')} className="flex items-center gap-3 group">
          {data.siteConfig.logoImage ? (
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-amber-400/40 shadow-lg">
              <img src={data.siteConfig.logoImage} alt="Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-900 to-indigo-900 border border-amber-400/50 text-amber-300 flex items-center justify-center shadow-lg group-hover:border-amber-300 transition-all shrink-0">
              <Moon className="w-5 h-5 fill-amber-400 text-amber-400 animate-pulse" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="font-serif-title font-bold text-sm sm:text-lg md:text-xl text-amber-300 block leading-tight tracking-wider truncate drop-shadow">
              {data.siteConfig.businessName}
            </span>
            <span className="text-[10px] sm:text-xs text-purple-300/80 hidden sm:block font-medium truncate">
              Lecturas de Tarot, Limpias Espirituales & Productos Curados
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-sm font-medium text-purple-200">
          <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')} className="hover:text-amber-300 transition-colors whitespace-nowrap">Inicio</a>
          <a href="#catalogo" onClick={(e) => handleNavClick(e, '#catalogo')} className="hover:text-amber-300 transition-colors whitespace-nowrap">Catálogo Esotérico</a>
          <a href="#nosotros" onClick={(e) => handleNavClick(e, '#nosotros')} className="hover:text-amber-300 transition-colors whitespace-nowrap">Sanación & Don</a>
          <a href="#contacto" onClick={(e) => handleNavClick(e, '#contacto')} className="hover:text-amber-300 transition-colors whitespace-nowrap">Contacto Espiritual</a>
        </nav>

        {/* Action Button - Direct WhatsApp */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg hover:shadow-emerald-900/40 transition-all transform hover:-translate-y-0.5 whitespace-nowrap border border-emerald-400/30"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

        {/* Mobile & Tablet Animated Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-amber-300 hover:bg-purple-900/40 focus:outline-none shrink-0 transition-transform active:scale-95 border border-amber-500/20"
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

      {/* Mobile & Tablet Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden border-t border-amber-500/20 bg-[#120726]/95 backdrop-blur-2xl px-4 pt-3 pb-6 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <nav className="flex flex-col gap-2 font-medium text-purple-100">
              {[
                { href: '#inicio', label: 'Inicio' },
                { href: '#catalogo', label: 'Catálogo de Servicios & Velas' },
                { href: '#nosotros', label: 'Sanación & Trayectoria' },
                { href: '#contacto', label: 'Contacto & Agendar Cita' },
              ].map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.25 }}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="py-2.5 px-4 rounded-xl hover:bg-purple-900/40 hover:text-amber-300 font-semibold text-sm transition-all flex items-center justify-between group cursor-pointer border border-transparent hover:border-amber-500/20"
                >
                  <span>{link.label}</span>
                  <Sparkles className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="mt-4 pt-4 border-t border-purple-900/50"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-center text-sm flex items-center justify-center gap-2 shadow-lg animate-pulse-glow transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Agendar por WhatsApp</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
