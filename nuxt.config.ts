// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
export default defineNuxtConfig({
    ssr: false,
    app: {
        head: {
            title: '7sales',
            link: [
                {
                    id: 'theme-css',
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: '/themes/aura-light-green/theme.css'
                }
            ],
            meta: [
                {
                    name: "viewport",
                    content:
                        "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=0",
                }
            ]
        }
    },
    nitro: {
        experimental: {
            websocket: true
        }
    },
    typescript: {
        // typeCheck: true,
        tsConfig: {
            compilerOptions: {
                verbatimModuleSyntax: false,
            },
        },
    },
    modules: ['nuxt-primevue', '@nuxtjs/i18n', '@pinia/nuxt', '@nuxtjs/device'],
    i18n: {
        strategy: 'no_prefix',
        defaultLocale: 'ru',
        locales: [
            { code: 'ru', iso: 'ru-RU', name: 'Русский' },
            { code: 'en', iso: 'en-US', name: 'English' },
            { code: 'kz', iso: 'kz-KZ', name: 'Қазақша' },
            { code: 'ar', iso: 'ar-AE', name: 'Arabic' },
            { code: 'de', iso: 'de-DE', name: 'German' },
            { code: 'es', iso: 'es-ES', name: 'Spanish' },
            { code: 'fr', iso: 'fr-FR', name: 'French' },
            { code: 'hi', iso: 'hi-IN', name: 'Hindi',}
        ],
    },
    htmlAttrs: {
        lang: 'ru',
    },
    primevue: {
        options: { ripple: true },
        components: {
            exclude: ['Editor']
        }
    },
    telemetry: false,
    css: ['primeicons/primeicons.css', 'primeflex/primeflex.scss', 'primevue/resources/primevue.min.css','@/assets/css/variables.css', '@/assets/css/index.pcss'],
    imports: {
        autoImport: true,
        dirs: [
            // scan all modules within utils directory
            '/src/shared/utils/**',
        ],
    },
    router: {
        // https://router.vuejs.org/api/interfaces/routeroptions.html
        options: {
            // @ts-expect-error Должно работать :)
            scrollToTop: true,
        },
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.BASE_URL,
            adminBaseUrl: process.env.ADMIN_BASE_URL
        }
    }
})
