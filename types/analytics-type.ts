// Revenue report types
export interface RevenueReportItem {
  date: string;
  revenue: number;
  orderCount: number;
}

export type RevenueReportResponse = RevenueReportItem[];

export interface RevenueReportParams {
  startDate: string;
  endDate: string;
  groupBy?: "day" | "week" | "month";
  restaurantId?: string;
}

// Top menu items types
export interface TopMenuItem {
  menuItemId: string;
  name: string;
  totalRevenue: number;
  totalQuantity: number;
}

export type TopMenuItemsResponse = TopMenuItem[];

export interface TopMenuItemsParams {
  startDate: string;
  endDate: string;
  limit?: number;
  restaurantId?: string;
}

// Analytics charts types
export interface OrdersPerDayItem {
  date: string;
  count: number;
}

export interface PeakHourItem {
  hour: number;
  count: number;
}

export interface PopularItemItem {
  menuItemId: string;
  name: string;
  count: number;
}

export interface AnalyticsChartsData {
  ordersPerDay: OrdersPerDayItem[];
  peakHours: PeakHourItem[];
  popularItems: PopularItemItem[];
}

export type AnalyticsChartsResponse = AnalyticsChartsData;

export interface AnalyticsChartsParams {
  startDate: string;
  endDate: string;
  restaurantId?: string;
}

// Date range presets
export type DateRangePreset = "today" | "week" | "month" | "custom";

export interface DateRange {
  startDate: string;
  endDate: string;
}
