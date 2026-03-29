# 🚁 DroneVision - Sistema de Animaciones Universales

## 🚀 Instalación Rápida

```bash
# 1. Clonar proyecto
git clone [repository]
cd final/frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar desarrollo
npm run dev
# ➜ Local: http://localhost:5174/
```

## ✨ Todas las Rutas con Animaciones

| Ruta         | Efecto          | Descripción                   |
| ------------ | --------------- | ----------------------------- |
| `/`          | Hero animado    | Burbujas en sección principal |
| `/dashboard` | Página completa | Dashboard con fondo dinámico  |
| `/reviews`   | Página completa | Lista de reviews con efectos  |
| `/aboutMe`   | Página completa | Perfil personal animado       |

## 🔧 Agregar Animaciones a Nuevos Componentes

```jsx
// Opción 1: Página completa
function MiPagina() {
  return (
    <div className="animated-bg page-background">
      <h1>Mi contenido</h1>
    </div>
  );
}

// Opción 2: Hero section
function MiHero() {
  return (
    <section className="animated-bg home-hero">
      <h1>Título principal</h1>
    </section>
  );
}

// Opción 3: Sección específica
function MiSeccion() {
  return (
    <div className="animated-bg section-bg">
      <h2>Mi sección especial</h2>
    </div>
  );
}
```

## 📊 Optimización Automática

- ✅ **Pausa en tabs inactivos** → Ahorra batería
- ✅ **Detección de dispositivo** → Mobile optimizado
- ✅ **Visibilidad inteligente** → Solo anima lo visible
- ✅ **Preferencias usuario** → Respeta accesibilidad
- ✅ **Hardware acceleration** → Rendimiento GPU

## 🎨 Personalización

### Cambiar velocidad global

```css
/* En animatedBackgrounds.css */
animation-duration: 15s; /* Más lento */
animation-duration: 8s; /* Más rápido */
```

### Modificar colores

```css
/* Cambiar gradientes de burbujas */
background: radial-gradient(
  circle,
  rgba(74, 144, 226, 0.3) 0%,
  transparent 70%
);
```

### Controlar desde JavaScript

```javascript
// Pausar todas las animaciones
window.UniversalBackgroundOptimizer.pauseAnimations();

// Reanudar animaciones
window.UniversalBackgroundOptimizer.resumeAnimations();

// Cambiar nivel de rendimiento
window.UniversalBackgroundOptimizer.setPerformanceLevel("low");
```

## 📱 Responsive Design

### Desktop

- 6 burbujas animadas
- Velocidad normal (12s)
- Efectos completos

### Tablet

- 4 burbujas optimizadas
- Velocidad media (15s)
- Efectos moderados

### Mobile

- 3 burbujas simples
- Velocidad lenta (20s)
- Mínimo impacto en batería

## 🐛 Resolución de Problemas

### Las animaciones no se ven

1. Verificar import en `index.css`

```css
@import "./blocks/animatedBackgrounds.css";
```

2. Verificar JavaScript en `main.jsx`

```javascript
import "./utils/dashboardOptimizer.js";
```

### Rendimiento lento

1. Abrir DevTools → Performance
2. Verificar CPU usage < 15%
3. Si está alto, el optimizer bajará automáticamente la calidad

### Animaciones no pausan

1. Verificar que Page Visibility API esté funcionando
2. Cambiar tab → Las animaciones deberían pausarse
3. Volver al tab → Deberían reanudarse

---

**🎯 ¡Sistema de animaciones profesional listo para uso en producción!**
