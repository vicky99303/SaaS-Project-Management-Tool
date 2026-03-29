import { prisma } from '~/server/db/prisma'

export default defineEventHandler(async () => {
    const userCount = await prisma.user.count()

    return {
        success: true,
        users: userCount,
    }
})