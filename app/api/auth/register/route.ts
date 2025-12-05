import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';

type SafeUser = Omit<User, 'password'>;


export async function POST(request : Request) {
     try {
          const data = await request.json();
          const hashedPassword = await bcrypt.hash(data.password, 10);

          const newUser = await prisma.user.create({data: {
               email: data.email,
               name: data.name,
               password: hashedPassword,
          }});

          const { password: password, ...userWithoutPassword } = newUser;
          void password
          const safeUser: SafeUser = userWithoutPassword;
          return NextResponse.json(safeUser, {status: 201});
     } catch (error) {
          console.log("Este es el error: ",error)
          return NextResponse.json({message: "Error al crear el usuario"}, {status: 500})
     }
     
}
