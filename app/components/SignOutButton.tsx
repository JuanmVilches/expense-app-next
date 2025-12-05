import Logout from "@/lib/icons/LogoOut";
import { signOut } from "next-auth/react";
export default function SignOutButton() {
  async function signOutSession() {
    const cerrarSesion = confirm("Su sesión se cerrar");
    if (cerrarSesion) await signOut();
  }
  return (
    <button
      className="rounded-md w-30 text-center bg-red-500 cursor-pointer hover:bg-red-400 duration-300 flex items-center justify-center gap-1"
      onClick={signOutSession}
    >
      <span>{<Logout />}</span>
      Cerrar sesión
    </button>
  );
}
