"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { logoutAction } from "@/actions/auth";

export default function LogoutButton() {
  return (
    <Button onClick={() => logoutAction()} variant="ghost">
      <LogOut />
    </Button>
  );
}
