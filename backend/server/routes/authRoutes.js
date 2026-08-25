import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

const router = Router();

router.post('/request-code', AuthController.requestCode);
router.post('/verify-code', AuthController.verifyCode);

export default router;
