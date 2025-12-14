import { prisma } from "@/lib/prisma";
import type {RegisterPayload } from "@/app/types/user";
import { SafeUser } from "../types/user";
import bcrypt from "bcryptjs";

/**
 * Busca un usuario por email
 */
// export async function getUserByEmail(email: string): Promise<User | null> {
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });
//   return user;
// }

/**
 * Busca un usuario por ID
 */
// export async function getUserById(id: number): Promise<User | null> {
//   const user = await prisma.user.findUnique({
//     where: { id },
//   });
//   return user;
// }

//** Crear usuario 
export async function createUser (payload : RegisterPayload): Promise<SafeUser>{
  try {
    const hashedPassword = await bcrypt.hash(payload.password, 10)
    const newUser = await prisma.user.create({data: {
      email: payload.email,
      name: payload.name,
      password: hashedPassword
    }})

    const {password, ...safeUser} = newUser
    void password
    return safeUser as SafeUser
  } catch (error) {
    console.log("Error al crear el usuario", error)
    throw new Error("Error al crear usuario")
  }
}

/**
 * Verifica si un email ya existe
 */
// export async function emailExists(email: string): Promise<boolean> {
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });
//   return !!user;
// }
