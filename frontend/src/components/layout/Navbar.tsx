import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { Menu, X, MessageCircle, Moon } from 'lucide-react';
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
    <header className="py-3 px-3 sm:px-6 md:px-8 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto apple-liquid-glass-pill px-5 sm:px-8 py-3 flex items-center justify-between">

        {/* Brand Identity - Clean & Uncluttered */}
        <a href="#" onClick={(e) => handleNavClick(e, '#inicio')} className="flex items-center gap-3 group shrink-0">
          {data.siteConfig.logoImage ? (
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.4)] group-hover:scale-105 transition-transform">
              <img src={data.siteConfig.logoImage} alt="Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 via-purple-900 to-indigo-950 border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.4)] group-hover:rotate-12 transition-transform shrink-0">
              <Moon className="w-5 h-5 fill-amber-300 text-amber-300 animate-pulse" />
            </div>
          )}
          <div className="min-w-0">
            <span className="font-serif-title font-extrabold text-base sm:text-lg text-gold-gradient block tracking-widest uppercase leading-tight">
              Maestra Rosy
            </span>
            <span className="text-[10px] sm:text-xs text-purple-200/90 font-serif-body italic block tracking-wide">
              Esoterismo & Tarot
            </span>
          </div>
        </a>

        {/* Desktop Nav Links - Centered, Clean, Progressive Underline on Hover */}
        <nav className="hidden lg:flex items-center justify-center gap-8 xl:gap-12 text-xs sm:text-sm font-serif-title font-semibold tracking-wider text-purple-100 uppercase">
          <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')} className="hover:text-amber-300 transition-colors nav-link-underline">
            Inicio
          </a>
          <a href="#nosotros" onClick={(e) => handleNavClick(e, '#nosotros')} className="hover:text-amber-300 transition-colors nav-link-underline">
            Sanación & Don
          </a>
          <a href="#catalogo" onClick={(e) => handleNavClick(e, '#catalogo')} className="hover:text-amber-300 transition-colors nav-link-underline">
            Catálogo Ritual
          </a>
          <a href="#contacto" onClick={(e) => handleNavClick(e, '#contacto')} className="hover:text-amber-300 transition-colors nav-link-underline">
            Contacto Directo
          </a>
        </nav>

        {/* WhatsApp Radiant Emerald Green Action Button */}
        <div className="hidden md:flex items-center shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-emerald-btn px-6 py-2.5 text-xs flex items-center gap-2.5 uppercase tracking-wider animate-pulse-glow"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-950 text-emerald-950 shrink-0" />
            <span>Consultar</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-full bg-purple-950/80 text-amber-300 hover:bg-purple-900 focus:outline-none shrink-0 border border-amber-400/40 shadow-lg"
          aria-label="Menú"
        >
          <motion.div
            key={mobileMenuOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="lg:hidden overflow-hidden border border-amber-500/30 bg-[#070310]/98 backdrop-blur-2xl px-5 pt-4 pb-7 shadow-2xl rounded-3xl mt-3 max-w-[1400px] mx-auto"
          >
            <nav className="flex flex-col gap-3 font-medium text-purple-100">
              {[
                { href: '#inicio', label: 'Inicio' },
                { href: '#nosotros', label: 'Sanación, Limpias & Trayectoria' },
                { href: '#catalogo', label: 'Catálogo de Velas & Tarot' },
                { href: '#contacto', label: 'Contacto & Agendar Cita' },
              ].map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.2 }}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="py-3 px-4 rounded-2xl bg-purple-950/50 hover:bg-purple-900/60 hover:text-amber-300 font-serif-title font-semibold text-sm transition-all flex items-center justify-between border border-amber-500/20 text-center"
                >
                  <span className="w-full text-center">{link.label}</span>
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
                className="w-full py-3.5 px-4 whatsapp-emerald-btn text-center text-sm flex items-center justify-center gap-2.5 shadow-xl uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-950 text-emerald-950" />
                <span>Consulta Directa WhatsApp</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
