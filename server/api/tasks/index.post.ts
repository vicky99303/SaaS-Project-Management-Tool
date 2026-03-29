import { readBody, createError } from 'h3'
import { z } from 'zod'
import { prisma } from '~/server/db/prisma'
import { requireUser } from '~/server/utils/auth'
import { TaskPriority, TaskStatus } from '~/generated/prisma/client'

const createTaskSchema = z.object({
    projectId: z.string().min(1, 'Project id is required'),
    title: z.string().min(2, 'Task title is required'),
    description: z.string().optional().nullable(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.string().optional(),
})

export default defineEventHandler(async (event) => {
    const user = await requireUser(event)
    const body = await readBody(event)

    const parsed = createTaskSchema.safeParse(body)

    if (!parsed.success) {
        throw createError({
            statusCode: 422,
            statusMessage: parsed.error.issues[0]?.message || 'Validation failed',
        })
    }

    const { projectId, title, description, status, priority, dueDate } = parsed.data

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

    const task = await prisma.task.create({
        data: {
            projectId,
            title,
            description: description || null,
            status: status || TaskStatus.TODO,
            priority: priority || TaskPriority.MEDIUM,
            dueDate: dueDate ? new Date(dueDate) : null,
        },
    })

    return {
        success: true,
        message: 'Task created successfully',
        data: task,
    }
})