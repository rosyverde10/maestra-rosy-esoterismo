import React, { useState, useEffect } from 'react';
import { SiteProvider, useSite } from './context/SiteContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { EsoterismGuideSection } from './components/sections/EsoterismGuideSection';
import { ProductCatalog } from './components/sections/ProductCatalog';
import { AboutSection } from './components/sections/AboutSection';
import { SocialContact } from './components/sections/SocialContact';
import { ProductModal } from './components/sections/ProductModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminPanel } from './components/admin/AdminPanel';
import type { Product } from './types';

const MainContent: React.FC = () => {
  const { data, isAdmin } = useSite();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const isIframePreview = typeof window !== 'undefined' && (window.location.search.includes('preview=true') || window.self !== window.top);

  // Desactivar globalmente todos los botones y enlaces si se está en vista previa
  useEffect(() => {
    if (!isIframePreview) return;

    const disableAllActions = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, textarea, [role="button"], form');
      if (interactive) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('click', disableAllActions, true);
    window.addEventListener('submit', disableAllActions, true);
    window.addEventListener('touchend', disableAllActions, true);

    return () => {
      window.removeEventListener('click', disableAllActions, true);
      window.removeEventListener('submit', disableAllActions, true);
      window.removeEventListener('touchend', disableAllActions, true);
    };
  }, [isIframePreview]);

  // Deep linking: Detecta ?producto=ID en la URL y abre los detalles del producto de inmediato
  useEffect(() => {
    if (isIframePreview || typeof window === 'undefined' || !data.products || data.products.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const targetProductId = urlParams.get('producto') || urlParams.get('p');

    if (targetProductId) {
      const foundProduct = data.products.find(
        (p) => p.id === targetProductId || p.id.toLowerCase() === targetProductId.toLowerCase()
      );

      if (foundProduct) {
        setSelectedProduct(foundProduct);

        setTimeout(() => {
          const catalogElem = document.getElementById('catalogo');
          if (catalogElem) {
            const headerOffset = 80;
            const elementPosition = catalogElem.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 350);

        if (window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    }
  }, [data.products, isIframePreview]);

  const handleOpenAdminLogin = () => {
    if (isIframePreview) return;
    if (isAdmin) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleSelectProduct = (prod: Product) => {
    if (isIframePreview) return;
    setSelectedProduct(prod);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash && !isIframePreview) {
      const hash = window.location.hash;
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          if (window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }, 300);
      }
    }
  }, [isIframePreview]);

  return (
    <div className="min-h-screen flex flex-col bg-[#05020a] text-purple-100 overflow-x-hidden max-w-full relative">

      {/* Floating Header Wrapper */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="pointer-events-auto">
          <AnnouncementBar />
        </div>
        <div className="pointer-events-auto">
          <Navbar
            onOpenAdminLogin={handleOpenAdminLogin}
            onOpenAdminPanel={() => {
              if (!isIframePreview) setIsAdminPanelOpen(true);
            }}
          />
        </div>
      </div>

      {/* Main Content Flow */}
      <div className="pt-16 sm:pt-20 flex flex-col flex-1 relative z-10">

        {/* 1. Hero Portada */}
        <Hero />

        {/* 2. ¿Qué es el Esoterismo & Guía Espiritual? */}
        <EsoterismGuideSection />

        {/* 3. Sanación, Don & Trayectoria de la Maestra Rosy */}
        <AboutSection />

        {/* 4. Catálogo de Servicios & Productos */}
        <ProductCatalog onSelectProduct={handleSelectProduct} />

        {/* 5. Contacto Espiritual Directo */}
        <SocialContact />

        {/* 6. Pie de Página */}
        <Footer
          onOpenAdminLogin={handleOpenAdminLogin}
          onOpenAdminPanel={() => {
            if (!isIframePreview) setIsAdminPanelOpen(true);
          }}
        />
      </div>

      {/* Detail Modal */}
      {!isIframePreview && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Admin Login Modal */}
      {!isIframePreview && (
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onSuccess={() => {
            setIsAdminLoginOpen(false);
            setIsAdminPanelOpen(true);
          }}
        />
      )}

      {/* Admin Panel */}
      {!isIframePreview && (
        <AdminPanel
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <SiteProvider>
      <MainContent />
    </SiteProvider>
  );
}

export default App;
