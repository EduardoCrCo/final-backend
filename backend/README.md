# Backend - API del Proyecto Final

## Descripción

Backend desarrollado con Node.js, Express y MongoDB para el proyecto final. Incluye autenticación con JWT y gestión completa de usuarios.

## Características

- ✅ Autenticación con JWT
- ✅ Registro e inicio de sesión de usuarios
- ✅ Gestión de perfiles (actualizar nombre, descripción, avatar)
- ✅ Validación de datos con Celebrate/Joi
- ✅ Seguridad con Helmet y Rate Limiting
- ✅ Hasheo de contraseñas con bcrypt
- ✅ Conexión a MongoDB con Mongoose
- ✅ Manejo de errores centralizado
- ✅ CORS configurado
- ✅ Variables de entorno

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Hasheo de contraseñas
- **Celebrate/Joi** - Validación de datos
- **Helmet** - Seguridad HTTP
- **CORS** - Cross-Origin Resource Sharing

## Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- MongoDB (local o Atlas)

### Pasos de instalación

1. **Instalar dependencias:**

   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno:**

   - Copia el archivo `.env` y configura las variables según tu entorno
   - Asegúrate de cambiar `JWT_SECRET` por una clave segura en producción

3. **Iniciar MongoDB:**

   - Si usas MongoDB local: `mongod`
   - Si usas MongoDB Atlas: configura la URI en `.env`

4. **Iniciar el servidor:**

   ```bash
   # Desarrollo (con nodemon)
   npm run dev

   # Producción
   npm start
   ```

## Estructura del Proyecto

```
backend/
├── controllers/        # Controladores de rutas
│   └── users.js       # Lógica de usuarios
├── middleware/         # Middlewares personalizados
│   ├── auth.js        # Autenticación JWT
│   └── errorHandler.js # Manejo de errores
├── models/            # Modelos de MongoDB
│   └── User.js        # Modelo de usuario
├── routes/            # Definición de rutas
│   ├── auth.js        # Rutas de autenticación
│   └── users.js       # Rutas de usuarios
├── utils/             # Utilidades
├── .env               # Variables de entorno
├── .gitignore         # Archivos ignorados por Git
├── app.js             # Archivo principal del servidor
└── package.json       # Dependencias y scripts
```

## API Reference

### Autenticación

#### Registrar Usuario

```http
POST /signup
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "contraseña123",
  "name": "Nombre Usuario",
  "about": "Descripción del usuario"
}
```

#### Iniciar Sesión

```http
POST /signin
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

### Usuarios (Rutas Protegidas)

_Requieren header: `Authorization: Bearer <token>`_

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

#### Actualizar Avatar

```http
PATCH /users/me/avatar
Authorization: Bearer <token>
Content-Type: application/json

{
  "avatar": "https://ejemplo.com/avatar.jpg"
}
```

#### Obtener Todos los Usuarios

```http
GET /users
Authorization: Bearer <token>
```

#### Desactivar Cuenta

```http
DELETE /users/me
Authorization: Bearer <token>
```

## Variables de Entorno

| Variable      | Descripción            | Valor por defecto                             |
| ------------- | ---------------------- | --------------------------------------------- |
| `PORT`        | Puerto del servidor    | `3001`                                        |
| `NODE_ENV`    | Entorno de ejecución   | `development`                                 |
| `MONGODB_URI` | URI de MongoDB         | `mongodb://127.0.0.1:27017/proyecto_final_db` |
| `JWT_SECRET`  | Clave secreta para JWT | `tu-clave-secreta-muy-segura`                 |

## Configuración del Frontend

Para conectar tu frontend React, actualiza las URLs en `src/utils/api.js` y `src/utils/auth.js`:

```javascript
// Cambiar de:
const BASE_URL = "https://api.web-project-around.ignorelist.com";

// A:
const BASE_URL = "http://localhost:3001";
```

## Scripts Disponibles

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en desarrollo con nodemon

## Seguridad Implementada

- **Helmet**: Headers de seguridad HTTP
- **Rate Limiting**: Limita requests por IP
- **CORS**: Configurado para dominios específicos
- **JWT**: Tokens con expiración
- **bcrypt**: Hasheo seguro de contraseñas
- **Validación**: Validación de entrada con Joi
- **Sanitización**: Limpieza de datos de entrada

## Próximos Pasos

1. **Agregar más entidades** (cards, playlists, etc.)
2. **Implementar roles y permisos**
3. **Agregar logs con Winston**
4. **Implementar tests con Jest**
5. **Configurar CI/CD**
6. **Documentación con Swagger**

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
