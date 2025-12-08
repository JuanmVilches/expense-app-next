export interface Expense {
  id: string;
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
}

export interface CreateExpensePayload {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
}

export type ExpenseCategory =
  | "Supermercado"
  | "Ropa"
  | "Regalos"
  | "Transporte"
  | "Tarjeta"
  | "Otros";
