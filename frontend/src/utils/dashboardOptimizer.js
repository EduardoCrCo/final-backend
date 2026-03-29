/**
 * Universal Background Animation Optimizer
 * Optimiza automáticamente las animaciones CSS de fondo para mejor rendimiento
 * Funciona con cualquier elemento que tenga la clase 'animated-bg'
 */

class UniversalBackgroundOptimizer {
  constructor() {
    this.animatedElements = [];
    this.isInView = false;
    this.animationPaused = false;
    this.performanceLevel = "high";
    this.observers = [];
    this.init();
  }

  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Buscar todos los elementos con animaciones de fondo
    this.discoverAnimatedElements();

    if (this.animatedElements.length === 0) {
      console.log(
        "🎨 No animated elements found yet, will retry after route changes",
      );
      // Configurar MutationObserver para detectar elementos dinámicos
      this.setupMutationObserver();
      return;
    }

    // Detectar capacidades del dispositivo
    this.detectPerformanceLevel();

    // Detectar preferencias de movimiento
    this.handleMotionPreferences();

    // Configurar observador de visibilidad
    this.setupIntersectionObserver();

    // Detectar si la página está oculta
    this.setupVisibilityAPI();

    // Optimizar will-change dinámicamente
    this.optimizeWillChange();

    // Ajustar según nivel de rendimiento
    this.adjustAnimationsByPerformance();

    console.log(
      `🎨 Universal Background Optimizer: Found ${this.animatedElements.length} elements - Performance level "${this.performanceLevel}"`,
    );
  }

  discoverAnimatedElements() {
    // Buscar elementos con clases específicas de animación
    const selectors = [
      ".animated-bg", // Clase universal para fondos animados
      ".dashboard", // Compatibilidad con dashboard existente
      ".animated-bg--hero", // Para página de inicio
      ".animated-bg--page", // Para otras páginas
    ];

    this.animatedElements = [];
    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (!this.animatedElements.includes(element)) {
          this.animatedElements.push(element);
          console.log(`🎨 Found animated element: ${selector}`);
        }
      });
    });
  }

  setupMutationObserver() {
    // Observar cambios en el DOM para detectar nuevos elementos animados
    const observer = new MutationObserver((mutations) => {
      let shouldRediscover = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Verificar si el nodo añadido tiene clases de animación
            if (
              node.matches &&
              (node.matches(".animated-bg") ||
                node.matches(".dashboard") ||
                node.matches(".animated-bg--hero") ||
                node.matches(".animated-bg--page"))
            ) {
              shouldRediscover = true;
            }

            // Verificar elementos hijos también
            if (
              node.querySelector &&
              node.querySelector(
                ".animated-bg, .dashboard, .animated-bg--hero, .animated-bg--page",
              )
            ) {
              shouldRediscover = true;
            }
          }
        });
      });

      if (shouldRediscover) {
        console.log("🎨 New animated elements detected, re-initializing...");
        this.setup();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.observers.push(observer);
  }

  detectPerformanceLevel() {
    const connection = navigator.connection;
    const memory = navigator.deviceMemory;
    const cores = navigator.hardwareConcurrency;

    // Detectar connections lentas
    if (
      connection &&
      (connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g")
    ) {
      this.performanceLevel = "low";
      return;
    }

    // Detectar dispositivos con poca memoria
    if (memory && memory <= 2) {
      this.performanceLevel = "low";
      return;
    }

    // Detectar dispositivos con pocos cores
    if (cores && cores <= 2) {
      this.performanceLevel = "medium";
      return;
    }

    this.performanceLevel = "high";
  }

  handleMotionPreferences() {
    // Respetar prefer-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (prefersReducedMotion.matches) {
      this.pauseAnimations();
      console.log("🎨 Animations disabled (user prefers reduced motion)");
    }

    // Escuchar cambios en las preferencias
    prefersReducedMotion.addListener((e) => {
      if (e.matches) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isInView = entry.isIntersecting;

          if (this.isInView) {
            this.resumeAnimations();
          } else {
            this.pauseAnimations();
          }
        });
      },
      {
        threshold: 0.1, // Activar cuando 10% está visible
      },
    );

    // Observar todos los elementos animados
    this.animatedElements.forEach((element) => {
      observer.observe(element);
    });

    this.observers.push(observer);
  }

  setupVisibilityAPI() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else if (this.isInView) {
        this.resumeAnimations();
      }
    });
  }

  optimizeWillChange() {
    // Solo aplicar will-change cuando se está animando
    this.animatedElements.forEach((element) => {
      element.addEventListener("animationstart", () => {
        element.style.willChange = "background-position, transform";
      });

      element.addEventListener("animationend", () => {
        element.style.willChange = "auto";
      });
    });
  }

  adjustAnimationsByPerformance() {
    const root = document.documentElement;

    switch (this.performanceLevel) {
      case "low":
        // Animaciones más lentas y menos complejas
        root.style.setProperty("--animation-duration", "40s");
        root.style.setProperty("--animation-timing", "linear");
        this.reduceComplexity();
        break;

      case "medium":
        // Velocidad media
        root.style.setProperty("--animation-duration", "30s");
        root.style.setProperty("--animation-timing", "ease-in-out");
        break;

      case "high":
        // Animaciones completas y fluidas
        root.style.setProperty("--animation-duration", "25s");
        root.style.setProperty("--animation-timing", "ease-in-out");
        break;
    }
  }

  reduceComplexity() {
    // En dispositivos lentos, reducir la complejidad visual
    this.animatedElements.forEach((element) => {
      element.classList.add("animated-bg--optimized");
    });
  }

  pauseAnimations() {
    if (!this.animationPaused) {
      this.animatedElements.forEach((element) => {
        element.style.animationPlayState = "paused";
      });
      this.animationPaused = true;
      console.log("⏸️ Animations paused");
    }
  }

  resumeAnimations() {
    if (this.animationPaused) {
      this.animatedElements.forEach((element) => {
        element.style.animationPlayState = "running";
      });
      this.animationPaused = false;
      console.log("▶️ Animations resumed");
    }
  }

  // Método público para controlar manualmente
  setPerformanceLevel(level) {
    this.performanceLevel = level;
    this.adjustAnimationsByPerformance();
  }
}

// Inicializar automáticamente
const universalOptimizer = new UniversalBackgroundOptimizer();

// Exponer globalmente para control manual si es necesario
window.UniversalBackgroundOptimizer = universalOptimizer;
// Mantener compatibilidad con el nombre anterior
window.DashboardOptimizer = universalOptimizer;
