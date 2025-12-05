import "./globals.css";
import SessionWrapper from "@/app/components/SessionProvider";
import Navigation from "./components/Navigation";
import { ExpenseProvider } from "@/app/context/ExpenseContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col bg-black">
        <SessionWrapper>
          <Navigation />
          <ExpenseProvider>{children}</ExpenseProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
