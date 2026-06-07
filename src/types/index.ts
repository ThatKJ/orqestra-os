export interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  use_case: string | null;
  source: string;
  created_at: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
}

export interface DashboardStats {
  totalSignups: number;
  recentSignups: WaitlistEntry[];
  sourceBreakdown: { source: string; count: number }[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
