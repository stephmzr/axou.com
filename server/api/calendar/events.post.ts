import { z } from 'zod'
import { CalendarService } from '../../services/calendarService'

const schema = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  location: z.string().optional(),
  description: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid event payload' })
  }

  const service = CalendarService.getInstance()
  try {
    const event = await service.addEvent(parsed.data)
    return {
      success: true,
      data: event,
      message: 'Event added successfully'
    }
  } catch (error) {
    console.error('Error adding event:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to add event' })
  }
})
