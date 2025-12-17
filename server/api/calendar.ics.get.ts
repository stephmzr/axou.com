import { buildIcs } from '../utils/calendar'
import { CalendarService } from '../services/calendarService'

export default defineEventHandler(async (event) => {
  const service = CalendarService.getInstance()
  const events = await service.listEvents()

  const ics = buildIcs(events)

  setHeader(event, 'Content-Type', 'text/calendar; charset=utf-8')
  setHeader(event, 'Content-Disposition', 'attachment; filename="nous-deux.ics"')
  return ics
})

