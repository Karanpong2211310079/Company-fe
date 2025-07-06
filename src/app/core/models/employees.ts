export interface Employees {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    start_date: string;
    salary: string;
}

export interface PaginatedEmployees {
    count: number;
    next: string | null;
    previous: string | null;
    results: Employees[];
}