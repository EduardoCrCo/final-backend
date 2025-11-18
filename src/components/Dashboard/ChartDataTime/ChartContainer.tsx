import React from 'react';

interface WeatherData {
  dia: string;
  Temperatura: number;
  Lluvia: number;
}

interface ChartContainerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isReady: boolean;
  dimensions: { width: number; height: number };
  loading: boolean;
  error: string | null;
  data: WeatherData[];
  onShowFallbackData: () => void;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  containerRef,
  isReady,
  dimensions,
  loading,
  error,
  data,
  onShowFallbackData,
  children
}) => {
  const renderContent = () => {
    if (!isReady || dimensions.width === 0) {
      return <p className="text-gray-500 text-lg">Preparando gráfico...</p>;
    }

    if (loading) {
      return <p className="text-gray-500 text-lg">Cargando datos...</p>;
    }

    if (error) {
      return <p className="text-red-500 text-lg">{error}</p>;
    }

    if (data.length === 0) {
      return (
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">No hay datos disponibles</p>
          <button 
            onClick={onShowFallbackData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Mostrar datos de ejemplo
          </button>
        </div>
      );
    }

    if (dimensions.width > 320 && dimensions.height > 200) {
      return (
        <div 
          className="w-full h-full" 
          style={{ 
            width: Math.max(dimensions.width, 320), 
            height: Math.max(dimensions.height, 200) 
          }}
        >
          {children}
        </div>
      );
    }

    return <p className="text-gray-500 text-lg">Ajustando dimensiones...</p>;
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 w-full flex items-center justify-center" 
      style={{ height: '320px', minHeight: '320px', width: '100%' }}
    >
      {renderContent()}
    </div>
  );
};