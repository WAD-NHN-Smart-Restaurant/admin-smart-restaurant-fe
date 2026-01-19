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
import { Award } from "lucide-react";

interface TopMenuItemsChartProps {
  data: Array<{
    menuItemId: string;
    name: string;
    totalRevenue: number;
    totalQuantity: number;
  }>;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#a4de6c",
  "#d0ed57",
  "#83a6ed",
  "#8dd1e1",
  "#d084d0",
  "#ffa07a",
];

export const TopMenuItemsChart = ({ data }: TopMenuItemsChartProps) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Top Menu Items by Revenue
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Total Revenue from Top Items:{" "}
          <span className="font-semibold text-foreground">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value?: number, name?: string) => {
                if (name === "totalRevenue") {
                  return [`$${(value ?? 0).toFixed(2)}`, "Revenue"];
                }
                return [value, "Quantity Sold"];
              }}
            />
            <Bar dataKey="totalRevenue" name="Revenue">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
