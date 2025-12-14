"use client";
import Logout from "@/lib/icons/LogoOut";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";
export default function SignOutButton() {
  async function signOutSession() {
    Swal.fire({
      icon: "question",
      title: "Cerrar sesión?",
      showConfirmButton: true,
      showCancelButton: true,
    })
      .then(async (resultado) => {
        if (!resultado.isConfirmed) return;
        await signOut();
      })
      .catch((error) => {
        console.log(error);
      });
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
