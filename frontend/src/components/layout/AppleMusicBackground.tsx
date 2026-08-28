import React from 'react';

export const AppleMusicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05020a]">
      
      {/* STATIC AMBIENT MYSTIC BACKGROUND FOR MOBILE SCREENS (< 640px) */}
      <div className="sm:hidden absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(88,28,135,0.25),transparent_70%),radial-gradient(ellipse_at_bottom,rgba(180,83,9,0.15),transparent_70%)]" />

      {/* ANIMATED APPLE MUSIC STYLE LIQUID GRADIENT ORBS (DESKTOP & TABLET ONLY sm:block) */}
      <div className="hidden sm:block absolute inset-0">
        {/* Orb 1: Celestial Amber Gold - Top Left Fluid Motion */}
        <div className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-tr from-amber-600/30 via-amber-500/20 to-yellow-400/25 blur-[160px] md:blur-[200px] animate-apple-liquid-1 will-change-transform" />

        {/* Orb 2: Mystic Amethyst Violet - Top Right Fluid Motion */}
        <div className="absolute -top-[15%] -right-[15%] w-[70vw] h-[70vw] max-w-[950px] max-h-[950px] rounded-full bg-gradient-to-bl from-purple-800/35 via-fuchsia-700/25 to-purple-900/30 blur-[170px] md:blur-[210px] animate-apple-liquid-2 will-change-transform" />

        {/* Orb 3: Emerald Green Resplendence - Bottom Left Fluid Motion */}
        <div className="absolute -bottom-[20%] -left-[15%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-br from-emerald-600/25 via-teal-700/20 to-emerald-900/30 blur-[160px] md:blur-[200px] animate-apple-liquid-3 will-change-transform" />

        {/* Orb 4: Deep Astral Indigo - Bottom Right Fluid Motion */}
        <div className="absolute -bottom-[15%] -right-[10%] w-[60vw] h-[60vw] max-w-[850px] max-h-[850px] rounded-full bg-gradient-to-tl from-indigo-900/35 via-purple-900/25 to-amber-700/20 blur-[180px] md:blur-[220px] animate-apple-liquid-4 will-change-transform" />

        {/* Subtle Overlay Vignette */}
        <div className="absolute inset-0 bg-[#05020a]/40 backdrop-blur-[1px]" />
      </div>

    </div>
  );
};
