export const BOOKING_STATUS_LABELS: Record<string, string> = {
  confirmed: 'Подтверждено',
  pending: 'Ожидание',
  cancelled: 'Отменено',
  completed: 'Завершено',
  no_show: 'Не пришёл',
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  urgent: 'Срочный',
};

export const LEAVE_TYPE_LABELS: Record<string, string> = {
  vacation: 'Отпуск',
  day_off: 'Отгул',
  sick_leave: 'Больничный',
  remote: 'Удалённая работа',
};

export const RESOURCE_TYPE_LABELS: Record<string, string> = {
  meeting_room: 'Переговорная',
  desk: 'Рабочий стол',
  open_space: 'Открытое пространство',
};

export const ANNOUNCEMENT_CATEGORY_LABELS: Record<string, string> = {
  info: 'Инфо',
  event: 'Событие',
  warning: 'Важно',
  urgent: 'Срочно',
};
