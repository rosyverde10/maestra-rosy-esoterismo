import dns from 'dns';
import nodemailer from 'nodemailer';

// Force global Node.js DNS resolution order to IPv4 first
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

export async function sendOTPEmail(targetEmail, code, businessName = 'Maestra Rosy - Esoterismo & Tarot') {
  const htmlContent = `
    <div style="font-family: 'Georgia', serif; max-width: 520px; margin: 0 auto; background-color: #120726; border: 1px solid #d4af37; border-radius: 16px; padding: 32px; color: #f3f4f6;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #d4af37; margin: 0; font-size: 26px; text-shadow: 0 0 10px rgba(212, 175, 55, 0.4);">${businessName}</h1>
        <p style="color: #c084fc; font-size: 13px; font-weight: 600; margin-top: 6px; font-family: sans-serif;">✨ Código de Seguridad de Acceso Administrativo</p>
      </div>

      <div style="background-color: #1e0e38; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid rgba(212, 175, 55, 0.3); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);">
        <p style="font-size: 14px; color: #e9d5ff; margin-top: 0; font-family: sans-serif;">Tu código de seguridad de 6 dígitos es:</p>
        <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #d4af37; background-color: #2e1052; padding: 14px 28px; border-radius: 12px; display: inline-block; margin: 14px 0; border: 1px solid #d4af37; font-family: sans-serif;">
          ${code}
        </div>
        <p style="font-size: 12px; color: #f87171; font-weight: 600; margin-bottom: 0; font-family: sans-serif;">⏳ Este código vence en 5 minutos.</p>
      </div>

      <div style="margin-top: 24px; font-size: 11px; color: #a855f7; text-align: center; line-height: 1.5; font-family: sans-serif;">
        <p style="margin: 0;">Si no intentaste iniciar sesión en el panel de administración de Maestra Rosy, ignora este mensaje.</p>
        <p style="margin-top: 6px;">© ${new Date().getFullYear()} ${businessName} • Guiado Espiritual & Sanación</p>
      </div>
    </div>
  `;

  // 1. Resend HTTPS API (Puerto 443 HTTPS - Nunca bloqueado por Render)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      console.log(`✉️ Enviando correo a [${targetEmail}] via Resend HTTPS API (Puerto 443)...`);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${businessName} <onboarding@resend.dev>`,
          to: [targetEmail],
          subject: `✨ Tu código de acceso Maestra Rosy: ${code}`,
          html: htmlContent,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`✅ [CORREO ENTREGADO VIA RESEND HTTPS API]:`, data.id);
        return { success: true, messageId: data.id };
      } else {
        console.error('❌ Error de Resend API:', data);
        return { success: false, error: data.message || JSON.stringify(data) };
      }
    } catch (apiErr) {
      console.error('❌ Error en peticion HTTPS Resend:', apiErr);
    }
  }

  // 2. Brevo (Sendinblue) HTTPS API (Puerto 443 HTTPS - Nunca bloqueado por Render)
  const brevoKey = process.env.BREVO_API_KEY;
  if (brevoKey) {
    try {
      console.log(`✉️ Enviando correo a [${targetEmail}] via Brevo HTTPS API (Puerto 443)...`);
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey.trim(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: businessName, email: process.env.EMAIL_USER || targetEmail },
          to: [{ email: targetEmail }],
          subject: `Tu código de verificación de 6 dígitos: ${code}`,
          htmlContent: htmlContent,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`✅ [CORREO ENTREGADO VIA BREVO HTTPS API]:`, data.messageId);
        return { success: true, messageId: data.messageId };
      } else {
        console.error('❌ Error de Brevo API:', data);
        return { success: false, error: data.message || JSON.stringify(data) };
      }
    } catch (apiErr) {
      console.error('❌ Error en peticion HTTPS Brevo:', apiErr);
    }
  }

  // 3. Fallback: Nodemailer SMTP Transport
  try {
    const rawUser = process.env.EMAIL_USER || targetEmail;
    const rawPass = process.env.EMAIL_PASS || '';

    const cleanUser = rawUser.trim();
    const cleanPass = rawPass.replace(/\s+/g, '');

    let gmailIpv4Host = '142.250.115.108';
    try {
      const addresses = await dns.promises.resolve4('smtp.gmail.com');
      if (addresses && addresses.length > 0) {
        gmailIpv4Host = addresses[0];
      }
    } catch (dnsErr) {
      console.warn('⚠️ No se pudo resolver resolve4, usando IP directa:', dnsErr.message);
    }

    console.log(`✉️ Intentando enviar correo via SMTP [${gmailIpv4Host}:587]...`);

    const transporter = nodemailer.createTransport({
      host: gmailIpv4Host,
      port: 587,
      secure: false,
      requireTLS: true,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
      auth: {
        user: cleanUser,
        pass: cleanPass,
      },
      tls: {
        servername: 'smtp.gmail.com',
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"${businessName}" <${cleanUser}>`,
      to: targetEmail,
      subject: `✨ Tu código de verificación de 6 dígitos: ${code}`,
      html: htmlContent,
    });

    console.log(`✅ [CORREO ENVIADO EXITOSAMENTE VIA SMTP A ${targetEmail}]:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('❌ Error enviando correo con Nodemailer SMTP:', err);
    return {
      success: false,
      error: `Render requiere RESEND_API_KEY en variables de entorno. Detalle: ${err.message}`
    };
  }
}
