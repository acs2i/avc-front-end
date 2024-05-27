// BarChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data1: number[];
  data2: number[];
  labels: string[];
}

const BarChart: React.FC<BarChartProps> = ({ data1, data2, labels }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Projection',
        data: data1,
        backgroundColor: '#5a80d8',
        barThickness: 10,
      },
      {
        label: 'Actuel',
        data: data2,
        backgroundColor: '#7EC8E3',
        barThickness: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
