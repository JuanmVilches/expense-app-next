import "./globals.css";

import Navigation from "./components/Navigation";
import { ExpenseProvider } from "@/app/context/ExpenseContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <ExpenseProvider>
          {children}
        </ExpenseProvider>
      </body>
    </html>
  );
}
