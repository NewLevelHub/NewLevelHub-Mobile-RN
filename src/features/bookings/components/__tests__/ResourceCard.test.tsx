import React from 'react';
import { render } from '@testing-library/react-native';
import { ResourceCard } from '../ResourceCard';
import type { Resource } from '@/features/bookings/types/resource';

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

const BASE_RESOURCE: Resource = {
  id: 42,
  type: 'meeting_room',
  name: 'Переговорная A-201',
  floor_id: 3,
  floor_number: 3,
  floor_name: 'Этаж 3',
  zone: 'Open Space',
  photoUrl: 'https://example.com/room.jpg',
  photos: [],
  capacity: 8,
  equipment: {
    projector: true,
    tv: false,
    whiteboard: true,
    video_conf: true,
    monitor: false,
    dock: false,
    power_outlet: true,
  },
  isActive: true,
  isHotDesk: false,
  availabilityDays: [0, 1, 2, 3, 4],
  parkingType: null,
  capsuleZone: '',
  assignedCompany: null,
  assignedCompanyName: null,
  status: 'free',
  reason: null,
  availableAt: null,
  schedule: [],
};

describe('ResourceCard', () => {
  it('renders resource name and floor', () => {
    const { getByText } = render(<ResourceCard resource={BASE_RESOURCE} />);
    expect(getByText('Переговорная A-201')).toBeTruthy();
    expect(getByText(/Этаж 3/)).toBeTruthy();
  });

  it('shows capacity when provided', () => {
    const { getByText } = render(<ResourceCard resource={BASE_RESOURCE} />);
    expect(getByText(/до 8 чел/)).toBeTruthy();
  });

  it('shows "Свободно" badge for free status', () => {
    const { getByText } = render(<ResourceCard resource={BASE_RESOURCE} />);
    expect(getByText('Свободно')).toBeTruthy();
  });

  it('shows "Переговорная" type chip', () => {
    const { getByText } = render(<ResourceCard resource={BASE_RESOURCE} />);
    expect(getByText('Переговорная')).toBeTruthy();
  });

  it('shows soon_available status with time', () => {
    const resource: Resource = {
      ...BASE_RESOURCE,
      status: 'soon_available',
      availableAt: '2026-06-19T11:30:00+06:00',
    };
    const { getByText } = render(<ResourceCard resource={resource} />);
    expect(getByText(/Скоро освободится с 11:30/)).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<ResourceCard resource={BASE_RESOURCE} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
