import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { Moon, Sparkles, Flame, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoonPhase {
  id: string;
  name: string;
  energy: string;
  icon: string;
  recommendedRituals: string[];
  description: string;
}

const moonPhases: MoonPhase[] = [
  {
    id: 'llena',
    name: 'Luna Llena',
    energy: 'Máxima Potencia Spiritual',
    icon: '🌕',
    recommendedRituals: [
      'Amarres & Consagración de Pareja',
      'Velaciones de Alta Atracción',
      'Apertura de Caminos Financieros',
      'Carga & Limpieza de Amuletos'
    ],
    description: 'Fase de iluminación plena. Los rituales de amor y atracción prosperan con el poder magnético de la luna llena.'
  },
  {
    id: 'creciente',
    name: 'Luna Creciente',
    energy: 'Expansión & Prosperidad',
    icon: '🌔',
    recommendedRituals: [
      'Rituales de Abundancia & Trabajo',
      'Encendido de Velones para Salud',
      'Endulzamientos de Pareja',
      'Bendición de Negocios'
    ],
    description: 'Momento sagrado para sembrar intenciones, atraer empleo, incrementar clientes y fortalecer la unión familiar.'
  },
  {
    id: 'menguante',
    name: 'Luna Menguante',
    energy: 'Purificación & Desbloqueo',
    icon: '🌘',
    recommendedRituals: [
      'Limpias de Mal de Ojo & Envidias',
      'Cortes de Cargas Negativas',
      'Alejamiento de Malas Intenciones',
      'Desbloqueo de Aura'
    ],
    description: 'La energía lunar desciende para disolver lo que estanca tu vida. Ideal para limpiezas profundas y protección.'
  },
  {
    id: 'nueva',
    name: 'Luna Nueva',
    energy: 'Renacimiento & Nuevos Comienzos',
    icon: '🌑',
    recommendedRituals: [
      'Meditación & Claridad con Tarot',
      'Protección Espiritual de Hogar',
      'Inicio de Nuevos Proyectos',
      'Preparación de Altar Personal'
    ],
    description: 'Fase de introspección y renovación total. Perfecta para consultar el tarot y planificar tus metas con luz.'
  }
];

export const MoonPhaseSection: React.FC = () => {
  const { data } = useSite();
  const [selectedPhase, setSelectedPhase] = useState<MoonPhase>(moonPhases[0]);

  const whatsappMessage = `Hola Maestra Rosy, me interesa consultar sobre rituales durante la fase de ${selectedPhase.name} (${selectedPhase.energy}).`;
  const whatsappUrl = `https://wa.me/${data.socialConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="py-16 sm:py-24 bg-mystic-dark border-b border-amber-500/25 relative overflow-hidden">
      
      {/* Ambient Blob */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none animate-float" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 liquid-glass-pill text-amber-300 text-xs font-semibold shadow-md">
            <Moon className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="uppercase tracking-wider font-serif-title">Astrología & Energías Rituales</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient tracking-tight">
            Fases Lunares & Rituales Recomendados
          </h2>

          <p className="text-purple-200/90 text-base sm:text-xl font-serif-body leading-relaxed">
            Cada fase lunar posee un flujo energético único. Selecciona una fase para conocer los trabajos más efectivos según la Maestra Rosy.
          </p>
        </div>

        {/* Interactive Moon Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto animate-fade-up stagger-1">
          {moonPhases.map((phase) => {
            const isSelected = selectedPhase.id === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase)}
                className={`p-4 rounded-3xl border transition-all text-center flex flex-col items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'liquid-glass-btn shadow-[0_0_25px_rgba(251,191,36,0.4)] scale-105 font-bold'
                    : 'liquid-glass-pill text-purple-200 border-amber-500/25 hover:border-amber-400/50 hover:bg-purple-950'
                }`}
              >
                <span className="text-3xl sm:text-4xl animate-float">{phase.icon}</span>
                <span className="font-serif-title text-sm sm:text-base font-bold uppercase tracking-wider block">
                  {phase.name}
                </span>
                <span className={`text-[11px] font-serif-body ${isSelected ? 'text-purple-950 font-bold' : 'text-purple-300/80'}`}>
                  {phase.energy}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Moon Details Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPhase.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto liquid-glass-card p-6 sm:p-10 shadow-2xl space-y-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-amber-500/20 text-center md:text-left">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center text-3xl shadow-lg border border-amber-300">
                  {selectedPhase.icon}
                </div>
                <div>
                  <h3 className="font-serif-title font-bold text-2xl text-amber-300">
                    {selectedPhase.name} — {selectedPhase.energy}
                  </h3>
                  <p className="text-sm text-purple-200/90 font-serif-body mt-1 max-w-xl">
                    {selectedPhase.description}
                  </p>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-serif-title font-bold text-xs shadow-xl flex items-center gap-2 border border-emerald-400/40 uppercase tracking-wider shrink-0"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Consultar en esta Fase</span>
              </a>
            </div>

            {/* Recommended Rituals Grid */}
            <div className="space-y-3">
              <h4 className="font-serif-title font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Ritualizaciones más recomendadas:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedPhase.recommendedRituals.map((ritual, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-purple-950/70 border border-amber-500/20 flex items-center gap-3 text-sm text-purple-100 font-medium"
                  >
                    <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{ritual}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
