import { z } from "zod";

export const EXPENSE_CATEGORIES = [
  "Supermercado",
  "Ropa",
  "Regalos",
  "Transporte",
  "Tarjeta",
  "Otros",
] as const;

export const EXPENSE_VALIDATION = {
  descripcion: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .max(100, "La descripción no puede exceder 100 caracteres"),
  monto: z
    .number()
    .positive("El monto debe ser un número positivo")
    .max(999999, "El monto es demasiado grande"),
  categoria: z.enum(EXPENSE_CATEGORIES),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),
};

export const createExpenseSchema = z.object(EXPENSE_VALIDATION);
