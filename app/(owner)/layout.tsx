import { Sidebar } from "@/components/sidebar";

export default function TablesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:pl-0 lg:pt-0">{children}</main>
    </div>
  );
}
