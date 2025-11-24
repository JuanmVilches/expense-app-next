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
        <ExpenseProvider>
          <Navigation />
          {children}
        </ExpenseProvider>
      </body>
    </html>
  );
}
