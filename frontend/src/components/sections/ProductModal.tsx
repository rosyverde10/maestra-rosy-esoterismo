import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { useSite } from '../../context/SiteContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { X, MessageCircle, Share2, Sparkles, ZoomIn, Wand2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { data } = useSite();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Reset selected image index to 0 whenever opening a new product
  useEffect(() => {
    setSelectedImageIndex(0);
    setIsLightboxOpen(false);
  }, [product?.id]);

  // Lock background body scroll when modal is open
  useBodyScrollLock(!!product || isLightboxOpen);

  const images = product?.images && product.images.length > 0
    ? product.images
    : ['/images/hero.jpg'];

  const currentImage = images[selectedImageIndex] || images[0];

  const directProductLink = product ? `${window.location.origin}/?producto=${product.id}` : '';
  const whatsappMessage = product
    ? `Hola Maestra Rosy! Quisiera más información o agendar "${product.name}" (${product.priceText}).\n\nVer enlace: ${directProductLink}`
    : '';
  const whatsappUrl = `https://wa.me/${data.socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  // Touch Swipe Gesture Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || images.length <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 35) {
      if (diffX > 0) {
        // Swiped Left -> Next Image
        setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      } else {
        // Swiped Right -> Previous Image
        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      }
    }
    setTouchStartX(null);
  };

  return (
    <>
      <AnimatePresence>
        {product && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-[#080210]/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#170b2e] text-purple-100 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-400/30 relative transform transition-all my-auto scrollbar-thin"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-purple-900/80 hover:bg-purple-800 text-amber-300 shadow-lg border border-amber-400/30 transition-all hover:scale-110 active:scale-95"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                
                {/* Gallery View */}
                <div className="p-5 sm:p-6 bg-purple-950/60 flex flex-col justify-between space-y-4 border-b md:border-b-0 md:border-r border-purple-900/60">
                  <div
                    onClick={() => setIsLightboxOpen(true)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-purple-950 border border-amber-400/30 cursor-zoom-in group select-none touch-pan-y"
                    title="Hacer clic para ver foto en tamaño completo"
                  >
                    <motion.img
                      key={currentImage}
                      src={currentImage}
                      alt={product.name}
                      initial={{ opacity: 0.4, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-purple-950/90 backdrop-blur-md text-amber-300 text-xs font-semibold border border-amber-400/30">
                      {product.category}
                    </span>

                    <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-3.5 py-2 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-xs">
                        <ZoomIn className="w-4 h-4 text-amber-950" />
                        <span>Ver foto completa</span>
                      </span>
                    </div>
                  </div>

                  {/* Pagination Dots & Thumbnails */}
                  {images.length > 1 && (
                    <div className="space-y-3">
                      {/* Swipe Dots Indicator */}
                      <div className="flex items-center justify-center gap-1.5">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              selectedImageIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-purple-700/40 hover:bg-purple-600/60'
                            }`}
                            aria-label={`Ver imagen ${idx + 1}`}
                          />
                        ))}
                      </div>

                      {/* Thumbnails */}
                      <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                              selectedImageIndex === idx
                                ? 'border-amber-400 scale-105 shadow-md'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Details Content */}
                <div className="p-6 md:p-8 flex flex-col justify-between space-y-6 text-center">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                        {product.category}
                      </span>
                      <h2 className="font-serif-title font-bold text-2xl text-amber-300 leading-tight">
                        {product.name}
                      </h2>
                    </div>

                    <div className="py-2 border-y border-purple-900/60 flex items-center justify-center gap-3">
                      <span className="text-xl font-bold font-serif text-amber-300">
                        {product.priceText}
                      </span>
                    </div>

                    <p className="text-purple-200/90 text-sm leading-relaxed font-serif-body text-left">
                      {product.description}
                    </p>

                    <div className="space-y-2 pt-2 text-left text-xs bg-purple-950/80 p-4 rounded-2xl border border-amber-500/20">
                      <h4 className="font-bold text-amber-300 flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Detalles & Preparación:
                      </h4>
                      {product.materials && (
                        <div className="flex items-start gap-2">
                          <Wand2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-purple-100">Elementos: </strong>
                            <span className="text-purple-200/80">{product.materials}</span>
                          </div>
                        </div>
                      )}
                      {product.dimensions && (
                        <div className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-purple-100">Modalidad / Formato: </strong>
                            <span className="text-purple-200/80">{product.dimensions}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Agendar Cita o Consultar por WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        const shareUrl = directProductLink || window.location.href;
                        if (navigator.share) {
                          navigator.share({
                            title: product.name,
                            text: product.description,
                            url: shareUrl,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(shareUrl);
                          alert('Enlace copiado al portapapeles');
                        }
                      }}
                      className="w-full py-2 px-4 rounded-xl border border-purple-800 text-purple-200 hover:bg-purple-900/60 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-amber-400" />
                      Compartir este servicio
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-[100] bg-[#05010c]/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-purple-900/80 hover:bg-purple-800 text-amber-300 transition-colors border border-amber-400/30"
              title="Cerrar vista completa"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="max-w-[95vw] max-h-[92vh] flex flex-col items-center justify-center overflow-hidden rounded-2xl shadow-2xl relative select-none touch-pan-y space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage}
                alt={product?.name || ''}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-amber-400/30"
              />

              {/* Lightbox Pagination Dots */}
              {images.length > 1 && (
                <div className="flex items-center justify-center gap-2 bg-purple-950/80 px-4 py-2 rounded-full backdrop-blur-md border border-amber-500/30">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        selectedImageIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-purple-600/40'
                      }`}
                      aria-label={`Ver imagen ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
