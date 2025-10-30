// import React from "react";
// import { Link } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Metric, Text, Flex } from "@tremor/react";
import { ProgressBar } from "../../ProgressBar/ProgressBar";

export const CardDashboard = () => {
  const [progress, setProgress] = useState(60); // Valor inicial

  // Simula un cambio de progreso
  const increase = () => setProgress((p) => (p < 100 ? p + 10 : 100));
  const decrease = () => setProgress((p) => (p > 0 ? p - 10 : 0));

  return (
    <Card className="max-w-xs mx-auto bg-gradient-to-br from-blue-900 to-blue-600 shadow-lg p-6 rounded-xl">
      <Text className="text-white font-bold text-lg mb-2">¡Likes!</Text>
      <Metric className="text-4xl text-white mb-2">80</Metric>
      <Flex className="justify-between mb-2">
        <Text className="text-blue-200">{progress}% month target</Text>
        <Text className="text-blue-100">200</Text>
      </Flex>
      {/* Barra de progreso dinámica con Tailwind */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-yellow-400 h-4 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={decrease}
          className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
        >
          -
        </button>
        <button
          onClick={increase}
          className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
        >
          +
        </button>
      </div>
      <Link to="/reviews" className="block mt-4 text-blue-200 underline">
        Go to Reviews
      </Link>

      <div className="flex items-center justify-center gap-12">
        <ProgressBar value={62} />
      </div>
    </Card>

    // <>
    //   <div
    //     className="progress-bar-container"
    //     style={{
    //       width: "100%",
    //       background: "#eee",
    //       borderRadius: "8px",
    //       height: "20px",
    //     }}
    //   >
    //     <div
    //       className="progress-bar"
    //       style={{
    //         width: "70%", // Cambia este valor según el progreso (por ejemplo, `${progress}%`)
    //         background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
    //         height: "100%",
    //         borderRadius: "8px",
    //         transition: "width 0.3s",
    //       }}
    //     />
    //   </div>
    // </>
    // <div className="card-dashboard">
    //   <Card className="mx-auto mt-8 p-4">
    //     <h1 className="text-2xl font-bold mb-2">¡Tremor funcionando!</h1>
    //     <p className="text-white-700">Este es un Card de Tremor.</p>
    //   </Card>
    //   <Link to="/reviews" className="block mt-4 text-blue-500 underline">
    //     Go to Reviews
    //   </Link>
    // </div>
  );
};
