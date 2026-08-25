import React, { useState } from 'react';
import { SiteProvider, useSite } from './context/SiteContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { ProductCatalog } from './components/sections/ProductCatalog';
import { ProductModal } from './components/sections/ProductModal';
import { AboutSection } from './components/sections/AboutSection';
import { SocialContact } from './components/sections/SocialContact';
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

        // Limpiar de inmediato el parametro ?producto=ID de la barra de navegación
        // para que al recargar la página no vuelva a abrirse automáticamente
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

  // Auto scroll and clean #catalogo hash from URL bar
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
    <div className="min-h-screen flex flex-col bg-[#0c0517] text-purple-100 overflow-x-hidden max-w-full">

      {/* Top Header Wrapper (Fixed PERMANENTE e Inamovible a la pantalla) */}
      <div className="fixed top-0 left-0 right-0 z-40 shadow-sm bg-[#120726]">
        <AnnouncementBar />
        <Navbar
          onOpenAdminLogin={handleOpenAdminLogin}
          onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        />
      </div>

      {/* Main Content (Espaciador superior ajustado para compensar el header fijo) */}
      <div className="pt-16 sm:pt-20 flex flex-col flex-1">

        {/* Hero Portada */}
        <Hero />

        {/* Interactive Catalog Section */}
        <ProductCatalog onSelectProduct={(prod) => setSelectedProduct(prod)} />

        {/* Tradicion & History Section */}
        <AboutSection />

        {/* Social Contact Cards */}
        <SocialContact />

        {/* Footer */}
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

      {/* Admin Login Security Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminPanelOpen(true);
        }}
      />

      {/* Admin Full Management Panel */}
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
