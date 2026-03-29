type Project = {
    id: string
    workspaceId: string
    name: string
    description?: string | null
    status: string
    createdAt: string
    updatedAt: string
    workspace?: {
        id: string
        name: string
    }
}

export const useProjects = () => {
    const projects = useState<Project[]>('projects', () => [])

    const fetchProjects = async () => {
        const headers = process.server ? useRequestHeaders(['cookie']) : undefined

        const response = await $fetch<{
            success: boolean
            data: Project[]
        }>('/api/projects', {
            headers,
            credentials: 'include',
        })

        projects.value = response.data
        return response.data
    }

    const createProject = async (payload: {
        workspaceId: string
        name: string
        description?: string
    }) => {
        const response = await $fetch<{
            success: boolean
            message: string
            data: Project
        }>('/api/projects', {
            method: 'POST',
            body: payload,
            credentials: 'include',
        })

        await fetchProjects()
        return response.data
    }

    return {
        projects,
        fetchProjects,
        createProject,
    }
}