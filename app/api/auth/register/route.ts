import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function POST(request : Request) {
     try {
          const data = await request.json()
     console.log(data)

     const newUser = await prisma.user.create({data: {
          email: data.email,
          name: data.name,
          password: data.password,
     }})
     return NextResponse.json(newUser, {status: 201})
     } catch (error) {
          console.log("Este es el error: ",error)
          return NextResponse.json({message: "Error al crear el usuario"}, {status: 500})
     }
     
}
