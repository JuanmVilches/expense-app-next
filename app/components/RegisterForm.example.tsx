/**
 * EJEMPLO: RegisterForm conectado con backend
 *
 * Este es un ejemplo de cómo actualizar tu RegisterForm.tsx
 * para que se conecte con el backend usando las utilidades de lib/api.ts
 */

"use client";
import formStyles from "@/app/ui/form.module.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RegisterValues {
  name: string;
  lastname: string;
  email: string;
  password: string;
  repeatpassword: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>();

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Llamar al backend
      const response = await authAPI.register({
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      });

      // Guardar token de autenticación
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        // También puedes guardar información del usuario
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      // Limpiar formulario
      reset();

      // Redirigir o actualizar estado de autenticación
      router.push("/dashboard"); // o la ruta que prefieras
    } catch (err: any) {
      // Manejar errores
      setError(err.message || "Error al registrar usuario");
      console.error("Error en registro:", err);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <div className={`${formStyles.container} w-1/2 p-4!`}>
        <h2 className="text-white w-full text-center">
          Formulario de registro
        </h2>

        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>
        )}

        <form
          onSubmit={onSubmit}
          className="w-full lg:w-6/12 border p-8! bg-zinc-900 rounded-4xl border-amber-200 flex flex-col justify-around text-white gap-4"
        >
          {/* ... resto de tus campos del formulario ... */}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 p-2! rounded-xl mt-2! hover:bg-blue-500 transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>

          <span className="text-white text-center">
            Si ya tienes una cuenta,{" "}
            <Link className="text-blue-600" href="/login">
              Iniciar Sesión.
            </Link>
          </span>
        </form>
      </div>
    </>
  );
}
