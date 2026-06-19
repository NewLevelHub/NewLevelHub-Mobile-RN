export type ResourceType = 'desk' | 'meeting_room' | 'parking' | 'capsule';
export type ResourceStatus = 'free' | 'occupied' | 'soon_available' | 'blocked';

export interface ResourceEquipment {
  projector: boolean;
  tv: boolean;
  whiteboard: boolean;
  video_conf: boolean;
  monitor: boolean;
  dock: boolean;
  power_outlet: boolean;
}

export interface ResourcePhoto {
  id: number;
  image: string;
  image_url: string;
  created_at: string;
}

export interface ScheduleSlot {
  booking_id: number;
  start: string;
  end: string;
  status?: string;
  user_name?: string;
}

export interface Resource {
  id: number;
  type: ResourceType;
  name: string;
  floor_id: number;
  floor_number: number;
  floor_name: string;
  zone: string;
  photoUrl: string | null;
  photos: ResourcePhoto[];
  capacity: number | null;
  equipment: ResourceEquipment | null;
  isActive: boolean;
  isHotDesk: boolean;
  availabilityDays: number[];
  parkingType: string | null;
  capsuleZone: string;
  assignedCompany: number | null;
  assignedCompanyName: string | null;
  status: ResourceStatus;
  reason: string | null;
  availableAt: string | null;
  schedule?: ScheduleSlot[];
}

export interface ResourcesParams {
  type?: ResourceType;
  resource_type?: ResourceType;
  floor?: number;
  capacity_min?: number;
  capacity_max?: number;
  equipment?: string;
  has_projector?: boolean;
  has_tv?: boolean;
  has_video_conf?: boolean;
  available_from?: string;
  available_to?: string;
  search?: string;
  ordering?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}

export interface ResourceScheduleParams {
  date?: string;
  week?: string;
}
