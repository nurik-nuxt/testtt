import type {
    DehydratedState,
    VueQueryPluginOptions,
} from '@tanstack/vue-query';
import {
    VueQueryPlugin,
    QueryClient,
    hydrate,
    dehydrate,
    useQuery,
} from '@tanstack/vue-query';

export default defineNuxtPlugin((nuxtApp) => {
    const vueQueryClient = useState<DehydratedState | null>('vue-query');
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 300 * 1000 } },
    });
    const options: VueQueryPluginOptions = { queryClient };

    nuxtApp.vueApp.use(VueQueryPlugin, options);

    // Nuxt process variable
    if (process.server) {
        nuxtApp.hooks.hook('app:rendered', () => {
            // FIX Cannot stringify arbitrary non-POJOs
            const json = JSON.parse(JSON.stringify(dehydrate(queryClient)));
            vueQueryClient.value = json;
        });
    }

    // Nuxt process variable
    if (process.client) {
        nuxtApp.hooks.hook('app:created', () => {
            hydrate(queryClient, vueQueryClient.value);
        });
    }
});

export const useAppQuery = useQuery;
