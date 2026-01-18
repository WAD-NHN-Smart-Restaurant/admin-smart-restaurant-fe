"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { ProtectedRoute } from "@/components/auth-guard";
import { OrderCard } from "../_components/order-card";
import { RejectOrderDialog } from "../_components/reject-order-dialog";
import { TablesTabContent } from "../_components/tables-tab-content";
import { EmptyState } from "@/components/empty-state";
import { PageLoadingSkeleton } from "@/components/page-loading-skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import {
  useGetWaiterOrdersInfinite,
  useAcceptOrderItem,
  useRejectOrderItem,
  useSendToKitchen,
  useMarkAsServed,
  useWaiterSocketListeners,
} from "@/hooks/use-waiter-query";
import { Order, OrderItemStatus, OrderStatus } from "@/types/waiter-type";
import { useRouter } from "next/navigation";
import { Monitor, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrdersContent() {
  const router = useRouter();
  const { user } = useAuth();

  // State
  const [selectedTab, setSelectedTab] = useState<string>("pending");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(
    null,
  );
  const [selectedOrderItemName, setSelectedOrderItemName] =
    useState<string>("");
  const [showAssignedOnly, setShowAssignedOnly] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // State for tables tab call-waiter tracking
  const [calledTableIds, setCalledTableIds] = useState<Set<string>>(new Set());

  // Track which tabs have unseen updates
  const [hasUnseenUpdates, setHasUnseenUpdates] = useState<
    Record<string, boolean>
  >({
    pending: false,
    accepted: false,
    ready: false,
    tables: false,
  });

  // Map tab to order status filter for backend
  const orderStatusFilter = useMemo(() => {
    switch (selectedTab) {
      case "pending":
        return "pending";
      case "accepted":
        return "accepted";
      case "ready":
        return "ready";
      default:
        return "pending";
    }
  }, [selectedTab]);

  // Queries with infinite scroll - fetch orders filtered by status
  const {
    data: ordersData,
    isLoading: ordersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetWaiterOrdersInfinite({
    status: orderStatusFilter as OrderStatus,
    waiterId: showAssignedOnly ? user?.id : undefined,
    limit: 20,
  });

  // Mutations
  const acceptMutation = useAcceptOrderItem();
  const rejectMutation = useRejectOrderItem();
  const sendToKitchenMutation = useSendToKitchen();
  const markServedMutation = useMarkAsServed();

  // Handle call-waiter events
  const handleCallWaiter = useCallback(
    (data: { table_id: string; timestamp: string }) => {
      // Add to called tables set
      setCalledTableIds((prev) => new Set(prev).add(data.table_id));

      // Mark tables tab as having unseen updates
      setHasUnseenUpdates((prev) => ({
        ...prev,
        tables: true,
      }));
    },
    [],
  );

  // Listen for real-time updates (handles room joining internally)
  useWaiterSocketListeners((tabs) => {
    setHasUnseenUpdates((prev) => {
      const updated = { ...prev };
      tabs.forEach((tab) => {
        updated[tab] = true;
      });
      return updated;
    });
  }, handleCallWaiter);

  // Extract orders from infinite query pages
  const orders = useMemo(() => {
    if (!ordersData?.pages) return [];
    return ordersData.pages.flatMap((page) => page.items || []);
  }, [ordersData]);

  // Get total count from first page

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || !hasNextPage || isFetchingNextPage) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        fetchNextPage();
      }
    };

    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener("scroll", handleScroll);
    return () => scrollElement?.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handlers
  const handleTabChange = useCallback((tab: string) => {
    setSelectedTab(tab);
    setHasUnseenUpdates((prev) => ({
      ...prev,
      [tab]: false,
    }));
  }, []);

  const handleOpenKDS = useCallback(() => {
    router.push("/kitchen");
  }, [router]);

  const handleAcceptItem = useCallback(
    (itemId: string) => {
      acceptMutation.mutate(
        { orderItemId: itemId, data: {} },
        {
          onSuccess: () => {
            // Auto send to kitchen after accepting
            setTimeout(() => {
              sendToKitchenMutation.mutate({ orderItemIds: [itemId] });
            }, 300);
          },
        },
      );
    },
    [acceptMutation, sendToKitchenMutation],
  );

  const handleAcceptAllItems = useCallback(
    (order: Order) => {
      const pendingItems = order.orderItems.filter(
        (i) => i.status === OrderItemStatus.PENDING,
      );

      // Accept all pending items
      // pendingItems.forEach((item) => {
      //   acceptMutation.mutate({ orderItemId: item.id, data: {} });
      // });

      // Auto send to kitchen after accepting
      setTimeout(() => {
        const itemIds = pendingItems.map((i) => i.id);
        if (itemIds.length > 0) {
          sendToKitchenMutation.mutate({ orderItemIds: itemIds });
        }
      }, 500);
    },
    [sendToKitchenMutation],
  );

  const handleRejectItem = useCallback((itemId: string, itemName: string) => {
    setSelectedOrderItemId(itemId);
    setSelectedOrderItemName(itemName);
    setRejectDialogOpen(true);
  }, []);

  const handleRejectAllItems = useCallback((order: Order) => {
    const pendingItems = order.orderItems.filter(
      (i) => i.status === OrderItemStatus.PENDING,
    );
    if (pendingItems.length > 0) {
      // Use first item's name or generic message
      const itemNames = pendingItems
        .map((i) => i.menuItem?.name)
        .filter(Boolean)
        .join(", ");
      setSelectedOrderItemId(pendingItems.map((i) => i.id).join(",")); // Store multiple IDs
      setSelectedOrderItemName(`All items: ${itemNames}`);
      setRejectDialogOpen(true);
    }
  }, []);

  const handleRejectConfirm = useCallback(
    (reason: string) => {
      if (selectedOrderItemId) {
        // Check if multiple items (comma-separated)
        const itemIds = selectedOrderItemId.split(",");

        // Reject each item
        itemIds.forEach((itemId) => {
          rejectMutation.mutate({
            orderItemId: itemId.trim(),
            data: {
              reason,
            },
          });
        });

        setRejectDialogOpen(false);
        setSelectedOrderItemId(null);
        setSelectedOrderItemName("");
      }
    },
    [selectedOrderItemId, rejectMutation],
  );

  const handleMarkServed = useCallback(
    (order: Order) => {
      const readyItems = order.orderItems
        .filter((i) => i.status === OrderItemStatus.READY)
        .map((i) => i.id);
      if (readyItems.length > 0) {
        markServedMutation.mutate({ orderItemIds: readyItems });
      }
    },
    [markServedMutation],
  );

  const isProcessing =
    acceptMutation.isPending ||
    rejectMutation.isPending ||
    sendToKitchenMutation.isPending ||
    markServedMutation.isPending;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Responsive Container - Mobile first, wider on desktop */}
        <div className="mx-auto">
          {/* Header */}
          <div className="bg-white border-b shadow-sm py-7 px-4 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="pl-10 lg:pl-0">
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
                  Waiter Dashboard
                </h1>
                <p className="hidden md:block text-sm text-slate-500 mt-1">
                  Manage and track customer orders
                </p>
              </div>
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="assigned-only"
                    checked={showAssignedOnly}
                    onCheckedChange={setShowAssignedOnly}
                  />
                  <Label
                    htmlFor="assigned-only"
                    className="text-sm cursor-pointer"
                  >
                    My Tables Only
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-slate-200 flex overflow-x-auto lg:justify-center">
            <button
              onClick={() => handleTabChange("pending")}
              className={`flex-shrink-0 py-4 px-4 lg:px-8 text-sm font-medium relative flex items-center gap-2 ${
                selectedTab === "pending" ? "text-amber-600" : "text-slate-500"
              }`}
            >
              <span>Pending</span>
              {hasUnseenUpdates.pending && selectedTab !== "pending" && (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              {selectedTab === "pending" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600" />
              )}
            </button>
            <button
              onClick={() => handleTabChange("accepted")}
              className={`flex-shrink-0 py-4 px-4 lg:px-8 text-sm font-medium relative flex items-center gap-2 ${
                selectedTab === "accepted" ? "text-blue-600" : "text-slate-500"
              }`}
            >
              <span>Accepted</span>
              {hasUnseenUpdates.accepted && selectedTab !== "accepted" && (
                <AlertCircle className="h-4 w-4 text-blue-600" />
              )}
              {selectedTab === "accepted" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => handleTabChange("ready")}
              className={`flex-shrink-0 py-4 px-4 lg:px-8 text-sm font-medium relative flex items-center gap-2 ${
                selectedTab === "ready" ? "text-green-600" : "text-slate-500"
              }`}
            >
              <span>Ready to Serve</span>
              {hasUnseenUpdates.ready && selectedTab !== "ready" && (
                <AlertCircle className="h-4 w-4 text-green-600" />
              )}
              {selectedTab === "ready" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600" />
              )}
            </button>
            <button
              onClick={() => handleTabChange("tables")}
              className={`flex-shrink-0 py-4 px-4 lg:px-8 text-sm font-medium relative flex items-center gap-2 ${
                selectedTab === "tables" ? "text-slate-700" : "text-slate-500"
              }`}
            >
              <span>My Tables</span>
              {hasUnseenUpdates.tables && selectedTab !== "tables" && (
                <AlertCircle className="h-4 w-4 text-slate-700" />
              )}
              {selectedTab === "tables" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700" />
              )}
            </button>
          </div>

          {/* Orders List */}
          {selectedTab === "tables" ? (
            <TablesTabContent
              onCallWaiter={handleCallWaiter}
              calledTableIds={calledTableIds}
              onClearTableCall={(tableId) => {
                setCalledTableIds((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(tableId);
                  return newSet;
                });
              }}
            />
          ) : ordersLoading ? (
            <PageLoadingSkeleton />
          ) : (
            <div
              ref={scrollRef}
              className="p-4 lg:p-8 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              {orders.length === 0 && !ordersLoading ? (
                <EmptyState
                  title="No orders found"
                  description={`There are no ${selectedTab} orders at the moment.`}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {orders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onAcceptItem={handleAcceptItem}
                        onRejectItem={handleRejectItem}
                        onAcceptAllItems={handleAcceptAllItems}
                        onRejectAllItems={handleRejectAllItems}
                        onMarkServed={handleMarkServed}
                        isProcessing={isProcessing}
                        selectedTab={selectedTab}
                      />
                    ))}
                  </div>
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                  )}
                  {hasNextPage && !isFetchingNextPage && (
                    <div className="flex justify-center py-6">
                      <Button
                        onClick={() => fetchNextPage()}
                        variant="outline"
                        size="lg"
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Reject Dialog */}
        <RejectOrderDialog
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          onConfirm={handleRejectConfirm}
          orderItemName={selectedOrderItemName}
          isProcessing={rejectMutation.isPending}
        />
      </div>
    </ProtectedRoute>
  );
}
