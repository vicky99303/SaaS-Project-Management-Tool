import crypto from 'node:crypto'
import { prisma } from '~/server/db/prisma'

const SESSION_DAYS = 7

export async function createSession(userId: string) {
    const token = crypto.randomBytes(32).toString('hex')

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS)

    return prisma.session.create({
        data: {
            token,
            userId,
            expiresAt,
        },
    })
}

export async function getSessionByToken(token: string) {
    return prisma.session.findUnique({
        where: { token },
        include: { user: true },
    })
}

export async function deleteSession(token: string) {
    return prisma.session.deleteMany({
        where: { token },
    })
}