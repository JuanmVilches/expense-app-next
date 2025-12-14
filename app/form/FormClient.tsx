"use client";
import formStyles from "@/app/ui/form.module.css";
import { useForm } from "react-hook-form";
import { useExpenses } from "@/app/context/ExpenseContext";
import { useAuth } from "../hooks";
import axios from "axios";
import Swal from "sweetalert2";

interface FormValues {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
  id: string;
}

export default function FormClient() {
  const { user } = useAuth();
  const { addExpense } = useExpenses();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!user) {
        console.log("Usuario no autenticado");
        return;
      }

      const payload = {
        ...data,
        monto: Number(data.monto),
        userId: Number(user.id),
        fecha: new Date(),
      };

      const res = await axios.post("/api/expenses", payload);

      addExpense(res.data);
      Swal.fire({
        icon: "success",
        text: "Agregado con éxito!",
        showConfirmButton: false,
        timer: 1600,
      });
      reset();
    } catch (error) {
      console.log("Error al crear gasto", error);
    }
  });

  return (
    <>
      <div className={formStyles.container}>
        <h2 className="text-white text-3xl font-bold">Agregar Gasto</h2>
        <p className="text-[#B3B3B3] text-center text-s mt-2!">
          Agrega tus gastos y visualizalos en la lista
        </p>
        <form
          action=""
          onSubmit={onSubmit}
          className="w-6/12 border p-8! bg-zinc-900 rounded-4xl border-amber-200 flex flex-col justify-around text-white gap-4 mt-8!"
        >
          <div className={formStyles.inputGroup}>
            <label htmlFor="descripcion">Descripción</label>
            <input
              type="text"
              id="descripcion"
              className={formStyles.input}
              {...register("descripcion", {
                required: {
                  value: true,
                  message: "La descripción es requerida",
                },
              })}
            />
            {errors.descripcion && (
              <span className={formStyles.error}>
                {errors.descripcion.message}
              </span>
            )}
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="monto">Monto</label>
            <input
              type="number"
              id="monto"
              className={formStyles.input}
              {...register("monto", {
                required: {
                  value: true,
                  message: "El monto es requerido",
                },
              })}
            />
            {errors.monto && (
              <span className={formStyles.error}>{errors.monto.message}</span>
            )}
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              className={formStyles.input}
              {...register("categoria", {
                required: {
                  value: true,
                  message: "La categoria es requerida",
                },
              })}
            >
              <option value=""></option>
              <option value="Supermercado">Supermercado</option>
              <option value="Ropa">Ropa</option>
              <option value="Regalos">Regalos</option>
              <option value="Transporte">Transporte</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Otros">Otros</option>
            </select>
            {errors.categoria && (
              <span className={formStyles.error}>
                {errors.categoria.message}
              </span>
            )}
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="">Fecha</label>
            <input
              type="date"
              className={formStyles.input}
              {...register("fecha", {
                required: {
                  value: true,
                  message: "La fecha es requerida",
                },
              })}
            />
            {errors.fecha && (
              <span className={formStyles.error}>{errors.fecha.message}</span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 p-2! rounded-xl mt-2! hover:bg-blue-500 transition duration-300 cursor-pointer"
          >
            Agregar gasto
          </button>
        </form>
      </div>
    </>
  );
}
