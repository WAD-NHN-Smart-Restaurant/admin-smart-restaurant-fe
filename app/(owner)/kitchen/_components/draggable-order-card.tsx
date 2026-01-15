"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KitchenOrder } from "@/types/kitchen-type";
import { ReactNode } from "react";

interface DraggableOrderCardProps {
  order: KitchenOrder;
  children: ReactNode;
}

export function DraggableOrderCard({
  order,
  children,
}: DraggableOrderCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
