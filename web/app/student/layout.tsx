import { AppShell } from "@/components/AppShell";

export default function StudentLayout({ children }: LayoutProps<"/student">) {
  return <AppShell role="student">{children}</AppShell>;
}
