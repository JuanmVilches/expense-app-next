import type { Expense, CreateExpensePayload } from "@/app/types";

// Simulado con localStorage (reemplazar con API real si es necesario)
// En producción, esto sería llamadas a endpoints /api/expenses

/**
 * Obtiene todos los gastos del usuario
 * NOTA: En producción, esto vendría del servidor/BD
 */
export async function getAllExpenses(userId: string): Promise<Expense[]> {
  // Placeholder: implementar con API call real
  return [];
}

/**
 * Crea un nuevo gasto
 * NOTA: En producción, POST a /api/expenses
 */
export async function createExpense(
  userId: string,
  payload: CreateExpensePayload
): Promise<Expense> {
  const expense: Expense = {
    id: Math.random().toString(36).substr(2, 9),
    ...payload,
  };
  return expense;
}

/**
 * Elimina un gasto
 * NOTA: En producción, DELETE a /api/expenses/:id
 */
export async function deleteExpense(expenseId: string): Promise<void> {
  // Placeholder
}

/**
 * Actualiza un gasto
 * NOTA: En producción, PATCH a /api/expenses/:id
 */
export async function updateExpense(
  expenseId: string,
  payload: Partial<CreateExpensePayload>
): Promise<Expense> {
  // Placeholder
  return {
    id: expenseId,
    descripcion: "",
    monto: 0,
    categoria: "Otros",
    fecha: "",
  };
}
