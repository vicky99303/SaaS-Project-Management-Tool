type AuthUser = {
    id: string
    name: string
    email: string
}

export const useAuth = () => {
    const user = useState<AuthUser | null>('auth_user', () => null)

    const login = async (payload: { email: string; password: string }) => {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: payload,
            credentials: 'include',
        })
    }

    const register = async (payload: {
        name: string
        email: string
        password: string
        workspaceName: string
    }) => {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: payload,
            credentials: 'include',
        })
    }

    const fetchMe = async () => {
        const headers = process.server ? useRequestHeaders(['cookie']) : undefined

        const response = await $fetch<{
            success: boolean
            data: { user: AuthUser }
        }>('/api/auth/me', {
            headers,
            credentials: 'include',
        })

        user.value = response.data.user
        return response.data.user
    }

    const logout = async () => {
        await $fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        })
        user.value = null
        await navigateTo('/login')
    }

    return {
        user,
        login,
        register,
        fetchMe,
        logout,
    }
}