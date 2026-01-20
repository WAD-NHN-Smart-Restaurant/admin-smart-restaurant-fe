"use client";

import { useState, useCallback, createContext, useContext } from "react";
import { WaiterNavbar } from "@/components/waiter-navbar";
import { useWaiterSocketListeners } from "@/hooks/use-waiter-query";
import { usePathname } from "next/navigation";
import { PROTECTED_PATHS } from "@/data/path";

// Context to share called tables state across pages
interface WaiterLayoutContextType {
  calledTableIds: Set<string>;
  addCalledTable: (tableId: string) => void;
  clearCalledTable: (tableId: string) => void;
}

const WaiterLayoutContext = createContext<WaiterLayoutContextType | undefined>(
  undefined,
);

export function useWaiterLayoutContext() {
  const context = useContext(WaiterLayoutContext);
  if (!context) {
    throw new Error("useWaiterLayoutContext must be used within WaiterLayout");
  }
  return context;
}

export default function WaiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Track which tabs have unseen updates
  const [hasUnseenUpdates, setHasUnseenUpdates] = useState<
    Record<string, boolean>
  >({
    orders: false,
    bills: false,
    tables: false,
  });

  // Track called tables - shared across all pages
  const [calledTableIds, setCalledTableIds] = useState<Set<string>>(new Set());

  const addCalledTable = useCallback((tableId: string) => {
    setCalledTableIds((prev) => new Set(prev).add(tableId));
  }, []);

  const clearCalledTable = useCallback((tableId: string) => {
    setCalledTableIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(tableId);
      return newSet;
    });
  }, []);

  // Listen for real-time updates (handles room joining internally)
  useWaiterSocketListeners(
    (tabs) => {
      setHasUnseenUpdates((prev) => {
        const updated = { ...prev };
        const isOnOrdersPage = pathname.includes(PROTECTED_PATHS.WAITER.ORDERS);
        const isOnBillsPage = pathname.includes(PROTECTED_PATHS.WAITER.BILLS);

        tabs.forEach((tab) => {
          // Map sub-tabs to main nav tabs
          if (tab === "pending" || tab === "accepted" || tab === "ready") {
            // Only show unseen if not on orders page
            if (!isOnOrdersPage) {
              updated.orders = true;
            }
          } else if (tab === "tables") {
            // Tables is a sub-tab within orders, show unseen if not on orders page
            if (!isOnOrdersPage) {
              updated.tables = true;
            }
          } else if (tab === "bills") {
            // Only show unseen if not on bills page
            if (!isOnBillsPage) {
              updated.bills = true;
            }
          }
        });
        return updated;
      });
    },
    (data: { table_id: string; timestamp: string }) => {
      const isOnOrdersPage = pathname.includes(PROTECTED_PATHS.WAITER.ORDERS);

      // Add to called tables set - persists across all pages
      addCalledTable(data.table_id);

      // Handle call-waiter: always mark tables as unseen unless currently on orders page
      // This ensures notification persists even when on bills page
      setHasUnseenUpdates((prev) => ({
        ...prev,
        tables: !isOnOrdersPage,
      }));

      // Play sound notification when not on orders page
      if (!isOnOrdersPage) {
        const audio = new Audio("/sounds/noti.wav");
        audio.play().catch((err) => console.error("Error playing sound:", err));
      }
    },
  );

  const clearUnseenUpdate = useCallback((tab: string) => {
    setHasUnseenUpdates((prev) => ({
      ...prev,
      [tab]: false,
    }));
  }, []);

  const contextValue: WaiterLayoutContextType = {
    calledTableIds,
    addCalledTable,
    clearCalledTable,
  };

  return (
    <WaiterLayoutContext.Provider value={contextValue}>
      <div className="flex h-screen overflow-hidden">
        <WaiterNavbar
          hasUnseenUpdates={hasUnseenUpdates}
          onClearUnseen={clearUnseenUpdate}
        />
        {/* Main content with padding for mobile bottom nav and desktop sidebar */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 lg:ml-64">
          {children}
        </main>
      </div>
    </WaiterLayoutContext.Provider>
  );
}
