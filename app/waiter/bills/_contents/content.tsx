"use client";

import { useState, useMemo, useCallback } from "react";
import { ProtectedRoute } from "@/components/auth-guard";
import { useAuth } from "@/context/auth-context";
import { BillsHeader } from "../_components/bills-header";
import { BillCard } from "../_components/bill-card";
import { CreateBillDialog } from "../_components/create-bill-dialog";
import { BillDetailsDialog } from "../_components/bill-details-dialog";
import { EmptyState } from "@/components/empty-state";
import { PageLoadingSkeleton } from "@/components/page-loading-skeleton";
import {
  useGetBills,
  useAcceptPayment,
  useConfirmPayment,
  usePrintBill,
} from "@/hooks/use-bill-query";
import { Bill, BillFilter, PaymentStatus } from "@/types/bill-type";

export function BillsContent() {
  const { user } = useAuth();

  // State
  const [filters] = useState<BillFilter>({
    page: 1,
    limit: 50,
    waiterId: user?.id, // Filter by current waiter
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Queries
  const { data: billsData, isLoading: billsLoading } = useGetBills(filters);

  // Mutations
  const acceptPaymentMutation = useAcceptPayment();
  const confirmPaymentMutation = useConfirmPayment();
  const printMutation = usePrintBill();

  // Get bills from data
  const bills = useMemo(() => billsData?.items || [], [billsData]);

  // Get pending payment requests (status='created')
  const pendingPayments = useMemo(
    () =>
      bills
        .filter((bill) => bill.paymentStatus === PaymentStatus.CREATED)
        .map((bill) => ({
          paymentId: bill.paymentId || "",
          orderId: bill.orderId,
          tableNumber: bill.tableNumber,
          totalAmount: bill.totalAmount,
          tax: bill.tax || 0,
          discountAmount: bill.discountAmount || 0,
          finalTotal: bill.finalTotal || bill.totalAmount,
        })),
    [bills],
  );

  // Handlers
  const handleCreateBill = useCallback(() => {
    setCreateDialogOpen(true);
  }, []);

  const handleCreateConfirm = useCallback(
    (paymentId: string, discountRate: number, discountAmount: number) => {
      acceptPaymentMutation.mutate(
        { paymentId, discountRate, discountAmount },
        {
          onSuccess: () => {
            setCreateDialogOpen(false);
          },
        },
      );
    },
    [acceptPaymentMutation],
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

  const handleConfirmPayment = useCallback(
    (bill: Bill) => {
      if (bill.paymentId) {
        confirmPaymentMutation.mutate(bill.paymentId);
      }
    },
    [confirmPaymentMutation],
  );

  const isProcessing =
    acceptPaymentMutation.isPending ||
    confirmPaymentMutation.isPending ||
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
                  key={`${bill.paymentId}-${bill.orderId}`}
                  bill={bill}
                  onViewDetails={handleViewDetails}
                  onPrint={handlePrint}
                  onConfirmPayment={handleConfirmPayment}
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
          isProcessing={acceptPaymentMutation.isPending}
          pendingPayments={pendingPayments}
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
