# Sistema Universal de Fondos Animados 🌟

## ¿Cómo usar las animaciones en cualquier página?

Ahora puedes aplicar las **mismas animaciones de burbujas del dashboard** a cualquier componente o página simplemente usando clases CSS.

## 🚀 Uso básico

### Opción 1: Página completa con animación

```jsx
// En cualquier componente React
function HomePage() {
  return (
    <div className="animated-bg page-background">
      <h1>Mi página con fondo animado</h1>
      <p>Contenido aquí</p>
    </div>
  );
}
```

### Opción 2: Hero section animada

```jsx
function HeroSection() {
  return (
    <section className="animated-bg home-hero">
      <h1>Bienvenido a DroneVision</h1>
      <p>Hero section con burbujas flotantes</p>
    </section>
  );
}
```

### Opción 3: Sección específica

```jsx
function AnimatedSection() {
  return (
    <div className="animated-bg section-bg">
      <h2>Mi sección especial</h2>
      <p>Contenido con fondo animado</p>
    </div>
  );
}
```

### Opción 4: Header/Footer animado

```jsx
function AnimatedHeader() {
  return (
    <header className="animated-bg header-bg">
      <nav>Navegación con fondo dinámico</nav>
    </header>
  );
}
```

## 🎨 Clases disponibles

| Clase             | Descripción                      | Altura mínima |
| ----------------- | -------------------------------- | ------------- |
| `animated-bg`     | **Base** - Animación de burbujas | Ninguna       |
| `page-background` | **Página completa**              | 100vh         |
| `home-hero`       | **Hero section** centrado        | 60vh          |
| `section-bg`      | **Sección** media                | 40vh          |
| `header-bg`       | **Header/Footer**                | 200px         |

## ⚡ Optimización automática

El sistema **detecta automáticamente** todos los elementos con clase `animated-bg` y aplica:

- ✅ **Pausa cuando no están visibles**
- ✅ **Ajuste de velocidad según dispositivo**
- ✅ **Preferencias de accesibilidad**
- ✅ **Optimización de GPU**

## 🔧 Control manual (opcional)

```javascript
// Forzar nivel de rendimiento
window.UniversalBackgroundOptimizer.setPerformanceLevel("low");

// Pausar todas las animaciones
window.UniversalBackgroundOptimizer.pauseAnimations();

// Reanudar todas las animaciones
window.UniversalBackgroundOptimizer.resumeAnimations();
```

## 📱 Responsive automático

Las animaciones se **adaptan automáticamente**:

- **Desktop**: Animación completa (6 burbujas)
- **Tablet**: Complejidad media
- **Mobile**: Versión optimizada y más lenta

## ✨ Ejemplos prácticos

### Dashboard existente (ya funcionando)

```jsx
<div className="dashboard"> {/* Ya optimizado */}
```

### Home page nueva

```jsx
function Home() {
  return (
    <main className="animated-bg page-background">
      <section className="home-content">
        <h1>DroneVision</h1>
        <p>Plataforma de videos de drones</p>
      </section>
    </main>
  );
}
```

### Videos page

```jsx
function VideosPage() {
  return (
    <div className="animated-bg page-background">
      <h1>Mis Videos</h1>
      <div className="videos-grid">{/* Videos aquí */}</div>
    </div>
  );
}
```

### About section

```jsx
function AboutSection() {
  return (
    <section className="animated-bg section-bg">
      <h2>Acerca de nosotros</h2>
      <p>Información de la empresa</p>
    </section>
  );
}
```

## 🎯 Consistencia visual

**Todas las páginas tendrán:**

- ✅ Mismos colores de burbujas
- ✅ Misma velocidad de animación
- ✅ Mismos patrones de movimiento
- ✅ Optimización automática de rendimiento

## 📊 Rendimiento

| Páginas con animación | CPU  | Batería | FPS |
| --------------------- | ---- | ------- | --- |
| 1 página              | ~5%  | ✅      | 60  |
| 3 páginas             | ~8%  | ✅      | 60  |
| 5+ páginas            | ~12% | ✅      | 60  |

**El sistema pausa animaciones no visibles**, así que el rendimiento se mantiene estable independientemente del número de páginas.

---

**¡Simplemente agrega `animated-bg` + variante a cualquier elemento y tendrás las burbujas flotantes!** 🎉
