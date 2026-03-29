import { readBody, createError } from 'h3'
import { z } from 'zod'
import { prisma } from '~/server/db/prisma'
import { hashPassword } from '~/server/utils/hash'
import { createSession } from '~/server/utils/session'
import { setAuthCookie } from '~/server/utils/auth'

import { WorkspaceRole } from '~/generated/prisma/client'

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    workspaceName: z.string().min(2),
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
        throw createError({
            statusCode: 422,
            statusMessage: parsed.error.issues[0]?.message ?? 'Validation failed',
        })
    }

    const { name, email, password, workspaceName } = parsed.data

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Email already registered',
        })
    }

    const hashedPassword = await hashPassword(password)

    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        const workspace = await tx.workspace.create({
            data: {
                name: workspaceName,
                ownerId: user.id,
            },
        })

        await tx.workspaceMember.create({
            data: {
                workspaceId: workspace.id,
                userId: user.id,
                role: WorkspaceRole.OWNER,
            },
        })

        return { user, workspace }
    })

    const session = await createSession(result.user.id)
    setAuthCookie(event, session.token)

    return {
        success: true,
        message: 'Registration successful',
        data: {
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
            },
            workspace: {
                id: result.workspace.id,
                name: result.workspace.name,
            },
        },
    }
})