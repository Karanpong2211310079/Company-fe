export interface Employees {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  phone_number: string;
  start_date: string;
  salary: number;
}

export interface PaginatedEmployees {
  total: number;
  offset?: number;
  limit?: number;
  results: Employees[];
}
