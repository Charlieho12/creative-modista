import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a Creative Modista account before checkout."
};

export default function SignUpPage() {
  return (
    <div className="container-shell py-12">
      <AuthForm mode="signup" />
    </div>
  );
}
