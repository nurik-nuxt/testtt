export default defineNuxtRouteMiddleware((to, from) => {
    const isAuthenticated = Boolean(useCookie('accessToken').value)

    if (to.name === 'login' || to.name === 'registration' || to.name === 'reset-password') {
        if (isAuthenticated) {
            return navigateTo({ name: 'index' })
        }
    } else {
        if (! isAuthenticated) {
            return navigateTo({ name: 'login' })
        }
    }
})
