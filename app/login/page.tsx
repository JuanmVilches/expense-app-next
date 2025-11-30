import formStyles from "@/app/ui/form.module.css";
import { signIn } from "@/lib/auth";
export default function Login() {

    return <>
    <div className="flex flex-1 bg-black items-center justify-center">
    <form
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)}} 
        className="w-1/4 h-[300px] border p-8! bg-zinc-900 rounded-4xl border-amber-200 flex flex-col justify-around text-white gap-4">
            <h2 className="text-4xl text-center">Iniciar sesión</h2>
            <input className={formStyles.input} type="email" name="email" placeholder="Escriba su email" />
            <input className={formStyles.input} type="password" name="password" placeholder="Escriba su contraseña"/>
            <button
            type="submit"
            className="bg-blue-600 p-2! rounded-xl mt-2! hover:bg-blue-500 transition duration-300 cursor-pointer"
          >
            Iniciar sesión
          </button>
        </form>
       
    </div>
    </>
}