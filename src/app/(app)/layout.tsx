import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/shell/app-shell";

export const metadata: Metadata = {
  title: {
    default: "Área do aluno · Coffee & Code",
    template: "%s · Coffee & Code",
  },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
