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

  // Initial visible count: 4 for mobile (<768px), 8 for desktop (>=768px)
  const getInitialCount = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 4;
    }
    return 8;
  };

  const [visibleCount, setVisibleCount] = useState<number>(getInitialCount);

  // Reset visible count when category or search query changes
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
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="catalogo" className="py-16 sm:py-24 bg-[#0c0517] border-b border-amber-500/20 relative">
      
      {/* FLOATING BUBBLE BUTTON "VER MENOS" */}
      <AnimatePresence>
        {isExpanded && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 40, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.85 }}
            onClick={handleShowLess}
            className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-purple-950/90 hover:bg-purple-900 text-amber-300 font-bold text-xs sm:text-sm shadow-2xl backdrop-blur-md border border-amber-400/40 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
            title="Ver menos elementos y volver arriba"
          >
            <ChevronUp className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>Ver menos</span>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 space-y-10 sm:space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Catálogo Completo Esotérico</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient">
            {data.siteConfig.catalogTitle || "Catálogo de Servicios & Productos Esotéricos"}
          </h2>

          <p className="text-purple-200/80 text-base sm:text-lg font-serif-body">
            {data.siteConfig.catalogSubtitle || "Trabajos de luz, elementos purificados y velaciones ritualizadas por la Maestra Rosy"}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-6 animate-fade-up stagger-1">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/70" />
              <input
                type="text"
                placeholder="Buscar por trabajo, velón o cuarzo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-500/30 bg-purple-950/70 text-purple-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all placeholder:text-purple-300/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-300/60 hover:text-purple-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 flex items-center gap-2 scrollbar-none">
              <Filter className="w-4 h-4 text-amber-400 shrink-0 hidden sm:block mr-1" />
              {data.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-lg scale-105 font-bold border border-amber-300'
                      : 'bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-amber-500/20'
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
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 animate-fade-up stagger-2">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>

            {/* Bottom Buttons: Ver Más / Ver Menos */}
            <div className="text-center pt-4 flex flex-wrap items-center justify-center gap-3 animate-fade-up">
              {visibleCount < filteredProducts.length && (
                <button
                  type="button"
                  onClick={handleShowMore}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-xs sm:text-sm shadow-lg hover:shadow-amber-500/20 transition-all duration-200 inline-flex items-center gap-2 border border-amber-300 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <span>Ver más ({filteredProducts.length - visibleCount} restantes)</span>
                  <ChevronDown className="w-4 h-4 text-amber-950" />
                </button>
              )}

              {isExpanded && (
                <button
                  type="button"
                  onClick={handleShowLess}
                  className="px-6 py-3.5 rounded-2xl bg-purple-950/80 hover:bg-purple-900 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/30 transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <span>Ver menos</span>
                  <ChevronUp className="w-4 h-4 text-amber-300" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-purple-950/40 rounded-3xl border border-amber-500/20 space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-purple-900/60 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/30">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="font-serif-title font-bold text-lg text-amber-300">
              No se encontraron elementos
            </h3>
            <p className="text-purple-200/70 text-xs">
              Intente cambiando el término de búsqueda o seleccione otra categoría.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todas');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-amber-950 text-xs font-bold hover:bg-amber-400 transition-colors"
            >
              Ver todos los servicios y productos
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
