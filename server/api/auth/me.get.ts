import { prisma } from '~/server/db/prisma'
import { requireUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const user = await requireUser(event)

    const memberships = await prisma.workspaceMember.findMany({
        where: { userId: user.id },
        include: { workspace: true },
    })

    return {
        success: true,
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            workspaces: memberships.map((item) => ({
                id: item.workspace.id,
                name: item.workspace.name,
                role: item.role,
            })),
        },
    }
})