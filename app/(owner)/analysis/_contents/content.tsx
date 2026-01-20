"use client";

import { useState, useMemo } from "react";
import { DateRangeSelector } from "../_components/date-range-selector";
import { RevenueChart } from "../_components/revenue-chart";
import { TopMenuItemsChart } from "../_components/top-menu-items-chart";
import { OrdersPerDayChart } from "../_components/orders-per-day-chart";
import { PeakHoursChart } from "../_components/peak-hours-chart";
import { PopularItemsChart } from "../_components/popular-items-chart";
import {
  useRevenueReport,
  useTopMenuItems,
  useAnalyticsCharts,
} from "@/hooks/use-analytics-query";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function Content() {
  const { profile } = useAuth();
  // Initialize with last 7 days
  const initialDateRange = useMemo(() => {
    const now = new Date();
    const endDate = now.toISOString();
    const startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
    return { startDate, endDate };
  }, []);

  const [dateRange, setDateRange] = useState(initialDateRange);
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day");

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  const handleGroupByChange = (newGroupBy: "day" | "week" | "month") => {
    setGroupBy(newGroupBy);
  };

  // Fetch data using custom hooks
  const {
    data: revenueData,
    isLoading: isLoadingRevenue,
    error: revenueError,
  } = useRevenueReport({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    groupBy,
    restaurantId: profile?.restaurantId || "",
  });

  const {
    data: topItemsData,
    isLoading: isLoadingTopItems,
    error: topItemsError,
  } = useTopMenuItems({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    limit: 10,
    restaurantId: profile?.restaurantId || "",
  });

  const {
    data: chartsData,
    isLoading: isLoadingCharts,
    error: chartsError,
  } = useAnalyticsCharts({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    restaurantId: profile?.restaurantId || "",
  });

  const isLoading = isLoadingRevenue || isLoadingTopItems || isLoadingCharts;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your restaurant performance and insights
        </p>
      </div>

      <DateRangeSelector
        onDateRangeChange={handleDateRangeChange}
        onGroupByChange={handleGroupByChange}
        showGroupBy={true}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading analytics...
          </span>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Analytics Charts */}
          {chartsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Orders Per Day */}
              {chartsData.ordersPerDay &&
                chartsData.ordersPerDay.length > 0 && (
                  <OrdersPerDayChart data={chartsData.ordersPerDay} />
                )}
              {/* Popular Items */}
              {chartsData.popularItems &&
                chartsData.popularItems.length > 0 && (
                  <PopularItemsChart data={chartsData.popularItems} />
                )}
              {/* Peak Hours */}
              {chartsData.peakHours && chartsData.peakHours.length > 0 && (
                <div className="col-span-2">
                  <PeakHoursChart data={chartsData.peakHours} />
                </div>
              )}
            </div>
          )}

          {/* Revenue Report */}
          {revenueData && revenueData.length > 0 ? (
            <RevenueChart data={revenueData} groupBy={groupBy} />
          ) : (
            !revenueError && (
              <div className="text-center py-8 text-muted-foreground">
                No revenue data available for the selected period
              </div>
            )
          )}

          {/* Top Menu Items */}
          {topItemsData && topItemsData.length > 0 ? (
            <TopMenuItemsChart data={topItemsData} />
          ) : (
            !topItemsError && (
              <div className="text-center py-8 text-muted-foreground">
                No menu item data available
              </div>
            )
          )}

          {!chartsData && !chartsError && (
            <div className="text-center py-8 text-muted-foreground">
              No chart data available for the selected period
            </div>
          )}
        </>
      )}
    </div>
  );
}
