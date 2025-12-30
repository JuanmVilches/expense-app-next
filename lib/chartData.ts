import { months } from "@/app/utils/months";
export const lineChartData = {
  labels: months.map((month) => month),
  datasets: [
    {
      label: "Expenses",
      data: [
        100000, 20000, 30000, 150000, 200000, 300000, 450000, 120000, 180000,
        200000, 230000, 240000,
      ],
      borderColor: "rgb(999,999,999)",
    },
  ],
};
