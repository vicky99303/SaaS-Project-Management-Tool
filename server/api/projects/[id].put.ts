import { readBody, createError } from 'h3'
import { z } from 'zod'
import { prisma } from '~/server/db/prisma'
import { requireUser } from '~/server/utils/auth'

const updateProjectSchema = z.object({
    name: z.string().min(2, 'Project name is required'),
    description: z.string().optional().nullable(),
    status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
})

export default defineEventHandler(async (event) => {
    const user = await requireUser(event)
    const projectId = event.context.params?.id
    const body = await readBody(event)

    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Project id is required',
        })
    }

    const parsed = updateProjectSchema.safeParse(body)

    if (!parsed.success) {
        throw createError({
            statusCode: 422,
            statusMessage: parsed.error.issues[0]?.message || 'Validation failed',
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

    const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
            name: parsed.data.name,
            description: parsed.data.description || null,
            status: parsed.data.status || project.status,
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
        message: 'Project updated successfully',
        data: updatedProject,
    }
})