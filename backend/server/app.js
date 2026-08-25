import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import { SiteModel } from './models/siteModel.js';
import { initMongoDB } from './config/db.js';

// Initialize MongoDB Atlas connection if MONGODB_URI is provided
initMongoDB();

const app = express();

// HTTP Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(cors());
app.use(express.json({ limit: '15mb' }));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/site', siteRoutes);

// Production Static Serving
const distPath = path.join(__dirname, '../../frontend/dist');
const indexPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(indexPath);
  });
}


// Socket.IO Real-time Events
io.on('connection', (socket) => {
  console.log(`⚡ Cliente conectado a Socket.IO: ${socket.id}`);

  socket.emit('site:init', SiteModel.getSiteData());

  socket.on('site:update', (newData) => {
    console.log('🔄 Actualización recibida del admin. Transmitiendo en tiempo real a todos los clientes...');
    const updated = SiteModel.updateSiteData(newData);
    io.emit('site:updated', updated);
  });

  socket.on('site:reset', () => {
    console.log('🔄 Restablecimiento solicitado. Transmitiendo datos iniciales...');
    const reset = SiteModel.resetSiteData();
    io.emit('site:updated', reset);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

export { app, httpServer, io };
