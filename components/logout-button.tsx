"use client";

import { LogOut } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button onClick={() => logoutAction()} variant="outline" size="icon">
      <LogOut />
      <span className="sr-only">Log out</span>
    </Button>
  );
}
