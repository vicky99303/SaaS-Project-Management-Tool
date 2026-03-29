export default defineNuxtRouteMiddleware((to) => {
    if (!to.path.startsWith('/dashboard')) {
        return
    }

    const token = useCookie<string | null>('auth_token')

    if (!token.value) {
        return navigateTo('/login')
    }
})