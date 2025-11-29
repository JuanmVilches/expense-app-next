"use client";
import { navLinks } from "@/app/definitions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <header>
      <nav className="bg-[#27272a] text-white p-4! h-full">
        <ul className="flex gap-8 justify-center h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            console.log(isActive);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`h-full hover:bg-gray-500 bg-gray-600 p-1! rounded-md w-20 text-center duration-300 ${
                  isActive
                    ? "bg-blue-600! hover:bg-blue-500! duration-300 "
                    : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
