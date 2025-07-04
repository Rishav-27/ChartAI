"use client";

import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  RadialLinearScale,
} from "chart.js";

import { ChartDataType } from "@/types/chart";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  RadialLinearScale
);

export default function ChartRenderer({ data }: { data: ChartDataType }) {
  // ✅ Handle missing data gracefully
  if (!data || !data.chartType || !data.labels || !data.datasets) {
    return (
      <div className="text-center text-red-500 p-4">
        Invalid chart data
      </div>
    );
  }

  const chartType = data.chartType.toLowerCase();

  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
    radar: Radar,
    polararea: PolarArea, // note: lowercase key to match .toLowerCase()
  }[chartType];

  if (!ChartComponent) {
    return (
      <div className="text-center text-red-500 p-4">
        Unsupported chart type: <strong>{data.chartType}</strong>
      </div>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: data.datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: !!data.title,
        text: data.title,
      },
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="w-full max-w-[600px] h-[400px] mx-auto">
      <ChartComponent data={chartData} options={options} />
    </div>
  );
}
