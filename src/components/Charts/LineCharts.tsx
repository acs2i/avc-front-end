import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SparkLineChartProps {
  data1: number[];
  data2: number[];
  labels: string[];
  height?: number;
  width?: number;
  color1?: string;
  color2?: string;
}

const SparkLineChart: React.FC<SparkLineChartProps> = ({
  data1,
  data2,
  labels,
  height = 50,
  width = 200,
  color1 = '#5a80d8',
  color2 = '#87CEEB',
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: data1,
        borderColor: color1,
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
      {
        label: 'Dataset 2',
        data: data2,
        borderColor: color2,
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          display: true,
          font: {
            size: 10,
          },
        },
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      line: {
        tension: 0
      },
    },
  };

  return <Line data={chartData} options={options} height={height} width={width} />;
};

export default SparkLineChart;
