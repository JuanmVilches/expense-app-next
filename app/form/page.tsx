import formStyles from "@/app/ui/form.module.css";
export default function Form() {
  return (
    <>
      <div className={formStyles.container}>
        <h2 className="text-white">Agregar Gasto</h2>
        <form
          action=""
          className="w-96 h-96 !mx-auto border !p-8 bg-zinc-900 rounded-4xl border-amber-200 flex flex-col justify-around text-white"
        >
          <div className={formStyles.inputGroup}>
            <label htmlFor="">Gasto</label>
            <input type="text" className={formStyles.input} />
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="">Monto</label>
            <input type="number" className={formStyles.input} />
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="">Descripcion</label>
            <input type="text" className={formStyles.input} />
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="">Fecha</label>
            <input type="date" className={formStyles.input} />
          </div>
        </form>
      </div>
    </>
  );
}
