import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../server-data.json');

export const INITIAL_SITE_DATA = {
  adminPinHash: "admin123",
  adminEmail: "michisnsqk@gmail.com",
  siteConfig: {
    businessName: "Maestra Rosy - Esoterismo & Lecturas de Tarot",
    tagline: "Guiado Espiritual, Lecturas de Tarot, Limpias Energéticas, Velas Ritualizadas y Lociones Esotéricas",
    heroBadge: "✨ Maestra Rosy • Canalizadora & Guía Espiritual",
    heroTitle: "Guiado Espiritual, Lecturas de Tarot y Limpias Energéticas",
    heroSubtitle: "Encuentra respuesta, claridad y paz espiritual. Sanación de aura, lecturas de tarot presenciales o en línea, velones preparados para el amor y la prosperidad, y lociones esotéricas curadas.",
    heroImage: "/images/hero.jpg",
    heroCtaButton: "Ver Catálogo Esotérico",
    heroWhatsappCta: "Agendar Cita por WhatsApp",
    heroFeature1Title: "Tarot Certero",
    heroFeature1Subtitle: "Presencial & En línea",
    heroFeature2Title: "Limpias & Sanación",
    heroFeature2Subtitle: "Aura y Energías",
    heroFeature3Title: "Productos Curados",
    heroFeature3Subtitle: "Velas y Lociones",
    catalogTitle: "Catálogo de Servicios & Productos Esotéricos",
    catalogSubtitle: "Trabajos de luz, elementos purificados y velaciones ritualizadas por la Maestra Rosy",
    aboutBadge: "✨ Don Espiritual & Devoción",
    aboutTitle: "Trayectoria Espiritual y Sanación Energética",
    aboutText: "Con años de experiencia en las artes esotéricas y guiado espiritual, la Maestra Rosy ayuda a desatar nudos energéticos, atraer la prosperidad, proteger el hogar y traer armonía a las parejas.",
    traditionText: "Cada vela es cargada y consagrada individualmente en altar con aceites esenciales, hierbas sagradas y oraciones de luz para garantizar la efectividad del trabajo espiritual.",
    aboutImage: "/images/hero.jpg",
    announcementBanner: "✨ Santuario Espiritual Maestra Rosy • Consultas de Tarot presenciales y a distancia por WhatsApp",
    footerText: "Santuario de Sanación y Guiado Espiritual. Lecturas de Tarot, Limpias y Productos Esotéricos."
  },
  socialConfig: {
    whatsappNumber: "5215551234567",
    whatsappMessage: "Hola Maestra Rosy, vi su sitio web de esoterismo y me gustaría agendar una lectura de tarot o consultar por un servicio.",
    phone: "+52 (55) 5123 4567",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    tiktokUrl: "https://tiktok.com",
    locationAddress: "Consultorio Espiritual, Ciudad de México / Consultas a Distancia",
    workingHours: "Lunes a Sábado: 9:00 AM - 9:00 PM | Atendemos mensajes de WhatsApp"
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
      createdAt: "2026-08-25T00:00:00.000Z",
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
      createdAt: "2026-08-25T00:00:00.000Z",
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
      createdAt: "2026-08-25T00:00:00.000Z",
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
      createdAt: "2026-08-25T00:00:00.000Z",
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
      createdAt: "2026-08-25T00:00:00.000Z",
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
      createdAt: "2026-08-25T00:00:00.000Z",
      images: [
        "/images/kit_purificacion.jpg"
      ]
    }
  ]
};

// Mongoose Schema for MongoDB Atlas
const SiteSchema = new mongoose.Schema({
  key: { type: String, default: 'site_data', unique: true },
  data: { type: Object, required: true },
}, { timestamps: true });

const SiteModelMongo = mongoose.models.SiteData || mongoose.model('SiteData', SiteSchema);

let isMongoConnected = false;
let cachedMongoData = null;

export async function initMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return false;

  try {
    await mongoose.connect(uri);
    isMongoConnected = true;
    console.log('🍃 Conectado exitosamente a la base de datos en la nube (MongoDB Atlas)');
    
    // Check existing document in MongoDB Atlas
    const existing = await SiteModelMongo.findOne({ key: 'site_data' });
    const localData = readDataFromFile();

    if (!existing || !existing.data || !existing.data.products || existing.data.products.length === 0) {
      cachedMongoData = localData;
      await SiteModelMongo.findOneAndUpdate(
        { key: 'site_data' },
        { data: localData },
        { upsert: true, new: true }
      );
      console.log('🌱 Datos iniciales con productos cargados exitosamente en MongoDB Atlas');
    } else {
      cachedMongoData = existing.data;
      // Sync disk cache so local file matches live MongoDB Atlas data
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(cachedMongoData, null, 2), 'utf-8');
      } catch (syncErr) {
        console.error('Error sincronizando server-data.json desde MongoDB Atlas:', syncErr);
      }
      console.log(`📦 Se cargaron ${cachedMongoData.products.length} productos desde MongoDB Atlas`);
    }
    return true;
  } catch (err) {
    console.error('⚠️ No se pudo conectar a MongoDB Atlas, usando almacenamiento local server-data.json:', err.message);
    isMongoConnected = false;
    return false;
  }
}

function readDataFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.products && parsed.products.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading server-data.json:', err);
  }
  return INITIAL_SITE_DATA;
}

export function readData() {
  if (isMongoConnected && cachedMongoData && cachedMongoData.products && cachedMongoData.products.length > 0) {
    return cachedMongoData;
  }
  return readDataFromFile();
}

export function writeData(data) {
  cachedMongoData = data;

  // Always update local file fallback
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing server-data.json:', err);
  }

  // If MongoDB Atlas is connected, async update MongoDB document
  if (isMongoConnected) {
    SiteModelMongo.findOneAndUpdate(
      { key: 'site_data' },
      { data },
      { upsert: true, new: true }
    ).catch((err) => console.error('Error updating MongoDB Atlas:', err));
  }
}
