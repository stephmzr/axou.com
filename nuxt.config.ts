import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/content', '@nuxt/test-utils', 'shadcn-nuxt', '@vite-pwa/nuxt'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    tmdbApiKey: '388c0ba8eb918cfb64e61631fdfa3ed0',
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Nous Deux - Compteur & stats',
      short_name: 'Nous Deux',
      description: 'Compteur de jours et tableau de bord ludique pour votre couple.',
      theme_color: '#c3f6d7',
      background_color: '#fff7fb',
      display: 'standalone',
      lang: 'fr',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icon-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,txt,woff2}'],
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui'
  }
})