import React from 'react';
import { useSite } from '../../context/SiteContext';
import { Sparkles, Moon, Sun } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { data } = useSite();

  if (!data?.siteConfig?.announcementBanner) return null;

  return (
    <div className="bg-gradient-to-r from-amber-950/90 via-purple-950/95 to-amber-950/90 text-amber-200 text-xs py-2 px-4 text-center font-medium shadow-md flex items-center justify-center gap-3 border-b border-amber-500/30 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.15),transparent)] pointer-events-none" />
      <div className="flex items-center gap-2 relative z-10">
        <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow shrink-0" />
        <Moon className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
      </div>
      <span className="font-serif-title tracking-wider text-amber-100 text-[11px] sm:text-xs font-semibold uppercase drop-shadow">
        {data.siteConfig.announcementBanner}
      </span>
      <div className="flex items-center gap-2 relative z-10">
        <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-star-glow shrink-0" />
        <Moon className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
      </div>
    </div>
  );
};
