import { LineChart } from "./LineChart";

const chartdata = [
  { dia: "Lun", Temperatura: 18, Viento: 10 },
  { dia: "Mar", Temperatura: 22, Viento: 5 },
  { dia: "Mié", Temperatura: 30, Viento: 20 },
  { dia: "Jue", Temperatura: 25, Viento: 8 },
  { dia: "Vie", Temperatura: 20, Viento: 12 },
  { dia: "Sáb", Temperatura: 28, Viento: 6 },
  { dia: "Dom", Temperatura: 24, Viento: 9 },
];

export const ChartDataTime = () => (
  <LineChart
    className="h-80"
    data={chartdata}
    index="dia"
    categories={["Temperatura", "Viento"]}
    valueFormatter={(n) => `${n}°C / km/h`}
    onValueChange={(v) => console.log(v)}
  />
);
