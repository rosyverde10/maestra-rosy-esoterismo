import { createServer } from 'vite';

process.on('uncaughtException', (err) => {
  if (err.code === 'ECONNRESET' || (err.message && err.message.includes('ECONNRESET'))) {
    // Ignorar cierres abruptos de sockets TCP en Node.js
    return;
  }
  console.error('Excepción no controlada:', err);
});

process.on('unhandledRejection', (reason) => {
  console.warn('Promesa no controlada ignorada:', reason);
});

async function start() {
  const server = await createServer();
  await server.listen();
  server.printUrls();
}

start().catch((err) => {
  console.error('Error al iniciar el servidor Vite:', err);
});
