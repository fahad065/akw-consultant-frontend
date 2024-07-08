export default defineNuxtConfig({
  devtools: { enabled: true },

  experimental: {
    componentIslands: true
  },

  googleFonts: {
    families: {
      Figtree: true
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables.scss" as *;'
        }
      }
    }
  },

  routeRules: {
    '/': { redirect: '/dashboard' }
  },

  modules: [
    'nuxt-security',
    'nuxt-primevue',
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
    'dayjs-nuxt',
  ],

  security: {
   headers: {
     xFrameOptions: 'SAMEORIGIN',
     contentSecurityPolicy: {
       'img-src': ["'self'", "https:", "http:", "data:", "blob:"],
       // 'script-src': [
       //   "'self'",
       //   "https:"
       // ],
     },
     xXSSProtection: '1; mode=block'
   },
 },

  css: [
    'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    'primeflex/primeflex.css',
    '@/assets/fonts/font-awesome-all.css',
    '@/assets/scss/global.scss'
  ],

  // build: {
  //   transpile: ['primevue']
  // },

  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: {
      name: 'fade',
      mode: 'out-in'
    },
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/ND-Logo.svg' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Figtree&family=Figtree:wght@200;300;400;500;600;700;800&display=swap'
        }
      ]
    }
  },

  auth: {
    baseURL: process.env.NUXT_API_URL,
    globalAppMiddleware: {
      isEnabled: true
    },
    session: {
      enableRefreshOnWindowFocus: false,
      enableRefreshPeriodically: false
    },
    provider: {
      type: 'local',
      pages: {
        login: '/auth/login'
      },
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '', method: 'get' },
        getSession: {
          path: '/profile',
          method: 'get'
        }
      },
      token: {
        signInResponseTokenPointer: '/token',
        maxAgeInSeconds: 60 * 60 * 24
      }
    }
  },

  runtimeConfig: {
    public: {
      apiURL: process.env.NUXT_API_URL
    }
  },

  ssr: false,
  compatibilityDate: '2024-07-07'
});