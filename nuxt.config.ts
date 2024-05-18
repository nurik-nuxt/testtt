// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
export default defineNuxtConfig({
    ssr: true,
    app: {
        head: {
            title: '7sales.pro',
            link: [
                {
                    id: 'theme-css',
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: '/themes/aura-light-green/theme.css'
                }
            ]
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
    modules: ['nuxt-primevue'],
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
})
