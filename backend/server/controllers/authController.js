import { SiteModel } from '../models/siteModel.js';
import { sendOTPEmail } from '../config/mailer.js';

// Rate limiter memory store: ip -> { attempts, lockUntil }
const failedAttempts = new Map();

export const AuthController = {
  directLogin(req, res) {
    try {
      const { email, password } = req.body || {};
      const currentSiteData = SiteModel.getSiteData() || {};

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Credenciales requeridas' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const adminEmail = (process.env.EMAIL_USER || currentSiteData?.adminEmail || '').trim().toLowerCase();

      const isEmailValid = normalizedEmail === adminEmail;
      const isPasswordValid = password === currentSiteData.adminPinHash;

      if (!isEmailValid || !isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales no válidas. Verifique su correo y contraseña.'
        });
      }

      return res.json({
        success: true,
        message: 'Acceso concedido.'
      });
    } catch (err) {
      console.error('Error en directLogin:', err);
      return res.status(500).json({ success: false, message: 'Error interno en inicio de sesión.' });
    }
  },

  async requestCode(req, res) {
    try {
      const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
      const now = Date.now();

      // Check rate limit (max 5 failed attempts per 15 minutes)
      const ipRecord = failedAttempts.get(clientIp);
      if (ipRecord && ipRecord.lockUntil > now) {
        const waitMinutes = Math.ceil((ipRecord.lockUntil - now) / 60000);
        return res.status(429).json({
          success: false,
          message: `Demasiados intentos fallidos. Por seguridad, intente nuevamente en ${waitMinutes} minutos.`
        });
      }

      const { email, password } = req.body || {};
      const currentSiteData = SiteModel.getSiteData() || {};

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Credenciales requeridas' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const adminEmail = (process.env.EMAIL_USER || currentSiteData?.adminEmail || '').trim().toLowerCase();

      const isEmailValid = normalizedEmail === adminEmail;
      const isPasswordValid = password === currentSiteData.adminPinHash;

      if (!isEmailValid || !isPasswordValid) {
        const attempts = (ipRecord?.attempts || 0) + 1;
        const lockUntil = attempts >= 5 ? now + 15 * 60 * 1000 : 0;
        failedAttempts.set(clientIp, { attempts, lockUntil });

        return res.status(401).json({
          success: false,
          message: 'Credenciales no válidas. Verifique su correo y contraseña.'
        });
      }

      // Reset failed attempts on successful credentials check
      failedAttempts.delete(clientIp);

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = now + 5 * 60 * 1000;

      SiteModel.saveOTP(normalizedEmail, code, expiresAt);

      console.log(`🔑 [CÓDIGO GENERADO]: ${code} enviado a ${normalizedEmail} (Vence en 5 min)`);

      const mailResult = await sendOTPEmail(normalizedEmail, code, currentSiteData.siteConfig?.businessName);

      if (!mailResult || !mailResult.success) {
        console.warn('⚠️ Advertencia en entrega de correo:', mailResult?.error);
      }

      return res.json({
        success: true,
        message: `Código de verificación de 6 dígitos enviado exitosamente a ${normalizedEmail}.`,
        expiresAt,
      });
    } catch (criticalErr) {
      console.error('CRITICAL AUTH ERROR:', criticalErr);
      return res.status(500).json({
        success: false,
        message: 'Error interno al procesar inicio de sesión.',
        error: criticalErr.message
      });
    }
  },

  verifyCode(req, res) {
    try {
      const { email, code } = req.body || {};
      if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Código de verificación requerido' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const stored = SiteModel.getOTP(normalizedEmail);

      if (!stored) {
        return res.status(400).json({ success: false, message: 'No se ha solicitado ningún código o ya fue utilizado.' });
      }

      if (Date.now() > stored.expiresAt) {
        SiteModel.deleteOTP(normalizedEmail);
        return res.status(400).json({ success: false, message: 'El código ha expirado. Solicite uno nuevo.' });
      }

      if (stored.code !== code.trim()) {
        return res.status(400).json({ success: false, message: 'Código de seguridad incorrecto.' });
      }

      SiteModel.deleteOTP(normalizedEmail);
      return res.json({ success: true, message: 'Verificación exitosa.' });
    } catch (err) {
      console.error('Error en verifyCode:', err);
      return res.status(500).json({ success: false, message: 'Error interno en verificación de código.' });
    }
  }
};
