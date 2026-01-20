"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orderCount: number;
  }>;
  groupBy: "day" | "week" | "month";
}

export const RevenueChart = ({ data, groupBy }: RevenueChartProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (groupBy === "day") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (groupBy === "month") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
    return dateStr;
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orderCount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Revenue Report
        </CardTitle>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <div>
            Total Revenue:{" "}
            <span className="font-semibold text-foreground">
              ${totalRevenue.toFixed(2)}
            </span>
          </div>
          <div>
            Total Orders:{" "}
            <span className="font-semibold text-foreground">{totalOrders}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip
              formatter={(value?: number, name?: string) => {
                if (name === "revenue") {
                  return [`$${(value ?? 0).toFixed(2)}`, "Revenue"];
                }
                return [value, "Orders"];
              }}
              labelFormatter={formatDate}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
            <Bar dataKey="orderCount" fill="#82ca9d" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
