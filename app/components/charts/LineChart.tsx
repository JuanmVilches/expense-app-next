"use client";
import { Line } from "react-chartjs-2";
import { getLineChartData } from "@/lib/chartData";
import { useExpenses } from "@/app/context/ExpenseContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart() {
  const { totalsByMonth } = useExpenses();
  const options = {};
  return (
    <Line
      options={options}
      data={getLineChartData(totalsByMonth)}
      className="max-w-1/2! bg-white "
    />
  );
}
