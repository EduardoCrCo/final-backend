import { useState, useEffect } from "react";

// Mover steps fuera del componente para evitar recreación
const steps = [
  "cargando video...",
  "cargando video...",
  "cargando video...",
  "cargando video...",
];

export const VideoPreloader = ({ isVisible, videoTitle, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setCurrentStep("");
      return;
    }

    let interval;
    let stepIndex = 0;

    const updateProgress = () => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5;

        if (newProgress > 25 && stepIndex === 0) {
          setCurrentStep(steps[1]);
          stepIndex = 1;
        } else if (newProgress > 50 && stepIndex === 1) {
          setCurrentStep(steps[2]);
          stepIndex = 2;
        } else if (newProgress > 80 && stepIndex === 2) {
          setCurrentStep(steps[3]);
          stepIndex = 3;
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete && onComplete();
          }, 300);
          return 100;
        }

        return newProgress;
      });
    };

    setCurrentStep(steps[0]);
    setProgress(10);

    interval = setInterval(updateProgress, 200);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="video-preloader-overlay">
      <div className="video-preloader-content">
        <div className="video-preloader-spinner"></div>

        <h3 className="video-preloader-title">
          {videoTitle || "Cargando video..."}
        </h3>

        <div className="video-preloader-progress-container">
          <div className="video-preloader-progress-bar">
            <div
              className="video-preloader-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="video-preloader-percentage">
            {Math.round(progress)}%
          </span>
        </div>

        <p className="video-preloader-step">{currentStep}</p>
      </div>
    </div>
  );
};
