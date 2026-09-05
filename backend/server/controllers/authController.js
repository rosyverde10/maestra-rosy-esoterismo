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
      const envEmail = (process.env.EMAIL_USER || "").trim().toLowerCase();
      const currentDataEmail = (currentSiteData?.adminEmail || "").trim().toLowerCase();

      // Validacion estricta contra variables de entorno o la configuracion dinamica de la base de datos
      const isEmailValid =
        (envEmail && normalizedEmail === envEmail) ||
        (currentDataEmail && normalizedEmail === currentDataEmail);

      const validPin = currentSiteData?.adminPinHash || process.env.ADMIN_PIN || "admin123";
      const isPasswordValid = password === validPin;

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
      const { email, password } = req.body || {};
      const currentSiteData = SiteModel.getSiteData() || {};

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Credenciales requeridas' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const envEmail = (process.env.EMAIL_USER || "").trim().toLowerCase();
      const currentDataEmail = (currentSiteData?.adminEmail || "").trim().toLowerCase();

      // Validacion estricta contra variables de entorno o la configuracion dinamica de la base de datos
      const isEmailValid =
        (envEmail && normalizedEmail === envEmail) ||
        (currentDataEmail && normalizedEmail === currentDataEmail);

      const validPin = currentSiteData?.adminPinHash || process.env.ADMIN_PIN || "admin123";
      const isPasswordValid = password === validPin;

      if (!isEmailValid || !isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales no válidas. Verifique su correo y contraseña.'
        });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000;

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
