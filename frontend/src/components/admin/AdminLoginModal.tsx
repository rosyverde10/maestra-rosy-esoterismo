import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { KeyRound, Eye, EyeOff, X, ShieldAlert, Mail, Moon, LogIn, RefreshCw } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdminDirect, data } = useSite();

  const [email, setEmail] = useState(data.adminEmail || 'michisnsqk@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) {
      setEmail(data.adminEmail || 'michisnsqk@gmail.com');
      setPassword('');
      setError('');
      setLoading(false);
    }
  }, [isOpen, data.adminEmail]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
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
      const result = await loginAdminDirect(email, password);
      setLoading(false);

      if (result.success) {
        setError('');
        onSuccess();
      } else {
        setError(result.message || 'Credenciales no válidas. Verifique su correo y contraseña.');
      }
    } catch (err) {
      setLoading(false);
      setError('Error al procesar el inicio de sesión.');
    }
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
                Ingrese sus credenciales para acceder al panel de administración.
              </p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-amber-500/40 bg-[#07030e] text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 text-sm font-medium shadow-inner"
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
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-amber-500/40 bg-[#07030e] text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 text-sm font-medium shadow-inner"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 rounded-xl bg-gold-shine text-purple-950 font-serif-title font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 border border-amber-300 uppercase tracking-widest cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-950" />
                  <span>Accediendo...</span>
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

      </div>
    </div>
  );
};
