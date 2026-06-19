import React from 'react';
import { render } from '@testing-library/react-native';
import { ReservationCard } from '../ReservationCard';
import type { Reservation } from '@/features/bookings/types/reservation';

const BASE_RESERVATION: Reservation = {
  id: 101,
  resource: 42,
  resourceName: 'Переговорная A-201',
  resourceType: 'meeting_room',
  capsuleZone: '',
  user: 42,
  userName: 'Иван Петров',
  bookedBy: { id: 42, full_name: 'Иван Петров', avatar: null },
  company: 5,
  startTime: '2024-06-15T09:00:00+06:00',
  endTime: '2024-06-15T10:00:00+06:00',
  status: 'confirmed',
  description: 'Встреча с клиентом',
  cancelledBy: null,
  cancelReason: null,
  participants: [],
  recurringBookingId: null,
  checkedInAt: null,
  qrCode: null,
  qrImageUrl: null,
  createdAt: '2024-06-14T12:00:00Z',
  updatedAt: '2024-06-14T12:00:00Z',
};

describe('ReservationCard', () => {
  it('renders resource name', () => {
    const { getByText } = render(<ReservationCard reservation={BASE_RESERVATION} />);
    expect(getByText('Переговорная A-201')).toBeTruthy();
  });

  it('formats time range correctly', () => {
    const { getByText } = render(<ReservationCard reservation={BASE_RESERVATION} />);
    expect(getByText(/09:00–10:00/)).toBeTruthy();
  });

  it('formats date correctly', () => {
    const { getByText } = render(<ReservationCard reservation={BASE_RESERVATION} />);
    expect(getByText(/15 июн/)).toBeTruthy();
  });

  it('shows confirmed status badge', () => {
    const { getByText } = render(<ReservationCard reservation={BASE_RESERVATION} />);
    expect(getByText('Подтверждено')).toBeTruthy();
  });

  it('shows cancelled status badge', () => {
    const reservation: Reservation = { ...BASE_RESERVATION, status: 'cancelled' };
    const { getByText } = render(<ReservationCard reservation={reservation} />);
    expect(getByText('Отменено')).toBeTruthy();
  });

  it('shows no_show status badge', () => {
    const reservation: Reservation = { ...BASE_RESERVATION, status: 'no_show' };
    const { getByText } = render(<ReservationCard reservation={reservation} />);
    expect(getByText('Не явился')).toBeTruthy();
  });

  it('shows resource type label', () => {
    const { getByText } = render(<ReservationCard reservation={BASE_RESERVATION} />);
    expect(getByText('Переговорная')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<ReservationCard reservation={BASE_RESERVATION} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
