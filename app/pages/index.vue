<script setup lang="ts">
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import MovieIdeaCard from '~/components/MovieIdeaCard.vue'
import CalendarCard from '~/components/CalendarCard.vue'
import ReasonCard from '~/components/ReasonCard.vue'
import { useCoupleStats } from '../../composables/useCoupleStats'
import { loveReasons, quickStatsData } from '../constants/dashboard'

const { today, daysTogether, monthsTogether, yearsTogether, milestones } = useCoupleStats('2025-09-21')

const quickStats = quickStatsData

</script>

<template>
  <div class="space-y-8 pb-10">
    <Card class="border-primary-200/70 bg-gradient-to-r from-primary-100 via-white to-emerald-50 shadow-lg shadow-primary-200/40">
      <CardHeader class="pb-4 space-y-2">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <CardTitle class="text-3xl sm:text-4xl font-bold text-foreground">
            Title
          </CardTitle>
          <p class="text-sm text-muted-foreground">
            Synchronisée au {{ today.toLocaleDateString('fr-FR') }}
          </p>
        </div>
        <CardDescription class="text-lg">
          Description
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-wide text-muted-foreground">Ensemble depuis</p>
          <p class="mt-2 text-5xl sm:text-6xl font-black text-primary-800">
            {{ daysTogether }}
            <span class="text-2xl sm:text-3xl font-semibold">jours</span>
          </p>
          <p class="mt-2 text-sm text-muted-foreground">
            Soit {{ yearsTogether }} ans et {{ monthsTogether }} mois d’histoires partagées.
          </p>
        </div>
      </CardContent>
      <CardFooter class="flex flex-wrap gap-4">
        <div
          v-for="milestone in milestones"
          :key="milestone.title"
          class="flex flex-col rounded-xl bg-white/60 px-4 py-3 text-sm shadow-sm ring-1 ring-primary-100"
        >
          <span class="text-muted-foreground">{{ milestone.title }}</span>
          <span class="text-base font-semibold text-foreground">{{ milestone.value }}</span>
          <span class="text-xs text-muted-foreground">{{ milestone.caption }}</span>
        </div>
        <div class="flex ml-auto gap-3">
          <Button variant="secondary" class="bg-white text-foreground shadow-sm">
            Ajouter un souvenir
          </Button>
          <Button class="bg-gradient-to-r from-primary-500 to-emerald-400 text-white border-0 shadow-lg shadow-primary-200/60">
            Fêter ça
          </Button>
        </div>
      </CardFooter>
    </Card>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="stat in quickStats"
        :key="stat.label"
        class="overflow-hidden border-0 shadow-md shadow-primary-100"
      >
        <div :class="`h-1 w-full bg-gradient-to-r ${stat.accent}`" />
        <CardHeader class="pb-2">
          <CardDescription class="text-xs uppercase tracking-wide">{{ stat.label }}</CardDescription>
          <CardTitle class="text-3xl font-bold text-foreground">{{ stat.value }}</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">{{ stat.detail }}</p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <ReasonCard :reasons="loveReasons" :seed="daysTogether" />

      <MovieIdeaCard class="lg:col-span-1" />
    </div>

    <CalendarCard />
  </div>
</template>