import { Link } from "react-router-dom";
import { CardDashboard } from "./CardDashboard/CardDashboard";
import { ChartDataTime } from "./ChartDataTime/ChartDataTime";
import { Flex } from "@tremor/react";

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <p>.</p>
      <p>.</p>
      <p>.</p>

      <h1 className="dashboard__title">Bienvenido al Dashboard</h1>
      <h3 className="dashboard__subtitle">Estadísticas de los Videos</h3>
      <h3 className="dashboard__subtitle">Revisa las condiciones del tiempo</h3>
      <Flex>
        <CardDashboard />
        <CardDashboard />
      </Flex>

      <ChartDataTime marginTop="mt-8" />
      <Link to="/reviews" className="block mt-4 text-blue-200 underline">
        Go to Reviews
      </Link>
    </div>
  );
};
