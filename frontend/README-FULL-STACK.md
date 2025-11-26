# Proyecto Final - Full Stack

## 📋 Descripción

Aplicación web full stack desarrollada con React (frontend) y Node.js/Express (backend), con autenticación JWT y base de datos MongoDB.

## 🏗️ Arquitectura

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Autenticación**: JWT (JSON Web Tokens)
- **Base de datos**: MongoDB con Mongoose ODM

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (v18 o superior)
- MongoDB (local o Atlas)
- Git

### Instalación Automática

**En Windows:**

```bash
# Ejecuta el script de inicio automático
./start-full-stack.bat
```

**En Linux/Mac:**

```bash
# Dar permisos al script
chmod +x start-full-stack.sh

# Ejecutar script
./start-full-stack.sh
```

### Instalación Manual

1. **Clonar repositorio:**

   ```bash
   git clone <tu-repositorio>
   cd final
   ```

2. **Configurar Backend:**

   ```bash
   cd backend
   npm install

   # Configurar variables de entorno (opcional)
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Configurar Frontend:**

   ```bash
   cd ..
   npm install
   ```

4. **Iniciar MongoDB:**

   ```bash
   # MongoDB local
   mongod

   # O configurar MongoDB Atlas en backend/.env
   ```

5. **Iniciar Servidores:**

   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd ..
   npm run dev
   ```

## 📡 URLs de la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Base de datos**: MongoDB local o Atlas

## 🔧 Funcionalidades del Backend

### Autenticación

- ✅ Registro de usuarios (`POST /signup`)
- ✅ Inicio de sesión (`POST /signin`)
- ✅ Autenticación con JWT
- ✅ Validación de datos con Joi/Celebrate

### Gestión de Usuarios

- ✅ Obtener perfil actual (`GET /users/me`)
- ✅ Actualizar perfil (`PATCH /users/me`)
- ✅ Actualizar avatar (`PATCH /users/me/avatar`)
- ✅ Listar usuarios (`GET /users`)
- ✅ Desactivar cuenta (`DELETE /users/me`)

### Seguridad

- ✅ Hasheo de contraseñas con bcrypt
- ✅ Rate limiting (máx 100 requests/15min)
- ✅ Headers de seguridad con Helmet
- ✅ CORS configurado
- ✅ Validación y sanitización de datos

## 📁 Estructura del Proyecto

```
final/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── utils/             # Utilidades (API, auth)
│   ├── hooks/             # Custom hooks
│   └── ...
├── backend/               # Backend Node.js
│   ├── controllers/       # Lógica de negocio
│   ├── models/           # Modelos MongoDB
│   ├── routes/           # Rutas de la API
│   ├── middleware/       # Middlewares personalizados
│   └── app.js            # Servidor principal
├── start-full-stack.bat  # Script de inicio (Windows)
├── start-full-stack.sh   # Script de inicio (Linux/Mac)
└── README.md            # Este archivo
```

## 🌐 API Reference

### Endpoints Públicos

#### Registro

```http
POST /signup
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "contraseña123",
  "name": "Nombre Usuario",
  "about": "Descripción"
}
```

#### Login

```http
POST /signin
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

### Endpoints Protegidos

_Requieren: `Authorization: Bearer <token>`_

#### Obtener Usuario Actual

```http
GET /users/me
Authorization: Bearer <token>
```

#### Actualizar Perfil

```http
PATCH /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nuevo nombre",
  "about": "Nueva descripción"
}
```

## 🔐 Conexión Frontend-Backend

El frontend ya está configurado para conectarse con el backend local:

- **API Base URL**: `http://localhost:3001`
- **Archivos configurados**:
  - `src/utils/api.js`
  - `src/utils/auth.js`

## 🛠️ Scripts Disponibles

### Frontend

- `npm run dev` - Desarrollo con Vite
- `npm run build` - Build de producción
- `npm run preview` - Preview del build

### Backend

- `npm start` - Producción
- `npm run dev` - Desarrollo con nodemon

## 🔍 Debugging y Testing

### Probar la API

```bash
cd backend
node test-api.js
```

### Logs del Servidor

Los logs del backend aparecen en la terminal mostrando:

- ✅ Conexión a MongoDB
- 🚀 Puerto del servidor
- 📡 URL de la API
- ⚠️ Errores y warnings

## 🚦 Estados de la Aplicación

### Backend Ready ✅

- Servidor Express corriendo
- MongoDB conectado
- Rutas de usuarios funcionando
- Autenticación JWT implementada

### Frontend Conectado ✅

- URLs actualizadas para backend local
- Formularios de login/registro listos
- Gestión de tokens implementada

## 🔄 Próximos Pasos

1. **Agregar más entidades**:

   - Cards/Videos
   - Playlists
   - Reviews/Comentarios

2. **Mejoras de seguridad**:

   - Refresh tokens
   - Rate limiting por usuario
   - Logs de seguridad

3. **Funcionalidades adicionales**:
   - Upload de archivos
   - Notificaciones
   - Dashboard administrativo

## 🐛 Troubleshooting

### MongoDB no conecta

- Verificar que MongoDB esté corriendo: `mongod`
- Verificar la URI en `backend/.env`
- Para MongoDB Atlas: configurar IP whitelist

### CORS Errors

- Verificar que el frontend corra en puerto 5173
- Backend configurado para permitir localhost:5173

### JWT Errors

- Verificar que `JWT_SECRET` esté configurado
- Token puede haber expirado (7 días)

### Port Already in Use

```bash
# Matar proceso en puerto 3001
npx kill-port 3001

# Matar proceso en puerto 5173
npx kill-port 5173
```

## 👥 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**¡Tu backend está listo para usar! 🎉**

Ejecuta `./start-full-stack.bat` (Windows) o `./start-full-stack.sh` (Linux/Mac) para iniciar todo el stack completo.
