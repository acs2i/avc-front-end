import { Box, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import BarChart from "../components/Charts/BarCharts";
import { GRAPH } from "../utils";
import DoughnutChart from "../components/Charts/Dougnhuts";
import SparkLineChart from "../components/Charts/LineCharts";
import PointChart from "../components/Charts/PointChart";
import Map from "../components/Shared/Map";

export default function Home() {
  const data1 = [12, 19, 14, 5, 16, 19];
  const data2 = [14, 16, 20, 5, 18, 22];
  const labels = ["January", "February", "March", "April", "May", "June"];
  const colors = ["#088F8F", "#6495ED", "#89CFF0"];
  return (
    <>
      <div className="w-full flex bg-white rounded-xl shadow-md p-8">
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <h3 className="text-[35px] font-bold text-gray-800">
              Tableau de bord
            </h3>
            <p className="text-[15px] text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
            <div className="mt-4">
              <Stack direction="row" sx={{ width: "100%", height: "300px" }}>
                <Box sx={{ flexGrow: 1 }}>
                  <BarChart data1={data1} data2={data2} labels={labels} />
                </Box>
              </Stack>
            </div>
          </div>
          <div className="col-span-1 grid grid-cols-2 gap-3">
            {GRAPH.map((item, index) => (
              <div
                key={index}
                className="w-full h-[200px] bg-gray-200 rounded-md shadow-md p-3"
              >
                <div>
                  <h4 className="text-lg font-bold text-gray-800">
                    {item.title}
                  </h4>
                </div>
                <div className="h-[130px] mt-3">
                  {item.chart === "bar" && (
                    <BarChart
                      data1={item.data1}
                      data2={item.data2}
                      labels={labels}
                    />
                  )}
                  {item.chart === "line" && (
                    <SparkLineChart
                      data1={item.data1}
                      data2={item.data2}
                      labels={labels}
                    />
                  )}
                  {item.chart === "dough" && (
                    <DoughnutChart
                      data={item.data1}
                      labels={labels}
                      colors={colors}
                      showLabels={false}
                    />
                  )}
                  {item.chart === "point" && (
                    <PointChart
                      data1={data1}
                      data2={data2}
                      labels={labels}
                      pointColor1="#4682B4"
                      pointColor2="#87CEEB"
                      pointRadius1={5}
                      pointRadius2={5}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex bg-white rounded-xl shadow-md p-8 mt-3">
        <div className="w-full">
          <div>
            <h3 className="text-[35px] font-bold text-gray-800">
              Fournisseurs principaux
            </h3>
            <p className="text-[15px] text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>

          <div className="mt-5 rounded-lg">
            <Map />
          </div>
        </div>
      </div>
    </>
  );
}
