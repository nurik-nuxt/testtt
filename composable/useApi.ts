import {$fetch, FetchOptions} from 'ohmyfetch';
import jsCookie from 'js-cookie'
import { useLoaderStore } from "~/src/shared/store/loader";

interface ApiResponse<T = any> {
    status: number;
    data: T;
}

export const useApi = async (uri: string, options: FetchOptions = {}, isLoading: boolean = true) => {
    const loaderStore = useLoaderStore();
    const { apiBaseUrl } = useRuntimeConfig().public;

    if (isLoading) {
        loaderStore.setLoader(true);
    }

    const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + jsCookie.get('token'),
    }

    try {
        const response = await $fetch(apiBaseUrl + uri, {
            ...options,
            headers,
        })
        if (isLoading) {
            loaderStore.setLoader(false);
        }
        return response
    } catch (e) {
        if (isLoading) {
            loaderStore.setLoader(false);
        }
        console.log(e?.response?._data)
        return e?.response?._data
    }
}