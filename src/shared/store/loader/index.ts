import { defineStore } from "pinia";

interface Loader {
    loading: boolean;
}
export const useLoaderStore = defineStore('loader', {
    state: (): Loader => ({
        loading: false,
    }),

    getters: {
        getLoading: (state) => state.loading,
    },

    actions: {
        setLoader(isLoading: boolean) {
            this.loading = isLoading
        }
    }
})