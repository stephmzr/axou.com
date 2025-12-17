import { UserService } from '../../services/userService'
import type { ApiResponse, PaginatedResponse, User } from '../../../types'

export default defineEventHandler(async (): Promise<ApiResponse<PaginatedResponse<User>>> => {
  try {
    const userService = UserService.getInstance()
    const users = await userService.getAllUsers()

    return {
      success: true,
      data: {
        data: users,
        total: users.length,
        page: 1,
        limit: users.length
      },
      message: 'Users retrieved successfully'
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return {
      success: false,
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})
