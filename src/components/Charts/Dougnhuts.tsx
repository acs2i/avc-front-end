import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: number[][];
  labels?: string[];
  colors?: string[][];
  cutout?: string | number;
  showLabels?: boolean;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, labels, colors, cutout = '70%', showLabels = true }) => {
  const datasets = data.map((dataset, index) => ({
    data: dataset,
    backgroundColor: colors ? colors[index] : ['#FF6384', '#36A2EB', '#FFCE56'],
    hoverBackgroundColor: colors ? colors[index] : ['#FF6384', '#36A2EB', '#FFCE56'],
  }));

  const chartData = {
    labels: showLabels ? labels : [],
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout,
    plugins: {
      legend: {
        display: showLabels,
        position: 'bottom' as const, // Position the legend at the bottom
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
