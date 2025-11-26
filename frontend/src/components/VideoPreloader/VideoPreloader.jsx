import { useState, useEffect } from "react";
import "../../blocks/videoPreloader.css";

export const VideoPreloader = ({ isVisible, videoTitle, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Preparando video...",
    "Cargando contenido...",
    "Optimizando reproducción...",
    "Casi listo...",
  ];

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5;

        // Actualizar paso basado en progreso
        const stepIndex = Math.min(
          Math.floor((newProgress / 100) * steps.length),
          steps.length - 1
        );
        setCurrentStep(stepIndex);

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }

        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isVisible, onComplete, steps.length]);

  if (!isVisible) return null;

  return (
    <div className="video-preloader-overlay">
      <div className="video-preloader-modal">
        <div className="video-preloader-header">
          <h3>Cargando Video</h3>
          <p className="video-title">{videoTitle}</p>
        </div>

        <div className="video-preloader-content">
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>

          <p className="loading-message">{steps[currentStep]}</p>
        </div>

        <div className="video-preloader-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
};
