import React from 'react';
import { useSite } from '../../context/SiteContext';
import { Sparkles, Moon } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { data } = useSite();

  if (!data?.siteConfig?.announcementBanner) return null;

  return (
    <div className="hidden sm:flex bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-950 text-amber-200 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 text-center font-medium shadow-inner items-center justify-center gap-2 border-b border-amber-500/20 leading-tight">
      <Moon className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
      <span className="line-clamp-2 sm:line-clamp-none font-serif-body tracking-wider">{data.siteConfig.announcementBanner}</span>
      <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-star-glow shrink-0" />
    </div>
  );
};
