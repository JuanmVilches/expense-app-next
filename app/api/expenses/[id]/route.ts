import { NextResponse } from "next/server";
import { deleteExpenseUser } from "@/app/services/expenseService";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    const result = await deleteExpenseUser(Number(id), Number(userId));

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { success: false, error: "Error deleting expense" },
      { status: 500 }
    );
  }
}
