"use client";
import formStyles from "@/app/ui/form.module.css";
import Link from "next/link";
import { useForm } from "react-hook-form";

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
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    reset();
  });

  return (
    <>
      <div className={`${formStyles.container} w-1/2 p-4!`}>
        <h2 className="text-white w-full text-center">
          Formulario de registro
        </h2>
        <form
          action=""
          onSubmit={onSubmit}
          className="w-full lg:w-6/12 border p-8! bg-zinc-900 rounded-4xl border-amber-200 flex flex-col justify-around text-white gap-4"
        >
          <div className={formStyles.inputGroup}>
            <label htmlFor="name">Nombre</label>
            <input
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
            <label htmlFor="lastname">Apellido</label>
            <input
              className={formStyles.input}
              type="text"
              id="lastname"
              {...register("lastname", {
                minLength: 3,
                required: {
                  value: true,
                  message: "El apellido es requerido",
                },
              })}
            />
            {errors.lastname && (
              <span className={formStyles.error}>
                {errors.lastname.message}
              </span>
            )}
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
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
            <label htmlFor="password">Contraseña</label>
            <input
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
          <div className={formStyles.inputGroup}>
            <label htmlFor="repeatpassword">Repetir Contraseña</label>
            <input
              type="password"
              id="repeatpassword"
              className={formStyles.input}
              {...register("repeatpassword", {
                required: {
                  value: true,
                  message: "Debe repetir la contraseña",
                },
                validate: (value, formValues) =>
                  value === formValues.password ||
                  "Las contraseñas no coinciden",
              })}
            />
            {errors.repeatpassword && (
              <span className={formStyles.error}>
                {errors.repeatpassword.message}
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
            <Link className="text-blue-600" href={""}>
              Iniciar Sesión.
            </Link>
          </span>
        </form>
      </div>
    </>
  );
}
