export interface RecurringBooking {
  id: number;
  resource: number;
  resource_id: number;
  user: number;
  company: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  skipped_dates: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateRecurringBody {
  resource_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  repeat_until: string;
}

export interface UpdateRecurringBody {
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
  repeat_until?: string;
}
