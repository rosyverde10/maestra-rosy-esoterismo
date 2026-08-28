import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../../context/SiteContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { KeyRound, Eye, EyeOff, X, ShieldAlert, CheckCircle, Mail, Sparkles, Clock, ArrowLeft, RefreshCw, Moon, LogIn } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { requestOTPCode, verifyOTPCode, data } = useSite();

  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState(data.adminEmail || 'michisnsqk@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(300);

  const firstOtpInputRef = useRef<HTMLInputElement>(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setEmail(data.adminEmail || 'michisnsqk@gmail.com');
      setPassword('');
      setError('');
      setOtpDigits(['', '', '', '', '', '']);
      setExpiresAt(null);
      setLoading(false);
    }
  }, [isOpen, data.adminEmail]);

  useEffect(() => {
    if (step !== 2 || !expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeftSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setError('El código de 6 dígitos ha expirado. Por favor intente de nuevo.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, expiresAt]);

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        firstOtpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  if (!isOpen) return null;

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
        setError(result.message || 'Credenciales no válidas. Verifique su correo y contraseña.');
      }
    } catch (err) {
      setLoading(false);
      setError('Error de conexión al solicitar el código.');
    }
  };

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#040208]/90 backdrop-blur-2xl flex items-center justify-center p-4">

      <div className="bg-[#0e071c] text-purple-100 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-amber-400/50 relative transform transition-all my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 text-purple-300 hover:text-amber-300 rounded-full bg-purple-950/80 hover:bg-purple-900 transition-colors border border-amber-400/30 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: CREDENTIALS INPUT WITH "ENTRAR" BUTTON */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center mx-auto shadow-xl border border-amber-300">
                <Moon className="w-7 h-7 fill-purple-950 text-purple-950" />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-2xl text-gold-gradient tracking-wide uppercase">
                  Acceso Panel Admin
                </h3>
                <p className="text-xs text-purple-200/80 mt-1 font-serif-body leading-relaxed">
                  Ingrese sus credenciales para recibir el código de seguridad de 6 dígitos al correo.
                </p>
              </div>
            </div>

            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-serif-title font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="michisnsqk@gmail.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-amber-500/40 bg-[#07030e] text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 text-sm font-medium shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif-title font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                  Contraseña de Seguridad
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-amber-500/40 bg-[#07030e] text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 text-sm font-medium shadow-inner"
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
                <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* BUTTON TEXT EXPLICITLY SET TO "ENTRAR" */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 rounded-xl bg-gold-shine text-purple-950 font-serif-title font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 border border-amber-300 uppercase tracking-widest cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-950" />
                    <span>Enviando código...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4.5 h-4.5 text-purple-950" />
                    <span>ENTRAR</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: 6-DIGIT OTP CODE INPUT */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-serif-title font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
              <span className="text-[11px] font-serif-title font-semibold text-purple-300/80 uppercase">Paso 2 de 2</span>
            </div>

            <div className="text-center space-y-2">
              <div className="w-13 h-13 rounded-2xl bg-gold-shine text-purple-950 flex items-center justify-center mx-auto shadow-xl border border-amber-300">
                <Sparkles className="w-6 h-6 text-purple-950" />
              </div>
              <h3 className="font-serif-title font-bold text-xl text-amber-300">
                Código Enviado al Correo
              </h3>
              <p className="text-xs text-purple-200/90 font-serif-body leading-relaxed max-w-xs mx-auto">
                Hemos enviado un código de seguridad de 6 dígitos a: <br />
                <strong className="text-amber-300 font-bold">{email}</strong>
              </p>
            </div>

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
                    className="w-11 h-13 text-center text-xl font-serif-title font-extrabold text-amber-300 bg-[#07030e] border-2 border-amber-500/50 rounded-xl focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 shadow-inner"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-purple-300/80 pt-1 font-serif-body">
                <div className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vence en: {formatTimer(timeLeftSeconds)}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRequestCode(e)}
                  className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  Reenviar código
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gold-shine text-purple-950 font-serif-title font-bold text-xs shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 border border-amber-300 uppercase tracking-wider cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-950" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-purple-950" />
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
