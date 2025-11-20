// import { LineChart } from "./LineChart";

// const chartdata = [
//   { dia: "Lun", Temperatura: 18, Viento: 10 },
//   { dia: "Mar", Temperatura: 22, Viento: 5 },
//   { dia: "Mié", Temperatura: 30, Viento: 20 },
//   { dia: "Jue", Temperatura: 25, Viento: 8 },
//   { dia: "Vie", Temperatura: 20, Viento: 12 },
//   { dia: "Sáb", Temperatura: 28, Viento: 6 },
//   { dia: "Dom", Temperatura: 24, Viento: 9 },
// ];

// export const ChartDataTime = () => (
//   <LineChart
//     className="h-80"
//     data={chartdata}
//     index="dia"
//     categories={["Temperatura", "Viento"]}
//     valueFormatter={(n) => `${n}°C / km/h`}
//     onValueChange={(v) => console.log(v)}
//   />
// );

// import { useState, useEffect, useRef } from "react";
// import { LineChart } from "./LineChart";

// export const ChartDataTime = () => {
//   const [city, setCity] = useState("Mexico City");
//   const [suggestions, setSuggestions] = useState([]);
//   const [chartData, setChartData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isReady, setIsReady] = useState(false);
//   const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Datos de fallback para pruebas
//   const fallbackData = [
//     { dia: "Lun", Temperatura: 18, Lluvia: 45 },
//     { dia: "Mar", Temperatura: 22, Lluvia: 20 },
//     { dia: "Mié", Temperatura: 30, Lluvia: 80 },
//     { dia: "Jue", Temperatura: 25, Lluvia: 35 },
//     { dia: "Vie", Temperatura: 20, Lluvia: 60 },
//     { dia: "Sáb", Temperatura: 28, Lluvia: 25 },
//     { dia: "Dom", Temperatura: 24, Lluvia: 40 },
//   ];

//   const API_KEY = "1754ac1ac1824d7f9a525648251211"; // 🔑 pon tu clave aquí

//   // 🔹 Obtener pronóstico de 7 días
//   const fetchWeatherData = async (cityName: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(
//         `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=7&lang=es`
//       );
//       if (!res.ok) throw new Error("No se pudo obtener el clima.");
//       const data = await res.json();

//       // 🔹 Formatear datos para el gráfico
//       const formatted = data.forecast.forecastday.map((d: any) => ({
//         dia: new Date(d.date).toLocaleDateString("es-MX", {
//           weekday: "short",
//         }),
//         Temperatura: d.day.avgtemp_c,
//         Lluvia: d.day.daily_chance_of_rain,
//       }));

//       setChartData(formatted);
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || "Error desconocido");
//       setChartData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Autocompletado de ciudades
//   const fetchCitySuggestions = async (query: string) => {
//     if (query.length < 3) {
//       setSuggestions([]);
//       return;
//     }
//     try {
//       const res = await fetch(
//         `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`
//       );
//       const data = await res.json();
//       setSuggestions(data);
//     } catch {
//       setSuggestions([]);
//     }
//   };

//   // 🔹 Observar dimensiones del contenedor
//   useEffect(() => {
//     const updateDimensions = () => {
//       if (containerRef.current) {
//         const { offsetWidth, offsetHeight } = containerRef.current;
//         if (offsetWidth > 0 && offsetHeight > 0) {
//           setContainerDimensions({ width: offsetWidth, height: offsetHeight });
//           if (!isReady) {
//             setIsReady(true);
//           }
//         }
//       }
//     };

//     // Observar cambios de tamaño
//     const resizeObserver = new ResizeObserver(updateDimensions);
//     if (containerRef.current) {
//       resizeObserver.observe(containerRef.current);
//     }

//     // También usar timeout como fallback
//     const timer = setTimeout(() => {
//       updateDimensions();
//       if (!isReady) {
//         setIsReady(true);
//       }
//     }, 200);

//     return () => {
//       resizeObserver.disconnect();
//       clearTimeout(timer);
//     };
//   }, [isReady]);

//   // 🔹 Carga inicial de datos
//   useEffect(() => {
//     if (isReady) {
//       if (city) {
//         fetchWeatherData(city);
//       } else {
//         // Usar datos de fallback si no hay ciudad
//         setChartData(fallbackData);
//       }
//     }
//   }, [isReady]);

//   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!city.trim()) return;
//     fetchWeatherData(city);
//   };

//   const handleSelectCity = (name: string) => {
//     setCity(name);
//     setSuggestions([]);
//     fetchWeatherData(name);
//   };

//   return (
//     <div className="flex flex-col gap-6 items-center w-full h-full" style={{ minHeight: '400px' }}>
//       {/* 🔍 Barra de búsqueda */}
//       <form onSubmit={handleSearch} className="relative w-full max-w-md flex-shrink-0">
//         <input
//           type="text"
//           value={city}
//           onChange={(e) => {
//             setCity(e.target.value);
//             fetchCitySuggestions(e.target.value);
//           }}
//           placeholder="Buscar ciudad..."
//           className="border rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring focus:ring-blue-400"
//         />
//         <button
//           type="submit"
//           className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
//         >
//           Buscar
//         </button>

//         {/* 📍 Sugerencias */}
//         {suggestions.length > 0 && (
//           <ul className="absolute bg-white border w-full mt-1 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
//             {suggestions.map((s: any) => (
//               <li
//                 key={s.id}
//                 onClick={() => handleSelectCity(s.name)}
//                 className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
//               >
//                 {s.name}, {s.country}
//               </li>
//             ))}
//           </ul>
//         )}
//       </form>

//       {/* 🔄 Estado de carga / error / gráfico */}
//       <div 
//         ref={containerRef}
//         className="flex-1 w-full flex items-center justify-center" 
//         style={{ height: '320px', minHeight: '320px', width: '100%' }}
//       >
//         {(!isReady || containerDimensions.width === 0) && (
//           <p className="text-gray-500 text-lg">Preparando gráfico...</p>
//         )}
//         {isReady && containerDimensions.width > 0 && loading && (
//           <p className="text-gray-500 text-lg">Cargando datos...</p>
//         )}
//         {isReady && containerDimensions.width > 0 && error && (
//           <p className="text-red-500 text-lg">{error}</p>
//         )}
//         {isReady && containerDimensions.width > 320 && containerDimensions.height > 200 && !loading && !error && chartData.length > 0 && (
//           <div 
//             className="w-full h-full" 
//             style={{ 
//               width: Math.max(containerDimensions.width, 320), 
//               height: Math.max(containerDimensions.height, 200) 
//             }}
//           >
//             <LineChart
//               className="w-full h-full"
//               data={chartData}
//               index="dia"
//               categories={["Temperatura", "Lluvia"]}
//               valueFormatter={(value) => `${value}`}
//               customTooltip={({ active, payload, label }) => {
//                 if (active && payload && payload.length) {
//                   return (
//                     <div className="bg-white border border-gray-200 rounded-md shadow-md p-3">
//                       <p className="font-medium text-gray-900 mb-2">{label}</p>
//                       {payload.map((entry: any, index: number) => (
//                         <div key={index} className="flex items-center justify-between space-x-4 mb-1">
//                           <div className="flex items-center space-x-2">
//                             <div 
//                               className="w-3 h-0.5 rounded-full"
//                               style={{ backgroundColor: entry.color }}
//                             />
//                             <span className="text-gray-700 text-sm">{entry.category}</span>
//                           </div>
//                           <span className="font-medium text-gray-900 text-sm">
//                             {entry.category === "Temperatura" 
//                               ? `${entry.value}°C` 
//                               : `${entry.value}%`
//                             }
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   );
//                 }
//                 return null;
//               }}
//             />
//           </div>
//         )}
//         {isReady && containerDimensions.width > 0 && !loading && !error && chartData.length === 0 && (
//           <div className="text-center">
//             <p className="text-gray-400 text-lg mb-4">No hay datos disponibles</p>
//             <button 
//               onClick={() => setChartData(fallbackData)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//             >
//               Mostrar datos de ejemplo
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
