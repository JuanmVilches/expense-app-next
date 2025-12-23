"use client";
import { useExpenses } from "../context/ExpenseContext";
import { formatDate } from "../utils/dateFormatter";
import listStyles from "@/app/ui/list.module.css";

export default function ListClient() {
  const { expenses, deleteExpense } = useExpenses();
  console.log(expenses);

  return (
    <>
      <main className="bg-black p-6! flex-1">
        <h2 className="text-white text-4xl text-center pt-7! font-bold">
          Lista de gastos
        </h2>
        <p className="text-[#B3B3B3] text-center text-s mt-2!">
          Visualiza y gestiona tus gastos
        </p>
        <div className={listStyles.container}>
          <div></div>
          {expenses.map((expense) => (
            <div
              className="flex justify-between p-4! bg-[#333333] text-white rounded-xl border border-zinc-200 hover:bg-[#4D4D4D] transition duration-200"
              key={expense.id}
            >
              <div className="flex items-center gap-6 mt-2.5">
                <div className="col">
                  <span>{expense.expense}</span>
                  <p>{formatDate(expense.date)}</p>
                </div>
                <span className="bg-blue-400 p-1! rounded text-white text-sm">
                  {expense.category}
                </span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-red-400 font-bold text-lg">
                  ${expense.amount}
                </span>
                <button
                  className="cursor-pointer"
                  onClick={() => deleteExpense(expense.id)}
                >
                  Eliminar{" "}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
