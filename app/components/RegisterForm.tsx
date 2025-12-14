"use client";
import formStyles from "@/app/ui/form.module.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface RegisterValues {
  name: string;
  lastname: string;
  email: string;
  password: string;
  repeatpassword: string;
  id: string;
  createdAt: Date;
}

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await axios.post("/api/auth/register", data);
      console.log(res.data);
      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Usuario creado con éxito!",
          showConfirmButton: false,
          timer: 1600,
        });
        router.push("/login");
      }
      reset();
    } catch (error) {
      console.log("Este es el error: ", error);
    }
  });

  return (
    <>
      <div className={`${formStyles.container} w-1/2 p-4!`}>
        <h2 className="text-white text-3xl font-bold">
          Formulario de registro
        </h2>

        <form
          onSubmit={onSubmit}
          className="w-full lg:w-6/12 border p-8! bg-zinc-900 rounded-4xl border-amber-200 flex flex-col justify-around text-white gap-1 mt-2!"
        >
          <div className={formStyles.inputGroup}>
            <label htmlFor="name" className="p-1.5!">
              Nombre
            </label>
            <input
              placeholder="John"
              type="text"
              id="name"
              className={formStyles.input}
              {...register("name", {
                minLength: 3,
                required: {
                  value: true,
                  message: "El nombre es requerido",
                },
              })}
            />
            {errors.name && (
              <span className={formStyles.error}>{errors.name.message}</span>
            )}
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="email" className="p-1.5!">
              Email
            </label>
            <input
              placeholder="johndoe@gmail.com"
              className={formStyles.input}
              id="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "El email es requerido",
                },
              })}
            />
            {errors.email && (
              <span className={formStyles.error}>{errors.email.message}</span>
            )}
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="password" className="p-1.5!">
              Contraseña
            </label>
            <input
              placeholder="**************"
              type="password"
              id="password"
              className={formStyles.input}
              {...register("password", {
                required: {
                  value: true,
                  message: "La contraseña es requerida",
                },
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              })}
            />
            {errors.password && (
              <span className={formStyles.error}>
                {errors.password.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 p-2! rounded-xl mt-2! hover:bg-blue-500 transition duration-300 cursor-pointer"
          >
            Registrarse
          </button>
          <span className="text-white text-center">
            Si ya tienes una cuenta,{" "}
            <Link className="text-blue-600" href={"/login"}>
              Iniciar Sesión.
            </Link>
          </span>
        </form>
      </div>
    </>
  );
}
