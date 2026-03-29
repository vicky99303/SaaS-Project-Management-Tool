import { getQuery, createError } from 'h3'
import { prisma } from '~/server/db/prisma'
import { requireUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const user = await requireUser(event)
    const query = getQuery(event)
    const projectId = query.projectId as string

    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Project id is required',
        })
    }

    const project = await prisma.project.findUnique({
        where: { id: projectId },
    })

    if (!project) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Project not found',
        })
    }

    const membership = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: project.workspaceId,
            userId: user.id,
        },
    })

    if (!membership) {
        throw createError({
            statusCode: 403,
            statusMessage: 'You do not have access to this project',
        })
    }

    const tasks = await prisma.task.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
    })

    return {
        success: true,
        data: tasks,
    }
})