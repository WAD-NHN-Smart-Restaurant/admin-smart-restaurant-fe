"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KitchenOrderCard } from "../_components/kitchen-order-card";
import { DraggableOrderCard } from "../_components/draggable-order-card";
import {
  useGetKitchenOrders,
  useBulkUpdateOrderItems,
  useRejectOrderItem,
  useIsItemOverdue,
  useElapsedTime,
  useKitchenSocketListeners,
} from "@/hooks/use-kitchen-query";
import { KitchenOrder } from "@/types/kitchen-type";
import { EmptyState } from "@/components/empty-state";
import { PageLoadingSkeleton } from "@/components/page-loading-skeleton";

type KitchenStatus = "accepted" | "preparing" | "ready";

function LiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="bg-slate-900 border-0 py-0 rounded-md">
      <CardContent className="px-4 py-2">
        <div className="flex items-center gap-2 text-white">
          <Clock className="h-4 w-4" />
          <span className="text-md font-semibold font-mono">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function KitchenContent() {
  // State
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const previousOrderCountRef = useRef(0);

  // Queries and mutations - fetch each status separately
  const { data: receivedOrders = [], isLoading: isLoadingReceived } =
    useGetKitchenOrders({ status: "accepted" });
  const { data: preparingOrders = [], isLoading: isLoadingPreparing } =
    useGetKitchenOrders({ status: "preparing" });
  const { data: readyOrders = [], isLoading: isLoadingReady } =
    useGetKitchenOrders(
      { status: "ready" },
      { refetchInterval: 1000 * 60 * 10 },
    );
  const bulkUpdateMutation = useBulkUpdateOrderItems();
  const rejectMutation = useRejectOrderItem();

  const isLoading = isLoadingReceived || isLoadingPreparing || isLoadingReady;
  const orders = useMemo(() => {
    return [...receivedOrders, ...preparingOrders, ...readyOrders];
  }, [receivedOrders, preparingOrders, readyOrders]);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const initializeAudio = useCallback(() => {
    if (!audioInitialized && soundRef.current) {
      // Play silent sound to initialize audio context
      soundRef.current.volume = 1;
      soundRef.current
        .play()
        .then(() => {
          soundRef.current!.volume = 1; // Restore volume
          setAudioInitialized(true);
        })
        .catch((err) => {
          console.warn("Audio initialization failed", err);
          // Still mark as initialized even if it fails
          setAudioInitialized(true);
        });
    }
  }, [audioInitialized]);

  // Helpers
  const isItemOverdue = useIsItemOverdue();
  const getElapsedTime = useElapsedTime();
  // Calculate overdue count
  const overdueCount = useMemo(() => {
    return orders.filter((order) =>
      order.orderItems.some((item) => isItemOverdue(item)),
    ).length;
  }, [orders, isItemOverdue]);

  // Listen for real-time updates (handles room joining internally)
  useKitchenSocketListeners();

  // Sound notification
  useEffect(() => {
    // Initialize sound with a beep sound (data URL)
    if (typeof window !== "undefined") {
      soundRef.current = new Audio("/sounds/noti.wav");
    }
  }, []);

  // Play sound when new orders arrive
  useEffect(() => {
    const currentCount = orders.length;
    console.log(
      "Current order count:",
      currentCount,
      previousOrderCountRef.current,
    );
    if (
      soundEnabled &&
      currentCount > previousOrderCountRef.current &&
      previousOrderCountRef.current > 0 &&
      soundRef.current
    ) {
      soundRef.current.play().catch((err) => {
        console.error("Failed to play sound:", err);
      });
    }
    previousOrderCountRef.current = currentCount;
  }, [orders.length, soundEnabled]);

  // Group orders by status - already filtered from queries
  const ordersByStatus = useMemo(() => {
    return {
      received: receivedOrders,
      preparing: preparingOrders,
      ready: readyOrders,
    };
  }, [receivedOrders, preparingOrders, readyOrders]);

  // Handle start preparing
  const handleStartPreparing = useCallback(
    (orderItemIds: string[]) => {
      bulkUpdateMutation.mutate({
        orderItemIds,
        status: "preparing",
      });
    },
    [bulkUpdateMutation],
  );

  // Handle mark ready
  const handleMarkReady = useCallback(
    (orderItemIds: string[]) => {
      bulkUpdateMutation.mutate({
        orderItemIds,
        status: "ready",
      });
    },
    [bulkUpdateMutation],
  );

  // Handle reject order item
  const handleReject = useCallback(
    (orderItemId: string, reason: string) => {
      rejectMutation.mutate({
        orderItemId,
        reason,
      });
    },
    [rejectMutation],
  );

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log("Drag started:", event.active.id);
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setOverId(String(event.over?.id) || null);
    return;
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const activeIdStr = active.id as string;
        // Parse the combined ID (orderId-columnId) - use lastIndexOf to handle UUIDs with hyphens
        const lastHyphenIndex = activeIdStr.lastIndexOf("-");
        const orderId =
          lastHyphenIndex !== -1
            ? activeIdStr.substring(0, lastHyphenIndex)
            : activeIdStr;
        const sourceColumnId: KitchenStatus = (
          lastHyphenIndex !== -1
            ? activeIdStr.substring(lastHyphenIndex + 1)
            : ""
        ) as KitchenStatus;

        let newStatus: KitchenStatus | null = null;

        // Check if over.id is a status string or an order UUID
        const validStatuses: KitchenStatus[] = [
          "accepted",
          "preparing",
          "ready",
        ];
        const overIdStr = over.id as string;
        if (validStatuses.includes(overIdStr as KitchenStatus)) {
          // Dropped on column
          newStatus = overIdStr as KitchenStatus;
        } else {
          // Dropped on an order card - parse the target order ID and find its status
          const overIdStr = over.id as string;
          const lastHyphenIndexTarget = overIdStr.lastIndexOf("-");
          // const targetOrderId =
          //   lastHyphenIndexTarget !== -1
          //     ? overIdStr.substring(0, lastHyphenIndexTarget)
          //     : overIdStr;
          const targetColumnId =
            lastHyphenIndexTarget !== -1
              ? overIdStr.substring(lastHyphenIndexTarget + 1)
              : "";

          if (
            targetColumnId &&
            validStatuses.includes(targetColumnId as KitchenStatus)
          ) {
            newStatus = targetColumnId as KitchenStatus;
          }
        }
        if (newStatus === sourceColumnId) {
          setActiveId(null);
          setOverId(null);
          return;
        }
        if (newStatus && orderId) {
          // Find order in the specific source column based on sourceColumnId
          const sourceArray: KitchenOrder[] = (() => {
            switch (sourceColumnId) {
              case "accepted":
                return ordersByStatus.received;
              case "preparing":
                return ordersByStatus.preparing;
              case "ready":
                return ordersByStatus.ready;
              default:
                return orders; // fallback to combined orders
            }
          })();

          // Validate status transition sequence: accepted -> preparing -> ready
          const isValidTransition =
            (sourceColumnId === "accepted" && newStatus === "preparing") ||
            (sourceColumnId === "preparing" && newStatus === "ready");

          if (!isValidTransition) {
            console.warn(
              `Invalid status transition from ${sourceColumnId} to ${newStatus}`,
            );
            setActiveId(null);
            setOverId(null);
            return;
          }

          const order = sourceArray.find((o) => o.id === orderId);
          if (order) {
            const itemIds = order.orderItems.map((item) => item.id);

            // Only allow valid status transitions
            bulkUpdateMutation.mutate({
              orderItemIds: itemIds,
              status: newStatus,
            });
          }
        }
      }

      setActiveId(null);
      setOverId(null);
    },
    [orders, bulkUpdateMutation, ordersByStatus],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
  }, []);

  // Get active order for drag overlay
  const activeOrder = useMemo(() => {
    if (!activeId) return null;
    // Parse the combined ID (orderId-columnId) - use lastIndexOf to handle UUIDs with hyphens
    const activeIdStr = activeId as string;
    const lastHyphenIndex = activeIdStr.lastIndexOf("-");
    const orderId =
      lastHyphenIndex !== -1
        ? activeIdStr.substring(0, lastHyphenIndex)
        : activeIdStr;
    const columnId =
      lastHyphenIndex !== -1 ? activeIdStr.substring(lastHyphenIndex + 1) : "";

    // Find order in the specific column based on columnId
    let targetArray: KitchenOrder[] = [];
    switch (columnId) {
      case "accepted":
        targetArray = ordersByStatus.received;
        break;
      case "preparing":
        targetArray = ordersByStatus.preparing;
        break;
      case "ready":
        targetArray = ordersByStatus.ready;
        break;
      default:
        targetArray = orders; // fallback to combined orders
    }

    return targetArray.find((order) => order.id === orderId);
  }, [orders, activeId, ordersByStatus]);

  // Droppable Column Component
  const DroppableColumn = ({
    id,
    title,
    icon,
    count,
    colorClass,
    orders: columnOrders,
  }: {
    id: string;
    title: string;
    icon: React.ReactNode;
    count: number;
    colorClass: string;
    orders: KitchenOrder[];
  }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    // Check if hovering over this column or over an order in this column
    // AND if the drop is valid (following the sequence)
    const isValidDrop = useMemo(() => {
      if (!activeId || !overId) return false;

      // Get source column from activeId
      const activeIdStr = activeId as string;
      const lastHyphenIndex = activeIdStr.lastIndexOf("-");
      const sourceColumnId =
        lastHyphenIndex !== -1
          ? activeIdStr.substring(lastHyphenIndex + 1)
          : "";

      // Determine target column
      let targetColumnId = id;
      if (overId !== id && overId) {
        const overIdStr = overId as string;
        const lastHyphenIndexTarget = overIdStr.lastIndexOf("-");
        targetColumnId =
          lastHyphenIndexTarget !== -1
            ? overIdStr.substring(lastHyphenIndexTarget + 1)
            : "";
      }

      // Only allow forward progression: accepted -> preparing -> ready
      if (sourceColumnId === "accepted" && targetColumnId === "preparing")
        return true;
      if (sourceColumnId === "preparing" && targetColumnId === "ready")
        return true;

      return false;
    }, [activeId, overId, id]);

    const isOverColumn =
      isValidDrop &&
      (isOver ||
        overId === id ||
        (overId &&
          columnOrders.some((order) => `${order.id}-${id}` === overId)));

    return (
      <div className="flex flex-col min-h-full min-w-80 flex-1">
        {/* Column Header */}
        <div className="rounded-b-none shadow-sm border-b-0 rounded-t-xl border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 ${colorClass} rounded-md text-white`}>
                  {icon}
                </div>
                <span className="font-semibold text-slate-900">{title}</span>
              </div>
              <Badge variant="secondary" className="font-semibold">
                {count}
              </Badge>
            </div>
          </CardContent>
        </div>

        {/* Column Body */}
        <Card
          ref={setNodeRef}
          className="flex-1 rounded-t-none shadow-sm py-2 relative"
        >
          {/* Drop indicator - visible when dragging over */}
          {isOverColumn && (
            <div className="absolute inset-0 bg-blue-50/80 ring-2 ring-blue-300 ring-inset rounded pointer-events-none transition-opacity z-50" />
          )}

          <CardContent
            className="p-4 space-y-3 overflow-y-auto transition-all min-h-[400px] bg-white"
            style={{ maxHeight: "calc(100vh - 220px)" }}
          >
            {columnOrders.map((order) => (
              <DraggableOrderCard
                key={`${order.id}-${id}`}
                order={order}
                columnId={id}
              >
                <KitchenOrderCard
                  order={order}
                  onStartPreparing={handleStartPreparing}
                  onMarkReady={handleMarkReady}
                  onReject={handleReject}
                  isOverdue={isItemOverdue}
                  getElapsedTime={getElapsedTime}
                />
              </DraggableOrderCard>
            ))}
            {columnOrders.length === 0 && (
              <Card className="border-2 border-dashed bg-slate-50">
                <CardContent className="py-12 text-center">
                  <p className="text-slate-400 font-medium">No orders</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 to-slate-100">
      {/* KDS Header */}
      <Card className="rounded-none border-0 border-b shadow-sm py-0">
        <CardContent className="px-6 py-4">
          <div className="flex md:flex-row flex-col gap-2 items-center justify-between">
            {/* Logo */}
            <div className="md:flex items-center gap-2 hidden">
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Kitchen Display System
                </h1>
                <p className="text-xs text-slate-500">
                  Real-time order management
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-2 md:gap-3 lg:gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-amber-600" />
                  <div className="text-2xl font-bold text-amber-600">
                    {ordersByStatus.received.length}
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium uppercase">
                  Pending
                </div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="h-4 w-4 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">
                    {ordersByStatus.preparing.length}
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium uppercase">
                  Cooking
                </div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">
                    {ordersByStatus.ready.length}
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium uppercase">
                  Ready
                </div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div className="text-2xl font-bold text-red-600">
                    {overdueCount}
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium uppercase">
                  Overdue
                </div>
              </div>
            </div>

            {/* Time & Controls */}
            <div className="flex items-center gap-4">
              <LiveClock />

              <Button
                onClick={() => {
                  initializeAudio();
                  setSoundEnabled(!soundEnabled);
                }}
                variant={soundEnabled ? "default" : "outline"}
                size="lg"
                className={
                  soundEnabled ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="h-4 w-4" />
                    ON
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4" />
                    OFF
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KDS Board - Drag and Drop */}
      {orders.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState title="No orders in kitchen" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex-1 flex gap-6 p-6 overflow-x-auto overflow-y-hidden">
            {/* Received Column */}
            <DroppableColumn
              id="accepted"
              title="Received"
              icon={<Package className="h-5 w-5" />}
              count={ordersByStatus.received.length}
              colorClass="bg-amber-500"
              orders={ordersByStatus.received}
            />

            {/* Preparing Column */}
            <DroppableColumn
              id="preparing"
              title="Preparing"
              icon={<Flame className="h-5 w-5" />}
              count={ordersByStatus.preparing.length}
              colorClass="bg-blue-500"
              orders={ordersByStatus.preparing}
            />

            {/* Ready Column */}
            <DroppableColumn
              id="ready"
              title="Ready"
              icon={<CheckCircle2 className="h-5 w-5" />}
              count={ordersByStatus.ready.length}
              colorClass="bg-green-500"
              orders={ordersByStatus.ready}
            />
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeOrder ? (
              <div className="opacity-95">
                <KitchenOrderCard
                  order={activeOrder}
                  onStartPreparing={handleStartPreparing}
                  onMarkReady={handleMarkReady}
                  onReject={handleReject}
                  isOverdue={isItemOverdue}
                  getElapsedTime={getElapsedTime}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
