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
  desk: 'Стол',
  meeting_room: 'Переговорная',
  parking: 'Парковка',
  capsule: 'Капсула',
  open_space: 'Открытое пространство',
};

export const RESOURCE_STATUS_LABELS: Record<string, string> = {
  free: 'Свободно',
  occupied: 'Занято',
  soon_available: 'Скоро освободится',
  blocked: 'Заблокировано',
};

export const RESERVATION_STATUS_LABELS: Record<string, string> = {
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
  completed: 'Завершено',
  no_show: 'Не явился',
};

export const EQUIPMENT_LABELS: Record<string, string> = {
  projector: 'Проектор',
  tv: 'Телевизор',
  whiteboard: 'Маркерная доска',
  video_conf: 'Видеоконференция',
  monitor: 'Монитор',
  dock: 'Докстанция',
  power_outlet: 'Розетки',
};

export const ANNOUNCEMENT_CATEGORY_LABELS: Record<string, string> = {
  info: 'Инфо',
  event: 'Событие',
  warning: 'Важно',
  urgent: 'Срочно',
};
