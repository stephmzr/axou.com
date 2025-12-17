import { CalendarService } from '../../services/calendarService'

export default defineEventHandler(async () => {
  const service = CalendarService.getInstance()
  const events = await service.listEvents()
  try {
    return {
      success: true,
      data: events,
      message: 'Events retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch events' })
  }
})

