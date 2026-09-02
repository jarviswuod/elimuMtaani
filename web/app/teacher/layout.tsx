import { AppShell } from "@/components/AppShell";

export default function TeacherLayout({ children }: LayoutProps<"/teacher">) {
  return <AppShell role="teacher">{children}</AppShell>;
}
