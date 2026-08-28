import React, { useState, useMemo, useEffect } from 'react';
import type { Product } from '../../types';
import { useSite } from '../../context/SiteContext';
import { ProductCard } from './ProductCard';
import { Search, Filter, Sparkles, Box, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onSelectProduct }) => {
  const { data } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getInitialCount = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 4;
    }
    return 8;
  };

  const [visibleCount, setVisibleCount] = useState<number>(getInitialCount);

  useEffect(() => {
    setVisibleCount(getInitialCount());
  }, [selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    return data.products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Todas' || product.category === selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.materials.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [data.products, selectedCategory, searchQuery]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const initialCount = getInitialCount();
  const isExpanded = visibleCount > initialCount;

  const handleShowMore = () => {
    const step = typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : 8;
    setVisibleCount((prev) => prev + step);
  };

  const handleShowLess = () => {
    setVisibleCount(initialCount);
    const catalogElem = document.getElementById('catalogo');
    if (catalogElem) {
      const headerOffset = 80;
      const elementPosition = catalogElem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="catalogo" className="py-12 lg:py-16 bg-mystic-dark border-b border-amber-500/25 relative">
      
      {/* HIGH-VISIBILITY FLOATING RETURN BUTTON */}
      <AnimatePresence>
        {isExpanded && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 40, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.85 }}
            onClick={handleShowLess}
            className="fixed bottom-8 right-5 sm:bottom-8 sm:right-8 z-[60] px-5 py-3.5 liquid-glass-btn text-xs sm:text-sm shadow-[0_10px_35px_rgba(0,0,0,0.95)] border-2 border-amber-300 flex items-center gap-2 cursor-pointer uppercase tracking-wider font-bold"
            title="Ver menos elementos y volver arriba"
          >
            <ChevronUp className="w-4 h-4 text-purple-950 animate-bounce" />
            <span>Ver menos</span>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8 lg:space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 liquid-glass-pill text-amber-300 text-xs font-semibold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase tracking-wider font-serif-title">Catálogo Ritual & Consultas</span>
          </div>

          <h2 className="font-serif-title text-2xl sm:text-4xl lg:text-4xl font-extrabold text-gold-gradient tracking-tight">
            {data.siteConfig.catalogTitle || "Catálogo de Servicios & Productos Esotéricos"}
          </h2>

          <p className="text-purple-200/90 text-sm sm:text-base lg:text-lg font-serif-body leading-relaxed">
            {data.siteConfig.catalogSubtitle || "Trabajos de luz, elementos purificados y velaciones ritualizadas por la Maestra Rosy"}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-4 animate-fade-up stagger-1">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-88 shrink-0">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                placeholder="Buscar velón, tarot, limpia o trabajo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-9 py-3 rounded-full border border-amber-500/40 bg-purple-950/80 text-purple-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all placeholder:text-purple-300/50 shadow-inner font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-purple-300/70 hover:text-amber-300 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills - AMPLE VERTICAL PADDING (py-7 -my-3) TO PREVENT GLOW CLIPPING */}
            <div className="w-full lg:w-auto overflow-x-auto py-7 px-3 -my-3 flex items-center gap-2.5 scrollbar-none max-w-full">
              <Filter className="w-4 h-4 text-amber-400 shrink-0 hidden sm:block mr-1" />
              {data.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-full text-xs font-serif-title transition-all whitespace-nowrap shrink-0 cursor-pointer uppercase tracking-wider ${
                    selectedCategory === cat
                      ? 'liquid-glass-btn font-bold border-2 border-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.65)] text-purple-950'
                      : 'bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-amber-500/30 font-medium'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 animate-fade-up stagger-2">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>

            {/* Show More / Show Less Buttons */}
            <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-4 animate-fade-up">
              {visibleCount < filteredProducts.length && (
                <button
                  type="button"
                  onClick={handleShowMore}
                  className="px-9 py-4 liquid-glass-btn text-xs sm:text-sm shadow-xl inline-flex items-center gap-2.5 cursor-pointer uppercase tracking-wider"
                >
                  <span>Ver más ({filteredProducts.length - visibleCount} restantes)</span>
                  <ChevronDown className="w-4 h-4 text-purple-950" />
                </button>
              )}

              {isExpanded && (
                <button
                  type="button"
                  onClick={handleShowLess}
                  className="px-7 py-4 rounded-full bg-purple-950/90 hover:bg-purple-900 text-amber-300 font-serif-title font-bold text-xs sm:text-sm border border-amber-500/40 transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-105 uppercase tracking-wider"
                >
                  <span>Ver menos</span>
                  <ChevronUp className="w-4 h-4 text-amber-300" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 liquid-glass-card space-y-4 max-w-md mx-auto shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-purple-900/80 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/40">
              <Box className="w-7 h-7" />
            </div>
            <h3 className="font-serif-title font-bold text-xl text-amber-300">
              No se encontraron elementos
            </h3>
            <p className="text-purple-200/90 text-xs sm:text-sm font-serif-body">
              Intente cambiando el término de búsqueda o seleccione otra categoría.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todas');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 liquid-glass-btn text-xs shadow-md uppercase tracking-wider"
            >
              Ver todos los servicios y productos
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
