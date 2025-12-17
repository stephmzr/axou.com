<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Modal } from '~/components/ui/modal'
import type { CalendarEvent } from '../../composables/useCalendar'
import { useCalendarApi } from '../../composables/useCalendar'
import type { ApiResponse } from '~~/types'
import dayjs from 'dayjs'

interface Props {
  initialEvents?: CalendarEvent[]
}

const props = withDefaults(defineProps<Props>(), {
  initialEvents: () => [],
})

const isOpen = ref(false)
const events = ref<CalendarEvent[]>([...props.initialEvents])
const today = new Date()
const activeMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const api = useCalendarApi()
const isLoading = ref(false)
const modalTitleId = 'calendar-modal-title'
const modalDescId = 'calendar-modal-description'

const form = reactive({
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
})

const resetForm = () => {
  form.title = ''
  form.date = ''
  form.time = ''
  form.location = ''
  form.description = ''
}

const monthLabel = computed(() =>
  activeMonth.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
)

const daysInMonth = computed(() => {
  const y = activeMonth.value.getFullYear()
  const m = activeMonth.value.getMonth()
  return new Date(y, m + 1, 0).getDate()
})

const firstWeekday = computed(() => {
  // Monday as first day
  const wd = activeMonth.value.getDay()
  return wd === 0 ? 6 : wd - 1
})

const eventsByDate = computed(() => {
  const map: Record<string, CalendarEvent[]> = {}
  events.value.forEach((evt) => {
    if (!map[evt.date]) map[evt.date] = []
    map[evt.date]!.push(evt)
  })
  return map
})

const calendarCells = computed(() => {
  const total = firstWeekday.value + daysInMonth.value
  return Array.from({ length: total }, (_, idx) => {
    if (idx < firstWeekday.value) return null
    const day = idx - firstWeekday.value + 1
    const date = new Date(activeMonth.value.getFullYear(), activeMonth.value.getMonth(), day)
    const iso = date.toISOString().slice(0, 10)
    return {
      day,
      iso,
      events: eventsByDate.value[iso] || [],
      isToday: iso === today.toISOString().slice(0, 10),
    }
  })
})

const upcomingEvents = computed(() => {
  const now = dayjs().startOf('day')
  return [...events.value]
    .filter((e) => dayjs(e.date).startOf('day').diff(now, 'day') >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6)
})

const addEvent = () => {
  if (!form.title || !form.date) return
  api.add({
    title: form.title,
    date: form.date,
    time: form.time || undefined,
    location: form.location || undefined,
    description: form.description || undefined,
  }).then((evt) => {
    events.value = [...events.value, evt]
    resetForm()
  }).catch(() => {
    // Optional: surface a toast. For now we just log.
    console.error('Impossible d’ajouter l’événement')
  })
}

const gotoMonth = (delta: number) => {
  const next = new Date(activeMonth.value)
  next.setMonth(next.getMonth() + delta)
  activeMonth.value = next
}

const loadEvents = async () => {
  isLoading.value = true
  try {
    const response = await $fetch<ApiResponse<CalendarEvent[]>>('/api/calendar/events')
    if (response.success && response.data) {
      events.value = response.data
    } else {
      console.error('Impossible de charger les événements', response.error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch events' })
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch events' })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadEvents()
})
</script>

<template>
  <Card class="border-primary-100/80 bg-white/80 backdrop-blur">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between gap-3">
        <CardTitle class="text-2xl text-foreground">Calendrier partagé</CardTitle>
        <div class="flex gap-2">

          <Button class="bg-gradient-to-r from-primary-500 to-emerald-400 text-white border-0 shadow-sm" @click="isOpen = true">
            Ouvrir le calendrier
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent class="space-y-3 text-sm text-muted-foreground">
      <p>Planifie vos rendez-vous et exporte-les vers ton agenda (ICS compatible). Ajoute des moments, lieux et notes.</p>
    </CardContent>
  </Card>

  <Modal
    v-model="isOpen"
    :title-id="modalTitleId"
    :description-id="modalDescId"
    max-width="max-w-5xl"
  >
    <div class="flex flex-col">
      <div class="flex items-center justify-between gap-3 border-b border-primary-100 bg-white/90 px-6 py-4">
        <div class="flex items-center gap-5">
          <Button variant="secondary" size="sm" @click="gotoMonth(-1)">←</Button>
          <h2 :id="modalTitleId" class="text-xl font-semibold capitalize text-foreground">{{ monthLabel }}</h2>
          <Button variant="secondary" size="sm" @click="gotoMonth(1)">→</Button>
        </div>
        <div class="flex gap-2">
          <Button variant="secondary" size="sm" :href="api.downloadUrl">
            Export .ics
          </Button>
          <Button size="sm" class="bg-gradient-to-r from-primary-500 to-emerald-400 text-white border-0" @click="isOpen = false">
            Fermer
          </Button>
        </div>
      </div>
      <p :id="modalDescId" class="px-6 pt-3 text-sm text-muted-foreground">
        Vue calendrier + ajout d’événements compatibles agenda.
      </p>
    </div>

    <div
      class="flex flex-col gap-4 px-6 pb-6 pt-2 overflow-auto"
      :class="{ 'opacity-50 pointer-events-none': isLoading }"
    >
      <div class="grid lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 border border-primary-100 rounded-xl p-4 bg-white/60">
          <div class="grid grid-cols-7 text-xs font-semibold text-muted-foreground mb-2">
            <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
          </div>
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="(cell, idx) in calendarCells"
              :key="idx"
              class="h-20 rounded-lg border border-primary-50 bg-white/70 p-2 text-xs relative"
              :class="cell?.isToday ? 'ring-2 ring-primary-300' : ''"
            >
              <template v-if="cell">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-foreground">{{ cell.day }}</span>
                  <span v-if="cell.events.length" class="size-2 rounded-full bg-primary-500" />
                </div>
                <div class="mt-1 space-y-1">
                  <div
                    v-for="evt in cell.events.slice(0, 2)"
                    :key="evt.id"
                    class="truncate rounded-md bg-primary-50 px-2 py-1 text-[11px] text-primary-800"
                  >
                    {{ evt.title }}
                  </div>
                  <div v-if="cell.events.length > 2" class="text-[10px] text-muted-foreground">
                    +{{ cell.events.length - 2 }} autres
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="rounded-xl border border-primary-100 bg-white/70 p-3">
            <p class="text-sm font-semibold text-foreground mb-2">Événements à venir</p>
            <div v-if="upcomingEvents.length" class="space-y-2">
              <div
                v-for="evt in upcomingEvents"
                :key="evt.id"
                class="rounded-lg border border-primary-50 bg-primary-50 px-3 py-2"
              >
                <div class="flex justify-between text-sm font-semibold text-foreground">
                  <span>{{ evt.title }}</span>
                  <Badge variant="secondary" class="text-[11px] capitalize">{{ dayjs(evt.date).format('DD/MM/YYYY') }}</Badge>
                </div>
                <p class="text-xs text-muted-foreground">
                  {{ evt.time ? evt.time + ' · ' : '' }}{{ evt.location || 'Lieu à définir' }}
                </p>
              </div>
            </div>
            <p v-else class="text-xs text-muted-foreground">Aucun événement à venir.</p>
          </div>

          <form
            class="rounded-xl border border-primary-100 bg-white/80 p-3 space-y-2"
            @submit.prevent="addEvent"
          >
            <p class="text-sm font-semibold text-foreground">Ajouter un événement</p>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="Titre"
              class="w-full rounded-md border border-primary-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
            <div class="grid grid-cols-2 gap-2">
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full rounded-md border border-primary-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
              <input
                v-model="form.time"
                type="time"
                class="w-full rounded-md border border-primary-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
            </div>
            <input
              v-model="form.location"
              type="text"
              placeholder="Lieu (optionnel)"
              class="w-full rounded-md border border-primary-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Note (optionnel)"
              class="w-full rounded-md border border-primary-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <div class="flex justify-between items-center pt-1">
              <Button type="button" variant="secondary" size="sm" class="bg-white text-foreground" :href="api.downloadUrl">
                Exporter .ics
              </Button>
              <Button type="submit" size="sm" class="bg-gradient-to-r from-primary-500 to-emerald-400 text-white border-0">
                Ajouter
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Modal>
</template>

