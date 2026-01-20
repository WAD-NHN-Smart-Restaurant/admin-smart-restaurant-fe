"use client";

import { useSafeQuery } from "./use-safe-query";
import {
  getRevenueReport,
  getTopMenuItems,
  getAnalyticsCharts,
} from "@/api/analytics-api";
import {
  RevenueReportParams,
  TopMenuItemsParams,
  AnalyticsChartsParams,
  RevenueReportResponse,
  TopMenuItemsResponse,
  AnalyticsChartsResponse,
} from "@/types/analytics-type";

// Hook for revenue report
export const useRevenueReport = (params: RevenueReportParams) => {
  return useSafeQuery<RevenueReportResponse>(
    [
      "revenue-report",
      params.startDate,
      params.endDate,
      params.groupBy,
      params.restaurantId,
    ],
    () => getRevenueReport(params),
    {
      enabled:
        !!params.startDate &&
        !!params.endDate &&
        !!params.startDate.trim() &&
        !!params.restaurantId,
      errorMessage: "Failed to fetch revenue report",
    },
  );
};

// Hook for top menu items
export const useTopMenuItems = (params: TopMenuItemsParams) => {
  return useSafeQuery<TopMenuItemsResponse>(
    [
      "top-menu-items",
      params.startDate,
      params.endDate,
      params.limit,
      params.restaurantId,
    ],
    () => getTopMenuItems(params),
    {
      enabled:
        !!params.startDate &&
        !!params.endDate &&
        !!params.startDate.trim() &&
        !!params.restaurantId,
      errorMessage: "Failed to fetch top menu items",
    },
  );
};

// Hook for analytics charts
export const useAnalyticsCharts = (params: AnalyticsChartsParams) => {
  return useSafeQuery<AnalyticsChartsResponse>(
    ["analytics-charts", params.startDate, params.endDate, params.restaurantId],
    () => getAnalyticsCharts(params),
    {
      enabled:
        !!params.startDate &&
        !!params.endDate &&
        !!params.startDate.trim() &&
        !!params.restaurantId,
      errorMessage: "Failed to fetch analytics charts",
    },
  );
};
