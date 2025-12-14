"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Expense } from "@/app/types/expense";
import axios from "axios";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: number) => void;
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

  return (
    <ExpenseContext
      value={{
        expenses,
        addExpense,
        deleteExpense,
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
