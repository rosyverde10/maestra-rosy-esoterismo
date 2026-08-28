import React, { useState } from 'react';
import type { Product } from '../../types';
import { useSite } from '../../context/SiteContext';
import { Eye, MessageCircle, Star, Wand2, Compass } from 'lucide-react';

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
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 uppercase tracking-wider inline-flex items-center gap-1 shrink-0 shadow-md">
            ✓ Disponible
          </span>
        );
      case 'sobre_pedido':
        return (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/50 uppercase tracking-wider inline-flex items-center gap-1 shrink-0 shadow-md">
            ✨ Por Cita
          </span>
        );
      case 'agotado':
        return (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/50 uppercase tracking-wider inline-flex items-center gap-1 shrink-0 shadow-md">
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
      className="group liquid-glass-card overflow-hidden shadow-2xl transition-all duration-300 flex flex-col h-full cursor-pointer select-none relative"
    >
      {/* Image Showcase Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-purple-950/60">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-purple-900/50 to-purple-950/40 animate-shimmer" />
        )}
        <img
          src={mainImage}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05020a] via-transparent to-black/40" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none z-10">
          <span className="px-3 py-1 liquid-glass-pill text-amber-300 text-[11px] font-serif-title font-semibold tracking-wider uppercase">
            {product.category}
          </span>

          {product.featured && (
            <span className="p-2 rounded-full bg-gold-shine text-purple-950 shadow-xl flex items-center justify-center border border-amber-200" title="Servicio Destacado">
              <Star className="w-3.5 h-3.5 fill-purple-950 text-purple-950" />
            </span>
          )}
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-purple-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[3px] z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="px-5 py-2.5 liquid-glass-btn text-xs shadow-xl flex items-center gap-2 uppercase tracking-wider"
          >
            <Eye className="w-4 h-4 text-purple-950" />
            Ver Detalles
          </button>
        </div>
      </div>

      {/* Card Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 relative z-10">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div>
              {getStatusBadge(product.status)}
            </div>
            <span className="text-amber-300 font-serif-title font-extrabold text-base sm:text-lg drop-shadow">
              {product.priceText}
            </span>
          </div>

          <h3 className="font-serif-title font-bold text-purple-100 text-lg sm:text-xl line-clamp-1 group-hover:text-amber-300 transition-colors">
            {product.name}
          </h3>

          <p className="text-purple-200/90 font-serif-body text-sm line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Specifications */}
          <div className="mt-3.5 pt-3 border-t border-purple-900/60 space-y-1.5 text-[11px] text-purple-300/80">
            {product.materials && (
              <div className="flex items-center gap-2">
                <Wand2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{product.materials}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{product.dimensions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="w-full py-2.5 px-3 rounded-2xl border border-amber-400/40 text-amber-300 hover:bg-purple-950 text-xs font-serif-title font-bold transition-all flex items-center justify-center gap-1.5 uppercase"
          >
            <Eye className="w-3.5 h-3.5" />
            Detalles
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg border border-emerald-400/30 uppercase tracking-wider"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Consultar
          </a>
        </div>
      </div>
    </div>
  );
};
