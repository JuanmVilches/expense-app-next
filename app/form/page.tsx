"use client";
import formStyles from "@/app/ui/form.module.css";
import { useForm } from "react-hook-form";
import {useExpenses} from "@/app/context/ExpenseContext"

interface FormValues {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
  id: string
}

export default function Form() {
  const {addExpense} = useExpenses() 
  const {register, reset, handleSubmit, formState:{errors}} = useForm<FormValues>()

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    addExpense(data)
    reset()
  })

  return (
    <>
      <div className={formStyles.container}>
        <h2 className="text-white text-3xl mb-6! font-bold">Agregar Gasto</h2>
        <form
          action=""
          onSubmit={onSubmit}
          className="w-96 mx-auto! border p-8! bg-zinc-900 rounded-4xl border-amber-200 flex flex-col justify-around text-white gap-4"
        >
          <div className={formStyles.inputGroup}>
            <label htmlFor="descripcion">Descripción</label>
            <input type="text" id="descripcion" className={formStyles.input}
            {...register("descripcion", {
              required: {
                value: true,
                message: "La descripción es requerida"
              }
            })} />
            {errors.descripcion && <span className={formStyles.error}>{errors.descripcion.message}</span>}
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="monto">Monto</label>
            <input type="number" id="monto" className={formStyles.input} {...register("monto", {
              required: {
                value: true,
                message: "El monto es requerido"
              }
            })} />
            {errors.monto && <span className={formStyles.error}>{errors.monto.message}</span>}
          </div>
          <div className={formStyles.inputGroup}> 
            <label htmlFor="categoria">Categoria</label>
            <select id="categoria" className={formStyles.input}
            {...register("categoria", {
              required: {
                value: true,
                message: "La categoria es requerida"
              }
            })}>
            <option value=""></option>
            <option value="Supermercado">Supermercado</option>
            <option value="Ropa">Ropa</option>
            <option value="Regalos">Regalos</option>
            <option value="Transporte">Transporte</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Otros">Otros</option>
            </select>
            {errors.categoria && <span className={formStyles.error}>{errors.categoria.message}</span>}
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="">Fecha</label>
            <input type="date" className={formStyles.input} {...register("fecha", {
              required: {
                value: true,
                message: "La fecha es requerida"
              }
            })}/>
            {errors.fecha && <span className={formStyles.error}>{errors.fecha.message}</span>}
          </div>
          <button type="submit" className="bg-blue-500 p-2! rounded-xl mt-2! hover:bg-blue-800 transition duration-300 cursor-pointer">Agregar gasto</button>
        </form>
      </div>
    </>
  );
}
