// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  future: {
    compatibilityVersion: 4,
  },

  css: [
      '~/assets/css/main.css',
  ],

  modules: [
      '@nuxt/ui',
      '@pinia/nuxt',
  ],

  devtools: { enabled: true }
})
