"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DateRangeSelectorProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onGroupByChange?: (groupBy: "day" | "week" | "month") => void;
  showGroupBy?: boolean;
}

export const DateRangeSelector = ({
  onDateRangeChange,
  onGroupByChange,
  showGroupBy = false,
}: DateRangeSelectorProps) => {
  const [preset, setPreset] = useState<string>("week");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day");

  const getDateRange = (presetValue: string) => {
    const now = new Date();
    const endDate = now.toISOString();
    let startDate: string;

    switch (presetValue) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        break;
      case "custom":
        return;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
    }

    onDateRangeChange(startDate, endDate);
  };

  const handlePresetChange = (value: string) => {
    setPreset(value);
    if (value !== "custom") {
      getDateRange(value);
    }
  };

  const handleCustomApply = () => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate).toISOString();
      const end = new Date(customEndDate + "T23:59:59").toISOString();
      onDateRangeChange(start, end);
    }
  };

  const handleGroupByChange = (value: "day" | "week" | "month") => {
    setGroupBy(value);
    if (onGroupByChange) {
      onGroupByChange(value);
    }
  };

  return (
    <Card>
      <CardContent className="">
        <div className="flex flex-wrap items-end gap-4">
          <div className="">
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Select value={preset} onValueChange={handlePresetChange}>
              <SelectTrigger>
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {preset === "custom" && (
            <>
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium mb-2 block">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full border rounded-md"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium mb-2 block">
                  End Date
                </label>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full border rounded-md"
                />
              </div>
              <Button onClick={handleCustomApply}>Apply</Button>
            </>
          )}

          {showGroupBy && (
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Group By</label>
              <Select value={groupBy} onValueChange={handleGroupByChange}>
                <SelectTrigger className="min-w-40">
                  <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
