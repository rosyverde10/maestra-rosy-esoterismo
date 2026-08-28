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

  const pillars: Pillar[] = [
    {
      id: 'tarot',
      title: 'El Tarot & la Canalización',
      subtitle: 'Claridad para tomar decisiones con certeza',
      icon: <Eye className="w-5 h-5 text-purple-950" />,
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
      icon: <Sun className="w-5 h-5 text-purple-950" />,
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
      icon: <Flame className="w-5 h-5 text-purple-950" />,
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
      reality: 'En el santuario de la Maestra Rosy trabajamos exclusivamente con energía de luz, fe, intenciones puras y elementos consagrados. Todo trabajo busca tu bienestar y paz.'
    },
    {
      myth: '¿Solo debo consultar cuando todo esté saliendo mal?',
      reality: 'Es una herramienta preventiva para mantener la armonía antes de tomar decisiones importantes en negocios o conflictos de pareja.'
    },
    {
      myth: '¿Es necesario estar presente físicamente?',
      reality: 'La energía trasciende la distancia física. Las consultas virtuales y velaciones a distancia tienen la misma efectividad.'
    }
  ];

  const activePillar = pillars.find((p) => p.id === activePillarId) || pillars[0];

  const whatsappMessage = `Hola Maestra Rosy, leí la sección sobre esoterismo en su página y me gustaría consultar sobre ${activePillar.title}.`;
  const whatsappUrl = `https://wa.me/${data.socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="esoterismo" className="py-12 lg:py-14 lg:min-h-[calc(100vh-5rem)] lg:flex lg:flex-col lg:justify-center bg-mystic-dark border-b border-amber-500/25 relative overflow-hidden">
      
      {/* Background Liquid Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8 lg:space-y-10 relative z-10 w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 liquid-glass-pill text-amber-300 text-xs font-semibold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase tracking-wider font-serif-title">Sabiduría Ancestral & Guía de Luz</span>
          </div>

          <h2 className="font-serif-title text-2xl sm:text-4xl lg:text-4xl font-extrabold text-gold-gradient tracking-tight">
            ¿Qué es el Esoterismo & Cómo Puede Ayudarte?
          </h2>

          <p className="text-purple-200/90 text-sm sm:text-base lg:text-lg font-serif-body leading-relaxed max-w-2xl mx-auto">
            El esoterismo es el estudio práctico de las leyes energéticas que rigen nuestra vida cotidiana, transformando la incertidumbre en claridad.
          </p>
        </div>

        {/* 3 Pillars Interactive Tabs */}
        <div className="space-y-6 max-w-5xl mx-auto">
          
          {/* Tabs Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-up stagger-1">
            {pillars.map((pillar) => {
              const isSelected = activePillarId === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillarId(pillar.id)}
                  className={`p-4 rounded-2xl transition-all text-left flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'liquid-glass-btn border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.35)] scale-102 font-bold'
                      : 'liquid-glass-pill text-purple-200 border-amber-500/25 hover:border-amber-400/50 hover:bg-purple-950'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    isSelected ? 'bg-purple-950 text-amber-300 border border-amber-400/50' : 'bg-gold-shine text-purple-950'
                  }`}>
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className={`font-serif-title font-bold text-xs sm:text-sm uppercase tracking-wider block ${
                      isSelected ? 'text-purple-950' : 'text-amber-300'
                    }`}>
                      {pillar.title}
                    </h3>
                    <span className={`text-[10px] font-serif-body block mt-0.5 ${
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="liquid-glass-card p-5 sm:p-7 shadow-2xl space-y-4"
            >
              <div className="space-y-2 pb-4 border-b border-amber-500/20">
                <span className="text-amber-400 text-[11px] font-serif-title font-bold uppercase tracking-wider block">
                  Pilar de Conocimiento
                </span>
                <h3 className="font-serif-title font-bold text-xl sm:text-2xl text-amber-200">
                  {activePillar.title}
                </h3>
                <p className="text-purple-100/90 font-serif-body text-xs sm:text-sm leading-relaxed">
                  {activePillar.description}
                </p>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2">
                <h4 className="font-serif-title font-bold text-xs text-amber-300 uppercase tracking-wider">
                  Beneficios Directos:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activePillar.benefits.map((benefit, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-purple-950/60 border border-amber-500/20 flex items-start gap-2 text-[11px] sm:text-xs text-purple-100 font-serif-body leading-tight">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA embedded */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-500/20">
                <span className="text-[11px] text-purple-200/90 font-serif-body italic">
                  ¿Tienes alguna duda sobre este servicio espiritual?
                </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-emerald-btn px-5 py-2 text-xs flex items-center gap-2 uppercase tracking-wider shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-950 text-emerald-950" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Myths vs Reality Accordion Section */}
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="text-center">
            <h3 className="font-serif-title font-bold text-lg sm:text-xl text-gold-gradient tracking-tight">
              Mitos & Realidades del Esoterismo
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {myths.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="liquid-glass-card p-3.5 border border-amber-500/25 space-y-1.5"
                >
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="font-serif-title font-bold text-xs text-amber-200 leading-snug">
                      {item.myth}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-100/90 font-serif-body leading-relaxed pl-6 border-l border-emerald-500/40">
                    {item.reality}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
