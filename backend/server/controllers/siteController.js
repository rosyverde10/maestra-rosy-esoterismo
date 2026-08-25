import { SiteModel } from '../models/siteModel.js';

export const SiteController = {
  getSiteData(req, res) {
    const data = SiteModel.getSiteData();
    return res.json({ success: true, data });
  },

  updateSiteData(req, res) {
    const newData = req.body;
    if (!newData) {
      return res.status(400).json({ success: false, message: 'Datos requeridos.' });
    }
    const updated = SiteModel.updateSiteData(newData);
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('site:updated', updated);
      }
    } catch (err) {
      console.warn('Socket io broadcast skipped:', err.message);
    }
    return res.json({ success: true, data: updated });
  },

  resetSiteData(req, res) {
    const reset = SiteModel.resetSiteData();
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('site:updated', reset);
      }
    } catch (err) {
      console.warn('Socket io broadcast skipped:', err.message);
    }
    return res.json({ success: true, data: reset });
  }
};
