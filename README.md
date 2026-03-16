# DroneVision - Aplicación Full Stack 🚁

## 📋 Descripción General

**DroneVision** es una aplicación web completa para entusiastas de drones que permite gestionar videos, crear playlists, escribir reseñas.La aplicación combina un frontend moderno en React con un backend robusto en Node.js.

### 🎯 Funcionalidades Principales

- 🔐 **Autenticación completa** - Registro, login y gestión de perfiles
- 🎬 **Gestión de videos** - Búsqueda, guardado y organización de videos de drones
- 📝 **Sistema de reseñas** - Reseñas públicas y privadas con calificaciones
- 📚 **Playlists personalizadas** - Organización de videos en colecciones
- 📊 **Dashboard con estadísticas** - Métricas de usuarios y contenido
- 📱 **Diseño responsivo** - Compatible con dispositivos móviles

---

## 🏗️ Arquitectura del Sistema

### **Frontend (React + Vite)**

```
frontend/
├── src/
│   ├── components/           # Componentes React organizados por funcionalidad
│   │   ├── App.jsx          # Componente principal y enrutamiento
│   │   ├── Header/          # Navegación y autenticación
│   │   ├── Main/            # Página principal con videos
│   │   ├── Dashboard/       # Estadísticas y métricas
│   │   ├── Reviews/         # Sistema de reseñas
│   │   └── PlaylistModal/   # Modal para gestión de playlists
│   ├── hooks/               # Custom hooks reutilizables
│   ├── utils/               # APIs y utilidades
│   │   ├── api.js          # Cliente API centralizado
│   │   ├── auth.js         # Funciones de autenticación
│   │   └── ThirdPartyApi.js # Integración con APIs externas
│   └── context/             # Context API para estado global
└── package.json
```

### **Backend (Node.js + Express)**

```
backend/
├── controllers/              # Lógica de negocio
│   ├── usersController.js   # Gestión de usuarios
│   ├── videosController.js  # Gestión de videos
│   ├── reviewController.js  # Sistema de reseñas
│   ├── playlistController.js # Gestión de playlists
│   └── dashboardController.js # Estadísticas
├── models/                  # Esquemas de MongoDB
│   ├── usersModel.js       # Modelo de usuario
│   ├── videosModel.js      # Modelo de video
│   ├── reviewModel.js      # Modelo de reseña
│   └── playlistModel.js    # Modelo de playlist
├── routes/                  # Definición de rutas API
├── middleware/              # Middlewares personalizados
│   ├── auth.js             # Autenticación JWT
│   ├── errorHandler.js     # Manejo de errores
│   └── validation.js       # Validación de datos
├── services/                # Servicios externos
├── utils/                   # Utilidades y helpers
└── app.js                  # Configuración del servidor
```

---

## 🔄 Flujo de Funcionamiento

### **1. Autenticación y Autorización**

```mermaid
Usuario → LoginForm → Backend(/signin) → JWT Token → LocalStorage → Headers automáticos
```

- El usuario ingresa credenciales en el frontend
- Se validan contra la base de datos MongoDB
- Se genera un JWT token con expiración de 7 días
- El token se almacena en localStorage y se incluye automáticamente en requests

### **2. Gestión de Videos**

```mermaid
Búsqueda → YouTube API → Resultados → Selección → Backend(/videos) → MongoDB → Playlist
```

- Búsqueda integrada con YouTube Data API v3
- Selección y guardado de videos en la base de datos
- Organización en playlists personalizadas
- Sistema de "me gusta" para videos favoritos

### **3. Sistema de Reseñas**

```mermaid
Usuario → Escribe Reseña → Validación → MongoDB → Vista Pública/Privada
```

- Reseñas con calificación de 1-5 estrellas
- Modo público (visible para todos) y privado (solo usuario)
- Validación de datos y prevención de duplicados
- Agregación de estadísticas automática

### **4. Dashboard y Estadísticas**

```mermaid
Request → Agregaciones MongoDB → Cálculos → Visualización
```

- Estadísticas en tiempo real usando agregaciones de MongoDB
- Métricas de usuarios, videos y reseñas

---

## 🛠️ Stack Tecnológico

### **Frontend**

- **React 18.3.1** - Biblioteca principal con Hooks
- **Vite** - Build tool ultrarrápido
- **React Router DOM** - Enrutamiento SPA
- **React Toastify** - Notificaciones elegantes

### **Backend**

- **Node.js** - Runtime de JavaScript
- **Express.js 4.18** - Framework web minimalista
- **MongoDB + Mongoose** - Base de datos NoSQL con ODM
- **JWT** - Autenticación stateless
- **bcrypt** - Hashing seguro de contraseñas
- **Celebrate + Joi** - Validación robusta de datos

### **Seguridad y DevOps**

- **Helmet** - Headers de seguridad HTTP
- **CORS** - Configuración de dominios cruzados
- **Rate Limiting** - Protección contra spam
- **ESLint** - Linting de código
- **Nodemon** - Desarrollo con hot reload

---

## 🚀 Instalación y Configuración

### **Prerrequisitos**

- Node.js v18+
- MongoDB (local o Atlas)
- Clave de YouTube Data API v3

### **Instalación Manual**

**Backend:**

```bash
cd backend
npm install
cp .env.example .env  # Configurar variables
npm run dev          # Puerto 8080
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev         # Puerto 5173
```

### **Variables de Entorno**

referencia a las variables de entorno:
.env.example

---

## 🔗 API Endpoints

### **Autenticación**

- `POST /signup` - Registro de usuario
- `POST /signin` - Inicio de sesión

### **Usuarios (Protegidas)**

- `GET /users/me` - Perfil actual
- `PATCH /users/me` - Actualizar perfil
- `PATCH /users/me/avatar` - Cambiar avatar

### **Videos**

- `GET /videos/search?q=drones` - Buscar en YouTube
- `POST /videos/add` - Guardar video seleccionado
- `DELETE /videos/:id` - Eliminar video

### **Reseñas**

- `GET /reviews` - Reseñas del usuario
- `GET /reviews/public` - Reseñas públicas
- `POST /reviews` - Crear reseña
- `PUT /reviews/:id` - Actualizar reseña

### **Playlists**

- `GET /playlists` - Obtener playlists
- `POST /playlists` - Crear playlist
- `POST /playlists/:id/add` - Añadir video

### **Dashboard**

- `GET /dashboard/users/stats` - Estadísticas de usuarios
- `GET /dashboard/videos/stats` - Estadísticas de videos

---

## 📊 Características Técnicas Avanzadas

### **1. Autenticación Robusta**

- JWT con expiración configurable
- Middleware de autenticación reutilizable
- Manejo de tokens expirados
- Protección de rutas sensibles

### **2. Validación Comprensiva**

- Schemas Joi para validación de entrada
- Sanitización automática de datos
- Mensajes de error descriptivos
- Validación tanto en frontend como backend

### **3. Gestión de Estado**

- Context API para estado global
- Custom hooks para lógica reutilizable
- Estado local optimizado con useState/useEffect
- Sincronización automática con backend

### **4. Performance**

- Lazy loading de componentes
- Debouncing en búsquedas
- Paginación en listados
- Compresión de respuestas HTTP

### **5. Experiencia de Usuario**

- Loading states en todas las operaciones
- Error boundaries para fallos graceful
- Toasts informativos
- Responsive design mobile-first

---

## 🔒 Seguridad Implementada

- **Autenticación**: JWT tokens con expiración
- **Autorización**: Middleware de verificación de permisos
- **Validación**: Sanitización de entrada en ambos extremos
- **Headers**: Helmet para headers de seguridad HTTP
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **CORS**: Configuración restrictiva de dominios
- **Hashing**: bcrypt para contraseñas con salt automático

---

## 📈 Métricas y Monitoreo

- **Logs estructurados** con Winston
- **Error tracking** centralizado
- **Performance metrics** en dashboard
- **Health checks** automáticos
- **Monitoring de API** con tiempos de respuesta

---

## 🚀 Comandos de Desarrollo

```bash
# Backend
npm run dev      # Desarrollo con nodemon
npm run lint     # ESLint con corrección automática
npm start        # Producción

# Frontend
npm run dev      # Vite dev server
npm run build    # Build optimizado para producción
npm run preview  # Preview del build
npm run lint     # ESLint para React
```

---

## 🎯 Roadmap Futuro

### **Fase 1 - Funcionalidades Core** ✅

- [x] Autenticación completa
- [x] CRUD de videos y playlists
- [x] Sistema de reseñas
- [x] Dashboard básico

### **Fase 2 - Mejoras UX**

- [ ] Notificaciones push
- [ ] Compartir playlists
- [ ] Comentarios en videos
- [ ] Sistema de seguimiento de usuarios

### **Fase 3 - Analytics Avanzado**

- [ ] Métricas avanzadas de engagement
- [ ] Reportes exportables
- [ ] Predicciones meteorológicas
- [ ] Integración con mapas

### **Fase 4 - Escalabilidad**

- [ ] Microservicios
- [ ] Cache con Redis
- [ ] CDN para videos
- [ ] Tests automatizados

---

## 👨‍💻 Desarrollado por

**Eduardo Cruz** - Full Stack Developer

- 📧 Email: [eduardo.cruz.c@icloud.com)
- 🌐 Portfolio: [eduardocruz.dev](https://eduardocrco.github.io)
- 💼 LinkedIn: [linkedin.com/in/eduardocruz-dev](https://www.linkedin.com/in/eduardocruzc)

---

_DroneVision - Conectando entusiastas de drones con el cielo 🌤️✈️_

### \*\*Instalación Manual\*\*

**Backend:**

```bash
cd backend
npm install
cp .env.example .env  # Configurar
variables
npm run dev          # Puerto 8080
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev         # Puerto 5173
```

### **Variables de Entorno**

referencia a las variables de entorno:
.env.example

---

## 🔗 API Endpoints

### **Autenticación**

- `POST /signup` - Registro de usuario
- `POST /s
ignin` - Inicio de sesión

### **Usuarios (Protegidas)**

- `GET /users/me` - Perfil actual
- `PATCH /users/me` - Actualizar perfil
- `PATCH /users/me/ava
tar` - Cambiar avatar

### **Videos**

- `GET /videos/search?q=drones` - Buscar en YouTube
- `POST /videos/add` - Guardar video seleccionado
- `DELETE /videos/:id` - Elimin
  ar video

### **Reseñas**

- `GET /reviews` - Reseñas del usuario
- `GET /reviews/public` - Reseñas públicas
- `POST /reviews` - Crear
  reseña
- `PUT /reviews/:id` - Actualizar reseña

### **Playlists**

- `GET /playlists` - Obtener playlists
- `POST /playlists` - Crear playlist
- `POST /playlists/:id/add` - Añadir video

### **Dashboard**

- `GET /dashboard/users/stats` - Estadísticas de usuarios
- `GET /dashboard/videos/stats` - Estadísticas de videos

---

## 📊 Características Técnic

as Avanzadas

### **1. Autenticación Robusta**

- JWT con expiración configurable
- Middleware de autenticación reutilizable
- Manejo de tokens expirados
- Protección de rutas se
  nsibles

### **2. Validación Comprensiva**

- Schemas Joi para validación de entrada
- Sanitización automática de datos
- Mensajes de error descriptivos
- Validación tanto en fronte
  nd como backend

### **3. Gestión de Estado**

- Context API para estado global
- Custom hooks para lógica reutilizable
- Estado local optimizad
  o con useState/useEffect
- Sincronización automática con backend

### **4. Performance**

- Lazy loading de componentes
- Debouncing en búsquedas
- Paginación en listados
- Compresión de respuestas HTTP

### **5. Experiencia de Usuario**

- Loading states en todas las operaciones
- Error boundaries para fallos graceful
- Toasts informativos
- Responsive design mobile-first

---

## 🔒 Seguridad Implementada

- **Autenticación**: JWT tokens con expiración
- **Autorización**: Middleware de verificación de permisos
- **Validación**: Sanitización de entrada en ambos extremos
- **Headers**: Helmet para headers de seguridad HTTP
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **CORS**: Configuración restrictiva de dominios
- **Hashing**: bcrypt para contraseñas con salt automático

---

## 📈 Métricas y Monitoreo

- **Logs estructurados** con Winston
- **Error tracking** centralizado
- **Performance metrics** en dashboard **Health checks** automáticos
- **Monitoring de API** con tiempos de respuesta

---

## 🚀 Comandos de Desarrollo

```bash
# Backend
npm run dev      # Desarrollo con nodemon
npm run lint     # ESLint con corrección automát
ica
npm start        # Producción

# Frontend
npm run d      # Vite dev server
npm run build    # Build optimizado para producción

npm run preview  # Preview del build
npm run lint     # ESLint para React
```

---

## 🎯 Roadmap Futuro

### **Fase 1 - Funcionalidades Core** ✅

- x] Autenticación completa
- [x] CRUD de videos y playlists
- [x] Sistema de reseñas
- [x] Dashboard básico

### **Fase 2 - Mejoras UX**

- [ ] Notificaci
      ones push
- [ ] Compartir playlists
- [ ]omentarios en videos
- [ ] Sistema de seguimiento de usuarios

### **Fase 3 - Analytics Avanzado**

- [ ] Métricas avanzadas de engagement
- [ ] Reportes exportables
- [ ] Predicciones meteorológicas
- [ ] Integración con mapas

### **Fase 4 - Escalabilidad**

- [ ] Microservicios
- [ ] Cache con Redis
- [ ] CDN para videos
- [ ] Test\_ automatizados

---

## 👨‍💻 Desarrollado por

**Eduardo C_uz** - Desarrollador Web Full Stack

- 📧 Email: [eduardo.cruz.c@icloud.com]
- 💼 LinkedIn: [linkedin.com/in/eduardocruzc]

---

_DroneVision - Conectando entusiastas de drones con el cielo 🌤️✈️_

### Direccion de la pagina:

https://final-backend-page.onrender.com/
