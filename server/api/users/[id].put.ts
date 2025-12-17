import type { ApiResponse, User, UserWithGames } from "~~/types"
import { UserService } from "../../services/userService"

export default defineEventHandler(async (event): Promise<ApiResponse<User | UserWithGames>> => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    const body = await readBody(event) as User

    const userService = UserService.getInstance()
    const user = await userService.updateUser(id, body)

    return {
      success: true,
      data: user as User | UserWithGames,
      message: 'User updated successfully'
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return {
      success: false,
      error: 'Failed to update user',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})