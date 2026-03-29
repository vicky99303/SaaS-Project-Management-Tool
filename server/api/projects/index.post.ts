import { readBody, createError } from 'h3'
import { z } from 'zod'
import { prisma } from '~/server/db/prisma'
import { requireUser } from '~/server/utils/auth'

const createProjectSchema = z.object({
    workspaceId: z.string().min(1),
    name: z.string().min(2, 'Project name is required'),
    description: z.string().optional().nullable(),
})

export default defineEventHandler(async (event) => {
    const user = await requireUser(event)
    const body = await readBody(event)

    const parsed = createProjectSchema.safeParse(body)

    if (!parsed.success) {
        throw createError({
            statusCode: 422,
            statusMessage: parsed.error.issues[0]?.message || 'Validation failed',
        })
    }

    const { workspaceId, name, description } = parsed.data

    const membership = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId,
            userId: user.id,
        },
    })

    if (!membership) {
        throw createError({
            statusCode: 403,
            statusMessage: 'You do not have access to this workspace',
        })
    }

    const project = await prisma.project.create({
        data: {
            workspaceId,
            name,
            description: description || null,
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
        message: 'Project created successfully',
        data: project,
    }
})