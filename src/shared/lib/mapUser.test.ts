import { mapApiUser } from '@/shared/lib/mapUser';

const FIXTURE: Record<string, unknown> = {
  id: 42,
  email: 'ivan.petrov@example.com',
  first_name: 'Иван',
  last_name: 'Петров',
  full_name: 'Иван Петров',
  phone: '+77001234567',
  position: 'Менеджер проектов',
  avatar: 'https://your-domain.com/media/avatars/42/photo.jpg',
  role: 'employee',
  company: {
    id: 5,
    name: 'ТОО Астана Бизнес',
    onboarding_completed: true,
  },
  is_email_verified: true,
  date_joined: '2024-01-15T10:30:00Z',
};

describe('mapApiUser', () => {
  it('parses all fields from /auth/me/ fixture', () => {
    const user = mapApiUser(FIXTURE);
    expect(user.id).toBe(42);
    expect(user.email).toBe('ivan.petrov@example.com');
    expect(user.first_name).toBe('Иван');
    expect(user.last_name).toBe('Петров');
    expect(user.full_name).toBe('Иван Петров');
    expect(user.phone).toBe('+77001234567');
    expect(user.position).toBe('Менеджер проектов');
    expect(user.avatar).toBe('https://your-domain.com/media/avatars/42/photo.jpg');
    expect(user.role).toBe('employee');
    expect(user.company).toEqual({ id: 5, name: 'ТОО Астана Бизнес', onboarding_completed: true });
    expect(user.company_id).toBe(5);
    expect(user.company_name).toBe('ТОО Астана Бизнес');
    expect(user.is_email_verified).toBe(true);
    expect(user.date_joined).toBe('2024-01-15T10:30:00Z');
  });

  it('resolves full_name from server string when provided', () => {
    const user = mapApiUser({ ...FIXTURE, full_name: 'Иван Петров' });
    expect(user.full_name).toBe('Иван Петров');
  });

  it('falls back to combined first_name + last_name when full_name is blank', () => {
    const user = mapApiUser({ ...FIXTURE, full_name: '' });
    expect(user.full_name).toBe('Иван Петров');
  });

  it('handles nullable avatar', () => {
    const user = mapApiUser({ ...FIXTURE, avatar: null });
    expect(user.avatar).toBeNull();
  });

  it('handles null company', () => {
    const user = mapApiUser({ ...FIXTURE, company: null });
    expect(user.company).toBeNull();
    expect(user.company_id).toBeNull();
    expect(user.company_name).toBeNull();
  });

  it('defaults unknown role to guest', () => {
    const user = mapApiUser({ ...FIXTURE, role: 'alien' });
    expect(user.role).toBe('guest');
  });

  it('handles null phone and position', () => {
    const user = mapApiUser({ ...FIXTURE, phone: null, position: null });
    expect(user.phone).toBeNull();
    expect(user.position).toBeNull();
  });
});
