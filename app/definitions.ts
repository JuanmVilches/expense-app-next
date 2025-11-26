export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/form", label: "Form" },
  { href: "/list", label: "List" },
];

export interface Expense {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
  id: string;
}
