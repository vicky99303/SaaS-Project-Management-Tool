type Project = {
    id: string
    workspaceId: string
    name: string
    description?: string | null
    status: 'ACTIVE' | 'ARCHIVED'
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

    const fetchProject = async (id: string) => {
        const headers = process.server ? useRequestHeaders(['cookie']) : undefined

        const response = await $fetch<{
            success: boolean
            data: Project
        }>(`/api/projects/${id}`, {
            headers,
            credentials: 'include',
        })

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

    const updateProject = async (
        id: string,
        payload: {
            name: string
            description?: string
            status?: 'ACTIVE' | 'ARCHIVED'
        }
    ) => {
        const response = await $fetch<{
            success: boolean
            message: string
            data: Project
        }>(`/api/projects/${id}`, {
            method: 'PUT',
            body: payload,
            credentials: 'include',
        })

        await fetchProjects()
        return response.data
    }

    const deleteProject = async (id: string) => {
        const response = await $fetch<{
            success: boolean
            message: string
        }>(`/api/projects/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })

        await fetchProjects()
        return response
    }

    return {
        projects,
        fetchProjects,
        fetchProject,
        createProject,
        updateProject,
        deleteProject,
    }
}