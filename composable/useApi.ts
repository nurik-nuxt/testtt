import { $fetch, FetchOptions } from 'ohmyfetch';
import jsCookie from 'js-cookie';
import { useLoaderStore } from "~/src/shared/store/loader";
import { useAuthStore } from "~/src/shared/store/auth";

interface ApiResponse<T = any> {
    status: number;
    data: T;
}

export const useApi = async (uri: string, options: FetchOptions = {}, isAdmin: boolean = false, isLoading: boolean = true, withContentType: boolean = true) => {
    const loaderStore = useLoaderStore();
    const authStore = useAuthStore();
    const { apiBaseUrl, adminBaseUrl } = useRuntimeConfig().public;

    if (isLoading) {
        loaderStore.setLoader(true);
    }

    // Explicitly define headers type
    const accessToken = jsCookie.get('supportAccessToken') ? jsCookie.get('supportAccessToken') : jsCookie.get('accessToken') || '';

    const headers: Record<string, string> = {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
    };

    if (withContentType) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await $fetch(`${isAdmin ? adminBaseUrl : apiBaseUrl}${uri}`, {
            ...options,
            headers,
        });
        if (isLoading) {
            loaderStore.setLoader(false);
        }
        return response;
    } catch (e) {
        if (e?.response && e.response.status === 401) {
            try {
                const response = await $fetch(`${apiBaseUrl}/auth/refresh`, {
                    method: 'POST',
                    headers,
                    body: {
                        refresh_token: jsCookie.get('refreshToken')
                    },
                })
                const accessTokenExpiryHours = 3 / 24;
                const refreshTokenExpiryDays = 3;

                jsCookie.set('accessToken', response.access_token ?? '', { path: '/', expires: accessTokenExpiryHours });
                jsCookie.set('refreshToken', response.refresh_token ?? '', { path: '/', expires: refreshTokenExpiryDays });
                authStore.setTokens(response.access_token, response.refresh_token)
                const resp = await $fetch(apiBaseUrl + uri, {
                    ...options,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + response.access_token,
                    },
                });
                if (isLoading) {
                    loaderStore.setLoader(false);
                }
                return resp;
            } catch (e) {
                jsCookie.remove("accessToken");
                jsCookie.remove("refreshToken");
                jsCookie.remove("user");
                // window.location.reload();
            }
        }
        if (isLoading) {
            loaderStore.setLoader(false);
        }
        return e?.response?._data;
    }
};
