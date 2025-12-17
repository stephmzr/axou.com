<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

interface MovieIdea {
  title: string
  poster: string | null
  locale: 'vo' | 'vf'
  letterboxdUrl: string
  year: string
}

const movieIdea = ref<MovieIdea | null>(null)
const isLoadingIdea = ref(false)
const ideaError = ref<string | null>(null)

const fetchMovieIdea = async () => {
  ideaError.value = null
  isLoadingIdea.value = true
  try {
    const data = await $fetch<MovieIdea>('/api/movies/idea')
    movieIdea.value = data
  } catch {
    ideaError.value = 'Impossible de récupérer une idée de film.'
  } finally {
    isLoadingIdea.value = false
  }
}
</script>

<template>
  <Card class="border-primary-100/80 bg-white/80 backdrop-blur h-full flex flex-col">
    <CardHeader class="pb-2">
      <CardDescription>Idée ciné</CardDescription>
      <CardTitle class="text-2xl">Clique pour une idée de film</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4 flex-1">
      <div
        v-if="movieIdea"
        class="flex items-start gap-4 rounded-xl border border-primary-100 bg-gradient-to-r from-primary-50 to-emerald-50 p-4 shadow-sm"
      >
        <a
          :href="movieIdea.letterboxdUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="h-20 w-14 overflow-hidden rounded-lg bg-secondary-100 shadow-inner block hover:ring-2 hover:ring-primary-300 transition"
        >
          <img
            v-if="movieIdea.poster"
            :src="movieIdea.poster"
            :alt="movieIdea.title"
            class="h-full w-full object-cover"
          >
          <div v-else class="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Aucun visuel
          </div>
        </a>
        <div class="flex-1 space-y-2">
          <a
            :href="movieIdea.letterboxdUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-lg font-semibold text-foreground hover:text-primary-700 transition"
          >
            {{ movieIdea.title }}
          </a>
          <p class="text-sm text-muted-foreground">
            {{ movieIdea.year }}
          </p>
          <Badge :class="movieIdea.locale === 'vo' ? 'bg-emerald-100 text-emerald-800' : 'bg-primary-100 text-primary-800'">
            {{ movieIdea.locale === 'vo' ? 'en VO' : 'en VF' }}
          </Badge>
        </div>
      </div>

      <p v-else class="text-sm text-muted-foreground">
        Clique pour piocher un film incontournable.
      </p>

      <p v-if="ideaError" class="text-sm text-destructive">
        {{ ideaError }}
      </p>
    </CardContent>
    <CardFooter class="flex justify-end mt-auto">
      <Button
        class="bg-gradient-to-r from-primary-500 to-emerald-400 text-white border-0 shadow-sm"
        :disabled="isLoadingIdea"
        @click="fetchMovieIdea"
      >
        {{ isLoadingIdea ? 'Recherche...' : 'Chercher un film' }}
      </Button>
    </CardFooter>
  </Card>
</template>

