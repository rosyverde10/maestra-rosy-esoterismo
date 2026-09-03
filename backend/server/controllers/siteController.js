import { SiteModel } from '../models/siteModel.js';

export const SiteController = {
  getSiteData(req, res) {
    const data = SiteModel.getPublicSiteData();
    return res.json({ success: true, data });
  },

  updateSiteData(req, res) {
    const newData = req.body;
    if (!newData) {
      return res.status(400).json({ success: false, message: 'Datos requeridos.' });
    }
    SiteModel.updateSiteData(newData);
    const publicUpdated = SiteModel.getPublicSiteData();
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('site:updated', publicUpdated);
      }
    } catch (err) {
      console.warn('Socket io broadcast skipped:', err.message);
    }
    return res.json({ success: true, data: publicUpdated });
  },

  resetSiteData(req, res) {
    SiteModel.resetSiteData();
    const publicReset = SiteModel.getPublicSiteData();
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('site:updated', publicReset);
      }
    } catch (err) {
      console.warn('Socket io broadcast skipped:', err.message);
    }
    return res.json({ success: true, data: publicReset });
  }
};
