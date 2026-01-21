"use client";

import { useState, useMemo, useCallback } from "react";
import { ProtectedRoute } from "@/components/auth-guard";
import { BillsHeader } from "../_components/bills-header";
import { BillCard } from "../_components/bill-card";
import { CreateBillDialog } from "../_components/create-bill-dialog";
import { BillDetailsDialog } from "../_components/bill-details-dialog";
import { PrintBillDialog } from "../_components/print-bill-dialog";
import { EmptyState } from "@/components/empty-state";
import { PageLoadingSkeleton } from "@/components/page-loading-skeleton";
import {
  useGetCompletedPayments,
  useGetPendingPayments,
  useAcceptPayment,
  useConfirmPayment,
} from "@/hooks/use-bill-query";
import { PaymentBill } from "@/apis/payment-api";

export function BillsContent() {
  // State
  const [page] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<PaymentBill | null>(null);

  // Queries - use new payment endpoints
  const { data: paymentsData, isLoading: paymentsLoading } =
    useGetCompletedPayments(page, 50);
  const { data: pendingPaymentsData } = useGetPendingPayments();

  // Mutations
  const acceptPaymentMutation = useAcceptPayment();
  const confirmPaymentMutation = useConfirmPayment();

  // Get payments from data
  const payments = useMemo(() => paymentsData?.items || [], [paymentsData]);

  // Get pending payment requests (status='created')
  const pendingPayments = useMemo(
    () => pendingPaymentsData || [],
    [pendingPaymentsData],
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

  const handleViewDetails = useCallback((bill: PaymentBill) => {
    setSelectedBill(bill);
    setDetailsDialogOpen(true);
  }, []);

  const handlePrint = useCallback((bill: PaymentBill) => {
    setSelectedBill(bill);
    setPrintDialogOpen(true);
  }, []);

  const handleConfirmPayment = useCallback(
    (bill: PaymentBill) => {
      if (bill.paymentId) {
        confirmPaymentMutation.mutate(bill.paymentId);
      }
    },
    [confirmPaymentMutation],
  );

  const isProcessing =
    acceptPaymentMutation.isPending || confirmPaymentMutation.isPending;

  if (paymentsLoading) {
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
          {payments.length === 0 ? (
            <EmptyState
              title="No payments found"
              description="Customer payments will appear here."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {payments.map((payment) => (
                <BillCard
                  key={`${payment.paymentId}-${payment.orderId}`}
                  bill={payment}
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
          onPrint={(orderId: string) => {
            // Find payment by orderId and open print dialog
            const paymentToPrint = payments.find((p) => p.orderId === orderId);
            if (paymentToPrint) {
              handlePrint(paymentToPrint);
            }
          }}
        />

        <PrintBillDialog
          open={printDialogOpen}
          onOpenChange={setPrintDialogOpen}
          bill={selectedBill}
        />
      </div>
    </ProtectedRoute>
  );
}
