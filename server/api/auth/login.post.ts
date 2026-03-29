import { readBody, createError } from 'h3'
import { z } from 'zod'
import { prisma } from '~/server/db/prisma'
import { verifyPassword } from '~/server/utils/hash'
import { createSession } from '~/server/utils/session'
import { setAuthCookie } from '~/server/utils/auth'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
        throw createError({
            statusCode: 422,
            statusMessage: parsed.error.issues[0]?.message ?? 'Validation failed',
        })
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid email or password',
        })
    }

    const ok = await verifyPassword(password, user.password)

    if (!ok) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid email or password',
        })
    }

    const session = await createSession(user.id)
    setAuthCookie(event, session.token)

    return {
        success: true,
        message: 'Login successful',
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        },
    }
})