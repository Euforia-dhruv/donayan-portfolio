export const dynamic = "force-dynamic";
import AdminShell from "./AdminShell";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
