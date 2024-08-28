export function formatDateString(dt: string | undefined): string {
  if (!dt) return '';
  const date = new Date(dt);
  if (typeof date.getMonth !== 'function') return '';
  const formatter = new Intl.DateTimeFormat('nb-NO', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
}
