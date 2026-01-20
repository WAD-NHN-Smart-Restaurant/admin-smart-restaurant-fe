"use client";

import { useDraggable } from "@dnd-kit/core";
import { KitchenOrder } from "@/types/kitchen-type";
import { ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";

interface DraggableOrderCardProps {
  order: KitchenOrder;
  children: ReactNode;
  columnId: string;
}

export function DraggableOrderCard({
  order,
  children,
  columnId,
}: DraggableOrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${order.id}-${columnId}`,
    });

  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    opacity: isDragging ? 0.6 : 1, // Keep original card more visible while dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "cursor-grabbing" : "cursor-grab"}
    >
      {children}
    </div>
  );
}
