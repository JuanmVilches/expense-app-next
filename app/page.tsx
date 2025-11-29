import RegisterForm from "../app/components/RegisterForm";
export default async function Home() {
  return (
    <div
      className="bg-black min-h-dvh flex
    items-center "
    >
      <div className="w-1/2">
        <h2 className="text-white text-center">
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
