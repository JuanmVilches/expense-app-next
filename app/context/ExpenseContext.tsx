"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Expense } from "@/app/types/expense";
import axios from "axios";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
interface ExpenseContextType {
  expenses: Expense[];
  totalsByCategory: Record<string, number>;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: number) => void;
  totalsByMonth: Record<number, number>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({
  children,
  initialExpenses = [],
}: {
  children: ReactNode;
  initialExpenses?: Expense[];
}) {
  const { data: session } = useSession();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  useEffect(() => {
    if (!session?.user) return;

    async function fetchExpenses() {
      const res = await axios.get(`/api/expenses?userId=${session?.user?.id}`);
      setExpenses(res.data);
    }

    fetchExpenses();
  }, [session?.user]);

  function addExpense(expense: Expense) {
    setExpenses((prev) => [expense, ...prev]);
  }

  const deleteExpense = (id: number) => {
    Swal.fire({
      icon: "error",
      text: "Se borrará permanentemente",
      showConfirmButton: true,
      showCancelButton: true,
    }).then(async (resultado) => {
      if (!resultado.isConfirmed) return;
      try {
        await axios.delete(`/api/expenses/${id}`, {
          data: { userId: session?.user?.id },
        });
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
        Swal.fire({
          icon: "success",
          title: "Gasto eliminado",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const totalsByCategory = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  const totalsByMonth = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).getMonth(); // 0–11
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<number, number>);
  }, [expenses]);

  return (
    <ExpenseContext
      value={{
        expenses,
        addExpense,
        deleteExpense,
        totalsByCategory,
        totalsByMonth,
      }}
    >
      {children}
    </ExpenseContext>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
}
