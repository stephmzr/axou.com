import { computed, ref } from 'vue'

export function useCoupleStats(initialDate: Date | string) {
  const startDate = ref(new Date(initialDate))
  const msPerDay = 1000 * 60 * 60 * 24
  const today = computed(() => new Date())

  const daysTogether = computed(() =>
    Math.max(0, Math.floor((today.value.getTime() - startDate.value.getTime()) / msPerDay)),
  )
  const monthsTogether = computed(() => Math.floor(daysTogether.value / 30.4375))
  const yearsTogether = computed(() => Math.floor(daysTogether.value / 365.25))

  const milestones = computed(() => {
    const nextRound = Math.max(50, Math.ceil(daysTogether.value / 50) * 50)
    const nextAnniversary = yearsTogether.value + 1
    const daysToNextRound = Math.max(0, nextRound - daysTogether.value)
    const daysToNextAnniversary = Math.max(
      0,
      Math.round(nextAnniversary * 365.25 - daysTogether.value),
    )

    return [
      {
        title: 'Prochain palier',
        value: `${nextRound} jours`,
        caption: `${daysToNextRound} jours avant confettis.`,
      },
      {
        title: `${nextAnniversary}ᵉ anniversaire`,
        value: `${nextAnniversary} ans`,
        caption: `≈${daysToNextAnniversary} jours avant la célébration.`,
      },
      {
        title: 'Temps partagé',
        value: `${monthsTogether.value} mois`,
        caption: `${yearsTogether.value} ans pleins déjà vécus.`,
      },
    ]
  })

  return {
    startDate,
    today,
    daysTogether,
    monthsTogether,
    yearsTogether,
    milestones,
  }
}

