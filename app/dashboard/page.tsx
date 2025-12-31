import LineChart from "@/app/components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
export default function Dashboard() {
  return (
    <>
      <h2 className="text-white text-3xl font-bold text-center mt-10!">
        Visualiza tus gastos
      </h2>
      <p className="text-[#B3B3B3] text-center text-s mt-2!">
        Obtén datos gracias a nuestros gráficos
      </p>
      <div className="flex w-full h-1/2! justify-center items-center gap-4 p-10!">
        <LineChart />
        <BarChart />
      </div>
    </>
  );
}
