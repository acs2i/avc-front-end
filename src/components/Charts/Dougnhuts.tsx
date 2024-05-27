// DoughnutChart.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: number[];
  labels: string[];
  colors?: string[];
  cutout?: string | number;
  showLabels?: boolean;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, labels, colors, cutout = '70%', showLabels = true }) => {
  const chartData = {
    labels: showLabels ? labels : [],
    datasets: [
      {
        data,
        backgroundColor: colors || ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: colors || ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout,
    plugins: {
      legend: {
        display: showLabels,
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
