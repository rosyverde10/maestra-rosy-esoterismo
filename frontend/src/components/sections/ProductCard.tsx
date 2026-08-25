import React, { useState } from 'react';
import type { Product } from '../../types';
import { useSite } from '../../context/SiteContext';
import { Eye, MessageCircle, Star, Sparkles, Wand2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { data } = useSite();
  const [imageLoaded, setImageLoaded] = useState(false);

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'disponible':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 whitespace-nowrap inline-flex items-center gap-1 shrink-0">
            ✓ Disponible
          </span>
        );
      case 'sobre_pedido':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40 whitespace-nowrap inline-flex items-center gap-1 shrink-0">
            ✨ Por Cita
          </span>
        );
      case 'agotado':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/40 whitespace-nowrap inline-flex items-center gap-1 shrink-0">
            Agotado
          </span>
        );
      default:
        return null;
    }
  };

  const directProductLink = `${window.location.origin}/?producto=${product.id}`;
  const whatsappMessage = `Hola Maestra Rosy, me interesa consultar sobre "${product.name}" (${product.priceText}).\n\nVer en la página: ${directProductLink}`;
  const whatsappUrl = `https://wa.me/${data.socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  const mainImage = product.images?.[0] || '/images/hero.jpg';

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-purple-950/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-900/30 border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1.5 cursor-pointer select-none backdrop-blur-md"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-purple-900/40">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-purple-900/50 to-purple-950/40 animate-shimmer" />
        )}
        <img
          src={mainImage}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-purple-950/90 backdrop-blur-md text-amber-300 text-[11px] font-medium tracking-wide border border-amber-400/30 shadow-md">
            {product.category}
          </span>

          {product.featured && (
            <span className="p-1.5 rounded-full bg-amber-400 text-amber-950 shadow-lg flex items-center justify-center border border-amber-200" title="Servicio Espiritual Destacado">
              <Star className="w-3.5 h-3.5 fill-current" />
            </span>
          )}
        </div>

        {/* Hover Quick Action overlay */}
        <div className="absolute inset-0 bg-purple-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 text-amber-950 font-bold text-xs shadow-xl hover:bg-amber-300 transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-amber-950" />
            Ver Detalles
          </button>
        </div>
      </div>

      {/* Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 mb-2">
            <div className="shrink-0">
              {getStatusBadge(product.status)}
            </div>
            <span className="text-amber-300 font-bold text-sm sm:text-base font-serif text-left xs:text-right">
              {product.priceText}
            </span>
          </div>

          <h3 className="font-serif-title font-bold text-purple-100 text-base sm:text-lg line-clamp-1 group-hover:text-amber-300 transition-colors">
            {product.name}
          </h3>

          <p className="text-purple-200/80 text-xs sm:text-sm line-clamp-2 mt-1 font-normal leading-relaxed">
            {product.description}
          </p>

          {/* Specifications */}
          <div className="mt-3 pt-3 border-t border-purple-900/60 space-y-1 text-[11px] text-purple-300/70">
            {product.materials && (
              <div className="flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{product.materials}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{product.dimensions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="w-full py-2 px-3 rounded-xl border border-amber-400/30 text-amber-300 hover:bg-purple-900/50 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            Detalles
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Consultar
          </a>
        </div>
      </div>
    </div>
  );
};
