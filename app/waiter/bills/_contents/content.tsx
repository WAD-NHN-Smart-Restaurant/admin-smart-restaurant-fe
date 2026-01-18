"use client";

import { useState, useMemo, useCallback } from "react";
import { ProtectedRoute } from "@/components/auth-guard";
import { useAuth } from "@/context/auth-context";
import { BillsHeader } from "../_components/bills-header";
import { BillCard } from "../_components/bill-card";
import { CreateBillDialog } from "../_components/create-bill-dialog";
import { ApplyDiscountDialog } from "../_components/apply-discount-dialog";
import { ProcessPaymentDialog } from "../_components/process-payment-dialog";
import { BillDetailsDialog } from "../_components/bill-details-dialog";
import { EmptyState } from "@/components/empty-state";
import { PageLoadingSkeleton } from "@/components/page-loading-skeleton";
import {
  useGetBills,
  useCreateBill,
  useApplyDiscount,
  useProcessPayment,
  usePrintBill,
} from "@/hooks/use-bill-query";
import { Bill, BillFilter, PaymentMethod } from "@/types/bill-type";

export function BillsContent() {
  const { user } = useAuth();

  // State
  const [filters] = useState<BillFilter>({
    page: 1,
    limit: 10,
    waiterId: user?.id, // Filter by current waiter
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Queries
  const { data: billsData, isLoading: billsLoading } = useGetBills(filters);

  // Mutations
  const createMutation = useCreateBill();
  const discountMutation = useApplyDiscount();
  const paymentMutation = useProcessPayment();
  const printMutation = usePrintBill();

  // Get bills from data
  const bills = useMemo(() => billsData?.items || [], [billsData]);

  // Handlers
  const handleCreateBill = useCallback(() => {
    setCreateDialogOpen(true);
  }, []);

  const handleCreateConfirm = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (orderId: string, tableId: string, paymentMethod: PaymentMethod) => {
      // Backend will calculate subtotal, tax, and total
      // We only need to send the orderId and paymentMethod
      // tableId is passed from dialog but not used in API call
      createMutation.mutate(
        {
          orderId,
          paymentMethod,
        },
        {
          onSuccess: () => {
            setCreateDialogOpen(false);
          },
        },
      );
    },
    [createMutation],
  );

  const handleViewDetails = useCallback((bill: Bill) => {
    setSelectedBill(bill);
    setDetailsDialogOpen(true);
  }, []);

  const handlePrint = useCallback(
    (billId: string) => {
      printMutation.mutate(billId);
    },
    [printMutation],
  );

  const handleApplyDiscount = useCallback((bill: Bill) => {
    setSelectedBill(bill);
    setDiscountDialogOpen(true);
  }, []);

  const handleDiscountConfirm = useCallback(
    (discountType: "percentage" | "fixed", discountValue: number) => {
      if (selectedBill && selectedBill.orderId) {
        discountMutation.mutate(
          {
            orderId: selectedBill.orderId,
            data: {
              discountType,
              discountValue,
            },
          },
          {
            onSuccess: () => {
              setDiscountDialogOpen(false);
              setSelectedBill(null);
            },
          },
        );
      }
    },
    [selectedBill, discountMutation],
  );

  const handleProcessPayment = useCallback((bill: Bill) => {
    setSelectedBill(bill);
    setPaymentDialogOpen(true);
  }, []);

  const handlePaymentConfirm = useCallback(
    (paymentMethod: PaymentMethod) => {
      if (selectedBill && selectedBill.orderId) {
        paymentMutation.mutate(
          {
            orderId: selectedBill.orderId,
            data: {
              paymentMethod,
            },
          },
          {
            onSuccess: () => {
              setPaymentDialogOpen(false);
              setSelectedBill(null);
            },
          },
        );
      }
    },
    [selectedBill, paymentMutation],
  );

  const isProcessing =
    createMutation.isPending ||
    discountMutation.isPending ||
    paymentMutation.isPending ||
    printMutation.isPending;

  if (billsLoading) {
    return (
      <ProtectedRoute>
        <PageLoadingSkeleton />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <BillsHeader onCreateBill={handleCreateBill} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}

          {/* Bills Grid */}
          {bills.length === 0 ? (
            <EmptyState
              title="No bills found"
              description="Create a bill to get started."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {bills.map((bill) => (
                <BillCard
                  key={bill.orderId}
                  bill={bill}
                  onViewDetails={handleViewDetails}
                  onPrint={handlePrint}
                  onProcessPayment={handleProcessPayment}
                  onApplyDiscount={handleApplyDiscount}
                  isProcessing={isProcessing}
                />
              ))}
            </div>
          )}
        </div>

        {/* Dialogs */}
        <CreateBillDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onConfirm={handleCreateConfirm}
          isProcessing={createMutation.isPending}
        />

        <ApplyDiscountDialog
          open={discountDialogOpen}
          onOpenChange={setDiscountDialogOpen}
          onConfirm={handleDiscountConfirm}
          bill={selectedBill}
          isProcessing={discountMutation.isPending}
        />

        <ProcessPaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          onConfirm={handlePaymentConfirm}
          bill={selectedBill}
          isProcessing={paymentMutation.isPending}
        />

        <BillDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          bill={selectedBill}
          onPrint={handlePrint}
        />
      </div>
    </ProtectedRoute>
  );
}
