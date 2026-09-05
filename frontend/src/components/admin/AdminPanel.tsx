import React, { useState, useEffect, useRef } from 'react';
import type { Product, SiteConfig, SocialConfig, SiteData } from '../../types';
import { useSite, SiteContext } from '../../context/SiteContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { exportSiteDataJSON } from '../../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Plus, Trash2, Edit3, Save, Check, Upload, Layers,
  Package, Share2, Shield, Download, Mail, Ruler, LogOut,
  Eye, EyeOff, Monitor, Layout, Sparkles, BookOpen, ArrowLeft, MessageCircle, Moon
} from 'lucide-react';

import { Hero } from '../sections/Hero';
import { ProductCatalog } from '../sections/ProductCatalog';
import { AboutSection } from '../sections/AboutSection';
import { SocialContact } from '../sections/SocialContact';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { AnnouncementBar } from '../layout/AnnouncementBar';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dynamic Scale Container Component that guarantees 100% of the desktop website fits cleanly
const ScaledPreviewFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.55);
  const [wrapperHeight, setWrapperHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && contentRef.current) {
        const availableWidth = containerRef.current.clientWidth - 16;
        const targetWidth = 1100;
        const computedScale = Math.min(Math.max(availableWidth / targetWidth, 0.3), 0.85);
        setScale(computedScale);

        const actualHeight = contentRef.current.offsetHeight;
        setWrapperHeight(actualHeight * computedScale + 20);
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    window.addEventListener('resize', updateDimensions);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto overflow-x-hidden p-2 scrollbar-thin flex flex-col items-center">
      <div
        style={{
          height: wrapperHeight ? `${wrapperHeight}px` : 'auto',
        }}
        className="w-full relative flex justify-center shrink-0"
      >
        <div
          ref={contentRef}
          style={{
            width: '1100px',
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
          className="bg-[#0c0517] shadow-2xl rounded-2xl border border-amber-500/30 overflow-hidden flex flex-col pointer-events-none transition-transform duration-150 shrink-0 absolute top-0"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// Canvas helper to compress images down to ~60KB-80KB
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1000;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve(uploadEvent.target?.result as string);
        }
      };
      img.onerror = () => resolve(uploadEvent.target?.result as string);
      img.src = uploadEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// Helper to parse price string into numeric price & note
const parsePriceComponents = (priceStr: string) => {
  const numMatch = priceStr.match(/\$?[\s]*(\d+([\.,]\d+)?)/);
  const priceNum = numMatch ? numMatch[1] : '';
  const noteMatch = priceStr.match(/\((.*?)\)/);
  const priceNote = noteMatch ? noteMatch[1] : '';
  return { priceNum, priceNote };
};

// Helper to parse dimensions into L x W x H
const parseDimensionsComponents = (dimStr: string) => {
  const matches = dimStr.match(/(\d+([\.,]\d+)?)/g);
  if (matches && matches.length >= 3) {
    return { length: matches[0], width: matches[1], height: matches[2] };
  }
  return { length: '', width: '', height: '' };
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const globalSiteContext = useSite();
  const {
    data,
    logoutAdmin,
    updateSiteConfig,
    updateSocialConfig,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    changeAdminPassword,
  } = globalSiteContext;

  const [activeTab, setActiveTab] = useState<'hero' | 'products' | 'categories' | 'about' | 'headerFooter' | 'socialConfig' | 'security'>('hero');
  
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'edit';
    }
    return 'split';
  });

  // Lock background body scrolling
  useBodyScrollLock(isOpen);

  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<Omit<Product, 'id' | 'createdAt'>>({
    name: '',
    category: data.categories[1] || 'Lecturas de Tarot',
    priceText: '$ 450 MXN',
    description: '',
    materials: '',
    dimensions: 'Sesión de 45 a 60 minutos',
    status: 'disponible',
    images: [],
    featured: false,
  });

  // Price Sub-Inputs
  const [priceNum, setPriceNum] = useState<string>('450');
  const [priceNote, setPriceNote] = useState<string>('');

  // Dimensions Sub-Inputs (Largo, Ancho, Alto)
  const [lengthCm, setLengthCm] = useState<string>('25');
  const [widthCm, setWidthCm] = useState<string>('18');
  const [heightCm, setHeightCm] = useState<string>('12');

  // LOCAL DRAFT STATES
  const [siteConfigForm, setSiteConfigForm] = useState<SiteConfig>(data.siteConfig);
  const [socialConfigForm, setSocialConfigForm] = useState<SocialConfig>(data.socialConfig);

  // Category Form State
  const [newCatInput, setNewCatInput] = useState('');
  
  // Password Form State
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Global Floating Save Notification State
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Confirmation Modal Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const askConfirmation = (opts: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: opts.title,
      message: opts.message,
      confirmText: opts.confirmText || 'Sí, confirmar',
      cancelText: opts.cancelText || 'Cancelar',
      isDanger: opts.isDanger || false,
      onConfirm: opts.onConfirm,
    });
  };

  const triggerSaveNotification = (detailMsg: string = 'Cambios guardados con éxito') => {
    setSaveNotification(detailMsg);
    setTimeout(() => setSaveNotification(null), 3500);
  };

  useEffect(() => {
    setSiteConfigForm(data.siteConfig);
    setSocialConfigForm(data.socialConfig);
  }, [data.siteConfig, data.socialConfig, isOpen]);

  const handleSiteConfigChange = (updatedFields: Partial<SiteConfig>) => {
    setSiteConfigForm((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleSocialConfigChange = (updatedFields: Partial<SocialConfig>) => {
    setSocialConfigForm((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const compressedPromises = Array.from(files).map((file) => compressImage(file));
      const compressedImages = await Promise.all(compressedPromises);

      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, ...compressedImages],
      }));
    } catch (err) {
      console.error('Error al procesar imágenes:', err);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      handleSiteConfigChange({ heroImage: compressed });
    } catch (err) {
      console.error('Error al cargar foto de portada:', err);
    }
  };

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: data.categories[1] || 'Lecturas de Tarot',
      priceText: '$ 450 MXN',
      description: '',
      materials: '',
      dimensions: 'Sesión de 45 a 60 minutos',
      status: 'disponible',
      images: [],
      featured: false,
    });
    setPriceNum('450');
    setPriceNote('');
    setLengthCm('25');
    setWidthCm('18');
    setHeightCm('12');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      priceText: product.priceText,
      description: product.description,
      materials: product.materials,
      dimensions: product.dimensions,
      status: product.status,
      images: product.images,
      featured: product.featured,
    });
    const { priceNum, priceNote } = parsePriceComponents(product.priceText);
    setPriceNum(priceNum || '450');
    setPriceNote(priceNote || '');
    const { length, width, height } = parseDimensionsComponents(product.dimensions);
    setLengthCm(length || '25');
    setWidthCm(width || '18');
    setHeightCm(height || '12');
    setIsProductModalOpen(true);
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPrice = `$ ${priceNum || '0'} MXN${priceNote ? ` (${priceNote})` : ''}`;
    const formattedDimensions = `${lengthCm || '0'} cm × ${widthCm || '0'} cm × ${heightCm || '0'} cm`;

    const finalProduct = {
      ...productForm,
      priceText: formattedPrice,
      dimensions: productForm.dimensions || formattedDimensions,
      images: productForm.images.length > 0 ? productForm.images : ['/images/hero.jpg'],
    };

    askConfirmation({
      title: editingProduct ? '¿Actualizar Producto o Servicio?' : '¿Guardar Nuevo Producto o Servicio?',
      message: `¿Estás seguro de que deseas ${editingProduct ? 'actualizar' : 'publicar'} "${finalProduct.name || 'este elemento'}" en el catálogo público?`,
      confirmText: editingProduct ? 'Sí, actualizar' : 'Sí, agregar',
      onConfirm: () => {
        if (editingProduct) {
          updateProduct({ ...editingProduct, ...finalProduct });
          triggerSaveNotification(`"${finalProduct.name}" actualizado en la página pública`);
        } else {
          addProduct(finalProduct);
          triggerSaveNotification(`"${finalProduct.name}" agregado al catálogo público`);
        }
        setIsProductModalOpen(false);
      },
    });
  };

  const handleSaveSiteConfig = (e: React.FormEvent) => {
    e.preventDefault();
    askConfirmation({
      title: '¿Publicar Cambios de Texto?',
      message: '¿Estás seguro de que deseas publicar los nuevos cambios de texto en la página web pública?',
      confirmText: 'Sí, publicar cambios',
      onConfirm: () => {
        updateSiteConfig(siteConfigForm);
        triggerSaveNotification('Textos publicados oficialmente en la página web pública');
      },
    });
  };

  const handleSaveSocialConfig = (e: React.FormEvent) => {
    e.preventDefault();
    askConfirmation({
      title: '¿Guardar Datos de Contacto?',
      message: '¿Estás seguro de que deseas actualizar los datos de contacto y número de WhatsApp en la página pública?',
      confirmText: 'Sí, actualizar contacto',
      onConfirm: () => {
        updateSocialConfig(socialConfigForm);
        triggerSaveNotification('Datos de contacto y WhatsApp publicados oficialmente');
      },
    });
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    const catName = newCatInput.trim();
    askConfirmation({
      title: '¿Agregar Nueva Categoría?',
      message: `¿Estás seguro de que deseas agregar la categoría "${catName}" al catálogo?`,
      confirmText: 'Sí, agregar categoría',
      onConfirm: () => {
        addCategory(catName);
        triggerSaveNotification(`Categoría "${catName}" agregada`);
        setNewCatInput('');
      },
    });
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length < 4) {
      setPasswordMsg({ type: 'error', text: 'La contraseña debe tener al menos 4 caracteres.' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }
    askConfirmation({
      title: '¿Cambiar Contraseña de Administrador?',
      message: '¿Estás seguro de que deseas cambiar la contraseña de acceso al panel?',
      confirmText: 'Sí, cambiar contraseña',
      isDanger: true,
      onConfirm: () => {
        changeAdminPassword(newPasswordInput);
        setPasswordMsg({ type: 'success', text: 'Contraseña cambiada exitosamente.' });
        triggerSaveNotification('Contraseña de administrador actualizada');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        setTimeout(() => setPasswordMsg(null), 4000);
      },
    });
  };

  if (!isOpen) return null;

  // DRAFT PREVIEW DATA: Contiene los borradores en tiempo real para la vista previa del admin
  const draftPreviewData: SiteData = {
    ...data,
    siteConfig: siteConfigForm,
    socialConfig: socialConfigForm,
  };

  const previewContextValue = {
    ...globalSiteContext,
    data: draftPreviewData,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#07020f]/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {saveNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-emerald-950 text-white font-semibold text-xs sm:text-sm shadow-2xl flex items-center gap-3 border border-emerald-500/50"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <p className="font-bold text-emerald-300">Publicado correctamente</p>
              <p className="text-[11px] text-emerald-100/90">{saveNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#120726] text-purple-100 rounded-3xl shadow-2xl w-[98vw] max-w-[1650px] h-[96vh] flex flex-col overflow-hidden border border-amber-400/30">
        
        {/* TOP PANEL HEADER */}
        <div className="bg-[#170b2e] text-amber-300 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-xl bg-purple-900/80 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Moon className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h2 className="font-serif-title font-bold text-base sm:text-lg text-amber-300 leading-tight">
                Panel de Administración Completo - Maestra Rosy
              </h2>
              <p className="text-[11px] text-purple-300/80 font-mono">
                Modo Borrador en Vivo (Los cambios se publican al presionar Guardar)
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2.5 pt-2 sm:pt-0 border-t border-purple-900/60 sm:border-none">
            {/* View Mode Selectors */}
            <div className="flex items-center gap-1 bg-purple-950/80 p-1 rounded-xl border border-amber-500/30">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`hidden lg:inline-flex px-3 py-1.5 rounded-lg text-xs font-bold transition-all items-center gap-1.5 ${
                  viewMode === 'split'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-md'
                    : 'text-purple-200 hover:text-amber-300'
                }`}
                title="Edición a la izquierda + Vista Previa escalada a la derecha"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Vista Dividida</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'edit'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-md'
                    : 'text-purple-200 hover:text-amber-300'
                }`}
                title="Solo formulario de edición"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Solo Edición</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'preview'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-md'
                    : 'text-purple-200 hover:text-amber-300'
                }`}
                title="Ver borrador en pantalla completa"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Previa</span>
              </button>
            </div>

            <button
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-950/90 hover:bg-rose-900 text-rose-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-rose-500/40"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-purple-300 hover:text-amber-300 rounded-full hover:bg-purple-900/60 transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS FOR ALL 7 SECTIONS */}
        {viewMode !== 'preview' && (
          <div className="bg-[#180b33] p-2 border-b border-amber-500/20 flex overflow-x-auto gap-1 sm:gap-2 shrink-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'hero'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-md border border-amber-300'
                  : 'text-purple-200 hover:text-amber-300 hover:bg-purple-900/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>1. Portada & Hero</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-md border border-amber-300'
                  : 'text-purple-200 hover:text-amber-300 hover:bg-purple-900/50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>2. Catálogo & Productos ({data.products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-md border border-amber-300'
                  : 'text-purple-200 hover:text-amber-300 hover:bg-purple-900/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>3. Categorías</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'about'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-md border border-amber-300'
                  : 'text-purple-200 hover:text-amber-300 hover:bg-purple-900/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>4. Sobre Nosotros & Historia</span>
            </button>

            <button
              onClick={() => setActiveTab('headerFooter')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'headerFooter'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-md border border-amber-300'
                  : 'text-purple-200 hover:text-amber-300 hover:bg-purple-900/50'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>5. Logo, Header & Footer</span>
            </button>

            <button
              onClick={() => setActiveTab('socialConfig')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'socialConfig'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-md border border-amber-300'
                  : 'text-purple-200 hover:text-amber-300 hover:bg-purple-900/50'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>6. WhatsApp & Contacto</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-md border border-amber-300'
                  : 'text-purple-200 hover:text-amber-300 hover:bg-purple-900/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>7. Seguridad & Respaldo</span>
            </button>
          </div>
        )}

        {/* MAIN BODY: SPLIT VIEW / FULL EDIT / FULL PREVIEW */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-[#0c0517]">

          {/* LEFT PANEL: EDITORS & FORMS */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div className={`p-4 sm:p-6 overflow-y-auto flex-1 bg-[#170b2e] ${viewMode === 'split' ? 'lg:w-[48%] border-r border-amber-500/20' : 'w-full'}`}>

              {/* TAB 1: PORTADA & HERO */}
              {activeTab === 'hero' && (
                <form onSubmit={handleSaveSiteConfig} className="space-y-6">
                  <div className="bg-purple-950/80 p-4 rounded-2xl border border-amber-400/30 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif-title font-bold text-base text-amber-300">
                        1. Sección Portada (Hero)
                      </h3>
                      <p className="text-xs text-purple-200/80">
                        Edite el título principal, subtítulo, foto de portada y los 3 distintivos.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-400 text-amber-950 text-[10px] font-extrabold">
                      📍 Inicio del Sitio
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-2">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Distintivo Superior Flotante (Badge)
                    </label>
                    <input
                      type="text"
                      value={siteConfigForm.heroBadge || ''}
                      onChange={(e) => handleSiteConfigChange({ heroBadge: e.target.value })}
                      placeholder="Ej. Maestra Rosy • Canalizadora Espiritual"
                      className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-2">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Título Principal de Portada (Letras Gigantes)
                    </label>
                    <input
                      type="text"
                      value={siteConfigForm.heroTitle}
                      onChange={(e) => handleSiteConfigChange({ heroTitle: e.target.value })}
                      className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-amber-300 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-2">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Subtítulo Explicativo de Portada
                    </label>
                    <textarea
                      rows={3}
                      value={siteConfigForm.heroSubtitle}
                      onChange={(e) => handleSiteConfigChange({ heroSubtitle: e.target.value })}
                      className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-3">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Imagen Principal de Portada
                    </label>
                    <div className="flex gap-4 items-center">
                      <div className="w-32 h-20 rounded-xl overflow-hidden bg-purple-950 border border-amber-500/30 shrink-0">
                        <img
                          src={siteConfigForm.heroImage || '/images/hero.jpg'}
                          alt="Portada"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow">
                        <Upload className="w-4 h-4" />
                        <span>Subir Foto de Portada</span>
                        <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-2">
                      <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Texto Botón Principal
                      </label>
                      <input
                        type="text"
                        value={siteConfigForm.heroCtaButton || ''}
                        onChange={(e) => handleSiteConfigChange({ heroCtaButton: e.target.value })}
                        className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-2">
                      <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Texto Botón WhatsApp
                      </label>
                      <input
                        type="text"
                        value={siteConfigForm.heroWhatsappCta || ''}
                        onChange={(e) => handleSiteConfigChange({ heroWhatsappCta: e.target.value })}
                        className="w-full p-3 rounded-xl border border-emerald-500/40 bg-[#0a0414] text-emerald-300 font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-3">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Las 4 Tarjetas Destacadas de la Portada</span>
                      <span className="text-[10px] text-amber-400 bg-purple-950 px-2 py-0.5 rounded border border-amber-500/30">Editables en tiempo real</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Tarjeta 1 */}
                      <div className="space-y-1.5 p-3 rounded-xl bg-[#0a0414] border border-amber-500/30">
                        <label className="block text-[11px] font-bold text-amber-300">Tarjeta 1 (ej: +15 Años)</label>
                        <input
                          type="text"
                          value={siteConfigForm.heroFeature1Title || ''}
                          onChange={(e) => handleSiteConfigChange({ heroFeature1Title: e.target.value })}
                          placeholder="Título (ej: +15 AÑOS)"
                          className="w-full p-2.5 rounded-xl border border-amber-500/40 bg-[#180b33] text-white text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={siteConfigForm.heroFeature1Subtitle || ''}
                          onChange={(e) => handleSiteConfigChange({ heroFeature1Subtitle: e.target.value })}
                          placeholder="Subtítulo (ej: Guiado Espiritual)"
                          className="w-full p-2.5 rounded-xl border border-amber-500/40 bg-[#180b33] text-purple-200 text-xs"
                        />
                      </div>

                      {/* Tarjeta 2 */}
                      <div className="space-y-1.5 p-3 rounded-xl bg-[#0a0414] border border-amber-500/30">
                        <label className="block text-[11px] font-bold text-purple-300">Tarjeta 2 (ej: 100%)</label>
                        <input
                          type="text"
                          value={siteConfigForm.heroFeature2Title || ''}
                          onChange={(e) => handleSiteConfigChange({ heroFeature2Title: e.target.value })}
                          placeholder="Título (ej: 100%)"
                          className="w-full p-2.5 rounded-xl border border-amber-500/40 bg-[#180b33] text-white text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={siteConfigForm.heroFeature2Subtitle || ''}
                          onChange={(e) => handleSiteConfigChange({ heroFeature2Subtitle: e.target.value })}
                          placeholder="Subtítulo (ej: Atención Confidencial)"
                          className="w-full p-2.5 rounded-xl border border-amber-500/40 bg-[#180b33] text-purple-200 text-xs"
                        />
                      </div>

                      {/* Tarjeta 3 */}
                      <div className="space-y-1.5 p-3 rounded-xl bg-[#0a0414] border border-amber-500/30">
                        <label className="block text-[11px] font-bold text-emerald-300">Tarjeta 3 (ej: Presencial)</label>
                        <input
                          type="text"
                          value={siteConfigForm.heroFeature3Title || ''}
                          onChange={(e) => handleSiteConfigChange({ heroFeature3Title: e.target.value })}
                          placeholder="Título (ej: PRESENCIAL)"
                          className="w-full p-2.5 rounded-xl border border-amber-500/40 bg-[#180b33] text-white text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={siteConfigForm.heroFeature3Subtitle || ''}
                          onChange={(e) => handleSiteConfigChange({ heroFeature3Subtitle: e.target.value })}
                          placeholder="Subtítulo (ej: Y Consultas Virtuales)"
                          className="w-full p-2.5 rounded-xl border border-amber-500/40 bg-[#180b33] text-purple-200 text-xs"
                        />
                      </div>

                      {/* Tarjeta 4 */}
                      <div className="space-y-1.5 p-3 rounded-xl bg-[#0a0414] border border-amber-500/30">
                        <label className="block text-[11px] font-bold text-teal-300">Tarjeta 4 (ej: 24/7)</label>
                        <input
                          type="text"
                          value={siteConfigForm.heroFeature4Title || ''}
                          onChange={(e) => handleSiteConfigChange({ heroFeature4Title: e.target.value })}
                          placeholder="Título (ej: 24/7)"
                          className="w-full p-2.5 rounded-xl border border-amber-500/40 bg-[#180b33] text-white text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={siteConfigForm.heroFeature4Subtitle || ''}
                          onChange={(e) => handleSiteConfigChange({ heroFeature4Subtitle: e.target.value })}
                          placeholder="Subtítulo (ej: Atención por WhatsApp)"
                          className="w-full p-2.5 rounded-xl border border-amber-500/40 bg-[#180b33] text-purple-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all border border-amber-300 cursor-pointer"
                  >
                    <Save className="w-5 h-5" />
                    <span>Guardar y Publicar Cambios de Portada</span>
                  </button>
                </form>
              )}

              {/* TAB 2: CATÁLOGO & PRODUCTOS */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-4">
                    <h3 className="font-serif-title font-bold text-base text-amber-300">
                      Encabezado de la Sección del Catálogo
                    </h3>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Título de la Sección del Catálogo
                      </label>
                      <input
                        type="text"
                        value={siteConfigForm.catalogTitle || ''}
                        onChange={(e) => handleSiteConfigChange({ catalogTitle: e.target.value })}
                        className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Subtítulo de la Sección del Catálogo
                      </label>
                      <input
                        type="text"
                        value={siteConfigForm.catalogSubtitle || ''}
                        onChange={(e) => handleSiteConfigChange({ catalogSubtitle: e.target.value })}
                        className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-[#1f0f3d] p-4 rounded-2xl border border-amber-500/25 shadow-md">
                    <div>
                      <h3 className="font-serif-title font-bold text-base text-amber-300">
                        Productos Registrados ({data.products.length})
                      </h3>
                      <p className="text-xs text-purple-200/80">Agregue o edite fotos, precios y detalles.</p>
                    </div>

                    <button
                      onClick={handleOpenCreateProduct}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-xs flex items-center gap-1.5 shadow border border-amber-300 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Producto</span>
                    </button>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-[#1a0e35] rounded-2xl p-4 border border-amber-500/30 shadow-md flex flex-col justify-between space-y-3 hover:border-amber-400/60 transition-all"
                      >
                        <div className="flex gap-3 items-center">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-purple-950 shrink-0 border border-amber-500/30">
                            <img
                              src={prod.images[0] || '/images/hero.jpg'}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                                {prod.category}
                              </span>
                              {prod.featured && (
                                <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 text-[9px] font-extrabold rounded">
                                  ⭐ Destacado
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif-title font-bold text-purple-100 text-sm truncate">
                              {prod.name}
                            </h4>
                            <p className="text-xs text-amber-300 font-bold mt-0.5">
                              {prod.priceText}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-purple-900/60 text-xs">
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                            prod.status === 'disponible' ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/90 text-amber-300 border border-amber-500/30'
                          }`}>
                            {prod.status === 'disponible' ? '✓ Disponible' : 'Por Cita'}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 text-amber-300 hover:text-amber-200 hover:bg-purple-900/60 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                askConfirmation({
                                  title: '¿Eliminar Producto?',
                                  message: `¿Estás seguro de que deseas eliminar permanentemente "${prod.name}" del catálogo público? Esta acción no se puede deshacer.`,
                                  confirmText: 'Sí, eliminar producto',
                                  isDanger: true,
                                  onConfirm: () => {
                                    deleteProduct(prod.id);
                                    triggerSaveNotification(`Producto "${prod.name}" eliminado del catálogo`);
                                  },
                                });
                              }}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CATEGORÍAS */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div className="bg-[#1f0f3d] p-4 rounded-2xl border border-amber-500/25">
                    <h3 className="font-serif-title font-bold text-base text-amber-300">
                      Gestión de Categorías del Catálogo
                    </h3>
                    <p className="text-xs text-purple-200/80">
                      Administre las pestañas de filtro para organizar los productos y lecturas.
                    </p>
                  </div>

                  <form onSubmit={handleAddCategorySubmit} className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-3">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Agregar Nueva Categoría
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCatInput}
                        onChange={(e) => setNewCatInput(e.target.value)}
                        placeholder="Ej. Baños de Purificación"
                        className="flex-1 p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm"
                      />
                      <button
                        type="submit"
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </form>

                  <div className="bg-[#1f0f3d] p-5 rounded-2xl border border-amber-500/25 space-y-3 shadow-sm">
                    <h3 className="font-serif-title font-bold text-base text-amber-300">
                      Categorías Actuales del Catálogo
                    </h3>
                    <div className="divide-y divide-purple-900/60">
                      {data.categories.map((cat) => (
                        <div key={cat} className="py-2.5 flex items-center justify-between text-sm font-medium text-purple-100">
                          <span>{cat}</span>
                          {cat !== 'Todas' && (
                            <button
                              onClick={() => {
                                askConfirmation({
                                  title: '¿Eliminar Categoría?',
                                  message: `¿Estás seguro de que deseas eliminar la categoría "${cat}"?`,
                                  confirmText: 'Sí, eliminar categoría',
                                  isDanger: true,
                                  onConfirm: () => {
                                    deleteCategory(cat);
                                    triggerSaveNotification(`Categoría "${cat}" eliminada`);
                                  },
                                });
                              }}
                              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Eliminar</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SOBRE NOSOTROS & HISTORIA */}
              {activeTab === 'about' && (
                <form onSubmit={handleSaveSiteConfig} className="space-y-6">
                  <div className="bg-purple-950/80 p-4 rounded-2xl border border-amber-400/30 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif-title font-bold text-base text-amber-300">
                        4. Sección "Sobre Nosotros & Tradición"
                      </h3>
                      <p className="text-xs text-purple-200/80">
                        Edite la trayectoria de la Maestra Rosy y el origen ritual.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-400 text-amber-950 text-[10px] font-extrabold">
                      📍 Sección Media
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-3">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Distintivo Flotante de la Sección
                    </label>
                    <input
                      type="text"
                      value={siteConfigForm.aboutBadge || ''}
                      onChange={(e) => handleSiteConfigChange({ aboutBadge: e.target.value })}
                      placeholder="Ej. Trayectoria & Don Espiritual"
                      className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-3">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Título de la Sección "Sobre Nosotros"
                    </label>
                    <input
                      type="text"
                      value={siteConfigForm.aboutTitle}
                      onChange={(e) => handleSiteConfigChange({ aboutTitle: e.target.value })}
                      className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-amber-300 font-bold text-sm"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-3">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Párrafo 1: Descripción de Trayectoria
                    </label>
                    <textarea
                      rows={3}
                      value={siteConfigForm.aboutText}
                      onChange={(e) => handleSiteConfigChange({ aboutText: e.target.value })}
                      className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-3">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Párrafo 2: Explicación de la Tradición y Velaciones
                    </label>
                    <textarea
                      rows={3}
                      value={siteConfigForm.traditionText}
                      onChange={(e) => handleSiteConfigChange({ traditionText: e.target.value })}
                      className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all border border-amber-300 cursor-pointer"
                  >
                    <Save className="w-5 h-5" />
                    <span>Guardar y Publicar Cambios de Historia</span>
                  </button>
                </form>
              )}

              {/* TAB 5: LOGO, HEADER & FOOTER */}
              {activeTab === 'headerFooter' && (
                <form onSubmit={handleSaveSiteConfig} className="space-y-6">
                  <div className="bg-[#1f0f3d] p-4 rounded-2xl border border-amber-500/25">
                    <h3 className="font-serif-title font-bold text-base text-amber-300">
                      5. Encabezado, Logo & Pie de Página (Footer)
                    </h3>
                    <p className="text-xs text-purple-200/80">
                      Personalice el logo, nombre comercial, lema y el aviso dorado superior.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-4">
                    <label className="block text-xs font-bold text-amber-300 uppercase flex items-center justify-between">
                      <span>Logo Personalizado</span>
                      <span className="text-[10px] text-amber-400 font-bold">📍 Barra Fija Superior</span>
                    </label>
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-950 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/40">
                        {siteConfigForm.logoImage ? (
                          <img src={siteConfigForm.logoImage} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-8 h-8 text-amber-300" />
                        )}
                      </div>
                      <label className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow">
                        <Upload className="w-4 h-4" />
                        <span>Subir Logo desde Dispositivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const compressed = await compressImage(file);
                            handleSiteConfigChange({ logoImage: compressed });
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-amber-300 uppercase">Nombre del Negocio</label>
                      <input
                        type="text"
                        value={siteConfigForm.businessName}
                        onChange={(e) => handleSiteConfigChange({ businessName: e.target.value })}
                        className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-amber-300 uppercase">Lema Corto (Tagline)</label>
                      <input
                        type="text"
                        value={siteConfigForm.tagline}
                        onChange={(e) => handleSiteConfigChange({ tagline: e.target.value })}
                        className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-amber-300 uppercase">Barra de Anuncios Superior (Tira Dorada)</label>
                    <input
                      type="text"
                      value={siteConfigForm.announcementBanner}
                      onChange={(e) => handleSiteConfigChange({ announcementBanner: e.target.value })}
                      className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-amber-300 font-medium text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-amber-300 uppercase">Texto del Pie de Página (Footer)</label>
                    <input
                      type="text"
                      value={siteConfigForm.footerText || ''}
                      onChange={(e) => handleSiteConfigChange({ footerText: e.target.value })}
                      className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all border border-amber-300 cursor-pointer"
                  >
                    <Save className="w-5 h-5" />
                    <span>Guardar y Publicar Encabezado</span>
                  </button>
                </form>
              )}

              {/* TAB 6: WHATSAPP & CONTACTO */}
              {activeTab === 'socialConfig' && (
                <form onSubmit={handleSaveSocialConfig} className="space-y-6">
                  <div className="bg-[#1f0f3d] p-4 sm:p-5 rounded-2xl border border-emerald-500/30 space-y-2">
                    <h3 className="font-serif-title font-bold text-base sm:text-lg text-emerald-300 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                      <span>6. Configuración de WhatsApp y Datos de Contacto</span>
                    </h3>
                    <p className="text-xs text-purple-200/80 leading-relaxed">
                      Personalice su número de atención por WhatsApp, teléfono de llamadas directas, mensaje automático de bienvenida y enlaces a sus redes sociales.
                    </p>
                  </div>

                  {/* GUÍA RÁPIDA DE NÚMEROS TELEFÓNICOS */}
                  <div className="p-4 rounded-2xl bg-[#0a0414] border border-amber-500/30 text-xs space-y-2">
                    <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                      <span>💡 ¿Cómo ingresar sus números correctamente?</span>
                    </h4>
                    <ul className="space-y-1.5 text-purple-200 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="font-bold shrink-0 text-emerald-400">📲 WhatsApp:</span>
                        <span>Escriba la lada de su país seguida de sus 10 dígitos (sin espacios ni signo +). <strong>Para México escriba 52</strong> antes de sus 10 dígitos (Ejemplo: <code className="bg-purple-950 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold border border-amber-400/40">525551234567</code>).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold shrink-0 text-amber-300">📞 Llamadas:</span>
                        <span>Escriba únicamente su número de 10 dígitos para recibir llamadas telefónicas locales (Ejemplo: <code className="bg-purple-950 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold border border-amber-400/40">5551234567</code>).</span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 bg-[#1f0f3d] p-4 rounded-2xl border border-emerald-500/30">
                      <label className="block text-xs font-bold text-emerald-300 uppercase flex items-center justify-between">
                        <span>Número de WhatsApp</span>
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">Ej: 525551234567</span>
                      </label>
                      <input
                        type="text"
                        value={socialConfigForm.whatsappNumber}
                        onChange={(e) => handleSocialConfigChange({ whatsappNumber: e.target.value })}
                        placeholder="Ej. 525551234567"
                        className="w-full p-3 rounded-xl border border-emerald-500/40 bg-[#0a0414] font-mono font-bold text-emerald-300 text-sm focus:ring-2 focus:ring-emerald-400/30"
                      />
                      <p className="text-[11px] text-purple-300/80">
                        Enlace generado: <span className="font-mono text-emerald-300 font-semibold">wa.me/{socialConfigForm.whatsappNumber.replace(/[^0-9]/g, '') || '52...'}</span>
                      </p>
                    </div>

                    <div className="space-y-1.5 bg-[#1f0f3d] p-4 rounded-2xl border border-amber-500/30">
                      <label className="block text-xs font-bold text-amber-300 uppercase flex items-center justify-between">
                        <span>Teléfono para Llamadas Directas</span>
                        <span className="text-[10px] font-bold text-amber-300 bg-purple-950 px-2 py-0.5 rounded-full border border-amber-500/30">Ej: 5551234567</span>
                      </label>
                      <input
                        type="text"
                        value={socialConfigForm.phone}
                        onChange={(e) => handleSocialConfigChange({ phone: e.target.value })}
                        placeholder="Ej. 5551234567"
                        className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] font-mono font-bold text-amber-300 text-sm focus:ring-2 focus:ring-amber-400/30"
                      />
                      <p className="text-[11px] text-purple-300/80">
                        Llamada directa: <span className="font-mono text-amber-300 font-semibold">tel:{socialConfigForm.phone.replace(/[^0-9+]/g, '') || '555...'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-[#1f0f3d] p-4 rounded-2xl border border-amber-500/30">
                    <label className="block text-xs font-bold text-amber-300 uppercase">Mensaje Predeterminado de WhatsApp</label>
                    <textarea
                      rows={2}
                      value={socialConfigForm.whatsappMessage}
                      onChange={(e) => handleSocialConfigChange({ whatsappMessage: e.target.value })}
                      placeholder="Hola Maestra Rosy, me gustaría solicitar información..."
                      className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white text-sm leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 bg-[#1f0f3d] p-4 rounded-2xl border border-amber-500/30">
                      <label className="block text-xs font-bold text-amber-300 uppercase">Dirección o Consultorio</label>
                      <input
                        type="text"
                        value={socialConfigForm.locationAddress}
                        onChange={(e) => handleSocialConfigChange({ locationAddress: e.target.value })}
                        className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-1 bg-[#1f0f3d] p-4 rounded-2xl border border-amber-500/30">
                      <label className="block text-xs font-bold text-amber-300 uppercase">Horarios de Atención</label>
                      <input
                        type="text"
                        value={socialConfigForm.workingHours}
                        onChange={(e) => handleSocialConfigChange({ workingHours: e.target.value })}
                        className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* UBICACIÓN DE GOOGLE MAPS */}
                  <div className="p-4 rounded-2xl bg-[#1f0f3d] border border-amber-500/30 space-y-2.5">
                    <label className="block text-xs font-bold text-amber-300 uppercase flex items-center justify-between">
                      <span>Ubicación o Enlace de Google Maps</span>
                      <span className="text-[10px] font-bold text-amber-300 bg-purple-950 px-2 py-0.5 rounded-full border border-amber-500/30">📍 Enlace de Mapa</span>
                    </label>
                    <input
                      type="text"
                      value={socialConfigForm.googleMapsUrl || ''}
                      onChange={(e) => handleSocialConfigChange({ googleMapsUrl: e.target.value })}
                      placeholder="Pegue aquí el enlace o código iframe de Google Maps"
                      className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white text-sm font-medium focus:ring-2 focus:ring-amber-400/40"
                    />
                    <p className="text-[11px] text-purple-200/80">
                      Mapa actual configurado: <strong className="text-amber-300">Esoterismo Maestra Rosy</strong>. Puedes pegar un nuevo enlace si deseas actualizar la ubicación.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all border border-emerald-400/30 cursor-pointer"
                  >
                    <Save className="w-5 h-5" />
                    <span>Guardar y Publicar Datos de Contacto</span>
                  </button>
                </form>
              )}

              {/* TAB 7: SEGURIDAD & RESPALDO */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-3 shadow-sm">
                    <h3 className="font-serif-title font-bold text-base text-amber-300 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-amber-400" />
                      Correo de Administración para Verificación 2FA
                    </h3>
                    <p className="text-xs text-purple-200/80">
                      Los códigos de seguridad de 6 dígitos para inicio de sesión se envían a este correo verificado en Resend:
                    </p>
                    <div className="p-3 rounded-xl bg-[#0a0414] border border-amber-500/30 flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-amber-300">{data.adminEmail || 'rosy10@gmail.com'}</span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-500/30">
                        ✓ Verificado (Resend API)
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-4 shadow-sm">
                    <h3 className="font-serif-title font-bold text-base text-amber-300 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-400" />
                      Cambiar Contraseña de Administrador
                    </h3>
                    <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Nueva contraseña"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          className="w-full p-3 pr-11 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm focus:ring-2 focus:ring-amber-400/40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-300 hover:text-amber-300"
                          title={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirmar nueva contraseña"
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          className="w-full p-3 pr-11 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm focus:ring-2 focus:ring-amber-400/40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-300 hover:text-amber-300"
                          title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 text-xs font-bold shadow border border-amber-300 cursor-pointer"
                      >
                        Guardar Nueva Contraseña
                      </button>
                      {passwordMsg && (
                        <p className={`text-xs font-bold ${passwordMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {passwordMsg.text}
                        </p>
                      )}
                    </form>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#1f0f3d] border border-amber-500/25 space-y-3">
                    <h3 className="font-serif-title font-bold text-base text-amber-300 flex items-center gap-2">
                      <Download className="w-5 h-5 text-amber-400" />
                      Copia de Respaldo Local (JSON)
                    </h3>
                    <p className="text-xs text-purple-200/80">
                      Descargue una copia completa de sus productos, categorías y textos para resguardo.
                    </p>
                    <button
                      onClick={() => {
                        exportSiteDataJSON(data);
                        triggerSaveNotification('Respaldo JSON descargado');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 text-xs font-bold shadow flex items-center gap-2 border border-amber-300 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Copia de Respaldo JSON</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RIGHT PANEL: LIVE BORRADOR PREVIEW (FULL COMPONENTS RENDERED IN REAL-TIME) */}
          {viewMode === 'split' && (
            <div className="hidden lg:flex lg:w-[52%] flex-col bg-[#07020f] border-l border-purple-900/60 h-full overflow-hidden relative">
              {/* Header Bar */}
              <div className="w-full bg-[#120726] px-4 py-2.5 border-b border-amber-500/20 flex items-center justify-between text-xs text-purple-200 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="font-bold text-amber-300">Vista Previa de tu Borrador en Vivo</span>
                  <span className="text-[10px] text-purple-300/80 font-mono">(Solo visible para ti mientras editas)</span>
                </div>
                <div className="p-1.5 rounded-lg bg-purple-900/60 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                  <Monitor className="w-4 h-4" />
                </div>
              </div>

              {/* ESCENARIO VIRTUAL CON COMPONENTES REALES */}
              <div className="flex-1 w-full overflow-hidden bg-[#0c0517] relative">
                {/* Capa de protección transparente aislada dentro del contenedor de vista previa */}
                <div
                  className="absolute inset-0 z-10 bg-transparent cursor-default"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
                <SiteContext.Provider value={previewContextValue}>
                  <ScaledPreviewFrame>
                    <AnnouncementBar />
                    <Navbar onOpenAdminLogin={() => {}} onOpenAdminPanel={() => {}} />
                    <main className="pt-16 pointer-events-none">
                      <Hero />
                      <ProductCatalog onSelectProduct={() => {}} />
                      <AboutSection />
                      <SocialContact />
                    </main>
                    <Footer onOpenAdminLogin={() => {}} onOpenAdminPanel={() => {}} />
                  </ScaledPreviewFrame>
                </SiteContext.Provider>
              </div>
            </div>
          )}

          {/* FULL SCREEN PREVIEW MODE */}
          {viewMode === 'preview' && (
            <div className="w-full h-full flex flex-col bg-[#0c0517] overflow-hidden relative">
              <div className="sticky top-0 z-40 bg-[#120726] text-purple-100 px-4 py-2.5 border-b border-amber-500/30 flex items-center justify-between text-xs shadow-md shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode(typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'split' : 'edit')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-amber-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all border border-amber-300 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al Panel de Edición</span>
                </button>

                <div className="flex items-center gap-2 font-mono text-[11px] text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Vista Previa Completa de Borrador</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-[#0c0517] relative">
                {/* Capa de protección transparente aislada dentro de la vista previa completa */}
                <div
                  className="absolute inset-0 z-10 bg-transparent cursor-default"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
                <SiteContext.Provider value={previewContextValue}>
                  <AnnouncementBar />
                  <Navbar onOpenAdminLogin={() => {}} onOpenAdminPanel={() => {}} />
                  <main className="pt-16 pointer-events-none">
                    <Hero />
                    <ProductCatalog onSelectProduct={() => {}} />
                    <AboutSection />
                    <SocialContact />
                  </main>
                  <Footer onOpenAdminLogin={() => {}} onOpenAdminPanel={() => {}} />
                </SiteContext.Provider>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* PRODUCT CREATE/EDIT MODAL - PRIORIDAD Z-INDEX [250] */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-[250] overflow-y-auto bg-[#040208]/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5"
        >
          <div
            className="bg-[#180b33] text-purple-100 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 border border-amber-400/50 relative my-auto"
          >
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-4">
              <h3 className="font-serif-title font-bold text-lg text-amber-300">
                {editingProduct ? 'Editar Producto / Servicio' : 'Agregar Nuevo Producto / Servicio'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-purple-300 hover:text-amber-300 rounded-full bg-purple-950/80 hover:bg-purple-900 transition-colors border border-amber-500/30 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#0a0414] border border-amber-500/30 text-xs text-purple-200/90 leading-relaxed space-y-1">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>💡 Guía Rápida de Publicación (Pesos Mexicanos MXN)</span>
                </p>
                <p>
                  Todos los precios se registran automáticamente en <strong className="text-amber-200">Pesos Mexicanos ($ MXN)</strong>. Puedes agregar servicios (lecturas, limpias) o productos físicos (velas, lociones, amuletos).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase mb-1">
                  Nombre del Producto o Servicio
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ej. Lectura de Tarot Completa & Canalización"
                  className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white font-medium text-sm focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Categoría</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-amber-300 font-bold text-sm cursor-pointer"
                  >
                    {data.categories.filter((c) => c !== 'Todas').map((cat) => (
                      <option key={cat} value={cat} className="bg-[#180b33] text-amber-300">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Estado de Disponibilidad</label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value as any })}
                    className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-amber-300 font-bold text-sm cursor-pointer"
                  >
                    <option value="disponible" className="bg-[#180b33] text-emerald-400">✓ Disponible (Entrega o cita inmediata)</option>
                    <option value="sobre_pedido" className="bg-[#180b33] text-amber-300">✨ Por Cita (Previa agenda)</option>
                    <option value="agotado" className="bg-[#180b33] text-rose-400">❌ Agotado temporalmente</option>
                  </select>
                </div>
              </div>

              {/* PRICE INPUTS WITH CLEAR MXN BADGES & PREVIEW */}
              <div className="p-4 rounded-2xl bg-[#0a0414] border border-amber-500/30 space-y-3">
                <label className="block text-xs font-bold text-amber-300 uppercase flex items-center justify-between">
                  <span>Precio en Pesos Mexicanos (MXN)</span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/40">🇲🇽 Moneda: MXN</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-purple-200 mb-1">Costo Numérico ($ MXN)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-bold text-amber-300 text-sm">$</span>
                      <input
                        type="number"
                        value={priceNum}
                        onChange={(e) => setPriceNum(e.target.value)}
                        placeholder="450"
                        className="w-full pl-8 pr-14 py-2.5 rounded-xl border border-amber-500/40 bg-[#180b33] text-amber-300 font-bold text-sm focus:ring-2 focus:ring-amber-400/40"
                      />
                      <span className="absolute right-3 font-mono font-bold text-xs text-purple-300/80">MXN</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-purple-200 mb-1">Nota o Aclaración del Precio (Opcional)</label>
                    <input
                      type="text"
                      value={priceNote}
                      onChange={(e) => setPriceNote(e.target.value)}
                      placeholder="Ej: Por Cita / En Línea / Frasco 250ml"
                      className="w-full p-2.5 rounded-xl border border-amber-500/40 bg-[#180b33] text-white text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#180b33] border border-amber-500/20 text-xs flex items-center gap-2">
                  <span className="text-purple-300 font-medium">Así se verá el precio en la página:</span>
                  <strong className="text-amber-300 font-bold font-mono">$ {priceNum || '0'} MXN{priceNote ? ` (${priceNote})` : ''}</strong>
                </div>
              </div>

              {/* DIMENSIONS / DURACIÓN */}
              <div className="p-4 rounded-2xl bg-[#0a0414] border border-amber-500/20 space-y-2">
                <label className="block text-xs font-bold text-amber-300 uppercase flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-amber-400" />
                  <span>Duración del Servicio ó Tamaño del Producto</span>
                </label>

                <input
                  type="text"
                  value={productForm.dimensions}
                  onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                  placeholder="Ej. Sesión de 45 a 60 min  ó  Alt. 20 cm × Diám. 7 cm"
                  className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#180b33] text-white text-sm font-medium"
                />
                <p className="text-[11px] text-purple-300/80">
                  • Para <strong>Servicios</strong> (Lecturas, Limpias): escribe la duración (ej: <em>Sesión de 45 minutos</em>). <br />
                  • Para <strong>Productos</strong> (Velas, Lociones): escribe las dimensiones (ej: <em>Frasco de cristal 250 ml</em>).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Descripción Completa</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Explique en qué consiste el trabajo espiritual o las propiedades del producto..."
                  className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Materiales y Elementos Incluidos</label>
                <input
                  type="text"
                  value={productForm.materials}
                  onChange={(e) => setProductForm({ ...productForm, materials: e.target.value })}
                  placeholder="Ej. Cartas de Tarot Marsella, Velón de Luz, Esfera de Cristal, Copal..."
                  className="w-full p-3 rounded-xl border border-amber-500/40 bg-[#0a0414] text-white text-sm font-medium"
                />
              </div>

              {/* IMAGES MANAGER */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-amber-300 uppercase">Fotografías del Elemento</label>
                <div className="flex flex-wrap gap-3 items-center">
                  {productForm.images.map((img, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden relative group border border-amber-500/30 shrink-0">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setProductForm((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx),
                          }));
                        }}
                        className="absolute top-1 right-1 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg opacity-90 hover:opacity-100 transition-all shadow-md z-10 cursor-pointer active:scale-90 flex items-center justify-center"
                        aria-label="Quitar foto"
                        title="Quitar foto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-amber-400/40 hover:border-amber-400 flex flex-col items-center justify-center cursor-pointer transition-colors bg-purple-950/60">
                    <Upload className="w-5 h-5 text-amber-400 mb-1" />
                    <span className="text-[10px] font-bold text-amber-300">Subir</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* DESTACAR PRODUCTO CHECKBOX */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0a0414] border border-amber-500/30">
                <input
                  type="checkbox"
                  id="featuredProductCheckbox"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                />
                <label htmlFor="featuredProductCheckbox" className="text-xs font-bold text-amber-300 cursor-pointer select-none">
                  ⭐ Destacar este producto/servicio en la página principal
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-purple-900/60">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-purple-700 text-purple-200 text-xs font-bold hover:bg-purple-900/60 cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 text-xs font-bold shadow-lg border border-amber-300 cursor-pointer transition-all active:scale-95"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal Dialog */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-[#07020f]/85 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#180b33] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-400/40 text-center space-y-5"
            >
              <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border ${
                confirmModal.isDanger ? 'bg-rose-950 text-rose-300 border-rose-500/40' : 'bg-purple-900 text-amber-300 border-amber-400/40'
              }`}>
                {confirmModal.isDanger ? <Trash2 className="w-7 h-7" /> : <Save className="w-7 h-7" />}
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-title font-bold text-lg sm:text-xl text-amber-300 leading-tight">
                  {confirmModal.title}
                </h3>
                <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-3 px-4 rounded-xl border border-purple-800 text-purple-200 font-bold text-xs hover:bg-purple-900/60 transition-colors"
                >
                  {confirmModal.cancelText || 'Cancelar'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const fn = confirmModal.onConfirm;
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                    setTimeout(() => fn(), 50);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white shadow-md transition-all cursor-pointer ${
                    confirmModal.isDanger
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950'
                  }`}
                >
                  {confirmModal.confirmText || 'Sí, confirmar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
