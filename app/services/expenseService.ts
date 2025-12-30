import type { CreateExpensePayload } from "@/app/types/expense";
import { prisma } from "@/lib/prisma";

export async function createExpense(payload: CreateExpensePayload) {
  const newExpense = await prisma.expenses.create({
    data: {
      expense: payload.descripcion,
      amount: payload.monto,
      category: payload.categoria,
      date: payload.fecha,
      userId: payload.userId,
    },
  });
  return newExpense;
}

export async function getUserExpenses(userId: number) {
  return await prisma.expenses.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
}

export async function getExpenseById(id: number, userId: number) {
  return await prisma.expenses.findFirst({
    where: { id, userId },
  });
}

export async function deleteExpenseUser(id: number, userId: number) {
  const expense = await prisma.expenses.findFirst({
    where: { id, userId },
  });

  if (!expense) {
    throw new Error("No tienes permiso para borrar este gasto.");
  }
  return prisma.expenses.delete({
    where: { id },
  });
}

export async function expensesByCategory(userId: number) {
  const res = await prisma.expenses.groupBy({
    by: "category",
    where: { userId },
    _sum: { amount: true },
  });
  return res;
}
