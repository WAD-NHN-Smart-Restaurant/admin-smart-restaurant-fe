"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, FileText, CheckCircle, Clock } from "lucide-react";

interface BillStatsProps {
  stats: {
    total: number;
    pending: number;
    paid: number;
    totalRevenue: number;
  };
}

export function BillStats({ stats }: BillStatsProps) {
  const statItems = [
    {
      label: "Total Bills",
      value: stats.total.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Pending",
      value: stats.pending.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Paid",
      value: stats.paid.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`${item.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
