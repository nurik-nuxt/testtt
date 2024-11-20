import { useLayout } from '~/composable';

export default defineNuxtRouteMiddleware((to, from) => {
    const isAuthenticated = Boolean(useCookie('accessToken').value);
    const { layoutState, onMenuToggle } = useLayout();


    if (to.name === 'index' && isAuthenticated) {
        return navigateTo({ name: 'channels' })
    }

    if (to.name === 'login' || to.name === 'registration' || to.name === 'reset-password' || to.name === 'reset') {
        if (isAuthenticated) {
            return navigateTo({ name: 'index' })
        }
    } else {
        if (! isAuthenticated) {
            return navigateTo({ name: 'login' })
        }
    }


    if ((layoutState.overlayMenuActive.value || layoutState.staticMenuMobileActive.value)) {
        onMenuToggle();
    }
})