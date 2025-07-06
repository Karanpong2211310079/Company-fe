export interface Logs {
    id: number;
    user: string | null;
    action: string;
    detail: string;
    timestamp: string;
}