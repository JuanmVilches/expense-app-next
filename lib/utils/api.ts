import { NextResponse } from "next/server";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Crea una respuesta API exitosa
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Crea una respuesta API con error
 */
export function errorResponse(
  error: string,
  status = 400
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

/**
 * Maneja errores comunes de validación Zod
 */
export function handleValidationError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Validation error";
}
