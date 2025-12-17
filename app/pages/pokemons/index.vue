<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Loading State -->
    <div v-if="status === 'pending'" class="flex flex-col items-center justify-center min-h-[400px]">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500" />
      <p class="mt-4 text-lg text-gray-600 font-medium">Chargement des pokemons...</p>
    </div>

    <!-- Pokemon Grid -->
    <div v-if="pokemons?.success" class="container mx-auto px-4 py-8">
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Pokédex</h1>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div 
          v-for="pokemon in pokemons?.data" 
          :key="pokemon.id"
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center"
        >
          <!-- Pokemon Image -->
          <div class="mb-4">
            <img 
              :src="pokemon.sprite" 
              :alt="pokemon.name"
              class="w-20 h-20 mx-auto object-contain"
              loading="lazy"
            >
          </div>
          
          <!-- Pokemon Name -->
          <h3 class="text-lg font-bold text-gray-800 mb-2 capitalize">
            {{ pokemon.name }}
          </h3>
          
          <!-- Pokemon ID -->
          <p class="text-sm text-gray-500 mb-3">
            #{{ pokemon.id.toString().padStart(3, '0') }}
          </p>
          
          <!-- Pokemon Types -->
          <div class="flex flex-wrap justify-center gap-1">
            <span 
              v-for="type in pokemon.types" 
              :key="type"
              class="px-3 py-1 rounded-full text-xs font-medium text-white"
              :class="getTypeColor(type)"
            >
              {{ type }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="pokemons?.success === false" class="flex flex-col items-center justify-center min-h-[400px]">
      <div class="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
      <p class="text-gray-600">{{ pokemons?.message || 'Impossible de charger les pokemons' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: pokemons, status } = await useAsyncData('/api/pokemons/', () => $fetch('/api/pokemons/'))

// Fonction pour obtenir la couleur selon le type de Pokemon
const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    normal: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-500',
    ice: 'bg-cyan-400',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-600',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-600',
    dark: 'bg-gray-800',
    steel: 'bg-gray-400',
    fairy: 'bg-pink-300'
  }

  return typeColors[type.toLowerCase()] || 'bg-gray-500'
}
</script>