import type { User, CreateUserRequest, UpdateUserRequest, ApiResponse, PaginatedResponse } from '~~/types'

export const useUsers = () => {
  const getUsers = async (page = 1, limit = 10) => {
    return await $fetch<ApiResponse<PaginatedResponse<User>>>(`/api/users?page=${page}&limit=${limit}`)
  }

  const getUser = async (id: number) => {
    return await $fetch<ApiResponse<User>>(`/api/users/${id}`)
  }

  const getUserWithGames = async (id: number) => {
    return await $fetch<ApiResponse<User>>(`/api/users/${id}?includeGames=true`)
  }

  const createUser = async (userData: CreateUserRequest) => {
    return await $fetch<ApiResponse<User>>('/api/users', {
      method: 'POST',
      body: userData
    })
  }

  const updateUser = async (id: number, userData: UpdateUserRequest) => {
    return await $fetch<ApiResponse<User>>(`/api/users/${id}`, {
      method: 'PUT',
      body: userData
    })
  }

  const deleteUser = async (id: number) => {
    return await $fetch<ApiResponse<null>>(`/api/users/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getUsers,
    getUser,
    getUserWithGames,
    createUser,
    updateUser,
    deleteUser
  }
}
