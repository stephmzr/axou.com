import dayjs from 'dayjs'

/**
 * Normalize any date-like value to a date-only string (YYYY-MM-DD).
 * Keeps calendar logic consistent regardless of timezone offsets.
 */
export function formatDateOnly(value: string | Date): string {
  return dayjs(value).format('YYYY-MM-DD')
}

