<template>
  <div>
    <!-- Formulaire de création -->
    <div class="bg-white border border-gray-200 p-4 py-4 rounded-lg mb-6 mt-8">
      <h2 class="text-xl font-semibold mb-4">Créer un utilisateur</h2>
      <form class="flex flex-col gap-4" @submit.prevent="handleCreateUser">
        <div class="flex flex-col gap-1">
          <label class="font-medium text-sm">Nom</label>
          <input 
            v-model="newUser.name" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded"
            required
          >
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium text-sm">Email</label>
          <input 
            v-model="newUser.email" 
            type="email" 
            class="w-full p-2 border border-gray-300 rounded"
            required
          >
        </div>
        <div class="flex justify-end mt-2">
          <Button variant="default" type="submit" :disabled="loading">
            {{ loading ? 'En cours...' : 'Créer' }}
          </Button>
        </div>
      </form>
    </div>

    <!-- Liste des utilisateurs -->
    <div class="bg-white border border-gray-200 rounded-lg">
      <h2 class="text-xl font-semibold p-4 border-b border-gray-200 m-0">Utilisateurs</h2>
      <div v-if="loading" class="p-4">Chargement...</div>
      <div v-else-if="error" class="p-4 text-red-600">{{ error }}</div>
      <div v-else-if="users.length === 0" class="p-4 text-gray-500">Aucun utilisateur</div>
      <div v-else class="flex flex-col">
        <div v-for="user in users" :key="user.id" class="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50" @click="goToUser(user.id)">
          <div class="user-info">
            <h3 class="font-medium m-0 mb-1">{{ user.name }}</h3>
            <p class="text-gray-500 m-0 mb-1">{{ user.email }}</p>
            <small class="text-gray-400 text-sm">
              Créé le {{ new Date(user.createdAt).toLocaleDateString() }}
            </small>
          </div>
          <div class="flex gap-2">
            <Button
              variant="destructive"
              @click.stop="handleDeleteUser(user.id)"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, CreateUserRequest } from '../../../types'
import { useUsers } from '../../../composables/useUsers'
import { Button } from "@/components/ui/button"


const { getUsers, createUser, deleteUser } = useUsers()

const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')
const newUser = ref<CreateUserRequest>({
  name: '',
  email: ''
})

onMounted(async () => {
  await loadUsers()
})

const loadUsers = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await getUsers()
    if (response.success && response.data) {
      users.value = response.data.data
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement des utilisateurs'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleCreateUser = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await createUser(newUser.value)
    if (response.success) {
      newUser.value = { name: '', email: '' }
      await loadUsers()
    }
  } catch (err) {
    error.value = 'Erreur lors de la création de l\'utilisateur'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleDeleteUser = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    return
  }
  
  try {
    loading.value = true
    error.value = ''
    const response = await deleteUser(id)
    console.log(response)
    if (response.success) {
      await loadUsers()
    }
  } catch (err) {
    error.value = 'Erreur lors de la suppression de l\'utilisateur'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const goToUser = (id: number) => {
  navigateTo(`/users/${id}?includeGames=true`)
}
</script>

