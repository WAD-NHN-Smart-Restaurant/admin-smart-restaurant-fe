import api from "@/libs/api-request";
import {
  RevenueReportResponse,
  TopMenuItemsResponse,
  AnalyticsChartsResponse,
  RevenueReportParams,
  TopMenuItemsParams,
  AnalyticsChartsParams,
} from "@/types/analytics-type";
import { ApiResponse } from "@/types/api-type";

// Get revenue report by time range
export const getRevenueReport = async (
  params: RevenueReportParams,
): Promise<RevenueReportResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("startDate", params.startDate);
  queryParams.append("endDate", params.endDate);
  queryParams.append("groupBy", params.groupBy || "day");
  if (params.restaurantId)
    queryParams.append("restaurantId", params.restaurantId);
  const response = await api.get<ApiResponse<RevenueReportResponse>>(
    `/api/orders/analytics/revenue?${queryParams.toString()}`,
  );
  return response.data.data;
};

// Get top menu items by revenue
export const getTopMenuItems = async (
  params: TopMenuItemsParams,
): Promise<TopMenuItemsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("startDate", params.startDate);
  queryParams.append("endDate", params.endDate);
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.restaurantId)
    queryParams.append("restaurantId", params.restaurantId);

  const response = await api.get<ApiResponse<TopMenuItemsResponse>>(
    `/api/orders/analytics/top-items?${queryParams.toString()}`,
  );
  return response.data.data;
};

// Get analytics chart data
export const getAnalyticsCharts = async (
  params: AnalyticsChartsParams,
): Promise<AnalyticsChartsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("startDate", params.startDate);
  queryParams.append("endDate", params.endDate);
  if (params.restaurantId)
    queryParams.append("restaurantId", params.restaurantId);

  const response = await api.get<ApiResponse<AnalyticsChartsResponse>>(
    `/api/orders/analytics/charts?${queryParams.toString()}`,
  );
  return response.data.data;
};
