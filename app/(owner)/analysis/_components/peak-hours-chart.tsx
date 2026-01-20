"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface PeakHoursChartProps {
  data: Array<{
    hour: number;
    count: number;
  }>;
}

export const PeakHoursChart = ({ data }: PeakHoursChartProps) => {
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  const maxOrders = Math.max(...data.map((d) => d.count));
  const peakHour = data.find((d) => d.count === maxOrders);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Peak Hours
        </CardTitle>
        {peakHour && (
          <div className="text-sm text-muted-foreground">
            Peak Hour:{" "}
            <span className="font-semibold text-foreground">
              {formatHour(peakHour.hour)} ({peakHour.count} orders)
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              tickFormatter={formatHour}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip
              labelFormatter={formatHour}
              formatter={(value?: number) => [value, "Orders"]}
            />
            <Bar dataKey="count" name="Orders">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.count === maxOrders ? "#ff8042" : "#8884d8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
