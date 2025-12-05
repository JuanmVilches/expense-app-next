import FormOutline from "@/lib/icons/FormOutline";
import HomeOutline from "@/lib/icons/HomeOutline";
import ListOutline from "@/lib/icons/ListOutline"
export const navLinks = [
  { href: "/", label: "Home", icon: HomeOutline },
  { href: "/form", label: "Form", icon: FormOutline },
  { href: "/list", label: "List", icon: ListOutline },
];

export interface Expense {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
  id: string;
}
