import { prisma } from '~/server/db/prisma'
import { requireUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const user = await requireUser(event)

    const memberships = await prisma.workspaceMember.findMany({
        where: {
            userId: user.id,
        },
        select: {
            workspaceId: true,
        },
    })

    const workspaceIds = memberships.map((item) => item.workspaceId)

    const projects = await prisma.project.findMany({
        where: {
            workspaceId: {
                in: workspaceIds,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            workspace: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    })

    return {
        success: true,
        data: projects,
    }
})