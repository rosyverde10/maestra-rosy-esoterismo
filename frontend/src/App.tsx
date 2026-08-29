import React, { useState } from 'react';
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

  // Deep linking: Detecta ?producto=ID en la URL y abre los detalles del producto de inmediato
  React.useEffect(() => {
    if (typeof window === 'undefined' || !data.products || data.products.length === 0) return;

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
  }, [data.products]);

  const handleOpenAdminLogin = () => {
    if (isIframePreview) return;
    if (isAdmin) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
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
  }, []);

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
            onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
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
        <ProductCatalog onSelectProduct={(prod) => setSelectedProduct(prod)} />

        {/* 5. Contacto Espiritual Directo */}
        <SocialContact />

        {/* 6. Pie de Página */}
        <Footer
          onOpenAdminLogin={handleOpenAdminLogin}
          onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        />
      </div>

      {/* Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminPanelOpen(true);
        }}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
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
