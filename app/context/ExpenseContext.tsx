"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Expense } from "../definitions";
interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) setExpenses(JSON.parse(stored));
  }, []);
  

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);
  
  const addExpense = (expense: Expense) => {
    const newExpense : Expense = {
      ...expense,
      id: String(Date.now())
    }
    setExpenses((prev) => [...prev, newExpense])
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };


  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if(context === undefined) {
    throw new Error("error")
  }
  return context
}