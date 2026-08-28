import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SiteData, Product, SiteConfig, SocialConfig } from '../types';
import { loadSiteData, saveSiteData, resetSiteData as storageReset } from '../utils/storage';
import { subscribeToSiteUpdates, emitSiteUpdate, socket, getApiBaseUrl } from '../services/socket';

interface RequestOTPResult {
  success: boolean;
  message: string;
  expiresAt?: number;
  devCode?: string;
  previewUrl?: string;
}

interface SiteContextType {
  data: SiteData;
  isAdmin: boolean;
  isSocketConnected: boolean;
  requestOTPCode: (email: string, pass: string) => Promise<RequestOTPResult>;
  verifyOTPCode: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  updateSiteConfig: (config: SiteConfig) => void;
  updateSocialConfig: (config: SocialConfig) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  changeAdminPassword: (newPass: string) => void;
  changeAdminEmail: (newEmail: string) => void;
  importData: (newData: SiteData) => void;
  resetToDefaults: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);


// Local fallback memory for OTP in case backend API is connecting
const localOTPStore = new Map<string, { code: string; expiresAt: number }>();

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000; // 8 horas en milisegundos

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(loadSiteData);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const savedSession = localStorage.getItem('cajitas_admin_session');
      const savedTime = localStorage.getItem('cajitas_admin_session_time');
      if (savedSession === 'true' && savedTime) {
        const elapsed = Date.now() - parseInt(savedTime, 10);
        if (elapsed < EIGHT_HOURS_MS) {
          return true;
        }
      }
      localStorage.removeItem('cajitas_admin_session');
      localStorage.removeItem('cajitas_admin_session_time');
      return false;
    } catch {
      return false;
    }
  });
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(socket.connected);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('cajitas_admin_session');
      localStorage.removeItem('cajitas_admin_session_time');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Manage admin session timestamp & 8-hour auto-expiration check
  useEffect(() => {
    try {
      if (isAdmin) {
        const now = Date.now();
        const existingTime = localStorage.getItem('cajitas_admin_session_time');
        if (!existingTime) {
          localStorage.setItem('cajitas_admin_session_time', now.toString());
        }
        localStorage.setItem('cajitas_admin_session', 'true');

        // Periodic check every 1 minute for 8-hour expiration
        const interval = setInterval(() => {
          const loginTimeStr = localStorage.getItem('cajitas_admin_session_time');
          if (loginTimeStr) {
            const elapsed = Date.now() - parseInt(loginTimeStr, 10);
            if (elapsed >= EIGHT_HOURS_MS) {
              console.log('⏰ La sesión de administración de 8 horas ha expirado automáticamente.');
              setIsAdmin(false);
              localStorage.removeItem('cajitas_admin_session');
              localStorage.removeItem('cajitas_admin_session_time');
            }
          }
        }, 60000);

        return () => clearInterval(interval);
      } else {
        localStorage.removeItem('cajitas_admin_session');
        localStorage.removeItem('cajitas_admin_session_time');
      }
    } catch (err) {
      console.error('Error al administrar expiración de sesión:', err);
    }
  }, [isAdmin]);

  // Save to local storage on state change
  useEffect(() => {
    saveSiteData(data);
  }, [data]);

  // Listen for live draft preview updates via window postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SITE_DATA_UPDATE' && event.data.data) {
        setData(event.data.data);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);




  // Fetch initial live site data from backend HTTP API on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const baseUrl = getApiBaseUrl();
        let res = await fetch(`${baseUrl}/api/site/data`).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch('/api/site/data').catch(() => null);
        }
        if (res && res.ok) {
          const json = await res.json();
          if (json && json.data && json.data.products && json.data.products.length > 0) {
            setData(json.data);
          }
        }
      } catch (err) {
        console.warn('Initial site data fetch fallback to local state:', err);
      }
    };
    fetchInitialData();
  }, []);

  // Real-time socket subscription
  useEffect(() => {
    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    const unsubscribe = subscribeToSiteUpdates((remoteData) => {
      if (remoteData) {
        if (!remoteData.products || remoteData.products.length === 0) {
          setData({ ...remoteData, products: loadSiteData().products });
        } else {
          setData(remoteData);
        }
      }
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      unsubscribe();
    };
  }, []);

  const requestOTPCode = async (email: string, pass: string): Promise<RequestOTPResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    const currentAdminEmail = (data.adminEmail || "michisnsqk@gmail.com").toLowerCase();

    if (pass !== data.adminPinHash) {
      return { success: false, message: 'Credenciales Incorrectas' };
    }

    const isAllowedEmail = 
      normalizedEmail === currentAdminEmail || 
      normalizedEmail === 'michisnsqk@gmail.com' || 
      normalizedEmail === 'rosyverde10@gmail.com';

    if (!isAllowedEmail) {
      return { success: false, message: 'Credenciales Incorrectas' };
    }

    // Try getApiBaseUrl() first, then fallback to relative /api
    const baseUrl = getApiBaseUrl();
    let response: Response | null = null;
    try {
      response = await fetch(`${baseUrl}/api/auth/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password: pass }),
      });
    } catch (err) {
      try {
        response = await fetch('/api/auth/request-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail, password: pass }),
        });
      } catch (err2) {
        console.error('Error enviando solicitud de correo:', err2);
      }
    }

    if (response) {
      try {
        const resData = await response.json();
        if (response.ok && resData.success) {
          if (resData.code) {
            localOTPStore.set(normalizedEmail, { code: resData.code, expiresAt: resData.expiresAt });
          }
          return {
            success: true,
            message: resData.message,
            expiresAt: resData.expiresAt,
            devCode: resData.code,
            previewUrl: resData.previewUrl,
          };
        } else {
          return { success: false, message: resData.message || 'Error al procesar la solicitud en el servidor.' };
        }
      } catch (e) {
        return { success: false, message: 'Respuesta inválida del servidor de correo.' };
      }
    }

    return { success: false, message: 'No se pudo conectar con el servidor de correo. Verifique que el servidor esté activo.' };
  };

  const verifyOTPCode = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const baseUrl = getApiBaseUrl();
    let response: Response | null = null;
    try {
      response = await fetch(`${baseUrl}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, code: cleanCode }),
      });
    } catch (err) {
      try {
        response = await fetch('/api/auth/verify-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail, code: cleanCode }),
        });
      } catch (err2) {
        console.error('Error verificando código con el servidor:', err2);
      }
    }

    if (response) {
      try {
        const resData = await response.json();
        if (response.ok && resData.success) {
          setIsAdmin(true);
          return { success: true, message: 'Verificación exitosa.' };
        } else {
          return { success: false, message: resData.message || 'Código incorrecto o expirado.' };
        }
      } catch (e) {
        return { success: false, message: 'Respuesta inválida del servidor.' };
      }
    }


    // Local fallback check
    const stored = localOTPStore.get(normalizedEmail);
    if (!stored) {
      return { success: false, message: 'No hay un código pendiente o ya fue utilizado.' };
    }

    if (Date.now() > stored.expiresAt) {
      localOTPStore.delete(normalizedEmail);
      return { success: false, message: 'El código de 5 minutos ha expirado. Solicite uno nuevo.' };
    }

    if (stored.code !== cleanCode) {
      return { success: false, message: 'Código de 6 dígitos incorrecto. Verifique su correo.' };
    }

    localOTPStore.delete(normalizedEmail);
    setIsAdmin(true);
    return { success: true, message: 'Verificación exitosa.' };
  };

  const updateSiteConfig = (newConfig: SiteConfig) => {

    const newData: SiteData = { ...data, siteConfig: newConfig };
    setData(newData);
    emitSiteUpdate(newData);
  };

  const updateSocialConfig = (newConfig: SocialConfig) => {
    const newData: SiteData = { ...data, socialConfig: newConfig };
    setData(newData);
    emitSiteUpdate(newData);
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const newData: SiteData = { ...data, products: [newProd, ...data.products] };
    setData(newData);
    emitSiteUpdate(newData);
  };

  const updateProduct = (updatedProd: Product) => {
    const newData: SiteData = {
      ...data,
      products: data.products.map((p) => (p.id === updatedProd.id ? updatedProd : p)),
    };
    setData(newData);
    emitSiteUpdate(newData);
  };

  const deleteProduct = (id: string) => {
    const newData: SiteData = {
      ...data,
      products: data.products.filter((p) => p.id !== id),
    };
    setData(newData);
    emitSiteUpdate(newData);
  };

  const addCategory = (category: string) => {
    if (!data.categories.includes(category.trim())) {
      const newData: SiteData = {
        ...data,
        categories: [...data.categories, category.trim()],
      };
      setData(newData);
      emitSiteUpdate(newData);
    }
  };

  const deleteCategory = (category: string) => {
    if (category === "Todas") return;
    const newData: SiteData = {
      ...data,
      categories: data.categories.filter((c) => c !== category),
    };
    setData(newData);
    emitSiteUpdate(newData);
    if (selectedCategory === category) {
      setSelectedCategory("Todas");
    }
  };

  const changeAdminPassword = (newPass: string) => {
    const newData: SiteData = { ...data, adminPinHash: newPass };
    setData(newData);
    emitSiteUpdate(newData);
  };

  const changeAdminEmail = (newEmail: string) => {
    const newData: SiteData = { ...data, adminEmail: newEmail.trim().toLowerCase() };
    setData(newData);
    emitSiteUpdate(newData);
  };

  const importData = (newData: SiteData) => {
    setData(newData);
    saveSiteData(newData);
    emitSiteUpdate(newData);
  };

  const resetToDefaults = () => {
    const defaultData = storageReset();
    setData(defaultData);
    emitSiteUpdate(defaultData);
  };

  return (
    <SiteContext.Provider
      value={{
        data,
        isAdmin,
        isSocketConnected,
        requestOTPCode,
        verifyOTPCode,
        logoutAdmin,
        updateSiteConfig,
        updateSocialConfig,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        changeAdminPassword,
        changeAdminEmail,
        importData,
        resetToDefaults,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
