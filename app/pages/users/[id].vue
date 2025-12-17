<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
        <p class="mt-4 text-gray-600">Chargement des données utilisateur...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          @click="loadUser"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- User Content -->
    <div v-else-if="user" class="py-8">
      <!-- User Header -->
      <div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ user.name }}</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Email</p>
            <p class="text-lg text-gray-900">{{ user.email }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Créé le</p>
            <p class="text-lg text-gray-900">{{ formatDate(user.createdAt) }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Mis à jour le</p>
            <p class="text-lg text-gray-900">{{ formatDate(user.updatedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Games Section -->
      <div v-if="user.games && user.games.length > 0" class="bg-white border border-gray-200 rounded-lg">
        <h2 class="text-xl font-semibold p-4 border-b border-gray-200 m-0">Jeux joués ({{ user.games.length }})</h2>
        <div class="flex flex-col">
          <div v-for="game in user.games" :key="game.id" class="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50">
            <div class="user-info">
              <h3 class="font-medium m-0 mb-1">{{ game.game?.name }}</h3>
              <small class="text-gray-400 text-sm">
                Ajouté le {{ formatDate(game.createdAt) }}
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- No Games State -->
      <div v-else class="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <div class="text-gray-400 text-6xl mb-4">🎮</div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Aucun jeu enregistré</h2>
        <p class="text-gray-500">Cet utilisateur n'a pas encore de jeux associés.</p>
      </div>
    </div>

    <!-- User Not Found -->
    <div v-else class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div class="text-gray-400 text-6xl mb-4">👤</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Utilisateur non trouvé</h2>
        <p class="text-gray-600 mb-4">L'utilisateur demandé n'existe pas ou a été supprimé.</p>
        <button 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          @click="navigateTo('/')"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../../../types'
import { useUsers } from '../../../composables/useUsers'

const { getUserWithGames } = useUsers()
const route = useRoute()

const user = ref<User | undefined>(undefined)
const isLoading = ref(true)
const error = ref<string | null>(null)

const userId = computed(() => Number(route.params.id))

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadUser = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await getUserWithGames(userId.value)
      console.log(response)
    if (response.success && response.data) {
      console.log(response.data)
      user.value = response.data
    } else {
      error.value = response.error || 'Erreur lors du chargement de l\'utilisateur'
    }
  } catch (err) {
    console.error('Error loading user:', err)
    error.value = 'Une erreur est survenue lors du chargement des données'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUser()
})
</script>