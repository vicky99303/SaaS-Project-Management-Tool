import { getAuthToken, clearAuthCookie } from '~/server/utils/auth'
import { deleteSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
    const token = getAuthToken(event)

    if (token) {
        await deleteSession(token)
    }

    clearAuthCookie(event)

    return {
        success: true,
        message: 'Logged out successfully',
    }
})