export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  future: {
    compatibilityVersion: 4,
  },

  css: [
      '~/assets/css/main.css',
  ],

  modules: [
      'vuetify-nuxt-module',
      '@pinia/nuxt',
  ],

  vuetify: {
		moduleOptions: {},
  },

  runtimeConfig: {
		public: {
			baseUrl: '',
		},
  },

  devtools: { enabled: true }
})
