"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

// WebSocket event types
export enum WaiterSocketEvent {
  NEW_ORDER = "new-order",
  ORDER_READY = "order-ready",
}

export enum KitchenSocketEvent {
  ORDERS_TO_PREPARE = "orders-to-prepare",
  ORDER_ACCEPTED = "order-accepted",
}

export enum CustomerSocketEvent {
  ORDER_STATUS_UPDATE = "order-status-update",
  ORDER_SERVED = "order-served",
}

export enum BillSocketEvent {
  BILL_CREATED = "bill-created",
  PAYMENT_COMPLETED = "payment-completed",
}

interface WebSocketContextType {
  isConnected: boolean;
  joinRestaurant: (restaurantId: string, role: string) => void;
  leaveRestaurant: (restaurantId: string) => void;
  subscribe: (event: string, callback: (data: unknown) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  url?: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  url = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001",
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const subscribersRef = useRef<Map<string, Set<(data: unknown) => void>>>(
    new Map(),
  );

  useEffect(() => {
    // Connect to Socket.IO with /orders namespace
    const socket = io(`${url}/orders`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket.id);
      setIsConnected(true);
      toast.success("Connected to server");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
      setIsConnected(false);
      toast.warning("Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      toast.error("Connection error. Retrying...");
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [url]);

  const joinRestaurant = useCallback((restaurantId: string, role: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("join-restaurant", { restaurantId, role });
      console.log(`Joined restaurant: ${restaurantId} as ${role}`);
    }
  }, []);

  const leaveRestaurant = useCallback((restaurantId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave-restaurant", { restaurantId });
      console.log(`Left restaurant: ${restaurantId}`);
    }
  }, []);

  const subscribe = useCallback(
    (event: string, callback: (data: unknown) => void) => {
      // Add to subscribers map
      if (!subscribersRef.current.has(event)) {
        subscribersRef.current.set(event, new Set());
      }
      subscribersRef.current.get(event)!.add(callback);

      // Register Socket.IO listener
      const socketCallback = (data: unknown) => {
        callback(data);
      };

      if (socketRef.current) {
        socketRef.current.on(event, socketCallback);
      }

      // Return unsubscribe function
      return () => {
        const subscribers = subscribersRef.current.get(event);
        if (subscribers) {
          subscribers.delete(callback);
          if (subscribers.size === 0) {
            subscribersRef.current.delete(event);
          }
        }

        // Remove Socket.IO listener
        if (socketRef.current) {
          socketRef.current.off(event, socketCallback);
        }
      };
    },
    [],
  );

  const value = useMemo(
    () => ({
      isConnected,
      joinRestaurant,
      leaveRestaurant,
      subscribe,
    }),
    [isConnected, joinRestaurant, leaveRestaurant, subscribe],
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
