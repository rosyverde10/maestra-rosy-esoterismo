import { Router } from 'express';
import { SiteController } from '../controllers/siteController.js';

const router = Router();

router.get('/data', SiteController.getSiteData);
router.post('/data', SiteController.updateSiteData);
router.post('/reset', SiteController.resetSiteData);

export default router;
