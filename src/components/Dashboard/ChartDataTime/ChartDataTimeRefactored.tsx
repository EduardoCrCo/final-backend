import React, { useState, useEffect } from "react";
import { LineChart } from "./LineChart";
import { CitySearch } from "./CitySearch";
import { ChartContainer } from "./ChartContainer";
import { useWeatherData } from "../../../hooks/useWeatherData";
import { useCitySuggestions } from "../../../hooks/useCitySuggestions";
import { useContainerDimensions } from "../../../hooks/useContainerDimensions";

// Datos de fallback constantes
const FALLBACK_DATA = [
  { dia: "Lun", Temperatura: 18, Lluvia: 45 },
  { dia: "Mar", Temperatura: 22, Lluvia: 20 },
  { dia: "Mié", Temperatura: 30, Lluvia: 80 },
  { dia: "Jue", Temperatura: 25, Lluvia: 35 },
  { dia: "Vie", Temperatura: 20, Lluvia: 60 },
  { dia: "Sáb", Temperatura: 28, Lluvia: 25 },
  { dia: "Dom", Temperatura: 24, Lluvia: 40 },
];

export const getWeatherGradient = (condition: string ): string => {
  if (!condition) return "bg-gradient-to-b from-sky-200 to-sky-400";

  switch (condition) {
    case "Clear":
      return "bg-gradient-to-b from-sky-300 via-sky-200 to-yellow-100";
    case "Clouds":
      return "bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500";
    case "Rain":
    case "Drizzle":
      return "bg-gradient-to-b from-slate-600 via-slate-700 to-slate-900";
    case "Thunderstorm":
      return "bg-gradient-to-b from-gray-700 via-gray-900 to-black";
    case "Snow":
      return "bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300";
    case "Fog":
    case "Mist":
    case "Haze":
      return "bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200";
    default:
      return "bg-gradient-to-b from-sky-200 to-sky-400";
  }
};

// Custom Tooltip Component
const WeatherTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-md p-3">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between space-x-4 mb-1">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-0.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700 text-sm">{entry.category}</span>
            </div>
            <span className="font-medium text-gray-900 text-sm">
              {entry.category === "Temperatura" 
                ? `${entry.value}°C` 
                : `${entry.value}%`
              }
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ChartDataTimeRefactored: React.FC<{ onConditionChange?: (c: string | null) => void }> = ({ onConditionChange }) => {
  const [city, setCity] = useState("Mexico City");
  
  // Custom hooks para separar responsabilidades
  const weatherData = useWeatherData();
  const citySuggestions = useCitySuggestions();
  const containerDimensions = useContainerDimensions();

  // Efectos
  // useEffect(() => {
  //   if (containerDimensions.isReady && city) {
  //     weatherData.fetchWeatherData(city);
  //   }
  // }, [containerDimensions.isReady, city]);
  useEffect(() => {
  if (containerDimensions.isReady && city) {
    weatherData.fetchWeatherData(city).then(() => {
      onConditionChange?.(weatherData.condition);
    });
  }
}, [containerDimensions.isReady, city, onConditionChange]);

  // Handlers
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!city.trim()) return;
    weatherData.fetchWeatherData(city);
  };

  const handleCitySelect = (cityName: string) => {
    setCity(cityName);
    citySuggestions.clearSuggestions();
    weatherData.fetchWeatherData(cityName);
  };

  const handleShowFallbackData = () => {
    // En un caso real, esto podría ser una prop o venir de un contexto
    (weatherData as any).setData?.(FALLBACK_DATA) || console.log('Fallback data would be set here');
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-[80vw] pt-20" style={{ minHeight: '600px' }}>
      <CitySearch
        city={city}
        onCityChange={setCity}
        onCitySelect={handleCitySelect}
        onSearch={handleSearch}
        suggestions={citySuggestions.suggestions}
        onSuggestionsFetch={citySuggestions.fetchSuggestions}
      />

      <ChartContainer
        containerRef={containerDimensions.containerRef}
        isReady={containerDimensions.isReady}
        dimensions={containerDimensions.dimensions}
        loading={weatherData.loading}
        error={weatherData.error}
        data={weatherData.data}
        onShowFallbackData={handleShowFallbackData}
      >
        <LineChart
          className="w-full h-full"
          data={weatherData.data}
          index="dia"
          categories={["Temperatura", "Lluvia"]}
          valueFormatter={(value) => `${value}`}
          customTooltip={WeatherTooltip}
        />
      </ChartContainer>
    </div>
  );
};