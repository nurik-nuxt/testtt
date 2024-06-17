import { $fetch, FetchOptions } from 'ohmyfetch';
import jsCookie from 'js-cookie';
import { useLoaderStore } from "~/src/shared/store/loader";

interface ApiResponse<T = any> {
    status: number;
    data: T;
}

export const useApi = async (uri: string, options: FetchOptions = {}, isLoading: boolean = true, withContentType: boolean = true) => {
    const loaderStore = useLoaderStore();
    const { apiBaseUrl } = useRuntimeConfig().public;

    if (isLoading) {
        loaderStore.setLoader(true);
    }

    // Explicitly define headers type
    const headers: Record<string, string> = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + jsCookie.get('accessToken') || ''
    };

    if (withContentType) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await $fetch(apiBaseUrl + uri, {
            ...options,
            headers,
        });
        if (isLoading) {
            loaderStore.setLoader(false);
        }
        return response;
    } catch (e) {
        if (isLoading) {
            loaderStore.setLoader(false);
        }
        return e?.response?._data;
    }
};
