export interface PaginationPropType {
  total: number; // length of data
  page: number; // current page
  size: number; // page size
}

export interface FilterPropsType {
  query: string; // search query
  date: string; // sort by date
  type: string; // sort by type
  specialist?: string; // sort based on specialist
  patient?: string; // sort based on patient
}

export interface ApiResponseType {
  status: number; // response status [ 200 , 201 , 400 , 404 , 500 ]
  success: boolean; // true if data send correctly
  message: string; // response message (  )
  data?: any;
  page?: PaginationPropType;
  filter?: FilterPropsType;
}
