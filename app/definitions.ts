export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/form", label: "Form" },
  { href: "/list", label: "List" },
];

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}
