import { Box, Divider, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import BarChart from "../components/Charts/BarCharts";
import { CARD, GRAPH } from "../utils";
import DoughnutChart from "../components/Charts/Dougnhuts";
import SparkLineChart from "../components/Charts/LineCharts";
import PointChart from "../components/Charts/PointChart";
import Map from "../components/Shared/Map";
import { Pause, Star, X } from "lucide-react";
import Card from "../components/Shared/Card";
import CardHome from "../components/Shared/CardHome";

export default function Home() {
  const data1 = [12, 19, 14, 5, 16, 19];
  const data2 = [14, 16, 20, 5, 18, 22];
  const labels = ["January", "February", "March", "April", "May", "June"];
  const colors = ["#088F8F", "#6495ED", "#89CFF0"];
  return (
    <>
      <section className="w-full bg-gray-100 p-8 flex border-b-[1px] border-gray-300">
        <div className="w-1/2">
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-[35px] font-bold text-gray-800">
                Tableau de bord
              </h3>
              <p className="text-[15px] text-gray-600">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
            <div className="flex items-center gap-5 ">
              <div className="flex items-center gap-5">
                <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-green-100 text-green-500">
                  <Star size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">57 new orders</span>
                  <span className="text-xs">Awating processing</span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-green-100 text-green-500">
                  <Pause size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">57 new orders</span>
                  <span className="text-xs">Awating processing</span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-green-100 text-green-500">
                  <X size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">57 new orders</span>
                  <span className="text-xs">Awating processing</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Divider />
          </div>

          <div className="mt-[40px]">
            <div>
              <h3 className="text-[25px] font-bold text-gray-800">
                Evolution des ventes
              </h3>
              <p className="text-[15px] text-gray-600">
                Lorem, ipsum dolor sit amet consectetur.
              </p>
            </div>
            <Stack direction="row" sx={{ width: "100%", height: "300px" }}>
              <Box sx={{ flexGrow: 1 }}>
                <SparkLineChart
                  data1={data1}
                  data2={data2}
                  labels={labels}
                  color1="#5a80d8"
                  color2="#7EC8E3"
                />
              </Box>
            </Stack>
          </div>
        </div>
        <div className="w-1/2 flex flex-wrap justify-end gap-6">
        {CARD.map((card) => (
          <CardHome
            title={card.title}
            subtitle={card.subtitle}
            data1={card.data1}
            data2={card.data2}
            labels={card.labels}
            chartType={card.chartType}
          />
        ))}
      </div>
      </section>

      <section className="w-full flex bg-white rounded-xl shadow-md p-8 mt-3">
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
      </section>
    </>
  );
}
