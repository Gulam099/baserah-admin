export interface PaginationPropType {
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponseType {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
}
