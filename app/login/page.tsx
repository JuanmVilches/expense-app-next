"use client";
import formStyles from "@/app/ui/form.module.css";
import Swal from "sweetalert2";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (res.error) {
        Swal.fire({
          icon: "error",
          title: "Email o contraseña incorrecto.",
          showConfirmButton: false,
          timer: 1600,
        });
        return res;
      }
      router.push("/form");
      Swal.fire({
        title: "Inicio de sesión exitoso!",
        icon: "success",
        showConfirmButton: false,
        timer: 1600,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <>
      <div className="flex flex-1 bg-black items-center justify-center">
        <form
          onSubmit={onSubmit}
          className="min-w-1/4 m-h-[300px] border p-8! bg-zinc-900 rounded-4xl border-amber-200 flex flex-col justify-around text-white gap-4"
        >
          <h2 className="text-4xl text-center">Iniciar sesión</h2>
          <input
            className={formStyles.input}
            type="email"
            placeholder="Escriba su email"
            {...register("email")}
          />
          <input
            className={formStyles.input}
            type="password"
            placeholder="Escriba su contraseña"
            {...register("password")}
          />
          <button
            type="submit"
            className="bg-blue-600 p-2! rounded-xl mt-2! hover:bg-blue-500 transition duration-300 cursor-pointer"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </>
  );
}
