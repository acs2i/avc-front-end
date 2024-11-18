import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export type ChartTypes = 'bar' | 'line' | 'pie' | 'point' | 'doughnut';

interface ChartData {
  data1: number[];
  labels: string[];
}

interface InitialDataType {
  [key: string]: ChartData;
}

interface CardHomeProps {
  title: string;
  subtitle: string;
  data1?: number[];
  data2?: number[];
  labels?: string[];
  chartType: ChartTypes;
}

interface ChartDataState {
  data1: number[];
  data2: number[];
  labels: string[];
}

const INITIAL_DATA: InitialDataType = {
  pie: {
    data1: [50, 50],
    labels: ['Initial 1', 'Initial 2']
  },
  bar: {
    data1: [30, 40, 35, 45, 38],
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai']
  },
  line: {
    data1: [30, 40, 35, 45, 38],
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai']
  },
  point: {
    data1: [30, 40, 35, 45, 38],
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai']
  },
  doughnut: {
    data1: [50, 50],
    labels: ['Initial 1', 'Initial 2']
  }
};

const CardHome: React.FC<CardHomeProps> = ({
  title,
  subtitle,
  data1,
  data2,
  labels,
  chartType
}) => {
  const [chartData, setChartData] = useState<ChartDataState>({
    data1: INITIAL_DATA[chartType]?.data1 || [],
    data2: [],
    labels: INITIAL_DATA[chartType]?.labels || []
  });

  useEffect(() => {
    if (data1 && data1.length > 0) {
      setChartData({
        data1,
        data2: data2 || [],
        labels: labels || []
      });
    }
  }, [data1, data2, labels]);

  const colors = {
    primary: '#4682B4',
    secondary: '#B0C4DE',
  };

  const calculateTotal = (): number => {
    let total = 0;
    if (chartData.data1?.length) {
      total += chartData.data1.reduce((sum: number, val: number) => sum + val, 0);
    }
    if (chartData.data2?.length) {
      total += chartData.data2.reduce((sum: number, val: number) => sum + val, 0);
    }
    return total;
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
      },
    },
  };

  const renderLineChart = () => {
    const data = {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Série 1',
          data: chartData.data1,
          borderColor: colors.primary,
          backgroundColor: colors.primary,
          tension: 0.3,
        },
        ...(chartData.data2?.length ? [{
          label: 'Série 2',
          data: chartData.data2,
          borderColor: colors.secondary,
          backgroundColor: colors.secondary,
          tension: 0.3,
        }] : []),
      ],
    };

    return (
      <Line
        data={data}
        options={{
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        }}
      />
    );
  };

  const renderBarChart = () => {
    const data = {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Série 1',
          data: chartData.data1,
          backgroundColor: colors.primary,
        },
        ...(chartData.data2?.length ? [{
          label: 'Série 2',
          data: chartData.data2,
          backgroundColor: colors.secondary,
        }] : []),
      ],
    };

    return (
      <Bar
        data={data}
        options={{
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        }}
      />
    );
  };

  const renderPieChart = () => {
    const data = {
      labels: chartData.labels,
      datasets: [{
        data: chartData.data1,
        backgroundColor: [colors.primary, colors.secondary],
        borderWidth: 1,
        borderColor: 'white',
      }],
    };

    return (
      <Doughnut
        data={data}
        options={{
          ...baseOptions,
          cutout: '60%',
        }}
      />
    );
  };

  const renderChart = () => {
    switch (chartType.toLowerCase() as ChartTypes) { // Cast the chartType to ChartTypes
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
      case 'doughnut':
        return renderPieChart();
      case 'point':
        return renderLineChart();
      default:
        // Handle the case where chartType is not a valid ChartTypes
        return null;
    }
  };

  return (
    <div className="w-[300px] h-[300px] bg-white dark:bg-gray-800 border rounded-lg shadow-md p-5">
      <div className="flex justify-between">
        <div>
          <h4 className="font-bold text-gray-700 dark:text-white">{title}</h4>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-300">
            {subtitle}
          </p>
        </div>
        <div>
          <span className="text-xl font-bold text-gray-700 dark:text-white">
            {calculateTotal()}
          </span>
        </div>
      </div>
      <div className="w-full mt-5">
        {renderChart()}
      </div>
    </div>
  );
};

export default CardHome;