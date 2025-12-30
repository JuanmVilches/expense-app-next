import { auth } from "@/lib/auth";
import { expensesByCategory } from "../services/expenseService";
import ListClient from "./ListClient";

export default async function ListPage() {
  const session = await auth();
  const amount = await expensesByCategory(Number(session?.user?.id));
  console.log(amount);
  return <ListClient />;
}
