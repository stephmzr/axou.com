import { DatabaseService } from './databaseService'
import type { CalendarEvent } from '../utils/calendar'
import { formatDateOnly } from '../utils/date'

export class CalendarService {
  private static instance: CalendarService
  private db: DatabaseService
  private ready: Promise<void>

  private constructor() {
    this.db = DatabaseService.getInstance()
    this.ready = this.ensureTable()
  }

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService()
    }
    return CalendarService.instance
  }

  private async ensureTable() {
    await this.db.queryAll(
      `
      CREATE TABLE IF NOT EXISTS calendar_events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        event_date DATE NOT NULL,
        event_time TIME NULL,
        location TEXT NULL,
        description TEXT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
    )
  }

  async listEvents(): Promise<CalendarEvent[]> {
    await this.ready
    const rows = await this.db.queryAll<{
      id: number
      title: string
      event_date: string
      event_time: string | null
      location: string | null
      description: string | null
    }>(
      `
      SELECT id, title, event_date, event_time, location, description
      FROM calendar_events
      ORDER BY event_date ASC, event_time ASC NULLS FIRST, id ASC
    `,
    )

    return rows.map((row) => ({
      id: row.id.toString(),
      title: row.title,
      date: formatDateOnly(row.event_date),
      time: row.event_time ?? undefined,
      location: row.location ?? undefined,
      description: row.description ?? undefined,
    }))
  }

  async addEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    await this.ready
    const result = await this.db.query<{
      id: number
      title: string
      event_date: string
      event_time: string | null
      location: string | null
      description: string | null
    }>(
      `
      INSERT INTO calendar_events (title, event_date, event_time, location, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, event_date, event_time, location, description
    `,
      [
        event.title,
        event.date,
        event.time ?? null,
        event.location ?? null,
        event.description ?? null,
      ],
    )

    return {
      id: result.id.toString(),
      title: result.title,
      date: formatDateOnly(result.event_date),
      time: result.event_time ?? undefined,
      location: result.location ?? undefined,
      description: result.description ?? undefined,
    }
  }
}

