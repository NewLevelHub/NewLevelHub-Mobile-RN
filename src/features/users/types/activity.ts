export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type PassStatus = 'active' | 'used' | 'expired' | 'revoked';

export interface ActivityBooking {
  id: number;
  resource_name: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
}

export interface ActivityTask {
  id: number;
  title: string;
  priority: TaskPriority;
  deadline: string;
  board_name: string;
  board_id: number;
}

export interface ActivityPass {
  id: number;
  guest_name: string;
  status: PassStatus;
  valid_from: string;
  valid_until: string;
}

export interface ActivityFeedResponse {
  bookings: ActivityBooking[];
  tasks: ActivityTask[];
  passes: ActivityPass[];
}
