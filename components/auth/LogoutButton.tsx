"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  async function logout() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={logout}>
      <LogOut size={17} /> Logout
    </Button>
  );
}
