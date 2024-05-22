import {defineStore} from "pinia";
import {useApi} from "~/composable";
import jsCookie from 'js-cookie';

interface User {
    _id: string | null;
    email: string | null;
    name: string | null;
}

interface AuthItem {
    access_token?: string;
    refresh_token?: string;
    user: User;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthItem => ({
        user: {
            _id: null,
            email: null,
            name: null
        },
        access_token: undefined,
        refresh_token: undefined
    }),

    actions: {
        async login(form: { email: string, password: string }) {
            try {
                const response = await useApi('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify(form),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const accessTokenExpiryHours = 3 / 24;
                const refreshTokenExpiryDays = 3;

                jsCookie.set('accessToken', response.access_token ?? '', { path: '/', expires: accessTokenExpiryHours });
                jsCookie.set('refreshToken', response.refresh_token ?? '', { path: '/', expires: refreshTokenExpiryDays });
                jsCookie.set('user', JSON.stringify(response.user), { path: '/', expires: refreshTokenExpiryDays });

                return response;
            } catch (e) {
                console.error(e);
            }
        },

        async logout(refresh_token: string) {
            try {
                return await useApi('/auth/logout', {
                    method: 'POST',
                    body: {refresh_token}
                })
            } catch (e) {
                console.log(e)
            }
        }
    }
});

export default useAuthStore;