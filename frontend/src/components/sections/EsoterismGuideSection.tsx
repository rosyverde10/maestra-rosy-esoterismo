import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { Sparkles, Eye, Sun, Flame, MessageCircle, HelpCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Pillar {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  benefits: string[];
}

export const EsoterismGuideSection: React.FC = () => {
  const { data } = useSite();
  const [activePillarId, setActivePillarId] = useState<string>('tarot');
  const [openMythIndex, setOpenMythIndex] = useState<number | null>(0);

  const pillars: Pillar[] = [
    {
      id: 'tarot',
      title: 'El Tarot & la Canalización',
      subtitle: 'Claridad para tomar decisiones con certeza',
      icon: <Eye className="w-6 h-6 text-purple-950" />,
      description: 'El esoterismo concibe al Tarot no como una adivinación fatalista, sino como un espejo sagrado de tu momento presente. A través de la simbología ancestral, la Maestra Rosy interpreta las influencias energéticas que rodean tu vida para ayudarte a tomar elecciones correctas en el amor, el trabajo y la familia.',
      benefits: [
        'Revelación de intenciones verdaderas de personas cercanas',
        'Orientación clara ante dilemas laborales o financieros',
        'Paz mental al comprender la causa de patrones repetitivos'
      ]
    },
    {
      id: 'limpias',
      title: 'Limpias & Purificación',
      subtitle: 'Restauración del aura y la armonía personal',
      icon: <Sun className="w-6 h-6 text-purple-950" />,
      description: 'Así como el cuerpo físico necesita aseo, nuestro campo energético acumula tensión, envidias y pesadez del entorno. Una limpia espiritual disuelve cargas estancadas, equilibrando los chakras para recuperar la vitalidad, el descanso reparador y el entusiasmo.',
      benefits: [
        'Desbloqueo de caminos estancados sin explicación',
        'Protección contra mal de ojo y vibraciones pesadas',
        'Sensación inmediata de ligereza y tranquilidad interior'
      ]
    },
    {
      id: 'rituales',
      title: 'Ritualización & Velaciones',
      subtitle: 'Intención focalizada a través del fuego de luz',
      icon: <Flame className="w-6 h-6 text-purple-950" />,
      description: 'Los rituales esotéricos con velas preparadas son un acto de devoción e intención. Al curar un velón con elementos naturales (sal consagrada, cuarzos y aceites), canalizamos la luz para potenciar peticiones específicas de salud, unión de pareja y prosperidad económica.',
      benefits: [
        'Atracción de abundancia y apertura de nuevos negocios',
        'Fortalecimiento del vínculo y el amor en el matrimonio',
        'Resguardo continuo de la paz en tu hogar'
      ]
    }
  ];

  const myths = [
    {
      myth: '¿El esoterismo es algo oscuro o peligroso?',
      reality: 'En el santuario de la Maestra Rosy trabajamos exclusivamente con energía de luz, fe, intenciones puras y elementos consagrados. Todo trabajo busca tu bienestar, paz y protección.'
    },
    {
      myth: '¿Solo debo consultar cuando todo esté saliendo mal?',
      reality: 'Al igual que la medicina preventiva, la guía espiritual es ideal para mantener la armonía antes de tomar decisiones importantes en negocios o antes de que los conflictos de pareja escalen.'
    },
    {
      myth: '¿Es necesario estar presente físicamente?',
      reality: 'La energía no se limita a la distancia física. Las consultas virtuales y las velaciones a distancia tienen exactamente la misma efectividad que las presenciales.'
    }
  ];

  const activePillar = pillars.find((p) => p.id === activePillarId) || pillars[0];

  const whatsappMessage = `Hola Maestra Rosy, leí la sección sobre esoterismo en su página y me gustaría consultar sobre ${activePillar.title}.`;
  const whatsappUrl = `https://wa.me/${data.socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="py-16 sm:py-24 bg-mystic-dark border-b border-amber-500/25 relative overflow-hidden">
      
      {/* Background Liquid Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 liquid-glass-pill text-amber-300 text-xs font-semibold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase tracking-wider font-serif-title">Sabiduría Ancestral & Guía de Luz</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient tracking-tight">
            ¿Qué es el Esoterismo & Cómo Puede Ayudarte?
          </h2>

          <p className="text-purple-200/90 text-base sm:text-xl font-serif-body leading-relaxed">
            El esoterismo es el conocimiento de las leyes energéticas sutiles que rigen nuestra vida. Comprenderlas te permite transformar la incertidumbre en claridad y la pesadez en armonía.
          </p>
        </div>

        {/* 3 Pillars Interactive Tabs */}
        <div className="space-y-8 max-w-5xl mx-auto">
          
          {/* Tabs Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up stagger-1">
            {pillars.map((pillar) => {
              const isSelected = activePillarId === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillarId(pillar.id)}
                  className={`p-5 rounded-3xl transition-all text-left flex items-center gap-4 cursor-pointer ${
                    isSelected
                      ? 'liquid-glass-btn border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.35)] scale-102 font-bold'
                      : 'liquid-glass-pill text-purple-200 border-amber-500/25 hover:border-amber-400/50 hover:bg-purple-950'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    isSelected ? 'bg-purple-950 text-amber-300 border border-amber-400/50' : 'bg-gold-shine text-purple-950'
                  }`}>
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className={`font-serif-title font-bold text-sm sm:text-base uppercase tracking-wider block ${
                      isSelected ? 'text-purple-950' : 'text-amber-300'
                    }`}>
                      {pillar.title}
                    </h3>
                    <span className={`text-[11px] font-serif-body block mt-0.5 ${
                      isSelected ? 'text-purple-950/80 font-semibold' : 'text-purple-300/80'
                    }`}>
                      {pillar.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Card Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePillar.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="liquid-glass-card p-6 sm:p-10 shadow-2xl space-y-6"
            >
              <div className="space-y-3 pb-6 border-b border-amber-500/20">
                <span className="text-amber-400 text-xs font-serif-title font-bold uppercase tracking-wider block">
                  Pilar de Conocimiento
                </span>
                <h3 className="font-serif-title font-bold text-2xl sm:text-3xl text-amber-200">
                  {activePillar.title}
                </h3>
                <p className="text-purple-100/90 font-serif-body text-base sm:text-lg leading-relaxed">
                  {activePillar.description}
                </p>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-3">
                <h4 className="font-serif-title font-bold text-sm text-amber-300 uppercase tracking-wider">
                  ¿En qué te beneficia directamente?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activePillar.benefits.map((benefit, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-purple-950/60 border border-amber-500/20 flex items-start gap-3 text-xs text-purple-100 font-serif-body leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA embedded */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-500/20">
                <span className="text-xs text-purple-200/90 font-serif-body italic">
                  ¿Tienes alguna duda sobre este servicio espiritual?
                </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-emerald-btn px-6 py-3 text-xs flex items-center gap-2 uppercase tracking-wider shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-950 text-emerald-950" />
                  <span>Consultar sobre {activePillar.title}</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Myths vs Reality Accordion Section */}
        <div className="max-w-4xl mx-auto space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-serif-title font-bold text-2xl text-gold-gradient tracking-tight">
              Mitos & Realidades del Esoterismo
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 font-serif-body">
              Aclaramos las dudas más comunes con total transparencia y ética.
            </p>
          </div>

          <div className="space-y-3">
            {myths.map((item, idx) => {
              const isOpen = openMythIndex === idx;
              return (
                <div
                  key={idx}
                  className="liquid-glass-card overflow-hidden transition-all border border-amber-500/25"
                >
                  <button
                    onClick={() => setOpenMythIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                      <span className="font-serif-title font-bold text-sm sm:text-base text-amber-200">
                        {item.myth}
                      </span>
                    </div>
                    <span className={`text-amber-400 font-bold text-lg transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-5 pt-1 text-xs sm:text-sm text-purple-100/90 font-serif-body leading-relaxed border-t border-purple-900/40"
                      >
                        <div className="p-3.5 rounded-xl bg-purple-950/70 border border-amber-500/20 flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item.reality}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
