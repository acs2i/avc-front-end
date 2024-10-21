import React from "react";
import BarChart from "../../components/Charts/BarCharts";
import SparkLineChart from "../../components/Charts/LineCharts";
import DoughnutChart from "../../components/Charts/Dougnhuts";
import PointChart from "../../components/Charts/PointChart";
import { Box, Divider, Stack, Typography } from "@mui/material";

type InFosCard = {
  title: string;
  subtitle: string;
  data1: number[];
  data2: number[];
  labels: string[];
  chartType: string;
};

export default function CardHome({ title, subtitle, data1, data2, labels, chartType }: InFosCard) {
  const colors = [['#4682B4', '	#B0C4DE']];
  let total = 0;

  const renderChart = () => {
    if (chartType === "line") {
      return (
       
        <div className="w-full h-[200px]">
          <SparkLineChart data1={data1} data2={data2} labels={labels} />
        </div>

      );
    }
    if (chartType === "bar") {
      return (
      
        <div className="w-full h-[200px]">
          <BarChart data1={data1} data2={data2} labels={labels} />
        </div>
      );
    }
    if (chartType === "pie") {
        return (
          <div className="w-full h-[200px]">
            <DoughnutChart data={[data1, data2]} labels={labels} colors={colors} />
          </div>
        );
      }

      if (chartType === "point") {
        return (
          <div className="w-full h-[200px]">
            <PointChart data1={data1} data2={data2} labels={labels} />
          </div>
        );
      }
  };

  if(data1) data1.forEach((d) => total += d );
  if(data2) data2.forEach((d) => total += d );

  return (
    <div className="w-[300px] h-[300px] bg-white border rounded-lg shadow-md p-5">
      <div className="flex justify-between">
        <div>
          <h4 className="font-bold text-gray-700">{title}</h4>
          <p className="text-xs font-bold text-gray-500">{subtitle}</p>
        </div>
        <div>
          <span className="text-xl font-bold text-gray-700">{total}</span>
        </div>
      </div>
      <div className="w-full mt-5">{renderChart()}</div>
    </div>
  );
}
