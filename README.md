# Leash to Legacy - Sitio Web

## 📁 Estructura del Proyecto
- `index.html` - Página principal
- `blog.html` - Blog
- `boarding-service.html` - Servicio de boarding
- `puppy-concierge.html` - Puppy concierge
- `training-services.html` - Videos de entrenamiento
- `panel.html` - Panel de administración
- `login.html` - Página de login
- `css/` - Todos los estilos
- `js/` - Todos los scripts
- `IMG/` - Todas las imágenes
- `netlify/functions/` - Funciones serverless
- `site-data.json` - Datos editables del sitio

## 🚀 Instalación Rápida
1. Sube todos los archivos a Netlify
2. Configura variables de entorno:
   - `GITHUB_TOKEN` - Token de GitHub con permisos `repo`
   - `RESEND_API_KEY` - API key de Resend para emails
3. Verifica tu dominio en Resend
4. Actualiza `firebase-config` en `js/firebase-auth.js`

## 🔧 Configuración Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un proyecto
3. Habilita Authentication con Email/Password
4. Copia la configuración a `js/firebase-auth.js`

## 📧 Configuración Email
1. Crea cuenta en [Resend](https://resend.com)
2. Verifica tu dominio `leashtolegacy.org`
3. Añade `RESEND_API_KEY` en Netlify
4. Actualiza el remitente en `netlify/functions/send-contact-email.js`

## 🔑 Credenciales por defecto
- Usuario: `admin`
- Contraseña: `leash2025`
*(Cambia después del primer login)*

## ⚡ Optimizaciones implementadas
- ✅ CSS y JS minificados
- ✅ Lazy loading en imágenes
- ✅ Preconnect para fuentes
- ✅ Firebase Authentication
- ✅ Estructura ordenada de carpetas