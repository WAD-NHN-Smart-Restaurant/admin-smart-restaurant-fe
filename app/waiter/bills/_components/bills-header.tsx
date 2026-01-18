"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

interface BillsHeaderProps {
  onCreateBill: () => void;
  onDownloadReport?: () => void;
}

export function BillsHeader({
  onCreateBill,
  onDownloadReport,
}: BillsHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bills</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage bills and process payments
            </p>
          </div>
          <div className="flex gap-3">
            {onDownloadReport && (
              <Button variant="outline" onClick={onDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Report
              </Button>
            )}
            <Button onClick={onCreateBill}>
              <Plus className="h-4 w-4 mr-2" />
              Create Bill
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
