import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../../context/SiteContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { KeyRound, Eye, EyeOff, X, ShieldAlert, CheckCircle, Mail, Sparkles, Clock, ArrowLeft, RefreshCw, Moon } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { requestOTPCode, verifyOTPCode, data } = useSite();

  // Step 1 or Step 2
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [email, setEmail] = useState(data.adminEmail || 'rosyverde10@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 2 OTP State (6 Digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(300); // 5 minutes

  const firstOtpInputRef = useRef<HTMLInputElement>(null);

  // Lock background scroll when modal is open
  useBodyScrollLock(isOpen);

  // Reset modal state when opened/closed
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setEmail(data.adminEmail || 'rosyverde10@gmail.com');
      setPassword('');
      setError('');
      setOtpDigits(['', '', '', '', '', '']);
      setExpiresAt(null);
    }
  }, [isOpen, data.adminEmail]);

  // Countdown timer for 5-minute OTP code expiration
  useEffect(() => {
    if (step !== 2 || !expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeftSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setError('El código de 6 dígitos de 5 minutos ha expirado. Por favor solicite uno nuevo.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, expiresAt]);

  // Focus first OTP input box when step 2 opens
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        firstOtpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  if (!isOpen) return null;

  // Step 1 Submission: Validate Email + Password and request 6-digit OTP email
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Por favor ingrese su correo electrónico.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor ingrese su contraseña de seguridad.');
      return;
    }

    setLoading(true);
    try {
      const result = await requestOTPCode(email, password);
      setLoading(false);

      if (result.success) {
        setExpiresAt(result.expiresAt || Date.now() + 5 * 60 * 1000);
        setTimeLeftSeconds(300);
        setStep(2);
      } else {
        setError(result.message || 'Credenciales incorrectas.');
      }
    } catch (err) {
      setLoading(false);
      setError('Error de conexión al solicitar el código.');
    }
  };

  // Step 2 Submission: Verify 6-digit OTP code
  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const fullCode = otpDigits.join('').trim();
    if (fullCode.length < 6) {
      setError('Por favor ingrese el código completo de 6 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTPCode(email, fullCode);
      setLoading(false);

      if (result.success) {
        setError('');
        onSuccess();
      } else {
        setError(result.message || 'Código incorrecto o expirado.');
      }
    } catch (err) {
      setLoading(false);
      setError('Error al verificar el código.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue && value !== '') return;

    const newDigits = [...otpDigits];
    newDigits[index] = cleanValue.slice(-1);
    setOtpDigits(newDigits);

    if (cleanValue && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }

    if (cleanValue && index === 5 && newDigits.every((d) => d !== '')) {
      const codeStr = newDigits.join('');
      verifyOTPCode(email, codeStr).then((res) => {
        if (res.success) onSuccess();
        else setError(res.message);
      });
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || '';
      }
      setOtpDigits(newDigits);
      if (pastedData.length === 6) {
        verifyOTPCode(email, pastedData).then((res) => {
          if (res.success) onSuccess();
          else setError(res.message);
        });
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#07020f]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">

      <div className="bg-[#170b2e] text-purple-100 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-400/30 relative transform transition-all my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-purple-300 hover:text-amber-300 rounded-full hover:bg-purple-900/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: CREDENTIALS */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-900 text-amber-300 flex items-center justify-center mx-auto shadow-lg border border-amber-400/30">
                <Moon className="w-7 h-7 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-2xl text-amber-300">
                  Acceso Maestra Rosy
                </h3>
                <p className="text-xs text-purple-200/70 mt-1 leading-relaxed">
                  Ingrese sus credenciales para solicitar el código de verificación al correo.
                </p>
              </div>
            </div>

            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="rosyverde10@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-500/30 bg-purple-950/80 text-purple-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                  Contraseña / PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-amber-500/30 bg-purple-950/80 text-purple-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-amber-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 border border-amber-300"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Enviando código OTP...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Enviar Código de 6 Digitos</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: 6-DIGIT OTP CODE */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
              <span className="text-[11px] font-semibold text-purple-300/70">Paso 2 de 2</span>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title font-bold text-xl text-amber-300">
                Código Enviado a su Correo
              </h3>
              <p className="text-xs text-purple-200/80 leading-relaxed max-w-xs mx-auto">
                Hemos enviado un código de seguridad de 6 dígitos a: <br />
                <strong className="text-amber-300 font-bold">{email}</strong>
              </p>
            </div>

            {/* OTP 6 Boxes Input */}
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    ref={idx === 0 ? firstOtpInputRef : undefined}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 text-center text-xl font-bold text-amber-300 bg-purple-950/90 border-2 border-amber-500/30 rounded-xl focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 shadow-md"
                  />
                ))}
              </div>

              {/* Timer & Resend */}
              <div className="flex items-center justify-between text-xs text-purple-300/70 pt-1">
                <div className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vence en: {formatTimer(timeLeftSeconds)}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRequestCode(e)}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer"
                >
                  Reenviar código
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 border border-amber-300"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Verificar e Iniciar Sesión</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
