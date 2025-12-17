import type { ApiResponse } from '~~/types'
import { UserService } from '../../services/userService'

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    
    if (!id || isNaN(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID utilisateur invalide'
      })
    }

    const userService = UserService.getInstance()
    const deleted = userService.deleteUser(id)
    
    if (!deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    return {
      success: true,
      data: null,
      message: 'Utilisateur supprimé avec succès'
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la suppression de l\'utilisateur'
    })
  }
})
