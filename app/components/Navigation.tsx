"use client";
import { navLinks } from "@/app/definitions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";
import { useSession } from "next-auth/react";
import Signin from "@/lib/icons/SignIn";

export default function Navigation() {
  const pathname = usePathname();
  const { data: sesion, status } = useSession();
  const filteredLinks =
    status === "authenticated"
      ? navLinks
      : navLinks.filter((link) => link.href === "/");
  return (
    <header>
      <nav className="bg-[#27272a] text-white p-4! h-full">
        <ul className="flex gap-8 justify-center h-full items-center">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`h-full hover:bg-gray-500 bg-gray-600 p-2! rounded-md w-20 text-center duration-300 flex items-center justify-center gap-1 ${
                  isActive
                    ? "bg-blue-600! hover:bg-blue-500! duration-300 "
                    : ""
                }`}
              >
                <span>{Icon && <Icon />}</span>
                {link.label}
              </Link>
            );
          })}
          {status === "authenticated" ? (
            <>
              <span>Bienvenido {sesion.user?.name}</span>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center bg-white hover:bg-gray-200 duration-300 p-2! rounded-md gap-1 text-black"
            >
              <Signin />
              Iniciar Sesión
            </Link>
          )}
        </ul>
      </nav>
    </header>
  );
}
