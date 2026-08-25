export interface MagicTokenPayload {
  email: string;
  token: string;
  createdAt: number;
  expiresAt: number; // 5 minutes expiration
}

const MAGIC_TOKEN_KEY = 'cajitas_admin_magic_token';
export const DEFAULT_ADMIN_EMAIL = 'danielverde555@gmail.com';

/**
 * Generates a 5-minute single-use Magic Link for admin login
 */
export const generateMagicLink = (email: string): { success: boolean; payload?: MagicTokenPayload; magicUrl?: string; message?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  
  // Create a random cryptographic-like token
  const token = Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  const now = Date.now();
  const expiresAt = now + 5 * 60 * 1000; // Expiration in 5 minutes (300,000 ms)

  const payload: MagicTokenPayload = {
    email: cleanEmail,
    token,
    createdAt: now,
    expiresAt,
  };

  try {
    localStorage.setItem(MAGIC_TOKEN_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Error saving magic token to localStorage:', err);
  }

  const origin = window.location.origin + window.location.pathname;
  const magicUrl = `${origin}?magicToken=${token}`;

  return {
    success: true,
    payload,
    magicUrl,
    message: `Enlace mágico generado para ${cleanEmail}. Expira en 5 minutos.`,
  };
};

/**
 * Validates a Magic Token from URL query parameter or manual entry.
 * Ensures the token hasn't expired (must be within 5 minutes).
 */
export const verifyMagicToken = (tokenToVerify: string): { valid: boolean; reason?: 'expired' | 'invalid'; email?: string } => {
  try {
    const raw = localStorage.getItem(MAGIC_TOKEN_KEY);
    if (!raw) {
      return { valid: false, reason: 'invalid' };
    }

    const payload: MagicTokenPayload = JSON.parse(raw);

    if (payload.token !== tokenToVerify.trim()) {
      return { valid: false, reason: 'invalid' };
    }

    if (Date.now() > payload.expiresAt) {
      localStorage.removeItem(MAGIC_TOKEN_KEY);
      return { valid: false, reason: 'expired' };
    }

    // Token is valid! Consume it (single-use)
    localStorage.removeItem(MAGIC_TOKEN_KEY);
    return { valid: true, email: payload.email };
  } catch (err) {
    return { valid: false, reason: 'invalid' };
  }
};
