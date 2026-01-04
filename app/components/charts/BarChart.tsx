"use client";
import { Bar } from "react-chartjs-2";
import { getBarChartData } from "@/lib/chartData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useExpenses } from "@/app/context/ExpenseContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart() {
  const { totalsByCategory } = useExpenses();
  const options = {};
  return (
    <Bar
      options={options}
      data={getBarChartData(totalsByCategory)}
      className="max-w-1/2! bg-white "
    ></Bar>
  );
}
