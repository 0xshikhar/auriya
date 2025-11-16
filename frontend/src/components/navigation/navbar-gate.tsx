"use client";

import { usePathname } from "next/navigation";
import NavbarApp from "@/components/navigation/navbarapp";

export default function NavbarGate() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <NavbarApp />;
}
