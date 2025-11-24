import { navLinks } from "@/app/definitions";
import Link from "next/link";
export default function Navigation() {
  return (
    <header>
      <nav className="!bg-black text-white !p-4 h-full">
        <ul className="flex gap-8 justify-center h-full">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-gray-400 h-full !bg-blue-600 !p-2 rounded-2xl w-20 text-center   "
            >
              {link.label}
            </Link>
          ))}
        </ul>
      </nav>
    </header>
  );
}
