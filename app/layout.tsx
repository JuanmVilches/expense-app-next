import "./globals.css";
import SessionWrapper from "@/app/components/SessionProvider";
import Navigation from "./components/Navigation";
import { ExpenseProvider } from "@/app/context/ExpenseContext";
import { auth } from "@/lib/auth";
import { getUserExpenses } from "@/app/services/expenseService";
import type { ExpenseDb, Expense } from "@/app/types/expense";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtener la sesión en el servidor y pasarla al proveedor cliente
  const session = await auth();

  let initialExpenses: Expense[] | undefined = undefined;
  try {
    const userId = session?.user?.id ? Number(session.user.id) : undefined;
    if (userId) {
      const userExpenses = await getUserExpenses(userId);
      initialExpenses = userExpenses.map((r: ExpenseDb) => ({
        id: r.id,
        expense: r.expense,
        amount: r.amount,
        category: r.category,
        date: r.date.toISOString(),
        userId: r.userId,
      }));
    }
  } catch (e) {
    // ignore errors fetching initial expenses
    console.error("Error fetching initial expenses in layout:", e);
  }

  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col bg-black">
        <SessionWrapper session={session}>
          <Navigation />
          <ExpenseProvider initialExpenses={initialExpenses}>
            {children}
          </ExpenseProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
