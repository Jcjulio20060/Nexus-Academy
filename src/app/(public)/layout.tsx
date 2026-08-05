import type { ReactNode } from "react";
import { PublicHeader } from "@/components/shell/public-header";
import { PublicFooter } from "@/components/shell/public-footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
