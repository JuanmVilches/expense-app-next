import RegisterForm from "@/app/components/RegisterForm";
// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";


export default async function Home() {
  // const session = await auth()
  // if(session) redirect("/")

  return (
    <div className="bg-black flex items-center flex-1"
    >
      <div className="w-1/2">
        <h2 className="text-white text-center text-4xl">
          Bievenido/a a la mejor aplicación de gastos web
        </h2>
        <p className="text-white text-center">
          En esta aplicación podrá guardar, visualizar, gestionar y tomar
          desiciones gracias a nuestros gráficos.
        </p>
        <p className="text-white text-center">
          Registrese para comenzar a utlizarla.
          
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
