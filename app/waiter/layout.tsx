import { WaiterNavbar } from "@/components/waiter-navbar";

export default function WaiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <WaiterNavbar />
      {/* Main content with padding for mobile bottom nav and desktop sidebar */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
