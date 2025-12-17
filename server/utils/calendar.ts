export interface CalendarEvent {
  id: string
  title: string
  date: string // YYYY-MM-DD
  time?: string // HH:mm
  location?: string
  description?: string
}

export const seedEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Dîner cosy',
    date: '2025-12-20',
    time: '19:30',
    location: 'Maison',
    description: 'Playlist douce + plaid',
  },
  {
    id: 'evt-2',
    title: 'Balade au parc',
    date: '2025-12-22',
    time: '11:00',
    location: 'Parc Montsouris',
    description: 'Thermos café, appareil photo',
  },
]

const pad = (n: number) => `${n}`.padStart(2, '0')

function formatDateStamp(date = new Date()) {
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  )
}

function formatDateLocal(date: string, time?: string) {
  if (!time) return date.replaceAll('-', '')
  return `${date.replaceAll('-', '')}T${time.replace(':', '')}00`
}

function escapeText(value: string | undefined) {
  if (!value) return ''
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export function buildIcs(events: CalendarEvent[]) {
  const dtStamp = formatDateStamp()
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nous Deux//Couple Calendar//EN',
    'CALSCALE:GREGORIAN',
  ]

  events.forEach((evt, idx) => {
    const dtStart = formatDateLocal(evt.date, evt.time)
    const uid = `${evt.id || `evt-${idx}`}@nous-deux`
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${uid}`)
    lines.push(`DTSTAMP:${dtStamp}`)
    lines.push(evt.time ? `DTSTART;TZID=Europe/Paris:${dtStart}` : `DTSTART;VALUE=DATE:${dtStart}`)
    lines.push(`SUMMARY:${escapeText(evt.title)}`)
    if (evt.description) lines.push(`DESCRIPTION:${escapeText(evt.description)}`)
    if (evt.location) lines.push(`LOCATION:${escapeText(evt.location)}`)
    lines.push('END:VEVENT')
  })

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

