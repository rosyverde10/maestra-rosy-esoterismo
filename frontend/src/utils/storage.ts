import type { SiteData } from '../types';

import { INITIAL_SITE_DATA } from '../data/defaultData';

const STORAGE_KEY = 'cajitas_levantamiento_cruz_v1_data';

export const loadSiteData = (): SiteData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SITE_DATA));
      return INITIAL_SITE_DATA;
    }
    const parsed = JSON.parse(stored);
    // Ensure all required fields exist
    return {
      ...INITIAL_SITE_DATA,
      ...parsed,
      siteConfig: { ...INITIAL_SITE_DATA.siteConfig, ...(parsed.siteConfig || {}) },
      socialConfig: { ...INITIAL_SITE_DATA.socialConfig, ...(parsed.socialConfig || {}) },
      categories: (parsed.categories && parsed.categories.length > 0) ? parsed.categories : INITIAL_SITE_DATA.categories,
      products: (parsed.products && parsed.products.length > 0) ? parsed.products : INITIAL_SITE_DATA.products,
      adminPinHash: parsed.adminPinHash || INITIAL_SITE_DATA.adminPinHash,
    };
  } catch (error) {
    console.error('Error loading site data from localStorage:', error);
    return INITIAL_SITE_DATA;
  }
};

export const saveSiteData = (data: SiteData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving site data to localStorage:', error);
  }
};

export const resetSiteData = (): SiteData => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SITE_DATA));
  return INITIAL_SITE_DATA;
};

export const exportSiteDataJSON = (data: SiteData): void => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `respaldo_cajitas_cruz_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
