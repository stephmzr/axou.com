export interface CalendarEvent {
  id: string
  title: string
  date: string // YYYY-MM-DD
  time?: string
  location?: string
  description?: string
}

export interface CalendarApi {
  list: () => Promise<CalendarEvent[]>
  add: (evt: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent>
  downloadUrl: string
}

export function useCalendarApi(): CalendarApi {
  const list = async () => $fetch<CalendarEvent[]>('/api/calendar/events')
  const add = async (evt: Omit<CalendarEvent, 'id'>) =>
    $fetch<CalendarEvent>('/api/calendar/events', {
      method: 'POST',
      body: evt,
    })

  return {
    list,
    add,
    downloadUrl: '/api/calendar.ics',
  }
}

