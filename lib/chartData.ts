import { months } from "@/app/utils/months";
import { EXPENSE_CATEGORIES } from "@/app/constants/expenses";

export function getLineChartData(totalsByMonth: Record<number, number>) {
  return {
    labels: months,
    datasets: [
      {
        label: "Gastos por mes",
        data: months.map((_, index) => totalsByMonth[index] || 0),
        tension: 0.1,
        borderColor: "rgb(21,93,252)",
      },
    ],
  };
}

export function getBarChartData(totalsByCategory: Record<string, number>) {
  return {
    labels: EXPENSE_CATEGORIES.map((category) => category),
    datasets: [
      {
        label: "Gastos por categoría",
        data: EXPENSE_CATEGORIES.map(
          (category) => totalsByCategory[category] || 0
        ),
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 252)",
        ],
      },
    ],
  };
}
