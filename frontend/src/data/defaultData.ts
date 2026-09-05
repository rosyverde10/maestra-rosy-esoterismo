import type { SiteData } from '../types';

export const INITIAL_SITE_DATA: SiteData = {
  adminPinHash: "admin123",
  adminEmail: "rosyverde10@gmail.com",

  siteConfig: {
    businessName: "Maestra Rosy - Esoterismo & Lecturas de Tarot",
    tagline: "Guiado Espiritual, Lecturas de Tarot, Limpias Energéticas, Velas Ritualizadas y Lociones Esotéricas",
    logoImage: undefined,
    heroBadge: "Maestra Rosy • Canalizadora & Guía Espiritual",
    heroTitle: "Guiado Espiritual, Lecturas de Tarot y Limpias Energéticas",
    heroSubtitle: "Encuentra respuesta, claridad y paz espiritual. Sanación de aura, lecturas de tarot presenciales o en línea, velones preparados para el amor y la prosperidad, y lociones esotéricas curadas.",
    heroImage: "/images/hero.jpg",
    heroCtaButton: "Ver Catálogo Esotérico",
    heroWhatsappCta: "Agendar Cita por WhatsApp",
    heroFeature1Title: "+15 Años",
    heroFeature1Subtitle: "Guiado Espiritual",
    heroFeature2Title: "100%",
    heroFeature2Subtitle: "Atención Confidencial",
    heroFeature3Title: "Presencial",
    heroFeature3Subtitle: "Y Consultas Virtuales",
    heroFeature4Title: "24/7",
    heroFeature4Subtitle: "Atención por WhatsApp",
    catalogTitle: "Catálogo de Servicios & Productos Esotéricos",
    catalogSubtitle: "Trabajos de luz, elementos purificados y velaciones ritualizadas por la Maestra Rosy",
    aboutBadge: "✨ Don Espiritual & Devoción",
    aboutTitle: "Trayectoria Espiritual y Sanación Energética",
    aboutText: "Con años de experiencia en las artes esotéricas y guiado espiritual, la Maestra Rosy ayuda a desatar nudos energéticos, atraer la prosperidad, proteger el hogar y traer armonía a las parejas.",
    traditionText: "Cada vela es cargada y consagrada individualmente en altar con aceites esenciales, hierbas sagradas y oraciones de luz para garantizar la efectividad del trabajo espiritual.",
    aboutImage: "/images/hero.jpg",
    announcementBanner: "Santuario Espiritual Maestra Rosy • Consultas de Tarot presenciales y a distancia por WhatsApp",
    footerText: "Santuario de Sanación y Guiado Espiritual. Lecturas de Tarot, Limpias y Productos Esotéricos."
  },
  socialConfig: {
    whatsappNumber: "5215551234567",
    whatsappMessage: "Hola Maestra Rosy, vi su sitio web de esoterismo y me gustaría agendar una lectura de tarot o consultar por un servicio.",
    phone: "+52 (55) 5123 4567",
    locationAddress: "Consultorio Espiritual, Ciudad de México / Consultas a Distancia",
    workingHours: "Lunes a Sábado: 9:00 AM - 9:00 PM | Atendemos mensajes de WhatsApp",
    googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.6616089851174!2d-99.16781268509355!3d19.427024986887556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5bd15a7%3A0x6a6d36e2f1e2f1e2!2sAngel%20de%20la%20Independencia!5e0!3m2!1ses!2smx!4v1620000000000!5m2!1ses!2smx"
  },
  categories: [
    "Todas",
    "Lecturas de Tarot",
    "Limpias Espirituales",
    "Velas Preparadas",
    "Lociones Esotéricas",
    "Amuletos & Cuarzos",
    "Trabajos Especiales"
  ],
  products: [
    {
      id: "prod-1",
      name: "Lectura de Tarot Completa & Canalización Espiritual",
      category: "Lecturas de Tarot",
      priceText: "$ 450 MXN (Por Cita / En Línea)",
      description: "Lectura integral del Tarot con revelación de pasado, presente y futuro. Respuestas claras sobre el amor, trabajo, salud y finanzas con guía espiritual personalizada.",
      materials: "Cartas de Tarot Marsella/Rider, Velón de Luz, Esfera de Cristal",
      dimensions: "Sesión de 45 a 60 minutos",
      status: "disponible",
      featured: true,
      createdAt: new Date().toISOString(),
      images: [
        "/images/lectura_tarot.jpg",
        "/images/hero.jpg"
      ]
    },
    {
      id: "prod-2",
      name: "Limpia Espiritual de Aura y Desbloqueo Energético",
      category: "Limpias Espirituales",
      priceText: "$ 600 MXN (Presencial u Holística)",
      description: "Purificación profunda para eliminar energías pesadas, envidias y mal de ojo. Utiliza hierbas curadas, sahumerio de copal y salvia con bálsamos consagrados.",
      materials: "Salvia blanca, Copal, Bálsamos esotéricos, Cuarzos",
      dimensions: "Sesión individual personalizada",
      status: "disponible",
      featured: true,
      createdAt: new Date().toISOString(),
      images: [
        "/images/limpia_espiritual.jpg"
      ]
    },
    {
      id: "prod-3",
      name: "Velón Preparado Abre Caminos y Ven a Mí",
      category: "Velas Preparadas",
      priceText: "$ 350 MXN (Consagrado)",
      description: "Velón ritualizado en altar con pan de oro, aceites de atracciones y hierbas aromáticas para destrancar la fortuna, el amor y la prosperidad en el hogar.",
      materials: "Cera natural, Aceite de unción, Hierbas rituales, Polvo de oro",
      dimensions: "Alt. 20 cm × Diám. 7 cm",
      status: "disponible",
      featured: true,
      createdAt: new Date().toISOString(),
      images: [
        "/images/velas_preparadas.jpg"
      ]
    },
    {
      id: "prod-4",
      name: "Loción Esotérica Destrancadera & Abundancia Oro",
      category: "Lociones Esotéricas",
      priceText: "$ 380 MXN (Frasco Artesanal)",
      description: "Loción mística formulada con esencias de sándalo, jazmín, mirra y virutas doradas. Ideal para rociar en casa, negocio o uso personal antes de eventos importantes.",
      materials: "Esencias místicas naturales, Alcohol ritual, Viruta de oro",
      dimensions: "Frasco de cristal 250 ml",
      status: "disponible",
      featured: true,
      createdAt: new Date().toISOString(),
      images: [
        "/images/locion_esoterica.jpg"
      ]
    },
    {
      id: "prod-5",
      name: "Amuleto de Turmalina Negra Protegida & Cuarzo Rosa",
      category: "Amuletos & Cuarzos",
      priceText: "$ 420 MXN (Curado & Ritualizado)",
      description: "Dije artesanal de turmalina negra envuelto en alambre plateado. Absorbe ondas electromagnéticas negativas, protege contra la envidia y equilibra el chakra corazón.",
      materials: "Turmalina negra natural, Cuarzo rosa, Cadena de plata",
      dimensions: "Piedra natural aprox. 3.5 cm",
      status: "disponible",
      featured: true,
      createdAt: new Date().toISOString(),
      images: [
        "/images/amuleto_turmalina.jpg"
      ]
    },
    {
      id: "prod-6",
      name: "Kit Ritual Completo de Purificación, Prosperidad y Amor",
      category: "Trabajos Especiales",
      priceText: "$ 980 MXN (Kit Completo)",
      description: "Kit sagrado que incluye 3 velones preparados, loción destrancadera, sales de baño de purificación, sahumador de resinas místicas y pergamino de peticiones consagrado.",
      materials: "Caja de madera grabada, Velones, Loción 100ml, Sales de baño, Sahumerio",
      dimensions: "Caja 30 cm × 20 cm × 12 cm",
      status: "disponible",
      featured: true,
      createdAt: new Date().toISOString(),
      images: [
        "/images/kit_purificacion.jpg"
      ]
    }
  ]
};
