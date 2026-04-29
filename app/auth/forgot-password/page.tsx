import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Creative Modista account password."
};

export default function ForgotPasswordPage() {
  return (
    <div className="container-shell py-12">
      <AuthForm mode="forgot" />
    </div>
  );
}
