import { prisma } from "@/lib/prisma";
import type { User, RegisterPayload } from "@/app/types";
import bcrypt from "bcryptjs";

/**
 * Busca un usuario por email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}

/**
 * Busca un usuario por ID
 */
export async function getUserById(id: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}

/**
 * Crea un nuevo usuario con contraseña hasheada
 */
export async function createUser(payload: RegisterPayload): Promise<User> {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      email: payload.email,
      name: payload.name,
      password: hashedPassword,
    },
  });

  return user;
}

/**
 * Verifica si un email ya existe
 */
export async function emailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return !!user;
}
