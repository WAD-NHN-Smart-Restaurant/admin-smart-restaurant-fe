import { KitchenNavbar } from "@/components/kitchen-navbar";

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <KitchenNavbar />
      {/* Main content with padding for mobile top bar and desktop sidebar */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
