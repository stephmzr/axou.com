<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

interface Props {
  reasons?: string[]
  seed?: number
}

const props = withDefaults(defineProps<Props>(), {
  reasons: () => [],
  seed: 0,
})

const currentReasonIndex = ref(
  props.reasons.length ? props.seed % props.reasons.length : 0,
)

const reasonOfTheDay = computed(() => props.reasons[currentReasonIndex.value] ?? '')

const shuffleReason = () => {
  if (!props.reasons.length) return
  const next = Math.floor(Math.random() * props.reasons.length)
  currentReasonIndex.value = next
}
</script>

<template>
  <Card class="border-primary-100/80 bg-white/80 backdrop-blur lg:col-span-2">
    <CardHeader class="pb-3">
      <CardDescription>Raison du jour</CardDescription>
      <CardTitle class="text-2xl text-foreground">Pourquoi je t’aime aujourd’hui</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <p v-if="reasonOfTheDay" class="text-lg leading-relaxed text-foreground">
        {{ reasonOfTheDay }}
      </p>
      <p v-else class="text-sm text-muted-foreground">
        Ajoute des raisons pour commencer la journée en douceur.
      </p>
    </CardContent>
    <CardFooter class="flex justify-between items-center flex">
      <Button
        class="bg-gradient-to-r from-primary-500 to-emerald-400 text-white border-0 shadow-sm ml-auto"
        :disabled="!props.reasons.length"
        @click="shuffleReason"
      >
        Nouvelle raison
      </Button>
    </CardFooter>
  </Card>
</template>

