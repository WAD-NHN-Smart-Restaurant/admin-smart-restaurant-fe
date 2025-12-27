export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Pagination {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: Pagination;
  };
  message?: string;
}
