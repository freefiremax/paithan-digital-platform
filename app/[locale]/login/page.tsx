import { Suspense } from "react";
import { CitizenAuth } from "@/components/auth/CitizenAuth";

export default function Page() {
  return <Suspense><CitizenAuth mode="login" /></Suspense>;
}
