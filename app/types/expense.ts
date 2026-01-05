export interface Expense {
  id: number;
  expense: string;
  amount: number;
  category: string;
  date: string;
  userId?: number;
}
export interface ExpenseDb {
  id: number;
  expense: string;
  amount: number;
  category: string;
  date: Date;
  userId?: number;
}
export interface CreateExpensePayload {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
  userId: number;
}

export type ExpenseCategory =
  | "Supermercado"
  | "Ropa"
  | "Regalos"
  | "Transporte"
  | "Tarjeta"
  | "Otros";
