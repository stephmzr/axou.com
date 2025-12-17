<script setup lang="ts">
useHead({
  titleTemplate: (chunk) => (chunk ? `${chunk} · Nous Deux` : 'Nous Deux · Compteur & stats'),
  meta: [
    { name: 'description', content: 'Compteur de jours, stats et raisons du jour pour célébrer votre couple.' },
    { name: 'theme-color', content: '#c3f6d7' },
  ],
  link: [
    { rel: 'manifest', href: '/manifest.webmanifest' },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-primary-50 via-white to-emerald-50 text-foreground">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <NuxtRouteAnnouncer />
      <NuxtPage />
      <NuxtLoadingIndicator />
    </div>
  </div>
</template>