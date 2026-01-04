import { NextResponse } from "next/server";
import { createUser } from "@/app/services";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const user = await createUser(data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error al crear el usuario" },
      { status: 500 }
    );
  }
}
