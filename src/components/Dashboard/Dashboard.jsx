import { Link } from "react-router-dom";
import { CardDashboard } from "./CardDashboard/CardDashboard";
import { ChartDataTimeRefactored } from "./ChartDataTime/ChartDataTimeRefactored";
import { UsersTable } from "./Table/Table";
import {
  Flex,
  TabList,
  Title,
  Text,
  Tab,
  TabGroup,
  Card,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import { useState } from "react";
import { getWeatherGradient } from "./ChartDataTime/ChartDataTimeRefactored";

export const Dashboard = () => {
  // return (
  //   <div className="dashboard">
  //     <div className="w-full max-w-7xl mx-auto space-y-8">
  //       <div className="text-center space-y-4">
  //         <h1 className="dashboard__title">Bienvenido al Dashboard</h1>
  //         <h3 className="dashboard__subtitle">Estadísticas de los Videos</h3>
  //         <h3 className="dashboard__subtitle">
  //           Revisa las condiciones del tiempo
  //         </h3>
  //       </div>

  //       <div className="flex justify-center">
  //         <Flex className="gap-6 w-full max-w-4xl">
  //           <CardDashboard />
  //           <CardDashboard />
  //         </Flex>
  //       </div>

  //       <div className="w-full flex justify-center">
  //         <div
  //           className="w-full max-w-6xl"
  //           style={{ minHeight: "450px", height: "450px" }}
  //         >
  //           <ChartDataTimeRefactored />
  //         </div>
  //       </div>

  //       <div className="text-center pt-8">
  //         <Link
  //           to="/reviews"
  //           className="inline-block text-blue-200 underline hover:text-blue-300 transition-colors text-lg"
  //         >
  //           Go to Reviews
  //         </Link>
  //       </div>
  //     </div>
  //   </div>
  // );

  const [selectedView, setSelectedView] = useState(1);
  const [weatherCondition, setWeatherCondition] = useState(null);

  return (
    <main className="bg-gray-400 p-6 sm:p-6">
      <Title className="mt-20 mb-5 h-6 text-xl">Bienvenido al Dashboard</Title>
      <Text className="mb-5">
        Aqui puedes revisar las estadisticas de los Usuarios
      </Text>
      <Text className="mb-5">
        Y Revisar el estado del tiempo si Planeas salir a volar tu drone
      </Text>
      <TabGroup defaultValue={1} value={selectedView}>
        <TabList mt="mt-6">
          <Tab value={1} onClick={() => setSelectedView(1)}>
            Estadisticas de Usuarios
          </Tab>
          <Tab value={2}>Estado del Tiempo</Tab>
        </TabList>

        <TabPanels>
          <TabPanel className="bg-slate-600">
            <Card className=" p-6 shadow-lg rounded-2xl">
              <div className="h-[80vh] rounded-xl flex flex-col items-center justify-center bg-slate-200">
                <UsersTable />
              </div>
            </Card>
          </TabPanel>
          <TabPanel className="bg-slate-600">
            <Card className="p-6 shadow-lg rounded-2xl">
              {/* <div className="h-[80vh] bg-gradient-to-b from-sky-300 via-sky-200 to-yellow-100 flex items-center justify-center  rounded-xl"> */}
              {/* <div
                className={`h-[80vh] rounded-xl flex items-center justify-center transition-all duration-700 ${getWeatherGradient(
                  weatherData.condition
                )}`}
              > */}
              <div
                className={`h-[80vh] rounded-xl flex items-center justify-center transition-all duration-100 
        ${getWeatherGradient(weatherCondition || "")}
      `}
              >
                <ChartDataTimeRefactored
                  onConditionChange={setWeatherCondition}
                />
              </div>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
};
