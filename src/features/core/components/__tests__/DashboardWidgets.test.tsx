import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { KpiCard } from '../KpiCard';
import { BookingCard } from '../BookingCard';

// ─── KpiCard ──────────────────────────────────────────────────────────────────

describe('KpiCard', () => {
  it('renders label and value', async () => {
    await render(<KpiCard label="Брони сегодня" value={12} />);
    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText('Брони сегодня')).toBeTruthy();
  });

  it('renders suffix when provided', async () => {
    await render(<KpiCard label="Нагрузка" value={74} suffix="%" />);
    expect(screen.getByText('%')).toBeTruthy();
  });

  it('matches snapshot', async () => {
    const { toJSON } = await render(
      <KpiCard label="Сотрудников" value={42} accent="#059669" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

// ─── BookingCard ──────────────────────────────────────────────────────────────

const BOOKING_CONFIRMED = {
  id: 1,
  resource_name: 'Переговорная A',
  user_name: 'Иван Петров',
  company_name: 'Acme Corp',
  start_time: '2025-01-15T09:00:00Z',
  end_time: '2025-01-15T11:00:00Z',
  status: 'confirmed',
};

const BOOKING_CANCELLED = {
  ...BOOKING_CONFIRMED,
  id: 2,
  status: 'cancelled',
  company_name: undefined,
};

const BOOKING_PENDING = {
  ...BOOKING_CONFIRMED,
  id: 3,
  status: 'pending',
};

describe('BookingCard', () => {
  it('renders resource name', async () => {
    await render(<BookingCard item={BOOKING_CONFIRMED} />);
    expect(screen.getByText('Переговорная A')).toBeTruthy();
  });

  it('shows confirmed status label', async () => {
    await render(<BookingCard item={BOOKING_CONFIRMED} />);
    expect(screen.getByText('Подтверждено')).toBeTruthy();
  });

  it('shows cancelled status label', async () => {
    await render(<BookingCard item={BOOKING_CANCELLED} />);
    expect(screen.getByText('Отменено')).toBeTruthy();
  });

  it('shows pending status label', async () => {
    await render(<BookingCard item={BOOKING_PENDING} />);
    expect(screen.getByText('Ожидание')).toBeTruthy();
  });

  it('hides company name when absent', async () => {
    await render(<BookingCard item={BOOKING_CANCELLED} />);
    expect(screen.queryByText('Acme Corp')).toBeNull();
  });

  it('matches snapshot (confirmed)', async () => {
    const { toJSON } = await render(<BookingCard item={BOOKING_CONFIRMED} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
