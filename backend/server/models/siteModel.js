import { readData, writeData, INITIAL_SITE_DATA } from '../config/db.js';

const pendingOTPStore = new Map();

export const SiteModel = {
  getSiteData() {
    return readData();
  },

  updateSiteData(newData) {
    writeData(newData);
    return readData();
  },

  resetSiteData() {
    writeData(INITIAL_SITE_DATA);
    return readData();
  },

  saveOTP(email, code, expiresAt) {
    const normalizedEmail = email.trim().toLowerCase();
    pendingOTPStore.set(normalizedEmail, { code, expiresAt });
  },

  getOTP(email) {
    const normalizedEmail = email.trim().toLowerCase();
    return pendingOTPStore.get(normalizedEmail);
  },

  deleteOTP(email) {
    const normalizedEmail = email.trim().toLowerCase();
    pendingOTPStore.delete(normalizedEmail);
  }
};
