import { NextResponse } from "next/server";
import { createExpense, getUserExpenses } from "@/app/services/expenseService";

export async function GET(request: Request) {
  try {
    const userid = Number(new URL(request.url).searchParams.get("userId"));
    console.log("Fetching expenses for userId:", userid);
    if (!userid) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const expenses = await getUserExpenses(userid);
    console.log("Expenses fetched:", expenses);
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/expenses:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error fetching expenses", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Creating expense with payload:", body);
    const newExpense = await createExpense(body);
    console.log("Expense created:", newExpense);

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/expenses:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error creating expense", details: errorMessage },
      { status: 500 }
    );
  }
}
