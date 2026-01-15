"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
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

function LiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="bg-slate-900 border-0 py-0">
      <CardContent className="px-4 py-2">
        <div className="flex items-center gap-2 text-white">
          <Clock className="h-4 w-4" />
          <span className="text-lg font-semibold font-mono">
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
    useGetKitchenOrders({ status: "ready" });
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
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: any) => {
    setOverId(event.over?.id || null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const orderId = active.id as string;
        let newStatus: "accepted" | "preparing" | "ready" | null = null;

        // Check if over.id is a status string or an order UUID
        const validStatuses = ["accepted", "preparing", "ready"];
        if (validStatuses.includes(over.id as string)) {
          // Dropped on column
          newStatus = over.id as "accepted" | "preparing" | "ready";
        } else {
          // Dropped on an order card - find which column it belongs to
          const targetOrder = orders.find((o) => o.id === over.id);
          if (targetOrder && targetOrder.orderItems.length > 0) {
            newStatus = targetOrder.orderItems[0].status as
              | "accepted"
              | "preparing"
              | "ready";
          }
        }

        if (newStatus) {
          const order = orders.find((o) => o.id === orderId);
          if (order) {
            const itemIds = order.orderItems.map((item) => item.id);

            // Allow moving to any status
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
    [orders, bulkUpdateMutation],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
  }, []);

  // Get active order for drag overlay
  const activeOrder = useMemo(() => {
    return orders.find((order) => order.id === activeId);
  }, [orders, activeId]);

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
    const isOverColumn =
      isOver || (overId && columnOrders.some((order) => order.id === overId));

    return (
      <div className="flex flex-col h-full">
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
              <DraggableOrderCard key={order.id} order={order}>
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
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Kitchen Display System
                </h1>
                <p className="text-xs text-slate-500">
                  Real-time order management
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
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
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
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
              <div className="opacity-75">
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
