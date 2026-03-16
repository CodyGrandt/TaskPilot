import { syncUser } from "@/lib/syncUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await syncUser();
  return <>{children}</>;
}
