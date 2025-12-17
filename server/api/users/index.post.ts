import { UserService } from '../../services/userService'
import type { ApiResponse, User } from '../../../types'

export default defineEventHandler(async (event): Promise<ApiResponse<User>> => {
  try {
    const userService = UserService.getInstance()
    const body = await readBody(event) as User
    const user = await userService.createUser(body)

    return {
      success: true,
      data: user,
      message: 'User created successfully'
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return {
      success: false,
      error: 'Failed to create user',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})