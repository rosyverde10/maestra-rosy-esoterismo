import { httpServer } from './server/app.js';

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Servidor Socket.IO + Autenticación 2FA por Correo (Arquitectura MVC) ejecutándose en el puerto ${PORT}`);
});
