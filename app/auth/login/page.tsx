import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Creative Modista account."
};

export default function LoginPage() {
  return (
    <div className="container-shell py-12">
      <AuthForm mode="login" />
    </div>
  );
}
