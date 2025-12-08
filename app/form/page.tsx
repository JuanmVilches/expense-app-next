import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import FormClient from "./FormClient";

export default async function FormPage() {
  const session = await auth();
  console.log("sesion: ", session);
  if (!session) {
    redirect("/login");
  }

  return <FormClient />;
}
