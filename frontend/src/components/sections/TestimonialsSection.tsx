import React, { useState } from 'react';
import { Star, Quote, Sparkles, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  service: string;
  category: string;
  comment: string;
  rating: number;
}

const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'María Guadalupe M.',
    location: 'Monterrey, N.L.',
    service: 'Limpia Energética & Protección',
    category: 'Limpias',
    comment: 'Tenía meses sintiendo una pesadez terrible en mi casa y en mi negocio. La Maestra Rosy me hizo una limpia profunda y preparó un velón. Desde la primera semana todo volvió a fluir con paz y prosperidad.',
    rating: 5
  },
  {
    id: '2',
    name: 'Carlos Roberto P.',
    location: 'Guadalajara, Jal.',
    service: 'Lectura Completa de Tarot',
    category: 'Tarot',
    comment: 'Sorprendente certeza en la lectura de tarot. La Maestra Rosy supo detalles de mi situación sin que yo le dijera nada. Sus consejos me ayudaron a tomar la decisión correcta en mi trabajo.',
    rating: 5
  },
  {
    id: '3',
    name: 'Lucía S.',
    location: 'Houston, TX',
    service: 'Endulzamiento & Unión de Pareja',
    category: 'Amor',
    comment: 'Agradecida infinitamente. Estaba al borde del divorcio y gracias al trabajo de luz y la velación personalizada, recuperamos la armonía y la comunicación con mi esposo. Totalmente discreta y profesional.',
    rating: 5
  },
  {
    id: '4',
    name: 'Fernando H.',
    location: 'Ciudad de México',
    service: 'Amuelto de Turmalina & Cuarzos',
    category: 'Amuletos',
    comment: 'Los productos llegan excelentemente empacados y ritualizados. El amuleto de turmalina se siente con una energía muy especial. Recomiendo al 100% sus velaciones.',
    rating: 5
  }
];

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < testimonialsData.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : testimonialsData.length - 1));
  };

  const currentTestimonial = testimonialsData[currentIndex] || testimonialsData[0];

  return (
    <section className="py-16 sm:py-24 bg-mystic-dark border-b border-amber-500/25 relative overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/90 border border-amber-400/40 text-amber-300 text-xs font-semibold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase tracking-wider">Testimonios & Casos de Éxito</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient tracking-tight">
            Historias de Luz & Agradecimiento
          </h2>

          <p className="text-purple-200/90 text-base sm:text-xl font-serif-body leading-relaxed">
            La confianza de nuestros consultantes es nuestro mayor testimonio de fe y trabajo responsable.
          </p>
        </div>

        {/* Carousel Showcase */}
        {currentTestimonial && (
          <div className="max-w-4xl mx-auto relative animate-fade-up stagger-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-mystic-card rounded-3xl p-6 sm:p-10 border border-amber-500/35 shadow-2xl space-y-6 relative"
              >
                <Quote className="w-12 h-12 text-amber-400/20 absolute top-6 right-6 pointer-events-none" />

                {/* Stars Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-purple-100 font-serif-body text-lg sm:text-2xl leading-relaxed italic">
                  "{currentTestimonial.comment}"
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between pt-6 border-t border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gold-shine text-purple-950 font-serif-title font-bold flex items-center justify-center text-lg border border-amber-300 shadow-md">
                      {currentTestimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif-title font-bold text-base sm:text-lg text-amber-300 flex items-center gap-1.5">
                        <span>{currentTestimonial.name}</span>
                        <span title="Consultante Verificado">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        </span>
                      </h4>
                      <span className="text-xs text-purple-300/80 font-serif-body">
                        {currentTestimonial.location} • <strong className="text-amber-400">{currentTestimonial.service}</strong>
                      </span>
                    </div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {testimonialsData.length > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  {testimonialsData.map((_: Testimonial, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        currentIndex === idx ? 'w-8 bg-amber-400' : 'w-2.5 bg-purple-900/60'
                      }`}
                      aria-label={`Testimonio ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="p-3 rounded-full bg-purple-950 text-amber-300 border border-amber-500/30 hover:bg-purple-900 transition-colors shadow-lg cursor-pointer"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-3 rounded-full bg-purple-950 text-amber-300 border border-amber-500/30 hover:bg-purple-900 transition-colors shadow-lg cursor-pointer"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
