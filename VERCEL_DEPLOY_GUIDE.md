# 🚀 Guía Paso a Paso para Publicar tu Sitio Gratis en Vercel

Esta guía te mostrará cómo publicar tu página web de **Cajitas para Levantamiento de Cruz** en internet de forma **100% gratuita**, con certificado SSL (sitio seguro `https://`), enlace personalizado y excelente velocidad en celulares y computadoras.

---

## ⚡ Opción A: Publicar directamente con el comando Vercel (Recomendado - 2 minutos)

Si tienes Node.js en tu computadora, puedes publicar con 2 simples comandos desde la terminal:

1. **Abre la terminal en la carpeta del proyecto**:
   ```bash
   cd C:\Users\danie\.gemini\antigravity\scratch\cajitas-levantamiento-cruz
   ```

2. **Ejecuta el instalador de Vercel**:
   ```bash
   npx vercel
   ```

3. **Responde las preguntas en pantalla**:
   - `Set up and deploy?` → Escribe `y` y presiona Enter.
   - Te pedirá iniciar sesión o crear una cuenta gratuita en Vercel (con tu correo o GitHub).
   - En `Which scope?` → Selecciona tu usuario.
   - En `Link to existing project?` → Escribe `N`.
   - En `What's your project's name?` → Presiona Enter o pon `cajitas-levantamiento-cruz`.
   - En `In which directory is your code located?` → Presiona Enter (`./`).
   - Vercel detectará que es un proyecto **Vite**. Presiona `y` para confirmar las configuraciones por defecto.

4. **¡Listo!** En unos segundos Vercel te entregará el enlace público (Ejemplo: `https://cajitas-levantamiento-cruz.vercel.app`).

---

## 🐙 Opción B: Publicar conectando a GitHub (Para actualizaciones automáticas)

1. **Crea un repositorio en GitHub**:
   - Ve a [GitHub.com](https://github.com) e inicia sesión.
   - Haz clic en **New repository** y nombralo `cajitas-levantamiento-cruz`.

2. **Sube tu código**:
   ```bash
   git init
   git add .
   git commit -m "Primera versión del sitio web de cajitas"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/cajitas-levantamiento-cruz.git
   git push -u origin main
   ```

3. **Conecta Vercel a tu GitHub**:
   - Entra a [vercel.com](https://vercel.com) e inicia sesión.
   - Haz clic en **"Add New..."** → **"Project"**.
   - Selecciona tu repositorio `cajitas-levantamiento-cruz` de la lista de GitHub.
   - Haz clic en **"Deploy"**.

---

## 🔐 ¿Cómo modificar la página una vez publicada?

- Puedes ingresar a tu página web en cualquier momento.
- En la esquina superior derecha o en el pie de página haz clic en **"Admin"**.
- La contraseña inicial por defecto es: `admin123`.
- Podrás agregar cajitas nuevas, cambiar fotos, editar números de WhatsApp, enlaces a Facebook/Instagram y cambiar la contraseña por una propia.
- Todos los cambios se guardan de inmediato en tu navegador.
