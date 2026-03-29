import {
    getCookie,
    setCookie,
    deleteCookie,
    createError,
    type H3Event,
} from 'h3'
import { getSessionByToken } from '~/server/utils/session'

const AUTH_COOKIE = 'auth_token'

export function setAuthCookie(event: H3Event, token: string) {
    setCookie(event, AUTH_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    })
}

export function clearAuthCookie(event: H3Event) {
    deleteCookie(event, AUTH_COOKIE, { path: '/' })
}

export function getAuthToken(event: H3Event) {
    return getCookie(event, AUTH_COOKIE)
}

export async function requireUser(event: H3Event) {
    const token = getAuthToken(event)

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        })
    }

    const session = await getSessionByToken(token)

    if (!session || session.expiresAt < new Date()) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid or expired session',
        })
    }

    return session.user
}