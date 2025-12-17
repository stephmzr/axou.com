import { UserService } from '../../services/userService'
import type { ApiResponse, User, UserWithGames } from '../../../types'

export default defineEventHandler(async (event): Promise<ApiResponse<User | UserWithGames>> => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    
    if (isNaN(id) || id <= 0) {
      setResponseStatus(event, 400)
      return {
        success: false,
        error: 'Invalid user ID'
      }
    }

    const userService = UserService.getInstance()
    
    const query = getQuery(event)
    const includeGames = query.includeGames === 'true'

    if (includeGames) {
      const userWithGames = await userService.getUserWithGames(id)
      if (!userWithGames) {
        setResponseStatus(event, 404)
        return {
          success: false,
          error: 'User not found'
        }
      }
      
      return {
        success: true,
        data: userWithGames,
        message: 'User with games retrieved successfully'
      }
    } else {
      const user = await userService.getUserById(id)
      if (!user) {
        setResponseStatus(event, 404)
        return {
          success: false,
          error: 'User not found'
        }
      }
      
      return {
        success: true,
        data: user,
        message: 'User retrieved successfully'
      }
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: 'Failed to fetch user',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})
