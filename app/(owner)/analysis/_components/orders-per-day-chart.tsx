"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface OrdersPerDayChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export const OrdersPerDayChart = ({ data }: OrdersPerDayChartProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const totalOrders = data.reduce((sum, item) => sum + item.count, 0);
  const avgOrders = totalOrders / (data.length || 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Orders Per Day
        </CardTitle>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <div>
            Total Orders:{" "}
            <span className="font-semibold text-foreground">{totalOrders}</span>
          </div>
          <div>
            Avg Per Day:{" "}
            <span className="font-semibold text-foreground">
              {avgOrders.toFixed(1)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
              labelFormatter={formatDate}
              formatter={(value?: number) => [value, "Orders"]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={2}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
